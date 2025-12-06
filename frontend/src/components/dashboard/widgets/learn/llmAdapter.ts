import { config } from '../../../../config/app.config';

export interface LLMGenerateRequest {
  model?: string;
  prompt: string;
  stream?: boolean;
  provider?: 'ollama' | 'gemini';
}

export interface LLMGenerateResponse {
  response: string;
}

/**
 * Universal LLM adapter that calls the backend proxy endpoint.
 * The proxy will route to either Gemini or Ollama based on configuration.
 *
 * This keeps API keys secure on the backend and provides a single
 * unified interface for LLM generation across the app.
 */
export const generate = async (
  prompt: string,
  model?: string,
  provider?: 'ollama' | 'gemini'
): Promise<LLMGenerateResponse> => {
  const url = config.llm.proxyUrl;
  const selectedProvider = provider || (config.llm.useGoogleGemini ? 'gemini' : 'ollama');

  console.log(`[LLMAdapter] Calling ${selectedProvider} via proxy: ${url}`);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        provider: selectedProvider,
      } as LLMGenerateRequest),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`LLM proxy failed: ${response.status} - ${errorText || response.statusText}`);
    }

    const data = (await response.json()) as LLMGenerateResponse;

    if (!data.response) {
      throw new Error('Empty response from LLM proxy');
    }

    return data;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('[LLMAdapter] Error:', errorMessage);
    throw error;
  }
};
