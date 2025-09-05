import { createClient } from "@/lib/supabase"

export interface KnowledgeItem {
  id: number
  title: string
  content: string
  category: string
  subcategory?: string
  tags: string[]
  difficulty_level: string
  created_at: string
  updated_at: string
}

export interface BrainQuery {
  query: string
  userEmail: string
  testResults?: any[]
  conversationHistory?: any[]
}

export interface BrainResponse {
  response: string
  confidence: number
  knowledgeUsed: string[]
  suggestions: string[]
  sources: KnowledgeItem[]
  fallback: boolean
}

export class PlatformBrain {
  private supabase = createClient()

  async query(params: BrainQuery): Promise<BrainResponse> {
    try {
      // 1. Classify the query type
      const queryType = this.classifyQuery(params.query)

      // 2. Search relevant knowledge
      const knowledge = await this.searchKnowledge(params.query, queryType)

      // 3. Get user context
      const userContext = await this.getUserContext(params.userEmail, params.testResults)

      // 4. Generate response
      const response = await this.generateResponse(params.query, knowledge, userContext, queryType)

      // 5. Save interaction
      await this.saveInteraction(params.userEmail, params.query, response)

      return response
    } catch (error) {
      console.error("Brain query error:", error)
      return this.getFallbackResponse(params.query, params.testResults)
    }
  }

  private classifyQuery(query: string): string {
    const lowerQuery = query.toLowerCase()

    if (lowerQuery.includes("disc") || lowerQuery.includes("dominancia") || lowerQuery.includes("influencia")) {
      return "disc"
    }
    if (
      lowerQuery.includes("big five") ||
      lowerQuery.includes("cinco factores") ||
      lowerQuery.includes("personalidad")
    ) {
      return "big-five"
    }
    if (lowerQuery.includes("mbti") || lowerQuery.includes("myers") || lowerQuery.includes("tipos")) {
      return "mbti"
    }
    if (lowerQuery.includes("riasec") || lowerQuery.includes("holland") || lowerQuery.includes("intereses")) {
      return "riasec"
    }
    if (
      lowerQuery.includes("habilidades blandas") ||
      lowerQuery.includes("soft skills") ||
      lowerQuery.includes("competencias")
    ) {
      return "soft-skills"
    }
    if (lowerQuery.includes("carrera") || lowerQuery.includes("profesional") || lowerQuery.includes("trabajo")) {
      return "career"
    }
    if (lowerQuery.includes("desarrollo") || lowerQuery.includes("mejorar") || lowerQuery.includes("plan")) {
      return "development"
    }
    if (lowerQuery.includes("plataforma") || lowerQuery.includes("funciona") || lowerQuery.includes("algoritmo")) {
      return "platform"
    }

    return "general"
  }

  private async searchKnowledge(query: string, queryType: string): Promise<KnowledgeItem[]> {
    try {
      // Full-text search with category filtering
      const { data, error } = await this.supabase
        .from("knowledge_base")
        .select("*")
        .or(`search_vector.fts.${query.replace(/[^\w\s]/g, "")},category.eq.${queryType}`)
        .order("updated_at", { ascending: false })
        .limit(5)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Knowledge search error:", error)
      return []
    }
  }

  private async getUserContext(userEmail: string, testResults?: any[]): Promise<any> {
    try {
      // Get user profile and test results
      const { data: profile } = await this.supabase.from("user_profiles").select("*").eq("email", userEmail).single()

      const { data: results } = await this.supabase
        .from("test_results")
        .select("*")
        .eq("user_email", userEmail)
        .order("created_at", { ascending: false })

      return {
        profile: profile || {},
        testResults: results || testResults || [],
        completedTests: (results || []).length,
      }
    } catch (error) {
      console.error("User context error:", error)
      return { profile: {}, testResults: testResults || [], completedTests: 0 }
    }
  }

  private async generateResponse(
    query: string,
    knowledge: KnowledgeItem[],
    userContext: any,
    queryType: string,
  ): Promise<BrainResponse> {
    // If we have OpenAI API, use it for advanced responses
    if (process.env.OPENAI_API_KEY) {
      return this.generateAIResponse(query, knowledge, userContext, queryType)
    }

    // Otherwise, use rule-based responses
    return this.generateRuleBasedResponse(query, knowledge, userContext, queryType)
  }

