"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { aiCoach } from "@/lib/ai-coach"
import { Sparkles, Send, Bot, User } from "lucide-react"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface AICoachChatProps {
  userEmail: string
  initialContext?: string
  suggestedQuestions?: string[]
}

export default function AICoachChat({ userEmail, initialContext, suggestedQuestions = [] }: AICoachChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  const defaultSuggestedQuestions = [
    "¿Cómo puedo aprovechar mejor mis fortalezas?",
    "¿Qué roles profesionales me recomiendas?",
    "¿Cómo puedo desarrollar mis áreas débiles?",
    "¿Qué habilidades debería desarrollar?",
    "¿Cómo puedo mejorar mi liderazgo?",
  ]

  const questionsToShow = suggestedQuestions.length > 0 ? suggestedQuestions : defaultSuggestedQuestions

  useEffect(() => {
    if (!isInitialized && userEmail) {
      initializeChat()
      setIsInitialized(true)
    }
  }, [userEmail, isInitialized])

  useEffect(() => {
    // Scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
    }
  }, [messages])

  const initializeChat = async () => {
    const welcomeMessage: Message = {
      role: "assistant",
      content: `¡Hola! Soy tu coach de IA personalizado. He revisado tus resultados de tests y estoy aquí para ayudarte con tu desarrollo profesional y personal.

${initialContext ? `Basándome en tu perfil: ${initialContext}` : ""}

¿En qué te gustaría que te ayude hoy? Puedes preguntarme sobre:
• Interpretación de tus resultados
• Recomendaciones de carrera
• Plan de desarrollo personal
• Estrategias de crecimiento profesional

¡Empecemos!`,
      timestamp: new Date(),
    }

    setMessages([welcomeMessage])
  }

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: Message = {
      role: "user",
      content: content.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputMessage("")
    setIsLoading(true)

    try {
      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))

      const response = await aiCoach.chatWithCoach(userEmail, content, conversationHistory)

      const assistantMessage: Message = {
        role: "assistant",
        content: response.message,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        role: "assistant",
        content: "Lo siento, hubo un error al procesar tu mensaje. Por favor intenta de nuevo.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    sendMessage(question)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(inputMessage)
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          Coach IA Personalizado
        </CardTitle>
        <CardDescription>Tu asistente inteligente para desarrollo profesional y personal</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <ScrollArea className="flex-1 px-4" ref={scrollAreaRef}>
          <div className="space-y-4 pb-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                {message.role === "assistant" && (
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="h-4 w-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user" ? "bg-blue-500 text-white ml-auto" : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                  <div className={`text-xs mt-1 ${message.role === "user" ? "text-blue-100" : "text-gray-500"}`}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>
                {message.role === "user" && (
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="h-4 w-4 text-white" />
                  </div>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="h-4 w-4 text-white" />
                </div>
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-600"></div>
                    <span className="text-sm text-gray-600">Pensando...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Suggested Questions */}
        {messages.length <= 1 && (
          <div className="px-4 py-3 border-t bg-gray-50">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Preguntas sugeridas:</h4>
            <div className="flex flex-wrap gap-2">
              {questionsToShow.slice(0, 4).map((question, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleSuggestedQuestion(question)}
                  className="text-xs h-8"
                  disabled={isLoading}
                >
                  {question}
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="p-4 border-t">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Escribe tu pregunta aquí..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading || !inputMessage.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}
