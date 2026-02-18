import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export const runtime = "nodejs"

const NEWSAPI_KEY = process.env.NEWSAPI_KEY
const NEWSAPI_ENDPOINT = "https://newsapi.org/v2/everything"

// Categorías de búsqueda relacionadas con carrera y negocios
const SEARCH_QUERIES = [
  "liderazgo profesional",
  "emprendimiento",
  "transformación digital",
  "carrera profesional",
  "mercado laboral",
  "innovación",
  "negocios",
  "startups",
]

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get("category") || "business"
    const limit = parseInt(searchParams.get("limit") || "10")

    const supabase = createClient()

    // Verificar si hay cache válido (menos de 4 horas)
    const { data: cachedNews } = await supabase
      .from("despega_news_cache")
      .select("*")
      .eq("category", category)
      .gte("cached_at", new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString())
      .order("published_at", { ascending: false })
      .limit(limit)

    if (cachedNews && cachedNews.length > 0) {
      console.log(`[v0] Using cached news for category: ${category}`)
      return NextResponse.json({
        success: true,
        source: "cache",
        data: cachedNews,
      })
    }

    // Si no hay cache, obtener de NewsAPI
    if (!NEWSAPI_KEY) {
      console.warn("[v0] NEWSAPI_KEY not configured, returning mock news")
      // Fallback a noticias mock
      const mockNews = getMockNews(category, limit)
      return NextResponse.json({
        success: true,
        source: "mock",
        data: mockNews,
      })
    }

    console.log(`[v0] Fetching fresh news from NewsAPI for category: ${category}`)

    const query = SEARCH_QUERIES[Math.floor(Math.random() * SEARCH_QUERIES.length)]
    const newsApiUrl = new URL(NEWSAPI_ENDPOINT)
    newsApiUrl.searchParams.append("q", query)
    newsApiUrl.searchParams.append("sortBy", "publishedAt")
    newsApiUrl.searchParams.append("language", "es")
    newsApiUrl.searchParams.append("pageSize", String(limit * 2))
    newsApiUrl.searchParams.append("apiKey", NEWSAPI_KEY)

    const response = await fetch(newsApiUrl.toString())

    if (!response.ok) {
      console.error(`[v0] NewsAPI error: ${response.status}, returning mock data`)
      const mockNews = getMockNews(category, limit)
      return NextResponse.json({
        success: true,
        source: "mock",
        data: mockNews,
      })
    }

    const newsData = await response.json()

    if (!newsData.articles || newsData.articles.length === 0) {
      console.log("[v0] No articles found from NewsAPI, returning mock data")
      // Retornar noticias mock si NewsAPI no retorna datos
      const mockNews = getMockNews(category, limit)
      return NextResponse.json({
        success: true,
        source: "mock",
        data: mockNews,
      })
    }

    // Procesar y cachear artículos
    const articlesToCache = newsData.articles.slice(0, limit).map((article: any) => ({
      title: article.title,
      description: article.description,
      content: article.content,
      url: article.url,
      image_url: article.urlToImage,
      source: article.source.name,
      author: article.author,
      published_at: article.publishedAt,
      category: category,
      relevance_score: calculateRelevance(article, category),
    }))

    // Guardar en cache
    const { error: insertError } = await supabase
      .from("despega_news_cache")
      .insert(articlesToCache)

    if (insertError) {
      console.error(`[v0] Error caching news: ${insertError.message}`)
    } else {
      console.log(`[v0] Cached ${articlesToCache.length} articles`)
    }

    return NextResponse.json({
      success: true,
      source: "newsapi",
      data: articlesToCache,
    })
  } catch (error) {
    console.error("[v0] Error in news feed endpoint:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

// Calcular score de relevancia basado en palabras clave
function calculateRelevance(article: any, category: string): number {
  const text = `${article.title} ${article.description}`.toLowerCase()
  const keywords: Record<string, string[]> = {
    business: [
      "emprendedor",
      "startup",
      "negocio",
      "empresa",
      "inversión",
      "mercado",
    ],
    technology: [
      "ia",
      "tech",
      "software",
      "digital",
      "innovación",
      "algoritmo",
    ],
    career: [
      "carrera",
      "empleo",
      "laboral",
      "profesional",
      "trabajo",
      "contratación",
    ],
    leadership: ["liderazgo", "ceo", "ejecutivo", "director", "gerente"],
  }

  const relevantKeywords = keywords[category] || keywords.business
  let score = 50

  for (const keyword of relevantKeywords) {
    if (text.includes(keyword)) score += 10
  }

  return Math.min(score, 100)
}

// Noticias mock para demostración
function getMockNews(category: string, limit: number) {
  const mockArticles = [
    {
      id: "mock-1",
      title: "Liderazgo Ágil: La Clave del Éxito en 2025",
      description: "Descubre cómo los líderes modernos están transformando sus organizaciones con metodologías ágiles y empoderación de equipos.",
      content: "En el panorama empresarial actual, el liderazgo ágil se ha convertido en un diferenciador clave...",
      url: "https://example.com/liderazgo-agil",
      image_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
      source: "Despega Insights",
      author: "Coach Sofia",
      published_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      category: "business",
      relevance_score: 85,
    },
    {
      id: "mock-2",
      title: "Transformación Digital: De la Teoría a la Práctica",
      description: "Las empresas más innovadoras ya no hablan de transformación digital, la viven. Aquí están sus estrategias probadas.",
      content: "La transformación digital no es solo sobre tecnología, es sobre cultura y mentalidad...",
      url: "https://example.com/transformacion-digital",
      image_url: "https://images.unsplash.com/photo-1460925895917-aeb19be489c7?w=500&h=300&fit=crop",
      source: "Tech & Business",
      author: "Dani Coach",
      published_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
      category: "technology",
      relevance_score: 78,
    },
    {
      id: "mock-3",
      title: "El Futuro del Trabajo: Remoto, Híbrido o Presencial",
      description: "Análisis profundo sobre cómo las empresas están redefiniendo la forma en que trabajamos.",
      content: "Después de la pandemia, el mundo del trabajo nunca será igual...",
      url: "https://example.com/futuro-trabajo",
      image_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
      source: "LinkedIn News",
      author: "Career Coach",
      published_at: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
      category: "career",
      relevance_score: 80,
    },
    {
      id: "mock-4",
      title: "Startups Exitosas: Lo que Debes Saber",
      description: "Historias de éxito de startups que revolucionaron sus industrias en menos de 5 años.",
      content: "Cada gran empresa fue una vez una startup...",
      url: "https://example.com/startups",
      image_url: "https://images.unsplash.com/photo-1552664730-d307ca884978?w=500&h=300&fit=crop",
      source: "Emprendimiento.com",
      author: "Business Analyst",
      published_at: new Date(Date.now() - 1000 * 60 * 60 * 10).toISOString(),
      category: "business",
      relevance_score: 75,
    },
    {
      id: "mock-5",
      title: "Inteligencia Artificial en la Empresa: Casos de Uso Reales",
      description: "Cómo empresas líderes están implementando IA para aumentar productividad y eficiencia.",
      content: "La inteligencia artificial ya no es del futuro, es del presente...",
      url: "https://example.com/ia-empresarial",
      image_url: "https://images.unsplash.com/photo-1677442d019cecf3d88c5656e6c34e3b7d3f4d6e?w=500&h=300&fit=crop",
      source: "Tech Innovation",
      author: "Innovation Lead",
      published_at: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
      category: "technology",
      relevance_score: 82,
    },
  ]

  return mockArticles.slice(0, limit)
}
