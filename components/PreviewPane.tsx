type Props = {
  url: string;
  screenshot: string | null;
  pageHeightPx: number | null;
  scanned: string;
};

export function PreviewPane({ url, screenshot, pageHeightPx, scanned }: Props) {
  return (
    <div className="term preview-term">
      <div className="preview-stage">
        <div className="preview-frame">
          {screenshot ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={screenshot} alt="Pricing page screenshot" />
          ) : (
            <div
              style={{
                padding: '60px 24px',
                textAlign: 'center',
                color: '#6F6A60',
                fontSize: 12,
                background: '#fafafa',
              }}
            >
              Screenshot unavailable.
            </div>
          )}
        </div>
      </div>
      <div className="preview-meta">
        <span>{shortUrl(url)}</span>
        <span>
          {pageHeightPx ? `1440 × ${pageHeightPx}` : '—'} · {scanned}
        </span>
      </div>
    </div>
  );
}

function shortUrl(u: string): string {
  try {
    const x = new URL(u);
    return x.hostname.replace(/^www\./, '') + x.pathname;
  } catch {
    return u;
  }
}
