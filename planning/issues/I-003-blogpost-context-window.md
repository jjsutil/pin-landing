---
id: I-003
type: feature
status: review
impact: high
cost: low
epic: E01
created: 2026-08-05
---

# Blog post 2 — "Por qué ninguna de esas herramientas te sirve" (ventana de contexto)

`impact: high` — this is the direct-response post: it names the reader's actual
frustration (paid tools that hallucinate, stall, forget) and turns the explanation into
the reason pin is architecturally different.
`cost: low` — content only, infra already built by I-001.

`status: backlog`, not `ready` — same reason as I-002: drafted and refined with the
owner in conversation first.

## Context

Owner brief (2026-08-05, verbatim topic): the reader already tried ChatGPT, Claude, or
other paid AI tools on their case files and they didn't work — the AI lies, gets stuck,
or forgets everything. Teach the (often tech-illiterate legal) reader what a **context
window** is — assuming they read I-002 first — and why that's the reason the rest of the
market doesn't compare to pin, which is built to solve exactly this problem.

## Scope

- One Markdown file, `src/content/blog/es/por-que-ninguna-herramienta-te-sirve.md`.
- Opens with the reader's actual experience (named, not softened): paid for ChatGPT/
  Claude/another tool, ran a real case file through it, got confident-sounding nonsense,
  or the tool "forgot" the first half of the document by the time it answered.
- Explains context window in plain terms: a model only "sees" a fixed amount of text at
  once: past that, earlier material falls out of view — that's forgetting, not a bug,
  it's how the architecture works. Ties back to I-002's vocabulary (inference over a
  fixed input, not persistent memory).
- Connects that mechanism to why a 10,000-page case file breaks general tools: they're
  not built to read a whole case file at once, chunk it faithfully, and let you verify
  every claim against the exact page.
- Positions pin's actual architecture as the fix — grounded in what's real today, not
  aspirational: cite-to-page verifiability and the pipeline built to ingest a full case
  file once rather than fight a context limit per question. Do **not** overstate scale
  claims — cross-check current wording against `docs/BUSINESS.md` on the foja side
  before publishing (as of 2026-08-05 only a 2.9%-coverage test case is measured; word
  the volume claim qualitatively, not with a specific page count, until that's resolved).

## Anti-scope

- Not a takedown of ChatGPT/Claude by name-brand comparison spec sheets — the point is
  the mechanism (context window), not a competitor bake-off.
- Does not repeat the ML/AI definitions from I-002 — links back to it instead.

## Acceptance criteria

- [ ] Draft reviewed and approved by the owner in conversation before merge.
- [ ] Volume/scale claims about pin checked against current, real product state (not
      aspirational copy) before publishing.
- [ ] Reading time computed honestly from the final word count.
- [ ] Ships through I-001's pipeline: builds, lists on `/blog`, renders via
      `BlogLayout.astro`.
