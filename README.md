# Tic-Tac-Toe — Ink & Editorial

A stylised 3×3 tic-tac-toe. Warm paper, ink-black serif type, and marks that
draw themselves onto the grid.

![stack](https://img.shields.io/badge/Next.js_15-React_19-1a1712?logo=next.js)
![tests](https://img.shields.io/badge/tests-Vitest_%7C_Playwright-b3402a)

## Features

- **Two players, locally** — alternate turns on one device.
- **Vs AI** — a minimax opponent with Easy / Medium / Hard difficulty.
  Hard is unbeatable.
- **Scoreboard** — X wins, draws and O wins persist across games (localStorage).
- **Hand-drawn marks** — X and O are SVG strokes animated with
  `stroke-dashoffset`, respecting `prefers-reduced-motion`.
- **Win-line strike-through** and a subtle pulse on the winning cells.
- **WebAudio sounds** — quiet oscillator blips for moves, wins and draws,
  with a mute toggle. No audio files.
- Accessible: real buttons with descriptive labels, `aria-live` results,
  full keyboard play.

## Getting started

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## Scripts

| Command             | What it does                                          |
| ------------------- | ----------------------------------------------------- |
| `npm run dev`       | Dev server with Turbopack (port 3000)                 |
| `npm run build`     | Production build                                      |
| `npm run start`     | Serve the production build                            |
| `npm run lint`      | ESLint 9 flat config                                  |
| `npm run typecheck` | `tsc --noEmit`                                        |
| `npm test`          | Vitest — pure game-logic unit tests                   |
| `npm run test:e2e`  | Playwright — boots the dev server automatically       |

## Architecture

The game rules are **pure, framework-free TypeScript** in `src/lib/game/`
(`engine`, `ai`, `reducer`, `score`), unit-tested in isolation. React only
renders state and forwards clicks:

```
src/lib/game/        pure logic — no React imports
src/lib/hooks/       use-tic-tac-toe (useReducer + AI effect), use-local-storage, use-sound
src/components/game/ presentational components (board, cell, marks, win-line, controls…)
src/components/ui/   shadcn/ui primitives
```

See [CLAUDE.md](./CLAUDE.md) for the full rules and conventions.

## Deploy

Import the GitHub repo into Vercel — zero config. Build command `npm run build`,
no environment variables.
