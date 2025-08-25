"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { Brain, Clock, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"

interface Question {
  id: number
  text: string
  type: "likert" | "open" | "scenario"
  factor: "O" | "C" | "E" | "A" | "N" // Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism
  reverse?: boolean
  options?: string[]
}

const bigFiveQuestions: Question[] = [
  // Openness to Experience (O)
  { id: 1, text: "Me gusta explorar nuevas ideas y conceptos", type: "likert", factor: "O" },
  { id: 2, text: "Disfruto de actividades artísticas y creativas", type: "likert", factor: "O" },
  { id: 3, text: "Prefiero seguir rutinas establecidas", type: "likert", factor: "O", reverse: true },
  { id: 4, text: "Me interesa aprender sobre diferentes culturas", type: "likert", factor: "O" },
  { id: 5, text: "Tengo una imaginación muy activa", type: "likert", factor: "O" },
  { id: 6, text: "Me gusta experimentar con nuevos enfoques en el trabajo", type: "likert", factor: "O" },
  { id: 7, text: "Prefiero métodos tradicionales y probados", type: "likert", factor: "O", reverse: true },
  { id: 8, text: "Me fascina la filosofía y las ideas abstractas", type: "likert", factor: "O" },
  { id: 9, text: "Busco activamente nuevas experiencias", type: "likert", factor: "O" },

  // Conscientiousness (C)
  { id: 10, text: "Siempre cumplo con mis compromisos y plazos", type: "likert", factor: "C" },
  { id: 11, text: "Soy muy organizado en mi trabajo y vida personal", type: "likert", factor: "C" },
  { id: 12, text: "A menudo dejo las cosas para el último minuto", type: "likert", factor: "C", reverse: true },
  { id: 13, text: "Presto atención a los detalles importantes", type: "likert", factor: "C" },
  { id: 14, text: "Tengo autodisciplina para completar tareas difíciles", type: "likert", factor: "C" },
  { id: 15, text: "Mi espacio de trabajo suele estar desordenado", type: "likert", factor: "C", reverse: true },
  { id: 16, text: "Planifico cuidadosamente antes de actuar", type: "likert", factor: "C" },
  { id: 17, text: "Soy persistente cuando enfrento obstáculos", type: "likert", factor: "C" },
  { id: 18, text: "Me esfuerzo por la excelencia en todo lo que hago", type: "likert", factor: "C" },

  // Extraversion (E)
  { id: 19, text: "Me siento energizado cuando estoy con otras personas", type: "likert", factor: "E" },
  { id: 20, text: "Prefiero trabajar solo que en equipo", type: "likert", factor: "E", reverse: true },
  { id: 21, text: "Soy el alma de las fiestas y reuniones sociales", type: "likert", factor: "E" },
  { id: 22, text: "Me gusta ser el centro de atención", type: "likert", factor: "E" },
  { id: 23, text: "Prefiero actividades tranquilas y reflexivas", type: "likert", factor: "E", reverse: true },
  { id: 24, text: "Inicio conversaciones con extraños fácilmente", type: "likert", factor: "E" },
  { id: 25, text: "Me siento cómodo hablando en público", type: "likert", factor: "E" },
  { id: 26, text: "Busco activamente interacciones sociales", type: "likert", factor: "E" },
  { id: 27, text: "Tengo mucha energía y entusiasmo", type: "likert", factor: "E" },

  // Agreeableness (A)
  { id: 28, text: "Siempre trato de ayudar a otros cuando puedo", type: "likert", factor: "A" },
  { id: 29, text: "Confío en las buenas intenciones de las personas", type: "likert", factor: "A" },
  { id: 30, text: "Puedo ser bastante competitivo y agresivo", type: "likert", factor: "A", reverse: true },
  { id: 31, text: "Me preocupo genuinamente por el bienestar de otros", type: "likert", factor: "A" },
  { id: 32, text: "Prefiero cooperar que competir", type: "likert", factor: "A" },
  { id: 33, text: "A veces soy demasiado crítico con otros", type: "likert", factor: "A", reverse: true },
  { id: 34, text: "Soy empático y comprensivo", type: "likert", factor: "A" },
  { id: 35, text: "Trato de ver lo mejor en las personas", type: "likert", factor: "A" },
  { id: 36, text: "Perdono fácilmente los errores de otros", type: "likert", factor: "A" },

  // Neuroticism (N)
  { id: 37, text: "Me preocupo frecuentemente por cosas pequeñas", type: "likert", factor: "N" },
  { id: 38, text: "Mantengo la calma bajo presión", type: "likert", factor: "N", reverse: true },
  { id: 39, text: "Mis emociones cambian rápidamente", type: "likert", factor: "N" },
  { id: 40, text: "Me siento ansioso en situaciones nuevas", type: "likert", factor: "N" },
  { id: 41, text: "Soy emocionalmente estable", type: "likert", factor: "N", reverse: true },
  { id: 42, text: "Me estreso fácilmente", type: "likert", factor: "N" },
  { id: 43, text: "Rara vez me siento triste o deprimido", type: "likert", factor: "N", reverse: true },
  { id: 44, text: "Manejo bien las situaciones estresantes", type: "likert", factor: "N", reverse: true },
]

