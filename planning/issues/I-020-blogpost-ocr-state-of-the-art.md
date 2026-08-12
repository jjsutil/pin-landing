---
id: I-020
type: feature
status: review
impact: high
cost: high
epic: E01
created: 2026-08-07
---

# Blog post — OCR: what we learned, and what the literature actually says

`impact: high` — first post on this blog written for a technical peer rather than for a
lawyer; it is the piece that makes pin credible to the engineers and CTOs who evaluate
tools, and it is user-visible on a core surface.
`cost: high` — not a copy task. It requires reading and verifying primary literature,
and every claim carries a citation that must resolve; the writing is the small part.

## Context

Owner request, 2026-08-07. The blog today speaks to lawyers — including
`como-se-lee-un-expediente-escaneado.md` / `how-a-scanned-case-file-is-read.md`, which
explains OCR to a non-technical reader. This is the opposite audience and must not
repeat it: **read that post first and differentiate deliberately**, linking to it
rather than re-explaining what OCR is.

## Scope

**Subject.** Lessons learned building OCR for real case files, and advice for someone
facing the same problem — grounded in the current state of the art, with references.
Not a product pitch: someone who never uses pin should still come away with something
they can apply on Monday.

**Point of view — revised, owner decision 2026-08-12 (chat).** Originally scoped as a
single named voice with an astrophysics background (see git history for the original
text). The owner chose the collective byline instead ("opción 1 pero sin otra persona.
Solo el founder team") — no new persona file, no astrophysics framing at all. Written
as the pin team, the way an engineering team writes when it has actually shipped the
thing. The reader is assumed to have a rigorous scientific background and does not need
"what is a neural network" explained.

**Content it should cover** (shape, not a table of contents to follow literally):

- Where OCR actually fails on real documents, as opposed to on benchmarks: skew,
  stamps over text, photocopy-of-photocopy degradation, marginalia, tables, rotated
  pages, mixed handwriting.
- The benchmark-vs-reality gap itself — why a reported CER/WER does not predict
  behaviour on this corpus, and what to measure instead.
- What the current literature supports: where end-to-end/transformer document models
  stand against classical pipelines, what document-understanding models add beyond
  character recognition, and where the honest limits are today.
- Practical advice: how to build an evaluation set that is not a lie, what to measure
  (character vs. word vs. field-level vs. downstream-task accuracy), when preprocessing
  still pays, when a human loop is the correct engineering answer rather than a defeat.
- What we got wrong. A post of this kind is worthless without at least one real,
  specific, costly mistake stated plainly.

**Citations — the hard constraint.**

- Peer-reviewed or otherwise properly published work, cited with DOI or arXiv ID.
- **Every reference must be verified to exist before it is written down**: fetch it,
  confirm title, authors, venue and year, and confirm the paper actually says what the
  post attributes to it. A citation that was not opened does not go in.
- Prefer primary sources over surveys where a specific claim is made; a survey is fine
  for framing the field.
- The state of the art moves faster than any model's training data — **search, do not
  recall**. Anything asserted as "current" is checked against what is actually
  published at the time of writing.
- A claim from our own experience is labelled as ours, never dressed as a finding.

**Sourcing for "what we got wrong" — owner-directed, 2026-08-12.** The owner pointed
directly at the private `foja` repo (`~/Projects/foja`) as the source for real
engineering material — architecture, a real dirty-document postmortem, four real
bugs — read via a read-only exploration pass, with an explicit instruction to protect
anything commercially sensitive while still landing something substantive. What made
it into the post: the cascade architecture (native → classical OCR → VLM, confidence-
routed, no exact model/vendor names used), a qualitative description of a bake-off
against three newer open-source tools (no tool names, no exact accuracy numbers — one
lost on Spanish-language handling, two had licensing/dependency blockers), and the
four real bugs from a documented dirty-scan postmortem (two public, non-confidential
court filings used as test material — neither the case nor the court is named).
**Deliberately left out:** exact CER numbers, the specific OCR/VLM engine names, and
the specific court/case the test documents came from — all confirmed real in the
source repo but held back as a conservative default pending the owner's explicit
sign-off, since this is the first post in this repo sourced from a private codebase
rather than from public material or the owner's own dictation.

**Deliverable.** Spanish and English versions (`src/content/blog/es/` and
`src/content/blog/en/`), both `draft: true` pending owner approval of the copy — the
established pattern for every post in this repo. Frontmatter per the existing schema
(`title`, `slug`, `excerpt`, `publishDate`, `author`, `tags`, `draft`,
`readingMinutes`). Tags reuse the existing vocabulary where they fit.

## Anti-scope

- Not a change to the blog's layout, listing, tags or routing.
- Not a benchmark run: this post reports what we learned and what is published, it does
  not claim new measurements we have not made.
- No numbers about pin's own accuracy unless they are real, reproducible, and the owner
  approves publishing them.
- Not published: it ships `draft: true`.

## Acceptance criteria

- [x] ES and EN versions exist, `draft: true`, valid frontmatter, `astro check` and
      `npm run build` pass.
- [x] Every citation resolves and was opened; the claim attributed matches the source.
      The verification evidence goes in the PR body. Four sources used: TrOCR (Li et
      al., AAAI 2023), DocLayNet (Pfitzmann et al., KDD 2022), a 2025 survey on QA over
      visually rich documents (Barboule et al.), and OHRBench (Zhang et al., ICCV 2025
      — already cited in the lay-audience post, reused here for the deeper claim).
- [x] The post does not overlap the existing lay-audience OCR post; it links to it.
- [x] No astrophysics framing anywhere in the text — moot, no persona used at all
      (owner decision above).
- [x] At least one concrete mistake of ours is stated, with what it cost and what
      replaced it — four, from the foja postmortem (see Sourcing above).
- [x] A reader who never uses pin gets something applicable.
- [ ] **New — owner reviews what was sourced from the private `foja` repo before
      `draft` flips to `false`.** Same copy-approval gate every post uses, called out
      separately here because the source is different from every prior post.
