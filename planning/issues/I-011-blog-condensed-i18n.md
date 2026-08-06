---
id: I-011
type: feature
status: staging
impact: high
cost: high
epic: E01
created: 2026-08-06
---

# Blog listing condensed + English blog (`/en/blog`)

Owner-reported, direct request (four problems on `https://jjsutil.github.io/pin-landing/blog/`).

## Context

The blog listing rendered every post in full, indefinitely (fine at 6 posts, a
liability at 20+), the page read as a flat text list rather than a designed
surface, and the blog had no English version at all — `/en` linked nowhere
into it, and the 6 existing posts (I-002/I-003/I-006/I-008/I-010) only
existed in Spanish.

## Scope

- **Condensed listing.** `blog-cards` is now a responsive card grid (bordered,
  hover-lift) instead of a flat divided list; excerpt clamped to 3 lines
  (`-webkit-line-clamp`); date order verified already-descending (unchanged).
  No visit counter — static site, no backend, a third-party tracker isn't
  worth it for a 6-post blog; order stays purely `publishDate` descending.
- **"Show more" pagination.** First 10 posts render; a `Ver más`/`Show more`
  button reveals the rest, client-side (same no-new-dependency pattern as the
  existing tag filter). A tag filter bypasses pagination (a filtered set is
  already short).
- **Scrollbar + polish.** `html` now declares an explicit, theme-aware
  scrollbar (`scrollbar-color`/`::-webkit-scrollbar`) — some platforms hide
  overlay scrollbars entirely, which reads as "the page doesn't scroll".
  `scrollbar-gutter: stable` avoids layout shift as pagination changes page
  height.
- **English blog.** New `blogEn` content collection
  (`src/content/blog/en/*.md`), routes `/en/blog` and `/en/blog/<slug>`
  (mirroring the ES ones), and the Footer's blog link — previously gated to
  `lang === 'es'` as an explicit anti-scope call in I-001/E01 — now points at
  the right listing in both languages. All 6 existing posts translated to
  English, English slugs, tags translated to a matching English taxonomy.
  Cross-language link between a post and its translated counterpart, via a
  small explicit slug map (`src/content/blog/translations.ts`) — not a
  frontmatter field, to avoid touching the 6 existing ES files. The
  ES/EN language switcher (`Header`/`main.ts`) now stays inside the blog
  section when the visitor is already in it, instead of always bouncing to
  the homepage.

## Translated posts

| ES slug | EN slug |
|---|---|
| `como-se-lee-un-expediente-escaneado` | `how-a-scanned-case-file-is-read` |
| `como-se-verifica-una-respuesta-de-ia` | `how-an-ai-answer-is-verified` |
| `es-legal-usar-ia-para-trabajar` | `is-it-legal-to-use-ai-for-work` |
| `por-que-ninguna-herramienta-le-sirvio` | `why-no-tool-has-worked-for-you` |
| `que-es-machine-learning` | `what-machine-learning-actually-is` |
| `que-pasa-con-su-expediente-cuando-lo-sube` | `what-happens-to-your-case-file-when-you-upload-it` |

## Anti-scope

- No visit counter / analytics (explicit owner decision — order is by date).
- No CMS, no MDX — same plain-Markdown content layer as the ES blog (I-001).
- `entrada-de-prueba.md` (smoke-test draft post) stays ES-only; it's
  infrastructure, not content.
- Lang switcher does not deep-link a specific post to its translation — that
  link lives on the post page itself (`BlogLayout`), not in the header.

## Acceptance criteria

- [x] `npx astro check` exits 0.
- [x] `npm run build` exits 0.
- [x] `scripts/check-gates.sh --base origin/main` run bare, exit 0.
- [x] `/blog` and `/en/blog` both render all 6 posts, newest first.
- [x] Every post reachable at its own `/blog/<slug>` or `/en/blog/<slug>`.
- [x] Visual evidence committed under `design/evidence/` (light + dark, ES
      listing, EN listing, one EN post).
