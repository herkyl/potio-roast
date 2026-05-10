import { lookup } from 'node:dns/promises';
import net from 'node:net';

/** Block obvious SSRF surfaces: private IP space, link-local, loopback. */
export async function isPrivateHostname(hostname: string): Promise<boolean> {
  const lower = hostname.toLowerCase();

  if (lower === 'localhost' || lower.endsWith('.localhost') || lower.endsWith('.local')) {
    return true;
  }
  if (lower === 'metadata.google.internal') return true;

  if (net.isIP(lower)) {
    return isPrivateIp(lower);
  }

  try {
    const records = await lookup(lower, { all: true });
    return records.some((r) => isPrivateIp(r.address));
  } catch {
    return true;
  }
}

function isPrivateIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const parts = ip.split('.').map(Number);
    if (parts.length !== 4 || parts.some((n) => Number.isNaN(n))) return true;
    const [a, b] = parts;
    if (a === 10) return true;
    if (a === 127) return true;
    if (a === 0) return true;
    if (a === 169 && b === 254) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
    if (a === 192 && b === 168) return true;
    if (a === 100 && b >= 64 && b <= 127) return true;
    if (a >= 224) return true;
    return false;
  }
  if (net.isIPv6(ip)) {
    const lower = ip.toLowerCase();
    if (lower === '::1' || lower === '::') return true;
    if (lower.startsWith('fc') || lower.startsWith('fd')) return true; // unique-local
    if (lower.startsWith('fe80')) return true; // link-local
    if (lower.startsWith('::ffff:')) {
      const v4 = lower.replace('::ffff:', '');
      return isPrivateIp(v4);
    }
    return false;
  }
  return true;
}
