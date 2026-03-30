import { createClient } from "@supabase/supabase-js"
import { semanticSearch } from "./embeddings"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY

export interface UserContext {
  userId: string
  testResults?: {
    disc?: any
    bigFive?: any
    mbti?: any
    riasec?: any
    emotionalIntelligence?: any
    softSkills?: any
  }
  careerGoals?: string[]
  learningHistory?: string[]
  preferences?: {
    communicationStyle?: string
    focusAreas?: string[]
  }
}

export interface BrainQuery {
  query: string
  userId: string
  conversationId?: string
  context?: UserContext
}

export interface KnowledgeSource {
  id: number
  title: string
  author: string
  category: string
  sourceType: "book" | "web_resource"
  contentPreview: string
  similarityScore: number
  relevanceReason?: string
}

export interface BrainResponse {
  answer: string
  sources: KnowledgeSource[]
  reasoning: string[]
  confidence: number
  followUpQuestions: string[]
  actionableSteps: string[]
  relatedTopics: string[]
  personalizationLevel: "generic" | "contextual" | "highly_personalized"
}

export class AdvancedBrainEngine {
  /**
   * Extract key concepts and intent from user query
   */
  private async analyzeQueryIntent(query: string): Promise<{
    intent: string
    keyTopics: string[]
    emotionalTone: string
    urgencyLevel: "low" | "medium" | "high"
  }> {
    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "user",
              content: `Analiza esta consulta del usuario y extrae:
1. Intención principal (por ejemplo: "buscar consejos", "resolver problema", "aprender habilidad")
2. Temas clave (máximo 5)
3. Tono emocional (positivo/neutral/negativo/urgente)
4. Nivel de urgencia (bajo/medio/alto)

Consulta: "${query}"

Responde en formato JSON:
{
  "intent": "descripción de la intención",
  "keyTopics": ["tema1", "tema2"],
  "emotionalTone": "tono",
  "urgencyLevel": "nivel"
}`,
            },
          ],
          temperature: 0.3,
          max_tokens: 200,
        }),
      })

      const data = await response.json()
      const text = data.choices[0]?.message?.content || ""

      try {
        const analysis = JSON.parse(text)
        return analysis
      } catch {
        return {
          intent: "general inquiry",
          keyTopics: [query.split(" ")[0]],
          emotionalTone: "neutral",
          urgencyLevel: "medium",
        }
      }
    } catch (error) {
      console.error("Error analyzing query intent:", error)
      return {
        intent: "general inquiry",
        keyTopics: [query.split(" ")[0]],
        emotionalTone: "neutral",
        urgencyLevel: "medium",
      }
    }
  }

  /**
   * Load comprehensive user profile
   */
  private async loadUserProfile(userId: string): Promise<UserContext> {
    try {
      // Load user test results
      const { data: testResults } = await supabase.from("test_results").select("*").eq("user_id", userId).limit(10)

      // Load user profile
      const { data: profile } = await supabase.from("user_profiles").select("*").eq("id", userId).single()

      // Load conversation history
      const { data: conversations } = await supabase
        .from("ai_conversations")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(5)

      return {
        userId,
        testResults: this.organizeTestResults(testResults || []),
        careerGoals: profile?.career_goals || [],
        learningHistory: this.extractLearningTopics(conversations || []),
        preferences: profile?.preferences || {},
      }
    } catch (error) {
      console.error("Error loading user profile:", error)
      return { userId }
    }
  }

  /**
   * Organize test results by type
   */
  private organizeTestResults(results: any[]): UserContext["testResults"] {
    const organized: any = {}

    results.forEach((result) => {
      const testType = result.test_type?.toLowerCase()
      if (testType) {
        organized[testType] = result
      }
    })

    return organized
  }

  /**
   * Extract learning topics from conversation history
   */
  private extractLearningTopics(conversations: any[]): string[] {
    const topics = new Set<string>()

    conversations.forEach((conv) => {
      if (conv.messages) {
        conv.messages.forEach((msg: any) => {
          if (msg.sources) {
            msg.sources.forEach((source: any) => {
              topics.add(source.category)
            })
          }
        })
      }
    })

    return Array.from(topics)
  }

  /**
   * Perform multi-level semantic search with re-ranking
   */
  private async advancedSemanticSearch(
    query: string,
    queryIntent: any,
    userContext: UserContext,
  ): Promise<KnowledgeSource[]> {
    // First level: Broad semantic search
    const broadResults = await semanticSearch(query, {
      similarityThreshold: 0.65,
      limit: 15,
    })

    // Second level: Search by key topics
    const topicResults = await Promise.all(
      queryIntent.keyTopics.map((topic: string) =>
        semanticSearch(topic, {
          similarityThreshold: 0.7,
          limit: 5,
        }),
      ),
    )

    // Third level: Personalized search based on user history
    const personalizedResults =
      userContext.learningHistory && userContext.learningHistory.length > 0
        ? await Promise.all(
            userContext.learningHistory.slice(0, 3).map((topic: string) =>
              semanticSearch(`${query} ${topic}`, {
                similarityThreshold: 0.7,
                limit: 3,
              }),
            ),
          )
        : []

    // Merge and deduplicate results
    const allResults = [...broadResults, ...topicResults.flat(), ...personalizedResults.flat()]

    const uniqueResults = Array.from(
      new Map(allResults.map((item) => [`${item.sourceType}-${item.id}`, item])).values(),
    )

    // Re-rank based on multiple factors
    const reranked = uniqueResults.map((result) => {
      let score = result.similarityScore

      // Boost if category matches user's learning history
      if (userContext.learningHistory?.includes(result.category)) {
        score *= 1.15
      }

      // Boost if matches key topics
      if (queryIntent.keyTopics.some((topic: string) => result.title.toLowerCase().includes(topic.toLowerCase()))) {
        score *= 1.1
      }

      return {
        ...result,
        similarityScore: Math.min(score, 1),
        relevanceReason: this.generateRelevanceReason(result, queryIntent, userContext),
      }
    })

    // Sort by adjusted score and return top results
    return reranked.sort((a, b) => b.similarityScore - a.similarityScore).slice(0, 5)
  }

  /**
   * Generate explanation for why a source is relevant
   */
  private generateRelevanceReason(source: KnowledgeSource, queryIntent: any, userContext: UserContext): string {
    const reasons = []

    if (source.similarityScore > 0.85) {
      reasons.push("Altamente relevante para tu consulta")
    }

    if (userContext.learningHistory?.includes(source.category)) {
      reasons.push("Relacionado con tus intereses previos")
    }

    if (queryIntent.keyTopics.some((topic: string) => source.title.toLowerCase().includes(topic.toLowerCase()))) {
      reasons.push("Aborda directamente el tema que buscas")
    }

    return reasons.length > 0 ? reasons.join(" • ") : "Contenido relacionado"
  }

  /**
   * Generate personalized system prompt
   */
  private generatePersonalizedPrompt(
    query: string,
    queryIntent: any,
    userContext: UserContext,
    sources: KnowledgeSource[],
  ): string {
    let prompt = `Eres un coach de carrera profesional avanzado con IA, especializado en desarrollo de habilidades blandas.

**Contexto del Usuario:**
`

    // Add test results context
    if (userContext.testResults) {
      if (userContext.testResults.disc) {
        prompt += `- Perfil DISC: ${userContext.testResults.disc.result_data?.profile || "No disponible"}\n`
      }
      if (userContext.testResults.mbti) {
        prompt += `- MBTI: ${userContext.testResults.mbti.result_data?.type || "No disponible"}\n`
      }
      if (userContext.testResults.emotionalIntelligence) {
        prompt += `- Inteligencia Emocional: ${userContext.testResults.emotionalIntelligence.result_data?.overall_score || "No disponible"}/100\n`
      }
    }

    // Add learning history
    if (userContext.learningHistory && userContext.learningHistory.length > 0) {
      prompt += `- Áreas de interés previas: ${userContext.learningHistory.join(", ")}\n`
    }

    // Add career goals
    if (userContext.careerGoals && userContext.careerGoals.length > 0) {
      prompt += `- Objetivos de carrera: ${userContext.careerGoals.join(", ")}\n`
    }

    prompt += `
**Análisis de la Consulta:**
- Intención: ${queryIntent.intent}
- Temas clave: ${queryIntent.keyTopics.join(", ")}
- Tono emocional: ${queryIntent.emotionalTone}
- Urgencia: ${queryIntent.urgencyLevel}

**Conocimiento Disponible:**
${sources
  .map(
    (source, index) => `
${index + 1}. "${source.title}" por ${source.author}
   Categoría: ${source.category}
   Relevancia: ${(source.similarityScore * 100).toFixed(0)}%
   Por qué es relevante: ${source.relevanceReason}
   Contenido: ${source.contentPreview.substring(0, 300)}...
`,
  )
  .join("\n")}

**Tu Tarea:**
Proporciona una respuesta altamente personalizada y accionable que:
1. Aborde directamente la intención del usuario (${queryIntent.intent})
2. Considere su perfil psicométrico y objetivos de carrera
3. Cite específicamente las fuentes más relevantes
4. Ofrezca pasos concretos y accionables
5. Adapte el lenguaje al tono emocional detectado
6. Sea empática y motivadora

**Formato de Respuesta:**
- Comienza con un saludo personalizado
- Da una respuesta clara y estructurada
- Incluye ejemplos prácticos aplicables al contexto chileno
- Termina con motivación y próximos pasos
- Máximo 500 palabras

**Consulta del Usuario:**
"${query}"
`

    return prompt
  }

  /**
   * Generate follow-up questions based on conversation depth
   */
  private generateFollowUpQuestions(
    query: string,
    queryIntent: any,
    sources: KnowledgeSource[],
    userContext: UserContext,
  ): string[] {
    const questions: string[] = []

    // Based on intent
    if (queryIntent.intent.includes("aprender")) {
      questions.push("¿Qué aspecto específico te gustaría profundizar más?")
      questions.push("¿Prefieres ejemplos prácticos o teoría?")
    }

    if (queryIntent.intent.includes("problema")) {
      questions.push("¿Este desafío es recurrente o es la primera vez que lo enfrentas?")
      questions.push("¿Qué has intentado hasta ahora para resolverlo?")
    }

    // Based on sources
    const categories = [...new Set(sources.map((s) => s.category))]
    if (categories.length > 1) {
      questions.push(`¿Te interesa explorar más sobre ${categories[0]} o ${categories[1]}?`)
    }

    // Based on user profile
    if (userContext.testResults?.disc) {
      questions.push("¿Quieres consejos específicos según tu perfil DISC?")
    }

    return questions.slice(0, 3)
  }

  /**
   * Generate actionable steps
   */
  private generateActionableSteps(queryIntent: any, sources: KnowledgeSource[], userContext: UserContext): string[] {
    const steps: string[] = []

    // Priority based on urgency
    if (queryIntent.urgencyLevel === "high") {
      steps.push("Identifica la acción más crítica y comienza hoy mismo")
    }

    // Category-specific steps
    const mainCategory = sources[0]?.category
    if (mainCategory) {
      switch (mainCategory.toLowerCase()) {
        case "liderazgo":
          steps.push("Solicita feedback de tu equipo esta semana")
          steps.push("Agenda reuniones 1-on-1 con cada miembro del equipo")
          steps.push("Lee al menos un capítulo del libro recomendado")
          break
        case "productividad":
          steps.push("Implementa una técnica de time-blocking mañana")
          steps.push("Elimina 3 distracciones de tu entorno de trabajo")
          steps.push("Establece metas SMART para esta semana")
          break
        case "comunicación":
          steps.push("Practica escucha activa en tu próxima reunión")
          steps.push("Pide feedback sobre tu estilo de comunicación")
          steps.push("Graba un mensaje y analiza tu lenguaje corporal")
          break
      }
    }

    // Generic steps
    if (steps.length < 3) {
      steps.push("Dedica 15 minutos diarios a practicar esta habilidad")
      steps.push("Comparte tu aprendizaje con un colega")
      steps.push("Revisa tu progreso en una semana")
    }

    return steps.slice(0, 5)
  }

  /**
   * Calculate confidence score with multiple factors
   */
  private calculateAdvancedConfidence(sources: KnowledgeSource[], queryIntent: any, userContext: UserContext): number {
    let confidence = 0

    // Source quality (40%)
    if (sources.length > 0) {
      const avgSimilarity = sources.reduce((sum, s) => sum + s.similarityScore, 0) / sources.length
      confidence += avgSimilarity * 40
    }

    // Source quantity (20%)
    confidence += Math.min((sources.length / 5) * 20, 20)

    // User context availability (20%)
    let contextScore = 0
    if (userContext.testResults) contextScore += 5
    if (userContext.careerGoals && userContext.careerGoals.length > 0) contextScore += 5
    if (userContext.learningHistory && userContext.learningHistory.length > 0) contextScore += 5
    if (userContext.preferences) contextScore += 5
    confidence += contextScore

    // Query clarity (20%)
    const queryLength = queryIntent.keyTopics.length
    confidence += Math.min((queryLength / 3) * 20, 20)

    return Math.min(Math.round(confidence), 95)
  }

  /**
   * Main processing method
   */
  async processQuery(brainQuery: BrainQuery): Promise<BrainResponse> {
    const { query, userId, context } = brainQuery

    // Step 1: Load user context
    const userContext = context || (await this.loadUserProfile(userId))

    // Step 2: Analyze query intent
    const queryIntent = await this.analyzeQueryIntent(query)

    // Step 3: Perform advanced semantic search
    const sources = await this.advancedSemanticSearch(query, queryIntent, userContext)

    // Step 4: Generate personalized system prompt
    const systemPrompt = this.generatePersonalizedPrompt(query, queryIntent, userContext, sources)

    // Step 5: Generate AI response
    const { text } = await generateText({
      model: "openai/gpt-4o",
      system: systemPrompt,
      prompt: query,
      temperature: 0.7,
      maxTokens: 800,
    })

    // Step 6: Generate follow-up questions
    const followUpQuestions = this.generateFollowUpQuestions(query, queryIntent, sources, userContext)

    // Step 7: Generate actionable steps
    const actionableSteps = this.generateActionableSteps(queryIntent, sources, userContext)

    // Step 8: Calculate confidence
    const confidence = this.calculateAdvancedConfidence(sources, queryIntent, userContext)

    // Step 9: Extract related topics
    const relatedTopics = [...new Set(sources.map((s) => s.category))].slice(0, 4)

    // Step 10: Determine personalization level
    let personalizationLevel: "generic" | "contextual" | "highly_personalized" = "generic"
    if (userContext.testResults || userContext.careerGoals) {
      personalizationLevel = "contextual"
    }
    if (
      userContext.testResults &&
      userContext.careerGoals &&
      userContext.learningHistory &&
      userContext.learningHistory.length > 2
    ) {
      personalizationLevel = "highly_personalized"
    }

    // Step 11: Generate reasoning trail
    const reasoning = [
      `Analizada intención: ${queryIntent.intent}`,
      `Encontradas ${sources.length} fuentes relevantes`,
      `Nivel de personalización: ${personalizationLevel}`,
      `Confianza de respuesta: ${confidence}%`,
    ]

    return {
      answer: text,
      sources,
      reasoning,
      confidence,
      followUpQuestions,
      actionableSteps,
      relatedTopics,
      personalizationLevel,
    }
  }

  /**
   * Learn from user feedback
   */
  async learnFromFeedback(userId: string, conversationId: string, rating: number, feedback?: string): Promise<void> {
    try {
      await supabase.from("brain_feedback").insert({
        user_id: userId,
        conversation_id: conversationId,
        rating,
        feedback,
        created_at: new Date().toISOString(),
      })

      // If positive feedback, boost similar patterns
      if (rating >= 4) {
        const { data: conversation } = await supabase
          .from("ai_conversations")
          .select("*")
          .eq("id", conversationId)
          .single()

        if (conversation) {
          // Store successful patterns for future use
          await supabase.from("successful_patterns").insert({
            user_id: userId,
            query_pattern: conversation.messages?.[0]?.content?.substring(0, 100),
            response_pattern: conversation.messages?.[1]?.content?.substring(0, 100),
            context: conversation.messages?.[0]?.sources,
            created_at: new Date().toISOString(),
          })
        }
      }
    } catch (error) {
      console.error("Error learning from feedback:", error)
    }
  }
}

// Export singleton instance
export const advancedBrain = new AdvancedBrainEngine()
