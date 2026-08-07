---
id: I-012
type: feature
status: backlog
impact: low
cost: medium
epic: E01
created: 2026-08-07
---

`impact: low` — no visitor is affected yet; the blog has 6 posts today. This is a
scaling concern flagged ahead of time, not an active complaint.
`cost: medium` — client-side "show more" (I-011) doesn't fail cleanly at scale; a real
fix likely means either real pagination (new routes, page-numbered) or infinite
scroll, either of which touches the listing's data-fetch shape, not just its CSS.

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
- Still not scheduled — 6 posts today, well under the ~20-post threshold this issue set
  (see Acceptance criteria). The approach is settled so implementation can start on
  short notice whenever the owner says go, but this issue doesn't schedule that work.
- Applies to the grid/showcase view (I-014) — I-013's timeline view is a separate,
  unpaginated, scroll-only surface by design and isn't affected by this issue.

## Anti-scope

- Not an immediate fix — this issue exists to track the concern, not to schedule work
  ahead of the actual scaling pressure (currently 6 posts, non-issue).
- Not a CMS or search feature — same content-layer approach as the rest of the blog
  (I-001, I-007's anti-scope) unless a future issue argues otherwise.

## Acceptance criteria

- [ ] Revisit once the blog approaches ~20 published posts (`draft: false` count in
      `src/content/blog/es/`), or sooner if the owner asks.
- [x] Chosen approach documented here before implementation — Astro-native
      `paginate()`, decided 2026-08-07: no new dependency, native content-collection
      support, keeps the site static.
- [ ] `npm run build` exits 0; both locales and the tag filter still work post-change.