  private async generateAIResponse(
    query: string,
    knowledge: KnowledgeItem[],
    userContext: any,
    queryType: string,
  ): Promise<BrainResponse> {
    try {
      const { generateText } = await import("ai")
      const { openai } = await import("@ai-sdk/openai")

      const context = this.buildContext(knowledge, userContext)
      const prompt = this.buildPrompt(query, context, userContext, queryType)

      const { text } = await generateText({
        model: openai("gpt-4o"),
        prompt,
        maxTokens: 1000,
      })

      return {
        response: text,
        confidence: this.calculateConfidence(knowledge, userContext, false),
        knowledgeUsed: knowledge.map((k) => k.title),
        suggestions: this.generateSuggestions(queryType, userContext),
        sources: knowledge,
        fallback: false,
      }
    } catch (error) {
      console.error("AI response error:", error)
      return this.generateRuleBasedResponse(query, knowledge, userContext, queryType)
    }
  }

  private generateRuleBasedResponse(
    query: string,
    knowledge: KnowledgeItem[],
    userContext: any,
    queryType: string,
  ): BrainResponse {
    let response = ""
    let confidence = 60

    if (knowledge.length > 0) {
      const primaryKnowledge = knowledge[0]

      // Extract relevant sections based on query
      const sections = this.extractRelevantSections(primaryKnowledge.content, query)

      response = this.formatResponse(sections, userContext, queryType)
      confidence = this.calculateConfidence(knowledge, userContext, true)
    } else {
      response = this.getGenericResponse(queryType, userContext)
      confidence = 30
    }

    return {
      response,
      confidence,
      knowledgeUsed: knowledge.map((k) => k.title),
      suggestions: this.generateSuggestions(queryType, userContext),
      sources: knowledge,
      fallback: true,
    }
  }

  private buildContext(knowledge: KnowledgeItem[], userContext: any): string {
    let context = "CONOCIMIENTO DISPONIBLE:\n\n"

    knowledge.forEach((item) => {
      context += `**${item.title}**\n${item.content}\n\n`
    })

    context += "\nCONTEXTO DEL USUARIO:\n"
    context += `- Tests completados: ${userContext.completedTests}\n`

    if (userContext.testResults.length > 0) {
      context += "- Resultados recientes:\n"
      userContext.testResults.slice(0, 3).forEach((result: any) => {
        context += `  * ${result.test_type}: ${result.score}% (${result.created_at})\n`
      })
    }

    return context
  }

  private buildPrompt(query: string, context: string, userContext: any, queryType: string): string {
    return `Eres un AI Coach experto en desarrollo profesional y análisis psicométrico. 

${context}

INSTRUCCIONES:
- Responde en español de manera profesional y empática
- Usa el conocimiento disponible para dar respuestas precisas
- Personaliza la respuesta según el contexto del usuario
- Incluye ejemplos prácticos y accionables
- Mantén un tono motivacional pero realista
- Si no tienes información suficiente, sé honesto al respecto

PREGUNTA DEL USUARIO: ${query}

Proporciona una respuesta completa, personalizada y útil:`
  }

  private extractRelevantSections(content: string, query: string): string[] {
    const sections = content.split("\n\n")
    const queryWords = query.toLowerCase().split(" ")

    return sections
      .filter((section) => {
        const sectionLower = section.toLowerCase()
        return queryWords.some((word) => sectionLower.includes(word))
      })
      .slice(0, 3)
  }

  private formatResponse(sections: string[], userContext: any, queryType: string): string {
    let response = ""

    if (sections.length > 0) {
      response = sections.join("\n\n")

      // Add personalization based on user context
      if (userContext.completedTests > 0) {
        response += `\n\n**Personalización para tu perfil:**\nBasado en tus ${userContext.completedTests} evaluación(es) completada(s), estas recomendaciones son especialmente relevantes para tu desarrollo profesional.`
      }

      // Add next steps
      response += "\n\n**Próximos pasos recomendados:**\n"
      response += this.getNextSteps(queryType, userContext)
    }

    return response
  }

