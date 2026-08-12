# E01 — Blog editorial calendar & voices

> Companion to [`E01-blog.md`](./E01-blog.md) (the pillar plan for the blog epic).
> That doc owns the software architecture; this one owns the content strategy — which
> topic, in whose voice, how often. Read this before planning any new blog-content
> issue under E01.

> [!IMPORTANT]
> **Purpose.** Six posts shipped in five weeks under one collective byline. Adding named
> voices (I-022) without a shared structure would turn the blog into whoever-pitched-last
> — this doc is what keeps it reading as one publication with several voices, deliberately
> mixed, instead of a feed of disconnected posts.

## Pillars

Every post picks one. A pillar is a recurring question the blog answers, not a topic
list — new posts should extend a pillar's argument, not just share its keyword.

| Pillar | Question it answers | Default voice | Posts so far |
|---|---|---|---|
| Fundamentals | What the technology actually is/isn't, no hype | pin Founding Team (collective) | *what-machine-learning-actually-is*, *why-no-tool-has-worked-for-you* |
| Regulation & professional responsibility | What duty a lawyer using AI actually carries, and what it costs to meet it | pin Founding Team (collective) | *is-it-legal-to-use-ai-for-work* → *how-an-ai-answer-is-verified* (declared series) |
| Confidentiality & data handling | Where the case file goes, who can read it, under what rules | pin Founding Team (collective) | *what-happens-to-your-case-file-when-you-upload-it* |
| Technical depth | How the product actually works, for a practitioner evaluating it | pin Founding Team (collective — owner declined a named voice for this pillar, 2026-08-12) | *how-a-scanned-case-file-is-read* (lay version); *ocr-what-we-learned-and-what-the-literature-says* (I-020, technical version) |
| Company & founder vision | Why pin exists, why this team, why this market first | Alicia Chang Cox, Founder & CEO ([persona](../authors/alicia-chang-cox.md)) | opened by post 7 (I-023) |

## Voice policy

- **"pin Founding Team" stays the default.** A named byline is used when the content is
  genuinely that person's lived experience or judgment call — not to manufacture
  personality on a post that would read the same under any name.
- **Persona before post.** Every named voice gets a file under `planning/authors/`
  (template: [`TEMPLATE.md`](../authors/TEMPLATE.md)) before the first post under that
  byline, never reconstructed after the fact.
- **Grounded facts only.** An agent writing under a named voice may cite only what that
  person's persona file lists. No invented quotes, metrics, or anecdotes.
- **No forced rotation.** Match voice to pillar because the fit is real (Alicia writes
  company vision because it's her actual career pattern), not to give everyone equal
  airtime.

## Cadence

Six posts in five weeks (Jul 2 – Aug 6, 2026) was launch content, front-loaded on
purpose — not the sustainable pace for a 22-person team where writing the blog isn't
anyone's main job.

**Target going forward: one post roughly every two weeks.** Two consecutive posts don't
share a pillar unless it's a declared series (like the regulation pillar's two-part
arc) — that's the one rule that keeps the mix from drifting to whichever pillar is
easiest to write that month.

This doc deliberately does **not** pre-title posts for the rest of the year — a good
title needs a real hook (a ruling, a paper, a shipped feature), the same way posts 1–6
each had one. What it fixes in advance is the pillar mix, so twelve months from now the
blog hasn't quietly become five fundamentals posts and nothing else.

**Rough annual mix** (a guide for what to pitch next when a pillar is due, not a quota
enforced post-by-post): Regulation & professional responsibility and Confidentiality &
data handling stay the steady drumbeat — they track real regulatory and litigation
events, which don't run out. Technical depth publishes when there's a real engineering
lesson to report, not on a fixed schedule. Company & founder vision publishes a few
times a year, when there's an actual milestone or decision worth explaining, not as
a recurring column.

## Near-term queue

The only part of this doc naming specific posts — because these are the ones that
already have an owner and a reason to exist.

| # | Post | Pillar | Voice | Status |
|---|---|---|---|---|
| 7 | *Why I started pin* | Company & founder vision | Alicia Chang Cox | I-023, **published** 2026-08-11 |
| 8 | OCR — what we learned, what the literature says | Technical depth | pin Founding Team (owner decision 2026-08-12: collective, no new persona) | I-020, drafted 2026-08-12, `draft: true` pending owner approval — sourced partly from the private `foja` codebase, first post to do so |
| 9+ | Not assigned | — | — | picked at the next planning session against this doc's pillar mix, not pre-named here |

Two consecutive posts (7, 8) shipped same-day rather than the ~2-week target — owner's
explicit call, not a drift from the cadence policy above. Pillars didn't repeat (vision
→ technical), so the one hard rule (no back-to-back same pillar outside a series) held.

## Relation to other docs

`E01-blog.md` owns routes, layout and frontmatter schema — nothing here changes them
(`author` is already a free string; a named byline is just a different value). This doc
owns pillar balance, voice assignment and cadence. If the two ever disagree, `E01-blog.md`
wins on architecture and this doc wins on editorial judgment — they shouldn't overlap
enough to actually conflict.
