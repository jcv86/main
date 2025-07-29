import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Create a Supabase client with service role for server-side operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

export interface CoachingMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  session_id?: string
}

export interface ConversationHistory {
  messages: CoachingMessage[]
  sessionId: string
}

// Validate UUID format
function isValidUUID(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  return uuidRegex.test(uuid)
}

export async function getConversationHistory(userId?: string, sessionId?: string): Promise<ConversationHistory> {
  // If no userId provided or invalid format, return demo conversation
  if (!userId || !isValidUUID(userId)) {
    console.warn("Invalid or missing userId, returning demo conversation")
    return getDemoConversation()
  }

  try {
    // Check if we have valid Supabase credentials
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.log("Supabase credentials not available, using demo data")
      return getDemoConversation()
    }

    let finalSessionId = sessionId

    // If no sessionId provided, get the most recent session for this user
    if (!finalSessionId) {
      const { data: sessionData, error: sessionError } = await supabaseAdmin
        .from("coaching_conversations")
        .select("session_id")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(1)

      if (sessionError) {
        console.error("Error fetching session:", sessionError)
        return getDemoConversation()
      }

      if (sessionData && sessionData.length > 0) {
        finalSessionId = sessionData[0].session_id
      } else {
        // Create new session ID if none exists
        finalSessionId = `session-${userId}-${Date.now()}`
      }
    }

    // Fetch conversation history for the session
    const { data, error } = await supabaseAdmin
      .from("coaching_conversations")
      .select("*")
      .eq("user_id", userId)
      .eq("session_id", finalSessionId)
      .order("created_at", { ascending: true })
      .limit(50)

    if (error) {
      console.error("Error fetching conversation history:", error)
      return getDemoConversation()
    }

    if (!data || data.length === 0) {
      // Return initial greeting for new users and save it
      const welcomeMessage = {
        id: "1",
        role: "assistant" as const,
        content:
          "¡Hola! Soy tu AI Career Coach personalizado para el mercado laboral chileno. Estoy aquí para ayudarte con tu desarrollo profesional, búsqueda de empleo, y crecimiento de carrera. ¿En qué puedo asistirte hoy?",
        timestamp: new Date(),
        session_id: finalSessionId,
      }

      // Save welcome message to database
      await saveMessage(userId, "assistant", welcomeMessage.content, finalSessionId)

      return {
        sessionId: finalSessionId,
        messages: [welcomeMessage],
      }
    }

    const messages: CoachingMessage[] = data.map((msg) => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      timestamp: new Date(msg.created_at),
      session_id: msg.session_id,
    }))

    return {
      sessionId: finalSessionId,
      messages,
    }
  } catch (error) {
    console.error("Error getting conversation history:", error)
    return getDemoConversation()
  }
}

function getDemoConversation(): ConversationHistory {
  return {
    sessionId: "demo-session",
    messages: [
      {
        id: "1",
        role: "assistant",
        content:
          "¡Hola! Soy tu AI Career Coach. Estoy aquí para ayudarte con tu desarrollo profesional en el mercado chileno. ¿En qué puedo asistirte hoy?",
        timestamp: new Date(Date.now() - 60000),
      },
    ],
  }
}

export async function saveMessage(
  userId: string,
  role: "user" | "assistant",
  content: string,
  sessionId?: string,
): Promise<void> {
  // Validate UUID format
  if (!isValidUUID(userId)) {
    console.warn("Invalid UUID format, skipping save:", userId)
    return
  }

  try {
    // Check if we have valid Supabase credentials
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      console.log("Supabase credentials not available, skipping message save")
      return
    }

    const finalSessionId = sessionId || `session-${userId}-${Date.now()}`

    const { error } = await supabaseAdmin.from("coaching_conversations").insert({
      user_id: userId,
      session_id: finalSessionId,
      role,
      content,
      metadata: {
        timestamp: new Date().toISOString(),
        user_agent: "server",
      },
    })

    if (error) {
      console.error("Error saving message:", error)
    }
  } catch (error) {
    console.error("Error saving message:", error)
  }
}

export async function generateCoachResponse(
  userMessage: string,
  conversationHistory: CoachingMessage[],
): Promise<string> {
  try {
    // Check if we have OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      return getDemoResponse(userMessage)
    }

    const systemPrompt = `Eres un AI Career Coach especializado en el mercado laboral chileno. Tu objetivo es ayudar a profesionales a desarrollar sus carreras, encontrar empleo y crecer profesionalmente en Chile.

Contexto del mercado chileno:
- Principales ciudades: Santiago, Valparaíso, Concepción
- Sectores en crecimiento: Tecnología, Minería, Servicios Financieros, Retail
- Empresas tech destacadas: NotCo, Fintual, Cornershop, Buk, Betterfly, Chiper
- Salarios típicos en tech: $2.000.000 - $5.000.000 CLP
- Cultura laboral: Formal pero en transición hacia más flexibilidad
- Portales de empleo: Trabajando.com, GetOnBoard, Laborum

Instrucciones:
1. Responde en español chileno natural
2. Proporciona consejos específicos para el mercado chileno
3. Menciona empresas, salarios y oportunidades reales de Chile
4. Sé empático y motivacional
5. Ofrece pasos concretos y accionables
6. Mantén un tono profesional pero cercano
7. Considera el contexto de la conversación previa

Responde de manera concisa pero útil (máximo 250 palabras).`

    const messages = [
      { role: "system" as const, content: systemPrompt },
      ...conversationHistory.slice(-10).map((msg) => ({
        role: msg.role as "user" | "assistant",
        content: msg.content,
      })),
      { role: "user" as const, content: userMessage },
    ]

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      messages,
      maxTokens: 350,
      temperature: 0.7,
    })

    return text
  } catch (error) {
    console.error("Error generating coach response:", error)
    return getDemoResponse(userMessage)
  }
}

