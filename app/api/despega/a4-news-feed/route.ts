import { NextRequest, NextResponse } from "next/server"

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

    // Si no hay API key, retornar error
    if (!NEWSAPI_KEY) {
      console.error("[v0] NEWSAPI_KEY not configured")
      return NextResponse.json(
        { error: "NewsAPI key not configured" },
        { status: 500 }
      )
    }

    // Seleccionar query aleatoria para variedad
    const query = SEARCH_QUERIES[Math.floor(Math.random() * SEARCH_QUERIES.length)]

    console.log(`[v0] Fetching news for query: ${query}`)

    // Llamar a NewsAPI
    const newsResponse = await fetch(
      `${NEWSAPI_ENDPOINT}?q=${encodeURIComponent(query)}&language=es&sortBy=publishedAt&pageSize=${limit}`,
      {
        headers: {
          "X-API-Key": NEWSAPI_KEY,
        },
      }
    )

    if (!newsResponse.ok) {
      console.error(`[v0] NewsAPI returned ${newsResponse.status}`)
      return NextResponse.json(
        { error: `NewsAPI error: ${newsResponse.status}` },
        { status: newsResponse.status }
      )
    }

    const newsData = await newsResponse.json()

    if (!newsData.articles || newsData.articles.length === 0) {
      console.log("[v0] No articles found from NewsAPI")
      return NextResponse.json({
        success: true,
        source: "newsapi",
        data: [],
      })
    }

    // Transformar artículos de NewsAPI
    const formattedArticles = newsData.articles.map((article: any) => ({
      id: article.url,
      title: article.title,
      description: article.description,
      image_url: article.urlToImage,
      content: article.content,
      url: article.url,
      source: article.source?.name || "NewsAPI",
      author: article.author,
      published_at: article.publishedAt,
      category,
      relevance_score: 75,
    }))

    console.log(`[v0] Loaded ${formattedArticles.length} articles from NewsAPI`)

    return NextResponse.json({
      success: true,
      source: "newsapi",
      data: formattedArticles,
    })
  } catch (error) {
    console.error("[v0] Error in news feed endpoint:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
