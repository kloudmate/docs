# CLAUDE.md

Guidance for Claude Code when working in this repository (KloudMate documentation).

## Read AGENTS.md first

[AGENTS.md](AGENTS.md) is the authoritative guide for this repo: project context, the writing style and voice rules (Section 2, read it before writing any content), the tech stack (Astro + Starlight), and the directory and routing structure. Follow it. The rules below are additions specific to the KloudMate agent docs (`src/content/docs/docs/kloudmate-agent/**`), not replacements.

## Writing style: kill these AI tells (all docs, self-check before you finish)

AGENTS.md §2 is the full voice guide — read it before writing. This section is the focused checklist of tells that keep slipping into drafts and getting flagged. Self-review every page against it and fix the hits **before** handing it over. The user should not have to point these out again.

Write the way Stripe, Datadog, and Google developer docs actually read: lead with the task or the outcome, keep each section to a few tight sentences, stay in second person with imperative steps, and use concrete verbs with real values. For a concrete model, [Datadog's Step Functions overview](https://docs.datadoghq.com/serverless/step_functions/) opens by stating what the service is and what the product adds, uses outcome-led headings ("Monitor the overall health…", "Reduce Step Function debugging time…"), keeps every section to 2–3 sentences, names concrete outcomes ("identify what states are problematic or have a high latency"), and never announces a count or calls a screen "a summary of activity."

### Structural tells — state the fact, don't announce it

The pattern the user flags most: **announcing a quantity + a vague nominalization + a balanced "…and they…" clause**, instead of just stating the fact. State the concrete thing; drop the count when the list right below already shows it; use an active verb instead of "is a … of."

| Don't write | Why it reads as AI | Write instead |
|---|---|---|
| "Two levels of data are available, and they need different amounts of setup:" | count + vague nominal + balanced "and they" clause | "Some of this works the moment you connect an account. The rest needs execution logging:" |
| "The tab has three parts:" · "they need two things:" · "Check two things:" | announcing a count the list below already shows | "The tab shows:" · "Check both of these:" |
| "The Overview tab is a workspace-wide summary of execution activity." | copula + nominalization ("is a summary of activity") | "The Overview tab summarizes the last 24 hours of executions." |
| "Both workflow types are supported." | flat passive announcement | "KloudMate supports both Standard and Express workflows." |
| "…with three tabs: Executions, Metrics, Configuration." | needless count | "…with tabs for Executions, Metrics, and Configuration." |

### The reference sample

[`src/content/docs/docs/rum/instrumentation-guide/custom-events.mdx`](src/content/docs/docs/rum/instrumentation-guide/custom-events.mdx) and the **Filter the data** section of [`rum-interface.mdx`](src/content/docs/docs/rum/rum-interface.mdx) were rewritten by the maintainer as the model for this repo. Read them before writing a new page and match what they do:

- **Second person, explaining to a competent reader.** "Every attribute you send with an event can be used as both a group-by key and a filter." Not a terse spec line, not a lecture.
- **"For example," carries the concrete case.** State the rule, then show it: "For example, `checkout_completed` is a good event name."
- **Complete sentences with the consequence spelled out.** "If you send `4999` as a string, it will be stored as text, so a filter such as `items > 2` won't work as expected."
- **Contractions throughout:** don't, can't, won't, it's, you've.
- **Bold for the concept being contrasted,** not for decoration: "The event name should describe **what happened**, not the specific object or user it happened to."

### Don't describe the plumbing

The reader has the product open. Describing what a screen does is fine when it changes how they read the data ("the filter bar tells you what it is matching", "it is shown as struck through with an explanation"). Describing how it is built is not.

Cut on sight:

- **Control plumbing:** "holds the choice in the URL", "URL backed, so a breakdown is shareable", "on the view-switcher row", "sits beside the bar".
- **Quoted on-screen message strings, and "the tab says so".** State the rule that produces the message. The reader will read the message when they hit it.
- **Menu geography:** "the **by** menu lists them under **Payload**, next to **Attributes**".
- **Implementation:** which attribute map a value lands in, what the query compiles to, why the design went that way.

| Don't write | Write instead |
|---|---|
| "Each view has its own **by** control and holds the choice in the URL, so a breakdown can be shared." | "You can group by any attribute your application sends in the event payload, in both Analyze and Raw events." |
| "When nothing in the range carries the key, the tab falls back and says so: `Nothing in this range carries category…`" | "If you group by a key that isn't present in the selected range, the grouping falls back to event name." |
| "Journeys resolves it over whole sessions through a semi-join." | "In a funnel, `cart_value > 100` selects sessions that emitted at least one matching event." |

### Sentence shape

One idea per sentence, subject first, verb early. Any clause the reader has to unpack reads as machine writing, and so does a technical thing described in literary paraphrase.

| Don't write | Why it reads as AI | Write instead |
|---|---|---|
| "Group by anything the events carried." | literary paraphrase where a technical noun exists | "Group by any attribute from the event payload." |
| "Events that never carried the attribute group under **No category**, not a blank row." | front-loaded relative clause, then an "X, not Y" tail | "Events that were sent without the attribute are collected into a single group. When you group by `category`, that group appears as **No category**." |
| "…so it marks an instrumentation gap rather than a category." | "X rather than Y", contrasting against something nobody proposed | "It tells you how many events were sent without the attribute at all, so it's really a measure of missing instrumentation." |
| "Over time charts the 50 largest groups. Group by **User** and most of them are missing." | pronoun with no clear antecedent; "missing" implies a bug | "If you group by an attribute with thousands of distinct values, such as a user ID, most of them won't appear on the chart." |
| "**Events** and **Journeys** answer it." · "**Errors** cannot answer one." | screens do not answer, know, want, or try; anthropomorphism reads as drama | "**Events** and **Journeys** support payload filters." · "**Errors**, **Pages**, and **Releases** don't support payload filters." |
| "The group counts missing instrumentation. Exclude it to compare the real values. Every panel on the tab drops it." | telegraphic fragments; plain is not the same as clipped | "Excluding it removes those events from every panel on the tab, which lets you compare the real categories against each other." |

Name things with the term the product and the reader both use. "Anything the events carried" is a phrase; "an attribute from the event payload" is the thing.

Plain does not mean cryptic. Cutting a sentence to four words that the reader then has to decode is a worse failure than the padding it replaced. Write the full sentence, then delete only what carries no meaning.

Detail has a bar too: state the behavior, not its operator-by-operator mechanics. "Selecting more than one value on a field matches any of them" is the rule; "two `=` picks become **In**, two `!=` picks become **Not in**, and a second `>` replaces the first" is a spec dump.

### Tone (AGENTS.md §2 has the full word lists; these are the repeat offenders)

- **Em dashes for asides** → period, comma, colon, or parentheses.
- **No drama or voiceover:** rhetorical build-ups ("X is the answer"), trailing tags ("…, which it is"), figurative labels ("delivery vehicle"), cutesy asides ("the same treatment for your Lambda functions"). Write the plain fact.
- **No reflexive benefit-tails:** don't glue "…, so you can [vague upside]" onto every sentence. Keep it only when the cause and effect is real and specific.
- **No hype or filler:** powerful, seamless, robust, effortless; leverage/utilize → use, via → with, "in order to" → to, "simply/just/easily".

### Do this

- Open with what the reader accomplishes, not background or history.
- Verb-led headings for task sections ("Turn on execution logging"); noun headings that name a screen are fine for reference sections ("The State machines table").
- Vary sentence length and openers. Don't start three sentences in a row the same way, especially with the product name.
- Be concrete: real labels and values (`level ALL`, `/aws/vendedlogs/states/<name>`), a real error string.
- Close a section with the next step (a link to setup, Explore, or Alerts).

When asked to review for these, rewrite the offending lines — don't just list them.

## Agent-docs terminology: plain words, no product jargon

- Do not use **"baseline."** It means nothing to a reader. Use **"eBPF monitoring"** or **"ETW monitoring"** for the eBPF or ETW layer, and **"automatic monitoring"** (or "what the agent collects automatically") for the general idea. Drop the redundant article too: write "eBPF monitoring needs kernel 4.14," not "the eBPF monitoring needs…". It reads as a mass noun, and the docs already start sentences with a bare "eBPF."
- Do not describe PHP container instrumentation as happening **"in place."** Say **"without a redeploy"** or **"directly"** — the point is that no rebuild or redeploy is needed; "default" would misdescribe it. Exception: the ASG page's "in-place upgrade" is the correct standard term for that deployment strategy, so leave it.

## Phrasing: describe the system, do not assert what the reader owns

AGENTS.md already says to keep the reader (not the product) as the subject, and to describe system state when there is no natural "you." One specific case to watch: do not make presumptuous ownership or management claims about the reader's setup, such as "You own the container instances" or "You own the raw YAML." Rephrase to describe the thing:

- "You own the container instances" becomes "The EC2 instances are self-managed."
- "You own the raw YAML" becomes "The raw YAML is edited directly."
- "You manage the agent from the web interface" becomes "The agent is managed from the web interface."

Give step instructions in the imperative: "Turn on the toggle," "Run the install script." The objection is only to declarative claims about the reader's environment, not to instructional voice.

## Verify before you finish

Run `npm run build` after content changes. Its postbuild step (`scripts/check-links.mjs`) fails on broken internal links, which catches renamed heading anchors and bad relative paths. A clean run ends with `check-links: no broken internal links found`.
