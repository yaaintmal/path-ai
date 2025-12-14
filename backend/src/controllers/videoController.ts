import type { RequestHandler } from 'express';
import { Video } from '#models';
import type { VideoInputDTO, VideoDTO, VideoUpdateInputDTO } from '#schemas';
import type { MessageResponse } from '#types';
import {
  deleteFromStorage,
  computeEtagForFile,
  buildPublicUrl,
  normalizeTranscription,
  transcribeVideoFromUrl,
  translateTextWithGemini,
  mapLanguageToBcp47,
  buildCuesFromWords,
  buildWebVttFromCues,
  type WordTiming,
  serializeVideo,
  findExistingVideoWithOptionalTranslation,
  translateCuesPreserveTimings,
} from '#utils';

// For local storage we compute an etag (sha256) for the uploaded file; for cloudinary the existing flow remains
// (compute via admin API/HEAD). We compute etag inline in `createVideo` depending on the configured storage driver.

export const createVideo: RequestHandler<
  unknown,
  VideoDTO | MessageResponse,
  VideoInputDTO
> = async (req, res) => {
  const { videoUrl: bodyVideoUrl, targetLanguage } = req.body;
  const uploadedFile = req.file as Express.Multer.File | undefined;
  const uploadedVideoPath = uploadedFile?.path;
  const uploadedFilename = uploadedFile?.filename;
  const isLocal = process.env.STORAGE_DRIVER === 'local';
  let videoUrl = bodyVideoUrl;
  const targetLanguageBcp47 = targetLanguage ? mapLanguageToBcp47(targetLanguage) : undefined;
  let uploadedEtag: string | undefined = undefined;
  if (uploadedFile) {
    if (isLocal && uploadedFile.path) {
      // compute etag from file contents
      uploadedEtag = await computeEtagForFile(uploadedFile.path as string);
      // use server public URL for processing (transcription)
      videoUrl = buildPublicUrl(uploadedFile.filename as string);
    } else if (!isLocal) {
      // For cloudinary, try to get etag via HEAD request as a fallback
      try {
        const headResp = await fetch(uploadedFile.path as string, { method: 'HEAD' });
        const headerEtag = headResp.headers.get('etag');
        if (headerEtag) uploadedEtag = headerEtag.replace(/"/g, '');
      } catch {
        // ignore
      }
      videoUrl = uploadedFile.path || bodyVideoUrl;
    }
    // Log upload info for debugging/observability
    try {
      const displayName = uploadedFilename || uploadedFile.originalname || 'unknown-file';
      const link = videoUrl || uploadedFile.path || displayName;
      console.log(
        `[Videos] Upload received (${process.env.STORAGE_DRIVER || 'cloudinary'}): ${displayName} -> ${link}`
      );
    } catch (err) {
      console.warn('Failed to log uploaded file info', err);
    }
  }

  if (!videoUrl) {
    return res.status(400).json({ message: 'Video URL or file is required' });
  }

  try {
    const existingVideo = await findExistingVideoWithOptionalTranslation(
      videoUrl,
      targetLanguageBcp47,
      uploadedEtag
    );
    if (existingVideo) {
      if (uploadedFilename && existingVideo.videoPublicId !== uploadedFilename) {
        await deleteFromStorage(uploadedFilename);
      }
      return res.status(200).json(serializeVideo(existingVideo));
    }
  } catch (err) {
    console.error('Failed to reuse existing video', err);
    return res.status(502).json({ message: 'Failed to translate video' });
  }

  let closedCaptionText = '';
  let detectedLanguageBcp47 = mapLanguageToBcp47();
  let closedCaptionVtt = '';
  let cuesForTranslation: ReturnType<typeof buildCuesFromWords> = [];
  const translations: { name: string; closedCaptionVtt?: string }[] = [];

  try {
    const transcription = await transcribeVideoFromUrl(videoUrl, { languageCode: null });
    const normalized = normalizeTranscription(transcription);
    closedCaptionText = normalized.text;
    detectedLanguageBcp47 = mapLanguageToBcp47(normalized.languageCode);
    if (normalized.words?.length) {
      const timedWords = normalized.words.filter(
        (w): w is WordTiming => w.start !== undefined && w.end !== undefined
      );
      if (timedWords.length) {
        cuesForTranslation = buildCuesFromWords(timedWords);
        closedCaptionVtt = buildWebVttFromCues(cuesForTranslation);
      }
    }
  } catch (err) {
    await deleteFromStorage(uploadedFilename);
    console.error('Failed to transcribe video', err);
    return res.status(502).json({ message: 'Failed to transcribe video' });
  }

  if (targetLanguageBcp47) {
    try {
      if (cuesForTranslation.length) {
        const { translatedVtt } = await translateCuesPreserveTimings(
          cuesForTranslation,
          targetLanguageBcp47
        );
        translations.push({
          name: targetLanguageBcp47,
          closedCaptionVtt: translatedVtt,
        });
      } else {
        await translateTextWithGemini(closedCaptionText, targetLanguageBcp47);
        translations.push({ name: targetLanguageBcp47, closedCaptionVtt: '' });
      }
    } catch (err) {
      await deleteFromStorage(uploadedFilename);
      console.error('Failed to translate video', err);
      return res.status(502).json({ message: 'Failed to translate video' });
    }
  }

  const video = await Video.create({
    videoUrl,
    videoPublicId: isLocal ? undefined : uploadedFilename,
    storagePath: isLocal ? uploadedFilename : undefined,
    etag: uploadedEtag ?? undefined,
    originalLanguage: {
      name: detectedLanguageBcp47,
      closedCaptionText,
      closedCaptionVtt,
    },
    translations,
  });

  res.status(201).json({
    ...serializeVideo(video),
  });
};

export const getAllVideos: RequestHandler<unknown, VideoDTO[] | MessageResponse, unknown> = async (
  _req,
  res
) => {
  const videos = await Video.find();
  res.status(200).json(videos.map((video) => serializeVideo(video)));
};

export const getVideoById: RequestHandler<
  { id: string },
  VideoDTO | MessageResponse,
  unknown
> = async (req, res) => {
  const { id } = req.params;

  const video = await Video.findById(id);

  if (!video) {
    return res.status(404).json({ message: `No video with id: ${id} found!` });
  }

  res.status(200).json({
    ...serializeVideo(video),
  });
};

export const updateVideo: RequestHandler<
  { id: string },
  VideoDTO | MessageResponse,
  VideoUpdateInputDTO
> = async (req, res) => {
  const { id } = req.params;
  const { translations } = req.body;

  const video = await Video.findByIdAndUpdate(
    id,
    { $set: { translations } },
    { new: true, runValidators: true }
  );

  if (!video) return res.status(404).json({ message: `No video with id: ${id} found!` });

  res.json({
    ...serializeVideo(video),
  });
};

export const deleteVideo: RequestHandler<{ id: string }, MessageResponse, unknown> = async (
  req,
  res
) => {
  const { id } = req.params;
  const video = await Video.findById(id);

  if (!video) {
    return res.status(404).json({ message: `No video with id: ${id} found!` });
  }

  await deleteFromStorage(
    (video as any).videoPublicId || (video as any).storagePath || video.videoUrl
  );
  await video.deleteOne();

  res.status(200).json({ message: 'Video deleted successfully' });
};

export const deleteAllVideos: RequestHandler<unknown, MessageResponse, unknown> = async (
  _req,
  res
) => {
  const videos = await Video.find();

  await Promise.all(
    videos.map((video) =>
      deleteFromStorage(
        (video as any).videoPublicId || (video as any).storagePath || video.videoUrl
      )
    )
  );
  await Video.deleteMany({});

  res.status(200).json({ message: 'All videos deleted successfully' });
};
