import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { errorHandler, notFoundHandler } from '#middleware';
import '#db';
import {
  userRouter,
  videoRouter,
  storeRouter,
  llmRouter,
  changelogRouter,
  authRouter,
  timerRouter,
  interactionRouter,
  adminRouter,
} from '#routers';
import path from 'path';
import { User } from '#models';
import { amberLog, success, info, loggerError, grayText, amberText, greenText } from '#utils';

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

// Middleware
app.use(express.json());
// cookie parser (for refreshToken cookie)
app.use(cookieParser());

// Enable CORS with explicit whitelist
// CORS_ORIGIN can be a comma-separated list; defaults include localhost and common preview ports
const rawCors =
  process.env.CORS_ORIGIN ||
  [
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'http://localhost:4173',
    'http://127.0.0.1:4173',
    'http://192.168.178.22:5173',
    'http://192.168.178.22:4173',
    'https://localhost:5173',
    'https://127.0.0.1:5173',
    'https://localhost:4173',
    'https://127.0.0.1:4173',
    'https://192.168.178.22:5173',
    'https://192.168.178.22:4173',
  ].join(',');
const allowedOrigins = Array.from(
  new Set(
    rawCors
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  )
);

// Configure CORS with explicit preflight handling
const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    const originLabel = origin ?? '<no-origin>';
    // Allow non-browser requests (no origin) such as curl or server-to-server
    if (!origin) {
      info('[CORS] Allowing request with no origin (likely curl/server)');
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      amberLog('[CORS] Allowed origin %s', originLabel);
      return callback(null, true);
    }
    loggerError('[CORS] Blocked origin %s (allowed: %s)', originLabel, allowedOrigins.join(', '));
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200, // some legacy browsers choke on 204
};

// Enable CORS for all routes. Express 5/path-to-regexp no longer supports '*' as a route,
// so we use a regex to ensure all preflight OPTIONS requests are handled.
app.options(/.*/, cors(corsOptions));
app.use(cors(corsOptions));

// Routes
console.log(grayText('[App] Registering routes...'));
// Serve uploaded files (used when STORAGE_DRIVER=local)
const uploadsDir = process.env.UPLOADS_DIR || path.join(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsDir));

