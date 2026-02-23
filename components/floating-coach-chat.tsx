"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, ArrowLeft } from 'lucide-react'
import { getEnhancedSystemPrompt, SUGGESTED_QUESTIONS } from "@/lib/ai/enhanced-prompts"
import { PROMPT_CATEGORIES, type PromptCategoryId } from "@/lib/ai/prompt-categories"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  coach: "sofia" | "dani"
}

interface FloatingCoachChatProps {
  coach: "sofia" | "dani"
  userEmail: string
  onTyping?: (isTyping: boolean) => void
  onMessageReceived?: (message: string) => void
}

export function FloatingCoachChat({ coach, userEmail, onTyping, onMessageReceived }: FloatingCoachChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string>("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
      coach: coach,
    }

    setMessages((prev) => [...prev, userMessage])
    const currentMessage = inputMessage
    setInputMessage("")
    setIsLoading(true)
    
    // Notify parent that AI is typing
    onTyping?.(true)

    try {
      const response = await fetch("/api/brain-query", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: currentMessage,
          conversationHistory: messages.slice(-5).map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.content,
          })),
          userEmail: userEmail,
          testType: "General",
          testResults: {},
          conversationCategory: "general",
          promptVariantId: "",
          promptVersion: "",
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to get AI response")
      }

      const data = await response.json()

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: "ai",
        timestamp: new Date(),
        coach: coach,
      }
      
      setMessages((prev) => [...prev, aiResponse])
      
      // Notify parent of the AI message
      onMessageReceived?.(data.response.substring(0, 50) + (data.response.length > 50 ? "..." : ""))
    } catch (error) {
      console.error("[v0] Error getting AI response:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Lo siento, tuve un problema al procesar tu mensaje. Por favor, intenta de nuevo.",
        sender: "ai",
        timestamp: new Date(),
        coach: coach,
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      onTyping?.(false)
    }
  }

  const coachName = coach === "sofia" ? "Sofía" : "Dani"
  const coachGreeting = coach === "sofia" 
    ? "Hola, soy Sofía. Aquí estoy para ayudarte a entender mejor quién eres y qué quieres lograr."
    : "Hola, soy Dani. Estoy aquí para acompañarte en tu desarrollo profesional."

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center gap-3 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/20 dark:to-blue-950/20">
        <div className="flex-1">
          <h3 className="font-semibold text-sm">{coachName}</h3>
          <p className="text-xs text-muted-foreground">Conversación privada</p>
        </div>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] rounded-lg p-3 ${
                  message.sender === "user" ? "bg-blue-600 text-white" : "bg-muted text-foreground"
                }`}
              >
                <div className="flex items-start gap-2">
                  {message.sender === "ai" && (
                    <Avatar className="h-6 w-6">
                      <AvatarFallback
                        className={
                          message.coach === "sofia"
                            ? "bg-pink-100 text-pink-700 text-xs"
                            : "bg-blue-100 text-blue-700 text-xs"
                        }
                      >
                        {message.coach === "sofia" ? "S" : "D"}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex-1">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                    <p
                      className={`text-xs mt-1 ${message.sender === "user" ? "text-white/70" : "text-muted-foreground"}`}
                    >
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg p-3 max-w-[85%]">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                  <span className="text-xs text-muted-foreground">Pensando...</span>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      {messages.length <= 1 && quickStartQuestions.length > 0 && (
        <div className="p-4 border-t bg-muted/30">
          <p className="text-xs text-muted-foreground mb-2">Preguntas sugeridas:</p>
          <div className="grid grid-cols-1 gap-2">
            {quickStartQuestions.map((question, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => setInputMessage(question)}
                className="text-left justify-start h-auto p-2 text-xs"
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      )}

      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Escribe tu mensaje..."
            className="flex-1 min-h-[60px] max-h-[120px] resize-none text-sm"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSendMessage()
              }
            }}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isLoading}
            size="icon"
            className="self-end"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">Enter para enviar</p>
      </div>
    </div>
  )
}

function getWelcomeMessage(categoryId: PromptCategoryId): string {
  const messages: Record<PromptCategoryId, string> = {
    autoconocimiento: "¡Hola! Estoy aquí para ayudarte a conocerte mejor. ¿En qué puedo ayudarte?",
    desarrollo_habilidades:
      "¡Hola! Puedo ayudarte a desarrollar tus habilidades profesionales. ¿Qué te gustaría mejorar?",
    orientacion_carrera: "¡Hola! Estoy aquí para orientarte en tu carrera. ¿Qué decisión necesitas tomar?",
    autoconocimiento_proposito:
      "¡Hola! Soy Sofía. Te ayudaré a identificar tus fortalezas, intereses y valores. ¿Me cuentas qué te trae por aquí?",
    cv_linkedin_marca:
      "¡Hola! Soy Dani. Puedo ayudarte a mejorar tu CV, LinkedIn y marca personal. ¿Por dónde quieres empezar?",
    entrevistas_comunicacion:
      "¡Hola! Estoy aquí para ayudarte a preparar entrevistas y mejorar tu comunicación profesional. ¿Qué necesitas practicar?",
    crecimiento_salarial:
      "¡Hola! Te ayudaré con tu crecimiento profesional y negociación salarial. ¿Qué objetivo tienes en mente?",
    reinvencion_transicion:
      "¡Hola! Estoy aquí para acompañarte en tu proceso de cambio o transición de carrera. ¿Qué estás considerando?",
  }
  return messages[categoryId] || "¡Hola! ¿En qué puedo ayudarte hoy?"
}
