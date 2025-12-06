export const translateTextWithGemini = async (
  text: string,
  targetLanguage: string
): Promise<string> => {
  const apiKey = process.env.GEMINI_API_KEY;
  const modelId = process.env.GEMINI_MODEL_ID ?? 'gemini-1.5-flash-latest';

  if (!apiKey) throw new Error('GEMINI_API_KEY is not configured');
  if (!targetLanguage) throw new Error('targetLanguage is required for translation');

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent`;

  const prompt = `
You are translating a WEBVTT subtitle file.
Translate ONLY the spoken text into ${targetLanguage}.

IMPORTANT RULES:
- Keep timestamps exactly as they are.
- Keep numbering exactly as they are.
- Keep all line breaks.
- Keep cue structure untouched.
- DO NOT add or remove any text besides the translation.
- DO NOT add ANY explanations or preamble.
- Output ONLY the translated VTT file.

WEBVTT content below:

${text}
`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-goog-api-key': apiKey,
    },
    body: JSON.stringify({
      contents: [
        {
          role: 'user',
          parts: [{ text: prompt }],
        },
      ],
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

  const translation = data.candidates?.[0]?.content?.parts
    ?.map((p) => p.text ?? '')
    .join('')
    .trim();

  if (!translation) {
    throw new Error('Empty translation returned from Gemini');
  }

  return translation;
};

export default translateTextWithGemini;
