import { createClient } from "@supabase/supabase-js"
import { generateEmbedding } from "./embeddings"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export interface SearchResult {
  id: number
  title: string
  category: string
  author: string
  content: string
  similarity: number
  sourceType: "book" | "web_resource"
  identifier: string
}

export interface BrainResponse {
  answer: string
  confidence: number
  sources: Array<{
    title: string
    author: string
    category: string
    similarity: number
    excerpt: string
    sourceType: string
    identifier: string
  }>
  keywords: string[]
  processingTime: number
}

/**
 * Divide el contenido en chunks más pequeños con overlap
 */
function chunkContent(content: string, chunkSize = 1000, overlap = 200): string[] {
  const chunks: string[] = []
  let start = 0

  while (start < content.length) {
    const end = Math.min(start + chunkSize, content.length)
    chunks.push(content.slice(start, end))
    start = end - overlap
  }

  return chunks
}

/**
 * Encuentra los chunks más relevantes basados en keywords
 */
function findRelevantChunks(chunks: string[], query: string, maxChunks = 3): string[] {
  const queryWords = query.toLowerCase().split(/\s+/)

  const scored = chunks.map((chunk) => {
    const chunkLower = chunk.toLowerCase()
    const score = queryWords.reduce((acc, word) => {
      const matches = (chunkLower.match(new RegExp(word, "g")) || []).length
      return acc + matches
    }, 0)
    return { chunk, score }
  })

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, maxChunks)
    .map((item) => item.chunk)
}

/**
 * Extrae keywords de la query
 */
function extractKeywords(query: string): string[] {
  const stopWords = new Set([
    "el",
    "la",
    "de",
    "y",
    "a",
    "en",
    "que",
    "es",
    "por",
    "para",
    "con",
    "como",
    "qué",
    "cómo",
  ])
  return query
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 3 && !stopWords.has(word))
    .slice(0, 5)
}

/**
 * Genera una respuesta basada en los resultados de búsqueda
 */
function generateAnswer(query: string, results: SearchResult[]): string {
  if (results.length === 0) {
    return "No encontré información relevante sobre ese tema en la biblioteca. ¿Podrías reformular tu pregunta?"
  }

  const topResult = results[0]
  const chunks = chunkContent(topResult.content)
  const relevantChunks = findRelevantChunks(chunks, query)

  let answer = `Basándome en "${topResult.title}" de ${topResult.author}, aquí está lo que encontré:\n\n`
  answer += relevantChunks.join("\n\n")

  if (results.length > 1) {
    answer += `\n\nTambién encontré información relevante en:\n`
    results.slice(1, 3).forEach((result) => {
      answer += `- "${result.title}" de ${result.author}\n`
    })
  }

  return answer
}

/**
 * Calcula la confianza de la respuesta
 */
function calculateConfidence(results: SearchResult[]): number {
  if (results.length === 0) return 0

  const avgSimilarity = results.reduce((sum, r) => sum + r.similarity, 0) / results.length
  const countBonus = Math.min(results.length / 5, 0.2)

  return Math.min(avgSimilarity + countBonus, 1.0)
}

/**
 * Búsqueda semántica mejorada con generación de respuestas
 */
export async function enhancedSemanticSearch(
  query: string,
  options: {
    similarityThreshold?: number
    limit?: number
    sourceType?: "book" | "web_resource" | null
  } = {},
): Promise<BrainResponse> {
  const startTime = Date.now()
  const { similarityThreshold = 0.7, limit = 5, sourceType = null } = options

  try {
    // 1. Generar embedding de la consulta
    const queryEmbedding = await generateEmbedding(query)

    // 2. Buscar en libros
    let bookResults: SearchResult[] = []
    if (sourceType === null || sourceType === "book") {
      const { data: books, error: bookError } = await supabase.rpc("search_knowledge_semantic", {
        query_embedding: queryEmbedding,
        similarity_threshold: similarityThreshold,
        limit_results: limit,
      })

      if (!bookError && books) {
        bookResults = books.map((book: any) => ({
          id: book.id,
          title: book.title,
          category: book.category,
          author: book.author,
          content: book.content_preview || "",
          similarity: book.similarity_score,
          sourceType: "book" as const,
          identifier: book.slug,
        }))
      }
    }

    // 3. Buscar en recursos web
    let resourceResults: SearchResult[] = []
    if (sourceType === null || sourceType === "web_resource") {
      const { data: resources, error: resourceError } = await supabase.rpc("search_web_resources_semantic", {
        query_embedding: queryEmbedding,
        similarity_threshold: similarityThreshold,
        limit_results: limit,
      })

      if (!resourceError && resources) {
        resourceResults = resources.map((resource: any) => ({
          id: resource.id,
          title: resource.title,
          category: resource.category,
          author: resource.author,
          content: resource.content_preview || "",
          similarity: resource.similarity_score,
          sourceType: "web_resource" as const,
          identifier: resource.url,
        }))
      }
    }

    // 4. Combinar y ordenar resultados
    const allResults = [...bookResults, ...resourceResults].sort((a, b) => b.similarity - a.similarity).slice(0, limit)

    // 5. Obtener contenido completo de los top 3 resultados
    const enrichedResults = await Promise.all(
      allResults.slice(0, 3).map(async (result) => {
        if (result.sourceType === "book") {
          const { data } = await supabase.from("knowledge_base").select("content").eq("id", result.id).single()

          if (data) {
            result.content = data.content
          }
        } else {
          const { data } = await supabase
            .from("web_resources")
            .select("content, description")
            .eq("id", result.id)
            .single()

          if (data) {
            result.content = data.content || data.description || ""
          }
        }
        return result
      }),
    )

    // 6. Generar respuesta
    const answer = generateAnswer(query, enrichedResults)
    const confidence = calculateConfidence(allResults)
    const keywords = extractKeywords(query)

    // 7. Formatear fuentes
    const sources = allResults.map((result) => ({
      title: result.title,
      author: result.author,
      category: result.category,
      similarity: Math.round(result.similarity * 100) / 100,
      excerpt: result.content.slice(0, 200) + "...",
      sourceType: result.sourceType,
      identifier: result.identifier,
    }))

    const processingTime = Date.now() - startTime

    return {
      answer,
      confidence,
      sources,
      keywords,
      processingTime,
    }
  } catch (error) {
    console.error("Error en búsqueda semántica:", error)
    throw error
  }
}
