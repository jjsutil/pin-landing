# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Fixed (blog timeline: reduced-motion/perf-lite now marks the centred post, I-017)

- Under `prefers-reduced-motion: reduce` or `perf-lite` (the FPS self-benchmark,
  I-004), the timeline's centred post carries `.is-active` again — its date and
  title switch to the accent colour, same CSS the animated view already used. Rows
  still carry **no** inline `transform`/`filter` in static mode; only the class
  toggles. Pre-existing since I-013, found by I-016's review, blocked since
  2026-08-07 on an owner call now resolved: the accent mark itself stays hidden in
  static mode (repositioning it is exactly the per-frame cost this mode avoids).

### Changed (blog grid: real pagination and topic routes, I-012)

- The card view is paginated for real: `/blog` and `/blog/2` (plus the EN twins) are
  built by Astro's `paginate()` at **6 cards per page**, so a page ships only its own
  cards. The client-side "Ver más" reveal — every post in the DOM, most of them hidden —
  is gone, along with the ~35 lines that faked filtering and paging in the browser.
- **Topics are URLs now**: `/blog/tema/<slug>` and `/en/blog/topic/<slug>`, paginated
  the same way. Forced by the above, not cosmetic — a client-side filter over a page
  that ships 6 cards would search 6 posts instead of the blog. The chips became links,
  so a topic is shareable, and `aria-current="page"` replaces `aria-pressed`.
- The control between pages is a **row of dots** (owner, 2026-08-07), the current one in
  `--accent`. Each dot is a 24×24 hit target with its own accessible name; the links
  carry `#posts` so a page change lands on the cards rather than above the heading.
- **Page changes animate** via native `@view-transition` — no JS, no dependency. Two
  consequences, both deliberate: it applies to *every* same-origin navigation on the
  site, and being an at-rule it cannot be switched off by the FPS-based static mode
  (`perf-lite`) — only by `prefers-reduced-motion`.
- New: `src/content/blog/tags.ts` (tag → slug, fails the build on a collision) and
  `src/content/blog/listing.ts` (the page size, one home for four routes).

### Fixed (blog timeline: the focus now reaches every post, I-027)

- Scrolling the timeline to either end left the highlight three posts short of the end
  — the owner's report: "hasta abajo veo el post del 16 jul en highlight". The focus is
  no longer the row nearest a fixed centre line (unreachable by the outermost posts
  once the frame is always full, I-026) but a reading of **scroll progress**: 0% is the
  first post, 100% the last, each takes its turn. The highlight travels down the frame
  as you scroll instead of sitting at a fixed height — that is the trade that makes the
  ends reachable at all.
- Snap stops moved off the rows onto one zero-size target per post, spread across the
  whole scroll range, so a gesture advances one post instead of two or three.
- **Measured limit, recorded in I-027:** a full mouse-wheel tick (100px in Chrome)
  crosses two of the 57px stops — it always rests on a post, never between, but a wheel
  user steps two at a time. Trackpad and touch rest on every post. Fixing it for the
  wheel would mean ~3.5 visible posts instead of 6, or a custom scroller.
- This amends I-026's accepted risk rather than living with it.

### Changed (blog timeline: frame always full, stepped scroll, I-026)

- The timeline view's frame now stays full at both ends of the list — ~6 posts always
  on screen, entering and leaving through the mask edges — instead of showing an empty
  half-frame with the first (or last) post floating at the centre. The runtime padding
  that caused it (`syncTimelinePadding()`, I-021) is deleted, which also puts the
  divider spine back across the whole frame at every scroll position.
- Scrolling now rests in discrete steps (`scroll-snap-type: y proximity` +
  `scroll-snap-align: center`), reversing the 2026-08-07 decision that removed
  scroll-snap. `proximity`, not `mandatory`, so it can only settle a gesture that
  already ended near a post — the reason the first attempt fought the zoom/blur.
- **Accepted, owner's call (2026-08-12):** with the padding gone the list stops hard at
  the first and last post, so those two never reach the focus centre — the defect I-021
  was opened for, traded back for a frame that is always full. I-021 is headed as
  superseded rather than rewritten.

### Published (technical series, parts 2-3 — inference/interpretability, RAG, I-024/I-025)

