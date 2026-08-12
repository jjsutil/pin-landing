---
id: I-023
type: feature
status: review
impact: high
cost: low
epic: E01
created: 2026-08-11
---

# Blog post 7 — founder's-voice thesis (Alicia Chang Cox)

`impact: high` — first named-founder post on the blog, and the flagship content the
owner asked for to have the CEO share on LinkedIn from her own profile.
`cost: low` — original narrative content, not a copy task, but no literature to
verify (unlike I-020, `cost: high`) — the source material is the owner's own career
facts, already gathered.

## Context

Owner request, 2026-08-11 (chat), same conversation as I-022. Depends on I-022's
`alicia-chang-cox.md` persona — this is the first post written under that voice, in
the "Company & founder vision" pillar of `E01-editorial-calendar.md`.

## Scope

- ES + EN versions in `src/content/blog/{es,en}/`, `draft: true` — the established
  pattern every prior post used; the owner flips it after reading.
- Content: why pin exists, told through Alicia's actual career pattern (Grab
  iLab → Uber → Stripe → pin) rather than as an abstract mission statement. Every
  specific fact or figure traces to `planning/authors/alicia-chang-cox.md`'s grounded
  facts — no invented anecdotes, quotes, or numbers.
- Internal cross-links to two existing posts that already evidence the industry-side
  claim (the OCR post and the 38,477-filing incident post) — reused evidence, not
  new claims.
- `translations.ts` — add the new slug pair (`por-que-empece-pin` ↔
  `why-i-started-pin`).

## Anti-scope

- No changes to `BlogLayout.astro` / `BlogList.astro` — byline renders as free-text,
  same as every other post.
- No product metrics beyond team size ($400K pre-seed, 22 people) and current
  footprint (Chile, Brazil, Peru, Argentina + North America/Europe expansion) — both
  owner-confirmed in this session and dated in the persona file.

## Acceptance criteria

- [ ] ES and EN posts exist, valid frontmatter, `astro check` / `npm run build` pass.
- [ ] Every specific fact traces to `alicia-chang-cox.md` or the owner's message.
- [ ] Owner approves copy before `draft` flips to `false` — same gate every prior post
      used.
- [ ] `translations.ts` updated; cross-link renders both directions.
