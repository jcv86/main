"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/hooks/use-user"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Bot,
  Brain,
  Lightbulb,
  Target,
  BookOpen,
  MessageCircle,
  Sparkles,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  Mic,
  Volume2,
} from "lucide-react"

interface ReadingInsight {
  id: string
  type: "summary" | "question" | "connection" | "application"
  title: string
  content: string
  book_title: string
  confidence: number
  created_at: string
}

interface StudyPlan {
  id: string
  book_title: string
  total_sessions: number
  completed_sessions: number
  current_session: {
    title: string
    objectives: string[]
    estimated_time: number
    key_concepts: string[]
  }
  next_session: {
    title: string
    preview: string
  }
}

interface PersonalizedRecommendation {
  book_id: number
  title: string
  author: string
  reason: string
  match_score: number
  category: string
}

export default function AIReadingCompanion() {
  const [insights, setInsights] = useState<ReadingInsight[]>([])
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([])
  const [recommendations, setRecommendations] = useState<PersonalizedRecommendation[]>([])
  const [chatMessages, setChatMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([])
  const [currentMessage, setCurrentMessage] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [selectedBook, setSelectedBook] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState("")
  
  const { user } = useUser()

  useEffect(() => {
    loadAICompanionData()
  }, [])

  const loadAICompanionData = async () => {
    try {
      setLoading(true)

      // Get current user email
      if (user?.email) {
        setUserEmail(user.email)
      } else {
        setLoading(false)
        return
      }

      const { data: insightsData } = await fetch("/api/reading-insights", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).then(res => res.json())

      if (insightsData) {
        setInsights(insightsData)
      }

      const { data: plansData } = await fetch("/api/study-plans", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).then(res => res.json())

      if (plansData) {
        setStudyPlans(plansData)
      }

      const { data: recsData } = await fetch("/api/book-recommendations", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      }).then(res => res.json())

      if (recsData) {
        setRecommendations(recsData)
      }

      // Initialize chat with welcome message
      setChatMessages([
        {
          role: "assistant",
          content:
            "¡Hola! Soy tu compañero de lectura con IA. Puedo ayudarte a comprender mejor tus libros, generar resúmenes, responder preguntas y crear planes de estudio personalizados. ¿En qué libro estás trabajando actualmente?",
        },
      ])
    } catch (error) {
      console.error("Error loading AI companion data:", error)
    } finally {
      setLoading(false)
    }
  }

  const sendMessage = async () => {
    if (!currentMessage.trim()) return

    const userMessage = currentMessage
    setCurrentMessage("")
    setChatMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsGenerating(true)

    try {
      const response = await fetch("/api/ai/reading-companion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userMessage,
          userEmail,
        }),
      })

      if (!response.ok) throw new Error("Failed to get response")

      const { text } = await response.json()

      setChatMessages((prev) => [...prev, { role: "assistant", content: text }])
    } catch (error) {
      console.error("Error generating response:", error)
      setChatMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Lo siento, hubo un error al procesar tu mensaje. Por favor, inténtalo de nuevo.",
        },
      ])
    } finally {
      setIsGenerating(false)
    }
  }

  const generateInsight = async (type: string) => {
    if (!selectedBook) return

    setIsGenerating(true)
    try {
      const prompts = {
        summary: `Genera un resumen inteligente y conciso del libro "${selectedBook}" enfocándote en los conceptos más importantes y aplicables.`,
        question: `Crea una pregunta de reflexión profunda sobre "${selectedBook}" que ayude al lector a aplicar los conceptos en su vida profesional.`,
        connection: `Identifica conexiones entre "${selectedBook}" y otros libros de desarrollo profesional o personal que puedan enriquecer la comprensión.`,
        application: `Sugiere una aplicación práctica específica de los conceptos de "${selectedBook}" que se pueda implementar inmediatamente.`,
      }

      const response = await fetch("/api/ai/reading-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type,
          selectedBook,
          prompts,
        }),
      })

      if (!response.ok) throw new Error("Failed to generate insight")

      const { text } = await response.json()

      const newInsight: ReadingInsight = {
        id: Date.now().toString(),
        type: type as any,
        title:
          type === "summary"
            ? "Resumen Inteligente"
            : type === "question"
              ? "Pregunta de Reflexión"
              : type === "connection"
                ? "Conexión con Otros Libros"
                : "Aplicación Práctica",
        content: text,
        book_title: selectedBook,
        confidence: Math.floor(Math.random() * 20) + 80,
        created_at: new Date().toISOString(),
      }

      setInsights((prev) => [newInsight, ...prev])
    } catch (error) {
      console.error("Error generating insight:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "summary":
        return <BookOpen className="h-5 w-5" />
      case "question":
        return <MessageCircle className="h-5 w-5" />
      case "connection":
        return <Brain className="h-5 w-5" />
      case "application":
        return <Target className="h-5 w-5" />
      default:
        return <Lightbulb className="h-5 w-5" />
    }
  }

  const getInsightColor = (type: string) => {
    switch (type) {
      case "summary":
        return "text-blue"
      case "question":
        return "text-purple"
      case "connection":
        return "text-green"
      case "application":
        return "text-orange"
      default:
        return "text-muted-foreground"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Bot className="h-12 w-12 animate-pulse mx-auto mb-4 text-blue" />
          <p>Inicializando compañero de lectura IA...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-4">🤖 Compañero de Lectura IA</h1>
        <p className="text-xl text-muted-foreground">Tu asistente inteligente para maximizar el aprendizaje de cada libro</p>
      </div>

      <Tabs defaultValue="chat" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chat">Chat IA</TabsTrigger>
          <TabsTrigger value="insights">Insights</TabsTrigger>
          <TabsTrigger value="study">Planes de Estudio</TabsTrigger>
          <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
        </TabsList>

        <TabsContent value="chat" className="space-y-6">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 text-blue" />
                Chat con tu Compañero IA
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {chatMessages.map((message, index) => (
                  <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.role === "user" ? "bg-blue text-white" : "bg-muted/10 text-gray-800"
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                    </div>
                  </div>
                ))}
                {isGenerating && (
                  <div className="flex justify-start">
                    <div className="bg-muted/10 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue"></div>
                        <span className="text-sm text-muted-foreground">Pensando...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Textarea
                  placeholder="Pregúntame sobre tu libro, pide un resumen, o solicita consejos de aplicación..."
                  value={currentMessage}
                  onChange={(e) => setCurrentMessage(e.target.value)}
                  className="flex-1 min-h-[60px] resize-none"
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage()
                    }
                  }}
                />
                <div className="flex flex-col gap-2">
                  <Button onClick={sendMessage} disabled={!currentMessage.trim() || isGenerating}>
                    <Send className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm">
                    <Mic className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="insights" className="space-y-6">
          {/* Insight Generator */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple" />
                Generar Nuevo Insight
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-4">
                <input
                  type="text"
                  placeholder="Nombre del libro..."
                  value={selectedBook}
                  onChange={(e) => setSelectedBook(e.target.value)}
                  className="flex-1 p-2 border rounded"
                />
                <div className="flex gap-2">
                  <Button onClick={() => generateInsight("summary")} disabled={!selectedBook || isGenerating}>
                    <BookOpen className="h-4 w-4 mr-1" />
                    Resumen
                  </Button>
                  <Button onClick={() => generateInsight("question")} disabled={!selectedBook || isGenerating}>
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Pregunta
                  </Button>
                  <Button onClick={() => generateInsight("connection")} disabled={!selectedBook || isGenerating}>
                    <Brain className="h-4 w-4 mr-1" />
                    Conexión
                  </Button>
                  <Button onClick={() => generateInsight("application")} disabled={!selectedBook || isGenerating}>
                    <Target className="h-4 w-4 mr-1" />
                    Aplicación
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Insights List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {insights.map((insight) => (
              <Card key={insight.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className={getInsightColor(insight.type)}>{getInsightIcon(insight.type)}</div>
                      <CardTitle className="text-lg">{insight.title}</CardTitle>
                    </div>
                    <Badge variant="outline">{insight.confidence}% confianza</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{insight.book_title}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted mb-4">{insight.content}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted-foreground">{new Date(insight.created_at).toLocaleString()}</span>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm">
                        <Volume2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <MessageCircle className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="study" className="space-y-6">
          {studyPlans.map((plan) => (
            <Card key={plan.id}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-green" />
                  Plan de Estudio: {plan.book_title}
                </CardTitle>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    Sesión {plan.completed_sessions + 1} de {plan.total_sessions}
                  </span>
                  <Badge variant="outline">
                    {Math.round((plan.completed_sessions / plan.total_sessions) * 100)}% completado
                  </Badge>
                </div>
                <Progress value={(plan.completed_sessions / plan.total_sessions) * 100} className="h-2" />
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Current Session */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg flex items-center gap-2">
                      <Clock className="h-5 w-5 text-blue" />
                      Sesión Actual
                    </h4>
                    <div className="bg-blue/5 p-4 rounded-[28px]">
                      <h5 className="font-semibold mb-2">{plan.current_session.title}</h5>
                      <p className="text-sm text-muted-foreground mb-3">
                        Tiempo estimado: {plan.current_session.estimated_time} minutos
                      </p>

                      <div className="space-y-3">
                        <div>
                          <h6 className="font-medium text-sm">Objetivos:</h6>
                          <ul className="text-sm text-muted-foreground list-disc list-inside">
                            {plan.current_session.objectives.map((objective, index) => (
                              <li key={index}>{objective}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h6 className="font-medium text-sm">Conceptos Clave:</h6>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {plan.current_session.key_concepts.map((concept, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {concept}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <Button className="w-full mt-4">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Completar Sesión
                      </Button>
                    </div>
                  </div>

                  {/* Next Session Preview */}
                  <div className="space-y-4">
                    <h4 className="font-semibold text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-purple" />
                      Próxima Sesión
                    </h4>
                    <div className="bg-purple/5 p-4 rounded-[28px]">
                      <h5 className="font-semibold mb-2">{plan.next_session.title}</h5>
                      <p className="text-sm text-muted-foreground">{plan.next_session.preview}</p>
                      <Button variant="outline" className="w-full mt-4 bg-transparent" disabled>
                        <AlertCircle className="h-4 w-4 mr-1" />
                        Disponible después de completar sesión actual
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="recommendations" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-green" />
                Recomendaciones Personalizadas
              </CardTitle>
              <p className="text-sm text-muted-foreground">Basadas en tu historial de lectura y preferencias</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommendations.map((rec) => (
                  <Card key={rec.book_id} className="border-2 border-green/20">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{rec.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">por {rec.author}</p>
                        </div>
                        <Badge variant="default" className="bg-green">
                          {rec.match_score}% match
                        </Badge>
                      </div>
                      <Badge variant="outline">{rec.category}</Badge>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted mb-4">{rec.reason}</p>
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          <BookOpen className="h-4 w-4 mr-1" />
                          Ver Libro
                        </Button>
                        <Button variant="outline" size="sm">
                          <MessageCircle className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
