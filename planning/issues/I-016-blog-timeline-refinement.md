---
id: I-016
type: feature
status: review
impact: high
cost: low
epic: E01
created: 2026-08-07
---

`impact: high` — the view switch and the timeline's motion are the first thing a
visitor touches on the blog listing; the owner reported both as confusing/unpolished
on the shipped I-013 build (schema is binary per `.claude/repo-conventions.md:50-51`,
this clears "user-visible, shapes a core flow").
`cost: low` — no new component and no new dependency: the switch reuses the site's
existing `.segmented` control, and the timeline change is a rewrite of the existing
focus math plus CSS, well under the PR size limit.

# Blog listing: icon-only view switch, single-item timeline focus

## Context

Owner review of the shipped I-013 build (2026-08-07), verbatim:

> el slider de pin-landing/blog […] hay dos filas de botones, se confunde con los
> tags […] no quiero que estén estas palabras, grilla o línea de tiempo […] el
> segmento que "brilla" azul es muy largo y poco específico, el movimiento no es
> fluido, y el zoom destaca todo, y yo quisiera destacar solo el item en el scroll
> […] ocultar el scroll del browser de ese componente, solo animar el zoom y blur

Five defects in one surface, all of them from I-013's own design decisions.

## Scope

- **View switch.** One control row, not two: tag filters left, switch right. The
  switch is icon-only (grid glyph / timeline glyph) and reuses the existing
  `.segmented` control (as in the pricing toggle) so it cannot read as another tag
  chip. The words "Grilla"/"Línea de tiempo" survive only as `aria-label`/`title`.
- **Accent mark.** The full-height fill that grew from the top of the divider becomes
  a short segment that slides to the centred row — it marks *which* post is focused
  instead of *how far down* the list you are.
- **Focus falloff.** Measured in row-heights instead of viewport-halves, with a
  smoothstep: one row away from the centre the effect is gone, so exactly one post
  reads as highlighted.
- **Only zoom and blur are animated.** The per-row opacity ramp is dropped, as is the
  `:has()` hover variant whose `!important` transforms fought the per-frame scroll
  values (that fight is what read as "el movimiento no es fluido"). Row CSS
  transitions dropped for the same reason; scroll-snap dropped as well.
- **The component's scrollbar is hidden** (`scrollbar-width: none` + the WebKit
  pseudo-element). Scrolling itself is untouched — wheel, touch, keyboard, and the
  existing mask-image edges still say the list continues.
- Applies to `/blog` and `/en/blog`, light and dark.

## Anti-scope

- Not the grid view's cards, tag filter behaviour or pagination (I-012).
- Not featured/pinned ordering (I-014) or view tracking (I-015).
- No new dependency, no new color token, no persistence of the chosen view.

## Acceptance criteria

- [x] The listing shows exactly one row of controls; no visible "Grilla"/"Línea de
      tiempo" text, and the switch is distinguishable from a tag chip at a glance.
- [x] Switching to the timeline hides the tag filters; switching back restores them.
- [x] At any scroll position exactly one row carries `is-active`, is unblurred and
      scaled up; its neighbours are already at the floor value.
- [x] The accent mark sits on the divider, centred on the active row.
- [x] `#blog-timeline-viewport` reports `offsetWidth - clientWidth === 0` (no
      scrollbar) and still scrolls.
- [x] Under `prefers-reduced-motion: reduce` no row carries an inline transform or
      filter and the accent mark is not rendered.
- [x] Visual evidence committed for both views, ES/EN, light and dark.
