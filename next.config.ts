import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  async redirects() {
    // The affiliate dashboard now lives as a tab inside the user dashboard.
    // Redirect the old standalone routes so existing links keep working.
    return [
      {
        source: '/affiliate-dashboard',
        destination: '/user-dashboard/affiliate',
        permanent: false,
      },
      {
        source: '/affiliate-dashboard/:path*',
        destination: '/user-dashboard/affiliate/:path*',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
