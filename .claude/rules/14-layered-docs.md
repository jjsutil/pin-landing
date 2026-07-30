# Rule 14 — Layered documentation: human surface, agent depth

Owner decision, 2026-07-29 (review note on foja's README).

> [!IMPORTANT]
> **What is visible by default is written for a human; what is exhaustive is written for
> an agent and goes folded.** The open body of a README, a doc or a PR body carries
> product, purpose, state and decisions — readable in diagonal, in under a minute.
> Everything read only by an agent — deep technical detail, exhaustive procedures,
> internal contracts — lives inside a `<details>` block. The depth is not lost, it is
> demoted.

**This is a writing convention, not a mechanical gate.** Nothing in
`scripts/check-gates.sh` verifies it and nothing will: deciding whether a passage is
essence or depth is editorial judgement, and a check that pretended to make that call
would be theatre. It is enforced by the skills that write documentation and by review.

## Scope

READMEs, documentation under `docs/`, and **PR bodies**. The lens is product and
C-level: the default reader is someone deciding, not someone implementing.

## The two layers

| | Visible layer (human) | Folded layer (agent) |
|---|---|---|
| **Reader** | owner, C-level, a newcomer skimming | an agent about to act, or a human going deep on purpose |
| **Carries** | what it is, why it exists, current state, decisions taken and their reason | procedures step by step, internal contracts, edge cases, parameter tables, command sequences, evidence |
| **Written for** | diagonal reading — headings, short paragraphs, tables, callouts | completeness — as detailed and technical as necessary and pertinent |
| **Markup** | plain body | `<details><summary>…</summary>` |

Three habits carry the visible layer:

1. **Mark the essence with a callout.** Every section whose point can be missed by
   skimming opens with `> [!IMPORTANT]` (or `> [!NOTE]` / `> [!WARNING]` where those
   fit) containing the one passage that, read alone, conveys the section. A document
   with a single essence marks it once, near the top — as this rule does.
2. **Use visual resources on purpose.** Tables for anything comparable, bold for the
   load-bearing phrase of a paragraph, short lists over long prose. If a paragraph
   cannot be skimmed, it is either badly written or it belongs folded.
3. **Fold rather than cut.** Detail is never deleted to make a document skimmable. If
   an agent needs it, it goes in a `<details>` block with a `<summary>` that says what
   is inside — a reader must be able to decide whether to open it without opening it.

<details>
<summary>Writing the folded layer — markup, summaries, and what belongs inside</summary>

**Markup.** Plain HTML `<details>`, which GitHub renders collapsed everywhere READMEs
and PR bodies are read:

```markdown
<details>
<summary>Exact ingestion pipeline (7 stages, parameters and failure modes)</summary>

…exhaustive content…

</details>
```

Leave a blank line after `<summary>` and before `</details>`, or Markdown inside the
block will not render. Do not nest more than one level: a fold inside a fold means the
outer one should have been a separate document.

**Writing the `<summary>`.** It is a promise about the contents, not a teaser: name the
subject and the shape ("the 7 stages, with parameters"), so a skimming reader can skip
it with confidence and an agent can find it by scanning summaries alone.

**What belongs inside.**

- Step-by-step procedures and command sequences.
- Internal contracts: schemas, field-by-field semantics, invariants, error taxonomies.
- Parameter and configuration tables that only matter while implementing.
- Edge cases, failure modes, migration notes, benchmark tables, raw evidence.
- Reasoning too long for the visible layer, when the conclusion is already stated above
  it — the visible layer states *what was decided*, the fold holds *the full argument*.

**What must never be folded.**

- The purpose of the repo or the change.
- Current state and status (what works, what does not).
- Decisions and their one-line reason.
- Breaking changes, risks, and anything the owner must approve or act on.
- In a PR body: the summary, the linked issue, the accepted risks. Folding those hides
  from the reviewer exactly what the reviewer is there to see.

**In PR bodies specifically.** Summary, what changed and why, and accepted risks stay
visible; test matrices, full command output, file-by-file walkthroughs, and long
evidence dumps go folded. Visual evidence stays visible — a screenshot that must be
opened to be seen is a screenshot that will not be looked at.

**Depth is not rationed.** Inside the fold, be as detailed and technical as necessary
and pertinent. The rule limits *where* depth appears, never *how much* of it there is.

</details>

## Relation to other rules

Rule 4 governs which language docs are written in; this one governs how they are laid
out. Rule 7 owns generated sections — never fold or restyle a block between
`<!-- …:START -->` / `END` markers. Rule 10 requires the stale doc be reconciled by the
resolving PR; when reconciling, apply this layering rather than appending to the visible
body.

Applied by `docs-guardian`, `pr-writer`, `onboarding-doc` and `release-notes` when they
write.
