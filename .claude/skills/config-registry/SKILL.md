---
name: config-registry
description: Govern all runtime configuration — inventory, flag-gating, single read path, and docs/CONFIG.md as documentation SSoT — focused on integrations that involve or could involve payments. Use in the pre-PR gate (step b), on "registra este parámetro", "audita la configuración", "config inventory", or whenever a diff adds/changes config params or external integrations.
---

# config-registry

Four guarantees. Violating any of them is a gate finding.

## 1. Inventory

Every external integration — paid or *potentially* paid — is listed in `docs/CONFIG.md`.
None exists outside the registry.

## 2. Control

Every such integration is gated by params in a **global config registry** with a simple
`param, value` shape. Nothing paid activates without an explicit param.

## 3. Runtime SSoT

Config is read from **one** place:

- With a DB: a simple table, e.g. `app_config(param, value)` (value may be JSON-typed),
  seeded from a versioned file.
- Without a DB: the versioned seed file is the SSoT.
- Env vars are reserved for **secrets and `APP_MODE` only**.
- Exactly one read path — a config service/module. Scattered `process.env` /
  `os.environ` reads for non-secret config are violations.
- Scope: ALL executable code — app, `scripts/`, cron/jobs, notebooks. Tests are exempt
  only via mocks/fixtures.

The seed file path and the read-path module are declared in the manifest
(`config_seed`, `config_module` in `.claude/repo-conventions.md`).

## 4. Documentation SSoT — docs/CONFIG.md

One entry per param: name, what it does and which integration it gates, type, accepted
values, default, cost implication (link the COSTS.md entry when paid), how/where to
change it, and since-when (PR link). Secrets are documented as *existing* and *where
they live* (env var name) — never their values. No secret value ever enters the config
table, the seed file, or the repo.

## Pre-PR enforcement (full case coverage)

| Case | Severity |
|---|---|
| New/removed param without matching CONFIG.md update (rename = remove + add; both fire) | **blocker** |
| New integration not registered and flag-gated | **blocker** |
| Semantic drift: diff touches a param's read/usage path → re-verify its entry; entry stale | **should** |
| Changed default or accepted values left undocumented | **blocker** |
| Legacy touch: diff touches code of a pre-registry, still-ungated integration | **should**, linking the migration issue (create via `issue-writer` if missing) |
| Param in code/seed missing from CONFIG.md | **blocker** in the offending PR |
| CONFIG.md orphan entries; dead params (declared, never read) | findings — surface here and in `repo-health-report` |

Never demand a full migration in an unrelated PR; never let a touch pass silently.
The mechanical subset of these checks also runs in CI via `scripts/check-gates.sh`.

## First run (per repo, from repo-bootstrap)

Inventory the codebase: detect integrations (SDK imports, HTTP clients to external
APIs) and config reads; backfill `docs/CONFIG.md`; open issues (via `issue-writer`) for
every violation found. **Do not silently refactor** — first run documents reality.
