---
name: security-sweep
description: Thin orchestrator over real security tools — gitleaks/trufflehog for secrets, ecosystem audit or osv-scanner for CVEs, plus .env-tracked and dangerous-permission checks. Use in the pre-PR gate (step d, diff-scoped), on "barrido de seguridad", "security sweep", "escanea secretos", or monthly full sweep via maintenance schedule.
---

# security-sweep

Mechanical security work belongs to mature tools; this skill orchestrates them and
interprets findings. The same invocations, with the same pinned versions, live in
`scripts/check-gates.sh` for CI — this skill and CI must never disagree on tooling.

## Tools (invoked ephemerally, versions pinned in scripts/check-gates.sh)

- **Secrets**: gitleaks (pinned release binary, cached under `.bootflower-cache/`).
- **CVEs**: the ecosystem's audit tool (`npm audit`, `pip-audit` via `pipx run`, etc.)
  or **osv-scanner** when the ecosystem tool is weak/absent. Resolve the ecosystem at
  runtime from lockfiles present — never bake it into the skill copy.
- Never add these as permanent dev-dependencies.

## Modes

### Pre-PR (gate step d) — diff-scoped

1. gitleaks over the branch's new commits.
2. Audit only when the diff touches dependency manifests/lockfiles.
3. `.env`/credential files newly tracked in git → finding.
4. Dangerous permissions: world-writable files, exec bits on data files, overly broad
   IAM/policy documents in the diff.

Severity: leaked secret, tracked `.env`, critical CVE introduced by this diff →
**blocker**. Lower-severity CVEs, pre-existing issues surfaced by the touch →
**should** (acknowledged in the PR's accepted-risks section if unresolved).

## On demand / monthly — full sweep

Full-history gitleaks, full dependency audit, full permission scan. Convert real
findings into issues via `issue-writer`; a leaked secret additionally means: rotate
first, then clean history — say so explicitly in the issue.

## Output

Tool-by-tool result summary with severities; never paraphrase away a finding the tool
reported — link or quote it.
