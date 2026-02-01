import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()

    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get("tipo")
    const categoria = searchParams.get("categoria")

    let query = supabase
      .from("despega_a4_market_intel")
      .select("*")
      .eq("es_active", true)
      .order("publicado_en", { ascending: false })

    if (tipo) {
      query = query.eq("tipo", tipo)
    }

    if (categoria) {
      query = query.eq("categoria", categoria)
    }

    const { data, error } = await query

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
