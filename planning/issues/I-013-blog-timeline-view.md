---
id: I-013
type: feature
status: backlog
impact: high
cost: high
epic: E01
created: 2026-08-07
---

`impact: high` — a second, owner-requested way to browse the blog, reachable via a
toggle from the main listing; directly shapes how visitors experience the archive
(schema is binary per `.claude/repo-conventions.md:50-51` — this clears the "user-visible,
shapes a core flow" bar for `high`, not a `medium` tier the schema doesn't have).
`cost: high` — new scroll-driven component (CSS + JS), no new dependency, but genuinely
new interaction code (scroll-position math, focus/blur state, hover behavior), not a
copy/config change — clears `high` on the same binary schema.

# Blog timeline view — vertical, scroll-driven, no dots

## Context

Owner request (2026-08-07): a "blog slider" for browsing posts — vertical,
timeline-based, explicitly **not** dots/page-numbers ("too old"). Landed on a design
after three rounds of iteration in a shared Artifact
(https://claude.ai/code/artifact/38daa1e2-2042-4fd7-8735-712fd79c1e28 — private,
owner-only): five initial directions (spine, ledger, story capsule, margin column,
accordion), then a refined build combining the margin-column date gutter with a
scroll-driven focus effect and an animated progress spine.

Owner decision (2026-08-07, follow-up round): this view **replaces** tag filtering for
itself — no tags in the timeline, reachable via a button from the main listing (see
I-014 for what that main listing becomes). Also: respect the site's existing color
tokens only (no new colors, no glow/shadow effects — "discrete", "thin line,
transparency"), show at least 4 posts on screen at once, and keep the blur/zoom focus
effect subtle.

## Scope

- A new view for `/blog` and `/en/blog`, toggled in via a button (not the default —
  see I-014 for what the default view is).
- Layout: right-aligned date column + content column, divided by a thin vertical line
  (`var(--line-soft)`) in the gutter between them — no nodes/dots on it.
- The divider's accent-colored twin grows over it as the visitor scrolls, tracking
  which post is centered — this is the "animated spine," not a separate progress bar.
- Focus effect: the centered post is closer to full scale/opacity, the rest scaled
  down slightly and lightly blurred. Same effect on hover (CSS `:has()`, no JS) as on
  scroll (the primary interaction, via `IntersectionObserver`-adjacent scroll math).
- Viewport shows **at least 4 posts** at once (the validated prototype used ~2, sized
  for a comparison page, not the real one — the real viewport needs to be sized/tuned
  accordingly).
- No tag filtering in this view — it's chronological only, by design.
- Applies to both `/blog` and `/en/blog`.

## Anti-scope

- Not a change to the main/default listing view — that's I-014.
- Not the grid-view pagination — that's I-012 (dot-styled `paginate()`).
- No new dependency — the prototype uses plain CSS (`scroll-snap`, `:has()`, `mask-image`)
  and vanilla JS (`requestAnimationFrame`-throttled scroll listener); same approach here.
- No view-count or analytics involvement — that's I-015, and unrelated to this view.

## Acceptance criteria

- [ ] Toggle button switches between the default listing (I-014) and this timeline
      view, on both `/blog` and `/en/blog`.
- [ ] At least 4 posts visible in the viewport at once on a standard desktop width.
- [ ] Divider line uses `var(--line-soft)` (or equivalent existing token); the
      scroll-progress fill uses `var(--accent)` — no new colors introduced.
- [ ] No glow/shadow/shine on the fill or focused post — flat color, thin line only.
- [ ] Zoom/blur focus effect present but subtle: consistent with the tuned prototype
      values (small scale delta, low blur ceiling), not the first, stronger pass.
- [ ] `prefers-reduced-motion: reduce` disables the scroll-focus transform/blur
      animation (site-wide convention, `global.css:729-739` and I-004's investigation).
- [ ] Verified on `npx astro check` + `npm run build`, both locales.
- [ ] Visual evidence (light + dark, ES) per this repo's UI-evidence rule, showing the
      timeline view and the toggle control.
