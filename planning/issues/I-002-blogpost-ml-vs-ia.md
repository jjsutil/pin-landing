---
id: I-002
type: feature
status: backlog
impact: high
cost: low
epic: E01
created: 2026-08-05
---

# Blog post 1 — "¿Qué es machine learning? ¿Es lo mismo que la IA?"

`impact: high` — first post, sets the editorial voice and the ethical-AI positioning
the rest of the blog inherits.
`cost: low` — content only, infra already built by I-001.

`status: backlog`, not `ready` — the copy is being drafted and refined with the owner in
conversation before it's final. Move to `ready` once the draft is approved.

## Context

Owner brief (2026-08-05, verbatim topic): explain what machine learning is, whether it's
the same thing as "AI", and how AI opens real possibilities in the legal world — done
right, ethically, and amplifying the lawyer's work by minimizing real bottlenecks (not
replacing judgment). Byline: `equipo fundador de pin`.

This post is also **infrastructure for I-003**: it's where the reader first meets the
vocabulary (model, training, inference) that I-003's "context window" explanation builds
on — the owner explicitly plans to reference it ("si leyeron el blogpost anterior").

## Scope

- One Markdown file, `src/content/blog/es/que-es-machine-learning.md`, following I-001's
  frontmatter schema.
- Educates a legal, often tech-illiterate reader — no jargon left unexplained.
- Distinguishes ML from "AI" as a category (AI is the goal/field, ML is one way of
  getting there; today's legal-AI tools are ML systems, mostly large language models).
- Ends on the ethical/product angle: AI done right in law augments the lawyer (finding
  what a human would miss in volume, never replacing judgment or citing without
  verification), consistent with pin's own positioning
  (`docs/business/2026-07-06-modelo-de-negocio-y-gtm.md` §1, §9 — "borrador · verifica",
  never a substitute for the lawyer's judgment).

## Anti-scope

- Not a pin product pitch — this post earns trust; it does not sell. A single soft
  pointer to pin at the end is fine, a feature list is not.
- Does not explain context windows — that's I-003's job, this post sets it up.

## Acceptance criteria

- [ ] Draft reviewed and approved by the owner in conversation before merge.
- [ ] Reading time computed honestly from the final word count.
- [ ] No unexplained technical jargon — every term a legal reader wouldn't know is
      defined in-line, in plain language, on first use.
- [ ] Ships through I-001's pipeline: builds, lists on `/blog`, renders via
      `BlogLayout.astro`.
