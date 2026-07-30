---
name: negocio
description: Use when a repo has to answer who pays and whether the margin survives — writing or revising its BUSINESS.md, setting or sanity-checking a price, sizing the cost of serving one unit before naming a number, deciding whether a product is a commercial bet or a personal tool, or convening the expert panel before a big commercial call ("cuánto cobramos", "esto es negocio o juguete", "arma el modelo de negocio", "revisá el precio", "convocá al panel", "podemos vender esto"). Its subject is ONE repo's commercial layer. Not the portfolio's allocation across repos, which is direccion; not the repo's strategic position and roadmap, which is ceo-zoomout; not the origin interview for a new idea, which is idea-to-design.
---

# Negocio

> [!IMPORTANT]
> **Building stopped being evidence.** AI collapsed the cost of building and left the cost
> of building the wrong thing exactly where it was. A finished product proves nothing about
> demand. The only signal that survives is **a human's commitment** — time booked,
> reputation lent, or money moved. This skill exists because every repo in this system can
> produce a working product without ever meeting someone who would pay for it.

Two modes, one subject. `BUSINESS.md` is the **state** — six fields, kept honest. The
expert panel is the **event** that updates it. Without the file the panel opines into the
void; without the panel the file goes stale.

## BUSINESS.md — the state

One file per repo at `docs/BUSINESS.md`. Six fields, because seven stop being reread.

| # | Field | What it must contain |
|---|---|---|
| 1 | **Who pays and why** | A concrete person, not a segment. What they do *today* instead |
| 2 | **Stage** | `personal tool` · `exploration` · `validation` · `revenue` |
| 3 | **Riskiest assumption** | Written so it can be false. One, not five |
| 4 | **Cheapest next test** | And what result would kill the thesis |
| 5 | **Unit economics** | Cost to serve one unit · price · margin · what is measured vs assumed |
| 6 | **The number this quarter** | One |

**A repo with no commercial intent still gets the file**, and it is two lines: stage
`personal tool`, plus why that is the right answer. Today that decision is implicit in
every repo that never mentions money, and implicit is where decisions nobody made hide.

**Never invent a field.** If willingness to pay was never tested, field 3 says `no
evidence` and field 4 says how to get it. A plausible number written into `BUSINESS.md`
becomes a fact the next session builds a price on — which is exactly how foja's cost
appendix propagated an estimate that was low by 5–40×.

<details>
<summary>Writing rules — where the file lives, how it relates to existing docs, and what never goes in it</summary>

- **Extend, never duplicate (rule 10).** A repo that already carries a business or GTM
  document keeps it as the long form; `BUSINESS.md` is the six-field state that points at
  it. Two live documents on one subject is how they diverge.
- **Layered (rule 14).** The six fields are the visible layer. Derivations, cost tables,
  segment analysis and evidence go folded.
- **Language follows `docs_language`** in the repo manifest (rule 4), like every other doc.
- **Every number carries its provenance**: measured, estimated with stated assumptions, or
  absent. Those three words are not decoration — they are the difference between a price
  and a guess.
- **Never in this file**: five-year projections, TAM/SAM/SOM, funnel diagrams, personas
  with stock photos, or any metric the repo cannot currently compute.

</details>

## Unit economics is the price floor

> [!IMPORTANT]
> **Cost-plus is dead for classic software and alive as a *floor* for AI products.** The
> marginal cost of a call is not zero: it is input tokens × output tokens × price, and it
> **scales with engagement** — the one thing SaaS treats as free upside. Know the cost of
> serving one unit before naming a price. Never price *at* the floor; never price below it.

The 80% gross margin of classic software does not come back. Reported and estimated
figures put the ceiling around **50–70%** — infrastructure-software territory — with the
fastest-growing AI companies well below it. Two anchors: GitHub Copilot was reported
losing more than $20 per user per month on a $10 plan, and Anthropic said publicly that
some users of its $200 tier consumed **model usage worth tens of thousands of dollars**.

**A flat plan with no compute cap is unbounded risk with no balance sheet to absorb it.**
Flat AI plans through 2025–26 converged on the same architecture: headline price, an
allowance denominated in **compute** rather than requests, and a **hard cap**. The cap is
the margin floor. Cursor learned this in public: mid-2025 it moved its $20 tier from
request limits to compute limits, users who believed their usage was unlimited hit hard
caps, and the CEO apologised and refunded.

<details>
<summary>The margin levers, in order of published evidence</summary>

| Lever | Evidence |
|---|---|
| **Prompt caching** | 90% discount on cache reads (Anthropic publishes 0.1× base input; break-even after ~2 reads). Stacks with batch |
| **Batch processing** | 50% flat on input and output, 24h latency |
| **Model routing / cascades** | Largest practical lever in production — and the one that destroyed trust at Cursor when it was *silent*. Make the cap and the model visible |
| **Small / distilled models** | 10–30× published price gap versus frontier tiers |

