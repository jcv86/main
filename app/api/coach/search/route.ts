import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_BASE_URL = "https://api.openai.com/v1"

export async function POST(request: NextRequest) {
  try {
    const { query, userProfile } = await request.json()

    if (!OPENAI_API_KEY) {
      return NextResponse.json({ error: "OpenAI API key not configured" }, { status: 500 })
    }

    console.log("[v0] Search query:", query)

    // First, get all books from the database
    const { data: allBooks } = await supabase.from("books").select("*")
    const { data: knowledgeBase } = await supabase.from("knowledge_base").select("*")

    const combinedBooks = [
      ...(allBooks || []),
      ...(knowledgeBase || []),
    ]

    if (combinedBooks.length === 0) {
      return NextResponse.json({ results: [], reasoning: "No books found in database" })
    }

    // Use OpenAI to semantically search and rank books
    const searchPrompt = `You are an expert librarian. A user is searching for books with this query: "${query}"

Here are available books:
${combinedBooks.map((book: any, i: number) => `${i + 1}. "${book.title}" by ${book.author} - ${book.description || ""} (Category: ${book.category || "Unknown"})`).join("\n")}

Return a JSON response with:
1. "reasoning": Brief explanation of your search logic
2. "results": Array of book IDs (only top 5 most relevant) that match this query
3. "explanation": Why these books are relevant

Return ONLY valid JSON, no markdown.`

    const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: searchPrompt }],
        temperature: 0.5,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      console.error("[v0] OpenAI search error:", response.status)
      return NextResponse.json({ error: "Search failed" }, { status: 500 })
    }

    const data = await response.json()
    const content = data.choices?.[0]?.message?.content

    try {
      const searchResult = JSON.parse(content)
      
      // Map book indices to actual book objects
      const results = searchResult.results
        .map((idx: number) => combinedBooks[idx - 1])
        .filter(Boolean)
        .slice(0, 5)

      return NextResponse.json({
        results,
        reasoning: searchResult.reasoning || "Semantic search completed",
        explanation: searchResult.explanation,
      })
    } catch (parseError) {
      console.error("[v0] Failed to parse search results:", content)
      // Fallback: simple text search
      const lowerQuery = query.toLowerCase()
      const fallbackResults = combinedBooks
        .filter((book: any) =>
          book.title.toLowerCase().includes(lowerQuery) ||
          book.author.toLowerCase().includes(lowerQuery) ||
          book.description?.toLowerCase().includes(lowerQuery)
        )
        .slice(0, 5)

      return NextResponse.json({
        results: fallbackResults,
        reasoning: "Fallback text search",
      })
    }
  } catch (error) {
    console.error("[v0] Search API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
