"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Search, Book, Globe, AlertCircle } from "lucide-react"

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
  const [searchMode, setSearchMode] = useState<"semantic" | "brain">("semantic")
  const [similarityThreshold, setSimilarityThreshold] = useState(0.7)
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<SearchResult[]>([])
  const [error, setError] = useState<string | null>(null)
  const [searchTime, setSearchTime] = useState<number | null>(null)

  const exampleQueries = [
    "¿Cómo puedo mejorar mi liderazgo?",
    "Estrategias de productividad personal",
    "Desarrollo de inteligencia emocional",
    "Técnicas de negociación efectiva",
    "Cómo construir buenos hábitos",
  ]

  const handleSearch = async () => {
    if (!query.trim()) {
      setError("Por favor ingresa una consulta")
      return
    }

    setIsLoading(true)
    setError(null)
    setResults([])
    const startTime = Date.now()

    try {
      const response = await fetch("/api/search/semantic", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query,
          similarityThreshold,
          limit: 10,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || data.error || "Error en la búsqueda")
      }

      setResults(data.results || [])
      setSearchTime(Date.now() - startTime)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setIsLoading(false)
    }
  }

  const handleExampleClick = (example: string) => {
    setQuery(example)
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">🔍 Búsqueda Semántica Inteligente</h1>
        <p className="text-muted-foreground">Prueba el sistema de búsqueda semántica con embeddings de OpenAI</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Realizar Búsqueda</CardTitle>
              <CardDescription>Ingresa tu consulta para buscar en la base de conocimiento</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="query">Consulta</Label>
                <div className="flex gap-2">
                  <Input
                    id="query"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="¿Qué quieres aprender hoy?"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !isLoading) {
                        handleSearch()
                      }
                    }}
                  />
                  <Button onClick={handleSearch} disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Buscando...
                      </>
                    ) : (
                      <>
                        <Search className="mr-2 h-4 w-4" />
                        Buscar
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Umbral de Similitud: {similarityThreshold.toFixed(2)}</Label>
                <Slider
                  value={[similarityThreshold]}
                  onValueChange={([value]) => setSimilarityThreshold(value)}
                  min={0.5}
                  max={0.95}
                  step={0.05}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">Mayor = Resultados más precisos pero menos cantidad</p>
              </div>

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Resultados de Búsqueda</CardTitle>
                  <CardDescription>
                    {results.length > 0
                      ? `${results.length} resultados encontrados${searchTime ? ` en ${searchTime}ms` : ""}`
                      : "No hay resultados aún"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {results.length === 0 && !isLoading && (
                <div className="text-center py-12 text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Realiza una búsqueda para ver resultados</p>
                </div>
              )}

              {isLoading && (
                <div className="text-center py-12">
                  <Loader2 className="h-12 w-12 mx-auto mb-4 animate-spin text-primary" />
                  <p className="text-muted-foreground">Buscando en la base de conocimiento...</p>
                </div>
              )}

              <div className="space-y-4">
                {results.map((result, index) => (
                  <Card key={`${result.sourceType}-${result.id}`} className="border-l-4 border-l-primary">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {result.sourceType === "book" ? (
                              <Book className="h-4 w-4 text-blue-500" />
                            ) : (
                              <Globe className="h-4 w-4 text-green-500" />
                            )}
                            <CardTitle className="text-lg">{result.title}</CardTitle>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{result.author}</span>
                            <span>•</span>
                            <Badge variant="outline">{result.category}</Badge>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            {Math.round(result.similarityScore * 100)}%
                          </div>
                          <div className="text-xs text-muted-foreground">similitud</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">{result.contentPreview}</p>
                      <div className="flex flex-wrap gap-2">
                        {result.tags.slice(0, 5).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ejemplos de Consultas</CardTitle>
              <CardDescription>Haz clic en cualquier ejemplo para probar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              {exampleQueries.map((example) => (
                <Button
                  key={example}
                  variant="outline"
                  className="w-full justify-start text-left h-auto py-3 bg-transparent"
                  onClick={() => handleExampleClick(example)}
                >
                  <Search className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="text-sm">{example}</span>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Cómo Funciona</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                  1
                </div>
                <div>
                  <strong>Embeddings</strong>
                  <p className="text-muted-foreground">Tu consulta se convierte en un vector de 1536 dimensiones</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                  2
                </div>
                <div>
                  <strong>Similitud Coseno</strong>
                  <p className="text-muted-foreground">Se compara con todos los vectores en la base de datos</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                  3
                </div>
                <div>
                  <strong>Resultados Ordenados</strong>
                  <p className="text-muted-foreground">Los resultados más relevantes aparecen primero</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Estadísticas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Libros en base de datos:</span>
                <strong>120</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Recursos web:</span>
                <strong>100</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Total de contenido:</span>
                <strong>220 fuentes</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Modelo de embeddings:</span>
                <strong>text-embedding-3-small</strong>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