**Choosing the production model is a business decision, not a technical preference.** It is
usually the single variable that decides whether a price tier has a margin at all. If it
sits in a roadmap document as an open technical option, it is misfiled.

**A good value metric** is one the customer understands unaided, that tracks the value they
receive, grows with their success, is predictable enough for procurement, and can be
measured and defended in a dispute. **Per-seat breaks structurally in the agent era** —
charging per seat punishes your own product for doing the work.

</details>

## Kill criteria — the field this system is missing

> [!IMPORTANT]
> **A state and a date, written before you need them.** "If I am not in state X by date Y,
> I stop." Without them a portfolio only grows: nothing has a defined way to end, so
> everything stays alive at the cost of the thing that deserved the attention.

Entry discipline is common; exit discipline is almost absent. Check the claim before
leaning on it: the operators cited to justify a large portfolio publish **entry** rules —
ship fast, charge from day one — and rarely publish an exit rule at all, and their
reported revenue tends to concentrate in one or two products with a long tail earning
almost nothing. Whatever the portfolio's shape, prioritisation frameworks cannot supply
this: ranking produces an ordered list and no instruction to stop anything. **Only kill
criteria subtract.**

Kill criteria go in the issue that opens the bet, not in someone's memory. The reason is
opportunity cost: every hour saved by reaching "no" quickly is an hour available for
something that might work.

## The panel — the event

Fifteen lenses, each asking what no other lens asks. **Convene the subset the decision
needs**, not all fifteen every time. A full panel over a declared personal tool is burning
quota to confirm what the file already says; reserve it for a real commercial call.

| # | Lens | The question only it asks |
|---|---|---|
| 1 | Paying customer | What do you do about this today, and why is that fine? |
| 2 | B2B sales | Who signs, how long does it take, which objection kills the deal? |
| 3 | Positioning | Which category do they file you under, and against what do they compare you? |
| 4 | Growth & conversion | Where exactly do people drop between hearing about it and paying? |
| 5 | Pricing & packaging | Are you charging per unit of value or per unit of cost? |
| 6 | Unit economics | What does serving one cost, and what happens to margin at scale? |
| 7 | Product-market fit | Do they come back on their own, or because you called them? |
| 8 | Experience | Where does someone who already wanted it give up? |
| 9 | Trust & compliance | What are you promising that you cannot guarantee? |
| 10 | Competition | Why doesn't the incumbent do this tomorrow? |
| 11 | Channel | How does the first one hear about it, and the hundredth? |
| 12 | Devil's advocate | Why is this not a business? |
| 13 | Operations | What breaks at fifty customers and one person? |
| 14 | Technical-commercial | What can be promised without lying, with the system that exists today? |
| 15 | Founder reality | Which other project dies if this one advances? |

Lens 15 is not filler. In a portfolio carried by one person, opportunity cost **is** a
business variable, and nothing else measures it.

<details>
<summary>How the panel runs — three acts, the output contract, and the rule that keeps it from being theatre</summary>

**Act 1 — Divergence.** Each lens reads the repo's real documents and its measured unit
economics, and returns four things, never an essay: the question nobody asked, the number
that would have to be known, the risk that kills the business from its angle, and a
one-line verdict.

**Act 2 — Collision.** One agent crosses the outputs looking for **contradictions**, not
consensus. When pricing says "raise to $800" and sales says "a small firm will not sign
above $200 without a tender", that tension is the finding. An average of the two is not.

**Act 3 — Convergence.** One recommendation, with the dissent recorded and attributed. The
recorded dissent is what saves you in three months, when the lens that was overruled turns
out to have been right.

**The rule that makes it worth running: every lens cites evidence from the repo or says
nothing.** A lens that found no willingness-to-pay data returns `no evidence` plus how to
get it — never an invented recommendation. A panel with no data underneath is a horoscope
in business vocabulary.

**What the panel is honestly worth.** A model playing a sales director is not a sales
director. What it produces is *the interrogation a sales director would run, applied to
your documents*. That is worth a great deal when the owner has no such lens available, and
worth nothing if its answers are not checked against real numbers.

</details>

## Theatre and essence

Run none of the left column. It is real practice at the wrong stage, or a ritual for
investors who do not exist here.

| Theatre — skip | Essential — do not skip |
|---|---|
| Five-year projections, TAM/SAM/SOM, pitch decks, formal business plans | A written ICP per product, and kill criteria with a state and a date |
| Rule of 40, burn multiple, magic number (need $30–50M ARR, or any ARR at all, to compute) | Unit economics as the price floor, before any number is published |
| LTV and LTV:CAC as a number to defend (with 40 customers one cancellation halves it) | A value metric with a compute cap |
| Default alive/default dead literally — it models raised capital, not attention | Conversations whose output is a **commitment or an advance**, never a compliment |
| Vanity metrics: followers, pageviews, stars, launch rankings | Prompt caching and batch from day one — 90% and 50%, and they stack |
| Launches as a *strategy* rather than one day's lottery (the median Show HN post scores in the low single digits) | Annual prepay at ~20% off — the cheapest financing a solo operator has |
| Conjoint analysis, and surveys generally below ~100 qualified prospects | Asking for the sale: stated preference is not revealed preference |

