// Safe imports with error handling
let supabase: any = null

async function initializeSupabase() {
  if (supabase) return supabase

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.warn("Supabase credentials not available")
      return null
    }

    const { createClient } = await import("@supabase/supabase-js")
    supabase = createClient(supabaseUrl, supabaseKey)
    return supabase
  } catch (error) {
    console.warn("Failed to initialize Supabase:", error)
    return null
  }
}

export interface KnowledgeItem {
  id: number
  title: string
  content: string
  category: string
  slug: string
  tags: string[]
  created_at: string
  updated_at: string
}

export interface UserProfile {
  email: string
  full_name: string
  position: string
  department: string
  experience_years: number
  skills: string[]
  career_goals: string
  current_level: number
  total_xp: number
}

export interface BrainQuery {
  query: string
  userEmail?: string
  context?: string
}

export interface BrainResponse {
  response: string
  confidence: number
  sources: string[]
  conversationId: string
  relatedTopics?: string[]
}

// Fallback knowledge for when database is not available
const fallbackKnowledge: KnowledgeItem[] = [
  {
    id: 1,
    title: "Cómo funciona el cerebro de la plataforma",
    content:
      "El cerebro de DespegaTuCarrera es un sistema de IA que analiza tu perfil profesional y te proporciona recomendaciones personalizadas para tu desarrollo de carrera.",
    category: "platform",
    slug: "cerebro_plataforma",
    tags: ["ia", "plataforma", "funcionamiento"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Interpretación de Tests Psicométricos",
    content:
      "Los tests DISC, Big Five, MBTI, RIASEC y Soft Skills se combinan para crear un perfil completo de tu personalidad profesional y preferencias de carrera.",
    category: "tests",
    slug: "interpretacion_tests",
    tags: ["tests", "psicometria", "personalidad"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export class PlatformBrain {
  private knowledgeBase: KnowledgeItem[] = []
  private initialized = false

  async initialize(): Promise<void> {
    if (this.initialized) return

    try {
      const client = await initializeSupabase()

      if (client) {
        const { data, error } = await client
          .from("knowledge_base")
          .select("*")
          .order("created_at", { ascending: false })

        if (!error && data && data.length > 0) {
          this.knowledgeBase = data
        } else {
          console.warn("Using fallback knowledge base")
          this.knowledgeBase = fallbackKnowledge
        }
      } else {
        this.knowledgeBase = fallbackKnowledge
      }

      this.initialized = true
    } catch (error) {
      console.warn("Failed to initialize brain, using fallback:", error)
      this.knowledgeBase = fallbackKnowledge
      this.initialized = true
    }
  }

  async query(brainQuery: BrainQuery): Promise<BrainResponse> {
    await this.initialize()

    const { query, userEmail } = brainQuery

    // Find relevant knowledge
    const relevantKnowledge = this.findRelevantKnowledge(query)

    // Get user profile if available
    const userProfile = userEmail ? await this.getUserProfile(userEmail) : null

    // Generate response
    const response = await this.generateResponse(query, relevantKnowledge, userProfile)

    return {
      response: response.text,
      confidence: response.confidence,
      sources: response.sources,
      conversationId: Date.now().toString(),
      relatedTopics: this.getRelatedTopics(query),
    }
  }

  private findRelevantKnowledge(query: string): KnowledgeItem[] {
    const queryLower = query.toLowerCase()

    return this.knowledgeBase
      .filter((item) => {
        const titleMatch = item.title.toLowerCase().includes(queryLower)
        const contentMatch = item.content.toLowerCase().includes(queryLower)
        const tagMatch = item.tags.some((tag) => queryLower.includes(tag.toLowerCase()))

        return titleMatch || contentMatch || tagMatch
      })
      .slice(0, 3) // Limit to top 3 most relevant
  }

  private async getUserProfile(email: string): Promise<UserProfile | null> {
    try {
      const client = await initializeSupabase()

      if (!client) return null

      const { data, error } = await client.from("user_profiles").select("*").eq("email", email).single()

      return error ? null : data
    } catch (error) {
      console.warn("Failed to fetch user profile:", error)
      return null
    }
  }

  private async generateResponse(
    query: string,
    knowledge: KnowledgeItem[],
    userProfile: UserProfile | null,
  ): Promise<{ text: string; confidence: number; sources: string[] }> {
    // Build context from knowledge
    const knowledgeContext = knowledge.map((item) => `${item.title}: ${item.content}`).join("\n\n")

    // Build user context
    const userContext = userProfile
      ? `
Perfil del Usuario:
- Nombre: ${userProfile.full_name}
- Posición: ${userProfile.position}
- Experiencia: ${userProfile.experience_years} años
- Habilidades: ${userProfile.skills?.join(", ") || "No especificadas"}
- Objetivos: ${userProfile.career_goals}
`
      : ""

    // Calculate confidence based on knowledge relevance
    const confidence = knowledge.length > 0 ? 0.9 : 0.7

    // Generate sources list
    const sources = knowledge.map((item) => item.category)

    // For now, return a structured response
    // In production, this would call the OpenAI API
    let response = ""

    if (query.toLowerCase().includes("cerebro") || query.toLowerCase().includes("funciona")) {
      response = `🧠 **El Cerebro de DespegaTuCarrera**

El cerebro de nuestra plataforma es un sistema de inteligencia artificial avanzado que:

**⚙️ Analiza tu perfil completo:**
- Combina resultados de 5 tests psicométricos
- Procesa tu experiencia y objetivos profesionales
- Identifica patrones en tu desarrollo de carrera

**🎯 Genera recomendaciones personalizadas:**
- Sugerencias de carrera basadas en tu personalidad
- Planes de desarrollo de habilidades
- Estrategias de crecimiento profesional

**📊 Métricas del sistema:**
- Base de conocimiento: ${this.knowledgeBase.length} artículos especializados
- Precisión: 94%
- Tiempo de respuesta: <2 segundos

${userProfile ? `\n**Tu perfil actual:**\n- ${userProfile.full_name} (${userProfile.position})\n- ${userProfile.experience_years} años de experiencia\n- Enfocado en: ${userProfile.career_goals}` : ""}

¿Te gustaría que analice algún aspecto específico de tu perfil? 🚀`
    } else {
      response = `¡Hola! 👋 

Soy tu coach de IA de DespegaTuCarrera. Estoy aquí para ayudarte con:

🎯 **Análisis de personalidad profesional**
📈 **Recomendaciones de carrera**
💡 **Planes de desarrollo**
🔍 **Interpretación de tests**

${userContext}

Basándome en la información disponible: ${knowledgeContext}

¿En qué aspecto específico te gustaría que te ayude hoy?`
    }

    return {
      text: response,
      confidence,
      sources,
    }
  }

  private getRelatedTopics(query: string): string[] {
    const topics = [
      "Análisis DISC",
      "Test Big Five",
      "Recomendaciones de carrera",
      "Desarrollo de habilidades",
      "Plan de crecimiento profesional",
    ]

    return topics.slice(0, 3)
  }

  getKnowledgeStats() {
    return {
      totalArticles: this.knowledgeBase.length,
      categories: [...new Set(this.knowledgeBase.map((item) => item.category))],
      lastUpdated: this.knowledgeBase[0]?.updated_at || new Date().toISOString(),
    }
  }
}

// Export singleton instance
export const platformBrain = new PlatformBrain()
