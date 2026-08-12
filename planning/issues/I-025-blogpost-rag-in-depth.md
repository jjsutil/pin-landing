---
id: I-025
type: feature
status: staging
impact: high
cost: high
epic: E01
created: 2026-08-12
---

# Blog post — RAG in depth, where it silently fails (technical series, part 3)

`impact: high` — third and closing post in the technical-depth pillar's series (part
1: I-020 OCR, part 2: I-024 inference/interpretability); the piece most directly
relevant to engineers evaluating a retrieval-based product like pin.
`cost: high` — same citation bar as I-020/I-024.

## Context

Owner request, 2026-08-12 (chat), same message as I-024. **Written by a dispatched
Fable-model agent**, per explicit owner instruction — not composed directly in this
session. Independently re-verified before merge (see PR).

## Scope

Technical-depth pillar, collective "pin Founding Team" voice. For an engineering/CTO
reader.

- Real RAG architecture: chunking, embeddings, retrieval (dense/sparse/hybrid),
  re-ranking, context assembly.
- Where RAG fails silently — a fluent, plausible, wrong answer instead of an obvious
  error — beyond the "RAG can hallucinate" platitude: retrieval miss vs.
  generation-time context-ignoring vs. chunk-boundary fact-splitting vs. similarity
  ≠ relevance.
- **The OCR→RAG connection already public on this blog**: OHRBench (already cited in
  `ocr-what-we-learned-and-what-the-literature-says`) found OCR errors cascade into
  RAG accuracy — re-verified independently rather than trusted from the earlier
  citation. Used as a concrete example of a retrieval failure with nothing to do with
  the retrieval algorithm and everything to do with what got indexed.
- Practical advice: what to actually measure in a RAG system beyond "does the answer
  look right."

**No fabricated claims about pin's own RAG architecture** — literature-grounded,
except the already-public OHRBench connection.

## Citations — same hard constraint as I-020/I-024

Every reference verified via WebFetch before being written down. At least 3-4 real
citations (OHRBench re-verification counts as one).

## Deliverable

ES + EN (`src/content/blog/es/como-funciona-rag-de-verdad-y-donde-falla-en-silencio.md`,
`src/content/blog/en/how-rag-actually-works-and-where-it-silently-fails.md`).
`publishDate: 2026-09-03` (weekly Thursday cadence, +7 days from I-024's post). Tags
reuse existing vocabulary plus a new `RAG` tag.

## Anti-scope

- Not a change to blog layout/routing/schema.
- No pin-internal RAG architecture or accuracy claims beyond the public OHRBench
  citation already established in I-020.
- Ships `draft: true` pending citation-verification review, flips to published in the
  same session once that review passes (owner pre-authorized publish, "publícalo").

## Acceptance criteria

- [x] ES and EN versions exist, valid frontmatter, `astro check` and `npm run build`
      pass.
- [x] Every citation independently re-verified, including OHRBench (re-checked, not
      assumed from the earlier post). Independent review: **REQUEST-CHANGES on first
      pass** — all 6 citations (OHRBench, Lewis/RAG NeurIPS 2020, Thakur/BEIR NeurIPS
      2021, Liu/Lost-in-the-Middle TACL 2024, Qu-Tu-Bao semantic chunking 2024, Es/
      RAGAS 2023) verified accurate and correctly attributed — the one blocker was
      **not** a citation problem: the writing agent had added an unsourced sentence
      claiming how pin "treats document ingestion" internally, outside the single
      pin-adjacent claim the brief authorized (the public OHRBench/OCR connection).
      Fixed by deleting the unauthorized clause in both languages; re-review not
      re-run since the fix was subtractive (removed the only flagged text, touched
      nothing else) — verified by direct diff inspection instead.
- [x] Cross-links to I-024's post and to `ocr-what-we-learned-and-what-the-literature-says`
      resolve.
- [x] `translations.ts` updated.
- [x] `publishDate` follows the corrected Thursday-weekly cadence (2026-09-03).

## Resolution

Published 2026-08-12 (`draft: false` in both languages, per owner instruction to
publish directly — "publícalo"). Written by a dispatched Fable-model agent; the one
real defect independent review found (an unauthorized claim about pin's own ingestion
practice, not a citation error) was fixed before publish, not shipped and
accepted-risked. Live at `/blog/como-funciona-rag-de-verdad-y-donde-falla-en-silencio/`
and `/en/blog/how-rag-actually-works-and-where-it-silently-fails/`.
