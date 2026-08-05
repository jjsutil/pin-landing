---
id: I-003
type: feature
status: staging
impact: high
cost: low
epic: E01
created: 2026-08-05
---

# Blog post 2 — "No se olvidó de su expediente. Nunca lo leyó entero."

Shipped title (frontmatter, `src/content/blog/es/por-que-ninguna-herramienta-le-sirvio.md`):
**No se olvidó de su expediente. Nunca lo leyó entero.** Chosen over the working title
because it follows the landing's negation-then-correction pattern (`thesis.h2`/`h2b`:
"La cita no la escribe el modelo. / La apunta.") and because it states the post's precise
technical claim — truncating is not forgetting. Slug and file path are unchanged.

`impact: high` — this is the direct-response post: it names the reader's actual
frustration (paid tools that hallucinate, stall, forget) and turns the explanation into
the reason pin is architecturally different.
`cost: low` — content only, infra already built by I-001.

`status: staging` — same as I-002: the draft is complete, adversarially reviewed
(0 blockers), and the owner approved the copy as written in conversation (2026-08-05);
PR #11 flips `draft: true` → `draft: false` with no content change and merges to `main`.

## Context

Owner brief (2026-08-05, verbatim topic): the reader already tried ChatGPT, Claude, or
other paid AI tools on their case files and they didn't work — the AI lies, gets stuck,
or forgets everything. Teach the (often tech-illiterate legal) reader what a **context
window** is — assuming they read I-002 first — and why that's the reason the rest of the
market doesn't compare to pin, which is built to solve exactly this problem.

## Scope

- One Markdown file, `src/content/blog/es/por-que-ninguna-herramienta-le-sirvio.md`.
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

- [x] Draft reviewed and approved by the owner in conversation before merge
      (2026-08-05, no content changes requested — copy shipped as reviewed).
- [x] Volume/scale claims about pin checked against current, real product state (not
      aspirational copy) before publishing. The post carries **no page count at all**:
      the volume paragraph is qualitative and says explicitly that the figure "corresponde
      medir sobre el expediente real, no prometerla en un artículo" — which is the GTM
      §10.2 gate (item 3: only 2,9% of a test file measured) honoured in the copy itself.
- [x] Reading time computed honestly from the final word count. 1.019 words of body
      (frontmatter excluded) ÷ 200 wpm = `readingMinutes: 5`.
- [x] No unexplained technical jargon — defined on first use: ventana de contexto,
      truncamiento, compresión, procedencia. ML/AI vocabulary is not redefined; the post
      links back to I-002 instead (anti-scope).
- [x] Not a competitor bake-off (anti-scope): the named tools appear once, as the
      reader's own experience, and the argument is the mechanism throughout — the section
      that could have been a feature list is collapsed into one architectural principle.
- [x] Ships through I-001's pipeline: `npm run build` exits 0 and renders
      `/blog/por-que-ninguna-herramienta-le-sirvio/` via `BlogLayout.astro`. Now
      `draft: false`; confirmed present in the `/blog` listing by a real build ahead of
      merge (PR #11).
