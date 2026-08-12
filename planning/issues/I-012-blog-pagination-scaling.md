---
id: I-012
type: feature
status: staging
impact: high
cost: high
epic: E01
created: 2026-08-07
---

`impact: high` — **raised from `low` on 2026-08-12**, when the owner scheduled the work:
this is no longer a dormant scaling note but a change to how every visitor browses the
blog, and it turns the topic filter into shareable URLs. (`medium` is not a value this
schema has — `.claude/repo-conventions.md:50-51`, binary — so the earlier `cost: medium`
below is corrected to `high` in the same pass.)
`cost: high` — four new routes, a component that stops owning its own data, a new URL
vocabulary for topics, and the tag filter rewritten from client-side state to links.

# Blog pagination doesn't scale past ~20 posts

## Context

I-011 shipped a client-side "Show more" button: the listing renders all posts into the
DOM at build time and reveals the first 10, then unhides the rest on click. That reads
fine at 6 posts and is still fine at ~20, but the underlying pattern is "ship the whole
list to the browser, hide most of it with CSS/JS" — it doesn't get cheaper as the blog
grows, and past a few dozen posts the listing page's payload and initial DOM size start
to matter (identified in I-011's own PR body as a known limitation, not a defect at
ship time).

## Scope

- **Owner decision (2026-08-07):** approach confirmed — Astro-native `paginate()`,
  build-time (routes like `/blog/2`, `/en/blog/2`), no server. "Backend" is the
  build/routing layer `paginate()` generates; "frontend" is the prev/next controls on
  the listing page. The site stays 100% static either way.
- **Owner decision (2026-08-07, follow-up round):** the prev/next control reads as a
  dot row, not text arrows — the current dot (page) colored/highlighted, the rest
  plain. Still `paginate()`'s build-time routes underneath; this only changes how the
  control between pages looks, not the routing mechanism.
- **Scheduled and built 2026-08-12** (this section previously said "still not
  scheduled … 6 posts today", which stopped being true on both counts). Decisions taken
  that day, all the owner's:
  - **Page size 6** — two rows of three on the ~3-column grid. With 10 published posts
    that is the first configuration where the control is visible at all: at the old
    `PAGE_SIZE = 10` the "Ver más" button never even rendered.
  - **Topics become routes too** — `/blog/tema/<slug>`, `/en/blog/topic/<slug>`,
    paginated the same way. Forced, not cosmetic: a client-side filter over a page that
    ships 6 cards would search 6 posts instead of the blog. Chips are `<a>` now, and a
    topic is a shareable URL.
  - **The active dot is marked by colour only** — asked for explicitly over the
    alternative of elongating it into a segment.
  - **Native View Transitions** for the page change (`@view-transition`), no JS.
- Applies to the grid/showcase view (I-014) — I-013's timeline view is a separate,
  unpaginated, scroll-only surface by design and isn't affected by this issue.

## Anti-scope

- Not an immediate fix — this issue exists to track the concern, not to schedule work
  ahead of the actual scaling pressure (currently 6 posts, non-issue).
- Not a CMS or search feature — same content-layer approach as the rest of the blog
  (I-001, I-007's anti-scope) unless a future issue argues otherwise.

## Acceptance criteria

- [x] Revisit once the blog approaches ~20 published posts, **or sooner if the owner
      asks** — he asked on 2026-08-12, at 10 posts.
- [x] Chosen approach documented here before implementation — Astro-native
      `paginate()`, decided 2026-08-07: no new dependency, native content-collection
      support, keeps the site static.
- [x] `npm run build` exits 0; both locales and the topic routes work post-change.
- [x] Page 1 ships exactly 6 cards and page 2 the remaining 4, with **none hidden** —
      the rest are not shipped at all, which is the payload win this issue was for.
- [x] Every dot is a ≥24×24px hit target with a unique accessible name, and
      `aria-current="page"` follows the page.
- [x] Every card on a topic route carries that topic; the chip row still lists every
      topic, because it is the way out of the one you are in.
- [x] The timeline (I-013/I-026/I-027) does not regress: unpaginated, scoped to the
      route, first post focused at scroll 0.
- [x] Verified by mutation — page size 10 collapses the paging checks, removing the
      24px box fails the hit-target assert, removing `aria-current` fails the state
      assert.

## Known limits, not built

- **No dot-row truncation.** The row grows one dot per 6 posts; 30 posts is 5 dots. A
  truncation rule (`1 … 4 5 6 … 12`) is worth writing when the row actually gets long,
  not before.
- **The active dot is distinguished by colour alone**, per the owner's explicit call.
  `aria-current="page"` carries the state programmatically, so assistive tech is
  unaffected; a sighted user with a colour-vision deficiency relies on the
  accent/line-hard contrast.
- **Topic routes are per-locale and not cross-linked** — ES and EN carry different tag
  vocabularies ("Herramientas de IA" vs "AI Tools"). The language switch already sends
  any blog URL to the other locale's blog root, which degrades correctly.
