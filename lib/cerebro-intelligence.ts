import { createClient } from "@/lib/supabase"
import { generateEmbedding } from "@/lib/embeddings"

export interface CerebroMemory {
  id: string
  memoryType: "fact" | "preference" | "goal" | "insight" | "pattern"
  content: string
  importanceScore: number
  confidenceScore: number
  tags: string[]
  metadata?: Record<string, any>
}

export interface ReasoningStep {
  step: number
  thought: string
  evidence: string[]
  confidence: number
}

export interface ReasoningChain {
  query: string
  steps: ReasoningStep[]
  conclusion: string
  overallConfidence: number
  sourcesUsed: any[]
}

export interface UserPattern {
  patternType: "query_style" | "learning_preference" | "topic_interest" | "time_pattern"
  patternData: Record<string, any>
  confidence: number
  sampleSize: number
}

export interface PredictiveInsight {
  insightType: "skill_gap" | "career_opportunity" | "learning_recommendation" | "goal_suggestion"
  prediction: string
  reasoning: string
  confidenceScore: number
  priority: number
}

/**
 * Enhanced Cerebro Intelligence System
 * Provides advanced AI capabilities with memory, reasoning, and learning
 */
export class CerebroIntelligence {
  private supabaseInstance: any = null

  private getSupabase() {
    if (!this.supabaseInstance) {
      this.supabaseInstance = createClient()
    }
    return this.supabaseInstance
  }

  /**
   * Store a memory for long-term context
   */
  async storeMemory(userId: string, conversationId: string, memory: Omit<CerebroMemory, "id">): Promise<void> {
    try {
      // Generate embedding for semantic search
      const embedding = await generateEmbedding(memory.content)

      await this.getSupabase().from("cerebro_conversation_memory").insert({
        user_id: userId,
        conversation_id: conversationId,
        memory_type: memory.memoryType,
        content: memory.content,
        importance_score: memory.importanceScore,
        confidence_score: memory.confidenceScore,
        tags: memory.tags,
        metadata: memory.metadata || {},
        embedding,
      })
    } catch (error) {
      console.error("Error storing memory:", error)
    }
  }

  /**
   * Retrieve relevant memories using semantic search
   */
  async retrieveRelevantMemories(
    userId: string,
    query: string,
    options: {
      similarityThreshold?: number
      limit?: number
      memoryTypes?: CerebroMemory["memoryType"][]
    } = {},
  ): Promise<CerebroMemory[]> {
    try {
      const { similarityThreshold = 0.75, limit = 5, memoryTypes } = options

      // Generate query embedding
      const queryEmbedding = await generateEmbedding(query)

      const { data, error } = await this.getSupabase().rpc("search_cerebro_memory", {
        p_user_id: userId,
        p_query_embedding: queryEmbedding,
        p_similarity_threshold: similarityThreshold,
        p_limit: limit,
      })

      if (error) throw error

      let memories = data || []

      // Filter by memory types if specified
      if (memoryTypes && memoryTypes.length > 0) {
        memories = memories.filter((m: any) => memoryTypes.includes(m.memory_type))
      }

      return memories.map((m: any) => ({
        id: m.memory_id,
        memoryType: m.memory_type,
        content: m.content,
        importanceScore: m.importance_score,
        confidenceScore: m.similarity_score,
        tags: m.tags,
      }))
    } catch (error) {
      console.error("Error retrieving memories:", error)
      return []
    }
  }

  /**
   * Store a reasoning chain for complex analysis
   */
  async storeReasoningChain(userId: string, chain: ReasoningChain, processingTimeMs: number): Promise<string | null> {
    try {
      const { data, error } = await this.getSupabase()
        .from("cerebro_reasoning_chains")
        .insert({
          user_id: userId,
          query: chain.query,
          reasoning_steps: chain.steps,
          final_conclusion: chain.conclusion,
          confidence_score: chain.overallConfidence,
          sources_used: chain.sourcesUsed,
          processing_time_ms: processingTimeMs,
        })
        .select("id")
        .single()

      if (error) throw error
      return data?.id || null
    } catch (error) {
      console.error("Error storing reasoning chain:", error)
      return null
    }
  }

