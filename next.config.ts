import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Use axios pre-built browser bundle — no Node.js built-ins (http2/zlib/etc)
      config.resolve.alias = {
        ...config.resolve.alias,
        axios: require.resolve('axios/dist/browser/axios.cjs'),
      };
    }
    return config;
  },
  images: {
    remotePatterns: [
      { hostname: "i.pravatar.cc" },
      { hostname: "logo.clearbit.com" },
      { hostname: "ui-avatars.com" },
      { hostname: "www.google.com" },
      { hostname: "images.unsplash.com" },
      { hostname: "flagcdn.com" },
      { hostname: "localhost" },
      { hostname: "d2423c9j40z83w.cloudfront.net" },
      { hostname: "picsum.photos" },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/uploads/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://localhost:5000'}/uploads/:path*`,
      },
    ];
  },
};

export default nextConfig;
