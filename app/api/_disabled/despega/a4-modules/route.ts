import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("despega_a4_modules")
      .select("*")
      .eq("es_active", true)
      .order("orden")

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
    const { module_id, reflection_responses } = body

    const { data, error } = await supabase
      .from("despega_user_a4_progress")
      .upsert({
        user_id: user.id,
        module_id,
        reflection_responses,
        completed_at: new Date().toISOString(),
        is_completed: true,
        puntos_earned: 20,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Update rankings
    await supabase
      .from("despega_rankings")
      .update({
        score_a4_context: supabase.rpc("increment_score", {
          amount: 20
        }),
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id)

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
