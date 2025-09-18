"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { createClient } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { Brain, Clock, ArrowLeft, ArrowRight, CheckCircle, Sparkles, MessageSquare } from "lucide-react"

interface Question {
  id: number
  text: string
  type: "likert" | "open" | "scenario"
  factor: "O" | "C" | "E" | "A" | "N"
  reverse?: boolean
  options?: string[]
}

const bigFiveQuestions: Question[] = [
  // Openness to Experience (O) - Mixed questions
  { id: 1, text: "Me gusta explorar nuevas ideas y conceptos", type: "likert", factor: "O" },
  {
    id: 2,
    text: "¿Cómo te describes en términos de creatividad e innovación? Describe una situación donde hayas aplicado tu creatividad.",
    type: "open",
    factor: "O",
  },
  { id: 3, text: "Disfruto de actividades artísticas y creativas", type: "likert", factor: "O" },
  { id: 4, text: "Prefiero seguir rutinas establecidas", type: "likert", factor: "O", reverse: true },
  { id: 5, text: "Me interesa aprender sobre diferentes culturas", type: "likert", factor: "O" },
  { id: 6, text: "Tengo una imaginación muy activa", type: "likert", factor: "O" },

  // Conscientiousness (C) - Mixed questions
  { id: 7, text: "Siempre cumplo con mis compromisos y plazos", type: "likert", factor: "C" },
  {
    id: 8,
    text: "¿Qué tan organizado eres en tu vida diaria y trabajo? Describe tu sistema de organización personal.",
    type: "open",
    factor: "C",
  },
  { id: 9, text: "Soy muy organizado en mi trabajo y vida personal", type: "likert", factor: "C" },
  { id: 10, text: "A menudo dejo las cosas para el último minuto", type: "likert", factor: "C", reverse: true },
  { id: 11, text: "Presto atención a los detalles importantes", type: "likert", factor: "C" },
  { id: 12, text: "Tengo autodisciplina para completar tareas difíciles", type: "likert", factor: "C" },

  // Extraversion (E) - Mixed questions
  { id: 13, text: "Me siento energizado cuando estoy con otras personas", type: "likert", factor: "E" },
  {
    id: 14,
    text: "¿Cómo te sientes en situaciones sociales y de liderazgo? Describe tu estilo de interacción.",
    type: "open",
    factor: "E",
  },
  { id: 15, text: "Prefiero trabajar solo que en equipo", type: "likert", factor: "E", reverse: true },
  { id: 16, text: "Soy el alma de las fiestas y reuniones sociales", type: "likert", factor: "E" },
  { id: 17, text: "Me gusta ser el centro de atención", type: "likert", factor: "E" },
  { id: 18, text: "Inicio conversaciones con extraños fácilmente", type: "likert", factor: "E" },

  // Agreeableness (A) - Mixed questions
  { id: 19, text: "Siempre trato de ayudar a otros cuando puedo", type: "likert", factor: "A" },
  {
    id: 20,
    text: "¿Cómo manejas los conflictos y la cooperación con otros? Describe tu enfoque.",
    type: "open",
    factor: "A",
  },
  { id: 21, text: "Confío en las buenas intenciones de las personas", type: "likert", factor: "A" },
  { id: 22, text: "Puedo ser bastante competitivo y agresivo", type: "likert", factor: "A", reverse: true },
  { id: 23, text: "Me preocupo genuinamente por el bienestar de otros", type: "likert", factor: "A" },
  { id: 24, text: "Prefiero cooperar que competir", type: "likert", factor: "A" },

  // Neuroticism (N) - Mixed questions
  { id: 25, text: "Me preocupo frecuentemente por cosas pequeñas", type: "likert", factor: "N" },
  {
    id: 26,
    text: "¿Cómo respondes al estrés y la presión? Describe tus estrategias de manejo.",
    type: "open",
    factor: "N",
  },
  { id: 27, text: "Mantengo la calma bajo presión", type: "likert", factor: "N", reverse: true },
  { id: 28, text: "Mis emociones cambian rápidamente", type: "likert", factor: "N" },
  { id: 29, text: "Me siento ansioso en situaciones nuevas", type: "likert", factor: "N" },
  { id: 30, text: "Soy emocionalmente estable", type: "likert", factor: "N", reverse: true },
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
  const [answers, setAnswers] = useState<Record<number, number | string>>({})
  const [startTime, setStartTime] = useState<Date>(new Date())
  const [userEmail, setUserEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isGeneratingAI, setIsGeneratingAI] = useState(false)

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

  const handleLikertAnswer = (questionId: number, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const handleOpenAnswer = (questionId: number, value: string) => {
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
      if (answer !== undefined && question.type === "likert") {
        const numericAnswer = typeof answer === "number" ? answer : 3
        const score = question.reverse ? 6 - numericAnswer : numericAnswer
        scores[question.factor] += score
        counts[question.factor]++
      }
    })

    // Convert to percentages (1-5 scale to 0-100)
    const percentageScores = {
      O: Math.round(((scores.O / Math.max(counts.O, 1) - 1) / 4) * 100),
      C: Math.round(((scores.C / Math.max(counts.C, 1) - 1) / 4) * 100),
      E: Math.round(((scores.E / Math.max(counts.E, 1) - 1) / 4) * 100),
      A: Math.round(((scores.A / Math.max(counts.A, 1) - 1) / 4) * 100),
      N: Math.round(((scores.N / Math.max(counts.N, 1) - 1) / 4) * 100),
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

  const generateAIAnalysis = async (testResults: any) => {
    try {
      setIsGeneratingAI(true)
      console.log("🧠 Generating AI analysis for Big Five results...")

      const response = await fetch("/api/ai-coach", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `Eres un psicólogo organizacional experto en el modelo Big Five. Analiza los siguientes resultados del test Big Five y proporciona una interpretación detallada y personalizada.

              Debes analizar:
              1. Puntuaciones en cada factor (Apertura, Responsabilidad, Extraversión, Amabilidad, Neuroticismo)
              2. Combinaciones únicas de rasgos
              3. Implicaciones para el desarrollo profesional
              4. Fortalezas específicas identificadas
              5. Áreas de desarrollo recomendadas
              6. Compatibilidad en equipos de trabajo
              7. Roles profesionales ideales

              Proporciona una interpretación de 400-600 palabras que sea:
              - Específica y personalizada
              - Constructiva y motivadora
              - Práctica y aplicable
              - Profesional pero accesible`,
            },
            {
              role: "user",
              content: `Por favor analiza mis resultados del Test Big Five:

              Puntuaciones:
              - Apertura a la Experiencia: ${testResults.O}%
              - Responsabilidad: ${testResults.C}%
              - Extraversión: ${testResults.E}%
              - Amabilidad: ${testResults.A}%
              - Neuroticismo: ${testResults.N}%

              Rasgos principales identificados: ${testResults.primary_traits.join(", ")}
              
              Respuestas abiertas del usuario:
              ${bigFiveQuestions
                .filter((q) => q.type === "open")
                .map((q) => `${q.text}: ${answers[q.id] || "No respondida"}`)
                .join("\n")}

              Proporciona un análisis completo y personalizado.`,
            },
          ],
          temperature: 0.7,
        }),
      })

      const data = await response.json()
      console.log("✅ AI analysis generated successfully")
      return data.message || "Análisis generado correctamente"
    } catch (error) {
      console.error("❌ Error generating AI analysis:", error)
      return "No se pudo generar el análisis con IA en este momento. Los resultados básicos están disponibles en la pestaña de Análisis."
    } finally {
      setIsGeneratingAI(false)
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
      secondary_traits: traits.slice(0, 3),
      detailed_analysis: analysis,
      personality_summary: `Perfil Big Five con ${traits.length} rasgos dominantes identificados.`,
      career_recommendations: [
        "Director de Innovación",
        "Consultor de Estrategia",
        "Product Manager",
        "Arquitecto de Soluciones",
        "Líder de Transformación Digital",
      ],
      development_areas: [
        "Desarrollar mayor flexibilidad en situaciones imprevistas",
        "Mejorar habilidades de negociación en conflictos",
        "Fortalecer la paciencia con procesos lentos",
      ],
      strengths: [
        "Excelente capacidad para generar ideas innovadoras",
        "Alta disciplina y organización personal",
        "Facilidad para conectar con diferentes tipos de personas",
        "Estabilidad emocional en situaciones de presión",
      ],
      open_responses: bigFiveQuestions
        .filter((q) => q.type === "open")
        .reduce((acc, q) => ({ ...acc, [q.id]: answers[q.id] }), {}),
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

      // Generate AI analysis
      const aiAnalysis = await generateAIAnalysis(results)

      // Save AI interpretation
      if (aiAnalysis) {
        await supabase.from("ai_interpretations").insert({
          user_email: userEmail,
          test_name: "Big Five",
          test_results: results,
          interpretation: aiAnalysis,
          generated_at: endTime.toISOString(),
          model_version: "gpt-4o",
        })
      }

      // Add activity
      await supabase.from("user_activities").insert({
        user_email: userEmail,
        activity_type: "test_completed",
        activity_description: `Completó el Test Big Five con análisis IA - Puntuación: ${overallScore}%`,
        xp_earned: 100,
      })

      // Update user profile
      await supabase.rpc("increment_user_stats", {
        user_email: userEmail,
        tests_increment: 1,
        xp_increment: 100,
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
  const canProceed = answers[question.id] !== undefined && answers[question.id] !== ""

  return (
    <div className="min-h-screen bg-secondary">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Dashboard
          </Button>
          <Badge variant="secondary" className="text-sm">
            <Brain className="h-4 w-4 mr-1" />
            Test Big Five con IA
          </Badge>
        </div>

        {/* Progress */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-neutral-800">Test de Personalidad Big Five</h2>
                <p className="text-neutral-600">
                  Pregunta {currentQuestion + 1} de {bigFiveQuestions.length}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 text-sm text-neutral-600">
                  <Clock className="h-4 w-4" />
                  <span>~20 minutos</span>
                </div>
                <Badge variant="outline" className="bg-neutral-100 text-neutral-700">
                  <Sparkles className="h-3 w-3 mr-1" />
                  Con Análisis IA
                </Badge>
              </div>
            </div>
            <Progress value={progress} className="h-2 bg-neutral-200" />
          </CardContent>
        </Card>

        {/* Question */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{question.text}</CardTitle>
              <Badge variant={question.type === "open" ? "default" : "secondary"}>
                {question.type === "open" ? (
                  <>
                    <MessageSquare className="h-3 w-3 mr-1" />
                    Respuesta Abierta
                  </>
                ) : (
                  "Escala Likert"
                )}
              </Badge>
            </div>
            <CardDescription>
              {question.type === "open"
                ? "Describe tu experiencia o perspectiva en detalle (mínimo 50 caracteres)"
                : "Selecciona la opción que mejor describa tu comportamiento o preferencia habitual"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {question.type === "likert" ? (
              <RadioGroup
                value={answers[question.id]?.toString() || ""}
                onValueChange={(value) => handleLikertAnswer(question.id, Number.parseInt(value))}
              >
                {likertOptions.map((option) => (
                  <div key={option.value} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-neutral-50">
                    <RadioGroupItem value={option.value.toString()} id={`option-${option.value}`} />
                    <Label htmlFor={`option-${option.value}`} className="flex-1 cursor-pointer">
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            ) : (
              <div className="space-y-4">
                <Textarea
                  placeholder="Describe tu experiencia, perspectiva o enfoque en esta área..."
                  value={(answers[question.id] as string) || ""}
                  onChange={(e) => handleOpenAnswer(question.id, e.target.value)}
                  className="min-h-[120px] resize-none"
                />
                <div className="flex items-center justify-between text-sm text-neutral-500">
                  <span>{((answers[question.id] as string) || "").length} caracteres (mínimo 50 requeridos)</span>
                  {((answers[question.id] as string) || "").length >= 50 && (
                    <Badge variant="secondary" className="bg-green-100 text-green-700">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completa
                    </Badge>
                  )}
                </div>
              </div>
            )}
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
              className="bg-foreground hover:bg-foreground/90"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {isGeneratingAI ? "Generando análisis IA..." : "Procesando..."}
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
              className="bg-foreground hover:bg-foreground/90"
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
                    ? "bg-neutral-800"
                    : answers[bigFiveQuestions[index].id]
                      ? "bg-neutral-300"
                      : "bg-neutral-200"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-neutral-600 mt-2">
            {Object.keys(answers).length} de {bigFiveQuestions.length} preguntas respondidas
          </p>
        </div>

        {/* AI Analysis Info */}
        {isGeneratingAI && (
          <Card className="mt-6 border-neutral-200 bg-neutral-50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-neutral-800"></div>
                <div>
                  <p className="font-semibold text-neutral-800">Generando análisis con IA</p>
                  <p className="text-sm text-neutral-600">
                    Nuestro sistema está creando una interpretación personalizada de tus resultados...
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
