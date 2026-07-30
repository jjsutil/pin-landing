# Rule 11 — Model-weights supply chain

Downloading third-party model weights (Hugging Face or any hub) executes someone
else's supply chain on the machine that holds the repo's data. Every repo that
uses local models enforces, mechanically:

- **safetensors-only.** Pickle-like weight formats (`.bin`, `.pt`, `.pkl`,
  `.ckpt`, `.h5`) are forbidden to download AND to load — they can execute
  arbitrary code on deserialization.
- **`trust_remote_code=False`, always.** A model that requires it is disqualified
  as a candidate; there is no "just this once".
- **Org allowlist + pinned revision + hash lock.** Downloads come only from an
  explicit allowlist of organizations; the first (owner-authorized) download
  records the exact revision and per-file SHA256 in a **versioned lock file**;
  later downloads verify against it — a different revision is a failure, not an
  update.
- **One gate.** A single audited tool performs every download/verification;
  downloading around it violates this rule even if the result is identical.
- **Offline after download.** Processes that load weights run with the hub
  offline (`HF_HUB_OFFLINE=1` or equivalent): weights are a frozen local
  artifact, never a live network dependency.
- **Never in CI or automated tests.** CI neither downloads nor loads real
  weights; tests use mock adapters.
- **New model = owner authorization at that moment**, recorded in the repo's
  policy doc. End users receive weights packaged and verified against the same
  lock — never from a hub.

Reference implementation: foja's `eval/tools/fetch_models.py` +
`docs/infra/2026-07-21-politica-supply-chain-modelos.md`.
