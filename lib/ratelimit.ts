import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

type LimitVerdict = {
  ok: boolean;
  reason?: 'per-ip-hour' | 'per-ip-day' | 'global-day' | 'concurrent';
  retryAfterSec?: number;
};

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

let redis: Redis | null = null;
let perIpHour: Ratelimit | null = null;
let perIpDay: Ratelimit | null = null;
let globalDay: Ratelimit | null = null;

if (url && token) {
  redis = new Redis({ url, token });
  perIpHour = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(3, '1 h'),
    prefix: 'roast:ip:hour',
    analytics: false,
  });
  perIpDay = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, '24 h'),
    prefix: 'roast:ip:day',
    analytics: false,
  });
  globalDay = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(80, '24 h'),
    prefix: 'roast:global:day',
    analytics: false,
  });
}

export function rateLimitConfigured(): boolean {
  return redis !== null;
}

export async function checkRateLimit(ip: string): Promise<LimitVerdict> {
  // Dev never rate-limits. The Vercel deploy still enforces;
  // `npm run dev` is for iterating and shouldn't blockade you.
  if (process.env.NODE_ENV !== 'production') {
    return { ok: true };
  }

  // Production: a comma-separated list of IPs that bypass the limiter.
  // Useful for your own IP during demos, or for a load-tester.
  const bypassIps = (process.env.RATELIMIT_BYPASS_IPS || '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  if (bypassIps.includes(ip)) {
    return { ok: true };
  }

  if (!redis || !perIpHour || !perIpDay || !globalDay) {
    return { ok: true };
  }

  const concurrentKey = `roast:ip:concurrent:${ip}`;
  const acquired = await redis.set(concurrentKey, '1', { nx: true, ex: 90 });
  if (acquired !== 'OK') {
    return { ok: false, reason: 'concurrent', retryAfterSec: 30 };
  }

  try {
    const ipHour = await perIpHour.limit(ip);
    if (!ipHour.success) {
      return {
        ok: false,
        reason: 'per-ip-hour',
        retryAfterSec: secsUntil(ipHour.reset),
      };
    }

    const ipDay = await perIpDay.limit(ip);
    if (!ipDay.success) {
      return { ok: false, reason: 'per-ip-day', retryAfterSec: secsUntil(ipDay.reset) };
    }

    const global = await globalDay.limit('global');
    if (!global.success) {
      return { ok: false, reason: 'global-day', retryAfterSec: secsUntil(global.reset) };
    }
  } catch {
    await releaseConcurrent(ip);
    return { ok: true };
  }

  return { ok: true };
}

export async function releaseConcurrent(ip: string): Promise<void> {
  if (!redis) return;
  try {
    await redis.del(`roast:ip:concurrent:${ip}`);
  } catch {
    /* ignore */
  }
}

function secsUntil(epochMs: number): number {
  return Math.max(1, Math.round((epochMs - Date.now()) / 1000));
}

export function describeRateLimit(verdict: LimitVerdict): string {
  switch (verdict.reason) {
    case 'concurrent':
      return 'You already have a roast in flight. Give it a moment.';
    case 'per-ip-hour':
      return `Easy on the trigger — try again in ~${verdict.retryAfterSec}s.`;
    case 'per-ip-day':
      return 'You have used your daily roasts. Come back tomorrow.';
    case 'global-day':
      return "We've hit our daily quota. Try again tomorrow.";
    default:
      return 'Rate limit reached.';
  }
}
