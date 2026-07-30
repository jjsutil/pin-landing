---
name: hygiene-sweep
description: Use when a repo's hygiene has drifted from reality — the README/board summary is stale, resolved issues are still open, merged branches linger, docs describe finished work as pending, or scheduled maintenance has never run. Also weekly via the maintenance schedule, as the acting counterpart to repo-health-report.
---

# hygiene-sweep

The acting counterpart to `repo-health-report`. That skill *detects* every drift
signal; this one *acts* on them — **applies the fixes that are safe and provable,
reports the ones that need your judgment.** It computes nothing novel: it runs the
existing skills in their apply modes and negotiates the rest.

## When to use

- The README board summary contradicts reality (a closed issue shown open, a done
  epic shown pending). The generated board drifted because nobody regenerated it.
- Issues that a merged PR resolved are still open.
- Merged branches never got deleted; docs describe shipped work as "pending".
- The maintenance schedule shows tasks that have never run.
- Weekly, as the scheduled sweep.

## Two buckets

Every signal from `repo-health-report` falls into exactly one:

| Auto-apply (safe + **provable** + reversible) | Report only (judgment) |
|---|---|
| Regenerate README board + `planning/BOARD.md` via `roadmap-board` (generated output, Rule 7) | Zombie branches — may hold unmerged work; per-branch decision via `branch-janitor` |
| Close an issue **only when proof exists**: a merged PR closing-references it, or its objective done-criteria hold. Cite the evidence in the close comment | Issues that look stale but aren't provably done — list each with why |
| Delete merged-but-undeleted branches via `branch-janitor --delete-merged` | Doc reconciliation needing interpretation (a spec section describing done-as-pending, Rule 10) — propose the edit, don't rewrite silently |
| Update `last_run` stamps in the maintenance schedule for tasks run | Stale/abandoned PRs + dependency-bump backlog — recommend merge or close, don't act |
| | Dead config params / orphan CONFIG.md entries (`config-registry`); open cost risks (`cost-guard`) |

## Protocol

1. **Detect.** Run `repo-health-report` to get the full signal inventory. Don't re-derive.
2. **Preview.** List the exact auto-apply actions and the report-only findings *before* touching anything. Nothing runs until the plan is shown.
3. **Apply the safe bucket.** File changes (regenerated board, mechanical doc reconciliation) go into **one branch + PR** — never a direct commit to the default branch. Issue closes and branch deletes are direct API/git actions, executed only with the proof cited.
4. **Report the judgment bucket**, worst first, each finding naming the exact command/skill to act with — same format as `repo-health-report`.
5. **Stamp.** Update `last_run` for `hygiene-sweep` (and any sub-skill it ran) in the maintenance schedule, inside the same PR.

## Safety rules

- **Provable-only auto-close.** Never close an issue on staleness, inactivity, or a hunch — only on a merged PR that closing-references it or objective done-criteria. No proof → it goes in the report bucket, untouched.
- **Everything file-shaped goes through a PR.** No direct commits to the default branch; the PR is where a human sees the diff.
- **Generated is regenerated, never hand-edited** (Rule 7). Vendored skills/rules are never forked here (Rule 9) — behavior changes go upstream to the meta-repo.
- **Idempotent.** A clean repo → a no-op: no PR, nothing closed, nothing deleted.
- **Read the target before overwriting a doc.** If its content contradicts how the drift signal described it, surface that instead of overwriting.

## Red flags — STOP

- About to close an issue you can't tie to a merged PR or done-criteria → move it to the report bucket.
- About to `git push --delete` a branch that isn't fully merged → that's a zombie; report it, don't delete.
- About to hand-edit the board summary or a generated section → regenerate via `roadmap-board` instead.
- Rewriting a spec's prose to "reconcile" it based on your own read of what's done → propose it in the report, let the human confirm.

## Output

A short PR (regenerated board + any mechanical reconciliations + schedule stamps) plus
a markdown report of the judgment bucket. If the repo is already clean, say so and open
nothing. Update `last_run` in `.claude/maintenance-schedule.md`.
