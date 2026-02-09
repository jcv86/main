"use client"

// Version: DISC-2024-v2 - Force cache invalidation
// Last update: Updated all 20 DISC-based questions with proper scoring
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

// DISC-Based Questions (20 questions) - Complete replacement with new nomenclature
// Maps to: Acción (Action), Inspiración (Inspiration), Apoyo (Support), Excelencia (Excellence)
const A1_QUESTIONS_DISC_2024 = [
  // ACCIÓN - Results-oriented, Competitive, Direct
  { id: 1, area: "accion", type: "scale", text: "Prefiero tomar decisiones rápidas y directas sin hesitación", min: 1, max: 10, minLabel: "Analizo primero", maxLabel: "Decido rápido" },
  { id: 2, area: "accion", type: "multiple", text: "¿Cómo respondes ante desafíos o competencia?", options: ["Evito conflictos", "Prefiero cooperar", "Compito moderadamente", "Busco ganar", "Debo ganar a toda costa"], weights: [0.1, 0.25, 0.5, 0.8, 1.0] },
  { id: 3, area: "accion", type: "scale", text: "¿Cuánto necesitas tener control sobre las situaciones?", min: 1, max: 10, minLabel: "Poco control", maxLabel: "Control total" },
  { id: 4, area: "accion", type: "multiple", text: "¿Cuál es tu estilo de comunicación?", options: ["Muy diplomático", "Considerado", "Directo", "Muy directo", "Brutal honestidad"], weights: [0.1, 0.3, 0.6, 0.85, 1.0] },
  { id: 5, area: "accion", type: "scale", text: "¿Te gusta tomar riesgos calculados para lograr objetivos?", min: 1, max: 10, minLabel: "Prefiero seguridad", maxLabel: "Busco riesgos" },
  
  // INSPIRACIÓN - Persuasive, Enthusiastic, Social
  { id: 6, area: "inspiracion", type: "multiple", text: "¿Con qué frecuencia socializas o conectas con gente nueva?", options: ["Casi nunca", "Raramente", "Ocasionalmente", "Frecuentemente", "Constantemente"], weights: [0.1, 0.3, 0.55, 0.8, 1.0] },
  { id: 7, area: "inspiracion", type: "scale", text: "¿Cuán fácil te resulta persuadir o convencer a otros?", min: 1, max: 10, minLabel: "Muy difícil", maxLabel: "Muy fácil" },
  { id: 8, area: "inspiracion", type: "multiple", text: "¿Cómo describes tu entusiasmo y optimismo?", options: ["Reservado", "Moderado", "Normal", "Entusiasta", "Extremadamente entusiasta"], weights: [0.15, 0.35, 0.55, 0.8, 0.95] },
  { id: 9, area: "inspiracion", type: "scale", text: "¿Disfrutas ser el centro de atención?", min: 1, max: 10, minLabel: "Prefiero pasar desapercibido", maxLabel: "Amo la atención" },
  { id: 10, area: "inspiracion", type: "multiple", text: "¿Cómo te adaptas a nuevas personas o entornos?", options: ["Lentamente con dificultad", "Lentamente", "Moderadamente", "Rápidamente", "Instantáneamente"], weights: [0.1, 0.3, 0.55, 0.8, 1.0] },
  
  // APOYO - Loyal, Patient, Stable
  { id: 11, area: "apoyo", type: "multiple", text: "¿Cómo prefieres tu entorno de trabajo?", options: ["Muy dinámico y caótico", "Dinámico", "Equilibrado", "Estable", "Muy predecible"], weights: [1.0, 0.7, 0.55, 0.8, 0.95] },
  { id: 12, area: "apoyo", type: "scale", text: "¿Eres paciente y tolerante con los errores de otros?", min: 1, max: 10, minLabel: "Poco paciente", maxLabel: "Muy paciente" },
  { id: 13, area: "apoyo", type: "multiple", text: "¿Cuál es tu nivel de lealtad hacia personas o equipos?", options: ["Cambio fácilmente", "Moderadamente leal", "Leal", "Muy leal", "Extremadamente leal"], weights: [0.1, 0.35, 0.6, 0.85, 1.0] },
  { id: 14, area: "apoyo", type: "scale", text: "¿Prefieres tareas o proyectos de largo plazo versus cambio constante?", min: 1, max: 10, minLabel: "Cambio constante", maxLabel: "Largo plazo" },
  { id: 15, area: "apoyo", type: "multiple", text: "¿Cómo reaccionas ante cambios no esperados?", options: ["Entro en pánico", "Me perturba", "Me adapto", "Casi no me afecta", "Lo veo como oportunidad"], weights: [0.05, 0.25, 0.55, 0.75, 0.95] },
  
  // EXCELENCIA - Analytical, Organized, Quality-focused
  { id: 16, area: "excelencia", type: "scale", text: "¿Cuán importante es el análisis detallado antes de decidir?", min: 1, max: 10, minLabel: "Decido por intuición", maxLabel: "Necesito datos" },
  { id: 17, area: "excelencia", type: "multiple", text: "¿Cuál es tu relación con los procedimientos y reglas?", options: ["Las ignoro", "Las sigo cuando me conviene", "Generalmente las sigo", "Las sigo siempre", "Necesito más reglas"], weights: [1.0, 0.7, 0.55, 0.85, 0.95] },
  { id: 18, area: "excelencia", type: "scale", text: "¿Qué tan importante es la perfección y calidad en tu trabajo?", min: 1, max: 10, minLabel: "Está bien lo aproximado", maxLabel: "Debe ser perfecto" },
  { id: 19, area: "excelencia", type: "multiple", text: "¿Cómo manejas los errores o inconsistencias?", options: ["Los ignoro", "Los tolero", "Los noto", "Los corijo siempre", "Me obsesiono"], weights: [0.1, 0.3, 0.55, 0.8, 1.0] },
  { id: 20, area: "excelencia", type: "scale", text: "¿Necesitas evidencia o pruebas antes de aceptar información nueva?", min: 1, max: 10, minLabel: "Confío en palabras", maxLabel: "Necesito evidencia" },
]

