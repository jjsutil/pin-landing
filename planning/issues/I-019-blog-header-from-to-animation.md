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

> [!WARNING]
> **This issue exists to stop the request from being lost, not because it is ready to
> work.** Do not implement from this file. The owner's actual words were never written
> down, and nothing in the repo defines what "from → to" refers to.

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

## Next step

Ask the owner, in one line, which of the above it is (or what it actually is), write
the answer into this file, re-classify `impact`/`cost`, and only then plan the PR. If
the answer arrives with a visual intent rather than a mechanism, an Artifact with 2–3
options — the way I-013's design was settled — is the cheaper path to a decision than
a code prototype.

## Acceptance criteria

- [ ] The request is written down in the owner's own terms in this file.
- [ ] `impact`/`cost` re-classified against the real scope, with the one-line rationale.
- [ ] Either a plan exists, or the issue is closed as "not wanted" — recorded either way.
