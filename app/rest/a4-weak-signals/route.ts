import { createClient } from "@/lib/supabase/server"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  try {
    const supabase = createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get user's A4 score and level
    const { data: scores } = await supabase
      .from("a4_strategic_scores")
      .select("score, level")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)

    const currentScore = scores?.[0]?.score || 0
    const level = scores?.[0]?.level || "beginner"

    // Fetch economic signals
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

    // Detect weak signals
    const weakSignals = detectWeakSignals(economicData, employmentData, level)

    // Generate adaptive recommendations based on A4 level
    const recommendations = generateAdaptiveRecommendations(
      level,
      currentScore,
      weakSignals,
      economicData,
      employmentData
    )

    return NextResponse.json({
      weak_signals: weakSignals,
      recommendations,
      urgency_level: calculateUrgency(weakSignals),
      generated_at: new Date().toISOString(),
    }, {
      headers: {
        'Cache-Control': 'public, max-age=3600',
      },
    })
  } catch (error) {
    console.error("[v0] Error generating weak signals:", error)
    return NextResponse.json(
      { error: "Failed to generate weak signals" },
      { status: 500 }
    )
  }
}

function detectWeakSignals(economicData: any, employmentData: any, level: string) {
  const signals = []

  // Economic indicators
  if (economicData?.imacec?.variation_monthly < -0.3) {
    signals.push({
      type: "economic_contraction",
      severity: "high",
      signal: "IMACEC contracción mensual mayor a 0.3%",
      implication: "Posible desaceleración económica en próximas semanas",
      action: "Evalúa estabilidad de empleadores en tu sector",
    })
  }

  if (economicData?.ipc?.variation_annual > 4) {
    signals.push({
      type: "high_inflation",
      severity: "medium",
      signal: "IPC anual mayor a 4%",
      implication: "Pérdida de poder adquisitivo, presión en salarios",
      action: "Negocia ajustes salariales o busca beneficios compensatorios",
    })
  }

  if (economicData?.tpm?.value > 8) {
    signals.push({
      type: "high_rates",
      severity: "medium",
      signal: "TPM mayor a 8%",
      implication: "Crédito más caro, empresas reducen inversión",
      action: "Sectores defensivos pueden ofrecer más estabilidad",
    })
  }

  // Employment signals
  if (employmentData?.unemployment_rate > 8) {
    signals.push({
      type: "high_unemployment",
      severity: "high",
      signal: "Tasa de desempleo mayor a 8%",
      implication: "Mercado laboral presionado, más competencia",
      action: "Diferénciate con skills específicas, busca nichos",
    })
  }

  // Sector-specific weak signals
  if (employmentData?.by_sector?.construction > 9) {
    signals.push({
      type: "sector_stress",
      severity: "medium",
      signal: "Construcción con desempleo > 9%",
      implication: "Sector en crisis, oportunidad en otros",
      action: "Si estás en construcción, evalúa transición",
    })
  }

  // Filter by level - advanced users see more signals
  if (level === "beginner") {
    return signals.slice(0, 2)
  } else if (level === "intermediate") {
    return signals.slice(0, 4)
  } else {
    return signals // All signals for advanced/expert
  }
}

function generateAdaptiveRecommendations(
  level: string,
  score: number,
  signals: any[],
  economicData: any,
  employmentData: any
) {
  const recommendations: any[] = []

  if (level === "beginner") {
    recommendations.push({
      priority: "high",
      recommendation: "Aprende contexto macroeconómico básico",
      action: "Completa módulo: '¿Cómo afecta la economía mi carrera?'",
      time_commitment: "15 minutos",
    })
    recommendations.push({
      priority: "medium",
      recommendation: "Entiende tu sector en el mercado actual",
      action: "Lee: 'Sectores resilientes en " + new Date().getFullYear() + "'",
      time_commitment: "10 minutos",
    })
  } else if (level === "intermediate") {
    if (signals.length > 0) {
      recommendations.push({
        priority: "high",
        recommendation: "Analiza impacto de weak signals detectadas",
        action: "Crea análisis: ¿Cómo afecta cada signal mi sector?",
        time_commitment: "30 minutos",
      })
    }
    recommendations.push({
      priority: "high",
      recommendation: "Conecta A4 insights con decisiones de carrera",
      action: "Revisa tu ruta A2 a la luz de contexto actual",
      time_commitment: "20 minutos",
    })
  } else if (level === "advanced" || level === "expert") {
    recommendations.push({
      priority: "critical",
      recommendation: "Desarrolla tesis estratégica personalizada",
      action: "Diseña pivote/posicionamiento basado en macro trends",
      time_commitment: "60 minutos",
    })
    recommendations.push({
      priority: "high",
      recommendation: "Identifica oportunidades de primer movimiento",
      action: "¿Qué skill emergente puedes desarrollar antes que otros?",
      time_commitment: "45 minutos",
    })
    if (signals.some(s => s.severity === "high")) {
      recommendations.push({
        priority: "critical",
        recommendation: "Plan de contingencia ante señales críticas",
        action: "Prepara escenarios: Plan A, B, C",
        time_commitment: "90 minutos",
      })
    }
  }

  return recommendations
}

function calculateUrgency(signals: any[]) {
  const criticalCount = signals.filter(s => s.severity === "high").length
  
  if (criticalCount >= 2) return "critical"
  if (criticalCount === 1) return "high"
  if (signals.length > 0) return "medium"
  return "low"
}
