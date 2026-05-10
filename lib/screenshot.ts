import { logger } from './logger';

const ENDPOINT = 'https://api.allscreenshots.com/v1/screenshots';
const CLIENT_TIMEOUT_MS = 35_000;

export type ScreenshotResult = {
  url: string;
  width: number;
  height: number;
  renderTimeMs?: number;
};

export async function captureScreenshot(targetUrl: string): Promise<ScreenshotResult> {
  const apiKey = process.env.ALLSCREENSHOTS_API_KEY;
  if (!apiKey) {
    throw new Error('ALLSCREENSHOTS_API_KEY is not set');
  }

  const t0 = Date.now();
  logger.debug(`screenshot → POST ${ENDPOINT}`, { url: targetUrl });

  const controller = new AbortController();
  const timeout = setTimeout(() => {
    logger.warn(
      `screenshot client timeout after ${CLIENT_TIMEOUT_MS}ms — aborting`
    );
    controller.abort();
  }, CLIENT_TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(ENDPOINT, {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: targetUrl,
        fullPage: true,
        blockAds: true,
        blockCookieBanners: true,
        viewport: { width: 1440, height: 900 },
        format: 'png',
        responseType: 'url',
        // 'load' is far more reliable than 'networkidle' for pages with
        // always-on trackers (Intercom, Segment, etc.) that never settle.
        waitUntil: 'load',
        delay: 1500,
        timeout: 25_000,
      }),
      signal: controller.signal,
    });
  } catch (err) {
    clearTimeout(timeout);
    const aborted = err instanceof Error && err.name === 'AbortError';
    const msg = aborted
      ? `screenshot client aborted after ${CLIENT_TIMEOUT_MS}ms`
      : err instanceof Error
        ? err.message
        : 'screenshot fetch failed';
    logger.error(`screenshot failed: ${msg}`);
    throw new Error(msg);
  }
  clearTimeout(timeout);

  if (!res.ok) {
    const text = await res.text().catch(() => '');
    logger.error(`screenshot HTTP ${res.status}: ${text.slice(0, 300)}`);
    throw new Error(`Screenshot failed: ${res.status} ${text.slice(0, 200)}`);
  }

  const data = (await res.json()) as Record<string, unknown>;

  logger.debug('screenshot response keys:', Object.keys(data));
  logger.debug('screenshot response payload:', JSON.stringify(data).slice(0, 600));

  const screenshotUrl = pickScreenshotUrl(data, targetUrl);
  if (!screenshotUrl) {
    logger.error(
      `screenshot response had no usable URL field. Keys: ${Object.keys(data).join(', ')}`
    );
    throw new Error('Screenshot API returned no usable URL field');
  }

  const width = num(data.width) ?? num((data.viewport as Record<string, unknown> | undefined)?.width) ?? 1440;
  const height = num(data.height) ?? num((data.viewport as Record<string, unknown> | undefined)?.height) ?? 0;
  const renderTimeMs = num(data.renderTimeMs);

  logger.info(
    `screenshot ok: ${width}×${height} in ${Date.now() - t0}ms` +
      (renderTimeMs ? ` (render ${renderTimeMs}ms)` : '') +
      ` → ${screenshotUrl.slice(0, 80)}…`
  );

  return { url: screenshotUrl, width, height, renderTimeMs };
}

/**
 * Find the screenshot URL in the response. We can't trust the `url` field
 * alone — some providers echo the input URL back there. Try common field
 * names and reject anything that matches the requested page URL.
 */
function pickScreenshotUrl(
  data: Record<string, unknown>,
  inputUrl: string
): string | null {
  const candidates: string[] = [];
  const keys = [
    'screenshotUrl',
    'screenshot_url',
    'imageUrl',
    'image_url',
    'cdnUrl',
    'cdn_url',
    'storageUrl',
    'storage_url',
    'result',
    'output',
    'data',
    'url',
  ];
  for (const k of keys) {
    const v = data[k];
    if (typeof v === 'string') candidates.push(v);
    else if (v && typeof v === 'object') {
      const nested = (v as Record<string, unknown>).url;
      if (typeof nested === 'string') candidates.push(nested);
    }
  }

  const inputNormalized = stripTrailingSlash(inputUrl);
  for (const c of candidates) {
    if (!/^https?:\/\//i.test(c)) continue;
    if (stripTrailingSlash(c) === inputNormalized) continue;
    return c;
  }
  return null;
}

function stripTrailingSlash(s: string): string {
  return s.endsWith('/') ? s.slice(0, -1) : s;
}

function num(v: unknown): number | undefined {
  return typeof v === 'number' && Number.isFinite(v) ? v : undefined;
}
