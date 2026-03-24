import { createClient } from "@/app/utils/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Obtener perfil del usuario
    const { data: profile } = await supabase
      .from("user_learning_profiles")
      .select("*")
      .eq("user_id", user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: "Assessment no completado" }, { status: 400 })
    }

    // Obtener libros completados por el usuario
    const { data: completedBooks } = await supabase
      .from("user_progress")
      .select("book_id")
      .eq("user_id", user.id)
      .eq("status", "completed")

    const completedIds = completedBooks?.map(b => b.book_id) || []

    // Lógica de recomendaciones según nivel
    let query = supabase
      .from("knowledge_base")
      .select("id, title, author, category, difficulty_level, estimated_read_time, LENGTH(content) as content_length")
      .not("id", "in", `(${completedIds.join(",") || "null"})`)

    // Filtrar por nivel
    if (profile.current_level === "beginner") {
      query = query.eq("difficulty_level", "Básico")
        .limit(10)
    } else if (profile.current_level === "intermediate") {
      query = query.in("difficulty_level", ["Intermedio", "Básico"])
        .limit(10)
    } else {
      query = query.limit(15)
    }

    // Filtrar por categorías preferidas si existen
    if (profile.preferred_categories?.length > 0) {
      query = query.in("category", profile.preferred_categories)
    }

    const { data: recommendations, error } = await query

    if (error) throw error

    return NextResponse.json({
      recommendations: recommendations?.map((book: {
        id: string | number
        title: string
        author: string
        category: string
        difficulty_level: string
        estimated_read_time: number | null
        content_length: number | null
      }, index: number) => ({
        ...book,
        match_score: 100 - (index * 5), // Score decreciente
        reason: index === 0 ? "Recomendado para tu nivel" : "Basado en tus intereses",
      })) || [],
    })
  } catch (error) {
    console.error("[v0] Recommendations error:", error)
    return NextResponse.json(
      { error: "Error fetching recommendations" },
      { status: 500 }
    )
  }
}
