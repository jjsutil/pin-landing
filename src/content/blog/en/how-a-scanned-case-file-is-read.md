---
title: "No answer is better than the reading it came from."
slug: "how-a-scanned-case-file-is-read"
excerpt: "Before a system can answer questions about your case file, someone has to turn the paper into text. That step is called OCR, it never shows up in a demo, and it decides the quality of everything that follows."
publishDate: 2026-08-06
author: "pin Founding Team"
tags: ["OCR", "Fundamentals", "AI Tools"]
draft: false
readingMinutes: 9
---

Open any volume of a real investigative case file and look at what's there: a police report scanned crooked, a stamp pressed over the date, a photocopy of a photocopy where the ink has already gone gray, an official document with handwritten notes in the margin, and every so often an entire page turned upside down. Now try Ctrl-F.

You find nothing, because there is nothing to find. **Your case file is not text. It is photographed paper.** To a computer, each of those pages is an image — a grid of pixels — as searchable as a photo of a barbecue. Before any system can answer you a single question about that material, someone has to convert the image into text. That step has a name, has fifty years of history, and never shows up in any commercial demo: it is called OCR, optical character recognition.

This article exists because that invisible step decides the quality of everything that follows, and because almost no one asks their vendor how they do it. By the end you'll have the exact question to ask. First, it helps to understand what you're asking.

## How a reading is measured

OCR is measured, and the main metric is brutally honest: character error rate — CER. How many characters, out of every hundred, the system read wrong.

Some numbers to calibrate your intuition. On reasonably clean printed text, a good modern engine makes few mistakes: the error stays in the low single digits. On handwriting — the note in the margin, the statement taken by hand, the dated signature — a classic OCR engine collapses: in our measurements on real judicial corpus, it comes close to getting **one out of every two characters** wrong. It's not that it reads poorly. For practical purposes, it doesn't read at all.

And here is the observation that makes this your problem and not the engineers': not all characters are worth the same. A character error in the prose of a legal recital is a nuisance the context repairs. The same error in a national ID number is a different person. In a date, it's a different deadline. In an amount, it's a different crime. In a page number, it's a citation pointing nowhere. **The data you actually care about in a case file — names, dates, ID numbers, amounts, page numbers — is exactly what a single-character error destroys completely**, because it's the data where context doesn't help reconstruct anything.

## The error doesn't stay on the page

If the damage stopped at the misread page, it would be a contained problem. It doesn't stop there, and this has already been measured with academic rigor.

