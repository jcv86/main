import { createClient } from "@supabase/supabase-js"
import { semanticSearch } from "./embeddings"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export interface KnowledgeItem {
  id: number
  title: string
  category: string
  content: string
  author: string
  tags: string[]
  slug?: string
  url?: string
  sourceType: "book" | "web_resource"
  relevanceScore?: number
  similarityScore?: number
  created_at: string
  updated_at: string
}

export interface BrainQuery {
  query: string
  category?: string
  limit?: number
  context?: string
  useSemanticSearch?: boolean
  similarityThreshold?: number
}

export interface BrainResponse {
  answer: string
  sources: KnowledgeItem[]
  confidence: number
  suggestions: string[]
  categories_used: string[]
  search_time_ms: number
  search_method: "semantic" | "keyword" | "hybrid"
}

export class EnhancedPlatformBrainV2 {
  private knowledgeCache: Map<string, KnowledgeItem[]> = new Map()
  private cacheExpiry: Map<string, number> = new Map()
  private readonly CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

  /**
   * Search using semantic similarity (embeddings)
   */
  async semanticKnowledgeSearch(query: string, limit = 10): Promise<KnowledgeItem[]> {
    try {
      const results = await semanticSearch(query, {
        similarityThreshold: 0.7,
        limit,
      })

      return results.map((result) => ({
        id: result.id,
        title: result.title,
        category: result.category,
        content: result.contentPreview,
        author: result.author,
        tags: result.tags,
        slug: result.sourceType === "book" ? result.identifier : undefined,
        url: result.sourceType === "web_resource" ? result.identifier : undefined,
        sourceType: result.sourceType,
        similarityScore: result.similarityScore,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }))
    } catch (error) {
      console.error("Semantic search error:", error)
      return []
    }
  }

  /**
   * Search using traditional keyword search
   */
  async keywordKnowledgeSearch(query: string, category?: string, limit = 10): Promise<KnowledgeItem[]> {
    try {
      // Search in knowledge_base
      const { data: books, error: booksError } = await supabase
        .from("knowledge_base")
        .select("*")
        .or(`title.ilike.%${query}%,content.ilike.%${query}%,author.ilike.%${query}%`)
        .limit(limit / 2)

      if (booksError) {
        console.error("Books search error:", booksError)
      }

      // Search in web_resources
      const { data: resources, error: resourcesError } = await supabase
        .from("web_resources")
        .select("*")
        .or(`title.ilike.%${query}%,content.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(limit / 2)

      if (resourcesError) {
        console.error("Resources search error:", resourcesError)
      }

      const bookResults: KnowledgeItem[] =
        books?.map((book) => ({
          id: book.id,
          title: book.title,
          category: book.category,
          content: book.content,
          author: book.author,
          tags: book.tags || [],
          slug: book.slug,
          sourceType: "book" as const,
          created_at: book.created_at,
          updated_at: book.updated_at,
        })) || []

      const resourceResults: KnowledgeItem[] =
        resources?.map((resource) => ({
          id: resource.id,
          title: resource.title,
          category: resource.category,
          content: resource.content,
          author: resource.author || "Web Resource",
          tags: resource.tags || [],
          url: resource.url,
          sourceType: "web_resource" as const,
          created_at: resource.created_at,
          updated_at: resource.updated_at,
        })) || []

      return [...bookResults, ...resourceResults]
    } catch (error) {
      console.error("Keyword search error:", error)
      return []
    }
  }

  /**
   * Hybrid search combining semantic and keyword search
   */
  async hybridKnowledgeSearch(query: string, category?: string, limit = 10): Promise<KnowledgeItem[]> {
    try {
      // Get results from both methods
      const [semanticResults, keywordResults] = await Promise.all([
        this.semanticKnowledgeSearch(query, limit),
        this.keywordKnowledgeSearch(query, category, limit),
      ])

      // Merge and deduplicate results
      const resultsMap = new Map<string, KnowledgeItem>()

      semanticResults.forEach((result) => {
        const key = `${result.sourceType}-${result.id}`
        resultsMap.set(key, {
          ...result,
          relevanceScore: (result.similarityScore || 0) * 1.2, // Boost semantic results
        })
      })

      keywordResults.forEach((result) => {
        const key = `${result.sourceType}-${result.id}`
        const existing = resultsMap.get(key)
        if (existing) {
          // If found by both methods, boost the score
          existing.relevanceScore = (existing.relevanceScore || 0) + 0.5
        } else {
          resultsMap.set(key, {
            ...result,
            relevanceScore: 0.8, // Base score for keyword results
          })
        }
      })

      // Sort by relevance and return top results
      return Array.from(resultsMap.values())
        .sort((a, b) => (b.relevanceScore || 0) - (a.relevanceScore || 0))
        .slice(0, limit)
    } catch (error) {
      console.error("Hybrid search error:", error)
      return []
    }
  }

  /**
   * Generate AI-powered response based on knowledge base
   */
  async generateResponse(brainQuery: BrainQuery): Promise<BrainResponse> {
    const startTime = Date.now()
    const { query, category, limit = 5, context, useSemanticSearch = true } = brainQuery

    let relevantKnowledge: KnowledgeItem[] = []
    let searchMethod: "semantic" | "keyword" | "hybrid" = "keyword"

    // Choose search method
    if (useSemanticSearch) {
      relevantKnowledge = await this.hybridKnowledgeSearch(query, category, limit)
      searchMethod = "hybrid"
    } else {
      relevantKnowledge = await this.keywordKnowledgeSearch(query, category, limit)
      searchMethod = "keyword"
    }

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
        search_method: searchMethod,
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
      search_method: searchMethod,
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
      const sourceLabel = source.sourceType === "book" ? "📚 Libro" : "🌐 Recurso Web"
      answer += `**${index + 1}. ${sourceLabel}: "${source.title}"** - *${source.author}*\n`
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

    const avgRelevance =
      knowledge.reduce((sum, k) => sum + (k.relevanceScore || k.similarityScore || 0.5), 0) / knowledge.length
    const sourceCount = Math.min(knowledge.length / 5, 1) // Max confidence with 5+ sources

    return Math.min(avgRelevance * sourceCount * 100, 95) // Cap at 95%
  }
}

// Export singleton instance
export const platformBrainV2 = new EnhancedPlatformBrainV2()

// Helper function for quick queries
export async function queryBrainV2(query: string, options?: Partial<BrainQuery>): Promise<BrainResponse> {
  return platformBrainV2.generateResponse({ query, ...options })
}
