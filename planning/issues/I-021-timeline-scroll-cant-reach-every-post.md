---
id: I-021
type: bug
status: staging
impact: high
cost: low
epic: E01
created: 2026-08-08
---

# Blog timeline: scroll can only ever centre two posts

`impact: high` — the whole point of the timeline view (I-013/I-016) is browsing
chronologically by scroll; today most posts are permanently unreachable, which
defeats the feature on its main surface.
`cost: low` — one root cause, one CSS/JS value to compute correctly; no new
component, no new dependency.

## Context

Owner report, 2026-08-08: in the timeline view, scrolling only ever brings **two**
dates into focus — every other post stays permanently blurred, no matter how far
you scroll. Scroll should sweep smoothly from the newest post to the oldest and
back, focusing each one in turn.

Root cause (traced in `src/components/BlogList.astro` +
`src/styles/global.css:717`): `updateTimelineFocus()` picks whichever row's centre
is closest to the viewport's centre line (`vRect.top + vRect.height / 2`) on every
scroll frame. But `.blog-timeline-viewport` only has `padding: 2rem 0` (`global.css`
line 726) around a `height: 34rem` (17rem half-height) scroll container. That
padding is what the scrollable range is made of — with only 2rem on each side, the
achievable scroll range is far smaller than the ~17rem of travel a row needs to go
from its resting position to the viewport's centre. Only the one or two rows that
happen to start near the geometric middle of the (short) list ever get close enough
to the centre line for `t > 0` in the smoothstep falloff; every other row's minimum
distance across the whole reachable scroll range stays larger than one row-height,
so `t` never leaves `0` and the base blur (`0.9px`) never lifts.

## Scope

- Give the scroll container enough top/bottom room for the **first** row to reach
  centre at `scrollTop: 0` and the **last** row to reach centre at max scroll — i.e.
  padding on the order of half the viewport height, not a fixed cosmetic `2rem`.
- Row heights are content-dependent (title/excerpt wrap), so compute the padding
  from the real rendered viewport/row height rather than hardcoding a second guess
  in CSS — measure once when the timeline becomes visible (and on resize, since
  the fix must survive a viewport-width change without a page reload).
- Keep the existing mask fade (`global.css` line 727) and the smoothstep falloff
  untouched — this is a scroll-range bug, not a visual-language change.

## Anti-scope

- Not a redesign of the focus effect (zoom/blur amounts settled by I-016).
- Not a change to viewport height, row layout, or the accent mark's own logic.

## Acceptance criteria

- [x] Scrolling the timeline from top to bottom brings **every** post into full
      focus in turn (zero blur, full scale) at some scroll position — verified on
      the real render, not the diff, across the actual post count.
- [x] The newest post can be centred at `scrollTop: 0` and the oldest at max scroll,
      without leaving excess dead space that looks broken.
- [x] Holds after a resize (viewport width change), not just at initial load.
- [ ] `prefers-reduced-motion` / `perf-lite` behaviour (I-017's accepted risk aside)
      is unaffected — not re-verified in this pass; the fix only adds a padding
      measurement (`syncTimelinePadding()`), which runs independently of the
      `isStatic()` guard inside `updateTimelineFocus()` — an untouched code path,
      so no new risk, but not re-exercised live.
