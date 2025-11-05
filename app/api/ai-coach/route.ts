import { type NextRequest, NextResponse } from "next/server"
import {
  selectPersonality,
  generateStructuredResponse,
  COACH_PERSONALITIES,
  type CoachPersonality,
} from "@/lib/sofia-dani-prompts"

export async function POST(request: NextRequest) {
  console.log("[v0] AI Coach API - Request received")

  try {
    const body = await request.json()
    console.log("[v0] Request body parsed:", JSON.stringify(body, null, 2))

    const { message, userEmail, testResults, conversationHistory, context, preferredCoach } = body

    if (!message || typeof message !== "string") {
      console.error("[v0] Invalid message:", { message, type: typeof message })
      return NextResponse.json({ error: "Message is required and must be a string" }, { status: 400 })
    }

    console.log("[v0] Processing chat message for user:", userEmail, "isDemoMode:", context?.isDemoMode)

    const personality: CoachPersonality = preferredCoach || selectPersonality(message, context)
    const coachConfig = COACH_PERSONALITIES[personality === "auto" ? "sofia" : personality]

    console.log("[v0] Selected coach personality:", personality)

    const response = generateStructuredResponse(personality, message, {
      testResults,
      context,
      conversationHistory,
    })

    const suggestions = generatePersonalizedSuggestions(personality, message, testResults, context)

    const coachMetadata = {
      personality,
      tone: coachConfig.tone,
      role: coachConfig.role,
    }

    console.log("[v0] Returning response successfully with coach:", personality)

    return NextResponse.json({
      response,
      suggestions,
      coachMetadata,
      success: true,
    })
  } catch (error) {
    console.error("[v0] Error in AI coach API:", error)

    return NextResponse.json(
      {
        response: "Lo siento, hubo un error procesando tu consulta. Por favor, intenta reformular tu pregunta.",
        suggestions: [
          "¿Cuáles son mis fortalezas?",
          "¿Qué habilidades debo desarrollar?",
          "¿Cómo puedo mejorar mi carrera?",
        ],
        error: true,
      },
      { status: 500 },
    )
  }
}

function generatePersonalizedSuggestions(
  personality: CoachPersonality,
  message: string,
  testResults: any[],
  context: any,
): string[] {
  const lowerMessage = message.toLowerCase()
  const completedTests = testResults?.length || 0

  // Sugerencias de Sofia (más emocionales y de acompañamiento)
  if (personality === "sofia") {
    if (lowerMessage.includes("perdido") || lowerMessage.includes("confundido")) {
      return [
        "¿Quieres que conversemos sobre qué te hace sentir así?",
        "¿Te gustaría hacer un test de autoconocimiento juntos?",
        "¿Qué te gustaría estar haciendo en tu trabajo ideal?",
        "¿Puedo ayudarte a identificar tus fortalezas naturales?",
      ]
    }

    if (lowerMessage.includes("entrevista") || lowerMessage.includes("nervioso")) {
      return [
        "¿Quieres que practiquemos juntos la entrevista?",
        "¿Te ayudo a preparar respuestas para preguntas típicas?",
        "¿Conversamos sobre cómo manejar los nervios?",
        "¿Te gustaría simular una entrevista real?",
      ]
    }

    return [
      "¿En qué área te gustaría que te acompañe?",
      "¿Quieres que exploremos tus fortalezas juntos?",
      "¿Te ayudo a crear un plan de desarrollo personal?",
      "¿Conversamos sobre tus objetivos profesionales?",
    ]
  }

  // Sugerencias de Dani (más estratégicas y orientadas a acción)
  if (personality === "dani") {
    if (lowerMessage.includes("carrera") || lowerMessage.includes("cambiar")) {
      return [
        "¿Quieres que analicemos tus opciones de carrera?",
        "¿Te ayudo a crear un plan de transición profesional?",
        "¿Evaluamos tus habilidades transferibles?",
        "¿Analizamos el mercado laboral en tu área?",
      ]
    }

    if (lowerMessage.includes("cv") || lowerMessage.includes("linkedin")) {
      return [
        "¿Quieres que revise tu CV y te dé feedback específico?",
        "¿Te ayudo a optimizar tu perfil de LinkedIn?",
        "¿Analizamos qué keywords debes incluir?",
        "¿Creamos una estrategia de marca personal?",
      ]
    }

    return [
      "¿Quieres que creemos un plan de acción paso a paso?",
      "¿Te ayudo a definir objetivos SMART?",
      "¿Analizamos tu situación actual con datos?",
      "¿Evaluamos opciones y creamos una matriz de decisión?",
    ]
  }

  // Sugerencias por defecto
  return [
    "¿Qué aspecto de tu carrera quieres mejorar?",
    "¿Te gustaría hacer un test de autoconocimiento?",
    "¿Necesitas ayuda con tu CV o LinkedIn?",
    "¿Quieres prepararte para una entrevista?",
  ]
}
