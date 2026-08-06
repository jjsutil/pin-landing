---
id: I-009
type: bug
status: review
impact: low
cost: low
created: 2026-08-06
---

# Logo "pin." doesn't lead to the home page

`impact: low` — cosmetic navigation bug, not a core flow, but user-visible and
directly reported by the owner.
`cost: low` — a two-line fix in `Header.astro` and `Footer.astro`, no new
dependency, no schema change.

## Context

Owner report, 2026-08-06: the "pin." logo mark in the header and footer is meant to
act as a home link. `src/components/Header.astro:14` and
`src/components/Footer.astro:17` both had `href="#top"` — an in-page anchor. From the
landing itself that scrolls to the top (looks correct by accident), but from `/blog/`
or a blog post it does nothing: there's no `#top` element on those pages, so the click
doesn't navigate anywhere.

## Fix

Both `href`s now point to the site root, built the same way every other internal link
in this repo builds theirs (`Footer.astro`'s existing `/blog` link,
`src/pages/blog/index.astro`): `` `${base}/` `` where
`base = import.meta.env.BASE_URL.replace(/\/$/, '')`. This resolves to `/` locally and
`/pin-landing/` under the GitHub Pages build (`GHPAGES=true`), so the link is correct
under both. `Header.astro` didn't have a `base` binding yet; added it following the
same pattern already in `Footer.astro`.

On the landing itself this still lands at the top of the page — navigating to `/`
already puts the browser there, so no separate anchor is needed to preserve the
scroll-to-top behavior.

## Acceptance criteria

- [x] Header logo links to the home page (root, base-path aware) from every page.
- [x] Footer logo links to the home page (root, base-path aware) from every page.
- [x] Clicking the logo from `/blog/` or a blog post navigates to the home page, not
      a no-op anchor scroll.
- [x] `astro check` and `npm run build` pass.
