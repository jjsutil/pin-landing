---
name: pr-reviewer
description: Layered code review of a diff (own branch pre-merge, or a GitHub PR via gh) with blocker/should/nit severities, concrete fixes, and an explicit verdict. Use on "revisa el PR", "review this PR", "review my changes", "code review de la rama", or as the review required before any merge. Only blocker findings block.
---

<!--
PROVENANCE — vendored + adapted.
Upstream: https://github.com/anthroos/claude-code-review-skill
Commit:   37500dfa61eff982aebf61adc55fd4d65a581e33 (2026-02-27), MIT © 2026 WeLabelData.
Adapted for bootflower: severity model (blocker/should/nit), layered review order,
verdict semantics, config-registry/cost-guard layers, I-xxx awareness, test-gap rule.
This vendored copy is canonical; upstream is never auto-pulled again. Fixes flow
through the bootflower meta-repo (rule 9).
-->

# pr-reviewer

Review a diff, not a vibe. Every comment: explicit severity, anchored to specific
lines, **always with a concrete proposed fix**.

## Modes

- **Branch (default)**: `git diff $(git merge-base main HEAD)...HEAD` (repo's default
  branch if not `main`).
- **GitHub PR**: `gh pr diff <n>`; with `--post`, publish the review via
  `gh pr review` / `gh api repos/{owner}/{repo}/pulls/{n}/comments` (line-anchored).
- **Local uncommitted**: `git diff HEAD`.

## Context gathering

1. Read `.claude/repo-conventions.md` (manifest, gateway_path, config_seed, limits).
2. Read the **linked I-xxx issue** (from branch name or PR body): review the diff
   against its acceptance criteria and anti-scope. Work outside the issue's scope, or
   criteria left unmet without being said, is a finding.
3. Read the changed files fully — not just hunks — plus their tests.
4. **Filter pre-existing issues** (upstream's key idea, kept): before reporting, check
   with `git blame` that the problem was introduced or modified by this diff. Old
   problems merely *revealed* by the diff are at most a `should` with an issue link —
   never demand unrelated migrations (matches config-registry's legacy-touch rule).

## Severity model — gate semantics

| Severity | Meaning | Gate effect |
|---|---|---|
| `blocker` | Would break correctness, security, cost, or an invariant (rules 1–9) | **Blocks merge. Fix before, never after.** |
| `should` | Real improvement, safe to defer consciously | Must be listed + acknowledged in the PR body's accepted-risks section |
| `nit` | Style/preference | Never blocks; batch freely |

Confidence: internally score each finding 0–100 (certain vulnerability ≈ 95, likely bug
≈ 80, needs-context ≈ 60). Report only ≥70; below that, silence beats noise. Skip
linter territory, explicit-ignore comments, and pedantry.

## Layered order — review in this sequence, report in this sequence

### 1. Correctness
Logic errors; null/undefined and boundary handling (empty, single, negative, zero,
overflow, encoding, timezone/DST); async bugs (missing await, unhandled rejections,
races, stale closures); loop errors (off-by-one, mutation while iterating, forEach with
async); error handling (empty catch, swallowed errors, missing cleanup/finally);
resource leaks (files, connections, timers, listeners); business-logic violations
(wrong formula, invalid state transition, missing rollback on partial failure).

### 2. Security
Injection (SQL/NoSQL/command/template/header); authn/authz (missing checks, IDOR,
privilege escalation, session issues, path traversal); sensitive-data exposure
(hardcoded secrets, secrets in logs/errors, weak crypto, over-broad API responses);
XSS (unsafe sinks, `dangerouslySetInnerHTML`, missing encoding); unsafe deserialization
and prototype pollution; SSRF, open redirect, CSRF, JWT weaknesses, ReDoS, mass
assignment, unsafe file upload, TOCTOU races.

### 3. cost-guard / config-registry violations
Direct paid-SDK instantiation outside `gateway_path`; gateway bypass; ungated paid
integration; new escalating cost pattern (paid calls in loops, fan-out, retries without
backoff, scheduled paid jobs, unbounded user-triggered calls) — explain the escalation
vector; new/changed param without its CONFIG.md entry; non-secret config read outside
the single read path; secrets outside env. These are `blocker` by default (semantic
drift and legacy touches are `should`, per config-registry).

### 4. Tests
**Test-gap rule: new logic without coverage is at least `should`** — name the uncovered
branch/function concretely. Also: only-happy-path tests, missing error-case tests,
assertions-free tests, order-dependent tests, mocks testing mocks.

### 5. Design
Wrong abstraction or duplication the diff introduces; tight coupling; god functions;
dead code; API design (inconsistent shapes, wrong methods/status codes, breaking
changes unmarked); performance with real impact (N+1 queries, missing pagination,
O(n²) on unbounded data, missing timeouts/retries on network calls, unbounded caches).

### 6. Evidence
A PR that changes a **user-visible surface** (UI, rendered export/artifact, doc with
visual content) without evidence in its body — screenshots, before/after, or a fix's
repro output — is a **`blocker`**, not a `should`: it can no longer be waived by
acknowledging it in accepted-risks. For the UI code surface this is also enforced
mechanically (`check-gates` step 8: a diff under `ui_surface_glob` must ship a committed
screenshot or a `no-visible-surface` commit trailer), so a review that lets it through is
a review that ignored a red gate. What counts as evidence is defined by the repo's
`CONTRIBUTING`. A PR with no visible surface satisfies this by declaring it (e.g.
"sin superficie visible → evidencia = tests/gate"); an empty/absent section does not.

**Reviewing fidelity means opening the render, not reading the diff.** When a PR claims
to match an artifact/mockup, verify by comparing the *rendered* surface to the artifact
surface-by-surface, in every theme the change touches, on **representative data** (a
sanitized fixture can hide a wall-of-text that real data produces). A source-diff against
the mockup's markup is not a fidelity review — it misses exactly what the pixels reveal.

### 7. Style — nit-only
Naming, magic numbers, deep nesting, comment quality, formatting not covered by
linters. Nothing in this layer may ever be `blocker` or `should`.

## Output

```markdown
## Review — <branch or PR>

**Scope:** X files, +A/−B lines. Linked issue: I-xxx (criteria: met / partially / not).

### blocker (N)
1. `path/file.ts:42` — <what and why it breaks>
   **Fix:** <concrete change, diff-style when short>

### should (N)
...same shape...

### nit (N)
...same shape, terse...

### Verdict: approve | approve-with-nits | request-changes
<one-line justification>
```

- **request-changes** ⇔ at least one `blocker` (or acceptance criteria silently unmet).
- **approve-with-nits** — no blockers; shoulds/nits exist. List the unresolved `should`
  items explicitly so pr-writer can carry them into the accepted-risks section.
- **approve** — clean.

Defects found in review are fixed **before** merge, never after — a review is not a
trámite.
