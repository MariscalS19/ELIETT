import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // allow serving images with quality 100 and 75
    qualities: [100, 75],
  },
};

export default nextConfig;
