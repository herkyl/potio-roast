import { z } from 'zod';

export const SeveritySchema = z.enum(['critical', 'major', 'minor']);
export type Severity = z.infer<typeof SeveritySchema>;

export const RoastSchema = z.object({
  id: z.string(),
  severity: SeveritySchema,
  category: z.string(),
  region: z.string(),
  title: z.string(),
  body: z.string(),
  why: z.string(),
});
export type Roast = z.infer<typeof RoastSchema>;

export const CountsSchema = z.object({
  critical: z.number().int().nonnegative(),
  major: z.number().int().nonnegative(),
  minor: z.number().int().nonnegative(),
});

export const ResultSchema = z.object({
  url: z.string(),
  screenshot: z.string().nullable(),
  scanned: z.string(),
  duration: z.string(),
  pageHeightPx: z.number().nullable(),
  score: z.number().min(0).max(100),
  grade: z.string(),
  tier: z.string(),
  summary: z.string(),
  roasts: z.array(RoastSchema),
  counts: CountsSchema,
});
export type Result = z.infer<typeof ResultSchema>;

export const RoastRequestSchema = z.object({
  url: z
    .string()
    .min(1, 'URL is required')
    .refine(
      (u) => {
        try {
          const parsed = new URL(u);
          return ['http:', 'https:'].includes(parsed.protocol);
        } catch {
          return false;
        }
      },
      { message: 'URL must be http or https' }
    ),
  context: z.string().max(1000).optional(),
});
export type RoastRequest = z.infer<typeof RoastRequestSchema>;

/** SSE stage event payload */
export type Stage = {
  id: string;
  label: string;
  detail?: string;
  status: 'running' | 'done' | 'error';
  ms?: number;
};

/** Claude analysis output (no metadata yet — assembled by the API route) */
export const AnalysisSchema = z.object({
  score: z.number().min(0).max(100),
  grade: z.string(),
  tier: z.string(),
  summary: z.string(),
  roasts: z.array(
    z.object({
      severity: SeveritySchema,
      category: z.string(),
      region: z.string(),
      title: z.string(),
      body: z.string(),
      why: z.string(),
    })
  ),
});
export type Analysis = z.infer<typeof AnalysisSchema>;
