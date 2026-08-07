---
id: I-004
type: feature
status: backlog
impact: low
cost: low
created: 2026-08-05
---

# Static mode for low-end hardware — detect or offer a no-animation experience

**Partial extraction (2026-08-07, PR #27, Refs I-004):** the one piece of this issue's
Recommendation that didn't need the benchmark/toggle machinery — gating
`backdrop-filter` on the sticky header — shipped standalone under
`prefers-reduced-motion: reduce` (existing signal, no new state). This issue stays
`backlog`: the FPS self-benchmark and the visible manual toggle are still unbuilt.

`impact: low` — improves the experience for a subset of visitors on weak/old hardware;
not a core flow, doesn't unblock other issues, but is user-visible and directly requested
by the owner.
`cost: low` — no new runtime dependency; touches `src/scripts/main.ts` and
`src/styles/global.css` only, scoped to the existing animation code paths.

## Context

Owner request, 2026-08-05: some visitors are on low-end/old PCs that struggle with the
site's current animations, and the owner wants a more static version of the site (with
animations off) for them.

**Premise check before anyone implements this: the site already respects
`prefers-reduced-motion`, both in CSS and in JS.**

- `src/styles/global.css:619-626` — a `@media (prefers-reduced-motion: reduce)` block
  disables `.rise`/`.rise-x` fade-ins, the divider-line draw-in on quotes, button hover
  transitions, the caret blink, and the viewer's page-swap animation.
- `src/scripts/main.ts:10` reads the same media query into a `reduced` flag and uses it
  to: skip the auto-playing viewer demo entirely (line 125), skip the number count-up
  animation and show final values immediately (line 168), and skip the typing effect,
  showing static text instead (line 231).

So the "off" switch already exists for anyone whose OS/browser has the reduced-motion
preference set. What's missing is the thing the owner is actually asking for: a way to
degrade **without** the visitor having configured that preference, because a weak PC and
an explicit accessibility preference are two different, uncorrelated things — a visitor
can have a struggling laptop and a default OS motion setting.

**What actually runs today, and its real cost:**

- No canvas, no WebGL, no continuous `requestAnimationFrame` loop. The only `rAF` usage
  is the number count-up (`main.ts:148-159`), which runs once, for ~1.1-1.6s, on ~4
  elements — cheap and bounded.
- The reveal-on-scroll effects (`.rise`, `.rise-x`, `.said::before/::after`) are CSS
  transitions on `opacity`/`transform` only — compositor-friendly, triggered once per
  element via `IntersectionObserver` (not a scroll handler), and each one finishes and
  stops. This is the standard cheap way to do this kind of effect.
- The typing effect (`main.ts:179-239`) and the viewer auto-demo (`main.ts:104-138`) use
  chained `setTimeout`s, not a render loop. Low CPU cost, but they do run continuously
  for several seconds after each page load (typing) or after the viewer scrolls into
  view (demo) until they finish or a visitor interacts.
- The one effect that stands out as actually GPU-costly and **continuous** rather than
  one-shot is the sticky header: `header.bar { backdrop-filter: blur(16px) saturate(140%); }`
  (`global.css:195-202`). Backdrop blur is compositor-expensive and, being on a
  `position: sticky` element, gets recomposited on every scroll frame. On weak
  integrated GPUs this is a much more plausible culprit for perceived jank than the
  fade-ins. **This is not currently covered by the reduced-motion block at all.**

Net: nothing here is heavy in absolute terms (no canvas/WebGL, no unbounded rAF loop),
but the aggregate — count-up + typing + demo + scroll-reveals + a blurred sticky header,
all potentially active on first load/scroll — can plausibly add up to visible jank on a
genuinely low-end machine, and the one clearly expensive piece (backdrop-filter) isn't
gated by anything today.

## Investigation — can the client detect "this PC is weak"?

No reliable, universal signal exists. Summary, evaluated for what's actually usable in
2026 (not in theory):

| Signal | What it tells you | Reliability today |
|---|---|---|
| `prefers-reduced-motion` | Explicit user *preference*, not hardware capability | Reliable where set, but most visitors on weak hardware never set it |
| `navigator.hardwareConcurrency` | Logical CPU core count | Widely supported, but a weak core count doesn't imply weak GPU/compositor, and many low-end machines still report 4+ cores |
| `navigator.deviceMemory` | Rounded-down RAM bucket | **Chromium/Blink only** — no Firefox, no Safari (confirmed via MDN/caniuse); deliberately imprecise for fingerprinting reasons |
| `navigator.connection.effectiveType` / `saveData` (Network Information API) | Network speed / user-opted data saving | Partial support (Chromium-family); not implemented in Firefox or Safari; and network speed is not GPU/CPU capability anyway |
| `WEBGL_debug_renderer_info` (GPU vendor/renderer string) | GPU model, to map against a manual tier list | Actively being locked down: deprecated and slated for removal in Firefox, and increasingly bucketed/blocked as a known fingerprinting vector; also requires maintaining a GPU tier list by hand |
| Live FPS self-benchmark (`requestAnimationFrame`, measure the first N frames, decide) | Actual sustained framerate the browser can deliver, right now, on this exact page | No standard API, so no browser support question — it's just JS you write. Most accurate signal because it measures the thing that matters (can this device sustain motion) rather than inferring it from unrelated specs. Costs one measurement window (order of ~0.3-1s) before a decision is made, and adds the JS to implement/maintain |

