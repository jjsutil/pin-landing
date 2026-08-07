---
id: I-017
type: bug
status: backlog
impact: low
cost: low
epic: E01
created: 2026-08-07
---

# Blog timeline: under reduced motion no post is marked at all

`impact: low` — affects only visitors with `prefers-reduced-motion` (or on hardware
the FPS benchmark demotes), and the list is still fully readable and navigable; it is
a degraded state, not a broken flow.
`cost: low` — the marker already exists as a class and a CSS rule; what is missing is
one static-mode pass that applies it. No new component, no new dependency.

## Context

Found by the independent code review of I-016 (PR #34, 2026-08-07) and recorded there
as an accepted risk. It is **pre-existing** — I-013 shipped it, I-016 did not
introduce it.

`updateTimelineFocus()` in `src/components/BlogList.astro` returns early in static
mode, before the loop that toggles `.is-active`. That is correct for the animated part
(no per-frame `transform`/`filter`/blur is exactly the point of static mode), but
`.is-active` is not animation — it drives two purely static declarations in
`src/styles/global.css`:

- `.blog-timeline-row.is-active .blog-timeline-date { color: var(--accent-deep); }`
- `.blog-timeline-row.is-active .blog-timeline-content h2 { color: var(--ink); }`

Plus the accent mark, hidden on purpose in static mode
(`html.perf-lite .blog-timeline-fill { display: none; }`, I-016).

So the reduced-motion visitor gets a chronological list where **nothing indicates
which post is centred** — every row is equally muted. The animated version leans on
that marker; the static one drops it entirely rather than substituting a static
equivalent.

## Scope

- In static mode, still resolve which row is centred and apply `.is-active` to it —
  the class only, never inline `transform`/`filter`/`opacity`.
- Do it on a cadence that costs nothing continuous: the existing scroll listener is
  already `requestAnimationFrame`-coalesced, and I-016 added a `MutationObserver` on
  `<html>`'s class so entering static mode flushes immediately — both are the natural
  hooks. Reading `getBoundingClientRect()` per row on a scroll frame is the only cost;
  if that is judged too much for the hardware this mode targets, an
  `IntersectionObserver` is the alternative and should be evaluated, not assumed.
- Decide whether the accent mark should come back as a **static** marker in this mode
  (it moves only when the class is applied, so it is not an animation) or stay hidden.
  Owner call; the issue should not decide it silently.

## Anti-scope

- No change to the animated path (zoom/blur/falloff are settled by I-016).
- Not a new visual language for the marker — reuse `.is-active` as it exists.

## Acceptance criteria

- [ ] Under `prefers-reduced-motion: reduce`, exactly one row carries `.is-active` at
      any scroll position, and its date reads in the accent colour.
- [ ] Under `perf-lite` set by the FPS benchmark mid-session, the same holds, and the
      rows still carry **no** inline `transform`/`filter` (`style.cssText === ''`).
- [ ] The decision on the accent mark in static mode is recorded in this issue with
      its one-line reason.
- [ ] Verified on the real render (both static triggers), not on the diff.

## Stopped, pending owner call (2026-08-07)

Picked up this session, timeboxed per the owner's own instruction: implement only if
mechanical, stop rather than invent the answer if it hits the open decision above.
It does. The mechanical two-thirds of this issue (apply `.is-active` to the centred
row in static mode via the existing scroll listener + `MutationObserver`, no inline
`transform`/`filter`) is fully scoped and ready to implement — see
`updateTimelineFocus()` / `clearTimelineFocus()` in `src/components/BlogList.astro`
(around line 301). What blocks a complete, mergeable fix is the accent-mark
question: leaving it hidden is the path of least code, but it's the product call the
issue itself reserves for the owner, not a default I should pick on his behalf.

**One line to unblock:** "mark stays hidden" or "mark comes back as a static
segment (no motion, just positioned)". Either answer lets the next session
implement and ship this in one pass — the mechanical part alone.
