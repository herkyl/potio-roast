const BOOK_URL =
  'https://www.potio.cc/work-with-me?utm_source=roast&utm_medium=results-cta';

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
        Hi, I'm Serge! I'm a 3x founder and former CEO of Toggl. I work hands-on
        with SaaS & AI teams to fix pricing, packaging and monetization. Clients
        average a 75x ROI on my work. Increasing ARR by 50% to 100% is common.
      </p>
      <div
        style={{
          display: 'flex',
          gap: 10,
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <a
          className="btn btn-primary"
          href={BOOK_URL}
          target="_blank"
          rel="noopener noreferrer"
        >
          Book a free 1-on-1 call →
        </a>
      </div>
    </div>
  );
}
