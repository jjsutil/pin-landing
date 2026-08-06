---
id: I-008
type: feature
status: staging
impact: high
cost: low
epic: E01
created: 2026-08-05
---

# Blog post 3 — "A nadie lo sancionan por usar inteligencia artificial. Lo sancionan por firmar lo que no leyó."

`impact: high` — third post of E01 and the one that closes the trilogy's argument: I-002
defined the vocabulary, I-003 explained the mechanism and its limit, this one answers the
question the reader actually has to act on ("¿puedo usar esto y cómo?"). It is also the
post with the strongest inbound-search surface: it is pegged to a live Chilean news
event, in the reader's own jurisdiction, in the same week it happened.
`cost: low` — content only, infra already built by I-001. No schema, route or layout
change.

## Context

Owner brief (2026-08-05, verbatim): «es legal - es justo - es inteligente usar "IA" para
trabajar en 2026? Dónde está la "delgada línea"? existe "sweetspot"? [...] existen
artículos científicos que hayan medido este fenómeno? Existen registros en otros países?
Qué se está haciendo? Cuál es el estandar de la "industria" en legal? Conectemos con las
dos entradas anteriores al blog, y argumentemos bien.»

The owner supplied four seed sources on the Chilean case that motivates the post: a
lawyer filed 38.477 escritos into the Oficina Judicial Virtual over one weekend
(25–28/07/2026), the Comité de Jueces Civiles de Santiago asked the Corte Suprema to
prohibit AI-assisted filing, and the Corte Suprema is reviewing it.

**Editorial continuity.** This post is the third leg of a single argument and links back
to both predecessors explicitly:

- From I-002 (`que-es-machine-learning`): "«IA» no nombra una tecnología, nombra una
  promesa" — which is exactly why the word absorbs blame as easily as credit. The 38.477
  escritos were bulk automation, not a language model reasoning badly, yet the headlines
  and the remedy both say "IA".
- From I-003 (`por-que-ninguna-herramienta-le-sirvio`): the context window and
  compression are the mechanism behind fabricated citations — the post does not re-explain
  it, it points at it and moves to the professional consequence.

## Scope

- One Markdown file, `src/content/blog/es/es-legal-usar-ia-para-trabajar.md`, following
  I-001's frontmatter schema. Ships `draft: true`.
- Answers the owner's three questions in order — legal, justo, inteligente — and then
  locates the "delgada línea" and the sweetspot, rather than treating them as separate
  topics.
- Every factual claim carries an inline source link. No fact from memory.
- Argument spine (thesis): **the thin line has never been between using AI and not using
  it; it is between delegating work and delegating responsibility.** What can be verified
  against its source is legitimate; what cannot, is not — and that rule predates the
  tool.

## Title options

The shipped title is the first; the owner picks at approval. Slug is stable across all
three (`es-legal-usar-ia-para-trabajar`) — it is the owner's own question and the likely
search query, so it does not move if the title changes.

1. **«A nadie lo sancionan por usar inteligencia artificial. Lo sancionan por firmar lo
   que no leyó.»** — shipped. Follows the landing's negation-then-correction pattern
   (`thesis.h2`/`h2b`), and it is the literal holding of the Chilean precedent the post
   is built on: the Tercera Sala sanctioned a failure to verify, not the use of a tool.
2. «La delgada línea no pasa por la herramienta. Pasa por su firma.» — answers the
   owner's framing most directly; slightly more abstract, less anchored in evidence.
3. «Nadie va a prohibir la inteligencia artificial. Van a exigirle que la verifique.» —
   forward-looking, answers "qué se está haciendo"; the weakest of the three on the
   "justo" question because it frames the reader as regulated rather than responsible.

## Anti-scope

- **Not a pin pitch.** pin appears as an architectural principle already established in
  I-002/I-003 (everything read, everything cited to its page), never as a feature list,
  a price or a capability claim. No figure that could be read as a pin capability claim —
  the GTM §10.2 gate from I-002/I-003 still binds.
- Not a takedown of the sanctioned lawyer. The Chilean professionals involved are **not
  named** in the post even where the press names them: the argument is about the
  mechanism and the duty, and naming a private individual adds nothing to it.
- Not a legal opinion. The post explains what rules exist and what courts have done; it
  does not advise on compliance in a particular matter.
- Does not re-explain machine learning (I-002) or the context window (I-003) — links back.

## Acceptance criteria

- [x] **Owner approves the copy before publication.** 2026-08-05: owner's request to
      make all three posts visible IS that approval (see this PR's body). Flipped
      `draft: false` with no content change, as with I-002/I-003.
- [x] Owner picks the title from the three options above at approval — the owner's
      request approved the post as already shipped in PR #14, title option 1 as-is.
- [x] Every factual claim / predecessor links / reading time / jargon / no page-volume
      claim — verified in PR #14's own review before merge; unchanged here (no content
      edits in this PR, see its body).
- [x] `npm run build` exits 0; `scripts/check-gates.sh --base origin/main` run bare, exit
      0 (this PR).
- [x] Visual evidence committed under `design/evidence/` (light + dark), PR #14 for the
      post itself; this PR adds listing/share evidence for the surfaces it touches.
