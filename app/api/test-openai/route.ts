import { NextResponse } from "next/server"
import { generateText } from "ai"

export async function GET() {
  try {
    console.log("[v0] Testing OpenAI API key...")
    console.log("[v0] API Key exists:", !!process.env.OPENAI_API_KEY)
    console.log("[v0] API Key starts with sk-:", process.env.OPENAI_API_KEY?.startsWith("sk-"))
    console.log("[v0] API Key length:", process.env.OPENAI_API_KEY?.length)

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      prompt: "Say 'Hello from OpenAI!' in Spanish",
      maxOutputTokens: 50,
    })

    console.log("[v0] OpenAI response:", text)

    return NextResponse.json({
      success: true,
      message: "OpenAI API key is working!",
      response: text,
      keyInfo: {
        exists: !!process.env.OPENAI_API_KEY,
        startsWithSk: process.env.OPENAI_API_KEY?.startsWith("sk-"),
        length: process.env.OPENAI_API_KEY?.length,
      },
    })
  } catch (error: any) {
    console.error("[v0] OpenAI test error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: error.toString(),
        keyInfo: {
          exists: !!process.env.OPENAI_API_KEY,
          startsWithSk: process.env.OPENAI_API_KEY?.startsWith("sk-"),
          length: process.env.OPENAI_API_KEY?.length,
        },
      },
      { status: 500 },
    )
  }
}
