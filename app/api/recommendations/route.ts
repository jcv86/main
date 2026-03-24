import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"

export const maxDuration = 30

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userEmail = searchParams.get("userEmail")

    console.log("[v0] Generating recommendations for userEmail:", userEmail)

    if (!userEmail || userEmail === "null") {
      console.log("[v0] No valid userEmail, returning demo recommendations immediately")
      return NextResponse.json({
        success: true,
        recommendations: getDemoRecommendations(),
        source: "demo",
      })
    }

    const timeoutPromise = new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 10000))

    const generationPromise = (async () => {
      const supabase = await createClient()

      const { data: existingProfile } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("email", userEmail)
        .maybeSingle()

      let userProfile = existingProfile

      if (!userProfile) {
        console.log("[v0] Creating user profile for:", userEmail)
        const { data: newProfile } = await supabase
          .from("user_profiles")
          .insert({
            email: userEmail,
            user_email: userEmail,
            full_name: userEmail.split("@")[0],
            total_xp: 0,
            current_level: 1,
            tests_completed: 0,
            documents_read: 0,
            skills_learned: 0,
          })
          .select()
          .single()

        userProfile = newProfile
      }

      const { data: testResults } = await supabase
        .from("test_results")
        .select("*")
        .eq("user_email", userEmail)
        .order("completed_at", { ascending: false })
        .limit(5)

      const recommendations = generateSmartRecommendations(userProfile, testResults || [])
      return recommendations
    })()

    const recommendations = await Promise.race([generationPromise, timeoutPromise]).catch((error) => {
      console.log("[v0] Generation timeout or error, using demo recommendations")
      return getDemoRecommendations()
    })

    console.log("[v0] Returning", Array.isArray(recommendations) ? recommendations.length : 0, "recommendations")

    return NextResponse.json({
      success: true,
      recommendations: Array.isArray(recommendations) ? recommendations : getDemoRecommendations(),
      source: "smart",
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

function generateSmartRecommendations(userProfile: any, testResults: any[]): any[] {
  const recommendations: any[] = []
  const testsCompleted = testResults.length
  const totalXP = userProfile?.total_xp || 0
  const currentLevel = userProfile?.current_level || 1

  // Priority 1: If no tests completed, encourage assessment
  if (testsCompleted === 0) {
    recommendations.push({
      title: "Comienza tu Evaluación Profesional",
      description:
        "Descubre tus fortalezas y áreas de desarrollo con nuestras evaluaciones psicométricas validadas. Es el primer paso para tu crecimiento profesional.",
      action: "Comenzar Tests",
      category: "assessment",
      source: "system" as const,
      confidence: 0.98,
      priority: 10,
    })
  }

  // Priority 2: If few tests completed, encourage more assessments
  if (testsCompleted > 0 && testsCompleted < 3) {
    recommendations.push({
      title: "Completa tu Perfil Psicométrico",
      description:
        "Has completado algunos tests. Realiza evaluaciones adicionales para obtener un análisis más completo de tu perfil profesional.",
      action: "Ver Tests Disponibles",
      category: "assessment",
      source: "system" as const,
      confidence: 0.92,
      priority: 9,
    })
  }

  // Priority 3: Analyze test results for specific recommendations
  if (testResults.length > 0) {
    const latestTest = testResults[0]
    const testType = latestTest.test_type || latestTest.test_name

    if (testType?.toLowerCase().includes("emocional") || testType?.toLowerCase().includes("ie")) {
      recommendations.push({
        title: "Desarrolla tu Inteligencia Emocional",
        description:
          "Basado en tus resultados, te recomendamos profundizar en gestión emocional y empatía. Estas habilidades son clave para el liderazgo efectivo.",
        action: "Ver Recursos IE",
        category: "skill_development",
        source: "cerebro" as const,
        confidence: 0.89,
        priority: 8,
      })
    }

    if (testType?.toLowerCase().includes("personalidad") || testType?.toLowerCase().includes("disc")) {
      recommendations.push({
        title: "Aplica tu Perfil de Personalidad",
        description:
          "Conoces tu perfil. Ahora aprende cómo aplicarlo en situaciones laborales reales para mejorar tu comunicación y trabajo en equipo.",
        action: "Ver Guías Prácticas",
        category: "application",
        source: "cerebro" as const,
        confidence: 0.87,
        priority: 7,
      })
    }
  }

  // Priority 4: Learning resources
  if (totalXP < 500) {
    recommendations.push({
      title: "Explora la Biblioteca Profesional",
      description:
        "Accede a más de 120 libros de desarrollo profesional curados específicamente para el mercado laboral chileno.",
      action: "Ver Biblioteca",
      category: "learning",
      source: "system" as const,
      confidence: 0.85,
      priority: 6,
    })
  }

  // Priority 5: AI Coach consultation
  recommendations.push({
    title: "Consulta con el Coach IA Cerebro",
    description:
      "Obtén orientación personalizada sobre tu carrera profesional. Cerebro tiene conocimiento de 120+ libros y puede ayudarte con dudas específicas.",
    action: "Hablar con Coach",
    category: "coaching",
    source: "cerebro" as const,
    confidence: 0.88,
    priority: 5,
  })

  // Priority 6: Career planning
  if (currentLevel >= 2) {
    recommendations.push({
      title: "Define tus Objetivos Profesionales",
      description:
        "Establece metas claras y medibles para tu desarrollo profesional en los próximos 6 meses. La planificación es clave para el éxito.",
      action: "Crear Objetivos",
      category: "career_planning",
      source: "openai" as const,
      confidence: 0.82,
      priority: 4,
    })
  }

  // Priority 7: Networking and community
  if (testsCompleted >= 2) {
    recommendations.push({
      title: "Conecta con Otros Profesionales",
      description:
        "Únete a nuestra comunidad de profesionales en desarrollo. Comparte experiencias y aprende de otros en situaciones similares.",
      action: "Ver Comunidad",
      category: "networking",
      source: "system" as const,
      confidence: 0.78,
      priority: 3,
    })
  }

  // Sort by priority and return top 5
  return recommendations.sort((a, b) => b.priority - a.priority).slice(0, 5)
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
