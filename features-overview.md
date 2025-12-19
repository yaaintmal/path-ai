# PathAI — Features Overview 🚀

**Short pitch:** PathAI helps users learn from videos quickly using AI-powered transcription, translation, summarization and learning templates — wrapped in a gamified experience with a store, streaks and admin tools for observability.

---

## Table of contents

1. Product highlights
2. Key features (by area)
3. Unique selling points
4. Typical demo flows
5. Architecture & tech stack
6. Security, i18n & deployment notes
7. Developer & admin tools
8. Files and endpoints to reference

---

## 1) Product highlights ✨

- Turn source content into searchable, structured learning resources (text, documents, and other media).
- Fast onboarding with templates and bookmarks to structure learning and take action.
- New Focus Mode: distraction-free, timed study sessions guided by templates and key prompts.
- Gamified retention: streaks, virtual currency, and a store with purchasable perks.
- Admin observability: logs, stats, and migration-friendly changelog.

---

## 2) Key features (by area) 🔎

### Learning & Content

- **Learning templates & bookmarks:** predefined templates and user bookmarks to capture highlights and actions (`src/frontend/src/data/templates`, `src/frontend/src/contexts/useBookmarks.ts`). Templates support prompts, structured notes, and review questions to improve retention.
- **Dashboard & progress:** the Learning Dashboard aggregates saved topics, progress blocks, mastery indicators, and suggested review items (`DashboardPreview`), and schedules review sessions using spaced-review heuristics.
- **Focus Mode:** a timed, distraction-free study mode that guides users through one topic using a selected template, tracks session time, awards streak/XP on completion, and integrates with the dashboard's review schedule (`src/frontend/src/pages/TimerPage.tsx`, `src/frontend/src/components/dashboard/DashboardSelection.tsx`).
- **Content import & support:** add content from text or documents and create notes using templates; advanced ingestion features are experimental and available in a separate branch.
- **Search & review:** saved topics are searchable and tie directly into review templates for quick retrieval and study planning.

### Gamification & Store 🛒

- **Virtual currency & store items:** `StoreItem`, `Purchase`, and `UserInventory` models allow users to buy perks or UI themes.
- **Seeding & admin helpers:** `scripts/seed-store-items.ts` seeds the store with items.

### User Progress & Streaks 🔥

- Track daily activity and streaks (`streakController.ts`) with UI showing streak status, progress, and rewards.

### Changelog & Release Notes 📜

- **Robust changelog:** stored in MongoDB with a file fallback (`src/data/changelog.json`).
- **Migration scripts:** `scripts/migrate-changelog.ts` and helper `scripts/add-changelog.ts` to insert or update entries programmatically.

### Admin & Observability 🛠️

- **Admin endpoints:** `/api/admin/stats`, `/api/admin/logs` return usage metrics, recent errors, and raw logs for troubleshooting.
- **Robust response handling:** frontend widgets surface raw response snippets when backends return non-JSON (helps debug HTML error pages vs API responses).

### Internationalization (i18n) 🌍

- Uses `react-i18next` with static locale imports for reliability. Locale files live in `src/frontend/src/locales/*` and translations are pre-validated.

### Authentication & Authorization 🔐

- **JWT-based auth** for protected/admin routes; supports Authorization header and cookie fallback (`jwtAuth.ts`, `jwtUtils.ts`).
- Admin-only routes protected and audited.

---

## 3) Unique selling points 💎

- Structured learning flow: import content → apply templates → Focus Mode → retention tracking and review.
- Gamification tied directly to learning outcomes (store items encourage retention).
- Admin tooling built-in for production debugging (raw response visibility, fallback changelog, migration scripts).

---

## 4) Typical demo flows (suggested) 🎯

1. Landing → Register or Sign In → Show VersionIndicator (displays computed API base).
2. Create or import content (text/doc) → pick a learning template → generate a structured note with prompts and review questions.
3. Add the note to bookmarks → Dashboard aggregates progress and schedules review sessions; launch Focus Mode for a timed session on a topic.
4. Complete a Focus Mode session → record progress, increment streak/XP, and collect any rewards in Store.

---

## 5) Architecture & tech stack 🧩

- **Frontend:** React + TypeScript + Vite, Tailwind-like components, contexts for auth/bookmarks/learning.
- **Backend:** Node + Express + TypeScript + Mongoose (MongoDB).
- **AI/Services:** Optional LLM endpoints for summarization, question generation, and assistance (see `llmRouter`).
- **Storage:** Cloudinary for assets; MongoDB for main persistence.
- **Testing:** Jest + ts-jest + Supertest for backend tests (changelog controller tests included).

---

## 6) Security, i18n & deployment notes ⚠️

- **Env & config:** Frontend uses `import.meta.env.VITE_API_URL` (fallbacks handled in `app.config.ts`). Ensure this points at the correct backend host in production (e.g., `https://api.pathai.one`).
- **CORS & cookies:** When using cookie-based auth across domains, prefer an `api.*` subdomain to avoid SameSite/cross-domain restrictions.
- **Fallbacks:** Changelog controller can return local `changelog.json` when DB is empty — helpful during early staging deploys.

---

## 7) Developer & admin tools 🔧

- Scripts: `scripts/migrate-changelog.ts`, `scripts/add-changelog.ts`, `scripts/seed-store-items.ts`.
- Tests: run `npm test` in backend to exercise changelog and controller unit tests.
- Debugging helpers: VersionIndicator shows computed API base; admin widgets print raw responses and first 500 chars on invalid JSON.

---

## 8) Files & endpoints to reference (quick list)

- Frontend config: `src/frontend/src/config/app.config.ts`
- i18n: `src/frontend/src/i18n.ts`, `src/frontend/src/locales/`
- Admin widgets: `src/frontend/src/components/admin/*`
- Backend changelog controller: `src/backend/src/controllers/changelogController.ts`
- Admin router: `src/backend/src/routers/adminRouter.ts`
- Migration scripts: `scripts/migrate-changelog.ts`, `scripts/add-changelog.ts`
- Focus Mode UI: `src/frontend/src/pages/TimerPage.tsx`, `src/frontend/src/components/dashboard/DashboardSelection.tsx`

---

## 9) Suggested slides / talking points for product presentations

- Start with problem statement: "Learning from long videos is slow and noisy."
- Demo: Import or create content → Apply a template → Enter Focus Mode → Complete session → Reward & progress.
- Highlight: Admin observability and robust fallbacks (migration + changelog + raw-response visibility).
- Call to action: "Try it with a 2–5 minute clip and measure knowledge retention after 24 hours."

---

If you'd like, I can:

- generate a slide-ready deck (3–6 slides) from this content, or
- add a short one-page PDF or printable demo checklist for presenters.

> Files created: `features-overview.md` at repo root — review and tell me which parts you want emphasized or trimmed for a slide deck.
