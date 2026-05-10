import Link from 'next/link';
import { Brandmark } from '@/components/Brandmark';

export default function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 28,
        textAlign: 'center',
      }}
    >
      <Brandmark size={18} />
      <div
        className="t-up t-mute"
        style={{ fontSize: 11, marginTop: 28, marginBottom: 10 }}
      >
        404 · roast not found
      </div>
      <h1
        className="serif"
        style={{
          fontFamily: 'var(--serif)',
          fontSize: 'clamp(36px, 4.8vw, 56px)',
          margin: '0 0 12px',
          letterSpacing: '-0.02em',
          fontWeight: 400,
          lineHeight: 1.05,
          maxWidth: 720,
        }}
      >
        That roast has either{' '}
        <span style={{ fontStyle: 'italic', color: 'var(--accent)' }}>
          expired or never existed.
        </span>
      </h1>
      <p
        style={{
          fontSize: 14,
          color: 'var(--fg-dim)',
          marginBottom: 24,
          maxWidth: 480,
        }}
      >
        Roasts live for 30 days. Run a fresh one and share the new link.
      </p>
      <Link href="/" className="btn btn-primary">
        Run a new roast →
      </Link>
    </div>
  );
}
