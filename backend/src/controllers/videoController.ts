import type { RequestHandler } from 'express';
import { Video } from '#models';
import type { VideoInputDTO, VideoDTO, VideoUpdateInputDTO } from '#schemas';
import type { MessageResponse } from '#types';
import {
  deleteFromCloudinary,
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
import { cloudinaryClient } from '#middleware';

const fetchEtagForUpload = async (publicId?: string, videoUrl?: string | null) => {
  if (!publicId) return undefined;

  // Prefer Cloudinary Admin API (authoritative).
  try {
    const resource = (await cloudinaryClient.api.resource(publicId, {
      resource_type: 'video',
      type: 'upload',
    })) as { etag?: string } | undefined;
    if (resource?.etag) return resource.etag;
  } catch (err) {
    console.warn('Unable to fetch Cloudinary etag via admin API', err);
  }

  // Fallback: HEAD request to the asset URL (public Cloudinary URLs include an ETag header).
  if (videoUrl) {
    try {
      const response = await fetch(videoUrl, { method: 'HEAD' });
      const headerEtag = response.headers.get('etag');
      if (headerEtag) return headerEtag.replace(/"/g, '');
    } catch (err) {
      console.warn('Unable to fetch Cloudinary etag via HEAD request', err);
    }
  }

  return undefined;
};

export const createVideo: RequestHandler<
  unknown,
  VideoDTO | MessageResponse,
  VideoInputDTO
> = async (req, res) => {
  const { videoUrl: bodyVideoUrl, targetLanguage } = req.body;
  const uploadedFile = req.file as Express.Multer.File | undefined;
  const uploadedVideoUrl = uploadedFile?.path;
  const uploadedPublicId = uploadedFile?.filename;
  const videoUrl = uploadedVideoUrl ?? bodyVideoUrl;
  const targetLanguageBcp47 = targetLanguage ? mapLanguageToBcp47(targetLanguage) : undefined;
  const uploadedEtag = uploadedPublicId
    ? await fetchEtagForUpload(uploadedPublicId, videoUrl)
    : undefined;

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
      if (uploadedPublicId && existingVideo.videoPublicId !== uploadedPublicId) {
        await deleteFromCloudinary(uploadedPublicId);
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
    await deleteFromCloudinary(uploadedPublicId);
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
      await deleteFromCloudinary(uploadedPublicId);
      console.error('Failed to translate video', err);
      return res.status(502).json({ message: 'Failed to translate video' });
    }
  }

  const video = await Video.create({
    videoUrl,
    videoPublicId: uploadedPublicId,
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

  await deleteFromCloudinary(video.videoPublicId);
  await video.deleteOne();

  res.status(200).json({ message: 'Video deleted successfully' });
};

export const deleteAllVideos: RequestHandler<unknown, MessageResponse, unknown> = async (
  _req,
  res
) => {
  const videos = await Video.find();

  await Promise.all(videos.map((video) => deleteFromCloudinary(video.videoPublicId)));
  await Video.deleteMany({});

  res.status(200).json({ message: 'All videos deleted successfully' });
};
