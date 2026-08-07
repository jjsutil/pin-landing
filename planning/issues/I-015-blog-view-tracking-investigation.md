---
id: I-015
type: spike
status: backlog
impact: low
cost: high
epic: E01
created: 2026-08-07
---

`impact: low` — no visitor-facing change until a follow-up issue implements whatever
this investigation recommends; today's ordering (I-014, pinned-first) covers the
owner's near-term need.
`cost: high` — evaluating and likely integrating a real analytics/view-counting
service is a genuine architecture change for a currently 100%-static, backend-free
site (I-011's own decision) — not a config tweak. Schema is binary
(`.claude/repo-conventions.md:50-51`); this clears `high`, not a `medium` the schema
doesn't have.

# Investigate view tracking, for future "most-viewed" ordering

## Context

Owner request (2026-08-07): order the blog showcase by view count, most-viewed first,
"even without telling the visitor." Deferred out of I-014 on purpose: the site has no
backend today — GitHub Pages, static build, no database (I-011: "No visit counter by
design: static site, no backend — order is by publishDate only"). Getting real view
counts means picking and wiring an actual tracking mechanism, which is a decision this
issue exists to make, not assume.

## Investigation questions (for whoever picks this up)

- What counts as a "view" for a static site with no server: a client-side beacon to a
  third-party analytics service (e.g. Plausible, Fathom, GoatCounter — privacy-respecting
  options exist), a serverless counter (Cloudflare Workers KV, a simple edge function),
  or something else?
- Cost: most of the above have a free tier at this traffic scale, but this still goes
  through `cost-guard` and `config-registry` (rule 6) before it's picked — new
  integration, even a free one.
- Privacy/consent: "even without telling the visitor" is the owner's framing, but
  worth surfacing during pr-plan whether a no-consent tracker changes anything legal
  (ironic if it did, given the site's own subject matter) or reputational for pin.
  Not this issue's call to make — just to raise once a concrete mechanism is chosen.
- Data lag: most static-site analytics aren't real-time-queryable at build time
  (the ordering needs to happen in Astro's build step, since there's no server to
  compute it per-request) — how would the count get back into the build? A scheduled
  job that writes counts into a data file the collection reads, most likely.

## Scope

- Investigation and a recommendation only, same pattern as I-004 — no implementation
  here. A follow-up issue picks the final approach.

## Anti-scope

- No implementation in this issue.
- Not a replacement for I-014's pinned ordering, which ships independently and stays
  regardless of what this investigation recommends.

## Acceptance criteria

- [ ] A short options table (mechanism, cost, build-time integration path, privacy
      notes) similar in shape to I-004's signal-reliability table.
- [ ] A recommendation, with the trade-offs that led to it.
- [ ] A follow-up issue filed for the actual implementation, once the owner picks a
      direction.
