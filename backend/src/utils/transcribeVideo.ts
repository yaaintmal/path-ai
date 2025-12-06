import { ElevenLabsClient } from '@elevenlabs/elevenlabs-js';

type SpeechToTextResponse = Awaited<ReturnType<ElevenLabsClient['speechToText']['convert']>>;
export type NormalizedTranscription = {
  text: string;
  languageCode?: string;
  words?: Array<{
    text: string;
    start?: number;
    end?: number;
    type?: string;
  }>;
};

let elevenlabsClient: ElevenLabsClient | null = null;

const getElevenLabsClient = () => {
  const apiKey = process.env.ELEVENLABS_API_KEY;

  if (!apiKey) {
    throw new Error('ELEVENLABS_API_KEY is not configured');
  }

  if (!elevenlabsClient) {
    elevenlabsClient = new ElevenLabsClient({ apiKey });
  }

  return elevenlabsClient;
};

const transcribeVideoFromUrl = async (
  videoUrl: string,
  options?: { languageCode?: string | null }
): Promise<SpeechToTextResponse> => {
  const elevenLabs = getElevenLabsClient();
  const { languageCode } = options ?? {};

  const videoResponse = await fetch(videoUrl);

  if (!videoResponse.ok) {
    throw new Error(`Failed to fetch video. Received status ${videoResponse.status}`);
  }

  const contentType = videoResponse.headers.get('content-type') ?? 'application/octet-stream';
  const videoBlob = new Blob([await videoResponse.arrayBuffer()], { type: contentType });

  const transcription = await elevenLabs.speechToText.convert({
    file: videoBlob,
    modelId: 'scribe_v1',
    tagAudioEvents: true,
    languageCode: languageCode ?? undefined,
    diarize: true,
  });

  return transcription;
};

export const normalizeTranscription = (
  transcription: SpeechToTextResponse
): NormalizedTranscription => {
  if ('text' in transcription) {
    return {
      text: transcription.text,
      languageCode: transcription.languageCode,
      words: transcription.words,
    };
  }

  if ('transcripts' in transcription) {
    const text = transcription.transcripts.map((t) => t.text).join('\n');
    const languageCode = transcription.transcripts[0]?.languageCode;
    const words = transcription.transcripts.flatMap((t) => t.words ?? []);
    return { text, languageCode, words };
  }

  if ('message' in transcription) {
    throw new Error('Transcription deferred to webhook');
  }

  throw new Error('Unexpected transcription response format');
};

export default transcribeVideoFromUrl;
