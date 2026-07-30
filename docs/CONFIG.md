---
type: registry
status: active
tags: [config, registry]
---

# CONFIG.md — runtime configuration registry (documentation SSoT)

<!-- Maintained by the config-registry skill (bootflower). One entry per param.
     Backfilled by the first-run inventory on 2026-07-30. Every param change ships
     with its entry here in the same PR (rule 6, .claude/rules/06-config-ssot.md). -->

This file is the documentation SSoT for every runtime configuration parameter and
every external integration of pin-landing.

## Current state (2026-07-30)

pin-landing is a static Astro site with **one** external integration (Web3Forms,
below) and **build-time** configuration only:

- No config seed file (`config_seed: none` in the manifest).
- No read path (`config_module: none`) — the two params below are build-time
  env vars, inlined by Astro/Vite into the static bundle.
- No paid APIs, no gateway (`gateway_path: none`) — cost-guard is dormant
  (Web3Forms free tier; no SDK, plain fetch).

## Parameters

### `PUBLIC_WEB3FORMS_KEY`

- **What**: Web3Forms access key used by both lead-capture forms
  (`src/scripts/main.ts`, `sendWeb3Forms()`).
- **Type**: build-time env var (`import.meta.env.PUBLIC_WEB3FORMS_KEY`), inlined
  into the client bundle. Public-by-design per Web3Forms (it only identifies the
  destination inbox), but injected per environment anyway — never hardcoded.
- **Where set**: locally in `.env` (see `.env.example`); on GitHub Pages as the
  repo variable `PUBLIC_WEB3FORMS_KEY` (see `docs/DEPLOY.md`).
- **Unset (default)**: degraded mode — forms validate and confirm on screen,
  nothing is sent. This is the intended local/dev behavior.

### `GHPAGES`

- **What**: build flag; `GHPAGES=true` makes `astro.config.mjs` set
  `site: https://jjsutil.github.io` and `base: /pin-landing` for project-page
  hosting. Any other value (or unset) builds for root hosting.
- **Where set**: only by the Pages workflow
  (`.github/workflows/deploy-pages.yml`) or a manual Pages build
  (`docs/DEPLOY.md`).

## Integrations

### Web3Forms (form submissions)

- **Endpoint**: `POST https://api.web3forms.com/submit` (JSON), called from the
  browser on submit of the apply form and the access form.
- **Auth**: `access_key` in the JSON body = `PUBLIC_WEB3FORMS_KEY` (above).
- **Cost**: free tier; no paid SDK, so the gateway rule (5) stays dormant.
- **Anti-spam**: hidden `botcheck` honeypot field in both forms, discarded
  server-side by Web3Forms when checked.
- **Failure mode**: on network/API failure the UI shows a localized error
  (`done.error`, ES/EN) and the form stays editable for retry.
