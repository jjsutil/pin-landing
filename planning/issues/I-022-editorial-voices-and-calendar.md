---
id: I-022
type: chore
status: review
impact: high
cost: low
epic: E01
created: 2026-08-11
---

# Editorial voices — author persona system + editorial calendar

`impact: high` — foundational for every future named-voice post, including I-023;
without a shared pillar/cadence structure, adding named bylines one at a time drifts
the blog into disconnected posts instead of one publication.
`cost: low` — docs-only, no code or schema change.

## Context

Owner request, 2026-08-11 (chat). Six posts published under one collective byline
("pin Founding Team" / "Equipo fundador de pin"). The owner wants some future posts
written in the first-person voice of specific board/team members — starting with
Founder & CEO Alicia Chang Cox — and a defined structure so a year of posts across
pillars and voices reads as cohesive rather than improvised post-by-post.

## Scope

- `planning/authors/TEMPLATE.md` — fields every persona file must have before a post
  can be written in that person's voice.
- `planning/authors/alicia-chang-cox.md` — first persona, built from the bio/career
  the owner pasted in chat (2026-08-11): Carey, Banco de Chile, Harvard JD, Grab
  founding board (iLab), Uber, Stripe, pin. Voice guide and boundaries (what must
  never be invented under this byline).
- `planning/plans/E01-editorial-calendar.md` — pillar taxonomy, default voice per
  pillar, cadence, near-term queue. Companion to `E01-blog.md`, not a duplicate
  pillar plan (rule 10) — that doc keeps architecture, this one keeps editorial
  judgment.
- Reconcile `E01-blog.md`: the "byline, not anonymous" and "ES only for v1" bullets
  were stale (EN shipped in I-011; named bylines are now policy, not just collective).

## Anti-scope

- No `content.config.ts` schema change — `author` is already a free string.
- No second persona beyond Alicia in this issue — the template exists so the next one
  (e.g. a named engineering voice for I-020) is fast to add, not so several get
  invented speculatively now.
- Not a byline UI redesign (photo, title chip, LinkedIn link on the post page) — text
  byline only, matches what exists today.
- No fabricated full-year post list — the calendar fixes pillar mix and cadence, not
  invented titles for posts that don't have a real hook yet.

## Acceptance criteria

- [ ] `TEMPLATE.md` exists with the fields every future persona fills.
- [ ] `alicia-chang-cox.md` exists; every fact traces to the owner's 2026-08-11
      message, no invented specifics.
- [ ] `E01-editorial-calendar.md` states pillars, default voice per pillar, cadence,
      and the near-term queue only (not a fabricated full-year list).
- [ ] `E01-blog.md`'s stale bullets corrected and linked to the calendar doc.
- [ ] `planning/BOARD.md` and the README summary regenerated.
