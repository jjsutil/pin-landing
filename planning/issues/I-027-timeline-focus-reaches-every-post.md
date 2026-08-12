---
id: I-027
type: bug
status: review
impact: high
cost: low
epic: E01
created: 2026-08-12
---

# Blog timeline: the focus never reaches the first or the last post

`impact: high` — on the timeline's main interaction, scrolling to either end left the
highlight stranded three posts short of the one the visitor is looking at.
`cost: low` — the focus stops being a geometry problem and becomes a progress reading;
the change is a handful of lines, no new component, no new dependency.

## Context

Owner report, 2026-08-12: *"cuando hago scroll hasta abajo veo el post del 16 jul en
highlight, para arriba el del 20 ago. Eso es un error."* With 10 posts, "16 jul" is
third from the bottom and "20 ago" third from the top — the highlight never reaches
either end.

This is I-026's accepted risk arriving in practice, and the owner's answer to it was
right: *"Es imposible que no sea posible… solo hay que partir recorriendo desde el
inicio en la posición más alta del scroll."*

**Why the old approach could not do it.** `updateTimelineFocus()` picked the row whose
centre was nearest the frame's centre line. With the frame always full (I-026) the list
only travels ~4 row-heights, so the outermost ~2.5 posts on each side can never reach
that line: bringing the first post to the centre requires the content to travel half a
frame, which is exactly the padding I-026 deleted. Any fixed focus line has this
problem; the line, not the geometry, was the wrong idea.

**What replaces it.** The focus is read from **scroll progress in index space**:
`idx = (scrollTop / maxScroll) × (posts − 1)`. 0% is the first post, 100% is the last,
each post takes its turn in between, and the highlight travels down the frame instead
of sitting at a fixed height. No row geometry is involved at all, which also makes the
effect immune to rows of different heights (titles wrap differently).

**Why the snap targets moved off the rows.** One gesture should advance one post. A
row-aligned snap point only exists where the list can actually scroll a row — 4
positions for 10 posts — so every gesture jumped two or three. The stops are now
zero-size elements, one per post, spread evenly across the whole scroll range by
`syncTimelineStops()`.

## Scope

- `updateTimelineFocus()`: derive focus and the active post from scroll progress.
- `syncTimelineStops()`: build one snap stop per post across the scroll range; rebuild
  on resize (the range changes when titles rewrap).
- CSS: `scroll-snap-type: y mandatory` on the viewport, snap alignment off the rows and
  onto `.blog-timeline-stop`.

## Anti-scope

- Not a change to the frame being full (I-026) — that must not regress.
- Not a change to the zoom/blur amounts (I-016), the mask, or the accent mark's logic.
- Not a looping carousel.

## Acceptance criteria

- [x] At `scrollTop: 0` the **first** post is the focused one, at full focus (no blur).
- [x] At the end of the scroll the **last** post is, likewise.
- [x] Every post reaches full focus at some scroll position (10/10).
- [x] The frame stays full at both ends and the focused post is never clipped by it.
- [x] Every rest lands exactly on a post, never between two.
- [x] The accent mark still sits on the focused post.
- [x] `perf-lite` / static mode still leaves nothing frozen.
- [x] Verified by mutation: restoring the centre-line focus reproduces the owner's
      report exactly (post 2 focused at the top, post 7 at the bottom).

## Known limit, measured

One full mouse-wheel tick is 100px in Chrome, while the whole scroll range is 510px —
57px per post. A tick therefore crosses two stops: it rests **on** a post, never
between, but a wheel user steps two at a time. `scroll-snap-stop: always` is set and
Chrome does not honour it here (a 300px gesture crossed five stops). Trackpads and
touch, whose deltas are small, rest on every post.

Making one tick equal one post needs ≥100px of scroll per post, i.e. a scroll range
above 900px, which with a 544px frame means rows about 1.5× taller — roughly 3.5 posts
visible instead of 6. Decoupling the two would take a spacer track plus a sticky,
transformed list: a custom scroller, not a CSS change. Recorded here rather than
rediscovered later; not done, because it trades the post count the owner asked for.
