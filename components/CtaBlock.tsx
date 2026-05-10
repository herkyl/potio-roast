export function CtaBlock() {
  return (
    <div className="cta-block">
      <div
        className="t-up"
        style={{
          fontSize: 10,
          color: 'var(--accent)',
          letterSpacing: '0.14em',
          marginBottom: 10,
        }}
      >
        Next steps
      </div>
      <div
        className="serif"
        style={{
          fontFamily: 'var(--serif)',
          fontSize: 28,
          lineHeight: 1.15,
          marginBottom: 8,
          fontWeight: 400,
        }}
      >
        I'll look over your pricing for free.
      </div>
      <p
        style={{
          fontSize: 13,
          color: 'var(--fg-dim)',
          lineHeight: 1.55,
          margin: '0 0 18px',
        }}
      >
        Hi, I'm Serge! I'm a 3x founder and former CEO of Toggl. I work hands-on with SaaS & AI teams to fix pricing, packaging and monetization.
        Clients average a 75x ROI on my work. Increasing ARR by 50% to 100% is common.
      </p>
      <div
        style={{
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap',
          alignItems: 'center',
          marginBottom: 16,
        }}
      >
        <a
          className="btn btn-primary"
          href="https://potio.cc"
          target="_blank"
          rel="noopener noreferrer"
        >
          Book a 30-min clinic →
        </a>
        <button className="btn btn-sm" type="button" disabled title="Coming soon">
          Email me the report
        </button>
      </div>
      <div
        style={{
          display: 'flex',
          gap: 8,
          alignItems: 'center',
          borderTop: '1px solid var(--line)',
          paddingTop: 14,
        }}
      >
        <input
          type="email"
          placeholder="you@company.com"
          disabled
          style={{
            flex: 1,
            background: 'transparent',
            border: '1px solid var(--line)',
            color: 'var(--fg)',
            fontFamily: 'var(--mono)',
            fontSize: 13,
            padding: '8px 10px',
            borderRadius: 4,
            outline: 'none',
            opacity: 0.6,
          }}
        />
        <button className="btn btn-sm" type="button" disabled>
          save & share
        </button>
      </div>
      <div style={{ fontSize: 11, color: 'var(--fg-mute)', marginTop: 10 }}>
        Email capture is coming. For now: copy the URL and revisit.
      </div>
    </div>
  );
}
