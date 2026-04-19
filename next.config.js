const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Suppress Edge Runtime warnings for dependencies
  logging: {
    fetches: {
      unmatchedRoute: false,
    },
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
