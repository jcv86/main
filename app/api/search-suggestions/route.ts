import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

interface SearchSuggestion {
  id: string
  text: string
  category: "recent" | "popular" | "career" | "skills"
  frequency?: number
}

const suggestions = [
  "Test de personalidad DISC",
  "Test Big Five",
  "Habilidades blandas",
  "Habilidades técnicas",
  "CV Builder",
  "Búsqueda de empleo",
  "Coach de carrera",
  "Simulador de entrevistas",
  "Biblioteca de libros",
  "Calendario de actividades",
  "Metas profesionales",
  "Carreras UDD",
  "Bachillerato",
  "Sistema Mirix",
  "Evaluación de habilidades",
  "Test adaptativo",
  "Coach de personalidad",
  "Generador CV IA",
]

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("q")?.toLowerCase() || ""

  if (!query || query.length < 2) {
    return NextResponse.json({ suggestions: [] })
  }

  const filteredSuggestions = suggestions.filter((suggestion) => suggestion.toLowerCase().includes(query)).slice(0, 5)

  try {
    const supabase = createClient()

    // Obtener usuario actual (opcional para sugerencias)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    const userSuggestions: SearchSuggestion[] = []

    if (user && !authError) {
      // Usuario autenticado: obtener sugerencias personalizadas
      try {
        // Obtener términos frecuentes de conversaciones del usuario
        const { data: conversations, error: conversationsError } = await supabase
          .from("coaching_conversations")
          .select("message")
          .eq("user_id", user.id)
          .eq("role", "user")
          .order("created_at", { ascending: false })
          .limit(100)

        if (!conversationsError && conversations) {
          // Analizar mensajes para extraer términos comunes
          const messageTexts = conversations.map((c) => c.message.toLowerCase())
          const wordFrequency = new Map<string, number>()

          // Términos relevantes para carrera profesional
          const careerKeywords = [
            "desarrollo profesional",
            "cambio de carrera",
            "objetivos profesionales",
            "habilidades técnicas",
            "habilidades blandas",
            "liderazgo",
            "entrevista de trabajo",
            "cv",
            "currículum",
            "networking",
            "promoción",
            "ascenso",
            "salario",
            "negociación",
            "capacitación",
            "certificación",
            "curso",
            "formación",
            "trabajo remoto",
            "equilibrio vida-trabajo",
            "burnout",
            "emprendimiento",
            "startup",
            "innovación",
            "creatividad",
          ]

          messageTexts.forEach((message) => {
            careerKeywords.forEach((keyword) => {
              if (message.includes(keyword)) {
                wordFrequency.set(keyword, (wordFrequency.get(keyword) || 0) + 1)
              }
            })
          })

          // Convertir a sugerencias ordenadas por frecuencia
          const recentSuggestions = Array.from(wordFrequency.entries())
            .sort(([, a], [, b]) => b - a)
            .slice(0, 8)
            .map(([text, frequency], index) => ({
              id: `user-${index}`,
              text,
              category: "recent" as const,
              frequency,
            }))

          userSuggestions.push(...recentSuggestions)
        }
      } catch (error) {
        console.error("Error obteniendo sugerencias personalizadas:", error)
      }
    }

    // Combinar sugerencias personalizadas con las por defecto
    const allSuggestions = [...userSuggestions, ...filteredSuggestions]

    // Limitar a 15 sugerencias máximo
    const finalSuggestions = allSuggestions.slice(0, 15)

    return NextResponse.json({
      suggestions: finalSuggestions,
      userAuthenticated: !!user,
    })
  } catch (error) {
    console.error("Error en API de sugerencias de búsqueda:", error)

    // Retornar sugerencias básicas en caso de error
    const basicSuggestions: SearchSuggestion[] = [
      { id: "basic-1", text: "desarrollo profesional", category: "career" },
      { id: "basic-2", text: "cambio de carrera", category: "career" },
      { id: "basic-3", text: "habilidades técnicas", category: "skills" },
      { id: "basic-4", text: "entrevista de trabajo", category: "career" },
      { id: "basic-5", text: "networking", category: "career" },
    ]

    return NextResponse.json({
      suggestions: basicSuggestions,
      userAuthenticated: false,
      error: "Error cargando sugerencias personalizadas",
    })
  }
}
