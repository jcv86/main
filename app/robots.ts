import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://www.despegatucarrera.com"

  // Pages we want answer engines (ChatGPT, Claude, Perplexity, Gemini, etc.)
  // to read and cite. /faq is high value for GEO/LLMO answers.
  const llmAllow = ["/", "/faq", "/biblioteca/", "/como-funciona", "/para-empresas"]
  const llmDisallow = ["/api/", "/admin/", "/private/", "/dashboard/", "/auth/"]

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/admin/", "/private/", "/_next/", "/dashboard/", "/test/*/results/"],
      },
      // OpenAI
      { userAgent: "GPTBot", allow: llmAllow, disallow: llmDisallow },
      { userAgent: "ChatGPT-User", allow: llmAllow, disallow: llmDisallow },
      { userAgent: "OAI-SearchBot", allow: llmAllow, disallow: llmDisallow },
      // Anthropic
      { userAgent: "anthropic-ai", allow: llmAllow, disallow: llmDisallow },
      { userAgent: "ClaudeBot", allow: llmAllow, disallow: llmDisallow },
      { userAgent: "Claude-Web", allow: llmAllow, disallow: llmDisallow },
      // Perplexity
      { userAgent: "PerplexityBot", allow: llmAllow, disallow: llmDisallow },
      { userAgent: "Perplexity-User", allow: llmAllow, disallow: llmDisallow },
      // Google AI (Gemini / AI Overviews) & Apple
      { userAgent: "Google-Extended", allow: llmAllow, disallow: llmDisallow },
      { userAgent: "Applebot-Extended", allow: llmAllow, disallow: llmDisallow },
      // Others
      { userAgent: "CCBot", allow: llmAllow, disallow: llmDisallow },
      { userAgent: "Amazonbot", allow: llmAllow, disallow: llmDisallow },
      { userAgent: "Bytespider", allow: llmAllow, disallow: llmDisallow },
      { userAgent: "cohere-ai", allow: llmAllow, disallow: llmDisallow },
      { userAgent: "Meta-ExternalAgent", allow: llmAllow, disallow: llmDisallow },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
