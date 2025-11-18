"use client"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { useSession } from "@/components/session-wrapper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Brain, CheckCircle, Clock, Hand, Smartphone } from 'lucide-react'
import { Breadcrumbs, TestStructuredData } from "@/components/seo-optimized-content"
import { TestNavigationFlow } from "@/components/test-navigation-flow"
import { UnifiedTestSystem } from '@/lib/unified-test-system'
import { toast } from "@/components/ui/use-toast"

const breadcrumbItems = [
  { name: "Inicio", url: "/" },
  { name: "Tests", url: "/test" },
  { name: "Test DISC", url: "/test/disc" },
]

interface Question {
  id: number
  type: "multiple_choice" | "open_ended" | "scenario"
  question: string
  options?: string[]
  category: "D" | "I" | "S" | "C"
}

const discQuestions: Question[] = [
  {
    id: 1,
    type: "multiple_choice",
    question: "¿Cómo prefieres abordar los desafíos en el trabajo?",
    options: [
      "Tomo el control y actúo rápidamente",
      "Busco involucrar a otros y generar entusiasmo",
      "Analizo cuidadosamente antes de actuar",
      "Sigo procedimientos establecidos y busco precisión",
    ],
    category: "D",
  },
  {
    id: 2,
    type: "multiple_choice",
    question: "En una reunión de equipo, tiendes a:",
    options: [
      "Liderar la discusión y tomar decisiones",
      "Motivar al grupo y compartir ideas creativas",
      "Escuchar atentamente y apoyar a otros",
      "Hacer preguntas detalladas y verificar información",
    ],
    category: "I",
  },
  {
    id: 3,
    type: "scenario",
    question:
      "Tu equipo enfrenta una fecha límite muy ajustada. ¿Cuál sería tu enfoque principal para asegurar que se complete el proyecto a tiempo?",
    options: [
      "Reorganizar prioridades y eliminar tareas no esenciales",
      "Motivar al equipo y mantener la moral alta",
      "Trabajar horas extra y apoyar a quien lo necesite",
      "Crear un plan detallado con pasos específicos",
    ],
    category: "D",
  },
  {
    id: 4,
    type: "multiple_choice",
    question: "¿Cómo manejas los conflictos en el equipo?",
    options: [
      "Los abordo directamente y busco resolución rápida",
      "Trato de mediar y encontrar puntos en común",
      "Prefiero evitar confrontaciones y buscar armonía",
      "Analizo los hechos antes de tomar una posición",
    ],
    category: "S",
  },
  {
    id: 5,
    type: "open_ended",
    question:
      "Describe una situación donde tuviste que persuadir a alguien. ¿Qué estrategia utilizaste y cuál fue el resultado?",
    category: "I",
  },
  {
    id: 6,
    type: "multiple_choice",
    question: "¿Qué te motiva más en el trabajo?",
    options: [
      "Lograr resultados y superar objetivos",
      "Trabajar con personas y crear conexiones",
      "Contribuir al bienestar del equipo",
      "Hacer las cosas correctamente y con precisión",
    ],
    category: "C",
  },
  {
    id: 7,
    type: "scenario",
    question: "Se te asigna un proyecto completamente nuevo sin instrucciones claras. ¿Cuál es tu primera reacción?",
    options: [
      "Empiezo inmediatamente y ajusto sobre la marcha",
      "Busco colaboradores y lluvia de ideas",
      "Pido más información antes de comenzar",
      "Investigo proyectos similares y creo un plan detallado",
    ],
    category: "D",
  },
  {
    id: 8,
    type: "multiple_choice",
    question: "En tu tiempo libre, prefieres:",
    options: [
      "Actividades competitivas o desafiantes",
      "Socializar y conocer gente nueva",
      "Actividades relajantes con familia/amigos cercanos",
      "Hobbies que requieren precisión o aprendizaje",
    ],
    category: "I",
  },
  {
    id: 9,
    type: "open_ended",
    question: "¿Cómo defines el éxito en tu carrera profesional? Describe tus objetivos a largo plazo.",
    category: "S",
  },
  {
    id: 10,
    type: "multiple_choice",
    question: "¿Cuándo trabajas en equipo, tu rol natural es:",
    options: [
      "El líder que toma decisiones finales",
      "El motivador que mantiene la energía alta",
      "El mediador que asegura que todos participen",
      "El analista que verifica la calidad del trabajo",
    ],
    category: "C",
  },
  {
    id: 11,
    type: "scenario",
    question: "Tu jefe te pide feedback sobre un colega que no está rindiendo bien. ¿Cómo respondes?",
    options: [
      "Doy feedback directo y específico sobre los problemas",
      "Enfoco en aspectos positivos pero menciono áreas de mejora",
      "Sugiero apoyo adicional y entrenamiento",
      "Proporciono datos específicos y ejemplos documentados",
    ],
    category: "D",
  },
  {
    id: 12,
    type: "multiple_choice",
    question: "¿Cómo prefieres recibir reconocimiento por tu trabajo?",
    options: [
      "Reconocimiento público de logros y resultados",
      "Celebración grupal y reconocimiento social",
      "Agradecimiento personal y privado",
      "Reconocimiento por la calidad y precisión del trabajo",
    ],
    category: "I",
  },
  {
    id: 13,
    type: "open_ended",
    question: "Describe tu ambiente de trabajo ideal. ¿Qué características tendría y por qué son importantes para ti?",
    category: "S",
  },
  {
    id: 14,
    type: "multiple_choice",
    question: "Ante cambios organizacionales importantes, tu reacción típica es:",
    options: [
      "Veo oportunidades y me adapto rápidamente",
      "Me enfoco en mantener la moral del equipo",
      "Necesito tiempo para procesar y adaptarme",
      "Analizo el impacto y busco entender todos los detalles",
    ],
    category: "C",
  },
  {
    id: 15,
    type: "scenario",
    question: "Tienes que presentar un proyecto importante a la alta dirección. ¿Cuál es tu enfoque de preparación?",
    options: [
      "Me enfoco en resultados clave y impacto en el negocio",
      "Preparo una presentación engaging con historias y ejemplos",
      "Me aseguro de conocer bien a la audiencia y sus expectativas",
      "Preparo datos detallados y anticipo todas las preguntas posibles",
    ],
    category: "C",
  },
]

