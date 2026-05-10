import { Redis } from '@upstash/redis';
import type { Result } from './schemas';
import { logger } from './logger';

const KEY_PREFIX = 'roast:r:';
const TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

const redis: Redis | null =
  url && token ? new Redis({ url, token }) : null;

export function persistConfigured(): boolean {
  return redis !== null;
}

/**
 * Derive a stable, shareable slug from a URL.
 * `https://www.toggl.com/track/pricing/` → `toggl.com/track/pricing`
 */
export function slugFromUrl(rawUrl: string): string {
  const u = new URL(rawUrl);
  const host = u.hostname.replace(/^www\./, '').toLowerCase();
  let path = u.pathname.toLowerCase();
  if (path.endsWith('/') && path.length > 1) path = path.slice(0, -1);
  // Collapse double slashes, strip leading slash so the slug joins cleanly.
  path = path.replace(/\/+/g, '/').replace(/^\//, '');
  return path ? `${host}/${path}` : host;
}

export async function saveResult(slug: string, result: Result): Promise<void> {
  if (!redis) {
    logger.warn('persist: redis not configured, skipping save');
    return;
  }
  await redis.set(KEY_PREFIX + slug, result, { ex: TTL_SECONDS });
  logger.info(`persist: saved roast:r:${slug} (ttl ${TTL_SECONDS}s)`);
}

export async function loadResult(slug: string): Promise<Result | null> {
  if (!redis) return null;
  const v = await redis.get<Result>(KEY_PREFIX + slug);
  if (!v) {
    logger.debug(`persist: miss roast:r:${slug}`);
    return null;
  }
  logger.debug(`persist: hit roast:r:${slug}`);
  return v;
}
