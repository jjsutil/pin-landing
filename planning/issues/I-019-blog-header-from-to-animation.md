---
id: I-019
type: spike
status: backlog
impact: low
cost: low
epic: E01
created: 2026-08-07
---

# Blog header: animated "from → to" — request recorded, scope never captured

`impact: low` — a decorative treatment on one header, not a flow; provisional until
the request is understood (re-classify when it is).
`cost: low` — provisional, same reason. A text-swap animation in the blog header is a
small front-end change; if the request turns out to mean something structural, this
estimate does not hold and the issue should be re-scoped, not stretched.

> [!IMPORTANT]
> **Answered by the owner, 2026-08-07** (verbatim): *"considera más palabras que hagan
> juego con la frase, versiones en y es"*. So the mechanic is reading 2 below — an
> animated word swap inside a "from → to" construction in the blog header — and the
> work is **choosing the word pairs**, in Spanish and English, not inventing an
> interaction. What is still unstated is the fixed part of the phrase; propose it
> together with the word sets rather than guessing it in code.

## Context

The request appears in `HANDOFF.md` twice — 2026-08-07, in the I-013 checkpoint
("El pedido de 'from → to' animado en el header del blog — explícitamente dejado para
la otra sesión paralela, no tocado acá") and again in the I-016 checkpoint as still
untaken. Neither records what it should do, and no design doc, screen spec or prototype
in this repo mentions it.

The blog header today is `src/components/BlogList.astro`: an eyebrow (`Blog`) and an
`h1` ("Ideas y guías de pin" / "Ideas and guides from pin"). There is a working
typing-effect elsewhere on the landing (`src/scripts/main.ts`) that would be the
obvious existing mechanism to reuse if this is a text animation — but that is an
inference, not the request.

## The question to resolve first

What does "from → to" animate between? Plausible readings, none confirmed:

1. The `h1` **morphs between two phrasings** (a "from X to Y" claim), as a typing or
   crossfade effect.
2. It is literally the words **"from" and "to"** — e.g. a before/after framing of what
   pin does ("from expediente to answer").
3. It refers to the **date range** of the archive (from the oldest post to the newest),
   animated in the header — which would tie into the timeline view (I-013/I-016).

Reading 3 would also interact with I-014 (featured ordering) and should be sequenced
after it; readings 1 and 2 are independent.

## Scope, as answered

- A **word set**, not a one-off phrase: several pairs that read well in the same
  construction, so the header can cycle through them. Proposed in **both languages** —
  and translated pairs rarely survive the trip, so the English set is written as
  English, not as a rendering of the Spanish one.
- The words carry the product's claim (what a case file goes *from*, what it becomes),
  so they are copy, not decoration. They belong in `src/i18n` next to the rest of the
  verbatim copy, never inlined in the component.
- Animation: reuse the typing/swap machinery already in `src/scripts/main.ts` rather
  than adding a second one. It must be gated by static mode (`html.perf-lite`,
  I-004) — a looping header animation is exactly the continuous cost that mode exists
  to remove — and must degrade to a single static pair, never to an empty header.
- Present the candidate sets to the owner **before** implementing. He picks; that is
  the decision this issue is really waiting on.

## Anti-scope

- Not a new animation engine, and not a change to the landing's hero (this is the blog
  header only).
- Not a rewrite of the blog `h1`'s meaning — the new construction sits with it, or
  replaces it only if the owner says so explicitly.

## Acceptance criteria

- [x] The request is written down in the owner's own terms in this file.
- [ ] A candidate word set exists in ES and EN, with the fixed part of the phrase
      proposed alongside it, and the owner has picked.
- [ ] Copy lives in `src/i18n`; the animation reuses the existing mechanism.
- [ ] Static mode and `prefers-reduced-motion` render one static pair, no loop.
- [ ] `impact`/`cost` re-classified against the picked scope, with the rationale.

## Proposal — candidate word sets (2026-08-07, awaiting owner pick)

Not implemented — this is the copy decision the issue is waiting on. Reading 2
(the header literally cycles "from X to Y", the product's before/after claim), per
the owner's answer above. Each pair keeps the same syllable-weight-ish balance on
both sides so the swap doesn't visibly resize the header.

**Fixed phrase (ES):** `De {X} a {Y}.` — replaces the current h1 outright rather
than sitting beside it; short enough that the swap reads instantly.

**Fixed phrase (EN):** `From {X} to {Y}.`

**Candidate pairs — ES (written natively, not translated from the EN set below):**

| # | De | a |
|---|---|---|
| 1 | expediente | respuesta |
| 2 | papel | precedente |
| 3 | la foja | el hallazgo |
| 4 | escaneo | certeza |
| 5 | carpeta | criterio |
| 6 | archivo | evidencia verificable |

**Candidate pairs — EN (written natively, not a rendering of the ES set):**

| # | From | to |
|---|---|---|
| 1 | case file | answer |
| 2 | paper | precedent |
| 3 | scanned | searchable |
| 4 | backlog | brief |
| 5 | stack | structure |
| 6 | evidence | verified |

Pairs 1 and 2 in each language read as the strongest defaults if the owner wants a
single one rather than a cycling set — 1 names the product's core mechanic
(unstructured document → answer), 2 has the most weight for a technical/legal
reader. Pairs 3–6 lean further into specific angles (searchability, workload,
verifiability) and work better as *additional* pairs in a cycling set than as the
lead pair.

**What's needed from the owner:** which pairs (any number, in order) go into each
language's cycling set — reusing pair index across languages isn't required, they
don't have to correspond 1:1.
