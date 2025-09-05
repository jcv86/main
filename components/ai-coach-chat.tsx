"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Send, Bot, User, History, Bookmark, Star, ThumbsUp, ThumbsDown } from "lucide-react"

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  confidence?: number
  sources?: string[]
  conversationId?: string
}

interface SavedInteraction {
  id: string
  query: string
  response: string
  timestamp: Date
  rating?: number
  isSaved?: boolean
}

export default function AiCoachChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "assistant",
      content:
        "¡Hola! 👋 Soy tu coach de IA de DespegaTuCarrera. Estoy aquí para ayudarte con tu desarrollo profesional, interpretación de tests psicométricos y planificación de carrera. ¿En qué puedo asistirte hoy?",
      timestamp: new Date(),
      confidence: 1.0,
      sources: ["welcome"],
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversationHistory, setConversationHistory] = useState<SavedInteraction[]>([])
  const [savedInteractions, setSavedInteractions] = useState<SavedInteraction[]>([])
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  // Load conversation history on mount
  useEffect(() => {
    loadConversationHistory()
  }, [])

  const loadConversationHistory = async () => {
    try {
      const userEmail = localStorage.getItem("userEmail") || "demo@despegaturcarrera.com"
      const response = await fetch(`/api/brain-query?userEmail=${userEmail}&action=history&limit=20`)

      if (response.ok) {
        const data = await response.json()
        if (data.success && data.interactions) {
          const history = data.interactions.map((interaction: any) => ({
            id: interaction.id.toString(),
            query: interaction.query,
            response: interaction.response,
            timestamp: new Date(interaction.created_at),
            rating: interaction.user_rating,
            isSaved: interaction.is_saved,
          }))

          setConversationHistory(history)
          setSavedInteractions(history.filter((item: SavedInteraction) => item.isSaved))
        }
      }
    } catch (error) {
      console.error("Error loading conversation history:", error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const userEmail = localStorage.getItem("userEmail") || "demo@despegaturcarrera.com"

      const response = await fetch("/api/brain-query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: userMessage.content,
          userEmail,
          conversationHistory: messages.slice(-5), // Send last 5 messages for context
        }),
      })

      const data = await response.json()

      if (data.response) {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "assistant",
          content: data.response,
          timestamp: new Date(),
          confidence: data.confidence,
          sources: data.sources,
          conversationId: data.conversationId,
        }

        setMessages((prev) => [...prev, assistantMessage])

        // Add to conversation history
        const newInteraction: SavedInteraction = {
          id: data.conversationId || Date.now().toString(),
          query: userMessage.content,
          response: data.response,
          timestamp: new Date(),
        }

        setConversationHistory((prev) => [newInteraction, ...prev.slice(0, 19)])
      } else {
        throw new Error(data.error || "Error desconocido")
      }
    } catch (error) {
      console.error("Error:", error)

      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: "Lo siento, hubo un problema procesando tu consulta. Por favor, intenta de nuevo en unos momentos. 🔄",
        timestamp: new Date(),
        confidence: 0.3,
        sources: ["error"],
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleRating = async (messageId: string, rating: number) => {
    try {
      const message = messages.find((m) => m.id === messageId)
      if (!message?.conversationId) return

      await fetch("/api/brain-query", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          interactionId: Number.parseInt(message.conversationId),
          rating,
        }),
      })

      // Update local state
      setConversationHistory((prev) =>
        prev.map((item) => (item.id === message.conversationId ? { ...item, rating } : item)),
      )
    } catch (error) {
      console.error("Error rating interaction:", error)
    }
  }

  const handleSave = async (messageId: string) => {
    try {
      const message = messages.find((m) => m.id === messageId)
      if (!message?.conversationId) return

      const currentlySaved = savedInteractions.some((item) => item.id === message.conversationId)
      const newSavedState = !currentlySaved

      await fetch("/api/brain-query", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          interactionId: Number.parseInt(message.conversationId),
          isSaved: newSavedState,
        }),
      })

      // Update local state
      const interaction = conversationHistory.find((item) => item.id === message.conversationId)
      if (interaction) {
        const updatedInteraction = { ...interaction, isSaved: newSavedState }

        setConversationHistory((prev) =>
          prev.map((item) => (item.id === message.conversationId ? updatedInteraction : item)),
        )

        if (newSavedState) {
          setSavedInteractions((prev) => [updatedInteraction, ...prev])
        } else {
          setSavedInteractions((prev) => prev.filter((item) => item.id !== message.conversationId))
        }
      }
    } catch (error) {
      console.error("Error saving interaction:", error)
    }
  }

  const loadHistoryItem = (item: SavedInteraction) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: item.query,
      timestamp: item.timestamp,
    }

    const assistantMessage: Message = {
      id: (Date.now() + 1).toString(),
      type: "assistant",
      content: item.response,
      timestamp: item.timestamp,
      confidence: 0.9,
      sources: ["history"],
      conversationId: item.id,
    }

    setMessages([
      messages[0], // Keep welcome message
      userMessage,
      assistantMessage,
    ])
  }

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return "bg-gray-500"
    if (confidence >= 0.8) return "bg-green-500"
    if (confidence >= 0.6) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getConfidenceText = (confidence?: number) => {
    if (!confidence) return "Desconocida"
    if (confidence >= 0.8) return "Alta"
    if (confidence >= 0.6) return "Media"
    return "Baja"
  }

  return (
    <div className="h-full flex flex-col">
      <Tabs defaultValue="chat" className="h-full flex flex-col">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="chat">Chat</TabsTrigger>
          <TabsTrigger value="history">Historial</TabsTrigger>
          <TabsTrigger value="saved">Guardados</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="flex-1 flex flex-col">
          <Card className="flex-1 flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                AI Coach - DespegaTuCarrera
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${message.type === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex gap-3 max-w-[80%] ${
                          message.type === "user" ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        <div className="flex-shrink-0">
                          {message.type === "user" ? (
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-white" />
                            </div>
                          ) : (
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                              <Bot className="h-4 w-4 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div
                            className={`p-3 rounded-lg ${
                              message.type === "user" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-900"
                            }`}
                          >
                            <div className="whitespace-pre-wrap">{message.content}</div>
                          </div>

                          {message.type === "assistant" && (
                            <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                              {message.confidence && (
                                <Badge
                                  variant="secondary"
                                  className={`${getConfidenceColor(message.confidence)} text-white`}
                                >
                                  Confianza: {getConfidenceText(message.confidence)}
                                </Badge>
                              )}

                              {message.sources && message.sources.length > 0 && (
                                <Badge variant="outline">Fuentes: {message.sources.join(", ")}</Badge>
                              )}

                              <div className="flex gap-1 ml-auto">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleRating(message.id, 1)}
                                  className="h-6 w-6 p-0"
                                >
                                  <ThumbsUp className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleRating(message.id, -1)}
                                  className="h-6 w-6 p-0"
                                >
                                  <ThumbsDown className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => handleSave(message.id)}
                                  className="h-6 w-6 p-0"
                                >
                                  <Bookmark className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          )}

                          <div className="text-xs text-gray-400 mt-1">{message.timestamp.toLocaleTimeString()}</div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <Bot className="h-4 w-4 text-white" />
                      </div>
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Escribe tu pregunta sobre desarrollo profesional, tests psicométricos o planificación de carrera..."
                  className="flex-1 min-h-[60px] max-h-[120px]"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      handleSubmit(e)
                    }
                  }}
                />
                <Button type="submit" disabled={!input.trim() || isLoading} className="self-end">
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="flex-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <History className="h-5 w-5" />
                Historial de Conversaciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {conversationHistory.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => loadHistoryItem(item)}
                    >
                      <div className="font-medium text-sm mb-1">{item.query}</div>
                      <div className="text-xs text-gray-500 line-clamp-2">{item.response}</div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">{item.timestamp.toLocaleDateString()}</span>
                        {item.rating && (
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 text-yellow-500" />
                            <span className="text-xs">
                              {item.rating > 0 ? "+" : ""}
                              {item.rating}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {conversationHistory.length === 0 && (
                    <div className="text-center text-gray-500 py-8">No hay conversaciones previas</div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="saved" className="flex-1">
          <Card className="h-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bookmark className="h-5 w-5" />
                Conversaciones Guardadas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px]">
                <div className="space-y-3">
                  {savedInteractions.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => loadHistoryItem(item)}
                    >
                      <div className="font-medium text-sm mb-1">{item.query}</div>
                      <div className="text-xs text-gray-500 line-clamp-2">{item.response}</div>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-400">{item.timestamp.toLocaleDateString()}</span>
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Guardado
                        </Badge>
                      </div>
                    </div>
                  ))}

                  {savedInteractions.length === 0 && (
                    <div className="text-center text-gray-500 py-8">No hay conversaciones guardadas</div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
