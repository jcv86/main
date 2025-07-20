"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Play,
  Pause,
  Mic,
  MicOff,
  MessageSquare,
  Clock,
  Target,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  RotateCcw,
} from "lucide-react"

interface Question {
  id: string
  category: string
  difficulty: "easy" | "medium" | "hard"
  question: string
  tips: string[]
  timeLimit: number
}

interface InterviewSession {
  id: string
  position: string
  company: string
  questions: Question[]
  currentQuestionIndex: number
  responses: Array<{
    questionId: string
    response: string
    timeSpent: number
    score?: number
  }>
  startTime: Date
  status: "setup" | "active" | "paused" | "completed"
}

const mockQuestions: Question[] = [
  {
    id: "1",
    category: "Presentación Personal",
    difficulty: "easy",
    question: "Cuéntame sobre ti y por qué estás interesado en esta posición.",
    tips: [
      "Mantén tu respuesta entre 2-3 minutos",
      "Enfócate en experiencias relevantes",
      "Conecta tu background con el rol",
      "Termina con por qué quieres el trabajo",
    ],
    timeLimit: 180,
  },
  {
    id: "2",
    category: "Experiencia Técnica",
    difficulty: "medium",
    question: "Describe un proyecto desafiante en el que hayas trabajado y cómo lo resolviste.",
    tips: [
      "Usa el método STAR (Situación, Tarea, Acción, Resultado)",
      "Sé específico sobre tu contribución",
      "Menciona tecnologías y metodologías usadas",
      "Destaca el impacto de tu solución",
    ],
    timeLimit: 240,
  },
  {
    id: "3",
    category: "Liderazgo",
    difficulty: "hard",
    question: "Cuéntame sobre una vez que tuviste que liderar un equipo a través de un cambio difícil.",
    tips: [
      "Demuestra habilidades de liderazgo",
      "Explica cómo manejaste la resistencia",
      "Menciona estrategias de comunicación",
      "Comparte los resultados obtenidos",
    ],
    timeLimit: 300,
  },
]

