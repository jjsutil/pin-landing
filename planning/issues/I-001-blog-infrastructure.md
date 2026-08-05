---
id: I-001
type: feature
status: staging
impact: high
cost: low
epic: E01
created: 2026-08-05
---

# Blog infrastructure — content collection, routes, footer entry

`impact: high` — new distribution channel (SEO, direct relationship with prospects),
unblocks I-002 and I-003.
`cost: low` — one Astro content collection, two routes, one layout, one footer link;
no new runtime dependency, no backend.

## Context

See `planning/plans/E01-blog.md` for the full architecture decision. Owner request,
2026-08-05: a blog reachable **only** from the footer, standardized post format, so the
owner can keep sending topics that become new posts without re-deciding format each time.

## Scope

- `src/content.config.ts` — `blog` collection (`glob` loader, `src/content/blog/es/*.md`),
  zod schema per E01's frontmatter table.
- `src/pages/blog/index.astro` — listing (newest first, `draft: true` excluded).
- `src/pages/blog/[slug].astro` — post page.
- `src/components/BlogLayout.astro` — title, byline, date, computed-at-write reading
  time, tag chips, article body. Reuse `src/styles/global.css` tokens; no new palette.
- One link in `Footer.astro` → `/blog`, in the existing internal-links column.
- One `draft: true` smoke-test post so the collection/build can be verified end-to-end
  before I-002's real content lands.

## Anti-scope

- No `/en/blog` — ES only until an English post exists (E01).
- No MDX dependency — plain Markdown with inline HTML/SVG for diagrams.
- No comments, no newsletter signup, no CMS.
- Does not touch the hero page or anything governed by the v12 fidelity contract.

## Acceptance criteria

- [x] `npm run build` and `npx astro check` both exit 0 with the new collection + routes.
- [x] `/blog` lists posts newest-first, excludes any `draft: true`.
- [x] `/blog/<slug>` renders a post through `BlogLayout.astro` with title, byline
      (the smoke post uses test authorship; "Equipo fundador de pin" lands with I-002/I-003),
      date, reading time, tags.
- [x] The **only** link to `/blog` anywhere in the built site is the new footer link —
      grep the built output to confirm no header/nav/CTA references it.
- [x] Footer link visible, light + dark, ES (screenshot evidence per rule 6).
- [x] Smoke-test draft post proves the pipeline end-to-end but is excluded from the
      built listing (verify by checking the built `/blog/index.html` does not mention it).
