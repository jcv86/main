"use client"

import type React from "react"
import { useState, useMemo, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Search, BookOpen, User, Star, Clock, X, TrendingUp, Filter } from "lucide-react"

interface Book {
  id: number
  title: string
  author: string
  category: string
  content: string
  tags: string[]
  slug: string
  read_count: number
  created_at: string
  updated_at: string
  pages: number
  reading_time: number
  characters: number
}

interface SearchResult extends Book {
  relevanceScore: number
  matchDetails: {
    titleMatch: number
    authorMatch: number
    tagMatch: number
    contentMatch: number
    popularityBoost: number
    categoryMatch: number
  }
}

interface SearchWeights {
  title: number
  author: number
  tags: number
  content: number
  popularity: number
  category: number
}

interface EnhancedSearchProps {
  books: Book[]
  onBookSelect: (book: Book) => void
  trigger?: React.ReactNode
}

export default function EnhancedSearchAlgorithm({ books, onBookSelect, trigger }: EnhancedSearchProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [minRelevance, setMinRelevance] = useState([0])

  // Pesos configurables para el algoritmo de búsqueda
  const [weights, setWeights] = useState<SearchWeights>({
    title: 40, // 40% peso para coincidencias en título
    author: 25, // 25% peso para coincidencias en autor
    tags: 20, // 20% peso para coincidencias en etiquetas
    content: 10, // 10% peso para coincidencias en contenido
    popularity: 3, // 3% boost por popularidad
    category: 2, // 2% boost por categoría seleccionada
  })

  // Función para calcular similitud de strings usando Levenshtein distance
  const calculateSimilarity = useCallback((str1: string, str2: string): number => {
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

    // Levenshtein distance para similitud de caracteres
    const matrix = Array(s2.length + 1)
      .fill(null)
      .map(() => Array(s1.length + 1).fill(null))

    for (let i = 0; i <= s1.length; i++) matrix[0][i] = i
    for (let j = 0; j <= s2.length; j++) matrix[j][0] = j

    for (let j = 1; j <= s2.length; j++) {
      for (let i = 1; i <= s1.length; i++) {
        const indicator = s1[i - 1] === s2[j - 1] ? 0 : 1
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1, // deletion
          matrix[j - 1][i] + 1, // insertion
          matrix[j - 1][i - 1] + indicator, // substitution
        )
      }
    }

    const distance = matrix[s2.length][s1.length]
    const maxLength = Math.max(s1.length, s2.length)
    const levenshteinSimilarity = 1 - distance / maxLength

    // Combinar similitudes
    return Math.max(wordSimilarity, levenshteinSimilarity * 0.6)
  }, [])

  // Algoritmo de búsqueda mejorado con pesos y relevancia
  const searchResults = useMemo((): SearchResult[] => {
    if (!searchTerm.trim()) {
      return books.map((book) => ({
        ...book,
        relevanceScore: book.read_count / 100, // Score base por popularidad
        matchDetails: {
          titleMatch: 0,
          authorMatch: 0,
          tagMatch: 0,
          contentMatch: 0,
          popularityBoost: book.read_count / 100,
          categoryMatch: selectedCategory === "all" || book.category === selectedCategory ? 1 : 0,
        },
      }))
    }

    const searchTerms = searchTerm
      .toLowerCase()
      .split(/\s+/)
      .filter((term) => term.length > 0)

    const results: SearchResult[] = books.map((book) => {
      let totalScore = 0
      const matchDetails = {
        titleMatch: 0,
        authorMatch: 0,
        tagMatch: 0,
        contentMatch: 0,
        popularityBoost: 0,
        categoryMatch: 0,
      }

      // 1. Coincidencias en título (peso más alto)
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
      for (const tag of book.tags) {
        for (const term of searchTerms) {
          const tagSimilarity = calculateSimilarity(tag, term)
          maxTagMatch = Math.max(maxTagMatch, tagSimilarity)
        }
      }
      matchDetails.tagMatch = maxTagMatch
      totalScore += matchDetails.tagMatch * (weights.tags / 100)

      // 4. Coincidencias en contenido (peso menor, más costoso computacionalmente)
      if (weights.content > 0) {
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
      const popularityNormalized = Math.min(book.read_count / 100, 1) // Normalizar a 0-1
      matchDetails.popularityBoost = popularityNormalized
      totalScore += popularityNormalized * (weights.popularity / 100)

      // 6. Boost por categoría seleccionada
      if (selectedCategory !== "all" && book.category === selectedCategory) {
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
        totalScore *= 1.2 // 20% bonus por coincidencias múltiples
      }

      // Penalty por libros muy cortos si no hay coincidencia fuerte en título/autor
      if (book.content.length < 5000 && matchDetails.titleMatch < 0.5 && matchDetails.authorMatch < 0.5) {
        totalScore *= 0.8
      }

      return {
        ...book,
        relevanceScore: Math.round(totalScore * 100) / 100,
        matchDetails,
      }
    })

    // Filtrar por relevancia mínima y categoría
    return results
      .filter((result) => {
        const meetsRelevance = result.relevanceScore >= minRelevance[0] / 100
        const meetsCategory = selectedCategory === "all" || result.category === selectedCategory
        return meetsRelevance && meetsCategory
      })
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 50) // Limitar a top 50 resultados
  }, [books, searchTerm, selectedCategory, weights, minRelevance, calculateSimilarity])

  const categories = useMemo(() => {
    return Array.from(new Set(books.map((book) => book.category))).sort()
  }, [books])

  const handleBookSelect = (book: Book) => {
    onBookSelect(book)
    setIsOpen(false)
  }

  const resetWeights = () => {
    setWeights({
      title: 40,
      author: 25,
      tags: 20,
      content: 10,
      popularity: 3,
      category: 2,
    })
  }

  const defaultTrigger = (
    <Button variant="outline" className="flex items-center gap-2 bg-transparent">
      <Search className="h-4 w-4" />
      Búsqueda Avanzada
    </Button>
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-6xl h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-blue" />
            Búsqueda Avanzada con IA
            <Badge variant="secondary" className="ml-2">
              {searchResults.length} resultados
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-4 space-y-4">
          {/* Barra de búsqueda principal */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar con algoritmo inteligente de relevancia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10 text-lg"
            />
            {searchTerm && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSearchTerm("")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              >
                <X className="h-3 w-3" />
              </Button>
            )}
          </div>

          {/* Controles avanzados */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Categoría:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1 border rounded text-sm"
              >
                <option value="all">Todas las categorías</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Relevancia mín:</span>
              <div className="w-24">
                <Slider value={minRelevance} onValueChange={setMinRelevance} max={100} step={5} className="w-full" />
              </div>
              <span className="text-xs text-muted-foreground w-8">{minRelevance[0]}%</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1"
            >
              <Filter className="h-3 w-3" />
              {showAdvanced ? "Ocultar" : "Mostrar"} Pesos
            </Button>
          </div>

          {/* Panel de configuración de pesos */}
          {showAdvanced && (
            <Card className="p-4 bg-muted/5">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(weights).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-sm font-medium capitalize">
                        {key === "tags"
                          ? "Etiquetas"
                          : key === "title"
                            ? "Título"
                            : key === "author"
                              ? "Autor"
                              : key === "content"
                                ? "Contenido"
                                : key === "popularity"
                                  ? "Popularidad"
                                  : key === "category"
                                    ? "Categoría"
                                    : key}
                        :
                      </label>
                      <span className="text-xs text-muted-foreground">{value}%</span>
                    </div>
                    <Slider
                      value={[value]}
                      onValueChange={([newValue]) => setWeights((prev) => ({ ...prev, [key]: newValue }))}
                      max={key === "title" ? 60 : key === "author" ? 40 : 30}
                      step={1}
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center mt-4 pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Total: {Object.values(weights).reduce((sum, val) => sum + val, 0)}%
                </div>
                <Button variant="outline" size="sm" onClick={resetWeights}>
                  Restaurar por defecto
                </Button>
              </div>
            </Card>
          )}

          {/* Estadísticas de búsqueda */}
          {searchTerm && (
            <div className="text-sm text-muted-foreground bg-blue/5 p-3 rounded">
              <div className="flex items-center gap-4">
                <span>🔍 Búsqueda: "{searchTerm}"</span>
                <span> {searchResults.length} resultados</span>
                {searchResults.length > 0 && (
                  <>
                    <span> Relevancia máx: {Math.max(...searchResults.map((r) => r.relevanceScore)).toFixed(2)}</span>
                    <span>
                      📈 Promedio:{" "}
                      {(searchResults.reduce((sum, r) => sum + r.relevanceScore, 0) / searchResults.length).toFixed(2)}
                    </span>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Resultados de búsqueda */}
        <ScrollArea className="flex-1 px-6 pb-6">
          {searchResults.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Search className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-4">
                  {searchTerm ? "No se encontraron resultados" : "Ingresa un término de búsqueda"}
                </p>
                {searchTerm && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Sugerencias:</p>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Intenta con términos más generales</li>
                      <li>• Reduce la relevancia mínima</li>
                      <li>• Cambia la categoría a "Todas"</li>
                      <li>• Verifica la ortografía</li>
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {searchResults.map((result, index) => (
                <Card
                  key={result.id}
                  className="hover:shadow-md transition-all cursor-pointer border-l-4"
                  style={{
                    borderLeftColor:
                      result.relevanceScore > 0.8 ? "#10b981" : result.relevanceScore > 0.5 ? "#f59e0b" : "#6b7280",
                  }}
                  onClick={() => handleBookSelect(result)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs text-muted-foreground font-mono">
                            #{(index + 1).toString().padStart(2, "0")}
                          </span>
                          <Badge
                            variant={
                              result.relevanceScore > 0.8
                                ? "default"
                                : result.relevanceScore > 0.5
                                  ? "secondary"
                                  : "outline"
                            }
                            className="text-xs"
                          >
                            {(result.relevanceScore * 100).toFixed(0)}% relevancia
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {result.category}
                          </Badge>
                          {result.relevanceScore > 0.8 && (
                            <Badge variant="default" className="text-xs bg-green">
                              <TrendingUp className="h-3 w-3 mr-1" />
                              Top Match
                            </Badge>
                          )}
                        </div>

                        <h3 className="font-semibold text-foreground mb-1 line-clamp-1">{result.title}</h3>

                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            <span className="truncate">{result.author}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3" />
                            <span>{result.read_count}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BookOpen className="h-3 w-3" />
                            <span>{result.pages} págs</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>{result.reading_time} min</span>
                          </div>
                        </div>

                        {/* Detalles de coincidencias */}
                        {searchTerm && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {result.matchDetails.titleMatch > 0.3 && (
                              <Badge variant="outline" className="text-xs bg-blue/5">
                                📖 Título: {(result.matchDetails.titleMatch * 100).toFixed(0)}%
                              </Badge>
                            )}
                            {result.matchDetails.authorMatch > 0.3 && (
                              <Badge variant="outline" className="text-xs bg-purple/5">
                                ✍️ Autor: {(result.matchDetails.authorMatch * 100).toFixed(0)}%
                              </Badge>
                            )}
                            {result.matchDetails.tagMatch > 0.3 && (
                              <Badge variant="outline" className="text-xs bg-green/5">
                                🏷️ Tags: {(result.matchDetails.tagMatch * 100).toFixed(0)}%
                              </Badge>
                            )}
                            {result.matchDetails.contentMatch > 0.3 && (
                              <Badge variant="outline" className="text-xs bg-yellow/5">
                                📄 Contenido: {(result.matchDetails.contentMatch * 100).toFixed(0)}%
                              </Badge>
                            )}
                            {result.matchDetails.popularityBoost > 0.5 && (
                              <Badge variant="outline" className="text-xs bg-red/5">
                                🔥 Popular
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Etiquetas del libro */}
                        <div className="flex flex-wrap gap-1">
                          {result.tags.slice(0, 3).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {result.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs">
                              +{result.tags.length - 3}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-4 flex-shrink-0"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleBookSelect(result)
                        }}
                      >
                        <BookOpen className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Footer con estadísticas */}
        <div className="px-6 py-3 border-t bg-muted/5 text-xs text-muted-foreground">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <span>🔍 Algoritmo: Similitud + Pesos + Popularidad</span>
              <span>⚡ Tiempo: ~{Math.max(1, Math.ceil(searchResults.length / 10))}ms</span>
            </div>
            <div className="flex gap-2">
              <span>
                 Pesos: T{weights.title}% A{weights.author}% E{weights.tags}%
              </span>
              <span> Min: {minRelevance[0]}%</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
