"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/components/session-wrapper"
import { createClient } from "@supabase/supabase-js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Brain, CheckCircle, Clock } from "lucide-react"

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
    question: "Describe una situación donde tuviste que persuadir a alguien. ¿Qué estrategia utilizaste?",
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
    question: "¿Cómo defines el éxito en tu carrera profesional?",
    category: "S",
  },
  {
    id: 10,
    type: "multiple_choice",
    question: "Cuando trabajas en equipo, tu rol natural es:",
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
    question: "Describe tu ambiente de trabajo ideal. ¿Qué características tendría?",
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

export default function DISCTestPage() {
  const { user } = useSession()
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: string }>({})
  const [isCompleted, setIsCompleted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [startTime] = useState(Date.now())

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  useEffect(() => {
    if (!user) {
      router.push("/")
    }
  }, [user, router])

  const handleAnswer = (answer: string) => {
    setAnswers({ ...answers, [discQuestions[currentQuestion].id]: answer })
  }

  const nextQuestion = () => {
    if (currentQuestion < discQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      setIsCompleted(true)
    }
  }

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const calculateDISCScores = () => {
    const scores = { D: 0, I: 0, S: 0, C: 0 }

    discQuestions.forEach((question) => {
      const answer = answers[question.id]
      if (answer) {
        if (question.type === "multiple_choice" && question.options) {
          const answerIndex = question.options.indexOf(answer)
          // Assign points based on answer position and question category
          if (answerIndex === 0) scores.D += 3
          else if (answerIndex === 1) scores.I += 3
          else if (answerIndex === 2) scores.S += 3
          else if (answerIndex === 3) scores.C += 3
        } else if (question.type === "open_ended" || question.type === "scenario") {
          // For open-ended questions, assign points to the question's category
          scores[question.category] += 2
        }
      }
    })

    // Normalize scores to percentage
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
    if (!user) return

    setIsSubmitting(true)
    try {
      const scores = calculateDISCScores()
      const primaryStyle = getPrimaryStyle(scores)
      const duration = Math.round((Date.now() - startTime) / 60000) // minutes

      const testResults = {
        D: scores.D,
        I: scores.I,
        S: scores.S,
        C: scores.C,
        primary_style: primaryStyle,
        answers: answers,
      }

      // Save to test_results table
      const { error: testError } = await supabase.from("test_results").insert({
        user_email: user.email,
        test_type: "personality",
        test_name: "DISC Assessment",
        results: testResults,
        score: Math.max(scores.D, scores.I, scores.S, scores.C),
        duration_minutes: duration,
      })

      if (testError) {
        console.error("Error saving test results:", testError)
      }

      // Save to disc_results table
      const { error: discError } = await supabase.from("disc_results").insert({
        user_email: user.email,
        d_score: scores.D,
        i_score: scores.I,
        s_score: scores.S,
        c_score: scores.C,
        primary_type: primaryStyle,
        analysis: `Tu estilo principal es ${primaryStyle} con puntuaciones: D=${scores.D}%, I=${scores.I}%, S=${scores.S}%, C=${scores.C}%`,
        recommendations: "Continúa desarrollando tus fortalezas naturales mientras trabajas en áreas de crecimiento.",
      })

      if (discError) {
        console.error("Error saving DISC results:", discError)
      }

      // Update user profile
      const { error: profileError } = await supabase
        .from("user_profiles")
        .update({
          tests_completed: 1,
          updated_at: new Date().toISOString(),
        })
        .eq("user_email", user.email)

      if (profileError) {
        console.error("Error updating profile:", profileError)
      }

      // Add activity
      const { error: activityError } = await supabase.from("user_activities").insert({
        user_email: user.email,
        activity_type: "test_completed",
        activity_description: `Completó el Test DISC con estilo principal: ${primaryStyle}`,
        xp_earned: 50,
      })

      if (activityError) {
        console.error("Error saving activity:", activityError)
      }

      // Redirect to results
      router.push("/test/disc/results")
    } catch (error) {
      console.error("Error submitting test:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando acceso...</p>
        </div>
      </div>
    )
  }

  const progress = ((currentQuestion + 1) / discQuestions.length) * 100
  const question = discQuestions[currentQuestion]
  const currentAnswer = answers[question.id]

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">¡Test DISC Completado!</CardTitle>
            <CardDescription>Has respondido todas las preguntas. Ahora procesaremos tus resultados.</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="bg-blue-50 p-4 rounded-lg">
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

            <Button variant="outline" onClick={() => router.push("/dashboard")} className="w-full">
              Volver al Dashboard
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Dashboard
          </Button>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">{Math.round((Date.now() - startTime) / 60000)} min</span>
          </div>
        </div>

        {/* Progress */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Progreso del Test</span>
              <span className="text-sm text-gray-600">
                {currentQuestion + 1} de {discQuestions.length}
              </span>
            </div>
            <Progress value={progress} className="mb-2" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Inicio</span>
              <span>{Math.round(progress)}% completado</span>
              <span>Finalizar</span>
            </div>
          </CardContent>
        </Card>

        {/* Question */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="outline">
                {question.type === "multiple_choice" && "Opción Múltiple"}
                {question.type === "open_ended" && "Respuesta Abierta"}
                {question.type === "scenario" && "Escenario"}
              </Badge>
              <Badge variant="secondary">Pregunta {currentQuestion + 1}</Badge>
            </div>
            <CardTitle className="text-xl">{question.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {question.type === "multiple_choice" && question.options && (
              <RadioGroup value={currentAnswer || ""} onValueChange={handleAnswer}>
                <div className="space-y-3">
                  {question.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
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
              <Textarea
                placeholder="Escribe tu respuesta aquí..."
                value={currentAnswer || ""}
                onChange={(e) => handleAnswer(e.target.value)}
                className="min-h-[120px]"
              />
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={prevQuestion} disabled={currentQuestion === 0}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>

              <Button onClick={nextQuestion} disabled={!currentAnswer}>
                {currentQuestion === discQuestions.length - 1 ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Finalizar Test
                  </>
                ) : (
                  <>
                    Siguiente
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Test Info */}
        <Card className="mt-6">
          <CardContent className="pt-6">
            <div className="flex items-start space-x-3">
              <Brain className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-sm">Sobre el Test DISC</h3>
                <p className="text-sm text-gray-600 mt-1">
                  El test DISC evalúa cuatro dimensiones del comportamiento: Dominancia (D), Influencia (I), Estabilidad
                  (S) y Cumplimiento (C). Tus respuestas nos ayudarán a identificar tu estilo de personalidad
                  predominante y cómo interactúas en entornos profesionales.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
