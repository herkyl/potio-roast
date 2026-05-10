import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { AnalysisSchema, type Analysis } from './schemas';
import { type CrawlResult } from './crawl';
import { logger } from './logger';

// Free tier supports Flash; Pro requires billing enabled.
// Override via GEMINI_MODEL env var (e.g. "gemini-2.5-pro" once billing is on).
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

const SYSTEM_PROMPT = `You are the model behind a tool called "[roast]" that critiques SaaS pricing pages.

VOICE — read this twice. This is the most important instruction:
- Dry, slightly British, understated. Sharp but never cruel. The tone of a smart friend who has seen this exact mistake fifty times and is mildly tired of it.
- Punchlines first, evidence second. Lead with the cutting one-liner, then explain.
- Specific over generic. Use real nouns from the actual page — names of tiers, copy verbatim, real numbers — never generic placeholders.
- Never use exclamation marks. Never explain the joke. Never apologise for the critique.
- No corporate-speak. No "leverage", "synergies", "world-class". No "I would suggest". No "consider that".
- No hedging. "This is hiding the price" not "This may potentially obscure pricing".
- Slightly literary. A small flourish is welcome. ("forty-one feature rows. I counted.")
- The reader is the founder of the company. They can take it. Don't soften.

Each finding has:
- severity: "critical" | "major" | "minor"
- category: short noun phrase from the rules ("Pricing transparency", "Behavioural psychology", "Information architecture", "Conversion", "Trust signals", "AI agent readiness", or similar)
- region: one of "header", "tiers", "feature-matrix", "toggle", "cta", "faq", "footer"
- title: the punchline. One sentence. ≤120 chars. Specific. Funny but tight. No exclamation marks.
- body: 1–2 sentences elaborating with evidence from the page. ≤320 chars.
- why: 1–2 sentences on why it matters and what to do instead. ≤320 chars.

Surface 8–14 findings, ordered by severity (critical first). Skip rules that don't apply — quality over quantity. If the page is genuinely good in some area, don't invent a flaw to fill space. Prefer real, evidence-backed findings to clever-but-vague ones.

Score the page 0–100 where 100 is excellent. Penalise: critical -10, major -5, minor -2. Floor at 15.

Grade ladder: 93+ A, 87+ A−, 80+ B+, 73+ B, 67+ B−, 60+ C+, 53+ C, 47+ C−, 40+ D, else F.

Tier label by score:
- 87+: "Pricing clinic"
- 73+: "Solid, with hairline cracks"
- 60+: "Functional, but leaving money on the table"
- 47+: "A polite disaster"
- else: "Pricing page disaster"

Summary: a single paragraph ≤320 chars, in the same dry voice. State the headline diagnosis. Quote a real noun from the page if you can.`;

export type AnalysisInput = {
  rules: string;
  crawl: CrawlResult;
  context?: string;
  screenshotUrl: string | null;
};

export async function analyzePricingPage({
  rules,
  crawl,
  context,
  screenshotUrl,
}: AnalysisInput): Promise<Analysis> {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    throw new Error('GOOGLE_GENERATIVE_AI_API_KEY is not set');
  }

  const userContent: Array<
    | { type: 'text'; text: string }
    | { type: 'image'; image: URL | string }
  > = [
    {
      type: 'text',
      text: `# Roast Rules\n\n${rules}`,
    },
  ];

  if (screenshotUrl) {
    userContent.push({ type: 'image', image: new URL(screenshotUrl) });
  }

  userContent.push({
    type: 'text',
    text:
      `# Page under review\n\n` +
      `URL: ${crawl.finalUrl}\n\n` +
      formatPageDigest(crawl) +
      (context ? `\n\n# Founder context\n\n${context.trim()}\n` : '') +
      `\n\nProduce the structured output now.`,
  });

  const t0 = Date.now();
  logger.debug(
    `llm → ${MODEL} (rules ${rules.length}c, page ${crawl.text.length}c, screenshot=${screenshotUrl ? 'yes' : 'no'}, ctx=${context ? 'yes' : 'no'})`
  );

  let result;
  try {
    result = await generateObject({
      model: google(MODEL),
      schema: AnalysisSchema,
      schemaName: 'PricingPageRoast',
      schemaDescription:
        'A scored, tiered roast of a SaaS pricing page with 8–14 findings.',
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userContent }],
      temperature: 0.7,
      maxRetries: 1,
    });
  } catch (err) {
    logger.error(`llm error: ${err instanceof Error ? err.message : err}`);
    throw err;
  }

  const { object, usage, finishReason } = result;
  logger.info(
    `llm ok in ${Date.now() - t0}ms — finish=${finishReason}, in=${usage.inputTokens ?? '?'} out=${usage.outputTokens ?? '?'}, score=${object.score} ${object.grade}, roasts=${object.roasts.length}`
  );

  return object;
}

function formatPageDigest(c: CrawlResult): string {
  const parts: string[] = [];
  if (c.title) parts.push(`Title: ${c.title}`);
  if (c.description) parts.push(`Meta description: ${c.description}`);
  if (c.headings.length) parts.push(`Headings:\n- ${c.headings.join('\n- ')}`);
  if (c.ctas.length)
    parts.push(`Buttons / CTA labels:\n- ${c.ctas.slice(0, 30).join('\n- ')}`);
  if (c.pricesFound.length)
    parts.push(`Prices detected on page:\n- ${c.pricesFound.join('\n- ')}`);
  if (c.faqQuestions.length)
    parts.push(`FAQ questions:\n- ${c.faqQuestions.join('\n- ')}`);
  if (c.text) parts.push(`Visible text (truncated):\n"""\n${c.text}\n"""`);
  return parts.join('\n\n');
}
