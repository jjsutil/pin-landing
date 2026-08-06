---
id: I-010
type: feature
status: staging
impact: high
cost: low
epic: E01
created: 2026-08-06
---

# Blog posts 4–6 — verification method, confidentiality/data residency, OCR fidelity

`impact: high` — three more posts in the same trilogy-continuation E01 has been running
since I-002/I-003/I-008: each answers the operational question the previous post left
open (how do you actually verify, where does the file go, how is it read in the first
place).
`cost: low` — content only, infra already built by I-001. No schema, route or layout
change; tags/filter/share already shipped by I-006/I-007.

## Context

Owner supplied the three drafts verbatim (`blogposts.zip`, delivered via chat), each
with a suggested-metadata comment block (slug, title, meta-description, tags, author,
date, reading time). Owner approval for publication is the delivery of the drafts for
this purpose, matching the I-008 precedent (owner's request to publish IS the approval).

## Scope

- `src/content/blog/es/como-se-verifica-una-respuesta-de-ia.md` (post 4) — how a
  professional actually verifies an AI answer, and why the cost of verification (not the
  accuracy rate) is the number that decides whether a tool helped.
- `src/content/blog/es/que-pasa-con-su-expediente-cuando-lo-sube.md` (post 5) — data
  residency and confidentiality: what happens to an uploaded case file, tied to the May
  2025 OpenAI/NYT retention order and Chile's Ley 21.719 (effective Dec 2026).
- `src/content/blog/es/como-se-lee-un-expediente-escaneado.md` (post 6) — OCR fidelity:
  why the read step decides everything downstream, CER, and the three failure modes of
  the industry-standard single-engine approach.
- Maquetación only: frontmatter mapped 1:1 from each draft's suggested-metadata block
  (title, excerpt = meta-description, publishDate 2026-08-06, author, tags, draft:false,
  readingMinutes). Redundant body `# H1` dropped (duplicate of frontmatter title,
  matches existing 3-post pattern) and internal cross-links converted from absolute
  `jjsutil.github.io/pin-landing/...` URLs to the established relative `../slug/` form.
  No prose edited.

## Tags — two taxonomy additions

Owner's own suggested tags for posts 5 and 6 introduce two tags not in the existing set
(`Responsabilidad profesional, Regulación, Verificabilidad, Ventana de contexto,
Herramientas de IA, Inteligencia artificial, Fundamentos, Criterio profesional`):

- **Confidencialidad** (post 5) — no existing tag covers data residency/retention.
- **OCR** (post 6) — no existing tag covers document-reading fidelity.

Both are on-topic for their post and don't overlap an existing tag; adopted rather than
substituted with a poorer-fit existing one. Flagged here per repo convention rather than
silently extended.

## Anti-scope

- Not a pin pitch beyond the architectural principles already established in I-002/I-003
  (posts 5 and 6 do describe pin's own confidentiality/OCR design decisions, as owner-
  written — this mirrors I-008's non-pitch bar: no price, no capability claim beyond what
  the post's own argument requires).
- No English versions (E01 anti-scope: ES only for v1).
- No new routes/schema/tag-filter changes — I-006/I-007 infra reused as-is.

## Acceptance criteria

- [x] Owner-authored copy shipped verbatim (delivery of drafts = approval, I-008
      precedent); typos/deviations from the draft listed in the PR body.
- [x] Tags reused from the existing set where possible; two additions flagged above.
- [ ] `npx astro check` exits 0.
- [ ] `npm run build` exits 0.
- [ ] `scripts/check-gates.sh --base origin/main` run bare, exit 0.
- [ ] All 3 posts render at `/blog` (listing) and their own `/blog/<slug>` route locally.
- [ ] Visual evidence committed under `design/evidence/` (light + dark).
