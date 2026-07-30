---
name: dependency-doctor
description: Thin triager over Dependabot — explain pending update PRs, flag abandoned dependencies, open issues for risky upgrades. Use on "revisa las dependencias", "triage dependabot", "dependency triage", or monthly via maintenance schedule. Configuration (dependabot.yml) is seeded by repo-bootstrap.
---

# dependency-doctor

Prefer the product: **Dependabot** (native GitHub, continuous, zero-token) does the
mechanical work. Its config is seeded per repo from `templates/dependabot.yml` by
repo-bootstrap. This skill only triages.

## Triage (monthly or on demand)

1. **Pending Dependabot PRs** (`gh pr list --author app/dependabot`): for each, explain
   in one paragraph what the update is, breaking-change risk (read the release notes /
   changelog of the dep), and a recommendation: merge / merge-after-test / needs-issue.
2. **Risky upgrades** (majors, deps with breaking-change notes, anything touching auth,
   payments, or the data layer): open an I-xxx issue via `issue-writer` with the
   breaking-change notes and a migration sketch — don't merge these casually.
3. **Abandoned dependencies**: any direct dep with no release/commit activity in
   >12 months → flag with a replacement suggestion; open an issue if it's load-bearing.
4. **Audit cross-check**: if `security-sweep`'s last audit flagged CVEs fixed by a
   pending update, say so — those PRs jump the queue.

## Hard rules

- Never merge dependency PRs yourself without the repo's normal gate; triage informs,
  the gate decides.
- Findings feed `repo-health-report`.