- Blog posts 9 and 10, "How inference and interpretability actually work" / "Cómo
  funcionan de verdad la inferencia y la interpretabilidad" (I-024) and "How RAG
  actually works, and where it silently fails" / "Cómo funciona RAG de verdad, y dónde
  falla en silencio" (I-025) — parts 2 and 3 of the technical-depth series opened by
  the OCR post (I-020). Drafted by a dispatched Fable-model agent (owner instruction),
  15 citations across both posts independently re-verified by a second agent before
  publish (0 citation errors found). One real defect caught and fixed pre-publish: an
  unauthorized, unsourced claim about pin's own document-ingestion practice in the RAG
  post, outside the single pin-adjacent claim (the public OHRBench/OCR connection) the
  brief allowed — removed in both languages before merge.
- Blog post 8's `publishDate` corrected from 2026-08-14 to 2026-08-20 — it had broken
  the blog's Thursday-weekly cadence (every prior post lands exactly 7 days apart);
  posts 9 and 10 continue that cadence forward (08-27, 09-03), owner's explicit
  instruction to date and publish ahead of the calendar.
- `translations.ts` — cross-links the two new ES/EN slug pairs.

### Published (blog post 8 — OCR for engineers, I-020)

- Blog post 8, "OCR: what we learned, and what the literature actually says" — the
  blog's first post written for an engineering audience rather than lawyers. Four
  verified citations (TrOCR, DocLayNet, a 2025 visually-rich-document QA survey,
  OHRBench) and a real four-bug postmortem from a dirty-document test run, sourced
  from the private `foja` codebase, abstracted (no exact CER numbers, engine names,
  or case identity), and reviewed/approved by the owner before publish — including
  keeping the post's "98% confidence, missing paragraph" hook, a real sourced figure
  flagged by independent review and explicitly approved. `draft: true → false` in
  both languages, live at `/blog/`.
- `translations.ts` — cross-links the new ES/EN slug pair.

### Published (blog post 7, I-023)

- Blog post 7, "Why I started pin" / "Por qué empecé pin" — the blog's first named
  byline, Founder & CEO Alicia Chang Cox, on why pin exists, told through her career
  pattern (Grab, Uber, Stripe). Owner approved the copy in full, no changes;
  `draft: true → false` in both languages, live at `/blog/`.

### Added (blog editorial voices + calendar, I-022)

- `planning/authors/` — a persona template plus the blog's first named-author
  profile, Founder & CEO Alicia Chang Cox, built from her career facts (Carey,
  Banco de Chile, Harvard JD, Grab founding board, Uber, Stripe, pin).
- `planning/plans/E01-editorial-calendar.md` — the blog's pillar taxonomy, voice
  policy and sustainable cadence, companion to the `E01-blog.md` pillar plan.
  Fixes two stale bullets in `E01-blog.md` itself (EN was marked out of scope
  though I-011 shipped it; bylines were marked collective-only).

### Fixed

- Blog timeline scroll can now reach every post, not just one or two near the
  middle of the list — the scroll viewport's top/bottom padding is measured from
  the real render (half the viewport height) instead of a fixed `2rem`, giving
  every row, including the first and last, enough travel to reach the focus
  centre line (I-021).

### Docs (I-018)

- `.claude/repo-conventions.md` no longer claims Actions is blocked by billing on
  this repo — it's public, so CI runs. `CONTRIBUTING.md`/`README.md`/`docs/DEPLOY.md`
  already had the correct version; only this file was stale.

### Changed (blog listing controls and timeline motion, I-016)

- The grid/timeline switch is now a single icon-only control at the right of the
  tag-filter row, reusing the site's existing `.segmented` component — it used to
  be a second row of pills that read as more tags. The labels "Grilla" / "Línea de
  tiempo" remain as `aria-label`/`title` only.
- The timeline's accent mark is now a short segment that slides to the centred
  post instead of a bar filling from the top of the divider, and the zoom/blur
  falloff is measured in row-heights, so exactly one post reads as highlighted.
- Only zoom and blur are animated now: the per-row opacity ramp, the `:has()`
  hover variant and the row CSS transitions are gone — writing transformed values
  every frame *and* transitioning them is what made the motion lag the scroll.
  Scroll-snap dropped for the same reason. The static-mode rules I-004 had added
  for those three things went with them; what static mode still does here is hide
  the accent mark.
- Entering static mode now takes effect immediately instead of at the next scroll.
  I-004's FPS benchmark adds `perf-lite` ~300ms after load — a state change with no
  event — so the timeline watches the class and flushes its focus state there. A
  visitor who stopped scrolling used to be left with the list frozen mid-effect.
- The timeline's own scrollbar is hidden (`scrollbar-width: none`); scrolling,
  keyboard access and the fade mask are unchanged.

### Added (I-004)

