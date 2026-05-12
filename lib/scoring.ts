import type { Severity } from './schemas';

/**
 * Deterministic scoring. The model emits findings; we compute the score
 * from their severity distribution so the curve is tweakable from one
 * file and never drifts with model behaviour.
 *
 * Penalties — gentler than the original 10/5/2 because (a) the rules
 * catalogue grew, which raises the typical finding count, and (b) we want
 * a normal-ish distribution centred on C+/B− for a typical SaaS page,
 * not everything floored to F.
 *
 * Cap the total penalty at 75 so even a page with many findings still
 * lands at 25 — leaves the bottom of the grade ladder meaningful.
 */
const PENALTY = { critical: 5, major: 2, minor: 0.5 } as const;
const MAX_PENALTY = 75;
const FLOOR_SCORE = 25;

export type Counts = { critical: number; major: number; minor: number };

export function countBySeverity(
  roasts: { severity: Severity }[]
): Counts {
  return {
    critical: roasts.filter((r) => r.severity === 'critical').length,
    major: roasts.filter((r) => r.severity === 'major').length,
    minor: roasts.filter((r) => r.severity === 'minor').length,
  };
}

export function computeScore(counts: Counts): number {
  const raw =
    counts.critical * PENALTY.critical +
    counts.major * PENALTY.major +
    counts.minor * PENALTY.minor;
  const penalty = Math.min(MAX_PENALTY, raw);
  return Math.max(FLOOR_SCORE, 100 - penalty);
}

export function scoreToGrade(s: number): string {
  if (s >= 93) return 'A';
  if (s >= 87) return 'A−';
  if (s >= 80) return 'B+';
  if (s >= 73) return 'B';
  if (s >= 67) return 'B−';
  if (s >= 60) return 'C+';
  if (s >= 53) return 'C';
  if (s >= 47) return 'C−';
  if (s >= 40) return 'D';
  return 'F';
}

export function scoreToTier(s: number): string {
  if (s >= 87) return 'Pricing clinic';
  if (s >= 73) return 'Solid, with hairline cracks';
  if (s >= 60) return 'Functional, but leaving money on the table';
  if (s >= 47) return 'A polite disaster';
  return 'Pricing disaster';
}
