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
      console.error("[v0] Auth error:", authError)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    console.log("[v0] User ID:", user.id, "Email:", user.email)

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

    console.log("[v0] Test results saved successfully:", testData)

    // Get or create a1_progress record
    const { data: progressData, error: fetchError } = await supabase
      .from("a1_progress")
      .select("*")
      .eq("user_id", user.id)
      .single()

    console.log("[v0] Fetched progress data:", progressData, "Error:", fetchError)

    // If no progress record exists, create one. Otherwise, increment tests_completed
    const testsCompleted = (progressData?.tests_completed || 0) + 1

    const { data: updatedProgress, error: updateError } = await supabase
      .from("a1_progress")
      .upsert({
        user_id: user.id,
        tests_completed: testsCompleted,
        cerebral_completed: true,
        last_updated: new Date().toISOString(),
      }, {
        onConflict: "user_id"
      })
      .select()

    if (updateError) {
      console.error("[v0] Error updating progress:", updateError)
    } else {
      console.log("[v0] Progress updated successfully:", updatedProgress)
    }

    // Verify the update was applied
    const { data: verifyProgress } = await supabase
      .from("a1_progress")
      .select("*")
      .eq("user_id", user.id)
      .single()

    console.log("[v0] Verified progress after update:", verifyProgress)

    return NextResponse.json({
      success: true,
      data: testData,
      progress: updatedProgress,
    })
  } catch (error) {
    console.error("[v0] API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
