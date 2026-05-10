import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"


export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const testType = searchParams.get("testType")
    const score = Number.parseInt(searchParams.get("score") || "0")
    const industry = searchParams.get("industry") || "technology"
    const experienceLevel = searchParams.get("experienceLevel") || "entry"

    if (!testType || !score) {
      return NextResponse.json({ error: "Test type and score required" }, { status: 400 })
    }

    // Get benchmark data
    const { data: benchmark, error } = await supabase
      .from("test_benchmarks")
      .select("*")
      .eq("test_type", testType)
      .eq("industry", industry)
      .eq("experience_level", experienceLevel)
      .single()

    if (error || !benchmark) {
      // Return default comparison if no benchmark found
      return NextResponse.json({
        percentile: 50,
        comparison: "average",
        totalParticipants: 1000,
        message: "Tu puntuación está en el promedio",
      })
    }

    // Calculate percentile
    let percentile = 50
    let comparison = "average"

    if (score >= benchmark.score_percentile_90) {
      percentile = 90
      comparison = "excellent"
    } else if (score >= benchmark.score_percentile_75) {
      percentile = 75
      comparison = "above_average"
    } else if (score >= benchmark.score_percentile_50) {
      percentile = 50
      comparison = "average"
    } else if (score >= benchmark.score_percentile_25) {
      percentile = 25
      comparison = "below_average"
    } else {
      percentile = 10
      comparison = "needs_improvement"
    }

    const messages = {
      excellent: "¡Excelente! Estás en el top 10% de profesionales en tu área",
      above_average: "Muy bien! Tu puntuación está por encima del promedio",
      average: "Tu puntuación está en el promedio de tu industria",
      below_average: "Hay oportunidades de mejora en esta área",
      needs_improvement: "Considera enfocarte en desarrollar estas habilidades",
    }

    return NextResponse.json({
      percentile,
      comparison,
      totalParticipants: benchmark.total_participants,
      message: messages[comparison as keyof typeof messages],
      benchmarks: {
        p25: benchmark.score_percentile_25,
        p50: benchmark.score_percentile_50,
        p75: benchmark.score_percentile_75,
        p90: benchmark.score_percentile_90,
      },
    })
  } catch (error) {
    console.error("Error fetching peer comparison:", error)
    return NextResponse.json({ error: "Failed to fetch comparison data" }, { status: 500 })
  }
}
