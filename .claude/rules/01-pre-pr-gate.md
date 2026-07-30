# Rule 1 — Pre-PR gate

No PR opens without ALL of:

- (a) `docs-guardian` pass — docs updated in the same branch
- (b) `config-registry` pass
- (c) `cost-guard` pass
- (d) `security-sweep` pass (diff-scoped)
- (e) a `pr-writer` body
- (f) a changelog entry (`changelog-keeper`)

A branch that opens a PR contains its README/docs updates. **Only `blocker` findings
block**; `should` findings must be explicitly acknowledged in the PR body's
accepted-risks section. CI (`check-gates.yml`) enforces the mechanical subset on every
PR, including hand-opened ones.

**The gate runs bare, and green tests must have been seen to fail.** The gate is invoked
as its own command and **never piped into anything** — a pipe replaces the gate's exit
status with the last stage's, so a red gate reports green and nobody finds out. What
counts as evidence is the command plus its **exit code**, never the word "green". And
where the logic is non-trivial, tests are **verified by mutation**: break the
implementation on purpose and confirm a test catches it. A test that never saw the
implementation fail proves nothing, and the hole in the test is exactly the hole in the
code. Both apply to any agent reporting a gate result upward, which may not restate these
conditions from memory in place of reading this rule.

**Review notes never reach production docs.** A review note written inside a
documentation file — `CORR.: …` opening a line (including `> **CORR.: …`), or a
bracketed `[comentario … : …]` / `[… por borrar …]` — means *an agent must resolve this
and then delete it*. It is not content: it must be **addressed and deleted before
publishing, never merged**. `check-gates` step 9 blocks any PR that ADDS such a marker
to production documentation (`*.md` at the root and under `docs/`, plus `AGENTS.md`,
`CLAUDE.md`, `README.md`, `CONTRIBUTING.md`). Work-in-progress surfaces are out of scope
on purpose — `planning/`, `docs/superpowers/`, `HANDOFF.md`, `CHANGELOG.md`,
`docs/releases/` — because a pending note there is legitimate working material. Only
added lines count, so pre-existing notes in a file a branch merely touches do not block;
remediating them is its own PR. A line that must quote a marker deliberately carries the
token `check-gates:allow-note`. Rationale: foja merged 24 review notes into its README
and they are visible in production.

**A released version stays untagged for at most one PR.** In a repo carrying a `VERSION`
file, `check-gates` step 10 blocks when the version **already published on the base
branch** has no `v<VERSION>` tag on the remote. It checks the published release, not the
branch's, on purpose: the tag of the release in flight is created after the merge, so a
branch that bumps `VERSION` must never fail on its own future tag — but the very next PR
turns red until the previous release is tagged. The check never passes for lack of
looking: with the remote unreachable it falls back to the local tag store, and a missing
tag still blocks; a tag that exists only locally blocks in CI and, on a developer machine,
degrades to a `should` that names publication as the single unverified part. Rationale:
bootflower accumulated **nine** untagged releases, and because `bootflower-sync` resolves
every vendored file's baseline as `git show v<stamped>:<path>`, the missing tags made each
sync report *false divergence* and refuse to update — foja and puki silently went without
the release. The sync script no longer produces that report: an unresolvable stamp is a
hard stop (exit 3) naming the missing tag. A manifest with **no** `workflow_version` line
is a different, legitimate case (never stamped) and keeps warning and continuing.

**Visual evidence is part of the gate, not optional.** A PR that changes a user-visible
surface ships visual evidence (see the repo's `CONTRIBUTING`); this is a `blocker` in
review, and for the UI code surface it is enforced mechanically (`check-gates` step 8,
opt-in per repo via `ui_surface_glob`). It is not waivable via accepted-risks. Rationale
and the incident that motivated the teeth: foja's `docs/postmortems/2026-07-23-vista-caso-fidelidad.md`.
