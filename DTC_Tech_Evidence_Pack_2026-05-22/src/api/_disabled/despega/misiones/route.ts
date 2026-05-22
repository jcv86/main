import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const ciclo = searchParams.get("ciclo") || "30"
    const ruta_id = searchParams.get("ruta_id")

    let query = supabase
      .from("despega_misiones")
      .select("*, user_progress:despega_user_misiones(completed, puntos_earned)")
      .eq("ciclo", parseInt(ciclo))

    if (ruta_id) {
      query = query.eq("ruta_id", ruta_id)
    }

    const { data, error } = await query.order("dia", { ascending: true })

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
    const { mision_id, completed, respuesta, tiempo_dedicado_minutos } = body

    // Get mision info to extract points
    const { data: misionData } = await supabase
      .from("despega_misiones")
      .select("puntos")
      .eq("id", mision_id)
      .single()

    const puntos = completed ? (misionData?.puntos || 0) : 0

    const { data, error } = await supabase
      .from("despega_user_misiones")
      .upsert({
        user_id: user.id,
        mision_id,
        completed,
        respuesta,
        tiempo_dedicado_minutos,
        puntos_earned: puntos,
        completed_at: completed ? new Date().toISOString() : null,
      })
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
