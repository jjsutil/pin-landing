---
title: "It didn't forget your case file. It never read the whole thing."
slug: "why-no-tool-has-worked-for-you"
excerpt: "You paid for the subscription, uploaded the case file, and the tool failed you in three different ways. None of the three was a glitch: all three are the same limit."
publishDate: 2026-08-05
author: "pin Founding Team"
tags: ["Context Window", "AI Tools", "Verifiability"]
draft: false
readingMinutes: 5
---

You paid for the most expensive subscription there was, and halfway through the case
file, the tool already couldn't remember any of it. Five hundred dollars later, you
ended up reading the case file by hand.

There were three ways it failed you, and you probably saw all of them. **It forgot**: it
answered about volume I as if volume VII didn't exist. **It lied**: it stated with total
confidence something that appears on no page. **It choked**: you uploaded the volumes
three times, the upload crashed three times, or it told you the document was too large.

## None of those tools is broken

Here's the uncomfortable part: they didn't fail you. They did exactly what they were
built to do, and that was never this.

## A desk of fixed size

A language model works on a desk of fixed size. (If you read [the previous
article](../what-machine-learning-actually-is/), you already have the vocabulary:
training, model, inference.)

Everything the system needs to answer you — your question, the document you uploaded,
what was said earlier in the conversation — has to be sitting on that desk at the same
time. What isn't on the desk doesn't exist for the model. That's the **context window**:
the maximum amount of text the system can hold in view at any one moment.

The desk is big. A criminal case file is bigger.

And when the material doesn't fit, the system doesn't stop to tell you. It does one of
three things. Each one is one of the symptoms you saw.

**What you saw as forgetting was truncation.** Truncating means cutting: whatever
doesn't fit on the desk gets left out, usually the oldest part of the conversation or
the end of the document. The model doesn't know it's missing something, because to it,
that something was never there. It didn't forget volume VII. It never read it.

**What you saw as lying was compression.** Compressing means summarizing so it fits: the
system replaces the long text with a short version and works from the summary. The
general sense survives in the summary, and what gets lost is precisely what matters to
you — the date, the name, the page number. When you ask about that detail, the model
answers anyway, because answering is what it does: it fills the gap with whatever is
most plausible. **Most hallucinations are born in compression** — those confident,
well-written answers that appear on no page. There was no bad faith. There was a summary
answering a question only the original could answer.

**What you saw as it choking was the only honest one of the three.** There, the system
hit the limit and said so: the file exceeds the maximum, the upload fails, the document
is too large. It's the most frustrating one to use, and it's the only one of the three
that didn't deceive you. Between a tool that chokes and one that answers anyway, choose
the one that chokes, a thousand times over.

## The pricier plan won't read it either

The obvious objection is that these desks keep growing. That's true: every year models
fit more text in view, and the top-tier plan fits more than the free one. It's also true
that this doesn't solve the problem, only moves it. The case file that doesn't fit today
still doesn't fit when the desk doubles in size, and you'll have paid the difference to
find that out.

But suppose it fit entirely. It still wouldn't serve you, and this is the part no
upgraded plan fixes: a conversational tool doesn't know what a page is. It doesn't know
that a case file's numbering is a reference system with procedural weight, not just any
page number. It doesn't handle **provenance** — which document and which page each piece
of data came from, and how to prove it. And it doesn't know how something gets cited
before a court, where what you can't point to is worth nothing.

None of that is an oversight by the people who built them. Those tools were built for
conversation, because that's where the money was: hundreds of millions of people typing
short questions about anything. Reading an entire criminal case file is a capability
that got bolted on afterward, not the problem they set out to solve. They lent you an
excellent tool, built for a different job.

## Process once, point always

What fixes this isn't a bigger model. It's reversing the order of operations.

Instead of pushing the case file through the context window every time you ask
something — which is what a conversational tool does, and why it breaks —, the case
file gets processed once, in full, ahead of time: it's read, indexed page by page, and
every fragment gets stored together with the document and the exact page it came from.
Afterward, when you ask a question, the whole case file doesn't get read again: the
pages that match get retrieved and the answer is given with them in view. The model
doesn't write the citation. It points to one: to a document, to a page, to an image you
open and confirm with your own eyes.

That principle is the whole difference, and it can be checked with a single question
before paying for any subscription: can I open the page this answer came from?

On volume, it's worth being precise, because almost nobody is in this market: a system
built this way doesn't have the conversational ceiling, because the model is never asked
to hold the whole case file in view. How much "whole" means in your case depends on your
case, and that's a number that belongs measured against the real case file, not promised
in an article.

## What you already know how to do

You already have the judgment for this. You apply it every day with the expert reports
you receive and with every brief you sign.

A lawyer doesn't accept an expert opinion they can't verify. If you accepted an AI
answer without a source, it wasn't carelessness: it's that nobody offered you the
source.
