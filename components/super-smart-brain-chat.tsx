"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  Send,
  Loader2,
  Sparkles,
  BookOpen,
  Globe,
  TrendingUp,
  MessageSquare,
  Lightbulb,
  Target,
  ThumbsUp,
  ThumbsDown,
  Zap,
  BarChart3,
} from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
  sources?: Array<{
    id: number
    title: string
    author: string
    category: string
    sourceType: "book" | "web_resource"
    similarityScore: number
    relevanceReason?: string
  }>
  metadata?: {
    confidence: number
    personalizationLevel: string
    reasoning: string[]
    relatedTopics: string[]
    actionableSteps: string[]
    followUpQuestions: string[]
  }
}

export function SuperSmartBrainChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(true)
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const scrollRef = useRef<HTMLDivElement>(null)

  const suggestions = [
    {
      icon: <Lightbulb className="h-4 w-4" />,
      text: "¿Cómo puedo mejorar mi liderazgo según mi perfil DISC?",
      category: "Liderazgo Personalizado",
    },
    {
      icon: <TrendingUp className="h-4 w-4" />,
      text: "Quiero aumentar mi productividad sin agotarme",
      category: "Productividad Sostenible",
    },
    {
      icon: <MessageSquare className="h-4 w-4" />,
      text: "Estrategias para comunicar mejor con mi equipo remoto",
      category: "Comunicación Efectiva",
    },
    {
      icon: <Brain className="h-4 w-4" />,
      text: "Desarrollo de inteligencia emocional en el trabajo",
      category: "IE Profesional",
    },
  ]

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || input.trim()
    if (!textToSend) return

    setShowSuggestions(false)
    setInput("")

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: textToSend,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await fetch("/api/brain-query-advanced", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          userId: "demo-user",
          conversationId,
          context: {
            platform: "DespegaTuCarrera",
            previousMessages: messages.slice(-3),
          },
        }),
      })

      const data = await response.json()

      if (data.response) {
        setMessages((prev) => [...prev, data.response])
        setConversationId(data.conversationId)
      }
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: "Lo siento, hubo un error al procesar tu mensaje. Por favor intenta nuevamente.",
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const provideFeedback = async (messageId: string, rating: number) => {
    try {
      await fetch("/api/brain-query-advanced", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId,
          userId: "demo-user",
          rating,
        }),
      })
    } catch (error) {
      console.error("Error providing feedback:", error)
    }
  }

  const handleFollowUp = (question: string) => {
    sendMessage(question)
  }

  return (
    <div className="flex h-[700px] gap-4">
      {/* Main chat area */}
      <Card className="flex-1 flex flex-col">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-gradient-to-br from-purple-500 via-blue-600 to-cyan-500 rounded-lg">
                <Brain className="h-5 w-5 text-white" />
              </div>
              Cerebro Avanzado
              <Badge variant="secondary" className="ml-2">
                <Zap className="h-3 w-3 mr-1" />
                IA de Última Generación
              </Badge>
            </CardTitle>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            Búsqueda semántica multi-nivel • Re-ranking inteligente • Personalización profunda
          </p>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-6" ref={scrollRef}>
            {showSuggestions && messages.length === 0 ? (
              <div className="space-y-4">
                <Alert className="bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 border-purple-200">
                  <Brain className="h-5 w-5" />
                  <AlertDescription>
                    <p className="font-semibold mb-3">🚀 Cerebro Avanzado de IA</p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-start gap-2">
                        <Sparkles className="h-4 w-4 text-purple-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Multi-nivel de búsqueda</p>
                          <p className="text-xs text-muted-foreground">
                            3 niveles de búsqueda semántica con re-ranking
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <Target className="h-4 w-4 text-blue-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Personalización profunda</p>
                          <p className="text-xs text-muted-foreground">Basado en tu perfil y historial</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <BookOpen className="h-4 w-4 text-cyan-600 mt-0.5" />
                        <div>
                          <p className="font-medium">220+ fuentes</p>
                          <p className="text-xs text-muted-foreground">Libros y recursos web verificados</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <BarChart3 className="h-4 w-4 text-purple-600 mt-0.5" />
                        <div>
                          <p className="font-medium">Aprendizaje continuo</p>
                          <p className="text-xs text-muted-foreground">Mejora con cada interacción</p>
                        </div>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <p className="text-sm font-medium text-muted-foreground">Preguntas inteligentes sugeridas:</p>
                  {suggestions.map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      className="w-full justify-start h-auto py-4 px-4 hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-all bg-transparent"
                      onClick={() => sendMessage(suggestion.text)}
                    >
                      <div className="flex items-start gap-3 w-full">
                        <div className="p-2 bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg">
                          {suggestion.icon}
                        </div>
                        <div className="text-left flex-1">
                          <p className="font-medium text-sm">{suggestion.text}</p>
                          <Badge variant="secondary" className="text-xs mt-1">
                            {suggestion.category}
                          </Badge>
                        </div>
                        <Sparkles className="h-4 w-4 text-purple-500" />
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[85%] rounded-2xl p-5 ${
                        message.role === "user"
                          ? "bg-gradient-to-br from-purple-500 via-blue-600 to-cyan-500 text-white shadow-lg"
                          : "bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200"
                      }`}
                    >
                      <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>

                      {/* Metadata for assistant messages */}
                      {message.role === "assistant" && message.metadata && (
                        <div className="mt-4 space-y-3">
                          {/* Confidence indicator */}
                          <div className="flex items-center gap-2 pt-3 border-t border-gray-300">
                            <Zap className="h-3 w-3 text-purple-600" />
                            <span className="text-xs font-medium">Confianza de respuesta:</span>
                            <div className="flex-1">
                              <Progress value={message.metadata.confidence} className="h-2" />
                            </div>
                            <span className="text-xs font-bold">{message.metadata.confidence}%</span>
                          </div>

                          {/* Personalization level */}
                          <div className="flex items-center gap-2">
                            <Target className="h-3 w-3 text-blue-600" />
                            <span className="text-xs">
                              Nivel de personalización:{" "}
                              <span className="font-semibold capitalize">{message.metadata.personalizationLevel}</span>
                            </span>
                          </div>

                          {/* Follow-up questions */}
                          {message.metadata.followUpQuestions.length > 0 && (
                            <div className="space-y-2 pt-3 border-t border-gray-300">
                              <p className="text-xs font-semibold flex items-center gap-2">
                                <MessageSquare className="h-3 w-3" />
                                Preguntas para profundizar:
                              </p>
                              {message.metadata.followUpQuestions.map((question, idx) => (
                                <Button
                                  key={idx}
                                  variant="outline"
                                  size="sm"
                                  className="w-full justify-start text-xs h-auto py-2 bg-transparent"
                                  onClick={() => handleFollowUp(question)}
                                >
                                  {question}
                                </Button>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Feedback buttons */}
                      {message.role === "assistant" && (
                        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-300">
                          <span className="text-xs text-gray-600">¿Te ayudó esta respuesta?</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => provideFeedback(message.id, 5)}
                            className="h-7 px-2"
                          >
                            <ThumbsUp className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => provideFeedback(message.id, 1)}
                            className="h-7 px-2"
                          >
                            <ThumbsDown className="h-3 w-3" />
                          </Button>
                        </div>
                      )}

                      <div className="flex items-center gap-2 mt-3 pt-2 border-t border-white/20">
                        <span className="text-xs opacity-70">
                          {new Date(message.timestamp).toLocaleTimeString("es-CL", {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-2xl p-5">
                      <div className="flex items-center gap-3">
                        <Loader2 className="h-5 w-5 animate-spin text-purple-600" />
                        <div className="space-y-1">
                          <span className="text-sm font-medium">Procesando con IA avanzada...</span>
                          <p className="text-xs text-muted-foreground">
                            Búsqueda multi-nivel • Re-ranking • Personalización
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* Input area */}
          <div className="border-t p-4 bg-gradient-to-r from-purple-50/50 to-blue-50/50">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                sendMessage()
              }}
              className="flex gap-2"
            >
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Escribe tu pregunta... (El cerebro aprende de cada conversación)"
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-purple-600 to-blue-600"
              >
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
            <div className="flex items-center justify-center gap-4 mt-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Sparkles className="h-3 w-3" />
                <span>Búsqueda semántica</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="h-3 w-3" />
                <span>Personalización</span>
              </div>
              <div className="flex items-center gap-1">
                <Brain className="h-3 w-3" />
                <span>Aprendizaje continuo</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sidebar with analytics */}
      <Card className="w-80 flex-shrink-0">
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Análisis de Conversación
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedMessage?.metadata ? (
            <Tabs defaultValue="insights" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="insights">Insights</TabsTrigger>
                <TabsTrigger value="sources">Fuentes</TabsTrigger>
              </TabsList>
              <TabsContent value="insights" className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium mb-2">Confianza</p>
                    <Progress value={selectedMessage.metadata.confidence} />
                    <p className="text-xs text-muted-foreground mt-1">{selectedMessage.metadata.confidence}%</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium mb-2">Temas Relacionados</p>
                    <div className="flex flex-wrap gap-1">
                      {selectedMessage.metadata.relatedTopics.map((topic, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {topic}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-medium mb-2">Razonamiento</p>
                    <ul className="space-y-1">
                      {selectedMessage.metadata.reasoning.map((reason, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground flex items-start gap-2">
                          <span className="text-purple-600">•</span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="sources">
                <ScrollArea className="h-[400px]">
                  {selectedMessage.sources?.map((source, idx) => (
                    <div key={idx} className="mb-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start gap-2">
                        {source.sourceType === "book" ? (
                          <BookOpen className="h-4 w-4 text-purple-600 mt-0.5" />
                        ) : (
                          <Globe className="h-4 w-4 text-blue-600 mt-0.5" />
                        )}
                        <div className="flex-1">
                          <p className="text-xs font-medium">{source.title}</p>
                          <p className="text-xs text-muted-foreground">{source.author}</p>
                          {source.relevanceReason && (
                            <p className="text-xs text-purple-600 mt-1">{source.relevanceReason}</p>
                          )}
                          <Badge variant="outline" className="mt-2 text-xs">
                            {(source.similarityScore * 100).toFixed(0)}% relevancia
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="text-center py-12">
              <Brain className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <p className="text-sm text-muted-foreground">Selecciona un mensaje para ver análisis detallado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
