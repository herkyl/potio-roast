# SaaS Pricing Page — Roast Rules

A catalog of common ways SaaS & AI pricing architectures waste money. The whole file is fed to the model as part of its prompt.
Audience: SaaS and AI founders. They built their pricing, they can take the truth without being cushioned.
Voice: dry, slightly British, understated. Sharp but never cruel. Punchline first, evidence second. Specific over generic — use real nouns from the page (tier names, copy verbatim, real numbers) where you can. Never use exclamation marks. Never explain the joke.

## Severities:

`critical` — actively losing the buyer or leaving large ARR on the table
`major` — measurably hurting conversion or unit economics
`minor` — paper cuts and quality issues

The `look_for` and `why` fields below are operational raw material. Don't echo them back. Rewrite the finding in your own voice.

---

## Plan architecture

### Choice overload
- severity: major
- region: tiers
- look_for: More than four distinct pricing tier columns shown side by side on desktop.
- why: Four tiers is roughly where comparison cost starts beating decision benefit. Past that, buyers spend their attention budget on the matrix rather than the upgrade, and the cheapest option wins by default.

### Freemium cannibal
- severity: critical
- region: tiers
- look_for: A free plan that delivers the core value metric (e.g. unlimited projects, full feature access) without strict capacity caps, time limits, or a clearly missing capability that the paid plan unlocks.
- why: Freemium is an acquisition strategy, not a revenue model. If the free tier solves the entire problem, paid conversion has no natural trigger and the free user lives there forever.

### Missing enterprise ceiling
- severity: major
- region: tiers
- look_for: The highest visible tier is a self-serve price with no "Contact us" or "Custom" option beyond it for unlimited usage, compliance, or dedicated support.
- why: Without a ceiling, high willingness-to-pay buyers anchor on the self-serve price and you cap your own deal size. A custom tier costs nothing to add and unlocks the top of the market.

### Undifferentiated tier names
- severity: minor
- region: tiers
- look_for: Tier names use abstract or metal-based labels (Bronze, Silver, Gold, Platinum) instead of persona or use-case names (Starter, Team, Business, Enterprise).
- why: Persona-based names let buyers self-select in two seconds. Abstract names force them to read every feature list to figure out which one is meant for them, and many won't.

### Unclear value metric scaling
- severity: major
- region: tiers
- look_for: The core unit of value (seats, projects, API calls, contacts, etc.) is not stated directly next to the price, or the unit shifts between tiers without explanation.
- why: Buyers need to know what makes the bill go up before they sign up. If the metric is hidden or inconsistent, the page reads as a trap and they bounce to a competitor who shows the maths.

### Everything is an add-on
- severity: major
- region: tiers
- look_for: More than three paid add-ons listed beneath the main pricing plans, especially when core-feeling capabilities (integrations, support, basic security) sit in the add-on section.
- why: Fragmenting core functionality forces buyers to mentally assemble the real price. It feels like a budget airline. The list price becomes a fiction.

### Artificial feature limits
- severity: major
- region: tiers
- look_for: Hard limits on features that have no plausible cost-to-serve justification (e.g. "3 projects" on a single-tenant desktop app, "1 webhook" on a free tier).
- why: Nuisance limits build resentment without building revenue. Limits should track real cost or real customer value, not be there for the sake of being a fence.

### Invisible trial duration
- severity: minor
- region: cta
- look_for: A "Start free trial" CTA with no nearby text stating the trial length (7-day, 14-day, 30-day).
- why: Trial length is the second thing every prospect wants to know after the price. Hiding it costs you free signups for no reason.

### Price chasm
- severity: major
- region: tiers
- look_for: The price jump from one tier to the next is greater than 3x, without a proportional jump in usage limits or value.
- why: A chasm leaves the buyer stuck between a plan they've outgrown and one they can't justify. They churn to a competitor with a smoother ladder.

### Missing ICP identifiers
- severity: major
- region: tiers
- look_for: Tiers lack a one-line subtitle naming the target user (e.g. "For solo builders", "For scaling teams", "For regulated industries").
- why: A subtitle does the segmentation work for the buyer in one glance. Without it, every tier feels like it could be for them, which means none of them feel like it is.

