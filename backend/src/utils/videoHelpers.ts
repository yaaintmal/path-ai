import type { VideoDTO } from '#schemas';
import type { VideoType } from '#types';
import { cloudinaryClient } from '#middleware';
import { Video } from '#models';
import translateTextWithGemini from './translate.ts';
import { parseWebVttToCues, buildWebVttFromCues, type WebvttCue } from './webvtt.ts';
import mapLanguageToBcp47 from './language.ts';

type VideoDoc = VideoType & { _id: { toString(): string } };

export const serializeVideo = (video: VideoDoc): VideoDTO => ({
  id: video._id.toString(),
  videoUrl: video.videoUrl,
  originalLanguage: {
    name: video.originalLanguage.name,
    closedCaptionText: video.originalLanguage.closedCaptionText ?? '',
    closedCaptionVtt: video.originalLanguage.closedCaptionVtt ?? '',
  },
  translations: video.translations.map((t) => ({
    name: t.name,
    closedCaptionVtt: t.closedCaptionVtt ?? '',
  })),
});

export const extractCloudinaryPublicId = (url?: string | null): string | null => {
  if (!url) return null;
  try {
    const utils = cloudinaryClient.utils as { extractPublicId?: (u: string) => string };
    return utils.extractPublicId ? utils.extractPublicId(url) : null;
  } catch {
    return null;
  }
};

export const translateCuesPreserveTimings = async (cues: WebvttCue[], targetLanguage: string) => {
  if (!cues.length) return { translatedCues: [], translatedText: '', translatedVtt: '' };

  const apiKey = process.env.GEMINI_API_KEY;
  const modelId = process.env.GEMINI_MODEL_ID ?? 'gemini-1.5-flash-latest';
  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent`;
  const payloadLines = cues.map((c) => c.text ?? '').join('\n');
  const prompt = `Translate each subtitle line into ${targetLanguage}. Preserve the exact number of lines (${cues.length}) and their order. If a line is blank, return a blank line in the same position. Return ONLY the translated lines, one per line, no numbering, timestamps, or extra text.\n\n${payloadLines}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(
      `Gemini translation failed: ${response.status} ${response.statusText}${
        errorBody ? ` - ${errorBody}` : ''
      }`
    );
  }

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };

  const translatedRaw =
    data.candidates?.[0]?.content?.parts?.map((p) => p.text ?? '').join('') ?? '';
  const translatedLinesRaw = translatedRaw.split(/\r?\n/);
  const translatedLines = translatedLinesRaw.map((l) => l.trim());

  // Ensure line count matches cues count
  while (translatedLines.length < cues.length) {
    translatedLines.push(cues[translatedLines.length]?.text ?? '');
  }
  if (translatedLines.length > cues.length) {
    translatedLines.length = cues.length;
  }

  const translatedCues = cues.map((cue, idx) => ({
    ...cue,
    text: translatedLines[idx] ?? cue.text,
  }));

  const translatedText = translatedCues.map((c) => c.text).join(' ');
  const translatedVtt = buildWebVttFromCues(translatedCues);

  return { translatedCues, translatedText, translatedVtt };
};

export const translateVttPreserveTimings = async (
  vtt: string,
  targetLanguage: string,
  fallbackText: string
) => {
  const cues = vtt ? parseWebVttToCues(vtt) : [];
  if (!cues.length) {
    const translatedText = await translateTextWithGemini(fallbackText ?? '', targetLanguage);
    return { translatedText, translatedVtt: '' };
  }

  return translateCuesPreserveTimings(cues, targetLanguage);
};

export const findExistingVideoWithOptionalTranslation = async (
  videoUrl: string,
  targetLanguage?: string,
  etag?: string | null
): Promise<VideoDoc | null> => {
  const normalizedEtag = etag?.trim() || undefined;

  const existingByEtag = normalizedEtag ? await Video.findOne({ etag: normalizedEtag }) : null;
  const targetLanguageBcp47 = targetLanguage ? mapLanguageToBcp47(targetLanguage) : undefined;
  const existingPublicId = extractCloudinaryPublicId(videoUrl);

  const existingVideo =
    existingByEtag ??
    (existingPublicId ? await Video.findOne({ videoPublicId: existingPublicId }) : null) ??
    (await Video.findOne({ videoUrl }));

  // Backfill etag on an existing record if we learned it from the current upload.
  if (existingVideo && normalizedEtag && !existingVideo.etag) {
    existingVideo.etag = normalizedEtag;
    await existingVideo.save();
  }

  if (!existingVideo) return null;

  if (targetLanguageBcp47) {
    const hasTranslation = existingVideo.translations.some(
      (t) => mapLanguageToBcp47(t.name) === targetLanguageBcp47
    );
    if (!hasTranslation) {
      const { translatedVtt } = await translateVttPreserveTimings(
        existingVideo.originalLanguage.closedCaptionVtt ?? '',
        targetLanguageBcp47,
        existingVideo.originalLanguage.closedCaptionText ?? ''
      );

      existingVideo.translations.push({
        name: targetLanguageBcp47,
        closedCaptionVtt: translatedVtt ?? '',
      });
      await existingVideo.save();
    }
  }

  return existingVideo as VideoDoc;
};

export default serializeVideo;
