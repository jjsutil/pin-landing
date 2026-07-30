# Rule 3 — PR size

A PR above the manifest's soft limit (~400 net lines by default, `pr_size_limit` in
`.claude/repo-conventions.md`) requires either an explicit one-line justification in
the PR summary, or splitting into smaller PRs. Generated files and lockfiles don't
count toward the limit.
