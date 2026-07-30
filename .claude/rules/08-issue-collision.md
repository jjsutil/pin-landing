# Rule 8 — Issue-number collision

If a PR adds a `planning/issues/I-xxx-*.md` file whose I-xxx number already exists on
`main` (under a different slug), renumber before merge. `issue-writer` prevents this by
scanning both the branch and `main`; CI (`check-gates.yml`) catches races between
parallel branches.
