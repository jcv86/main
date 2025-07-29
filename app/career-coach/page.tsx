"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import {
  MessageCircle,
  Send,
  Bot,
  User,
  Lightbulb,
  Target,
  TrendingUp,
  BookOpen,
  Users,
  Briefcase,
  Star,
} from "lucide-react"
import { toast } from "sonner"
import { format } from "date-fns"
import { es } from "date-fns/locale"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const quickActions = [
  {
    id: "cv-review",
    title: "Revisar mi CV",
    description: "Obtén feedback sobre tu currículum",
    icon: Briefcase,
    prompt: "¿Puedes revisar mi CV y darme consejos para mejorarlo para el mercado chileno?",
  },
  {
    id: "interview-prep",
    title: "Preparar entrevista",
    description: "Consejos para entrevistas de trabajo",
    icon: Users,
    prompt: "Tengo una entrevista próximamente. ¿Qué consejos me das para prepararme para el mercado laboral chileno?",
  },
  {
    id: "salary-negotiation",
    title: "Negociar salario",
    description: "Estrategias de negociación salarial",
    icon: TrendingUp,
    prompt: "¿Cómo puedo negociar mi salario de manera efectiva en Chile? ¿Cuáles son los rangos típicos para mi área?",
  },
  {
    id: "career-change",
    title: "Cambio de carrera",
    description: "Planificar transición profesional",
    icon: Target,
    prompt:
      "Estoy considerando un cambio de carrera. ¿Qué pasos debo seguir para hacer una transición exitosa en Chile?",
  },
  {
    id: "skill-development",
    title: "Desarrollar habilidades",
    description: "Identificar skills a mejorar",
    icon: BookOpen,
    prompt: "¿Qué habilidades técnicas y blandas debería desarrollar para ser más competitivo en el mercado chileno?",
  },
  {
    id: "networking",
    title: "Networking profesional",
    description: "Construir red de contactos",
    icon: Users,
    prompt: "¿Cómo puedo hacer networking efectivo en Chile? ¿Qué eventos o plataformas me recomiendas?",
  },
]

const conversationStarters = [
  "¿Cómo puedo mejorar mi perfil profesional para el mercado chileno?",
  "¿Qué empresas tech están contratando en Santiago?",
  "¿Cuáles son los salarios típicos en mi área en Chile?",
  "¿Cómo puedo prepararme para una entrevista técnica?",
  "¿Qué certificaciones son más valoradas en Chile?",
]

export default function CareerCoachPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadConversationHistory()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const loadConversationHistory = async () => {
    try {
      setIsLoadingHistory(true)
      const response = await fetch("/api/career-coach", {
        method: "GET",
      })

      if (response.ok) {
        const data = await response.json()
        setMessages(data.messages || [])
      } else {
        // If API fails, start with a welcome message
        setMessages([
          {
            id: "1",
            role: "assistant",
            content:
              "¡Hola! Soy tu AI Career Coach personalizado para el mercado laboral chileno. Estoy aquí para ayudarte con tu desarrollo profesional, búsqueda de empleo, y crecimiento de carrera. ¿En qué puedo asistirte hoy?",
            timestamp: new Date(),
          },
        ])
      }
    } catch (error) {
      console.error("Error loading conversation history:", error)
      // Fallback to welcome message
      setMessages([
        {
          id: "1",
          role: "assistant",
          content:
            "¡Hola! Soy tu AI Career Coach. Estoy aquí para ayudarte con tu desarrollo profesional en el mercado chileno. ¿En qué puedo asistirte hoy?",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsLoadingHistory(false)
    }
  }

  const sendMessage = async (messageContent?: string) => {
    const content = messageContent || inputMessage.trim()
    if (!content || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/career-coach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          conversationHistory: messages,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, assistantMessage])
      } else {
        throw new Error("Failed to get response")
      }
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Disculpa, estoy experimentando dificultades técnicas. En el mercado chileno, te recomiendo enfocarte en desarrollar habilidades demandadas como JavaScript, Python o AWS. Empresas como NotCo, Fintual y Cornershop están creciendo rápidamente y buscan talento.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
      toast.error("Error al enviar mensaje. Intenta nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const handleQuickAction = (action: (typeof quickActions)[0]) => {
    sendMessage(action.prompt)
  }

  if (isLoadingHistory) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
        {/* Sidebar with Quick Actions */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Acciones Rápidas
              </CardTitle>
              <CardDescription>Consultas comunes para empezar</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {quickActions.map((action) => {
                  const IconComponent = action.icon
                  return (
                    <Button
                      key={action.id}
                      variant="ghost"
                      className="w-full justify-start h-auto p-3"
                      onClick={() => handleQuickAction(action)}
                      disabled={isLoading}
                    >
                      <div className="flex items-start gap-3">
                        <IconComponent className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <div className="text-left">
                          <div className="font-medium text-sm">{action.title}</div>
                          <div className="text-xs text-muted-foreground">{action.description}</div>
                        </div>
                      </div>
                    </Button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5" />
                Sugerencias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {conversationStarters.slice(0, 3).map((starter, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    className="w-full text-left h-auto p-2 text-xs bg-transparent"
                    onClick={() => sendMessage(starter)}
                    disabled={isLoading}
                  >
                    {starter}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Chat Area */}
        <div className="lg:col-span-3">
          <Card className="h-full flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                AI Career Coach
              </CardTitle>
              <CardDescription>Tu asistente personal para desarrollo profesional en Chile</CardDescription>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0">
              {/* Messages Area */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}>
                      {message.role === "assistant" && (
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Bot className="h-4 w-4 text-primary" />
                          </div>
                        </div>
                      )}

                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground ml-auto"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                        <div
                          className={`text-xs mt-2 ${
                            message.role === "user" ? "text-primary-foreground/70" : "text-muted-foreground/70"
                          }`}
                        >
                          {format(message.timestamp, "HH:mm", { locale: es })}
                        </div>
                      </div>

                      {message.role === "user" && (
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center">
                            <User className="h-4 w-4" />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Bot className="h-4 w-4 text-primary" />
                        </div>
                      </div>
                      <div className="bg-muted rounded-lg p-3">
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                          <span className="text-sm text-muted-foreground">Escribiendo...</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <Separator />

              {/* Input Area */}
              <div className="p-4">
                <div className="flex gap-2">
                  <Input
                    ref={inputRef}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Escribe tu consulta sobre desarrollo profesional..."
                    disabled={isLoading}
                    className="flex-1"
                  />
                  <Button onClick={() => sendMessage()} disabled={isLoading || !inputMessage.trim()}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  {conversationStarters.slice(3).map((starter, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="cursor-pointer hover:bg-secondary/80 text-xs"
                      onClick={() => sendMessage(starter)}
                    >
                      {starter}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
