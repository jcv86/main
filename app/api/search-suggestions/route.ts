import { type NextRequest, NextResponse } from "next/server"
import { getSearchSuggestions } from "@/lib/ai-coach"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get("query") || ""
    const limit = Number.parseInt(searchParams.get("limit") || "10")
    const userId = searchParams.get("userId")

    console.log("Search suggestions request:", { query, limit, userId })

    // Create Supabase client for auth
    const supabase = createRouteHandlerClient({ cookies })

    // Get current user from auth
    let currentUserId = userId
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user?.id) {
        currentUserId = user.id
      }
    } catch (error) {
      console.log("No authenticated user found")
    }

    if (!currentUserId) {
      // Return default suggestions for non-authenticated users
      const defaultSuggestions = {
        suggestions: [
          { text: "desarrollo profesional", type: "popular", frequency: 10, category: "Desarrollo de Carrera" },
          { text: "búsqueda de empleo", type: "popular", frequency: 9, category: "Búsqueda de Empleo" },
          { text: "habilidades técnicas", type: "popular", frequency: 8, category: "Habilidades" },
          { text: "entrevista de trabajo", type: "popular", frequency: 7, category: "Entrevistas" },
          { text: "cv curriculum", type: "popular", frequency: 6, category: "CV y Perfil" },
        ].filter((s) => !query || s.text.toLowerCase().includes(query.toLowerCase())),
        categories: ["Desarrollo de Carrera", "Búsqueda de Empleo", "Habilidades", "Entrevistas", "CV y Perfil"],
      }

      return NextResponse.json(defaultSuggestions)
    }

    // Get personalized suggestions
    const suggestions = await getSearchSuggestions(currentUserId, query, limit)

    return NextResponse.json(suggestions)
  } catch (error) {
    console.error("Error getting search suggestions:", error)

    // Return fallback suggestions
    const fallbackSuggestions = {
      suggestions: [
        { text: "carrera profesional", type: "popular", frequency: 5, category: "Desarrollo de Carrera" },
        { text: "trabajo chile", type: "popular", frequency: 4, category: "Búsqueda de Empleo" },
        { text: "habilidades blandas", type: "popular", frequency: 3, category: "Habilidades" },
      ],
      categories: ["Desarrollo de Carrera", "Búsqueda de Empleo", "Habilidades"],
    }

    return NextResponse.json(fallbackSuggestions)
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query = "", limit = 10, userId } = body

    console.log("POST search suggestions request:", { query, limit, userId })

    // Create Supabase client for auth
    const supabase = createRouteHandlerClient({ cookies })

    // Get current user from auth
    let currentUserId = userId
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user?.id) {
        currentUserId = user.id
      }
    } catch (error) {
      console.log("No authenticated user found")
    }

    if (!currentUserId) {
      return NextResponse.json({ error: "User authentication required" }, { status: 401 })
    }

    // Get personalized suggestions
    const suggestions = await getSearchSuggestions(currentUserId, query, limit)

    return NextResponse.json(suggestions)
  } catch (error) {
    console.error("Error in POST search suggestions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
