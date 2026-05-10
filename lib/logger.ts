import { colorConsole } from 'tracer';

/**
 * App-wide logger. Uses tracer's colorConsole — gives us timestamps, log
 * levels, file:line, and stack traces on errors. Outputs to stdout/stderr,
 * which Vercel captures into deploy logs.
 *
 * Levels: log < trace < debug < info < warn < error < fatal.
 * In production we drop everything below `info`.
 */
export const logger = colorConsole({
  format: '{{timestamp}} <{{title}}> [{{file}}:{{line}}] {{message}}',
  dateformat: 'HH:MM:ss.l',
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
});

/** Convenience: timer that logs the elapsed ms when stopped. */
export function startTimer(label: string) {
  const t0 = Date.now();
  logger.debug(`▶ ${label}`);
  return (extra?: string | Record<string, unknown>) => {
    const ms = Date.now() - t0;
    if (typeof extra === 'string') {
      logger.info(`◀ ${label} (${ms}ms) — ${extra}`);
    } else if (extra) {
      logger.info(`◀ ${label} (${ms}ms)`, extra);
    } else {
      logger.info(`◀ ${label} (${ms}ms)`);
    }
    return ms;
  };
}
