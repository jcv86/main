import { createClient } from "@/utils/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { results, userId } = await request.json()
    const supabase = createClient()

    console.log("[v0] Book recommendations endpoint - results:", results, "userId:", userId)

    if (!results || !results.D || results.I === undefined || results.S === undefined || results.C === undefined) {
      return NextResponse.json(
        { error: "Invalid DISC results" },
        { status: 400 }
      )
    }

    // Determinar perfil dominante
    const scores = {
      D: results.D || 0,
      I: results.I || 0,
      S: results.S || 0,
      C: results.C || 0,
    }

    const maxScore = Math.max(scores.D, scores.I, scores.S, scores.C)
    let dominantProfile = ""
    let keywords: string[] = []

    // Mapear perfil DISC a palabras clave para búsqueda
    if (scores.D === maxScore) {
      dominantProfile = "D - Dominio"
      keywords = [
        "liderazgo decisivo",
        "toma de decisiones",
        "gestión de proyectos",
        "estrategia empresarial",
        "emprendimiento",
        "negociación",
      ]
    } else if (scores.I === maxScore) {
      dominantProfile = "I - Influencia"
      keywords = [
        "comunicación persuasiva",
        "relaciones interpersonales",
        "liderazgo inspirador",
        "networking",
        "inteligencia emocional",
        "carisma",
      ]
    } else if (scores.S === maxScore) {
      dominantProfile = "S - Estabilidad"
      keywords = [
        "trabajo en equipo",
        "apoyo y colaboración",
        "gestión de conflictos",
        "empatía",
        "consistencia",
        "mentoring",
      ]
    } else if (scores.C === maxScore) {
      dominantProfile = "C - Consciencia"
      keywords = [
        "análisis y pensamiento crítico",
        "calidad y precisión",
        "mejora continua",
        "procesos y sistemas",
        "investigación",
        "control de calidad",
      ]
    }

    // Buscar libros relacionados a cada perfil DISC
    const allRecommendations: any[] = []

    // Para D: libros sobre liderazgo y decisión
    if (scores.D > 50) {
      const { data: dBooks } = await supabase
        .from("biblioteca")
        .select("*")
        .or("tags.ilike.%liderazgo%,tags.ilike.%decisión%,tags.ilike.%estrategia%,tags.ilike.%ejecutivo%")
        .limit(3)

      if (dBooks) {
        dBooks.forEach((book: any) => {
          allRecommendations.push({
            ...book,
            matchProfile: "D",
            matchReason: "Ideal para líderes decisivos orientados a resultados",
            priority: Math.round(scores.D / 10),
          })
        })
      }
    }

    // Para I: libros sobre comunicación e influencia
    if (scores.I > 50) {
      const { data: iBooks } = await supabase
        .from("biblioteca")
        .select("*")
        .or("tags.ilike.%comunicación%,tags.ilike.%relaciones%,tags.ilike.%influencia%,tags.ilike.%emocional%")
        .limit(3)

      if (iBooks) {
        iBooks.forEach((book: any) => {
          allRecommendations.push({
            ...book,
            matchProfile: "I",
            matchReason: "Perfecto para personas que inspiran y conectan",
            priority: Math.round(scores.I / 10),
          })
        })
      }
    }

    // Para S: libros sobre colaboración y apoyo
    if (scores.S > 50) {
      const { data: sBooks } = await supabase
        .from("biblioteca")
        .select("*")
        .or("tags.ilike.%equipo%,tags.ilike.%colaboración%,tags.ilike.%mentoring%,tags.ilike.%apoyo%")
        .limit(3)

      if (sBooks) {
        sBooks.forEach((book: any) => {
          allRecommendations.push({
            ...book,
            matchProfile: "S",
            matchReason: "Esencial para fortalecer apoyo y colaboración",
            priority: Math.round(scores.S / 10),
          })
        })
      }
    }

    // Para C: libros sobre precisión y análisis
    if (scores.C > 50) {
      const { data: cBooks } = await supabase
        .from("biblioteca")
        .select("*")
        .or("tags.ilike.%análisis%,tags.ilike.%precisión%,tags.ilike.%calidad%,tags.ilike.%sistemas%")
        .limit(3)

      if (cBooks) {
        cBooks.forEach((book: any) => {
          allRecommendations.push({
            ...book,
            matchProfile: "C",
            matchReason: "Perfecto para desarrollar rigor y precisión analítica",
            priority: Math.round(scores.C / 10),
          })
        })
      }
    }

    // Remover duplicados y ordenar por prioridad
    const uniqueRecommendations = Array.from(
      new Map(allRecommendations.map((book) => [book.id, book])).values()
    )

    const sortedRecommendations = uniqueRecommendations
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 6)

    console.log("[v0] Found", sortedRecommendations.length, "recommendations for profile:", dominantProfile)

    // Guardar recomendaciones al usuario si existe userId
    if (userId && userId !== "anonymous") {
      try {
        const { error: saveError } = await supabase.from("user_book_recommendations").insert(
          sortedRecommendations.map((book) => ({
            user_id: userId,
            book_id: book.id,
            reason: book.matchReason,
            profile_match: book.matchProfile,
            priority: book.priority,
          }))
        )
        if (saveError) {
          console.error("[v0] Error saving recommendations to user:", saveError)
        } else {
          console.log("[v0] Saved recommendations for user:", userId)
        }
      } catch (error) {
        console.error("[v0] Error saving recommendations:", error)
      }
    }

    return NextResponse.json({
      dominantProfile,
      recommendations: sortedRecommendations.map((book) => ({
        id: book.id,
        title: book.title,
        author: book.author,
        description: book.description,
        cover_url: book.cover_url,
        matchProfile: book.matchProfile,
        matchReason: book.matchReason,
        priority: book.priority,
        difficulty: book.difficulty,
        estimated_read_time: book.estimated_read_time,
        rating: book.rating,
      })),
    })
  } catch (error) {
    console.error("[v0] Error in despega-book-recommendations:", error)
    return NextResponse.json(
      { 
        error: "Error generating recommendations",
        recommendations: [],
        dominantProfile: "unknown"
      },
      { status: 200 }
      )
  }
}
