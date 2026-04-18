"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import {
  Send,
  Bot,
  Lightbulb,
  TrendingUp,
  Target,
  MessageSquare,
  Sparkles,
  Brain,
  ArrowLeft,
  Mic,
  MicOff,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase"
import { CoachingFeedbackDialog } from "@/components/coaching-feedback-dialog"

interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  type?: "suggestion" | "insight" | "question"
  coach?: "sofia" | "dani" // Added coach type to track which personality responded
}

interface Suggestion {
  id: string
  text: string
  category: "career" | "skills" | "development"
  priority: "high" | "medium" | "low"
}

interface Insight {
  id: string
  title: string
  description: string
  category: "personality" | "career" | "skills"
  confidence: number
  actionable: boolean
}

export function PersistentAICoach() {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [suggestions, setSuggestions] = useState<Suggestion[]>([])
  const [insights, setInsights] = useState<Insight[]>([])
  const [activeTab, setActiveTab] = useState("chat")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [userEmail, setUserEmail] = useState<string>("")
  const [performanceContext, setPerformanceContext] = useState<{
    c1_score: number
    c2_score: number
    c3_score: number
    c4_score: number
    test_results_summary?: any
  } | null>(null)

  const [sessionId, setSessionId] = useState<string>("")
  const [showFeedbackDialog, setShowFeedbackDialog] = useState(false)
  const [messageCount, setMessageCount] = useState(0)

  const [isListening, setIsListening] = useState(false)
  const [speechSupported, setSpeechSupported] = useState(false)
  const recognitionRef = useRef<any>(null)
  const isListeningRef = useRef(false)
  const noSpeechRetriesRef = useRef(0)
  const isTogglingRef = useRef(false)
  const maxRetries = 3
  const listeningTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const maxListeningTime = 30000 // 30 segundos máximo

  useEffect(() => {
    const getUserEmail = async () => {
      try {
        const supabase = createClient()

        const {
          data: { session },
        } = await supabase.auth.getSession()
        if (session?.user?.email) {
          console.log("[v0] User email from session:", session.user.email)
          setUserEmail(session.user.email)

          await loadPerformanceContext(session.user.id)
        } else {
          console.log("[v0] No user session found")
        }
      } catch (error) {
        console.log("[v0] Could not fetch user email:", error)
      }
    }
    getUserEmail()

    setSessionId(`session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`)

    const welcomeMessage: Message = {
      id: "1",
      content:
        "¡Hola! Soy tu Coach de Carrera IA. Estoy aquí para ayudarte con orientación de carrera, desarrollo de habilidades y crecimiento profesional. Puedo analizar tus resultados de evaluación, proporcionar recomendaciones personalizadas y ayudarte a crear planes de acción. ¿En qué puedo asistirte hoy?",
      sender: "ai",
      timestamp: new Date(),
      type: "question",
    }
    setMessages([welcomeMessage])

    const initialSuggestions: Suggestion[] = [
      {
        id: "init_1",
        text: "¿Cómo puedo avanzar en mi rol actual?",
        category: "career",
        priority: "high",
      },
      {
        id: "init_2",
        text: "¿Qué habilidades debería desarrollar a continuación?",
        category: "skills",
        priority: "high",
      },
      {
        id: "init_3",
        text: "Ayúdame a entender mis resultados de evaluación",
        category: "development",
        priority: "medium",
      },
      {
        id: "init_4",
        text: "¿Cómo puedo mejorar mis habilidades de liderazgo?",
        category: "career",
        priority: "medium",
      },
    ]
    setSuggestions(initialSuggestions)

    setInsights([
      {
        id: "1",
        title: "Fuerte Pensamiento Analítico",
        description:
          "Basado en tus resultados de evaluación, demuestras excelentes capacidades de análisis y resolución de problemas. Esta es una valiosa asset en roles de liderazgo y posiciones estratégicas.",
        category: "personality",
        confidence: 92,
        actionable: true,
      },
      {
        id: "2",
        title: "Potencial de Liderazgo",
        description:
          "Tu estilo de comunicación y toma de decisiones sugieren fuerte potencial de liderazgo. Considera buscar oportunidades para liderar proyectos o mentorizar a colegas más jóvenes.",
        category: "career",
        confidence: 87,
        actionable: true,
      },
      {
        id: "3",
        title: "Estilo de Trabajo Colaborativo",
        description:
          "Demuestras una preferencia por entornos colaborativos y resolución de problemas en equipo. Esto te hace bien adaptado para roles interfuncionales y liderazgo de equipos.",
        category: "skills",
        confidence: 89,
        actionable: true,
      },
      {
        id: "4",
        title: "Mente Abierta al Crecimiento",
        description:
          "Tus respuestas indican una fuerte mente abierta al crecimiento y disposición para aprender. Esto es crucial para el avance de la carrera y adaptarse a los demandas cambiantes del mercado laboral.",
        category: "personality",
        confidence: 94,
        actionable: false,
      },
    ])
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  useEffect(() => {
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition) {
        setSpeechSupported(true)
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = true
        recognition.lang = "es-ES"
        recognition.maxAlternatives = 1

        recognition.onstart = () => {
          console.log("[v0] Speech recognition started")
          noSpeechRetriesRef.current = 0

          listeningTimeoutRef.current = setTimeout(() => {
            console.log("[v0] Max listening time reached, stopping")
            if (recognitionRef.current && isListeningRef.current) {
              isListeningRef.current = false
              setIsListening(false)
              recognitionRef.current.stop()
            }
          }, maxListeningTime)
        }

        recognition.onresult = (event: any) => {
          console.log("[v0] Speech recognition result received")
          const transcript = Array.from(event.results)
            .map((result: any) => result[0])
            .map((result) => result.transcript)
            .join("")

          console.log("[v0] Transcript:", transcript)
          setInputMessage(transcript)

          if (event.results[event.results.length - 1].isFinal) {
            console.log("[v0] Final result received, stopping")
            isListeningRef.current = false
            setIsListening(false)
            if (listeningTimeoutRef.current) {
              clearTimeout(listeningTimeoutRef.current)
            }
          }
        }

        recognition.onerror = (event: any) => {
          console.log("[v0] Speech recognition error:", event.error)

          if (event.error === "no-speech") {
            console.log("[v0] No speech detected, retry count:", noSpeechRetriesRef.current)
            console.log("[v0] Is listening ref:", isListeningRef.current)

            if (noSpeechRetriesRef.current < maxRetries && isListeningRef.current) {
              noSpeechRetriesRef.current++
              console.log("[v0] Retrying... attempt", noSpeechRetriesRef.current)

              setTimeout(() => {
                if (isListeningRef.current && recognitionRef.current) {
                  try {
                    console.log("[v0] Restarting recognition")
                    recognitionRef.current.start()
                  } catch (e) {
                    console.log("[v0] Error restarting:", e)
                    isListeningRef.current = false
                    setIsListening(false)
                  }
                }
              }, 100)
              return
            } else {
              console.log("[v0] Max retries reached or not listening, stopping")
            }
          } else if (event.error === "aborted") {
            console.log("[v0] Recognition aborted by user")
          } else {
            console.error("[v0] Speech recognition error:", event.error)
          }

          isListeningRef.current = false
          setIsListening(false)
          if (listeningTimeoutRef.current) {
            clearTimeout(listeningTimeoutRef.current)
          }
        }

        recognition.onend = () => {
          console.log("[v0] Speech recognition ended")
          console.log("[v0] Retry count:", noSpeechRetriesRef.current)
          console.log("[v0] Is listening ref:", isListeningRef.current)

          if (noSpeechRetriesRef.current >= maxRetries || !isListeningRef.current) {
            console.log("[v0] Cleaning up listening state")
            isListeningRef.current = false
            setIsListening(false)
            if (listeningTimeoutRef.current) {
              clearTimeout(listeningTimeoutRef.current)
            }
          }
        }

        recognitionRef.current = recognition
      }
    }

    return () => {
      if (listeningTimeoutRef.current) {
        clearTimeout(listeningTimeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    const userMessages = messages.filter((m) => m.sender === "user").length
    setMessageCount(userMessages)

    if (userMessages >= 2 && !showFeedbackDialog) {
      const timer = setTimeout(() => {
        setShowFeedbackDialog(true)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [messages])

  useEffect(() => {
    if (!userEmail) return

    const loadCoachHistory = async () => {
      try {
        const response = await fetch("/api/coach-conversation/load", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userEmail }),
        })
        const data = await response.json()
        if (data.suggestions) {
          setSuggestions(data.suggestions)
        }
      } catch (error) {
        console.error("[v0] Error loading coach history:", error)
      }
    }

    loadCoachHistory()
  }, [userEmail])

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
      console.log("[v0] Sending message:", currentMessage)
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
          userEmail: userEmail || undefined,
          performanceContext,
        }),
      })

      if (!response.ok) {
        console.log("[v0] API response not OK:", response.status)
        throw new Error(`Failed to get AI response: ${response.status}`)
      }

      const data = await response.json()
      console.log("[v0] API Response received:", {
        hasResponse: !!data.response,
        hasSuggestions: !!data.suggestions,
        suggestionsCount: data.suggestions?.length || 0,
        suggestionsContent: data.suggestions,
      })

      const aiResponse: Message = {
        id: Date.now().toString(),
        content: data.response || "Lo siento, no pude generar una respuesta.",
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])

      // Update suggestions if provided
      if (data.suggestions && Array.isArray(data.suggestions) && data.suggestions.length > 0) {
        const dynamicSuggestions: Suggestion[] = data.suggestions.map((text: string, index: number) => ({
          id: `dynamic_${Date.now()}_${index}`,
          text,
          category: determineSuggestionCategory(text),
          priority: determinePriority(text, index),
        }))
        setSuggestions(dynamicSuggestions)
        console.log("[v0] Suggestions updated:", dynamicSuggestions.length)

        await fetch("/api/coach-conversation/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userEmail,
            sessionId,
            message: currentMessage,
            aiResponse: data.response,
            suggestions: dynamicSuggestions,
          }),
        }).catch((err) => console.error("[v0] Error saving conversation:", err))
      } else {
        console.log("[v0] No valid suggestions in response")
      }
    } catch (error) {
      console.error("[v0] Error sending message:", error)
      const errorResponse: Message = {
        id: Date.now().toString(),
        content:
          "Disculpa, hubo un error al procesar tu mensaje. Por favor intenta de nuevo. Error: " +
          (error instanceof Error ? error.message : "Unknown error"),
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorResponse])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (suggestion: Suggestion) => {
    const message: Message = {
      id: Date.now().toString(),
      content: `Dime más sobre: ${suggestion.text}`,
      sender: "user",
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, message])
    setActiveTab("chat")

    setIsLoading(true)
    fetch("/api/brain-query", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: `Dime más sobre: ${suggestion.text}`,
        conversationHistory: messages.slice(-5).map((m) => ({
          role: m.sender === "user" ? "user" : "assistant",
          content: m.content,
        })),
        userEmail: userEmail || undefined,
        performanceContext,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: data.response,
          sender: "ai",
          timestamp: new Date(),
          coach: data.coach,
        }
        setMessages((prev) => [...prev, aiResponse])
      })
      .catch((error) => {
        console.error("[v0] Error getting suggestion response:", error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/20"
      case "medium":
        return "bg-muted text-mutedForeground border-border"
      case "low":
        return "bg-secondary text-secondaryForeground border-border"
      default:
        return "bg-muted text-mutedForeground border-border"
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "career":
        return Target
      case "skills":
        return TrendingUp
      case "development":
        return Lightbulb
      case "personality":
        return Brain
      default:
        return MessageSquare
    }
  }

  const quickStartQuestions = [
    "¿Cómo puedo avanzar en mi rol actual?",
    "¿Qué habilidades debería desarrollar a continuación?",
    "Ayúdame a entender mis resultados de evaluación",
    "¿Cómo puedo mejorar mis habilidades de liderazgo?",
    "¿Qué carreras se ajustan a mi personalidad?",
    "¿Cómo construyo una red profesional?",
  ]

  const toggleListening = () => {
    if (!recognitionRef.current) return

    if (isTogglingRef.current) {
      console.log("[v0] Toggle already in progress, ignoring")
      return
    }

    isTogglingRef.current = true

    if (isListening) {
      console.log("[v0] Stopping recognition manually")
      isListeningRef.current = false
      noSpeechRetriesRef.current = maxRetries
      setIsListening(false)
      recognitionRef.current.stop()
      if (listeningTimeoutRef.current) {
        clearTimeout(listeningTimeoutRef.current)
      }
      setTimeout(() => {
        isTogglingRef.current = false
      }, 300)
    } else {
      console.log("[v0] Starting recognition")
      noSpeechRetriesRef.current = 0
      isListeningRef.current = true
      setIsListening(true)
      try {
        recognitionRef.current.start()
        setTimeout(() => {
          isTogglingRef.current = false
        }, 300)
      } catch (e) {
        console.error("[v0] Error starting recognition:", e)
        isListeningRef.current = false
        setIsListening(false)
        isTogglingRef.current = false
      }
    }
  }

  const determineSuggestionCategory = (text: string): "career" | "skills" | "development" => {
    const lower = text.toLowerCase()
    if (lower.includes("habilidad") || lower.includes("skill")) return "skills"
    if (lower.includes("carrera") || lower.includes("profesional")) return "career"
    return "development"
  }

  const determinePriority = (text: string, index: number): "high" | "medium" | "low" => {
    if (index === 0) return "high"
    if (index === 1) return "medium"
    return "low"
  }

  const loadPerformanceContext = async (userId: string) => {
    try {
      const supabase = createClient()
      const { data, error } = await supabase.from("user_performance_context").select("*").eq("user_id", userId).single()

      if (error && error.code !== "PGRST116") {
        console.error("[v0] Error loading performance context:", error)
        return
      }

      if (data) {
        console.log("[v0] Performance context loaded:", data)
        setPerformanceContext({
          c1_score: data.c1_score || 0,
          c2_score: data.c2_score || 0,
          c3_score: data.c3_score || 0,
          c4_score: data.c4_score || 0,
          test_results_summary: data.test_results_summary,
        })
      }
    } catch (error) {
      console.error("[v0] Error in loadPerformanceContext:", error)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button variant="outline" onClick={() => router.push("/")} className="border-border hover:bg-muted">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Inicio
          </Button>
          <Badge variant="secondary" className="bg-muted text-mutedForeground">
            <Bot className="h-3 w-3 mr-1" />
            Potenciado por IA
          </Badge>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Coach de Carrera IA</h1>
        <p className="text-mutedForeground">
          Obtén orientación profesional personalizada, insights y recomendaciones accionables basadas en tu perfil único
          y resultados de evaluación.
        </p>
      </div>

      {messages.length <= 1 && (
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 rounded-[28px] border border-blue/20 dark:border-blue">
          <h2 className="text-xl font-semibold text-foreground mb-2">¿Eres nuevo aquí? Te mostramos cómo funciona</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Tu Coach de Carrera IA está diseñado para apoyarte en tres formas:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {/* Chat Tab Guide */}
            <div className="bg-transparent rounded-[28px] p-4 border border-blue/20 dark:border-blue">
              <div className="flex items-start gap-3 mb-2">
                <MessageSquare className="h-5 w-5 text-blue dark:text-blue/40 flex-shrink-0 mt-0.5" />
                <h3 className="font-semibold text-foreground">💬 Chat Personalizado</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Haz preguntas sobre tu carrera, desarrollo de habilidades, próximos pasos o cualquier aspecto
                profesional que te interese explorar.
              </p>
            </div>

            {/* Suggestions Guide */}
            <div className="bg-transparent rounded-[28px] p-4 border border-green/20 dark:border-green">
              <div className="flex items-start gap-3 mb-2">
                <Lightbulb className="h-5 w-5 text-green dark:text-green/40 flex-shrink-0 mt-0.5" />
                <h3 className="font-semibold text-foreground">💡 Sugerencias</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Recomendaciones personalizadas basadas en tus resultados de evaluación, diseñadas para acelerar tu
                crecimiento profesional.
              </p>
            </div>

            {/* Insights Guide */}
            <div className="bg-transparent rounded-[28px] p-4 border border-purple/20 dark:border-purple">
              <div className="flex items-start gap-3 mb-2">
                <Sparkles className="h-5 w-5 text-purple dark:text-purple/40 flex-shrink-0 mt-0.5" />
                <h3 className="font-semibold text-foreground">✨ Insights</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Análisis profundos de tu perfil, fortalezas clave y oportunidades de desarrollo identificadas por IA.
              </p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground font-medium">
            👇 Elige una pregunta abajo para comenzar o escribe la tuya propia
          </p>
        </div>
      )}

      {performanceContext && (
        <div className="bg-transparent border-b border-muted/70 px-4 py-3">
          <div className="flex items-center gap-4 text-sm">
            <span className="text-muted/40">Tu Contexto de Performance:</span>
            <div className="flex gap-3">
              <div className="flex items-center gap-1">
                <span className="text-muted/50">C1:</span>
                <span className="font-semibold text-blue/40">{performanceContext.c1_score.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-muted/50">C2:</span>
                <span className="font-semibold text-green/40">{performanceContext.c2_score.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-muted/50">C3:</span>
                <span className="font-semibold text-purple/40">{performanceContext.c3_score.toFixed(1)}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-muted/50">C4:</span>
                <span className="font-semibold text-orange/40">{performanceContext.c4_score.toFixed(1)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-muted">
          <TabsTrigger value="chat" className="data-[state=active]:bg-background">
            <MessageSquare className="h-4 w-4 mr-2" />
            Chat ({messages.length})
          </TabsTrigger>
          <TabsTrigger value="suggestions" className="data-[state=active]:bg-background">
            <Lightbulb className="h-4 w-4 mr-2" />
            Sugerencias ({suggestions.length})
          </TabsTrigger>
          <TabsTrigger value="insights" className="data-[state=active]:bg-background">
            <Sparkles className="h-4 w-4 mr-2" />
            Insights ({insights.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="mt-6">
          <Card className="border-border bg-card flex flex-col max-h-[90vh]">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <Bot className="h-5 w-5 mr-2" />
                Sesión de Coaching de Carrera
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col overflow-hidden px-6">
              <ScrollArea className="flex-1 mb-4 pr-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          message.sender === "user"
                            ? "bg-foreground text-background rounded-br-none"
                            : "bg-muted text-foreground rounded-bl-none"
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>
                <div ref={messagesEndRef} />
              </ScrollArea>

              <div className="space-y-4 mt-4 border-t border-border">
                <div className="flex space-x-2">
                  <Textarea
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Pregúntame sobre tu carrera, habilidades o desarrollo profesional..."
                    className="flex-1 min-h-[60px] resize-none border-border focus:border-foreground"
                    onKeyPress={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                  <div className="flex flex-col gap-2">
                    {speechSupported && (
                      <Button
                        onClick={toggleListening}
                        disabled={isLoading || isTogglingRef.current}
                        variant={isListening ? "destructive" : "outline"}
                        className={isListening ? "animate-pulse" : ""}
                        title={isListening ? "Detener grabación" : "Iniciar grabación de voz"}
                      >
                        {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                      </Button>
                    )}
                    <Button
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() || isLoading}
                      className="bg-foreground text-background hover:bg-foreground/90"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-mutedForeground">
                  <span>Presiona Enter para enviar, Shift+Enter para nueva línea</span>
                  {speechSupported && (
                    <span className="flex items-center gap-1">
                      <Mic className="h-3 w-3" />
                      {isListening ? (
                        <span className="text-destructive font-medium">Escuchando... (haz clic para detener)</span>
                      ) : (
                        "Haz clic en el micrófono para hablar"
                      )}
                    </span>
                  )}
                </div>

                {(suggestions.length > 0 || messages.length <= 1) && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <p className="text-xs text-mutedForeground font-medium mb-3">💡 Preguntas sugeridas:</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {(suggestions.length > 0 ? suggestions : quickStartQuestions.map((q) => ({ text: q }))).map(
                        (suggestion, index) => (
                          <button
                            key={index}
                            onClick={() => {
                              setInputMessage((suggestion as any).text || suggestion)
                              setActiveTab("chat")
                            }}
                            className="text-left p-3 rounded-[28px] border border-border hover:border-foreground hover:bg-muted/50 transition-all text-sm text-foreground hover:text-foreground cursor-pointer group"
                          >
                            <p className="line-clamp-2 group-hover:text-foreground font-medium">
                              {(suggestion as any).text || suggestion}
                            </p>
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="suggestions" className="mt-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <Lightbulb className="h-5 w-5 mr-2" />
                Sugerencias Personalizadas
              </CardTitle>
              <p className="text-sm text-mutedForeground mt-2">
                Recomendaciones generadas por IA basadas en tus resultados de evaluación y perfil de carrera
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {suggestions.map((suggestion) => {
                  const IconComponent = getCategoryIcon(suggestion.category)
                  return (
                    <div
                      key={suggestion.id}
                      className="border border-border rounded-[28px] p-4 hover:bg-muted/50 transition-colors cursor-pointer"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3 flex-1">
                          <IconComponent className="h-5 w-5 text-foreground mt-0.5" />
                          <div className="flex-1">
                            <p className="text-foreground font-medium mb-2">{suggestion.text}</p>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary" className="bg-muted text-mutedForeground">
                                {suggestion.category}
                              </Badge>
                              <Badge className={getPriorityColor(suggestion.priority)}>
                                {suggestion.priority} prioridad
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-border hover:bg-muted ml-4 bg-transparent"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSuggestionClick(suggestion)
                          }}
                        >
                          Discutir
                        </Button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="mt-6">
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center text-foreground">
                <Sparkles className="h-5 w-5 mr-2" />
                Insights Generados por IA
              </CardTitle>
              <p className="text-sm text-mutedForeground mt-2">
                Análisis profundo de tus resultados de evaluación y perfil profesional
              </p>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {insights.map((insight) => {
                  const IconComponent = getCategoryIcon(insight.category)
                  return (
                    <div
                      key={insight.id}
                      className="border border-border rounded-[28px] p-6 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-start space-x-4">
                        <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                          <IconComponent className="h-5 w-5 text-foreground" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-foreground text-lg">{insight.title}</h3>
                            <div className="flex items-center space-x-2">
                              <Badge variant="secondary" className="bg-muted text-mutedForeground">
                                {insight.category}
                              </Badge>
                              {insight.actionable && (
                                <Badge className="bg-foreground/10 text-foreground border-foreground/20">
                                  Accionable
                                </Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-mutedForeground mb-4 leading-relaxed">{insight.description}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <span className="text-sm text-mutedForeground">Confianza:</span>
                              <Progress value={insight.confidence} className="w-24 h-2" />
                              <span className="text-sm font-medium text-foreground">{insight.confidence}%</span>
                            </div>
                            {insight.actionable && (
                              <Button
                                size="sm"
                                onClick={() => {
                                  const message = `¿Cómo puedo aprovechar mi ${insight.title.toLowerCase()} para el crecimiento de mi carrera?`
                                  setInputMessage(message)
                                  setActiveTab("chat")
                                }}
                                className="bg-foreground text-background hover:bg-foreground/90"
                              >
                                Crear Plan de Acción
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <CoachingFeedbackDialog
        open={showFeedbackDialog}
        onOpenChange={setShowFeedbackDialog}
        sessionId={sessionId}
        messageCount={messageCount}
        coachType="hybrid"
        conversationCategory="autoconocimiento"
      />
    </div>
  )
}

export default PersistentAICoach
