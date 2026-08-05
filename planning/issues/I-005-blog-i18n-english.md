---
id: I-005
type: feature
status: backlog
impact: high
cost: high
epic: E01
created: 2026-08-05
---

# Blog i18n — English posts and a structure that scales past one language

## Context

Owner feedback (2026-08-05, verbatim): "el blog no está en inglés ni permite escalar
esta sección." The site already has an `/en/` route for the landing (bilingual by
design, `i18n: es default, en` — see `planning/plans/E01-blog.md`), but the blog was
shipped ES-only in I-001/I-002/I-003 as an explicit v1 decision ("ES only for v1... do
not scaffold empty EN routes ahead of content" — E01 anti-scope). That decision is now
revisited: the owner wants the blog itself to reach English readers, and wants the
underlying structure (routes, content collection) to not be a one-language special case.

## Scope

- Extend `src/content.config.ts` / the blog content collection so posts are keyed by
  locale instead of assuming `es` — the current `src/content/blog/es/*.md` layout is the
  thing that doesn't scale; fix the structure, not just add files.
- `src/pages/blog/index.astro` and `[slug].astro` (and their `/en/` counterparts) render
  from the locale-aware collection, consistent with how the rest of the site already
  splits `/` vs `/en/`.
- Translate the two existing posts (I-002, I-003) into English through the same
  collection, `BlogLayout.astro` unchanged in structure.
- Footer `Blog` link in the `/en/` variant points at the English listing.

## Anti-scope

- Not a general multi-language framework (only es/en, matching the rest of the site).
- Not new content beyond translating the two existing posts — new EN-only posts are a
  separate, later issue.
- Does not touch comments or CTA/interaction (I-006) or listing navigability (I-007).

## Gate

**English copy requires the owner's explicit approval before publishing**, same
criterion already applied to I-002/I-003: draft stays `status: backlog`/`draft: true`
until the owner reviews and OKs the translated copy in conversation — a straight machine
translation is not sufficient sign-off given the legal-audience tone the ES posts were
tuned for.

## Acceptance criteria

- [ ] Content collection accepts posts per locale without a hardcoded `es/` assumption
      in the loader glob.
- [ ] `/en/blog` lists the translated posts; `/en/blog/[slug]` renders each via
      `BlogLayout.astro`.
- [ ] Both translated posts reviewed and approved by the owner before `draft: false`.
- [ ] `npm run build` exits 0 with both locales present in the build output.
- [ ] `planning/BOARD.md` / README summary regenerated once this lands (rule 7).
