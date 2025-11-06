import { type NextRequest, NextResponse } from "next/server"
import { semanticSearch, isOpenAIConfigured } from "@/lib/embeddings"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  try {
    if (!isOpenAIConfigured()) {
      return NextResponse.json(
        {
          error: "OpenAI API key is not configured",
          message: "Semantic search is unavailable. Please add OPENAI_API_KEY to your environment variables.",
        },
        { status: 500 },
      )
    }

    const body = await request.json()
    const { query, similarityThreshold, sourceTypeFilter, limit } = body

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query is required and must be a string" }, { status: 400 })
    }

    const results = await semanticSearch(query, {
      similarityThreshold,
      sourceTypeFilter,
      limit,
    })

    return NextResponse.json({
      success: true,
      query,
      results,
      count: results.length,
    })
  } catch (error) {
    console.error("Error in semantic search:", error)
    return NextResponse.json(
      {
        error: "Semantic search failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
