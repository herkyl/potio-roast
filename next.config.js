/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.allscreenshots.com' },
      { protocol: 'https', hostname: 'cdn.allscreenshots.com' },
    ],
  },
  // Reverse proxy for PostHog — routes /ingest requests to PostHog servers
  // so ad blockers don't strip tracking. Mirrors the setup on potio.cc.
  async rewrites() {
    return [
      { source: '/ingest/static/:path*', destination: 'https://eu-assets.i.posthog.com/static/:path*' },
      { source: '/ingest/:path*', destination: 'https://eu.i.posthog.com/:path*' },
    ];
  },
  skipTrailingSlashRedirect: true,
};

module.exports = nextConfig;
