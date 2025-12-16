# PathAI Frontend — Operation: Brain Expansion 🙌🏽🤖🧠💥

> "Rip and learn. Build the factory, survive the tutorial, and for the love of code, don't forget to hydrate."

Welcome to the frontend of PathAI. We are building a machine that turns "I don't know" into "I know Kung Fu." It is built like a factory, polished like a speedrun, and shipped with the kind of efficiency that makes engineers weep with joy.

**Our Mission:** To **bring free knowledge to everyone** (and look cool doing it).

This README is your tactical briefing. Read it. Memorize it. Or just copy-paste the commands like the rest of us.

---

## TL;DR — The "I ain't reading all that" Section

- **The Goal:** Personalized learning paths that adapt faster than a Zerg rush.
- **The Brains:** AI-powered answers that make you look smarter than you actually are.
- **The Fun:** Gamification so addictive you'll forget you're actually learning calculus.
- **The Tech:** Fully internationalized UI that looks good on your phone _and_ your 49" ultrawide monitor.

---

## Features — The Good Stuff

- 🎯 **Smart Learning Paths** — You tell us what you want. We give you the map. No side quests required.
- 🤖 **AI Insights** — It's like having a genius in your pocket, but without the ego.
- 🏆 **Gamification** — Points! Streaks! Shiny badges! We exploit your dopamine receptors for _educational purposes_.
- 🌐 **Localization** — We speak your language. Unless your language is Klingon. (Coming soon? No.)
- ⚙️ **Responsive Layouts** — Polished for mobile, desktop, and smart fridges (untested, but try it).

---

## Dev Quickstart — Ignite the Engines

1. **Install the things:** (The root handles the workspaces, don't fight it).

```fish
# from repo root
npm install
npm run dev
# For backend only (if you hate pixels):
# npm run dev:backend
# For frontend only (if you hate data):
# npm run dev:frontend
```

2. **Behold the glory:** Open the URL printed by Vite (usually `http://localhost:5173`).

3. **Make it pretty:** (Or else the linter will yell at you).

```fish
# format & check
npm run -w frontend format
npm run -w frontend format:check
# lint (the judgment command)
npm run -w frontend lint
```

> **Note:** The pre-push formatting hook was banished to the shadow realm during development to avoid rage-quitting. If you want it back, we can summon it.

---

## Environment variables — The Secret Sauce

Place these in `frontend/.env` (or whisper them into the void):

- `VITE_API_URL` — Where the backend lives (e.g., `https://api-pathai.example`). Don't ghost the backend.
- `VITE_APP_NAME` — The name on the tin (default: `Path AI`).
- `VITE_OLLAMA_API_URL` — If you're running local AI (you cyberpunk, you).
- `VITE_OLLAMA_MODEL` — The brain in the jar (e.g., `llama3-chatqa:latest`).

---

## Key client-server interactions — The Handshake

- `GET /api/changelog/latest` — The VersionIndicator checks this to see if you're living in the past.
- `GET /api/health` — "Are you alive?" "Yes." "Good."
- `GET /api/admin/llm-config` — Admin-only. Tells us which AI overlord is currently serving us.
- **Admin Routes:** Hidden behind the `/api/admin/*` curtain. You need the secret handshake (tokens/cookies).

---

## Testing & CI tips — Don't Break Production

- `npm run -w frontend test` — Run this if you enjoy green checkmarks.
- **Prettier & ESLint:** We use a business-grade config in `.vscode/settings.json`. It is strict but fair, like a good drill sergeant.

---

## Accessibility — No User Left Behind

- **Icon-only buttons:** They have `aria-label` attributes so screen readers don't just say "Button... Button... Button."
- **Contrast:** Verified to be readable by humans, not just eagles.
- **Keyboard Focus:** You can tab through the app like a pro. Mouse usage is optional.

---

## Troubleshooting — When the Machine Spirit is Angry

- **API 404/500:** Is the backend running? Did you check `VITE_API_URL`? Did you turn it off and on again?
- **LLM Model Missing:** The backend might be shy (protected route). Check your auth.
- **Mobile Layout Broken:** Re-run formatting. Inspect breakpoints. Cry briefly, then fix CSS.

---

## Contribute — Join the Chaos

1. **Fork & Branch:** Name your branch something epic.
2. **Test Locally:** Don't ship broken code. We will find you.
3. **Open a PR:** Include screenshots, expected behavior, and a motivational quote that would make a space marine proud.

---

## Mission Send-off

> "The factory must grow. The knowledge must flow."

Ship confidently. Optimize your learning lines. And if a bug bites, we rebuild the conveyor belt and send the next patch.

**Bring free knowledge to everyone.**

**PathAI Frontend** — Dismissed. Go build something awesome. ⚙️👾
