import { NextResponse } from "next/server"

export async function GET() {
  try {
    console.log("[v0] Testing OpenAI API key...")
    console.log("[v0] API Key exists:", !!process.env.OPENAI_API_KEY)
    console.log("[v0] API Key starts with sk-:", process.env.OPENAI_API_KEY?.startsWith("sk-"))
    console.log("[v0] API Key length:", process.env.OPENAI_API_KEY?.length)

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: "Say 'Hello from OpenAI!' in Spanish",
          },
        ],
        max_tokens: 50,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`OpenAI API error: ${error}`)
    }

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content

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