There is no evidence any of the static hardware-capability APIs are trustworthy enough
to gate on alone — they're Chromium-only, imprecise by design, or being actively removed
for privacy reasons. `prefers-reduced-motion` is the one universally-supported, reliable
signal, but it answers a different question (preference, not capability).

Industry precedent: sites that adapt to constrained conditions overwhelmingly key off
`prefers-reduced-motion` and/or `navigator.connection.saveData`/`effectiveType` (data-saver
mode), not GPU fingerprinting — the fingerprinting-adjacent APIs are treated as
compromised for this purpose across the industry. Live FPS self-benchmarking is a known
but less common pattern (seen in some WebGL-heavy sites/games), precisely because it's
the only approach that measures the real thing instead of guessing from a proxy signal.

## Options evaluated

**A — Rely only on `prefers-reduced-motion`.**
Already implemented (see above). Simple, zero new code, respects an explicit
accessibility preference. Does **not** solve the owner's actual problem: a visitor with
a weak PC and no configured preference still gets full animation.

**B — Self-benchmark FPS on load, degrade if it can't keep up.**
Measure the first ~10-20 `requestAnimationFrame` callbacks' actual intervals right after
load; if the achieved framerate falls under a threshold, add a `static-mode` class that
the CSS/JS branch on (same mechanism the reduced-motion path already uses). Most
accurate signal — it measures reality, not a proxy. Trade-offs: adds JS and a decision
instant (a fraction of a second where the page hasn't yet decided), a threshold to tune,
and it can misfire on a momentarily busy tab (e.g., another heavy tab stealing frames)
unless the measurement window is chosen carefully.

**C — Combine A + B, plus a visible manual toggle as a safety net.**
Respect `prefers-reduced-motion` first (it's an explicit, authoritative signal — never
override it). Where it's not set, run the lightweight FPS self-benchmark and default to
static mode if it comes back below threshold. Additionally expose a small, visible
"reduce motion" toggle (persisted the same way the existing theme toggle already
persists to `localStorage`, per `main.ts:42-51`) so a visitor whose benchmark reads fine
but who still finds the page heavy (or whose benchmark misfires) has a manual override
that doesn't depend on any detection working correctly.

## Recommendation

**Option C.** Detection alone (B) is the most accurate technical signal but is still a
heuristic that can be wrong; a manual toggle costs very little (the theme toggle
pattern already exists to copy) and gives visitors a guaranteed way out regardless of
what the benchmark decides. Keep `prefers-reduced-motion` as the first, non-overridable
check — it's a stated accessibility preference and takes priority over a guess.
Independently of which of A/B/C ships, gating `backdrop-filter` on the sticky header
behind the same static-mode class is worth doing regardless — it's the one continuous,
GPU-expensive effect actually present and it isn't touched by the current
reduced-motion handling at all.

## Scope

- Design/implementation decision on B's exact benchmark (frame count, threshold,
  measurement window) — needs to happen at pr-plan time, not decided here.
- A `static-mode` (or similarly named) state, set from `prefers-reduced-motion` OR a
  passing self-benchmark, applied the same way `reduced` already gates behavior in
  `main.ts` and the `prefers-reduced-motion` media query already gates `global.css`.
- Extending the existing CSS reduced-motion rules (`global.css:619-626`) to also cover
  `backdrop-filter` on `header.bar`.
- A visible, persisted manual toggle (mirrors the existing theme-toggle pattern).

## Anti-scope

- No canvas/WebGL/GPU-tier detection (`WEBGL_debug_renderer_info`) — actively
  deprecated/fingerprint-flagged, not worth building against.
- No `navigator.deviceMemory` or Network Information API gating — Chromium-only,
  wouldn't cover Firefox/Safari visitors, and the connection speed signal doesn't
  measure what this issue is about (rendering capability, not bandwidth).
- No implementation in this issue — this is investigation + a recommendation only, per
  the owner's request. A `pr-plan` session should pick the final benchmark parameters
  before code is written.
- Does not touch the hero page's visual design or anything governed by the v12
  fidelity contract beyond gating existing effects behind a new state — no new visual
  treatment is being introduced.

## Acceptance criteria (tentative — for the eventual implementation PR)

- [ ] `prefers-reduced-motion: reduce` continues to force static mode unconditionally
      (never overridden by the benchmark or the toggle defaulting differently).
- [ ] Without that preference set, an FPS self-benchmark runs once on load and sets
      static mode when it comes in under an agreed threshold; the decision doesn't
      cause a visible flash of animated-then-static content.
- [ ] A visible toggle lets any visitor force static mode on/off regardless of what
      detection decided, persisted the same way the theme choice is (`localStorage`,
      degrades gracefully without storage per the existing pattern at `main.ts:45-49`).
- [ ] Static mode additionally disables `backdrop-filter` on the sticky header, not
      just the transitions already covered by `prefers-reduced-motion`.
- [ ] Verified on a throttled/low-end profile (e.g., Chrome DevTools CPU throttling)
      that static mode measurably reduces main-thread/compositor work, not just that
      the class gets applied.
- [ ] Visual evidence (light + dark, ES) per this repo's UI-evidence rule, for both the
      toggle control and the visible difference between animated and static mode.
