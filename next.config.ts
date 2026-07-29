import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
    serverExternalPackages: ['argon2-wasm'],
    trailingSlash: true,
    images: {
        qualities: [100, 75],
    },
};

export default nextConfig;
