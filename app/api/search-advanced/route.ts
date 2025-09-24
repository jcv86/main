import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

interface SearchWeights {
  title: number
  author: number
  tags: number
  content: number
  popularity: number
  category: number
}

interface SearchParams {
  query: string
  category?: string
  weights?: SearchWeights
  minRelevance?: number
  limit?: number
}

// Función para calcular similitud de strings
function calculateSimilarity(str1: string, str2: string): number {
  const s1 = str1.toLowerCase()
  const s2 = str2.toLowerCase()

  // Coincidencia exacta
  if (s1 === s2) return 1.0

  // Contiene la búsqueda completa
  if (s1.includes(s2) || s2.includes(s1)) return 0.8

  // Coincidencia de palabras
  const words1 = s1.split(/\s+/)
  const words2 = s2.split(/\s+/)

  let wordMatches = 0
  for (const word1 of words1) {
    for (const word2 of words2) {
      if (word1.includes(word2) || word2.includes(word1)) {
        wordMatches++
        break
      }
    }
  }

  const wordSimilarity = wordMatches / Math.max(words1.length, words2.length)

  // Levenshtein distance simplificado
  const maxLength = Math.max(s1.length, s2.length)
  if (maxLength === 0) return 1.0

  let distance = 0
  const minLength = Math.min(s1.length, s2.length)

  for (let i = 0; i < minLength; i++) {
    if (s1[i] !== s2[i]) distance++
  }
  distance += Math.abs(s1.length - s2.length)

  const levenshteinSimilarity = 1 - distance / maxLength

  return Math.max(wordSimilarity, levenshteinSimilarity * 0.6)
}

export async function POST(request: NextRequest) {
  try {
    const body: SearchParams = await request.json()
    const {
      query,
      category = "all",
      weights = {
        title: 40,
        author: 25,
        tags: 20,
        content: 10,
        popularity: 3,
        category: 2,
      },
      minRelevance = 0,
      limit = 50,
    } = body

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 })
    }

    // Obtener todos los libros de la base de datos
    const { data: books, error } = await supabase
      .from("knowledge_base")
      .select("*")
      .order("read_count", { ascending: false })

    if (error) {
      console.error("Database error:", error)
      return NextResponse.json({ error: "Database error" }, { status: 500 })
    }

    if (!books || books.length === 0) {
      return NextResponse.json({ results: [], total: 0 })
    }

    const searchTerms = query
      .toLowerCase()
      .split(/\s+/)
      .filter((term) => term.length > 0)

    // Procesar cada libro con el algoritmo de relevancia
    const results = books.map((book) => {
      let totalScore = 0
      const matchDetails = {
        titleMatch: 0,
        authorMatch: 0,
        tagMatch: 0,
        contentMatch: 0,
        popularityBoost: 0,
        categoryMatch: 0,
      }

      // 1. Coincidencias en título
      for (const term of searchTerms) {
        const titleSimilarity = calculateSimilarity(book.title, term)
        matchDetails.titleMatch = Math.max(matchDetails.titleMatch, titleSimilarity)
      }
      totalScore += matchDetails.titleMatch * (weights.title / 100)

      // 2. Coincidencias en autor
      for (const term of searchTerms) {
        const authorSimilarity = calculateSimilarity(book.author, term)
        matchDetails.authorMatch = Math.max(matchDetails.authorMatch, authorSimilarity)
      }
      totalScore += matchDetails.authorMatch * (weights.author / 100)

      // 3. Coincidencias en etiquetas
      let maxTagMatch = 0
      const tags = Array.isArray(book.tags) ? book.tags : []
      for (const tag of tags) {
        for (const term of searchTerms) {
          const tagSimilarity = calculateSimilarity(tag, term)
          maxTagMatch = Math.max(maxTagMatch, tagSimilarity)
        }
      }
      matchDetails.tagMatch = maxTagMatch
      totalScore += matchDetails.tagMatch * (weights.tags / 100)

      // 4. Coincidencias en contenido (limitado para performance)
      if (weights.content > 0 && book.content) {
        const contentLower = book.content.toLowerCase()
        let contentMatches = 0
        for (const term of searchTerms) {
          if (contentLower.includes(term)) {
            contentMatches++
          }
        }
        matchDetails.contentMatch = contentMatches / searchTerms.length
        totalScore += matchDetails.contentMatch * (weights.content / 100)
      }

      // 5. Boost por popularidad
      const popularityNormalized = Math.min(book.read_count / 100, 1)
      matchDetails.popularityBoost = popularityNormalized
      totalScore += popularityNormalized * (weights.popularity / 100)

      // 6. Boost por categoría
      if (category !== "all" && book.category === category) {
        matchDetails.categoryMatch = 1
        totalScore += weights.category / 100
      }

      // Bonus por coincidencias múltiples
      const hasMultipleMatches = [
        matchDetails.titleMatch,
        matchDetails.authorMatch,
        matchDetails.tagMatch,
        matchDetails.contentMatch,
      ].filter((score) => score > 0.3).length

      if (hasMultipleMatches >= 2) {
        totalScore *= 1.2
      }

      // Calcular páginas y tiempo de lectura
      const pages = Math.ceil((book.content?.length || 0) / 200)
      const readingTime = Math.ceil((book.content?.length || 0) / 1000)

      return {
        ...book,
        pages,
        reading_time: readingTime,
        characters: book.content?.length || 0,
        relevanceScore: Math.round(totalScore * 100) / 100,
        matchDetails,
      }
    })

    // Filtrar y ordenar resultados
    const filteredResults = results
      .filter((result) => {
        const meetsRelevance = result.relevanceScore >= minRelevance / 100
        const meetsCategory = category === "all" || result.category === category
        return meetsRelevance && meetsCategory
      })
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, limit)

    // Estadísticas de la búsqueda
    const stats = {
      totalBooks: books.length,
      resultsFound: filteredResults.length,
      maxRelevance: filteredResults.length > 0 ? Math.max(...filteredResults.map((r) => r.relevanceScore)) : 0,
      avgRelevance:
        filteredResults.length > 0
          ? filteredResults.reduce((sum, r) => sum + r.relevanceScore, 0) / filteredResults.length
          : 0,
      searchTerms: searchTerms.length,
      processingTime: Date.now(), // Simplificado para el ejemplo
    }

    return NextResponse.json({
      results: filteredResults,
      stats,
      query,
      weights,
      total: filteredResults.length,
    })
  } catch (error) {
    console.error("Search API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get("q") || ""
  const category = searchParams.get("category") || "all"
  const limit = Number.parseInt(searchParams.get("limit") || "20")
  const minRelevance = Number.parseInt(searchParams.get("minRelevance") || "0")

  if (!query) {
    return NextResponse.json({ error: 'Query parameter "q" is required' }, { status: 400 })
  }

  // Usar los mismos parámetros por defecto que el POST
  const searchParams_body = {
    query,
    category,
    limit,
    minRelevance,
    weights: {
      title: 40,
      author: 25,
      tags: 20,
      content: 10,
      popularity: 3,
      category: 2,
    },
  }

  // Reutilizar la lógica del POST
  const mockRequest = {
    json: async () => searchParams_body,
  } as NextRequest

  return POST(mockRequest)
}
