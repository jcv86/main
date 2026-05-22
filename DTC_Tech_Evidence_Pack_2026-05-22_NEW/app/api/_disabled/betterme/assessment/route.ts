import { createClient } from "@/app/utils/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { answers, level, interests } = await request.json()

    // Crear o actualizar user_learning_profile
    const { error } = await supabase
      .from("user_learning_profiles")
      .upsert(
        {
          user_id: user.id,
          current_level: level,
          learning_style: answers.learningStyle || "visual",
          learning_goals: interests.goals || [],
          preferred_categories: interests.categories || [],
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" }
      )

    if (error) throw error

    return NextResponse.json({
      success: true,
      message: "Assessment completado",
      level,
      interests,
    })
  } catch (error) {
    console.error("[v0] Assessment error:", error)
    return NextResponse.json({ error: "Error en assessment" }, { status: 500 })
  }
}

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Obtener perfil del usuario
    const { data: profile, error } = await supabase
      .from("user_learning_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (error && error.code !== "PGRST116") throw error

    return NextResponse.json({
      profile: profile || null,
      hasCompleted: !!profile,
    })
  } catch (error) {
    console.error("[v0] Get assessment error:", error)
    return NextResponse.json(
      { error: "Error fetching assessment" },
      { status: 500 }
    )
  }
}
