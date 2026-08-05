---
id: I-002
type: feature
status: review
impact: high
cost: low
epic: E01
created: 2026-08-05
---

# Blog post 1 — "«Inteligencia artificial» no nombra una tecnología. Nombra una promesa."

Shipped title (frontmatter, `src/content/blog/es/que-es-machine-learning.md`):
**«Inteligencia artificial» no nombra una tecnología. Nombra una promesa.** The working
title above was a search-query question; editorial review replaced it with a thesis that
states a position, matching the landing's voice (`src/i18n/index.ts` — short, affirmative,
with a turn). Slug and file path are unchanged.

`impact: high` — first post, sets the editorial voice and the ethical-AI positioning
the rest of the blog inherits.
`cost: low` — content only, infra already built by I-001.

`status: review` — the draft is complete, adversarially reviewed (0 blockers), and open
in PR #11, pending the owner's approval in conversation before the `draft: true`
flag comes off and it publishes.

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
      **Still pending — the post stays `draft: true` until this happens.**
- [x] Reading time computed honestly from the final word count. 1.131 words of body
      (frontmatter excluded) ÷ 200 wpm = `readingMinutes: 6`. The excerpt makes no
      competing time claim.
- [x] No unexplained technical jargon — every term a legal reader wouldn't know is
      defined in-line, in plain language, on first use. Defined on first use:
      *machine learning*, entrenamiento, modelo, inferencia, modelo de lenguaje,
      alucinación.
- [x] Not a product pitch (anti-scope): no feature list, no pricing, no product name in
      the body — the only pointer to pin is the byline and the closing evaluation
      question, which names no vendor.
- [x] No unverified page-volume claim (GTM §10.2 gate). The quantified value used is
      the externally sourced reading-rate figure (44–100 pp/h → 500–1.100 h for ~50k
      fojas); the refuted US$8–36 compute figure (§1.1 warning, 29/07) is not used, and
      the landing's "diez mil páginas" is deliberately not imported.
- [x] Ships through I-001's pipeline: `npm run build` exits 0 and renders
      `/blog/que-es-machine-learning/` via `BlogLayout.astro`. Correctly **excluded**
      from the `/blog` listing while `draft: true` — the listing half of this criterion
      is satisfied by design and is re-verified when the owner lifts the flag.
