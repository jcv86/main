import { type NextRequest, NextResponse } from "next/server"
import {
  getConversationHistory,
  saveMessage,
  generateCoachResponse,
  startNewSession,
  getUserSessions,
} from "@/lib/ai-coach"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, conversationHistory = [], userId, sessionId, action } = body

    console.log("POST request received:", {
      action,
      hasMessage: !!message,
      hasSessionId: !!sessionId,
      hasUserId: !!userId,
    })

    // Create Supabase client for auth
    const supabase = createRouteHandlerClient({ cookies })

    // Get current user from auth
    let currentUserId = userId
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user?.id) {
        currentUserId = user.id
      }
    } catch (error) {
      console.log("No authenticated user found")
    }

    // Handle different actions
    if (action === "new_session") {
      if (!currentUserId) {
        return NextResponse.json({ error: "User authentication required for new session" }, { status: 401 })
      }

      const newSessionId = await startNewSession(currentUserId)
      return NextResponse.json({
        sessionId: newSessionId,
        response:
          "¡Hola! Soy tu AI Career Coach personalizado para el mercado laboral chileno. Estoy aquí para ayudarte con tu desarrollo profesional, búsqueda de empleo, y crecimiento de carrera. ¿En qué puedo asistirte hoy?",
      })
    }

    if (action === "get_sessions") {
      if (!currentUserId) {
        return NextResponse.json({ sessions: [] })
      }

      const sessions = await getUserSessions(currentUserId)
      return NextResponse.json({ sessions })
    }

    // Default chat action
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Generate response
    let response: string

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      // Return a demo response when API key is not available
      const demoResponses = [
        "¡Hola! Soy tu AI Career Coach. Aunque estoy en modo demo, puedo ayudarte con consejos generales sobre desarrollo profesional en Chile. ¿En qué área te gustaría enfocar tu carrera?",
        "Entiendo que buscas orientación profesional. Para el mercado chileno, te recomiendo enfocarte en desarrollar habilidades técnicas como JavaScript, Python o AWS. Empresas como NotCo y Fintual están creciendo rápidamente.",
        "Para el mercado laboral chileno, es importante mantenerse actualizado con las tendencias tecnológicas. Te sugiero explorar oportunidades en startups como Buk, Betterfly o Chiper. ¿Te gustaría que hablemos sobre estrategias específicas?",
        "El networking es fundamental en Chile. Te sugiero participar en eventos como 9punto5, mantener un perfil activo en LinkedIn, y considerar portales especializados como GetOnBoard. ¿Necesitas ayuda con algún aspecto específico?",
      ]

      response = demoResponses[Math.floor(Math.random() * demoResponses.length)]
    } else {
      // Use AI to generate response
      response = await generateCoachResponse(message, conversationHistory)
    }

    // Save messages if we have a userId and sessionId
    if (currentUserId && sessionId) {
      await saveMessage(currentUserId, "user", message, sessionId)
      await saveMessage(currentUserId, "assistant", response, sessionId)
    }

    return NextResponse.json({
      response,
      isDemo: !process.env.OPENAI_API_KEY,
      sessionId,
    })
  } catch (error) {
    console.error("Career Coach API Error:", error)

    // Return a helpful fallback response
    const fallbackResponse =
      "Disculpa, estoy experimentando dificultades técnicas en este momento. Mientras tanto, te sugiero revisar tu perfil profesional y considerar qué habilidades te gustaría desarrollar para el mercado chileno. ¿Hay algo específico en lo que pueda ayudarte de manera general?"

    return NextResponse.json({
      response: fallbackResponse,
      isDemo: true,
      error: "Temporary service unavailable",
    })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const action = searchParams.get("action")

    console.log("GET request received:", { action, userId })

    // Create Supabase client for auth
    const supabase = createRouteHandlerClient({ cookies })

    // Get current user from auth
    let currentUserId = userId
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user?.id) {
        currentUserId = user.id
      }
    } catch (error) {
      console.log("No authenticated user found")
    }

    if (action === "sessions" && currentUserId) {
      const sessions = await getUserSessions(currentUserId)
      return NextResponse.json({ sessions })
    }

    // Get conversation history
    const conversationHistory = await getConversationHistory(currentUserId || undefined)

    return NextResponse.json({
      messages: conversationHistory.messages.map((msg) => ({
        id: msg.id,
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp.toISOString(),
      })),
      sessionId: conversationHistory.sessionId,
    })
  } catch (error) {
    console.error("Error in GET career coach API:", error)

    // Return default welcome message
    const welcomeMessage = {
      messages: [
        {
          id: "1",
          role: "assistant",
          content:
            "¡Hola! Soy tu AI Career Coach personalizado para el mercado laboral chileno. Estoy aquí para ayudarte con tu desarrollo profesional, búsqueda de empleo, y crecimiento de carrera. ¿En qué puedo asistirte hoy?",
          timestamp: new Date().toISOString(),
        },
      ],
      sessionId: "demo-session",
    }

    return NextResponse.json(welcomeMessage)
  }
}
