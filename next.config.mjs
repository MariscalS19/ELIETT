/** @type {import('next').NextConfig} */
const nextConfig = {
    serverExternalPackages: ['argon2-wasm'],
    trailingSlash: true,
    experimental: {
        proxyClientMaxBodySize: '25mb',
        serverActions: {
            bodySizeLimit: '25mb',
        },
    },
    images: {
        qualities: [100, 85],
    },
};

export default nextConfig;
