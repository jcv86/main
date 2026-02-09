import { type NextRequest, NextResponse } from "next/server"

export const runtime = "nodejs"

// Fallback insights based on DISC scores
const DESPEGA_CEREBRAL_INSIGHTS = {
  D: {
    title: "Dominio - Liderazgo y Decisión",
    strengths: [
      "Capacidad de tomar decisiones rápidas bajo presión",
      "Orientación clara hacia resultados y metas",
      "Liderazgo natural y capacidad de influencia",
    ],
    development: [
      "Escuchar más perspectivas antes de decidir",
      "Desarrollar empatía con equipos",
      "Balance entre velocidad y reflexión",
    ],
  },
  I: {
    title: "Influencia - Comunicación y Conexión",
    strengths: [
      "Excelente comunicador y motivador",
      "Construye relaciones y redes fácilmente",
      "Energía y entusiasmo contagiosos",
    ],
    development: [
      "Mejorar enfoque en detalles",
      "Seguimiento consistente de tareas",
      "Escucha activa sin interrupciones",
    ],
  },
  S: {
    title: "Estabilidad - Consistencia y Confiabilidad",
    strengths: [
      "Estabilidad emocional y paciencia",
      "Confiabilidad en compromisos",
      "Capacidad de trabajo consistente",
    ],
    development: [
      "Aumentar iniciativa y proactividad",
      "Aceptar cambios con mayor flexibilidad",
      "Desarrollar mayor assertividad",
    ],
  },
  C: {
    title: "Consciencia - Precisión y Calidad",
    strengths: [
      "Atención meticulosa al detalle",
      "Estándares altos de calidad",
      "Análisis profundo y reflexivo",
    ],
    development: [
      "Ser más ágil en decisiones",
      "Aceptar buenas soluciones, no solo perfectas",
      "Mayor tolerancia a la ambigüedad",
    ],
  },
}

export async function POST(request: NextRequest) {
  try {
    const { testType, results, userId } = await request.json()

    console.log("[v0] Simple insights generation for", testType, "user:", userId)

    if (!testType || !results) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Generate insights based on DISC scores
    const insights = []
    const scores = results as Record<string, number>

    // Sort dimensions by score to identify primary and secondary
    const sortedDimensions = Object.entries(scores)
      .filter(([key]) => ["D", "I", "S", "C"].includes(key))
      .sort(([, a], [, b]) => b - a)

    // Generate insights for top 2 dimensions
    sortedDimensions.slice(0, 2).forEach(([dimension]) => {
      const dimKey = dimension as keyof typeof DESPEGA_CEREBRAL_INSIGHTS
      const dimInsight = DESPEGA_CEREBRAL_INSIGHTS[dimKey]

      insights.push({
        title: dimInsight.title,
        category: `dimension_${dimension}`,
        description: `Tu perfil muestra una fortaleza en ${dimInsight.title.toLowerCase()}. ${dimInsight.strengths[0]}`,
        priority: "high",
        actionableSteps: [
          `Fortalecer: ${dimInsight.strengths[0]}`,
          `Desarrollar: ${dimInsight.development[0]}`,
          `Próximo paso: Solicitar feedback a colegas sobre este área`,
        ],
      })
    })

    // Development plan
    const developmentPlan = {
      shortTerm: [
        `Enfocarse en la dimensión más fuerte (${sortedDimensions[0][0]}) para generar momentum`,
        "Identificar un proyecto donde puedas aplicar tu principal fortaleza",
        "Solicitar mentoría en tu área de desarrollo prioritaria",
      ],
      mediumTerm: [
        "Trabajar en la segunda dimensión más fuerte",
        "Participar en actividades que desarrollen áreas débiles",
        "Crear hábitos que refuercen tu estabilidad",
      ],
      longTerm: [
        "Integrar todas las dimensiones DISC en tu perfil profesional",
        "Volverse versátil en diferentes estilos de trabajo",
        "Mentorizar a otros en tu área de fortaleza",
      ],
    }

    // Recommendations based on profile
    const recommendations = [
      {
        title: "Libro: Emotional Intelligence 2.0",
        description: "Mejora tu inteligencia emocional y adaptabilidad",
        timeframe: "2-3 semanas",
        difficulty: "Intermedio",
        source: "cerebro" as const,
      },
      {
        title: "Curso: Liderazgo Adaptativo",
        description: "Desarrolla flexibilidad en tu estilo de liderazgo",
        timeframe: "1 mes",
        difficulty: "Intermedio",
        source: "cerebro" as const,
      },
      {
        title: "Mentoría: Comunicación Efectiva",
        description: "Mejora la calidad de tus conversaciones profesionales",
        timeframe: "Ongoing",
        difficulty: "Básico",
        source: "cerebro" as const,
      },
    ]

    return NextResponse.json({
      insights,
      recommendations,
      developmentPlan,
      metadata: {
        generatedAt: new Date().toISOString(),
        testType,
        topDimension: sortedDimensions[0][0],
        topDimensionScore: sortedDimensions[0][1],
      },
    })
  } catch (error) {
    console.error("[v0] Error generating insights:", error)
    return NextResponse.json(
      {
        error: "Failed to generate insights",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
