---
name: changelog-keeper
description: Maintain CHANGELOG.md in Keep a Changelog format — every PR adds its [Unreleased] entry; tags roll Unreleased into a version section. Use in the pre-PR gate (step f), on "actualiza el changelog", "add changelog entry", or when tagging a release.
---

# changelog-keeper

`CHANGELOG.md` follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/):
`## [Unreleased]` on top, then `## [x.y.z] - date` sections, entries grouped under
`### Added / Changed / Fixed / Removed / Deprecated / Security`.

## Per PR (gate step f)

Derive the `[Unreleased]` entry from the pr-writer body — one or a few lines, written
for a reader of the changelog (user-facing effect first), referencing the issue
(`(I-003)`). Same branch as the change; a PR without its changelog entry fails the gate.

Skip only for changes with no observable effect at all (pure CI tweaks may go under a
`Changed` one-liner or be omitted — judgment, but say which you chose).

## On tag

Move the `[Unreleased]` content into a new `## [x.y.z] - YYYY-MM-DD` section, leave
`[Unreleased]` empty, and hand off to `release-notes` if the user wants narrative notes.

## Delegation

Where the stack fits (JS monorepos, npm packages), delegate version/tag mechanics to
**changesets** or **semantic-release** — the skill then owns only the narrative entries
and verifies the tool's output stays Keep-a-Changelog-shaped. Never reimplement version
bumping in prose.
