# Rules File Spec — `content/rules.md`

This document specifies the format for the rules file consumed by the Pricing
Page Roaster. Hand this spec to another LLM (or a human) along with whatever
domain knowledge you want encoded, and they should produce a drop-in
replacement for `content/rules.md`.

---

## TL;DR

- The rules file is **plain Markdown**.
- It is **fed to the model wholesale** as a text block — no parser, no schema.
- The model is instructed to read it, decide which rules apply to a given
  pricing page, and output 8–14 findings with severity, category, region,
  punchline, body, and rationale.
- The Markdown structure (`##` for categories, `###` for individual rules,
  bullet metadata under each rule) exists purely to make the file readable for
  both humans and the model. Stay consistent — the model uses the structure
  to navigate.

---

## How the file is consumed

1. At request time, the API route reads `content/rules.md` and caches it in
   module scope (one read per server instance).
2. The full text is injected into the LLM call as a single user-message text
   block, prefixed with `# Roast Rules`.
3. The model's system prompt (in `lib/llm.ts`) constrains the **output
   shape** (severities, regions, schema). The rules file constrains the
   **content** (what to look for, why it matters, voice).
4. The model picks the 8–14 most applicable rules for the page in front of
   it. Rules that don't apply are silently skipped.

> **Implication:** there is no penalty for adding more rules. The model
> ignores the ones that don't fit. You can have 60+ rules in the file; the
> model still only surfaces 8–14 in the output.

---

## File location & encoding

- Path: `content/rules.md` (relative to repo root)
- Encoding: UTF-8
- Line endings: LF
- No frontmatter required — but the file traditionally opens with a short
  voice/tone preamble before the first `##` (see below)

---

## Required structure

```markdown
# SaaS Pricing Page — Roast Rules

[Optional preamble: 1–2 paragraphs setting voice/tone for the model.
This text is read by the model and influences how it writes findings.]

---

## <Category Name>

### <Specific rule title>
- severity: critical | major | minor
- region: header | tiers | feature-matrix | toggle | cta | faq | footer
- look_for: <one or two sentences describing the concrete signal on the page>
- why: <one or two sentences on why this matters and what good looks like>

### <Another rule under the same category>
- severity: ...
- region: ...
- look_for: ...
- why: ...

## <Next Category Name>

### <Rule>
...
```

That's it. Three nesting levels:

| Level | Purpose                                       |
| ----- | --------------------------------------------- |
| `#`   | File title (single, optional)                 |
| `##`  | Category — becomes the `category` field       |
| `###` | Individual rule — the unit the model evaluates |

Under each `###` rule, the four bullets (`severity`, `region`, `look_for`,
`why`) are required.

---

## Constraints — these are hard

### Severity

Pick one. Penalties are applied to the page's score:

| Severity   | Score penalty | Use for…                                                      |
| ---------- | ------------- | ------------------------------------------------------------- |
| `critical` | −10           | Actively losing the buyer or leaving large ARR on the table   |
| `major`    | −5            | Measurably hurting conversion or unit economics               |
| `minor`    | −2            | Paper cuts, polish, quality issues                            |

If you cannot decide between two levels, pick the lower one. The model is
already biased toward severity inflation.

### Region

Must be **one of these seven values**, lowercase. The schema rejects anything
else.

| Region          | What sits there                              |
| --------------- | -------------------------------------------- |
| `header`        | Top-of-page hero, headline, currency toggle  |
| `tiers`         | The tier cards themselves                    |
| `feature-matrix`| The detailed comparison table below tiers    |
| `toggle`        | Monthly/annual toggle                        |
| `cta`           | Primary call-to-action buttons               |
| `faq`           | The FAQ section                              |
| `footer`        | Bottom of page: trust strip, social proof    |

If a rule could plausibly apply to two regions, pick the one where the
problem is most likely to be **first noticed** by the buyer.

### Category

Free-form short noun phrase. Becomes the `category` field on findings.
Convention: use the same string across all `###` rules under one `##`
heading. Existing categories used by the seed file:

- Pricing transparency
- Behavioural psychology
- Information architecture
- Conversion
- Trust signals
- AI agent readiness
- Copywriting

You can introduce new categories. Don't fragment — try to keep the count
under ~10. Two rules in the same category is healthier than each rule being
its own category.

---

## Voice — the most important section

The voice for the **roasts themselves** is set in two places:

1. The system prompt in `lib/llm.ts` (hardcoded: dry, slightly British,
   understated)
2. The preamble of `rules.md`

Both should agree. If you change the voice in one, change it in the other.