In 2025, a team presented a benchmark — [OHRBench](https://arxiv.org/abs/2412.02592) — built to answer a single question: what happens to a document question-answering system when the OCR that prepared its material got it wrong? The conclusion was categorical: of the available OCR solutions evaluated, **none proved sufficient to build a quality knowledge base**, and even the best ones dragged an accuracy loss on the order of 14% into the final answers. Reading errors cascade: they contaminate the index, misdirect the search, and arrive at the answer turned into something else.

And that "something else" is the dangerous part. Because the system doesn't answer worse over misread text. **It answers just as fluently, just as confidently, and with the same flawless prose** — the [first article in this series](../what-machine-learning-actually-is/) explained why fluency is guaranteed and accuracy isn't. An OCR engine that read "22.06.2004" where the paper says "22.08.2004" doesn't produce an error message. It produces a mistaken timeline, told with complete ease, that you only catch if you open the page. Garbage in doesn't come out as garbage. It comes out as prose.

## The industry standard, and its three flaws

What the industry does by default is understandable, because it's the simplest path: pick one OCR engine — a single one —, feed it the whole document, and whatever text comes out is what you get. When volume gets tight, OCR gets contracted out as a cloud service: pages get sent to a third party's API, which returns the text. It works reasonably well for what those tools were built for: clean, born-digital documents, in English.

Against a Chilean criminal case file, that standard fails three times, and the three failures are of a different nature.

**Engine failure: no engine wins on every page.** We measured this before deciding anything, and the result was unappealable: the engine that's fast and accurate on print collapses on handwriting; the vision model that rescues the handwriting is too slow and expensive to run over ten thousand full pages. A real case file brings both mixed together, page by page. Choosing a single engine is choosing which part of the case file to misread.

**Architecture failure: cloud OCR solves the reading problem by creating the problem from the [previous article](../what-happens-to-your-case-file-when-you-upload-it/).** Sending pages, one by one, to a third party's API is exactly the operation your duty of confidentiality demands you scrutinize. That the envelope is page-by-page doesn't change the fact that the case file's entire content ended up, page by page, on someone else's servers.

**Honesty failure: silence.** It's the worst of the three. When a page can't be read — too dark, too crooked, illegible handwriting — the industry standard is to skip it and move on. The system doesn't actively lie; it does something more corrosive: it lets you assume that "processed" means "read." And on that assumption you build the confidence that if something mattered, it would have shown up.

## What we built, and why we decided it this way

Our answer to the three failures fits in three decisions, and all three were arrived at by measuring, not by opinion.

**First: reading happens page by page, not case-file by case-file.** Every page first goes through a triage that decides its route. If the page carries embedded digital text, it's taken directly: a perfect, free reading. If it's legible scanned print, it goes to the classic engine: fast, cheap, low error. If it's handwriting or a poor scan, it escalates to a vision model — the expensive technology — which in our measurements reads that material with **half the error** of an ordinary OCR engine. Better, not perfect; we'll come back to that shortly. The threshold that decides when a page escalates wasn't set by eye: it was calibrated with data, on real judicial corpus, and the operational result is that **close to eight out of every ten pages get read via the fast route**, while the hard fraction goes to a deferred queue where the expensive machine works without blocking the rest. It's the same logic a law firm uses to assign work: the standard to the standard procedure, the hard cases to the specialist, and nobody waits on the specialist to move forward with everything else.

**Second: provenance is written from the first character.** The moment a piece of text is born out of OCR, it gets recorded: which document it came from, which page, and exactly where on that page. The [fourth article in this series](../how-an-ai-answer-is-verified/) explained why this can't be added later: provenance is saved at the moment of reading, or it doesn't exist. That's why it's saved at the moment of reading.

**Third: the transcription never replaces the paper.** Everything above assumes something uncomfortable and true: OCR is going to make mistakes. With error rates above zero and hundreds of thousands of characters, some national ID number is going to come out changed. The design question isn't how to prevent it — nobody can — but how to make sure that error can never turn into a claim you sign without seeing it. Our answer: every citation opens the **real image of the page**, with the passage marked over the ink. Verification happens against the paper, not against our reading of the paper. If the OCR misread something, you see it in the same click you use to verify everything else — and the error dies there, as a reading error, instead of traveling into your brief turned into fact.

## The principle behind all three: communicated completeness

If we had to boil our OCR policy down to a single rule, it's this: **no page is counted as read unless it actually was.** One hundred percent of the pages end the process classified into one of two lists: read — with its text and its provenance —, or declared pending or illegible, with its exact location, in a report you can open.

It might look like a UI detail. It's the opposite of a detail: it's the difference between two promises. The system that says "I read everything" is selling you coverage it can't prove, and you discover the gaps only after you've already built on top of them. The system that says "I read 9,986 pages; these 14 I didn't, and here they are" hands you something no fluent summary can replace: **the exact map of where you need to look.** Fourteen pages get checked by hand in an afternoon. What you can't check is the gap nobody declared.

## What's next, in our plans

Three fronts, in order of importance.

The first closes the loop from the previous article: bringing the reasoning too — not just the reading and the indexes, which already run wherever the firm decides — to locally-run models, so a fully network-isolated mode of operation exists: a system you can unplug the cable from and it keeps working. The second is institutional more than technical: OCR and vision engines improve every few months, so we maintain our own benchmark, on real judicial corpus, against which every new candidate is measured before it touches the system — the engines rotate; the bar stays. And the third is the hard residue: for the fraction that no machine reads well today, an explicit rescue queue, with human review when needed, because the promise was never "we read everything." The promise is that you know, at all times and page by page, **what was read, at what quality, and what wasn't.**

## The question for your vendor

It isn't "do you use artificial intelligence?" — the [first article](../what-machine-learning-actually-is/) already established that that tells you nothing. It isn't even "what OCR do you use?", which sounds technical and gets answered with a brand name.

It's this: **what happens to the pages you can't read?**

Listen to the answer carefully, because there are only three possible ones. If they tell you "we read them all," you just learned that the gaps exist and no one is going to declare them to you. If they answer with an accuracy percentage, ask what material it was measured on — clean printed English isn't your case file. And if they answer "they're listed, here's the report, and every citation opens the page image so you can check the reading," then you're facing someone who understood the same thing you understood by reading this series: that in this profession, you don't sign the prose. You sign what's on the page.
