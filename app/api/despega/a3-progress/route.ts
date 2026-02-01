import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("despega_user_a3_progress")
      .select("*")
      .eq("user_id", user.id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { scenario_id, decision_path, performance_score, puntos_earned } = body

    const { data, error } = await supabase
      .from("despega_user_a3_progress")
      .upsert({
        user_id: user.id,
        scenario_id,
        decision_path,
        performance_score,
        puntos_earned,
        is_completed: true,
        completed_at: new Date().toISOString(),
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Update rankings with A3 points
    await supabase
      .from("despega_rankings")
      .update({
        score_a2_rutas: supabase.rpc("increment_score", {
          user_id: user.id,
          amount: puntos_earned
        }),
        score_general: supabase.rpc("increment_score", {
          user_id: user.id,
          amount: puntos_earned
        }),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
