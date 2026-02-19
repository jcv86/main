/** @type {import('next').NextConfig} */
// Force clean rebuild - cache invalidation timestamp: 2026-02-20T00:00:00Z
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
  swcMinify: true,
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      '@radix-ui/react-icons',
      'class-variance-authority',
    ],
  },
  webpack: (config, { isServer }) => {
    // Ensure @swc/helpers is properly resolved
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        '@swc/helpers': false,
      }
    }
    return config
  },
}

export default nextConfig
