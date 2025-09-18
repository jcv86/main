"use client"

import { CardDescription } from "@/components/ui/card"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/components/session-wrapper"
import { createClient } from "@supabase/supabase-js"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, ArrowRight, Brain, CheckCircle } from "lucide-react"

interface Question {
  id: number
  text: string
  options: Array<{
    text: string
    value: string
    dimension: "D" | "I" | "S" | "C"
  }>
}

const discQuestions: Question[] = [
  {
    id: 1,
    text: "¿Cómo prefieres abordar los desafíos en el trabajo?",
    options: [
      { text: "Tomo el control y actúo rápidamente", value: "a", dimension: "D" },
      { text: "Busco involucrar a otros y generar entusiasmo", value: "b", dimension: "I" },
      { text: "Analizo cuidadosamente antes de actuar", value: "c", dimension: "S" },
      { text: "Sigo procedimientos establecidos y busco precisión", value: "d", dimension: "C" },
    ],
  },
  {
    id: 2,
    text: "En una reunión de equipo, tiendes a:",
    options: [
      { text: "Liderar la discusión y tomar decisiones", value: "a", dimension: "D" },
      { text: "Motivar al grupo y compartir ideas creativas", value: "b", dimension: "I" },
      { text: "Escuchar atentamente y apoyar a otros", value: "c", dimension: "S" },
      { text: "Hacer preguntas detalladas y verificar información", value: "d", dimension: "C" },
    ],
  },
  {
    id: 3,
    text: "Describe una situación donde tuviste que persuadir a alguien. ¿Qué estrategia utilizaste y cuál fue el resultado?",
    options: [],
  },
  {
    id: 4,
    text: "¿Cómo manejas los conflictos en el equipo?",
    options: [
      { text: "Los abordo directamente y busco resolución rápida", value: "a", dimension: "D" },
      { text: "Trato de mediar y encontrar puntos en común", value: "b", dimension: "I" },
      { text: "Prefiero evitar confrontaciones y buscar armonía", value: "c", dimension: "S" },
      { text: "Analizo los hechos antes de tomar una posición", value: "d", dimension: "C" },
    ],
  },
  {
    id: 5,
    text: "¿Cómo defines el éxito en tu carrera profesional? Describe tus objetivos a largo plazo.",
    options: [],
  },
  {
    id: 6,
    text: "¿Qué te motiva más en el trabajo?",
    options: [
      { text: "Lograr resultados y superar objetivos", value: "a", dimension: "D" },
      { text: "Trabajar con personas y crear conexiones", value: "b", dimension: "I" },
      { text: "Contribuir al bienestar del equipo", value: "c", dimension: "S" },
      { text: "Hacer las cosas correctamente y con precisión", value: "d", dimension: "C" },
    ],
  },
  {
    id: 7,
    text: "Describe tu ambiente de trabajo ideal. ¿Qué características tendría y por qué son importantes para ti?",
    options: [],
  },
  {
    id: 8,
    text: "Ante cambios organizacionales importantes, tu reacción típica es:",
    options: [
      { text: "Veo oportunidades y me adapto rápidamente", value: "a", dimension: "D" },
      { text: "Me enfoco en mantener la moral del equipo", value: "b", dimension: "I" },
      { text: "Necesito tiempo para procesar y adaptarme", value: "c", dimension: "S" },
      { text: "Analizo el impacto y busco entender todos los detalles", value: "d", dimension: "C" },
    ],
  },
  {
    id: 9,
    text: "Tienes que presentar un proyecto importante a la alta dirección. ¿Cuál es tu enfoque de preparación?",
    options: [
      { text: "Me enfoco en resultados clave y impacto en el negocio", value: "a", dimension: "D" },
      { text: "Preparo una presentación engaging con historias y ejemplos", value: "b", dimension: "I" },
      { text: "Me aseguro de conocer bien a la audiencia y sus expectativas", value: "c", dimension: "S" },
      { text: "Preparo datos detallados y anticipo todas las preguntas posibles", value: "d", dimension: "C" },
    ],
  },
  {
    id: 10,
    text: "En tu tiempo libre, prefieres:",
    options: [
      { text: "Actividades competitivas o desafiantes", value: "a", dimension: "D" },
      { text: "Socializar y conocer gente nueva", value: "b", dimension: "I" },
      { text: "Actividades relajantes con familia/amigos cercanos", value: "c", dimension: "S" },
      { text: "Hobbies que requieren precisión o aprendizaje", value: "d", dimension: "C" },
    ],
  },
  {
    id: 11,
    text: "Cuando trabajas en equipo, tu rol natural es:",
    options: [
      { text: "El líder que toma decisiones finales", value: "a", dimension: "D" },
      { text: "El motivador que mantiene la energía alta", value: "b", dimension: "I" },
      { text: "El mediador que asegura que todos participen", value: "c", dimension: "S" },
      { text: "El analista que verifica la calidad del trabajo", value: "d", dimension: "C" },
    ],
  },
  {
    id: 12,
    text: "¿Cómo prefieres recibir reconocimiento por tu trabajo?",
    options: [
      { text: "Reconocimiento público de logros y resultados", value: "a", dimension: "D" },
      { text: "Celebración grupal y reconocimiento social", value: "b", dimension: "I" },
      { text: "Agradecimiento personal y privado", value: "c", dimension: "S" },
      { text: "Reconocimiento por la calidad y precisión del trabajo", value: "d", dimension: "C" },
    ],
  },
  {
    id: 13,
    text: "Describe tu ambiente de trabajo ideal. ¿Qué características tendría y por qué son importantes para ti?",
    options: [],
  },
  {
    id: 14,
    text: "Describe una situación donde tuviste que persuadir a alguien. ¿Qué estrategia utilizaste y cuál fue el resultado?",
    options: [],
  },
  {
    id: 15,
    text: "¿Cómo manejas los conflictos en el equipo?",
    options: [
      { text: "Los abordo directamente y busco resolución rápida", value: "a", dimension: "D" },
      { text: "Trato de mediar y encontrar puntos en común", value: "b", dimension: "I" },
      { text: "Prefiero evitar confrontaciones y buscar armonía", value: "c", dimension: "S" },
      { text: "Analizo los hechos antes de tomar una posición", value: "d", dimension: "C" },
    ],
  },
]