### Gating core functionality
- severity: major
- region: tiers
- look_for: A feature required to get baseline value from the product sits in the second or third tier, making the entry tier effectively useless.
- why: If the entry tier can't deliver on the headline promise, it's not an entry tier, it's a demo with a bill attached. Buyers feel the bait and churn fast.

### Overlapping feature sets
- severity: major
- region: tiers
- look_for: Two adjacent tiers have nearly identical feature lists with only marginal differences in limits or cosmetic add-ons.
- why: If the difference between tiers isn't obvious in five seconds, the cheaper one wins. Tiers exist to separate willingness-to-pay, not to look full.

### Feature dumping over outcomes
- severity: critical
- region: tiers
- look_for: Tier descriptions are purely a list of technical capabilities ("API access, 5GB storage, webhooks") with no outcome headline or grouping.
- why: Buyers buy outcomes. A tier needs a one-line "what this tier lets you do" above the feature bullets, otherwise the prospect is doing the marketing team's job in their head.

### Misaligned scaling dimensions
- severity: major
- region: tiers
- look_for: Pricing scales on two unrelated axes at once (e.g. per seat AND per gigabyte AND per API call) with no bundled allowance or clear primary metric.
- why: Multi-axis scaling makes future cost impossible to forecast. Finance teams can't approve what they can't model, and the deal stalls.

### Vague enterprise value
- severity: major
- region: tiers
- look_for: The enterprise tier description is "Everything in Pro, plus more" or similar, with no specifics on SSO, SLA uptime, compliance certifications, dedicated CSM, or audit logs.
- why: Enterprise buyers are buying risk mitigation. If the page doesn't name SOC2, GDPR, 99.9% SLAs, or named support, the enterprise pipeline never starts.

### Enterprise tier carrying non-enterprise features
- severity: major
- region: tiers
- look_for: The enterprise tier promises features that are clearly useful to self-serve customers (advanced reporting, integrations, higher usage limits) rather than features that only matter to large buyers (SSO, SAML, audit logs, custom DPA, dedicated support, SLA, custom contract).
- why: The enterprise tier should hold only what helps enterprise buyers buy. Anything else gets dumped there as a way to force upgrades, which alienates self-serve customers and trains them to look at competitors.

---

## Pricing model

### Per-seat trap
- severity: major
- region: tiers
- look_for: Pure per-seat pricing on a product where (a) value is per-org rather than per-user, (b) value is distributed unevenly across users (a small share of users gets most of the value), or (c) cost-to-serve per user is high (heavy AI inference, storage, compute).
- why: Per-seat works when every user gets independent and roughly equal value. When value is per-org or top-heavy, seats either cap your upside or punish your power users. When cost-to-serve is high, seats decouple price from cost and the margins evaporate at scale.

### AI product with no usage component
- severity: major
- region: tiers
- look_for: A product that uses LLM inference, agents, or other variable-cost AI workloads, priced exclusively on seats or flat fees with no usage meter (tokens, runs, credits, actions, queries).
- why: AI cost is variable and often dominant. A flat or per-seat price either subsidises heavy users at the expense of light ones, or caps light-user adoption to protect against heavy users. Some usage-based component is almost always the right answer, even if it's a credit pool rather than pure metered billing.

### Unpredictable usage costs
- severity: major
- region: tiers
- look_for: Usage-based pricing is advertised with no interactive calculator, no example monthly costs for typical customer profiles, and no caps or alert thresholds.
- why: Usage pricing aligns with value, but uncapped variability terrifies finance. Without a calculator, buyers assume the worst case and defer or downgrade. A simple calculator and a price-cap on the highest plan handles both ends.

### Value metric far from value
- severity: major
- region: tiers
- look_for: The primary meter is loosely coupled to customer value (e.g. charging per API call when the customer measures success in completed deliveries, conversions, or revenue generated).
- why: The closer the meter sits to the outcome, the easier expansion is. Sometimes an input metric is the only honest meter available, that's fine. But if a tighter outcome-correlated metric exists and you're not using it, you're leaving expansion on the table.

