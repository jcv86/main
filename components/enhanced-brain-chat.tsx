"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Brain,
  Send,
  Loader2,
  Sparkles,
  BookOpen,
  Globe,
  Bookmark,
  History,
  TrendingUp,
  MessageSquare,
  Lightbulb,
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
  }>
}

interface Conversation {
  id: string
  title: string
  messages: Message[]
  created_at: string
  updated_at: string
}

export function EnhancedBrainChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [showSuggestions, setShowSuggestions] = useState(true)
  const scrollRef = useRef<HTMLDivElement>(null)

  const suggestions = [
    {
      icon: <Lightbulb className="h-4 w-4" />,
      text: "¿Cómo puedo mejorar mi liderazgo?",
      category: "Liderazgo",
    },
    {
      icon: <TrendingUp className="h-4 w-4" />,
      text: "Estrategias de productividad personal",
      category: "Productividad",
    },
    {
      icon: <MessageSquare className="h-4 w-4" />,
      text: "Cómo comunicarme mejor en el trabajo",
      category: "Comunicación",
    },
    {
      icon: <Brain className="h-4 w-4" />,
      text: "Desarrollar inteligencia emocional",
      category: "Desarrollo Personal",
    },
  ]

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const loadConversations = async () => {
    try {
      const response = await fetch("/api/brain-query?userId=demo-user")
      const data = await response.json()
      setConversations(data.conversations || [])
    } catch (error) {
      console.error("Error loading conversations:", error)
    }
  }

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
      const response = await fetch("/api/brain-query", {
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
        await loadConversations()
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

  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion)
  }

  const loadConversation = async (convId: string) => {
    try {
      const response = await fetch(`/api/brain-query?userId=demo-user&conversationId=${convId}`)
      const data = await response.json()
      if (data.conversation) {
        setMessages(data.conversation.messages || [])
        setConversationId(convId)
        setShowSuggestions(false)
      }
    } catch (error) {
      console.error("Error loading conversation:", error)
    }
  }

  const startNewConversation = () => {
    setMessages([])
    setConversationId(null)
    setShowSuggestions(true)
  }

  return (
    <div className="flex h-[600px] gap-4">
      {/* Sidebar with conversations */}
      <Card className="w-64 flex-shrink-0">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <History className="h-4 w-4" />
            Conversaciones
          </CardTitle>
        </CardHeader>
        <CardContent className="p-2">
          <Button onClick={startNewConversation} className="w-full mb-3 bg-transparent" size="sm" variant="outline">
            Nueva Conversación
          </Button>
          <ScrollArea className="h-[480px]">
            <div className="space-y-2">
              {conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => loadConversation(conv.id)}
                  className={`w-full text-left p-3 rounded-lg text-sm hover:bg-accent transition-colors ${
                    conversationId === conv.id ? "bg-accent" : ""
                  }`}
                >
                  <p className="font-medium truncate">{conv.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {new Date(conv.created_at).toLocaleDateString("es-CL")}
                  </p>
                </button>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Main chat area */}
      <Card className="flex-1 flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg">
              <Brain className="h-5 w-5 text-white" />
            </div>
            Cerebro de la Plataforma
            <Badge variant="secondary" className="ml-auto">
              <Sparkles className="h-3 w-3 mr-1" />
              Búsqueda Semántica Activa
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages area */}
          <ScrollArea className="flex-1 p-6" ref={scrollRef}>
            {showSuggestions && messages.length === 0 ? (
              <div className="space-y-4">
                <Alert className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                  <Brain className="h-4 w-4" />
                  <AlertDescription>
                    <p className="font-semibold mb-2">¡Hola! Soy tu Coach IA con acceso a:</p>
                    <div className="space-y-1 text-sm">
                      <p className="flex items-center gap-2">
                        <BookOpen className="h-3 w-3" /> 120+ libros profesionales
                      </p>
                      <p className="flex items-center gap-2">
                        <Globe className="h-3 w-3" /> 100+ recursos web especializados
                      </p>
                      <p className="flex items-center gap-2">
                        <Sparkles className="h-3 w-3" /> Búsqueda semántica inteligente
                      </p>
                    </div>
                  </AlertDescription>
                </Alert>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Preguntas sugeridas:</p>
                  <div className="grid grid-cols-1 gap-2">
                    {suggestions.map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        className="justify-start h-auto py-3 px-4 bg-transparent"
                        onClick={() => handleSuggestionClick(suggestion.text)}
                      >
                        <div className="flex items-start gap-3 w-full">
                          <div className="p-2 bg-purple-100 rounded-lg">{suggestion.icon}</div>
                          <div className="text-left flex-1">
                            <p className="font-medium text-sm">{suggestion.text}</p>
                            <Badge variant="secondary" className="text-xs mt-1">
                              {suggestion.category}
                            </Badge>
                          </div>
                        </div>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] rounded-lg p-4 ${
                        message.role === "user"
                          ? "bg-gradient-to-br from-purple-500 to-blue-600 text-white"
                          : "bg-accent"
                      }`}
                    >
                      <p className="whitespace-pre-wrap">{message.content}</p>

                      {message.sources && message.sources.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-white/20 space-y-2">
                          <p className="text-sm font-semibold flex items-center gap-2">
                            <Bookmark className="h-3 w-3" />
                            Fuentes consultadas:
                          </p>
                          {message.sources.map((source, index) => (
                            <div key={index} className="text-xs bg-white/10 rounded p-2">
                              <div className="flex items-center gap-2">
                                {source.sourceType === "book" ? (
                                  <BookOpen className="h-3 w-3" />
                                ) : (
                                  <Globe className="h-3 w-3" />
                                )}
                                <span className="font-medium">{source.title}</span>
                                <Badge variant="outline" className="ml-auto text-xs">
                                  {(source.similarityScore * 100).toFixed(0)}%
                                </Badge>
                              </div>
                              <p className="text-white/80 mt-1">{source.author}</p>
                            </div>
                          ))}
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
                    <div className="bg-accent rounded-lg p-4">
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Buscando en la base de conocimiento...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* Input area */}
          <div className="border-t p-4">
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
                placeholder="Escribe tu pregunta..."
                disabled={isLoading}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Búsqueda semántica activa • 220+ fuentes de conocimiento
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
