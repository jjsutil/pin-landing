# PR-001 — Timeline reduced-motion marker

**Issue:** I-017 · **Epic:** E01 · **Branch:** `fix/I-017-timeline-static-marker` · **Size:** XS
**Depends on:** none (I-013/I-016/I-026/I-027 already merged to `main`) · **Status:** planned

## Objective

Under `prefers-reduced-motion: reduce` or `perf-lite` (FPS benchmark), the blog
timeline's `updateTimelineFocus()` returns before computing which row is centred, so
**no row ever carries `.is-active`** — every row reads equally muted. Make static mode
still resolve and mark the centred row via the class only (no inline
`transform`/`filter`/`opacity`), satisfying I-017's acceptance criteria.

## Non-goals

- No change to the animated path (zoom/blur/falloff, I-016) or the scroll-progress
  math (I-027) — both stay exactly as they are.
- The accent mark (`.blog-timeline-fill`) **stays hidden** in static mode. Owner
  decision (this planning session, 2026-08-12): `.is-active`'s color change on date +
  title is signal enough; animating/positioning the mark is exactly the per-frame
  cost static mode exists to avoid. Not a default picked silently — I-017 explicitly
  reserved this call for the owner, and it's recorded here with its reason.

## Reality notes

The issue text (written 2026-08-07, before I-026/I-027) describes the pre-fix focus
model: distance to a fixed centre line, resolved via `getBoundingClientRect()` per row
on a scroll frame, with `updateTimelineFocus()`'s early return "around line 301". Both
are stale:

- Focus is now `idx = (scrollTop / max) × (rows.length − 1)` — scroll progress in
  index space (I-027), not row geometry. Cost is already O(rows) per triggered frame
  with no `getBoundingClientRect()` in the loop (only once, on the *active* row, to
  place the mark) — the IntersectionObserver alternative the issue raises "if judged
  too much" isn't needed; the existing rAF-coalesced scroll listener + I-016's
  `MutationObserver` on `<html>`'s class are still the right, and only necessary, hooks.
- The early return + one-shot `clearTimelineFocus()`/`timelineFocusCleared` latch
  (lines ~280, ~294-302, ~307-316 as of this planning session) exist only because the
  old code stopped touching rows entirely in static mode. Once the row loop runs
  unconditionally every pass (this PR), that one-shot cleanup pattern is dead weight —
  removed, not kept alongside the fix.

No scope change: the mechanical two-thirds I-017 already called "fully scoped and
ready to implement" is still exactly that; only the surrounding code shape moved.

## Change sequence

1. **Refactor `updateTimelineFocus()`** — `src/components/BlogList.astro` (script
   block, currently lines ~279-355).
   - Delete `clearTimelineFocus()` (currently lines ~294-302) and the
     `timelineFocusCleared` flag (declaration ~280, reads/writes ~308-316) — dead once
     step below makes every pass self-correcting.
   - Move `rows`/`max`/`idx`/`active` computation (currently inside the `!isStatic()`
     branch) to the top of the function, unconditional — it's the same cheap
     arithmetic already run for the animated path.
   - Replace the early `if (isStatic()) { ...; return; }` with a local
     `const staticMode = isStatic();` (not `static` — reserved word in a module's
     strict mode) read once per call, same "read every pass, not once at load" reason
     as `isStatic()` itself already documents (benchmark resolves ~300ms in).
   - In the `rows.forEach` loop, branch only the per-row style write:
     `staticMode` clears `row.style.transform = ''; row.style.filter = '';`
     (no computation — this is what keeps `style.cssText === ''`, AC2);
     otherwise the existing zoom/blur write, unchanged. **Both branches** run
     `row.classList.toggle('is-active', row === active)` — that line moves outside
     the branch, it's the actual fix.
   - Gate the mark-positioning block (`if (active) { ... timelineFill.style.transform
     ... }`) with `&& !staticMode` — the mark stays untouched (and CSS-hidden via
     `html.perf-lite .blog-timeline-fill { display: none; }`, already in
     `global.css`, unchanged) while static; the next non-static pass repositions it
     from scratch, so no stale-value cleanup is needed here either.
   - One-line comment at the mark-gate explaining the "stays hidden" call, so a
     future reader doesn't have to re-derive it from this plan or the issue.

