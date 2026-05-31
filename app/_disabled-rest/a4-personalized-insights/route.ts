import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get latest A4 score
    const { data: scores } = await supabase
      .from("a4_strategic_scores")
      .select("score, level")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)

    const currentScore = scores?.[0]?.score || 0
    const level = scores?.[0]?.level || "beginner"

    // Fetch economic context
    const economicRes = await fetch(
      new URL("/rest/banco-central-data", request.url),
      { headers: request.headers }
    )
    const economicData = economicRes.ok ? await economicRes.json() : {}

    const employmentRes = await fetch(
      new URL("/rest/ine-employment", request.url),
      { headers: request.headers }
    )
    const employmentData = employmentRes.ok ? await employmentRes.json() : {}

    // Generate personalized insights based on score and economic context
    const insights = generateInsights(currentScore, level, economicData, employmentData)

    return NextResponse.json(insights, {
      headers: {
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error("[v0] Error generating A4 insights:", error)
    return NextResponse.json(
      { error: "Failed to generate insights" },
      { status: 500 }
    )
  }
}

function generateInsights(score: number, level: string, economicData: any, employmentData: any) {
  const baseInsights = {
    score_level: level,
    economic_context: {
      imacec_status: economicData?.imacec?.value > 100 ? "expansion" : "contraction",
      inflation: economicData?.ipc?.variation_annual || 0,
      unemployment: employmentData?.unemployment_rate || 0,
    },
  }

  const levelInsights: Record<string, any> = {
    beginner: {
      focus_areas: [
        "Entender contexto macroeconómico básico",
        "Aprender sobre sectores en tu mercado",
        "Identificar tendencias generales",
      ],
      recommended_actions: [
        "Lee 2-3 noticias de mercado esta semana",
        "Completa 1 módulo de contexto general",
        "Guarda 5 artículos relevantes",
      ],
      difficulty_adjustment: "simplificado",
    },
    intermediate: {
      focus_areas: [
        "Analizar impacto sectorial de cambios macro",
        "Conectar decisiones personales con contexto",
        "Desarrollar intuición estratégica",
      ],
      recommended_actions: [
        "Analiza cómo 2 noticias afectan tu sector",
        "Conecta A4 insights con tus decisiones de A2",
        "Participa en 2 tests de análisis",
      ],
      difficulty_adjustment: "balanceado",
    },
    advanced: {
      focus_areas: [
        "Detectar weak signals antes que otros",
        "Tomar decisiones estratégicas anticipadas",
        "Posicionarse en tendencias emergentes",
      ],
      recommended_actions: [
        "Identifica 1 weak signal en datos económicos",
        "Diseña estrategia basada en macro trends",
        "Propón pivote a ruta A2 basado en A4",
      ],
      difficulty_adjustment: "avanzado",
    },
    expert: {
      focus_areas: [
        "Visión sistémica de mercado global",
        "Predecir disrupciones",
        "Liderar en contexto de incertidumbre",
      ],
      recommended_actions: [
        "Desarrolla tesis de inversión/carrera personal",
        "Identifica oportunidades en caos",
        "Mentoriza a otros en análisis estratégico",
      ],
      difficulty_adjustment: "máximo",
    },
  }

  return {
    ...baseInsights,
    ...levelInsights[level],
    generated_at: new Date().toISOString(),
  }
}
