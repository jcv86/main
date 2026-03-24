import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

interface DiscProfile {
  D?: number
  I?: number
  S?: number
  C?: number
  [key: string]: number | undefined
}

interface DiscAssessmentData {
  userId: string
  disc_profile: DiscProfile
}

// Helper function to safely extract DISC scores
function extractDiscScores(profile: DiscProfile): {
  d: number
  i: number
  s: number
  c: number
} {
  return {
    d: profile.D ?? 0,
    i: profile.I ?? 0,
    s: profile.S ?? 0,
    c: profile.C ?? 0,
  }
}

// Helper function to calculate dominant and secondary patterns
function calculatePatterns(
  profile: DiscProfile
): {
  dominant: string
  secondary: string
} {
  const entries: Array<[string, number]> = []

  if (profile.D !== undefined) entries.push(["D", profile.D])
  if (profile.I !== undefined) entries.push(["I", profile.I])
  if (profile.S !== undefined) entries.push(["S", profile.S])
  if (profile.C !== undefined) entries.push(["C", profile.C])

  entries.sort((a, b) => b[1] - a[1])

  return {
    dominant: entries[0]?.[0] ?? "D",
    secondary: entries[1]?.[0] ?? "I",
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const body = (await request.json()) as unknown

    // Type validation
    if (
      !body ||
      typeof body !== "object" ||
      !("userId" in body) ||
      !("disc_profile" in body)
    ) {
      return NextResponse.json(
        { error: "Missing required fields: userId and disc_profile" },
        { status: 400 }
      )
    }

    const { userId, disc_profile } = body as DiscAssessmentData

    if (typeof userId !== "string") {
      return NextResponse.json(
        { error: "userId must be a string" },
        { status: 400 }
      )
    }

    if (
      !disc_profile ||
      typeof disc_profile !== "object" ||
      Array.isArray(disc_profile)
    ) {
      return NextResponse.json(
        { error: "disc_profile must be an object" },
        { status: 400 }
      )
    }

    // Extract and validate DISC scores
    const scores = extractDiscScores(disc_profile as DiscProfile)
    const patterns = calculatePatterns(disc_profile as DiscProfile)

    // Save to database
    const { data, error } = await supabase
      .from("a1_disc_assessment")
      .upsert(
        {
          user_id: userId,
          disc_d: scores.d,
          disc_i: scores.i,
          disc_s: scores.s,
          disc_c: scores.c,
          dominant_pattern: patterns.dominant,
          secondary_pattern: patterns.secondary,
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
        dominant_pattern: patterns.dominant,
        secondary_pattern: patterns.secondary,
        scores: {
          D: scores.d,
          I: scores.i,
          S: scores.s,
          C: scores.c,
        },
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