### High-low retail pricing on B2B
- severity: major
- region: tiers
- look_for: Pervasive crossed-out high prices, "limited time" badges, or aggressive discount banners typical of consumer e-commerce, on B2B SaaS.
- why: B2B buyers don't believe perpetual discounts, they recalibrate to the discounted price as the real one. The list price ends up looking fake and the brand looks desperate.

### Over-bundling fatigue
- severity: minor
- region: tiers
- look_for: A bundled suite of broadly disparate tools or modules sold as a single price, when the buyer's likely need is one specific workflow.
- why: Forcing the cable-package buy lowers willingness-to-pay for the core thing the buyer actually wants. Unbundle, or offer a lighter SKU.

---

## Pricing transparency

### Contact-us paywall for SMB
- severity: critical
- region: tiers
- look_for: No public pricing at all, only a "Contact Sales" button, on a product clearly aimed at individuals, prosumers, or small teams.
- why: Hiding pricing is fine for enterprise deals over $10k ACV. Doing it for SMB tools guarantees an immediate bounce. Low-ACV buyers will not endure a discovery call to find out a $50/month price.

### Hidden minimums
- severity: critical
- region: tiers
- look_for: A "per user" price is advertised prominently, but a small asterisk or footnote reveals a minimum seat count (e.g. 5, 10, 20 seats) that multiplies the actual entry cost.
- why: Bait and switch. The buyer mentally commits to the $10/month price and discovers the real bill is $100/month at checkout. Trust dies before the credit card comes out.

### Hidden implementation fees
- severity: major
- region: faq
- look_for: A pricing tier hints at mandatory onboarding or setup fees but buries the actual cost in an asterisk, ToS link, or "discuss with sales" footnote.
- why: Surprise fees uncovered during procurement break deal momentum and force budget re-approvals. Disclose upfront or fold into the headline price.

### Grandfathering ambiguity
- severity: minor
- region: faq
- look_for: No mention in the FAQ of what happens to existing customers when prices change.
- why: Prospects worry about being on the hook for arbitrary future increases. A one-sentence policy ("Existing customers keep their price for 12 months after any change") removes the objection cheaply.

### Unclear auto-renewal terms
- severity: major
- region: faq
- look_for: Annual plans have no nearby disclaimer about auto-renewal, renewal notification, or how to cancel before renewal.
- why: Unclear renewal terms cause chargebacks, public complaints, and regulatory exposure. Saying so on the pricing page builds more trust than the cost in lost auto-renewals.

### Click-to-cancel friction
- severity: critical
- region: faq
- look_for: The FAQ or terms require a support ticket, email, or live chat to cancel a self-serve subscription, rather than a one-click in-product cancellation.
- why: FTC's click-to-cancel rule (and similar EU rules) require cancellation to be as easy as signup. Beyond the legal exposure, it's a brand-destroying friction that customers tell each other about.

### Missing "no credit card required"
- severity: major
- region: cta
- look_for: A free trial is offered but the page is silent on whether a credit card is required upfront.
- why: Card-on-file fear is one of the biggest top-of-funnel drop-offs. If you don't take a card, say so loudly. If you do, say that too, but expect lower signup volume.

### Missing pricing FAQ
- severity: minor
- region: faq
- look_for: The page has pricing tiers but no FAQ section addressing common objections (billing, refunds, security, contracts, support).
- why: The pricing page is the highest-anxiety moment in the funnel. A FAQ resolves the last objections without making the buyer leave the page.

### Monthly is the default toggle
- severity: major
- region: toggle
- look_for: The monthly/annual toggle defaults to "Monthly" on initial page load.
- why: Defaults are powerful. Pre-selecting annual anchors the user on the lower per-month equivalent and shifts the framing toward annual commitment, which improves cash collection and reduces churn.

### Annual savings not quantified
- severity: major
- region: toggle
- look_for: The monthly/annual toggle changes the price number but offers no nearby "Save 17%" or "2 months free" framing.
- why: Buyers don't do mental maths on the pricing page. If the saving isn't named in absolute terms, the toggle is silently doing nothing.

### Annual toggle in witness protection
- severity: minor
- region: toggle
- look_for: The monthly/annual toggle is small, low-contrast, placed far from the tier cards, or hidden in a corner.
- why: A toggle the buyer can't find isn't a toggle. The toggle is a primary navigation element on this page and should be visually prominent.

