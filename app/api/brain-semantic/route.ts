import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import OpenAI from "openai"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

function chunkText(text: string, maxLength = 1000, overlap = 200): string[] {
  const chunks: string[] = []
  let start = 0

  while (start < text.length) {
    const end = Math.min(start + maxLength, text.length)
    const chunk = text.slice(start, end)
    chunks.push(chunk)
    start = end - overlap
    if (start >= text.length - overlap) break
  }

  return chunks
}

function extractKeywords(text: string): string[] {
  const words = text.toLowerCase().split(/\W+/)
  const stopWords = new Set([
    "el",
    "la",
    "de",
    "que",
    "y",
    "a",
    "en",
    "un",
    "ser",
    "se",
    "no",
    "hay",
    "por",
    "con",
    "su",
    "para",
    "como",
    "está",
    "lo",
    "pero",
    "sus",
    "le",
    "ya",
    "o",
    "fue",
    "este",
    "ha",
    "si",
    "porque",
    "esta",
    "son",
    "entre",
    "cuando",
    "muy",
    "sin",
    "sobre",
    "también",
    "me",
    "hasta",
    "donde",
    "quien",
    "desde",
    "todos",
    "durante",
    "ese",
    "esa",
  ])

  const wordFreq = new Map<string, number>()
  words.forEach((word) => {
    if (word.length > 3 && !stopWords.has(word)) {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1)
    }
  })

  return Array.from(wordFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map((entry) => entry[0])
}

function calculateRelevanceScore(query: string, content: string): number {
  const queryWords = query.toLowerCase().split(/\W+/)
  const contentLower = content.toLowerCase()
  let matches = 0

  queryWords.forEach((word) => {
    if (word.length > 3 && contentLower.includes(word)) {
      matches++
    }
  })

  return matches / Math.max(queryWords.length, 1)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, similarityThreshold = 0.7, limit = 5 } = body

    if (!query || typeof query !== "string") {
      return NextResponse.json({ success: false, message: "Query is required" }, { status: 400 })
    }

    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: query,
    })

    const queryEmbedding = embeddingResponse.data[0].embedding

    const { data: results, error } = await supabase.rpc("match_knowledge_base", {
      query_embedding: queryEmbedding,
      match_threshold: similarityThreshold,
      match_count: limit,
    })

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ success: false, message: "Database query failed" }, { status: 500 })
    }

    if (!results || results.length === 0) {
      return NextResponse.json({
        success: true,
        answer:
          "No encontré información específica sobre esa pregunta en mi base de conocimientos. ¿Podrías reformular tu pregunta o preguntarme sobre otro tema?",
        confidence: 0,
        sources: [],
        keywords: [],
      })
    }

    const enrichedSources = results.map((result: any) => {
      const chunks = chunkText(result.content || "", 1000, 200)
      const relevantChunk =
        chunks
          .map((chunk) => ({
            chunk,
            score: calculateRelevanceScore(query, chunk),
          }))
          .sort((a, b) => b.score - a.score)[0]?.chunk || result.content

      return {
        title: result.title,
        author: result.author || "Autor desconocido",
        category: result.category,
        similarity: result.similarity,
        excerpt: relevantChunk.substring(0, 500),
        sourceType: result.source_type || "book",
        content: result.content,
      }
    })

    const contextParts = enrichedSources.map(
      (source, idx) => `[Fuente ${idx + 1}: ${source.title} por ${source.author}]\n${source.excerpt}\n---\n`,
    )

    const contextText = contextParts.join("\n")

    const systemPrompt = `Eres un asistente experto en desarrollo profesional, liderazgo, productividad y emprendimiento. 

Tu trabajo es proporcionar respuestas útiles, prácticas y basadas en las fuentes de conocimiento proporcionadas.

Características de tus respuestas:
- Concisas pero completas (2-3 párrafos)
- Prácticas y accionables
- Basadas en las fuentes proporcionadas
- En español claro y profesional
- Incluye ejemplos cuando sea relevante
- Si las fuentes no tienen información suficiente, dilo honestamente

Contexto de las fuentes:
${contextText}`

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: query },
      ],
      temperature: 0.7,
      max_tokens: 500,
    })

    const answer = completion.choices[0].message.content || "No pude generar una respuesta."

    const avgSimilarity = enrichedSources.reduce((sum, s) => sum + s.similarity, 0) / enrichedSources.length

    const confidence = Math.min(avgSimilarity * 100, 100)

    const keywords = extractKeywords(query)

    return NextResponse.json({
      success: true,
      answer,
      confidence,
      sources: enrichedSources.map((s) => ({
        title: s.title,
        author: s.author,
        category: s.category,
        similarity: s.similarity,
        excerpt: s.excerpt,
        sourceType: s.sourceType,
      })),
      keywords,
      metadata: {
        resultsCount: results.length,
        avgSimilarity,
      },
    })
  } catch (error) {
    console.error("Brain semantic error:", error)
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    )
  }
}
