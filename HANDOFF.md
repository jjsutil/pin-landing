# HANDOFF — pin-landing

Updated: 2026-07-30 (session close: landing PUBLISHED, Web3Forms wired, CI restored)

> [!IMPORTANT]
> **The site is live at https://jjsutil.github.io/pin-landing/** (ES) and
> `/en/` (EN), both verified 200. Publishing is automatic: every push to `main`
> runs `deploy-pages.yml`. The repo is **public** — which is what restored CI:
> the account's Actions billing block only affects private repos.

## Real state

- **PR #1, #2 and #5 all merged.** `main` carries the full Astro landing
  (fidelity contract v10), Web3Forms wiring, ngrok demo config, the Pages
  workflow, real README and `docs/DEPLOY.md`.
- **CI is real here**: `check-gates` runs and passes on every PR. It already
  caught a real defect (a 114-char commit header) that the local gate missed
  because the gate had been run before the commit existed. Lesson: run the gate
  **after** committing, not before.
- **Web3Forms is wired and live.** The owner's key is stored as repo variable
  `PUBLIC_WEB3FORMS_KEY` and is baked into the published bundle (verified by
  grepping the served JS). Without the variable the forms degrade to on-screen
  confirmation.
- **Not yet verified end-to-end**: that a submission actually lands in the
  owner's inbox. Web3Forms rejects server-side POSTs on the free plan (client
  only), and the browser automation hung on this page. **The owner verifies it
  in ten seconds by submitting the form on the live site.**

## Open

- **Issue #3** — pre-publication hardening: no-JS fallback (`.rise` starts at
  `opacity:0`, so a bundle failure renders a blank page — the one that matters),
  favicon, `aria-label` server-rendered in Spanish on `/en/`, viewer keydown
  handler, meta/OG tags. Plus the review's remaining shoulds: error live region
  announcement, submit busy state.
- **PR #4** — Dependabot: typescript 6.0.3 → 7.0.2. Untouched.
- **Owner decision pending**: whether the ask-bar caret hiding (`e46a9c3`) was
  requested in his QA or should be reverted.
- Footer address and `hola@pin.legal` are **placeholders**.
- Going private again kills Pages on the free plan (documented in DEPLOY.md).

## Gotchas

- `main` is checked out in a worktree at `/tmp/pin-qa-main`, serving the owner's
  QA preview on :4321 (`npx astro preview --port 4321`). Remove with
  `git worktree remove --force /tmp/pin-qa-main`.
- `.env` holds the real Web3Forms key locally; gitignored and verified absent
  from every blob of every branch. It IS baked into local `dist/` builds — that
  is the mechanism, and `dist/` is gitignored.
- Playwright for evidence is borrowed from `~/Projects/foja/web/node_modules`.
