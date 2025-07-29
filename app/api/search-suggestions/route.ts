import { type NextRequest, NextResponse } from "next/server"
import { getSearchSuggestions } from "@/lib/ai-coach"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const query = searchParams.get("query") || ""
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    // Create Supabase client for auth
    const supabase = createRouteHandlerClient({ cookies })

    // Get current user from auth (but don't require it)
    let currentUserId = userId
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (user?.id) {
        currentUserId = user.id
      }
      // Don't throw error if no user - allow demo mode
    } catch (error) {
      console.log("No authenticated user found, using provided userId or demo mode")
    }

    // Get search suggestions
    const suggestions = await getSearchSuggestions(currentUserId || "", query, limit)

    return NextResponse.json(suggestions)
  } catch (error) {
    console.error("Error in search suggestions API:", error)

    // Return default suggestions on error
    const defaultSuggestions = {
      suggestions: [
        { text: "desarrollo profesional", type: "popular", frequency: 10, category: "Desarrollo de Carrera" },
        { text: "búsqueda de empleo", type: "popular", frequency: 9, category: "Búsqueda de Empleo" },
        { text: "habilidades técnicas", type: "popular", frequency: 8, category: "Habilidades" },
        { text: "entrevista de trabajo", type: "popular", frequency: 7, category: "Entrevistas" },
        { text: "cv curriculum", type: "popular", frequency: 6, category: "CV y Perfil" },
      ],
      categories: ["Desarrollo de Carrera", "Búsqueda de Empleo", "Habilidades", "Entrevistas", "CV y Perfil"],
    }

    return NextResponse.json(defaultSuggestions)
  }
}