  private getGenericResponse(queryType: string, userContext: any): string {
    const responses = {
      disc: "El test DISC evalúa cuatro dimensiones del comportamiento: Dominancia, Influencia, Estabilidad y Cumplimiento. Para obtener insights específicos sobre tu perfil, te recomiendo completar la evaluación DISC.",
      "big-five":
        "El modelo Big Five evalúa cinco dimensiones de personalidad: Apertura, Responsabilidad, Extraversión, Amabilidad y Neuroticismo. Completa la evaluación para obtener insights personalizados.",
      mbti: "El MBTI identifica 16 tipos de personalidad basados en cuatro dimensiones. Te ayudo mejor una vez que completes la evaluación MBTI.",
      riasec:
        "El modelo RIASEC de Holland identifica seis tipos de intereses vocacionales. Completa la evaluación para descubrir carreras que se alineen con tus intereses.",
      "soft-skills":
        "Las habilidades blandas son competencias interpersonales cruciales para el éxito profesional. Incluyen comunicación, liderazgo, trabajo en equipo y más.",
      career:
        "El desarrollo de carrera requiere autoevaluación, exploración de opciones y planificación estratégica. Te puedo ayudar mejor con insights específicos una vez que completes algunas evaluaciones.",
      development:
        "El desarrollo profesional es un proceso continuo que incluye autoevaluación, establecimiento de objetivos y adquisición de nuevas habilidades.",
      platform:
        "Nuestra plataforma utiliza evaluaciones psicométricas validadas y algoritmos de IA para proporcionar insights personalizados sobre desarrollo profesional.",
      general:
        "Estoy aquí para ayudarte con desarrollo profesional, interpretación de tests psicométricos y planificación de carrera. ¿En qué área específica te gustaría que te ayude?",
    }

    return responses[queryType as keyof typeof responses] || responses.general
  }

  private getNextSteps(queryType: string, userContext: any): string {
    if (userContext.completedTests === 0) {
      return "• Completa al menos 2-3 evaluaciones psicométricas\n• Revisa los resultados con el AI Coach\n• Define objetivos profesionales específicos"
    }

    const steps = {
      disc: "• Identifica tu estilo de comunicación preferido\n• Busca roles que se alineen con tu perfil DISC\n• Desarrolla flexibilidad comportamental",
      "big-five":
        "• Analiza cómo tus rasgos impactan tu trabajo\n• Identifica áreas de desarrollo prioritarias\n• Busca ambientes que potencien tus fortalezas",
      mbti: "• Explora carreras compatibles con tu tipo\n• Desarrolla habilidades complementarias\n• Busca equipos diversos que balanceen tu estilo",
      riasec:
        "• Investiga carreras en tus áreas de mayor interés\n• Busca experiencias en esos campos\n• Desarrolla habilidades técnicas relevantes",
      career:
        "• Define objetivos profesionales a 1, 3 y 5 años\n• Identifica brechas de habilidades\n• Construye una red profesional sólida",
      development:
        "• Crea un plan de desarrollo de 90 días\n• Busca oportunidades de práctica\n• Solicita feedback regular",
    }

    return (
      steps[queryType as keyof typeof steps] ||
      "• Define objetivos específicos\n• Crea un plan de acción\n• Busca apoyo y recursos"
    )
  }

  private calculateConfidence(knowledge: KnowledgeItem[], userContext: any, isFallback: boolean): number {
    let confidence = isFallback ? 60 : 80

    // Adjust based on knowledge availability
    confidence += Math.min(knowledge.length * 5, 15)

    // Adjust based on user context
    confidence += Math.min(userContext.completedTests * 3, 15)

    // Cap at reasonable limits
    return Math.min(Math.max(confidence, 30), 95)
  }

