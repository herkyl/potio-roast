'use client';

import { useState } from 'react';
import type { Roast } from '@/lib/schemas';

type Props = {
  roast: Roast;
  index: number;
};

export function RoastCard({ roast, index }: Props) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div
      onClick={() => setExpanded((e) => !e)}
      className="roast-card"
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setExpanded((x) => !x);
        }
      }}
    >
      <div className="roast-head">
        <span className="roast-num">#{String(index).padStart(2, '0')}</span>
        <span className={`tag tag-${roast.severity}`}>{roast.severity}</span>
        <span className="roast-cat">{roast.category}</span>
      </div>
      <div className="serif roast-title">{roast.title}</div>
      <div className="roast-body">{roast.body}</div>

      {expanded && (
        <div className="roast-why fade-up">
          <div
            className="t-up"
            style={{
              fontSize: 10,
              color: 'var(--accent)',
              letterSpacing: '0.12em',
              marginBottom: 6,
            }}
          >
            Why it matters
          </div>
          <div style={{ fontSize: 13, color: 'var(--fg-dim)', lineHeight: 1.6 }}>
            {roast.why}
          </div>
        </div>
      )}

      <div className="roast-foot">
        <span style={{ color: 'var(--fg-mute)', fontSize: 11 }}>
          region: <span style={{ color: 'var(--fg-dim)' }}>{roast.region}</span>
        </span>
        <span style={{ color: 'var(--accent)', fontSize: 11 }}>
          {expanded ? '− hide rationale' : '+ why it matters'}
        </span>
      </div>
    </div>
  );
}
