---
id: I-006
type: feature
status: staging
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

Two separate calls were bundled in that sentence and this issue kept them separate:
whether posts get *some* CTA, and whether that CTA is a comment box.

**DECIDIDO por el dueño (05/08):** el CTA de cada post es **compartir, no conversar** —
botones de repost/compartir en X (Twitter) y LinkedIn, más opción de enviar/copiar el
enlace. **Caja de comentarios descartada definitivamente**: es un producto empresarial,
no un blog "libre". La participación del lector es difundir, no comentar.

## Scope

- `BlogLayout.astro` gets a share block (X/LinkedIn repost buttons + copy-link),
  placed at the end of the post body, using existing design tokens
  (`src/styles/global.css` — E01 already forbids inventing a new palette).
- No backend/runtime component: all three actions (X share intent, LinkedIn share,
  copy-link) are client-side/passive, nothing to register in `docs/CONFIG.md`.

## Anti-scope

**Comment box is permanently out of scope** for this issue and for the blog generally
per the owner's 05/08 decision above — not a placeholder pending a future call.

## Acceptance criteria

- [x] Share block renders X repost, LinkedIn repost, and copy-link — no comment box.
- [x] CTA renders on every existing post (I-002, I-003, I-008) via `BlogLayout.astro`,
      light/dark — ES only for now, EN still pending I-005 (not yet shipped).
- [x] Visual evidence attached per repo convention (`design/evidence/blog-post3-share-closeup-{light,dark}.png`).
