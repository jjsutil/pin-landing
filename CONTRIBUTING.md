# Contributing to pin-landing

pin-landing is the commercial landing page for **pin** (working name) — the
case-file reading product currently developed as foja. It is a static Astro
site, two languages (ES at `/`, EN at `/en/`), two themes, zero external
requests at runtime.

> [!IMPORTANT]
> `design/prototype/pin-landing-v8.html` is the **visual-fidelity contract**.
> The implementation must reproduce it: exact color tokens (both themes),
> system font stacks, layout, verbatim ES/EN copy, animations and
> interactions. On any doubt, the prototype wins.

## Development setup

Node 22+:

```bash
npm install
npm run dev        # local dev server
npm run build      # production build — must be green before any PR
npx astro check    # type/template check — must report 0 errors
npm run preview    # serve the built site
```

## Gates

> [!WARNING]
> **GitHub Actions does not run on this account** (billing block since
> 2026-07-23). The seeded workflows (`check-gates.yml`, `cadence-reminder.yml`)
> are installed but inert. The gate is **local**: run `scripts/check-gates.sh`,
> `npm run build` and `npx astro check` before opening a PR, and quote their
> output in the PR body.

- Pre-PR gate: `.claude/rules/01-pre-pr-gate.md` (docs-guardian, config-registry,
  cost-guard, security-sweep, pr-writer body, changelog entry).
- Conventional Commits mandatory (rule 2).
- PR size soft limit 400 net lines (rule 3); generated files don't count.
- UI changes (`src/`) ship visual evidence in `design/evidence/` (rule 1,
  check-gates step 8): hero + form, light and dark, ES and EN.
- Docs in English (rule 4).

## Deployment and forms

- **Deployment**: GitHub Pages via `.github/workflows/deploy-pages.yml`
  (billing-blocked today — manual fallback and every owner step in
  `docs/DEPLOY.md`). No custom domain yet.
- **Form backend**: Web3Forms (owner decision, 2026-07-30). Key =
  `PUBLIC_WEB3FORMS_KEY` build-time env (`docs/CONFIG.md`, `.env.example`);
  without it the forms degrade to on-screen confirmation only.

## Workflow system

Vendored from the bootflower meta-repo (v0.1.15): skills in `.claude/skills/`,
rules in `.claude/rules/`, scripts in `scripts/`. Never edit them locally
(rule 9) — changes go through the meta-repo and `workflow-sync`. Repo-specific
tailoring lives in `.claude/repo-conventions.md` and
`.claude/maintenance-schedule.md`.