- Static mode for low-end hardware, fully automatic — no visible control (owner
  decision: "auto, no buttons"). `prefers-reduced-motion` still wins unconditionally;
  where it isn't set, a short FPS self-benchmark (`src/scripts/perf-lite.ts`) decides,
  adding a `perf-lite` class to `<html>` that `global.css` turns off the same
  animations/transitions/`backdrop-filter` it already turned off for
  `prefers-reduced-motion` — one reused block, not a second copy.

### Added (blog timeline view, I-013)

- `/blog` and `/en/blog` now offer a second way to browse posts: a vertical,
  scroll-driven timeline, toggled in next to the existing grid (which stays
  the default). No dots, no page numbers, no tags — chronological only.

### Fixed (#19)

- Header now links to Blog in both languages (`nav.blog`), previously reachable
  only via footer or direct URL.
- `src/layouts/Base.astro` favicon `<link>` was missing the slash between the
  base path and the filename (`/pin-landingfavicon.svg`), so it never resolved
  on GitHub Pages. Fixed using the same base-path trim pattern already used in
  Header/Footer.

### Added (blog trilogy complete + navigability + share CTA, 2026-08-05)

- I-008: third and closing blog post published (`draft: false`). Copy unchanged
  from PR #14 (merged, draft-gated on owner copy approval) — today's owner request to
  make all three posts visible is that approval. All three posts now show at
  `/blog/`.
