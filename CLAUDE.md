# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Tic-Tac-Toe — Ink & Editorial.** A stylised 3×3 tic-tac-toe with local
two-player, an unbeatable AI, a persisted scoreboard, hand-drawn SVG marks,
a win-line strike-through, and WebAudio sounds.

Stack: Next.js 15 (App Router) · React 19 · Tailwind CSS v4 · shadcn/ui
(`base-nova` style, `@base-ui/react`) · Vitest · Playwright. Deploy target: Vercel.

## Commands

```bash
npm run dev          # Next dev server with Turbopack (http://localhost:3000)
npm run build        # production build (next build --turbopack)
npm run start        # serve the production build
npm run lint         # ESLint 9 flat config (eslint.config.mjs)
npm run typecheck    # tsc --noEmit
npm test             # Vitest run — pure game-logic unit tests
npm run test:watch   # Vitest in watch mode
npm run test:e2e     # Playwright — boots the dev server automatically
npm run test:e2e:ui  # Playwright UI mode
```

Run `npm run typecheck`, `npm run lint` and `npm test` before committing; run
`npm run build` before deploying.

## Architecture rules

- **Pure game logic lives in `src/lib/game/{types,engine,ai,reducer,score}.ts`.**
  No React or Next imports in those files. Every game rule belongs there, never
  in a component. `sound.ts` is the only module that touches `window`, and only
  inside functions (never at module scope).
- **Game state is a single `useReducer`** (`src/lib/game/reducer.ts`) driven by
  `src/lib/hooks/use-tic-tac-toe.ts`. Do not add Context, Zustand, or Redux — the
  whole app is one reducer plus a few persisted scalars.
- **AI** is `src/lib/game/ai.ts`: minimax with alpha-beta. `hard` is perfect,
  `medium` is 30% random, `easy` is random. `rng` is injected for deterministic
  tests. In AI mode the human is always **X** and the AI is **O**
  (`AI_PLAYER` in the hook).
- **Score is recorded exactly once per round** via `game.roundId` plus a ref
  guard in the hook. **New Game resets the board only**; the scoreboard persists.
- **Persistence** uses `useLocalStorage`, which never reads storage during
  render (SSR-safe) and writes only after mount. Keys are versioned:
  `ink-ttt:{score,mode,difficulty,sound}:v1`.
- The AI move is a `useEffect` with a cancelled `setTimeout`; keep the cleanup
  so it stays idempotent under StrictMode and cannot race a reset.

## Conventions

- **Tailwind v4**: theme tokens live in `@theme` in `src/app/globals.css`.
  Do **not** create `tailwind.config.js`. Palette: `paper` `#f6f1e7`,
  `paper-deep` `#efe7d8`, `paper-raised` `#fbf8f1`, `ink` `#1a1712`,
  `ink-soft`, `ink-faint`, `line`, `accent` `#b3402a`. X is ink, O is accent.
- Typeface: **Fraunces** (display serif) + **Inter** (body) via `next/font/google`
  in `src/app/layout.tsx`; CSS vars `--font-fraunces` / `--font-inter`.
- shadcn primitives are in `src/components/ui`; `cn()` comes from `@/lib/utils`.
  Path alias `@/*` → `src/*`.
- TypeScript strict; no `any`.
- Accessibility: board cells are `<button>`s with descriptive `aria-label`s
  ("Row 1, column 2: X"); the result uses `aria-live="polite"`; all mark and
  win-line animation is disabled under `prefers-reduced-motion`.

## Testing

- Unit tests are colocated `src/lib/game/*.test.ts` and run in the **node**
  environment (no DOM needed). `vitest.config.mts` mirrors the `@` alias.
- e2e lives in `playwright/e2e` and selects by `data-testid`. Screenshots for the
  submission are written to `playwright/screenshots/`.
- `playwright.config.ts` honours a `CHROMIUM_PATH` env var for environments where
  the bundled browser cannot run; CI leaves it unset.

## Deploy

- Vercel import from the GitHub repo's default branch; build command
  `npm run build`; no env vars or special `next.config.ts` needed.
- `.github/workflows/ci.yml` runs typecheck, lint, unit tests, build, and e2e.
