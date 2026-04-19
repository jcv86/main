"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Send, Save, Star, Mic, MicOff } from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
  coach?: string // Add coach info to message
  coachName?: string
}

interface AiCoachChatProps {
  context?: any
  userId?: string
}

export function AiCoachChat({ context, userId = "demo-user" }: AiCoachChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [rating, setRating] = useState<number | null>(null)
  const [currentCoach, setCurrentCoach] = useState<string | null>(null)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const [isListening, setIsListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const recognitionRef = useRef<any>(null)

  // Initial welcome message
  useEffect(() => {
    const welcomeMessage: Message = {
      id: "welcome",
      role: "assistant",
      content:
        "¡Hola! Soy tu Coach IA personal. Estoy aquí para ayudarte a desarrollar tus habilidades blandas y avanzar en tu carrera profesional. ¿En qué puedo ayudarte hoy?",
      timestamp: new Date().toISOString(),
    }
    setMessages([welcomeMessage])
  }, [])

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

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

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

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date().toISOString(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/brain-query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input.trim(),
          userId,
          conversationId,
          context,
        }),
      })

      const data = await response.json()

      console.log("[v0] Response from API:", data)

      if (data.response) {
        if (data.coachUsed) {
          setCurrentCoach(data.coachUsed)
        }

        setMessages((prev) => [...prev, data.response])
        if (data.conversationId && !conversationId) {
          setConversationId(data.conversationId)
        }
      }
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Lo siento, hubo un error al procesar tu mensaje. Por favor, intenta de nuevo.",
        timestamp: new Date().toISOString(),
      }
      setMessages((prev) => [...prev, errorMessage])
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

  const rateConversation = async (newRating: number) => {
    if (!conversationId) return

    setRating(newRating)

    try {
      await fetch("/api/brain-query", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId,
          action: "rate",
          rating: newRating,
          userId,
        }),
      })
    } catch (error) {
      console.error("Error rating conversation:", error)
    }
  }

  const saveConversation = async () => {
    if (!conversationId) return

    try {
      await fetch("/api/brain-query", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          conversationId,
          action: "save",
          userId,
        }),
      })
    } catch (error) {
      console.error("Error saving conversation:", error)
    }
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Coach IA Personal</CardTitle>
          <div className="flex items-center gap-2">
            {currentCoach && (
              <Badge variant="outline" className="text-xs">
                {currentCoach === "sofia" ? "🌟 Sofia" : "🎯 Dani"}
              </Badge>
            )}
            <Badge variant="secondary" className="text-xs">
              En línea
            </Badge>
            {conversationId && (
              <Button variant="ghost" size="sm" onClick={saveConversation} className="h-8 w-8 p-0">
                <Save className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
          <div className="space-y-4 pb-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg px-3 py-2 ${`}
                    message.role === "user" ? "bg-blue/50 text-white" : "bg-muted/10 text-foreground"
                  }`}
                >
                  {message.role === "assistant" && message.coachName && (
                    <p className="text-xs font-semibold mb-1 text-blue">
                      {message.coachName === "Sofia" ? "🌟 Sofia" : "🎯 Dani"}
                    </p>
                  )}
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  <p className="text-xs opacity-70 mt-1">{new Date(message.timestamp).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted/10 rounded-lg px-3 py-2">
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-muted/40 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-muted/40 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-muted/40 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Rating Section */}
        {messages.length > 2 && conversationId && (
          <div className="px-4 py-2 border-t bg-muted/5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted/60">¿Qué te pareció esta conversación?</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => rateConversation(star)}
                    className={`p-1 ${
                      rating && rating >= star ? "text-yellow/40" : "text-muted/30"
                    }`}
                  >
                    <Star className="h-4 w-4 fill-current" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="p-4 border-t">
          <div className="flex items-center space-x-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Escribe tu pregunta o usa el micrófono..."
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
            <Button onClick={sendMessage} disabled={!input.trim() || isLoading} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center justify-between mt-2">
            <p className="text-xs text-muted/50">Presiona Enter para enviar, Shift+Enter para nueva línea</p>
            {speechSupported && (
              <p className="text-xs text-muted/50 flex items-center gap-1">
                <Mic className="h-3 w-3" />
                {isListening ? "Escuchando..." : "Click para hablar"}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default AiCoachChat
