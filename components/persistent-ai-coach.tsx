"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  MessageCircle,
  Send,
  Brain,
  BookOpen,
  Target,
  TrendingUp,
  Lightbulb,
  X,
  Minimize2,
  Maximize2,
  Star,
  Clock,
  Users,
  Award,
  ChevronRight,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Sparkles,
  RefreshCw,
} from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  type?: "recommendation" | "insight" | "reminder" | "chat"
  metadata?: any
}

interface Recommendation {
  id: string
  type: "book" | "test" | "article" | "skill" | "goal"
  title: string
  description: string
  priority: "high" | "medium" | "low"
  category: string
  action_url?: string
  estimated_time?: string
  difficulty?: string
  relevance_score?: number
  icon?: React.ReactNode
}

interface UserContext {
  completedTests: string[]
  currentGoals: string[]
  interests: string[]
  skillLevel: string
  lastActivity: string
  preferredLearningStyle: string
}

export default function PersistentAICoach() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [recommendations, setRecommendations] = useState<Recommendation[]>([])
  const [userContext, setUserContext] = useState<UserContext | null>(null)
  const [activeTab, setActiveTab] = useState("chat")
  const [unreadCount, setUnreadCount] = useState(0)
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const userEmail = "demo@example.com" // In real app, get from auth

  useEffect(() => {
    initializeCoach()
    loadUserContext()
    generateProactiveRecommendations()

    // Set up periodic updates
    const interval = setInterval(
      () => {
        generateProactiveRecommendations()
      },
      5 * 60 * 1000,
    ) // Every 5 minutes

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const initializeCoach = () => {
    const welcomeMessage: Message = {
      id: "welcome",
      role: "assistant",
      content: `¡Hola! 👋 Soy tu **AI Coach Personal** y estaré contigo en todo momento.

🎯 **Estoy aquí para ayudarte con:**
• **Recomendaciones personalizadas** de libros y recursos
• **Sugerencias de tests** basadas en tu progreso
• **Recordatorios** de objetivos y metas
• **Insights** sobre tu desarrollo profesional
• **Respuestas** a cualquier pregunta sobre carrera

💡 **Tip**: Puedo generar recomendaciones automáticamente basadas en tu actividad. ¡Mantente atento a mis sugerencias!`,
      timestamp: new Date(),
      type: "chat",
    }

    setMessages([welcomeMessage])
  }

  const loadUserContext = async () => {
    try {
      // Load user's test results
      const { data: testResults } = await supabase
        .from("test_results")
        .select("test_type, completed_at, score")
        .eq("user_email", userEmail)
        .order("completed_at", { ascending: false })

      // Load user profile
      const { data: profile } = await supabase.from("user_profiles").select("*").eq("email", userEmail).single()

      const context: UserContext = {
        completedTests: testResults?.map((r) => r.test_type) || [],
        currentGoals: ["Mejorar liderazgo", "Desarrollar habilidades técnicas"],
        interests: ["Desarrollo profesional", "Liderazgo", "Productividad"],
        skillLevel:
          testResults && testResults.length >= 3
            ? "Avanzado"
            : testResults && testResults.length >= 1
              ? "Intermedio"
              : "Principiante",
        lastActivity: testResults?.[0]?.completed_at || "Nunca",
        preferredLearningStyle: "Visual y práctico",
      }

      setUserContext(context)
    } catch (error) {
      console.error("Error loading user context:", error)
    }
  }

  const generateProactiveRecommendations = async () => {
    if (!userContext) return

    const newRecommendations: Recommendation[] = []

    // Test recommendations based on completed tests
    if (userContext.completedTests.length < 3) {
      const availableTests = ["disc", "big-five", "mbti", "riasec", "soft-skills"]
      const nextTest = availableTests.find((test) => !userContext.completedTests.includes(test))

      if (nextTest) {
        newRecommendations.push({
          id: `test-${nextTest}`,
          type: "test",
          title: `Completa el test ${getTestName(nextTest)}`,
          description: `Basado en tu progreso actual, este test te dará insights valiosos sobre ${getTestDescription(nextTest)}.`,
          priority: "high",
          category: "Evaluación",
          action_url: `/test/${nextTest}`,
          estimated_time: "15-20 min",
          difficulty: "Fácil",
          relevance_score: 0.9,
          icon: <Target className="h-4 w-4" />,
        })
      }
    }

    // Book recommendations based on interests and skill level
    try {
      const { data: books } = await supabase
        .from("knowledge_base")
        .select("*")
        .in("category", userContext.interests)
        .order("read_count", { ascending: false })
        .limit(3)

      books?.forEach((book, index) => {
        newRecommendations.push({
          id: `book-${book.id}`,
          type: "book",
          title: book.title,
          description: `${book.content.substring(0, 120)}...`,
          priority: index === 0 ? "high" : "medium",
          category: book.category,
          action_url: `/biblioteca?book=${book.id}`,
          estimated_time: "30-45 min",
          difficulty: "Intermedio",
          relevance_score: 0.8 - index * 0.1,
          icon: <BookOpen className="h-4 w-4" />,
        })
      })
    } catch (error) {
      console.error("Error loading book recommendations:", error)
    }

    // Skill development recommendations
    if (userContext.skillLevel === "Principiante") {
      newRecommendations.push({
        id: "skill-communication",
        type: "skill",
        title: "Desarrolla habilidades de comunicación",
        description:
          "La comunicación efectiva es fundamental para el crecimiento profesional. Te recomiendo empezar con técnicas básicas.",
        priority: "high",
        category: "Habilidades Blandas",
        action_url: "/biblioteca?category=Comunicación",
        estimated_time: "1-2 horas",
        difficulty: "Fácil",
        relevance_score: 0.85,
        icon: <Users className="h-4 w-4" />,
      })
    }

    // Goal-based recommendations
    newRecommendations.push({
      id: "goal-leadership",
      type: "goal",
      title: "Plan de desarrollo en liderazgo",
      description: "Basado en tu objetivo de mejorar liderazgo, he creado un plan personalizado de 30 días.",
      priority: "medium",
      category: "Desarrollo Personal",
      estimated_time: "30 días",
      difficulty: "Intermedio",
      relevance_score: 0.75,
      icon: <Award className="h-4 w-4" />,
    })

    setRecommendations(newRecommendations)

    // Add proactive message if there are new high-priority recommendations
    const highPriorityRecs = newRecommendations.filter((r) => r.priority === "high")
    if (highPriorityRecs.length > 0 && messages.length > 1) {
      const proactiveMessage: Message = {
        id: `proactive-${Date.now()}`,
        role: "assistant",
        content: `🎯 **Nuevas recomendaciones personalizadas:**

He analizado tu progreso y tengo ${highPriorityRecs.length} sugerencia(s) de alta prioridad para ti:

${highPriorityRecs.map((rec) => `• **${rec.title}** - ${rec.description.substring(0, 80)}...`).join("\n")}

¿Te interesa alguna de estas recomendaciones? ¡Puedo darte más detalles!`,
        timestamp: new Date(),
        type: "recommendation",
        metadata: { recommendations: highPriorityRecs },
      }

      setMessages((prev) => [...prev, proactiveMessage])
      setUnreadCount((prev) => prev + 1)
    }
  }

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
      type: "chat",
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)
    setIsTyping(true)

    try {
      const response = await fetch("/api/ai-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage.content,
          userEmail,
          testResults: userContext?.completedTests || [],
          conversationHistory: messages.slice(-5),
          context: userContext,
        }),
      })

      if (response.ok) {
        const data = await response.json()

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: "assistant",
          content: data.response,
          timestamp: new Date(),
          type: "chat",
        }

        setMessages((prev) => [...prev, assistantMessage])
      }
    } catch (error) {
      console.error("Error in AI chat:", error)
    } finally {
      setIsLoading(false)
      setIsTyping(false)
    }
  }

  const handleRecommendationClick = (recommendation: Recommendation) => {
    if (recommendation.action_url) {
      window.open(recommendation.action_url, "_blank")
    }

    // Add interaction message
    const interactionMessage: Message = {
      id: `interaction-${Date.now()}`,
      role: "assistant",
      content: `¡Excelente elección! 🎉 Has seleccionado "${recommendation.title}". 

${
  recommendation.type === "test"
    ? "Recuerda que completar este test te dará insights valiosos para tu desarrollo profesional."
    : recommendation.type === "book"
      ? "Este libro te ayudará a profundizar en temas importantes para tu crecimiento."
      : "Esta actividad está alineada con tus objetivos de desarrollo."
}

¿Necesitas algún consejo específico antes de comenzar?`,
      timestamp: new Date(),
      type: "insight",
    }

    setMessages((prev) => [...prev, interactionMessage])
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const getTestName = (testType: string) => {
    const names = {
      disc: "DISC",
      "big-five": "Big Five",
      mbti: "MBTI",
      riasec: "RIASEC",
      "soft-skills": "Habilidades Blandas",
    }
    return names[testType as keyof typeof names] || testType
  }

  const getTestDescription = (testType: string) => {
    const descriptions = {
      disc: "tu estilo de comunicación y comportamiento",
      "big-five": "tus rasgos de personalidad fundamentales",
      mbti: "tu tipo de personalidad y preferencias cognitivas",
      riasec: "tus intereses vocacionales y compatibilidad de carrera",
      "soft-skills": "tus habilidades interpersonales y profesionales",
    }
    return descriptions[testType as keyof typeof descriptions] || "tu perfil profesional"
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "book":
        return <BookOpen className="h-4 w-4" />
      case "test":
        return <Target className="h-4 w-4" />
      case "skill":
        return <Users className="h-4 w-4" />
      case "goal":
        return <Award className="h-4 w-4" />
      case "article":
        return <ExternalLink className="h-4 w-4" />
      default:
        return <Lightbulb className="h-4 w-4" />
    }
  }

  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <Button
          onClick={() => {
            setIsOpen(true)
            setUnreadCount(0)
          }}
          className="h-14 w-14 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
          size="lg"
        >
          <div className="relative">
            <Brain className="h-6 w-6 text-white" />
            {unreadCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs bg-red-500 border-2 border-white">
                {unreadCount}
              </Badge>
            )}
          </div>
        </Button>
      </div>
    )
  }

  return (
    <div
      className={`fixed bottom-6 right-6 z-50 transition-all duration-300 ${
        isMinimized ? "w-80 h-16" : "w-96 h-[600px]"
      }`}
    >
      <Card className="h-full flex flex-col shadow-2xl border-2 border-purple-200">
        {/* Header */}
        <CardHeader className="pb-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-t-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-white/20 rounded-lg">
                <Brain className="h-4 w-4" />
              </div>
              <div>
                <CardTitle className="text-sm">AI Coach Personal</CardTitle>
                {!isMinimized && (
                  <CardDescription className="text-xs text-purple-100">
                    {isTyping ? "Escribiendo..." : "Siempre aquí para ayudarte"}
                  </CardDescription>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-6 w-6 p-0 text-white hover:bg-white/20"
              >
                {isMinimized ? <Maximize2 className="h-3 w-3" /> : <Minimize2 className="h-3 w-3" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-6 w-6 p-0 text-white hover:bg-white/20"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
              <TabsList className="grid w-full grid-cols-3 mx-2 mt-2">
                <TabsTrigger value="chat" className="text-xs">
                  <MessageCircle className="h-3 w-3 mr-1" />
                  Chat
                </TabsTrigger>
                <TabsTrigger value="recommendations" className="text-xs">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Sugerencias
                  {recommendations.length > 0 && (
                    <Badge className="ml-1 h-4 w-4 p-0 text-xs">{recommendations.length}</Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="insights" className="text-xs">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  Insights
                </TabsTrigger>
              </TabsList>

              <TabsContent value="chat" className="flex-1 flex flex-col m-0">
                <ScrollArea className="flex-1 p-3">
                  <div className="space-y-3">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex gap-2 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                      >
                        {message.role === "assistant" && (
                          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <Brain className="h-3 w-3 text-white" />
                          </div>
                        )}
                        <div
                          className={`max-w-[85%] p-2 rounded-lg text-xs ${
                            message.role === "user"
                              ? "bg-blue-600 text-white"
                              : message.type === "recommendation"
                                ? "bg-purple-50 border border-purple-200"
                                : "bg-gray-50 border"
                          }`}
                        >
                          <div className="whitespace-pre-wrap">{message.content}</div>
                          <div className="text-xs opacity-70 mt-1">
                            {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </div>
                        </div>
                      </div>
                    ))}

                    {isTyping && (
                      <div className="flex gap-2 justify-start">
                        <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                          <Brain className="h-3 w-3 text-white" />
                        </div>
                        <div className="bg-gray-50 border rounded-lg p-2">
                          <div className="flex gap-1">
                            <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce"></div>
                            <div
                              className="w-1 h-1 bg-purple-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            ></div>
                            <div
                              className="w-1 h-1 bg-purple-400 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                <div className="p-3 border-t">
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Pregúntame cualquier cosa..."
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      disabled={isLoading}
                      className="text-xs"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={isLoading || !input.trim()}
                      size="sm"
                      className="px-2"
                    >
                      <Send className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="recommendations" className="flex-1 m-0">
                <ScrollArea className="h-full p-3">
                  <div className="space-y-3">
                    {recommendations.length > 0 ? (
                      recommendations.map((rec) => (
                        <div
                          key={rec.id}
                          className="border rounded-lg p-3 hover:bg-gray-50 cursor-pointer transition-colors"
                          onClick={() => handleRecommendationClick(rec)}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {rec.icon || getTypeIcon(rec.type)}
                              <Badge className={`text-xs ${getPriorityColor(rec.priority)}`}>{rec.priority}</Badge>
                            </div>
                            <ChevronRight className="h-3 w-3 text-gray-400" />
                          </div>
                          <h4 className="font-medium text-sm mb-1">{rec.title}</h4>
                          <p className="text-xs text-gray-600 mb-2">{rec.description}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            {rec.estimated_time && (
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {rec.estimated_time}
                              </span>
                            )}
                            {rec.difficulty && (
                              <span className="flex items-center gap-1">
                                <Star className="h-3 w-3" />
                                {rec.difficulty}
                              </span>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Sparkles className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">Generando recomendaciones personalizadas...</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={generateProactiveRecommendations}
                          className="mt-2 bg-transparent"
                        >
                          <RefreshCw className="h-3 w-3 mr-1" />
                          Actualizar
                        </Button>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="insights" className="flex-1 m-0">
                <ScrollArea className="h-full p-3">
                  <div className="space-y-3">
                    {userContext && (
                      <>
                        <div className="border rounded-lg p-3 bg-blue-50">
                          <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                            <TrendingUp className="h-4 w-4" />
                            Tu Progreso
                          </h4>
                          <div className="space-y-2 text-xs">
                            <div className="flex justify-between">
                              <span>Tests completados:</span>
                              <span className="font-medium">{userContext.completedTests.length}/5</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Nivel actual:</span>
                              <Badge variant="secondary" className="text-xs">
                                {userContext.skillLevel}
                              </Badge>
                            </div>
                            <div className="flex justify-between">
                              <span>Última actividad:</span>
                              <span className="text-gray-600">
                                {userContext.lastActivity === "Nunca"
                                  ? "Nunca"
                                  : new Date(userContext.lastActivity).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="border rounded-lg p-3 bg-green-50">
                          <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Objetivos Actuales
                          </h4>
                          <div className="space-y-1">
                            {userContext.currentGoals.map((goal, index) => (
                              <div key={index} className="flex items-center gap-2 text-xs">
                                <CheckCircle className="h-3 w-3 text-green-600" />
                                <span>{goal}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="border rounded-lg p-3 bg-purple-50">
                          <h4 className="font-medium text-sm mb-2 flex items-center gap-2">
                            <Lightbulb className="h-4 w-4" />
                            Próximos Pasos
                          </h4>
                          <div className="space-y-2 text-xs">
                            {userContext.completedTests.length < 2 && (
                              <div className="flex items-start gap-2">
                                <AlertCircle className="h-3 w-3 text-orange-500 mt-0.5" />
                                <span>Completa más evaluaciones para obtener insights detallados</span>
                              </div>
                            )}
                            <div className="flex items-start gap-2">
                              <BookOpen className="h-3 w-3 text-blue-500 mt-0.5" />
                              <span>
                                Explora la biblioteca de conocimiento para profundizar en tus áreas de interés
                              </span>
                            </div>
                            <div className="flex items-start gap-2">
                              <Users className="h-3 w-3 text-green-500 mt-0.5" />
                              <span>Considera desarrollar habilidades de liderazgo y comunicación</span>
                            </div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </>
        )}
      </Card>
    </div>
  )
}
