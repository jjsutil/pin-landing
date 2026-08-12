---
type: reference
status: active
tags: [architecture, forms, i18n, blog]
---

# ARCHITECTURE.md — how pin-landing is built, for whoever extends it next

> [!IMPORTANT]
> pin-landing is a **fully static Astro site, zero backend**. Every dynamic
> behavior (theme, i18n, animations, form submission) runs client-side in one
> script, `src/scripts/main.ts`. The one external dependency — Web3Forms — sits
> behind a **single seam**, `sendWeb3Forms()`, that both forms call through.
> Swapping it for another provider means editing that one function; swapping
> to a provider that needs a private secret additionally means adding a server
> endpoint, since nothing here can hold one today.

## Stack

| Layer | Choice | Why it matters here |
|---|---|---|
| Framework | Astro 7, static output (`astro build`) | No server, no runtime — every page ships as plain HTML/CSS/JS |
| i18n | Astro's built-in i18n routing | Two physical page trees (`/` and `/en/`), not one page re-translating the DOM |
| Content | Astro content collections (`glob` loader) over plain Markdown | Blog posts only; no MDX, no CMS |
| Styling | Plain CSS (`src/styles/global.css`) | No framework, no CSS-in-JS; design tokens for both themes live in one file |
| Client JS | One file, `src/scripts/main.ts`, no framework | Theme toggle, i18n nav, reveal animations, form submission |
| Hosting | GitHub Pages (`.github/workflows/deploy-pages.yml`) | Static output only — see `docs/DEPLOY.md` for the owner-run publish steps |

Zero runtime dependencies: `package.json` has exactly one (`astro`). No CDNs, no
web fonts, no analytics — stated as a design constraint in the README and worth
keeping in mind before adding anything.

## Directory map

| Path | What |
|---|---|
| `src/pages/index.astro`, `src/pages/en/index.astro` | The two landing routes (ES default at `/`, EN at `/en/`) |
| `src/pages/blog/`, `src/pages/en/blog/` | Blog listing + post routes, one tree per locale |
| `src/components/` | One component per landing section (`Hero`, `Figures`, `Ask`, `Thesis`, `Quotes`, `ApplyForm`, `AccessView`, `Header`, `Footer`) plus blog components (`BlogLayout`, `BlogList`) |
| `src/scripts/main.ts` | **All** client behavior — see below |
| `src/i18n/index.ts` | ES/EN copy dictionaries, one flat object per locale, keyed by string (`'nav.login'`, `'ac.submit'`, …) |
| `src/content/blog/{es,en}/*.md` + `src/content/blog/translations.ts` | Blog post content + the ES⇄EN slug cross-map |
| `src/content.config.ts` | The two content collections (`blog`, `blogEn`) and their shared schema |
| `src/styles/global.css` | Design tokens (light/dark) and every style rule |
| `astro.config.mjs` | i18n routing config, GitHub Pages `site`/`base` (via `GHPAGES` env), dev/preview host settings for the ngrok demo |
| `design/prototype/pin-landing-v12.html` | **The visual-fidelity contract.** On any doubt about how something should look or behave, this file wins |
| `design/evidence/` | Committed screenshots proving UI changes match the contract (light/dark × ES/EN), enforced by `check-gates` step 8 |

## i18n & routing

Astro's i18n routing (`astro.config.mjs`): `defaultLocale: 'es'`,
`prefixDefaultLocale: false` → Spanish lives at `/`, English at `/en/`. These
are **two separate physical page trees**, not one route rendering both
locales — `src/pages/index.astro` and `src/pages/en/index.astro` are distinct
files, and same for the blog.

The ES/EN buttons in the header are a **full document navigation**
(`window.location.href = ...`), not a client-side route swap — there is no
`astro:transitions` router in this codebase. Consequences worth knowing before
touching this:

