import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [320, 420, 640, 768, 1024, 1280, 1536],
  },
  
  // Security headers
  headers: async () => {
    return [
      {
        source: "/(.*)",
        headers: [
          // Content Security Policy
          {
            key: "Content-Security-Policy",
            value:
              "default-src 'self' https:; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net https://*.vercel.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' https: data: blob:; connect-src 'self' https: wss:; frame-ancestors 'none'; base-uri 'self'; form-action 'self'",
          },
          // Security headers
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(self), payment=()",
          },
          // HSTS
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          // Performance
          {
            key: "Cache-Control",
            value: "public, max-age=3600, must-revalidate",
          },
        ],
      },
    ]
  },

  // Redirects for domain consolidation
  redirects: async () => {
    return [
        {
          source: "/:path*",
          has: [
            {
              type: "host",
              value: "despegatucarrera.cl",
            },
          ],
          destination: "https://www.despegatucarrera.com/:path*",
          permanent: true,
        },
      {
        source: "/:path*",
        has: [
          {
            type: "host",
            value: "tucarrera.cl",
          },
        ],
        destination: "https://www.despegatucarrera.com/:path*",
        permanent: true,
      },
    ]
  },

  // Rewrites for API routes
  rewrites: async () => {
    return {
      beforeFiles: [
        // API rewrites
        {
          source: "/api/:path*",
          destination: "/api/:path*",
        },
      ],
    }
  },
}

export default nextConfig
