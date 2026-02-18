import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

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

    const supabase = await createClient()

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
      console.error("[v0] NEWSAPI_KEY not configured - cannot fetch news")
      return NextResponse.json(
        { error: "NewsAPI key not configured" },
        { status: 500 }
      )
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
      console.error(`[v0] NewsAPI error: ${response.status} ${response.statusText}`)
      return NextResponse.json(
        { error: `NewsAPI returned ${response.status}` },
        { status: response.status }
      )
    }

    const newsData = await response.json()

    if (!newsData.articles || newsData.articles.length === 0) {
      console.log("[v0] No articles found from NewsAPI")
      return NextResponse.json({
        success: true,
        source: "newsapi",
        data: [],
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
