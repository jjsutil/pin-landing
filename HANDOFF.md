# HANDOFF — pin-landing

Updated: 2026-08-05 (session paused mid-flight: PR #8 open, green, awaiting
independent fidelity review — see "IN FLIGHT" below before doing anything else)

> [!IMPORTANT]
> **PARKED, DO NOT MERGE PR #8 YET.** Owner is stepping away and asked to stop
> at the nearest safe point rather than force a merge. Everything up to "open
> PR, CI green" is done and pushed. What's missing is the independent
> visual-fidelity review (required before merge under the autonomous-mode
> rules — author ≠ reviewer for UI PRs) and the merge itself. See "IN FLIGHT".

## IN FLIGHT — pin landing v12 fidelity port (PR #8)

- **Branch**: `feat/landing-v12-fidelity`, 1 commit `19ab036`, pushed to
  `origin`. **PR**: https://github.com/jjsutil/pin-landing/pull/8 — OPEN,
  `check-gates` CI check **PASS**. Local `npm run build` and `npx astro check`
  both exit 0. Local `scripts/check-gates.sh --base origin/main` bare exit 0
  (0 blockers, 0 shoulds).
- **What it does**: ports the owner-approved v12 fidelity contract (artifact
  `1ef6ad63-3543-4f2a-b4d6-d62e471cf73c`, saved as
  `design/prototype/pin-landing-v12.html`, now the active contract —
  supersedes v8/v10, which is marked superseded but kept for history) into
  the live Astro site: copy overhaul (privacy promise said once per surface,
  4th thesis point, hero reserve line, Empezar commitments line, shortened
  early-access toggle, 21 POOL entries civil→penal, figures provenance note,
  footer seal as its own line, 3-column footer with real anchors), plus
  keyboard access on the viewer, a skip link, a no-JS fallback, and closes
  issue **#3** (favicon, meta/OG tags, `aria-label` now dictionary-driven).
  Full detail in the PR body and `CHANGELOG.md` `[Unreleased]`.
- **Still needed before merge** (per `~/.claude/CLAUDE.md` autonomous-mode
  rule 4 — UI PRs need a fresh-subagent fidelity review, author ≠ reviewer):
  a fresh Opus subagent was dispatched mid-session (isolated git worktree) to
  open the built site, compare it section-by-section against
  `design/prototype/pin-landing-v12.html`, ES/EN × light/dark × desktop/mobile,
  and report a PASS/FAIL verdict per surface plus screenshots. **Its report
  had not arrived when this session paused — status unknown.** Next session:
  check for that agent's notification first; if it never lands (session
  ended before delivery), just re-run the same review from scratch — the
  brief is reconstructable from this file's git history (`git log -p` on this
  section) or by re-reading the PR body's "Test plan" checklist.
- **To resume**: get the review's verdict → if APPROVE with 0 blockers and
  `gh pr checks 8` still green, merge (squash, matches repo convention) and
  log it in `~/.claude/autonomous-mode-log.md` per the active autonomous
  window. If the review finds blockers, fix them on the same branch, re-run
  the local gate, push, and re-review before merging. **Do not merge without
  that review having actually run** — no self-approval on UI.
- **Deliberate deviations already decided and documented in the PR** (do not
  re-litigate): language switch stays route-based (not the artifact's
  client-side DOM toggle); the ask-bar caret no longer hides after the third
  typed phrase (reverts the unconfirmed 2026-07-30 QA delta, now matches the
  verified v12 contract).

## Real state (pre-existing, still true)

- **PR #1, #2 and #5 all merged.** `main` carries the full Astro landing
  (fidelity contract v10 as of `main`, v12 pending in PR #8 above), Web3Forms
  wiring, ngrok demo config, the Pages workflow, real README and
  `docs/DEPLOY.md`.
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

- **Issue #3** — still open on GitHub as of this writing; PR #8 (above) closes
  it via `Closes #3` once merged. All its items are addressed in that branch:
  no-JS fallback, favicon, `aria-label` localization, viewer keydown handler,
  meta/OG tags. Don't start a second pass at these — they're already done,
  pending merge.
- **PR #4** — Dependabot: typescript 6.0.3 → 7.0.2. Untouched.
- ~~Owner decision pending: ask-bar caret hiding~~ — resolved in PR #8 by
  reverting to the verified v12 contract (caret stays visible). Not open
  anymore once #8 merges.
- Footer address and `hola@pin.legal`: the owner has said these are his real
  data, not placeholders — **do not touch them** (confirmed 2026-08-05,
  overrides the "placeholder" note from the 2026-07-30 session).
- Going private again kills Pages on the free plan (documented in DEPLOY.md).

## Gotchas

- `main` is checked out in a worktree at `/tmp/pin-qa-main`, serving the owner's
  QA preview on :4321 (`npx astro preview --port 4321`). Remove with
  `git worktree remove --force /tmp/pin-qa-main`.
- `.env` holds the real Web3Forms key locally; gitignored and verified absent
  from every blob of every branch. It IS baked into local `dist/` builds — that
  is the mechanism, and `dist/` is gitignored.
- Playwright for evidence is borrowed from `~/Projects/foja/web/node_modules`.
