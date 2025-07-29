import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { createServerClient } from "./supabase"

export interface CoachingMessage {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
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

export async function getConversationHistory(userId: string): Promise<ConversationHistory> {
  // Validate UUID format
  if (!isValidUUID(userId)) {
    console.warn("Invalid UUID format for userId:", userId)
    // Return demo conversation for invalid UUIDs
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

  try {
    const supabase = createServerClient()

    // Check if we have valid Supabase credentials
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.log("Supabase credentials not available, using demo data")
      return getDemoConversation()
    }

    const { data, error } = await supabase
      .from("coaching_conversations")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })
      .limit(50)

    if (error) {
      console.error("Error fetching conversation history:", error)
      return getDemoConversation()
    }

    if (!data || data.length === 0) {
      // Return initial greeting for new users
      return {
        sessionId: `session-${userId}`,
        messages: [
          {
            id: "1",
            role: "assistant",
            content:
              "¡Hola! Soy tu AI Career Coach personalizado para el mercado laboral chileno. Estoy aquí para ayudarte con tu desarrollo profesional, búsqueda de empleo, y crecimiento de carrera. ¿En qué puedo asistirte hoy?",
            timestamp: new Date(),
          },
        ],
      }
    }

    const messages: CoachingMessage[] = data.map((msg) => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      timestamp: new Date(msg.created_at),
    }))

    return {
      sessionId: `session-${userId}`,
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

export async function saveMessage(userId: string, role: "user" | "assistant", content: string): Promise<void> {
  // Validate UUID format
  if (!isValidUUID(userId)) {
    console.warn("Invalid UUID format, skipping save:", userId)
    return
  }

  try {
    const supabase = createServerClient()

    // Check if we have valid Supabase credentials
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.log("Supabase credentials not available, skipping message save")
      return
    }

    const { error } = await supabase.from("coaching_conversations").insert({
      user_id: userId,
      role,
      content,
      session_id: `session-${userId}`,
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
- Empresas tech destacadas: NotCo, Fintual, Cornershop, Buk, Betterfly
- Salarios típicos en tech: $2.000.000 - $5.000.000 CLP
- Cultura laboral: Formal pero en transición hacia más flexibilidad

Instrucciones:
1. Responde en español chileno natural
2. Proporciona consejos específicos para el mercado chileno
3. Menciona empresas, salarios y oportunidades reales de Chile
4. Sé empático y motivacional
5. Ofrece pasos concretos y accionables
6. Mantén un tono profesional pero cercano

Responde de manera concisa pero útil (máximo 200 palabras).`

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
      maxTokens: 300,
      temperature: 0.7,
    })

    return text
  } catch (error) {
    console.error("Error generating coach response:", error)
    return getDemoResponse(userMessage)
  }
}

export async function generateCareerAdvice(
  userProfile: {
    skills?: string[]
    experience?: string
    goals?: string[]
    industry?: string
  },
  context?: string,
): Promise<string> {
  try {
    // Check if we have OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      return getDemoCareerAdvice(userProfile, context)
    }

    const systemPrompt = `Eres un AI Career Coach especializado en el mercado laboral chileno. Proporciona consejos de carrera personalizados basados en el perfil del usuario.

Contexto del mercado chileno:
- Principales ciudades: Santiago, Valparaíso, Concepción
- Sectores en crecimiento: Tecnología, Minería, Servicios Financieros, Retail
- Empresas tech destacadas: NotCo, Fintual, Cornershop, Buk, Betterfly
- Salarios típicos en tech: $2.000.000 - $5.000.000 CLP
- Cultura laboral: Formal pero en transición hacia más flexibilidad

Instrucciones:
1. Analiza el perfil del usuario (habilidades, experiencia, objetivos)
2. Proporciona consejos específicos para el mercado chileno
3. Sugiere pasos concretos y accionables
4. Menciona oportunidades relevantes en Chile
5. Mantén un tono motivacional y profesional
6. Responde en español chileno natural

Responde de manera estructurada y útil (máximo 300 palabras).`

    const userPrompt = `
Perfil del usuario:
- Habilidades: ${userProfile.skills?.join(", ") || "No especificadas"}
- Experiencia: ${userProfile.experience || "No especificada"}
- Objetivos: ${userProfile.goals?.join(", ") || "No especificados"}
- Industria: ${userProfile.industry || "No especificada"}

Contexto adicional: ${context || "Ninguno"}

Por favor, proporciona consejos de carrera personalizados para este perfil.`

    const { text } = await generateText({
      model: openai("gpt-4o-mini"),
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      maxTokens: 400,
      temperature: 0.7,
    })

    return text
  } catch (error) {
    console.error("Error generating career advice:", error)
    return getDemoCareerAdvice(userProfile, context)
  }
}

function getDemoResponse(userMessage: string): string {
  const demoResponses = [
    "Entiendo tu consulta. En el mercado chileno, es importante enfocarse en desarrollar habilidades técnicas demandadas como JavaScript, Python o AWS. Te recomiendo explorar oportunidades en empresas como NotCo, Fintual o Cornershop que están creciendo rápidamente.",
    "Excelente pregunta. Para el mercado laboral chileno, sugiero que actualices tu CV destacando proyectos relevantes y considera obtener certificaciones reconocidas. Las empresas tech en Santiago valoran mucho la experiencia práctica.",
    "Te puedo ayudar con eso. En Chile, el networking es clave. Te recomiendo asistir a eventos como 9punto5, conectar con profesionales en LinkedIn, y considerar trabajar en startups chilenas para ganar experiencia rápidamente.",
    "Buena consulta. Los salarios en tech en Chile van desde $2.000.000 para junior hasta $5.000.000+ para senior. Te sugiero prepararte bien para entrevistas técnicas y destacar tu capacidad de adaptación al mercado local.",
  ]

  return demoResponses[Math.floor(Math.random() * demoResponses.length)]
}

function getDemoCareerAdvice(
  userProfile: {
    skills?: string[]
    experience?: string
    goals?: string[]
    industry?: string
  },
  context?: string,
): string {
  const advice = [
    "Basado en tu perfil, te recomiendo enfocarte en desarrollar habilidades técnicas demandadas en el mercado chileno.",
    "Para el mercado laboral chileno, es importante destacar tu experiencia práctica y obtener certificaciones reconocidas.",
    "Considera explorar oportunidades en startups chilenas como NotCo, Fintual o Cornershop que están en crecimiento.",
    "El networking es clave en Chile. Te sugiero asistir a eventos tech y conectar con profesionales en LinkedIn.",
    "Los salarios en tech en Chile van desde $2.000.000 para junior hasta $5.000.000+ para senior, dependiendo de tu especialización.",
  ]

  return advice.join(" ")
}
