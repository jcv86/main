"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { TestIntroScreen } from "@/components/test-intro-screen"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { ArrowLeft, ArrowRight, CheckCircle, Check } from "lucide-react"
import { UnifiedTestSystem } from "@/lib/unified-test-system"
import { useToast } from "@/hooks/use-toast"

// DISC-Based Questions (20 questions) - Replaces generic energy/focus/relations questions
// Maps to: Dominance (D), Influence (I), Steadiness (S), Conscientiousness (C)
const A1_QUESTIONS = [
  // DOMINANCE - Results-oriented, Competitive, Direct
  { id: 1, area: "dominancia", type: "scale", text: "Prefiero tomar decisiones rápidas y directas sin hesitación", min: 1, max: 10, minLabel: "Analizo primero", maxLabel: "Decido rápido" },
  { id: 2, area: "dominancia", type: "multiple", text: "¿Cómo respondes ante desafíos o competencia?", options: ["Evito conflictos", "Prefiero cooperar", "Compito moderadamente", "Busco ganar", "Debo ganar a toda costa"], weights: [0.1, 0.25, 0.5, 0.8, 1.0] },
  { id: 3, area: "dominancia", type: "scale", text: "¿Cuánto necesitas tener control sobre las situaciones?", min: 1, max: 10, minLabel: "Poco control", maxLabel: "Control total" },
  { id: 4, area: "dominancia", type: "multiple", text: "¿Cuál es tu estilo de comunicación?", options: ["Muy diplomático", "Considerado", "Directo", "Muy directo", "Brutal honestidad"], weights: [0.1, 0.3, 0.6, 0.85, 1.0] },
  { id: 5, area: "dominancia", type: "scale", text: "¿Te gusta tomar riesgos calculados para lograr objetivos?", min: 1, max: 10, minLabel: "Prefiero seguridad", maxLabel: "Busco riesgos" },
  
  // INFLUENCE - Persuasive, Enthusiastic, Social
  { id: 6, area: "influencia", type: "multiple", text: "¿Con qué frecuencia socializas o conectas con gente nueva?", options: ["Casi nunca", "Raramente", "Ocasionalmente", "Frecuentemente", "Constantemente"], weights: [0.1, 0.3, 0.55, 0.8, 1.0] },
  { id: 7, area: "influencia", type: "scale", text: "¿Cuán fácil te resulta persuadir o convencer a otros?", min: 1, max: 10, minLabel: "Muy difícil", maxLabel: "Muy fácil" },
  { id: 8, area: "influencia", type: "multiple", text: "¿Cómo describes tu entusiasmo y optimismo?", options: ["Reservado", "Moderado", "Normal", "Entusiasta", "Extremadamente entusiasta"], weights: [0.15, 0.35, 0.55, 0.8, 0.95] },
  { id: 9, area: "influencia", type: "scale", text: "¿Disfrutas ser el centro de atención?", min: 1, max: 10, minLabel: "Prefiero pasar desapercibido", maxLabel: "Amo la atención" },
  { id: 10, area: "influencia", type: "multiple", text: "¿Cómo te adaptas a nuevas personas o entornos?", options: ["Lentamente con dificultad", "Lentamente", "Moderadamente", "Rápidamente", "Instantáneamente"], weights: [0.1, 0.3, 0.55, 0.8, 1.0] },
  
  // STEADINESS - Loyal, Patient, Stable
  { id: 11, area: "estabilidad", type: "multiple", text: "¿Cómo prefieres tu entorno de trabajo?", options: ["Muy dinámico y caótico", "Dinámico", "Equilibrado", "Estable", "Muy predecible"], weights: [1.0, 0.7, 0.55, 0.8, 0.95] },
  { id: 12, area: "estabilidad", type: "scale", text: "¿Eres paciente y tolerante con los errores de otros?", min: 1, max: 10, minLabel: "Poco paciente", maxLabel: "Muy paciente" },
  { id: 13, area: "estabilidad", type: "multiple", text: "¿Cuál es tu nivel de lealtad hacia personas o equipos?", options: ["Cambio fácilmente", "Moderadamente leal", "Leal", "Muy leal", "Extremadamente leal"], weights: [0.1, 0.35, 0.6, 0.85, 1.0] },
  { id: 14, area: "estabilidad", type: "scale", text: "¿Prefieres tareas o proyectos de largo plazo versus cambio constante?", min: 1, max: 10, minLabel: "Cambio constante", maxLabel: "Largo plazo" },
  { id: 15, area: "estabilidad", type: "multiple", text: "¿Cómo reaccionas ante cambios no esperados?", options: ["Entro en pánico", "Me perturba", "Me adapto", "Casi no me afecta", "Lo veo como oportunidad"], weights: [0.05, 0.25, 0.55, 0.75, 0.95] },
  
  // CONSCIENTIOUSNESS - Analytical, Organized, Quality-focused
  { id: 16, area: "consciencia", type: "scale", text: "¿Cuán importante es el análisis detallado antes de decidir?", min: 1, max: 10, minLabel: "Decido por intuición", maxLabel: "Necesito datos" },
  { id: 17, area: "consciencia", type: "multiple", text: "¿Cuál es tu relación con los procedimientos y reglas?", options: ["Las ignoro", "Las sigo cuando me conviene", "Generalmente las sigo", "Las sigo siempre", "Necesito más reglas"], weights: [1.0, 0.7, 0.55, 0.85, 0.95] },
  { id: 18, area: "consciencia", type: "scale", text: "¿Qué tan importante es la perfección y calidad en tu trabajo?", min: 1, max: 10, minLabel: "Está bien lo aproximado", maxLabel: "Debe ser perfecto" },
  { id: 19, area: "consciencia", type: "multiple", text: "¿Cómo manejas los errores o inconsistencias?", options: ["Los ignoro", "Los tolero", "Los noto", "Los corijo siempre", "Me obsesiono"], weights: [0.1, 0.3, 0.55, 0.8, 1.0] },
  { id: 20, area: "consciencia", type: "scale", text: "¿Necesitas evidencia o pruebas antes de aceptar información nueva?", min: 1, max: 10, minLabel: "Confío en palabras", maxLabel: "Necesito evidencia" },
]

