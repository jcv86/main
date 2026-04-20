import { type NextRequest, NextResponse } from "next/server"
import { getEnhancedTestAnalyzer } from "@/lib/enhanced-test-analyzer"

export const maxDuration = 60

/**
 * Analyze all user tests together for comprehensive insights
 */
export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 })
    }

    const enhancedTestAnalyzer = getEnhancedTestAnalyzer()

    console.log("[v0] Starting cross-test analysis for user:", userId)
    const startTime = Date.now()

    // Perform comprehensive cross-test analysis
    const analysis = await enhancedTestAnalyzer.analyzeCrossTestResults(userId)

    if (!analysis) {
      return NextResponse.json(
        {
          error: "Insufficient data",
          message: "Complete al menos 2 tests para obtener un análisis completo",
        },
        { status: 400 },
      )
    }

    const processingTime = Date.now() - startTime
    console.log("[v0] Cross-test analysis completed in", processingTime, "ms")

    return NextResponse.json({
      analysis,
      processingTime,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in cross-test analysis:", error)
    return NextResponse.json(
      {
        error: "Analysis failed",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}

/**
 * Get latest cross-test analysis for user
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 })
    }

    const enhancedTestAnalyzer = getEnhancedTestAnalyzer()
    const analysis = await enhancedTestAnalyzer.getLatestCrossTestAnalysis(userId)

    if (!analysis) {
      return NextResponse.json(
        {
          error: "No analysis found",
          message: "No se encontró un análisis previo. Completa al menos 2 tests.",
        },
        { status: 404 },
      )
    }

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error("Error fetching cross-test analysis:", error)
    return NextResponse.json(
      {
        error: "Failed to fetch analysis",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
