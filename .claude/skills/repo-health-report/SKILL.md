---
name: repo-health-report
description: One consolidated repo health report — stale issues, dead branches, drift, TODOs, doc gaps, config findings, cost risks, overdue maintenance. Use on "reporte de salud del repo", "health report", "cómo está el repo", or weekly via maintenance schedule.
---

# repo-health-report

One report, all the signals. Run the underlying skills/scripts in their read-only
modes and aggregate — this skill computes nothing novel itself.

## Sections

1. **Board staleness** — from roadmap-board's criteria: `in-dev` issues >14d without
   commits, `review` >7d without movement (manifest-tunable thresholds).
2. **Dead branches** — from `scripts/branch-janitor.sh --report`: merged-but-undeleted,
   zombies, naming violations.
3. **Roadmap ↔ code drift** — issues whose status fails the objective criteria
   (branch/PR/tag reality), planned work with no issue, code surfaces with no doc.
4. **Coverage** — if the repo has a measurable coverage setup, report the number and
   trend; otherwise say "not measurable here" (don't invent a harness).
5. **Unharvested TODOs** — count from todo-harvester's scan.
6. **Docs / vault** — orphan docs, broken wikilinks, SSoT gaps and duplicates (from
   obsidian-vault verifier mode).
7. **Config registry** — undocumented params, dead params, orphan CONFIG.md entries,
   pending legacy-migration issues (from config-registry).
8. **Cost** — open cost risks from COSTS.md, plus a **pricing re-check** for
   potentially-paid integrations (has a free tier this repo relies on changed?).
9. **Maintenance overdue** — read `.claude/maintenance-schedule.md`; list every task
   past its cadence with days overdue. (CI's `cadence-reminder.yml` opens issues for
   these too; the report is the human-readable view.)

## Output

Markdown report to the user, worst news first. Each finding names the skill/issue to
act with. Update `last_run` for `repo-health-report` in the maintenance schedule.