export default function DISCTestPage() {
  const { user, isLoading } = useSession()
  const router = useRouter()
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: number]: string }>({})
  const [selectedAnswer, setSelectedAnswer] = useState("")
  const [isCompleted, setIsCompleted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [startTime] = useState(Date.now())
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading && !user) {
      router.push("/")
    }
  }, [user, router, isLoading, mounted])

  const handleNext = () => {
    if (selectedAnswer) {
      setAnswers({ ...answers, [discQuestions[currentQuestion].id]: selectedAnswer })

      if (currentQuestion < discQuestions.length - 1) {
        setCurrentQuestion(currentQuestion + 1)
        setSelectedAnswer("")
      } else {
        setIsCompleted(true)
      }
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      setSelectedAnswer(answers[discQuestions[currentQuestion - 1].id] || "")
    }
  }

  const handleBack = () => {
    router.push("/test")
  }

  const calculateDISCScores = () => {
    const scores = { D: 0, I: 0, S: 0, C: 0 }

    discQuestions.forEach((question) => {
      const answer = answers[question.id]
      if (answer) {
        question.options.forEach((option) => {
          if (option.value === answer) {
            scores[option.dimension] += 3
          }
        })
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

  const generateAIInterpretation = async (testResults: any) => {
    try {
      const response = await fetch("/api/ai-coach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `Eres un coach profesional especializado en análisis DISC y desarrollo de carrera. 
              Analiza los resultados del test DISC de manera personalizada y constructiva.

              Para el test DISC, analiza:
              - Las puntuaciones en Dominancia (D), Influencia (I), Estabilidad (S) y Cumplimiento (C)
              - El estilo principal identificado
              - Cómo estas características se manifiestan en el trabajo
              - Fortalezas específicas del perfil
              - Áreas de desarrollo y crecimiento
              - Recomendaciones para roles y equipos
              - Estrategias de comunicación y liderazgo

              Proporciona una interpretación detallada de 400-600 palabras que incluya:
              1. Resumen del perfil DISC principal
              2. Análisis de las puntuaciones específicas
              3. Fortalezas clave identificadas
              4. Áreas de desarrollo recomendadas
              5. Aplicaciones prácticas en el trabajo
              6. Recomendaciones para el crecimiento profesional

              Mantén un tono profesional pero cercano, y enfócate en el crecimiento y las oportunidades.`,
            },
            {
              role: "user",
              content: `Por favor interpreta mis resultados del test DISC:
              
              Resultados: ${JSON.stringify(testResults)}
              
              Quiero entender qué significan estos resultados para mi desarrollo profesional y personal.`,
            },
          ],
          temperature: 0.7,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        return data.message
      } else {
        throw new Error("Error en la respuesta de la API")
      }
    } catch (error) {
      console.error("Error generating AI interpretation:", error)
      return "Lo siento, no pude generar la interpretación de IA en este momento. Los resultados básicos están disponibles en las otras pestañas."
    }
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

      console.log("Generating AI interpretation...")
      const aiInterpretation = await generateAIInterpretation(testResults)

      // Create Supabase client only if environment variables are available
      if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)

        // Save to test_results table
        const { error: testError } = await supabase.from("test_results").insert({
          user_email: user.email,
          test_type: "personality",
          test_name: "DISC Assessment",
          results: {
            ...testResults,
            ai_interpretation: aiInterpretation,
          },
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

        // Save AI interpretation separately
        const { error: aiError } = await supabase.from("ai_interpretations").insert({
          user_email: user.email,
          test_name: "DISC Assessment",
          test_results: testResults,
          interpretation: aiInterpretation,
          model_version: "gpt-4o",
        })

        if (aiError) {
          console.error("Error saving AI interpretation:", aiError)
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
      }

      console.log("Test completed successfully, redirecting to results...")
      // Redirect to results
      router.push("/test/disc/results")
    } catch (error) {
      console.error("Error submitting test:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading state during SSR or while mounting
  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando test DISC...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Redirigiendo...</p>
        </div>
      </div>
    )
  }

  const progress = ((currentQuestion + 1) / discQuestions.length) * 100
  const question = discQuestions[currentQuestion]

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl">¡Test DISC Completado!</CardTitle>
            <CardDescription>
              Has respondido todas las preguntas. Ahora procesaremos tus resultados con IA.
            </CardDescription>
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
              </div>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-2 flex items-center justify-center">
                <Brain className="h-4 w-4 mr-2 text-blue-600" />
                Análisis con IA
              </h3>
              <p className="text-sm text-gray-600">
                Nuestro sistema de IA analizará tus respuestas para proporcionarte insights personalizados sobre tu
                estilo DISC.
              </p>
            </div>

            <Button onClick={submitTest} disabled={isSubmitting} className="w-full" size="lg">
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Generando análisis con IA...
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
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" onClick={handleBack} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Tests
          </Button>

          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900">DISC Assessment</h1>
            <Badge variant="secondary">
              {currentQuestion + 1} of {discQuestions.length}
            </Badge>
          </div>

          <Progress value={progress} className="w-full" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Question {currentQuestion + 1}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-700 text-lg leading-relaxed">{question.text}</p>

            <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer} className="space-y-3">
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                  <RadioGroupItem value={option.value} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-gray-700">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              <Button onClick={handleNext} disabled={!selectedAnswer} className="bg-gray-900 hover:bg-gray-800">
                {currentQuestion === discQuestions.length - 1 ? "Complete" : "Next"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
