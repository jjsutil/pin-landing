---
id: I-004
type: feature
status: staging
impact: low
cost: low
created: 2026-08-05
---

# Static mode for low-end hardware — detect or offer a no-animation experience

**Implemented (2026-08-07, PR #33, Closes I-004):** Option B shipped as scoped by the
owner's "auto, no buttons" decision below — an FPS self-benchmark in
`src/scripts/main.ts` (`src/scripts/perf-lite.ts` holds the pure decision logic and its
tunable threshold), plus a `perf-lite` class on `<html>` that `src/styles/global.css`
turns off the same way it already turned off `prefers-reduced-motion` — same block,
reused, not duplicated. `prefers-reduced-motion` still wins unconditionally: it sets
the class immediately, before any benchmark runs. Scope stayed to the CSS-driven
suppression (transitions/animations/backdrop-filter); the JS-driven effects (typing,
count-up, viewer demo) stay gated on `prefers-reduced-motion` only, as they already
were — wiring them to the benchmark too would mean delaying their start until the
~300ms measurement resolves, which the owner's "deliberately minimal" scope for this
PR did not ask for. Flagged for the reviewer, not decided silently.

**Partial extraction (2026-08-07, PR #27, Refs I-004):** the one piece of this issue's
Recommendation that didn't need the benchmark machinery — gating `backdrop-filter` on
the sticky header — shipped standalone under `prefers-reduced-motion: reduce` (existing
signal, no new state). This issue stays `backlog`: the FPS self-benchmark is still
unbuilt.

**Owner decision (2026-08-07):** ship auto-detection only, no visible control — "auto,
no buttons". This drops the manual-toggle half of the Recommendation below (Option C);
the issue now targets **Option B** (FPS self-benchmark) on top of the
`prefers-reduced-motion` handling that already exists. Recommendation, Scope and
Acceptance criteria below are edited to match; the toggle option (C) stays in "Options
evaluated" as a rejected alternative, with the reason it was rejected.

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

**C — Combine A + B, plus a visible manual toggle as a safety net.** *(Rejected —
owner decision 2026-08-07, "auto, no buttons": no visible control, ship detection
only.)*
Respect `prefers-reduced-motion` first (it's an explicit, authoritative signal — never
override it). Where it's not set, run the lightweight FPS self-benchmark and default to
static mode if it comes back below threshold. Additionally expose a small, visible
"reduce motion" toggle (persisted the same way the existing theme toggle already
persists to `localStorage`, per `main.ts:42-51`) so a visitor whose benchmark reads fine
but who still finds the page heavy (or whose benchmark misfires) has a manual override
that doesn't depend on any detection working correctly.

## Recommendation

**Option B**, on top of the `prefers-reduced-motion` handling that already exists.
`prefers-reduced-motion` stays the first, non-overridable check — it's a stated
accessibility preference and takes priority over a guess. Where it's not set, the FPS
self-benchmark decides, with no visible control: a manual toggle was considered (Option
C) but rejected by the owner in favor of a fully automatic experience. The
`backdrop-filter` gating this issue also called for already shipped independently under
`prefers-reduced-motion` (PR #27) and needs no further work here.

## Scope

- Design/implementation decision on B's exact benchmark (frame count, threshold,
  measurement window) — needs to happen at pr-plan time, not decided here.
- A `static-mode` (or similarly named) state, set from `prefers-reduced-motion` OR a
  passing self-benchmark, applied the same way `reduced` already gates behavior in
  `main.ts` and the `prefers-reduced-motion` media query already gates `global.css`.

## Anti-scope

- No canvas/WebGL/GPU-tier detection (`WEBGL_debug_renderer_info`) — actively
  deprecated/fingerprint-flagged, not worth building against.
- No `navigator.deviceMemory` or Network Information API gating — Chromium-only,
  wouldn't cover Firefox/Safari visitors, and the connection speed signal doesn't
  measure what this issue is about (rendering capability, not bandwidth).
- No visible manual toggle — owner decision 2026-08-07 ("auto, no buttons"). Detection
  is the only path into static mode; there is no visitor-facing control to override it
  either way.
- No `backdrop-filter` work — already shipped independently under
  `prefers-reduced-motion` (PR #27, Refs I-004).
- No implementation in this issue — this is investigation + a recommendation only, per
  the owner's request. A `pr-plan` session should pick the final benchmark parameters
  before code is written.
- Does not touch the hero page's visual design or anything governed by the v12
  fidelity contract beyond gating existing effects behind a new state — no new visual
  treatment is being introduced.

## Acceptance criteria (tentative — for the eventual implementation PR)

- [x] `prefers-reduced-motion: reduce` continues to force static mode unconditionally
      (never overridden by the benchmark).
- [x] Without that preference set, an FPS self-benchmark runs once on load and sets
      static mode when it comes in under an agreed threshold; the decision doesn't
      cause a visible flash of animated-then-static content.
- [x] No visible control is added — detection is fully automatic, nothing for a visitor
      to click or toggle.
- [ ] Verified on a throttled/low-end profile (e.g., Chrome DevTools CPU throttling)
      that static mode measurably reduces main-thread/compositor work, not just that
      the class gets applied. **Not verified** — no throttled-hardware profiling was
      run this session; see the PR's `unverified` note.
- [x] Visual evidence (light + dark, ES) per this repo's UI-evidence rule, showing the
      visible difference between animated and static mode.
