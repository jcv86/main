"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { Lightbulb, Clock, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"
import { useSession } from "@/components/session-wrapper"
import { UnifiedTestSystem } from "@/lib/unified-test-system"
import { useToast } from "@/hooks/use-toast"
import { TestIntroScreen } from "@/components/test-intro-screen"
import { TestCompletionScreen } from "@/components/test-completion-screen"

interface Question {
  id: number
  text: string
  type: "binary" | "scenario"
  dimension: "EI" | "SN" | "TF" | "JP"
  optionA: string
  optionB: string
  scoreA: "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P"
  scoreB: "E" | "I" | "S" | "N" | "T" | "F" | "J" | "P"
}

const mbtiQuestions: Question[] = [
  // Extraversion vs Introversion (E/I)
  {
    id: 1,
    text: "En una reunión social, prefieres:",
    type: "binary",
    dimension: "EI",
    optionA: "Conocer muchas personas nuevas",
    optionB: "Conversar profundamente con pocas personas",
    scoreA: "E",
    scoreB: "I",
  },
  {
    id: 2,
    text: "Cuando necesitas energía, prefieres:",
    type: "binary",
    dimension: "EI",
    optionA: "Estar con otras personas",
    optionB: "Estar solo/a",
    scoreA: "E",
    scoreB: "I",
  },
  {
    id: 3,
    text: "En el trabajo, te sientes más cómodo:",
    type: "binary",
    dimension: "EI",
    optionA: "Trabajando en equipo y colaborando",
    optionB: "Trabajando de forma independiente",
    scoreA: "E",
    scoreB: "I",
  },
  {
    id: 4,
    text: "Cuando tienes una idea nueva:",
    type: "binary",
    dimension: "EI",
    optionA: "La compartes inmediatamente con otros",
    optionB: "La reflexionas internamente primero",
    scoreA: "E",
    scoreB: "I",
  },
  {
    id: 5,
    text: "En una presentación, prefieres:",
    type: "binary",
    dimension: "EI",
    optionA: "Improvisar y interactuar con la audiencia",
    optionB: "Preparar todo detalladamente de antemano",
    scoreA: "E",
    scoreB: "I",
  },

  // Sensing vs Intuition (S/N)
  {
    id: 6,
    text: "Al resolver problemas, confías más en:",
    type: "binary",
    dimension: "SN",
    optionA: "Experiencia práctica y hechos concretos",
    optionB: "Intuición y posibilidades futuras",
    scoreA: "S",
    scoreB: "N",
  },
  {
    id: 7,
    text: "Prefieres trabajar con:",
    type: "binary",
    dimension: "SN",
    optionA: "Datos específicos y detalles precisos",
    optionB: "Conceptos generales y el panorama completo",
    scoreA: "S",
    scoreB: "N",
  },
  {
    id: 8,
    text: "Al aprender algo nuevo:",
    type: "binary",
    dimension: "SN",
    optionA: "Prefieres ejemplos prácticos y aplicaciones",
    optionB: "Te interesan las teorías y conceptos abstractos",
    scoreA: "S",
    scoreB: "N",
  },
  {
    id: 9,
    text: "En una conversación, tiendes a:",
    type: "binary",
    dimension: "SN",
    optionA: "Enfocarte en hechos y experiencias reales",
    optionB: "Explorar ideas y posibilidades futuras",
    scoreA: "S",
    scoreB: "N",
  },
  {
    id: 10,
    text: "Cuando planificas un proyecto:",
    type: "binary",
    dimension: "SN",
    optionA: "Te enfocas en pasos concretos y recursos",
    optionB: "Visualizas el resultado final y las oportunidades",
    scoreA: "S",
    scoreB: "N",
  },

  // Thinking vs Feeling (T/F)
  {
    id: 11,
    text: "Al tomar decisiones importantes:",
    type: "binary",
    dimension: "TF",
    optionA: "Analizas lógicamente pros y contras",
    optionB: "Consideras el impacto en las personas",
    scoreA: "T",
    scoreB: "F",
  },
  {
    id: 12,
    text: "Valoras más:",
    type: "binary",
    dimension: "TF",
    optionA: "La justicia y la objetividad",
    optionB: "La armonía y la comprensión",
    scoreA: "T",
    scoreB: "F",
  },
  {
    id: 13,
    text: "En un conflicto, tiendes a:",
    type: "binary",
    dimension: "TF",
    optionA: "Buscar la solución más lógica",
    optionB: "Considerar los sentimientos de todos",
    scoreA: "T",
    scoreB: "F",
  },
  {
    id: 14,
    text: "Cuando das feedback:",
    type: "binary",
    dimension: "TF",
    optionA: "Eres directo y te enfocas en los hechos",
    optionB: "Eres diplomático y consideras las emociones",
    scoreA: "T",
    scoreB: "F",
  },
  {
    id: 15,
    text: "En el trabajo, priorizas:",
    type: "binary",
    dimension: "TF",
    optionA: "La eficiencia y los resultados",
    optionB: "Las relaciones y el bienestar del equipo",
    scoreA: "T",
    scoreB: "F",
  },

  // Judging vs Perceiving (J/P)
  {
    id: 16,
    text: "Prefieres un ambiente de trabajo:",
    type: "binary",
    dimension: "JP",
    optionA: "Estructurado con plazos claros",
    optionB: "Flexible y adaptable",
    scoreA: "J",
    scoreB: "P",
  },
  {
    id: 17,
    text: "Al planificar vacaciones:",
    type: "binary",
    dimension: "JP",
    optionA: "Organizas todo con anticipación",
    optionB: "Prefieres improvisar sobre la marcha",
    scoreA: "J",
    scoreB: "P",
  },
  {
    id: 18,
    text: "En tu escritorio o espacio de trabajo:",
    type: "binary",
    dimension: "JP",
    optionA: "Todo está organizado y en su lugar",
    optionB: "Tienes un 'caos organizado' que funciona",
    scoreA: "J",
    scoreB: "P",
  },
  {
    id: 19,
    text: "Cuando trabajas en un proyecto:",
    type: "binary",
    dimension: "JP",
    optionA: "Prefieres completar tareas una por una",
    optionB: "Te gusta trabajar en varias cosas a la vez",
    scoreA: "J",
    scoreB: "P",
  },
  {
    id: 20,
    text: "Ante los cambios inesperados:",
    type: "binary",
    dimension: "JP",
    optionA: "Te sientes incómodo y prefieres estabilidad",
    optionB: "Los ves como oportunidades emocionantes",
    scoreA: "J",
    scoreB: "P",
  },

  // Additional scenario-based questions
  {
    id: 21,
    text: "En una reunión de lluvia de ideas:",
    type: "scenario",
    dimension: "EI",
    optionA: "Participas activamente y compartes ideas en voz alta",
    optionB: "Escuchas primero y contribuyes cuando tienes algo bien pensado",
    scoreA: "E",
    scoreB: "I",
  },
  {
    id: 22,
    text: "Al enfrentar un problema complejo:",
    type: "scenario",
    dimension: "SN",
    optionA: "Buscas soluciones que han funcionado antes",
    optionB: "Exploras enfoques completamente nuevos",
    scoreA: "S",
    scoreB: "N",
  },
  {
    id: 23,
    text: "Si un colega comete un error:",
    type: "scenario",
    dimension: "TF",
    optionA: "Le señalas el error directamente para corregirlo",
    optionB: "Buscas una forma gentil de ayudarle a mejorar",
    scoreA: "T",
    scoreB: "F",
  },
  {
    id: 24,
    text: "Cuando tienes múltiples tareas pendientes:",
    type: "scenario",
    dimension: "JP",
    optionA: "Haces una lista y las completas en orden",
    optionB: "Trabajas en lo que te motiva en el momento",
    scoreA: "J",
    scoreB: "P",
  },
  {
    id: 25,
    text: "En tu tiempo libre prefieres:",
    type: "scenario",
    dimension: "EI",
    optionA: "Actividades sociales y eventos con amigos",
    optionB: "Actividades tranquilas como leer o reflexionar",
    scoreA: "E",
    scoreB: "I",
  },
]

