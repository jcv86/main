import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(request: NextRequest) {
  try {
    const { messages, temperature = 0.7 } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Messages array is required" }, { status: 400 })
    }

    // Ensure we have the OpenAI API key
    if (!process.env.OPENAI_API_KEY) {
      console.error("OpenAI API key not found")
      return NextResponse.json({ error: "AI service temporarily unavailable" }, { status: 503 })
    }

    // Generate response using AI SDK
    const { text } = await generateText({
      model: openai("gpt-4o"),
      messages: messages.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      temperature,
      maxTokens: 1000,
    })

    return NextResponse.json({
      message: text,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error in AI coach API:", error)

    // Return a helpful fallback response
    return NextResponse.json({
      message:
        "Lo siento, estoy experimentando dificultades técnicas en este momento. Como coach, te recomiendo que reflexiones sobre tus fortalezas identificadas en los tests y consideres cómo puedes aplicarlas en tu desarrollo profesional. ¿Hay algún aspecto específico de tus resultados sobre el que te gustaría reflexionar?",
      timestamp: new Date().toISOString(),
      fallback: true,
    })
  }
}
