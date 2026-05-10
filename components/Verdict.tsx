import type { Result } from '@/lib/schemas';

type Props = {
  result: Result;
};

export function Verdict({ result }: Props) {
  const { score, grade, tier, summary, counts } = result;
  return (
    <div className="term" style={{ overflow: 'hidden' }}>
      <div className="verdict-grid">
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 14 }}>
          <div
            className="serif"
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 144,
              lineHeight: 0.85,
              fontWeight: 400,
              color: gradeColor(grade),
              letterSpacing: '-0.04em',
            }}
          >
            {grade}
          </div>
          <div>
            <div
              style={{
                fontSize: 11,
                color: 'var(--fg-mute)',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              score
            </div>
            <div
              className="serif"
              style={{
                fontFamily: 'var(--serif)',
                fontSize: 32,
                lineHeight: 1,
                fontWeight: 400,
              }}
            >
              {score}
              <span style={{ color: 'var(--fg-mute)', fontSize: 16 }}>/100</span>
            </div>
          </div>
        </div>

        <div style={{ minWidth: 0 }}>
          <div
            className="t-up"
            style={{
              fontSize: 11,
              color: 'var(--accent)',
              letterSpacing: '0.12em',
              marginBottom: 8,
            }}
          >
            Tier diagnosis
          </div>
          <div
            className="serif"
            style={{
              fontFamily: 'var(--serif)',
              fontSize: 28,
              lineHeight: 1.15,
              marginBottom: 12,
              fontWeight: 400,
              letterSpacing: '-0.01em',
            }}
          >
            “{tier}.”
          </div>
          <p
            style={{
              margin: 0,
              color: 'var(--fg-dim)',
              fontSize: 14,
              lineHeight: 1.55,
              maxWidth: 620,
            }}
          >
            {summary}
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            minWidth: 180,
          }}
        >
          <SeverityBar
            label="Critical"
            count={counts.critical}
            max={5}
            color="var(--critical)"
          />
          <SeverityBar
            label="Major"
            count={counts.major}
            max={8}
            color="var(--major)"
          />
          <SeverityBar
            label="Minor"
            count={counts.minor}
            max={10}
            color="var(--minor)"
          />
        </div>
      </div>
    </div>
  );
}

function SeverityBar({
  label,
  count,
  max,
  color,
}: {
  label: string;
  count: number;
  max: number;
  color: string;
}) {
  const pct = Math.min(100, (count / max) * 100);
  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: 11,
          color: 'var(--fg-mute)',
          marginBottom: 4,
        }}
      >
        <span style={{ color }}>{label}</span>
        <span>{count}</span>
      </div>
      <div style={{ height: 4, background: 'var(--line)' }}>
        <div
          style={{
            width: `${pct}%`,
            height: '100%',
            background: color,
            transition: 'width 0.3s ease',
          }}
        />
      </div>
    </div>
  );
}

function gradeColor(g: string): string {
  if (g.startsWith('A') || g.startsWith('B')) return 'var(--ok)';
  if (g.startsWith('C')) return 'var(--warn)';
  return 'var(--accent)';
}
