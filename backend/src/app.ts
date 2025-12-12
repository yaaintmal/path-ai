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
} from '#routers';
import { User } from '#models';
import { amberLog, success, info, loggerError, grayText, amberText, greenText } from '#utils';

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

// Middleware
app.use(express.json());
// cookie parser (for refreshToken cookie)
app.use(cookieParser());

// Enable CORS with default settings
// Configure for production use case if needed (e.g., whitelist specific origins)
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
  })
);

// Routes
console.log(grayText('[App] Registering routes...'));
app.use('/api/users', userRouter);
app.use('/api/videos', videoRouter);
app.use('/api/store', storeRouter);
app.use('/api/llm', llmRouter);
app.use('/api/changelog', changelogRouter);
app.use('/api/auth', authRouter);
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

// Start server
app.listen(PORT, () => {
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