- I-007: `/blog/` listing now surfaces each post's tags as visible chips, plus a
  client-side tag filter panel (`Todos` + one button per tag, no new dependency).
  Its design-mockup gate was superseded by the owner naming the shape directly in
  the same request (see the issue's Gate resolution note).
- I-006: every post ships a share footer — X/Twitter intent link, LinkedIn
  share-offsite link, and a copy-link button — per the owner's 05/08 decision
  (share only, no comment box, no third-party tracking script).

### Added (blog content, 2026-08-05)

- I-002, I-003: the first two blog posts. Shipped `draft: true` pending owner
  approval of the copy; the owner approved the copy as written (I-002/I-003, PR
  #11) and both posts are now published (`draft: false`) — no content changed
  from what was reviewed.
  - `que-es-machine-learning.md` — "«Inteligencia artificial» no nombra una
    tecnología. Nombra una promesa." Reframes the AI/ML distinction as a purchasing
    criterion rather than a dictionary definition: the three words (entrenamiento,
    modelo, inferencia) a legal reader needs to evaluate any proposal, the two
    consequences that decide professional risk (hallucination as a structural
    consequence, not a rare defect; no persistent memory), and the volume-vs-time
    bottleneck quantified from the GTM's externally sourced reading-rate figures.
  - `por-que-ninguna-herramienta-le-sirvio.md` — "No se olvidó de su expediente.
    Nunca lo leyó entero." Explains the context window and maps each symptom the
    reader actually experienced onto its mechanism (forgetting → truncation, lying
    → compression, stalling → the system announcing its limit), kills the
    upgrade objection, and states pin's architecture as one principle rather than a
    feature list.
- Both posts carry **no page-volume figure**, per the GTM §10.2 gate (only 2,9% of a
  test file measured to date). Reading times are computed from real body word counts
  (1.131 → 6 min; 1.019 → 5 min), not copied.
- Both posts passed a fresh adversarial review (author != reviewer) against the full
  editorial spec — 0 blockers. The review's SHOULD-level findings were fixed rather
  than accepted: two sentences that announced the article's move, an over-developed
  teaser, one figure softened for safety, and a real defect — the second post's slug
  tuteaba the reader while its body correctly used *usted* throughout
  (`por-que-ninguna-herramienta-te-sirve` → `-le-sirvio`) — plus a relative cross-link
  bug: the `/blog` listing linked each post without a trailing slash, which broke the
  posts' relative links to each other outside GitHub Pages' redirect
  (`src/pages/blog/index.astro`). Visual evidence (light/dark, both posts) captured
  under `design/evidence/`.

### Changed (fidelity contract v12, 2026-08-05)

- Fidelity contract advanced to v12 in a new file
  (`design/prototype/pin-landing-v12.html`, supersedes v8/v10, which is kept
  for history and marked superseded). Editorial pass: the privacy promise —
  previously repeated across hero/thesis/footer/access — is now said once per
  surface; hero lede, all four figures, and the ask-section closing line
  rewritten; a fourth thesis point added ("Lo que no hace" / "What it does not
  do"); a reserve line under the hero CTAs; a single commitments line between
  the Empezar lede and the form (written record, not shared or used to train,
  returned/destroyed at close); the early-access toggle shortened to two perks
  (drops "Plan enterprise" / "Precio de fundador"); 21 of the 60 question-pool
  entries corrected from civil to penal vocabulary; a provenance note under the
  figures; cloud copy reconciled ("nunca entra en una nube compartida", both
  hero and thesis); the seal moved to its own footer line; the footer's second
  paragraph kept literal to the pre-existing repo text (only the seal moved
  out of it); footer links point at real anchors (`#tesis`, `#reserva`) and the
  "Empresa" column / "Sobre pin" link are gone (footer is now 3 columns).
- `src/scripts/main.ts`: keyboard access on the viewer (Enter/Space activate a
  hit, closes issue #3 item 4 — already noted done previously but not actually
  wired in code); a one-time auto-play demo that cycles the viewer's three
  mentions on first scroll into view, stopped by any reader gesture; the
  ask-bar caret no longer hides after the third typed phrase — the 2026-07-30
  QA delta is superseded by the verified v12 contract, which keeps the caret
  visible.
- Issue #3 nits closed: real favicon (`public/favicon.svg`, issue item 2);
  meta description + OG/Twitter tags derived from the approved hero copy
  (issue item 5); `aria-label="Tema"` on the theme toggle now comes from the
  ES/EN dictionary instead of a hardcoded Spanish string, fixing the `/en/`
  route rendering it in Spanish before hydration (issue item 3). Closes #3 —
  the two remaining open items (footer address/email, dead links) are resolved
  elsewhere in this PR (real anchors) or intentionally untouched (owner's real
  address/email, out of scope per instruction).
- Skip-to-content link and no-JS `<noscript>` fallback added to
  `src/layouts/Base.astro` (both previously only documented as done in
  contract comments, not actually present in the repo).
- Evidence regenerated across `design/evidence/` (hero, form, footer,
  full-page order, light/dark × ES/EN; mobile full-page ES/EN light).

### Fixed (adversarial review of I-001, 2026-08-05)

- **Blocker:** `main.ts` aborted on every `/blog/**` page — `#figures` only
  exists on the hero, so `ioFigs.observe(null)` threw and every listener
  registered after it (including the shared `#go-access` header handler)
  never ran, breaking "Ingresar" site-wide on the blog. Split the script at
  its root cause: the hero-only sections (visor, cifras, escritura,
  formulario) are now wrapped in `if (figs) { … }`; the shared sections (idioma,
  tema, revelado, Web3Forms helper, vista de acceso) run unconditionally.
  Verified with Playwright/Chromium against `astro preview`: no `pageerror` on
  `/blog/` or `/blog/<slug>`, and `#go-access` still opens the access view on
  `/`.
- **Blocker:** post dates rendered one day early for any visitor west of UTC
  — `z.coerce.date()` parses `publishDate` at UTC midnight, but
  `Intl.DateTimeFormat('es-CL')` formatted in the local zone. Added
  `timeZone: 'UTC'` to both `Intl.DateTimeFormat` calls
  (`BlogLayout.astro`, `blog/index.astro`).
- **Should:** `Base.astro` now takes optional `title`/`description` props
  (plus a `<link rel="canonical">`), used by the blog pages instead of every
  page inheriting the landing's `<title>`.
- **Should:** Footer's "Blog" link now goes through the i18n dictionary
  (`foot.l7`) and is hidden on `/en/` — the blog is ES-only (epic anti-scope),
  so it no longer offers Spanish content from the English footer.
- **Should:** `.blog-post h1` sized down from the inherited hero scale
  (`clamp(2.6rem, 6.4vw, 4.9rem)`) to `clamp(1.9rem, 3.6vw, 2.6rem)`.
- **Nit:** dropped `slug` from the blog content schema — the glob loader's
  `post.id` (derived from the filename) already is the slug; both blog
  pages now use `post.id`.
- **Nit:** `draft: z.boolean()` → `z.boolean().default(false)`, so future
  posts don't have to write it by hand.
- New evidence in `design/evidence/pr10-review-fixes/`: blog index and post
  (ES, light/dark), footer ES vs EN, and the hero access view.

### Added (blog infrastructure, 2026-08-05)

- I-001: `/blog` section infrastructure — Astro content collection
  (`src/content.config.ts`, glob loader over `src/content/blog/es/*.md`, zod
  schema for title/slug/excerpt/publishDate/author/tags/draft/readingMinutes),
  listing page (`/blog`, newest first, excludes `draft: true`) and post page
  (`/blog/<slug>` via `BlogLayout.astro`), reusing the site's existing design
  tokens. One new footer link, no header/nav entry — `/blog` is reachable only
  from there. A `draft: true` smoke-test post proves the pipeline end-to-end
  without being content. No `/en/blog`, no MDX, no comments/newsletter/CMS
  (out of scope for this issue — see `planning/plans/E01-blog.md`). Content
  (I-002, I-003) follows separately, in review for tone/positioning before
  publishing.

### Added (demo & publish, 2026-07-30)

- Both lead-capture forms (apply + access) now submit via Web3Forms
  (fetch POST, key from `PUBLIC_WEB3FORMS_KEY` — public-by-design, injected per
  environment; refs #3). Without a key they keep the previous behavior
  (on-screen confirmation, nothing sent). New localized ES/EN error state when
  sending fails (form stays editable), hidden `botcheck` honeypot in both
  forms, `.env.example`, and the `docs/CONFIG.md` entries.
- GitHub Pages deployment: `.github/workflows/deploy-pages.yml`
  (withastro/action, push to main + manual dispatch, key injected from repo
  vars) and conditional `site`/`base` in `astro.config.mjs` under
  `GHPAGES=true`. Language-switch links are now base-aware. Actions is
  billing-blocked, so `docs/DEPLOY.md` documents the full owner path including
  the manual `gh-pages` fallback and the ngrok demo steps.
- `npm run demo`: build + preview on all interfaces, with external hosts
  allowed (`vite.preview.allowedHosts: true`) so an ngrok tunnel works.
- Real README (two-layer per rule 14): what pin is, state, how to run and
  demo, evidence capture; depth folded.
- Evidence: form error state captured in `design/evidence/form-error-*.png`
  (light/dark × ES/EN).

### Changed (owner final fix, 2026-07-30)

- Figures and Ask swapped: section order is now Hero → Figures → Ask → Thesis →
  Quotes → Form (was Hero → Ask → Figures → …). Only the component order in
  `src/pages/index.astro` and `src/pages/en/index.astro` changed.
- Footer sub-line softened (owner decision — the hearing phrase was
  compromising): now "…y no lo deja a mitad del expediente." / "…and it won't
  leave you halfway through the file." The head ("A la altura de su oficio." /
  "Built to the standard of your craft.") and the emphasized seal ("Todo leído,
  todo citado." / "Everything read, everything cited.") are unchanged.
- Fidelity contract advanced to v10 in place
  (`design/prototype/pin-landing-v8.html`): same two changes, header comment
  updated (v10 = v9 + Figures/Ask swap + softened footer sub-line).
- Footer and full-page order evidence regenerated in `design/evidence/`
  (light/dark × ES/EN).

### Changed (owner decision via direction, 2026-07-30)

- Final footer tagline, in two levels: head "A la altura de su oficio." /
  "Built to the standard of your craft." (foot-tag style) plus a muted sub-line
  closing with the emphasized seal "Todo leído, todo citado." / "Everything
  read, everything cited." Replaces "El sistema operativo del trabajo legal en
  la era de la IA." / "The operating system of legal work in the AI era."
- Section order is now Hero → Ask → Figures → Thesis → Quotes → Form (was
  Hero → Figures → Quotes → Thesis → Ask → Form): asking an AI is an already
  normalized gesture, so the ask bar moves up as a familiarity hook; Figures
  next to Thesis pairs claim with mechanism ("100% cited" → "the model does not
  write the citation, it points at it"); Quotes close the argument and their
  verdict feeds straight into the offer.
- The fidelity contract advanced to v9 in place
  (`design/prototype/pin-landing-v8.html`): the same two changes, recorded in a
  header comment. The ask-bar caret in the prototype is untouched (pending
  owner confirmation).
- Footer and full-page order evidence refreshed in `design/evidence/`
  (light/dark × ES/EN).

### Added

- Astro implementation of the approved v8 landing prototype
  (`design/prototype/pin-landing-v8.html`): ES at `/`, EN at `/en/` via Astro
  i18n routing, verbatim ES/EN copy, exact color tokens for both themes, system
  font stacks, staggered reveals, animated figures, interactive viewer,
  simulated typing, browser-validated forms with on-screen confirmation (no
  backend), full accessibility from the prototype. Theme toggle persists in
  localStorage (the one authorized improvement). Zero external requests.
- Visual evidence in `design/evidence/`: hero and form, light and dark, ES and EN,
  plus full-page mobile captures (iPhone 13 viewport, ES/EN) — no horizontal
  overflow in any language/theme combination.

### Fixed (owner QA, 2026-07-30)

- Missing space between the two thesis headline spans ("…el modelo. La apunta.").
- Stray trailing caret in the ask bar: the caret now hides once the third phrase
  settles (deliberate delta vs the v8 prototype, requested in QA).