**The current voice spec (don't change unless you mean to):**

- Dry, slightly British, understated. The tone of a smart friend who has
  seen this exact mistake fifty times and is mildly tired of it.
- Punchline first, evidence second.
- Specific over generic — use real nouns from the actual page when possible
  (tier names, copy verbatim, real numbers).
- Never use exclamation marks. Never explain the joke. Never apologise.
- No corporate-speak ("leverage", "synergies", "world-class").
- No hedging ("may", "potentially", "might want to consider").
- A small literary flourish is welcome. (`"Forty-one feature rows. I
  counted."`)
- The reader is the founder. They can take it. Don't soften.

**Voice applies to roasts written from your rules — not to the rules
themselves.** Your `look_for` and `why` text can be plain operational
language. The model uses your `look_for`/`why` as raw material and writes
the actual roast in the prescribed voice.

---

## Output schema — what the model produces from your rules

For your reference (not something you write). Each finding the model emits
looks like:

```json
{
  "severity": "critical | major | minor",
  "category": "string — usually your ## heading",
  "region": "header | tiers | feature-matrix | toggle | cta | faq | footer",
  "title": "the punchline (≤120 chars, no exclamation marks)",
  "body": "1–2 sentences with evidence from the page (≤320 chars)",
  "why": "1–2 sentences on why it matters and what to do (≤320 chars)"
}
```

The whole response also includes a score (0–100), grade letter (A through
F), tier label (`"Pricing clinic"` / `"A polite disaster"` / etc.), and a
summary paragraph. None of those are influenced by individual rules — they
fall out of the aggregate severity counts.

---

## Good rule examples

These follow the spec and produce strong findings.

### ✅ Good — concrete signal, clear consequence

```markdown
### Hidden enterprise pricing
- severity: critical
- region: tiers
- look_for: A top tier marked "Contact us", "Custom", or "Enterprise"
  with no price band, no "starting at" figure, and no qualifier explaining
  what triggers the conversation.
- why: Hiding enterprise pricing is fine. Hiding it without a tight
  qualifier (band, starting price, or a clear "why") makes it feel like
  punishment for being interesting. Buyers who can't self-qualify silently
  leave.
```

### ✅ Good — counts a specific thing, names the alternative

```markdown
### Feature matrix sprawl
- severity: major
- region: feature-matrix
- look_for: A comparison table with more than ~12 feature rows, especially
  ones that need their own scrollbar or collapse.
- why: Buyers compare 3–5 things. The other rows are noise that punishes
  the hero rows you actually want them to see. If a matrix needs its own
  scrollbar, it's not a feature matrix, it's a hostage situation.
```

### ✅ Good — short, surgical, naming a specific anti-pattern

```markdown
### Annual toggle that whispers
- severity: minor
- region: toggle
- look_for: A monthly/annual toggle that shows "save 10%" in 12px grey,
  or never shows the absolute dollar saving.
- why: Annual discounts are a commitment device. If the discount is real,
  sell it in absolute dollars next to the slash price. If it isn't, hide
  it. Currently it's doing neither.
```

---

## Anti-patterns — don't do these

### ❌ Vague rule with no concrete signal

```markdown
### Pricing should be clear
- severity: major
- region: tiers
- look_for: The pricing isn't clear enough.
- why: Clear pricing converts better.
```

The model has nothing to anchor to. "Clear" doesn't tell it what to look
for. It will either skip the rule or fabricate evidence to justify it.

### ❌ Two rules that are the same shape

```markdown
### Hidden enterprise pricing
- look_for: Top tier marked "Contact us" with no price band.

### Enterprise tier hidden
- look_for: The most expensive tier doesn't show a price.
```

The model will fire both and you'll get two near-identical findings. One
canonical rule per problem.

### ❌ Rule that depends on context the model doesn't have

```markdown
### Wrong pricing for our ICP
- look_for: The pricing doesn't match our buyer persona.
- why: Our buyer is RevOps at $30k ACV.
```

The model only sees the user's optional context block — and even then can't
infer "wrong." Rules should describe **structural** problems the model can
see on the page itself.

### ❌ Mixing voice into the rule body

```markdown
### Three tiers walk into a bar
- severity: critical
- region: tiers
- look_for: Three tiers, the middle one wearing camouflage.
- why: It's not a recommendation, it's a riddle.
```

The voice belongs in the **emitted finding**, not in your rule's
`look_for` / `why`. Write the rule operationally; let the model do the
voice. Otherwise you constrain its phrasing and it produces stilted output.

### ❌ Severity inflation

```markdown
### Slightly small CTA button
- severity: critical
- region: cta
- look_for: CTA button that could be a bit bigger.
- why: Bigger CTAs convert better.
```

`critical` should mean "this is meaningfully losing money." A small button
is `minor` at most. The score system relies on you reserving `critical` for
real fires.

---

## How many rules?

| Rule count | Behaviour                                                       |
| ---------- | --------------------------------------------------------------- |
| < 15       | Underconstrained — model invents categories, output is generic  |
| 15–30      | Healthy starting range                                          |
| 30–60      | Sweet spot — model has good coverage, picks the best 8–14       |
| 60–100     | Fine, but inputs grow; check token usage                        |
| 100+       | Diminishing returns; consider splitting by audience or industry |

Each rule adds maybe 80–150 tokens to the prompt. At 60 rules you're
spending ~7k tokens on the rules file per request. Gemini Flash handles this
without complaint.

---

## Reload behaviour

`lib/rules.ts` reads the file once per server instance and caches it in
module scope. Implications:

- **Local dev:** a hot-reload picks up the change because Next restarts
  the module on edit. Just save the file.
- **Production (Vercel):** changes ship via a redeploy. There is no
  hot-reload of `rules.md` in a running serverless function.

If you want runtime-editable rules later, the change is small (move
`rules.md` to a database row or a Vercel Edge Config entry). For now, the
file lives in the repo.

---

## Generating a rules file with another LLM

Hand this spec plus your domain knowledge to ChatGPT, Claude, or Gemini and
ask for a `content/rules.md` file. A good prompt template:

```
You are writing a rules catalog for a pricing-page critique tool.
Read this spec [paste contents of RULES_SPEC.md]. Then produce a
`content/rules.md` file with 40–50 rules covering [your focus areas:
e.g. SaaS B2B, vertical SaaS, AI products, dev tools, etc.].

Constraints:
- Follow the file structure exactly.
- Use only the seven legal regions.
- Never mark a rule `critical` unless it is plausibly costing the seller
  meaningful ARR.
- Each `look_for` must describe a concrete, observable signal on the page.
- Voice in `look_for` / `why` is operational; the tool's voice
  (dry, British) is applied separately. Don't write punchlines.

Output the full rules.md file in a single code block.
```

Drop the resulting file into `content/rules.md`, restart `npm run dev`, and
roast a page to verify the new rules fire as expected.
