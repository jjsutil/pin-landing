# Repo conventions — pin-landing

<!-- Created by bootflower repo-bootstrap. This file is REPO-SPECIFIC DATA:
     workflow-sync never touches it. Tailoring happens HERE, by selection and
     parameters — never by editing vendored skill text (rule 9). -->

docs_language: en
workflow_version: 0.1.15

## Conventions

- Branch naming: `feat/I-003-slug` (types: feat|fix|chore|docs|refactor|test|spike)
- Conventional Commits: mandatory (rule 2, enforced by CI)
- PR size soft limit: see `pr_size_limit` below (rule 3)
- `APP_MODE`: not applicable — static site, no runtime backend (rule 5 dormant)
- Config registry: all non-secret runtime config in the global registry, single read
  path (rule 6). Locations for THIS repo:
  <!-- check-gates.sh MACHINE-READS the three keys below: the value is everything
       after the first colon on the key's line. Keep them bare `key: value` lines —
       the value is a path or `none`, nothing else. Inline prose corrupts the parsed
       value and silently disables the config-sync and gateway checks (I-001).
       Explanations go on follow-on lines, as shown. -->
  - config_seed: none
    (static landing — no runtime config yet; form backend, when decided, will add one)
  - config_module: none
    (no runtime read path yet)
  - gateway_path: none
    (no paid APIs; cost-guard dormant until the first paid integration)
  - ui_surface_glob: src
    (Astro source — any change here needs visual evidence per check-gates step 8)
  - ui_evidence_glob: design/evidence
    (committed screenshots of the landing surfaces, light/dark × ES/EN)

## Repo gotchas

- **This repo is public, so CI runs.** The account's billing block (since
  2026-07-23) only affects private repositories; `pin-landing` was made public on
  2026-07-30, so `check-gates.yml` and `cadence-reminder.yml` execute normally on
  every PR. Still run the same gate LOCAL before opening one — it catches issues
  faster than waiting on CI, not because CI can't run: `scripts/check-gates.sh`,
  `npm run build` and `npx astro check`.
- Deployment is deliberately not configured (owner-gated; see README).
- `design/prototype/pin-landing-v12.html` is the visual-fidelity CONTRACT for the
  landing (supersedes v8). On any doubt, the prototype wins.

## Issue frontmatter schema

```yaml
---
id: I-014
type: bug | feature | chore | spike
status: backlog | ready | in-dev | review | staging | production
impact: high | low
cost: high | low
epic: E02          # optional
screens: [S03]     # optional
created: YYYY-MM-DD
---
```

## Workflow manifest

Enabled skills and their parameters. All skills install by default — including
cost-guard in repos with no paid APIs today (dormant guards catch the first paid
integration).

Portfolio-scope skills (`scope: portfolio` in their frontmatter) are **not** listed here
and are not vendored into this repo: they install once at `~/.claude/skills/` (user scope),
above every repository. See `BOOTFLOWER.md`, "Skills — portfolio scope".

| skill | enabled | parameters |
|---|---|---|
| pr-writer | true | |
| issue-writer | true | |
| pr-reviewer | true | |
| docs-guardian | true | |
| config-registry | true | |
| cost-guard | true | |
| roadmap-board | true | staleness_in_dev_days: 14, staleness_review_days: 7 |
| obsidian-vault | true | |
| changelog-keeper | true | |
| release-notes | true | |
| security-sweep | true | |
| onboarding-doc | true | |
| todo-harvester | true | |
| dependency-doctor | true | |
| repo-health-report | true | |
| branch-janitor | true | zombie_days: 90 |
| negocio | true | |
| jefatura | true | |
| ejecucion | true | |

- pr_size_limit: 400
