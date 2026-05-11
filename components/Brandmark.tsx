export function Brandmark({ size = 14 }: { size?: number }) {
  // SVG is 97×38, aspect ~2.55:1. Scale height with the text so the lockup
  // stays visually balanced if the size prop changes.
  const logoHeight = Math.round(size * 1.5);

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        fontFamily: 'var(--mono)',
        fontSize: size,
        fontWeight: 600,
        letterSpacing: '-0.02em',
      }}
    >
      {/* Two logos, swapped via CSS based on data-theme. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-light.svg"
        alt="Potio"
        height={logoHeight}
        width={Math.round(logoHeight * (97 / 38))}
        className="brand-logo brand-logo-on-dark"
        style={{ display: 'block' }}
      />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.svg"
        alt="Potio"
        height={logoHeight}
        width={Math.round(logoHeight * (97 / 38))}
        className="brand-logo brand-logo-on-light"
        style={{ display: 'none' }}
      />
      <span>
        <span>Pricing Roaster</span>
      </span>
    </span>
  );
}