export default function InterviewSimulatorPage() {
  const [session, setSession] = useState<InterviewSession | null>(null)
  const [currentResponse, setCurrentResponse] = useState("")
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [selectedPosition, setSelectedPosition] = useState("")
  const [selectedCompany, setSelectedCompany] = useState("")
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Timer effect
  useEffect(() => {
    if (session?.status === "active" && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleTimeUp()
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [session?.status, timeRemaining])

  const startInterview = () => {
    if (!selectedPosition || !selectedCompany) return

    const newSession: InterviewSession = {
      id: Date.now().toString(),
      position: selectedPosition,
      company: selectedCompany,
      questions: mockQuestions,
      currentQuestionIndex: 0,
      responses: [],
      startTime: new Date(),
      status: "active",
    }

    setSession(newSession)
    setTimeRemaining(mockQuestions[0].timeLimit)
  }

  const handleTimeUp = () => {
    if (session && session.status === "active") {
      submitCurrentResponse()
    }
  }

  const submitCurrentResponse = () => {
    if (!session) return

    const currentQuestion = session.questions[session.currentQuestionIndex]
    const timeSpent = currentQuestion.timeLimit - timeRemaining

    const newResponse = {
      questionId: currentQuestion.id,
      response: currentResponse,
      timeSpent,
      score: Math.floor(Math.random() * 30) + 70, // Mock score 70-100
    }

    const updatedSession = {
      ...session,
      responses: [...session.responses, newResponse],
    }

    if (session.currentQuestionIndex < session.questions.length - 1) {
      // Move to next question
      const nextIndex = session.currentQuestionIndex + 1
      updatedSession.currentQuestionIndex = nextIndex
      setSession(updatedSession)
      setCurrentResponse("")
      setTimeRemaining(session.questions[nextIndex].timeLimit)
    } else {
      // Interview completed
      updatedSession.status = "completed"
      setSession(updatedSession)
      setTimeRemaining(0)
    }
  }

  const pauseInterview = () => {
    if (session) {
      setSession({ ...session, status: "paused" })
    }
  }

  const resumeInterview = () => {
    if (session) {
      setSession({ ...session, status: "active" })
    }
  }

  const restartInterview = () => {
    setSession(null)
    setCurrentResponse("")
    setTimeRemaining(0)
    setSelectedPosition("")
    setSelectedCompany("")
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  if (!session) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Simulador de Entrevistas</h1>
          <p className="text-muted-foreground">Practica entrevistas de trabajo con IA y recibe feedback detallado</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Configurar Entrevista</CardTitle>
            <CardDescription>Personaliza tu sesión de práctica según el rol y empresa</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Posición</label>
                <Select value={selectedPosition} onValueChange={setSelectedPosition}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una posición" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="frontend-developer">Frontend Developer</SelectItem>
                    <SelectItem value="backend-developer">Backend Developer</SelectItem>
                    <SelectItem value="fullstack-developer">Fullstack Developer</SelectItem>
                    <SelectItem value="product-manager">Product Manager</SelectItem>
                    <SelectItem value="data-scientist">Data Scientist</SelectItem>
                    <SelectItem value="ux-designer">UX Designer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Empresa</label>
                <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona una empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="startup">Startup Tecnológica</SelectItem>
                    <SelectItem value="enterprise">Empresa Grande</SelectItem>
                    <SelectItem value="consulting">Consultora</SelectItem>
                    <SelectItem value="bank">Banco/Fintech</SelectItem>
                    <SelectItem value="ecommerce">E-commerce</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold">Vista Previa de Preguntas</h3>
              <div className="space-y-3">
                {mockQuestions.map((question, index) => (
                  <div key={question.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div>
                        <div className="font-medium">{question.category}</div>
                        <div className="text-sm text-muted-foreground">{question.question}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getDifficultyColor(question.difficulty)}>{question.difficulty}</Badge>
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {Math.floor(question.timeLimit / 60)}min
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <Button
              onClick={startInterview}
              disabled={!selectedPosition || !selectedCompany}
              size="lg"
              className="w-full"
            >
              <Play className="w-4 h-4 mr-2" />
              Comenzar Entrevista
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (session.status === "completed") {
    const averageScore = session.responses.reduce((acc, r) => acc + (r.score || 0), 0) / session.responses.length
    const totalTime = session.responses.reduce((acc, r) => acc + r.timeSpent, 0)

    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Entrevista Completada</h1>
          <p className="text-muted-foreground">Revisa tu desempeño y feedback detallado</p>
        </div>

        <Tabs defaultValue="summary" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="summary">Resumen</TabsTrigger>
            <TabsTrigger value="responses">Respuestas</TabsTrigger>
            <TabsTrigger value="feedback">Feedback</TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{Math.round(averageScore)}%</div>
                    <div className="text-sm text-muted-foreground">Puntuación Promedio</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Clock className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{formatTime(totalTime)}</div>
                    <div className="text-sm text-muted-foreground">Tiempo Total</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <Target className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                    <div className="text-2xl font-bold">{session.responses.length}</div>
                    <div className="text-sm text-muted-foreground">Preguntas Respondidas</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Progreso por Categoría</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {session.questions.map((question, index) => {
                  const response = session.responses[index]
                  return (
                    <div key={question.id} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{question.category}</span>
                        <span className="text-sm text-muted-foreground">{response?.score || 0}%</span>
                      </div>
                      <Progress value={response?.score || 0} className="h-2" />
                    </div>
                  )
                })}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="responses" className="space-y-6">
            {session.responses.map((response, index) => {
              const question = session.questions[index]
              return (
                <Card key={response.questionId}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{question.category}</CardTitle>
                        <CardDescription>{question.question}</CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold">{response.score}%</div>
                        <div className="text-sm text-muted-foreground">{formatTime(response.timeSpent)}</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Tu Respuesta:</h4>
                        <div className="p-3 bg-muted rounded-lg">{response.response || "Sin respuesta registrada"}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-500" />
                  Fortalezas Identificadas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                    <span>Comunicación clara y estructurada</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                    <span>Buen manejo del tiempo en las respuestas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                    <span>Ejemplos concretos y relevantes</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  Áreas de Mejora
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-500 mt-1" />
                    <span>Profundizar más en los resultados obtenidos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-500 mt-1" />
                    <span>Incluir más detalles técnicos específicos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-orange-500 mt-1" />
                    <span>Mejorar la conexión entre experiencias y el rol</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-center mt-8">
          <Button onClick={restartInterview} size="lg">
            <RotateCcw className="w-4 h-4 mr-2" />
            Nueva Entrevista
          </Button>
        </div>
      </div>
    )
  }

  const currentQuestion = session.questions[session.currentQuestionIndex]
  const progress = ((session.currentQuestionIndex + 1) / session.questions.length) * 100

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-bold">Entrevista en Progreso</h1>
            <p className="text-muted-foreground">
              {session.position} en {session.company}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{formatTime(timeRemaining)}</div>
              <div className="text-sm text-muted-foreground">Tiempo restante</div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>
              Pregunta {session.currentQuestionIndex + 1} de {session.questions.length}
            </span>
            <span>{Math.round(progress)}% completado</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Current Question */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                {currentQuestion.category}
              </CardTitle>
              <Badge className={getDifficultyColor(currentQuestion.difficulty)}>{currentQuestion.difficulty}</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-lg font-medium p-4 bg-blue-50 rounded-lg">{currentQuestion.question}</div>

            <div className="space-y-2">
              <h4 className="font-medium">Consejos para tu respuesta:</h4>
              <ul className="text-sm space-y-1">
                {currentQuestion.tips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Response Area */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Tu Respuesta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Escribe tu respuesta aquí..."
            value={currentResponse}
            onChange={(e) => setCurrentResponse(e.target.value)}
            rows={8}
            className="resize-none"
          />

          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setIsRecording(!isRecording)}>
                {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                {isRecording ? "Detener" : "Grabar"}
              </Button>
              <span className="text-sm text-muted-foreground">{currentResponse.length} caracteres</span>
            </div>

            <div className="flex gap-2">
              {session.status === "active" ? (
                <Button variant="outline" onClick={pauseInterview}>
                  <Pause className="w-4 h-4 mr-2" />
                  Pausar
                </Button>
              ) : (
                <Button variant="outline" onClick={resumeInterview}>
                  <Play className="w-4 h-4 mr-2" />
                  Continuar
                </Button>
              )}

              <Button onClick={submitCurrentResponse}>
                {session.currentQuestionIndex < session.questions.length - 1 ? "Siguiente" : "Finalizar"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
