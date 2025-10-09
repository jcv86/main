import { createClient } from "@supabase/supabase-js"
import { generateEmbedding } from "./embeddings"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export interface ContentChunk {
  content: string
  startIndex: number
  endIndex: number
  chunkIndex: number
}

export interface EnhancedSearchResult {
  sourceType: "book" | "web_resource"
  id: number
  title: string
  category: string
  author: string
  tags: string[]
  identifier: string
  fullContent: string
  relevantChunks: ContentChunk[]
  similarityScore: number
  readCount?: number
}

export interface SearchOptions {
  query: string
  limit?: number
  similarityThreshold?: number
  sourceTypeFilter?: "book" | "web_resource"
  categoryFilter?: string
  includeFullContent?: boolean
  chunkSize?: number
}

/**
 * Split content into overlapping chunks for better context
 */
function splitIntoChunks(content: string, chunkSize = 2000, overlap = 200): ContentChunk[] {
  const chunks: ContentChunk[] = []
  let startIndex = 0
  let chunkIndex = 0

  while (startIndex < content.length) {
    const endIndex = Math.min(startIndex + chunkSize, content.length)
    const chunk = content.slice(startIndex, endIndex)

    chunks.push({
      content: chunk,
      startIndex,
      endIndex,
      chunkIndex: chunkIndex++,
    })

    // Move forward with overlap
    startIndex += chunkSize - overlap
  }

  return chunks
}

/**
 * Find most relevant chunks based on query
 */
function findRelevantChunks(chunks: ContentChunk[], query: string, maxChunks = 3): ContentChunk[] {
  const queryLower = query.toLowerCase()
  const queryWords = queryLower.split(/\s+/)

  // Score each chunk based on keyword matches
  const scoredChunks = chunks.map((chunk) => {
    const chunkLower = chunk.content.toLowerCase()
    let score = 0

    // Count keyword matches
    queryWords.forEach((word) => {
      if (word.length > 3) {
        // Only count meaningful words
        const matches = (chunkLower.match(new RegExp(word, "g")) || []).length
        score += matches
      }
    })

    // Bonus for chunks that contain multiple query words close together
    if (queryWords.every((word) => chunkLower.includes(word))) {
      score += 10
    }

    return { chunk, score }
  })

  // Sort by score and return top chunks
  return scoredChunks
    .sort((a, b) => b.score - a.score)
    .slice(0, maxChunks)
    .map((item) => item.chunk)
}

/**
 * Perform enhanced semantic search with chunking and relevance scoring
 */
export async function enhancedSemanticSearch(options: SearchOptions): Promise<EnhancedSearchResult[]> {
  const {
    query,
    limit = 10,
    similarityThreshold = 0.7,
    sourceTypeFilter,
    categoryFilter,
    includeFullContent = true,
    chunkSize = 2000,
  } = options

  try {
    // Generate embedding for query
    const queryEmbedding = await generateEmbedding(query)

    // Perform semantic search
    const { data, error } = await supabase.rpc("search_brain_semantic", {
      query_embedding: queryEmbedding,
      similarity_threshold: similarityThreshold,
      source_type_filter: sourceTypeFilter || null,
      limit_results: limit,
    })

    if (error) {
      console.error("Semantic search error:", error)
      throw error
    }

    if (!data || data.length === 0) {
      return []
    }

    // Enhance results with chunking and relevance
    const enhancedResults: EnhancedSearchResult[] = await Promise.all(
      data.map(async (item: any) => {
        // Get full content
        let fullContent = ""
        let readCount = 0

        if (item.source_type === "book") {
          const { data: bookData } = await supabase
            .from("knowledge_base")
            .select("content, read_count")
            .eq("id", item.id)
            .single()
          fullContent = bookData?.content || ""
          readCount = bookData?.read_count || 0
        } else {
          const { data: resourceData } = await supabase
            .from("web_resources")
            .select("content, access_count")
            .eq("id", item.id)
            .single()
          fullContent = resourceData?.content || ""
          readCount = resourceData?.access_count || 0
        }

        // Split into chunks and find most relevant
        const chunks = splitIntoChunks(fullContent, chunkSize)
        const relevantChunks = findRelevantChunks(chunks, query)

        return {
          sourceType: item.source_type,
          id: item.id,
          title: item.title,
          category: item.category,
          author: item.author,
          tags: item.tags || [],
          identifier: item.identifier,
          fullContent: includeFullContent ? fullContent : "",
          relevantChunks,
          similarityScore: item.similarity_score,
          readCount,
        }
      }),
    )

    // Apply category filter if specified
    let filteredResults = enhancedResults
    if (categoryFilter) {
      filteredResults = enhancedResults.filter((result) =>
        result.category.toLowerCase().includes(categoryFilter.toLowerCase()),
      )
    }

    return filteredResults
  } catch (error) {
    console.error("Error in enhancedSemanticSearch:", error)
    throw error
  }
}

/**
 * Generate AI response based on enhanced search results
 */
export async function generateEnhancedBrainResponse(
  query: string,
  searchResults: EnhancedSearchResult[],
): Promise<{
  answer: string
  sources: EnhancedSearchResult[]
  confidence: number
  keyInsights: string[]
}> {
  if (searchResults.length === 0) {
    return {
      answer:
        "No encontré información específica en mi base de conocimientos. ¿Podrías reformular tu pregunta con más detalles?",
      sources: [],
      confidence: 0,
      keyInsights: [],
    }
  }

  // Extract key insights from relevant chunks
  const keyInsights: string[] = []
  const categories = new Set<string>()

  searchResults.slice(0, 3).forEach((result) => {
    categories.add(result.category)
    result.relevantChunks.forEach((chunk, index) => {
      if (index === 0 && chunk.content.length > 100) {
        // Take first sentence or two from most relevant chunk
        const sentences = chunk.content.split(/[.!?]+/)
        const insight = sentences.slice(0, 2).join(". ").trim()
        if (insight.length > 50) {
          keyInsights.push(insight)
        }
      }
    })
  })

  // Build comprehensive answer
  let answer = `🧠 **Respuesta del Cerebro Mejorado**\n\n`
  answer += `He encontrado información relevante en **${searchResults.length} fuentes** sobre **${Array.from(categories).join(", ")}**.\n\n`

  // Add insights from top sources
  searchResults.slice(0, 3).forEach((result, index) => {
    const sourceIcon = result.sourceType === "book" ? "📚" : "🌐"
    answer += `**${index + 1}. ${sourceIcon} "${result.title}"** - *${result.author}*\n`
    answer += `*Categoría: ${result.category}*\n\n`

    // Add most relevant chunk
    if (result.relevantChunks.length > 0) {
      const chunk = result.relevantChunks[0]
      const preview = chunk.content.substring(0, 300).trim()
      answer += `> ${preview}${chunk.content.length > 300 ? "..." : ""}\n\n`
    }
  })

  // Add key insights summary
  if (keyInsights.length > 0) {
    answer += `\n**💡 Insights Clave:**\n`
    keyInsights.slice(0, 3).forEach((insight, index) => {
      answer += `${index + 1}. ${insight}\n`
    })
  }

  // Calculate confidence based on similarity scores and result count
  const avgSimilarity = searchResults.reduce((sum, r) => sum + r.similarityScore, 0) / searchResults.length
  const resultCountFactor = Math.min(searchResults.length / 5, 1)
  const confidence = Math.min(avgSimilarity * resultCountFactor * 100, 95)

  return {
    answer,
    sources: searchResults,
    confidence,
    keyInsights: keyInsights.slice(0, 5),
  }
}
