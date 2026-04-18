"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Send,
  Sparkles,
  MessageSquare,
  Target,
  BookOpen,
  Users,
  Calendar,
  CheckCircle2,
  Circle,
  ArrowRight,
  Lightbulb,
  Brain,
  Heart,
  Clock,
} from "lucide-react"

// Tipos
interface Message {
  id: string
  content: string
  sender: "user" | "ai"
  timestamp: Date
  coach?: "sofia" | "dani"
  stage?: CoachStage
}

type CoachStage = "resultados" | "situaciones" | "metas" | "recursos" | "simulacion" | "seguimiento"

interface StageInfo {
  id: CoachStage
  title: string
  description: string
  icon: React.ReactNode
  questions: string[]
  completed: boolean
}

interface EnhancedCoachFlowProps {
  userEmail: string
  testType: "MBTI" | "DISC" | "Big Five" | "RIASEC" | "Soft Skills" | "Emotional Intelligence"
  testResults: any
  userName?: string
}

export function EnhancedCoachFlow({ userEmail, testType, testResults, userName }: EnhancedCoachFlowProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [currentStage, setCurrentStage] = useState<CoachStage>("resultados")
  const [completedStages, setCompletedStages] = useState<CoachStage[]>([])
  const [activeTab, setActiveTab] = useState("chat")
  const [userSituations, setUserSituations] = useState<string[]>([])
  const [userGoals, setUserGoals] = useState<string[]>([])
  const [recommendedResources, setRecommendedResources] = useState<string[]>([])
  const [scheduledFollowUp, setScheduledFollowUp] = useState<Date | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Definicion de las 6 etapas del flujo B5
  const stages: StageInfo[] = [
    {
      id: "resultados",
      title: "1. Resultados",
      description: "Conversemos sobre tus resultados del test",
      icon: <Brain className="h-4 w-4" />,
      questions: [
        "¿Qué te sorprendió más de tus resultados?",
        "¿Hay algo que no entiendes de tu perfil?",
        "¿Cómo te sientes con estos resultados?",
        "¿Qué fortaleza te gustaría explorar más?",
      ],
      completed: completedStages.includes("resultados"),
    },
    {
      id: "situaciones",
      title: "2. Situaciones",
      description: "Identificar situaciones reales donde aplicar",
      icon: <Heart className="h-4 w-4" />,
      questions: [
        "¿En qué situación laboral te gustaría mejorar?",
        "¿Hay algún conflicto que quieras resolver?",
        "¿Qué conversación difícil tienes pendiente?",
        "¿Dónde sientes que no rindes como quisieras?",
      ],
      completed: completedStages.includes("situaciones"),
    },
    {
      id: "metas",
      title: "3. Metas",
      description: "Definir objetivos concretos y medibles",
      icon: <Target className="h-4 w-4" />,
      questions: [
        "¿Qué quieres lograr en los próximos 30 días?",
        "¿Cómo sabrás que has mejorado?",
        "¿Qué hábito te gustaría desarrollar?",
        "¿Cuál es tu meta profesional para este trimestre?",
      ],
      completed: completedStages.includes("metas"),
    },
    {
      id: "recursos",
      title: "4. Recursos",
      description: "Recomendaciones personalizadas para ti",
      icon: <BookOpen className="h-4 w-4" />,
      questions: [
        "¿Prefieres leer, escuchar o ver contenido?",
        "¿Cuánto tiempo tienes para aprender cada semana?",
        "¿Hay algún tema específico que te interese?",
        "¿Has leído algún libro de desarrollo personal?",
      ],
      completed: completedStages.includes("recursos"),
    },
    {
      id: "simulacion",
      title: "5. Simulación",
      description: "Practicar con situaciones reales",
      icon: <Users className="h-4 w-4" />,
      questions: [
        "¿Quieres simular una entrevista de trabajo?",
        "¿Practicamos una conversación difícil con tu jefe?",
        "¿Simulamos una negociación salarial?",
        "¿Te gustaría practicar dar feedback?",
      ],
      completed: completedStages.includes("simulacion"),
    },
    {
      id: "seguimiento",
      title: "6. Seguimiento",
      description: "Plan de seguimiento a 30 días",
      icon: <Calendar className="h-4 w-4" />,
      questions: [
        "¿Cuándo te gustaría hacer seguimiento?",
        "¿Qué día es mejor para revisar tu progreso?",
        "¿Te ayudo a crear recordatorios?",
        "¿Quieres que te envíe tips semanales?",
      ],
      completed: completedStages.includes("seguimiento"),
    },
  ]

  // Mensaje de bienvenida inicial
  useEffect(() => {
    const welcomeMessage: Message = {
      id: "1",
      content: `¡Hola${userName ? ` ${userName}` : ""}! Soy tu coach personalizado. He analizado tus resultados del test ${testType} y estoy aquí para ayudarte a aprovecharlos al máximo.

Vamos a seguir un proceso estructurado de 6 etapas:
1. **Resultados** - Entender tu perfil
2. **Situaciones** - Identificar dónde aplicar
3. **Metas** - Definir objetivos claros
4. **Recursos** - Recomendarte material
5. **Simulación** - Practicar situaciones reales
6. **Seguimiento** - Plan a 30 días

¿Empezamos explorando tus resultados? ¿Qué te llamó más la atención de tu perfil?`,
      sender: "ai",
      timestamp: new Date(),
      coach: "sofia",
      stage: "resultados",
    }
    setMessages([welcomeMessage])
  }, [testType, userName])

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Calcular progreso
  const progressPercentage = (completedStages.length / 6) * 100

  // Manejar envio de mensaje
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
      stage: currentStage,
    }

    setMessages((prev) => [...prev, userMessage])
    const currentMessage = inputMessage
    setInputMessage("")
    setIsLoading(true)

    try {
      const response = await fetch("/api/enhanced-coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: currentMessage,
          conversationHistory: messages.slice(-8).map((m) => ({
            role: m.sender === "user" ? "user" : "assistant",
            content: m.content,
          })),
          userEmail,
          testType,
          testResults,
          currentStage,
          completedStages,
          userSituations,
          userGoals,
        }),
      })

      if (!response.ok) throw new Error("Failed to get AI response")

      const data = await response.json()

      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: data.response,
        sender: "ai",
        timestamp: new Date(),
        coach: data.coach || "sofia",
        stage: currentStage,
      }
      setMessages((prev) => [...prev, aiResponse])

      // Actualizar estado segun respuesta de la IA
      if (data.extractedSituations) {
        setUserSituations((prev) => [...prev, ...data.extractedSituations])
      }
      if (data.extractedGoals) {
        setUserGoals((prev) => [...prev, ...data.extractedGoals])
      }
      if (data.recommendedResources) {
        setRecommendedResources(data.recommendedResources)
      }
      if (data.suggestNextStage && !completedStages.includes(currentStage)) {
        setCompletedStages((prev) => [...prev, currentStage])
      }
    } catch (error) {
      console.error("[v0] Error getting AI response:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Lo siento, tuve un problema. Por favor intenta de nuevo.",
        sender: "ai",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // Cambiar de etapa
  const handleStageChange = (stage: CoachStage) => {
    setCurrentStage(stage)

    const stageMessages: Record<CoachStage, string> = {
      resultados: `Perfecto, volvamos a hablar sobre tus resultados del test ${testType}. ¿Qué aspecto te gustaría explorar?`,
      situaciones:
        "Ahora identifiquemos situaciones reales donde puedas aplicar lo que aprendiste. ¿Hay alguna situación en tu trabajo o vida personal donde quieras mejorar?",
      metas:
        "Es hora de definir metas concretas. Basándome en lo que hemos conversado, ¿qué objetivo específico te gustaría lograr en los próximos 30 días?",
      recursos:
        "Te voy a recomendar recursos personalizados para ti. ¿Prefieres libros, podcasts, videos o ejercicios prácticos?",
      simulacion:
        "¡Vamos a practicar! Puedo simular una entrevista de trabajo, una conversación difícil con tu jefe, o cualquier situación que quieras preparar. ¿Qué te gustaría practicar?",
      seguimiento:
        "Para asegurar tu progreso, creemos un plan de seguimiento. ¿Cada cuánto te gustaría revisar tu avance? ¿Semanal o quincenal?",
    }

    const transitionMessage: Message = {
      id: Date.now().toString(),
      content: stageMessages[stage],
      sender: "ai",
      timestamp: new Date(),
      coach: stage === "resultados" || stage === "situaciones" ? "sofia" : "dani",
      stage,
    }
    setMessages((prev) => [...prev, transitionMessage])
  }

  // Completar etapa manualmente
  const markStageComplete = (stage: CoachStage) => {
    if (!completedStages.includes(stage)) {
      setCompletedStages((prev) => [...prev, stage])
    }
  }

  // Obtener el siguiente stage
  const getNextStage = (): CoachStage | null => {
    const stageOrder: CoachStage[] = ["resultados", "situaciones", "metas", "recursos", "simulacion", "seguimiento"]
    const currentIndex = stageOrder.indexOf(currentStage)
    if (currentIndex < stageOrder.length - 1) {
      return stageOrder[currentIndex + 1]
    }
    return null
  }

  return (
    <div className="space-y-4">
      {/* Barra de progreso */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progreso del Coaching</span>
            <span className="text-sm text-muted-foreground">{completedStages.length}/6 etapas</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />

          {/* Indicadores de etapas */}
          <div className="flex justify-between mt-4">
            {stages.map((stage, index) => (
              <button
                key={stage.id}
                onClick={() => handleStageChange(stage.id)}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                  currentStage === stage.id
                    ? "bg-purple/10 text-purple"
                    : stage.completed
                      ? "text-green"
                      : "text-muted-foreground hover:bg-muted"
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    stage.completed
                      ? "bg-green/10 text-green"
                      : currentStage === stage.id
                        ? "bg-purple text-purple-foreground"
                        : "bg-muted"
                  }`}
                >
                  {stage.completed ? <CheckCircle2 className="h-4 w-4" /> : stage.icon}
                </div>
                <span className="text-[10px] font-medium hidden md:block">{stage.title.split(". ")[1]}</span>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabs principales */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="chat" className="flex items-center gap-1">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">Chat</span>
          </TabsTrigger>
          <TabsTrigger value="situaciones" className="flex items-center gap-1">
            <Heart className="h-4 w-4" />
            <span className="hidden sm:inline">Situaciones</span>
          </TabsTrigger>
          <TabsTrigger value="metas" className="flex items-center gap-1">
            <Target className="h-4 w-4" />
            <span className="hidden sm:inline">Metas</span>
          </TabsTrigger>
          <TabsTrigger value="recursos" className="flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            <span className="hidden sm:inline">Recursos</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab Chat */}
        <TabsContent value="chat">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                    Coach IA - Etapa: {stages.find((s) => s.id === currentStage)?.title}
                  </CardTitle>
                  <CardDescription>{stages.find((s) => s.id === currentStage)?.description}</CardDescription>
                </div>
                {!completedStages.includes(currentStage) && (
                  <Button variant="outline" size="sm" onClick={() => markStageComplete(currentStage)}>
                    <CheckCircle2 className="h-4 w-4 mr-1" />
                    Completar etapa
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-80 mb-4 pr-4">
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-[28px] p-3 ${
                          message.sender === "user" ? "bg-purple text-purple-foreground" : "bg-muted"
                        }`}
                      >
                        <div className="flex items-start gap-2">
                          {message.sender === "ai" && (
                            <Avatar className="h-7 w-7 flex-shrink-0">
                              <AvatarFallback
                                className={
                                  message.coach === "sofia"
                                    ? "bg-red/10 text-pink-700 text-xs"
                                    : "bg-blue/10 text-blue text-xs"
                                }
                              >
                                {message.coach === "sofia" ? "S" : "D"}
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                            <p
                              className={`text-[10px] mt-1 ${
                                message.sender === "user" ? "text-purple-foreground/70" : "text-muted-foreground"
                              }`}
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
                      <div className="bg-muted rounded-[28px] p-3">
                        <div className="flex items-center gap-2">
                          <div className="flex gap-1">
                            <div className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
                            <div
                              className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                              style={{ animationDelay: "0.1s" }}
                            />
                            <div
                              className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce"
                              style={{ animationDelay: "0.2s" }}
                            />
                          </div>
                          <span className="text-xs text-muted-foreground">Pensando...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Preguntas sugeridas */}
              {messages.length <= 2 && (
                <div className="mb-4">
                  <p className="text-xs text-muted-foreground mb-2">Preguntas sugeridas:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {stages
                      .find((s) => s.id === currentStage)
                      ?.questions.slice(0, 4)
                      .map((question, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          onClick={() => setInputMessage(question)}
                          className="text-left justify-start h-auto py-2 px-3"
                        >
                          <Lightbulb className="h-3 w-3 mr-2 flex-shrink-0 text-orange" />
                          <span className="text-xs truncate">{question}</span>
                        </Button>
                      ))}
                  </div>
                </div>
              )}

              {/* Input de mensaje */}
              <div className="flex gap-2">
                <Textarea
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 min-h-[50px] resize-none"
                  onKeyDown={(e) => {
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

              {/* Boton siguiente etapa */}
              {completedStages.includes(currentStage) && getNextStage() && (
                <div className="mt-4 flex justify-end">
                  <Button onClick={() => handleStageChange(getNextStage()!)} className="gap-2">
                    Siguiente: {stages.find((s) => s.id === getNextStage())?.title.split(". ")[1]}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Situaciones */}
        <TabsContent value="situaciones">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red" />
                Situaciones Identificadas
              </CardTitle>
              <CardDescription>Situaciones reales donde aplicarás lo aprendido</CardDescription>
            </CardHeader>
            <CardContent>
              {userSituations.length > 0 ? (
                <div className="space-y-3">
                  {userSituations.map((situation, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                      <Circle className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <p className="text-sm">{situation}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Heart className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">Aún no has identificado situaciones</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Conversa con el coach en la etapa "Situaciones" para identificarlas
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 bg-transparent"
                    onClick={() => {
                      handleStageChange("situaciones")
                      setActiveTab("chat")
                    }}
                  >
                    Ir a identificar situaciones
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Metas */}
        <TabsContent value="metas">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-green/50" />
                Metas Definidas
              </CardTitle>
              <CardDescription>Objetivos concretos basados en tus resultados</CardDescription>
            </CardHeader>
            <CardContent>
              {userGoals.length > 0 ? (
                <div className="space-y-3">
                  {userGoals.map((goal, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                      <Target className="h-4 w-4 text-green/50 mt-0.5" />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{goal}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="outline" className="text-[10px]">
                            <Clock className="h-3 w-3 mr-1" />
                            30 días
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Target className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">Aún no has definido metas</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Conversa con el coach en la etapa "Metas" para definirlas
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 bg-transparent"
                    onClick={() => {
                      handleStageChange("metas")
                      setActiveTab("chat")
                    }}
                  >
                    Ir a definir metas
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab Recursos */}
        <TabsContent value="recursos">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-500" />
                Recursos Recomendados
              </CardTitle>
              <CardDescription>Material personalizado para tu desarrollo</CardDescription>
            </CardHeader>
            <CardContent>
              {recommendedResources.length > 0 ? (
                <div className="space-y-3">
                  {recommendedResources.map((resource, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                      <BookOpen className="h-4 w-4 text-blue-500 mt-0.5" />
                      <p className="text-sm">{resource}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-muted-foreground">Aún no tienes recursos recomendados</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Conversa con el coach en la etapa "Recursos" para obtenerlos
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 bg-transparent"
                    onClick={() => {
                      handleStageChange("recursos")
                      setActiveTab("chat")
                    }}
                  >
                    Ir a obtener recursos
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Resumen del seguimiento */}
      {completedStages.length >= 5 && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-[20px] bg-green/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-green" />
              </div>
              <div>
                <p className="font-medium text-green">¡Excelente progreso!</p>
                <p className="text-sm text-green">
                  Has completado {completedStages.length} de 6 etapas del coaching estructurado
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default EnhancedCoachFlow
