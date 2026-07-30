# Rule 6 — Config SSoT

All non-secret runtime config lives in the global config registry (`param, value`),
read through exactly one read path (`config_module`). Env vars are for secrets and
`APP_MODE` only. Every param change ships with its `docs/CONFIG.md` entry **in the same
PR**. New integrations are registered and flag-gated before merge. Applies to ALL
executable code — app, scripts, jobs, notebooks; tests exempt only via mocks/fixtures.
