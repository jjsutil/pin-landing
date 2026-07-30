---
name: release-notes
description: Write narrative release notes for a tag into docs/releases/vX.Y.Z.md, grouped by user-facing value. Manual and per-tag by design (narrative judgment, deliberately not automated). Use on "escribe las release notes", "notas de la versión", "write release notes for v1.2.0".
---

# release-notes

**Manual, per tag** — this is narrative judgment, deliberately not automated.

## Inputs

- The CHANGELOG section for the tag (from `changelog-keeper`).
- Merged PRs in the tag range: `gh pr list --state merged` filtered by the range
  `previous-tag..tag`, plus their bodies.

## Output — docs/releases/vX.Y.Z.md

Group by **user-facing value**, not by commit or PR:

1. A 2–3 sentence headline: what this release means for the user.
2. Sections per theme ("Faster imports", "New dashboard") — each explains the benefit,
   then links the PRs/issues behind it.
3. Breaking changes with migration steps, prominently.
4. Acknowledged risks / known issues carried over from PR accepted-risks sections.

Link the file from `docs/INDEX.md` (obsidian-vault will verify reachability). Write in
the repo's `docs_language`, and lay the notes out per rule 14: headline, value per theme
and breaking changes visible; per-PR detail and long evidence folded into `<details>`.
