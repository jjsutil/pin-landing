---
name: cost-guard
description: Prevent surprise spend — APP_MODE gating, one gateway for paid APIs, docs/COSTS.md, and escalation-pattern detection. Use in the pre-PR gate (step c), on "revisa costos", "audit costs", "cost projection", or whenever a diff touches a paid or potentially-paid integration. Installed in every repo, even with zero paid APIs today: dormant guards catch the FIRST paid integration.
---

# cost-guard

Builds on `config-registry`. Nothing spends money by accident.

## APP_MODE

Global `APP_MODE: mock | free | production`. Default **mock**. Production is selected
only via an explicit env var — never hardcoded, never defaulted.

## Gateway rule

Every paid-API client must:

1. Be gated by a config-registry flag, default off/mock.
2. Be constructed through **one factory/gateway** (path declared in the manifest as
   `gateway_path`) that respects APP_MODE:
   - `mock` → fixtures, no network.
   - `free` → free tiers / local models.
   - `production` → real client, requiring the explicit env var.

## Pre-PR diff scan — all blockers

- Direct paid-SDK instantiation outside the gateway.
- API keys or secrets in code.
- Gateway bypass (calling the paid endpoint around the factory).
- Ungated paid integration (no config-registry flag).
- Any **new escalating pattern** (below) — blocker **with the escalation vector
  explained** in the finding.

## Escalation risk taxonomy

`docs/COSTS.md` lists each paid integration with: billing model (fixed / per-use /
recurring), controlling params (cross-linked to CONFIG.md entries), and a risk flag:

- `linear` — cost grows with direct use.
- `recurring` — subscription/time-based; spends while idle.
- `escalating` — patterns that can multiply cost without a human deciding:
  per-token/per-request calls **in loops**, fan-out (N items → N calls), retries
  without backoff, scheduled jobs consuming paid APIs, user-triggered unbounded calls.

## Cost projection

Maintain a one-line projection (e.g. "projected: $0/mo in mock; ~$X/mo if `flag_y`
enabled at current usage") consumed by roadmap-board for the README summary.

## Dev gateway (LLM features without spend)

To exercise the APPLICATION's LLM features in dev mode without spend, a local gateway
router (e.g. OmniRoute) behind the repo's LLM port is admitted. Three rules, sealed by
the owner (2026-07-28):

1. **Data**: third-party free providers receive only synthetic or public data — real
   sensitive data never.
2. **Scope**: free models are for integration/plumbing tests; quality EVALS run only
   against the production model.
3. **Traffic**: the gateway carries application traffic only — never route the
   development agent through it.

This changes no default: with no gateway configured, everything behaves as before.

## Existing violations

Become issues via `issue-writer` — never silent refactors. The mechanical subset
(direct SDK usage outside `gateway_path`, keys in code) also runs in CI via
`scripts/check-gates.sh`.
