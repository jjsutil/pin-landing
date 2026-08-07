---
id: I-014
type: feature
status: backlog
impact: low
cost: low
epic: E01
created: 2026-08-07
---

`impact: low` — reorders posts the owner already controls via `publishDate`; no new
content, no new route, affects display order only.
`cost: low` — one new optional frontmatter field plus a sort-key change in
`BlogList.astro`; no new dependency, no schema migration for existing posts (field is
optional, defaults to unpinned).

# Blog listing — pinned/featured ordering

## Context

Owner decision (2026-08-07, same round as I-013): the current tag-filtered card-grid
listing becomes the "showcase" view — posts the owner pins, shown first, ahead of the
default reverse-chronological order. The owner also asked for ordering by view count;
deferred (see I-015 — the site has no backend or analytics today, per I-011's own "no
visit counter by design" decision, so that needs its own investigation before it's
buildable, not a quick add here).

## Scope

- An optional `pinned: boolean` (or `pinnedOrder: number`, TBD at `pr-plan` time —
  boolean is simpler if ordering among pinned posts can just fall back to
  `publishDate`; a number is needed if the owner wants to hand-order pinned posts
  independently of date) field on the blog content collection schema.
- Sort: pinned posts first (in `pinnedOrder` or `publishDate` order, per the field
  chosen above), then the rest in the existing `publishDate` descending order.
- Applies to the grid/showcase view only (`BlogList.astro`'s card grid) — not the
  timeline view (I-013), which stays purely chronological by design.
- Applies to both `/blog` and `/en/blog`; a post pinned in one locale doesn't need to
  be pinned in the other (independent frontmatter per locale, matching how the rest of
  the collection already works).

## Anti-scope

- No view-count/analytics-based ordering — that's I-015, not this issue.
- No UI for the owner to pin posts (no admin panel) — pinning is a frontmatter edit,
  same as every other post field in this repo.
- Doesn't touch I-013's timeline view or I-012's pagination.

## Acceptance criteria

- [ ] `pinned`/`pinnedOrder` field added to the blog collection schema (both `blog` and
      `blogEn` collections), optional, default unset/false.
- [ ] Grid listing sorts pinned posts first, unpinned posts after in the existing
      `publishDate` descending order.
- [ ] No visible change to the listing when no post is pinned (verifies the default
      falls back to today's behavior exactly).
- [ ] `npm run build` exits 0; both locales.
- [ ] Visual evidence (light + dark) showing at least one pinned post ordered ahead of
      a more recent unpinned one.
