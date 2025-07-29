import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

interface SearchSuggestion {
  id: string
  text: string
  category: "recent" | "popular" | "career" | "skills"
  frequency?: number
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createClient()

    // Obtener usuario actual (opcional para sugerencias)
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    const suggestions: SearchSuggestion[] = []

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
          const userSuggestions = Array.from(wordFrequency.entries())
            .sort(([, a], [, b]) => b - a)
            .slice(0, 8)
            .map(([text, frequency], index) => ({
              id: `user-${index}`,
              text,
              category: "recent" as const,
              frequency,
            }))

          suggestions.push(...userSuggestions)
        }
      } catch (error) {
        console.error("Error obteniendo sugerencias personalizadas:", error)
      }
    }

    // Agregar sugerencias por defecto si no hay suficientes personalizadas
    const defaultSuggestions: SearchSuggestion[] = [
      // Sugerencias populares
      { id: "pop-1", text: "desarrollo profesional", category: "popular", frequency: 45 },
      { id: "pop-2", text: "cambio de carrera", category: "popular", frequency: 38 },
      { id: "pop-3", text: "entrevista de trabajo", category: "popular", frequency: 32 },
      { id: "pop-4", text: "networking profesional", category: "popular", frequency: 28 },
      { id: "pop-5", text: "equilibrio vida-trabajo", category: "popular", frequency: 25 },

      // Sugerencias de carrera
      { id: "car-1", text: "objetivos profesionales", category: "career" },
      { id: "car-2", text: "promoción laboral", category: "career" },
      { id: "car-3", text: "negociación salarial", category: "career" },
      { id: "car-4", text: "liderazgo", category: "career" },
      { id: "car-5", text: "emprendimiento", category: "career" },

      // Sugerencias de habilidades
      { id: "ski-1", text: "habilidades técnicas", category: "skills" },
      { id: "ski-2", text: "habilidades blandas", category: "skills" },
      { id: "ski-3", text: "comunicación efectiva", category: "skills" },
      { id: "ski-4", text: "gestión del tiempo", category: "skills" },
      { id: "ski-5", text: "resolución de problemas", category: "skills" },
    ]

    // Combinar sugerencias personalizadas con las por defecto
    const allSuggestions = [...suggestions]

    // Agregar sugerencias por defecto que no estén ya incluidas
    defaultSuggestions.forEach((defaultSugg) => {
      if (!allSuggestions.some((s) => s.text === defaultSugg.text)) {
        allSuggestions.push(defaultSugg)
      }
    })

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
