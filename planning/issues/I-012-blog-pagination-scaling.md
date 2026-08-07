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

- Decide the actual fix once the post count is close enough to matter: real
  pagination (`/blog/page/2`, etc., astro-native `paginate()`) is the most likely
  candidate since it needs no new dependency and Astro supports it natively for
  content collections.
- Applies to both `/blog` and `/en/blog` (and the tag-filtered view, which I-011
  explicitly exempted from pagination — revisit whether that still holds at scale).

## Anti-scope

- Not an immediate fix — this issue exists to track the concern, not to schedule work
  ahead of the actual scaling pressure (currently 6 posts, non-issue).
- Not a CMS or search feature — same content-layer approach as the rest of the blog
  (I-001, I-007's anti-scope) unless a future issue argues otherwise.

## Acceptance criteria

- [ ] Revisit once the blog approaches ~20 published posts (`draft: false` count in
      `src/content/blog/es/`), or sooner if the owner asks.
- [ ] Chosen approach documented here before implementation (astro `paginate()` vs.
      alternative) with a one-line reason.
- [ ] `npm run build` exits 0; both locales and the tag filter still work post-change.
