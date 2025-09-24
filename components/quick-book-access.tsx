"use client"

import type React from "react"
import { useState, useMemo, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Search, BookOpen, User, Star, Clock, X, TrendingUp, Zap, Settings } from "lucide-react"

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

interface QuickBookAccessProps {
  books: Book[]
  onBookSelect: (book: Book) => void
  trigger?: React.ReactNode
}

export default function QuickBookAccess({ books, onBookSelect, trigger }: QuickBookAccessProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [sortBy, setSortBy] = useState<string>("relevance")
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

  // Función para calcular similitud de strings usando algoritmo mejorado
  const calculateSimilarity = useCallback((str1: string, str2: string): number => {
    const s1 = str1.toLowerCase().trim()
    const s2 = str2.toLowerCase().trim()

    if (!s1 || !s2) return 0

    // Coincidencia exacta
    if (s1 === s2) return 1.0

    // Contiene la búsqueda completa
    if (s1.includes(s2)) return 0.9
    if (s2.includes(s1)) return 0.8

    // Coincidencia al inicio (más relevante)
    if (s1.startsWith(s2) || s2.startsWith(s1)) return 0.85

    // Coincidencia de palabras completas
    const words1 = s1.split(/\s+/).filter((w) => w.length > 0)
    const words2 = s2.split(/\s+/).filter((w) => w.length > 0)

    let exactWordMatches = 0
    let partialWordMatches = 0

    for (const word1 of words1) {
      for (const word2 of words2) {
        if (word1 === word2) {
          exactWordMatches++
        } else if (word1.includes(word2) || word2.includes(word1)) {
          partialWordMatches++
        }
      }
    }

    const totalWords = Math.max(words1.length, words2.length)
    if (totalWords === 0) return 0

    const exactWordScore = exactWordMatches / totalWords
    const partialWordScore = (partialWordMatches / totalWords) * 0.6

    const wordSimilarity = exactWordScore + partialWordScore

    // Levenshtein distance simplificado para similitud de caracteres
    const maxLength = Math.max(s1.length, s2.length)
    if (maxLength === 0) return 1.0

    let distance = 0
    const minLength = Math.min(s1.length, s2.length)

    // Calcular diferencias de caracteres
    for (let i = 0; i < minLength; i++) {
      if (s1[i] !== s2[i]) distance++
    }
    distance += Math.abs(s1.length - s2.length)

    const levenshteinSimilarity = Math.max(0, 1 - distance / maxLength)

    // Combinar similitudes con pesos
    return Math.max(wordSimilarity, levenshteinSimilarity * 0.7)
  }, [])

  // Algoritmo de búsqueda mejorado con pesos y relevancia
  const searchResults = useMemo((): SearchResult[] => {
    if (!searchTerm.trim()) {
      // Sin búsqueda, mostrar todos los libros ordenados por popularidad
      return books.map((book) => ({
        ...book,
        relevanceScore: Math.min(book.read_count / 100, 1), // Score base por popularidad
        matchDetails: {
          titleMatch: 0,
          authorMatch: 0,
          tagMatch: 0,
          contentMatch: 0,
          popularityBoost: Math.min(book.read_count / 100, 1),
          categoryMatch: selectedCategory === "all" || book.category === selectedCategory ? 1 : 0,
        },
      }))
    }

    const searchTerms = searchTerm
      .toLowerCase()
      .split(/\s+/)
      .filter((term) => term.length > 1) // Ignorar términos muy cortos

    if (searchTerms.length === 0) return []

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
      let maxTitleMatch = 0
      for (const term of searchTerms) {
        const titleSimilarity = calculateSimilarity(book.title, term)
        maxTitleMatch = Math.max(maxTitleMatch, titleSimilarity)
      }
      // También verificar coincidencia con el término completo
      const fullTitleMatch = calculateSimilarity(book.title, searchTerm)
      matchDetails.titleMatch = Math.max(maxTitleMatch, fullTitleMatch)
      totalScore += matchDetails.titleMatch * (weights.title / 100)

      // 2. Coincidencias en autor
      let maxAuthorMatch = 0
      for (const term of searchTerms) {
        const authorSimilarity = calculateSimilarity(book.author, term)
        maxAuthorMatch = Math.max(maxAuthorMatch, authorSimilarity)
      }
      const fullAuthorMatch = calculateSimilarity(book.author, searchTerm)
      matchDetails.authorMatch = Math.max(maxAuthorMatch, fullAuthorMatch)
      totalScore += matchDetails.authorMatch * (weights.author / 100)

      // 3. Coincidencias en etiquetas
      let maxTagMatch = 0
      if (book.tags && Array.isArray(book.tags)) {
        for (const tag of book.tags) {
          for (const term of searchTerms) {
            const tagSimilarity = calculateSimilarity(tag, term)
            maxTagMatch = Math.max(maxTagMatch, tagSimilarity)
          }
          // También verificar coincidencia completa
          const fullTagMatch = calculateSimilarity(tag, searchTerm)
          maxTagMatch = Math.max(maxTagMatch, fullTagMatch)
        }
      }
      matchDetails.tagMatch = maxTagMatch
      totalScore += matchDetails.tagMatch * (weights.tags / 100)

      // 4. Coincidencias en contenido (limitado para performance)
      if (weights.content > 0 && book.content) {
        const contentLower = book.content.toLowerCase()
        let contentMatches = 0
        let totalTerms = 0

        for (const term of searchTerms) {
          if (term.length > 2) {
            // Solo términos significativos
            totalTerms++
            if (contentLower.includes(term)) {
              contentMatches++
            }
          }
        }

        if (totalTerms > 0) {
          matchDetails.contentMatch = contentMatches / totalTerms
          totalScore += matchDetails.contentMatch * (weights.content / 100)
        }
      }

      // 5. Boost por popularidad (normalizado)
      const popularityNormalized = Math.min(book.read_count / 10000, 1) // Normalizar a 0-1
      matchDetails.popularityBoost = popularityNormalized
      totalScore += popularityNormalized * (weights.popularity / 100)

      // 6. Boost por categoría seleccionada
      if (selectedCategory !== "all" && book.category === selectedCategory) {
        matchDetails.categoryMatch = 1
        totalScore += weights.category / 100
      }

      // Bonus por coincidencias múltiples (indica relevancia alta)
      const significantMatches = [
        matchDetails.titleMatch,
        matchDetails.authorMatch,
        matchDetails.tagMatch,
        matchDetails.contentMatch,
      ].filter((score) => score > 0.4).length

      if (significantMatches >= 2) {
        totalScore *= 1.25 // 25% bonus por coincidencias múltiples
      }

      // Bonus por coincidencia exacta en título o autor
      if (matchDetails.titleMatch > 0.9 || matchDetails.authorMatch > 0.9) {
        totalScore *= 1.15 // 15% bonus por coincidencia casi exacta
      }

      // Penalty por libros muy cortos sin coincidencias fuertes
      if (
        book.content &&
        book.content.length < 3000 &&
        matchDetails.titleMatch < 0.5 &&
        matchDetails.authorMatch < 0.5
      ) {
        totalScore *= 0.85
      }

      return {
        ...book,
        relevanceScore: Math.round(totalScore * 1000) / 1000, // 3 decimales
        matchDetails,
      }
    })

    // Filtrar por relevancia mínima y categoría
    const filteredResults = results.filter((result) => {
      const meetsRelevance = result.relevanceScore >= minRelevance[0] / 100
      const meetsCategory = selectedCategory === "all" || result.category === selectedCategory
      return meetsRelevance && meetsCategory
    })

    // Ordenar según el criterio seleccionado
    switch (sortBy) {
      case "relevance":
        filteredResults.sort((a, b) => b.relevanceScore - a.relevanceScore)
        break
      case "title":
        filteredResults.sort((a, b) => a.title.localeCompare(b.title))
        break
      case "author":
        filteredResults.sort((a, b) => a.author.localeCompare(b.author))
        break
      case "popularity":
        filteredResults.sort((a, b) => b.read_count - a.read_count)
        break
      case "recent":
        filteredResults.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        break
      default:
        filteredResults.sort((a, b) => b.relevanceScore - a.relevanceScore)
    }

    return filteredResults.slice(0, 100) // Limitar a top 100 resultados
  }, [books, searchTerm, selectedCategory, sortBy, weights, minRelevance, calculateSimilarity])

  const categories = useMemo(() => {
    return Array.from(new Set(books.map((book) => book.category))).sort()
  }, [books])

  const handleBookSelect = (book: Book) => {
    onBookSelect(book)
    setIsOpen(false)
    setSearchTerm("") // Limpiar búsqueda al seleccionar
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

  const getMatchBadges = (result: SearchResult) => {
    const badges = []
    if (result.matchDetails.titleMatch > 0.4) {
      badges.push({
        label: `📖 ${(result.matchDetails.titleMatch * 100).toFixed(0)}%`,
        color: "bg-blue-50 text-blue-700",
      })
    }
    if (result.matchDetails.authorMatch > 0.4) {
      badges.push({
        label: `✍️ ${(result.matchDetails.authorMatch * 100).toFixed(0)}%`,
        color: "bg-purple-50 text-purple-700",
      })
    }
    if (result.matchDetails.tagMatch > 0.4) {
      badges.push({
        label: `🏷️ ${(result.matchDetails.tagMatch * 100).toFixed(0)}%`,
        color: "bg-green-50 text-green-700",
      })
    }
    if (result.matchDetails.contentMatch > 0.3) {
      badges.push({
        label: `📄 ${(result.matchDetails.contentMatch * 100).toFixed(0)}%`,
        color: "bg-yellow-50 text-yellow-700",
      })
    }
    if (result.matchDetails.popularityBoost > 0.5) {
      badges.push({
        label: "🔥 Popular",
        color: "bg-red-50 text-red-700",
      })
    }
    return badges
  }

  const defaultTrigger = (
    <Button variant="outline" className="flex items-center gap-2 bg-transparent">
      <Zap className="h-4 w-4" />
      Acceso Rápido
    </Button>
  )

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="max-w-6xl h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-blue-600" />
            Acceso Rápido con Búsqueda Inteligente
            <Badge variant="secondary" className="ml-2">
              {searchResults.length} de {books.length}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-4 space-y-4">
          {/* Barra de búsqueda principal */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por título, autor, etiquetas o contenido..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10 text-lg"
              autoFocus
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

          {/* Controles de filtrado y ordenamiento */}
          <div className="flex flex-wrap items-center gap-4">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">🎯 Relevancia</SelectItem>
                <SelectItem value="popularity">⭐ Popularidad</SelectItem>
                <SelectItem value="title">📖 Título A-Z</SelectItem>
                <SelectItem value="author">✍️ Autor A-Z</SelectItem>
                <SelectItem value="recent">📅 Más recientes</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Relevancia mín:</span>
              <div className="w-24">
                <Slider value={minRelevance} onValueChange={setMinRelevance} max={100} step={5} className="w-full" />
              </div>
              <span className="text-xs text-gray-500 w-8">{minRelevance[0]}%</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1"
            >
              <Settings className="h-3 w-3" />
              {showAdvanced ? "Ocultar" : "Configurar"}
            </Button>
          </div>

          {/* Panel de configuración avanzada */}
          {showAdvanced && (
            <Card className="p-4 bg-gray-50">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">⚙️ Configuración del Algoritmo de Búsqueda</h4>
                  <Button variant="outline" size="sm" onClick={resetWeights}>
                    Restaurar por defecto
                  </Button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(weights).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-medium">
                          {key === "title"
                            ? "📖 Título"
                            : key === "author"
                              ? "✍️ Autor"
                              : key === "tags"
                                ? "🏷️ Etiquetas"
                                : key === "content"
                                  ? "📄 Contenido"
                                  : key === "popularity"
                                    ? "⭐ Popularidad"
                                    : key === "category"
                                      ? "📂 Categoría"
                                      : key}
                          :
                        </label>
                        <span className="text-xs text-gray-600 font-mono">{value}%</span>
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
                <div className="text-sm text-gray-600 bg-white p-2 rounded border">
                  💡 <strong>Pesos totales:</strong> {Object.values(weights).reduce((sum, val) => sum + val, 0)}% | El
                  algoritmo usa similitud de strings, coincidencias de palabras y Levenshtein distance
                </div>
              </div>
            </Card>
          )}

          {/* Estadísticas de búsqueda */}
          {searchTerm && (
            <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded">
              <div className="flex flex-wrap items-center gap-4">
                <span>
                  🔍 <strong>"{searchTerm}"</strong>
                </span>
                <span>📊 {searchResults.length} resultados</span>
                {searchResults.length > 0 && (
                  <>
                    <span>⭐ Máx: {Math.max(...searchResults.map((r) => r.relevanceScore)).toFixed(3)}</span>
                    <span>
                      📈 Prom:{" "}
                      {(searchResults.reduce((sum, r) => sum + r.relevanceScore, 0) / searchResults.length).toFixed(3)}
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
                <Search className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">
                  {searchTerm ? "No se encontraron resultados" : "Ingresa un término de búsqueda"}
                </p>
                {searchTerm && (
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">💡 Sugerencias:</p>
                    <ul className="text-sm text-gray-500 space-y-1">
                      <li>• Intenta con términos más generales</li>
                      <li>• Reduce la relevancia mínima</li>
                      <li>• Cambia la categoría a "Todas"</li>
                      <li>• Verifica la ortografía</li>
                      <li>• Usa sinónimos o términos relacionados</li>
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {searchResults.map((result, index) => {
                const matchBadges = getMatchBadges(result)
                return (
                  <Card
                    key={result.id}
                    className="hover:shadow-md transition-all cursor-pointer border-l-4"
                    style={{
                      borderLeftColor:
                        result.relevanceScore > 0.8
                          ? "#10b981"
                          : result.relevanceScore > 0.5
                            ? "#f59e0b"
                            : result.relevanceScore > 0.2
                              ? "#6b7280"
                              : "#d1d5db",
                    }}
                    onClick={() => handleBookSelect(result)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs text-gray-500 font-mono">
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
                              {(result.relevanceScore * 100).toFixed(1)}%
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {result.category}
                            </Badge>
                            {result.relevanceScore > 0.8 && (
                              <Badge variant="default" className="text-xs bg-green-600">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                Excelente
                              </Badge>
                            )}
                          </div>

                          <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{result.title}</h3>

                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                            <div className="flex items-center gap-1">
                              <User className="h-3 w-3" />
                              <span className="truncate">{result.author}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-3 w-3" />
                              <span>{result.read_count.toLocaleString()}</span>
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

                          {/* Badges de coincidencias */}
                          {searchTerm && matchBadges.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-2">
                              {matchBadges.map((badge, idx) => (
                                <Badge key={idx} variant="outline" className={`text-xs ${badge.color}`}>
                                  {badge.label}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {/* Etiquetas del libro */}
                          <div className="flex flex-wrap gap-1">
                            {result.tags?.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {result.tags && result.tags.length > 3 && (
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
                )
              })}
            </div>
          )}
        </ScrollArea>

        {/* Footer con información del algoritmo */}
        <div className="px-6 py-3 border-t bg-gray-50 text-xs text-gray-600">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <span>🧠 Algoritmo: Similitud Inteligente + Pesos Configurables</span>
              <span>⚡ Rendimiento: ~{Math.max(1, Math.ceil(searchResults.length / 20))}ms</span>
            </div>
            <div className="flex gap-2">
              <span>
                📊 T{weights.title}% A{weights.author}% E{weights.tags}%
              </span>
              <span>🎯 Min: {minRelevance[0]}%</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
