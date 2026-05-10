'use client';

import { useEffect, useState } from 'react';

const FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

type Props = {
  color?: string;
  intervalMs?: number;
};

export function BrailleSpinner({ color, intervalMs = 80 }: Props) {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % FRAMES.length), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return (
    <span
      aria-hidden
      style={{
        color,
        fontFamily: 'var(--mono)',
        display: 'inline-block',
        // Fixed width keeps the frame from causing tiny layout jitter.
        width: '1ch',
      }}
    >
      {FRAMES[i]}
    </span>
  );
}
