---
name: pr-writer
description: Generate the PR title and body from the actual branch diff, following bootflower conventions. Use before opening any PR, when the user says "escribe el PR", "prepara el PR", "write the PR body", "abre el PR", or as step (e) of the pre-PR gate. Never invents changes not present in the diff.
---

# pr-writer

Produce a PR title and body derived **only** from the real diff. If something is not in
the diff, it does not go in the body.

## Inputs

1. `.claude/repo-conventions.md` — manifest, language, PR size limit.
2. The diff: `git diff $(git merge-base main HEAD)...HEAD` (use the repo's default
   branch if it is not `main`), plus `git log main..HEAD --oneline`.
3. The linked issue file in `planning/issues/` (find the `I-xxx` referenced by the
   branch name, e.g. `feat/I-003-slug`, or ask which issue this PR implements).
4. Review output, if a `pr-reviewer` pass already ran on this branch.

## Title

Conventional Commits format, matching the dominant change type:
`feat(scope): concise imperative summary` — scope optional, ≤72 chars, references the
issue when one exists: `feat(auth): add magic-link login (I-003)`.

## Body structure

Write every section below, in this order, in the repo's `docs_language`:

1. **Summary** — 2–4 sentences: what changed and the observable result.
2. **Motivation** — why, linking the issue: `Closes I-003` (or `Refs I-003` if partial).
3. **Changes** — bullet list grouped by area (api, ui, db, docs, ci…), each bullet
   traceable to hunks in the diff.
4. **Test plan** — what was tested and how to verify: commands, new/changed test files,
   manual steps. If new logic ships without tests, say so explicitly (the reviewer will
   flag it as at least `should`).
5. **Evidence** — proof the change does what it claims. If the PR touches a
   **user-visible surface** (UI, a rendered export/artifact, a doc with visual content),
   attach evidence: screenshots, before/after when modifying something that existed,
   command output for a fix's repro. What counts as evidence — and any repo specifics
   (themes to capture, which fixture/synthetic data to use, never real/confidential
   data) — is defined by the repo's `CONTRIBUTING`. If there is **no visible surface**
   (core/library/refactor/config), say so explicitly: `sin superficie visible →
   evidencia = tests/gate`. Never leave the section empty. This is a **`blocker`** in
   review and, for the UI code surface, mechanically enforced (`check-gates` step 8):
   a diff under `ui_surface_glob` must ship a committed screenshot under the evidence
   glob, or a commit in the branch must carry a `no-visible-surface` trailer.
   **Embed format — SHA-pinned github.com blob (default, not optional):** a markdown
   image with the **github.com blob URL + `?raw=true`, anchored to the 40-hex commit SHA**
   that added the screenshot — `![alt](https://github.com/<owner>/<repo>/blob/<sha40>/<path>?raw=true)`
   — renders inline even in a private repo (authenticated github.com session) **and
   survives the merge**. Do NOT anchor to `<branch>`: a `--delete-branch` merge deletes the
   ref and every branch-anchored link 404s (it happened on foja #437 — the embeds had to be
   re-anchored by hand). A `raw.githubusercontent.com` URL (needs a token → 404 when
   private) and an `<img src>` tag both render broken; don't use them either. This is
   enforced mechanically: `check-gates` step 8 **fails** a UI PR whose body embeds a
   committed screenshot with a branch anchor, a `raw.githubusercontent.com` host, or an
   `<img>` tag, or that omits the SHA-pinned embed entirely. Run
   `scripts/ui-evidence-embed.sh` to generate the correct markdown for the screenshots
   committed on the branch.
6. **Merge checklist** — checkboxes: gates passed (docs-guardian, config-registry,
   cost-guard, security-sweep), changelog entry added, docs updated, CI green.
7. **Breaking changes** — `None.` or an explicit list with migration notes.
8. **Docs updated** — confirmation of which docs this branch touched (README, CONFIG.md,
   ADRs…), consistent with the docs-guardian pass.
9. **Accepted risks** — every unresolved `should` finding from review, one line each,
   explicitly acknowledged. This section is what lets a `should` pass the gate: listed
   and owned, never silently dropped. `None.` if there are none.

## Side effects

- Move the linked issue's frontmatter `status` to `review`, then invoke `roadmap-board`
  to regenerate BOARD.md and the README summary.
- Hand the body to `changelog-keeper` so the `[Unreleased]` entry is derived from it.

## Hard rules

- Never describe changes that are not in the diff; never omit user-visible ones that are.
- Lay the body out per rule 14: summary, linked issue, breaking changes, visual evidence
  and accepted risks stay visible; test matrices, command output and file-by-file
  walkthroughs go folded into `<details>`.
- If the diff exceeds the manifest's PR size limit (~400 net lines by default), add a
  one-line justification to the Summary or recommend splitting before opening.
- Open PRs as **Draft** when running unattended.
