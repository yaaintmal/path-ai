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
    enableSignup: boolean;
  };
}

/**
 * Get environment variable from Vite's import.meta.env
 * In Vite, all VITE_* prefixed variables are automatically loaded
 */
function getEnvVariable(key: string, defaultValue: string = ''): string {
  try {
    // Vite injects env variables into import.meta.env at build/dev time
    const value = (import.meta.env as Record<string, unknown>)[key];
    if (value !== undefined && value !== null) {
      return String(value);
    }
  } catch {
    // Fallback for non-Vite environments (tests, SSR, etc)
  }

  // Try process.env as fallback (for Node.js/Jest environments)
  const maybeProc = (globalThis as unknown as { process?: { env?: Record<string, string> } })
    .process;
  if (maybeProc && maybeProc.env) {
    const value = maybeProc.env[key];
    if (value !== undefined && value !== null) {
      return String(value);
    }
  }

  if (!defaultValue) {
    console.warn(`Environment variable ${key} is not set, using default: ${defaultValue}`);
  }
  return defaultValue;
}

function getEnvBoolean(key: string, defaultValue: boolean = false): boolean {
  const value = getEnvVariable(key, '');
  if (!value) return defaultValue;
  return value === 'true' || value === '1';
}

export const config: AppConfig = {
  api: {
    baseUrl: getEnvVariable('VITE_API_URL', 'http://localhost:3015'),
  },
  ollama: {
    apiUrl: getEnvVariable('VITE_OLLAMA_API_URL', 'http://localhost:11434/api/generate'),
    model: getEnvVariable('VITE_OLLAMA_MODEL', 'ministral-3'),
    language: getEnvVariable('VITE_OLLAMA_LANGUAGE', 'english'),
  },
  llm: {
    useGoogleGemini: getEnvBoolean('VITE_USE_GOOGLE_GEMINI', false),
    proxyUrl: getEnvVariable('VITE_LLM_PROXY_URL', 'http://localhost:3015/api/llm/generate'),
  },
  app: {
    name: getEnvVariable('VITE_APP_NAME', 'Path AI'),
    logLevel: getEnvVariable('VITE_LOG_LEVEL', 'info') as 'debug' | 'info' | 'warn' | 'error',
  },
  features: {
    debugMode: getEnvBoolean('VITE_ENABLE_DEBUG_MODE', false),
    enableSignup: getEnvBoolean('VITE_ENABLE_SIGNUP', false),
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

  // Debug LAN access
  if (typeof window !== 'undefined') {
    console.log('[Config] Window location:', window.location.href);
    console.log('[Config] Computed API baseUrl:', config.api.baseUrl);
    console.log('[Config] VITE_API_URL env:', getEnvVariable('VITE_API_URL'));
  }
}

// Run validation on module load
validateConfig();

export default config;