### Toggle causes layout shift
- severity: major
- region: toggle
- look_for: Clicking the monthly/annual toggle causes visible layout shifts, card resizing, or content reflow.
- why: Cumulative layout shift on the pricing page hurts Core Web Vitals and frustrates buyers exactly when their eyes are locked on specific numbers.

### Annual context stripped from monthly framing
- severity: major
- region: toggle
- look_for: When annual is selected, the card shows only the monthly equivalent ($10/mo) with no annual total or savings nearby, OR shows only the annual lump sum ($120/year) with no per-month equivalent.
- why: Monthly framing reduces sticker shock, annual context reinforces commitment value. You need both. Show the per-month price as the big number, with "$120 billed annually" or "save 17%" in small text below.

### Annual discount under 15%
- severity: major
- region: toggle
- look_for: The annual discount shown on the toggle or in the savings copy is below 15% (e.g. "Save 10%").
- why: Below 15%, the discount doesn't move self-serve buyers off monthly. The cash and churn benefit of moving someone to annual outweighs the discount on almost any reasonable model. Two months free (~17%) is the floor that actually works.

### Unjustified annual discounts
- severity: minor
- region: toggle
- look_for: The annual discount is over 30% (e.g. "Save 50%" or more).
- why: Standard discounts range from 15% to 30%. Bigger discounts signal that the monthly price is fictitious and erode perceived value of the product. They also trap you when you try to raise the floor later.

### Cosmetic localization
- severity: major
- region: tiers
- look_for: Currency switches based on geolocation but produces awkward unrounded numbers (e.g. €47.34, £38.12) rather than locally rounded anchors (€49, £39).
- why: Exchange-rate conversion ignores local willingness-to-pay and breaks the psychological pricing. True localization rounds and adjusts to local norms.

### Incorrect currency formatting
- severity: minor
- region: tiers
- look_for: Currency symbols, decimal separators, or thousands separators are formatted in the wrong convention for the displayed locale (e.g. "€50.00" with US conventions instead of "50,00 €" for many European locales).
- why: Wrong formatting signals to the local buyer that the company isn't really operating in their market, which raises friction at exactly the wrong moment.

### Missing purchasing power parity
- severity: major
- region: tiers
- look_for: The same USD-equivalent price is charged in emerging markets as in high-income markets, with no PPP discount or regional pricing.
- why: Charging Silicon Valley prices in Bangalore prices out the entire emerging-market TAM. Regional pricing or a published PPP discount captures markets that otherwise convert at near zero.

### VAT/GST ambiguity
- severity: major
- region: tiers
- look_for: For European or other VAT-jurisdiction traffic, no indication of whether prices are VAT-inclusive or VAT-exclusive.
- why: A 20% surprise at checkout is one of the highest-leverage cart abandonment causes in B2B European SaaS. Say it on the card.

---

## Behavioural psychology

### Cheapest-first anchoring
- severity: minor
- region: tiers
- look_for: Tiers are ordered left-to-right from cheapest to most expensive, with no high-anchor tier visible first.
- why: Anchoring research suggests showing the high tier first frames everything below as a relative bargain. The effect is real but modest, hence minor.

### Charm pricing on enterprise tiers
- severity: minor
- region: tiers
- look_for: Enterprise or mid-market tiers use "$X99" or "$X.99" pricing (e.g. $499, $1999).
- why: Charm pricing works on low-ACV consumer purchases by exploiting left-digit bias. On B2B mid-market and enterprise, round numbers signal seriousness and simplify procurement. Use $500 not $499.

### No decoy tier
- severity: minor
- region: tiers
- look_for: Three or more tiers scale perfectly linearly in price and features with no asymmetrically priced option pushing buyers toward the target plan.
- why: A decoy plan priced near the target tier with slightly worse value mathematically nudges buyers to upgrade. Optional play, hence minor.

### No center-stage tier
- severity: major
- region: tiers
- look_for: No tier is visually elevated, badged ("Most popular"), shadowed, or differently coloured. All cards look identical.
- why: When presented with three options, buyers default to the middle. Visual highlighting compounds that effect. Leaving every card uniform leaves the choice to chance.

