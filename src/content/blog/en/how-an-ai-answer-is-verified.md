---
title: "A tool isn't measured by how often it's right. It's measured by what it costs to check."
slug: "how-an-ai-answer-is-verified"
excerpt: "The duty to verify is already written into the rules, and already being sanctioned. What no one explains is how you fulfill it without losing the time the tool promised to save you. That cost isn't set by your discipline: it's set by the architecture."
publishDate: 2026-07-23
author: "pin Founding Team"
tags: ["Verifiability", "Professional Judgment", "AI Tools"]
draft: false
readingMinutes: 7
---

The [previous article in this series](../is-it-legal-to-use-ai-for-work/) ended where every rule now being written on this subject ends: you can use artificial intelligence, you can't delegate judgment to it, and you're the one accountable for what you sign. The [Bar Association's guide](https://colegioabogados.cl/guia-sobre-uso-de-sistemas-de-ia-por-abogados-julio-2026-002/) calls it the duty of verification, and the Supreme Court has already suspended a lawyer [for failing to meet it](https://www.pjud.cl/prensa-y-comunicaciones/noticias-del-poder-judicial/145652).

What remains is the question no regulator answers, because it isn't a legal question but an operational one: how, exactly, do you verify an answer from artificial intelligence? And how much does doing so cost?

The second question matters more than the first, and almost nobody asks it. Because the duty to verify is yours, non-delegable, and already settled. **The cost of fulfilling it, on the other hand, isn't set by your discipline. It's set by the tool you chose.** That cost is the single number that decides whether the technology is actually saving you work or just moving it somewhere else.

## Three things that look like verification and aren't

It's worth clearing these up first, because all three get sold as verification.

**Asking the system if it's sure.** "Are you sure about that citation?" produces a confident answer, because producing confident answers is what the system does. If you read the [first article in this series](../what-machine-learning-actually-is/) you have the vocabulary: every answer is an inference, a prediction of what text comes next. Asking the model about its own accuracy asks it for a prediction about another prediction. It doesn't add a fact to the conversation; it adds another plausible paragraph.

**Putting a second model on top of the first.** It's the same operation with a bigger budget. Two systems of the same kind, trained on similar material, agreeing on a plausible text, produce exactly that: agreement, not verification. The Bar guide ruled this out in a single line — verification carried out by the same system, or a similar one, doesn't count — and that line, which looks technical, is the most important one in the document.

**The confidence score.** A number between zero and one next to each claim looks like rigor. But look at who issues it: the same system that issued the claim. It's the vendor grading its own test. It can be a useful number for prioritizing work; it is not, in any sense that helps you before a court, a verification.

What all three have in common: everything happens inside the system. And verification, by definition, is an external act. It requires an object that isn't generated text. In a case file that object exists, it has numbering with procedural value, and you've known it since your first day in the profession: the page.

## The method fits in four steps

There's no more mystery than this, and it's worth writing it down once so we don't have to argue about it again.

**One: break it down.** An AI answer doesn't get verified as a block; it gets verified claim by claim. "The witness testified on March 12" is a claim. "That testimony contradicts what's stated on page 2,044" is two.

**Two: demand a source for each one.** Every claim has to arrive pointing at where it came from: which document, which page, ideally which spot on the page. And here's the hard rule, the one that orders everything else: **a claim that arrives without a source doesn't get verified. It gets discarded**, or downgraded to a hypothesis you'll investigate on your own, through another path. Going out to find support for a sentence the system didn't support is doing the system's work, on your time.

**Three: open it.** Not the transcript: the page. The real image, with the ink, the stamp, and the margin. Read the passage, confirm it says what the answer claims it says, in the context in which it says it.

**Four: decide.** And this step is entirely yours, because here the machine has nothing left to contribute. That the citation exists and says what's claimed is one thing; what it means for your theory of the case, whether it helps or weakens it, whether it gets invoked or held back, is another. **The machine can guarantee provenance. It cannot guarantee relevance.** They're two different controls, and only the first is automatable. The second has another name: it's your profession.

Read it again and notice what's missing from the method: rereading the case file. Verifying isn't rereading ten thousand pages. It's opening the exact pages the answer claims to have come from. That difference — between rereading and opening — is the whole economics of the matter.

## The arithmetic that decides whether the tool was worth it

Now the numbers, because they've been measured and because they're what a partner should look at before signing any subscription.

AI-powered legal research tools — the serious ones, the ones sold as reliable — hallucinate [17% to 33% of the time](https://onlinelibrary.wiley.com/doi/full/10.1111/jels.12413), depending on which one. The previous article already drew the consequence: an error rate like that isn't a tolerable margin, it's an obligation to review 100% of what the system produces. There's no sampling shortcut: you don't know which 17% you landed the error in.

If review has to be 100%, the tool's real savings reduce to a single subtraction: what it would cost you to do the work yourself, minus what it costs you to verify everything the tool did. And that subtraction changes sign based on a single factor: **how much it costs to verify a claim**.

With the source pointed at, verifying a claim takes seconds: a click, the page opens, the passage is in front of you, confirmed or discarded. A hundred claims verified fit into a morning, and the [time savings that are actually measured](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4626276) — 12% to 32% in real legal work — stay in your pocket.

Without the source pointed at, verifying a claim means searching for it. And searching for a sentence in a case file of tens of thousands of pages is, in practice, rereading: the same [five hundred to eleven hundred hours](../what-machine-learning-actually-is/) the tool promised to save you from, now spent auditing the tool instead. **A correct answer with no source costs you more to verify than an answer with a source that turned out to be wrong.** The pointed-to error gets discarded in seconds; the unpointed hit gets paid for in hours.

There's the full thesis of this article, and it's a purchasing thesis: a tool isn't measured by its hit rate, which you can't audit, but by its cost of verification, which you can measure in the first demo, with a stopwatch.

## Why goodwill doesn't fix this

A reasonable reader will object: couldn't the tool simply add the citations at the end? The answer is no, and the reason is architectural, not commercial.

The [second article in this series](../why-no-tool-has-worked-for-you/) explained it from the other side: a conversational tool pushes the material through the context window, truncates it and compresses it, and when you ask for the citation, the model does the only thing it knows how to do: write one. A citation written by a model is just another prediction — plausible, well-formatted, and with no guaranteed relationship to the paper. Provenance can't be reconstructed after the fact with good writing. **Either it was saved at the moment of reading — this fragment came from this document, this page, this spot on the page — or it doesn't exist.** Everything else is a citation shaped like a citation.

That's why the cost of verification isn't a function of the vendor's effort but of its design. And that's why it can be detected before you pay, with the usual question plus one addition: can I open the page this answer came from? — and how many seconds does it take me?

## What stays on your side

None of this reduces your responsibility; it organizes it. The duty of verification is yours, personal and non-delegable, and no vendor — including the one that builds what you're reading right now — can take it on for you. What you can demand, and should demand in writing, is that the tool leaves the duty at the price of one click: every claim with its page, every page with its image, every verification in seconds.

Because in the end there's only one tally. The standard already in force — the Bar's, the Court's, every rule the world has spent three years writing — doesn't ask you to distrust the technology. It asks something simpler and older: don't sign what you didn't check. The only open question is how much checking it is going to cost you. And that, for the first time in this series, isn't a question for you. It's a question for your vendor.
