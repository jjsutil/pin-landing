---
id: I-006
type: feature
status: backlog
impact: low
cost: low
epic: E01
created: 2026-08-05
---

# CTA / interaction on blog posts

## Context

Owner feedback (2026-08-05, verbatim): "No sé si sería apropiado agregar caja de
comentarios en un producto del sector privado de este tipo. Pero sí deberíamos pensar en
algún tipo de cta o interacción."

Two separate calls are bundled in that sentence and this issue keeps them separate:
whether posts get *some* CTA (yes, in principle — type still undecided), and whether
that CTA is a comment box (owner leans no, but hasn't ruled it out formally).

## Decision pending — owner picks before this ships

**What kind of CTA/interaction.** Options to put in front of the owner, not to pick
unilaterally:

- CTA linking to the existing contact form (lowest lift — reuses what's already built).
- `mailto:` link to reply directly to the post's author.
- Email subscription (adds a data-collection surface — needs its own privacy/consent
  pass if chosen; register in `docs/CONFIG.md` per rule 6 if it touches config).
- Share links (X/LinkedIn/copy-link) — passive, no backend.

This issue is not "ready" until the owner picks one (or a combination) — starts
`status: backlog`, moves to `ready` once the decision lands.

## Anti-scope (owner-flagged, not settled)

**Comment box** is explicitly out of scope for this issue: the owner named the concern
himself — appropriateness for a private-sector legal product — and it stays excluded
**unless the owner makes an explicit, separate decision to include it**. Do not implement
a comment box as part of resolving this issue even if a CTA option superficially
resembles one (e.g. no reply-in-page threads).

## Scope (once a CTA type is picked)

- `BlogLayout.astro` gets the chosen element, placed at the end of the post body,
  using existing design tokens (`src/styles/global.css` — E01 already forbids inventing
  a new palette).
- No backend/runtime component for the contact-form or mailto or share-link options
  (all point at things that already exist or need none). Email subscription, if chosen,
  is scoped separately since it adds infrastructure the other options don't.

## Acceptance criteria

- [ ] Owner has explicitly picked a CTA type (recorded in this issue's Context before
      work starts).
- [ ] Comment box not implemented, per anti-scope, unless the owner's decision explicitly
      overrides it.
- [ ] CTA renders on both existing posts (I-002, I-003) and any future post via
      `BlogLayout.astro`, light/dark and ES/EN (once I-005 ships).
- [ ] Visual evidence attached per repo convention (`ui_surface_glob: src`).
