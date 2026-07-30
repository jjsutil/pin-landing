---
name: issue-writer
description: Create a well-formed issue file in planning/issues/ (I-xxx-slug.md) with typed template, acceptance criteria, scope/anti-scope, and classified frontmatter. Use when the user says "crea un issue", "file an issue", "registra esto como issue", or when another skill (todo-harvester, config-registry, cost-guard, dependency-doctor) needs an issue created.
---

# issue-writer

Create `planning/issues/I-xxx-slug.md`. One issue = one verifiable unit of work.

## Numbering

Scan `planning/issues/` on the current branch **and** on `main` for the highest `I-xxx`;
assign the next free number (zero-padded, three digits). This avoids the collision the
pre-PR gate checks for (rule 8) — if a collision still lands in a PR, renumber before
merge.

## Frontmatter (schema is law — roadmap-board parses it)

```yaml
---
id: I-014
type: bug | feature | chore | spike
status: backlog | ready | in-dev | review | staging | production
impact: high | low
cost: high | low
epic: E02          # optional
screens: [S03]     # optional, S-xx refs for frontend work
created: 2026-07-15
---
```

New issues start at `status: backlog` (`ready` only if the referenced ERD/PRD/screen
specs already exist — roadmap-board's criteria decide, not vibes).

## Body per type

All types share: **Context** (what and why, links to ERD entities / `[[S-xx]]` screens /
ADRs when relevant), **Acceptance criteria** (checkboxes, each independently verifiable),
**Scope** and **Anti-scope** (what this issue deliberately does NOT cover).

Type extras:
- **bug** — reproduction steps, expected vs actual, suspected surface.
- **feature** — user story or job-to-be-done, affected screens (S-xx), data model impact.
- **chore** — motivation (debt, tooling, upgrade) and the done-state.
- **spike** — the question to answer, timebox, and the artifact that closes it (ADR,
  doc, or follow-up issues).

## Classification with rationale (mandatory)

Classify `impact` and `cost` using roadmap-board's declared criteria (impact-high: core
user flow, unblocks other issues, user-visible; cost-high: large diff surface, new
dependencies, migration/infra risk). Write **one rationale line per classification into
the issue body**, e.g.:

> `impact: high` — touches core auth flow, unblocks I-012.
> `cost: low` — single module, no schema change.

The rationale exists for auditability and for tuning the criteria later — never skip it.

## After writing

Invoke `roadmap-board` to regenerate BOARD.md and the README summary.
