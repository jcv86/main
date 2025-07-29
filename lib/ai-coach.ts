import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

// Configure OpenAI with API key
const openaiClient = openai({
  apiKey: process.env.OPENAI_API_KEY || "",
})

interface UserProfile {
  id: string
  full_name?: string
  email?: string
  career_goals?: string
  current_role?: string
  experience_level?: string
  skills?: string[]
  personality_type?: string
  disc_results?: any
  big_five_results?: any
}

interface ConversationContext {
  userProfile: UserProfile
  recentMessages: Array<{ role: string; content: string; timestamp: Date }>
  skillsAssessments: any[]
  cvData: any
  jobSearchHistory: any[]
}

const RECOMMENDED_BOOKS = [
  "Atomic Habits por James Clear",
  "Los 7 Hábitos de la Gente Altamente Efectiva por Stephen Covey",
  "Lean In por Sheryl Sandberg",
  "Deep Work por Cal Newport",
  "Inteligencia Emocional por Daniel Goleman",
  "The Lean Startup por Eric Ries",
  "Mindset por Carol Dweck",
  "El Poder del Ahora por Eckhart Tolle",
  "Good to Great por Jim Collins",
  "La Semana Laboral de 4 Horas por Tim Ferriss",
]

export async function generateCareerAdvice(message: string, userId: string): Promise<string> {
  try {
    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      console.warn("OpenAI API key not found, using mock response")
      return generateMockResponse(message, userId)
    }

    // Get user context
    const context = await getUserContext(userId)

    // Store the user message
    await storeMessage(userId, message, "user")

    // Generate system prompt with context
    const systemPrompt = createSystemPrompt(context)

    // Generate response using AI
    const { text } = await generateText({
      model: openaiClient("gpt-4o"),
      system: systemPrompt,
      prompt: message,
      maxTokens: 1000,
      temperature: 0.7,
    })

    // Store the assistant response
    await storeMessage(userId, text, "assistant")

    return text
  } catch (error) {
    console.error("Error generating career advice:", error)
    // Fallback to mock response if AI fails
    return generateMockResponse(message, userId)
  }
}

function generateMockResponse(message: string, userId: string): string {
  const responses = [
    `¡Hola! Gracias por tu consulta: "${message}". Como tu Coach IA, te recomiendo enfocarte en desarrollar habilidades técnicas relevantes para el mercado chileno. ¿Te gustaría que revisemos tu perfil profesional juntos?`,

    `Entiendo tu pregunta sobre "${message}". En el mercado laboral chileno actual, es importante mantenerse actualizado. Te sugiero considerar estos pasos: 1) Evaluar tus habilidades actuales, 2) Identificar gaps en tu perfil, 3) Crear un plan de desarrollo. ¿Por cuál te gustaría empezar?`,

    `Excelente pregunta sobre "${message}". Como coach, veo que estás buscando orientación. Te recomiendo usar nuestros módulos de evaluación de habilidades y el generador de CV para tener una visión completa de tu perfil profesional. ¿Has completado alguna evaluación recientemente?`,

    `Gracias por compartir: "${message}". En mi experiencia ayudando profesionales en Chile, he visto que el éxito viene de la combinación de habilidades técnicas y soft skills. Te sugiero revisar libros como "Atomic Habits" para desarrollar mejores hábitos profesionales. ¿Qué área te gustaría fortalecer primero?`,
  ]

  return responses[Math.floor(Math.random() * responses.length)]
}

async function getUserContext(userId: string): Promise<ConversationContext> {
  try {
    // Get user profile
    const { data: profile } = await supabase.from("profiles").select("*").eq("id", userId).single()

    // Get recent conversation messages
    const { data: messages } = await supabase
      .from("coaching_conversations")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(10)

    // Get skills assessments
    const { data: skillsAssessments } = await supabase
      .from("skills_assessments")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5)

    // Get CV data
    const { data: cvData } = await supabase.from("cv_data").select("*").eq("user_id", userId).single()

    // Get job search history
    const { data: jobSearchHistory } = await supabase
      .from("job_applications")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(5)

    return {
      userProfile: profile || { id: userId },
      recentMessages: messages || [],
      skillsAssessments: skillsAssessments || [],
      cvData: cvData || null,
      jobSearchHistory: jobSearchHistory || [],
    }
  } catch (error) {
    console.error("Error getting user context:", error)
    return {
      userProfile: { id: userId },
      recentMessages: [],
      skillsAssessments: [],
      cvData: null,
      jobSearchHistory: [],
    }
  }
}

function createSystemPrompt(context: ConversationContext): string {
  const { userProfile, recentMessages, skillsAssessments, cvData } = context

  const prompt = `Eres un Coach IA especializado en desarrollo profesional para el mercado laboral chileno. Tu nombre es "Coach DTC" y eres parte de la plataforma DTC (Desarrollo de Talento y Carrera).

INFORMACIÓN DEL USUARIO:
- Nombre: ${userProfile.full_name || "Usuario"}
- Objetivo profesional: ${userProfile.career_goals || "No especificado"}
- Rol actual: ${userProfile.current_role || "No especificado"}
- Nivel de experiencia: ${userProfile.experience_level || "No especificado"}
- Tipo de personalidad: ${userProfile.personality_type || "No evaluado"}

CONTEXTO DE CONVERSACIÓN:
${
  recentMessages.length > 0
    ? `Mensajes recientes:\n${recentMessages
        .slice(0, 5)
        .map((m) => `${m.role}: ${m.content}`)
        .join("\n")}`
    : "Primera conversación con el usuario"
}

EVALUACIONES RECIENTES:
${
  skillsAssessments.length > 0
    ? `El usuario ha completado ${skillsAssessments.length} evaluaciones de habilidades.`
    : "No hay evaluaciones completadas aún."
}

LIBROS RECOMENDADOS DISPONIBLES:
${RECOMMENDED_BOOKS.join(", ")}

INSTRUCCIONES:
1. Sé empático, motivador y profesional
2. Proporciona consejos específicos y accionables
3. Usa el contexto del usuario para personalizar tus respuestas
4. Recomienda libros de la lista cuando sea relevante
5. Sugiere usar otros módulos de DTC cuando sea apropiado (CV Builder, Skills Assessment, Job Search, etc.)
6. Mantén un tono conversacional pero profesional
7. Si no tienes información suficiente, haz preguntas específicas
8. Enfócate en el mercado laboral chileno cuando sea relevante
9. Recuerda conversaciones anteriores y haz seguimiento de objetivos mencionados
10. Ofrece pasos concretos y medibles para el desarrollo profesional

CAPACIDADES ESPECIALES:
- Puedes sugerir al usuario que use el CV Builder si necesita mejorar su CV
- Puedes recomendar hacer evaluaciones de habilidades si no las ha completado
- Puedes sugerir búsquedas de trabajo específicas
- Puedes recomendar libros específicos de la biblioteca
- Puedes dar consejos sobre entrevistas y networking

Responde siempre en español y mantén un tono cercano pero profesional.`

  return prompt
}

async function storeMessage(userId: string, content: string, role: "user" | "assistant"): Promise<void> {
  try {
    await supabase.from("coaching_conversations").insert({
      user_id: userId,
      message: content,
      role: role,
      created_at: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error storing message:", error)
  }
}

export async function getConversationHistory(userId: string) {
  try {
    const { data, error } = await supabase
      .from("coaching_conversations")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true })

    if (error) throw error
    return data || []
  } catch (error) {
    console.error("Error getting conversation history:", error)
    return []
  }
}