  /**
   * Learn user patterns from interactions
   */
  async learnUserPattern(userId: string, pattern: UserPattern): Promise<void> {
    try {
      // Check if pattern already exists
      const { data: existing } = await this.getSupabase()
        .from("cerebro_user_patterns")
        .select("*")
        .eq("user_id", userId)
        .eq("pattern_type", pattern.patternType)
        .single()

      if (existing) {
        // Update existing pattern
        await this.getSupabase()
          .from("cerebro_user_patterns")
          .update({
            pattern_data: pattern.patternData,
            confidence: pattern.confidence,
            sample_size: existing.sample_size + 1,
            last_updated: new Date().toISOString(),
          })
          .eq("id", existing.id)
      } else {
        // Create new pattern
        await this.getSupabase().from("cerebro_user_patterns").insert({
          user_id: userId,
          pattern_type: pattern.patternType,
          pattern_data: pattern.patternData,
          confidence: pattern.confidence,
          sample_size: pattern.sampleSize,
        })
      }
    } catch (error) {
      console.error("Error learning user pattern:", error)
    }
  }

  /**
   * Get user patterns for personalization
   */
  async getUserPatterns(userId: string): Promise<UserPattern[]> {
    try {
      const { data, error } = await this.getSupabase()
        .from("cerebro_user_patterns")
        .select("*")
        .eq("user_id", userId)
        .eq("is_active", true)
        .order("confidence", { ascending: false })

      if (error) throw error

      return (data || []).map((p: any) => ({
        patternType: p.pattern_type,
        patternData: p.pattern_data,
        confidence: p.confidence,
        sampleSize: p.sample_size,
      }))
    } catch (error) {
      console.error("Error getting user patterns:", error)
      return []
    }
  }

  /**
   * Generate predictive insights
   */
  async generatePredictiveInsight(userId: string, insight: PredictiveInsight): Promise<void> {
    try {
      await this.getSupabase().from("cerebro_predictive_insights").insert({
        user_id: userId,
        insight_type: insight.insightType,
        prediction: insight.prediction,
        reasoning: insight.reasoning,
        confidence_score: insight.confidenceScore,
        priority: insight.priority,
      })
    } catch (error) {
      console.error("Error generating predictive insight:", error)
    }
  }

  /**
   * Get pending predictive insights for user
   */
  async getPendingInsights(userId: string, limit = 5): Promise<PredictiveInsight[]> {
    try {
      const { data, error } = await this.getSupabase()
        .from("cerebro_predictive_insights")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "pending")
        .order("priority", { ascending: false })
        .order("created_at", { ascending: false })
        .limit(limit)

      if (error) throw error

      return (data || []).map((i: any) => ({
        insightType: i.insight_type,
        prediction: i.prediction,
        reasoning: i.reasoning,
        confidenceScore: i.confidence_score,
        priority: i.priority,
      }))
    } catch (error) {
      console.error("Error getting pending insights:", error)
      return []
    }
  }

  /**
   * Record user feedback for learning
   */
  async recordFeedback(
    userId: string,
    query: string,
    response: string,
    feedback: {
      type: "positive" | "negative" | "correction"
      rating?: number
      details?: string
      whatWorked?: string
      whatDidntWork?: string
      suggestedImprovement?: string
    },
  ): Promise<void> {
    try {
      await this.getSupabase().from("cerebro_feedback_learning").insert({
        user_id: userId,
        query,
        response,
        feedback_type: feedback.type,
        rating: feedback.rating,
        feedback_details: feedback.details,
        what_worked: feedback.whatWorked,
        what_didnt_work: feedback.whatDidntWork,
        suggested_improvement: feedback.suggestedImprovement,
      })
    } catch (error) {
      console.error("Error recording feedback:", error)
    }
  }

  /**
   * Get comprehensive user context for AI
   */
  async getUserContext(userId: string): Promise<any> {
    try {
      const { data, error } = await this.getSupabase()
        .from("cerebro_user_context")
        .select("*")
        .eq("user_id", userId)
        .single()

      if (error) {
        // Table doesn't exist yet, return null gracefully
        if (error.code === "42P01") {
          console.log("cerebro_user_context table doesn't exist yet")
          return null
        }
        throw error
      }
      return data
    } catch (error) {
      console.error("Error getting user context:", error)
      return null
    }
  }

  /**
   * Get intelligence metrics
   */
  async getIntelligenceMetrics(days = 30): Promise<any[]> {
    try {
      const { data, error } = await this.getSupabase().from("cerebro_intelligence_metrics").select("*").limit(days)

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error getting intelligence metrics:", error)
      return []
    }
  }
}

// Lazy singleton to avoid build-time initialization
let instance: CerebroIntelligence | null = null

export function getCerebroIntelligence(): CerebroIntelligence {
  if (!instance) {
    instance = new CerebroIntelligence()
  }
  return instance
}

// Deprecated - use getCerebroIntelligence() instead
export const cerebroIntelligence = new Proxy({} as CerebroIntelligence, {
  get: (target, prop) => {
    return Reflect.get(getCerebroIntelligence(), prop)
  },
})
