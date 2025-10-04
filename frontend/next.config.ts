import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  distDir: 'out',
  images: {
    unoptimized: true
  },
  basePath: process.env.NODE_ENV === 'production' ? '/EcoLedger' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/EcoLedger/' : '',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
