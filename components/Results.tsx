'use client';

import { useMemo, useState } from 'react';
import type { Result } from '@/lib/schemas';
import { Verdict } from './Verdict';
import { RoastCard } from './RoastCard';
import { PreviewPane } from './PreviewPane';
import { CtaBlock } from './CtaBlock';

type Props = {
  result: Result;
  onHome: () => void;
};

const SEVERITY_ORDER = { critical: 0, major: 1, minor: 2 } as const;

export function Results({ result, onHome }: Props) {
  const ordered = useMemo(
    () =>
      [...result.roasts].sort(
        (a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
      ),
    [result.roasts]
  );

  const [shareLabel, setShareLabel] = useState<'⌘ share' | '✓ copied'>('⌘ share');
  const onShare = async () => {
    if (typeof window === 'undefined') return;
    const shareUrl = result.slug
      ? `${window.location.origin}/r/${result.slug}`
      : window.location.href;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareLabel('✓ copied');
      setTimeout(() => setShareLabel('⌘ share'), 1800);
    } catch {
      // Some browsers (or insecure contexts) reject writeText. Fallback: prompt.
      window.prompt('Copy this link:', shareUrl);
    }
  };

  return (
    <div style={{ maxWidth: 1480, margin: '0 auto', padding: '40px 28px 80px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 28,
        }}
      >
        <div>
          <div className="t-up t-mute" style={{ fontSize: 11, marginBottom: 8 }}>
            <span style={{ color: 'var(--ok)' }}>✓</span> &nbsp;run complete ·{' '}
            <span style={{ color: 'var(--fg-dim)' }}>{result.duration}</span>
          </div>
          <div style={{ fontSize: 14, color: 'var(--fg-dim)' }}>
            <span style={{ color: 'var(--accent)' }}>$</span> roast {result.url}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-sm" type="button" onClick={onHome}>
            ↺ new run
          </button>
          <button className="btn btn-sm" type="button" disabled title="Coming soon">
            ⇣ pdf
          </button>
          <button
            className="btn btn-sm"
            type="button"
            onClick={onShare}
            title="Copy share link"
          >
            {shareLabel}
          </button>
        </div>
      </div>

      <Verdict result={result} />

      <div className="results-split" style={{ marginTop: 28 }}>
        <div className="rail">
          <div className="rail-head">
            <div
              className="t-up"
              style={{
                fontSize: 11,
                color: 'var(--fg-mute)',
                letterSpacing: '0.12em',
              }}
            >
              Findings &nbsp;
              <span style={{ color: 'var(--fg-dim)' }}>· {ordered.length}</span>
            </div>
            <div className="rail-counts">
              <Pip color="critical" n={result.counts.critical} label="critical" />
              <Pip color="major" n={result.counts.major} label="major" />
              <Pip color="minor" n={result.counts.minor} label="minor" />
            </div>
          </div>
          {ordered.map((r, i) => (
            <RoastCard key={r.id} roast={r} index={i + 1} />
          ))}

          <CtaBlock />
        </div>

        <div>
          <PreviewPane
            url={result.url}
            screenshot={result.screenshot}
            pageHeightPx={result.pageHeightPx}
            scanned={result.scanned}
          />
        </div>
      </div>
    </div>
  );
}

function Pip({ color, n, label }: { color: string; n: number; label: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        fontSize: 11,
        color: 'var(--fg-mute)',
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          background: `var(--${color})`,
          display: 'inline-block',
        }}
      />
      {n} {label}
    </span>
  );
}
