# Rule 5 — APP_MODE

Global `APP_MODE: mock | free | production`; default **mock**. `production` is selected
only via an explicit env var — never hardcoded, never defaulted. Every paid API goes
through the single gateway/factory (`gateway_path` in the manifest) which respects
APP_MODE. Direct paid-SDK usage outside the gateway is a `blocker` (see cost-guard).
