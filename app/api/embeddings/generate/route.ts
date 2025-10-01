import { type NextRequest, NextResponse } from "next/server"
import { generateAllEmbeddings, getEmbeddingStatistics } from "@/lib/embeddings"

// POST - Generate embeddings for all items or specific batch
export async function POST(request: NextRequest) {
  try {
    const { batchSize = 10 } = await request.json()

    console.log(`Starting embedding generation with batch size: ${batchSize}`)

    const result = await generateAllEmbeddings(batchSize)

    return NextResponse.json({
      success: true,
      message: `Processed ${result.totalProcessed} items: ${result.successful} successful, ${result.failed} failed`,
      data: result,
    })
  } catch (error) {
    console.error("Error generating embeddings:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

// GET - Get embedding generation statistics
export async function GET() {
  try {
    const stats = await getEmbeddingStatistics()

    return NextResponse.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error("Error getting embedding statistics:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
