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

## Current state (first-run inventory, 2026-07-30)

**No runtime configuration exists.** pin-landing is a fully static Astro site:

- No config seed file (`config_seed: none` in the manifest).
- No read path (`config_module: none`).
- No paid APIs, no gateway (`gateway_path: none`) — cost-guard is dormant.
- Zero external requests at runtime by design (no CDNs, no web fonts, no analytics).

## Integrations

None. The lead-capture forms are front-end only; submission is a
`// TODO(backend)` pending an owner decision. When a backend is chosen, its
endpoint and any keys must be registered here **before** the integration merges
(rule 6), and `gateway_path` updated if the path is paid.
