import { type NextRequest, NextResponse } from "next/server"
import { generateAllEmbeddings, getEmbeddingStatistics, isOpenAIConfigured } from "@/lib/embeddings"

export const runtime = "nodejs"
export const maxDuration = 60

export async function POST(request: NextRequest) {
  try {
    if (!isOpenAIConfigured()) {
      return NextResponse.json(
        {
          error: "OpenAI API key is not configured",
          message: "Please add OPENAI_API_KEY to your environment variables",
        },
        { status: 500 },
      )
    }

    const body = await request.json()
    const batchSize = body.batchSize || 10

    const result = await generateAllEmbeddings(batchSize)

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error) {
    console.error("Error in embeddings generation:", error)
    return NextResponse.json(
      {
        error: "Failed to generate embeddings",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const stats = await getEmbeddingStatistics()

    return NextResponse.json({
      success: true,
      stats,
      configured: isOpenAIConfigured(),
    })
  } catch (error) {
    console.error("Error getting embedding statistics:", error)
    return NextResponse.json(
      {
        error: "Failed to get statistics",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
