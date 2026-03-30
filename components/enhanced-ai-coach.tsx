"use client"

import { useState, useEffect, useRef } from "react"
import { useUser } from "@/hooks/use-user"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MessageCircle,
  Send,
  User,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  Loader2,
  Star,
  BookmarkPlus,
  Bookmark,
  History,
  Brain,
  ThumbsUp,
  ThumbsDown,
  MoreVertical,
  BookOpen,
  Mic,
  MicOff,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  confidence?: number
  knowledgeUsed?: string[]
  suggestions?: string[]
  sources?: any[]
  interactionId?: number
  rating?: number
  isSaved?: boolean
}

interface EnhancedAICoachProps {
  testType?: string
  testResults?: any
  userProfile?: any
  className?: string
}

export default function EnhancedAICoach({ testType, testResults, userProfile, className }: EnhancedAICoachProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"online" | "offline" | "fallback">("online")
  const [conversationHistory, setConversationHistory] = useState<any[]>([])
  const [savedInteractions, setSavedInteractions] = useState<any[]>([])
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [isListening, setIsListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const recognitionRef = useRef<any>(null)

  const { user } = useUser()
  const userEmail = user?.email || ""

  useEffect(() => {
    initializeChat()
    loadConversationHistory()
  }, [testType, testResults])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        setSpeechSupported(true)
        const recognition = new SpeechRecognition()
        recognition.continuous = false // Detener después de detectar silencio
        recognition.interimResults = true // Mostrar resultados mientras habla
        recognition.lang = "es-ES"

        recognition.onresult = (event: any) => {
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result) => result.transcript)
            .join("")

          setInput(transcript)
        }

        recognition.onerror = (event: any) => {
          console.error("Speech recognition error:", event.error)
          setIsListening(false)
        }

        recognition.onend = () => {
          setIsListening(false)
        }

        recognitionRef.current = recognition
      }
    }
  }, [])

  const toggleListening = () => {
    if (!recognitionRef.current) return

    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const initializeChat = () => {
    const welcomeMessage: Message = {
      id: "welcome",
      role: "assistant",
      content: getWelcomeMessage(),
      timestamp: new Date(),
      confidence: 95,
      suggestions: getInitialSuggestions(),
    }

    setMessages([welcomeMessage])
  }

  const getWelcomeMessage = () => {
    if (testType && testResults) {
      return `¡Hola! Soy tu **AI Coach Personal** con acceso completo al cerebro de la plataforma. 

He analizado tus resultados del test **${getTestName(testType)}** y tengo acceso a toda nuestra base de conocimiento especializada en desarrollo profesional.

**Tu puntuación:** ${testResults.score || 0}%

Puedo ayudarte con:
• **Interpretación detallada** de tus resultados
• **Recomendaciones de carrera** personalizadas  
• **Planes de desarrollo** específicos
• **Estrategias de mejora** por área
• **Comparación** con otros perfiles

¿En qué te gustaría que profundice?`
    }

    const completedTests = Array.isArray(testResults) ? testResults.length : 0

    return `¡Hola! Soy tu **AI Coach Personal** con acceso completo al **cerebro de la plataforma**.

Tengo conocimiento especializado sobre:
🧠 **Tests Psicométricos** (DISC, Big Five, MBTI, RIASEC, Habilidades Blandas)
🎯 **Desarrollo de Carrera** y transiciones profesionales
📈 **Estrategias de Mejora** por competencias específicas
🔍 **Interpretación Avanzada** de combinaciones de resultados

${
  completedTests > 0
    ? `He revisado tus **${completedTests} evaluación(es)** completada(s) y puedo ofrecerte insights personalizados y científicamente fundamentados.`
    : "Una vez que completes algunas evaluaciones, podré darte consejos específicos basados en tu perfil único."
}

**¿En qué puedo ayudarte hoy?**`
  }

  const getTestName = (type: string) => {
    const names = {
      disc: "DISC",
      "big-five": "Big Five",
      mbti: "MBTI",
      riasec: "RIASEC",
      "soft-skills": "Habilidades Blandas",
    }
    return names[type as keyof typeof names] || type
  }

  const getInitialSuggestions = (): string[] => {
    if (testType && testResults) {
      return [
        `Analiza en detalle mis resultados del test ${getTestName(testType)}`,
        "¿Qué carreras específicas se adaptan a mi perfil?",
        "Crea un plan de desarrollo personalizado de 90 días",
        "¿Cómo puedo potenciar mis fortalezas principales?",
      ]
    }

    const completedTests = Array.isArray(testResults) ? testResults.length : 0

    if (completedTests >= 2) {
      return [
        "Analiza mi perfil completo y recomienda carreras",
        "¿Cuáles son mis principales fortalezas y cómo usarlas?",
        "Diseña una estrategia de carrera personalizada",
        "¿Qué habilidades debo priorizar para desarrollar?",
      ]
    } else if (completedTests === 1) {
      return [
        "Interpreta mis resultados con ejemplos prácticos",
        "¿Qué evaluación debería completar después?",
        "¿Cómo se compara mi perfil con otros profesionales?",
        "Explícame las implicaciones de mis puntuaciones",
      ]
    } else {
      return [
        "¿Qué evaluación me recomiendas hacer primero y por qué?",
        "Explícame los beneficios de cada tipo de test",
        "¿Cómo funciona el sistema de análisis de la plataforma?",
        "Ayúdame a crear un plan de evaluación personalizado",
      ]
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const loadConversationHistory = async () => {
    try {
      const response = await fetch(
        `/api/brain-query?userEmail=${encodeURIComponent(userEmail)}&action=history&limit=20`,
      )
      if (response.ok) {
        const data = await response.json()
        setConversationHistory(data.interactions || [])
        setSavedInteractions(data.interactions?.filter((i: any) => i.is_saved) || [])
      }
    } catch (error) {
      console.error("Error loading conversation history:", error)
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setIsTyping(true)

    try {
      const response = await fetch("/api/brain-query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: userMessage.content,
          userEmail,
          testResults: Array.isArray(testResults) ? testResults : testResults ? [testResults] : [],
          conversationHistory: messages.slice(-5), // Last 5 messages for context
        }),
      })

      if (response.ok) {
        const data = await response.json()

        setConnectionStatus(data.fallback ? "fallback" : "online")

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
          confidence: data.confidence,
          knowledgeUsed: data.knowledgeUsed,
          suggestions: data.suggestions,
          sources: data.sources,
        }

        setMessages((prev) => [...prev, assistantMessage])

        // Reload history to get the new interaction
        setTimeout(loadConversationHistory, 1000)
      } else {
        throw new Error(`HTTP ${response.status}`)
      }
    } catch (error) {
      console.error("Error in AI chat:", error)
      setConnectionStatus("offline")

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Lo siento, hubo un problema de conexión con el cerebro de la plataforma. Por favor, intenta de nuevo en unos momentos. Mientras tanto, puedes explorar tus resultados de tests en la sección de Resultados.",
        timestamp: new Date(),
        confidence: 30,
        suggestions: ["Ver mis resultados de tests", "¿Qué puedo hacer sin conexión?", "Reintentar conexión"],
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setIsTyping(false)
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion)
  }

  const handleRateMessage = async (messageId: string, rating: number) => {
    const message = messages.find((m) => m.id === messageId)
    if (!message?.interactionId) return

    try {
      await fetch("/api/brain-query", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interactionId: message.interactionId,
          rating,
        }),
      })

      setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, rating } : m)))
    } catch (error) {
      console.error("Error rating message:", error)
    }
  }

  const handleSaveMessage = async (messageId: string) => {
    const message = messages.find((m) => m.id === messageId)
    if (!message?.interactionId) return

    const newSavedState = !message.isSaved

    try {
      await fetch("/api/brain-query", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interactionId: message.interactionId,
          isSaved: newSavedState,
        }),
      })

      setMessages((prev) => prev.map((m) => (m.id === messageId ? { ...m, isSaved: newSavedState } : m)))

      loadConversationHistory()
    } catch (error) {
      console.error("Error saving message:", error)
    }
  }

  const getMessageIcon = (message: Message) => {
    if (message.role === "user") return <User className="h-4 w-4" />
    return <Brain className="h-4 w-4" />
  }

  const getConnectionStatusBadge = () => {
    switch (connectionStatus) {
      case "online":
        return (
          <Badge variant="outline" className="text-xs">
            <CheckCircle className="h-3 w-3 mr-1 text-green-600" />
            Cerebro Activo
          </Badge>
        )
      case "fallback":
        return (
          <Badge variant="outline" className="text-xs">
            <AlertCircle className="h-3 w-3 mr-1 text-yellow-600" />
            Modo Básico
          </Badge>
        )
      case "offline":
        return (
          <Badge variant="outline" className="text-xs">
            <AlertCircle className="h-3 w-3 mr-1 text-red-600" />
            Sin Conexión
          </Badge>
        )
    }
  }

  return (
    <Card className={`h-[700px] flex flex-col ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">AI Coach - Cerebro Completo</CardTitle>
              <CardDescription className="text-sm">
                {isTyping ? "Procesando con IA..." : "Acceso completo a la base de conocimiento"}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">{getConnectionStatusBadge()}</div>
        </div>
      </CardHeader>

      <Separator />

      <Tabs defaultValue="chat" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 mx-4 mt-2">
          <TabsTrigger value="chat" className="text-xs">
            <MessageCircle className="h-3 w-3 mr-1" />
            Chat
          </TabsTrigger>
          <TabsTrigger value="history" className="text-xs">
            <History className="h-3 w-3 mr-1" />
            Historial
          </TabsTrigger>
          <TabsTrigger value="saved" className="text-xs">
            <Bookmark className="h-3 w-3 mr-1" />
            Guardados
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 flex flex-col m-0">
          <CardContent className="flex-1 flex flex-col p-0">
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {message.role === "assistant" && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs">
                          AI
                        </AvatarFallback>
                      </Avatar>
                    )}

                    <div
                      className={`max-w-[85%] ${
                        message.role === "user"
                          ? "bg-blue-600 text-white rounded-lg rounded-br-sm"
                          : "bg-gray-50 rounded-lg rounded-bl-sm border"
                      } p-3`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2">
                          {getMessageIcon(message)}
                          {message.confidence && (
                            <Badge variant="secondary" className="text-xs">
                              {message.confidence}% confianza
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs opacity-70">
                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                          {message.role === "assistant" && (
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                  <MoreVertical className="h-3 w-3" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => handleSaveMessage(message.id)}>
                                  {message.isSaved ? (
                                    <>
                                      <Bookmark className="h-3 w-3 mr-2" />
                                      Quitar de guardados
                                    </>
                                  ) : (
                                    <>
                                      <BookmarkPlus className="h-3 w-3 mr-2" />
                                      Guardar respuesta
                                    </>
                                  )}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRateMessage(message.id, 5)}>
                                  <ThumbsUp className="h-3 w-3 mr-2" />
                                  Útil
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleRateMessage(message.id, 1)}>
                                  <ThumbsDown className="h-3 w-3 mr-2" />
                                  No útil
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          )}
                        </div>
                      </div>

                      <div className="text-sm whitespace-pre-wrap">{message.content}</div>

                      {/* Knowledge Sources */}
                      {message.knowledgeUsed && message.knowledgeUsed.length > 0 && (
                        <div className="mt-2 pt-2 border-t border-gray-200">
                          <div className="text-xs text-gray-500 mb-1">Fuentes consultadas:</div>
                          <div className="flex flex-wrap gap-1">
                            {message.knowledgeUsed.map((source, idx) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                <BookOpen className="h-2 w-2 mr-1" />
                                {source}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Suggestions */}
                      {message.suggestions && message.suggestions.length > 0 && (
                        <div className="mt-3 space-y-1">
                          <div className="text-xs opacity-70 mb-2">Preguntas sugeridas:</div>
                          {message.suggestions.map((suggestion, idx) => (
                            <Button
                              key={idx}
                              variant="outline"
                              size="sm"
                              className="text-xs h-7 mr-1 mb-1 bg-transparent"
                              onClick={() => handleSuggestionClick(suggestion)}
                            >
                              <Lightbulb className="h-3 w-3 mr-1" />
                              {suggestion}
                            </Button>
                          ))}
                        </div>
                      )}

                      {/* Rating Display */}
                      {message.rating && (
                        <div className="mt-2 flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < message.rating! ? "text-yellow-400 fill-current" : "text-gray-300"
                              }`}
                            />
                          ))}
                          <span className="text-xs text-gray-500 ml-1">Calificado</span>
                        </div>
                      )}
                    </div>

                    {message.role === "user" && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={userProfile?.avatar_url || "/placeholder.svg"} />
                        <AvatarFallback className="bg-blue-600 text-white text-xs">
                          {userProfile?.full_name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}

                {isTyping && (
                  <div className="flex gap-3 justify-start">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-gradient-to-r from-purple-500 to-blue-500 text-white text-xs">
                        AI
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-gray-50 rounded-lg rounded-bl-sm p-3 border">
                      <div className="flex items-center gap-1">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                        <span className="text-xs text-gray-500 ml-2">Consultando cerebro de la plataforma...</span>
                      </div>
                    </div>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <Separator />

            <div className="p-4">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Pregunta sobre desarrollo profesional, tests, carreras..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  disabled={isLoading}
                  className="flex-1"
                />
                {speechSupported && (
                  <Button
                    onClick={toggleListening}
                    disabled={isLoading}
                    variant={isListening ? "destructive" : "outline"}
                    size="icon"
                    className={isListening ? "animate-pulse" : ""}
                    title={isListening ? "Detener grabación" : "Iniciar grabación de voz"}
                  >
                    {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                )}
                <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()} size="icon">
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>

              <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                <div className="flex items-center gap-2">
                  <Brain className="h-3 w-3" />
                  <span>
                    {connectionStatus === "online"
                      ? "Conectado al cerebro completo de la plataforma"
                      : connectionStatus === "fallback"
                        ? "Funcionando en modo básico"
                        : "Sin conexión - intenta de nuevo"}
                  </span>
                </div>
                {speechSupported && (
                  <div className="flex items-center gap-1">
                    <Mic className="h-3 w-3" />
                    <span>{isListening ? "Escuchando..." : "Click para hablar"}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </TabsContent>

        <TabsContent value="history" className="flex-1 m-0">
          <ScrollArea className="h-full p-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Historial de Conversaciones</h3>
              {conversationHistory.length > 0 ? (
                conversationHistory.map((interaction, idx) => (
                  <div key={idx} className="border rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {interaction.confidence_score}% confianza
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {new Date(interaction.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm font-medium">{interaction.query}</div>
                    <div className="text-xs text-gray-600 line-clamp-2">{interaction.response}</div>
                    {interaction.knowledge_used && interaction.knowledge_used.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {interaction.knowledge_used.slice(0, 2).map((source: string, sourceIdx: number) => (
                          <Badge key={sourceIdx} variant="secondary" className="text-xs">
                            {source}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <History className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No hay conversaciones previas</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        <TabsContent value="saved" className="flex-1 m-0">
          <ScrollArea className="h-full p-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-sm">Insights Guardados</h3>
              {savedInteractions.length > 0 ? (
                savedInteractions.map((interaction, idx) => (
                  <div key={idx} className="border rounded-lg p-3 space-y-2 bg-blue-50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bookmark className="h-3 w-3 text-blue-600" />
                        <Badge variant="outline" className="text-xs">
                          {interaction.confidence_score}% confianza
                        </Badge>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(interaction.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm font-medium">{interaction.query}</div>
                    <div className="text-xs text-gray-700">{interaction.response}</div>
                    {interaction.user_rating && (
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${
                              i < interaction.user_rating ? "text-yellow-400 fill-current" : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Bookmark className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No tienes insights guardados</p>
                  <p className="text-xs mt-1">Guarda respuestas útiles usando el menú de opciones</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </Card>
  )
}

// Export both default and named exports
export { EnhancedAICoach }
export const AiCoachChat = EnhancedAICoach
