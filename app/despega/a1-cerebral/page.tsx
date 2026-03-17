"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useAuthRedirect } from "@/hooks/use-auth-redirect"
import { TestIntroScreen } from "@/components/test-intro-screen"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react"
import { DISC_TEST_QUESTIONS } from "@/lib/disc-test-questions"
import { DiscResultsPage } from "@/components/disc-results-page"

const A1_QUESTIONS = DISC_TEST_QUESTIONS

export default function A1CerebralPage() {
  const router = useRouter()
  const supabase = createClient()
  const { user, loading: authLoading } = useAuthRedirect()
  const [stage, setStage] = useState<"intro" | "test" | "results">("intro")
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<number, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userLevel, setUserLevel] = useState<"principiante" | "intermedio" | "avanzado" | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (authLoading || !user?.id) return
    const loadUserLevel = async () => {
      try {
        const { data: testResults } = await supabase
          .from("despega_a1_test_results")
          .select("nivel_detectado")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)
          .single()

        if (testResults?.nivel_detectado) {
          setUserLevel(testResults.nivel_detectado as any)
        } else {
          setUserLevel("principiante")
        }
      } catch (error) {
        console.log("[v0] Could not load user level:", error)
        setUserLevel("principiante")
      } finally {
        setLoading(false)
      }
    }
    loadUserLevel()
  }, [authLoading, user?.id, supabase])

  const getProfileContent = (dimension: string, score: number) => {
    const profileContent: Record<string, Record<string, any>> = {
      energia: {
        label: "Estabilidad y Energía",
        naturalBehavior: score > 70 
          ? "Actúas con consistencia y equilibrio personal. Tu energía es sostenida, permitiendo que mantengas un rendimiento constante."
          : score > 50
          ? "Buscas mantener un equilibrio en tu energía, aunque a veces fluctúa."
          : "Tu energía es variable y requiere atención.",
        connections: score > 70
          ? "Te conectas bien con personas que valoran el bienestar y la consistencia."
          : "Buscas conectar con personas que entienden la importancia de la energía personal.",
        uncomfortable: score < 50
          ? "Los entornos caóticos pueden agotarte. Necesitas espacios para recuperarte."
          : "Aunque generalmente equilibrado, pueden incomodarte los cambios repentinos.",
        thinking: score > 70
          ? "Piensas con serenidad, priorizando tu bienestar. Eres consistente incluso en momentos difíciles."
          : "Piensas en tu bienestar, aunque a veces postergas el autocuidado.",
        growth: score > 70
          ? "Tu oportunidad es compartir con otros cómo mantienes tu energía."
          : "Necesitas crear una estructura clara de sueño, ejercicio e hidratación.",
      },
      enfoque: {
        label: "Concentración y Precisión",
        naturalBehavior: score > 70
          ? "Actúas con orden y profundidad. Tu concentración es una fortaleza clave."
          : score > 50
          ? "Buscas concentrarte, aunque las distracciones a veces te desvían."
          : "Tu concentración es un desafío.",
        connections: score > 70
          ? "Te conectas bien con personas que valoran la precisión y el análisis."
          : "Buscas conectar con personas ordenadas.",
        uncomfortable: score < 50
          ? "Los ambientes dispersos o sin dirección clara pueden paralizarte."
          : "Aunque generalmente enfocado, puede incomodarte la falta de estructura.",
        thinking: score > 70
          ? "Piensas con rigor antes de actuar. Prefieres certeza aunque requiera más tiempo."
          : "Piensas en lo importante, aunque a veces saltas a la acción.",
        growth: score > 70
          ? "Tu oportunidad es confiar un poco más en tu criterio."
          : "Necesitas crear un sistema de prioridades visual.",
      },
      relaciones: {
        label: "Conexión e Influencia",
        naturalBehavior: score > 70
          ? "Actúas con apertura y calidez. Tu capacidad de conectar es natural."
          : score > 50
          ? "Buscas conectar con otros, aunque a veces te sientes reservado."
          : "Tu conexión con otros es limitada.",
        connections: score > 70
          ? "Te conectas con personas que valoran la empatía y la autenticidad."
          : "Buscas personas que entiendan tu ritmo de conexión.",
        uncomfortable: score < 50
          ? "Los conflictos sin resolver te incomodan."
          : "Aunque generalmente conectado, puede incomodarte la falta de autenticidad.",
        thinking: score > 70
          ? "Piensas considerando a otros. Tu empatía guía tus decisiones."
          : "Piensas en el impacto en otros, aunque a veces prioriza tus necesidades.",
        growth: score > 70
          ? "Tu oportunidad es establecer límites saludables."
          : "Necesitas UNA conexión genuina y sostenida.",
      },
      plan_ejecutivo: {
        label: "Liderazgo y Ejecución",
        naturalBehavior: score > 70
          ? "Actúas con lógica orientada a resultados. Tu ejecución es confiable."
          : score > 50
          ? "Buscas llevar adelante tus planes, aunque necesitas impulso."
          : "Tu ejecución es inconsistente.",
        connections: score > 70
          ? "Te conectas con personas orientadas a resultados."
          : "Buscas personas que te ayuden a ejecutar.",
        uncomfortable: score < 50
          ? "La indecisión te bloquea. Necesitas claridad."
          : "Aunque generalmente ejecutor, puede incomodarte la falta de progreso.",
        thinking: score > 70
          ? "Piensas estratégicamente. Tu mente está en '¿cómo lograrlo rápido?'"
          : "Piensas en la ejecución, aunque a veces te pierdes en detalles.",
        growth: score > 70
          ? "Tu oportunidad es desarrollar paciencia con los procesos."
          : "Necesitas un ritual matutino donde defines lo importante.",
      },
    }
    return profileContent[dimension] || null
  }

  const getRecommendationsByLevel = (area: string, score: number) => {
    const recommendations = {
      energia: {
        principiante: ["Establece una hora fija para dormir", "Camina 10 minutos después de comer", "Bebe agua consistentemente", "Apaga pantallas 30 min antes de dormir"],
        intermedio: ["Duerme 7-8 horas consistentes", "Ejercicio 4-5 veces por semana", "Crea rituales pre-sueño", "Revisa tu energía semanalmente"],
        avanzado: ["Optimiza ciclos de sueño", "Entrena fuerza + cardio + flexibilidad", "Diseña nutrición por energía pico", "Sistema de tracking integral"],
      },
      enfoque: {
        principiante: ["Escribe 2 tareas importantes diarias", "Trabaja en bloques de 25 min", "Apaga notificaciones de redes", "Marca si completaste prioridades"],
        intermedio: ["Bloques de 90 minutos profundos", "Revisa notificaciones 3x al día", "Planifica semana de tareas clave", "Crea sistema visual Kanban"],
        avanzado: ["Sistema de priorización: impacto x urgencia", "3-4 horas diarias de trabajo profundo", "Automatiza o delega todo posible", "Análisis semanal de distracciones"],
      },
      relaciones: {
        principiante: ["Envía 1 mensaje genuino", "Programa 1 llamada mensual", "Haz más preguntas que afirmaciones", "Practica escuchar"],
        intermedio: ["Contacto semanal con 2-3 personas clave", "Ofrece 1 acción de ayuda semanal", "Únete a 1 comunidad", "Revisa contactos de 3 meses"],
        avanzado: ["Cultiva 10+ relaciones profundas", "Mentorea 1-2 personas", "CRM simple de próximas acciones", "Crea espacios de conexión"],
      },
      plan_ejecutivo: {
        principiante: ["Define 1 meta para 90 días", "Planifica cada domingo", "Ritual de 10 min matutino", "Revisa decisiones de la semana"],
        intermedio: ["3 metas con sub-tareas claras", "Planifica cada mañana 15 min", "Toma decisiones por datos", "Ritual de 20-30 min matutino"],
        avanzado: ["Sistema OKRs trimestral", "Revisión diaria de progreso", "Decide en 80% información", "Ritual matutino personalizado 45+ min"],
      },
    }
    return recommendations[area as keyof typeof recommendations]?.[userLevel as keyof any] || []
  }

  const getLevelBadge = () => {
    const badges = {
      principiante: { bg: "bg-blue-100", text: "text-blue-900", label: "Principiante" },
      intermedio: { bg: "bg-amber-100", text: "text-amber-900", label: "Intermedio" },
      avanzado: { bg: "bg-green-100", text: "text-green-900", label: "Avanzado" },
    }
    return badges[userLevel as keyof typeof badges] || badges.principiante
  }

  const handleStartTest = () => {
    setStage("test")
    setCurrentIdx(0)
    setAnswers({})
  }

  const handleAnswer = (value: any) => {
    setAnswers(prev => ({ ...prev, [question.id]: value }))
  }

  const handleNext = () => {
    if (currentIdx < A1_QUESTIONS.length - 1) setCurrentIdx(currentIdx + 1)
  }

  const handlePrevious = () => {
    if (currentIdx > 0) setCurrentIdx(currentIdx - 1)
  }

  const questionToDISC: Record<number, "energia" | "enfoque" | "relaciones" | "plan_ejecutivo"> = {
    1: "energia", 2: "energia", 3: "energia", 4: "energia", 5: "energia",
    6: "enfoque", 7: "enfoque", 8: "enfoque", 9: "enfoque", 10: "enfoque",
    11: "relaciones", 12: "relaciones", 13: "relaciones", 14: "relaciones", 15: "relaciones",
    16: "plan_ejecutivo", 17: "plan_ejecutivo", 18: "plan_ejecutivo", 19: "plan_ejecutivo", 20: "plan_ejecutivo",
  }

  const calculateDISCScores = () => {
    const scores = { energia: 0, enfoque: 0, relaciones: 0, plan_ejecutivo: 0 }
    const counts = { energia: 0, enfoque: 0, relaciones: 0, plan_ejecutivo: 0 }

    A1_QUESTIONS.forEach(question => {
      const answer = answers[question.id]
      if (answer === undefined) return

      const dimension = questionToDISC[question.id]
      let normalizedScore = 0

      if (question.type === "scale") {
        normalizedScore = ((answer - question.min) / (question.max - question.min)) * 100
      } else if (question.type === "multiple") {
        const optionIndex = question.options?.indexOf(answer) || 0
        if ((question as any).weights) {
          normalizedScore = (question as any).weights[optionIndex] * 100
        } else {
          normalizedScore = (optionIndex / (question.options?.length || 1 - 1)) * 100
        }
      }

      scores[dimension] += normalizedScore
      counts[dimension]++
    })

    return {
      energia: counts.energia > 0 ? Math.round(scores.energia / counts.energia) : 0,
      enfoque: counts.enfoque > 0 ? Math.round(scores.enfoque / counts.enfoque) : 0,
      relaciones: counts.relaciones > 0 ? Math.round(scores.relaciones / counts.relaciones) : 0,
      plan_ejecutivo: counts.plan_ejecutivo > 0 ? Math.round(scores.plan_ejecutivo / counts.plan_ejecutivo) : 0,
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.error("[v0] No user found")
        setStage("results")
        return
      }

      const scores = calculateDISCScores()
      console.log("[v0] Test results:", scores)
      setStage("results")
    } finally {
      setIsSubmitting(false)
    }
  }

  const areaColors = {
    energia: "bg-blue-100 text-blue-900",
    enfoque: "bg-green-100 text-green-900",
    relaciones: "bg-orange-100 text-orange-900",
    plan_ejecutivo: "bg-purple-100 text-purple-900",
  }

  const question = A1_QUESTIONS[currentIdx]
  const progress = ((currentIdx + 1) / A1_QUESTIONS.length) * 100
  const isAnswered = question && answers[question.id] !== undefined

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  const renderStage = () => {
    if (stage === "intro") {
      return (
        <TestIntroScreen
          title="Despega Cerebral A1"
          description="Descubre tus 4 dimensiones clave: Energía, Enfoque, Relaciones y Plan Ejecutivo"
          onStart={handleStartTest}
        />
      )
    }

    if (stage === "test" && question) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
          <div className="max-w-2xl mx-auto">
            <Progress value={progress} className="mb-8" />
            <Card>
              <CardHeader>
                <CardTitle>{question.question}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {question.type === "scale" && (
                  <div className="flex justify-between">
                    {Array.from({ length: question.max - question.min + 1 }, (_, i) => (
                      <button
                        key={i}
                        onClick={() => handleAnswer(question.min + i)}
                        className={`px-3 py-2 rounded ${
                          answers[question.id] === question.min + i
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200"
                        }`}
                      >
                        {question.min + i}
                      </button>
                    ))}
                  </div>
                )}

                {question.type === "multiple" && (
                  <div className="space-y-2">
                    {question.options?.map(option => (
                      <button
                        key={option}
                        onClick={() => handleAnswer(option)}
                        className={`w-full p-3 text-left rounded border ${
                          answers[question.id] === option
                            ? "border-blue-600 bg-blue-50"
                            : "border-gray-200"
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex gap-4 justify-between pt-4">
                  <Button onClick={handlePrevious} variant="outline" disabled={currentIdx === 0}>
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Anterior
                  </Button>
                  {currentIdx === A1_QUESTIONS.length - 1 ? (
                    <Button onClick={handleSubmit} disabled={isSubmitting || !isAnswered}>
                      {isSubmitting ? "Enviando..." : "Enviar"}
                    </Button>
                  ) : (
                    <Button onClick={handleNext} disabled={!isAnswered}>
                      Siguiente
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )
    }

    if (stage === "results") {
      const scores = calculateDISCScores()
      const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a)

      return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white p-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
              <h1 className="text-4xl font-bold mb-2">¡Test Completado!</h1>
              <p className="text-lg text-gray-600">Tu Perfil Despega Cerebral</p>
            </div>

            <div className="text-center mb-8">
              <Badge className={`px-4 py-2 text-base ${getLevelBadge().bg} ${getLevelBadge().text}`}>
                Tu Nivel: {getLevelBadge().label}
              </Badge>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-8">
              {sorted.map(([dim, score]) => (
                <Card key={dim}>
                  <CardHeader>
                    <CardTitle className="text-lg">{(getProfileContent(dim, score)?.label || dim)}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold text-blue-600 mb-4">{Math.round(score)}%</div>
                    <Progress value={score} className="mb-4" />
                    <p className="text-sm text-gray-700">
                      {getProfileContent(dim, score)?.naturalBehavior || 'Contenido no disponible'}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <Button onClick={() => router.push("/despega")} size="lg">
                Volver al Dashboard
              </Button>
            </div>
          </div>
        </div>
      )
    }
  }

  return renderStage()
}