export default function DISCTestClient() {
  const { user, isLoading } = useSession()
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: string }>({})
  const [isCompleted, setIsCompleted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [startTime] = useState(Date.now())
  const [mounted, setMounted] = useState(false)
  const [gestureLog, setGestureLog] = useState<string[]>([])
  const [touchSupport, setTouchSupport] = useState(false)
  const [zoomLevel, setZoomLevel] = useState(1)

  useEffect(() => {
    setMounted(true)
    setTouchSupport("ontouchstart" in window || navigator.maxTouchPoints > 0)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading && !user) {
      router.push("/auth")
    }
  }, [user, router, isLoading, mounted])

  // Gesture handling
  const handleGestureUsed = (gesture: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setGestureLog((prev) => [`[${timestamp}] ${gesture}`, ...prev.slice(0, 4)])
  }

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [discQuestions[currentQuestion].id]: answer })
    handleGestureUsed(`Answer selected: ${answer.substring(0, 30)}...`)
  }

  const nextQuestion = () => {
    if (currentQuestion < discQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      handleGestureUsed("Navigated to next question")
    } else {
      setIsCompleted(true)
      handleGestureUsed("Test completed")
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      handleGestureUsed("Navigated to previous question")
    }
  }

  const calculateDISCScores = () => {
    const scores = { D: 0, I: 0, S: 0, C: 0 }

    discQuestions.forEach((question) => {
      const answer = answers[question.id]
      if (answer) {
        if (question.type === "multiple_choice" && question.options) {
          const answerIndex = question.options.indexOf(answer)
          if (answerIndex === 0) scores.D += 3
          else if (answerIndex === 1) scores.I += 3
          else if (answerIndex === 2) scores.S += 3
          else if (answerIndex === 3) scores.C += 3
        } else if (question.type === "open_ended" || question.type === "scenario") {
          scores[question.category] += 2
        }
      }
    })

    const total = scores.D + scores.I + scores.S + scores.C
    if (total > 0) {
      scores.D = Math.round((scores.D / total) * 100)
      scores.I = Math.round((scores.I / total) * 100)
      scores.S = Math.round((scores.S / total) * 100)
      scores.C = Math.round((scores.C / total) * 100)
    }

    return scores
  }

  const getPrimaryStyle = (scores: { D: number; I: number; S: number; C: number }) => {
    const maxScore = Math.max(scores.D, scores.I, scores.S, scores.C)
    if (scores.D === maxScore) return "Dominance"
    if (scores.I === maxScore) return "Influence"
    if (scores.S === maxScore) return "Steadiness"
    return "Compliance"
  }

  const submitTest = async () => {
    if (!user) {
      toast({
        title: 'Error de autenticación',
        description: 'Debes iniciar sesión para guardar tus resultados',
        variant: 'destructive'
      })
      return
    }

    setIsSubmitting(true)
    try {
      const scores = calculateDISCScores()
      const primaryStyle = getPrimaryStyle(scores)
      const duration = Math.round((Date.now() - startTime) / 60000)

      const testResults = {
        D: scores.D,
        I: scores.I,
        S: scores.S,
        C: scores.C,
        primary_style: primaryStyle,
        answers: answers,
        gesture_interactions: gestureLog.length,
        touch_enabled: touchSupport,
      }

      console.log('[v0] Saving DISC test results with unified system...')
      
      const result = await UnifiedTestSystem.saveTestResult({
        userEmail: user.email!,
        testType: 'DISC Assessment',
        testResults: testResults,
        durationMinutes: duration
      })

      if (!result.success) {
        throw new Error(result.error || 'Failed to save results')
      }

      console.log('[v0] DISC results saved successfully to database via unified system')
      
      // Mark test as completed
      const completedTests = JSON.parse(localStorage.getItem("completed_tests") || "[]")
      if (!completedTests.includes("disc")) {
        completedTests.push("disc")
        localStorage.setItem("completed_tests", JSON.stringify(completedTests))
      }

      toast({
        title: '¡Test completado!',
        description: 'Tus resultados han sido guardados correctamente'
      })

      handleGestureUsed("Test results saved and submitted")
      router.push("/test/disc/results")
    } catch (error) {
      console.error("[v0] Error submitting test:", error)
      toast({
        title: 'Error al guardar resultados',
        description: 'Hubo un problema guardando tus resultados. Por favor, contacta soporte.',
        variant: 'destructive'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading DISC assessment...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    )
  }

  const progress = answers[discQuestions[currentQuestion].id]
    ? ((currentQuestion + 1) / discQuestions.length) * 100
    : (currentQuestion / discQuestions.length) * 100

  const question = discQuestions[currentQuestion]
  const currentAnswer = answers[question.id]

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">¡Test DISC Completado!</CardTitle>
            <CardDescription>Has respondido todas las preguntas. Ahora procesaremos tus resultados.</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Resumen de tu evaluación:</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium">Preguntas respondidas:</span>
                  <p>
                    {Object.keys(answers).length} de {discQuestions.length}
                  </p>
                </div>
                <div>
                  <span className="font-medium">Tiempo empleado:</span>
                  <p>{Math.round((Date.now() - startTime) / 60000)} minutos</p>
                </div>
                {touchSupport && (
                  <div className="col-span-2">
                    <span className="font-medium">Interacciones gestuales:</span>
                    <p>{gestureLog.length} gestos detectados</p>
                  </div>
                )}
              </div>
            </div>

            <Button onClick={submitTest} disabled={isSubmitting} className="w-full" size="lg">
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Procesando resultados...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Ver Mis Resultados
                </>
              )}
            </Button>

            <Button variant="outline" onClick={() => router.push("/test")} className="w-full">
              Volver a Tests
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 touch-none select-none" style={{ fontSize: `${zoomLevel}rem` }}>
      <div className="container mx-auto max-w-4xl">
        {/* Header with Gesture Support */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={() => router.push("/test")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tests
          </Button>
          <div className="flex items-center space-x-2">
            {touchSupport && (
              <Badge variant="outline" className="text-blue-600 border-blue-300">
                <Hand className="h-4 w-4 mr-1" />
                Gesture Enabled
              </Badge>
            )}
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-600">{Math.round((Date.now() - startTime) / 60000)} min</span>
            </div>
          </div>
        </div>

        {/* SEO Optimized Content */}
        <Breadcrumbs items={breadcrumbItems} />
        <TestStructuredData
          name="Test DISC - Evaluación de Comportamiento Profesional"
          description="Evaluación psicométrica DISC para identificar tu estilo de comportamiento en el trabajo"
          duration={15}
          questions={28}
        />

        <article className="prose lg:prose-xl max-w-4xl mx-auto mb-8">
          <h1>Test DISC: Descubre tu Estilo de Comportamiento Profesional</h1>

          <p className="lead">
            El test DISC es una de las evaluaciones de comportamiento más utilizadas en el mundo profesional. Te ayuda a
            entender cómo interactúas con otros, cómo manejas desafíos y qué te motiva en el trabajo.
          </p>

          <h2>¿Qué es el Test DISC?</h2>
          <p>DISC es un modelo de comportamiento que identifica cuatro estilos principales de personalidad:</p>
          <ul>
            <li>
              <strong>D - Dominancia</strong>: Orientado a resultados, directo, decisivo
            </li>
            <li>
              <strong>I - Influencia</strong>: Comunicativo, entusiasta, persuasivo
            </li>
            <li>
              <strong>S - Estabilidad</strong>: Cooperativo, confiable, paciente
            </li>
            <li>
              <strong>C - Cumplimiento</strong>: Analítico, preciso, sistemático
            </li>
          </ul>

          <h2>¿Por qué hacer el Test DISC?</h2>
          <ul>
            <li>Mejora tu autoconocimiento profesional</li>
            <li>Optimiza tu comunicación con colegas y superiores</li>
            <li>Identifica tu estilo de liderazgo natural</li>
            <li>Descubre las mejores áreas profesionales para tu perfil</li>
            <li>Desarrolla estrategias para trabajar mejor en equipo</li>
          </ul>

          <h2>¿Cómo funciona?</h2>
          <p>
            Nuestro test DISC consta de 28 preguntas que evalúan tus preferencias de comportamiento. Toma
            aproximadamente 15 minutos completarlo y recibirás resultados detallados inmediatamente.
          </p>
        </article>

        {/* Progress */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Test Progress</span>
              <span className="text-sm text-gray-600">
                {currentQuestion + 1} of {discQuestions.length}
              </span>
            </div>
            <Progress value={progress} className="mb-2" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{currentQuestion === 0 && !answers[discQuestions[0].id] ? "Ready to start" : "In progress"}</span>
              <span>{Math.round(progress)}% complete</span>
              <span>Finish</span>
            </div>
          </CardContent>
        </Card>

        {/* Gesture Instructions for Touch Devices */}
        {touchSupport && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardContent className="pt-4">
              <div className="flex items-center gap-2 mb-2">
                <Smartphone className="h-4 w-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-900">Gesture Controls Available</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs text-blue-800">
                <div>← Swipe right: Previous</div>
                <div>Swipe left: Next →</div>
                <div>🤏 Pinch: Zoom text</div>
                <div>👆 Long press: Context</div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Question */}
        <Card className="transition-all duration-300" style={{ transform: `scale(${Math.min(zoomLevel, 1.1)})` }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="outline">
                {question.type === "multiple_choice" && "Multiple Choice"}
                {question.type === "open_ended" && "Open Response"}
                {question.type === "scenario" && "Scenario"}
              </Badge>
              <Badge variant="secondary">Question {currentQuestion + 1}</Badge>
            </div>
            <CardTitle className="text-xl">{question.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {question.type === "multiple_choice" && question.options && (
              <RadioGroup value={currentAnswer || ""} onValueChange={handleAnswer}>
                <div className="space-y-3">
                  {question.options.map((option, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50 border border-gray-200 cursor-pointer transition-colors"
                      onClick={() => handleAnswer(option)}
                    >
                      <RadioGroupItem value={option} id={`option-${index}`} />
                      <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            )}

            {(question.type === "open_ended" || question.type === "scenario") && (
              <div className="space-y-2">
                <Textarea
                  placeholder="Write your detailed response here..."
                  value={currentAnswer || ""}
                  onChange={(e) => handleAnswer(e.target.value)}
                  className="min-h-[120px]"
                />
                <div className="flex items-center text-xs text-gray-500">
                  <Brain className="h-3 w-3 mr-1 text-blue-600" />
                  This response will be analyzed for personalized insights
                </div>
              </div>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={prevQuestion} disabled={currentQuestion === 0} size="lg">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              <Button onClick={nextQuestion} disabled={!currentAnswer} size="lg">
                {currentQuestion === discQuestions.length - 1 ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Complete Test
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Gesture Activity Log */}
        {gestureLog.length > 0 && (
          <Card className="mt-6 border-purple-200 bg-purple-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Hand className="h-4 w-4" />
                Recent Gesture Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {gestureLog.map((log, index) => (
                  <div key={index} className="text-xs text-purple-700 bg-white p-2 rounded border">
                    {log}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Test Info */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">About the DISC Assessment</h3>
                <p className="text-sm text-gray-600 mt-1">
                  The DISC assessment evaluates four behavioral dimensions: Dominance (D), Influence (I), Steadiness
                  (S), and Compliance (C). Your responses will help identify your natural behavioral style and
                  communication preferences in professional settings.
                  {touchSupport && " This version includes gesture support for enhanced mobile interaction."}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Test Navigation Flow */}
        <TestNavigationFlow testType="disc" />
      </div>
    </div>
  )
}
