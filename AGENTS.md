# Repository Guidelines

## Project Structure & Module Organization
This app is intentionally packaged as a single-page React experience: all UI, calculators, and data scaffolding live inside the `<script type="text/babel">` block in `index.html`. Keep related helpers together and group large additions with banner comments (see the existing `//======================================================================` sections). The TypeScript entry points (`App.tsx`, `components/`, `services/`) are placeholders for a future split; only touch them if you are migrating logic out of the HTML bundle. Environment-sensitive values belong in `.env.local`, and `vite.config.ts` exposes them via `process.env`.

## Build, Test, and Development Commands
- `npm install` – install dependencies before your first run or when packages change.
- `npm run dev` – launch the Vite dev server; use it for all interactive testing.
- `npm run build` – generate the production bundle; run before submitting changes to catch JSX/Babel regressions.
- `npm run preview` – serve the built assets locally to mirror the deployed experience.

## Coding Style & Naming Conventions
Follow the established React 18 functional-component style with arrow functions and hooks. Indent nested JSX with four spaces and keep line width under 100 characters to preserve readability in the monolithic script block. Use `camelCase` for variables and functions, `PascalCase` for components, and uppercase snake case for static datasets (e.g., `INITIAL_POROTHERM_DATA`). When adding icons or utilities, colocate them near their consumers and document non-obvious business rules with concise comments.

## Testing Guidelines
There is currently no automated test harness. Exercise every calculator panel (Porotherm, Solbet, Bruk-Bet, Semmelrock, Polbruk) in the dev server, validate export-to-Excel flows, and confirm sync states while toggling network availability. Prefer extracting pure helpers into `services/` if you plan to introduce Vitest unit tests later. Document manual test cases in the pull request when touching pricing formulas.

## Commit & Pull Request Guidelines
The existing history (`rozoczecie`) is minimal; adopt clear, imperative commit messages (`feat: add semmelrock calculator totals`). Keep pull requests focused, include a short change log, screenshots or GIFs for UI tweaks, a manual test checklist, and reference related issues. Highlight any schema or environment changes up front so reviewers can update `.env.local` before testing.

## Configuration Tips
Never commit real API keys. Use `.env.local` for `GEMINI_API_KEY`, and confirm Vite picks it up via `process.env.GEMINI_API_KEY`. When working offline, disable sync calls in the PocketBase helpers to avoid noisy console errors.
