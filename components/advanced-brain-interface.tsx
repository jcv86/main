"use client"

import { useState } from "react"

import type React from "react"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, Send, Brain, BookOpen, LinkIcon, TrendingUp } from "lucide-react"
import { SuggestedQuestions } from "@/components/suggested-questions"
import { createClient } from "@/lib/supabase"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  confidence?: number
  sources?: Array<{
    title: string
    author: string
    category: string
    similarity: number
    excerpt: string
    sourceType: string
    identifier: string
  }>
  keywords?: string[]
}

export function AdvancedBrainInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "¡Hola! Soy tu asistente inteligente con acceso a más de 120 libros de desarrollo profesional y recursos web. Puedo ayudarte con temas de liderazgo, productividad, emprendimiento, y mucho más. ¿Qué te gustaría aprender hoy?",
      timestamp: new Date(),
      confidence: 1.0,
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [stats, setStats] = useState({
    totalQueries: 0,
    avgConfidence: 0,
    avgProcessingTime: 0,
  })
  const [performanceData, setPerformanceData] = useState<any>(null)

  useEffect(() => {
    const loadPerformanceContext = async () => {
      try {
        const supabase = createClient()
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (session?.user?.id) {
          const { data } = await supabase
            .from("user_performance_context")
            .select("*")
            .eq("user_id", session.user.id)
            .single()

          if (data) {
            setPerformanceData({
              c1_score: data.c1_score,
              c2_score: data.c2_score,
              c3_score: data.c3_score,
              c4_score: data.c4_score,
              test_results_summary: data.test_results_summary,
            })
          }
        }
      } catch (error) {
        console.error("[v0] Error loading performance context:", error)
      }
    }

    loadPerformanceContext()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/brain-semantic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: input,
          similarityThreshold: 0.7,
          limit: 5,
        }),
      })

      const data = await response.json()

      if (data.success) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: data.answer,
          timestamp: new Date(),
          confidence: data.confidence,
          sources: data.sources,
          keywords: data.keywords,
        }

        setMessages((prev) => [...prev, assistantMessage])

        // Actualizar estadísticas
        setStats((prev) => ({
          totalQueries: prev.totalQueries + 1,
          avgConfidence: (prev.avgConfidence * prev.totalQueries + data.confidence) / (prev.totalQueries + 1),
          avgProcessingTime:
            (prev.avgProcessingTime * prev.totalQueries + data.processingTime) / (prev.totalQueries + 1),
        }))
      } else {
        throw new Error(data.message || "Error al procesar la consulta")
      }
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "Lo siento, ocurrió un error al procesar tu consulta. Por favor, intenta de nuevo.",
        timestamp: new Date(),
        confidence: 0,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const suggestedQuestions = [
    "¿Cómo puedo mejorar mi productividad?",
    "¿Qué son los hábitos atómicos?",
    "Técnicas de liderazgo efectivo",
    "¿Cómo crear una startup exitosa?",
    "Estrategias de comunicación efectiva",
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-12rem)]">
        {/* Panel Principal de Chat */}
        <Card className="lg:col-span-3 flex flex-col">
          <CardHeader className="border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Brain className="h-6 w-6 text-purple" />
                <div>
                  <CardTitle>Cerebro Avanzado</CardTitle>
                  <CardDescription>Búsqueda semántica con IA</CardDescription>
                </div>
              </div>
              {stats.totalQueries > 0 && (
                <div className="flex gap-4 text-sm">
                  <div className="text-center">
                    <div className="font-semibold">{stats.totalQueries}</div>
                    <div className="text-muted-foreground">Consultas</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{Math.round(stats.avgConfidence * 100)}%</div>
                    <div className="text-muted-foreground">Confianza</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{Math.round(stats.avgProcessingTime)}ms</div>
                    <div className="text-muted-foreground">Tiempo</div>
                  </div>
                </div>
              )}
            </div>
          </CardHeader>

          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-[28px] p-4 ${`}
                      message.type === "user" ? "bg-purple text-purple-foreground" : "bg-muted"
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>

                    {message.confidence !== undefined && message.type === "assistant" && (
                      <div className="mt-3 flex items-center gap-2 text-xs">
                        <TrendingUp className="h-3 w-3" />
                        <span>Confianza: {Math.round(message.confidence * 100)}%</span>
                      </div>
                    )}

                    {message.keywords && message.keywords.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {message.keywords.map((keyword) => (
                          <Badge key={keyword} variant="secondary" className="text-xs">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    )}

                    {message.sources && message.sources.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-border/50">
                        <div className="text-xs font-semibold mb-2">Fuentes consultadas:</div>
                        <div className="space-y-2">
                          {message.sources.slice(0, 3).map((source, idx) => (
                            <div key={idx} className="text-xs">
                              <div className="flex items-center gap-2">
                                {source.sourceType === "book" ? (
                                  <BookOpen className="h-3 w-3" />
                                ) : (
                                  <LinkIcon className="h-3 w-3" />
                                )}
                                <span className="font-medium">{source.title}</span>
                                <Badge variant="outline" className="text-xs">
                                  {Math.round(source.similarity * 100)}%
                                </Badge>
                              </div>
                              <div className="text-muted-foreground mt-1">{source.author}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-[28px] p-4">
                    <Loader2 className="h-5 w-5 animate-spin" />
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <CardContent className="border-t p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Hazme una pregunta sobre desarrollo profesional..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Panel Lateral de Sugerencias */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Preguntas Sugeridas</CardTitle>
            <CardDescription>Explora estos temas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {suggestedQuestions.map((question, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto py-3 px-3 bg-transparent"
                  onClick={() => setInput(question)}
                  disabled={isLoading}
                >
                  {question}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Suggested Questions for Advanced Brain */}
      <SuggestedQuestions
        contextType="dtc"
        performanceData={performanceData}
        onSelectQuestion={(question) => {
          setInput(question.question)
        }}
        title="Profundiza tu Análisis"
        description="Preguntas sugeridas basadas en tus datos de performance"
        maxQuestions={3}
      />
    </div>
  )
}
