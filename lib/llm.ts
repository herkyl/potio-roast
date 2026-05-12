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

Surface every rule that genuinely applies to the page, ordered by severity (critical first). There is no upper limit. But never invent, pad, or fire a rule that doesn't actually match what's on the page — quality over quantity, always. If a category looks fine, say nothing about it. A short, sharp report is better than a thorough but soft one.

Severity discipline:
- critical = actively losing the buyer or leaving meaningful ARR on the table.
- major = measurably hurts conversion or unit economics.
- minor = paper cuts, polish, quality issues.
Reserve critical for real fires. The default impulse will be to inflate severity; resist it.

Do not compute a score. Do not grade the page. Do not write a tier label. Those are derived from your findings downstream.

Summary: a single paragraph ≤320 chars, in the same dry voice. Describe what you found — the headline patterns, not a verdict. Quote a real noun from the page (a tier name, a CTA label, a price) if you can. Don't pre-judge the score; don't say "this page is bad" or "this page is fine." Let the findings speak.

DIAGNOSTIC FIELD \`imageProbe\` — this is for engineering, not the end user. Be honest, do not make anything up.
- If a screenshot image was provided AND you can actually analyse its pixels, write one short factual phrase describing what you can see at the top of the screenshot (dominant colours, layout, a tier name visible in the hero). 80 chars max.
- If you received only a URL reference but no rendered pixels you can actually analyse, write exactly: "url_only_no_image"
- If no image or image reference was provided, write exactly: "no_input_image"
This field will be logged server-side to verify whether the image pipeline is working. It is not shown to the user.`;

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
        'A roast of a SaaS pricing page: summary + every applicable finding.',
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
    `llm ok in ${Date.now() - t0}ms — finish=${finishReason}, in=${usage.inputTokens ?? '?'} out=${usage.outputTokens ?? '?'}, roasts=${object.roasts.length}`
  );
  logger.info(
    `llm imageProbe = ${object.imageProbe ? `"${object.imageProbe}"` : '<empty>'} (screenshot_url=${screenshotUrl ? 'attached' : 'none'})`
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
