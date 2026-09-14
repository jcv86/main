import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://www.despegatucarrera.com"

  // Pages we want answer engines (ChatGPT, Claude, Perplexity, Gemini, etc.)
  // to read and cite. /faq is high value for GEO/LLMO answers.
  const llmAllow = ["/", "/faq", "/biblioteca/", "/como-funciona", "/para-empresas"]
  const privatePaths = [
    "/api/",
    "/admin/",
    "/auth/",
    "/dashboard/",
    "/despega/",
    "/mi-coach/",
    "/perfil/",
    "/private/",
    "/settings/",
    "/test/*/results/",
  ]

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/_next/", ...privatePaths],
      },
      // OpenAI
      { userAgent: "GPTBot", allow: llmAllow, disallow: privatePaths },
      { userAgent: "ChatGPT-User", allow: llmAllow, disallow: privatePaths },
      { userAgent: "OAI-SearchBot", allow: llmAllow, disallow: privatePaths },
      // Anthropic
      { userAgent: "anthropic-ai", allow: llmAllow, disallow: privatePaths },
      { userAgent: "ClaudeBot", allow: llmAllow, disallow: privatePaths },
      { userAgent: "Claude-Web", allow: llmAllow, disallow: privatePaths },
      // Perplexity
      { userAgent: "PerplexityBot", allow: llmAllow, disallow: privatePaths },
      { userAgent: "Perplexity-User", allow: llmAllow, disallow: privatePaths },
      // Google AI (Gemini / AI Overviews) & Apple
      { userAgent: "Google-Extended", allow: llmAllow, disallow: privatePaths },
      { userAgent: "Applebot-Extended", allow: llmAllow, disallow: privatePaths },
      // Others
      { userAgent: "CCBot", allow: llmAllow, disallow: privatePaths },
      { userAgent: "Amazonbot", allow: llmAllow, disallow: privatePaths },
      { userAgent: "Bytespider", allow: llmAllow, disallow: privatePaths },
      { userAgent: "cohere-ai", allow: llmAllow, disallow: privatePaths },
      { userAgent: "Meta-ExternalAgent", allow: llmAllow, disallow: privatePaths },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
