import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
  // Fix: Move allowedDevOrigins to top-level and use correct type
  // @ts-ignore - allowedDevOrigins is a valid but sometimes untyped property in dev
  allowedDevOrigins: ['localhost:3000', '192.168.1.35:3000', '192.168.1.35'],
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
};

export default nextConfig;
