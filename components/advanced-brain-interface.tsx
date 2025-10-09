"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Brain,
  Search,
  Sparkles,
  BookOpen,
  Globe,
  TrendingUp,
  Lightbulb,
  Send,
  Loader2,
  CheckCircle,
} from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
  sources?: any[]
  confidence?: number
  keyInsights?: string[]
  timestamp: Date
  searchTimeMs?: number
}

interface SearchStats {
  totalQueries: number
  avgConfidence: number
  avgSearchTime: number
  topCategories: string[]
}

export function AdvancedBrainInterface() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState<SearchStats>({
    totalQueries: 0,
    avgConfidence: 0,
    avgSearchTime: 0,
    topCategories: [],
  })
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userMessage: Message = {
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setLoading(true)

    try {
      const response = await fetch("/api/brain-semantic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: input,
          limit: 5,
          similarityThreshold: 0.7,
        }),
      })

      const data = await response.json()

      if (data.success) {
        const assistantMessage: Message = {
          role: "assistant",
          content: data.answer,
          sources: data.sources,
          confidence: data.confidence,
          keyInsights: data.keyInsights,
          timestamp: new Date(),
          searchTimeMs: data.searchTimeMs,
        }

        setMessages((prev) => [...prev, assistantMessage])

        // Update stats
        setStats((prev) => {
          const newTotal = prev.totalQueries + 1
          const categories = data.sources?.map((s: any) => s.category) || []
          return {
            totalQueries: newTotal,
            avgConfidence: (prev.avgConfidence * prev.totalQueries + data.confidence) / newTotal,
            avgSearchTime: (prev.avgSearchTime * prev.totalQueries + data.searchTimeMs) / newTotal,
            topCategories: Array.from(new Set([...prev.topCategories, ...categories])).slice(0, 5),
          }
        })
      } else {
        throw new Error(data.message || "Search failed")
      }
    } catch (error) {
      const errorMessage: Message = {
        role: "assistant",
        content: `❌ Error: ${error instanceof Error ? error.message : "Unknown error occurred"}`,
        timestamp: new Date(),
        confidence: 0,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const suggestedQueries = [
    "¿Cómo puedo mejorar mi productividad diaria?",
    "Estrategias efectivas de liderazgo",
    "Técnicas de negociación exitosas",
    "Cómo formar hábitos duraderos",
    "Principios de comunicación efectiva",
  ]

  return (
    <div className="container mx-auto p-4 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="h-[800px] flex flex-col">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-purple-600" />
                <CardTitle>Cerebro Inteligente con Búsqueda Semántica</CardTitle>
              </div>
              <CardDescription>
                Búsqueda avanzada con IA en {stats.totalQueries > 0 ? "120+" : "100+"} libros y recursos
              </CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-4">
              {/* Messages Area */}
              <ScrollArea className="flex-1 pr-4 mb-4" ref={scrollRef}>
                {messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-8">
                    <Sparkles className="h-16 w-16 text-purple-400 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">¡Bienvenido al Cerebro Mejorado!</h3>
                    <p className="text-muted-foreground mb-6">
                      Ahora con búsqueda semántica avanzada y contenido expandido de libros profesionales
                    </p>
                    <div className="grid grid-cols-1 gap-2 w-full max-w-md">
                      {suggestedQueries.slice(0, 3).map((query, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          className="justify-start text-left bg-transparent"
                          onClick={() => setInput(query)}
                        >
                          <Search className="h-4 w-4 mr-2" />
                          {query}
                        </Button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {messages.map((message, index) => (
                      <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[85%] rounded-lg p-4 ${
                            message.role === "user" ? "bg-purple-600 text-white" : "bg-muted border border-border"
                          }`}
                        >
                          <div className="whitespace-pre-wrap">{message.content}</div>

                          {message.role === "assistant" && (
                            <>
                              {/* Confidence and Time */}
                              {message.confidence !== undefined && (
                                <div className="flex items-center gap-4 mt-3 pt-3 border-t border-border/50 text-sm">
                                  <div className="flex items-center gap-1">
                                    <TrendingUp className="h-4 w-4" />
                                    <span>{message.confidence.toFixed(1)}% confianza</span>
                                  </div>
                                  {message.searchTimeMs && (
                                    <div className="text-muted-foreground">{message.searchTimeMs}ms</div>
                                  )}
                                </div>
                              )}

                              {/* Sources */}
                              {message.sources && message.sources.length > 0 && (
                                <div className="mt-3 space-y-2">
                                  <div className="text-sm font-semibold">Fuentes consultadas:</div>
                                  {message.sources.map((source, idx) => (
                                    <div key={idx} className="flex items-center gap-2 text-sm">
                                      {source.sourceType === "book" ? (
                                        <BookOpen className="h-4 w-4" />
                                      ) : (
                                        <Globe className="h-4 w-4" />
                                      )}
                                      <span className="font-medium">{source.title}</span>
                                      <Badge variant="outline" className="text-xs">
                                        {(source.similarityScore * 100).toFixed(0)}%
                                      </Badge>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </>
                          )}

                          <div className="text-xs text-muted-foreground mt-2">
                            {message.timestamp.toLocaleTimeString()}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>

              {/* Input Area */}
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Pregunta algo sobre desarrollo profesional, liderazgo, productividad..."
                  disabled={loading}
                  className="flex-1"
                />
                <Button type="submit" disabled={loading || !input.trim()} size="icon">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Stats and Info */}
        <div className="space-y-6">
          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Estadísticas de Búsqueda</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-2xl font-bold">{stats.totalQueries}</div>
                <div className="text-sm text-muted-foreground">Consultas realizadas</div>
              </div>

              {stats.totalQueries > 0 && (
                <>
                  <div>
                    <div className="text-2xl font-bold">{stats.avgConfidence.toFixed(1)}%</div>
                    <div className="text-sm text-muted-foreground">Confianza promedio</div>
                  </div>

                  <div>
                    <div className="text-2xl font-bold">{stats.avgSearchTime.toFixed(0)}ms</div>
                    <div className="text-sm text-muted-foreground">Tiempo promedio</div>
                  </div>

                  {stats.topCategories.length > 0 && (
                    <div>
                      <div className="text-sm font-semibold mb-2">Categorías más consultadas</div>
                      <div className="flex flex-wrap gap-1">
                        {stats.topCategories.map((cat, idx) => (
                          <Badge key={idx} variant="secondary">
                            {cat}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Features Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Nuevas Capacidades</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold">Búsqueda Semántica</div>
                  <div className="text-muted-foreground">Entiende el significado de tus preguntas</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold">Contenido Expandido</div>
                  <div className="text-muted-foreground">Libros con 20k+ caracteres de contenido detallado</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold">Chunks Relevantes</div>
                  <div className="text-muted-foreground">Extrae las partes más relevantes de cada fuente</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-semibold">Scoring Inteligente</div>
                  <div className="text-muted-foreground">Calcula relevancia y confianza de respuestas</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Suggested Queries Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Preguntas Sugeridas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {suggestedQueries.map((query, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  className="w-full justify-start text-left h-auto py-2"
                  onClick={() => setInput(query)}
                >
                  <Search className="h-4 w-4 mr-2 flex-shrink-0" />
                  <span className="text-sm">{query}</span>
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
