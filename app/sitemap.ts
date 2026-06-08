import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.despegatucarrera.com"

  // Rutas estáticas principales (solo rutas públicas)
  const routes = [
    "",
    "/biblioteca",
    "/faq",
    "/privacidad",
    "/terminos",
    "/contact",
    "/como-funciona",
    "/para-empresas",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority:
      route === ""
        ? 1
        : route === "/contact" || route === "/como-funciona" || route === "/para-empresas" || route === "/faq"
          ? 0.8
          : 0.6,
  }))

  return [...routes]
}
