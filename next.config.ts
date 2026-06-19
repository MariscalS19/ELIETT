import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    // allow serving images with quality 100 and 75
    qualities: [100, 75],
  },
};

export default nextConfig;
