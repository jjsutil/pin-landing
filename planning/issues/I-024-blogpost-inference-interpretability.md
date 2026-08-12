---
id: I-024
type: feature
status: staging
impact: high
cost: high
epic: E01
created: 2026-08-12
---

# Blog post — inference & interpretability, in depth (technical series, part 2)

`impact: high` — second post in the technical-depth pillar's series (part 1: I-020,
OCR); continues making pin credible to engineers evaluating the product, and extends
a series the owner explicitly asked to continue.
`cost: high` — same bar as I-020: every technical claim needs a real, independently
verified citation, no numbers recalled from training data.

## Context

Owner request, 2026-08-12 (chat), immediately after I-020 (post 8) shipped: "quiero
escribir la parte dos y la parte tres: sobre inferencia, sobre interpretación, LLMs,
sobre RAG, sobre machine learning pero en profundo." Split across two posts — this one
covers inference mechanics and interpretability; RAG is I-025 (part 3).

**Written by a dispatched Fable-model agent**, per explicit owner instruction
("Despacha un agente fable a escribir dicho post") — not composed directly in this
session. Independently re-verified before merge (see PR).

## Scope

Technical-depth pillar, collective "pin Founding Team" voice (matches I-020's voice
decision — no persona). For an engineering/CTO reader, not a lawyer.

- How inference actually works: forward pass, autoregressive decoding, KV-caching,
  sampling strategies, and why latency/cost scale the way they do.
- Quantization and other inference-time tradeoffs, grounded in measured literature.
- What "interpretability" means in the current literature — mechanistic
  interpretability vs. post-hoc explanation — and why a model narrating a plausible
  reason is not the same as knowing why it produced an output. Connects to the
  already-published `how-an-ai-answer-is-verified` post (confidence ≠ verification).
- Honest current limits of interpretability research for a practitioner.

**No fabricated claims about pin's own systems** — literature-grounded, not an
internal postmortem (unlike I-020, this one does not draw from the private `foja`
codebase).

## Citations — same hard constraint as I-020

Every reference verified via WebFetch before being written down (title/authors/venue/
year confirmed, claim attributed matches the source). Search, don't recall. At least
3-4 real citations.

## Deliverable

ES + EN (`src/content/blog/es/como-funcionan-de-verdad-la-inferencia-y-la-interpretabilidad.md`,
`src/content/blog/en/how-inference-and-interpretability-actually-work.md`).
`publishDate: 2026-08-27` (weekly Thursday cadence, +7 days from post 8's corrected
date). Tags reuse existing vocabulary plus a new `Interpretability` /
`Interpretabilidad` tag.

## Anti-scope

- Not a change to blog layout/routing/schema.
- No pin-internal architecture or accuracy claims.
- Ships `draft: true` pending citation-verification review, per owner instruction
  flips to published in the same session once that review passes (owner pre-authorized
  publish, "publícalo").

## Acceptance criteria

- [x] ES and EN versions exist, valid frontmatter, `astro check` and `npm run build`
      pass.
- [x] Every citation independently re-verified (not just trusted from the writing
      agent) — fetched, confirmed to exist, confirmed the claim matches. Independent
      review: **APPROVE, 0 blockers** — all 9 citations re-verified against primary
      sources (Holtzman ICLR 2020, Kwon/PagedAttention SOSP 2023, Frantar/GPTQ ICLR
      2023, Kurtic ACL 2025, Turpin NeurIPS 2023, Cunningham 2023, Lindsey et al./
      Anthropic 2025, Kadavath 2022, OpenAI GPT-4 report).
- [x] Cross-links to `how-an-ai-answer-is-verified` and `ocr-what-we-learned-and-what-the-literature-says`
      resolve.
- [x] `translations.ts` updated.
- [x] `publishDate` follows the corrected Thursday-weekly cadence (2026-08-27).

## Resolution

Published 2026-08-12 (`draft: false` in both languages, per owner instruction to
publish directly — "publícalo"). Written by a dispatched Fable-model agent, citations
independently re-verified by a second agent before publish (0 blockers). Live at
`/blog/como-funcionan-de-verdad-la-inferencia-y-la-interpretabilidad/` and
`/en/blog/how-inference-and-interpretability-actually-work/`.
