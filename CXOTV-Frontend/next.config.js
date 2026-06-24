/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'standalone',
    optimizeFonts: false,

    images: {
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '1337',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'apicxotv.techplusmedia.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'cdn.uatcxotv.techplusmedia.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'cdn.cxotv.techplusmedia.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'uatapicxotv.techplusmedia.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'uatcxotv.techplusmedia.com',
                pathname: '/**',
            },
        ],
        formats: ['image/avif', 'image/webp'],
        minimumCacheTTL: 3600,
    },

    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN',
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block',
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()',
                    },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload',
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            "default-src 'self'",

                            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://www.google.com https://www.gstatic.com https://www.youtube.com",

                            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",

                            "img-src 'self' data: blob: http: https: https://cdn.cxotv.techplusmedia.com https://cdn.uatcxotv.techplusmedia.com https://apicxotv.techplusmedia.com https://uatapicxotv.techplusmedia.com https://uatcxotv.techplusmedia.com https://*.googleusercontent.com https://i.ytimg.com",

                            "font-src 'self' https://fonts.gstatic.com data:",

                            "connect-src 'self' http://localhost:1337 http://127.0.0.1:1337 ws://localhost:1337 ws://127.0.0.1:1337 https://apicxotv.techplusmedia.com https://uatapicxotv.techplusmedia.com https://uatcxotv.techplusmedia.com https://cdn.cxotv.techplusmedia.com https://cdn.uatcxotv.techplusmedia.com https://www.googleapis.com https://apis.google.com",

                            "frame-src 'self' https://www.youtube.com https://youtube.com https://www.google.com",

                            "media-src 'self' blob: http: https: https://cdn.cxotv.techplusmedia.com https://cdn.uatcxotv.techplusmedia.com",

                            "worker-src 'self' blob:",

                            "object-src 'none'",

                            "base-uri 'self'",
                        ].join('; '),
                    }
                ],
            },
        ];
    },
};

module.exports = nextConfig;