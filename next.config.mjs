/** @type {import('next').NextConfig} */
// Force clean rebuild - cache invalidation timestamp: 2026-02-20T12:00:00Z
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      'class-variance-authority',
    ],
  },
  webpack: (config, { isServer, dev }) => {
    // Disable SWC helpers resolution to avoid missing module errors
    if (config.resolve?.fallback) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        '@swc/helpers': false,
        '@swc/core': false,
      }
    }
    return config
  },
}

export default nextConfig
