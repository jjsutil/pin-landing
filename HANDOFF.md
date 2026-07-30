# HANDOFF — pin-landing

Updated: 2026-07-30 (session: contract v10, PR #2 merged to main)

## Real state

- **PR #2 MERGED to main** (squash `b823470`, 2026-07-30): complete Astro
  implementation of the landing, contract v10. ES at `/`, EN at `/en/`.
  Merged under the active autonomous window on explicit owner instruction,
  with the full liturgy on the PR: adversarial review (APPROVE, 0 blockers),
  independent visual fidelity review (PASS 66/66, screenshots in
  `design/evidence/fidelity-v10/`), local gate bare exit 0, and the real
  `gh pr checks` output ("no checks reported") transcribed. Logged in
  `~/.claude/autonomous-mode-log.md`.
- The **fidelity contract** is `design/prototype/pin-landing-v8.html`, header
  states **v10** (v8 + final tagline + section order Héroe→Cifras→Pregunta→
  Tesis→Quejas→Oferta + softened footer sub-line). On any doubt, it wins.
- **PR #1 (Draft, OPEN — do not merge without owner):**
  `chore/bootstrap-workflow-system` — bootflower v0.1.15 seeding. Owner
  explicitly kept it in Draft when authorizing the PR #2 merge.
- **Issue #3** collects the non-blocking review findings for pre-publication
  hardening (no-JS fallback is the important one) plus form backend, real
  footer address/email, and the dead footer links.

## What is missing (deliberate)

- **Form backend** — both forms confirm on screen only;
  `// TODO(backend)` in `src/scripts/main.ts` marks the capture points.
  Owner decision pending; register the integration in `docs/CONFIG.md` when chosen.
- **Step 4 — publication** (GitHub Pages / deploy workflow / domain / real
  email): retained by the owner for a joint session. Nothing configured.
- **Owner still owes one word**: whether the ask-bar caret hiding (commit
  `e46a9c3`) was requested in his QA or should be reverted.

## Gotchas

- **GitHub Actions is blocked by billing on this account since 2026-07-23.**
  Workflows are installed (PR #1) but never run. The gate is local:
  `npm run build`, `npx astro check`, `scripts/check-gates.sh` (once PR #1 merges).
- Playwright for evidence was borrowed from `~/Projects/foja/web/node_modules`
  (not a dependency of this repo).
- Local QA preview: `npm run preview` serves `dist/` on :4321; rebuild first.
