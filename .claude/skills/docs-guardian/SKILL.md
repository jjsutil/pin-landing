---
name: docs-guardian
description: Keep documentation in lockstep with code — runs before any PR opens (pre-PR gate step a). Use when preparing a PR, when the user says "revisa la documentación", "actualiza los docs", or whenever a diff may touch the documented top layer (commands, setup, env vars, config params, endpoints, folder structure, user-facing features, architecture decisions).
---

# docs-guardian

No PR opens with docs that lie. This skill detects whether the branch diff touches the
**documented top layer** and, if so, updates the affected docs **in the same branch**.

## Detection

Inspect `git diff main...HEAD` for changes to:

- CLI commands, scripts, or setup/installation steps
- environment variables or config params (→ delegate the param documentation itself to
  `config-registry`; docs-guardian only verifies the delegation happened)
- HTTP endpoints / public API surface
- folder structure or entry points
- user-facing features or behavior
- architecture decisions (new dependency, pattern change, storage change…)

If none are touched, report "top layer untouched" and pass.

## Actions on touch

1. Update README sections that describe the changed surface. Never hand-edit the
   generated summary between `<!-- BOARD-SUMMARY:START -->` / `END` markers — that is
   roadmap-board's territory (rule 7).
2. Update affected files under `docs/` and planning docs (PRD/ERD) when the change
   alters what they assert.
3. **ADRs**: a non-trivial design decision gets a short ADR at
   `docs/adr/NNNN-title.md` (next free number; context → decision → consequences,
   ~half a page) and is linked from the docs it affects and from `docs/INDEX.md`.
4. Maintain `docs/DOC-MAP.md`: one line per doc — path, purpose, owner-skill if
   generated. Add/remove entries as docs appear/disappear.
5. **Language rule** (rule 4): in a repo with `docs_language: en`, touching a Spanish
   doc means migrating that doc to English in the same branch (opportunistic
   migration). Never create new docs in the wrong language.

6. **Layering** (rule 14): when writing or rewriting a doc, apply rule 14 — the
   human-readable essence visible and skimmable, agent-only depth folded into
   `<details>`.

## Output

A short pass/fail report: what the diff touches, which docs were updated, which ADR was
written, remaining gaps (each gap is a `blocker` for the pre-PR gate — this skill's pass
is a gate condition, rule 1).
