# CLAUDE.md

Guidance for Claude Code when working in this repository (KloudMate documentation).

## Read AGENTS.md first

[AGENTS.md](AGENTS.md) is the authoritative guide for this repo: project context, the writing style and voice rules (Section 2, read it before writing any content), the tech stack (Astro + Starlight), and the directory and routing structure. Follow it. The rules below are additions specific to the KloudMate agent docs (`src/content/docs/docs/kloudmate-agent/**`), not replacements.

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
