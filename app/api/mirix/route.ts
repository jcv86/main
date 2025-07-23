import { type NextRequest, NextResponse } from "next/server"
import { mirixMemory, type MemoryType, type ImportanceLevel } from "@/lib/mirix-memory"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get("user_id")
    const action = searchParams.get("action")

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    switch (action) {
      case "memories":
        const agentId = searchParams.get("agent_id")
        const memoryType = searchParams.get("memory_type") as MemoryType
        const importance = searchParams.get("importance") as ImportanceLevel
        const search = searchParams.get("search")
        const tags = searchParams.get("tags")?.split(",").filter(Boolean)
        const limit = Number.parseInt(searchParams.get("limit") || "50")

        const memories = await mirixMemory.getMemories(userId, {
          agent_id: agentId || undefined,
          memory_type: memoryType || undefined,
          importance: importance || undefined,
          search: search || undefined,
          tags: tags || undefined,
          limit,
        })

        return NextResponse.json({ memories })

      case "memory":
        const memoryId = searchParams.get("memory_id")
        if (!memoryId) {
          return NextResponse.json({ error: "Memory ID is required" }, { status: 400 })
        }

        const memory = await mirixMemory.getMemory(memoryId, userId)
        if (!memory) {
          return NextResponse.json({ error: "Memory not found" }, { status: 404 })
        }

        return NextResponse.json({ memory })

      case "related":
        const sourceMemoryId = searchParams.get("memory_id")
        if (!sourceMemoryId) {
          return NextResponse.json({ error: "Memory ID is required" }, { status: 400 })
        }

        const relatedLimit = Number.parseInt(searchParams.get("limit") || "5")
        const relatedMemories = await mirixMemory.getRelatedMemories(sourceMemoryId, userId, relatedLimit)

        return NextResponse.json({ related_memories: relatedMemories })

      case "sessions":
        const sessionAgentId = searchParams.get("agent_id")
        const sessions = await mirixMemory.getSessions(userId, sessionAgentId || undefined)

        return NextResponse.json({ sessions })

      case "stats":
        const statsAgentId = searchParams.get("agent_id")
        const stats = await mirixMemory.getMemoryStats(userId, statsAgentId || undefined)

        return NextResponse.json({ stats })

      case "contextual":
        const contextAgentId = searchParams.get("agent_id")
        const context = searchParams.get("context")
        const contextLimit = Number.parseInt(searchParams.get("limit") || "10")

        if (!contextAgentId || !context) {
          return NextResponse.json({ error: "Agent ID and context are required" }, { status: 400 })
        }

        const contextualMemories = await mirixMemory.getContextualMemories(
          userId,
          contextAgentId,
          context,
          contextLimit,
        )

        return NextResponse.json({ memories: contextualMemories })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Mirix API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, user_id, ...data } = body

    if (!user_id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 })
    }

    switch (action) {
      case "store_memory":
        const { agent_id, session_id, memory_type, title, content, metadata, importance, tags, expires_at } = data

        if (!agent_id || !memory_type || !title || !content) {
          return NextResponse.json(
            {
              error: "Agent ID, memory type, title, and content are required",
            },
            { status: 400 },
          )
        }

        const newMemory = await mirixMemory.storeMemory({
          user_id,
          agent_id,
          memory_type,
          title,
          content,
          metadata: metadata || {},
          importance: importance || "medium",
          tags: tags || [],
          expires_at,
          last_accessed_at: undefined,
        })

        if (!newMemory) {
          return NextResponse.json({ error: "Failed to store memory" }, { status: 500 })
        }

        return NextResponse.json({ memory: newMemory })

      case "create_connection":
        const { source_memory_id, target_memory_id, connection_type, strength } = data

        if (!source_memory_id || !target_memory_id) {
          return NextResponse.json(
            {
              error: "Source and target memory IDs are required",
            },
            { status: 400 },
          )
        }

        const connection = await mirixMemory.createConnection(
          source_memory_id,
          target_memory_id,
          connection_type || "related",
          strength || 0.5,
        )

        if (!connection) {
          return NextResponse.json({ error: "Failed to create connection" }, { status: 500 })
        }

        return NextResponse.json({ connection })

      case "start_session":
        const { agent_id: sessionAgentId, session_data } = data

        if (!sessionAgentId) {
          return NextResponse.json({ error: "Agent ID is required" }, { status: 400 })
        }

        const session = await mirixMemory.startSession(user_id, sessionAgentId, session_data || {})

        if (!session) {
          return NextResponse.json({ error: "Failed to start session" }, { status: 500 })
        }

        return NextResponse.json({ session })

      case "end_session":
        const sessionId = data.session_id

        if (!sessionId) {
          return NextResponse.json({ error: "Session ID is required" }, { status: 400 })
        }

        const ended = await mirixMemory.endSession(sessionId, user_id)

        if (!ended) {
          return NextResponse.json({ error: "Failed to end session" }, { status: 500 })
        }

        return NextResponse.json({ success: true })

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 })
    }
  } catch (error) {
    console.error("Mirix API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { memory_id, user_id, ...updates } = body

    if (!memory_id || !user_id) {
      return NextResponse.json({ error: "Memory ID and User ID are required" }, { status: 400 })
    }

    const updatedMemory = await mirixMemory.updateMemory(memory_id, user_id, updates)

    if (!updatedMemory) {
      return NextResponse.json({ error: "Failed to update memory" }, { status: 500 })
    }

    return NextResponse.json({ memory: updatedMemory })
  } catch (error) {
    console.error("Mirix API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const memoryId = searchParams.get("memory_id")
    const userId = searchParams.get("user_id")

    if (!memoryId || !userId) {
      return NextResponse.json({ error: "Memory ID and User ID are required" }, { status: 400 })
    }

    const deleted = await mirixMemory.deleteMemory(memoryId, userId)

    if (!deleted) {
      return NextResponse.json({ error: "Failed to delete memory" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Mirix API Error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
