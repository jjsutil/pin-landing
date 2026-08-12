---
title: "The failure that should worry you about RAG isn't a missing answer. It's a fluent answer built from the wrong five paragraphs."
slug: "how-rag-actually-works-and-where-it-silently-fails"
excerpt: "How retrieval-augmented generation actually works — chunking, embeddings, hybrid retrieval, re-ranking, context assembly — and the five distinct mechanisms by which it produces a plausible wrong answer instead of an honest 'not found.' Grounded in the published literature, not in a vendor diagram."
publishDate: 2026-09-03
author: "pin Founding Team"
tags: ["AI Tools", "Engineering", "RAG"]
draft: false
readingMinutes: 10
---

Ask a retrieval-augmented generation system a question whose answer isn't in its document base, and it will not say "not found." It will retrieve the *k* most similar passages — there are always *k* most similar passages — hand them to a language model, and generate a fluent, confident, well-structured answer from whatever it got. No stage errors. No stage even notices.

That non-error is the subject of this post. This is part 3 of our technical series: [part 1 covered what actually breaks OCR](../ocr-what-we-learned-and-what-the-literature-says/), and [part 2 covered how inference and interpretability actually work](../how-inference-and-interpretability-actually-work/). This one is about RAG — what really happens between the question and the answer, stage by stage, and the specific mechanisms by which the pipeline produces something plausible instead of something true. "RAG can hallucinate" is a platitude. The mechanisms are not.

## The architecture, stage by stage

