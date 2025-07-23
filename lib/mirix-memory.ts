import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export type MemoryType = "conversation" | "preference" | "insight" | "goal" | "context"
export type ImportanceLevel = "low" | "medium" | "high" | "critical"

export interface MirixMemory {
  id: string
  user_id: string
  agent_id: string
  session_id?: string
  memory_type: MemoryType
  title: string
  content: string
  metadata?: Record<string, any>
  importance: ImportanceLevel
  tags: string[]
  access_count: number
  last_accessed_at?: string
  expires_at?: string
  created_at: string
  updated_at: string
}

export interface MemoryConnection {
  id: string
  source_memory_id: string
  target_memory_id: string
  connection_type: string
  strength: number
  created_at: string
}

export interface MirixSession {
  id: string
  user_id: string
  agent_id: string
  session_data: Record<string, any>
  started_at: string
  ended_at?: string
  total_interactions: number
  created_at: string
}

// Helper function to handle Supabase errors and retries
async function withRetry<T>(operation: () => Promise<T>, maxRetries = 3, baseDelay = 1000): Promise<T> {
  let lastError: any

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error: any) {
      lastError = error

      // Check if it's a rate limiting error
      if (error.message && error.message.includes("Too Many")) {
        const delay = baseDelay * Math.pow(2, attempt) // Exponential backoff
        console.warn(`Rate limited, retrying in ${delay}ms (attempt ${attempt + 1}/${maxRetries})`)
        await new Promise((resolve) => setTimeout(resolve, delay))
        continue
      }

      // For other errors, don't retry
      throw error
    }
  }

  throw lastError
}

export class MirixMemorySystem {
  // Store a new memory
  async storeMemory(
    memory: Omit<MirixMemory, "id" | "created_at" | "updated_at" | "access_count">,
  ): Promise<MirixMemory | null> {
    try {
      return await withRetry(async () => {
        const { data, error } = await supabase.from("mirix_memories").insert([memory]).select().single()

        if (error) {
          console.error("Supabase error storing memory:", error)
          throw error
        }
        return data
      })
    } catch (error) {
      console.error("Error storing memory:", error)
      return null
    }
  }

  // Retrieve memories with optional filters
  async getMemories(
    userId: string,
    filters?: {
      agent_id?: string
      memory_type?: MemoryType
      importance?: ImportanceLevel
      tags?: string[]
      search?: string
      limit?: number
    },
  ): Promise<MirixMemory[]> {
    try {
      return await withRetry(async () => {
        let query = supabase
          .from("mirix_memories")
          .select("*")
          .eq("user_id", userId)
          .order("importance", { ascending: false })
          .order("created_at", { ascending: false })

        if (filters?.agent_id) {
          query = query.eq("agent_id", filters.agent_id)
        }

        if (filters?.memory_type) {
          query = query.eq("memory_type", filters.memory_type)
        }

        if (filters?.importance) {
          query = query.eq("importance", filters.importance)
        }

        if (filters?.tags && filters.tags.length > 0) {
          query = query.overlaps("tags", filters.tags)
        }

        if (filters?.search) {
          // Use simple text search instead of full-text search to avoid issues
          query = query.or(`title.ilike.%${filters.search}%,content.ilike.%${filters.search}%`)
        }

        if (filters?.limit) {
          query = query.limit(filters.limit)
        }

        const { data, error } = await query

        if (error) {
          console.error("Supabase error retrieving memories:", error)
          throw error
        }
        return data || []
      })
    } catch (error) {
      console.error("Error retrieving memories:", error)
      // Return empty array instead of throwing to prevent UI crashes
      return []
    }
  }

