// Enhanced Platform Brain with comprehensive knowledge base
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export interface KnowledgeItem {
  id: number
  title: string
  category: string
  content: string
  author: string
  tags: string[]
  slug: string
  read_count: number
  relevance_score?: number
  created_at: string
  updated_at: string
}

export interface BrainQuery {
  query: string
  category?: string
  limit?: number
  context?: string
}

export interface BrainResponse {
  answer: string
  sources: KnowledgeItem[]
  confidence: number
  suggestions: string[]
  categories_used: string[]
  search_time_ms: number
}

export class EnhancedPlatformBrain {
  private knowledgeCache: Map<string, KnowledgeItem[]> = new Map()
  private cacheExpiry: Map<string, number> = new Map()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  /**
   * Search the knowledge base with full-text search and relevance scoring
   */
  async searchKnowledge(query: string, category?: string, limit = 10): Promise<KnowledgeItem[]> {
    const cacheKey = `${query}-${category || "all"}-${limit}`

    // Check cache first
    if (this.knowledgeCache.has(cacheKey)) {
      const expiry = this.cacheExpiry.get(cacheKey) || 0
      if (Date.now() < expiry) {
        return this.knowledgeCache.get(cacheKey)!
      }
    }

    try {
      const { data, error } = await supabase.rpc("search_knowledge_base", {
        search_query: query,
        category_filter: category || null,
        limit_results: limit,
      })

      if (error) {
        console.error("Knowledge search error:", error)
        return this.getFallbackKnowledge(query)
      }

      const results = data || []

      // Cache results
      this.knowledgeCache.set(cacheKey, results)
      this.cacheExpiry.set(cacheKey, Date.now() + this.CACHE_DURATION)

      return results
    } catch (error) {
      console.error("Knowledge search failed:", error)
      return this.getFallbackKnowledge(query)
    }
  }

  /**
   * Generate AI-powered response based on knowledge base
   */
  async generateResponse(brainQuery: BrainQuery): Promise<BrainResponse> {
    const startTime = Date.now()
    const { query, category, limit = 5, context } = brainQuery

    // Search relevant knowledge
    const relevantKnowledge = await this.searchKnowledge(query, category, limit)

    if (relevantKnowledge.length === 0) {
      return {
        answer:
          "No encontré información específica sobre tu consulta en mi base de conocimientos. ¿Podrías reformular tu pregunta o ser más específico?",
        sources: [],
        confidence: 0,
        suggestions: [
          "Intenta usar palabras clave diferentes",
          "Especifica una categoría (liderazgo, productividad, etc.)",
          "Haz una pregunta más específica",
        ],
        categories_used: [],
        search_time_ms: Date.now() - startTime,
      }
    }

    // Extract categories used
    const categoriesUsed = [...new Set(relevantKnowledge.map((item) => item.category))]

    // Generate contextual response
    const answer = this.generateContextualAnswer(query, relevantKnowledge, context)
    const suggestions = this.generateSuggestions(query, relevantKnowledge)
    const confidence = this.calculateConfidence(relevantKnowledge)

    return {
      answer,
      sources: relevantKnowledge,
      confidence,
      suggestions,
      categories_used: categoriesUsed,
      search_time_ms: Date.now() - startTime,
    }
  }

  /**
   * Generate contextual answer based on knowledge
   */
  private generateContextualAnswer(query: string, knowledge: KnowledgeItem[], context?: string): string {
    const topSources = knowledge.slice(0, 3)
    const categories = [...new Set(topSources.map((k) => k.category))]

    let answer = `🧠 **Respuesta del Cerebro de la Plataforma**\n\n`
    answer += `Basándome en mi conocimiento de **${categories.join(", ")}**, aquí tienes información relevante:\n\n`

    // Add insights from top sources
    topSources.forEach((source, index) => {
      answer += `**${index + 1}. "${source.title}"** - *${source.author}*\n`
      answer += `${source.content.substring(0, 200)}...\n\n`
    })

    // Add contextual advice if context is provided
    if (context) {
      answer += this.generateContextualAdvice(query, context, topSources)
    }

    // Add actionable recommendations
    answer += "**🎯 Recomendaciones Clave:**\n"
    answer += this.generateActionableRecommendations(topSources)

    return answer
  }

  /**
   * Generate contextual advice based on user context
   */
  private generateContextualAdvice(query: string, context: string, sources: KnowledgeItem[]): string {
    const contextLower = context.toLowerCase()
    let advice = "**💡 Aplicado a tu situación:**\n"

    if (contextLower.includes("líder") || contextLower.includes("manager")) {
      advice += "• Como líder, enfócate en desarrollar a tu equipo y crear un ambiente de confianza\n"
      advice += "• Implementa feedback regular y reconoce los logros de tu equipo\n"
    }

    if (contextLower.includes("carrera") || contextLower.includes("profesional")) {
      advice += "• Desarrolla habilidades que agreguen valor único a tu organización\n"
      advice += "• Construye una red de contactos profesionales sólida\n"
    }

    if (contextLower.includes("productividad") || contextLower.includes("tiempo")) {
      advice += "• Identifica tus horas más productivas y protégelas para trabajo importante\n"
      advice += "• Elimina distracciones y enfócate en una tarea a la vez\n"
    }

    return advice + "\n"
  }

