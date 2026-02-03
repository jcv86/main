"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Send, Sparkles, Lightbulb, Target } from "lucide-react"
import { CoachingFeedbackDialog } from "@/components/coaching-feedback-dialog"
import { getPromptForUser, trackPromptUsage } from "@/lib/ai/prompts"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  coach?: "sofia" | "dani"
}

interface SofiaDaniCoachProps {
  userEmail: string
  testType: "A1" | "A2" | "A3" | "A4" | "A3-Interview" | "A4-Market"
  testResults: any
  conversationCategory: "autoconocimiento" | "desarrollo_habilidades" | "orientacion_carrera"
}

export function SofiaDaniCoach({ userEmail, testType, testResults, conversationCategory }: SofiaDaniCoachProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState<string>("")
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false)
  const [messageCount, setMessageCount] = useState(0)
  const [promptVariantId, setPromptVariantId] = useState<string>("")
  const [promptVersion, setPromptVersion] = useState<string>("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSessionId(crypto.randomUUID())

    const initializeCoach = async () => {
      const coachType = conversationCategory === "autoconocimiento" ? "sofia" : "dani"
      const promptData = await getPromptForUser(userEmail, coachType, conversationCategory)

      setPromptVariantId(promptData.variantId)
      setPromptVersion(promptData.version)

      console.log("[v0] Using prompt variant:", promptData.version, "for", coachType)

      // Determine welcome message based on category
      const getWelcomeMessage = () => {
        if (conversationCategory === "autoconocimiento") {
          return {
            coach: "sofia" as const,
            content: `¡Hola! Soy Sofía, tu coach de autoconocimiento. He analizado tus resultados del test ${testType} y estoy aquí para ayudarte a entender mejor tu perfil. ¿Qué te gustaría explorar sobre ti mismo?`,
          }
        } else if (conversationCategory === "desarrollo_habilidades") {
          return {
            coach: "dani" as const,
            content: `¡Hola! Soy Dani, tu coach de desarrollo de habilidades. Basándome en tus resultados del test ${testType}, puedo ayudarte a identificar y desarrollar las habilidades clave para tu crecimiento profesional. ¿En qué área te gustaría enfocarte?`,
          }
        } else {
          return {
            coach: "dani" as const,
            content: `¡Hola! Soy Dani, tu coach de orientación de carrera. He revisado tus resultados del test ${testType} y puedo ayudarte a explorar opciones de carrera que se alineen con tu perfil. ¿Qué aspectos de tu carrera te gustaría discutir?`,
          }
        }
      }

      const welcomeMsg = getWelcomeMessage()
      const welcomeMessage: Message = {
        id: "1",
        content: welcomeMsg.content,
        sender: "ai",
        timestamp: new Date(),
        coach: welcomeMsg.coach,
      }
      setMessages([welcomeMessage])
    }

    initializeCoach()
  }, [testType, conversationCategory, userEmail])

  useEffect(() => {
    if (sessionId && promptVariantId && userEmail) {
      trackPromptUsage(sessionId, promptVariantId, userEmail)
    }
  }, [sessionId, promptVariantId, userEmail])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    const userMessages = messages.filter((m) => m.sender === "user").length
    setMessageCount(userMessages)

    if (userMessages >= 2 && !showFeedbackDialog) {
      const timer = setTimeout(() => {
        setShowFeedbackDialog(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [messages, showFeedbackDialog])

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    const currentMessage = inputMessage
    setInputMessage("")
    setIsLoading(true)

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
          testType: testType,
          testResults: testResults,
          conversationCategory: conversationCategory,
          promptVariantId: promptVariantId,
          promptVersion: promptVersion,
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
        coach: data.coach || (conversationCategory === "autoconocimiento" ? "sofia" : "dani"),
      }
      setMessages((prev) => [...prev, aiResponse])
    } catch (error) {
      console.error("[v0] Error getting AI response:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Lo siento, tuve un problema al procesar tu mensaje. Por favor, intenta de nuevo.",
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const getQuickStartQuestions = () => {
    if (conversationCategory === "autoconocimiento") {
      return [
        "¿Qué dicen mis resultados sobre mi personalidad?",
        "¿Cuáles son mis principales fortalezas?",
        "¿Qué áreas debería desarrollar?",
        "¿Cómo puedo aprovechar mejor mi perfil?",
      ]
    } else if (conversationCategory === "desarrollo_habilidades") {
      return [
        "¿Qué habilidades debería priorizar?",
        "¿Cómo puedo mejorar mis puntos débiles?",
        "¿Qué recursos me recomiendas para crecer?",
        "¿Cómo aplico esto en mi trabajo diario?",
      ]
    } else {
      return [
        "¿Qué carreras se ajustan a mi perfil?",
        "¿Cómo puedo avanzar en mi carrera actual?",
        "¿Qué roles profesionales me convienen?",
        "¿Cómo puedo hacer una transición de carrera?",
      ]
    }
  }

  const quickStartQuestions = getQuickStartQuestions()

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-600" />
            Coach Personalizado con IA
          </CardTitle>
          <CardDescription>
            {conversationCategory === "autoconocimiento"
              ? "Sofía te ayuda a entender tu perfil y fortalezas"
              : "Dani te guía en tu desarrollo profesional"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-96 mb-4 pr-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[80%] rounded-lg p-4 ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-900 border border-gray-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {message.sender === "ai" && (
                        <div className="flex flex-col items-center gap-1">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback
                              className={
                                message.coach === "sofia" ? "bg-pink-100 text-pink-700" : "bg-blue-100 text-blue-700"
                              }
                            >
                              {message.coach === "sofia" ? "S" : "D"}
                            </AvatarFallback>
                          </Avatar>
                          <Badge
                            variant="secondary"
                            className={`text-[10px] px-1 py-0 ${
                              message.coach === "sofia" ? "bg-pink-100 text-pink-700" : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {message.coach === "sofia" ? "Sofía" : "Dani"}
                          </Badge>
                        </div>
                      )}
                      <div className="flex-1">
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                        <p className={`text-xs mt-2 ${message.sender === "user" ? "text-white/70" : "text-gray-500"}`}>
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 border border-gray-200 rounded-lg p-4 max-w-[80%]">
                    <div className="flex items-center gap-3">
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
                      <span className="text-sm text-gray-600">Pensando...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div ref={messagesEndRef} />
          </ScrollArea>

          {messages.length <= 1 && (
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-3">Preguntas sugeridas:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {quickStartQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => setInputMessage(question)}
                    className="text-left justify-start h-auto p-3"
                  >
                    {conversationCategory === "autoconocimiento" ? (
                      <Lightbulb className="h-3 w-3 mr-2 flex-shrink-0 text-pink-600" />
                    ) : (
                      <Target className="h-3 w-3 mr-2 flex-shrink-0 text-blue-600" />
                    )}
                    <span className="text-xs">{question}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="Escribe tu pregunta..."
              className="flex-1 min-h-[60px] resize-none"
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage()
                }
              }}
            />
            <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isLoading} className="self-end">
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-2">Presiona Enter para enviar, Shift+Enter para nueva línea</p>
        </CardContent>
      </Card>

      <CoachingFeedbackDialog
        open={showFeedbackDialog}
        onOpenChange={setShowFeedbackDialog}
        sessionId={sessionId}
        userEmail={userEmail}
        messageCount={messageCount}
        coachType={conversationCategory === "autoconocimiento" ? "sofia" : "dani"}
        conversationCategory={conversationCategory}
        suggestedAction={`Completa el test ${testType} para conocer tu estilo de ${conversationCategory === "autoconocimiento" ? "personalidad" : "trabajo"}`}
        conversationSummary={messages
          .slice(-4)
          .map(
            (m) =>
              `${m.sender === "user" ? "Usuario" : m.coach === "sofia" ? "Sofía" : "Dani"}: ${m.content.substring(0, 100)}...`,
          )
          .join("\n")}
      />
    </div>
  )
}

export default SofiaDaniCoach
