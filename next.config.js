/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.allscreenshots.com' },
      { protocol: 'https', hostname: 'cdn.allscreenshots.com' },
    ],
  },
};

module.exports = nextConfig;
