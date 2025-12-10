"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, ArrowRight, Heart, CheckCircle, Clock } from "lucide-react"
import { useSession } from "@/components/session-wrapper"
import { UnifiedTestSystem } from "@/lib/unified-test-system"
import TestIntroScreen from "@/components/test-intro-screen"
import TestCompletionScreen from "@/components/test-completion-screen"

interface Question {
  id: number
  text: string
  options: Array<{
    text: string
    value: number
    label: string
  }>
}

const emotionalIntelligenceQuestions: Question[] = [
  {
    id: 1,
    text: "Puedo reconocer fácilmente cuando me siento estresado o abrumado.",
    options: [
      { text: "Nunca", value: 1, label: "Nunca" },
      { text: "Rara vez", value: 2, label: "Rara vez" },
      { text: "A veces", value: 3, label: "A veces" },
      { text: "A menudo", value: 4, label: "A menudo" },
      { text: "Siempre", value: 5, label: "Siempre" },
    ],
  },
  {
    id: 2,
    text: "Puedo notar cuando alguien está molesto, incluso si no dice nada.",
    options: [
      { text: "Nunca", value: 1, label: "Nunca" },
      { text: "Rara vez", value: 2, label: "Rara vez" },
      { text: "A veces", value: 3, label: "A veces" },
      { text: "A menudo", value: 4, label: "A menudo" },
      { text: "Siempre", value: 5, label: "Siempre" },
    ],
  },
  {
    id: 3,
    text: "Puedo manejar mis emociones efectivamente durante situaciones difíciles.",
    options: [
      { text: "Nunca", value: 1, label: "Nunca" },
      { text: "Rara vez", value: 2, label: "Rara vez" },
      { text: "A veces", value: 3, label: "A veces" },
      { text: "A menudo", value: 4, label: "A menudo" },
      { text: "Siempre", value: 5, label: "Siempre" },
    ],
  },
  {
    id: 4,
    text: "Soy bueno motivándome a mí mismo para lograr mis metas.",
    options: [
      { text: "Nunca", value: 1, label: "Nunca" },
      { text: "Rara vez", value: 2, label: "Rara vez" },
      { text: "A veces", value: 3, label: "A veces" },
      { text: "A menudo", value: 4, label: "A menudo" },
      { text: "Siempre", value: 5, label: "Siempre" },
    ],
  },
  {
    id: 5,
    text: "Puedo ayudar a otros a sentirse mejor cuando están molestos o frustrados.",
    options: [
      { text: "Nunca", value: 1, label: "Nunca" },
      { text: "Rara vez", value: 2, label: "Rara vez" },
      { text: "A veces", value: 3, label: "A veces" },
      { text: "A menudo", value: 4, label: "A menudo" },
      { text: "Siempre", value: 5, label: "Siempre" },
    ],
  },
  {
    id: 6,
    text: "Entiendo qué desencadena mis reacciones emocionales.",
    options: [
      { text: "Nunca", value: 1, label: "Nunca" },
      { text: "Rara vez", value: 2, label: "Rara vez" },
      { text: "A veces", value: 3, label: "A veces" },
      { text: "A menudo", value: 4, label: "A menudo" },
      { text: "Siempre", value: 5, label: "Siempre" },
    ],
  },
  {
    id: 7,
    text: "Puedo leer las emociones de las personas con precisión a través de su lenguaje corporal.",
    options: [
      { text: "Nunca", value: 1, label: "Nunca" },
      { text: "Rara vez", value: 2, label: "Rara vez" },
      { text: "A veces", value: 3, label: "A veces" },
      { text: "A menudo", value: 4, label: "A menudo" },
      { text: "Siempre", value: 5, label: "Siempre" },
    ],
  },
  {
    id: 8,
    text: "Me mantengo calmado bajo presión y no dejo que las emociones nublen mi juicio.",
    options: [
      { text: "Nunca", value: 1, label: "Nunca" },
      { text: "Rara vez", value: 2, label: "Rara vez" },
      { text: "A veces", value: 3, label: "A veces" },
      { text: "A menudo", value: 4, label: "A menudo" },
      { text: "Siempre", value: 5, label: "Siempre" },
    ],
  },
  {
    id: 9,
    text: "Puedo recuperarme rápidamente de contratiempos y decepciones.",
    options: [
      { text: "Nunca", value: 1, label: "Nunca" },
      { text: "Rara vez", value: 2, label: "Rara vez" },
      { text: "A veces", value: 3, label: "A veces" },
      { text: "A menudo", value: 4, label: "A menudo" },
      { text: "Siempre", value: 5, label: "Siempre" },
    ],
  },
  {
    id: 10,
    text: "Soy hábil para construir rapport y conectar con otros.",
    options: [
      { text: "Nunca", value: 1, label: "Nunca" },
      { text: "Rara vez", value: 2, label: "Rara vez" },
      { text: "A veces", value: 3, label: "A veces" },
      { text: "A menudo", value: 4, label: "A menudo" },
      { text: "Siempre", value: 5, label: "Siempre" },
    ],
  },
  {
    id: 11,
    text: "Puedo evaluar con precisión mis propias fortalezas y debilidades.",
    options: [
      { text: "Nunca", value: 1, label: "Nunca" },
      { text: "Rara vez", value: 2, label: "Rara vez" },
      { text: "A veces", value: 3, label: "A veces" },
      { text: "A menudo", value: 4, label: "A menudo" },
      { text: "Siempre", value: 5, label: "Siempre" },
    ],
  },
  {
    id: 12,
    text: "Noto cuando las palabras de alguien no coinciden con sus emociones.",
    options: [
      { text: "Nunca", value: 1, label: "Nunca" },
      { text: "Rara vez", value: 2, label: "Rara vez" },
      { text: "A veces", value: 3, label: "A veces" },
      { text: "A menudo", value: 4, label: "A menudo" },
      { text: "Siempre", value: 5, label: "Siempre" },
    ],
  },
  {
    id: 13,
    text: "Puedo controlar mis impulsos y pensar antes de actuar.",
    options: [
      { text: "Nunca", value: 1, label: "Nunca" },
      { text: "Rara vez", value: 2, label: "Rara vez" },
      { text: "A veces", value: 3, label: "A veces" },
      { text: "A menudo", value: 4, label: "A menudo" },
      { text: "Siempre", value: 5, label: "Siempre" },
    ],
  },
  {
    id: 14,
    text: "Mantengo el optimismo incluso cuando enfrento desafíos.",
    options: [
      { text: "Nunca", value: 1, label: "Nunca" },
      { text: "Rara vez", value: 2, label: "Rara vez" },
      { text: "A veces", value: 3, label: "A veces" },
      { text: "A menudo", value: 4, label: "A menudo" },
      { text: "Siempre", value: 5, label: "Siempre" },
    ],
  },
  {
    id: 15,
    text: "Puedo influir en las emociones de otros de manera positiva.",
    options: [
      { text: "Nunca", value: 1, label: "Nunca" },
      { text: "Rara vez", value: 2, label: "Rara vez" },
      { text: "A veces", value: 3, label: "A veces" },
      { text: "A menudo", value: 4, label: "A menudo" },
      { text: "Siempre", value: 5, label: "Siempre" },
    ],
  },
  {
    id: 16,
    text: "Soy consciente de cómo mis emociones afectan mi comportamiento y decisiones.",
    options: [
      { text: "Nunca", value: 1, label: "Nunca" },
      { text: "Rara vez", value: 2, label: "Rara vez" },
      { text: "A veces", value: 3, label: "A veces" },
      { text: "A menudo", value: 4, label: "A menudo" },
      { text: "Siempre", value: 5, label: "Siempre" },
    ],
  },
  {
    id: 17,
    text: "Puedo percibir el clima emocional de una sala cuando entro en ella.",
    options: [
      { text: "Nunca", value: 1, label: "Nunca" },
      { text: "Rara vez", value: 2, label: "Rara vez" },
      { text: "A veces", value: 3, label: "A veces" },
      { text: "A menudo", value: 4, label: "A menudo" },
      { text: "Siempre", value: 5, label: "Siempre" },
    ],
  },
  {
    id: 18,
    text: "Puedo adaptar mi estilo de comunicación según las necesidades emocionales de otros.",
    options: [
      { text: "Nunca", value: 1, label: "Nunca" },
      { text: "Rara vez", value: 2, label: "Rara vez" },
      { text: "A veces", value: 3, label: "A veces" },
      { text: "A menudo", value: 4, label: "A menudo" },
      { text: "Siempre", value: 5, label: "Siempre" },
    ],
  },
  {
    id: 19,
    text: "Uso el diálogo interno positivo para manejar emociones difíciles.",
    options: [
      { text: "Nunca", value: 1, label: "Nunca" },
      { text: "Rara vez", value: 2, label: "Rara vez" },
      { text: "A veces", value: 3, label: "A veces" },
      { text: "A menudo", value: 4, label: "A menudo" },
      { text: "Siempre", value: 5, label: "Siempre" },
    ],
  },
  {
    id: 20,
    text: "Puedo resolver conflictos comprendiendo las perspectivas emocionales de todas las partes.",
    options: [
      { text: "Nunca", value: 1, label: "Nunca" },
      { text: "Rara vez", value: 2, label: "Rara vez" },
      { text: "A veces", value: 3, label: "A veces" },
      { text: "A menudo", value: 4, label: "A menudo" },
      { text: "Siempre", value: 5, label: "Siempre" },
    ],
  },
]

