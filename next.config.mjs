/** @type {import('next').NextConfig} */
// Force clean rebuild - cache invalidation timestamp: 2026-02-06T16:00:00Z
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
}

export default nextConfig
