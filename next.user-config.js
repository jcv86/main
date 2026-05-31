const path = require('path');

// redeploy: 2026-04-28
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Suppress Edge Runtime warnings for dependencies
  logging: {
    fetches: {
      unmatchedRoute: false,
    },
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
              "style-src 'self' 'unsafe-inline' https:",
              "img-src 'self' data: https:",
              "font-src 'self' data: https:",
              "connect-src 'self' https:",
              "frame-ancestors 'none'",
              "base-uri 'self'",
              "form-action 'self'",
            ].join("; "),
          },
        ],
      },
    ];
  },
  webpack: (config, { dev, isServer }) => {
    // Ignore Edge Runtime warnings from @supabase/realtime-js
    config.ignoreWarnings = [
      { module: /@supabase\/realtime-js/ },
      (warning) => warning.message?.includes('process.versions'),
    ];
    // Configure webpack cache with absolute path
    if (!dev && !isServer) {
      config.cache = {
        type: 'filesystem',
        cacheDirectory: path.join(process.cwd(), '.next/cache/webpack'),
        buildDependencies: {
          config: [__filename],
        },
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
      };
    } else {
      // Development: Use in-memory cache
      config.cache = {
        type: 'memory',
      };
    }

    return config;
  },
  // Ensure proper build output
  outputFileTracingIncludes: {},
  experimental: {
    esmExternals: true,
  },
};

module.exports = nextConfig;