  // Get a specific memory and increment access count
  async getMemory(memoryId: string, userId: string): Promise<MirixMemory | null> {
    try {
      return await withRetry(async () => {
        // First get the memory
        const { data, error } = await supabase
          .from("mirix_memories")
          .select("*")
          .eq("id", memoryId)
          .eq("user_id", userId)
          .single()

        if (error) {
          console.error("Supabase error getting memory:", error)
          throw error
        }

        // Then try to increment access count (don't fail if this doesn't work)
        try {
          await supabase
            .from("mirix_memories")
            .update({
              access_count: (data.access_count || 0) + 1,
              last_accessed_at: new Date().toISOString(),
            })
            .eq("id", memoryId)
            .eq("user_id", userId)
        } catch (updateError) {
          console.warn("Error incrementing access count:", updateError)
        }

        return data
      })
    } catch (error) {
      console.error("Error getting memory:", error)
      return null
    }
  }

  // Update a memory
  async updateMemory(memoryId: string, userId: string, updates: Partial<MirixMemory>): Promise<MirixMemory | null> {
    try {
      return await withRetry(async () => {
        const { data, error } = await supabase
          .from("mirix_memories")
          .update(updates)
          .eq("id", memoryId)
          .eq("user_id", userId)
          .select()
          .single()

        if (error) {
          console.error("Supabase error updating memory:", error)
          throw error
        }
        return data
      })
    } catch (error) {
      console.error("Error updating memory:", error)
      return null
    }
  }

  // Delete a memory
  async deleteMemory(memoryId: string, userId: string): Promise<boolean> {
    try {
      await withRetry(async () => {
        const { error } = await supabase.from("mirix_memories").delete().eq("id", memoryId).eq("user_id", userId)

        if (error) {
          console.error("Supabase error deleting memory:", error)
          throw error
        }
      })
      return true
    } catch (error) {
      console.error("Error deleting memory:", error)
      return false
    }
  }

  // Get related memories
  async getRelatedMemories(memoryId: string, userId: string, limit = 5): Promise<any[]> {
    try {
      return await withRetry(async () => {
        // Get the source memory first
        const sourceMemory = await this.getMemory(memoryId, userId)
        if (!sourceMemory) return []

        // Find related memories based on tags and type
        const { data, error } = await supabase
          .from("mirix_memories")
          .select("*")
          .eq("user_id", userId)
          .neq("id", memoryId)
          .or(`memory_type.eq.${sourceMemory.memory_type},tags.ov.{${sourceMemory.tags.join(",")}}`)
          .limit(limit)

        if (error) {
          console.error("Supabase error getting related memories:", error)
          throw error
        }
        return data || []
      })
    } catch (error) {
      console.error("Error getting related memories:", error)
      return []
    }
  }

  // Create memory connection
  async createConnection(
    sourceMemoryId: string,
    targetMemoryId: string,
    connectionType = "related",
    strength = 0.5,
  ): Promise<MemoryConnection | null> {
    try {
      return await withRetry(async () => {
        const { data, error } = await supabase
          .from("mirix_memory_connections")
          .insert([
            {
              source_memory_id: sourceMemoryId,
              target_memory_id: targetMemoryId,
              connection_type: connectionType,
              strength,
            },
          ])
          .select()
          .single()

        if (error) {
          console.error("Supabase error creating connection:", error)
          throw error
        }
        return data
      })
    } catch (error) {
      console.error("Error creating connection:", error)
      return null
    }
  }

  // Start a new session
  async startSession(
    userId: string,
    agentId: string,
    sessionData: Record<string, any> = {},
  ): Promise<MirixSession | null> {
    try {
      return await withRetry(async () => {
        const { data, error } = await supabase
          .from("mirix_sessions")
          .insert([
            {
              user_id: userId,
              agent_id: agentId,
              session_data: sessionData,
            },
          ])
          .select()
          .single()

        if (error) {
          console.error("Supabase error starting session:", error)
          throw error
        }
        return data
      })
    } catch (error) {
      console.error("Error starting session:", error)
      return null
    }
  }

