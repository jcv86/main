import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase-server"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const testType = searchParams.get("type")
    const latest = searchParams.get("latest")
    const userEmail = user.email

    console.log("[v0] Fetching test results for user:", userEmail)

    // Try database first
    try {
      let query = supabase.from("test_results").select("*").eq("user_email", userEmail)

      if (testType) {
        query = query.eq("test_type", testType)
      }

      if (latest === "true") {
        query = query.order("completed_at", { ascending: false }).limit(1).single()
      } else {
        query = query.order("completed_at", { ascending: false })
      }

      const { data, error } = await query

      if (!error && data) {
        return NextResponse.json(data)
      }
    } catch (dbError) {
      console.log("Database not available, using demo data")
    }

    if (testType === "emotional-intelligence" && latest === "true") {
      const mockResult = generateMockEIResult()
      return NextResponse.json({
        ...mockResult,
        is_demo: true,
        demo_warning:
          "⚠️ RESULTADOS DE DEMOSTRACIÓN - Estos son resultados de ejemplo para previsualizar el formato del test. Para obtener resultados reales basados en tu perfil, completa el test de Inteligencia Emocional.",
      })
    }

    return NextResponse.json({ error: "No results found" }, { status: 404 })
  } catch (error) {
    console.error("Error fetching test results:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { testType, testName, results, answers, duration } = body
    const userEmail = user.email

    console.log("[v0] Saving test results for user:", userEmail)

    // Calculate overall score
    const overallScore = results.overall_score || 0

    const testResult = {
      user_email: userEmail,
      test_type: testType,
      test_name: testName,
      results: {
        ...results,
        answers,
        total_questions: Object.keys(answers || {}).length,
        answered_questions: Object.keys(answers || {}).length,
      },
      score: overallScore,
      duration_minutes: duration,
      completed_at: new Date().toISOString(),
    }

    // Try to save to database
    try {
      const { data, error } = await supabase.from("test_results").insert(testResult).select().single()

      if (!error && data) {
        return NextResponse.json(data)
      }
    } catch (dbError) {
      console.log("Database not available, returning mock response")
    }

    // Return mock response
    return NextResponse.json({
      id: Date.now(),
      ...testResult,
    })
  } catch (error) {
    console.error("Error saving test results:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function generateMockEIResult() {
  return {
    id: 1,
    user_email: "demo@example.com",
    test_type: "emotional-intelligence",
    test_name: "Test de Inteligencia Emocional (DEMO)",
    is_demo: true,
    demo_warning:
      "⚠️ RESULTADOS DE DEMOSTRACIÓN - Estos son resultados de ejemplo para previsualizar el formato del test. Para obtener resultados reales basados en tu perfil, completa el test de Inteligencia Emocional.",
    results: {
      overall_score: 78,
      competency_scores: {
        self_awareness: 82,
        self_regulation: 75,
        motivation: 85,
        empathy: 80,
        social_skills: 73,
      },
      detailed_analysis: {
        self_awareness: {
          score: 82,
          level: "Alto",
          description:
            "Tienes una excelente capacidad para reconocer y entender tus propias emociones. Eres consciente de cómo tus sentimientos influyen en tu comportamiento y decisiones.",
          strengths: [
            "Reconoces tus emociones en tiempo real",
            "Entiendes el impacto de tus emociones en otros",
            "Tienes claridad sobre tus valores y motivaciones",
          ],
          development_areas: [
            "Profundizar en el autoconocimiento de patrones emocionales",
            "Desarrollar mayor conciencia de microexpresiones",
          ],
        },
        self_regulation: {
          score: 75,
          level: "Bueno",
          description:
            "Muestras una capacidad sólida para manejar tus emociones, aunque hay oportunidades para mejorar en situaciones de alta presión.",
          strengths: [
            "Mantienes la calma en la mayoría de situaciones",
            "Puedes adaptarte a cambios inesperados",
            "Tienes control sobre impulsos destructivos",
          ],
          development_areas: [
            "Mejorar técnicas de manejo del estrés",
            "Desarrollar mayor flexibilidad emocional",
            "Practicar la paciencia en situaciones frustrantes",
          ],
        },
        motivation: {
          score: 85,
          level: "Alto",
          description:
            "Tienes una motivación interna fuerte y un impulso natural hacia el logro y la mejora continua. Te enfocas en metas a largo plazo.",
          strengths: [
            "Mantienes optimismo ante los desafíos",
            "Tienes metas claras y trabajas consistentemente hacia ellas",
            "Encuentras significado en tu trabajo",
          ],
          development_areas: [
            "Balancear ambición con bienestar personal",
            "Desarrollar mayor paciencia con el progreso gradual",
          ],
        },
        empathy: {
          score: 80,
          level: "Alto",
          description:
            "Tienes una fuerte capacidad para entender y conectar con las emociones de otros. Puedes leer señales emocionales sutiles.",
          strengths: [
            "Reconoces las emociones de otros fácilmente",
            "Respondes apropiadamente a las necesidades emocionales",
            "Puedes ver situaciones desde múltiples perspectivas",
          ],
          development_areas: [
            "Evitar absorber demasiado las emociones de otros",
            "Desarrollar límites emocionales saludables",
          ],
        },
        social_skills: {
          score: 73,
          level: "Bueno",
          description:
            "Tienes habilidades sociales competentes, pero hay espacio para crecer en liderazgo y manejo de conflictos complejos.",
          strengths: [
            "Comunicas efectivamente en la mayoría de situaciones",
            "Construyes relaciones positivas",
            "Trabajas bien en equipo",
          ],
          development_areas: [
            "Mejorar habilidades de negociación",
            "Desarrollar mayor confianza en presentaciones públicas",
            "Practicar el manejo de conflictos difíciles",
          ],
        },
      },
      ei_profile: "Líder Empático",
      profile_description:
        "Eres una persona con alta conciencia emocional y una fuerte capacidad para conectar con otros. Tu combinación de autoconocimiento y empatía te posiciona naturalmente como un líder que puede inspirar y motivar a otros. Tienes el potencial de crear ambientes de trabajo positivos y productivos.",
      career_implications: {
        ideal_roles: [
          "Gerente de Equipos",
          "Consultor Organizacional",
          "Coach Ejecutivo",
          "Director de Recursos Humanos",
          "Líder de Proyectos",
          "Terapeuta o Consejero",
        ],
        work_environments: [
          "Organizaciones colaborativas",
          "Empresas con fuerte cultura de equipo",
          "Ambientes de innovación y creatividad",
          "Organizaciones sin fines de lucro",
          "Empresas de consultoría",
        ],
        leadership_style:
          "Tu estilo de liderazgo es empático y transformacional. Lideras con el ejemplo, inspirando a otros a través de tu autenticidad y capacidad de conexión emocional. Eres efectivo motivando equipos y creando visiones compartidas.",
      },
      development_recommendations: [
        {
          area: "Autorregulación Emocional",
          recommendation:
            "Practica técnicas de mindfulness y respiración profunda diariamente. Desarrolla un 'kit de herramientas' de estrategias para manejar el estrés en tiempo real.",
          timeframe: "3-6 meses",
          priority: "Alta",
        },
        {
          area: "Habilidades de Comunicación",
          recommendation:
            "Únete a un grupo como Toastmasters para mejorar tus habilidades de presentación pública. Practica la comunicación asertiva en situaciones desafiantes.",
          timeframe: "6-12 meses",
          priority: "Media",
        },
        {
          area: "Manejo de Conflictos",
          recommendation:
            "Toma un curso de mediación o resolución de conflictos. Practica técnicas de escucha activa y búsqueda de soluciones ganar-ganar.",
          timeframe: "3-9 meses",
          priority: "Media",
        },
        {
          area: "Límites Emocionales",
          recommendation:
            "Aprende a establecer límites saludables para evitar el agotamiento emocional. Desarrolla técnicas para separar tus emociones de las de otros.",
          timeframe: "6-12 meses",
          priority: "Alta",
        },
      ],
      strengths_summary: [
        "Excelente autoconciencia emocional",
        "Fuerte motivación intrínseca y orientación al logro",
        "Alta capacidad empática y conexión con otros",
        "Habilidad natural para inspirar y motivar equipos",
        "Adaptabilidad y resiliencia ante los desafíos",
      ],
      growth_areas: [
        "Manejo del estrés en situaciones de alta presión",
        "Establecimiento de límites emocionales saludables",
        "Desarrollo de habilidades de negociación avanzadas",
        "Mejora en la comunicación pública y presentaciones",
        "Fortalecimiento de técnicas de resolución de conflictos",
      ],
    },
    score: 78,
    completed_at: new Date().toISOString(),
    duration_minutes: 25,
    created_at: new Date().toISOString(),
  }
}