### High-friction CTA copy
- severity: minor
- region: cta
- look_for: Primary CTAs say "Buy now" or "Get started" on a high-ACV B2B product instead of lower-friction options like "Start free trial" or "Book a demo".
- why: "Get started" implies commitment work. Lower-friction language matches buyer intent at this stage of the funnel.

### Fake urgency
- severity: major
- region: tiers
- look_for: Countdown timers, "Only X spots left", or other artificial scarcity claims on an infinitely-replicable SaaS subscription.
- why: Fake scarcity on software destroys credibility. The buyer knows you can't run out of SaaS. The only thing it conveys is desperation. Legitimate scarcity (cohort launches, founding-customer pricing) is fine if real.

### No loss framing
- severity: minor
- region: tiers
- look_for: All copy focuses on what the buyer gains ("save time, integrate easily"), with no framing of what they lose by not using the product (wasted hours, compliance risk, missed revenue).
- why: Humans feel losses about twice as strongly as equivalent gains. Loss framing on one or two bullets sharpens urgency without becoming melodramatic.

### Competing CTAs
- severity: major
- region: cta
- look_for: Each tier card has two or more CTAs of equal visual weight (e.g. "Start trial" and "Book demo" side by side).
- why: Hick's Law: more options means slower decisions and lower conversion. Pick the primary action per tier and demote the rest.

### Cognitive overload in matrices
- severity: minor
- region: feature-matrix
- look_for: A comparison table with 30+ feature rows is shown fully expanded on page load, with no progressive disclosure or collapse.
- why: Buyers compare 3-5 things, not 30. Dense matrices burn the buyer's attention budget before they reach the decision. Collapse the deep details under a "See full comparison" toggle.

---

## Information architecture

### Pricing page acting like a homepage
- severity: major
- region: header
- look_for: The pricing page hero is a generic mission statement, product pitch, or feature montage instead of a pricing-focused headline. The H1 is not "Pricing" (or similar) but a marketing slogan.
- why: People on the pricing page already want pricing. They don't need to be re-pitched. The H1 should clearly state what page they're on, with the tiers visible without scrolling past a re-hash of the homepage.

### Contact-sales button visually equal to trial button
- severity: minor
- region: cta
- look_for: The "Contact Sales" CTA and the "Start trial" CTA have identical color, size, and weight on a hybrid PLG/SLG page.
- why: Self-serve and sales-led are different journeys with different commitment levels. Giving both buttons equal visual weight muddles the choice and dilutes both conversion paths.

### Micro-typography
- severity: minor
- region: tiers
- look_for: Feature bullets inside pricing cards or the feature matrix are smaller than 14px or use low-contrast gray text.
- why: Buyers scan, they don't squint. Tiny low-contrast text on the most important page on the site is just self-sabotage.

### Misaligned numeric data
- severity: minor
- region: feature-matrix
- look_for: Numeric values in the feature matrix (limits, counts, sizes) are center-aligned or left-aligned rather than right-aligned by the decimal.
- why: Right-aligned numbers compare instantly. Center alignment creates jagged edges that slow down scanning.

### Currency symbol overpowering the number
- severity: minor
- region: tiers
- look_for: The currency symbol is the same size as the price digits, taking equal visual weight (e.g. "$49" with the dollar sign the same size as the 4 and 9).
- why: Making the symbol smaller and superscripted puts the visual emphasis on the number, which speeds processing and slightly reduces the perceived price.

### Inconsistent card heights
- severity: minor
- region: tiers
- look_for: Pricing cards on desktop have visibly different heights based on how many bullet points each contains.
- why: Jagged grids look unpolished and slightly broken. Clean alignment is a subconscious trust signal.

### FAQ floating in the footer
- severity: major
- region: faq
- look_for: The FAQ is at the very bottom of the page, separated from the pricing matrix by unrelated marketing blocks, testimonials, or feature sections.
- why: Buyer questions arrive at the moment they see the price. Forcing them to scroll past a wall of marketing to find answers introduces drop-off at the worst possible moment.

