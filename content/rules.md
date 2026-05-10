# SaaS Pricing Page — Roast Rules

A catalog of common ways pricing pages waste money. Edit this file to teach the
roaster new tricks. The whole file is fed to the model as part of its prompt.

**Voice:** dry, slightly British, understated. Sharp but never cruel. Punchline
first, evidence second. Never use exclamation marks. Never explain the joke.

**Severities:**
- `critical` — actively losing the buyer or leaving large ARR on the table
- `major` — measurably hurting conversion or unit economics
- `minor` — paper cuts and quality issues

---

## Pricing transparency

### Hidden enterprise pricing
- severity: critical
- region: tiers
- look_for: A top tier marked "Contact us", "Custom", "Enterprise" with no price band, no "starting at" figure, and no qualifier explaining what triggers the conversation.
- why: Hiding enterprise pricing is fine. Hiding it without a tight qualifier (band, starting price, or a clear "why") makes it feel like punishment for being interesting. Buyers who can't self-qualify silently leave.

### Currency confusion
- severity: major
- region: tiers
- look_for: USD-only with no currency toggle, no IP-based detection, no "billed in your local currency" line.
- why: Even one explicit "USD — billed in your local currency" line beats silence. International buyers do the conversion math during the buying decision. That's friction.

### Hidden fees / footnotes that move the price
- severity: major
- region: tiers
- look_for: Asterisks, "+ taxes", "minimum X seats", "billed annually only" hidden in 11px grey, or pricing that materially changes when you click into checkout.
- why: A price that grows in transit is a trust event. Surface the floor honestly.

---

## Behavioural psychology

### Middle tier without an anchor
- severity: critical
- region: tiers
- look_for: Three or more tiers with no visual weight, no "Most popular" / "Recommended" label, and no recommendation logic.
- why: A clearly anchored recommended tier reliably lifts the average plan choice. Letting the buyer pick the cheapest one and feel virtuous about it is a default-loss.

### No decoy / clean linear progression
- severity: minor
- region: tiers
- look_for: Tiers priced at clean multiples (e.g. $10 / $20 / $40) with no decoy structure to make the recommended tier feel obviously correct.
- why: A well-priced decoy tier makes the intended winner feel like the smart pick, not the middle one. Mathematically tidy is psychologically inert.

### Annual toggle that whispers
- severity: minor
- region: toggle
- look_for: A monthly/annual toggle that shows "save 10%" in 12px grey, or never shows the absolute dollar saving.
- why: Annual discounts are a commitment device. If the discount is real, sell it in absolute dollars next to the slash price. If it isn't, hide it. Currently it's doing neither.

---

## Information architecture

### Feature matrix sprawl
- severity: major
- region: feature-matrix
- look_for: A comparison table with more than ~12 feature rows, especially ones that need their own scrollbar or collapse.
- why: Buyers compare 3–5 things. The other rows are noise that punishes the hero rows you actually want them to see. If a matrix needs its own scrollbar, it's not a feature matrix, it's a hostage situation.

### Pricing buried in the FAQ
- severity: minor
- region: faq
- look_for: An FAQ entry that answers what the price actually is, or how a key pricing dimension (per-project, per-seat, per-usage) actually works.
- why: If a question is asked enough to be in the FAQ, the answer belongs in the tier card. The FAQ is for objections, not for pricing.

### Wrong unit of value
- severity: major
- region: tiers
- look_for: Per-seat pricing on a product where seats vary wildly in usage (12 part-timers vs 12 power users pay the same), or per-event pricing on a product where usage is unpredictable.
- why: Per-seat works until your ICP has variable usage. Consider tiered seats, active-user pricing, or a usage rider that aligns price to value delivered.

---

## Conversion

### Two equal CTAs
- severity: major
- region: cta
- look_for: "Start free trial" and "Book a demo" given equal weight in every tier, neither one primary.
- why: Pick a primary action per tier based on tier intent (self-serve vs sales-led). Two equal CTAs is a tie, and ties favour leaving.

### No proof, no urgency, no reason to act today
- severity: critical
- region: header
- look_for: A pricing page with no recent customer outcome, no usage stat, no dated review, no trial framing — just tier cards.
- why: The page reads like a brochure. Brochures convert at the rate of brochures. Add at least one of: a fresh customer outcome, a usage stat, a dated review, or a trial expiry frame.

### Vague value copy
- severity: minor
- region: tiers
- look_for: Tier sub-headers that are stacks of adjectives ("powerful", "seamless", "collaborative", "enterprise-grade") with no noun phrase identifying who the tier is for.
- why: Tier descriptions should answer "who is this for" in a noun phrase ("Solo freelancers", "Growing teams of 10–50"), not in mood lighting.

### "Unlimited" overuse
- severity: minor
- region: tiers
- look_for: The word "unlimited" appearing more than three or four times across the tiers and feature matrix.
- why: When everything is unlimited, nothing differentiates. Replace at least some with a real ceiling — buyers prefer specifics over vibes.

---

## Trust signals

### Mismatched logo strip
- severity: minor
- region: footer
- look_for: A "trusted by" logo strip mixing one or two famous logos with several unknown ones, or just unknowns.
- why: Mixing famous and unknown logos doesn't average to credible — it averages to suspicious. Curate to 4–5 universally recognisable brands, or replace logos with named, attributable customer quotes that do real work.

### No social proof at all
- severity: major
- region: footer
- look_for: Zero customer logos, zero quotes, zero case study links, zero usage stats.
- why: A pricing page with no proof is asking the buyer to trust the prices on faith. They won't.

---

## AI agent readiness

### Not machine-readable
- severity: major
- region: header
- look_for: No JSON-LD Product/Offer schema, no clear price-per-seat line a parser can grab, SKU naming that reads like marketing not metadata.
- why: Procurement copilots and AI shopping agents are quickly becoming the first reader of your pricing page. If they can't parse your prices, they'll quote your competitor instead — politely.

### robots.txt blocks /pricing
- severity: minor
- region: footer
- look_for: robots.txt that blocks well-behaved crawlers from /pricing, or noindex on the page.
- why: Your pricing page is a salesperson. Letting AI shopping agents read it costs nothing. Blocking them is a self-inflicted wound.
