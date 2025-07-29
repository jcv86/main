"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { SearchDialog } from "@/components/search-dialog"
import { VoiceSearchButton } from "@/components/voice-search-button"
import {
  Send,
  Bot,
  User,
  MessageSquare,
  Plus,
  History,
  Loader2,
  AlertCircle,
  CheckCircle,
  Clock,
  Mic,
  Volume2,
} from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useAuth } from "@/contexts/auth-context"
import { toast } from "sonner"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string | Date
  isHighlighted?: boolean
}

interface Session {
  sessionId: string
  lastMessage: Date
  messageCount: number
}

export default function CareerCoachPage() {
  const { user, isDemoMode } = useAuth()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingHistory, setIsLoadingHistory] = useState(true)
  const [currentSessionId, setCurrentSessionId] = useState<string>("")
  const [sessions, setSessions] = useState<Session[]>([])
  const [isDemo, setIsDemo] = useState(isDemoMode)
  const [highlightedMessageId, setHighlightedMessageId] = useState<string | null>(null)
  const [isVoiceInput, setIsVoiceInput] = useState(false)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messageRefs = useRef<{ [key: string]: HTMLDivElement }>({})

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Scroll to specific message
  const scrollToMessage = (messageId: string) => {
    const messageElement = messageRefs.current[messageId]
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: "smooth", block: "center" })

      // Highlight the message
      setHighlightedMessageId(messageId)

      // Remove highlight after 3 seconds
      setTimeout(() => {
        setHighlightedMessageId(null)
      }, 3000)
    }
  }

  // Load conversation history
  const loadConversationHistory = async (sessionId?: string) => {
    setIsLoadingHistory(true)
    try {
      const params = new URLSearchParams()
      if (user?.id) params.append("userId", user.id)
      if (sessionId) params.append("sessionId", sessionId)

      const response = await fetch(`/api/career-coach?${params}`)

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      setMessages(data.messages || [])
      setCurrentSessionId(data.sessionId || "")
      setIsDemo(data.isDemo || isDemoMode || !user)

      // Auto-scroll to bottom after loading
      setTimeout(scrollToBottom, 100)
    } catch (error) {
      console.error("Error loading conversation history:", error)
      toast.error("Error al cargar el historial de conversación")

      // Set default welcome message on error
      const demoSessionId = `demo-session-${Date.now()}`
      setMessages([
        {
          id: "1",
          role: "assistant",
          content:
            "¡Hola! Soy tu AI Career Coach. Estoy aquí para ayudarte con tu desarrollo profesional. ¿En qué puedo asistirte hoy?",
          timestamp: new Date().toISOString(),
        },
      ])
      setCurrentSessionId(demoSessionId)
      setIsDemo(true)
    } finally {
      setIsLoadingHistory(false)
    }
  }

  // Load user sessions
  const loadUserSessions = async () => {
    if (!user?.id) return

    try {
      const response = await fetch(`/api/career-coach?action=sessions&userId=${user.id}`)

      if (response.ok) {
        const data = await response.json()
        setSessions(data.sessions || [])
      }
    } catch (error) {
      console.error("Error loading user sessions:", error)
    }
  }

  // Send message
  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setIsLoading(true)

    // Add user message immediately
    const newUserMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: userMessage,
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, newUserMessage])

    // Auto-scroll after adding user message
    setTimeout(scrollToBottom, 100)

    try {
      const response = await fetch("/api/career-coach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: messages,
          userId: user?.id,
          sessionId: currentSessionId,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Add assistant response
      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.response,
        timestamp: data.timestamp || new Date().toISOString(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setIsDemo(data.isDemo || isDemoMode || !user)

      // Update session ID if provided
      if (data.sessionId) {
        setCurrentSessionId(data.sessionId)
      }

      // Auto-scroll after adding assistant message
      setTimeout(scrollToBottom, 100)

      // Reload sessions to update the list
      if (user?.id) {
        loadUserSessions()
      }
    } catch (error) {
      console.error("Error sending message:", error)
      toast.error("Error al enviar el mensaje. Inténtalo de nuevo.")

      // Add error message
      const errorMessage: Message = {
        id: `error-${Date.now()}`,
        role: "assistant",
        content: "Disculpa, hubo un error al procesar tu mensaje. Por favor, inténtalo de nuevo.",
        timestamp: new Date().toISOString(),
      }

      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Start new session
  const startNewSession = async () => {
    try {
      const response = await fetch("/api/career-coach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "new_session",
          userId: user?.id,
        }),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      // Reset messages and set new session
      setMessages([
        {
          id: "1",
          role: "assistant",
          content: data.response,
          timestamp: new Date().toISOString(),
        },
      ])
      setCurrentSessionId(data.sessionId)

      // Reload sessions
      if (user?.id) {
        loadUserSessions()
      }

      toast.success("Nueva sesión iniciada")
    } catch (error) {
      console.error("Error starting new session:", error)
      toast.error("Error al iniciar nueva sesión")
    }
  }

  // Switch to different session
  const switchToSession = async (sessionId: string) => {
    if (sessionId === currentSessionId) return

    await loadConversationHistory(sessionId)
    toast.success("Sesión cambiada")
  }

  // Handle search result click
  const handleSearchResultClick = (sessionId: string, messageId: string) => {
    if (sessionId !== currentSessionId) {
      // Switch to the session first, then scroll to message
      switchToSession(sessionId).then(() => {
        setTimeout(() => scrollToMessage(messageId), 500)
      })
    } else {
      // Just scroll to the message in current session
      scrollToMessage(messageId)
    }
  }

  // Handle voice transcript
  const handleVoiceTranscript = (transcript: string) => {
    setInput(transcript)
    setIsVoiceInput(false)
    // Auto-send voice messages after a short delay
    setTimeout(() => {
      if (transcript.trim()) {
        // Trigger form submission
        const form = document.querySelector("form")
        if (form) {
          form.requestSubmit()
        }
      }
    }, 100)
  }

  const handleVoiceStart = () => {
    setIsVoiceInput(true)
  }

  const handleVoiceEnd = () => {
    setIsVoiceInput(false)
  }

  // Load initial data
  useEffect(() => {
    loadConversationHistory()
    if (user?.id) {
      loadUserSessions()
    }
  }, [user])

  // Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <div className="container mx-auto max-w-4xl p-4 h-screen flex flex-col">
      {/* Header */}
      <Card className="mb-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback>
                  <Bot className="h-5 w-5" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-lg">AI Career Coach</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Tu asistente personalizado para el mercado laboral chileno
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {isDemo && (
                <Badge variant="outline" className="text-xs">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Modo Demo
                </Badge>
              )}

              <SearchDialog
                userId={user?.id || null}
                currentSessionId={currentSessionId}
                onResultClick={handleSearchResultClick}
              />

              <Button variant="outline" size="sm" onClick={startNewSession}>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Sesión
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="flex-1 flex gap-4 min-h-0">
        {/* Sessions Sidebar */}
        {sessions.length > 0 && (
          <Card className="w-64 flex-shrink-0">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <History className="h-4 w-4" />
                Sesiones ({sessions.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ScrollArea className="h-[calc(100vh-300px)]">
                <div className="space-y-1 p-3">
                  {sessions.map((session) => (
                    <div
                      key={session.sessionId}
                      className={`p-2 rounded-lg cursor-pointer transition-colors ${
                        session.sessionId === currentSessionId
                          ? "bg-primary/10 border border-primary/20"
                          : "hover:bg-muted/50"
                      }`}
                      onClick={() => switchToSession(session.sessionId)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <Badge variant="outline" className="text-xs">
                          {session.messageCount} mensajes
                        </Badge>
                        {session.sessionId === currentSessionId && <CheckCircle className="h-3 w-3 text-primary" />}
                      </div>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {format(session.lastMessage, "dd MMM, HH:mm", { locale: es })}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        )}

        {/* Main Chat Area */}
        <Card className="flex-1 flex flex-col min-h-0">
          <CardContent className="flex-1 flex flex-col p-0 min-h-0">
            {/* Messages */}
            <ScrollArea className="flex-1 p-4">
              {isLoadingHistory ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span className="text-sm text-muted-foreground">Cargando conversación...</span>
                </div>
              ) : messages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No hay mensajes aún. ¡Comienza la conversación!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      ref={(el) => {
                        if (el) messageRefs.current[message.id] = el
                      }}
                      className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"} ${
                        highlightedMessageId === message.id
                          ? "bg-yellow-100 dark:bg-yellow-900/20 p-2 rounded-lg transition-colors duration-1000"
                          : ""
                      }`}
                    >
                      {message.role === "assistant" && (
                        <Avatar className="flex-shrink-0">
                          <AvatarFallback>
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}

                      <div
                        className={`max-w-[80%] rounded-lg px-4 py-2 ${
                          message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {format(new Date(message.timestamp), "HH:mm", { locale: es })}
                        </p>
                      </div>

                      {message.role === "user" && (
                        <Avatar className="flex-shrink-0">
                          <AvatarFallback>
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-3 justify-start">
                      <Avatar className="flex-shrink-0">
                        <AvatarFallback>
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <div className="bg-muted rounded-lg px-4 py-2">
                        <div className="flex items-center gap-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm text-muted-foreground">Escribiendo...</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>
              )}
            </ScrollArea>

            <Separator />

            {/* Voice Input Status */}
            {isVoiceInput && (
              <div className="mx-4 mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-blue-700">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <Volume2 className="h-4 w-4" />
                  Escuchando... Habla claramente para enviar tu mensaje
                </div>
              </div>
            )}

            {/* Input Form */}
            <form onSubmit={sendMessage} className="p-4">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={
                    isVoiceInput
                      ? "Escuchando... Habla claramente"
                      : "Escribe tu pregunta sobre desarrollo profesional..."
                  }
                  disabled={isLoading || isVoiceInput}
                  className="flex-1"
                />

                {/* Voice Input Button */}
                <VoiceSearchButton
                  onTranscript={handleVoiceTranscript}
                  onStart={handleVoiceStart}
                  onEnd={handleVoiceEnd}
                  disabled={isLoading}
                />

                <Button type="submit" disabled={!input.trim() || isLoading || isVoiceInput}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>

              <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
                <div className="flex items-center gap-4">
                  <span>Presiona Enter para enviar</span>
                  <div className="flex items-center gap-1">
                    <Mic className="h-3 w-3" />
                    <span>Usa el micrófono para mensajes por voz</span>
                  </div>
                </div>
                {!user && <span className="text-orange-600">Inicia sesión para guardar tu historial</span>}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
