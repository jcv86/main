"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { useA4Calibration } from "@/hooks/use-a4-calibration"
import { TestIntroScreen } from "@/components/test-intro-screen"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { DISC_TEST_QUESTIONS } from "@/lib/disc-test-questions"
import { DiscResultsPage } from "@/components/disc-results-page"

// Using 28 DISC questions from library
const A1_QUESTIONS = DISC_TEST_QUESTIONS

export default function A1CerebralPage() {
  const router = useRouter()
  const supabase = createClient()
  const calibration = useA4Calibration()
  const [stage, setStage] = useState<"intro" | "test" | "results">("intro")
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<number, any>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [userLevel, setUserLevel] = useState<"principiante" | "intermedio" | "avanzado" | null>(null)
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Load user and their level
  useEffect(() => {
    const loadUserLevel = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          setLoading(false)
          return
        }

        setUserId(user.id)

        // Try to get user level from previous test results
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
          // Default to principiante if no previous test
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
  }, [])

  const getProfileContent = (dimension: string, score: number) => {
    // Adjust explanation depth based on A4 Strategic Score
    // depthLevel: 1 (beginner - simple), 2 (intermediate - moderate), 3 (advanced - deep)
    const depthLevel = calibration?.depthLevel || 1
    
    // Helper to adjust text depth
    const adjustDepth = (simple: string, moderate: string, deep: string) => {
      if (depthLevel === 3) return deep
      if (depthLevel === 2) return moderate
      return simple
    }
    
    // Return content based on Juan Vial structure: natural behavior, connections, what can be uncomfortable, daily thinking, growth opportunities
    const profileContent: Record<string, Record<string, any>> = {
      energia: {
        label: "Estabilidad y Energía",
        naturalBehavior: score > 70 
          ? adjustDepth(
              "Tienes equilibrio personal consistente.",
              "Actúas con consistencia y equilibrio personal. Tu energía es sostenida, permitiendo que mantengas un rendimiento constante. Te expresas desde la calma, buscando siempre el bienestar integral.",
              "Demuestras una arquitectura energética sofisticada: mantienes equilibrio dinámico en contextos complejos. Tu energía no solo es sostenida sino estratégicamente canalizada. Te expresas desde la calma porque has integrado prácticamente la autorregulación, permitiéndote buscar el bienestar integral como sistema, no como evento."
            )
          : score > 50
          ? adjustDepth(
              "Tu energía fluctúa a veces.",
              "Buscas mantener un equilibrio en tu energía, aunque a veces fluctúa. Reconoces la importancia del descanso y la actividad física, aunque no siempre logres consistencia.",
              "Intentas mantener equilibrio energético pero experimentas fluctuaciones predecibles en contextos de cambio. Reconoces intelectualmente la importancia del descanso y actividad física, pero la ejecución sistemática es incompleta. Hay brechas entre tu intención y tu práctica."
            )
          : adjustDepth(
              "Tu energía requiere atención.",
              "Tu energía es variable y requiere atención. A menudo te sientes agotado o sin consistencia en tus hábitos. Recuperar el equilibrio es clave para tu rendimiento.",
              "Tu gestión energética es inconsistente y reactiva. Experimentas ciclos de agotamiento que indican falta de sistema de recuperación. La variable crítica es crear una estructura mínima que genere recuperación automática, no voluntaria."
            ),
        
        connections: score > 70
          ? "Te conectas bien con personas que valoran el bienestar, la consistencia y el balance. Te sientes a gusto en entornos donde hay ritmo, orden y cuidado personal."
          : "Buscas conectar con personas que entienden la importancia de la energía personal, aunque a veces sientas soledad en estos hábitos.",
        
        uncomfortable: score < 50
          ? "Los entornos caóticos o sin estructura pueden agotarte. Te incomoda la presión constante sin pausas. Necesitas espacios para recuperarte."
          : "Aunque generalmente equilibrado, pueden incomodarte los cambios repentinos o presiones sin descanso.",
        
        thinking: score > 70
          ? "Piensas con serenidad, priorizando tu bienestar. Evalúas decisiones considerando tu energía disponible. Eres consistente incluso en momentos difíciles."
          : score > 50
          ? "Piensas en tu bienestar, aunque a veces postergas el autocuidado. Reconoces qué necesitas, pero cuesta ejecutarlo."
          : "Tu pensamiento está frecuentemente marcado por el cansancio. Necesitas crear sistemas que sostengan tu energía automáticamente.",
        
        growth: score > 70
          ? "Tu oportunidad es compartir con otros cómo mantienes tu energía. Podrías formalizar tus hábitos en rutinas que otros puedan aprender."
          : "Necesitas crear una estructura clara de sueño, ejercicio e hidratación. Comenzar con UNA sola acción sostenible, no todas a la vez.",
      },
      
      enfoque: {
        label: "Concentración y Precisión",
        naturalBehavior: score > 70
          ? "Actúas con orden y profundidad. Tu concentración es una fortaleza clave. Te apoyas en la claridad antes de actuar, evitando precipitaciones."
          : score > 50
          ? "Buscas concentrarte, aunque las distracciones a veces te desvían. Tienes momentos de enfoque profundo, pero no son constantes."
          : "Tu concentración es un desafío. Las distracciones te capturan fácilmente y te cuesta sostener el enfoque en tareas importantes.",
        
        connections: score > 70
          ? "Te conectas bien con personas que valoran la precisión, el método y el análisis detallado. Prefieres entornos donde la calidad es prioritaria."
          : "Buscas conectar con personas ordenadas, aunque a veces sientas que el caos te rodea.",
        
        uncomfortable: score < 50
          ? "Los ambientes dispersos o sin dirección clara pueden paralizarte. Te incomoda decidir sin datos. La improvisación te bloquea."
          : "Aunque generalmente enfocado, puede incomodarte la falta de estructura o criterios claros.",
        
        thinking: score > 70
          ? "Piensas con rigor antes de actuar. Analizas detalles, cuidas cada paso. Prefieres certeza aunque requiera más tiempo."
          : score > 50
          ? "Piensas en lo importante, aunque a veces saltas a la acción sin análisis completo."
          : "Tu pensamiento está disperso entre demasiadas prioridades. Necesitas claridad urgente en qué es realmente importante.",
        
        growth: score > 70
          ? "Tu oportunidad es confiar un poco más en tu criterio sin esperar información perfecta. Compartir tus ideas en proceso, no solo 'listas'."
          : "Necesitas crear un sistema de prioridades visual. Identifica las 3 cosas MÁS importantes cada día y trabaja solo esas.",
      },
      
      relaciones: {
        label: "Conexión e Influencia",
        naturalBehavior: score > 70
          ? "Actúas con apertura y calidez. Tu capacidad de conectar es natural. Te expresas con empatía, buscando entender antes de ser entendido."
          : score > 50
          ? "Buscas conectar con otros, aunque a veces te sientes reservado. Tienes buenas relaciones, pero podrían ser más profundas."
          : "Tu conexión con otros es limitada. Prefieres la soledad o tienes dificultad expresando calidez. Las relaciones son un desafío.",
        
        connections: score > 70
          ? "Te conectas con personas que valoran la empatía, la escucha y la autenticidad. Te sientes a gusto en equipos cohesionados."
          : "Buscas personas que entiendan tu ritmo de conexión, aunque a veces sientas que no es suficiente.",
        
        uncomfortable: score < 50
          ? "Los conflictos sin resolver te incomodan. Te afecta la falta de armonía. Los entornos competitivos pueden encerrarte."
          : "Aunque generalmente conectado, puede incomodarte la falta de autenticidad o superficialidad.",
        
        thinking: score > 70
          ? "Piensas considerando a otros. Tu empatía guía tus decisiones. Buscas soluciones que beneficien a todos."
          : score > 50
          ? "Piensas en el impacto en otros, aunque a veces prioriza tus necesidades."
          : "Tu pensamiento es principalmente individual. Necesitas entrenar la perspectiva de otros.",
        
        growth: score > 70
          ? "Tu oportunidad es establecer límites saludables. No todas las conexiones requieren profundidad. Aprende a decir 'no' desde el amor."
          : "Necesitas UNA conexión genuina y sostenida. Elige una persona y cultiva esa relación activamente.",
      },
      
      plan_ejecutivo: {
        label: "Liderazgo y Ejecución",
        naturalBehavior: score > 70
          ? "Actúas con lógica orientada a resultados. Tu toma de decisiones es directa y estratégica. Ejecutas lo que planificas de forma confiable."
          : score > 50
          ? "Buscas llevar adelante tus planes, aunque a veces necesitas impulso adicional. Tienes intención, pero cuesta la consistencia."
          : "Tu ejecución es inconsistente. Planificas bien, pero la implementación es un desafío. Necesitas sistemas que te sostengan.",
        
        connections: score > 70
          ? "Te conectas con personas orientadas a resultados que valoran la velocidad y la efectividad. Prefieres equipos que ejecutan."
          : "Buscas personas que te ayuden a ejecutar, aunque a veces sientas que estás solo en la visión.",
        
        uncomfortable: score < 50
          ? "La indecisión te bloquea. Te incomoda la ambigüedad estratégica. Necesitas claridad en la dirección."
          : "Aunque generalmente ejecutor, puede incomodarte la falta de progreso o métricas claras.",
        
        thinking: score > 70
          ? "Piensas estratégicamente. Tomas decisiones basadas en impacto. Tu mente está en '¿cómo lograrlo rápido?'"
          : score > 50
          ? "Piensas en la ejecución, aunque a veces te pierdes en detalles que no importan."
          : "Tu pensamiento está fragmentado entre intenciones y realidad. Necesitas estructurar tus metas.",
        
        growth: score > 70
          ? "Tu oportunidad es desarrollar paciencia con los procesos. No todos tienen tu velocidad. Enseña a otros tu método."
          : "Necesitas un ritual matutino de 10 minutos donde defines LO ÚNICO más importante. Ejecuta solo eso.",
      },
    }

    return profileContent[dimension] || null
  }

  const getRecommendationsByLevel = (area: string, score: number) => {
    const recommendations = {
      energia: {
        principiante: [
          "Establece una hora fija para dormir y despertar (incluso los fines de semana).",
          "Camina 10 minutos después de cada comida principal.",
          "Bebe un vaso de agua al despertare y antes de acostarte.",
          "Apaga pantallas 30 minutos antes de dormir.",
        ],
        intermedio: [
          "Duerme 7-8 horas consistentes. Rastreatua sueño para identificar patrones.",
          "Ejercicio 4-5 veces por semana: combina cardio y fuerza.",
          "Crea un ritual pre-sueño de 45 minutos sin distracciones digitales.",
          "Revisa tu energía semanalmente: ¿qué hábitos te ayudaron?",
        ],
        avanzado: [
          "Optimiza ciclos de sueño y experimenta con siesta estratégica (20 min).",
          "Integra entrenamiento de fuerza + cardio + flexibilidad.",
          "Diseña tu nutrición alrededor de tu energía pico (mañana vs tarde).",
          "Sistema de tracking: sueño, ejercicio, hidratación, energía - identifica causas.",
        ],
      },
      enfoque: {
        principiante: [
          "Cada mañana: escribe las 2 tareas MÁS importantes (no 10).",
          "Trabaja en bloques de 25 minutos sin revisar notificaciones.",
          "Apaga notificaciones de redes sociales durante trabajo.",
          "Fin de día: marca si completaste tus 2 prioridades.",
        ],
        intermedio: [
          "Bloques de 90 minutos de trabajo profundo (no 25).",
          "Revisa notificaciones solo 3 veces al día (9am, 12pm, 5pm).",
          "Planifica tu semana identificando 3-5 tareas que mueven la aguja.",
          "Crea un sistema visual (tablero Kanban) que ves cada mañana.",
        ],
        avanzado: [
          "Sistema personal de priorización: matriz de impacto x urgencia.",
          "Alcanza 3-4 horas diarias de trabajo verdaderamente profundo.",
          "Automatiza o delega todo lo que no requiere tu expertise.",
          "Análisis semanal: ¿qué me dispersó? ¿Cómo evitarlo?",
        ],
      },
      relaciones: {
        principiante: [
          "Esta semana: envía 1 mensaje genuino a alguien sin pedir nada.",
          "Programa 1 llamada mensual con alguien que importa.",
          "En conversaciones: haz 1 pregunta más que afirmación.",
          "Practica escuchar sin pensar tu respuesta.",
        ],
        intermedio: [
          "Mantén contacto semanal con 2-3 personas clave en tu vida.",
          "Ofrece 1 acción de ayuda específica cada semana (sin esperar retorno).",
          "Únete a 1 comunidad o grupo donde puedas contribuir.",
          "Revisa: ¿a quién no he contactado en 3 meses? Alcanzalos.",
        ],
        avanzado: [
          "Cultiva red de 10+ relaciones profesionales verdaderamente profundas.",
          "Mentorea activamente a 1-2 personas (tu mejor aprendizaje).",
          "Sistema personal: CRM simple donde registres 'próximas acciones' con cada persona.",
          "Crea espacios donde otros se conecten (grupos, eventos, cafés).",
        ],
      },
      plan_ejecutivo: {
        principiante: [
          "Define 1 meta clara para los próximos 90 días (escrita).",
          "Cada domingo: planifica tu semana en 15 minutos.",
          "Ritual matutino: 10 minutos reflexionando sobre lo importante.",
          "Fin de semana: revisa 1 decisión importante que tomaste.",
        ],
        intermedio: [
          "3 metas principales para 90 días con sub-tareas claramente identificadas.",
          "Planifica CADA mañana (15 min): ¿cuál es lo único que importa hoy?",
          "Toma decisiones basadas en datos/hechos, no emociones.",
          "Ritual matutino: 20-30 minutos que incluya reflexión + movimiento.",
        ],
        avanzado: [
          "Sistema de OKRs: Objetivos + Key Results trimestral / semanal.",
          "Revisión diaria: ¿progresé? ¿Qué ajustes necesito?",
          "Decide rápido en el 80% de información, no esperes 100%.",
          "Ritual matutino personalizado: 45+ minutos que alimenta tu ejecución.",
        ],
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
    if (currentIdx < A1_QUESTIONS.length - 1) {
      setCurrentIdx(currentIdx + 1)
    }
  }

  const handlePrevious = () => {
    if (currentIdx > 0) {
      setCurrentIdx(currentIdx - 1)
    }
  }

  // Map questions to DISC-style categories
  const questionToDISC: Record<number, "energia" | "enfoque" | "relaciones" | "plan_ejecutivo"> = {
    1: "energia", 2: "energia", 3: "energia", 4: "energia", 5: "energia",
    6: "enfoque", 7: "enfoque", 8: "enfoque", 9: "enfoque", 10: "enfoque",
    11: "relaciones", 12: "relaciones", 13: "relaciones", 14: "relaciones", 15: "relaciones",
    16: "plan_ejecutivo", 17: "plan_ejecutivo", 18: "plan_ejecutivo", 19: "plan_ejecutivo", 20: "plan_ejecutivo",
  }

  // Calculate DISC-style scores (0-100 per dimension)
  const calculateDISCScores = () => {
    const scores = {
      energia: 0,
      enfoque: 0,
      relaciones: 0,
      plan_ejecutivo: 0,
    }
    const counts = {
      energia: 0,
      enfoque: 0,
      relaciones: 0,
      plan_ejecutivo: 0,
    }

    A1_QUESTIONS.forEach(question => {
      const answer = answers[question.id]
      if (answer === undefined) return

      const dimension = questionToDISC[question.id]
      let normalizedScore = 0

      if (question.type === "scale") {
        // Normalize scale answers to 0-100
        normalizedScore = ((answer - question.min) / (question.max - question.min)) * 100
      } else if (question.type === "multiple") {
        // Use weighted scores if available, otherwise normalize
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

    // Calculate averages and round
    const finalScores = {
      energia: counts.energia > 0 ? Math.round(scores.energia / counts.energia) : 0,
      enfoque: counts.enfoque > 0 ? Math.round(scores.enfoque / counts.enfoque) : 0,
      relaciones: counts.relaciones > 0 ? Math.round(scores.relaciones / counts.relaciones) : 0,
      plan_ejecutivo: counts.plan_ejecutivo > 0 ? Math.round(scores.plan_ejecutivo / counts.plan_ejecutivo) : 0,
    }

    return finalScores
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        console.error("[v0] No user found")
        setStage("results")
        return
      }

      // Calculate scores
      const scores = calculateDISCScores()
      const duration = Math.round((Date.now() - (startTimeRef.current || Date.now())) / 60000)

      const testResults = {
        energia: scores.energia,
        enfoque: scores.enfoque,
        relaciones: scores.relaciones,
        plan_ejecutivo: scores.plan_ejecutivo,
        answers: answers,
      }

      console.log("[v0] Saving A1 Cerebral test results...", testResults)

      // Save using UnifiedTestSystem with correct parameter order
      const result = await UnifiedTestSystem.saveTestResult(
        user.email!,
        "Despega Cerebral" as any,
        testResults,
        duration
      )

      if (!result.savedToDatabase) {
        console.error("[v0] Failed to save test results:", result.error)
      } else {
        console.log("[v0] Test results saved successfully")
      }

      setStage("results")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Track test start time
  const startTimeRef = useEffect(() => {
    if (stage === "test") {
      return () => {}
    }
    const startTime = Date.now()
    return () => {
      startTimeRef.current = startTime
    }
  }, [])

  const areaColors = {
    energia: "bg-blue-100 text-blue-900",
    enfoque: "bg-green-100 text-green-900",
    relaciones: "bg-orange-100 text-orange-900",
    plan_ejecutivo: "bg-purple-100 text-purple-900",
  }

  const areaLabels = {
    energia: "Energía",
    enfoque: "Enfoque",
    relaciones: "Relaciones",
    plan_ejecutivo: "Plan Ejecutivo",
  }

  const question = A1_QUESTIONS[currentIdx]
  const progress = ((currentIdx + 1) / A1_QUESTIONS.length) * 100
  const isAnswered = question && answers[question.id] !== undefined

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando tu perfil...</p>
        </div>
      </div>
    )
  }

  // STAGE 1: INTRO
  if (stage === "intro") {
    return (
      <TestIntroScreen
        testName="Despega Cerebral™"
        testDescription="Tu Perfil de Comportamiento Profesional"
        whatItMeasures={[
          "Tu estilo de comportamiento natural en el trabajo",
          "Preferencias de comunicación y toma de decisiones",
          "4 dimensiones clave: Dominancia, Influencia, Estabilidad y Cumplimiento",
          "Fortalezas naturales y áreas de desarrollo",
        ]}
        whyRelevant="Entender tu estilo DISC te ayuda a comunicarte mejor, elegir roles que alineen con tus fortalezas naturales y desarrollar competencias complementarias."
        estimatedTime={15}
        totalQuestions={20}
        onStart={handleStartTest}
      />
    )
  }

  // STAGE 2: TEST
  if (stage === "test") {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <Button variant="outline" onClick={() => router.push("/despega")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <Badge className={`capitalize font-semibold px-3 py-1 ${areaColors[question.area as keyof typeof areaColors]}`}>
              {areaLabels[question.area as keyof typeof areaLabels]}
            </Badge>
          </div>

          {/* Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Despega Cerebral™</h1>
            <p className="text-gray-600">Pregunta {currentIdx + 1} de {A1_QUESTIONS.length}</p>
          </div>

          {/* Progress */}
          <Progress value={progress} className="mb-8 h-3" />

          {/* Question Card */}
          <Card className="mb-8">
            <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b pb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-gray-600">{currentIdx + 1}/{A1_QUESTIONS.length}</span>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">{question.text}</CardTitle>
            </CardHeader>
            <CardContent className="pt-8 pb-8">
              {question.type === "scale" && (
                <div className="space-y-8">
                  <Slider
                    min={question.min}
                    max={question.max}
                    step={1}
                    value={[answers[question.id] || question.min]}
                    onValueChange={(v) => handleAnswer(v[0])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-gray-600">{question.minLabel}</span>
                    <span className="text-2xl font-bold text-blue-600">{answers[question.id] || question.min}</span>
                    <span className="font-medium text-gray-600">{question.maxLabel}</span>
                  </div>
                </div>
              )}

              {question.type === "multiple" && (
                <RadioGroup value={String(answers[question.id] || "")} onValueChange={handleAnswer}>
                  <div className="space-y-3">
                    {question.options?.map((option, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-3 p-4 rounded-lg border-2 border-gray-200 hover:border-blue-400 hover:bg-blue-50 cursor-pointer transition-all"
                      >
                        <RadioGroupItem value={option} id={`opt-${idx}`} />
                        <Label htmlFor={`opt-${idx}`} className="flex-1 cursor-pointer font-medium text-gray-800">
                          {option}
                        </Label>
                      </div>
                    ))}
                  </div>
                </RadioGroup>
              )}
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="flex justify-between gap-4 mt-8">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentIdx === 0}
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>

            {currentIdx === A1_QUESTIONS.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={!isAnswered || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    Procesando...
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Completar
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!isAnswered}
                className="flex-1"
              >
                Siguiente
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>

          {/* Progress Indicator */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              {Object.keys(answers).length} de {A1_QUESTIONS.length} respondidas
            </p>
          </div>
        </div>
      </div>
    )
  }

  // Map questions to DISC-style categories
  const calculateResults = () => {
    return calculateDISCScores()
  }

  const results = calculateResults()
  const sorted = Object.entries(results).sort((a, b) => b[1] - a[1])
  const primaryDimension = sorted[0][0] as string
  const primaryScore = sorted[0][1]
  const secondaryDimension = sorted[1][0] as string
  const needsWork = sorted[sorted.length - 1]

  // Get primary dimension info
  const getDimensionInfo = (dim: string) => {
    const info: Record<string, any> = {
      energia: {
        label: "Energía",
        emoji: "⚡",
        color: "bg-blue-50 border-blue-200",
        textColor: "text-blue-700",
        bgColor: "bg-blue-100",
        description: "Tu capacidad de mantener energía y bienestar sostenido",
      },
      enfoque: {
        label: "Enfoque",
        emoji: "🎯",
        color: "bg-green-50 border-green-200",
        textColor: "text-green-700",
        bgColor: "bg-green-100",
        description: "Tu habilidad para concentrarte y ejecutar tareas prioritarias",
      },
      relaciones: {
        label: "Relaciones",
        emoji: "🤝",
        color: "bg-orange-50 border-orange-200",
        textColor: "text-orange-700",
        bgColor: "bg-orange-100",
        description: "Tu capacidad de conectar y colaborar con otros",
      },
      plan_ejecutivo: {
        label: "Plan Ejecutivo",
        emoji: "📊",
        color: "bg-purple-50 border-purple-200",
        textColor: "text-purple-700",
        bgColor: "bg-purple-100",
        description: "Tu habilidad para planificar y ejecutar estrategias",
      },
    }
    return info[dim] || info.energia
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-12">
          <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">¡Test Completado!</h1>
          <p className="text-lg text-gray-600">Aquí está tu Perfil Despega Cerebral</p>
        </div>

        {/* Primary Profile - DISC Style */}
        <Card className={`mb-8 shadow-xl border-4 ${getDimensionInfo(primaryDimension).color}`}>
          <CardHeader className="text-center pb-6">
            <div className="text-6xl mb-4">{getDimensionInfo(primaryDimension).emoji}</div>
            <CardTitle className="text-4xl font-bold mb-2">
              {getProfileContent(primaryDimension, primaryScore)?.label}
            </CardTitle>
            <p className="text-lg text-gray-600">Tu dimensión primaria</p>
          </CardHeader>
          <CardContent className="pb-8">
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-blue-600 mb-2">{primaryScore}%</div>
            </div>

            {/* Natural Behavior */}
            <div className="mb-6 p-6 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-semibold text-blue-900 mb-2">Así es tu forma natural de actuar</h4>
              <p className="text-gray-700 text-sm">
                {getProfileContent(primaryDimension, primaryScore)?.naturalBehavior}
              </p>
            </div>

            {/* Connections */}
            <div className="mb-6 p-6 bg-green-50 rounded-lg border-l-4 border-green-500">
              <h4 className="font-semibold text-green-900 mb-2">Conectas con personas que...</h4>
              <p className="text-gray-700 text-sm">
                {getProfileContent(primaryDimension, primaryScore)?.connections}
              </p>
            </div>

            {/* What Makes You Uncomfortable */}
            <div className="mb-6 p-6 bg-orange-50 rounded-lg border-l-4 border-orange-500">
              <h4 className="font-semibold text-orange-900 mb-2">⚠️ Lo que puede incomodarte en algunos entornos</h4>
              <p className="text-gray-700 text-sm">
                {getProfileContent(primaryDimension, primaryScore)?.uncomfortable}
              </p>
            </div>

            {/* How You Think */}
            <div className="mb-6 p-6 bg-purple-50 rounded-lg border-l-4 border-purple-500">
              <h4 className="font-semibold text-purple-900 mb-2">Así piensas y actúas en tu día a día</h4>
              <p className="text-gray-700 text-sm">
                {getProfileContent(primaryDimension, primaryScore)?.thinking}
              </p>
            </div>

            {/* Growth Opportunities */}
            <div className="mb-6 p-6 bg-amber-50 rounded-lg border-l-4 border-amber-500">
              <h4 className="font-semibold text-amber-900 mb-2">️ Oportunidades para seguir creciendo</h4>
              <p className="text-gray-700 text-sm">
                {getProfileContent(primaryDimension, primaryScore)?.growth}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* All Dimensions Comparison */}
        <Card className="mb-8 shadow-lg border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Tu Perfil Completo</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <CompetencyRadarChart
              data={sorted.map(([dim, score]) => ({
                name: getDimensionInfo(dim).label,
                value: score,
                fullMark: 100,
              }))}
              title="Análisis Integral Despega Cerebral"
              description="Visualización de tus 4 dimensiones clave"
              strokeColor="#3b82f6"
              fillColor="#3b82f6"
              height={400}
            />

            <div className="space-y-6 mt-8">
              {sorted.map(([dim, score]) => (
                <div key={dim}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{getDimensionInfo(dim).emoji}</span>
                      <span className="font-semibold text-gray-800">
                        {getDimensionInfo(dim).label}
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">{score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className={`h-4 rounded-full transition-all ${
                        dim === "energia"
                          ? "bg-blue-500"
                          : dim === "enfoque"
                            ? "bg-green-500"
                            : dim === "relaciones"
                              ? "bg-orange-500"
                              : "bg-purple-500"
                      }`}
                      style={{ width: `${score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* User Level Badge */}
        <div className="mb-8 text-center">
          <Badge className={`px-4 py-2 text-base ${getLevelBadge().bg} ${getLevelBadge().text}`}>
            Tu Nivel: {getLevelBadge().label}
          </Badge>
          <p className="text-sm text-gray-600 mt-2">Las recomendaciones están adaptadas a tu nivel</p>
        </div>

        {/* Personalized Recommendations by Area */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Recomendaciones Personalizadas</h2>
          <p className="text-gray-600 mb-6">Basadas en tu nivel actual ({getLevelBadge().label}) - acciones concretas y adaptadas para ti</p>
          <div className="grid md:grid-cols-2 gap-6">
            {sorted.map(([dim, score]) => (
              <Card key={dim} className="border-2">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <span className="text-2xl">{getDimensionInfo(dim).emoji}</span>
                      {getProfileContent(dim, score)?.label}
                    </CardTitle>
                    <Badge className={getDimensionInfo(dim).bgColor}>
                      {Math.round(score)}%
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {getDimensionInfo(dim).description}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="font-semibold text-sm text-gray-700 mb-2">Tu próximos pasos ({getLevelBadge().label}):</p>
                      <ul className="space-y-2">
                        {getRecommendationsByLevel(dim, score).map((rec, i) => (
                          <li key={i} className="flex gap-2 text-sm text-gray-700">
                            <span className="font-bold text-blue-600 flex-shrink-0">•</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="text-center">
          <Button
            onClick={() => router.push("/despega")}
            size="lg"
            className="px-8"
          >
            Volver al Dashboard
          </Button>
          <p className="text-sm text-gray-500 mt-4">
            Tus resultados han sido guardados en tu perfil.
          </p>
        </div>
      </div>
    </div>
  )
}