export default function EmotionalIntelligenceTest() {
  const [mounted, setMounted] = useState(false)
  const [showIntro, setShowIntro] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [startTime] = useState(Date.now())
  const [showCompletion, setShowCompletion] = useState(false)
  const [completionResults, setCompletionResults] = useState<any>(null)

  const router = useRouter()
  const { user, isLoading } = useSession()
  const { toast } = useToast()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !isLoading && !user) {
      router.push("/auth")
    }
  }, [user, router, isLoading, mounted])

  useEffect(() => {
    // Load existing answer for current question
    setSelectedAnswer(answers[emotionalIntelligenceQuestions[currentQuestion]?.id] || null)
  }, [currentQuestion, answers])

  const handleNext = () => {
    if (selectedAnswer !== null) {
      const updatedAnswers = { ...answers, [emotionalIntelligenceQuestions[currentQuestion].id]: selectedAnswer }
      setAnswers(updatedAnswers)

      if (currentQuestion < emotionalIntelligenceQuestions.length - 1) {
        setCurrentQuestion((prev) => prev + 1)
      } else {
        // Submit test with updated answers immediately
        submitTestWithAnswers(updatedAnswers)
      }
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const submitTestWithAnswers = async (finalAnswers: Record<number, number>) => {
    if (Object.keys(finalAnswers).length < emotionalIntelligenceQuestions.length) {
      alert("Por favor responde todas las preguntas antes de continuar.")
      return
    }

    setIsSubmitting(true)
    const endTime = Date.now()
    const duration = Math.round((endTime - startTime) / 60000)

    const totalScore = Object.values(finalAnswers).reduce((sum, score) => sum + score, 0)
    const maxScore = emotionalIntelligenceQuestions.length * 5
    const percentage = Math.round((totalScore / maxScore) * 100)

    const results = {
      total_score: totalScore,
      max_score: maxScore,
      percentage,
      level: percentage >= 80 ? "Alto" : percentage >= 60 ? "Moderado" : percentage >= 40 ? "En Desarrollo" : "Bajo",
      duration_minutes: duration,
      completion_date: new Date().toISOString(),
      answers: finalAnswers,
      competency_scores: {
        autoconciencia_emocional: Math.round(
          ((finalAnswers[1] + finalAnswers[6] + finalAnswers[11] + finalAnswers[16]) / 20) * 100,
        ),
        autorregulacion_impulsos: Math.round(
          ((finalAnswers[3] + finalAnswers[8] + finalAnswers[13] + finalAnswers[19]) / 20) * 100,
        ),
        motivacion_intrinsic: Math.round(((finalAnswers[4] + finalAnswers[9] + finalAnswers[14]) / 15) * 100),
        empatia_comprehension_social: Math.round(
          ((finalAnswers[2] + finalAnswers[7] + finalAnswers[12] + finalAnswers[17]) / 20) * 100,
        ),
        habilidades_sociales_relaciones: Math.round(
          ((finalAnswers[5] + finalAnswers[10] + finalAnswers[15] + finalAnswers[20]) / 20) * 100,
        ),
      },
      overall_score: percentage,
    }

    try {
      console.log("[v0] Guardando resultados del EI en la base de datos...")

      if (!user?.email) {
        throw new Error("No se encontró el email del usuario")
      }

      const saveResult = await UnifiedTestSystem.saveTestResult(user.email, "Emotional Intelligence", results, duration)

      if (!saveResult.success || !saveResult.savedToDatabase) {
        console.error("[v0] Fallo al guardar en la base de datos:", saveResult.error)
        toast({
          title: "Error Crítico de Guardado",
          description: `No se pudieron guardar tus resultados en la base de datos: ${saveResult.error || "Error desconocido"}. Por favor contacta soporte.`,
          variant: "destructive",
          duration: 10000,
        })
        setIsSubmitting(false)
        return
      }

      console.log("[v0] Resultados guardados exitosamente en la base de datos")

      setCompletionResults(results)
      setShowCompletion(true)
      setIsSubmitting(false)
    } catch (error: any) {
      console.error("[v0] Error al enviar el test:", error)
      toast({
        title: "Error al Guardar Resultados",
        description: `No se pudieron guardar tus resultados: ${error.message}. Por favor contacta soporte.`,
        variant: "destructive",
        duration: 10000,
      })
      setIsSubmitting(false)
    }
  }

  if (showIntro) {
    return (
      <TestIntroScreen
        testName="Inteligencia Emocional Despega"
        testDescription="Mide tu capacidad para reconocer, comprender y gestionar emociones propias y ajenas."
        whatItMeasures={[
          "Autoconciencia emocional",
          "Autorregulación y control de impulsos",
          "Motivación intrínseca",
          "Empatía y comprensión social",
          "Habilidades sociales y gestión de relaciones",
        ]}
        whyRelevant="La inteligencia emocional es el predictor #1 de éxito profesional y personal. Desarrollarla te permite tomar mejores decisiones, construir relaciones más fuertes y liderar con efectividad."
        estimatedTime={5}
        questionCount={20}
        onStart={() => setShowIntro(false)}
        onBack={() => router.push("/test")}
      />
    )
  }

  if (showCompletion && completionResults) {
    const getInsight = (score: number) => {
      if (score >= 80)
        return "Tienes una inteligencia emocional excepcional. Eres capaz de navegar situaciones complejas con empatía y autorregulación."
      if (score >= 60)
        return "Tienes buenas habilidades emocionales. Con práctica enfocada, puedes alcanzar niveles excepcionales."
      if (score >= 40)
        return "Estás desarrollando tus habilidades emocionales. Hay un gran potencial de crecimiento con entrenamiento estructurado."
      return "Tienes una oportunidad única de transformar tu vida desarrollando tu inteligencia emocional de forma sistemática."
    }

    return (
      <TestCompletionScreen
        testName="Inteligencia Emocional Despega"
        score={completionResults.overall_score}
        level={completionResults.level}
        insight={getInsight(completionResults.overall_score)}
        onViewFullReport={() => router.push("/test/emotional-intelligence/results")}
        onTalkToCoach={() => router.push("/coach")}
      />
    )
  }

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <p className="text-gray-600">Cargando evaluación...</p>
            </div>
          </CardContent>
        </Card>
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

  const progress = ((currentQuestion + 1) / emotionalIntelligenceQuestions.length) * 100
  const question = emotionalIntelligenceQuestions[currentQuestion]

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.push("/test")} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver a Pruebas
          </Button>

          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Inteligencia Emocional Despega</h1>
              <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                <Heart className="h-4 w-4" />
                <span>Reconocer, comprender y gestionar emociones</span>
              </div>
            </div>
            <Badge variant="secondary">
              {currentQuestion + 1} de {emotionalIntelligenceQuestions.length}
            </Badge>
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progreso</span>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="h-4 w-4" />
              <span>{Math.round((Date.now() - startTime) / 60000)} min</span>
            </div>
          </div>
          <Progress value={progress} className="w-full" />
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Pregunta {currentQuestion + 1}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-gray-700 text-lg leading-relaxed">{question.text}</p>

            <RadioGroup
              value={selectedAnswer?.toString() || ""}
              onValueChange={(value) => setSelectedAnswer(Number.parseInt(value))}
              className="space-y-3"
            >
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50">
                  <RadioGroupItem value={option.value.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-gray-700">
                    {option.text}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <div className="flex justify-between pt-6">
              <Button variant="outline" onClick={handlePrevious} disabled={currentQuestion === 0}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>

              <Button
                onClick={handleNext}
                disabled={selectedAnswer === null || isSubmitting}
                className="bg-gray-900 hover:bg-gray-800"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Procesando...
                  </>
                ) : currentQuestion === emotionalIntelligenceQuestions.length - 1 ? (
                  <>
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Completar
                  </>
                ) : (
                  <>
                    Siguiente
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Progress Indicator */}
        <div className="mt-6 text-center">
          <div className="flex justify-center space-x-1">
            {emotionalIntelligenceQuestions.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index <= currentQuestion
                    ? "bg-gray-900"
                    : answers[emotionalIntelligenceQuestions[index].id]
                      ? "bg-gray-300"
                      : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {Object.keys(answers).length} de {emotionalIntelligenceQuestions.length} preguntas respondidas
          </p>
        </div>
      </div>
    </div>
  )
}