export default function MBTITest() {
  const [showIntro, setShowIntro] = useState(true)
  const [showCompletion, setShowCompletion] = useState(false)
  const [completionData, setCompletionData] = useState<any>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [startTime, setStartTime] = useState<Date>(new Date())
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mounted, setMounted] = useState(false)

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

  const handleAnswer = (questionId: number, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const calculateMBTIType = () => {
    const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 }

    mbtiQuestions.forEach((question) => {
      const answer = answers[question.id]
      if (answer === "A") {
        scores[question.scoreA]++
      } else if (answer === "B") {
        scores[question.scoreB]++
      }
    })

    const type =
      (scores.E > scores.I ? "E" : "I") +
      (scores.S > scores.N ? "S" : "N") +
      (scores.T > scores.F ? "T" : "F") +
      (scores.J > scores.P ? "J" : "P")

    return { type, scores }
  }

  const submitTest = async () => {
    if (Object.keys(answers).length < mbtiQuestions.length) {
      toast({
        title: "Test Incompleto",
        description: "Por favor responde todas las preguntas antes de continuar.",
        variant: "destructive",
      })
      return
    }

    if (!user?.email) {
      toast({
        title: "Autenticación Requerida",
        description: "Debes estar autenticado para guardar los resultados.",
        variant: "destructive",
      })
      router.push("/auth")
      return
    }

    setIsSubmitting(true)
    const endTime = new Date()
    const duration = Math.round((endTime.getTime() - startTime.getTime()) / 60000)
    const { type, scores } = calculateMBTIType()

    const typeStrength = Math.max(
      Math.abs(scores.E - scores.I),
      Math.abs(scores.S - scores.N),
      Math.abs(scores.T - scores.F),
      Math.abs(scores.J - scores.P),
    )
    const overallScore = Math.round((typeStrength / (mbtiQuestions.length / 4)) * 100)

    const results = {
      type,
      scores,
      overall_score: overallScore,
      completion_date: endTime.toISOString(),
      total_questions: mbtiQuestions.length,
      answered_questions: Object.keys(answers).length,
      duration_minutes: duration,
      answers,
    }

    try {
      console.log("[v0] Submitting MBTI test results to database...")
      const saveResult = await UnifiedTestSystem.saveTestResult(
        user.email,
        "Mapa de Personalidad Despega",
        results,
        duration,
      )

      if (!saveResult.success) {
        throw new Error(saveResult.error || "Failed to save results")
      }

      console.log("[v0] MBTI test results saved successfully to database")
      setCompletionData({
        type,
        scores,
        overallScore,
        duration,
      })
      setShowCompletion(true)
    } catch (error) {
      console.error("[v0] Error submitting MBTI test:", error)
      toast({
        title: "Error al guardar resultados",
        description: "No se pudieron guardar tus resultados en la base de datos. Por favor contacta soporte.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const question = mbtiQuestions[currentQuestion]
  const canProceed = answers[question.id] !== undefined
  const progress = canProceed
    ? ((currentQuestion + 1) / mbtiQuestions.length) * 100
    : (currentQuestion / mbtiQuestions.length) * 100

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando evaluación...</p>
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

  if (showIntro) {
    return (
      <TestIntroScreen
        testName="Mapa de Personalidad Despega"
        testDescription="Descubre tu tipo de personalidad MBTI y comprende cómo procesas información, tomas decisiones e interactúas con el mundo"
        whatItMeasures={[
          "Extraversión vs Introversión (E/I) - Tu fuente de energía",
          "Sensorial vs Intuitivo (S/N) - Cómo procesas información",
          "Pensamiento vs Sentimiento (T/F) - Cómo tomas decisiones",
          "Juicio vs Percepción (J/P) - Tu estilo de vida",
        ]}
        whyRelevant="Tu tipo MBTI te ayuda a entender tus fortalezas naturales, preferencias de comunicación, y cómo trabajas mejor. Es fundamental para el autoconocimiento y desarrollo personal integral."
        estimatedTime={18}
        questionsCount={mbtiQuestions.length}
        onStart={() => setShowIntro(false)}
        onBack={() => router.push("/test")}
      />
    )
  }

  if (showCompletion && completionData) {
    const { type, scores, overallScore, duration } = completionData

    const typeInsights: Record<string, string> = {
      INTJ: "Eres un estratega natural con visión a largo plazo y capacidad analítica excepcional",
      INTP: "Tu mente es como un laboratorio constante, siempre explorando ideas y conceptos complejos",
      ENTJ: "Eres un líder nato con capacidad para organizar sistemas y dirigir hacia objetivos ambiciosos",
      ENTP: "Tu creatividad e ingenio te permiten ver posibilidades que otros no perciben",
      INFJ: "Tienes una profunda comprensión de las personas y una visión inspiradora del futuro",
      INFP: "Tus valores profundos y creatividad te guían hacia causas significativas",
      ENFJ: "Inspiras a otros naturalmente y tienes un don para desarrollar el potencial en las personas",
      ENFP: "Tu entusiasmo contagioso y creatividad abren puertas a nuevas posibilidades",
      ISTJ: "Tu confiabilidad y atención al detalle son pilares fundamentales en cualquier equipo",
      ISFJ: "Tu dedicación y cuidado por otros crean ambientes de apoyo y estabilidad",
      ESTJ: "Tu capacidad organizativa y practicidad hacen que las cosas se logren eficientemente",
      ESFJ: "Tu calidez y habilidad para conectar con personas fortalece cualquier comunidad",
      ISTP: "Tu habilidad práctica y pensamiento lógico te hacen excelente solucionando problemas",
      ISFP: "Tu sensibilidad estética y valores personales te guían hacia experiencias auténticas",
      ESTP: "Tu energía y capacidad para actuar en el momento presente son admirables",
      ESFP: "Tu espontaneidad y don para disfrutar la vida inspiran a otros a vivir plenamente",
    }

    return (
      <TestCompletionScreen
        testName="Mapa de Personalidad Despega"
        completionMessage="Has completado exitosamente tu Mapa de Personalidad Despega"
        quickSummary={`Tu tipo de personalidad es ${type}`}
        keyInsight={typeInsights[type] || "Tu personalidad única es tu mayor fortaleza"}
        score={overallScore}
        duration={duration}
        onViewFullReport={() => router.push("/test/mbti/results")}
        onTalkToCoach={() => router.push("/test/mbti/results#coach")}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={() => router.push("/test")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver a Tests
          </Button>
          <Badge variant="secondary" className="text-sm">
            <Lightbulb className="h-4 w-4 mr-1" />
            Mapa de Personalidad
          </Badge>
        </div>

        {/* Progress */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Mapa de Personalidad Despega</h2>
                <p className="text-gray-600">
                  Pregunta {currentQuestion + 1} de {mbtiQuestions.length}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>~18 minutos</span>
              </div>
            </div>
            <Progress value={progress} className="h-2" />
          </CardContent>
        </Card>

        {/* Question */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">{question.text}</CardTitle>
            <CardDescription>Choose the option that best describes your natural preference</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={answers[question.id] || ""} onValueChange={(value) => handleAnswer(question.id, value)}>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50 border border-gray-200">
                  <RadioGroupItem value="A" id="option-A" />
                  <Label htmlFor="option-A" className="flex-1 cursor-pointer">
                    {question.optionA}
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-4 rounded-lg hover:bg-gray-50 border border-gray-200">
                  <RadioGroupItem value="B" id="option-B" />
                  <Label htmlFor="option-B" className="flex-1 cursor-pointer">
                    {question.optionB}
                  </Label>
                </div>
              </div>
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
            Previous
          </Button>

          {currentQuestion === mbtiQuestions.length - 1 ? (
            <Button
              onClick={submitTest}
              disabled={!canProceed || isSubmitting}
              className="bg-gray-900 hover:bg-gray-800"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Complete Test
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentQuestion(Math.min(mbtiQuestions.length - 1, currentQuestion + 1))}
              disabled={!canProceed}
              className="bg-gray-900 hover:bg-gray-800"
            >
              Next
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>

        {/* Question Counter */}
        <div className="mt-8 text-center">
          <div className="flex justify-center space-x-1">
            {mbtiQuestions.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full ${
                  index <= currentQuestion
                    ? "bg-gray-900"
                    : answers[mbtiQuestions[index].id]
                      ? "bg-gray-300"
                      : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {Object.keys(answers).length} of {mbtiQuestions.length} questions answered
          </p>
        </div>
      </div>
    </div>
  )
}