// Use the new DISC questions - THIS IS THE ACTIVE QUESTIONS ARRAY
const A1_QUESTIONS = A1_QUESTIONS_DISC_2024

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
        console.log("[v0] A1 Cerebral Page - Total questions loaded:", A1_QUESTIONS.length)
        console.log("[v0] A1_QUESTIONS array:", A1_QUESTIONS.map(q => ({ id: q.id, area: q.area, text: q.text.substring(0, 50) })))
        
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
    // Profile content based on new nomenclature: Acción, Inspiración, Apoyo, Excelencia
    const profileContent: Record<string, Record<string, any>> = {
      accion: {
        label: "Acción - Orientación a Resultados",
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
      
      inspiracion: {
        label: "Inspiración - Persuasión y Motivación",
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
          ? "Piensas imaginando posibilidades y oportunidades. Tu mente busca conexiones creativas entre personas e ideas. Ves potencial en todo."
          : score > 50
          ? "Piensas en formas de conectar, aunque a veces te pierdes en detalles de implementación."
          : "Tu pensamiento es más literal. Necesitas entrenar ver oportunidades en lugar de limitaciones.",
        
        growth: score > 70
          ? "Tu oportunidad es desarrollar seguimiento en la ejecución. La inspiración sin resultados es solo aire. Aprende a cerrar ciclos."
          : "Necesitas UNA alianza auténtica donde puedas ser completamente tú. De esa plataforma, expande tu capacidad de inspirar.",
      },
      
      apoyo: {
        label: "Apoyo - Lealtad y Confiabilidad",
        naturalBehavior: score > 70
          ? "Actúas con calma y consistencia. Eres la roca donde otros confían. Tu lealtad es inquebrantable y tu paciencia es legendaria en tu círculo."
          : score > 50
          ? "Buscas aportar apoyo, aunque a veces necesitas movimiento o cambio. Eres confiable, pero ocasionalmente deseas aventura."
          : "Tu acercamiento es más dinámico. Prefieres variedad sobre predictibilidad. La rutina no es tu motivación.",
        
        connections: score > 70
          ? "Te conectas profundamente con personas que valoran la lealtad, la confianza y el apoyo genuino. Prefieres pocas relaciones hondas que muchas superficiales."
          : "Buscas personas confiables y estables, aunque a veces el mundo te parece demasiado volátil.",
        
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
      
      excelencia: {
        label: "Excelencia - Precisión y Calidad",
        naturalBehavior: score > 70
          ? "Actúas con lógica y precisión. Tu análisis es profundo, valorando los datos antes de suposiciones. Te expresas con cautela y claridad, buscando siempre lo correcto."
          : score > 50
          ? "Buscas precisión, aunque a veces equilibras entre perfección y pragmatismo. Tienes estándares altos, pero permites lo 'suficientemente bueno'."
          : "Tu acercamiento es más flexible. Prefieres velocidad sobre perfección. Los detalles no siempre te cautivan.",
        
        connections: score > 70
          ? "Te conectas con personas que trabajan con criterio, cuidado y atención al detalle. Te sientes a gusto cuando hay reglas claras y argumentos sólidos."
          : "Buscas personas confiables y coherentes, aunque a veces sientas que el mundo es demasiado impreciso.",
        
        uncomfortable: score < 50
          ? "Los entornos improvisados o desordenados te bloquean. Te incomoda decidir sin datos o percibir ambigüedad. Necesitas estructura y profesionalismo."
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

  const getRecommendationsByLevel = (dimension: string, score: number) => {
    // Recommendations based on new nomenclature
    const recommendations = {
      accion: {
        principiante: [
          "Practica escuchar perspectivas diferentes antes de decidir.",
          "Define objetivos claros pero permite ajustes en el camino.",
          "Celebra pequeñas victorias del equipo, no solo grandes triunfos.",
          "Pregunta '¿y tú qué piensas?' antes de imponer tu visión.",
        ],
        intermedio: [
          "Delega controlando menos - tu equipo crecerá más.",
          "Negocia ganador-ganador, no solo ganar a toda costa.",
          "Toma decisiones rápidas pero comunica el 'por qué' con claridad.",
          "Revisa: ¿cuándo fue la última vez que cambié de opinión?",
        ],
        avanzado: [
          "Lidera movimientos que impacten más allá de tu control directo.",
          "Mentorea a otros en velocidad estratégica sin sacrificar empatía.",
          "Crea culturas donde ganar significa que todos crecen.",
          "Influencia política: construye alianzas que multiplican tu impacto.",
        ],
      },
      inspiracion: {
        principiante: [
          "Esta semana: cuenta una historia personal auténtica en 1 conversación.",
          "Busca UNA persona que necesite motivación y ofrécele escucha activa.",
          "Propón UNA idea creativa en tu equipo, aunque sea pequeña.",
          "Presta atención: ¿cuáles emociones mueven a otros?",
        ],
        intermedio: [
          "Crea sistemas que sostengan tu motivación - no deje que dependa solo de emociones.",
          "Mentorea otros en cómo inspirar sin perder foco en ejecución.",
          "Comunica tu visión clara: ¿qué futuro ves?",
          "Multiplica tu influencia - valida que tu mensaje llegó completamente.",
        ],
        avanzado: [
          "Lidera movimientos culturales que inspiren transformación.",
          "Mentorea otros en cómo inspirar multiplica tu influencia.",
          "Construye comunidades que crecen bajo tu visión compartida.",
          "Impacto multiplicador: tu inspiración genera otros inspiradores.",
        ],
      },
      apoyo: {
        principiante: [
          "Esta semana: pregunta a alguien qué necesita de ti.",
          "Mantén UNA relación importante con consistencia absoluta.",
          "Ofrece apoyo sin esperar reconocimiento - observa tu reacción.",
          "Define qué estabilidad significa para ti en 1 frase.",
        ],
        intermedio: [
          "Lidera pequeños cambios - prueba que puedes adaptarte.",
          "Comunica tu necesidad de estabilidad al equipo claramente.",
          "Mentorea a otros en paciencia y apoyo sostenido.",
          "Busca cambio positivo en UNA área importante.",
        ],
        avanzado: [
          "Lidera transiciones siendo el punto de apoyo para otros.",
          "Construye sistemas donde tu confiabilidad multiplica el crecimiento.",
          "Crea culturas donde apoyo y crecimiento coexisten.",
          "Tu apoyo como fortaleza: enseña otros a cultivarla.",
        ],
      },
      excelencia: {
        principiante: [
          "Esta semana: documenta UNA decisión importante con razonamiento claro.",
          "Comparte tus estándares con otros - no es perfeccionismo, es excelencia.",
          "Busca el 70% de información - la perfección no siempre es la meta.",
          "Pregunta: ¿cuándo fue la última vez que actué sin análisis?",
        ],
        intermedio: [
          "Crea UN sistema donde documentes decisiones importantes.",
          "Mentorea a otros en cómo buscar excelencia sin parálisis.",
          "Comparte tus ideas en proceso, no solo cuando sean perfectas.",
          "Revisa: ¿dónde el perfectionism-mo me detiene?",
        ],
        avanzado: [
          "Lidera transformación a través de rigor metodológico.",
          "Construye sistemas donde la excelencia es sostenible.",
          "Mentorea a otros en cómo alcanzar excelencia sin burnout.",
          "Tu excelencia como fortaleza: enseña otros a exigirse.",
        ],
      },
    }
          "Practica escuchar más que hablar (al menos 60-40).",
          "Nota 3 cosas buenas en otros y comparte feedback positivo.",
          "Conecta personas que deberían conocerse - sé catalizador.",
        ],
        intermedio: [
          "Desarrolla 3-5 historias que demuestren tu punto, no datos solos.",
          "Influencia genuina: ayuda primero, pide después.",
          "Crea un grupo o comunidad donde otros se conecten.",
          "Estudia a 1 líder inspirador - ¿cómo genera energía?",
        ],
        avanzado: [
          "Construye movimientos que duran más que tu presencia.",
          "Mentorea otros en cómo inspirar - multiplica tu influencia.",
          "Crea contenido/espacios que inspiran a miles.",
          "Tu legado: ¿qué creó que seguirá sin ti?",
        ],
      },
      estabilidad: {
        principiante: [
          "Acepta 1 cambio pequeño cada semana - práctica segura.",
          "Comunica tu necesidad de estabilidad al equipo claramente.",
          "Documenta procesos para sentirte más seguro.",
          "Encuentra 1 persona estable con quien compartir preocupaciones.",
        ],
        intermedio: [
          "Lidera transiciones siendo el punto de estabilidad para otros.",
          "Adapta tu ritmo sin perder tus valores fundamentales.",
          "Construye resiliencia: ¿qué cambios ya navegaste bien?",
          "Mentorea a otros en cómo mantener calma en la tormenta.",
        ],
        avanzado: [
          "Sed la roca donde otros confían durante transformaciones.",
          "Anticipa cambios - sé proactivo, no solo reactivo.",
          "Crea cultura donde estabilidad y crecimiento coexisten.",
          "Tu estabilidad como fortaleza: enseña otros a tenerla.",
        ],
      },
      consciencia: {
        principiante: [
          "Elige 1 cosa importante y hazla bien, no todo mediocre.",
          "Documenta decisiones: ¿por qué elegiste A sobre B?",
          "Busca feedback específico, no elogios generales.",
          "Aprende 1 metodología o framework que mejore tu precisión.",
        ],
        intermedio: [
          "Crea sistemas donde la calidad sea automática (checklists, pruebas).",
          "Comparte tu rigor sin paralizar a otros con perfeccionismo.",
          "Análisis profundo + decisión rápida: encontra tu punto de balance.",
          "Mentorea a otros en análisis - enseña a pensar, no qué pensar.",
        ],
        avanzado: [
          "Desarrolla expertise verdadera que otros buscan y respetan.",
          "Crea estándares de calidad que elevan a todo el equipo.",
          "Comunica complejidad en forma simple y comprensible.",
          "Tu precisión como ventaja: enseña la disciplina que la requiere.",
        ],
      },
    }

    return recommendations[dimension as keyof typeof recommendations]?.[userLevel as keyof any] || []
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
    console.log("[v0] Starting test - A1_QUESTIONS length:", A1_QUESTIONS.length)
    console.log("[v0] First question:", A1_QUESTIONS[0])
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
    const questionToArea: Record<number, "accion" | "inspiracion" | "apoyo" | "excelencia"> = {
      1: "accion", 2: "accion", 3: "accion", 4: "accion", 5: "accion",
      6: "inspiracion", 7: "inspiracion", 8: "inspiracion", 9: "inspiracion", 10: "inspiracion",
      11: "apoyo", 12: "apoyo", 13: "apoyo", 14: "apoyo", 15: "apoyo",
      16: "excelencia", 17: "excelencia", 18: "excelencia", 19: "excelencia", 20: "excelencia",
    }

  // Calculate DISC scores (0-100 per dimension)
  const calculateDISCScores = () => {
    const scores = {
      accion: 0,
      inspiracion: 0,
      apoyo: 0,
      excelencia: 0,
    }
    
    const counts = {
      accion: 0,
      inspiracion: 0,
      apoyo: 0,
      excelencia: 0,
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
      accion: counts.accion > 0 ? Math.round(scores.accion / counts.accion) : 0,
      inspiracion: counts.inspiracion > 0 ? Math.round(scores.inspiracion / counts.inspiracion) : 0,
      apoyo: counts.apoyo > 0 ? Math.round(scores.apoyo / counts.apoyo) : 0,
      excelencia: counts.excelencia > 0 ? Math.round(scores.excelencia / counts.excelencia) : 0,
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
      accion: scores.accion,
      inspiracion: scores.inspiracion,
      apoyo: scores.apoyo,
      excelencia: scores.excelencia,
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
      accion: "bg-red-100 text-red-900",
      inspiracion: "bg-yellow-100 text-yellow-900",
      apoyo: "bg-blue-100 text-blue-900",
      excelencia: "bg-green-100 text-green-900",
  }

  const areaLabels = {
      accion: "Acción",
      inspiracion: "Inspiración",
      apoyo: "Apoyo",
      excelencia: "Excelencia",
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

  // Get dimension info for display
  const getDimensionInfo = (dim: string) => {
    const info: Record<string, any> = {
      accion: {
        label: "Acción",
        emoji: "🎯",
        color: "bg-red-50 border-red-200",
        textColor: "text-red-700",
        bgColor: "bg-red-100",
        description: "Tu orientación a resultados, decisión y liderazgo directo",
      },
      inspiracion: {
        label: "Inspiración",
        emoji: "💫",
        color: "bg-yellow-50 border-yellow-200",
        textColor: "text-yellow-700",
        bgColor: "bg-yellow-100",
        description: "Tu capacidad de persuadir, motivar e inspirar a otros",
      },
      apoyo: {
        label: "Apoyo",
        emoji: "🛡️",
        color: "bg-blue-50 border-blue-200",
        textColor: "text-blue-700",
        bgColor: "bg-blue-100",
        description: "Tu lealtad, paciencia y apoyo al equipo",
      },
      excelencia: {
        label: "Excelencia",
        emoji: "🔍",
        color: "bg-green-50 border-green-200",
        textColor: "text-green-700",
        bgColor: "bg-green-100",
        description: "Tu precisión, análisis detallado y búsqueda de calidad",
      },
    }
    return info[dim] || info.accion
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
