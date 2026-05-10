'use client';

import { Brandmark } from './Brandmark';

type Props = {
  children: React.ReactNode;
  screen: string;
  onHome: () => void;
};

export function Shell({ children, screen, onHome }: Props) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 22px',
          borderBottom: '1px solid var(--line)',
          position: 'sticky',
          top: 0,
          background: 'var(--bg)',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onHome}
            style={{ padding: 0, border: 0, background: 'none' }}
          >
            <Brandmark size={15} />
          </button>
          <span className="t-mute" style={{ fontSize: 11 }}>
            v0.4
          </span>
        </div>
      </header>

      <main style={{ flex: 1 }}>{children}</main>

      <footer
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '14px 22px',
          borderTop: '1px solid var(--line)',
          fontSize: 11,
          color: 'var(--fg-mute)',
          flexWrap: 'wrap',
          gap: 8,
        }}
      >
        <div>© Potio · Pricing Clinic · made for SaaS founders who can take it</div>
      </footer>
    </div>
  );
}
