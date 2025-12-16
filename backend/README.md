# Backend — Overview & Operational Guide (updated 2025-12-16)

This document summarizes the backend features, recent additions, important environment variables, admin endpoints, and operational tasks (migration, logging, and health checks).

---

## Summary of recent additions

- Added **admin endpoints** for logs, stats and LLM configuration (`/api/admin/logs`, `/api/admin/stats`, `/api/admin/llm-config`). These routes require admin authentication.
- **Version indicator LLM display**: frontend can query `/api/admin/llm-config` to display which LLM model is active (Gemini or Ollama).
- **Storage drivers**: support for `cloudinary` and `local` storage with a migration tool to transfer Cloudinary media to the local filesystem.
- **Improved logging & operational endpoints**: admin log downloads and a lightweight health check endpoint to support monitoring & dev workflows.
- **CORS & preflight fixes** applied for more robust cross-origin requests in dev & prod environments.

---

## Quick start (development)

1. Install dependencies and start dev server:

```bash
# from repo root
npm run dev
# or run backend only
cd backend && npm run dev
```

2. The backend will look for `.env.development.local` (dev) or `.env.production.local` (prod).

3. Watch startup logs for the LLM provider and model choice (printed on router initialization).

---

## Important environment variables

Group by functionality:

### Storage

- `STORAGE_DRIVER` — `cloudinary` or `local` (default behavior is `cloudinary` in older installs; consider switching to `local` for simpler hosting)
- `UPLOADS_DIR` — directory for local file storage (e.g. `./uploads`)
- `SERVER_BASE_URL` — base URL to build absolute URLs for hosted media (e.g., `https://app.example.com`)

### LLM / AI

- `USE_GOOGLE_GEMINI` — set to `true` to use Gemini, otherwise Ollama is used
- `GEMINI_MODEL_ID` — e.g. `gemini-2.5-flash` (Gemini model ID used when Gemini is active)
- `GEMINI_API_KEY` — required when using Gemini
- `OLLAMA_MODEL` — e.g. `llama3-chatqa:latest` (default model for local Ollama usage)
- `VITE_OLLAMA_API_URL` — API URL for Ollama if used in local deployments

### Logging & Ops

- `LOG_DIR` — where server logs are written (defaults to `./logs`)
- `NODE_ENV` / runtime flags — standard Node environment variables apply

---

## Notable API endpoints

Public / unauthenticated routes:

- `GET /api/changelog/latest` — returns latest changelog entry (used by VersionIndicator)
- `GET /api/health` — lightweight health check (use for container/liveness checks)

Admin (require `authMiddleware` + `adminOnly`):

- `GET /api/admin/logs?type=critical|general|admin&date=YYYY-MM-DD` — download log files as attachments
- `GET /api/admin/stats?date=YYYY-MM-DD` — returns simple operational stats (userCount, recentErrors, activeSessions)
- `GET /api/admin/llm-config` — returns current LLM provider and model as `{ provider, model }`

Notes:

- Admin routes are guarded; confirm you have valid auth tokens/cookies when testing.

---

## Storage migration: Cloudinary → local

If you are switching from `cloudinary` to `local`, the repo ships with a migration script:

**Script:** `backend/scripts/migrate-cloudinary-to-local.ts`

Usage (example):

```bash
# run with ts-node or use the project's dev task
node --loader ts-node/esm ./backend/scripts/migrate-cloudinary-to-local.ts
```

The script downloads Cloudinary assets, stores them in `UPLOADS_DIR`, and attempts to preserve metadata and ETags where possible.

---

## Logging & monitoring

- Logs are written under `LOG_DIR` (default `./logs`).
- Critical logs are written to `path-ai-critical-YYYY-MM-DD.log` and can be downloaded via the admin logs endpoint.
- Startup prints a concise banner with version, routes, and configured LLM provider & model for quick troubleshooting.

---

## CORS & Preflight

- We fixed preflight CORS handling in recent updates (explicit allowed headers and methods). If you see `OPTIONS` failures during dev, confirm `VITE_DEV_BACKEND_URL` or `VITE_API_URL` are correctly configured for the client.

---

## Security & Access

- Admin endpoints require authentication. Use the same auth flow as the frontend (session cookie or Authorization header) when scripting calls.
- Do not expose admin endpoints in public or unauthenticated contexts.

---

## Troubleshooting checklist

- 500s or log download errors: check the specific log file exists in `LOG_DIR` and that the process has read permissions
- LLM not available: verify `USE_GOOGLE_GEMINI`, `GEMINI_API_KEY`, and `GEMINI_MODEL_ID` for Gemini; otherwise verify `OLLAMA_MODEL` and `VITE_OLLAMA_API_URL` for local Ollama
- File uploads not accessible: verify `STORAGE_DRIVER`, `UPLOADS_DIR` and that static `/uploads` route is enabled and has correct file permissions
- Health check fails: confirm `GET /api/health` returns 200 and check server startup logs

---

## Notes for maintainers

- If you plan to remove Husky or modify hooks, update root-level hooks and CI accordingly. (We previously disabled the pre-push formatting check while iterating.)
- Keep `.env.example` in sync with the environment variables listed above.
- Add any new admin-only endpoints to this README to keep operators aware of available tooling.

---
