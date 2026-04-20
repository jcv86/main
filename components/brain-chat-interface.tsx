"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { SuggestedQuestions } from "@/components/suggested-questions"
import {
  Brain,
  Send,
  Loader2,
  BookOpen,
  Globe,
  Sparkles,
  TrendingUp,
  Clock,
  MessageSquare,
  Lightbulb,
  Target,
  AlertCircle,
} from "lucide-react"
import { createClient } from "@/lib/supabase"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  confidence?: number
  processingTime?: number
  sources?: Array<{
    title: string
    author: string
    category: string
    similarity: number
    excerpt: string
    sourceType: "book" | "web"
  }>
}

interface SessionStats {
  queriesCount: number
  avgConfidence: number
  avgTime: number
  topCategories: string[]
}

export function BrainChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "¡Hola! 👋 Soy tu asistente inteligente de desarrollo profesional. Tengo acceso a más de 120 libros y recursos sobre liderazgo, productividad, emprendimiento, comunicación y más.\n\n¿En qué puedo ayudarte hoy?",
      timestamp: new Date(),
      confidence: 100,
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [stats, setStats] = useState<SessionStats>({
    queriesCount: 0,
    avgConfidence: 0,
    avgTime: 0,
    topCategories: [],
  })
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [performanceData, setPerformanceData] = useState<any>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

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

  const quickQuestions = [
    { icon: Target, text: "¿Cómo mejorar mi productividad?", category: "Productividad" },
    { icon: Sparkles, text: "Técnicas de liderazgo efectivo", category: "Liderazgo" },
    { icon: MessageSquare, text: "Estrategias de comunicación", category: "Comunicación" },
    { icon: Lightbulb, text: "¿Cómo formar buenos hábitos?", category: "Hábitos" },
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setError(null)

    const startTime = Date.now()

    try {
      const response = await fetch("/api/brain-semantic", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: userMessage.content,
          similarityThreshold: 0.7,
          limit: 5,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.message || data.error || "Error en la respuesta del servidor")
      }

      const processingTime = Date.now() - startTime

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.answer,
        timestamp: new Date(),
        confidence: data.confidence,
        processingTime,
        sources: data.sources,
      }

      setMessages((prev) => [...prev, assistantMessage])

      const categories = data.sources?.map((s: any) => s.category).filter(Boolean) || []

      setStats((prev) => {
        const newCount = prev.queriesCount + 1
        const newAvgConfidence = (prev.avgConfidence * prev.queriesCount + data.confidence) / newCount
        const newAvgTime = (prev.avgTime * prev.queriesCount + processingTime) / newCount
        const allCategories = [...prev.topCategories, ...categories]
        const uniqueCategories = Array.from(new Set(allCategories)).slice(0, 5)

        return {
          queriesCount: newCount,
          avgConfidence: newAvgConfidence,
          avgTime: newAvgTime,
          topCategories: uniqueCategories,
        }
      })
    } catch (error) {
      console.error("Error:", error)
      const errorMsg = error instanceof Error ? error.message : "Error desconocido"
      setError(errorMsg)

      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: `❌ Lo siento, hubo un problema: ${errorMsg}\n\nPor favor, verifica que:\n1. Los embeddings estén generados (/admin/embeddings)\n2. La API de OpenAI esté configurada\n3. La base de datos esté correctamente configurada`,
        timestamp: new Date(),
        confidence: 0,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      inputRef.current?.focus()
    }
  }

  const handleQuickQuestion = (question: string) => {
    setInput(question)
    inputRef.current?.focus()
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 max-w-[1600px] mx-auto">
        <div className="lg:col-span-3">
          <Card className="h-[calc(100vh-8rem)] flex flex-col shadow-xl">
            <CardHeader className="border-b bg-background">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur">
                    <Brain className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Cerebro Inteligente</CardTitle>
                    <p className="text-sm text-purple/10">Búsqueda semántica avanzada con IA</p>
                  </div>
                </div>
                {stats.queriesCount > 0 && (
                  <div className="flex gap-4 text-sm">
                    <div className="text-center">
                      <div className="font-bold text-lg">{stats.queriesCount}</div>
                      <div className="text-xs text-purple/10">Consultas</div>
                    </div>
                    <div className="text-center">
                      <div className="font-bold text-lg">{Math.round(stats.avgConfidence)}%</div>
                      <div className="text-xs text-purple/10">Confianza</div>
                    </div>
                  </div>
                )}
              </div>
            </CardHeader>

            {error && (
              <Alert variant="destructive" className="m-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <ScrollArea ref={scrollRef} className="flex-1 p-6">
              <div className="space-y-6 max-w-4xl mx-auto">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-500`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl p-4 ${
                        message.role === "user"
                          ? "bg-background"
                          : "bg-muted/10 dark:bg-gray-800 border border-muted/20 dark:border-gray-700"
                      }`}
                    >
                      <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>

                      {message.role === "assistant" && (
                        <>
                          {message.confidence !== undefined && (
                            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-muted/20 dark:border-gray-700 text-xs">
                              <div className="flex items-center gap-1.5">
                                <TrendingUp className="h-3.5 w-3.5 text-green" />
                                <span className="font-medium">Confianza: {Math.round(message.confidence)}%</span>
                              </div>
                              {message.processingTime && (
                                <div className="flex items-center gap-1.5 text-muted-foreground">
                                  <Clock className="h-3.5 w-3.5" />
                                  <span>{message.processingTime}ms</span>
                                </div>
                              )}
                            </div>
                          )}

                          {message.sources && message.sources.length > 0 && (
                            <div className="mt-4 space-y-2">
                              <Separator className="my-2" />
                              <div className="text-xs font-semibold text-muted dark:text-white/85 mb-2">
                                📚 Fuentes consultadas:
                              </div>
                              <div className="space-y-2">
                                {message.sources.map((source, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-start gap-2 p-2 rounded-[28px] bg-white/50 dark:bg-transparent/50"
                                  >
                                    <div className="mt-0.5">
                                      {source.sourceType === "book" ? (
                                        <BookOpen className="h-4 w-4 text-blue" />
                                      ) : (
                                        <Globe className="h-4 w-4 text-green" />
                                      )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <span className="font-medium text-xs truncate">{source.title}</span>
                                        <Badge variant="outline" className="text-xs shrink-0">
                                          {Math.round(source.similarity * 100)}%
                                        </Badge>
                                      </div>
                                      <div className="text-xs text-muted-foreground dark:text-muted-foreground">{source.author}</div>
                                      {source.category && (
                                        <Badge variant="secondary" className="text-xs mt-1">
                                          {source.category}
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </>
                      )}

                      <div className="text-xs text-muted-foreground mt-2">{message.timestamp.toLocaleTimeString()}</div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start animate-in fade-in duration-500">
                    <div className="bg-muted/10 dark:bg-gray-800 rounded-2xl p-4 flex items-center gap-3">
                      <Loader2 className="h-5 w-5 animate-spin text-purple" />
                      <span className="text-sm text-muted-foreground dark:text-muted-foreground">Pensando...</span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <CardContent className="border-t p-4 bg-muted/5 dark:bg-transparent">
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe tu pregunta aquí..."
                  disabled={isLoading}
                  className="flex-1 bg-white dark:bg-gray-800"
                />
                <Button type="submit" disabled={isLoading || !input.trim()} size="lg" className="px-6">
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1 space-y-4">
          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-orange" />
                Preguntas Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {quickQuestions.map((q, idx) => (
                <Button
                  key={idx}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start text-left h-auto py-3 hover:bg-purple/5 dark:hover:bg-purple/20 bg-transparent"
                  onClick={() => handleQuickQuestion(q.text)}
                  disabled={isLoading}
                >
                  <q.icon className="h-4 w-4 mr-2 shrink-0 text-purple" />
                  <span className="text-xs">{q.text}</span>
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Brain className="h-5 w-5 text-purple" />
                Capacidades
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="flex items-start gap-2">
                <div className="mt-0.5 h-5 w-5 rounded-[20px] bg-green/10 dark:bg-green/20 flex items-center justify-center shrink-0">
                  <BookOpen className="h-3 w-3 text-green" />
                </div>
                <div>
                  <div className="font-semibold">120+ Libros</div>
                  <div className="text-muted-foreground dark:text-muted-foreground">Contenido expandido y detallado</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="mt-0.5 h-5 w-5 rounded-[20px] bg-blue/10 dark:bg-blue/20 flex items-center justify-center shrink-0">
                  <Sparkles className="h-3 w-3 text-blue" />
                </div>
                <div>
                  <div className="font-semibold">Búsqueda Semántica</div>
                  <div className="text-muted-foreground dark:text-muted-foreground">Entiende el contexto de tus preguntas</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="mt-0.5 h-5 w-5 rounded-[20px] bg-purple/10 dark:bg-purple/20 flex items-center justify-center shrink-0">
                  <TrendingUp className="h-3 w-3 text-purple" />
                </div>
                <div>
                  <div className="font-semibold">Alta Precisión</div>
                  <div className="text-muted-foreground dark:text-muted-foreground">Respuestas basadas en fuentes verificadas</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="mt-0.5 h-5 w-5 rounded-[20px] bg-orange/10 dark:bg-orange/20 flex items-center justify-center shrink-0">
                  <Clock className="h-3 w-3 text-orange" />
                </div>
                <div>
                  <div className="font-semibold">Respuestas Rápidas</div>
                  <div className="text-muted-foreground dark:text-muted-foreground">Procesamiento en menos de 2 segundos</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {stats.topCategories.length > 0 && (
            <Card className="shadow-lg">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Temas Consultados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-1">
                  {stats.topCategories.map((cat, idx) => (
                    <Badge key={idx} variant="secondary" className="text-xs">
                      {cat}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      <SuggestedQuestions
        contextType="dtc"
        performanceData={performanceData}
        onSelectQuestion={(question) => {
          setInput(question.question)
        }}
        title="Preguntas Sugeridas para tu Análisis"
        description="Basadas en tu performance actual"
      />
    </div>
  )
}