export default function A1CerebralPage() {
  const router = useRouter()
  const supabase = createClient()
  const [stage, setStage] = useState<"intro" | "test" | "results">("intro")
  const [currentIdx, setCurrentIdx] = useState(0)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle")
  const [saveError, setSaveError] = useState<string | null>(null)
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
    // DISC Profile content based on Juan Vial framework
    const profileContent: Record<string, Record<string, any>> = {
      dominancia: {
        label: "Dominancia - Orientación a Resultados",
        naturalBehavior: score > 70
          ? "Actúas con decisión y dirección clara. Orientado a resultados, buscas siempre lograr objetivos. Tu comunicación es directa y sin rodeos, priorizando la eficiencia."
          : score > 50
          ? "Buscas lograr resultados, aunque a veces balanceas entre dirección y consideración. Tienes iniciativa, pero no siempre asumes el control total."
          : "Tu orientación es más reflexiva que decisoria. Prefieres consultar antes de actuar, evitando la confrontación.",
        
        connections: score > 70
          ? "Te conectas con personas orientadas a logros que valoran la velocidad y la efectividad. Prefieres equipos que ejecutan sin dilación."
          : "Buscas personas que compartan tus objetivos, aunque a veces sientas que los demás van más lento.",
        
        uncomfortable: score < 50
          ? "Los procesos lentos o indecisiones te frustran. Te incomoda no tener control sobre el progreso. La falta de claridad te paraliza."
          : "Aunque generalmente decididor, puede incomodarte cuando otros no comparten tu velocidad.",
        
        thinking: score > 70
          ? "Piensas estratégicamente en resultados. Tomas decisiones rápidas con datos disponibles. Tu mente está en '¿cómo ganamos?'"
          : score > 50
          ? "Piensas en objetivos, aunque a veces te detienes para reflexionar sobre alternativas."
          : "Tu pensamiento busca consenso. Necesitas validación antes de decidir direcciones importantes.",
        
        growth: score > 70
          ? "Tu oportunidad es desarrollar empatía en la ejecución. No todos disfrutan el ritmo de competencia. Escucha los tiempos ajenos."
          : "Necesitas practicar tomar decisiones con información del 70% en lugar del 100%. La velocidad estratégica vence a la perfección.",
      },
      
      influencia: {
        label: "Influencia - Persuasión y Motivación",
        naturalBehavior: score > 70
          ? "Actúas con entusiasmo y calidez natural. Inspiras a otros mediante tu optimismo y capacidad de conectar. Te expresas con pasión, contagiando motivación."
          : score > 50
          ? "Buscas inspirar a otros, aunque a veces tu mensaje se diluye. Tienes capacidad de conexión, pero necesitas estructura para amplificarla."
          : "Tu acercamiento es más reservado. Prefieres observar que ser el centro. La persuasión no es tu fortaleza natural.",
        
        connections: score > 70
          ? "Te conectas con personas que valoran la energía positiva, la creatividad y la autenticidad. Te sientes vivo en equipos dinámicos y colaborativos."
          : "Buscas ambientes sociales, aunque a veces sientas que tu mensaje no llega completamente.",
        
        uncomfortable: score < 50
          ? "Los entornos sombríos o altamente estructurados te agobian. Te incomoda no poder expresarte o conectar genuinamente. El aislamiento te consume."
          : "Aunque generalmente extrovertido, puede incomodarte no ser escuchado o falta de respuesta a tus ideas.",
        
        thinking: score > 70
          ? "Piensas imaginando posibilidades y oportunidades. Tu mente busca conexiones creativas entre personas y ideas. Ves potencial en todo."
          : score > 50
          ? "Piensas en formas de conectar, aunque a veces te pierdes en detalles de implementación."
          : "Tu pensamiento es más literal. Necesitas entrenar ver oportunidades en lugar de limitaciones.",
        
        growth: score > 70
          ? "Tu oportunidad es desarrollar seguimiento en la ejecución. La inspiración sin resultados es solo aire. Aprende a cerrar ciclos."
          : "Necesitas UNA alianza auténtica donde puedas ser completamente tú. De esa plataforma, expande tu influencia naturalmente.",
      },
      
      estabilidad: {
        label: "Estabilidad - Lealtad y Apoyo",
        naturalBehavior: score > 70
          ? "Actúas con calma y consistencia. Eres la roca donde otros confían. Tu lealtad es inquebrantable y tu paciencia es legendaria en tu círculo."
          : score > 50
          ? "Buscas aportar estabilidad, aunque a veces necesitas movimiento o cambio. Eres confiable, pero ocasionalmente deseas aventura."
          : "Tu acercamiento es más dinámico. Prefieres variedad sobre predictibilidad. La rutina no es tu motivación.",
        
        connections: score > 70
          ? "Te conectas profundamente con personas que valoran la lealtad, la confianza y el apoyo genuino. Prefieres pocas relaciones hondas que muchas superficiales."
          : "Buscas personas stables y confiables, aunque a veces el mundo te parece demasiado volátil.",
        
        uncomfortable: score < 50
          ? "Los cambios constantes o la falta de estructura te perturban. Te incomoda la traición o la inconsistencia ajena. Necesitas predecibilidad."
          : "Aunque generalmente estable, puede incomodarte presión para cambiar rápidamente.",
        
        thinking: score > 70
          ? "Piensas considerando el impacto en otros. Tu decisión busca minimizar disrupción. Eres reflexivo y empático."
          : score > 50
          ? "Piensas en lo que es mejor para el grupo, aunque a veces necesitas pensar en ti."
          : "Tu pensamiento es más individual. Necesitas entrenar la perspectiva colectiva.",
        
        growth: score > 70
          ? "Tu oportunidad es iniciarse en cambios controlados. El mundo evolucionará con o sin ti. Aprende a liderar en transiciones."
          : "Necesitas buscar cambio positivo en UNA área importante. No resistir el cambio, sino conducirlo.",
      },
      
      consciencia: {
        label: "Consciencia - Precisión y Calidad",
        naturalBehavior: score > 70
          ? "Actúas con lógica y precisión. Tu análisis es profundo, valorando los datos antes de suposiciones. Te expresas con cautela y claridad, buscando siempre lo correcto."
          : score > 50
          ? "Buscas precisión, aunque a veces equilibras entre perfección y pragmatismo. Tienes estándares altos, pero permites lo 'suficientemente bueno'."
          : "Tu acercamiento es más flexible. Prefieres velocidad sobre perfección. Los detalles no siempre te cautivan.",
        
        connections: score > 70
          ? "Te conectas con personas que trabajan con criterio, cuidado y atención al detalle. Te sientes a gusto cuando hay reglas claras y argumentos sólidos."
          : "Buscas personas confiables y coherentes, aunque a veces sientas que el mundo es demasiado impreciso.",
        
        uncomfortable: score < 50
          ? "Los entornos improvisados o desordenados te bloquean. Te incomoda decidir sin datos o percibes ambigüedad. Necesitas estructura y profesionalismo."
          : "Aunque generalmente meticuloso, puede incomodarte exceso de perfeccionismo.",
        
        thinking: score > 70
          ? "Piensas con orden y profundidad, analizando antes de actuar. Te apoyas en hechos, evitando suposiciones. Evalúas cada paso."
          : score > 50
          ? "Piensas en lo importante, aunque a veces actúas sin análisis completo."
          : "Tu pensamiento es más directo. Necesitas entrenar el análisis antes de la acción.",
        
        growth: score > 70
          ? "Tu oportunidad es compartir tus ideas en proceso, no solo cuando son perfectas. Confía en tu criterio, incluso sin toda la información."
          : "Necesitas crear UN sistema donde documentes decisiones importantes. El método te liberará de la ansiedad.",
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

  // Map questions to DISC dimensions
  const questionToDISC: Record<number, "dominancia" | "influencia" | "estabilidad" | "consciencia"> = {
    1: "dominancia", 2: "dominancia", 3: "dominancia", 4: "dominancia", 5: "dominancia",
    6: "influencia", 7: "influencia", 8: "influencia", 9: "influencia", 10: "influencia",
    11: "estabilidad", 12: "estabilidad", 13: "estabilidad", 14: "estabilidad", 15: "estabilidad",
    16: "consciencia", 17: "consciencia", 18: "consciencia", 19: "consciencia", 20: "consciencia",
  }

  // Calculate DISC scores (0-100 per dimension)
  const calculateDISCScores = () => {
    const scores = {
      dominancia: 0,
      influencia: 0,
      estabilidad: 0,
      consciencia: 0,
    }
    const counts = {
      dominancia: 0,
      influencia: 0,
      estabilidad: 0,
      consciencia: 0,
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
      dominancia: counts.dominancia > 0 ? Math.round(scores.dominancia / counts.dominancia) : 0,
      influencia: counts.influencia > 0 ? Math.round(scores.influencia / counts.influencia) : 0,
      estabilidad: counts.estabilidad > 0 ? Math.round(scores.estabilidad / counts.estabilidad) : 0,
      consciencia: counts.consciencia > 0 ? Math.round(scores.consciencia / counts.consciencia) : 0,
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
        dominancia: scores.dominancia,
        influencia: scores.influencia,
        estabilidad: scores.estabilidad,
        consciencia: scores.consciencia,
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

      console.log("[v0] Test save result:", result)

      if (!result.savedToDatabase) {
        console.error("[v0] Failed to save test results:", result.error)
        setStage("results")
        // Still show results page even if save failed, user can retry
      } else {
        console.log("[v0] Test results saved successfully to database. Redirecting immediately...")
        setStage("results")
        // Redirect immediately after database confirms save
        router.push("/dashboard?refresh=true")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Track test start time
  const startTimeRef = useRef<number | null>(null)

  // Handle dashboard navigation - verify save before redirecting
  const handleGoToDashboard = async () => {
    console.log("[v0] Dashboard button clicked, verifying save status...")
    
    setSaveStatus("saving")
    setSaveError(null)

    try {
      if (!user?.email) {
        throw new Error("Usuario no identificado")
      }

      // Calculate scores
      const scores = calculateScores()
      
      const testResults = {
        energia: scores.energia,
        enfoque: scores.enfoque,
        relaciones: scores.relaciones,
        plan_ejecutivo: scores.plan_ejecutivo,
        answers: answers,
      }

      console.log("[v0] Re-saving test results on dashboard navigation...", testResults)

      // Save with explicit confirmation
      const result = await UnifiedTestSystem.saveTestResult(
        user.email,
        "Despega Cerebral" as any,
        testResults,
        duration
      )

      if (!result.savedToDatabase) {
        throw new Error(result.error || "No se pudo guardar los resultados")
      }

      console.log("[v0] Test save confirmed, redirecting to dashboard now...")
      setSaveStatus("saved")

      // Wait a moment to show success state
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Redirect only after confirmed save
      router.push("/dashboard?refresh=true")
    } catch (error) {
      console.error("[v0] Error saving before redirect:", error)
      setSaveStatus("error")
      setSaveError(
        error instanceof Error ? error.message : "Error al guardar resultados. Intenta de nuevo."
      )
    }
  }

  const areaColors = {
    dominancia: "bg-red-100 text-red-900",
    influencia: "bg-yellow-100 text-yellow-900",
    estabilidad: "bg-blue-100 text-blue-900",
    consciencia: "bg-green-100 text-green-900",
  }

  const areaLabels = {
    dominancia: "Dominancia",
    influencia: "Influencia",
    estabilidad: "Estabilidad",
    consciencia: "Consciencia",
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

  // Get dimension info for DISC display
  const getDimensionInfo = (dim: string) => {
    const info: Record<string, any> = {
      dominancia: {
        label: "Dominancia",
        emoji: "🎯",
        color: "bg-red-50 border-red-200",
        textColor: "text-red-700",
        bgColor: "bg-red-100",
        description: "Tu orientación a resultados, decisión y liderazgo directo",
      },
      influencia: {
        label: "Influencia",
        emoji: "💫",
        color: "bg-yellow-50 border-yellow-200",
        textColor: "text-yellow-700",
        bgColor: "bg-yellow-100",
        description: "Tu capacidad de persuadir, motivar e inspirar a otros",
      },
      estabilidad: {
        label: "Estabilidad",
        emoji: "🛡️",
        color: "bg-blue-50 border-blue-200",
        textColor: "text-blue-700",
        bgColor: "bg-blue-100",
        description: "Tu lealtad, paciencia y apoyo al equipo",
      },
      consciencia: {
        label: "Consciencia",
        emoji: "🔍",
        color: "bg-green-50 border-green-200",
        textColor: "text-green-700",
        bgColor: "bg-green-100",
        description: "Tu precisión, análisis detallado y búsqueda de calidad",
      },
    }
    return info[dim] || info.dominancia
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
            <div className="space-y-6">
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
        <div className="text-center space-y-4">
          <Button
            onClick={handleGoToDashboard}
            disabled={saveStatus === "saving" || saveStatus === "saved"}
            size="lg"
            className="px-8 w-full md:w-auto"
          >
            {saveStatus === "saving" && (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                Guardando Resultados...
              </>
            )}
            {saveStatus === "saved" && (
              <>
                <Check className="h-4 w-4 mr-2" />
                Guardado - Redirigiendo...
              </>
            )}
            {saveStatus === "error" && "Reintentar"}
            {saveStatus === "idle" && "Ir a mi Dashboard Despega"}
          </Button>
          
          {saveStatus === "error" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-800">{saveError}</p>
              <p className="text-xs text-red-600 mt-2">Haz clic en el botón para reintentar guardar.</p>
            </div>
          )}
          
          <p className="text-sm text-gray-600">
            {saveStatus === "idle" && "Tus resultados serán guardados cuando hagas clic."}
            {saveStatus === "saving" && "Sincronizando tus resultados con el servidor..."}
            {saveStatus === "saved" && "✓ Tus resultados fueron guardados exitosamente en tu perfil."}
            {saveStatus === "error" && "Ocurrió un error al guardar. Por favor intenta de nuevo."}
          </p>
        </div>
      </div>
    </div>
  )
}