  // End a session
  async endSession(sessionId: string, userId: string): Promise<boolean> {
    try {
      await withRetry(async () => {
        const { error } = await supabase
          .from("mirix_sessions")
          .update({ ended_at: new Date().toISOString() })
          .eq("id", sessionId)
          .eq("user_id", userId)

        if (error) {
          console.error("Supabase error ending session:", error)
          throw error
        }
      })
      return true
    } catch (error) {
      console.error("Error ending session:", error)
      return false
    }
  }

  // Get user sessions
  async getSessions(userId: string, agentId?: string): Promise<MirixSession[]> {
    try {
      return await withRetry(async () => {
        let query = supabase
          .from("mirix_sessions")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })

        if (agentId) {
          query = query.eq("agent_id", agentId)
        }

        const { data, error } = await query

        if (error) {
          console.error("Supabase error getting sessions:", error)
          throw error
        }
        return data || []
      })
    } catch (error) {
      console.error("Error getting sessions:", error)
      return []
    }
  }

  // Get memory statistics - improved with client-side calculation
  async getMemoryStats(
    userId: string,
    agentId?: string,
  ): Promise<{
    total_memories: number
    by_type: Record<MemoryType, number>
    by_importance: Record<ImportanceLevel, number>
    total_access_count: number
    recent_memories: number
  }> {
    try {
      // Get all memories for the user and calculate stats client-side
      const memories = await this.getMemories(userId, { agent_id: agentId, limit: 1000 })

      const now = new Date()
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

      const stats = {
        total_memories: memories.length,
        by_type: {
          conversation: 0,
          preference: 0,
          insight: 0,
          goal: 0,
          context: 0,
        } as Record<MemoryType, number>,
        by_importance: {
          low: 0,
          medium: 0,
          high: 0,
          critical: 0,
        } as Record<ImportanceLevel, number>,
        total_access_count: 0,
        recent_memories: 0,
      }

      memories.forEach((memory) => {
        stats.by_type[memory.memory_type]++
        stats.by_importance[memory.importance]++
        stats.total_access_count += memory.access_count || 0

        if (new Date(memory.created_at) > weekAgo) {
          stats.recent_memories++
        }
      })

      return stats
    } catch (error) {
      console.error("Error getting memory stats:", error)
      return {
        total_memories: 0,
        by_type: { conversation: 0, preference: 0, insight: 0, goal: 0, context: 0 },
        by_importance: { low: 0, medium: 0, high: 0, critical: 0 },
        total_access_count: 0,
        recent_memories: 0,
      }
    }
  }

  // Clean expired memories
  async cleanExpiredMemories(): Promise<number> {
    try {
      return await withRetry(async () => {
        const { data, error } = await supabase
          .from("mirix_memories")
          .delete()
          .lt("expires_at", new Date().toISOString())
          .select("id")

        if (error) {
          console.error("Supabase error cleaning expired memories:", error)
          return 0
        }
        return data?.length || 0
      })
    } catch (error) {
      console.error("Error cleaning expired memories:", error)
      return 0
    }
  }

  // Smart memory retrieval for context
  async getContextualMemories(userId: string, agentId: string, context: string, limit = 10): Promise<MirixMemory[]> {
    try {
      // Get memories that match the context through search
      const searchMemories = await this.getMemories(userId, {
        agent_id: agentId,
        search: context,
        limit: Math.floor(limit * 0.7), // 70% from search
      })

      // Get recent high-importance memories
      const recentMemories = await this.getMemories(userId, {
        agent_id: agentId,
        importance: "high",
        limit: Math.floor(limit * 0.3), // 30% from recent high-importance
      })

      // Combine and deduplicate
      const allMemories = [...searchMemories, ...recentMemories]
      const uniqueMemories = allMemories.filter(
        (memory, index, self) => index === self.findIndex((m) => m.id === memory.id),
      )

      return uniqueMemories.slice(0, limit)
    } catch (error) {
      console.error("Error getting contextual memories:", error)
      return []
    }
  }
}

// Export singleton instance
export const mirixMemory = new MirixMemorySystem()
