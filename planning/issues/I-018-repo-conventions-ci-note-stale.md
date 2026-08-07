---
id: I-018
type: chore
status: backlog
impact: low
cost: low
created: 2026-08-07
---

# `.claude/repo-conventions.md` still says CI is blocked by billing — it isn't

`impact: low` — no user-visible surface; it misleads agents and future sessions, not
visitors.
`cost: low` — a few lines in one file, no code.

## Context

`.claude/repo-conventions.md` (section "Repo gotchas") states:

> **GitHub Actions is blocked by billing on this account (since 2026-07-23).** The two
> seeded workflows are installed but will not run. The gate is LOCAL […]

That was true when written, for private repos. **This repo is public and Actions runs
here**: `check-gates` executed and passed on PR #33 and on every push of PR #34
(2026-08-07). `README.md` already records the correct version ("this repo is public, so
Actions is not affected by the account's billing block on private repos") — the two
documents contradict each other, and the wrong one is the one agents read first.

The practical cost of leaving it: a session that believes CI cannot run treats the
local gate as the only signal and may not wait for, or check, the real one.

## Scope

- Correct the gotcha in `.claude/repo-conventions.md` to say what is true: Actions runs
  on this repo because it is public; the billing block applies to the account's private
  repos and is why the *other* repos in the portfolio rely on the local gate.
- Keep the instruction to run the gate locally before opening a PR — that is still the
  workflow, and it is right for reasons that have nothing to do with billing.
- Check the same claim isn't repeated in `CONTRIBUTING.md` or `docs/`; reconcile
  wherever it appears (rule 10).

## Anti-scope

- Not a change to any workflow file or to CI configuration (rule 9: seeded workflows
  are changed only via `workflow-sync`). This is documentation only.
- Not a re-audit of the account's billing state for the private repos — the note about
  them stays.

## Acceptance criteria

- [ ] `.claude/repo-conventions.md` no longer claims Actions will not run in this repo.
- [ ] No other doc in the repo still makes that claim.
- [ ] The local-gate instruction survives, with its real justification.
