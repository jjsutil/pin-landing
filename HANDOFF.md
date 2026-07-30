# HANDOFF — pin-landing

Updated: 2026-07-30 (session: repo creation + bootstrap + landing implementation)

## Real state

- Repo created private at `jjsutil/pin-landing`. Main carries: README, Node
  `.gitignore`, and the **fidelity contract** `design/prototype/pin-landing-v8.html`
  (approved v8 prototype — on any doubt, it wins), plus this file.
- **PR #1 (Draft, OPEN — do not merge without owner):**
  `chore/bootstrap-workflow-system` — bootflower v0.1.15 seeding (skills, rules,
  scripts, workflows, manifest, first-run docs). Registered in the meta-repo's
  adoption table.
- **PR #2 (Draft, OPEN — do not merge without owner):** `feat/landing-v1` —
  complete Astro implementation. ES at `/`, EN at `/en/`. Local gate green:
  `npm run build` OK, `npx astro check` 0 errors, both routes 200 with correct
  per-language titles. Visual evidence committed in `design/evidence/`
  (hero + form × light/dark × ES/EN).

## What is missing (deliberate)

- **Form backend** — both forms confirm on screen only;
  `// TODO(backend)` in `src/scripts/main.ts` marks the capture points.
  Owner decision pending; register the integration in `docs/CONFIG.md` when chosen.
- **Step 4 — publication** (GitHub Pages / deploy workflow / domain / real
  email): retained by the owner for a joint session. Nothing configured.

## Gotchas

- **GitHub Actions is blocked by billing on this account since 2026-07-23.**
  Workflows are installed (PR #1) but never run. The gate is local:
  `npm run build`, `npx astro check`, `scripts/check-gates.sh` (once PR #1 merges).
- The two PRs are independent (both branch from main); merge order does not matter.
- Playwright for evidence was borrowed from `~/Projects/foja/web/node_modules`
  (not a dependency of this repo).
