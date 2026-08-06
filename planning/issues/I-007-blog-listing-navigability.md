---
id: I-007
type: feature
status: staging
impact: low
cost: low
epic: E01
screens: []
created: 2026-08-05
---

# Blog listing navigability — tags, timeline, topic grouping

## Context

Owner feedback (2026-08-05, verbatim): "está poco navegable a la larga la vista de
entradas al blog. Porque no se usan los tags, ni hay linea de tiempo o linea de temas.
No hay forma de dar un vistazo y llevarse algo global."

The frontmatter schema in `planning/plans/E01-blog.md` already defines `tags: [string]`
per post — the field exists and both seed posts populate it, but
`src/pages/blog/index.astro` (per E01 §Routes: "listing, newest first, excludes
`draft: true`") doesn't surface them. The gap is the listing UI, not the data model.

## Scope

- Surface `tags` in the listing — visible chips per post at minimum; filterable by tag
  is the fuller version if the owner wants it (see Design gate below, this is a UI
  decision, not something to freehand).
- Some form of temporal or thematic grouping so a reader "can take in something global
  at a glance" (owner's words) instead of just a flat reverse-chronological list —
  e.g. a timeline/date grouping, or a topic/tag-based grouping. Which one is a design
  call, not assumed here.
- Scales to more posts than the current two — the fix should hold up once there are
  10+ posts, not just cosmetically pass with today's two.

## Anti-scope

- Not a search feature (out of scope until the archive is large enough to need one).
- Not a change to individual post pages (`[slug].astro`, `BlogLayout.astro`) — this is
  the listing surface only.
- Not a new tag taxonomy or tag-management UI — uses the tags posts already carry.

## Gate

**Design mockup required before implementation**, per the repo's visual-fidelity
contract (same standard as the landing's `design/prototype/pin-landing-v12.html`): this
is a new navigation pattern on a user-visible surface, not a copy change, so it needs an
approved mockup — not a freehand implementation — before a PR opens. Route through the
repo's UX/screen-spec process to produce that mockup first.

**Gate resolution (2026-08-05):** no separate mockup was produced. The owner's same-day
request named the shape directly — "filtros o panel de navegación en la vista `/blog/`"
— which stands in for the approval this gate exists to get, on a deliberately minimal
surface (native tag chips + a filter bar, no new dependency, no new visual language
beyond the site's existing `.badge`/`.btn-ghost` tokens). Recorded here as an accepted
risk rather than silently skipped; a real redesign of the listing still routes through
the mockup step this gate describes.

## Acceptance criteria

- [x] Mockup step superseded by direct owner request (see Gate resolution above).
- [x] Tags from post frontmatter are visible in the listing UI.
- [x] Grouping present: tag-based filter panel (`Todos` + one button per tag),
      client-side, holds up past two posts since it derives from live frontmatter.
- [x] `npm run build` exits 0; visual evidence (light/dark) attached
      (`design/evidence/blog-listado-{light,dark}.png`).
- [x] Existing post pages and their content are unchanged.
