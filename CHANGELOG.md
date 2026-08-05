# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added (blog content, 2026-08-05)

- I-002, I-003: the first two blog posts, both `draft: true` and therefore **not
  published** — they build and render but are excluded from the `/blog` listing
  until the owner approves them in conversation (acceptance criterion of both
  issues).
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