const likertOptions = [
  { value: 1, label: "Totalmente en desacuerdo" },
  { value: 2, label: "En desacuerdo" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "De acuerdo" },
  { value: 5, label: "Totalmente de acuerdo" },
]

export default function BigFiveTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [startTime, setStartTime] = useState<Date>(new Date())
  const [userEmail, setUserEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const router = useRouter()
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  useEffect(() => {
    checkUserSession()
  }, [])

  const checkUserSession = async () => {
    const localSession = localStorage.getItem("dtc_session")
    if (localSession) {
      try {
        const sessionData = JSON.parse(localSession)
        if (sessionData.authenticated && sessionData.user) {
          setUserEmail(sessionData.user.email)
          return
        }
      } catch (error) {
        console.log("Invalid local session")
      }
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email || "")
      } else {
        router.push("/auth")
      }
    } catch (error) {
      router.push("/auth")
    }
  }

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const calculateScores = () => {
    const scores = { O: 0, C: 0, E: 0, A: 0, N: 0 }
    const counts = { O: 0, C: 0, E: 0, A: 0, N: 0 }

    bigFiveQuestions.forEach((question) => {
      const answer = answers[question.id]
      if (answer !== undefined) {
        const score = question.reverse ? 6 - answer : answer
        scores[question.factor] += score
        counts[question.factor]++
      }
    })

    // Convert to percentages (1-5 scale to 0-100)
    const percentageScores = {
      O: Math.round(((scores.O / counts.O - 1) / 4) * 100),
      C: Math.round(((scores.C / counts.C - 1) / 4) * 100),
      E: Math.round(((scores.E / counts.E - 1) / 4) * 100),
      A: Math.round(((scores.A / counts.A - 1) / 4) * 100),
      N: Math.round(((scores.N / counts.N - 1) / 4) * 100),
    }

    return percentageScores
  }

  const getPersonalityTraits = (scores: Record<string, number>) => {
    const traits = []
    if (scores.O > 70) traits.push("Abierto a experiencias")
    if (scores.C > 70) traits.push("Consciente y organizado")
    if (scores.E > 70) traits.push("Extrovertido")
    if (scores.A > 70) traits.push("Amable y cooperativo")
    if (scores.N < 30) traits.push("Emocionalmente estable")
    return traits
  }

  const generateAnalysis = (scores: Record<string, number>) => {
    return {
      openness:
        scores.O > 70
          ? "Alto nivel de creatividad y curiosidad intelectual"
          : scores.O > 40
            ? "Equilibrio entre tradición e innovación"
            : "Preferencia por métodos establecidos y rutinas",
      conscientiousness:
        scores.C > 70
          ? "Muy organizado, disciplinado y confiable"
          : scores.C > 40
            ? "Moderadamente organizado y disciplinado"
            : "Enfoque más flexible y espontáneo",
      extraversion:
        scores.E > 70
          ? "Muy sociable, enérgico y asertivo"
          : scores.E > 40
            ? "Equilibrio entre sociabilidad e introspección"
            : "Preferencia por actividades tranquilas y reflexivas",
      agreeableness:
        scores.A > 70
          ? "Muy cooperativo, empático y confiado"
          : scores.A > 40
            ? "Equilibrio entre cooperación y asertividad"
            : "Más competitivo y directo en las interacciones",
      neuroticism:
        scores.N > 70
          ? "Tendencia a experimentar emociones negativas"
          : scores.N > 40
            ? "Estabilidad emocional moderada"
            : "Muy estable emocionalmente y resiliente",
    }
  }

  const submitTest = async () => {
    if (Object.keys(answers).length < bigFiveQuestions.length) {
      alert("Por favor responde todas las preguntas antes de continuar.")
      return
    }

    setIsSubmitting(true)
    const endTime = new Date()
    const duration = Math.round((endTime.getTime() - startTime.getTime()) / 60000)
    const scores = calculateScores()
    const traits = getPersonalityTraits(scores)
    const analysis = generateAnalysis(scores)
    const overallScore = Math.round((scores.O + scores.C + scores.E + scores.A + (100 - scores.N)) / 5)

    const results = {
      ...scores,
      primary_traits: traits,
      detailed_analysis: analysis,
      completion_date: endTime.toISOString(),
      total_questions: bigFiveQuestions.length,
      answered_questions: Object.keys(answers).length,
    }

    try {
      // Save to database
      const { error } = await supabase.from("test_results").insert({
        user_email: userEmail,
        test_type: "personality",
        test_name: "Big Five",
        test_category: "personality",
        results: results,
        score: overallScore,
        duration_minutes: duration,
        completed_at: endTime.toISOString(),
      })

      if (error) {
        console.error("Error saving test results:", error)
      }

      // Add activity
      await supabase.from("user_activities").insert({
        user_email: userEmail,
        activity_type: "test_completed",
        activity_description: `Completó el Test Big Five - Puntuación: ${overallScore}%`,
        xp_earned: 75,
      })

      // Update user profile
      await supabase.rpc("increment_user_stats", {
        user_email: userEmail,
        tests_increment: 1,
        xp_increment: 75,
      })

      // Redirect to results
      router.push("/test/big-five/results")
    } catch (error) {
      console.error("Error submitting test:", error)
      alert("Error al guardar los resultados. Por favor intenta de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = ((currentQuestion + 1) / bigFiveQuestions.length) * 100
  const question = bigFiveQuestions[currentQuestion]
  const canProceed = answers[question.id] !== undefined

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Dashboard
          </Button>
          <Badge variant="secondary" className="text-sm">
            <Brain className="h-4 w-4 mr-1" />
            Test Big Five
          </Badge>
        </div>

        {/* Progress */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-purple-800">Test de Personalidad Big Five</h2>
                <p className="text-purple-600">
                  Pregunta {currentQuestion + 1} de {bigFiveQuestions.length}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>~15 minutos</span>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Question */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">{question.text}</CardTitle>
            <CardDescription>
              Selecciona la opción que mejor describa tu comportamiento o preferencia habitual
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup
              value={answers[question.id]?.toString() || ""}
              onValueChange={(value) => handleAnswer(question.id, Number.parseInt(value))}
            >
              {likertOptions.map((option) => (
                <div key={option.value} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-purple-50">
                  <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} />
                  <Label htmlFor={`option-${option.value}`} className="flex-1 cursor-pointer">
                    {option.label}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>

          {currentQuestion === bigFiveQuestions.length - 1 ? (
            <Button
              onClick={submitTest}
              disabled={!canProceed || isSubmitting}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Procesando...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Finalizar Test
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentQuestion(Math.min(bigFiveQuestions.length - 1, currentQuestion + 1))}
              disabled={!canProceed}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Siguiente
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Question Counter */}
        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-1">
            {bigFiveQuestions.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index <= currentQuestion
                    ? "bg-purple-600"
                    : answers[bigFiveQuestions[index].id]
                      ? "bg-purple-300"
                      : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {Object.keys(answers).length} de {bigFiveQuestions.length} preguntas respondidas
          </p>
        </div>
      </div>
    </div>
  )
}
