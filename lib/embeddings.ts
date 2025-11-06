import { embed } from "ai"
import { createClient } from "@supabase/supabase-js"

// Only use server-side API key
const OPENAI_API_KEY = process.env.OPENAI_API_KEY
if (!OPENAI_API_KEY) {
  console.warn("⚠️ WARNING: OpenAI API key not found. Semantic search will not work.")
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export interface EmbeddingResult {
  id: number
  sourceType: "book" | "web_resource"
  success: boolean
  error?: string
  processingTimeMs?: number
}

export interface SemanticSearchResult {
  sourceType: "book" | "web_resource"
  id: number
  title: string
  category: string
  author: string
  tags: string[]
  identifier: string
  contentPreview: string
  similarityScore: number
}

/**
 * Check if OpenAI API key is configured (server-side only)
 */
export function isOpenAIConfigured(): boolean {
  return !!OPENAI_API_KEY && OPENAI_API_KEY.length > 20
}

/**
 * Generate embedding for a text using OpenAI's text-embedding-3-small model
 */
export async function generateEmbedding(text: string): Promise<number[] | null> {
  if (!isOpenAIConfigured()) {
    return null
  }

  try {
    if (!text || text.trim().length === 0) {
      return null
    }

    const { embedding } = await embed({
      model: "openai/text-embedding-3-small",
      value: text.trim(),
    })

    if (!embedding || !Array.isArray(embedding)) {
      return null
    }

    return embedding
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error generating embedding:", error)
    }
    return null
  }
}

/**
 * Generate embeddings for a book
 */
export async function generateBookEmbedding(bookId: number): Promise<EmbeddingResult> {
  const startTime = Date.now()

  try {
    if (!isOpenAIConfigured()) {
      throw new Error("OpenAI API key is not configured")
    }

    const { data: book, error: fetchError } = await supabase
      .from("knowledge_base")
      .select("id, title, author, content, category, tags")
      .eq("id", bookId)
      .single()

    if (fetchError || !book) {
      throw new Error(`Failed to fetch book: ${fetchError?.message}`)
    }

    const textToEmbed = `${book.title} ${book.author} ${book.category} ${book.tags.join(" ")} ${book.content}`

    const embedding = await generateEmbedding(textToEmbed)

    const { error: updateError } = await supabase.from("knowledge_base").update({ embedding }).eq("id", bookId)

    if (updateError) {
      throw new Error(`Failed to store embedding: ${updateError.message}`)
    }

    const processingTimeMs = Date.now() - startTime

    await supabase.rpc("log_embedding_generation", {
      p_source_type: "book",
      p_source_id: bookId,
      p_status: "completed",
      p_processing_time_ms: processingTimeMs,
    })

    return {
      id: bookId,
      sourceType: "book",
      success: true,
      processingTimeMs,
    }
  } catch (error) {
    const processingTimeMs = Date.now() - startTime
    const errorMessage = error instanceof Error ? error.message : "Unknown error"

    await supabase.rpc("log_embedding_generation", {
      p_source_type: "book",
      p_source_id: bookId,
      p_status: "failed",
      p_error_message: errorMessage,
      p_processing_time_ms: processingTimeMs,
    })

    return {
      id: bookId,
      sourceType: "book",
      success: false,
      error: errorMessage,
      processingTimeMs,
    }
  }
}

/**
 * Generate embeddings for a web resource
 */
export async function generateWebResourceEmbedding(resourceId: number): Promise<EmbeddingResult> {
  const startTime = Date.now()

  try {
    if (!isOpenAIConfigured()) {
      throw new Error("OpenAI API key is not configured")
    }

    const { data: resource, error: fetchError } = await supabase
      .from("web_resources")
      .select("id, title, author, description, content, category, tags")
      .eq("id", resourceId)
      .single()

    if (fetchError || !resource) {
      throw new Error(`Failed to fetch web resource: ${fetchError?.message}`)
    }

    const textToEmbed = `${resource.title} ${resource.author || ""} ${resource.category} ${resource.tags.join(" ")} ${resource.description || ""} ${resource.content}`

    const embedding = await generateEmbedding(textToEmbed)

    const { error: updateError } = await supabase.from("web_resources").update({ embedding }).eq("id", resourceId)

    if (updateError) {
      throw new Error(`Failed to store embedding: ${updateError.message}`)
    }

    const processingTimeMs = Date.now() - startTime

    await supabase.rpc("log_embedding_generation", {
      p_source_type: "web_resource",
      p_source_id: resourceId,
      p_status: "completed",
      p_processing_time_ms: processingTimeMs,
    })

    return {
      id: resourceId,
      sourceType: "web_resource",
      success: true,
      processingTimeMs,
    }
  } catch (error) {
    const processingTimeMs = Date.now() - startTime
    const errorMessage = error instanceof Error ? error.message : "Unknown error"

    await supabase.rpc("log_embedding_generation", {
      p_source_type: "web_resource",
      p_source_id: resourceId,
      p_status: "failed",
      p_error_message: errorMessage,
      p_processing_time_ms: processingTimeMs,
    })

    return {
      id: resourceId,
      sourceType: "web_resource",
      success: false,
      error: errorMessage,
      processingTimeMs,
    }
  }
}

