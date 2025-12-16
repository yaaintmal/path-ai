import express from 'express';
import type { Request, Response } from 'express';
import { amberLog, info, loggerError, grayText, amberText } from '#utils';

const router = express.Router();

// Log initialization with current environment config so it's visible when app imports this router
const _useGeminiEnv = process.env.USE_GOOGLE_GEMINI === 'true';
const _defaultProvider = _useGeminiEnv ? 'gemini' : 'ollama';
const _geminiModel = process.env.GEMINI_MODEL_ID || 'gemini-2.5-flash';
const _ollamaModel = process.env.OLLAMA_MODEL || 'llama3-chatqa:latest';
info(
  '[llmRouter] Initialized LLM routes:' +
    grayText(' POST /, POST /generate, GET /') +
    grayText(' | Provider: ') +
    amberText(_defaultProvider) +
    grayText(' | Model: ') +
    amberText(_useGeminiEnv ? _geminiModel : _ollamaModel)
);

// Log effective environment variables for Ollama so it's easy to verify at startup
info('[LLM] env VITE_OLLAMA_API_URL: %s', process.env.VITE_OLLAMA_API_URL ?? '<unset>');
info('[LLM] env VITE_OLLAMA_MODEL: %s', process.env.VITE_OLLAMA_MODEL ?? '<unset>');

interface LLMRequest {
  model?: string;
  prompt: string;
  stream?: boolean;
  provider?: 'ollama' | 'gemini';
}

interface LLMResponse {
  response: string;
}

//  * Calls Google Gemini API to generate content

const callGemini = async (prompt: string): Promise<string> => {
  const apiKey = process.env.GEMINI_API_KEY;
  // Always use Gemini model from env - ignore any model passed from frontend
  const modelId = process.env.GEMINI_MODEL_ID || 'gemini-2.5-flash';

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not configured in server environment');
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${modelId}:generateContent`;

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
      `Gemini API failed: ${response.status} ${response.statusText}${
        errorBody ? ` - ${errorBody}` : ''
      }`
    );
  }

  const data = (await response.json()) as {
    candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
  };

  const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!responseText) {
    throw new Error('Empty response from Gemini API');
  }

  return responseText;
};

//  * Calls local Ollama API to generate content

const callOllama = async (prompt: string, model: string): Promise<string> => {
  // Prefer backend env vars, but fall back to VITE_* variables if set (useful for local dev)
  const ollamaUrl = process.env.VITE_OLLAMA_API_URL;
  // const ollamaUrl = process.env.VITE_OLLAMA_API_URL || 'http://192.168.178.6:11434/api/generate';
  const modelId = process.env.VITE_OLLAMA_MODEL;

  const truncatedPrompt = prompt.length > 200 ? `${prompt.slice(0, 200)}...` : prompt;
  amberLog(
    '[LLM] Ollama request -> URL: %s | model: %s | prompt: "%s"',
    ollamaUrl,
    modelId,
    truncatedPrompt
  );

  const response = await fetch(ollamaUrl!, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ model: modelId, prompt, stream: false }),
  });

  if (!response.ok) {
    const bodyText = await response.text().catch(() => '<unreadable>');
    loggerError(
      '[LLM] Ollama API failed: %s %s - %s',
      String(response.status),
      String(response.statusText),
      bodyText
    );
    throw new Error(`Ollama API failed: ${response.status} ${response.statusText} - ${bodyText}`);
  }

  const raw = await response.text().catch(() => '');
  if (!raw) {
    loggerError('[LLM] Ollama returned empty body');
    throw new Error('Empty body from Ollama API');
  }

  let data: { response?: string } | null = null;
  try {
    data = JSON.parse(raw) as { response?: string };
  } catch (err) {
    loggerError(
      '[LLM] Invalid JSON from Ollama: %s | body=%s',
      err instanceof Error ? err.message : String(err),
      raw
    );
    throw new Error(
      `Invalid JSON from Ollama API: ${err instanceof Error ? err.message : String(err)}`
    );
  }

  if (!data?.response) {
    loggerError('[LLM] Ollama response missing `response` field: %s', JSON.stringify(data));
    throw new Error('Empty response from Ollama API');
  }

  return data.response;
};

/**
 * Handler function to process LLM requests
 */
const handleLLMRequest = async (req: Request, res: Response): Promise<void> => {
  try {
    const { prompt, model, provider, stream } = req.body as LLMRequest;

    if (!prompt || typeof prompt !== 'string') {
      res.status(400).json({ error: 'prompt is required and must be a string' });
      return;
    }

    // Determine which provider to use
    const useGemini = provider === 'gemini' || process.env.USE_GOOGLE_GEMINI === 'true';

    console.log(
      grayText('[LLM] Processing request with provider: ') +
        amberText(useGemini ? 'gemini' : 'ollama') +
        grayText(`, stream: ${stream || false}`)
    );

    let responseText: string;

    try {
      if (useGemini) {
        responseText = await callGemini(prompt);
      } else {
        responseText = await callOllama(prompt, model || '');
      }
    } catch (providerError) {
      loggerError(`[LLM] ${useGemini ? 'Gemini' : 'Ollama'} error:`, providerError as unknown);
      throw providerError;
    }

    const result: LLMResponse = { response: responseText };
    res.json(result);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    loggerError('[LLM] Error:', errorMessage as unknown);
    res.status(500).json({ error: errorMessage });
  }
};

/**
 * POST /api/llm
 * Universal LLM endpoint that proxies to either Gemini or Ollama
 */
router.post('/', (req: Request, res: Response) => {
  info('[llmRouter] POST / received');
  return handleLLMRequest(req, res);
});

/**
 * POST /api/llm/generate
 * Alias endpoint for /api/llm (for backwards compatibility)
 */
router.post('/generate', (req: Request, res: Response) => {
  info('[llmRouter] POST /generate received');
  return handleLLMRequest(req, res);
});

/**
 * GET /api/llm
 * Provides quick status/info about configured LLM provider and model
 */
router.get('/', (req: Request, res: Response) => {
  info('[llmRouter] GET / requested');
  const useGemini = process.env.USE_GOOGLE_GEMINI === 'true';
  const model = useGemini
    ? process.env.GEMINI_MODEL_ID || 'gemini-2.5-flash'
    : process.env.OLLAMA_MODEL || 'llama3-chatqa:latest';
  return res.json({ provider: useGemini ? 'gemini' : 'ollama', model });
});

/**
 * GET /api/llm/route
 * Returns route information + provider model
 */
router.get('/route', (req: Request, res: Response) => {
  info('[llmRouter] GET /route requested');
  const useGemini = process.env.USE_GOOGLE_GEMINI === 'true';
  const model = useGemini
    ? process.env.GEMINI_MODEL_ID || 'gemini-2.5-flash'
    : process.env.OLLAMA_MODEL || 'llama3-chatqa:latest';
  return res.json({
    provider: useGemini ? 'gemini' : 'ollama',
    model,
    routes: ['/api/llm [POST]', '/api/llm/generate [POST]', '/api/llm/route [GET]'],
  });
});

export default router;
