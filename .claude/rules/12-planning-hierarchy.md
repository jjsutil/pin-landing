# Rule 12 — Planning hierarchy & traceability

Work is decomposed as a traceable hierarchy, and every unit of work can be traced
from the code back to the reason it exists:

**Goals (`G1`) → Milestones (`M1`) → Epics (`E01`) → Issues (`I-001`) → Planned PRs (`PR-001`).**

- **Every item links upward.** Each planned PR belongs to an issue, each issue to an
  epic, each epic to a milestone, each milestone to a goal. A reader must be able to
  trace any PR back to the goal it serves.
- **IDs are stable and global**, never reused (rule 8): `G/M/E/I/PR` with zero-padded
  numbers. An ID names one thing for the life of the repo.
- **Substantial work gets an issue under an epic before its PR opens**, and the PR
  references that issue with a closing keyword (`Closes I-003`) so the loop closes
  (rules 2 and 10). Trivial or mechanical changes (a typo, a dependency bump) may skip
  the epic/issue, but still reference an issue when one applies.
- **Each epic carries a pillar plan** (`planning/plans/E0x-plan.md`) — self-contained
  context a per-PR planning session reads to build the implementation plan. The plan
  is where sequencing, dependencies and epic-level acceptance live.
- **The hierarchy is SSoT-configurable, the traceability is not.** Where it lives is a
  per-repo choice: file-based (`docs/ROADMAP.md` as the spine, plus `planning/epics/`,
  `planning/issues/`, `planning/plans/`) **or** GitHub Issues (`roadmap-board`
  `source: github`). Whichever the repo picks, the levels and the upward links hold —
  and `planning/BOARD.md` is generated from that single source, never hand-edited (rule 7).
- **Don't invent hierarchy.** Collapse honestly for a small project (one goal, two
  milestones) rather than padding empty levels. The levels exist to *trace* and to
  *scope* work, not to inflate it.

Created by `design-to-repo` at bootstrap; consumed by `pr-plan` (reads one issue + its
epic's pillar plan); materialized by `roadmap-board`. See rules 7 (board is generated),
8 (ID uniqueness) and 10 (close the loop).
