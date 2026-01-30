/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable React strict mode for better development experience
    reactStrictMode: true,

    // Image optimization configuration
    images: {
        domains: [
            'localhost',
            // Add your image hosting domains here
            'images.unsplash.com',
            'avatars.githubusercontent.com',
        ],
        formats: ['image/avif', 'image/webp'],
    },

    // Enable experimental features if needed
    experimental: {
        // serverActions: true,
    },

    // Environment variables exposed to the browser
    env: {
        NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    },

    // Custom webpack configuration (if needed)
    webpack: (config, { isServer }) => {
        // Add custom webpack config here if needed
        return config;
    },

    // Headers for security
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on',
                    },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'origin-when-cross-origin',
                    },
                ],
            },
        ];
    },

    // Redirects (if needed)
    async redirects() {
        return [
            // Add redirects here
            // {
            //   source: '/old-path',
            //   destination: '/new-path',
            //   permanent: true,
            // },
        ];
    },
};

module.exports = nextConfig;
