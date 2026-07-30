# Rule 10 — Close the loop

Work isn't done when the code merges; it's done when nothing still describes it as
pending. Every resolving PR therefore:

- **Closes its issue** — GitHub closing keyword in the PR body (`Closes I-003`, see
  `pr-writer`), or by hand at merge if the repo's auto-close is broken. No resolved
  issue stays open.
- **Reconciles the doc that described the pending work** — the spec, plan or backlog is
  updated **in the same branch**: mark it done, delete the dead section, or record the
  real state with `file:line` evidence. A doc that still describes the past as the
  present makes the next session plan work that doesn't exist.

Before writing a new spec, plan or design doc, check whether one already covers the
topic and extend it. Two live documents on one subject is how they diverge. A doc that
can't be reconciled is archived or headed as historical **with its date** — never left
looking current.
