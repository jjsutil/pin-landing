# Changelog

All notable changes to this project will be documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Planned (blog, 2026-08-05)

- E01 epic opened: a `/blog` section reachable only from the footer, standardized
  post format (Astro content collection, no MDX dependency), starting with two
  posts (ML vs. AI; why general-purpose AI tools fail on a full case file). See
  `planning/plans/E01-blog.md`. Infra (I-001) is `ready`; both posts (I-002,
  I-003) are `backlog` pending owner content review.

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