<details>
<summary>Disagreements this skill keeps rather than averages</summary>

Genuinely open questions. A skill that resolved them one way would give confident, wrong
advice half the time — surface the tension instead, and let the owner decide with it in view.

| Question | One side | The other |
|---|---|---|
| Is product-market fit felt or gradual? | Andreessen: you can always feel it | Horowitz: it does not announce itself |
| Does growth cause or follow the product? | Graham: growth is the compass for nearly every decision | Seibel: growth is the result of a great product, not its precursor |
| Survey or behaviour? | Sean Ellis 40%, Superhuman's engine — attitudinal, affordable at 40 responses | Cohort retention — behavioural, needs 90+ days, cannot run pre-launch. Neither substitutes for the other |
| Design partners: free or paid? | Contract data: ~75% carry no fee | Advice: a free pilot is the weakest possible signal. Free is common because it is easy to sign, not because it validates |
| One price tier or three? | Good-better-best captures segments | Below ~100 customers there are no segments, only anecdotes — and three tiers is three times the maintenance |
| Does "charge more" always apply? | Low price signals low confidence | That advice comes from funded B2B with a brand behind the number; a high price with no proof is unsellable |
| Many products at once? | Volume finds the outlier | Momentum needs concentration; sequential only. And the portfolio operators cited for the first position do not actually support it |

</details>

## Boundaries

| Not this skill | Whose it is |
|---|---|
| Where the week's effort goes across repos; the owner's decision queue | `direccion` |
| Filing what this skill finds as trackable work | `issue-writer`, per the repo's hierarchy (rule 12) |
| Spend controls, APP_MODE gating, the paid-API gateway | `cost-guard` (rule 5) |
| One repo's strategic position, pillars and roadmap adjustment | `ceo-zoomout` — **user-scope, may be absent** |
| The origin interview that produces a DESIGN.md for a new idea | `idea-to-design` — **user-scope, may be absent** |

`cost-guard` stops you spending money by accident. This skill decides whether spending it
earns any. They meet at one number — the cost of serving one unit — and neither owns the
other's half.

**The two marked skills are installed at user scope and are not vendored with this one.**
In a session where they are not present, their work does not disappear — it has no owner.
Say so rather than absorbing it silently (see I-010).

<details>
<summary>Provenance of the figures quoted above — what is published, what is reported, what is directional</summary>

This skill demands that every number in `BUSINESS.md` carry its provenance. The same
applies to its own.

| Figure | Standing |
|---|---|
| Prompt caching: cache reads at 0.1× base input, writes at 1.25× (5 min) / 2× (1 h) | **Published** in Anthropic's pricing documentation. Break-even after ~2 reads follows arithmetically |
| Batch processing: 50% on input and output, ~24 h latency | **Published** by the major providers |
| 10–30× price gap between small and frontier model tiers | **Published**, derived from public price tables; the exact multiple moves with the pairing |
| Copilot losing >$20/user/month on a $10 plan | **Reported** (press, citing internal figures), not published by the vendor |
| Anthropic: $200-tier users consuming model usage worth tens of thousands | **Stated publicly** by the vendor when announcing usage limits. Note it is *consumption value*, not net loss |
| Cursor's 2025 move to compute-denominated limits, and the apology | **Public record.** Specific customer amounts circulating about it are anecdote — do not repeat them as fact |
| AI gross margin ceiling ~50–70%; fastest-growing AI companies well below | **Directional.** Assembled from investor reports and reported figures that are mutually inconsistent by definition (compute-only vs. fully loaded). The direction is solid; no single percentage is |
| Median Show HN score in the low single digits | **Directional**, varies with the dataset cut |
| Annual prepay at ~20% off | **Convention**, not a measurement — the common market discount, not an optimum |
| ~75% of design-partner agreements carry no fee | **Reported** from a standard-contract dataset. Note what it does *not* say: free is common because it is easy to sign, not because it validates |
| Sean Ellis: ≥40% "very disappointed" suggests fit | **Pattern-matching on a convenience sample**, never a controlled study. Useful as a direction, never as a threshold to defend. ~40 responses give a usable read |
| Surveys lack power below ~100 qualified prospects | **Directional**, and the reason is structural: stated preference is not revealed preference at any sample size |
| foja's cost appendix low by 5–40× | **Measured**, this portfolio, 2026-07-29: exact call count from the simulation, against the figure written in its DESIGN appendix |
| Retention, NRR and payback benchmarks | Deliberately absent — they diverge ~20 points between sources and none apply below meaningful revenue |

**When a lens quotes any of these to the owner, it quotes the standing too.** A directional
figure presented as a measurement is exactly the failure this skill exists to prevent.

</details>