  /**
   * Generate actionable recommendations
   */
  private generateActionableRecommendations(sources: KnowledgeItem[]): string {
    const recommendations = [
      "• Comienza con pequeños cambios incrementales para crear momentum",
      "• Establece métricas claras para medir tu progreso",
      "• Busca un mentor o coach que te guíe en tu desarrollo",
      "• Practica regularmente las nuevas habilidades que aprendas",
      "• Comparte tu aprendizaje con otros para reforzar el conocimiento",
    ]

    // Customize based on source categories
    const categories = sources.map((s) => s.category)

    if (categories.includes("Liderazgo")) {
      recommendations.push("• Solicita feedback 360° de tu equipo y superiores")
      recommendations.push("• Invierte tiempo en conversaciones uno-a-uno con tu equipo")
    }

    if (categories.includes("Productividad")) {
      recommendations.push("• Implementa un sistema de gestión de tareas consistente")
      recommendations.push("• Revisa y ajusta tus hábitos semanalmente")
    }

    return recommendations.slice(0, 5).join("\n")
  }

  /**
   * Generate follow-up suggestions
   */
  private generateSuggestions(query: string, knowledge: KnowledgeItem[]): string[] {
    const suggestions: string[] = []
    const categories = [...new Set(knowledge.map((k) => k.category))]
    const tags = [...new Set(knowledge.flatMap((k) => k.tags))].slice(0, 5)

    // Category-based suggestions
    categories.forEach((category) => {
      suggestions.push(`Explora más sobre ${category}`)
    })

    // Tag-based suggestions
    tags.forEach((tag) => {
      suggestions.push(`Aprende sobre ${tag}`)
    })

    // Query-specific suggestions
    if (query.toLowerCase().includes("liderazgo")) {
      suggestions.push("¿Cómo desarrollar habilidades de comunicación?")
      suggestions.push("¿Qué hace a un líder efectivo?")
    }

    if (query.toLowerCase().includes("productividad")) {
      suggestions.push("¿Cómo formar hábitos duraderos?")
      suggestions.push("¿Cuáles son las mejores técnicas de gestión del tiempo?")
    }

    return suggestions.slice(0, 4)
  }

  /**
   * Calculate confidence score based on relevance
   */
  private calculateConfidence(knowledge: KnowledgeItem[]): number {
    if (knowledge.length === 0) return 0

    const avgRelevance = knowledge.reduce((sum, k) => sum + (k.relevance_score || 0.5), 0) / knowledge.length
    const sourceCount = Math.min(knowledge.length / 5, 1) // Max confidence with 5+ sources

    return Math.min(avgRelevance * sourceCount * 100, 95) // Cap at 95%
  }

  /**
   * Fallback knowledge when database is unavailable
   */
  private getFallbackKnowledge(query: string): KnowledgeItem[] {
    const fallbackItems: KnowledgeItem[] = [
      {
        id: 1,
        title: "Desarrollo de Carrera Profesional",
        content:
          "Guía completa para planificar y ejecutar una carrera exitosa, incluyendo autoconocimiento, networking y desarrollo de habilidades clave.",
        category: "Desarrollo de Carrera",
        author: "Plataforma DespegaTuCarrera",
        tags: ["carrera", "desarrollo", "profesional"],
        slug: "desarrollo-carrera",
        read_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ]

    return fallbackItems.filter(
      (item) =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.content.toLowerCase().includes(query.toLowerCase()) ||
        item.tags.some((tag) => query.toLowerCase().includes(tag)),
    )
  }
}

// Export singleton instance
export const platformBrain = new EnhancedPlatformBrain()

// Helper function for quick queries
export async function queryBrain(query: string, category?: string): Promise<BrainResponse> {
  return platformBrain.generateResponse({ query, category })
}

// Enhanced platform brain query with formatted results for book recommendations
export async function enhancedPlatformBrainQuery(query: string, options?: { limit?: number; category?: string }) {
  try {
    const response = await platformBrain.generateResponse({
      query,
      category: options?.category,
      limit: options?.limit || 3,
    })

    // Format results for conversational learning (returns books/resources)
    return {
      answer: response.answer,
      results: response.sources.map((source) => ({
        id: source.id,
        title: source.title,
        author: source.author,
        category: source.category,
        content: source.content,
        tags: source.tags,
        relevance_score: source.relevance_score || 0.8,
      })),
      confidence: response.confidence,
      suggestions: response.suggestions,
      search_time_ms: response.search_time_ms,
    }
  } catch (error) {
    console.error('Error in enhanced platform brain query:', error)
    return {
      answer: 'No encontré información en este momento.',
      results: [],
      confidence: 0,
      suggestions: [],
      search_time_ms: 0,
    }
  }
}