export async function generateCareerAdvice(userMessage: string, userId?: string): Promise<string> {
  try {
    // Check if we have OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      return getDemoResponse(userMessage)
    }

    const systemPrompt = `Eres un AI Career Coach especializado en el mercado laboral chileno. Proporciona consejos de carrera personalizados.

Contexto del mercado chileno:
- Principales ciudades: Santiago, Valparaíso, Concepción
- Sectores en crecimiento: Tecnología, Minería, Servicios Financieros, Retail
- Empresas tech destacadas: NotCo, Fintual, Cornershop, Buk, Betterfly, Chiper
- Salarios típicos en tech: $2.000.000 - $5.000.000 CLP
- Cultura laboral: Formal pero en transición hacia más flexibilidad
- Portales de empleo: Trabajando.com, GetOnBoard, Laborum

Instrucciones:
1. Responde en español chileno natural
2. Proporciona consejos específicos para el mercado chileno
3. Menciona empresas, salarios y oportunidades reales de Chile
4. Sé empático y motivacional
5. Ofrece pasos concretos y accionables
6. Mantén un tono profesional pero cercano

Responde de manera estructurada y útil (máximo 300 palabras).`

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userMessage },
      ],
      maxTokens: 400,
      temperature: 0.7,
    })

    return text
  } catch (error) {
    console.error("Error generating career advice:", error)
    return getDemoResponse(userMessage)
  }
}

export async function startNewSession(userId: string): Promise<string> {
  const newSessionId = `session-${userId}-${Date.now()}`

  // Save a session start marker
  await saveMessage(userId, "assistant", "Nueva sesión iniciada", newSessionId)

  return newSessionId
}

export async function getUserSessions(
  userId: string,
): Promise<{ sessionId: string; lastMessage: Date; messageCount: number }[]> {
  if (!isValidUUID(userId)) {
    return []
  }

  try {
    const { data, error } = await supabaseAdmin
      .from("coaching_conversations")
      .select("session_id, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })

    if (error || !data) {
      return []
    }

    // Group by session and get stats
    const sessionStats = data.reduce(
      (acc, msg) => {
        const sessionId = msg.session_id
        if (!acc[sessionId]) {
          acc[sessionId] = {
            sessionId,
            lastMessage: new Date(msg.created_at),
            messageCount: 0,
          }
        }
        acc[sessionId].messageCount++
        const msgDate = new Date(msg.created_at)
        if (msgDate > acc[sessionId].lastMessage) {
          acc[sessionId].lastMessage = msgDate
        }
        return acc
      },
      {} as Record<string, { sessionId: string; lastMessage: Date; messageCount: number }>,
    )

    return Object.values(sessionStats).sort((a, b) => b.lastMessage.getTime() - a.lastMessage.getTime())
  } catch (error) {
    console.error("Error getting user sessions:", error)
    return []
  }
}

function getDemoResponse(userMessage: string): string {
  const demoResponses = [
    "Entiendo tu consulta. En el mercado chileno, es importante enfocarse en desarrollar habilidades técnicas demandadas como JavaScript, Python o AWS. Te recomiendo explorar oportunidades en empresas como NotCo, Fintual o Cornershop que están creciendo rápidamente.",
    "Excelente pregunta. Para el mercado laboral chileno, sugiero que actualices tu CV destacando proyectos relevantes y considera obtener certificaciones reconocidas. Las empresas tech en Santiago valoran mucho la experiencia práctica.",
    "Te puedo ayudar con eso. En Chile, el networking es clave. Te recomiendo asistir a eventos como 9punto5, conectar con profesionales en LinkedIn, y considerar trabajar en startups chilenas para ganar experiencia rápidamente.",
    "Buena consulta. Los salarios en tech en Chile van desde $2.000.000 para junior hasta $5.000.000+ para senior. Te sugiero prepararte bien para entrevistas técnicas y destacar tu capacidad de adaptación al mercado local.",
    "Para el mercado chileno, te recomiendo enfocarte en empresas como Buk, Betterfly o Chiper que están en expansión. También considera portales como GetOnBoard que se especializan en tech jobs.",
  ]

  return demoResponses[Math.floor(Math.random() * demoResponses.length)]
}
