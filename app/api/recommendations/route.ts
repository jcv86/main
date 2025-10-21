import { type NextRequest, NextResponse } from "next/server"
import { generateObject } from "ai"
import { openai } from "@ai-sdk/openai"
import { z } from "zod"
import { cerebroIntelligence } from "@/lib/cerebro-intelligence"
import { createClient } from "@/lib/supabase"

export const runtime = "nodejs"

const RecommendationSchema = z.object({
  recommendations: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      action: z.string(),
      category: z.string(),
      source: z.enum(["openai", "cerebro", "hybrid"]),
      confidence: z.number().min(0).max(1),
      priority: z.number().min(1).max(10),
    }),
  ),
})

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")

    console.log("[v0] Generating recommendations for userId:", userId)

    if (!userId || userId === "null") {
      console.log("[v0] No valid userId, returning demo recommendations immediately")
      return NextResponse.json({
        success: true,
        recommendations: getDemoRecommendations(),
        source: "demo",
      })
    }

    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 10000))

    const generationPromise = (async () => {
      // Get user context
      const supabase = createClient()
      const { data: userProfile } = await supabase.from("user_profiles").select("*").eq("id", userId).single()

      const { data: testResults } = await supabase
        .from("test_results")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5)

      const [openaiRecs, cerebroRecs] = await Promise.all([
        generateOpenAIRecommendations(userProfile, testResults).catch(() => []),
        generateCerebroRecommendations(userId, userProfile, testResults).catch(() => []),
      ])

      // Merge and rank
      const allRecs = [...openaiRecs, ...cerebroRecs]

      if (allRecs.length === 0) {
        return getDemoRecommendations()
      }

      const sortedRecs = allRecs.sort((a, b) => b.priority - a.priority).slice(0, 6)
      return sortedRecs
    })()

    const recommendations = await Promise.race([generationPromise, timeoutPromise]).catch((error) => {
      console.log("[v0] Generation timeout or error, using demo recommendations")
      return getDemoRecommendations()
    })

    console.log("[v0] Returning", Array.isArray(recommendations) ? recommendations.length : 0, "recommendations")

    return NextResponse.json({
      success: true,
      recommendations: Array.isArray(recommendations) ? recommendations : getDemoRecommendations(),
      source: "hybrid",
    })
  } catch (error) {
    console.error("[v0] Error generating recommendations:", error)
    return NextResponse.json({
      success: true,
      recommendations: getDemoRecommendations(),
      source: "fallback",
    })
  }
}

async function generateOpenAIRecommendations(userProfile: any, testResults: any[]): Promise<any[]> {
  try {
    const prompt = `Como coach profesional, genera 3 recomendaciones personalizadas para este usuario:

Perfil: ${JSON.stringify(userProfile || {})}
Tests Completados: ${testResults?.length || 0}
Últimos Resultados: ${JSON.stringify(testResults?.slice(0, 2) || [])}

Genera recomendaciones específicas, accionables y relevantes para el desarrollo profesional en Chile.`

    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: RecommendationSchema,
      prompt,
      temperature: 0.7,
    })

    return object.recommendations.map((r) => ({ ...r, source: "openai" as const }))
  } catch (error) {
    console.error("[v0] Error generating OpenAI recommendations:", error)
    return []
  }
}

async function generateCerebroRecommendations(userId: string, userProfile: any, testResults: any[]): Promise<any[]> {
  try {
    // Get user patterns and context
    const userPatterns = await cerebroIntelligence.getUserPatterns(userId)
    const userContext = await cerebroIntelligence.getUserContext(userId)

    const prompt = `Como Cerebro, el coach IA de Despega Tu Carrera, genera 3 recomendaciones altamente personalizadas:

Contexto del Usuario:
- Perfil: ${JSON.stringify(userProfile || {})}
- Tests: ${testResults?.length || 0} completados
- Patrones: ${JSON.stringify(userPatterns || [])}
- Contexto: ${JSON.stringify(userContext || {})}

Genera recomendaciones que:
1. Se basen en el conocimiento de 120+ libros profesionales
2. Consideren el mercado laboral chileno
3. Sean específicas para el contexto del usuario
4. Incluyan pasos accionables claros`

    const { object } = await generateObject({
      model: openai("gpt-4o-mini"),
      schema: RecommendationSchema,
      prompt,
      temperature: 0.8,
    })

    return object.recommendations.map((r) => ({ ...r, source: "cerebro" as const }))
  } catch (error) {
    console.error("[v0] Error generating Cerebro recommendations:", error)
    return []
  }
}

function getDemoRecommendations() {
  return [
    {
      title: "Completa tu Perfil Psicométrico",
      description:
        "Realiza las evaluaciones pendientes para obtener un análisis completo de tu personalidad y habilidades profesionales",
      action: "Comenzar Tests",
      category: "assessment",
      source: "system" as const,
      confidence: 0.95,
      priority: 10,
    },
    {
      title: "Desarrolla tu Inteligencia Emocional",
      description:
        "La IE es clave para el liderazgo. Completa la evaluación para identificar áreas de mejora en gestión emocional",
      action: "Realizar Test",
      category: "skill_development",
      source: "cerebro" as const,
      confidence: 0.9,
      priority: 9,
    },
    {
      title: "Explora la Biblioteca Profesional",
      description: "Accede a más de 120 libros de desarrollo profesional curados para el mercado chileno",
      action: "Ver Biblioteca",
      category: "learning",
      source: "system" as const,
      confidence: 0.85,
      priority: 8,
    },
    {
      title: "Consulta con el Coach IA",
      description: "Obtén orientación personalizada sobre tu carrera profesional con nuestro coach inteligente Cerebro",
      action: "Hablar con Coach",
      category: "coaching",
      source: "cerebro" as const,
      confidence: 0.88,
      priority: 7,
    },
    {
      title: "Define tus Objetivos Profesionales",
      description: "Establece metas claras y medibles para tu desarrollo profesional en los próximos 6 meses",
      action: "Crear Objetivos",
      category: "career_planning",
      source: "openai" as const,
      confidence: 0.82,
      priority: 6,
    },
  ]
}