  private generateSuggestions(queryType: string, userContext: any): string[] {
    const baseSuggestions = {
      disc: [
        "¿Cómo puedo usar mi perfil DISC en el trabajo?",
        "¿Qué carreras se adaptan a mi estilo DISC?",
        "¿Cómo puedo desarrollar flexibilidad comportamental?",
      ],
      "big-five": [
        "¿Qué significan mis puntuaciones en Big Five?",
        "¿Cómo impactan mis rasgos en mi carrera?",
        "¿Qué ambientes de trabajo me convienen?",
      ],
      mbti: [
        "¿Cuáles son las fortalezas de mi tipo MBTI?",
        "¿Qué carreras son ideales para mi tipo?",
        "¿Cómo puedo trabajar mejor con otros tipos?",
      ],
      riasec: [
        "¿Qué carreras coinciden con mis intereses RIASEC?",
        "¿Cómo puedo explorar mis áreas de interés?",
        "¿Qué habilidades debo desarrollar?",
      ],
      career: [
        "Crea un plan de carrera personalizado",
        "¿Cómo puedo hacer una transición profesional?",
        "¿Qué habilidades son más demandadas?",
      ],
      development: [
        "Diseña un plan de desarrollo de 90 días",
        "¿Cómo puedo mejorar mis habilidades de liderazgo?",
        "¿Qué certificaciones me recomiendan?",
      ],
    }

    const suggestions = baseSuggestions[queryType as keyof typeof baseSuggestions] || [
      "¿Qué test me recomiendas hacer primero?",
      "Explícame cómo funciona la plataforma",
      "¿Qué beneficios tienen las evaluaciones psicométricas?",
      "Ayúdame a planificar mi desarrollo profesional",
    ]

    // Add context-specific suggestions
    if (userContext.completedTests === 0) {
      suggestions.unshift("¿Qué evaluaciones me recomiendas completar?")
    } else if (userContext.completedTests >= 3) {
      suggestions.push("Analiza mi perfil completo y recomienda carreras")
    }

    return suggestions.slice(0, 4)
  }

  private getFallbackResponse(query: string, testResults?: any[]): BrainResponse {
    return {
      response: `Lo siento, no pude procesar tu consulta completamente. Sin embargo, puedo ayudarte con:

• Interpretación de tests psicométricos (DISC, Big Five, MBTI, RIASEC)
• Recomendaciones de carrera basadas en tu perfil
• Planes de desarrollo profesional personalizados
• Estrategias para mejorar habilidades específicas

${
  testResults && testResults.length > 0
    ? `Veo que has completado ${testResults.length} evaluación(es). ¿Te gustaría que analice tus resultados específicos?`
    : "¿Te gustaría completar algunas evaluaciones para obtener insights personalizados?"
}`,
      confidence: 40,
      knowledgeUsed: [],
      suggestions: [
        "¿Qué test me recomiendas hacer primero?",
        "Explícame cómo funciona la plataforma",
        "¿Qué beneficios tienen las evaluaciones psicométricas?",
        "Ayúdame a planificar mi desarrollo profesional",
      ],
      sources: [],
      fallback: true,
    }
  }

  private async saveInteraction(userEmail: string, query: string, response: BrainResponse): Promise<void> {
    try {
      await this.supabase.from("ai_brain_interactions").insert({
        user_email: userEmail,
        query,
        response: response.response,
        knowledge_used: response.knowledgeUsed,
        confidence_score: response.confidence,
      })
    } catch (error) {
      console.error("Save interaction error:", error)
    }
  }

  async getUserInteractions(userEmail: string, limit = 10): Promise<any[]> {
    try {
      const { data, error } = await this.supabase
        .from("ai_brain_interactions")
        .select("*")
        .eq("user_email", userEmail)
        .order("created_at", { ascending: false })
        .limit(limit)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Get interactions error:", error)
      return []
    }
  }

  async saveInteractionRating(interactionId: number, rating: number): Promise<void> {
    try {
      await this.supabase.from("ai_brain_interactions").update({ user_rating: rating }).eq("id", interactionId)
    } catch (error) {
      console.error("Save rating error:", error)
    }
  }

  async toggleSaveInteraction(interactionId: number, isSaved: boolean): Promise<void> {
    try {
      await this.supabase.from("ai_brain_interactions").update({ is_saved: isSaved }).eq("id", interactionId)
    } catch (error) {
      console.error("Toggle save error:", error)
    }
  }
}

export const platformBrain = new PlatformBrain()
