import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.despegatucarrera.com"

  const routes = [
    "",
    "/faq",
    "/privacy",
    "/terms",
    "/contact",
    "/como-funciona",
    "/para-empresas",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    changeFrequency: "monthly" as const,
    priority:
      route === ""
        ? 1
        : route === "/contact" || route === "/como-funciona" || route === "/para-empresas" || route === "/faq"
          ? 0.8
          : 0.6,
  }))

  return routes
}
