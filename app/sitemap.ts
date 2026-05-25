import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.despegatucarrera.com"

  // Rutas estáticas principales (solo rutas públicas)
  const routes = [
    "",
    "/biblioteca",
    "/privacidad",
    "/terminos",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: route === "" ? 1 : 0.6,
  }))

  return [...routes]
}
