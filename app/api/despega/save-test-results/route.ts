import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      dominantProfile,
      secondaryProfile,
      scores,
      caminoPersona,
      caminoProfesional,
    } = body

    const supabase = createClient()

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Save to unified_test_results
    const { data: testData, error: testError } = await supabase
      .from("unified_test_results")
      .insert({
        user_email: user.email,
        test_type: "personality_assessment",
        test_results: {
          d_score: Math.round(scores.D),
          i_score: Math.round(scores.I),
          s_score: Math.round(scores.S),
          c_score: Math.round(scores.C),
          dominant_profile: dominantProfile,
          secondary_profile: secondaryProfile,
          camino_persona: caminoPersona,
          camino_profesional: caminoProfesional,
        },
      })
      .select()

    if (testError) {
      console.error("[v0] Error saving test results:", testError)
      return NextResponse.json(
        { error: "Failed to save test results" },
        { status: 500 }
      )
    }

    console.log("[v0] Test results saved successfully")

    return NextResponse.json({
      success: true,
      data: testData,
    })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