// Simple health check (useful for LAN debugging)
app.get('/api/health', (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

app.use('/api/users', userRouter);
app.use('/api/videos', videoRouter);
app.use('/api/store', storeRouter);
app.use('/api/llm', llmRouter);
app.use('/api/changelog', changelogRouter);
app.use('/api/auth', authRouter);
app.use('/api/timer', timerRouter);
app.use('/api/interactions', interactionRouter);
app.use('/api/admin', adminRouter);
// Also expose a top-level discovery route that returns LLM provider/model info
app.get('/api/llm-route', (_req, res) => {
  const useGemini = process.env.USE_GOOGLE_GEMINI === 'true';
  const model = useGemini
    ? process.env.GEMINI_MODEL_ID || 'gemini-2.5-flash'
    : process.env.OLLAMA_MODEL || 'llama3-chatqa:latest';
  res.json({
    provider: useGemini ? 'gemini' : 'ollama',
    model,
    routes: ['/api/llm [POST]', '/api/llm/generate [POST]', '/api/llm/route [GET]'],
  });
});
console.log(
  grayText('[App] LLM routes: ') + amberText('/api/llm [GET, POST], /api/llm/generate [POST]')
);
console.log(grayText('[App] Routes registered ') + greenText('successfully'));

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// Start server; bind to 0.0.0.0 so it's reachable from other devices on the LAN
app.listen(PORT, '0.0.0.0', () => {
  console.log(grayText('Server is running on port ') + amberText(String(PORT)));
  console.log(grayText(`Environment: ${process.env.NODE_ENV || 'development'}`));

  // Log LLM provider configuration
  const useGemini = process.env.USE_GOOGLE_GEMINI === 'true';
  const llmProvider = useGemini ? 'Google Gemini' : 'Local Ollama';
  console.log(grayText('[LLM] Provider: ') + amberText(llmProvider));
  if (useGemini) {
    const geminiModel = process.env.GEMINI_MODEL_ID || 'gemini-2.5-flash';
    console.log(grayText('[LLM] Gemini Model: ') + amberText(geminiModel));
    if (!process.env.GEMINI_API_KEY) {
      loggerError('[LLM] WARNING: GEMINI_API_KEY is not configured!');
    }
  } else {
    const ollamaUrl = process.env.OLLAMA_API_URL || 'http://localhost:11434/api/generate';
    const ollamaModel = process.env.OLLAMA_MODEL || 'llama3-chatqa:latest';
    console.log(grayText('[LLM] Ollama URL: ') + amberText(ollamaUrl));
    console.log(grayText('[LLM] Ollama Model: ') + amberText(ollamaModel));
  }

  // Storage driver info
  const storageDriver = process.env.STORAGE_DRIVER || 'cloudinary';
  console.log(grayText('[Storage] Driver: ') + amberText(storageDriver));
  if (storageDriver === 'local') {
    const uploadsDir = process.env.UPLOADS_DIR || path.join(process.cwd(), 'uploads');
    console.log(grayText('[Storage] Uploads Dir: ') + amberText(uploadsDir));
  } else {
    console.log(
      grayText('[Storage] Cloudinary: ') + amberText(process.env.CLOUD_NAME || 'not-configured')
    );
  }

  // Helper to extract route methods and paths from an Express router
  const getRouterRoutes = (router: any, base = '') => {
    const list: string[] = [];
    const stack = router?.stack ?? [];
    for (const layer of stack) {
      if (layer.route && layer.route.path) {
        const methods = Object.keys(layer.route.methods ?? {})
          .map((m) => m.toUpperCase())
          .join(',');
        list.push(`${methods} ${base}${layer.route.path}`);
      }
    }
    return list;
  };

  // List video routes for convenience
  try {
    const videoRoutes = getRouterRoutes(videoRouter, '/api/videos');
    console.log(grayText('[Video Routes] Available:'));
    videoRoutes.forEach((r) => console.log('  ' + amberText(r)));
  } catch (err) {
    console.warn('Failed to enumerate video routes', err);
  }

  // At the end, list all known router routes for easy discovery
  try {
    const routers: Array<{ base: string; router: any }> = [
      { base: '/api/users', router: userRouter },
      { base: '/api/videos', router: videoRouter },
      { base: '/api/store', router: storeRouter },
      { base: '/api/llm', router: llmRouter },
      { base: '/api/changelog', router: changelogRouter },
      { base: '/api/auth', router: authRouter },
      { base: '/api/timer', router: timerRouter },
      { base: '/api/interactions', router: interactionRouter },
      { base: '/api/admin', router: adminRouter },
    ];

    console.log(grayText('[Routes] All available:'));
    for (const r of routers) {
      const list = ((): string[] => {
        try {
          return getRouterRoutes(r.router, r.base);
        } catch {
          return [];
        }
      })();
      if (list.length) {
        console.log('  ' + amberText(r.base + ':'));
        list.forEach((line) => console.log('    ' + line));
      }
    }

    // Startup banner
    try {
      const pkg = JSON.parse(
        require('fs').readFileSync(require('path').join(process.cwd(), 'package.json'), 'utf8')
      );
      const version = pkg?.version || 'unknown';
      console.log('='.repeat(60));
      console.log(
        ' ' + greenText(`Path AI Backend v${version}`) + ' - ' + grayText(new Date().toISOString())
      );
      console.log('='.repeat(60));
    } catch (e) {
      // ignore
    }

    // Show special notes for interaction routes
    console.log(
      grayText('[Info] Interaction tracking endpoints:') +
        ' ' +
        amberText(
          '/api/interactions [POST /track, GET /stats, GET /risk-assessment, GET /user/:id, GET /report/suspicious (admin only)]'
        )
    );

    // Print configured CORS origins so it's easy to debug cross-device testing
    try {
      console.log(grayText('[CORS] Allowed origins: ') + amberText(allowedOrigins.join(', ')));
    } catch (e) {
      // ignore
    }

    // Timer endpoints
    console.log(
      grayText('[Info] Timer endpoints:') +
        ' ' +
        amberText(
          '/api/timer [POST /start, POST /stop, GET /active, GET /history, GET /statistics]'
        )
    );

    // Admin endpoints
    console.log(
      grayText('[Info] Admin endpoints:') +
        ' ' +
        amberText('/api/admin [GET /logs (admin only), GET /ping (admin only)]')
    );

    // Log where logs are stored
    const logDir = process.env.LOG_DIR || path.join(process.cwd(), 'logs');
    console.log(
      grayText('[Logs] General logs:') +
        ' ' +
        amberText(path.join(logDir, `path-ai-${new Date().toISOString().slice(0, 10)}.log`))
    );
    console.log(
      grayText('[Logs] Critical logs:') +
        ' ' +
        amberText(
          path.join(logDir, `path-ai-critical-${new Date().toISOString().slice(0, 10)}.log`)
        )
    );
  } catch (err) {
    console.warn('Failed to enumerate all routes', err);
  }

  // cleanup expired boosts once on startup and then daily
  async function cleanupExpiredBoosts() {
    try {
      const now = new Date();
      const res = await User.updateMany(
        {},
        { $pull: { activeBoosts: { expiresAt: { $lte: now } } } }
      );
      info('[cleanupExpiredBoosts] Completed', 'modified=', (res.modifiedCount as any) ?? 0);
    } catch (err) {
      loggerError('[cleanupExpiredBoosts] Error:', err as unknown);
    }
  }
  cleanupExpiredBoosts();
  setInterval(cleanupExpiredBoosts, 24 * 60 * 60 * 1000); // every 24 hours
});
