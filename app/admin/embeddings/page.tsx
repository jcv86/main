"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Sparkles, Database, CheckCircle, AlertCircle, TrendingUp } from "lucide-react"
import { Input } from "@/components/ui/input"

interface EmbeddingStats {
  books: { total: number; withEmbeddings: number; missing: number; percentage: number }
  webResources: { total: number; withEmbeddings: number; missing: number; percentage: number }
  overall: { total: number; withEmbeddings: number; missing: number; percentage: number }
}

interface SearchResult {
  sourceType: "book" | "web_resource"
  id: number
  title: string
  category: string
  author: string
  similarityScore: number
}

export default function EmbeddingsAdminPage() {
  const [stats, setStats] = useState<EmbeddingStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [generationResult, setGenerationResult] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/embeddings/generate")
      const data = await response.json()
      if (data.success) {
        setStats(data.data)
      }
    } catch (error) {
      console.error("Error loading stats:", error)
    } finally {
      setLoading(false)
    }
  }

  const generateEmbeddings = async () => {
    try {
      setGenerating(true)
      setGenerationResult(null)

      const response = await fetch("/api/embeddings/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ batchSize: 10 }),
      })

      const data = await response.json()
      setGenerationResult(data)

      // Reload stats after generation
      await loadStats()
    } catch (error) {
      console.error("Error generating embeddings:", error)
      setGenerationResult({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      })
    } finally {
      setGenerating(false)
    }
  }

  const performSemanticSearch = async () => {
    if (!searchQuery.trim()) return

    try {
      setSearching(true)
      const response = await fetch("/api/search/semantic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: searchQuery, limit: 5 }),
      })

      const data = await response.json()
      if (data.success) {
        setSearchResults(data.results)
      }
    } catch (error) {
      console.error("Error performing semantic search:", error)
    } finally {
      setSearching(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Sparkles className="h-8 w-8" />
          Administración de Embeddings
        </h1>
        <p className="text-muted-foreground mt-2">Gestiona embeddings para búsqueda semántica</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Database className="h-4 w-4" />
              Libros
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total:</span>
                <span className="font-bold">{stats?.books.total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Con embeddings:</span>
                <span className="font-bold text-green">{stats?.books.withEmbeddings}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Faltantes:</span>
                <span className="font-bold text-orange">{stats?.books.missing}</span>
              </div>
              <Progress value={stats?.books.percentage || 0} className="mt-2" />
              <p className="text-xs text-center text-muted-foreground">
                {stats?.books.percentage.toFixed(1)}% completo
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Database className="h-4 w-4" />
              Recursos Web
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total:</span>
                <span className="font-bold">{stats?.webResources.total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Con embeddings:</span>
                <span className="font-bold text-green">{stats?.webResources.withEmbeddings}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Faltantes:</span>
                <span className="font-bold text-orange">{stats?.webResources.missing}</span>
              </div>
              <Progress value={stats?.webResources.percentage || 0} className="mt-2" />
              <p className="text-xs text-center text-muted-foreground">
                {stats?.webResources.percentage.toFixed(1)}% completo
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Total General
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total items:</span>
                <span className="font-bold">{stats?.overall.total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Con embeddings:</span>
                <span className="font-bold text-green">{stats?.overall.withEmbeddings}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Faltantes:</span>
                <span className="font-bold text-orange">{stats?.overall.missing}</span>
              </div>
              <Progress value={stats?.overall.percentage || 0} className="mt-2" />
              <p className="text-xs text-center text-muted-foreground">
                {stats?.overall.percentage.toFixed(1)}% completo
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Generation Section */}
      <Card>
        <CardHeader>
          <CardTitle>Generar Embeddings</CardTitle>
          <CardDescription>Procesa items sin embeddings para habilitar búsqueda semántica</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={generateEmbeddings} disabled={generating || stats?.overall.missing === 0}>
            {generating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generando...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generar Embeddings Faltantes
              </>
            )}
          </Button>

          {stats?.overall.missing === 0 && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>¡Todos los items tienen embeddings generados!</AlertDescription>
            </Alert>
          )}

          {generationResult && (
            <Alert variant={generationResult.success ? "default" : "destructive"}>
              {generationResult.success ? <CheckCircle className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
              <AlertDescription>
                {generationResult.success ? (
                  <div>
                    <p className="font-semibold">{generationResult.message}</p>
                    {generationResult.data && (
                      <div className="mt-2 space-y-1 text-sm">
                        <p>Total procesados: {generationResult.data.totalProcessed}</p>
                        <p>Exitosos: {generationResult.data.successful}</p>
                        <p>Fallidos: {generationResult.data.failed}</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <p>Error: {generationResult.error}</p>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Semantic Search Test */}
      <Card>
        <CardHeader>
          <CardTitle>Probar Búsqueda Semántica</CardTitle>
          <CardDescription>Prueba la búsqueda basada en embeddings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Buscar en el conocimiento..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && performSemanticSearch()}
            />
            <Button onClick={performSemanticSearch} disabled={searching || !searchQuery.trim()}>
              {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : "Buscar"}
            </Button>
          </div>

          {searchResults.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Resultados ({searchResults.length})</h3>
              {searchResults.map((result, index) => (
                <Card key={`${result.sourceType}-${result.id}`}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant={result.sourceType === "book" ? "default" : "secondary"}>
                            {result.sourceType === "book" ? "📚 Libro" : "🌐 Web"}
                          </Badge>
                          <Badge variant="outline">{result.category}</Badge>
                        </div>
                        <h4 className="font-semibold">{result.title}</h4>
                        <p className="text-sm text-muted-foreground">{result.author}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-green">
                          {(result.similarityScore * 100).toFixed(1)}%
                        </p>
                        <p className="text-xs text-muted-foreground">similitud</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
