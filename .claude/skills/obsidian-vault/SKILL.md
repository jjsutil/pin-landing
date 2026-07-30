---
name: obsidian-vault
description: Keep the repo's docs a navigable Obsidian vault and the architecture & design SSoT — INDEX.md root node, real wikilinks, coverage check, orphan report. Use on "verifica el vault", "revisa el grafo de docs", "check the vault", weekly via maintenance schedule, or after adding/moving docs.
---

# obsidian-vault

Each repo's `docs/` + `planning/` form a self-contained Obsidian vault: open the graph,
understand 100% of the project. This is the **architecture & design SSoT**.

## Root node — docs/INDEX.md

Links (with real wikilinks) to: DESIGN, PRD, ERD, ROADMAP, BOARD, CONFIG, COSTS,
BUSINESS, DOC-MAP, ADRs, screens (S-xx), epics (E-xx), issues, CONTRIBUTING. Every new doc
must be reachable from INDEX — directly or through one of those hubs.

## SSoT coverage check

Every subsystem, integration, and architectural decision has **exactly one** canonical
doc reachable from INDEX. Report:

- **Gaps** — subsystems/integrations with no canonical doc.
- **Duplicates** — two docs asserting ownership of the same topic (pick one canonical,
  link the other or merge).

## Linking rules

- Issues link their epic and screens: `[[E01-plan]]`, `[[S03-dashboard]]`, plus ADRs
  they depend on.
- CONFIG params link their COSTS.md entries and motivating ADRs; plans link back.
- BUSINESS.md links the COSTS.md entries its unit economics rests on, and the issues that
  carry its cheapest next test — the price and the cost of serving one unit must be one
  hop apart, or they drift.
- The graph view must mirror the project's real structure — if two things are coupled
  in code, their docs are linked.

## Frontmatter

Consistent YAML on every vault doc: `type` (adr/spec/plan/issue/…), `status`, `tags`.

## Housekeeping

- `.obsidian/` is fully gitignored — global decision, all repos.
- **Verifier mode** (weekly cadence + on demand): report orphan docs (unreachable from
  INDEX), broken wikilinks, missing frontmatter, and SSoT gaps/duplicates. Findings
  feed `repo-health-report`.

## First run (from repo-bootstrap)

Build INDEX.md from the existing docs, add missing frontmatter, wire obvious wikilinks,
and report SSoT gaps — don't invent docs to fill gaps; file issues for real ones.
