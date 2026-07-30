# Rule 2 — Conventional Commits

Every commit message follows [Conventional Commits](https://www.conventionalcommits.org/):
`type(scope): imperative summary`, types `feat|fix|chore|docs|refactor|test|ci|build|perf|style|revert`.
Mandatory — enforced by commitlint in CI (`check-gates.yml`). Reference the issue when
one applies: `feat(auth): add magic link (I-003)`.
