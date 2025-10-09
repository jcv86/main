import { type NextRequest, NextResponse } from "next/server"
import { enhancedSemanticSearch, generateEnhancedBrainResponse } from "@/lib/enhanced-semantic-search"
import { isOpenAIConfigured } from "@/lib/embeddings"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    if (!isOpenAIConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: "OpenAI API key not configured",
          message: "Semantic search requires OPENAI_API_KEY environment variable",
        },
        { status: 500 },
      )
    }

    const body = await request.json()
    const { query, limit, similarityThreshold, categoryFilter, sourceTypeFilter } = body

    if (!query || typeof query !== "string") {
      return NextResponse.json(
        {
          success: false,
          error: "Query is required and must be a string",
        },
        { status: 400 },
      )
    }

    const startTime = Date.now()

    const searchResults = await enhancedSemanticSearch({
      query,
      limit: limit || 10,
      similarityThreshold: similarityThreshold || 0.7,
      categoryFilter,
      sourceTypeFilter,
      includeFullContent: false,
      chunkSize: 2000,
    })

    const brainResponse = await generateEnhancedBrainResponse(query, searchResults)

    const searchTimeMs = Date.now() - startTime

    return NextResponse.json({
      success: true,
      query,
      ...brainResponse,
      searchTimeMs,
      resultsCount: searchResults.length,
    })
  } catch (error) {
    console.error("Error in brain semantic search:", error)
    return NextResponse.json(
      {
        success: false,
        error: "Brain search failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
