import { generateText } from "ai"

interface PerformanceContext {
  c1_score: number
  c2_score: number
  c3_score: number
  c4_score: number
  test_results_summary?: Record<string, any>
  last_test_date?: string
}

interface CoachingMemory {
  goals: string[]
  challenges: string[]
  strengths: string[]
  areas_improvement: string[]
}

export interface SuggestedQuestion {
  id: string
  title: string
  question: string
  context: string
  linked_axis?: string
  icon?: string
}

export async function generateContextualSuggestions(
  userId: string,
  contextType: "dashboard" | "dtc" | "metas" | "simulaciones" | "coach" | "reports",
  performanceData?: PerformanceContext,
  coachingMemory?: CoachingMemory,
): Promise<SuggestedQuestion[]> {
  try {
    // Build context string for AI
    let contextString = `Eres un generador de preguntas motivacionales y contextuales.\n`
    contextString += `Contexto: El usuario está en la sección "${contextType}".\n`

    if (performanceData) {
      contextString += `\nSu performance actual:\n`
      contextString += `- Eje C1 (Claridad): ${performanceData.c1_score}/10\n`
      contextString += `- Eje C2 (Calma): ${performanceData.c2_score}/10\n`
      contextString += `- Eje C3 (Conexión): ${performanceData.c3_score}/10\n`
      contextString += `- Eje C4 (Crecimiento): ${performanceData.c4_score}/10\n`

      // Identify lowest axis
      const scores = [
        { axis: "C1", score: performanceData.c1_score },
        { axis: "C2", score: performanceData.c2_score },
        { axis: "C3", score: performanceData.c3_score },
        { axis: "C4", score: performanceData.c4_score },
      ].sort((a, b) => a.score - b.score)

      contextString += `\nÁrea de mayor oportunidad: ${scores[0].axis} (${scores[0].score}/10)\n`
    }

    if (coachingMemory && coachingMemory.goals.length > 0) {
      contextString += `\nSus objetivos mencionados en conversaciones previas:\n`
      coachingMemory.goals.slice(0, 3).forEach((goal) => {
        contextString += `- ${goal}\n`
      })
    }

    contextString += `\nGenera EXACTAMENTE 4 preguntas sugeridas que:\n`
    contextString += `1. Sean relevantes para el contexto actual\n`
    contextString += `2. Motiven al usuario a reflexionar o actuar\n`
    contextString += `3. Sean específicas y accionables\n`
    contextString += `4. Se retornen en formato JSON con estructura: [{"title": "string", "question": "string", "context": "string", "linked_axis": "c1|c2|c3|c4|null"}]\n`
    contextString += `Solo retorna el JSON, sin explicaciones adicionales.`

    const { text } = await generateText({
      model: "openai/gpt-4-mini",
      prompt: contextString,
      temperature: 0.7,
      maxTokens: 800,
    })

    // Parse response
    const parsed = JSON.parse(text)

    // Convert to SuggestedQuestion format
    const suggestions: SuggestedQuestion[] = parsed.map((q: any, index: number) => ({
      id: `suggestion-${Date.now()}-${index}`,
      title: q.title || q.question.substring(0, 50),
      question: q.question,
      context: q.context || contextType,
      linked_axis: q.linked_axis,
      icon: getIconForAxis(q.linked_axis),
    }))

    return suggestions
  } catch (error) {
    console.error("[v0] Error generating suggestions:", error)
    // Return fallback suggestions
    return getDefaultSuggestions(contextType)
  }
}

function getDefaultSuggestions(contextType: string): SuggestedQuestion[] {
  const defaults: Record<string, SuggestedQuestion[]> = {
    dashboard: [
      {
        id: "default-1",
        title: "Mejorar Claridad",
        question: "¿Cuál es tu principal objetivo para los próximos 7 días?",
        context: "dashboard",
        linked_axis: "c1",
        icon: "🎯",
      },
      {
        id: "default-2",
        title: "Gestionar Energía",
        question: "¿Qué actividades te generan más calma y enfoque?",
        context: "dashboard",
        linked_axis: "c2",
        icon: "⚡",
      },
      {
        id: "default-3",
        title: "Conexión",
        question: "¿Con quién necesitas conectar para avanzar?",
        context: "dashboard",
        linked_axis: "c3",
        icon: "🤝",
      },
      {
        id: "default-4",
        title: "Crecimiento",
        question: "¿Qué habilidad te gustaría desarrollar este mes?",
        context: "dashboard",
        linked_axis: "c4",
        icon: "📈",
      },
    ],
    dtc: [
      {
        id: "default-1",
        title: "Analizar Resultados",
        question: "¿Qué insights nuevos has descubierto en estos tests?",
        context: "dtc",
        linked_axis: "c1",
        icon: "📊",
      },
      {
        id: "default-2",
        title: "Plan de Acción",
        question: "¿Cuál es tu primer paso para mejorar en estos áreas?",
        context: "dtc",
        linked_axis: "c4",
        icon: "🚀",
      },
      {
        id: "default-3",
        title: "Seguimiento",
        question: "¿Cuándo te gustaría revisar tu progreso?",
        context: "dtc",
        linked_axis: null,
        icon: "📅",
      },
    ],
    metas: [
      {
        id: "default-1",
        title: "Definir Metas",
        question: "¿Cuáles son tus 3 metas principales?",
        context: "metas",
        linked_axis: "c4",
        icon: "🎯",
      },
      {
        id: "default-2",
        title: "Timeline",
        question: "¿En qué plazo quieres lograrlas?",
        context: "metas",
        linked_axis: null,
        icon: "⏱️",
      },
    ],
    simulaciones: [
      {
        id: "default-1",
        title: "Prepararse",
        question: "¿Cuál es el escenario más desafiante que esperas?",
        context: "simulaciones",
        linked_axis: "c2",
        icon: "🎬",
      },
    ],
  }

  return defaults[contextType] || defaults.dashboard
}

function getIconForAxis(axis?: string): string {
  switch (axis) {
    case "c1":
      return "🎯"
    case "c2":
      return "⚡"
    case "c3":
      return "🤝"
    case "c4":
      return "📈"
    default:
      return "💡"
  }
}
