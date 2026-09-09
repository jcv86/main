import { NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { createClient } from "@/lib/supabase/server"

const PROFILE_FIELDS =
  "user_id,camino_persona_active,camino_profesional_active,camino_foco,onboarding_completed,a1_test_completed,a1_test_completed_at,current_ciclo,ciclo_start_date,created_at,updated_at"

const profileUpdateSchema = z.object({
  camino_persona_active: z.boolean().optional(),
  camino_profesional_active: z.boolean().optional(),
  camino_foco: z.enum(["persona", "profesional", "ambos"]).optional(),
  current_ciclo: z.union([z.literal(30), z.literal(60), z.literal(90)]).optional(),
}).strict()

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user profile from despega_user_profiles
    const { data: profile, error: profileError } = await supabase
      .from("despega_user_profiles")
      .select(PROFILE_FIELDS)
      .eq("user_id", user.id)
      .single()

    if (profileError && profileError.code !== "PGRST116") {
      console.error("[v0] Error fetching profile:", profileError)
      return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 })
    }

    // If no profile exists, return default structure
    if (!profile) {
      return NextResponse.json({
        user_id: user.id,
        email: user.email,
        camino_persona_active: false,
        camino_profesional_active: false,
        camino_foco: "ambos",
        onboarding_completed: false,
        a1_test_completed: false,
        current_ciclo: 30,
        created_at: new Date().toISOString()
      })
    }

    return NextResponse.json({
      ...profile,
      email: user.email
    })
  } catch (error) {
    console.error("[v0] profile GET error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const parsed = profileUpdateSchema.safeParse(await request.json().catch(() => null))
    if (!parsed.success || Object.keys(parsed.data).length === 0) {
      return NextResponse.json({ error: "Invalid profile update" }, { status: 400 })
    }

    // Upsert profile
    const { data, error } = await supabase
      .from("despega_user_profiles")
      .upsert({
        ...parsed.data,
        user_id: user.id,
        updated_at: new Date().toISOString()
      }, {
        onConflict: "user_id"
      })
      .select(PROFILE_FIELDS)
      .single()

    if (error) {
      console.error("[v0] Error updating profile:", error)
      return NextResponse.json({ error: "Failed to update profile" }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("[v0] profile POST error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
