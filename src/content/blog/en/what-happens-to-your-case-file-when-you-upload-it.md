---
title: "Your client trusted you with the case file. Not with your tool's servers."
slug: "what-happens-to-your-case-file-when-you-upload-it"
excerpt: "In May 2025, a New York court ordered the preservation of even the chats users had deleted. The question is no longer what artificial intelligence does with your case file. It's where it ends up, who retains it, and under what rules."
publishDate: 2026-08-06
author: "pin Founding Team"
tags: ["Confidentiality", "Professional Responsibility", "Regulation"]
draft: false
readingMinutes: 9
---

On May 13, 2025, a federal judge in New York ordered OpenAI to indefinitely preserve
every ChatGPT output log, [including chats users had already
deleted](https://openai.com/index/response-to-nyt-data-demands/). The order was issued
in the copyright litigation The New York Times is pursuing against the company, and it
covered users of the free, Plus, Pro, and Team tiers, plus the API without a
zero-retention agreement. The company appealed, lost, and the obligation stood until
September 26, 2025 — whatever was captured in that window is still stored. In November,
[the court confirmed](https://thecyberexpress.com/openai-court-order-nyt-copyright-dispute/)
that 20 million of those conversations, de-identified, would be handed over to the
plaintiffs.

Stop on the mechanics, because that's the part that concerns you. Millions of people hit
"delete" believing delete meant deleted. It wasn't a fact: it was a promise from the
vendor, written into terms of service almost nobody read. And a vendor's promises give
way before a court order, in a lawsuit that isn't yours, in a jurisdiction that isn't
yours, over a dispute that has nothing to do with you. **What you upload stops being
under your control the moment the upload finishes.** Everything else — retention,
deletion, third-party access — is a clause, not physics.

One more detail, and it's the one that organizes this entire article: the Enterprise
tier and contracts with zero retention were left out of the order. The protection
existed. **It didn't come with the brand. It came with the contract** — and with the
architecture behind the contract.

## The duty you already had, before the cloud existed

None of this catches you without rules. Quite the opposite: few duties in the profession
are older than this one.

Attorney-client privilege isn't a courtesy or a habit of discretion: it's a duty whose
holder is the client, not you. The Código de Ética Profesional devotes its article 7 and
an entire section — articles 46 through 64 — to it, and the Código Penal, in its article
231, punishes a lawyer who discloses a client's secrets. The investigative case file you
handle is, moreover, one of the most sensitive collections of material that exists in
the system: statements from defendants, victims, and witnesses, medical and
psychological reports, location data, records of third parties who aren't even party to
the case.

That's why the duty of confidentiality isn't a scruple. It's exposure: yours, your
firm's, and that of the people whose data travels inside that file — people who never
consented to their statement ending up on a software company's servers.

What's new isn't the duty. What's new is that this year's trendy tool asks you, as a
first step and with the best interface in the world, for exactly what that duty forbids
you from doing lightly: handing the file over to a third party.

## Reading the terms of service is now part of practicing law

The Bar Association's
[guide](https://colegioabogados.cl/guia-sobre-uso-de-sistemas-de-ia-por-abogados-julio-2026-002/)
from July 2026 — the same one from the [previous article in this
series](../is-it-legal-to-use-ai-for-work/) — devotes a section to this point that
barely made the news, and which in practice is the most demanding part of the document.

Before using a platform, it says, a lawyer must evaluate its terms of service, its
privacy policies, where and for how long data is stored, and whether it can be reused or
accessed by third parties. In particular, whether the material will be used to train
models. A lawyer must refrain from entering confidential material into systems that
don't offer appropriate protections, and must not enter it into general-use public
platforms without an effective assurance that the information won't be reused. And when
there's a risk of disclosure, it requires the client's express, informed consent:
[general authorization in the service agreement isn't
enough](https://actualidadjuridica.doe.cl/colegio-de-abogados-publica-guia-para-el-uso-responsable-de-inteligencia-artificial/)
— the client must know the specific system, its risks, and the alternatives available.
[Formal Opinion 512 of the American Bar
Association](https://www.americanbar.org/content/dam/aba/administrative/professional_responsibility/ethics-opinions/aba-formal-opinion-512.pdf)
arrived at the same place two years earlier, by the same route: the duty of
confidentiality requires understanding what the vendor does with the data before handing
it over, and in certain cases, asking the client's permission first.

Translated into practice, the guide turned the fine print into your professional
business. Due diligence on an artificial intelligence tool is no longer a task for your
IT department: it's a legal analysis of a contract of adhesion, done by you, with your
license on the line for the outcome. And there's a test that captures the whole analysis
in one scene: **would you tell your client, vendor's name and all, where their case file
is going to end up?** The guide says that in certain cases, you shouldn't just be able to
tell them: you must, and you must get their consent. If picturing that conversation
makes you uncomfortable, you already have the result of the analysis.

It's worth noting which safeguards the guide names as appropriate, because the list is
short and concrete: "non-retention of information, local execution, and the firm's own
closed environments." Hold onto that phrase. We'll come back to it in a moment.

## And in four months, it's also the law

Up to here, this has been professional ethics. Starting December 1, 2026, it's also
regulation with fines attached.

That day,
[Ley 21.719](https://www.araya.cl/2026/06/nueva-ley-de-proteccion-de-datos-personales-en-chile-que-es-por-que-es-clave-y-como-deben-prepararse-las-empresas/)
(Chile's new data-protection law, the deepest reform personal-data protection has had in
the country) enters into full force: it creates an Agency with real enforcement powers,
requires notifying security breaches within 72 hours, and sets fines of up to 20,000
UTM — with repeat offenses that can reach 4% of annual revenue. A law firm is
responsible for the processing of the data it manages, and a criminal case file is a
concentrate of the most protected category of all: sensitive personal data belonging to
natural persons, many of them third parties with no relationship to your client
whatsoever.

Put the pieces together and the picture comes into focus. Uploading an investigative
case file to a platform that retains it on shared servers, under terms that allow reuse,
was already an ethical problem in July. In December, it's also a regulatory event
waiting to happen: if that platform suffers a breach — or receives an order from a
foreign court, as happened in May 2025 — the party accountable to the Agency and to your
client isn't the vendor. It's you.

## What we decided, and why

Up to here, this article has been about rules. This section is about us, because on this
topic we think it's right to show our hand.

When we designed our system, confidentiality didn't go in as a feature on a list, or as
a selling point tacked on at the end. It went in as the constraint that shaped every
other decision, for a reason that by this point in the article is obvious: **for a
criminal-law practitioner, confidentiality isn't a preference. It's the condition of
possibility.** Attorney-client privilege bars you from almost everything the market
offers; a tool that doesn't solve that first isn't a worse tool: it's a tool you can't
use.

Out of that constraint came a rule of architecture, and out of the rule came everything
else: **the case file doesn't travel to the software. The software travels to the case
file.** The system runs in a cloud dedicated exclusively to your firm, or directly
inside it, on your own machines. Never in a cloud shared with other clients. Reading,
indexing, and search run wherever the firm decides; none of your material is ever used
to train anyone's models, ever; a written record is kept of the material received, and
at the close of the case it's returned or destroyed as you instruct. And when an open
question requires a language model, what travels is the retrieved fragments that answer
that question — never the case file — through a door the firm switches on explicitly,
not one that comes switched on by default.

Why architecture and not policy? Because they're different in kind, and the difference
showed up in full in May 2025. A privacy policy is a promise: it changes with a "we've
updated our terms" email, and it gives way before a court order. An architecture where
the case file never left the firm promises nothing, which is why it has nothing to
break: **you cannot order the retention of what was never retained, or leak from a
shared cloud what never entered one.** Confidentiality that depends on a third party's
continued good behavior is a hypothesis; confidentiality that depends on where the data
physically sits is a verifiable fact.

And here's where the phrase we asked you to hold onto comes back. The safeguards the Bar
guide names as appropriate — non-retention, local execution, the firm's own closed
environments — we didn't read as a suggestion to weigh. We read them for what they are:
the list of design requirements. The guide was published after our system was already
built, and the fact that both lists match almost word for word isn't a coincidence or an
achievement: it's what happens when the starting point is the same duty.

## The two questions before you pay

This series already left you one question to ask of any offer: can I open the page this
answer came from? This article adds the symmetric one, the one you ask earlier, in the
same meeting: **where does my case file end up when I ask a question, and what do you
retain once I'm done?**

A serious vendor answers both in one plain sentence each, no adjectives, and puts it in
writing. One that answers with the word "encrypted," a security certificate, or the
assurance that "that doesn't happen here" is answering a different question. Encryption
protects the data in transit; it doesn't change where it ends up or who can be compelled
to hand it over. And you already know, since May 2025, that "that doesn't happen" is
exactly what people said until it did.

Your client's case file is going to end up somewhere. The only decision that remains
entirely yours is where.
