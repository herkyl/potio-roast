/**
 * Thin wrapper around Google Analytics gtag. Safe to call before the script
 * loads (no-ops). Add new events here so call sites stay short and typed.
 */

type GtagFn = (
  command: 'event' | 'config' | 'js' | 'set',
  ...args: unknown[]
) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: unknown[];
  }
}

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

function safeGtag(...args: Parameters<GtagFn>): void {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag !== 'function') return;
  window.gtag(...args);
}

/** Generic event dispatch. */
export function trackEvent(
  name: string,
  params?: Record<string, unknown>
): void {
  safeGtag('event', name, params ?? {});
}

/**
 * Manual page_view — used after window.history.replaceState changes the
 * URL without a Next.js navigation (GA wouldn't otherwise notice).
 */
export function trackPageView(path: string, title?: string): void {
  if (!GA_ID) return;
  safeGtag('config', GA_ID, {
    page_path: path,
    page_title: title,
  });
}

// ---------------------------------------------------------------------------
// App-specific events. Add new ones here to keep usage typed across files.
// ---------------------------------------------------------------------------

export function trackRoastSubmit(params: {
  url: string;
  hasContext: boolean;
}): void {
  trackEvent('roast_submit', {
    target_url: params.url,
    target_hostname: hostname(params.url),
    has_context: params.hasContext,
  });
}

export function trackRoastComplete(params: {
  url: string;
  slug?: string;
  score: number;
  grade: string;
  findings: number;
  durationMs: number;
}): void {
  trackEvent('roast_complete', {
    target_url: params.url,
    target_hostname: hostname(params.url),
    slug: params.slug,
    score: params.score,
    grade: params.grade,
    findings: params.findings,
    duration_ms: params.durationMs,
  });
}

export function trackRoastError(params: {
  url?: string;
  message: string;
  isRateLimit: boolean;
}): void {
  trackEvent('roast_error', {
    target_url: params.url,
    target_hostname: params.url ? hostname(params.url) : undefined,
    is_rate_limit: params.isRateLimit,
    message: params.message,
  });
}

/** Hostname extraction helper so the dashboards group by site cleanly. */
function hostname(u: string): string | undefined {
  try {
    return new URL(u).hostname.replace(/^www\./, '').toLowerCase();
  } catch {
    return undefined;
  }
}