### Navigation stripped on pricing page
- severity: minor
- region: header
- look_for: The global top navigation is completely removed on the pricing page (squeeze-page style).
- why: Pricing page visitors often want to click back to Features or Customers to verify a claim. Trapping them breaks expected web behaviour and feels manipulative.

### Ghost buttons as primary CTAs
- severity: minor
- region: cta
- look_for: Primary CTAs (Start trial, Sign up) are rendered as transparent outlined "ghost" buttons rather than solid high-contrast fills.
- why: Ghost buttons lack visual affordance. Primary actions should be the most clickable thing on the page, not the most aesthetic.

### No "Most popular" cue
- severity: major
- region: tiers
- look_for: No tier is visually distinguished with a badge ("Most popular", "Recommended"), accent color, drop shadow, or border treatment.
- why: Buyers want social proof inside the decision. A "Most popular" badge on the target tier shortcuts the comparison and validates the choice.

### Checkmark soup
- severity: minor
- region: feature-matrix
- look_for: A long comparison table consisting almost entirely of green checkmarks across all tiers, with no text values, no negatives, no quantities.
- why: When every cell is a checkmark, no cell carries information. Replace generic checks with text values where relevant ("Up to 50", "Unlimited", "Custom") and remove rows where every tier checks.

### Non-sticky table headers
- severity: minor
- region: feature-matrix
- look_for: Scrolling down a long feature matrix causes the tier names, prices, and CTAs to scroll out of view, leaving the buyer staring at unlabeled columns.
- why: Buyers forget which column maps to which tier within ten rows. Sticky headers (or a small floating recap) are table stakes for any matrix longer than a screen.

### Missing tooltips on jargon
- severity: minor
- region: feature-matrix
- look_for: Proprietary or non-obvious feature names appear in the matrix with no info icon or hover tooltip to explain what they actually do.
- why: Buyers should not have to Google a feature name to figure out if they need it. A tooltip beats an off-site search every time.

### Blank cells for missing features
- severity: minor
- region: feature-matrix
- look_for: Features absent in a tier are shown as an empty cell or a faint dash rather than an explicit "X" or "Not included".
- why: Blank cells read as "missing data" not "feature absent". Explicit absence ("Not included" or a clear X) removes the ambiguity.

### Vague enterprise checkmarks
- severity: minor
- region: feature-matrix
- look_for: An enterprise column shows a plain checkmark for a scalable feature while the lower tier specifies a number (e.g. "50 GB" in Pro, "✓" in Enterprise).
- why: The buyer wants to know if enterprise gives unlimited, more, or the same. State the scaled value ("Unlimited", "Custom").

### No feature categorization
- severity: minor
- region: feature-matrix
- look_for: A feature matrix with 20+ rows presented in one continuous block, with no subheadings (Security, Reporting, Integrations, etc.).
- why: Unsegmented matrices are unscannable. Category headers let buyers jump to the rows they care about and skip the rest.

### No CTA at bottom of long table
- severity: minor
- region: feature-matrix
- look_for: A long feature matrix has CTAs only at the top of each column. After scrolling through 40 rows there is no purchase or trial button at the bottom.
- why: The bottom of the table is exactly when the buyer has decided. Making them scroll back up to convert is a free way to lose them.

### Inconsistent currency context
- severity: minor
- region: tiers
- look_for: Prices appear as bare numbers ("49") without nearby currency code (USD, EUR) in the surrounding text, only a symbol at the top of the page.
- why: For both global buyers and AI parsers, ambiguity about currency is a small but real friction. State the currency code at least once near the prices.

### JavaScript-rendered pricing
- severity: major
- region: tiers
- look_for: With JavaScript disabled, the prices, tiers, or feature matrix fail to load. The raw HTML source contains no price values, only empty containers populated at runtime.
- why: Search engines and AI buyers (Perplexity, ChatGPT, Claude) often can't parse JS-rendered content reliably. If the price isn't in the HTML, it isn't in the world.

### Missing Product/Offer schema
- severity: major
- region: tiers
- look_for: The page's HTML contains no valid JSON-LD Product, Offer, or AggregateOffer markup defining the price, currency, and tier metadata.
- why: Structured data is how search engines and AI agents pick up rich snippets and price comparisons. Skipping it leaves real distribution on the table.

