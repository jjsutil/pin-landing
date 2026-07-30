---
name: onboarding-doc
description: Maintain the repo's CONTRIBUTING.md — the workflow documented inside the repo itself: skills, rules, PR flow, APP_MODE, config registry, manifest, conventions. Use on "actualiza el contributing", "regenerate onboarding docs", or whenever a skill or rule changes in the repo (cadence-tracked as on-change).
---

# onboarding-doc

`CONTRIBUTING.md` is how a newcomer (human or agent) learns to work in this repo without
reading the meta-repo. Regenerate it when the workflow layer changes.

## Contents

1. **The workflow in one paragraph** — bootflower-seeded, vendored + pinned, current
   `workflow_version`.
2. **PR flow** — branch naming (`feat/I-003-slug`), the pre-PR gate (docs-guardian →
   config-registry → cost-guard → security-sweep → pr-writer → changelog entry), gate
   semantics (only `blocker` blocks; `should` must be acknowledged in accepted-risks),
   Conventional Commits, PR size limit.
3. **Installed skills** — table from the manifest in `.claude/repo-conventions.md`:
   skill, what it does (one line), when it fires.
4. **Rules** — one line each, pointing at `.claude/rules/`.
5. **APP_MODE & config registry** — mock/free/production semantics, where the seed file
   and gateway live in *this* repo, link to CONFIG.md and COSTS.md.
6. **Conventions** — docs language, issue frontmatter schema, maintenance cadences.
7. **Changing the workflow layer** — vendored files are never edited locally (rule 9);
   improvements go upstream to the bootflower meta-repo via `workflow-sync`.

## Rules of generation

- Write it layered (rule 14): what the repo is and how to work in it stays visible and
  skimmable; exhaustive tables and procedures fold into `<details>`.
- Derive everything from the repo's actual manifest and files — never describe skills
  that aren't enabled here.
- Preserve any hand-written repo-specific sections outside the generated block; wrap
  the generated part in `<!-- BOOTFLOWER-ONBOARDING:START/END -->` markers.
