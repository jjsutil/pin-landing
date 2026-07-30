---
name: todo-harvester
description: Sweep TODO/FIXME/HACK markers — convert live ones into I-xxx issues with code references, delete stale ones via PR, never both silently. Use on "cosecha los TODOs", "harvest todos", "limpia los FIXME", or weekly via maintenance schedule.
---

# todo-harvester

Code comments are where intentions go to die. Harvest them.

## Scan

`grep -rn -E "\b(TODO|FIXME|HACK|XXX)\b"` over tracked source files (exclude vendored
dirs, lockfiles, this skill's own files). For each hit, gather file:line, the comment
text, and enough surrounding code to judge it.

## Triage each marker

- **Live** (still describes real pending work): create an issue via `issue-writer` —
  type `chore` or `bug` as appropriate, body includes the marker text and a code
  reference (`path/file.ts:123`). Then replace the marker's free text with the issue
  ref: `// TODO(I-042): …` so the link is bidirectional.
- **Stale** (already done, obsolete, or meaningless): delete the comment. Deletions go
  in a dedicated cleanup branch/PR — never mixed into feature work.
- **Unclear**: list it in the report with your best guess; don't guess silently.

## Hard rule

Never both silently: every marker either becomes a tracked issue, is deleted in a
visible PR, or is explicitly reported as unclear. The report lists all three buckets
with counts; `repo-health-report` consumes the count of unharvested markers.
