import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import OpenAI from "openai"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function extractKeywords(query: string): string[] {
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
    "haber",
    "por",
    "con",
    "su",
    "para",
    "como",
    "estar",
    "tener",
    "le",
    "lo",
    "todo",
    "pero",
    "más",
    "hacer",
    "o",
    "poder",
    "decir",
    "este",
    "ir",
    "otro",
    "ese",
    "si",
    "me",
    "ya",
    "ver",
    "porque",
    "dar",
    "cuando",
    "él",
    "muy",
    "sin",
    "vez",
    "mucho",
    "saber",
    "qué",
    "sobre",
    "mi",
    "alguno",
    "mismo",
    "yo",
    "también",
    "hasta",
    "año",
    "dos",
    "querer",
    "entre",
    "así",
    "primero",
    "desde",
    "grande",
    "eso",
    "ni",
    "nos",
    "llegar",
    "pasar",
    "tiempo",
    "ella",
    "sí",
    "día",
    "uno",
    "bien",
    "poco",
    "deber",
    "entonces",
    "poner",
    "cosa",
    "tanto",
    "hombre",
    "parecer",
    "nuestro",
    "tan",
    "donde",
    "ahora",
    "parte",
    "después",
    "vida",
    "quedar",
    "siempre",
    "creer",
    "hablar",
    "llevar",
    "dejar",
    "nada",
    "cada",
    "seguir",
    "menos",
    "nuevo",
    "encontrar",
    "algo",
    "solo",
    "cual",
    "hay",
  ])

  return query
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 3 && !stopWords.has(word))
}

function findRelevantChunk(content: string, keywords: string[], chunkSize = 500): string {
  if (!content) return ""

  const sentences = content.split(/[.!?]+/).filter((s) => s.trim().length > 0)

  const scoredSentences = sentences.map((sentence, idx) => {
    const lowerSentence = sentence.toLowerCase()
    const score = keywords.reduce((sum, keyword) => {
      return sum + (lowerSentence.includes(keyword) ? 1 : 0)
    }, 0)

    return { sentence, score, idx }
  })

  scoredSentences.sort((a, b) => b.score - a.score)

  const topSentences = scoredSentences.slice(0, 3)
  const indices = topSentences.map((s) => s.idx).sort((a, b) => a - b)

  let chunk = ""
  for (const idx of indices) {
    const start = Math.max(0, idx - 1)
    const end = Math.min(sentences.length, idx + 2)
    const sentenceGroup = sentences.slice(start, end).join(". ")

    if (chunk.length + sentenceGroup.length < chunkSize) {
      chunk += (chunk ? " " : "") + sentenceGroup
    }
  }

  return chunk || content.substring(0, chunkSize)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, similarityThreshold = 0.7, limit = 5 } = body

    if (!query || typeof query !== "string") {
      return NextResponse.json({ success: false, error: "Query is required and must be a string" }, { status: 400 })
    }

    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      return NextResponse.json(
        {
          success: false,
          error: "OpenAI API key not configured",
          message: "Please add OPENAI_API_KEY to your environment variables",
        },
        { status: 500 },
      )
    }

    const openai = new OpenAI({ apiKey: openaiApiKey })

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY
    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Supabase not configured",
          message: "Please configure Supabase environment variables",
        },
        { status: 500 },
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    const embeddingResponse = await openai.embeddings.create({
      model: "text-embedding-ada-002",
      input: query,
    })

    const queryEmbedding = embeddingResponse.data[0].embedding

    const { data: matches, error: matchError } = await supabase.rpc("match_knowledge_base", {
      query_embedding: queryEmbedding,
      match_threshold: similarityThreshold,
      match_count: limit,
    })

    if (matchError) {
      console.error("Match error:", matchError)
      return NextResponse.json(
        {
          success: false,
          error: "Database search failed",
          message: matchError.message,
        },
        { status: 500 },
      )
    }

    if (!matches || matches.length === 0) {
      return NextResponse.json({
        success: true,
        answer:
          "Lo siento, no encontré información relevante en mi base de conocimiento para responder tu pregunta. Por favor, intenta reformular tu pregunta o pregunta sobre temas de desarrollo profesional, liderazgo, productividad o emprendimiento.",
        confidence: 0,
        sources: [],
      })
    }

    const keywords = extractKeywords(query)
    const contextChunks = matches.map((match: any) => {
      const content = match.content || ""
      const relevantChunk = findRelevantChunk(content, keywords)

      return {
        title: match.title,
        author: match.author,
        category: match.category,
        similarity: match.similarity,
        excerpt: relevantChunk,
        sourceType: match.source_type || "book",
      }
    })

    const context = contextChunks
      .map((chunk, idx) => `Fuente ${idx + 1} (${chunk.title} por ${chunk.author}):\n${chunk.excerpt}\n`)
      .join("\n\n")

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `Eres un experto coach de desarrollo profesional. Responde preguntas basándote ÚNICAMENTE en el contexto proporcionado. 

Instrucciones:
- Proporciona respuestas claras, prácticas y accionables
- Cita los libros o autores cuando sea relevante
- Si el contexto no contiene información suficiente, indícalo claramente
- Usa un tono profesional pero amigable
- Estructura tu respuesta en párrafos claros
- Incluye ejemplos concretos cuando sea posible`,
        },
        {
          role: "user",
          content: `Contexto de la base de conocimiento:\n\n${context}\n\nPregunta del usuario: ${query}\n\nPor favor, responde basándote en el contexto proporcionado.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 800,
    })

    const answer = completion.choices[0].message.content || "No pude generar una respuesta."

    const avgSimilarity = contextChunks.reduce((sum, chunk) => sum + chunk.similarity, 0) / contextChunks.length
    const confidence = Math.round(avgSimilarity * 100)

    return NextResponse.json({
      success: true,
      answer,
      confidence,
      sources: contextChunks,
    })
  } catch (error: any) {
    console.error("Brain semantic error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Internal server error",
        message: "Failed to process query. Please check server logs.",
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "Brain Semantic Search API is running",
    endpoints: {
      POST: "Send a query to get semantic search results",
    },
    requiredEnv: ["OPENAI_API_KEY", "SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY"],
  })
}
