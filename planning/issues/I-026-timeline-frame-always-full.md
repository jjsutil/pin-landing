---
id: I-026
type: bug
status: review
impact: high
cost: low
epic: E01
created: 2026-08-12
---

# Blog timeline: the frame must stay full, and the scroll must rest in steps

`impact: high` — the timeline is one of the blog's two browsing surfaces (I-013);
today it shows an empty half-frame at both ends of the list, which reads as broken
on first contact with the feature.
`cost: low` — deletes a function and changes three CSS values; no new component, no
new dependency.

## Context

Owner report, 2026-08-12: the timeline should always show a constant number of posts
— "no sé, 6" — filling the frame, with posts entering at one edge and leaving at the
other as you scroll, like a vertical carousel. Instead, at either end of the list the
frame is half empty and the first (or last) post sits at the vertical centre.

Root cause: `syncTimelinePadding()` in `src/components/BlogList.astro`, added by
I-021, writes `padding-top`/`padding-bottom` equal to **half the viewport height**
(~228px on the 544px frame). That padding *is* the empty half-frame. I-021 introduced
it deliberately — it is the scroll range that lets the first and last rows travel to
the centre line — and its own third acceptance criterion ("without leaving excess dead
space that looks broken") is what it traded away to get there.

A second symptom, same cause: the divider spine is drawn on the list
(`.blog-timeline-list::before`, `top: 0; bottom: 0`), so it starts at the first row and
ends at the last. With half a frame of padding at each end, the spine stops short of
the frame's edges and travels with the content — the owner's "el marco del carrusel se
mueve, cuando debería ser fijo". With the padding gone the list is taller than the
frame at every scroll position, so the spine covers it: no separate fix.

## Owner decisions (2026-08-12)

1. **Hard stop at the ends, not a loop.** The list stops at the first and last post.
   Consequence, accepted explicitly: those two never reach the centre line and never
   take full focus. This re-opens the defect I-021 was filed for; the owner chose a
   full frame over universal focus, having been shown both options.
2. **Stepped scroll.** Continuous wheel input, discrete resting positions — "se siente
   más pausado (pero no torpe ni lento), como en pasos". Implemented with
   `scroll-snap-type: y proximity` + `scroll-snap-align: center`, reversing the
   2026-08-07 decision that removed scroll-snap for fighting the zoom/blur. `proximity`
   rather than `mandatory` is what keeps that from recurring: it can only settle a
   gesture that already ended near a row, never pull the list away mid-scroll.

## Scope

- Delete `syncTimelinePadding()` and its two call sites; viewport padding back to `0`
  in CSS.
- `.blog-timeline-fill` origin back to `top: 0` (it tracked the deleted padding).
- Add scroll-snap to the viewport and `scroll-snap-align: center` to the rows.
- First and last row get `padding: 2.5rem` on their outer edge — matching the mask
  fade — so the fade lands on empty space instead of permanently half-fading the
  outermost post's own title.

## Anti-scope

- Not a looping/infinite carousel (owner chose the hard stop).
- Not a change to the zoom/blur amounts (I-016), the mask, the viewport height, or
  the accent mark's own logic.
- Not a change to the grid view.

## Acceptance criteria

- [x] At `scrollTop: 0` the list starts flush with the frame's top edge and at least
      5 posts share the frame; mirrored at max scroll.
- [x] The divider spine covers the full frame height at top, middle and bottom scroll.
- [x] Every post is fully readable inside the frame at some scroll position.
- [x] After a real wheel gesture the list settles with a post centred (snap took
      effect), and the focus effect is not left frozen mid-transition.
- [x] The accent mark still sits on the `.is-active` post at top, middle and bottom.
- [x] `perf-lite` / static mode still clears every inline transform, filter and
      `.is-active`, and hides the mark — the checkbox I-021 left unticked.
- [x] Verified on the real render with mutation checks (restore the padding → the
      frame checks fail; remove the snap → the step check fails).
- [x] `npx astro check` + `npm run build` clean; visual evidence, ES light + dark.
