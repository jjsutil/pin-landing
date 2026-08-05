# E01 — Blog section (footer-only entry point)

> Pillar plan for the blog epic. Read this before planning any I-00x issue under E01.

## Why

Owner request (2026-08-05, chat): get closer to the user and build long-term SEO by
publishing standardized, well-diagrammed posts the owner authors collaboratively with
the agent. First two posts are already scoped by the owner (see I-002, I-003).

## What this is, in one line

A new `/blog` section, reachable **only** from a new link in the footer — not from the
header nav, not from any CTA on the main page. The hero/CTA page (governed by the v12
fidelity contract) is untouched.

## Architecture decision

- **Astro content collection**, not a CMS and not MDX. `src/content.config.ts` (content
  layer API, `glob` loader) over `src/content/blog/es/*.md`. Plain Markdown with inline
  HTML/SVG where a post needs a real diagram — Astro's Markdown renderer passes raw HTML
  through, so no `@astrojs/mdx` dependency is needed for "diagrammed" posts. Add it later
  only if a post genuinely needs interactive/component-driven content.
- **ES only for v1.** The site is bilingual (`i18n: es default, en`), but the two seed
  posts are written for the Chile-first legal audience the whole site targets. `/en/blog`
  is explicitly out of scope until an English post exists — do not scaffold empty EN
  routes ahead of content.
- **Standardized frontmatter** (schema below) is what "estandarizadas" means in practice:
  every post — this one or one the owner sends later — fills the same fields and renders
  through the same `BlogLayout.astro`, so format decisions happen once, not per post.
- **Byline, not anonymous.** Both seed posts are attributed to `equipo fundador de pin`
  (frontmatter `author`), not a single name — matches the founder-led GTM motion already
  in `docs/business` on the foja side.

### Frontmatter schema (all posts)

```yaml
---
title: string
slug: string            # URL segment under /blog/
excerpt: string          # 1-2 sentences, used in the listing + <meta description>
publishDate: YYYY-MM-DD
author: string            # "Equipo fundador de pin" for the first two
tags: [string]
draft: boolean            # true = built but not linked from /blog or sitemap
readingMinutes: number     # computed at write time, not runtime — keep it honest
---
```

### Routes

- `src/pages/blog/index.astro` — listing, newest first, excludes `draft: true`.
- `src/pages/blog/[slug].astro` — post page via `BlogLayout.astro`.
- `src/components/BlogLayout.astro` — title, byline, date, reading time, tag chips,
  article body, using the same design tokens as the rest of the site
  (`src/styles/global.css` — do not invent a new palette).

### Footer

One new link in `Footer.astro`, in the existing `foot-col` that already lists internal
anchors (`#empezar`, `#tesis`, `#reserva`) — add `Blog` pointing at `/blog`. No new
footer column, no header/nav entry.

## Sequencing

1. **I-001** — infrastructure (collection, routes, layout, footer link). No content
   beyond a smoke-test draft post; ships with `draft: true` until I-002 is ready.
2. **I-002** — first post, in parallel once the layout exists (content doesn't block on
   infra being merged, but publishing does).
3. **I-003** — second post, same shape as I-002.

I-002 and I-003 are content, refined with the owner in conversation before they become
issue-ready `status: ready` — they start `status: backlog` because the copy isn't final
yet (see each issue's Context).

## Anti-scope

- No comments, no newsletter signup, no CMS/headless-editor integration — markdown files
  in the repo are the authoring surface for now.
- No English posts yet.
- No RSS/sitemap changes beyond what Astro's build already emits — revisit once there
  are enough posts to matter for SEO in practice, not speculatively.
