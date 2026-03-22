/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack: (config, { dev, isServer }) => {
    // Configure webpack cache with fallback strategy
    if (!dev && !isServer) {
      config.cache = {
        type: 'filesystem',
        cacheDirectory: '.next/cache/webpack',
        buildDependencies: {
          config: [__filename],
        },
        // Add fallback to disable caching on errors
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
