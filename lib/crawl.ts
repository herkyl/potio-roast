import * as cheerio from 'cheerio';
import { isPrivateHostname } from './ssrf';
import { logger } from './logger';

const MAX_TEXT_CHARS = 14_000;
const FETCH_TIMEOUT_MS = 15_000;
const USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 ' +
  '(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36 RoastBot/0.1';

export type CrawlResult = {
  url: string;
  finalUrl: string;
  title: string;
  description: string;
  headings: string[];
  ctas: string[];
  pricesFound: string[];
  text: string;
  faqQuestions: string[];
};

export async function crawlPricingPage(targetUrl: string): Promise<CrawlResult> {
  const t0 = Date.now();
  const parsed = new URL(targetUrl);
  if (await isPrivateHostname(parsed.hostname)) {
    logger.warn(`crawl blocked by SSRF guard: ${parsed.hostname}`);
    throw new Error('Refusing to fetch private/internal addresses.');
  }

  logger.debug(`crawl → GET ${targetUrl}`);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(targetUrl, {
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: controller.signal,
      redirect: 'follow',
    });
  } catch (err) {
    clearTimeout(timeout);
    const msg = err instanceof Error ? err.message : 'fetch failed';
    logger.error(`crawl fetch error: ${msg}`);
    throw new Error(`Could not fetch the page: ${msg}`);
  }
  clearTimeout(timeout);

  if (!res.ok) {
    logger.error(`crawl HTTP ${res.status} ${targetUrl}`);
    throw new Error(`Page returned HTTP ${res.status}`);
  }

  const html = await res.text();
  logger.debug(`crawl got HTML: ${html.length} chars in ${Date.now() - t0}ms`);
  const $ = cheerio.load(html);

  $('script, style, noscript, svg, iframe, link, meta').remove();

  const title = ($('title').first().text() || '').trim();
  const description =
    $('meta[name="description"]').attr('content')?.trim() ||
    $('meta[property="og:description"]').attr('content')?.trim() ||
    '';

  const headings: string[] = [];
  $('h1, h2, h3').each((_, el) => {
    const t = $(el).text().replace(/\s+/g, ' ').trim();
    if (t) headings.push(t);
  });

  const ctas: string[] = [];
  $('a, button, [role="button"]').each((_, el) => {
    const t = $(el).text().replace(/\s+/g, ' ').trim();
    if (t && t.length <= 40) ctas.push(t);
  });

  const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
  const text = bodyText.slice(0, MAX_TEXT_CHARS);

  const priceRegex = /[$€£¥]\s?\d[\d.,]*\s?(?:\/\s?(?:mo|mes|month|user|seat|year|yr|annum))?/gi;
  const pricesFound = Array.from(new Set(bodyText.match(priceRegex) ?? [])).slice(0, 40);

  const faqQuestions: string[] = [];
  $('details summary, [class*="faq" i] h2, [class*="faq" i] h3, [class*="faq" i] button').each(
    (_, el) => {
      const t = $(el).text().replace(/\s+/g, ' ').trim();
      if (t && t.length <= 200 && t.endsWith('?')) faqQuestions.push(t);
    }
  );

  const result = {
    url: targetUrl,
    finalUrl: res.url,
    title,
    description,
    headings: dedupeShort(headings, 60),
    ctas: dedupeShort(ctas, 50),
    pricesFound,
    text,
    faqQuestions: dedupeShort(faqQuestions, 30),
  };

  logger.info(
    `crawl ok: "${title.slice(0, 60)}" — ${result.headings.length} headings, ${result.ctas.length} ctas, ${result.pricesFound.length} prices, ${result.faqQuestions.length} faq`
  );

  return result;
}

function dedupeShort(arr: string[], max: number): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const s of arr) {
    const key = s.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(s);
    if (out.length >= max) break;
  }
  return out;
}
