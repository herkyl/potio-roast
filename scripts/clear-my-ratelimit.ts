/**
 * One-off: clear all rate-limit keys for a specific IP (and the global day key).
 *
 * Usage:
 *   npx tsx scripts/clear-my-ratelimit.ts            # clears ::1 (localhost)
 *   npx tsx scripts/clear-my-ratelimit.ts 81.4.2.55  # clears a specific IP
 */
import 'dotenv/config';
import { Redis } from '@upstash/redis';

const ip = process.argv[2] || '::1';

const url = process.env.UPSTASH_REDIS_REST_URL;
const token = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!url || !token) {
  console.error('UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN not set');
  process.exit(1);
}

const redis = new Redis({ url, token });

const keys = [
  `roast:ip:concurrent:${ip}`,
  `roast:ip:hour:${ip}`,
  `roast:ip:day:${ip}`,
];

(async () => {
  console.log(`Clearing rate-limit keys for ip=${ip}…`);
  const results = await Promise.all(keys.map((k) => redis.del(k)));
  keys.forEach((k, i) => {
    console.log(`  ${results[i] ? '✓' : '·'} ${k}`);
  });

  // Also offer to clear the global-day counter (affects everyone — only do
  // it if you really need to).
  if (process.argv.includes('--clear-global')) {
    const n = await redis.del('roast:global:day:global');
    console.log(`  ${n ? '✓' : '·'} roast:global:day:global (global)`);
  }
  console.log('Done.');
})();
