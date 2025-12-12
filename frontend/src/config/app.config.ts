/**
 * Central configuration management for frontend environment variables
 * All environment variables should be accessed through this file
 */

interface AppConfig {
  api: {
    baseUrl: string;
  };
  ollama: {
    apiUrl: string;
    model: string;
    language: string;
  };
  llm: {
    useGoogleGemini: boolean;
    proxyUrl: string;
  };
  app: {
    name: string;
    logLevel: 'debug' | 'info' | 'warn' | 'error';
  };
  features: {
    debugMode: boolean;
    mockApi: boolean;
    useStoreApi: boolean;
  };
}

function getEnvVariable(key: string, defaultValue: string = ''): string {
  const value = import.meta.env[key];
  if (!value && !defaultValue) {
    console.warn(`Environment variable ${key} is not set`);
    return '';
  }
  return value || defaultValue;
}

function getEnvBoolean(key: string, defaultValue: boolean = false): boolean {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1' || value === true;
}

export const config: AppConfig = {
  api: {
    baseUrl: getEnvVariable('VITE_API_URL', 'http://localhost:3000'),
  },
  ollama: {
    apiUrl: getEnvVariable('VITE_OLLAMA_API_URL', 'http://localhost:11434/api/generate'),
    model: getEnvVariable('VITE_OLLAMA_MODEL', 'llama3-chatqa:latest'),
    language: getEnvVariable('VITE_OLLAMA_LANGUAGE', 'english'),
  },
  llm: {
    useGoogleGemini: getEnvBoolean('VITE_USE_GOOGLE_GEMINI', false),
    proxyUrl: getEnvVariable('VITE_LLM_PROXY_URL', 'http://localhost:3000/api/llm/generate'),
  },
  app: {
    name: getEnvVariable('VITE_APP_NAME', 'Path AI'),
    logLevel: getEnvVariable('VITE_LOG_LEVEL', 'info') as 'debug' | 'info' | 'warn' | 'error',
  },
  features: {
    debugMode: getEnvBoolean('VITE_ENABLE_DEBUG_MODE', false),
    mockApi: getEnvBoolean('VITE_ENABLE_MOCK_API', false),
    useStoreApi: getEnvBoolean('VITE_USE_STORE_API', false),
  },
};

/**
 * Helper function to construct API URLs
 */
export function getApiUrl(endpoint: string): string {
  const baseUrl = config.api.baseUrl.replace(/\/$/, '');
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${path}`;
}

/**
 * Helper function for logging based on log level
 */
export function log(
  level: 'debug' | 'info' | 'warn' | 'error',
  message: string,
  data?: unknown
): void {
  const levels = { debug: 0, info: 1, warn: 2, error: 3 };
  if (levels[level] >= levels[config.app.logLevel]) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;

    if (data !== undefined) {
      console[level](prefix, message, data);
    } else {
      console[level](prefix, message);
    }
  }
}

// Validate critical configuration on app load
function validateConfig(): void {
  if (!config.api.baseUrl) {
    console.error('Critical: VITE_API_URL is not configured');
  }
  if (config.llm.useGoogleGemini) {
    console.info('[Config] LLM Provider: Google Gemini');
  } else {
    console.info('[Config] LLM Provider: Local Ollama');
  }
  if (config.features.debugMode) {
    log('debug', 'Debug mode enabled');
    log('debug', 'Configuration loaded', config);
  }
}

// Run validation on module load
validateConfig();

export default config;