### Generic title tag
- severity: minor
- region: header
- look_for: The `<title>` tag is just "Pricing" or "Plans" with no product or brand name (e.g. "Pricing - Acme | Acme.com").
- why: Title tags are SERP ad copy and browser-tab context. A generic "Pricing" wastes both.

### Missing canonical tag
- severity: minor
- region: header
- look_for: The pricing page lacks a self-referencing `<link rel="canonical">` tag in the head.
- why: Without a canonical, UTM-tagged and tracking-tagged variants compete with each other for ranking. Trivial to add and small but real impact.

### Generic meta description
- severity: minor
- region: header
- look_for: The page's meta description is empty, default boilerplate, or fails to mention starting prices, free trial, or what the product does.
- why: The meta description is SERP ad copy. Mentioning starting price or "free plan available" increases click-through.

### Images instead of text for prices
- severity: critical
- region: tiers
- look_for: The actual price numbers or core feature lists are rendered inside PNG/JPG/SVG images rather than as HTML text.
- why: Images aren't indexable, aren't selectable, aren't accessible to screen readers, and aren't parseable by AI buyers. It's a complete distribution and accessibility failure for the most important content on the page.

---

## Copy and messaging

### Internal jargon
- severity: major
- region: tiers
- look_for: Feature names use proprietary or internal terminology without definition ("500 Zaps", "HyperFlow enabled", "PowerSync minutes").
- why: Jargon excludes anyone who isn't already a power user. Either define the term inline or use the generic name.

### Tone-deaf FAQ
- severity: minor
- region: faq
- look_for: FAQ answers use legalistic or aggressive language ("No refunds under any circumstances", "We reserve the right to terminate at any time").
- why: The FAQ is anxiety reduction, not a terms-of-service document. Conversational, helpful answers build trust at the buying moment.

### Discount with no justification
- severity: major
- region: tiers
- look_for: A discount is offered with no explanation of why ("50% off today", "Limited offer") and no tied reason (cohort, launch, holiday, segment).
- why: Unjustified discounts signal desperation and devalue the product. Tie discounts to a story (Early adopter, Founding customer, Annual prepay) so they read as deliberate, not panicked.

### Ambiguous "unlimited"
- severity: major
- region: tiers
- look_for: A tier promises "Unlimited X" with an asterisk pointing to an unlinked fair-use policy, or no clarification of what triggers limits.
- why: B2B buyers learned to distrust "unlimited" decades ago. Either state real limits or state the fair-use threshold concretely (e.g. "Unlimited up to 100k API calls/month").

### Support level not mentioned in tiers
- severity: major
- region: tiers
- look_for: Mid-market and enterprise tiers don't mention the level or speed of support (e.g. "24/7 chat", "2-hour SLA", "Dedicated CSM") as a distinguishing feature.
- why: For mid-market buyers, the human support guarantee is often the actual reason to upgrade. Failing to name it leaves the upgrade unjustified.

### "Sign up" everywhere
- severity: minor
- region: cta
- look_for: The primary CTA is "Sign up" or "Sign in" with no value-laden alternative ("Start free trial", "Get started for free", "Talk to sales").
- why: "Sign up" is mechanical. "Start free trial" is an offer. Same click, different framing, measurably different conversion.

### Feature-first phrasing
- severity: major
- region: tiers
- look_for: Tier bullets describe the technical capability ("Custom webhooks") with no connection to the buyer outcome ("Connect to any tool via custom webhooks").
- why: Buyers buy outcomes. Pair the feature with the outcome so non-technical evaluators can map the product to their problem.

---

## Trust signals

### No social proof near pricing
- severity: critical
- region: tiers
- look_for: No customer logos, testimonials, ratings, or case study mentions appear near the pricing matrix or CTAs.
- why: Trust is needed most where money is asked for. Putting all proof on the homepage and none on the pricing page leaves the buyer alone at the highest-friction moment.

### Missing compliance badges
- severity: critical
- region: tiers
- look_for: For B2B software, no visible SOC2, ISO 27001, GDPR, HIPAA, or PCI compliance indicator near the enterprise tier or in a trust strip.
- why: For enterprise buyers in regulated or even semi-regulated industries, compliance is a binary filter. Missing badges kills the deal before sales ever speaks to the prospect.

