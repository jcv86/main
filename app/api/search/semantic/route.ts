import { type NextRequest, NextResponse } from "next/server"
import { semanticSearch } from "@/lib/embeddings"

export async function POST(request: NextRequest) {
  try {
    const { query, similarityThreshold, sourceTypeFilter, limit } = await request.json()

    if (!query) {
      return NextResponse.json(
        {
          success: false,
          error: "Query is required",
        },
        { status: 400 },
      )
    }

    const results = await semanticSearch(query, {
      similarityThreshold,
      sourceTypeFilter,
      limit,
    })

    return NextResponse.json({
      success: true,
      query,
      resultsCount: results.length,
      results,
    })
  } catch (error) {
    console.error("Error in semantic search:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("q")

    if (!query) {
      return NextResponse.json(
        {
          success: false,
          error: "Query parameter 'q' is required",
        },
        { status: 400 },
      )
    }

    const similarityThreshold = Number.parseFloat(searchParams.get("threshold") || "0.7")
    const sourceTypeFilter = searchParams.get("type") as "book" | "web_resource" | null
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    const results = await semanticSearch(query, {
      similarityThreshold,
      sourceTypeFilter: sourceTypeFilter || undefined,
      limit,
    })

    return NextResponse.json({
      success: true,
      query,
      resultsCount: results.length,
      results,
    })
  } catch (error) {
    console.error("Error in semantic search:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
