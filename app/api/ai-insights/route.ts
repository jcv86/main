import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from("ai_insights")
      .select("*")
      .eq("user_email", email)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching insights:", error)
      return NextResponse.json({ error: "Failed to fetch insights" }, { status: 500 })
    }

    // Transform data to match AIInsight interface
    const insights = data.map((insight: {
      id: string | number
      type: string
      title: string
      description: string
      priority: string
      progress?: number | null
      actionable: boolean
      category: string
      created_at: string
      updated_at: string
    }) => ({
      id: insight.id.toString(),
      type: insight.type,
      title: insight.title,
      description: insight.description,
      priority: insight.priority,
      progress: insight.progress,
      actionable: insight.actionable,
      category: insight.category,
      createdAt: insight.created_at,
      updatedAt: insight.updated_at,
    }))

    return NextResponse.json(insights)
  } catch (error) {
    console.error("Error in insights API:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userEmail, type, title, description, priority, progress, actionable, category } = body

    if (!userEmail || !type || !title || !description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from("ai_insights")
      .insert({
        user_email: userEmail,
        type,
        title,
        description,
        priority: priority || "medium",
        progress: progress || null,
        actionable: actionable || false,
        category: category || null,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating insight:", error)
      return NextResponse.json({ error: "Failed to create insight" }, { status: 500 })
    }

    return NextResponse.json(data, { status: 201 })
  } catch (error) {
    console.error("Error in insight creation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ error: "Insight ID is required" }, { status: 400 })
    }

    const supabase = await createClient()
    const { data, error } = await supabase
      .from("ai_insights")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating insight:", error)
      return NextResponse.json({ error: "Failed to update insight" }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in insight update:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")

    if (!id) {
      return NextResponse.json({ error: "Insight ID is required" }, { status: 400 })
    }

    const supabase = await createClient()
    const { error } = await supabase.from("ai_insights").delete().eq("id", id)

    if (error) {
      console.error("Error deleting insight:", error)
      return NextResponse.json({ error: "Failed to delete insight" }, { status: 500 })
    }

    return NextResponse.json({ message: "Insight deleted successfully" })
  } catch (error) {
    console.error("Error in insight deletion:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function generateComprehensiveInsights(testResults: any[], userEmail: string) {
  const completedTests = testResults.length
  const avgScore =
    completedTests > 0 ? Math.round(testResults.reduce((sum, r) => sum + (r.score || 0), 0) / completedTests) : 0

  // Test type analysis
  const hasDisc = testResults.some((r) => r.test_type === "disc")
  const hasBigFive = testResults.some((r) => r.test_type === "big-five")
  const hasMbti = testResults.some((r) => r.test_type === "mbti")
  const hasRiasec = testResults.some((r) => r.test_type === "riasec")
  const hasSoftSkills = testResults.some((r) => r.test_type === "soft-skills")

  return {
    // Executive Summary
    executiveSummary: {
      title: "Resumen Ejecutivo del Perfil",
      content: generateExecutiveSummary(completedTests, avgScore, testResults),
      confidence: Math.min(95, 60 + completedTests * 8),
      keyPoints: [
        `${completedTests} evaluación(es) completada(s)`,
        `Puntuación promedio: ${avgScore}%`,
        `Perfil ${getProfileLevel(avgScore)}`,
        `${getCompletionStatus(completedTests)}`,
      ],
    },

    // Personality Insights
    personalityInsights: generatePersonalityInsights(testResults, hasDisc, hasBigFive, hasMbti),

    // Career Matches
    careerMatches: generateCareerMatches(testResults, hasRiasec, avgScore),

    // Strengths Analysis
    strengthsAnalysis: {
      title: "Análisis de Fortalezas",
      primaryStrengths: getPrimaryStrengths(testResults),
      developmentAreas: getDevelopmentAreas(testResults),
      recommendations: getStrengthRecommendations(testResults, avgScore),
    },

    // Development Plan
    developmentPlan: generateDevelopmentPlan(testResults, avgScore, completedTests),

    // Skills Assessment
    skillsAssessment: generateSkillsAssessment(testResults, hasSoftSkills),

    // Next Steps
    nextSteps: generateNextSteps(completedTests, testResults),
  }
}

function generateExecutiveSummary(completedTests: number, avgScore: number, testResults: any[]): string {
  if (completedTests === 0) {
    return `Bienvenido a tu plataforma de desarrollo profesional. Para generar insights personalizados, te recomendamos completar al menos 2-3 evaluaciones psicométricas.

**Beneficios de completar evaluaciones:**
• Identificación precisa de fortalezas y áreas de desarrollo
• Recomendaciones de carrera personalizadas
• Plan de desarrollo profesional estructurado
• Insights de compatibilidad con roles específicos

**Evaluaciones recomendadas para comenzar:**
1. **DISC**: Estilo de comunicación y liderazgo
2. **RIASEC**: Intereses vocacionales y compatibilidad de carrera
3. **Habilidades Blandas**: Competencias interpersonales y profesionales`
  }

  if (completedTests === 1) {
    const testType = testResults[0]?.test_type
    return `Has completado tu primera evaluación (${getTestName(testType)}) con una puntuación de ${avgScore}%. Este es un excelente primer paso en tu desarrollo profesional.

**Insights preliminares:**
• Muestras ${avgScore >= 80 ? "un desempeño excepcional" : avgScore >= 60 ? "un desempeño sólido" : "potencial de crecimiento significativo"}
• Tu perfil inicial sugiere fortalezas en ${getInitialStrengths(testType)}

**Para obtener un análisis más completo:**
• Completa 2-3 evaluaciones adicionales
• Esto permitirá generar recomendaciones de carrera específicas
• Desarrollaremos un plan de crecimiento personalizado`
  }

  const profileDescription = getProfileDescription(testResults, avgScore)

  return `**Perfil Profesional Completo**

Con ${completedTests} evaluaciones completadas y una puntuación promedio de ${avgScore}%, has desarrollado un perfil profesional ${getProfileLevel(avgScore).toLowerCase()}.

${profileDescription}

**Fortalezas Clave Identificadas:**
${getPrimaryStrengths(testResults)
  .slice(0, 3)
  .map((s) => `• ${s}`)
  .join("\n")}

**Oportunidades de Desarrollo:**
${getDevelopmentAreas(testResults)
  .slice(0, 2)
  .map((d) => `• ${d}`)
  .join("\n")}

**Recomendación Principal:**
${getMainRecommendation(testResults, avgScore)}`
}

function generatePersonalityInsights(testResults: any[], hasDisc: boolean, hasBigFive: boolean, hasMbti: boolean) {
  const insights = []

  if (hasDisc) {
    const discResult = testResults.find((r) => r.test_type === "disc")
    insights.push({
      type: "strength",
      title: "Estilo de Comunicación y Liderazgo",
      description: `Tu perfil DISC indica un estilo de comunicación ${getDiscStyle(discResult)}. Esto se traduce en fortalezas naturales para ${getDiscStrengths(discResult)} y sugiere que prosperas en entornos que valoran ${getDiscEnvironment(discResult)}.`,
      confidence: 0.88,
      priority: "high",
      category: "communication",
      actionable: true,
    })
  }

  if (hasBigFive) {
    const bigFiveResult = testResults.find((r) => r.test_type === "big-five")
    insights.push({
      type: "strength",
      title: "Rasgos de Personalidad Fundamentales",
      description: `Tu perfil Big Five muestra características distintivas en ${getBigFiveHighlights(bigFiveResult)}. Esto indica que tienes fortalezas naturales en ${getBigFiveStrengths(bigFiveResult)} y te beneficiarías de desarrollar ${getBigFiveDevelopment(bigFiveResult)}.`,
      confidence: 0.85,
      priority: "high",
      category: "personality",
      actionable: true,
    })
  }

  if (hasMbti) {
    const mbtiResult = testResults.find((r) => r.test_type === "mbti")
    insights.push({
      type: "strength",
      title: "Preferencias Cognitivas y Procesamiento",
      description: `Como ${getMbtiType(mbtiResult)}, tienes preferencias claras por ${getMbtiPreferences(mbtiResult)}. Esto se traduce en fortalezas para ${getMbtiStrengths(mbtiResult)} y sugiere que te energizas en situaciones que involucran ${getMbtiEnergySource(mbtiResult)}.`,
      confidence: 0.82,
      priority: "high",
      category: "cognitive",
      actionable: true,
    })
  }

  if (insights.length === 0) {
    insights.push({
      type: "warning",
      title: "Evaluación de Personalidad Pendiente",
      description:
        "Para generar insights detallados de personalidad, te recomendamos completar evaluaciones como DISC, Big Five o MBTI. Estas herramientas proporcionarán una comprensión profunda de tu estilo de trabajo, preferencias de comunicación y compatibilidad con diferentes roles.",
      confidence: 0,
      priority: "low",
      category: "general",
      actionable: false,
    })
  }

  return insights
}

function generateCareerMatches(testResults: any[], hasRiasec: boolean, avgScore: number) {
  if (!hasRiasec) {
    return [
      {
        role: "Consultor de Desarrollo Organizacional",
        compatibility: 0.75,
        description:
          "Basado en tu perfil general, muestras potencial para roles que combinan análisis, comunicación y desarrollo de personas.",
        requirements: ["Habilidades de comunicación", "Pensamiento analítico", "Orientación al desarrollo"],
        growthPath: "Especialización en change management → Senior Consultant → Director de Desarrollo Organizacional",
      },
      {
        role: "Product Manager",
        compatibility: 0.7,
        description:
          "Tu perfil sugiere capacidades para gestionar productos, coordinar equipos y tomar decisiones estratégicas.",
        requirements: ["Gestión de proyectos", "Análisis de mercado", "Liderazgo de equipos"],
        growthPath: "Associate PM → Product Manager → Senior PM → Director de Producto",
      },
      {
        role: "Especialista en Recursos Humanos",
        compatibility: 0.68,
        description:
          "Tus habilidades interpersonales y de análisis se alinean bien con roles en desarrollo de talento.",
        requirements: ["Psicología organizacional", "Gestión de talento", "Comunicación efectiva"],
        growthPath: "HR Generalist → HR Business Partner → HR Director",
      },
    ]
  }

  const riasecResult = testResults.find((r) => r.test_type === "riasec")
  const hollandCode = riasecResult?.results?.holland_code || "IEA"

  return getCareerMatchesByHollandCode(hollandCode, avgScore)
}

function generateDevelopmentPlan(testResults: any[], avgScore: number, completedTests: number) {
  type Phase = {
    phase: number
    title: string
    duration: string
    objectives: string[]
    activities: Array<{ week: string; tasks: string[] }>
    expectedOutcomes: string[]
  }

  const plan: {
    title: string
    currentLevel: string
    targetLevel: string
    phases: Phase[]
  } = {
    title: "Plan de Desarrollo Profesional 90 Días",
    currentLevel: getProfileLevel(avgScore),
    targetLevel: getNextLevel(avgScore),
    phases: [],
  }

  // Phase 1: Foundation (Days 1-30)
  plan.phases.push({
    phase: 1,
    title: "Fundación y Autoconocimiento",
    duration: "Días 1-30",
    objectives: [
      completedTests < 3 ? "Completar evaluaciones psicométricas restantes" : "Profundizar en resultados existentes",
      "Identificar fortalezas clave y áreas de desarrollo",
      "Establecer objetivos SMART para el trimestre",
    ],
    activities: [
      {
        week: "Semana 1-2",
        tasks:
          completedTests < 3
            ? [
                "Completar 2 evaluaciones adicionales",
                "Revisar resultados con AI Coach",
                "Identificar patrones en el perfil",
              ]
            : ["Análisis profundo de resultados", "Sesiones de coaching con AI", "Definición de objetivos específicos"],
      },
      {
        week: "Semana 3-4",
        tasks: [
          "Crear plan de desarrollo personalizado",
          "Identificar recursos de aprendizaje",
          "Establecer métricas de progreso",
        ],
      },
    ] as Array<{ week: string; tasks: string[] }>,
    expectedOutcomes: [
      "Claridad completa sobre perfil profesional",
      "Objetivos específicos definidos",
      "Plan de acción detallado",
    ],
  } satisfies Phase)

  // Phase 2: Skill Development (Days 31-60)
  plan.phases.push({
    phase: 2,
    title: "Desarrollo de Habilidades Clave",
    duration: "Días 31-60",
    objectives: [
      "Desarrollar 2-3 habilidades prioritarias",
      "Aplicar aprendizajes en proyectos reales",
      "Buscar feedback y mentoría",
    ],
    activities: [
      {
        week: "Semana 5-6",
        tasks: [
          "Iniciar cursos o certificaciones relevantes",
          "Practicar habilidades en entorno controlado",
          "Buscar mentor o coach especializado",
        ],
      },
      {
        week: "Semana 7-8",
        tasks: [
          "Aplicar habilidades en proyectos actuales",
          "Solicitar feedback específico",
          "Ajustar enfoque basado en resultados",
        ],
      },
    ] as Array<{ week: string; tasks: string[] }>,
    expectedOutcomes: [
      "Mejora medible en habilidades objetivo",
      "Aplicación práctica exitosa",
      "Red de apoyo establecida",
    ],
  } satisfies Phase)

  // Phase 3: Integration and Growth (Days 61-90)
  plan.phases.push({
    phase: 3,
    title: "Integración y Crecimiento",
    duration: "Días 61-90",
    objectives: [
      "Integrar nuevas habilidades en rol actual",
      "Buscar oportunidades de liderazgo",
      "Planificar próximos pasos de carrera",
    ],
    activities: [
      {
        week: "Semana 9-10",
        tasks: [
          "Liderar proyecto o iniciativa",
          "Compartir conocimientos con equipo",
          "Documentar lecciones aprendidas",
        ],
      },
      {
        week: "Semana 11-12",
        tasks: [
          "Evaluar progreso contra objetivos",
          "Planificar siguiente ciclo de desarrollo",
          "Actualizar perfil profesional",
        ],
      },
    ] as Array<{ week: string; tasks: string[] }>,
    expectedOutcomes: [
      "Habilidades integradas en trabajo diario",
      "Reconocimiento por crecimiento",
      "Plan para próximo trimestre",
    ],
  } satisfies Phase)

  return plan
}

function generateSkillsAssessment(testResults: any[], hasSoftSkills: boolean) {
  if (!hasSoftSkills) {
    return {
      type: "warning",
      title: "Evaluación de Habilidades Blandas Pendiente",
      message:
        "Completa la evaluación de Habilidades Blandas para obtener un análisis detallado de tus competencias interpersonales y profesionales.",
      recommendedAction: "Realizar test de Habilidades Blandas",
      estimatedTime: "15-20 minutos",
    }
  }

  const softSkillsResult = testResults.find((r) => r.test_type === "soft-skills")
  const score = softSkillsResult?.score || 0

  return {
    type: "strength",
    title: "Evaluación de Habilidades Blandas",
    overallScore: score,
    level: score >= 80 ? "Avanzado" : score >= 60 ? "Intermedio" : "Básico",
    strengths: softSkillsResult?.results?.strengths || ["Comunicación efectiva", "Trabajo en equipo", "Adaptabilidad"],
    developmentAreas: softSkillsResult?.results?.areas_for_improvement || [
      "Gestión del tiempo",
      "Liderazgo",
      "Resolución de conflictos",
    ],
    recommendations: softSkillsResult?.results?.recommendations || [
      "Practicar presentaciones públicas",
      "Buscar oportunidades de liderazgo",
      "Desarrollar inteligencia emocional",
    ],
  }
}

function generateNextSteps(completedTests: number, testResults: any[]) {
  const steps = []

  if (completedTests < 2) {
    steps.push({
      priority: "Alta",
      action: "Completar evaluaciones adicionales",
      description: "Realiza al menos 2 evaluaciones más para obtener un perfil completo",
      timeframe: "Esta semana",
      impact: "Alto",
    })
  }

  if (completedTests >= 2) {
    steps.push({
      priority: "Alta",
      action: "Crear plan de desarrollo personalizado",
      description: "Usa tus resultados para diseñar un plan de crecimiento específico",
      timeframe: "Próximos 7 días",
      impact: "Alto",
    })
  }

  steps.push({
    priority: "Media",
    action: "Buscar mentoría especializada",
    description: "Conecta con un mentor que pueda guiar tu desarrollo profesional",
    timeframe: "Próximas 2 semanas",
    impact: "Alto",
  })

  steps.push({
    priority: "Media",
    action: "Aplicar insights en proyectos actuales",
    description: "Implementa las recomendaciones en tu trabajo diario",
    timeframe: "Continuo",
    impact: "Medio",
  })

  if (completedTests >= 3) {
    steps.push({
      priority: "Baja",
      action: "Compartir perfil con supervisor",
      description: "Discute tus resultados y plan de desarrollo con tu manager",
      timeframe: "Próximo mes",
      impact: "Medio",
    })
  }

  return steps
}

// Helper functions
function getTestName(type: string): string {
  const names = {
    disc: "DISC",
    "big-five": "Big Five",
    mbti: "MBTI",
    riasec: "RIASEC",
    "soft-skills": "Habilidades Blandas",
  }
  return names[type as keyof typeof names] || type
}

function getProfileLevel(score: number): string {
  if (score >= 85) return "Excepcional"
  if (score >= 75) return "Avanzado"
  if (score >= 65) return "Competente"
  if (score >= 50) return "En Desarrollo"
  return "Inicial"
}

function getNextLevel(score: number): string {
  if (score >= 85) return "Liderazgo Experto"
  if (score >= 75) return "Excepcional"
  if (score >= 65) return "Avanzado"
  if (score >= 50) return "Competente"
  return "En Desarrollo"
}

function getCompletionStatus(tests: number): string {
  if (tests >= 4) return "Perfil completo y detallado"
  if (tests >= 2) return "Perfil sólido con insights valiosos"
  if (tests === 1) return "Perfil inicial - se recomienda completar más evaluaciones"
  return "Perfil pendiente - completar evaluaciones"
}

function getPrimaryStrengths(testResults: any[]): string[] {
  // Extract strengths from test results or provide defaults
  const allStrengths = testResults.flatMap((result) => result.results?.strengths || [])

  if (allStrengths.length > 0) {
    return [...new Set(allStrengths)].slice(0, 5)
  }

  // Default strengths based on test types
  const strengths = []
  if (testResults.some((r) => r.test_type === "disc")) strengths.push("Comunicación efectiva", "Liderazgo natural")
  if (testResults.some((r) => r.test_type === "big-five")) strengths.push("Estabilidad emocional", "Apertura al cambio")
  if (testResults.some((r) => r.test_type === "riasec")) strengths.push("Claridad vocacional", "Intereses definidos")
  if (testResults.some((r) => r.test_type === "soft-skills"))
    strengths.push("Habilidades interpersonales", "Adaptabilidad")

  return strengths.length > 0
    ? strengths
    : [
        "Pensamiento analítico",
        "Orientación a resultados",
        "Capacidad de aprendizaje",
        "Trabajo en equipo",
        "Comunicación",
      ]
}

function getDevelopmentAreas(testResults: any[]): string[] {
  const allAreas = testResults.flatMap(
    (result) => result.results?.areas_for_improvement || result.results?.development_areas || [],
  )

  if (allAreas.length > 0) {
    return [...new Set(allAreas)].slice(0, 4)
  }

  return ["Gestión del tiempo", "Delegación efectiva", "Presentaciones públicas", "Networking estratégico"]
}

function getStrengthRecommendations(testResults: any[], avgScore: number): string[] {
  const recommendations = []

  if (avgScore >= 80) {
    recommendations.push("Buscar roles de liderazgo y mentoría")
    recommendations.push("Desarrollar expertise en áreas de fortaleza")
    recommendations.push("Compartir conocimientos con otros")
  } else if (avgScore >= 60) {
    recommendations.push("Fortalecer habilidades de comunicación")
    recommendations.push("Buscar oportunidades de crecimiento")
    recommendations.push("Desarrollar competencias técnicas específicas")
  } else {
    recommendations.push("Enfocarse en fundamentos de liderazgo")
    recommendations.push("Mejorar habilidades básicas de comunicación")
    recommendations.push("Buscar mentoría y coaching")
  }

  return recommendations
}

function getFallbackInsights() {
  return {
    executiveSummary: {
      title: "Perfil en Desarrollo",
      content:
        "Bienvenido a tu plataforma de desarrollo profesional. Para generar insights personalizados, completa algunas evaluaciones psicométricas.",
      confidence: 0,
      keyPoints: [
        "0 evaluaciones completadas",
        "Perfil pendiente de desarrollo",
        "Gran potencial de crecimiento",
        "Múltiples herramientas disponibles",
      ],
    },
    personalityInsights: [
      {
        type: "warning",
        title: "Evaluaciones Pendientes",
        description:
          "Completa evaluaciones como DISC, Big Five o MBTI para obtener insights detallados sobre tu personalidad y estilo de trabajo.",
        confidence: 0,
        priority: "low",
        category: "general",
        actionable: false,
      },
    ],
    careerMatches: [
      {
        role: "Múltiples opciones disponibles",
        compatibility: 0,
        description:
          "Una vez que completes las evaluaciones, podremos sugerir carreras específicas basadas en tu perfil.",
        requirements: ["Completar evaluaciones psicométricas"],
        growthPath: "Evaluaci��n → Análisis → Recomendaciones personalizadas",
      },
    ],
    strengthsAnalysis: {
      type: "warning",
      title: "Análisis Pendiente",
      primaryStrengths: ["Por determinar"],
      developmentAreas: ["Por evaluar"],
      recommendations: ["Completar evaluaciones para análisis detallado"],
    },
    developmentPlan: {
      title: "Plan de Desarrollo Inicial",
      currentLevel: "Por determinar",
      targetLevel: "Por definir",
      phases: [
        {
          phase: 1,
          title: "Evaluación Inicial",
          duration: "Próximos 7 días",
          objectives: ["Completar 2-3 evaluaciones psicométricas"],
          activities: [
            {
              week: "Esta semana",
              tasks: ["Realizar test DISC", "Completar evaluación RIASEC", "Revisar resultados"],
            },
          ],
          expectedOutcomes: ["Perfil profesional inicial", "Insights personalizados", "Plan de desarrollo específico"],
        },
      ],
    },
    skillsAssessment: {
      type: "warning",
      title: "Evaluación de Habilidades Pendiente",
      message: "Completa las evaluaciones para obtener un análisis detallado de tus habilidades.",
      recommendedAction: "Realizar evaluaciones psicométricas",
      estimatedTime: "30-45 minutos total",
    },
    nextSteps: [
      {
        priority: "Alta",
        action: "Completar primera evaluación",
        description: "Comienza con el test DISC o RIASEC para obtener tus primeros insights",
        timeframe: "Hoy",
        impact: "Alto",
      },
    ],
  }
}

// Additional helper functions for specific test interpretations
function getDiscStyle(result: any): string {
  return "equilibrado con tendencias hacia la colaboración y el análisis"
}

function getDiscStrengths(result: any): string {
  return "comunicación efectiva, trabajo en equipo y resolución de problemas"
}

function getDiscEnvironment(result: any): string {
  return "la colaboración, la innovación y el crecimiento profesional"
}

function getBigFiveHighlights(result: any): string {
  return "apertura a la experiencia, responsabilidad y estabilidad emocional"
}

function getBigFiveStrengths(result: any): string {
  return "aprendizaje continuo, organización y manejo del estrés"
}

function getBigFiveDevelopment(result: any): string {
  return "habilidades de networking y asertividad"
}

function getMbtiType(result: any): string {
  return result?.results?.type || "ENFJ"
}

function getMbtiPreferences(result: any): string {
  return "la colaboración, la intuición y la toma de decisiones basada en valores"
}

function getMbtiStrengths(result: any): string {
  return "liderazgo inspiracional, comunicación empática y visión estratégica"
}

function getMbtiEnergySource(result: any): string {
  return "interacción con personas y trabajo en proyectos significativos"
}

function getCareerMatchesByHollandCode(code: string, avgScore: number): any[] {
  const matches = {
    IEA: [
      {
        role: "Consultor de Innovación",
        compatibility: Math.min(0.95, 0.75 + avgScore * 0.02),
        description:
          "Tu código IEA indica una combinación perfecta de investigación, liderazgo empresarial y creatividad artística.",
        requirements: ["Pensamiento analítico", "Liderazgo", "Creatividad", "Comunicación"],
        growthPath: "Analyst → Senior Consultant → Innovation Director → Chief Innovation Officer",
      },
      {
        role: "Product Manager Tecnológico",
        compatibility: Math.min(0.92, 0.7 + avgScore * 0.025),
        description: "Ideal para liderar productos que requieren investigación profunda y visión creativa.",
        requirements: ["Gestión de productos", "Análisis técnico", "Liderazgo de equipos"],
        growthPath: "Associate PM → Product Manager → Senior PM → VP of Product",
      },
      {
        role: "Director de Estrategia",
        compatibility: Math.min(0.88, 0.65 + avgScore * 0.03),
        description: "Perfecto para roles que combinan análisis estratégico con liderazgo visionario.",
        requirements: ["Pensamiento estratégico", "Análisis de mercado", "Liderazgo ejecutivo"],
        growthPath: "Strategy Analyst → Strategy Manager → Director → Chief Strategy Officer",
      },
    ],
    EIA: [
      {
        role: "Emprendedor Tecnológico",
        compatibility: Math.min(0.94, 0.8 + avgScore * 0.015),
        description: "Tu perfil EIA es ideal para liderar startups que requieren innovación y análisis de mercado.",
        requirements: ["Liderazgo", "Análisis de negocio", "Innovación", "Gestión de riesgos"],
        growthPath: "Founder → CEO → Serial Entrepreneur → Venture Partner",
      },
      {
        role: "Director de Desarrollo de Negocio",
        compatibility: Math.min(0.9, 0.75 + avgScore * 0.02),
        description: "Excelente para identificar oportunidades de crecimiento y liderar expansión empresarial.",
        requirements: ["Desarrollo de negocio", "Análisis financiero", "Negociación"],
        growthPath: "Business Analyst → BD Manager → BD Director → Chief Business Officer",
      },
    ],
  }

  return matches[code as keyof typeof matches] || matches["IEA"]
}

function getProfileDescription(testResults: Array<{ test_type?: string }>, avgScore: number): string {
  const testTypes = testResults.map((r: { test_type?: string }) => r.test_type)

  if (testTypes.includes("riasec") && testTypes.includes("disc")) {
    return "Tu combinación de evaluaciones RIASEC y DISC revela un perfil de liderazgo con intereses vocacionales claros y habilidades de comunicación desarrolladas."
  }

  if (avgScore >= 80) {
    return "Demuestras un desempeño excepcional que te posiciona para roles de liderazgo y especialización avanzada."
  }

  if (avgScore >= 60) {
    return "Muestras un perfil sólido con potencial significativo para crecimiento en múltiples direcciones profesionales."
  }

  return "Tu perfil indica áreas de fortaleza emergentes con excelente potencial de desarrollo."
}

function getMainRecommendation(testResults: any[], avgScore: number): string {
  if (avgScore >= 80) {
    return "Enfócate en roles de liderazgo que te permitan aplicar tus fortalezas mientras desarrollas a otros."
  }

  if (avgScore >= 60) {
    return "Busca oportunidades que combinen tus fortalezas actuales con nuevos desafíos de crecimiento."
  }

  return "Concéntrate en desarrollar 2-3 habilidades clave que amplificarán tu impacto profesional."
}

function getInitialStrengths(testType: string): string {
  const strengths = {
    disc: "comunicación y liderazgo",
    "big-five": "estabilidad emocional y apertura",
    mbti: "procesamiento de información y toma de decisiones",
    riasec: "claridad vocacional e intereses definidos",
    "soft-skills": "competencias interpersonales",
  }

  return strengths[testType as keyof typeof strengths] || "múltiples áreas"
}
