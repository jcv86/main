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
import { Lightbulb, Clock, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"

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
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<Record<number, string>>({})
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

  const getMBTIDescription = (type: string) => {
    const descriptions: Record<string, { name: string; description: string; traits: string[] }> = {
      INTJ: {
        name: "El Arquitecto",
        description: "Pensador estratégico con un plan para todo",
        traits: ["Visionario", "Independiente", "Determinado", "Estratégico"],
      },
      INTP: {
        name: "El Pensador",
        description: "Innovador flexible y pensador creativo",
        traits: ["Analítico", "Curioso", "Flexible", "Independiente"],
      },
      ENTJ: {
        name: "El Comandante",
        description: "Líder audaz, imaginativo y con voluntad fuerte",
        traits: ["Líder natural", "Estratégico", "Eficiente", "Confiado"],
      },
      ENTP: {
        name: "El Innovador",
        description: "Pensador inteligente y curioso que no puede resistir un desafío intelectual",
        traits: ["Innovador", "Entusiasta", "Estratégico", "Carismático"],
      },
      INFJ: {
        name: "El Abogado",
        description: "Idealista creativo e inspirado por sus propios valores",
        traits: ["Idealista", "Organizado", "Insightful", "Inspirador"],
      },
      INFP: {
        name: "El Mediador",
        description: "Poeta idealista, siempre buscando lo bueno en las personas y eventos",
        traits: ["Idealista", "Flexible", "Cuidadoso", "Sensible"],
      },
      ENFJ: {
        name: "El Protagonista",
        description: "Líder carismático e inspirador, capaz de fascinar a sus oyentes",
        traits: ["Carismático", "Altruista", "Natural líder", "Confiable"],
      },
      ENFP: {
        name: "El Activista",
        description: "Espíritu libre entusiasta, creativo y sociable",
        traits: ["Entusiasta", "Creativo", "Sociable", "Energético"],
      },
      ISTJ: {
        name: "El Logista",
        description: "Práctico y orientado a los hechos, confiabilidad personificada",
        traits: ["Responsable", "Sincero", "Práctico", "Trabajador"],
      },
      ISFJ: {
        name: "El Protector",
        description: "Protector cálido y dedicado, siempre listo para defender a sus seres queridos",
        traits: ["Cálido", "Considerado", "Colaborativo", "Confiable"],
      },
      ESTJ: {
        name: "El Ejecutivo",
        description: "Excelente administrador, insuperable en la gestión de cosas o personas",
        traits: ["Organizado", "Práctico", "Lógico", "Asertivo"],
      },
      ESFJ: {
        name: "El Cónsul",
        description: "Extraordinariamente cuidadoso, sociable y popular, siempre ansioso por ayudar",
        traits: ["Cuidadoso", "Sociable", "Popular", "Simpático"],
      },
      ISTP: {
        name: "El Virtuoso",
        description: "Experimentador audaz y práctico, maestro de todo tipo de herramientas",
        traits: ["Audaz", "Práctico", "Experimental", "Espontáneo"],
      },
      ISFP: {
        name: "El Aventurero",
        description: "Artista flexible y encantador, siempre listo para explorar nuevas posibilidades",
        traits: ["Flexible", "Encantador", "Artístico", "Curioso"],
      },
      ESTP: {
        name: "El Emprendedor",
        description: "Inteligente, enérgico y muy perceptivo, verdaderamente disfruta vivir al límite",
        traits: ["Enérgico", "Perceptivo", "Espontáneo", "Pragmático"],
      },
      ESFP: {
        name: "El Animador",
        description: "Persona espontánea, enérgica y entusiasta - la vida nunca es aburrida a su alrededor",
        traits: ["Espontáneo", "Enérgico", "Entusiasta", "Amigable"],
      },
    }

    return (
      descriptions[type] || {
        name: "Tipo Desconocido",
        description: "Descripción no disponible",
        traits: [],
      }
    )
  }

  const submitTest = async () => {
    if (Object.keys(answers).length < mbtiQuestions.length) {
      alert("Por favor responde todas las preguntas antes de continuar.")
      return
    }

    setIsSubmitting(true)
    const endTime = new Date()
    const duration = Math.round((endTime.getTime() - startTime.getTime()) / 60000)
    const { type, scores } = calculateMBTIType()
    const description = getMBTIDescription(type)

    // Calculate overall score based on clarity of type
    const typeStrength = Math.max(
      Math.abs(scores.E - scores.I),
      Math.abs(scores.S - scores.N),
      Math.abs(scores.T - scores.F),
      Math.abs(scores.J - scores.P),
    )
    const overallScore = Math.round((typeStrength / (mbtiQuestions.length / 4)) * 100)

    const results = {
      type,
      type_name: description.name,
      type_description: description.description,
      scores,
      traits: description.traits,
      completion_date: endTime.toISOString(),
      total_questions: mbtiQuestions.length,
      answered_questions: Object.keys(answers).length,
    }

    try {
      // Save to database
      const { error } = await supabase.from("test_results").insert({
        user_email: userEmail,
        test_type: "personality",
        test_name: "MBTI",
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
        activity_description: `Completó el Test MBTI - Tipo: ${type} (${description.name})`,
        xp_earned: 100,
      })

      // Update user profile
      await supabase.rpc("increment_user_stats", {
        user_email: userEmail,
        tests_increment: 1,
        xp_increment: 100,
      })

      // Redirect to results
      router.push("/test/mbti/results")
    } catch (error) {
      console.error("Error submitting test:", error)
      alert("Error al guardar los resultados. Por favor intenta de nuevo.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const progress = ((currentQuestion + 1) / mbtiQuestions.length) * 100
  const question = mbtiQuestions[currentQuestion]
  const canProceed = answers[question.id] !== undefined

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Dashboard
          </Button>
          <Badge variant="secondary" className="text-sm">
            <Lightbulb className="h-4 w-4 mr-1" />
            Test MBTI
          </Badge>
        </div>

        {/* Progress */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-green-800">Test de Personalidad MBTI</h2>
                <p className="text-green-600">
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
            <CardDescription>Elige la opción que mejor describa tu preferencia natural</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup value={answers[question.id] || ""} onValueChange={(value) => handleAnswer(question.id, value)}>
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-4 rounded-lg hover:bg-green-50 border border-gray-200">
                  <RadioGroupItem value="A" id="option-A" />
                  <Label htmlFor="option-A" className="flex-1 cursor-pointer">
                    {question.optionA}
                  </Label>
                </div>
                <div className="flex items-center space-x-3 p-4 rounded-lg hover:bg-green-50 border border-gray-200">
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
            Anterior
          </Button>

          {currentQuestion === mbtiQuestions.length - 1 ? (
            <Button
              onClick={submitTest}
              disabled={!canProceed || isSubmitting}
              className="bg-green-600 hover:bg-green-700"
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
              onClick={() => setCurrentQuestion(Math.min(mbtiQuestions.length - 1, currentQuestion + 1))}
              disabled={!canProceed}
              className="bg-green-600 hover:bg-green-700"
            >
              Siguiente
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
                    ? "bg-green-600"
                    : answers[mbtiQuestions[index].id]
                      ? "bg-green-300"
                      : "bg-gray-200"
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {Object.keys(answers).length} de {mbtiQuestions.length} preguntas respondidas
          </p>
        </div>
      </div>
    </div>
  )
}
