import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface DiscProfile {
  [key: string]: number
}

interface DiscAssessmentData {
  userId: string
  disc_profile: DiscProfile
  timestamp?: string
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body: DiscAssessmentData = await request.json()

    const { userId, disc_profile } = body

    if (!userId || !disc_profile || typeof disc_profile !== "object") {
      return NextResponse.json(
        { error: "Missing or invalid required fields" },
        { status: 400 }
      )
    }

    // Type guard: ensure disc_profile is a valid object with string keys and number values
    const typedDiscProfile = disc_profile as Record<string, number>

    // Calculate dominant and secondary patterns from scores
    const sortedDimensions = Object.entries(typedDiscProfile)
      .sort((a, b) => (b[1] || 0) - (a[1] || 0))

    const dominant_pattern = String(sortedDimensions[0]?.[0] || "D")
    const secondary_pattern = String(sortedDimensions[1]?.[0] || "I")

    // Save to database
    const { data, error } = await supabase
      .from("a1_disc_assessment")
      .upsert(
        {
          user_id: userId,
          disc_d: typedDiscProfile.D || 0,
          disc_i: typedDiscProfile.I || 0,
          disc_s: typedDiscProfile.S || 0,
          disc_c: typedDiscProfile.C || 0,
          dominant_pattern,
          secondary_pattern,
          assessment_date: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      )
      .select()
      .single()

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      data: {
        userId,
        dominant_pattern,
        secondary_pattern,
        disc_profile: typedDiscProfile,
      },
    })
  } catch (error) {
    console.error("Error saving DISC assessment:", error)
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to save assessment",
      },
      { status: 500 }
    )
  }
}
