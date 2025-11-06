import type { MetadataRoute } from "next"

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://tucarrera.cl"

  // Rutas estáticas principales
  const routes = [
    "",
    "/demo",
    "/biblioteca",
    "/dashboard",
    "/ai-coach",
    "/careers",
    "/track-application",
    "/learning-paths",
    "/cerebro",
    "/test",
    "/test/disc",
    "/test/mbti",
    "/test/big-five",
    "/test/riasec",
    "/test/soft-skills",
    "/test/emotional-intelligence",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.8,
  }))

  // Tests - prioridad alta
  const tests = [
    "/test/disc",
    "/test/mbti",
    "/test/big-five",
    "/test/riasec",
    "/test/soft-skills",
    "/test/emotional-intelligence",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }))

  // Blog/Contenido educativo
  const educationalContent = [
    "/blog/que-es-disc",
    "/blog/como-interpretar-mbti",
    "/blog/big-five-personalidad",
    "/blog/desarrollo-inteligencia-emocional",
    "/blog/liderazgo-efectivo",
    "/blog/productividad-profesional",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  return [...routes, ...tests, ...educationalContent]
}
