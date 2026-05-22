import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://tucarrera.cl"

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/private/", "/_next/", "/test/*/results/"],
      },
      {
        userAgent: "GPTBot",
        allow: ["/", "/blog/", "/biblioteca/", "/test/"],
        disallow: ["/api/", "/admin/", "/private/"],
      },
      {
        userAgent: "ChatGPT-User",
        allow: ["/", "/blog/", "/biblioteca/"],
      },
      {
        userAgent: "anthropic-ai",
        allow: ["/", "/blog/", "/biblioteca/"],
      },
      {
        userAgent: "Claude-Web",
        allow: ["/", "/blog/", "/biblioteca/"],
      },
      {
        userAgent: "PerplexityBot",
        allow: ["/", "/blog/", "/biblioteca/", "/test/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