- Switching language reloads the whole page. `main.ts` stashes `scrollY` in
  `sessionStorage` right before navigating and restores it once after load, so
  the reader doesn't get dropped back at the top — skipped whenever a `#hash`
  is already present, since a hash target must keep winning.
  <details>
  <summary>Why this needs storage instead of just a URL param</summary>

  A query param would work too, but would show up in the URL and could bleed
  into copy-pasted links; `sessionStorage` is invisible and self-clears (the
  key is deleted the moment it's read), so a landing on `/` from anywhere else
  never sees stale state.
  </details>
- From a blog page, the lang buttons go to the *other locale's blog listing*,
  not the home page (`inBlog` check in `main.ts`) — the exact equivalent post
  is linked separately, from `BlogLayout`, via the `translations.ts` slug map.
- Copy is a flat dictionary per locale in `src/i18n/index.ts` — no key
  hierarchy, no interpolation engine. Adding a string means adding the same key
  to both the `es` and `en` objects; a missing key renders `undefined` with no
  build-time check today (worth a lint rule if the dictionary keeps growing).

## Form submission — the Web3Forms seam

Both lead-capture forms — `ApplyForm.astro` (hero, case-analysis / early-access
toggle) and `AccessView.astro` (the "Ingresar" → `#acceso` card) — submit
through **one function**, `sendWeb3Forms()` in `src/scripts/main.ts`:

```ts
async function sendWeb3Forms(subject: string, fields: Record<string, string | boolean>): Promise<boolean> {
  if (!W3F_KEY) return true; // degraded mode: behaves like success, sends nothing
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      signal: AbortSignal.timeout(15000),
      body: JSON.stringify({ access_key: W3F_KEY, subject, from_name: 'pin landing', ...fields }),
    });
    const data = await res.json();
    return res.ok && data.success === true;
  } catch {
    return false;
  }
}
```

Every provider-specific detail — the endpoint URL, the `access_key` field name,
the `from_name` field, the `data.success` response check — is confined to this
one function. Both call sites just build a `fields` object and call
`sendWeb3Forms(subject, fields)`, then branch on the boolean it returns; neither
knows or cares which provider is behind it.

**Confirmed clean (2026-08): this is the right size seam, no refactor needed
today.** Adding a `FormProvider` interface for a single implementation would be
premature — extend it when a second provider is actually being wired in, not
before.

### What swapping providers actually touches

| Scenario | What changes |
|---|---|
| Another provider callable directly from the browser (e.g. Formspree, Getform) | Edit `sendWeb3Forms()` only — rename it, swap the endpoint/fields/response check. `ApplyForm.astro`, `AccessView.astro`, and their submit handlers stay untouched. |
| A provider that needs a **private** secret (e.g. AWS SES, SendGrid with a server-side API key) | The secret can't ship in a client bundle like `PUBLIC_WEB3FORMS_KEY` does today. This needs one **new** piece: a server endpoint (e.g. an Astro API route, `src/pages/api/lead.ts`) that holds the secret and that `sendWeb3Forms`'s replacement calls via `fetch('/api/lead', ...)` instead of hitting the third party directly. That also means the site can no longer be 100% static output — a real infrastructure decision, not a refactor, and worth its own design pass when it comes up. |
| Degraded-mode behavior (`if (!W3F_KEY) return true`) | Provider-specific in spirit (Web3Forms's key is public-by-design). A new provider may want its own missing-config behavior — still a one-function edit. |

Config/docs to touch on any swap: `.env.example`, `docs/CONFIG.md` (Parameters +
Integrations sections, per rule 6), and the `config_seed`/`config_module` lines
in `.claude/repo-conventions.md` if a real config layer gets introduced.

## Blog

Astro content collections, `glob` loader, plain Markdown, no MDX and no CMS
(`src/content.config.ts`). Two collections — `blog` (ES) and `blogEn` (EN) —
share one Zod schema (`title`, `excerpt`, `publishDate`, `author`, `tags`,
`draft`, `readingMinutes`). `draft: true` posts are excluded from the listing
but still build (useful for staging a post before publishing it).

ES and EN posts are **independent files** with no shared slug — the mapping
between an ES post and its EN counterpart lives in one place,
`translations.ts` (`ES_TO_EN` / `EN_TO_ES`), generated both ways from a single
literal table so the two directions can't drift apart. `BlogLayout.astro` uses
this map to link a post to its translation, when one exists.

The listing (`BlogList.astro`, shared by both locales) is a client-side card
grid with tag-chip filtering and "Ver más/Show more" pagination past 10 posts —
noted in `I-011` as fine today, a scaling concern past ~20 posts (real
pagination routes would replace the client-side slice at that point). The same
component also carries the second browsing mode reached from the icon switch
(`I-013`): a fixed-height timeline frame, always full, whose list scrolls inside
it, snaps to a post and drives the zoom/blur focus effect from scroll position.

## Build & deploy

`GHPAGES=true` (set only by `.github/workflows/deploy-pages.yml`) makes
`astro.config.mjs` set `site`/`base` for GitHub Pages project hosting
(`https://jjsutil.github.io/pin-landing/`); any other value builds for root
hosting. Full owner-run publish steps are in `docs/DEPLOY.md` — this doc is
about how the code is put together, not how to ship it.

## Related docs

- [[CONFIG]] — the runtime config registry (the two env vars this site reads)
- [[DEPLOY]] — how to actually publish
- `design/prototype/pin-landing-v12.html` — the visual-fidelity contract
- `planning/plans/E01-blog.md` — why the blog exists and what it's for