/**
 * Generate embeddings for all items in batch
 */
export async function generateAllEmbeddings(batchSize = 10): Promise<{
  totalProcessed: number
  successful: number
  failed: number
  results: EmbeddingResult[]
}> {
  if (!isOpenAIConfigured()) {
    throw new Error("OpenAI API key is not configured. Please add OPENAI_API_KEY to your environment variables.")
  }

  const results: EmbeddingResult[] = []

  try {
    const { data: items, error } = await supabase.rpc("get_items_needing_embeddings")

    if (error) {
      throw new Error(`Failed to get items needing embeddings: ${error.message}`)
    }

    if (!items || items.length === 0) {
      console.log("No items need embeddings")
      return { totalProcessed: 0, successful: 0, failed: 0, results: [] }
    }

    console.log(`Found ${items.length} items needing embeddings`)

    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize)
      console.log(`Processing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(items.length / batchSize)}`)

      const batchPromises = batch.map((item: { source_type: string; id: number }) => {
        if (item.source_type === "book") {
          return generateBookEmbedding(item.id)
        } else {
          return generateWebResourceEmbedding(item.id)
        }
      })

      const batchResults = await Promise.all(batchPromises)
      results.push(...batchResults)

      if (i + batchSize < items.length) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }

    const successful = results.filter((r) => r.success).length
    const failed = results.filter((r) => !r.success).length

    return {
      totalProcessed: results.length,
      successful,
      failed,
      results,
    }
  } catch (error) {
    console.error("Error in generateAllEmbeddings:", error)
    throw error
  }
}

/**
 * Perform semantic search across all knowledge
 */
export async function semanticSearch(
  query: string,
  options: {
    similarityThreshold?: number
    sourceTypeFilter?: "book" | "web_resource"
    limit?: number
  } = {},
): Promise<SemanticSearchResult[]> {
  if (!isOpenAIConfigured()) {
    return []
  }

  try {
    const { similarityThreshold = 0.7, sourceTypeFilter, limit = 10 } = options

    const queryEmbedding = await generateEmbedding(query)

    if (!queryEmbedding) {
      return []
    }

    const { data, error } = await supabase.rpc("search_brain_semantic", {
      query_embedding: queryEmbedding,
      similarity_threshold: similarityThreshold,
      source_type_filter: sourceTypeFilter || null,
      limit_results: limit,
    })

    if (error) {
      if (process.env.NODE_ENV === "development") {
        console.error("Semantic search error:", error)
      }
      return []
    }

    return (data || []).map((item: any) => ({
      sourceType: item.source_type as "book" | "web_resource",
      id: item.id,
      title: item.title,
      category: item.category,
      author: item.author,
      tags: item.tags || [],
      identifier: item.identifier,
      contentPreview: item.content_preview,
      similarityScore: item.similarity_score,
    }))
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.error("Error in semanticSearch:", error)
    }
    return []
  }
}

/**
 * Get embedding statistics
 */
export async function getEmbeddingStatistics(): Promise<{
  books: { total: number; withEmbeddings: number; missing: number; percentage: number }
  webResources: { total: number; withEmbeddings: number; missing: number; percentage: number }
  overall: { total: number; withEmbeddings: number; missing: number; percentage: number }
}> {
  try {
    const { data, error } = await supabase.from("embedding_statistics").select("*")

    if (error) {
      throw error
    }

    const books = data?.find((item: any) => item.source === "Books") || {
      total_items: 0,
      items_with_embeddings: 0,
      items_missing_embeddings: 0,
      completion_percentage: 0,
    }

    const webResources = data?.find((item: any) => item.source === "Web Resources") || {
      total_items: 0,
      items_with_embeddings: 0,
      items_missing_embeddings: 0,
      completion_percentage: 0,
    }

    const totalItems = books.total_items + webResources.total_items
    const totalWithEmbeddings = books.items_with_embeddings + webResources.items_with_embeddings
    const totalMissing = books.items_missing_embeddings + webResources.items_missing_embeddings

    return {
      books: {
        total: books.total_items,
        withEmbeddings: books.items_with_embeddings,
        missing: books.items_missing_embeddings,
        percentage: books.completion_percentage,
      },
      webResources: {
        total: webResources.total_items,
        withEmbeddings: webResources.items_with_embeddings,
        missing: webResources.items_missing_embeddings,
        percentage: webResources.completion_percentage,
      },
      overall: {
        total: totalItems,
        withEmbeddings: totalWithEmbeddings,
        missing: totalMissing,
        percentage: totalItems > 0 ? Math.round((totalWithEmbeddings / totalItems) * 10000) / 100 : 0,
      },
    }
  } catch (error) {
    console.error("Error getting embedding statistics:", error)
    throw error
  }
}