RAG as an idea is simple, and the original formulation is worth stating precisely: [Lewis et al. (NeurIPS 2020)](https://arxiv.org/abs/2005.11401) paired a pre-trained generative model with a dense retriever over an external index, so that knowledge lives in a searchable, swappable store instead of being frozen into model weights — and showed the combination generates more factual output than the same class of model relying on its weights alone. That's the promise. A production RAG system in 2026 is a pipeline of roughly six stages built on that promise — ingest, chunk, embed and index at build time; retrieve, re-rank, assemble and generate at query time — and every one of them has its own way of failing without raising an error.

### Chunking decides what can be found, before anything searches

Documents get split into chunks, and the chunk — not the document — is the unit of retrieval. That makes chunking a decision about what facts are *findable at all*, taken at index time, invisible at query time. A rule and its exception that land in different chunks are, as far as the retriever is concerned, two unrelated facts.

The intuitive fix is "semantic chunking" — split at meaning boundaries instead of at a fixed token count. Intuitive, and not clearly supported: [Qu, Tu and Bao (2024)](https://arxiv.org/abs/2410.13070) compared semantic against fixed-size chunking across document retrieval, evidence retrieval, and retrieval-based answer generation, and found the computational cost of semantic chunking is *not* justified by consistent performance gains. **The honest takeaway is that chunking is a corpus-specific engineering decision you have to measure, not a solved default you get to import.** Chunk size, overlap, and whether to respect structural boundaries (sections, clauses, pages) interact with your documents and your queries; nobody else's ablation transfers cleanly.

### Embeddings capture aboutness, not truth conditions

An embedding model maps text to a vector such that texts "about the same things" land near each other. Read that definition literally, because the failure is in it: *"the appeal must be filed within five days"* and *"the appeal need not be filed within five days"* are about exactly the same things. They are near-identical bags of topics pointing at opposite legal outcomes. Similarity is aboutness — it is not agreement, not entailment, and not relevance to your specific question.

There's a second, better-measured limitation: domain shift. [Thakur et al. (BEIR, NeurIPS 2021 Datasets and Benchmarks)](https://arxiv.org/abs/2104.08663) evaluated retrieval models zero-shot across 18 heterogeneous datasets and found that dense retrievers — efficient as they are — often underperform out of their training domain, while **BM25, the decades-old lexical baseline, holds up as a robust baseline across domains**. An embedding model tuned on web-question data has never seen your domain's vocabulary distribution, and its notion of "similar" quietly degrades exactly where you can't see it.

### Retrieval: dense, sparse, and why serious systems run both

Sparse retrieval (BM25 and its family) matches on exact terms, weighted by rarity. It is unbeatable on the tokens that matter most in specialized domains — article numbers, case identifiers, terms of art that appear nowhere else. It knows nothing about synonyms. Dense retrieval is the mirror image: it finds the paraphrase and the reformulation, and it can miss an exact identifier because "similar meaning" was never about string equality. Hybrid retrieval — run both, fuse the ranked lists — is not a hedge for the indecisive; BEIR's zero-shot results are the measured reason it became the serious default. Each method covers the other's blind spot, and the blind spots are real.

### Re-ranking is where relevance actually gets judged

First-stage retrieval is fast because it's shallow: the query and each passage are embedded *independently*, and never actually read each other. A cross-encoder re-ranker reads the query and a candidate passage *together*, in one forward pass, and scores the pair — which is a fundamentally more expressive judgment, and correspondingly too expensive to run over a whole corpus. So the working architecture is recall-then-precision: a cheap first stage pulls a wide candidate set, an expensive second stage re-orders the top of it. In BEIR's cross-domain evaluation, re-ranking and late-interaction models were the strongest performers — at higher computational cost. If your pipeline has no re-ranking stage, relevance in your system is being judged entirely by the least expressive component in it.

### Context assembly: position is not neutral

The top-ranked chunks get concatenated into the prompt, and it's tempting to treat that step as trivial plumbing. It isn't. [Liu et al. (Lost in the Middle, TACL 2024)](https://arxiv.org/abs/2307.03172) measured how models use long inputs and found a U-shaped curve: performance is highest when the relevant information sits at the beginning or end of the context, and degrades significantly when it sits in the middle — including in models explicitly built for long contexts. Two direct consequences. The *order* in which you paste retrieved chunks changes answer quality, independent of retrieval quality. And "just use a bigger context window and retrieve more" is not a free lunch: every extra chunk you stuff in pushes something else toward the middle.

## Where it fails silently

A crash is a gift: you see it. What follows are five mechanisms that each produce a fluent, plausible, wrong answer — and the reason they're worth separating is that they have different fixes, and an end-to-end accuracy number can't tell you which one you have.

**1. The retrieval miss that doesn't look like a miss.** Top-*k* retrieval returns *k* results *by construction*. Similarity scores are relative, not calibrated: the best match to a question your corpus cannot answer still comes back with a respectable-looking score, because "best available" and "good" are different claims and cosine similarity only ever makes the first one. The generator receives *k* topically adjacent passages and does what generators do. Nothing in the pipeline represents the concept "the answer isn't here."

**2. Similarity that isn't relevance.** The passage sharing the most vocabulary with your question is frequently the one *restating* the question, not answering it — the filing that raises the issue, not the ruling that resolves it; the clause that references the deadline, not the clause that sets it. Embedding-space closeness is aboutness (see above), and BEIR's domain-shift results say the gap between aboutness and relevance widens precisely on the specialized corpora where the stakes are highest.

**3. The chunk boundary that split the fact.** The general rule ends chunk 41; the exception that reverses it for your case opens chunk 42. The retriever returns chunk 41 — legitimately, since the rule shares more terms with the query than the exception does — and the generator faithfully summarizes what it was given. The answer states the rule, confidently, minus the exception. Note what this failure is *not*: it is not a hallucination. **It is faithful generation over truncated evidence, and every faithfulness metric you run will score it perfectly.**

**4. The generator that ignores the context it was given.** Retrieval worked. The correct passage is in the prompt — ranked seventh of ten, sitting mid-context, exactly where Lost in the Middle measured the trough. Or it's positioned fine, and the model's parametric prior — what its weights already believe about the question — wins out over the evidence in front of it. The answer arrives wrapped in grounded-sounding framing ("according to the provided documents…") that no part of the system verified.

**5. The corpus was wrong before any of this ran.** This is the failure we have direct reason to take personally. [Zhang et al. (OHRBench, ICCV 2025)](https://arxiv.org/abs/2412.02592) — which we cited in part 1 and re-verified for this post — evaluated current OCR solutions specifically for how their errors cascade into RAG, across 8,500+ document images and Q&A pairs from seven application domains, and concluded that **none of the evaluated OCR solutions was competent for constructing high-quality knowledge bases for RAG systems.** They distinguish semantic noise (wrong content) from formatting noise (wrong structure) and show RAG performance degrading as either grows. Now connect that to [part 1's central finding](../ocr-what-we-learned-and-what-the-literature-says/): an OCR pipeline can drop a full line of text at 98% reported confidence. That paragraph is not in your index. No retrieval algorithm — dense, sparse, hybrid, re-ranked, perfectly tuned — can return a chunk that was never indexed, and unlike a bad re-ranker, nothing observable at query time even hints at the absence. It is a retrieval-quality failure with nothing to do with the retrieval algorithm at all.

## What evaluation can tell you, and what it can't

"Does the answer look right" is the metric everyone starts with, and it conflates all five mechanisms above into one number. The field's answer to that is component-wise evaluation: [Es et al. (RAGAS, 2023)](https://arxiv.org/abs/2309.15217) propose reference-free evaluation of a RAG pipeline along separated dimensions — the retrieval system's ability to find relevant, focused context; the generator's faithfulness in using that context; and the quality of the answer itself — without requiring human-annotated ground truth. That separation is the genuinely useful part: it tells you *which stage* is bleeding.

Be honest about the limits, though. Reference-free scores are proxies computed by another LLM, which puts a ceiling on how much you can trust them at the margin — an evaluator model has its own failure modes and nobody is evaluating the evaluator on your domain. And no reference-free metric, by construction, can see mechanism 5: **faithfulness to a corrupted context scores perfectly.** If the index is missing the paragraph, every downstream metric happily measures how well you used the wrong evidence.

What we'd actually tell you to measure, if you're building or buying one of these:

- **Measure retrieval separately from generation.** Hand-label a set of (question, gold passage) pairs *from your own corpus* — part 1's lesson about building evaluation sets from your own hardest material applies unchanged — and track whether the gold passage appears in the top-*k*, at what rank. Retrieval recall is cheap to compute and it localizes failures that answer-level metrics smear.
- **Put unanswerable questions in the eval set, on purpose.** Measure how often the system says "not found" when not-found is the correct answer. A system that answers everything isn't impressive; it's missing the one signal you most need (mechanism 1).
- **Audit the index, not just the answers.** Sample chunks and read them against the source pages. Boundary-split facts (mechanism 3) and OCR-corrupted text (mechanism 5) are visible in five minutes of reading and invisible in any end-to-end score.
- **Track where the gold chunk lands in the assembled prompt**, not just whether it was retrieved. Rank 7 of 10 is a middle-of-context position, and the Lost in the Middle result says that position is doing real damage.
- **Run the deletion test.** Take a question the system answers well, remove the gold document from the index, and ask again. If the answer stays fluent and confident, you have measured — cheaply, on your own system — exactly how it will behave on every question whose answer was never there. A test that never saw the system fail proves nothing about the failure.

The architecture of RAG is genuinely good engineering, and the literature behind each stage is real. But every stage of it is built to return its best available output, and no stage is built to say "my best available output isn't good enough." That property doesn't average out across six stages — it compounds. **A retrieval system isn't measured by how fluent its answers are. It's measured by whether you can tell, from the outside, the difference between an answer it found and an answer it assembled.**