### Anonymous testimonials
- severity: major
- region: footer
- look_for: Testimonials lack full names, real job titles, real company names, or use generic stock photos. Identifiers are missing or vague ("Great app! - John D.").
- why: Vague proof reads as manufactured. A real name, real photo, real title, real company is the minimum bar.

### Unverifiable third-party ratings
- severity: major
- region: footer
- look_for: Claims like "Rated 5 stars" with no source attribution, no platform logo, and no link to the verifiable review platform (G2, Capterra, Trustpilot, Product Hunt).
- why: An unsourced rating is just a graphic. Link or display the source or take the badge down.

### Logo soup
- severity: minor
- region: footer
- look_for: A "Trusted by" strip overstuffed with logos including FAANG names that are unlikely to be real paying customers, or 20+ logos with no curation.
- why: Curated, relevant, in-segment logos outperform a wall of famous names that the buyer suspects are misleading.

### Missing payment security cues
- severity: minor
- region: cta
- look_for: No SSL padlock, Stripe/payment processor logo, or "Secure checkout" indicator near the credit card capture point.
- why: Self-serve buyers want visual reassurance at the payment step. Cheap, easy, slight but real conversion lift.

### Unquantified claims
- severity: major
- region: tiers
- look_for: Marketing copy makes vague claims ("Save time", "Boost productivity", "Faster") with no numbers, percentages, or specific outcomes attached.
- why: Specificity beats vagueness for trust. "Saves 4 hours/week on reconciliation" beats "saves time" by a lot.

### Buried case studies
- severity: major
- region: tiers
- look_for: The enterprise tier doesn't link to a relevant ROI case study, customer story, or measurable outcome example.
- why: Enterprise buyers need ammunition to defend the purchase internally. A linked case study near the enterprise tier arms the champion.

---

## Risk reversal and FAQs

### Unclear refund policy
- severity: minor
- region: faq
- look_for: No mention of refund policy, money-back guarantee, or pro-rated cancellation in the FAQ or near the CTAs.
- why: A 14- or 30-day guarantee removes purchase hesitation cheaply. The cost of occasional refunds is usually dwarfed by the conversion lift.

### Data hostage clauses
- severity: major
- region: faq
- look_for: The FAQ doesn't answer "What happens to my data if I cancel or downgrade?" or makes data export sound difficult.
- why: Vendor lock-in fear is one of the biggest B2B buying objections. Explicit easy-export language removes the objection.

### Vague SLA
- severity: major
- region: tiers
- look_for: The enterprise tier promises "high availability" or "reliable uptime" with no explicit uptime number (e.g. 99.9%, 99.99%) and no link to a status page or SLA document.
- why: Enterprise procurement requires numeric SLAs. Vague claims signal infrastructure immaturity.

### Support SLAs not tiered
- severity: major
- region: tiers
- look_for: Support is listed identically across all tiers with no response-time differentiation (e.g. "24-hour response" in Starter vs "1-hour response" in Enterprise).
- why: Response time is one of the easiest upsell axes. Failing to tier it leaves money on the table and removes a real reason for buyers to upgrade.

### FAQ disconnected from pricing
- severity: major
- region: faq
- look_for: The FAQ lives on a separate URL (e.g. /faq, /help) rather than inline below the pricing matrix, forcing the buyer to leave the pricing page.
- why: Any click away from the pricing page is a chance to lose the buyer. The pricing FAQ should be inline, not a separate destination.

### No contact option in FAQ
- severity: minor
- region: faq
- look_for: The FAQ ends without a "Still have questions?" prompt or contact link.
- why: If the FAQ doesn't resolve the buyer's edge case, leave them a clear path to a human rather than a bounce.

### Integrations not mentioned
- severity: major
- region: faq
- look_for: No mention anywhere on the pricing page of what tools or stacks the product integrates with (Salesforce, Slack, HubSpot, GitHub, Zapier, etc.).
- why: SaaS does not exist alone. Buyers need to know the product connects to their existing stack before committing, and the pricing page is often where they check.