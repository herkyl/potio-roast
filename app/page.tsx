'use client';

import { useCallback, useRef, useState } from 'react';
import { Shell } from '@/components/Shell';
import { Landing } from '@/components/Landing';
import { Loading } from '@/components/Loading';
import { Results } from '@/components/Results';
import type { Result, Stage } from '@/lib/schemas';
import {
  trackPageView,
  trackRoastComplete,
  trackRoastError,
  trackRoastSubmit,
} from '@/lib/analytics';

type Screen = 'landing' | 'loading' | 'results';

export type PipelineError = {
  message: string;
  /** HTTP 429 from the API. Triggers the "while you're here" CTA below. */
  isRateLimit?: boolean;
};

export default function Page() {
  const [screen, setScreen] = useState<Screen>('landing');
  const [submission, setSubmission] = useState<{ url: string; context: string } | null>(null);
  const [stages, setStages] = useState<Stage[]>([]);
  const [startedAt, setStartedAt] = useState<number>(0);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<PipelineError | null>(null);

  const abortRef = useRef<AbortController | null>(null);

  const handleHome = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setScreen('landing');
    setStages([]);
    setResult(null);
    setError(null);
    if (typeof window !== 'undefined' && window.location.pathname !== '/') {
      window.history.replaceState({}, '', '/');
    }
  }, []);

  const handleSubmit = useCallback(async (data: { url: string; context: string }) => {
    const submittedAt = Date.now();
    const submittedUrl = data.url;
    setSubmission(data);
    setStages([]);
    setResult(null);
    setError(null);
    setStartedAt(submittedAt);
    setScreen('loading');

    trackRoastSubmit({ url: data.url, hasContext: data.context.length > 0 });

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch('/api/roast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
        signal: controller.signal,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        const message = err.error || `HTTP ${res.status}`;
        const isRateLimit = res.status === 429;
        setError({ message, isRateLimit });
        trackRoastError({ url: submittedUrl, message, isRateLimit });
        return;
      }

      if (!res.body) {
        setError({ message: 'No response body' });
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split('\n\n');
        buffer = events.pop() ?? '';

        for (const raw of events) {
          if (!raw.trim()) continue;
          const parsed = parseSseEvent(raw);
          if (!parsed) continue;
          handleEvent(parsed.event, parsed.data);
        }
      }

      if (buffer.trim()) {
        const parsed = parseSseEvent(buffer);
        if (parsed) handleEvent(parsed.event, parsed.data);
      }
    } catch (err) {
      if ((err as { name?: string }).name === 'AbortError') return;
      setError({
        message: err instanceof Error ? err.message : 'Network error',
      });
    }

    function handleEvent(event: string, data: unknown) {
      if (event === 'stage') {
        const s = data as Stage;
        setStages((prev) => {
          const idx = prev.findIndex((p) => p.id === s.id);
          if (idx === -1) return [...prev, s];
          const next = prev.slice();
          next[idx] = s;
          return next;
        });
      } else if (event === 'result') {
        const r = data as Result;
        setResult(r);
        setScreen('results');

        trackRoastComplete({
          url: r.url,
          slug: r.slug,
          score: r.score,
          grade: r.grade,
          findings: r.roasts.length,
          durationMs: Date.now() - submittedAt,
        });

        if (r.slug && typeof window !== 'undefined') {
          const target = `/r/${r.slug}`;
          window.history.replaceState({}, '', target);
          // history.replaceState doesn't trigger Next's router, so GA never
          // sees a page_view. Fire one manually so /r/[slug] views are
          // attributed to the roast they represent.
          trackPageView(target, `Potio Pricing Roaster · ${r.slug}`);
        }
      } else if (event === 'error') {
        const message = (data as { message: string }).message;
        setError({ message });
        trackRoastError({
          url: submittedUrl,
          message,
          isRateLimit: false,
        });
      }
    }
  }, []);

  return (
    <Shell screen={screen} onHome={handleHome}>
      {screen === 'landing' && (
        <Landing onSubmit={handleSubmit} initialUrl={submission?.url ?? ''} />
      )}
      {screen === 'loading' && submission && (
        <Loading
          url={submission.url}
          stages={stages}
          startedAt={startedAt}
          errored={error}
        />
      )}
      {screen === 'results' && result && (
        <Results result={result} onHome={handleHome} />
      )}
    </Shell>
  );
}

function parseSseEvent(raw: string): { event: string; data: unknown } | null {
  let event = 'message';
  const dataLines: string[] = [];
  for (const line of raw.split('\n')) {
    if (line.startsWith('event:')) event = line.slice(6).trim();
    else if (line.startsWith('data:')) dataLines.push(line.slice(5).trim());
  }
  if (dataLines.length === 0) return null;
  try {
    return { event, data: JSON.parse(dataLines.join('\n')) };
  } catch {
    return null;
  }
}
