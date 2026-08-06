---
title: "Nobody gets sanctioned for using artificial intelligence. They get sanctioned for signing what they didn't read."
slug: "is-it-legal-to-use-ai-for-work"
excerpt: "A lawyer filed 38,477 briefs in one weekend, and civil court judges asked to ban AI from the courts. The question left for you isn't whether you can use it. It's what you're signing when you do."
publishDate: 2026-08-05
author: "pin Founding Team"
tags: ["Professional Responsibility", "Regulation", "Verifiability"]
draft: false
readingMinutes: 10
---

Between Saturday, July 25 and Monday, July 28, up until 11:30 in the morning, one lawyer
filed **38,477 briefs** through the Virtual Judicial Office. Between 500 and 900 per civil
court, across the whole country. The judges described what can be described: they didn't
have "the technical or human resources available" to process that
([Emol](https://www.emol.com/noticias/Nacional/2026/07/29/1206954/uso-ia-documentos-publicos-abogados.html),
[BioBioChile](https://www.biobiochile.cl/noticias/nacional/chile/2026/07/28/abogado-saturo-sistema-con-37-mil-escritos-en-horas-y-ahora-jueces-quieren-vetar-la-ia-en-tribunales.shtml)).

The Santiago Civil Judges Committee asked the Supreme Court for five measures. Among
them, restricting that lawyer's access to the platform, a report on disciplinary and
criminal liability, CAPTCHA-style barriers against mass filings, and this one, which made
the headlines: **"that the use of AI for filing briefs be prohibited, so long as there is
no clear institutional policy."**

That sentence is worth reading twice, because the headlines swallowed the second half.
They didn't ask to ban artificial intelligence. They asked for a rule, and a pause until
there was one.

## What got overloaded wasn't what you think

Here we need the distinction from the [first article in this
series](../what-machine-learning-actually-is/): "artificial intelligence" doesn't name a
technology, it names a promise. And a word that broad absorbs blame as easily as it
absorbs credit.

The 38,477 filings were, for the most part, case-archiving requests and withdrawals of
representation and power of attorney — repetitive, form-based paperwork — filed by a
lawyer who had stopped representing several corporate clients and automated the
withdrawal with what the press described as "an external agent." There was no language
model reasoning poorly over a case file. There was **a script pressing a button many
times**.

The case that's going to produce the rule that will govern you isn't, technically, an
artificial intelligence case. It's a volume case. And the rule is going to say "AI," and
it's going to reach you anyway.

## Is it legal?

Yes. And that was never the hard question.

There is no rule in Chile today that bans using artificial intelligence in professional
practice. What does exist — and it's more demanding than it sounds — is a duty that was
already written before ChatGPT existed. On July 6, 2026, the Bar Association approved its
[Guidance on the Responsible Use of Artificial Intelligence in Professional
Practice](https://colegioabogados.cl/guia-sobre-uso-de-sistemas-de-ia-por-abogados-julio-2026-002/),
and what's notable about that document is how little it invents: it expressly states that
it adds no new ethical obligations beyond those in the Código de Ética Profesional. It
only says where the existing ones land.

They land in three places. **Verification**: a lawyer cannot incorporate into their work
a result produced by a system without first checking its accuracy — and, in a line worth
the whole guide, "verification carried out by the same system, or a similar one, does not
count." **Competence**: you need to understand, "with due depth, the nature,
capabilities, risks, and limitations" of the tool you're using. **Responsibility**: "the
decision and the responsibility are always your own."

The international standard says the same thing in different words. [Formal Opinion 512 of
the American Bar
Association](https://www.americanbar.org/content/dam/aba/administrative/professional_responsibility/ethics-opinions/aba-formal-opinion-512.pdf)
(July 29, 2024) derives the same obligations from the existing rules on competence,
confidentiality, supervision, and candor to the tribunal, and adds one that stings: you
can't bill the client for the time it takes you to learn how to use your own tool.

So yes, it's legal to use it. And everything that comes out signed is still entirely
yours.

## What actually gets sanctioned

On June 3, 2026 — seven weeks before the weekend of the 38,477 filings — the Third
Chamber of the Supreme Court suspended a lawyer for one month and fined her 5 UTM. In a
cassation appeal, she had cited two consumer-law treatises attributed to real professors.
The treatises didn't exist: a chatbot had produced them.

The defense argued unintentional error. The Court rejected it and grounded the sanction
in procedural good faith under article 2 letter d) of Ley 20.886, using the disciplinary
powers of articles 531 and 542 of the Código Orgánico de Tribunales. The reproach, in the
court's own terms, was failing to verify "the accuracy of the information provided to the
court"
([Judiciary](https://www.pjud.cl/prensa-y-comunicaciones/noticias-del-poder-judicial/145652)).

Read that carefully, because the whole thin line is right there. **She wasn't sanctioned
for using artificial intelligence. She was sanctioned for signing what she didn't read.**
The tool doesn't appear in the reproach; what appears is the duty she already had before
it.

## Is it fair?

This is the most uncomfortable of the three questions, and the one almost nobody asks,
because the person who decides isn't the one who pays its cost.

Each of the 38,477 filings was, taken one at a time, perfectly legitimate. A
case-archiving request is a right. A withdrawal of representation is a proper act. There
isn't a single unlawful filing in the pile. **The harm isn't in any one of them: it's in
the volume**, and the court absorbed that volume — a court that didn't choose it and can't
bill for it.

That has already been measured, and at the scale of an entire system. A March 2026 study
of 4.5 million U.S. federal civil cases and 46 million docket entries ([Shah and Levy,
"Access to Justice in the Age of
AI"](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6766859)) found that the share of
self-represented litigants rose from a stable historical ~11% to **16.8% in fiscal year
2025**; that **18%** of their filings contain text classified as AI-generated; and that
docket entries in a case's first 180 days rose an average of **64%** per court,
concentrated precisely in the formulaic, repetitive categories. The same technology that
opens the courthouse door to someone who couldn't afford a lawyer is loading the court
with a burden nobody budgeted for.

There's the fairness test, and it's an old one: you can speed up your own work all you
like, as long as you're the one paying for the cost of your speed. When the savings are
yours and the extra work falls on the court — or on the opposing party, who now has to go
check whether your citations exist — it stopped being efficiency and became cost-shifting.

## Is it smart?

It depends entirely on what for, and this part has actually been measured.

On the machine alone, the numbers are bad and they're public. A Stanford study published
in the *Journal of Legal Analysis* measured that, faced with specific, verifiable legal
questions, general-purpose models hallucinate between **58%** (GPT-4) and **88%** (Llama
2) of the time, and also tend to accept the user's mistaken legal premises without
objection ([«Large Legal Fictions»](https://arxiv.org/pdf/2401.01301)).

The obvious objection is that serious legal tools aren't a generic chatbot. It's true, and
it's not enough. The same team later measured the legal research tools of the industry —
the ones marketed as *hallucination-free* — and found they hallucinate between **17% and
33%** of the time, depending on which one ([«Hallucination-Free? Assessing the
Reliability of Leading AI Legal Research
Tools»](https://onlinelibrary.wiley.com/doi/full/10.1111/jels.12413), *Journal of
Empirical Legal Studies*, 2025). Better than a chatbot. Nowhere near zero. And a 17%
error rate on an input you sign your name to isn't a margin: it's an obligation to review
100% of it.

The aggregate cost of not reviewing it can be counted. The database that tracks court
rulings worldwide containing hallucinated citations went from two or three cases a month,
before 2025, to an average of **about five new cases a day** by February 2026, with no
sign of slowing down ([author's
FAQ](https://artificialauthority.ai/p/hallucinations-case-database-faq)). It's not a
Chilean phenomenon or an isolated accident: in the United States, [*Mata v.
Avianca*](https://law.justia.com/cases/federal/district-courts/new-york/nysdce/1:2022cv01461/575368/55/)
ended with a US$5,000 fine in June 2023; in the United Kingdom, the Divisional Court
ruled in June 2025 on two cases of invented case law and referred one of the lawyers to
the disciplinary regulator ([*Ayinde v. Haringey*, [2025] EWHC 1383
(Admin)](https://www.judiciary.uk/judgments/ayinde-v-london-borough-of-haringey-and-al-haroun-v-qatar-national-bank/)).

Now the other half, which is also measured and almost never cited alongside the first.
The first randomized controlled trial on AI assistance in legal work found mild, uneven
quality improvements, but time reductions **of 12% to 32%**, consistent across every
skill level ([Choi, Monahan, and Schwarcz, *Minnesota Law
Review*](https://papers.ssrn.com/sol3/papers.cfm?abstract_id=4626276)).

Put the two findings together and they say one thing, and it's the most useful thing in
this article: **the technology is good for time and bad for truth.** It works where the
bottleneck is volume. It doesn't work where the outcome is a claim you're going to stand
behind in court, unless you can verify it.

## So where does the line fall

It doesn't fall between using artificial intelligence and not using it. That boundary
doesn't explain either case: the suspended lawyer and the firm that saves 30% of its time
use the same thing.

The line falls between **delegating work and delegating responsibility**, and in practice
it's recognized by a single property: if the claim can be opened at the source it came
from, you delegated work. If it can't, you delegated your signature.

That's why the Bar guide's duty of verification adds the line that sounds technical and
is actually central: a system verifying itself doesn't count. A second model reviewing
the first produces two plausible texts, not a check. Verification is an external act —
you, opening the page — and a tool that doesn't offer you that page isn't saving you the
review. It's hiding it from you.

## The sweet spot

It exists, and it's narrower and more concrete than the market suggests.

It's on the input side, not the output side. Artificial intelligence is extraordinary at
consuming volume a human can't get through, and it's dangerous at producing volume a
human can't get through reviewing. **The 38,477 filings are the second case**: the
promise applied to generating. A case file of tens of thousands of pages, read in full
and handed back with every finding pointing to the exact page it came from, is the first.

And the second article in this series explains why that distinction is architectural,
not a matter of personal discipline: a conversational tool can't hold the entire case
file in view at once, and what it does when it doesn't fit — truncate and compress — is
precisely what manufactures the citations that later get sanctioned ([why none of those
tools worked for you](../why-no-tool-has-worked-for-you/)). A system built to read once,
index by page, and always point back to the source isn't a more careful version of the
same thing. It's something else, and it's recognized with a single question before you
pay: can I open the page this answer came from?

## The rule being written right now

While the Chilean Supreme Court reviews what to do, the rest of the world has spent
three years writing the same rule. In the United States, a federal judge has required,
since May 2023, that every filing certify that nothing AI-generated went in without
human verification. The UK Judiciary published its guidance in December 2023. Brazil
regulated the use of AI in the judiciary with [CNJ Resolution
615](https://www.cnj.jus.br/cnj-aprova-resolucao-regulamentando-o-uso-da-ia-no-poder-judiciario/)
in March 2025. Spain approved a [CGPJ
instruction](https://www.poderjudicial.es/cgpj/es/Poder-Judicial/En-Portada/El-CGPJ-aprueba-una-instruccion-dirigida-a-la-Carrera-Judicial-en-relacion-con-el-empleo-de-la-inteligencia-artificial-)
in 2026 that lets judges rely on AI to search for statutes and case law, and bars them
from delegating the weighing of evidence or the application of the law to it. And the
[European AI Act](https://artificialintelligenceact.eu/annex/3/) classifies systems
intended to assist in the interpretation and application of the law as high-risk — a
category that reaches whoever builds those tools well before it reaches whoever uses
them.

None of those rules ban artificial intelligence. They all say the same sentence in
different words: you can use it, you can't delegate judgment to it, and you're
accountable for what you sign.

Which leaves things where they stood before all of this. The institutional policy the
civil judges are waiting for will arrive, and when it does, it won't demand anything from
you that you can't start demanding from your vendor today. That your tool show you the
page. That you open it.
