---
type: guide
status: active
tags: [deploy, pages, ngrok, web3forms]
---

# DEPLOY.md — publishing pin-landing

Owner-facing guide: every step to put the landing online (GitHub Pages), make
the forms deliver email (Web3Forms), and demo it over the internet (ngrok).

> [!WARNING]
> **GitHub Actions is billing-blocked on this account (since 2026-07-23).**
> The Pages workflow (`.github/workflows/deploy-pages.yml`) is correct but may
> not run until billing is fixed. Until then, use the manual fallback below —
> it produces the same site at the same URL.

Resulting URL: **https://jjsutil.github.io/pin-landing/**

## 1. Web3Forms key (form email delivery)

1. Go to https://web3forms.com, enter your email address, and click *Create
   Access Key* — the key arrives by email. No account or password needed.
   Form submissions will be delivered to that address.
2. Store it as a repo **variable** (not a secret — Web3Forms keys are
   public-by-design; they only identify the destination inbox):

   ```bash
   gh variable set PUBLIC_WEB3FORMS_KEY --repo jjsutil/pin-landing --body "<the-key>"
   ```

3. For local testing: copy `.env.example` to `.env` and paste the key there.
   Never commit it (`.env` is gitignored; the repo is public).

Without the key the site still works: forms validate and confirm on screen,
but nothing is sent (degraded mode, see `docs/CONFIG.md`).

## 2. Enable GitHub Pages

Settings → Pages → *Build and deployment* → Source: **GitHub Actions**.
Or from the CLI:

```bash
gh api repos/jjsutil/pin-landing/pages -X POST -f build_type=workflow
```

## 3. Deploy

### Preferred: the workflow (needs Actions billing fixed)

Runs automatically on every push to `main`, or by hand:

```bash
gh workflow run deploy-pages.yml
gh run watch          # follow it
```

It builds with `GHPAGES=true` (site/base for the project URL) and injects
`PUBLIC_WEB3FORMS_KEY` from the repo variable if set.

### Fallback: manual deploy via `gh-pages` branch (works today)

While Actions is blocked, publish the built `dist/` from your machine:

```bash
# 1. Build for the Pages URL, with the key
GHPAGES=true PUBLIC_WEB3FORMS_KEY="<the-key>" npm run build

# 2. Pages runs Jekyll on branch deploys unless told not to
touch dist/.nojekyll

# 3. Push dist/ to a gh-pages branch (ephemeral tool, -t includes .nojekyll)
npx gh-pages -d dist -t
```

Then point Pages at the branch: Settings → Pages → Source: **Deploy from a
branch** → `gh-pages` / root (or `gh api repos/jjsutil/pin-landing/pages -X POST
-f build_type=legacy -f 'source[branch]=gh-pages' -f 'source[path]=/'`).
If you later fix billing, switch the source back to GitHub Actions.

## 4. Demo over the internet (ngrok)

One-time setup: create a free account at https://ngrok.com, then

```bash
ngrok config add-authtoken <your-token>
```

Each demo:

```bash
npm run demo          # builds and serves on all interfaces, port 4321
ngrok http 4321       # in another terminal — gives you the public URL
```

The preview server accepts any external Host header
(`vite.preview.allowedHosts: true` in `astro.config.mjs`), so the ngrok URL
works directly. Note: `npm run demo` builds **without** `GHPAGES`, i.e. for
root hosting — correct for ngrok.

## 5. Making the repo private again (later)

```bash
gh repo edit jjsutil/pin-landing --visibility private --accept-visibility-change-consequences
```

Be aware:

- **GitHub Pages on the free plan dies when the repo goes private** — the site
  is unpublished. Keeping the landing online with a private repo requires a
  paid plan or another host.
- The Web3Forms key stays valid either way (it is not tied to the repo).