2. **Reconcile `planning/issues/I-017-timeline-reduced-motion-marker.md`** (rule 10 —
   close the loop, same branch).
   - Replace the "Stopped, pending owner call" section with a short "Resolved"
     note: mark stays hidden, one-line reason (as in Non-goals above), dated
     2026-08-12.
   - Tick all four acceptance-criteria checkboxes once step 3 below confirms them.
   - `status: backlog` → `status: staging` in the frontmatter.

3. **Verify on the real render**, not the diff (AC4) — headless Chrome + CDP, the
   pattern already documented in `HANDOFF.md` (the `claude-in-chrome` extension
   doesn't capture in background sessions; `google-chrome --headless=new` +
   `puppeteer-core`, ad-hoc in the scratchpad, does). Against `astro preview`
   (production build), timeline view:
   - `Emulation.setEmulatedMedia({ features: [{ name: 'prefers-reduced-motion',
     value: 'reduce' }] })`, scroll to top / middle / bottom: exactly one
     `.blog-timeline-row.is-active` at each position, its `.blog-timeline-date`
     computed color is `--accent-deep` (AC1).
   - Reset media emulation, instead run `document.documentElement.classList.add
     ('perf-lite')` mid-session (mirrors the FPS-benchmark path, same technique
     `main.ts` uses) — same three scroll positions: exactly one `.is-active`, and
     every row's `style.cssText === ''` (AC2).
   - Confirm `.blog-timeline-fill` stays `display: none` (computed style) in both
     static triggers — the "stays hidden" decision, verified not assumed.
   - **Mutation check**: temporarily restore the early return, re-run the same three
     checks — all must fail (zero `.is-active` rows). Revert before commit.

4. **Docs/board close-out** — `CHANGELOG.md` `[Unreleased]` entry; regenerate
   `planning/BOARD.md` + README summary via `roadmap-board` (I-017 → `staging`).

## Test plan

| Acceptance criterion (I-017) | Verified by |
|---|---|
| Exactly one `.is-active` row at any scroll position under `prefers-reduced-motion: reduce` | CDP check, step 3, media-emulation pass |
| Same under `perf-lite` (FPS benchmark), rows carry no inline `transform`/`filter` (`style.cssText === ''`) | CDP check, step 3, `perf-lite` class pass |
| Accent-mark decision recorded with one-line reason | `planning/issues/I-017-*.md`, step 2 |
| Verified on the real render, not the diff | Both CDP passes run against `astro preview`, not read off the source |

No unit test: the logic lives inline in an `.astro` component's `<script>` block
(matches every prior timeline PR — I-013/I-016/I-026/I-027 — none extracted it to a
testable module, and this PR doesn't either; out of scope here). Standard gate
commands, run bare (rule 1): `npx astro check`, `npm run build`,
`bash scripts/check-gates.sh --base origin/main` — read the exit code, not the words.

## Merge checklist

- [ ] All four I-017 acceptance criteria demonstrably met (table above)
- [ ] Mutation check (step 3) confirms the old early-return fails the same checks
- [ ] `astro check` / `npm run build` / `check-gates.sh --base origin/main` exit 0
- [ ] I-017 reconciled (Resolved note, checkboxes, `status: staging`) in the same branch
- [ ] `CHANGELOG.md` `[Unreleased]` entry
- [ ] `planning/BOARD.md` + README summary regenerated
- [ ] Visual evidence attached to the PR (rule 1) — reduced-motion + perf-lite ×
      ES/EN × light/dark, timeline scrolled to a mid post so `.is-active` is visible
- [ ] No scope beyond I-017 (mark-visibility question already resolved above, not
      reopened)
- [ ] Conventional commits (`fix(blog): mark active timeline row under reduced motion
      (I-017)`), branch up to date with `main`

## Risks & mitigations

- **Low.** Pure refactor of one function plus a class-toggle fix; no change to the
  animated path's math or to any other component. Rollback is reverting the single
  commit — no data, no migration, no other surface touched.
- The one behavior change beyond the bug fix itself: removing
  `clearTimelineFocus()`/`timelineFocusCleared` means static mode now re-runs the
  (trivial) row loop on every scroll/class-change frame instead of once. Mitigation:
  this is the same cost model the issue itself rated `cost: low` and explicitly
  accepted ("Reading `getBoundingClientRect()` per row... is the only cost" — and this
  PR's static branch doesn't even call that); if a future session measures otherwise,
  the loop is where to add an IntersectionObserver, not before.

## Discovered along the way

None yet — fill during execution if anything surfaces outside I-017's scope.
