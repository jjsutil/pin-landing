# Rule 9 — No local skill edits

Vendored system files (`.claude/skills/`, `.claude/rules/`, `scripts/check-gates.sh`,
`scripts/branch-janitor.sh`, the seeded CI workflows) are changed **only** via
`workflow-sync` from the bootflower meta-repo. A repo needing different behavior
triggers a new option/parameter in the meta-repo, selected via the manifest — never a
local fork. Local divergence is reported and upstreamed as a meta-repo PR, never kept.

**Portfolio-scope skills obey the same rule at a different address.** A skill declaring
`scope: portfolio` under `metadata:` is not vendored into any repo: it installs once at
**`~/.claude/skills/<name>/`** — user scope, the only address that is reachable from every
session. Subagent definitions carrying the same declaration install at
`~/.claude/agents/<name>.md`. Both are still vendored copies: bootflower's `skills/` and
`agents/` are the only write paths, and the next sync overwrites anything edited there.

**Not `~/Projects/.claude/skills/`.** That was the original target, on the premise that
every project hangs off `~/Projects` so one copy would be seen everywhere. The premise was
false and cost `direccion` its entire reason to exist: skill discovery reads user scope and
the **project** directory, and does not walk up the tree, so the skill loaded only in a
session rooted at `~/Projects` and was silently absent from inside every repo — precisely
where it claims to work. Verified by running a session in `~/Projects/foja` (I-008).
