"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Brain, BookOpen, Globe, Sparkles, TrendingUp, Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface SearchResult {
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

export default function TestSemanticSearchPage() {
  const [query, setQuery] = useState("")
  const [similarityThreshold, setSimilarityThreshold] = useState(0.7)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchStats, setSearchStats] = useState<{
    totalResults: number
    avgSimilarity: number
    searchTimeMs: number
  } | null>(null)

  const exampleQueries = [
    "¿Cómo puedo mejorar mi liderazgo?",
    "Estrategias de productividad personal",
    "Desarrollo de inteligencia emocional",
    "Técnicas de negociación efectiva",
    "Cómo construir buenos hábitos",
    "Comunicación asertiva en el trabajo",
  ]

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) return

    setIsSearching(true)
    setError(null)
    const startTime = Date.now()

    try {
      const response = await fetch("/api/search/semantic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: searchQuery,
          similarityThreshold,
          limit: 10,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error en la búsqueda")
      }

      const data = await response.json()
      setResults(data.results || [])

      const searchTimeMs = Date.now() - startTime
      const avgSimilarity =
        data.results.length > 0
          ? data.results.reduce((sum: number, r: SearchResult) => sum + r.similarityScore, 0) / data.results.length
          : 0

      setSearchStats({
        totalResults: data.results.length,
        avgSimilarity: Math.round(avgSimilarity * 100) / 100,
        searchTimeMs,
      })
    } catch (err) {
      console.error("Search error:", err)
      setError(err instanceof Error ? err.message : "Error desconocido")
      setResults([])
      setSearchStats(null)
    } finally {
      setIsSearching(false)
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    performSearch(query)
  }

  const handleExampleClick = (exampleQuery: string) => {
    setQuery(exampleQuery)
    performSearch(exampleQuery)
  }

  const getSimilarityColor = (score: number) => {
    if (score >= 0.9) return "text-green bg-green/5 border-green/20"
    if (score >= 0.8) return "text-blue bg-blue/5 border-blue/20"
    if (score >= 0.7) return "text-purple bg-purple/5 border-purple/20"
    return "text-muted/60 bg-muted/5 border-muted/20"
  }

  const getSimilarityLabel = (score: number) => {
    if (score >= 0.9) return "Excelente"
    if (score >= 0.8) return "Muy buena"
    if (score >= 0.7) return "Buena"
    return "Relevante"
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-3 bg-background">
              <Brain className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold text-purple">
                Búsqueda Semántica
              </h1>
              <p className="text-muted-foreground">Encuentra contenido relevante usando inteligencia artificial</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Buscar en la Base de Conocimiento
                </CardTitle>
                <CardDescription>Ingresa tu pregunta o tema de interés</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <form onSubmit={handleSearch} className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="¿Qué quieres aprender hoy?"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="flex-1"
                      disabled={isSearching}
                    />
                    <Button type="submit" disabled={isSearching || !query.trim()} className="px-6">
                      {isSearching ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Buscando
                        </>
                      ) : (
                        <>
                          <Search className="mr-2 h-4 w-4" />
                          Buscar
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium">Umbral de Similitud: {similarityThreshold}</label>
                      <Badge variant="outline">{getSimilarityLabel(similarityThreshold)} coincidencia</Badge>
                    </div>
                    <Slider
                      value={[similarityThreshold]}
                      onValueChange={([value]) => setSimilarityThreshold(value)}
                      min={0.5}
                      max={0.95}
                      step={0.05}
                      disabled={isSearching}
                      className="w-full"
                    />
                    <p className="text-xs text-muted-foreground">
                      Valores más altos = resultados más precisos pero menos resultados
                    </p>
                  </div>
                </form>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Ejemplos de búsqueda:</p>
                  <div className="flex flex-wrap gap-2">
                    {exampleQueries.map((example, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => handleExampleClick(example)}
                        disabled={isSearching}
                        className="text-xs"
                      >
                        {example}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error en la búsqueda</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {searchStats && !error && (
              <Card className="border-purple/20 bg-background">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple" />
                      <span className="font-medium">Resultados encontrados: {searchStats.totalResults}</span>
                    </div>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <span>Similitud promedio: {(searchStats.avgSimilarity * 100).toFixed(0)}%</span>
                      <span>Tiempo: {searchStats.searchTimeMs}ms</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Tabs defaultValue="results" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="results" className="flex-1">
                  Resultados ({results.length})
                </TabsTrigger>
                <TabsTrigger value="stats" className="flex-1">
                  Estadísticas
                </TabsTrigger>
              </TabsList>

              <TabsContent value="results" className="space-y-4">
                {results.length === 0 && !isSearching && !error && (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        No hay resultados aún. Realiza una búsqueda para comenzar.
                      </p>
                    </CardContent>
                  </Card>
                )}

                {isSearching && (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Loader2 className="h-12 w-12 text-purple animate-spin mx-auto mb-4" />
                      <p className="text-muted-foreground">Buscando en la base de conocimiento...</p>
                    </CardContent>
                  </Card>
                )}

                {results.map((result, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{result.title}</CardTitle>
                          <CardDescription className="flex items-center gap-2 flex-wrap">
                            {result.sourceType === "book" ? (
                              <Badge variant="outline" className="flex items-center gap-1">
                                <BookOpen className="h-3 w-3" />
                                Libro
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="flex items-center gap-1">
                                <Globe className="h-3 w-3" />
                                Recurso Web
                              </Badge>
                            )}
                            <Badge variant="secondary">{result.category}</Badge>
                            <span className="text-sm text-muted-foreground">por {result.author}</span>
                          </CardDescription>
                        </div>
                        <div className={`px-3 py-1 rounded-full border ${getSimilarityColor(result.similarityScore)}`}>
                          <span className="text-sm font-semibold">{(result.similarityScore * 100).toFixed(0)}%</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground line-clamp-3">{result.contentPreview}</p>
                      {result.tags && result.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {result.tags.slice(0, 5).map((tag, tagIndex) => (
                            <Badge key={tagIndex} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="stats" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Estadísticas de Búsqueda
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {searchStats ? (
                      <>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="text-center p-4 bg-purple/5 rounded-lg">
                            <p className="text-2xl font-bold text-purple">{searchStats.totalResults}</p>
                            <p className="text-sm text-muted-foreground">Resultados</p>
                          </div>
                          <div className="text-center p-4 bg-blue/5 rounded-lg">
                            <p className="text-2xl font-bold text-blue">
                              {(searchStats.avgSimilarity * 100).toFixed(0)}%
                            </p>
                            <p className="text-sm text-muted-foreground">Similitud Promedio</p>
                          </div>
                          <div className="text-center p-4 bg-blue/5 rounded-lg">
                            <p className="text-2xl font-bold text-blue">{searchStats.searchTimeMs}ms</p>
                            <p className="text-sm text-muted-foreground">Tiempo de Búsqueda</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium">Distribución por Tipo de Fuente</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-2 bg-muted/5 rounded">
                              <span className="text-sm flex items-center gap-2">
                                <BookOpen className="h-4 w-4" />
                                Libros
                              </span>
                              <span className="font-medium">
                                {results.filter((r) => r.sourceType === "book").length}
                              </span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-muted/5 rounded">
                              <span className="text-sm flex items-center gap-2">
                                <Globe className="h-4 w-4" />
                                Recursos Web
                              </span>
                              <span className="font-medium">
                                {results.filter((r) => r.sourceType === "web_resource").length}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium">Categorías Encontradas</h4>
                          <div className="flex flex-wrap gap-2">
                            {Array.from(new Set(results.map((r) => r.category))).map((category, index) => (
                              <Badge key={index} variant="secondary">
                                {category} ({results.filter((r) => r.category === category).length})
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <p className="text-center text-muted-foreground py-8">
                        Realiza una búsqueda para ver estadísticas
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="shadow-lg border-0 bg-background">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple">
                  <Brain className="h-5 w-5" />
                  ¿Cómo Funciona?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple/20 flex items-center justify-center text-purple font-bold text-xs">
                    1
                  </div>
                  <p className="text-purple">Ingresa tu pregunta o tema en lenguaje natural (español o inglés)</p>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue/20 flex items-center justify-center text-blue font-bold text-xs">
                    2
                  </div>
                  <p className="text-purple">
                    La IA convierte tu búsqueda en embeddings vectoriales (1536 dimensiones)
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold text-xs">
                    3
                  </div>
                  <p className="text-purple">Busca en 120+ libros y 100+ recursos web usando similitud de coseno</p>
                </div>
                <div className="flex gap-3">
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple/20 flex items-center justify-center text-purple font-bold text-xs">
                    4
                  </div>
                  <p className="text-purple">Recibe resultados ordenados por relevancia con scores de similitud</p>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Base de Conocimiento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue/5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue" />
                    <span className="font-medium">Libros</span>
                  </div>
                  <Badge className="bg-blue">120+</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple/5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Globe className="h-5 w-5 text-purple" />
                    <span className="font-medium">Recursos Web</span>
                  </div>
                  <Badge className="bg-purple">100+</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue/5 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-blue" />
                    <span className="font-medium">Total Fuentes</span>
                  </div>
                  <Badge className="bg-blue">220+</Badge>
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-lg border-green/20 bg-green/5">
              <CardHeader>
                <CardTitle className="text-lg text-green">Consejos de Búsqueda</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-green">
                <p>✓ Usa preguntas completas y específicas</p>
                <p>✓ Incluye contexto relevante en tu búsqueda</p>
                <p>✓ Ajusta el umbral de similitud según necesites</p>
                <p>✓ Prueba diferentes formulaciones de tu pregunta</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
