---
name: branch-janitor
description: Wrap scripts/branch-janitor.sh — report wrongly named, merged-but-undeleted, and zombie branches, then propose cleanup. Never force-deletes without explicit confirmation. Use on "limpia las ramas", "branch cleanup", "ramas muertas", or weekly via maintenance schedule.
---

# branch-janitor

The logic lives in `scripts/branch-janitor.sh`; this skill runs it and negotiates
cleanup.

## Run

```bash
scripts/branch-janitor.sh --report
```

Reports, for local and remote branches:

- **Naming violations** — branches not matching the manifest's pattern
  (default `^(main|master|feat|fix|chore|docs|refactor|spike)(/|$)`).
- **Merged-but-undeleted** — fully merged into the default branch.
- **Zombies** — unmerged, no commits in >90 days (script flag `--zombie-days`).

## Cleanup protocol

1. Present the report grouped by category with the exact delete commands.
2. Merged-but-undeleted: safe to delete — ask once, then run
   `branch-janitor.sh --delete-merged` (plus `git push origin --delete` for remotes).
3. Zombies: **never** force-delete without per-branch confirmation — a zombie may hold
   unmerged work. Offer alternatives: rescue into an issue (via `issue-writer`), tag
   (`archive/<branch>`) then delete, or keep.
4. Naming violations on active branches: propose a rename; on dead ones, fold into the
   buckets above.

Findings feed `repo-health-report`. Update `last_run` in the maintenance schedule.
