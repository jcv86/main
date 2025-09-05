"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageCircle, Send, User, Lightbulb, CheckCircle, AlertCircle, Loader2, Brain, BookOpen } from "lucide-react"

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

interface AiCoachChatProps {
  testType?: string
  testResults?: any
  userProfile?: any
  className?: string
}

export default function AiCoachChat({ testType, testResults, userProfile, className }: AiCoachChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"online" | "offline" | "fallback">("online")
  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const userEmail = "demo@example.com" // In real app, get from auth

  useEffect(() => {
    initializeChat()
  }, [testType, testResults])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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
      return `¡Hola! Soy tu **AI Coach Personal** especializado en desarrollo profesional.

He analizado tus resultados del test **${getTestName(testType)}** y puedo ayudarte con:

**Tu puntuación:** ${testResults.score || 0}%

• **Interpretación detallada** de tus resultados
• **Recomendaciones de carrera** personalizadas  
• **Planes de desarrollo** específicos
• **Estrategias de mejora** por área

¿En qué te gustaría que profundice?`
    }

    const completedTests = Array.isArray(testResults) ? testResults.length : 0

    return `¡Hola! Soy tu **AI Coach Personal** especializado en desarrollo profesional.

Puedo ayudarte con:
🧠 **Interpretación de Tests** (DISC, Big Five, MBTI, RIASEC, Habilidades Blandas)
🎯 **Desarrollo de Carrera** y transiciones profesionales
📈 **Estrategias de Mejora** personalizadas
🔍 **Análisis de Fortalezas** y áreas de oportunidad

${
  completedTests > 0
    ? `He revisado tus **${completedTests} evaluación(es)** completada(s) y puedo ofrecerte consejos personalizados.`
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
        `Analiza mis resultados del test ${getTestName(testType)}`,
        "¿Qué carreras se adaptan a mi perfil?",
        "Crea un plan de desarrollo personalizado",
        "¿Cuáles son mis principales fortalezas?",
      ]
    }

    const completedTests = Array.isArray(testResults) ? testResults.length : 0

    if (completedTests >= 2) {
      return [
        "Analiza mi perfil completo",
        "Recomienda carreras específicas",
        "Diseña una estrategia de desarrollo",
        "¿Qué habilidades debo priorizar?",
      ]
    } else if (completedTests === 1) {
      return [
        "Interpreta mis resultados actuales",
        "¿Qué evaluación debería hacer después?",
        "¿Cómo se compara mi perfil?",
        "Explícame mis puntuaciones",
      ]
    } else {
      return [
        "¿Qué evaluación me recomiendas hacer primero?",
        "Explícame los beneficios de cada test",
        "¿Cómo funciona el análisis de la plataforma?",
        "Ayúdame a crear un plan de evaluación",
      ]
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
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
      const response = await fetch("/api/ai-coach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage.content,
          testType,
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
          confidence: data.confidence || 80,
          knowledgeUsed: data.knowledgeUsed || [],
          suggestions: data.suggestions || [],
          sources: data.sources || [],
        }

        setMessages((prev) => [...prev, assistantMessage])
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
          "Lo siento, hubo un problema de conexión. Por favor, intenta de nuevo en unos momentos. Mientras tanto, puedes explorar tus resultados de tests en la sección de Resultados.",
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
            AI Activo
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
    <Card className={`h-[600px] flex flex-col ${className}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">AI Coach Personal</CardTitle>
              <CardDescription className="text-sm">
                {isTyping ? "Analizando..." : "Asistente especializado en desarrollo profesional"}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">{getConnectionStatusBadge()}</div>
        </div>
      </CardHeader>

      <Separator />

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
                    <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
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
                    <span className="text-xs opacity-70">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
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
                  <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs">
                    AI
                  </AvatarFallback>
                </Avatar>
                <div className="bg-gray-50 rounded-lg rounded-bl-sm p-3 border">
                  <div className="flex items-center gap-1">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                    <span className="text-xs text-gray-500 ml-2">Analizando tu consulta...</span>
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
            <Button onClick={handleSendMessage} disabled={isLoading || !input.trim()} size="sm">
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>

          <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
            <Brain className="h-3 w-3" />
            <span>
              {connectionStatus === "online"
                ? "AI Coach especializado en desarrollo profesional"
                : connectionStatus === "fallback"
                  ? "Funcionando en modo básico"
                  : "Sin conexión - intenta de nuevo"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Export both default and named exports
export { AiCoachChat }
