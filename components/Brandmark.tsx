export function Brandmark({ size = 14 }: { size?: number }) {
  return (
    <span
      style={{
        fontFamily: 'var(--mono)',
        fontSize: size,
        fontWeight: 600,
        letterSpacing: '-0.02em',
      }}
    >
      <span style={{ color: 'var(--accent)' }}>[</span>
      <span>roast</span>
      <span style={{ color: 'var(--accent)' }}>]</span>
    </span>
  );
}
