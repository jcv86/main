import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase"
import { OPENAI_API_KEY } from "@/lib/config"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, userProfile, conversationHistory, context } = body

    if (!message || !userProfile) {
      return NextResponse.json({ error: "Message and user profile are required" }, { status: 400 })
    }

    const supabase = await createClient()

    // Save user message to database
    await supabase.from("ai_conversations").insert({
      user_email: userProfile.email,
      message_type: "user",
      content: message,
      category: categorizeMessage(message),
      metadata: { context },
    })

    // Build comprehensive context for AI
    const aiContext = buildAIContext(userProfile, conversationHistory, context)

    const aiResponse = await generateRealAIResponse(message, userProfile, aiContext)

    // Generate suggested actions based on user profile and message
    const suggestedActions = generateSuggestedActions(message, userProfile, aiResponse)

    // Calculate confidence score
    const confidence = calculateConfidenceScore(userProfile, conversationHistory)

    // Identify context used
    const contextUsed = identifyContextUsed(userProfile, message)

    // Save AI response to database
    await supabase.from("ai_conversations").insert({
      user_email: userProfile.email,
      message_type: "assistant",
      content: aiResponse,
      category: categorizeMessage(message),
      suggested_actions: suggestedActions,
      metadata: {
        contextUsed,
        confidence,
        userCategory: userProfile.userCategory,
      },
    })

    // Update user's conversation history
    const updatedHistory = {
      ...userProfile.conversationHistory,
      totalMessages: (userProfile.conversationHistory?.totalMessages || 0) + 2, // +2 for user and assistant messages
      topics: [...new Set([...(userProfile.conversationHistory?.topics || []), categorizeMessage(message)])],
      lastActive: new Date().toISOString(),
    }

    await supabase.from("user_profiles").update({ conversation_history: updatedHistory }).eq("email", userProfile.email)

    return NextResponse.json({
      content: aiResponse,
      suggestedActions,
      contextUsed,
      confidence,
      category: categorizeMessage(message),
      userCategory: userProfile.userCategory,
    })
  } catch (error) {
    console.error("Error in AI coach conversation:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

async function generateRealAIResponse(message: string, userProfile: any, context: string): Promise<string> {
  const apiKey = OPENAI_API_KEY

  if (!apiKey) {
    console.error("OpenAI API key not configured")
    return "Lo siento, el servicio de AI Coach no está disponible en este momento. Por favor, contacta al administrador."
  }

  try {
    const userName = userProfile.name || "Usuario"
    const userCategory = userProfile.userCategory || "standard"
    const categoryBadge = getCategoryBadge(userCategory)

    const systemPrompt = `Eres un AI Career Coach profesional y empático especializado en desarrollo profesional y orientación de carrera.

CONTEXTO DEL USUARIO:
- Nombre: ${userName}
- Categoría: ${categoryBadge}
- Perfil: ${JSON.stringify(userProfile, null, 2)}

${context}

INSTRUCCIONES:
- Proporciona consejos personalizados basados en el perfil del usuario
- Sé específico, práctico y accionable
- Usa un tono profesional pero cercano
- Incluye ejemplos concretos cuando sea relevante
- Estructura tus respuestas con emojis y formato claro
- Adapta el nivel de profundidad según la categoría del usuario (${userCategory})
- Siempre termina con una pregunta para continuar la conversación

FORMATO DE RESPUESTA:
- Usa emojis relevantes para secciones
- Estructura con títulos claros
- Incluye listas con bullets
- Proporciona pasos accionables numerados
- Mantén un tono motivador y constructivo`

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || "Lo siento, no pude generar una respuesta en este momento."
  } catch (error) {
    console.error("Error calling OpenAI API:", error)
    return "Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta nuevamente."
  }
}

function categorizeMessage(message: string): string {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("test") || lowerMessage.includes("evaluación") || lowerMessage.includes("assessment")) {
    return "evaluación"
  }
  if (lowerMessage.includes("libro") || lowerMessage.includes("leer") || lowerMessage.includes("lectura")) {
    return "lectura"
  }
  if (
    lowerMessage.includes("habilidad") ||
    lowerMessage.includes("skill") ||
    lowerMessage.includes("competencia") ||
    lowerMessage.includes("desarrollar")
  ) {
    return "habilidades"
  }
  if (
    lowerMessage.includes("carrera") ||
    lowerMessage.includes("trabajo") ||
    lowerMessage.includes("profesional") ||
    lowerMessage.includes("objetivo")
  ) {
    return "carrera"
  }
  if (lowerMessage.includes("liderazgo") || lowerMessage.includes("líder") || lowerMessage.includes("gestión")) {
    return "liderazgo"
  }

  return "general"
}

function buildAIContext(userProfile: any, conversationHistory: any[], context: any): string {
  const contextParts = []

  // User preferences context
  if (userProfile.preferences) {
    contextParts.push(`PREFERENCIAS:
- Comunicación: ${userProfile.preferences.communicationStyle}
- Aprendizaje: ${userProfile.preferences.learningStyle}
- Disponibilidad: ${userProfile.preferences.timeAvailability}
- Intereses: ${userProfile.preferences.interests?.join(", ") || "Por explorar"}`)
  }

  // Career context
  if (userProfile.careerProfile) {
    contextParts.push(`PERFIL PROFESIONAL:
- Rol actual: ${userProfile.careerProfile.currentRole || "No especificado"}
- Industria: ${userProfile.careerProfile.industry || "No especificada"}
- Aspiraciones: ${userProfile.careerProfile.aspirations?.join(", ") || "Por definir"}
- Gaps de habilidades: ${userProfile.careerProfile.skillGaps?.join(", ") || "Por evaluar"}`)
  }

  // Learning context
  if (userProfile.learningProfile) {
    contextParts.push(`PERFIL DE APRENDIZAJE:
- Libros completados: ${userProfile.learningProfile.completedBooks?.length || 0}
- Leyendo actualmente: ${userProfile.learningProfile.currentReading?.join(", ") || "Ninguno"}
- Ritmo preferido: ${userProfile.learningProfile.learningPace}`)
  }

  // Recent conversation context
  if (conversationHistory && conversationHistory.length > 0) {
    const recentMessages = conversationHistory.slice(-3)
    contextParts.push(`CONVERSACIÓN RECIENTE:
${recentMessages.map((msg: any) => `${msg.type}: ${msg.content.substring(0, 100)}...`).join("\n")}`)
  }

  return contextParts.join("\n\n")
}

function generateSuggestedActions(message: string, userProfile: any, aiResponse: string): string[] {
  const actions = []
  const category = categorizeMessage(message)
  const userCategory = userProfile.userCategory || "standard"

  // Category-specific actions
  if (category === "evaluación") {
    actions.push("Ver tests disponibles", "Comenzar evaluación DISC", "Analizar mis resultados")
  } else if (category === "carrera") {
    actions.push("Crear plan de carrera", "Analizar brechas de habilidades", "Explorar oportunidades")
  } else if (category === "liderazgo") {
    actions.push("Desarrollar liderazgo", "Estrategias de comunicación", "Gestión de equipos")
  } else if (category === "habilidades") {
    actions.push("Evaluar habilidades", "Plan de desarrollo", "Recursos de aprendizaje")
  } else if (category === "lectura") {
    actions.push("Recomendar libros", "Ver biblioteca", "Seguimiento de lectura")
  }

  // User category specific actions
  if (userCategory === "premium") {
    actions.push("Consultoría personalizada", "Recursos premium")
  } else if (userCategory === "enterprise") {
    actions.push("Estrategia empresarial", "Transformación digital")
  }

  // Always include a follow-up
  actions.push("¿Qué más puedo ayudarte?")

  return actions.slice(0, 4) // Limit to 4 actions
}

function calculateConfidenceScore(userProfile: any, conversationHistory: any[]): number {
  let confidence = 0.5 // Base confidence

  // Increase confidence based on available data
  if (userProfile.preferences?.careerGoals?.length > 0) confidence += 0.1
  if (userProfile.personalityInsights?.strengths?.length > 0) confidence += 0.2
  if ((userProfile.conversationHistory?.totalMessages || 0) > 5) confidence += 0.1
  if (conversationHistory && conversationHistory.length > 0) confidence += 0.1
  if (userProfile.userCategory === "premium" || userProfile.userCategory === "enterprise") confidence += 0.1

  return Math.min(confidence, 1.0)
}

function identifyContextUsed(userProfile: any, message: string): string[] {
  const contextUsed = ["profile"]

  if ((userProfile.conversationHistory?.totalMessages || 0) > 0) {
    contextUsed.push("history")
  }

  if (userProfile.personalityInsights?.strengths?.length > 0) {
    contextUsed.push("personality")
  }

  if (userProfile.preferences?.careerGoals?.length > 0) {
    contextUsed.push("goals")
  }

  if (userProfile.learningProfile?.completedBooks?.length > 0) {
    contextUsed.push("learning")
  }

  contextUsed.push(categorizeMessage(message))
  contextUsed.push(userProfile.userCategory || "standard")

  return contextUsed
}

function getCategoryBadge(category: string): string {
  switch (category) {
    case "premium":
      return "Premium 👑"
    case "enterprise":
      return "Enterprise 🏢"
    default:
      return "Estándar"
  }
}
