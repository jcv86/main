import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, userProfile, conversationHistory, context } = body

    if (!message || !userProfile) {
      return NextResponse.json({ error: "Message and user profile are required" }, { status: 400 })
    }

    // Store user interaction
    await supabase.from("ai_interactions").insert({
      user_email: userProfile.email,
      message_type: "user",
      content: message,
      category: categorizeMessage(message),
      metadata: { context },
    })

    // Build comprehensive context for AI
    const aiContext = buildAIContext(userProfile, conversationHistory, context)

    // Generate AI response using GPT-4o
    const { text } = await generateText({
      model: openai("gpt-4o"),
      system: `Eres un AI Career Coach avanzado con memoria persistente y capacidades de personalización profunda.

PERFIL DEL USUARIO:
- Nombre: ${userProfile.name}
- Email: ${userProfile.email}
- Objetivos: ${userProfile.preferences.careerGoals.join(", ") || "Por definir"}
- Estilo de aprendizaje: ${userProfile.preferences.learningStyle}
- Nivel de habilidad: ${userProfile.preferences.skillLevel}
- Estilo de comunicación: ${userProfile.preferences.communicationStyle}

HISTORIAL DE CONVERSACIÓN:
- Total de mensajes: ${userProfile.conversationHistory.totalMessages}
- Temas de interés: ${userProfile.conversationHistory.topics.join(", ") || "Ninguno aún"}
- Tests completados: ${Object.keys(userProfile.testResults).length}/6

CONTEXTO ACTUAL:
${aiContext}

INSTRUCCIONES:
1. Usa SIEMPRE el nombre del usuario para personalizar la respuesta
2. Referencia su historial y preferencias específicas
3. Proporciona recomendaciones basadas en su perfil único
4. Mantén un tono motivacional y profesional
5. Incluye acciones específicas y medibles
6. Usa emojis estratégicamente para engagement
7. Estructura las respuestas con markdown para mejor legibilidad
8. Siempre incluye próximos pasos concretos

FORMATO DE RESPUESTA:
- Saludo personalizado con su nombre
- Contexto de su situación actual
- Recomendaciones específicas basadas en su perfil
- Acciones concretas a tomar
- Motivación y próximos pasos

Responde de manera que demuestre que recuerdas todo sobre este usuario y que cada respuesta está específicamente diseñada para él/ella.`,
      prompt: `Usuario: ${message}

Contexto adicional: El usuario ${userProfile.name} tiene ${userProfile.conversationHistory.totalMessages} mensajes previos conmigo. Sus objetivos son: ${userProfile.preferences.careerGoals.join(", ") || "por definir"}. Ha completado ${Object.keys(userProfile.testResults).length} tests psicométricos.

Proporciona una respuesta personalizada, específica y accionable que demuestre que recuerdas su perfil completo.`,
    })

    // Analyze response and generate suggested actions
    const suggestedActions = generateSuggestedActions(message, userProfile, text)

    // Determine confidence score based on available context
    const confidence = calculateConfidenceScore(userProfile, conversationHistory)

    // Identify what context was used
    const contextUsed = identifyContextUsed(userProfile, message)

    // Generate profile updates based on conversation
    const profileUpdates = generateProfileUpdates(message, userProfile, text)

    // Store AI response
    await supabase.from("ai_interactions").insert({
      user_email: userProfile.email,
      message_type: "assistant",
      content: text,
      category: categorizeMessage(message),
      metadata: {
        contextUsed,
        confidence,
        profileUpdates,
      },
      suggested_actions: suggestedActions,
      context_used: contextUsed,
      confidence_score: confidence,
    })

    return NextResponse.json({
      content: text,
      suggestedActions,
      contextUsed,
      confidence,
      profileUpdates,
    })
  } catch (error) {
    console.error("Error in AI coach conversation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

function categorizeMessage(message: string): string {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("test") || lowerMessage.includes("evaluación") || lowerMessage.includes("assessment")) {
    return "test"
  }
  if (lowerMessage.includes("libro") || lowerMessage.includes("leer") || lowerMessage.includes("lectura")) {
    return "book"
  }
  if (
    lowerMessage.includes("habilidad") ||
    lowerMessage.includes("skill") ||
    lowerMessage.includes("competencia") ||
    lowerMessage.includes("desarrollar")
  ) {
    return "skill"
  }
  if (
    lowerMessage.includes("carrera") ||
    lowerMessage.includes("trabajo") ||
    lowerMessage.includes("profesional") ||
    lowerMessage.includes("objetivo")
  ) {
    return "career"
  }

  return "general"
}

function buildAIContext(userProfile: any, conversationHistory: any[], context: any): string {
  const contextParts = []

  // User preferences context
  contextParts.push(`PREFERENCIAS DEL USUARIO:
- Estilo de comunicación preferido: ${userProfile.preferences.communicationStyle}
- Método de aprendizaje: ${userProfile.preferences.learningStyle}
- Disponibilidad de tiempo: ${userProfile.preferences.timeAvailability}
- Intereses: ${userProfile.preferences.interests.join(", ") || "Por explorar"}`)

  // Career context
  if (userProfile.careerProfile) {
    contextParts.push(`PERFIL PROFESIONAL:
- Experiencia: ${userProfile.careerProfile.experience}
- Industria: ${userProfile.careerProfile.industry || "No especificada"}
- Aspiraciones: ${userProfile.careerProfile.aspirations.join(", ") || "Por definir"}
- Gaps de habilidades: ${userProfile.careerProfile.skillGaps.join(", ") || "Por evaluar"}`)
  }

  // Test results context
  if (Object.keys(userProfile.testResults).length > 0) {
    contextParts.push(`EVALUACIONES COMPLETADAS:
${Object.entries(userProfile.testResults)
  .map(([test, result]: [string, any]) => `- ${test}: Completado el ${result.completedAt} (Score: ${result.score})`)
  .join("\n")}`)
  }

  // Recent conversation context
  if (conversationHistory && conversationHistory.length > 0) {
    const recentMessages = conversationHistory.slice(-3)
    contextParts.push(`CONVERSACIÓN RECIENTE:
${recentMessages.map((msg: any) => `${msg.type}: ${msg.content.substring(0, 100)}...`).join("\n")}`)
  }

  return contextParts.join("\n\n")
}

function generateSuggestedActions(message: string, userProfile: any, aiResponse: string): any[] {
  const actions = []
  const category = categorizeMessage(message)

  // Generate actions based on message category and user profile
  if (category === "test") {
    const completedTests = Object.keys(userProfile.testResults)
    const allTests = ["disc", "big-five", "mbti", "riasec", "emotional-intelligence", "soft-skills"]
    const nextTest = allTests.find((test) => !completedTests.includes(test))

    if (nextTest) {
      actions.push({
        id: `start-${nextTest}`,
        text: `Comenzar Test ${nextTest.toUpperCase()}`,
        action: "navigate",
        target: `/test/${nextTest}`,
        priority: "high",
        icon: "Brain",
      })
    }
  }

  if (category === "career") {
    actions.push({
      id: "career-planning",
      text: "Crear plan de carrera personalizado",
      action: "ask",
      priority: "high",
      icon: "Target",
    })
  }

  if (category === "skill") {
    actions.push({
      id: "skill-assessment",
      text: "Evaluar habilidades actuales",
      action: "navigate",
      target: "/test/soft-skills",
      priority: "medium",
      icon: "Award",
    })
  }

  // Always include a follow-up question
  actions.push({
    id: "follow-up",
    text: "¿Qué más te gustaría saber?",
    action: "ask",
    priority: "low",
    icon: "MessageCircle",
  })

  return actions.slice(0, 4) // Limit to 4 actions
}

function calculateConfidenceScore(userProfile: any, conversationHistory: any[]): number {
  let confidence = 0.5 // Base confidence

  // Increase confidence based on available data
  if (userProfile.preferences.careerGoals.length > 0) confidence += 0.1
  if (Object.keys(userProfile.testResults).length > 0) confidence += 0.2
  if (userProfile.conversationHistory.totalMessages > 5) confidence += 0.1
  if (conversationHistory && conversationHistory.length > 0) confidence += 0.1

  return Math.min(confidence, 1.0)
}

function identifyContextUsed(userProfile: any, message: string): string[] {
  const contextUsed = ["profile"]

  if (userProfile.conversationHistory.totalMessages > 0) {
    contextUsed.push("history")
  }

  if (Object.keys(userProfile.testResults).length > 0) {
    contextUsed.push("test-results")
  }

  if (userProfile.preferences.careerGoals.length > 0) {
    contextUsed.push("goals")
  }

  const category = categorizeMessage(message)
  contextUsed.push(category)

  return contextUsed
}

function generateProfileUpdates(message: string, userProfile: any, aiResponse: string): any {
  const updates: any = {}

  // Update conversation history
  const newTopics = [...new Set([...userProfile.conversationHistory.topics, categorizeMessage(message)])]

  updates.conversationHistory = {
    ...userProfile.conversationHistory,
    totalMessages: userProfile.conversationHistory.totalMessages + 1,
    topics: newTopics,
    lastActive: new Date().toISOString(),
  }

  // Extract potential goals from message
  const lowerMessage = message.toLowerCase()
  if (lowerMessage.includes("quiero") || lowerMessage.includes("objetivo") || lowerMessage.includes("meta")) {
    // This could be enhanced with NLP to extract actual goals
    // For now, we'll just note that goals were discussed
    if (!userProfile.conversationHistory.topics.includes("goals")) {
      updates.conversationHistory.topics = [...newTopics, "goals"]
    }
  }

  return updates
}
