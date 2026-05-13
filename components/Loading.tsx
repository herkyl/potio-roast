'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Stage } from '@/lib/schemas';
import { BrailleSpinner } from './BrailleSpinner';
import { CtaBlock } from './CtaBlock';

type Props = {
  url: string;
  stages: Stage[];
  startedAt: number;
  errored?: { message: string; isRateLimit?: boolean } | null;
};

const PLANNED_STAGES: { id: string; label: string; weight: number }[] = [
  { id: 'dns', label: 'Resolving DNS', weight: 0.05 },
  { id: 'crawl', label: 'Crawling pricing page', weight: 0.15 },
  { id: 'shot', label: 'Capturing screenshot', weight: 0.15 },
  { id: 'kb', label: 'Loading knowledge base', weight: 0.05 },
  { id: 'dx', label: 'Cross-referencing diagnostics', weight: 0.2 },
  { id: 'sharp', label: 'Drafting the verdict', weight: 0.2 },
  { id: 'compile', label: 'Compiling roasts', weight: 0.2 },
];

export function Loading({ url, stages, startedAt, errored }: Props) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, []);

  const elapsed = now - startedAt;

  const lastByStage = useMemo(() => {
    const map = new Map<string, Stage>();
    for (const s of stages) map.set(s.id, s);
    return map;
  }, [stages]);

  const orderedStages = PLANNED_STAGES.map((p) => {
    const live = lastByStage.get(p.id);
    return live ?? null;
  });

  const pctDone = useMemo(() => {
    let total = 0;
    for (const p of PLANNED_STAGES) {
      const live = lastByStage.get(p.id);
      if (live?.status === 'done') total += p.weight;
      else if (live?.status === 'running') total += p.weight * 0.4;
    }
    return Math.min(99, Math.round(total * 100));
  }, [lastByStage]);

  return (
    <div style={{ maxWidth: 920, margin: '0 auto', padding: '64px 28px 80px' }}>
      <h1
        className="serif"
        style={{
          fontFamily: 'var(--serif)',
          fontSize: 'clamp(36px, 4.8vw, 56px)',
          margin: '0 0 12px',
          letterSpacing: '-0.02em',
          fontWeight: 400,
          lineHeight: 1.05,
        }}
      >
        Roasting{' '}
        <span style={{ fontStyle: 'italic', color: 'var(--accent)' }}>
          {shortUrl(url)}
        </span>
      </h1>
      <p style={{ fontSize: 14, color: 'var(--fg-dim)', marginBottom: 28 }}>
        Takes about a minute. Don't refresh.
      </p>

      {/* Prominent progress bar (moved above the stages list) */}
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: 11,
            color: 'var(--fg-mute)',
            marginBottom: 8,
            letterSpacing: '0.04em',
          }}
        >
          <span>{pctDone}% complete</span>
          <span>elapsed {fmtDur(elapsed)}</span>
        </div>
        <div
          style={{
            height: 6,
            background: 'var(--line)',
            borderRadius: 3,
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: `${pctDone}%`,
              background: 'var(--accent)',
              transition: 'width 0.4s ease',
            }}
          />
        </div>
      </div>

      <div className="term">
        <div
          className="term-body"
          style={{ minHeight: 360, position: 'relative', overflow: 'hidden' }}
        >
          <div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              overflow: 'hidden',
              opacity: 0.6,
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                right: 0,
                height: 80,
                background:
                  'linear-gradient(180deg, transparent, rgba(255,107,61,0.05) 50%, transparent)',
                animation: 'scanline 3.2s linear infinite',
              }}
            />
          </div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            {orderedStages.map((s, i) => (
              <LogLine key={PLANNED_STAGES[i].id} planned={PLANNED_STAGES[i]} stage={s} />
            ))}

            {errored && (
              <div
                className="fade-up"
                style={{
                  marginTop: 18,
                  padding: '12px 14px',
                  border: '1px solid var(--accent)',
                  background: 'var(--accent-soft)',
                  fontSize: 13,
                }}
              >
                <div
                  className="t-up"
                  style={{
                    fontSize: 10,
                    color: 'var(--accent)',
                    letterSpacing: '0.12em',
                    marginBottom: 4,
                  }}
                >
                  {errored.isRateLimit ? 'rate limit' : 'error'}
                </div>
                {errored.message}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* On rate-limit specifically, surface the CTA below the terminal.
          The user is engaged but blocked from running another roast —
          a natural moment to offer the alternative path. */}
      {errored?.isRateLimit && (
        <div className="fade-up" style={{ marginTop: 32 }}>
          <CtaBlock />
        </div>
      )}
    </div>
  );
}

function LogLine({
  planned,
  stage,
}: {
  planned: { id: string; label: string };
  stage: Stage | null;
}) {
  const status = stage?.status ?? 'pending';
  const isDone = status === 'done';
  const isRunning = status === 'running';
  const isErr = status === 'error';
  const isPending = status === 'pending';
  const label = stage?.label ?? planned.label;

  return (
    <div
      className={isPending ? '' : 'fade-up'}
      style={{
        display: 'grid',
        gridTemplateColumns: '20px 1fr auto',
        gap: 12,
        padding: '8px 0',
        borderBottom: '1px solid var(--line)',
        fontSize: 13,
        alignItems: 'baseline',
        opacity: isPending ? 0.35 : 1,
      }}
    >
      <span
        style={{
          color: isErr
            ? 'var(--danger)'
            : isDone
            ? 'var(--ok)'
            : 'var(--accent)',
          fontFamily: 'var(--mono)',
        }}
      >
        {isErr ? (
          '✗'
        ) : isDone ? (
          '✓'
        ) : isRunning ? (
          <BrailleSpinner color="var(--accent)" />
        ) : (
          '›'
        )}
      </span>
      <div>
        <div style={{ color: 'var(--fg)', fontWeight: 500 }}>{label}</div>
        {stage?.detail && (
          <div style={{ color: 'var(--fg-mute)', fontSize: 12, marginTop: 2 }}>
            {stage.detail}
          </div>
        )}
      </div>
      <span style={{ fontSize: 11, color: 'var(--fg-mute)' }}>
        {isDone && stage?.ms != null ? `${(stage.ms / 1000).toFixed(1)}s` : isRunning ? '…' : ''}
      </span>
    </div>
  );
}

function shortUrl(u: string) {
  try {
    const x = new URL(u);
    return x.hostname.replace(/^www\./, '') + (x.pathname === '/' ? '' : x.pathname);
  } catch {
    return u;
  }
}
function fmtDur(ms: number) {
  const s = Math.max(0, Math.round(ms / 1000));
  return `${s}s`;
}
