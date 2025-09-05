import { type NextRequest, NextResponse } from "next/server"
import { platformBrain } from "@/lib/platform-brain"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, userEmail, testResults, conversationHistory } = body

    if (!query || !userEmail) {
      return NextResponse.json({ error: "Query and userEmail are required" }, { status: 400 })
    }

    const response = await platformBrain.query({
      query,
      userEmail,
      testResults,
      conversationHistory,
    })

    return NextResponse.json({
      success: true,
      ...response,
    })
  } catch (error) {
    console.error("Brain query API error:", error)

    return NextResponse.json(
      {
        success: false,
        response: "Lo siento, hubo un problema procesando tu consulta. Por favor, intenta de nuevo.",
        confidence: 30,
        knowledgeUsed: [],
        suggestions: [
          "¿Qué test me recomiendas hacer?",
          "Explícame los beneficios de las evaluaciones",
          "¿Cómo puedo mejorar mi perfil profesional?",
        ],
        sources: [],
        fallback: true,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userEmail = searchParams.get("userEmail")
    const action = searchParams.get("action")

    if (!userEmail) {
      return NextResponse.json({ error: "userEmail is required" }, { status: 400 })
    }

    if (action === "history") {
      const limit = Number.parseInt(searchParams.get("limit") || "10")
      const interactions = await platformBrain.getUserInteractions(userEmail, limit)

      return NextResponse.json({
        success: true,
        interactions,
      })
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 })
  } catch (error) {
    console.error("Brain query GET API error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json()
    const { interactionId, rating, isSaved } = body

    if (!interactionId) {
      return NextResponse.json({ error: "interactionId is required" }, { status: 400 })
    }

    if (rating !== undefined) {
      await platformBrain.saveInteractionRating(interactionId, rating)
    }

    if (isSaved !== undefined) {
      await platformBrain.toggleSaveInteraction(interactionId, isSaved)
    }

    return NextResponse.json({
      success: true,
      message: "Interaction updated successfully",
    })
  } catch (error) {
    console.error("Brain query PATCH API error:", error)

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    )
  }
}
