# Full Changelog — Beta 7 (since 0.7.x)

**Date:** 2025-12-16

A consolidated changelog covering all additions, fixes and refactorings introduced during the 0.7.x development window (versions 0.7.1 → 0.7.5).

---

## ✨ New Features

- **[0.7.5 — 2025-12-16] Roadmap Page (Kanban)**
  - Added a dedicated, Kanban-style Roadmap with columns: _In Progress_, _Up Next_, _Requested Features_, _Completed_.
  - Implementation: `frontend/src/pages/RoadmapPage.tsx` and data stored in `frontend/src/data/roadmap.json` (JSON-driven, ready for DB integration).

- **[0.7.4 — 2025-12-16] LLM Model Display**
  - Version indicator now shows the active LLM model on hover (e.g., `gemini-2.5-flash` or `llama3-chatqa:latest`).

- **[0.7.2 → 0.7.1 — 2025-12-15] Admin Platform Additions**
  - Major admin features landed: **ErrorPollerWidget**, **Admin Stats**, **User Management** (create/update/delete), **API Test** widget, and log download endpoints.
  - Added `npm run dev` concurrent dev script and Vite proxy improvements for smooth local development.

---

## ✅ Fixes

- **[0.7.3 — 2025-12-15] Mobile / Layout Fixes (Header & Footer)**
  - Fixed header title wrapping and subtitle truncation on narrow screens.
  - Adjusted logo spacing and min-width constraints to avoid layout breaks on mobile.
  - Reworked footer grid responsiveness (1 → 2 → 4 columns) and improved spacing & icon responsiveness.

- **[0.7.2 — 2025-12-15] Admin & Navigation fixes**
  - Ensured admin access is available in all AppContent branches (fixed missing prop passing).
  - Increased header z-index to prevent clickability issues during mode transitions.
  - Minor debug instrumentation added to aid troubleshooting (console logs for admin flows).

---

## 🔧 Refactorings & Cleanup

- **[0.7.5 — 2025-12-16] Footer Refactor & Template Pages**
  - Refactored footer links (Pricing, FAQ, About, Legal, etc.) into dedicated template pages using `FooterPages.tsx`.
  - `App.tsx` and `Header.tsx` updated to manage `footerPage` state and navigation without adding a full router.

- **[0.7.4 — 2025-12-16] Tooling & Config Cleanups**
  - Moved VS Code editor settings into `.vscode/settings.json`, kept Prettier rules in `.prettierrc`.
  - Removed husky and trimmed unnecessary frontend dev deps.

- **[0.7.2 — 2025-12-15] Admin Dashboard Refactor**
  - Reworked admin dashboard into a surgical grid layout and removed redundant card wrappers for single-frame widgets.
  - Prop chain refactor to consistently pass `setShowAdmin` and other setters across all branches.

---

## 🔎 Files / Artifacts Added or Updated

- Added:
  - `frontend/src/pages/RoadmapPage.tsx`
  - `frontend/src/data/roadmap.json`
  - `frontend/src/pages/FooterPages.tsx`

- Updated:
  - `frontend/src/components/global/Footer.tsx` (links and styling)
  - `frontend/src/components/global/Header.tsx` (z-index, props, navigation integration)
  - `frontend/src/App.tsx` (new `footerPage` state and render path)
  - `backend/src/data/changelog.json` (new entry for `0.7.5`)

---

## 💡 Notes & Next Steps

- The roadmap is JSON-driven (`frontend/src/data/roadmap.json`) to make it straightforward to later replace with a MongoDB-backed endpoint and an admin UI for editing roadmap items.
- Consider adding a small admin endpoint such as `GET /api/roadmap` + secure `POST /api/roadmap` to manage roadmap items remotely.
- If you'd like, I can also:
  - Add a simple admin editor for roadmap items (drag/drop Kanban + CRUD), or
  - Wire `roadmap.json` to the backend and add an endpoint + basic Admin UI.
