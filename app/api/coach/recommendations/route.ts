import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_BASE_URL = "https://api.openai.com/v1"

export async function POST(request: NextRequest) {
  try {
    const { userProfile } = await request.json()

    if (!OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 })
    }

    console.log("[v0] Generating recommendations for profile:", userProfile.discType)

    // Get all books
    const { data: allBooks } = await supabase.from("books").select("*")
    const { data: knowledgeBase } = await supabase.from("knowledge_base").select("*")

    const combinedBooks = [
      ...(allBooks || []),
      ...(knowledgeBase || []),
    ]

    if (combinedBooks.length === 0) {
      return NextResponse.json({ recommendations: [] })
    }

    // Use OpenAI to generate recommendations based on profile
    const recommendationPrompt = `You are a career coach expert. Based on this user profile, recommend the most relevant books for their development:

User Profile:
- DISC Type: ${userProfile.discType || "Unknown"}
- Career Stage: ${userProfile.careerStage || "Unknown"}
- Goals: ${userProfile.goals || "General professional development"}
- Pain Points: ${userProfile.painPoints || "Not specified"}

Available books:
${combinedBooks.map((book: any, i: number) => `${i + 1}. "${book.title}" by ${book.author} - Category: ${book.category} - Topics: ${book.key_topics?.join(", ") || book.tags?.join(", ") || "General"}`).join("\n")}

Return a JSON response with:
1. "recommendations": Array of objects with { bookIndex: number (1-based), reason: string } - top 5 recommendations
2. "keyInsight": A short insight about why these books fit this profile

Return ONLY valid JSON, no markdown.`

    const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: recommendationPrompt }],
        temperature: 0.7,
        max_tokens: 800,
      }),
    })

    if (!response.ok) {
      console.error("[v0] OpenAI recommendation error:", response.status)
      return NextResponse.json({ recommendations: [] })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    try {
      const result = JSON.parse(content)
      
      // Map recommendations to actual books
      const recommendations = result.recommendations
        .map((rec: any) => ({
          book: combinedBooks[rec.bookIndex - 1],
          reason: rec.reason,
        }))
        .filter((item: any) => item.book)
        .slice(0, 5)

      return NextResponse.json({
        recommendations,
        keyInsight: result.keyInsight || "Recommendations generated based on your profile",
      })
    } catch (parseError) {
      console.error("[v0] Failed to parse recommendations:", content)
      // Fallback: return random recommendations
      const fallbackRecommendations = combinedBooks
        .sort(() => Math.random() - 0.5)
        .slice(0, 5)
        .map((book: any) => ({
          book,
          reason: "Recommended for general professional development",
        }))

      return NextResponse.json({
        recommendations: fallbackRecommendations,
        keyInsight: "Fallback recommendations",
      })
    }
  } catch (error) {
    console.error("[v0] Recommendations API error:", error)
    return NextResponse.json({ recommendations: [] })
  }
}
