'use client';

import { useEffect, useRef, useState } from 'react';

type Props = {
  onSubmit: (data: { url: string; context: string }) => void;
  initialUrl?: string;
};

const SAMPLES = ['toggl.com/track/pricing', 'linear.app/pricing', 'notion.so/pricing'];

export function Landing({ onSubmit, initialUrl = '' }: Props) {
  const [url, setUrl] = useState(initialUrl);
  const [context, setContext] = useState('');
  const [showContext, setShowContext] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = (e?: React.FormEvent) => {
    e?.preventDefault();
    const u = url.trim();
    if (!u) return;
    const normalized = /^https?:\/\//i.test(u) ? u : `https://${u}`;
    onSubmit({ url: normalized, context: context.trim() });
  };

  return (
    <div style={{ maxWidth: 920, margin: '0 auto', padding: '64px 28px 80px' }}>
      <div style={{ marginBottom: 36 }}>
        <h1
          className="serif"
          style={{
            fontFamily: 'var(--serif)',
            fontSize: 'clamp(44px, 6vw, 76px)',
            lineHeight: 1.02,
            margin: 0,
            letterSpacing: '-0.02em',
            fontWeight: 400,
            textWrap: 'balance',
          }}
        >
          Your pricing,&nbsp;
          <span style={{ fontStyle: 'italic', color: 'var(--fg-dim)' }}>
            roasted.
          </span>
        </h1>
        <p
          style={{
            marginTop: 24,
            marginBottom: 0,
            fontSize: 15,
            color: 'var(--fg-dim)',
            maxWidth: 560,
            lineHeight: 1.6,
          }}
        >
          Paste your pricing page URL. We fetch it, screenshot it, and run it past everything AI & SaaS pricing gets wrong. You get the findings. Free, no signup.
        </p>
      </div>

      <form onSubmit={submit} className="term" style={{ marginBottom: 28 }}>
        <div className="term-body" style={{ padding: '28px 28px 22px' }}>
          <label style={{ display: 'block' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                borderBottom: '1px solid var(--line-strong)',
                paddingBottom: 12,
              }}
            >
              <span
                style={{
                  color: 'var(--accent)',
                  fontWeight: 600,
                  fontSize: 18,
                }}
              >
                ›
              </span>
              <input
                ref={inputRef}
                type="text"
                inputMode="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://your-saas.com/pricing"
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 0,
                  outline: 'none',
                  color: 'var(--fg)',
                  fontFamily: 'var(--mono)',
                  fontSize: 18,
                  padding: '4px 0',
                }}
              />
              {url.length === 0 && <span className="caret" />}
            </div>
          </label>

          <div style={{ marginTop: 18 }}>
            {!showContext ? (
              <button
                type="button"
                onClick={() => setShowContext(true)}
                className="btn btn-ghost"
                style={{ padding: 0, fontSize: 12, color: 'var(--fg-mute)' }}
              >
                <span style={{ color: 'var(--accent)' }}>+</span>&nbsp; add context
                (optional)&nbsp;
                <span style={{ color: 'var(--fg-mute)', opacity: 0.6 }}>
                  — ACV, ICP, what's bugging you
                </span>
              </button>
            ) : (
              <div className="fade-up">
                <div
                  style={{
                    fontSize: 11,
                    color: 'var(--fg-mute)',
                    marginBottom: 8,
                  }}
                >
                  <span style={{ color: 'var(--accent)' }}>›</span>&nbsp; --context
                  (optional)
                </div>
                <textarea
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  rows={3}
                  maxLength={1000}
                  placeholder="e.g. ACV is $30k, we sell to RevOps at mid-market, churn is fine but expansion is flat…"
                  style={{
                    width: '100%',
                    background: 'transparent',
                    border: '1px solid var(--line)',
                    color: 'var(--fg-dim)',
                    fontFamily: 'var(--mono)',
                    fontSize: 13,
                    padding: '10px 12px',
                    borderRadius: 4,
                    resize: 'vertical',
                    outline: 'none',
                  }}
                />
              </div>
            )}
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 22,
              gap: 16,
              flexWrap: 'wrap',
            }}
          >
            <div
              style={{
                fontSize: 11,
                color: 'var(--fg-mute)',
                display: 'flex',
                gap: 14,
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              <span>~30s · no signup</span>
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={url.trim().length === 0}
            >
              Have a look, then. <span aria-hidden>→</span>
            </button>
          </div>
        </div>
      </form>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'auto 1fr',
          gap: 24,
          alignItems: 'center',
          borderTop: '1px solid var(--line)',
          paddingTop: 22,
        }}
      >
        <div
          style={{
            fontSize: 11,
            color: 'var(--fg-mute)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}
        >
          What we look for
        </div>
        <div
          style={{
            fontSize: 12,
            color: 'var(--fg-dim)',
            maxWidth: 560,
            lineHeight: 1.6,
          }}
        >
          Overly stuffed enterprise tiers · missing anchors · feature-matrix sprawl · weak proof · fuzzy value props · CTA confusion · and the small stuff that quietly costs you ARR.
        </div>
      </div>

      <div style={{ marginTop: 36, fontSize: 12, color: 'var(--fg-mute)' }}>
        try a sample:&nbsp;
        {SAMPLES.map((s, i) => (
          <span key={s}>
            {i > 0 && ' · '}
            <button
              type="button"
              onClick={() => setUrl('https://' + s)}
              className="btn btn-ghost"
              style={{
                padding: '2px 6px',
                fontSize: 12,
                color: 'var(--fg-dim)',
                borderBottom: '1px dashed var(--line-strong)',
                borderRadius: 0,
              }}
            >
              {s}
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}
