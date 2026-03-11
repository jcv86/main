import { NextResponse, NextRequest } from "next/server"

export async function GET(request: NextRequest) {
  try {
    console.log("[v0] Testing direct OpenAI API (no Vercel AI SDK)...")
    
    const apiKey = process.env.OPENAI_API_KEY
    console.log("[v0] API Key exists:", !!apiKey)
    console.log("[v0] API Key starts with sk-:", apiKey?.startsWith("sk-"))
    
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not set")
    }

    // Call OpenAI API directly
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: "Say 'Hello from direct OpenAI API!' in Spanish in just one sentence"
          }
        ],
        max_tokens: 50,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error("[v0] OpenAI API error:", error)
      throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`)
    }

    const data = await response.json()
    console.log("[v0] OpenAI response received:", data.choices?.[0]?.message?.content)

    return NextResponse.json({
      success: true,
      message: "Direct OpenAI API call successful!",
      response: data.choices?.[0]?.message?.content,
      model: data.model,
      usage: data.usage,
      keyInfo: {
        exists: !!apiKey,
        startsWithSk: apiKey?.startsWith("sk-"),
        length: apiKey?.length,
      },
    })
  } catch (error: any) {
    console.error("[v0] Direct OpenAI test error:", error)

    return NextResponse.json(
      {
        success: false,
        error: error.message,
        details: error.toString(),
      },
      { status: 500 },
    )
  }
}
