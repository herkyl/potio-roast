import { NextRequest } from 'next/server';
import { lookup } from 'node:dns/promises';
import { RoastRequestSchema, type Stage, type Result } from '@/lib/schemas';
import { loadRules } from '@/lib/rules';
import { crawlPricingPage } from '@/lib/crawl';
import { captureScreenshot } from '@/lib/screenshot';
import { analyzePricingPage } from '@/lib/llm';
import {
  checkRateLimit,
  describeRateLimit,
  releaseConcurrent,
} from '@/lib/ratelimit';
import { logger } from '@/lib/logger';
import { saveResult, slugFromUrl } from '@/lib/persist';

export const runtime = 'nodejs';
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parsed = RoastRequestSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid request' },
      { status: 400 }
    );
  }

  const ip = clientIp(req);
  const verdict = await checkRateLimit(ip);
  if (!verdict.ok) {
    logger.warn(`rate-limited ${ip} — ${verdict.reason}`);
    return Response.json(
      { error: describeRateLimit(verdict), retryAfterSec: verdict.retryAfterSec },
      { status: 429, headers: { 'Retry-After': String(verdict.retryAfterSec ?? 60) } }
    );
  }

  const { url, context } = parsed.data;
  logger.info(`/api/roast ip=${ip} url=${url} ctx=${context ? 'yes' : 'no'}`);
  const stream = createSseStream(url, context);

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-store, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });

  function createSseStream(targetUrl: string, ctx: string | undefined) {
    const startedAt = Date.now();
    const encoder = new TextEncoder();

    return new ReadableStream<Uint8Array>({
      async start(controller) {
        const send = (event: string, data: unknown) => {
          controller.enqueue(
            encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
          );
        };

        const stage = (s: Stage) => send('stage', s);

        const stageTimer = (id: string, label: string, detail?: string) => {
          const t0 = Date.now();
          stage({ id, label, detail, status: 'running' });
          return (finalDetail?: string) =>
            stage({
              id,
              label,
              detail: finalDetail ?? detail,
              status: 'done',
              ms: Date.now() - t0,
            });
        };

        try {
          // 1. DNS
          const finishDns = stageTimer(
            'dns',
            'Resolving DNS',
            new URL(targetUrl).hostname
          );
          let resolvedIp = '';
          try {
            const r = await lookup(new URL(targetUrl).hostname);
            resolvedIp = r.address;
          } catch {
            /* let the crawl fail with a real error */
          }
          finishDns(
            resolvedIp
              ? `${new URL(targetUrl).hostname} → ${resolvedIp}`
              : new URL(targetUrl).hostname
          );

          // 2 + 3. Crawl + screenshot in parallel
          const finishCrawl = stageTimer(
            'crawl',
            'Crawling pricing page',
            'reading HTML…'
          );
          const finishShot = stageTimer(
            'shot',
            'Capturing screenshot',
            'viewport 1440 × 900, full page…'
          );

          const crawlPromise = crawlPricingPage(targetUrl).then(
            (c) => {
              finishCrawl(
                `fetched ${c.headings.length} headings, ${c.pricesFound.length} prices`
              );
              return c;
            },
            (err) => {
              stage({
                id: 'crawl',
                label: 'Crawling pricing page',
                detail: err instanceof Error ? err.message : 'crawl failed',
                status: 'error',
              });
              throw err;
            }
          );

          const shotPromise = captureScreenshot(targetUrl).then(
            (s) => {
              finishShot(`${s.width}×${s.height}`);
              return s;
            },
            (err) => {
              stage({
                id: 'shot',
                label: 'Capturing screenshot',
                detail: err instanceof Error ? err.message : 'screenshot failed',
                status: 'error',
              });
              return null;
            }
          );

          const [crawl, screenshot] = await Promise.all([
            crawlPromise,
            shotPromise,
          ]);

          // 4. Knowledge base
          const finishKb = stageTimer(
            'kb',
            'Loading knowledge base',
            'pricing-page rule set'
          );
          const rules = await loadRules();
          finishKb(`${countRules(rules)} rules loaded`);

          // 5 + 6. Diagnostics + sharpening — Claude call
          const finishDx = stageTimer(
            'dx',
            'Cross-referencing diagnostics',
            'matching patterns…'
          );
          const finishSharp = stageTimer(
            'sharp',
            'Sharpening the knives',
            'calibrating tone: dry british'
          );

          const analysis = await analyzePricingPage({
            rules,
            crawl,
            context: ctx,
            screenshotUrl: screenshot?.url ?? null,
          });

          finishDx('done');
          finishSharp('done');

          // 7. Compile
          const finishCompile = stageTimer(
            'compile',
            'Compiling roasts',
            `${analysis.roasts.length} findings`
          );

          const counts = {
            critical: analysis.roasts.filter((r) => r.severity === 'critical')
              .length,
            major: analysis.roasts.filter((r) => r.severity === 'major').length,
            minor: analysis.roasts.filter((r) => r.severity === 'minor').length,
          };

          const slug = slugFromUrl(targetUrl);

          const result: Result = {
            url: targetUrl,
            slug,
            screenshot: screenshot?.url ?? null,
            scanned: new Date().toISOString().slice(0, 10),
            duration: fmtDuration(Date.now() - startedAt),
            pageHeightPx: screenshot?.height ?? null,
            score: analysis.score,
            grade: analysis.grade,
            tier: analysis.tier,
            summary: analysis.summary,
            roasts: analysis.roasts.map((r, i) => ({
              ...r,
              id: `r${String(i + 1).padStart(2, '0')}`,
            })),
            counts,
          };

          finishCompile(
            `${counts.critical} critical · ${counts.major} major · ${counts.minor} minor`
          );

          // Best-effort save — never fail the request if persistence breaks.
          try {
            await saveResult(slug, result);
          } catch (err) {
            logger.error(
              `persist save failed (non-fatal): ${err instanceof Error ? err.message : err}`
            );
          }

          logger.info(
            `roast complete in ${result.duration} — score ${result.score} ${result.grade}, ${result.roasts.length} findings → /r/${slug}`
          );
          send('result', result);
        } catch (err) {
          const message =
            err instanceof Error ? err.message : 'Something went wrong';
          logger.error(`roast pipeline error: ${message}`, err);
          send('error', { message });
        } finally {
          await releaseConcurrent(ip);
          controller.close();
        }
      },
      cancel() {
        void releaseConcurrent(ip);
      },
    });
  }
}

function clientIp(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for');
  if (fwd) return fwd.split(',')[0].trim();
  return req.headers.get('x-real-ip') || '0.0.0.0';
}

function fmtDuration(ms: number): string {
  const total = Math.round(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `00:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

function countRules(md: string): number {
  return (md.match(/^### /gm) || []).length;
}
