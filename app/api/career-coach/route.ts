import { type NextRequest, NextResponse } from "next/server"
import {
  getConversationHistory,
  saveMessage,
  generateCoachResponse,
  startNewSession,
  getUserSessions,
  searchConversations,
} from "@/lib/ai-coach"
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, conversationHistory = [], userId, sessionId, action, query, limit } = body

    console.log("POST request received:", {
      action,
      hasMessage: !!message,
      hasSessionId: !!sessionId,
      hasUserId: !!userId,
      hasQuery: !!query,
    })

    // Create Supabase client for auth
    const supabase = createRouteHandlerClient({ cookies })

    // Get current user from auth (but don't require it for demo mode)
    let currentUserId = userId
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (user?.id) {
        currentUserId = user.id
      }
      // Don't throw error if no user - allow demo mode
    } catch (error) {
      console.log("No authenticated user found, continuing in demo mode")
    }

    // Handle different actions
    if (action === "new_session" || action === "new-session") {
      if (!currentUserId) {
        // For demo mode, return a demo session ID
        const demoSessionId = `demo-session-${Date.now()}`
        return NextResponse.json({
          sessionId: demoSessionId,
          response:
            "¡Hola! Soy tu AI Career Coach personalizado para el mercado laboral chileno. Estoy aquí para ayudarte con tu desarrollo profesional, búsqueda de empleo, y crecimiento de carrera. ¿En qué puedo asistirte hoy?",
        })
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

    if (action === "search" || action === "voice-search") {
      if (!currentUserId) {
        return NextResponse.json({
          results: [],
          totalCount: 0,
          query: query || "",
          message: "Inicia sesión para buscar en tu historial",
        })
      }

      if (!query || typeof query !== "string") {
        return NextResponse.json({ error: "Search query is required" }, { status: 400 })
      }

      const searchResults = await searchConversations(currentUserId, query, limit || 20, sessionId)

      return NextResponse.json({
        ...searchResults,
        searchType: action === "voice-search" ? "voice" : "text",
        voiceQuery: action === "voice-search" ? query : undefined,
      })
    }

    // Default chat action
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    // Generate response
    let response: string
    let finalSessionId = sessionId

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

      // Generate demo session ID if none provided
      if (!finalSessionId) {
        finalSessionId = `demo-session-${Date.now()}`
      }
    } else {
      // Use AI to generate response
      response = await generateCoachResponse(message, conversationHistory)

      // Generate session ID if none provided
      if (!finalSessionId && currentUserId) {
        finalSessionId = await startNewSession(currentUserId)
      } else if (!finalSessionId) {
        finalSessionId = `demo-session-${Date.now()}`
      }
    }

    // Save messages if we have a userId and sessionId
    if (currentUserId && finalSessionId && !finalSessionId.startsWith("demo-")) {
      try {
        await saveMessage(currentUserId, "user", message, finalSessionId)
        await saveMessage(currentUserId, "assistant", response, finalSessionId)
      } catch (error) {
        console.error("Error saving messages:", error)
        // Continue without saving in demo mode
      }
    }

    return NextResponse.json({
      response,
      isDemo: !process.env.OPENAI_API_KEY || !currentUserId,
      sessionId: finalSessionId,
      timestamp: new Date().toISOString(),
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
      sessionId: `demo-session-${Date.now()}`,
      timestamp: new Date().toISOString(),
    })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("userId")
    const action = searchParams.get("action")
    const query = searchParams.get("query")
    const sessionId = searchParams.get("sessionId")
    const limit = searchParams.get("limit")

    console.log("GET request received:", { action, userId, query, sessionId })

    // Create Supabase client for auth
    const supabase = createRouteHandlerClient({ cookies })

    // Get current user from auth (but don't require it)
    let currentUserId = userId
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (user?.id) {
        currentUserId = user.id
      }
      // Don't throw error if no user - allow demo mode
    } catch (error) {
      console.log("No authenticated user found, continuing in demo mode")
    }

    if (action === "sessions" && currentUserId) {
      const sessions = await getUserSessions(currentUserId)
      return NextResponse.json({ sessions })
    }

    if (action === "search" && query) {
      if (!currentUserId) {
        return NextResponse.json({
          results: [],
          totalCount: 0,
          query: query,
          message: "Inicia sesión para buscar en tu historial",
        })
      }

      const searchResults = await searchConversations(
        currentUserId,
        query,
        limit ? Number.parseInt(limit) : 20,
        sessionId || undefined,
      )
      return NextResponse.json(searchResults)
    }

    // Get conversation history
    if (currentUserId) {
      const conversationHistory = await getConversationHistory(currentUserId, sessionId || undefined)
      return NextResponse.json(conversationHistory)
    } else {
      // Return demo welcome message for non-authenticated users
      const demoSessionId = `demo-session-${Date.now()}`
      return NextResponse.json({
        messages: [
          {
            id: "1",
            role: "assistant",
            content:
              "¡Hola! Soy tu AI Career Coach personalizado para el mercado laboral chileno. Estoy aquí para ayudarte con tu desarrollo profesional, búsqueda de empleo, y crecimiento de carrera. ¿En qué puedo asistirte hoy?",
            timestamp: new Date(),
            session_id: demoSessionId,
          },
        ],
        sessionId: demoSessionId,
      })
    }
  } catch (error) {
    console.error("Error in GET career coach API:", error)

    // Return default welcome message
    const demoSessionId = `demo-session-${Date.now()}`
    const welcomeMessage = {
      messages: [
        {
          id: "1",
          role: "assistant",
          content:
            "¡Hola! Soy tu AI Career Coach personalizado para el mercado laboral chileno. Estoy aquí para ayudarte con tu desarrollo profesional, búsqueda de empleo, y crecimiento de carrera. ¿En qué puedo asistirte hoy?",
          timestamp: new Date(),
          session_id: demoSessionId,
        },
      ],
      sessionId: demoSessionId,
    }

    return NextResponse.json(welcomeMessage)
  }
}
