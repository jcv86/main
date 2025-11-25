"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "@/components/session-wrapper"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import {
  ArrowLeft,
  Brain,
  Download,
  Share2,
  Sparkles,
  Target,
  Link2,
  MessageSquare,
  Calendar,
  CheckCircle2,
  Lightbulb,
  Heart,
  Users,
  Home,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { UnifiedTestSystem } from "@/lib/unified-test-system"
import { EnhancedCoachFlow } from "@/components/enhanced-coach-flow"

interface DISCResult {
  d_score: number
  i_score: number
  s_score: number
  c_score: number
  primary_type: string
  analysis: string
  recommendations: string
  created_at: string
}

export default function DISCResultsPage() {
  const { user } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isDemoMode = searchParams.get("demo") === "true"
  const { toast } = useToast()

  const [discResult, setDiscResult] = useState<DISCResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [reflections, setReflections] = useState<Record<string, string>>({})
  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (!user && !isDemoMode) {
      router.push("/")
      return
    }
    loadResults()
  }, [user, router, isDemoMode])

  const loadResults = async () => {
    if (isDemoMode) {
      setDiscResult({
        d_score: 75,
        i_score: 65,
        s_score: 45,
        c_score: 85,
        primary_type: "Compliance",
        analysis:
          "Tu estilo principal es Compliance con puntuaciones: D=75%, I=65%, S=45%, C=85%. Eres analítico, preciso y orientado a la calidad.",
        recommendations: "Continúa desarrollando tus fortalezas naturales mientras trabajas en áreas de crecimiento.",
        created_at: new Date().toISOString(),
      })
      setLoading(false)
      return
    }

    if (!user) return

    try {
      const result = await UnifiedTestSystem.loadTestResult(user.email!, "DISC Assessment")

      if (result.success && result.data) {
        const scores = result.data.results

        setDiscResult({
          d_score: scores.D || 0,
          i_score: scores.I || 0,
          s_score: scores.S || 0,
          c_score: scores.C || 0,
          primary_type: scores.primary_style || "Compliance",
          analysis: scores.analysis || `Tu estilo principal es ${scores.primary_style}`,
          recommendations: scores.recommendations || "Continúa desarrollando tus fortalezas",
          created_at: result.data.completed_at || new Date().toISOString(),
        })
      } else {
        toast({
          title: "No hay resultados",
          description: "No se encontraron resultados del test DISC",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error loading results:", error)
      toast({
        title: "Error",
        description: "Hubo un problema cargando tus resultados",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando resultados...</p>
        </div>
      </div>
    )
  }

  if (!discResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>No se encontraron resultados</CardTitle>
            <CardDescription>Parece que aún no has completado el test DISC.</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Button onClick={() => router.push("/test/disc")} className="w-full">
              <Brain className="h-4 w-4 mr-2" />
              Realizar Test DISC
            </Button>
            <Button variant="outline" onClick={() => router.push(isDemoMode ? "/" : "/dashboard")} className="w-full">
              {isDemoMode ? "Volver al Inicio" : "Volver al Dashboard"}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const getStyleDescription = (type: string) => {
    switch (type) {
      case "Dominance":
        return {
          title: "Dominancia (D)",
          description: "Orientado a resultados, directo, decidido y competitivo",
          strengths: ["Liderazgo natural", "Toma de decisiones rápida", "Orientación a resultados", "Confianza"],
          challenges: ["Puede ser impaciente", "Necesita trabajar en diplomacia", "Tendencia a ser directo"],
        }
      case "Influence":
        return {
          title: "Influencia (I)",
          description: "Sociable, optimista, persuasivo y entusiasta",
          strengths: ["Excelente comunicador", "Motivador natural", "Optimista", "Trabajo en equipo"],
          challenges: ["Puede ser desorganizado", "Necesita estructura", "Tendencia a ser impulsivo"],
        }
      case "Steadiness":
        return {
          title: "Estabilidad (S)",
          description: "Paciente, leal, confiable y colaborativo",
          strengths: ["Muy confiable", "Excelente escucha", "Paciente", "Leal al equipo"],
          challenges: ["Resistencia al cambio", "Dificultad para decir no", "Evita conflictos"],
        }
      case "Compliance":
        return {
          title: "Cumplimiento (C)",
          description: "Analítico, preciso, sistemático y orientado a la calidad",
          strengths: ["Atención al detalle", "Pensamiento analítico", "Alta calidad", "Sistemático"],
          challenges: ["Puede ser perfeccionista", "Lento en decisiones", "Crítico consigo mismo"],
        }
      default:
        return {
          title: "Estilo Mixto",
          description: "Combinación equilibrada de diferentes estilos",
          strengths: ["Versatilidad", "Adaptabilidad", "Balance"],
          challenges: ["Puede necesitar más claridad en su enfoque"],
        }
    }
  }

  const styleInfo = getStyleDescription(discResult.primary_type)

  const developmentOpportunities = [
    {
      area: "Comunicación Asertiva",
      description: `Como perfil ${discResult.primary_type}, tu estilo comunicativo tiene fortalezas únicas. Esta área te ayudará a potenciarlas.`,
      actions: [
        "Practica el modelo DESC (Describir, Expresar, Sugerir, Consecuencias) en conversaciones difíciles",
        "Graba y revisa una presentación tuya para identificar patrones de comunicación",
        "Pide feedback específico sobre tu estilo comunicativo a 3 personas de confianza",
      ],
      resources: ["Módulo de IE - Comunicación", "Coach Sofia para roleplay"],
    },
    {
      area: "Liderazgo Adaptativo",
      description: "Desarrolla la capacidad de adaptar tu estilo de liderazgo según el contexto y las personas.",
      actions: [
        "Identifica 3 situaciones donde tu estilo natural funciona mejor",
        "Practica 'estilos prestados' en situaciones de bajo riesgo",
        "Crea un plan de desarrollo para tu área DISC más baja",
      ],
      resources: ["Test MBTI para complementar", "Biblioteca DTC - Liderazgo"],
    },
    {
      area: "Gestión del Estrés",
      description: `Los perfiles ${discResult.primary_type} tienen patrones específicos de estrés. Aprende a reconocerlos y manejarlos.`,
      actions: [
        "Identifica tus 3 principales disparadores de estrés laboral",
        "Implementa una rutina de 5 minutos de mindfulness diario",
        "Crea un 'plan de emergencia' para momentos de alta presión",
      ],
      resources: ["Test IE - Regulación Emocional", "Ejercicios de respiración DTC"],
    },
    {
      area: "Colaboración Efectiva",
      description: "Mejora tu capacidad de trabajar con estilos DISC diferentes al tuyo.",
      actions: [
        "Mapea los estilos DISC de tu equipo actual",
        "Practica adaptar tu comunicación con cada estilo",
        "Organiza una sesión de feedback cruzado con tu equipo",
      ],
      resources: ["Guía de compatibilidad DISC", "Soft Skills - Trabajo en equipo"],
    },
  ]

  const moduleConnections = [
    {
      module: "Inteligencia Emocional",
      relation: `Tu perfil ${discResult.primary_type} se beneficia especialmente de desarrollar ${discResult.primary_type === "Dominance" ? "empatía y escucha activa" : discResult.primary_type === "Influence" ? "autoregulación y enfoque" : discResult.primary_type === "Steadiness" ? "asertividad y expresión emocional" : "conexión emocional y flexibilidad"}.`,
      synergy: "IE + DISC = Liderazgo consciente y relaciones más efectivas",
    },
    {
      module: "MBTI",
      relation:
        "Mientras DISC mide comportamiento observable, MBTI revela preferencias cognitivas. Juntos dan una imagen completa.",
      synergy: "MBTI + DISC = Entender el 'por qué' detrás del 'cómo' te comportas",
    },
    {
      module: "Big Five",
      relation: "Big Five mide rasgos estables de personalidad que influyen en tu estilo DISC.",
      synergy: "Big Five + DISC = Comprender qué tan modificable es tu comportamiento",
    },
    {
      module: "RIASEC",
      relation: "Tu estilo DISC influye en cómo te desempeñas en diferentes entornos vocacionales.",
      synergy: "RIASEC + DISC = Encontrar roles donde tu estilo natural sea una ventaja",
    },
    {
      module: "Soft Skills",
      relation: "Las competencias blandas que más necesitas desarrollar dependen de tu perfil DISC.",
      synergy: "Soft Skills + DISC = Plan de desarrollo personalizado y accionable",
    },
  ]

  const reflectionQuestions = [
    {
      category: "Autoconocimiento",
      questions: [
        "¿En qué situaciones mi estilo DISC me ha ayudado a tener éxito?",
        "¿Cuándo mi estilo natural se convierte en una limitación?",
        "¿Qué aspectos de mi perfil me sorprendieron o confirmaron?",
      ],
    },
    {
      category: "Relaciones",
      questions: [
        "¿Con qué estilos DISC me resulta más fácil/difícil trabajar?",
        "¿Cómo puedo adaptar mi comunicación para conectar mejor con otros estilos?",
        "¿Qué malentendidos recurrentes podrían explicarse por diferencias de estilo?",
      ],
    },
    {
      category: "Desarrollo",
      questions: [
        "¿Qué habilidad de un estilo diferente al mío me gustaría desarrollar?",
        "¿Cómo puedo usar mis fortalezas naturales para compensar mis áreas de mejora?",
        "¿Qué pequeño cambio podría hacer esta semana para flexibilizar mi estilo?",
      ],
    },
  ]

  const plan90Days = {
    month1: {
      title: "Mes 1: Autoconocimiento Profundo",
      objective: "Entender a fondo tu perfil DISC y cómo impacta tu día a día",
      weeks: [
        {
          week: "Semana 1-2",
          focus: "Observación y registro",
          actions: [
            "Lleva un diario de situaciones donde tu estilo DISC fue evidente",
            "Identifica 3 momentos donde tu estilo te ayudó y 3 donde te limitó",
            "Completa el test de IE para complementar tu perfil",
          ],
        },
        {
          week: "Semana 3-4",
          focus: "Feedback externo",
          actions: [
            "Pide a 3 personas cercanas que describan tu estilo de trabajo",
            "Compara su percepción con tus resultados DISC",
            "Identifica puntos ciegos en tu autoconocimiento",
          ],
        },
      ],
      kpis: ["Diario completado con 20+ entradas", "Feedback de 3+ personas", "Test IE completado"],
    },
    month2: {
      title: "Mes 2: Experimentación Controlada",
      objective: "Practicar comportamientos fuera de tu zona de confort DISC",
      weeks: [
        {
          week: "Semana 5-6",
          focus: "Estilos prestados",
          actions: [
            "Elige tu dimensión DISC más baja para practicar",
            "Identifica 3 situaciones de bajo riesgo para experimentar",
            "Practica comportamientos del estilo opuesto al tuyo",
          ],
        },
        {
          week: "Semana 7-8",
          focus: "Integración",
          actions: [
            "Aplica lo aprendido en una situación de mayor importancia",
            "Documenta qué funcionó y qué no",
            "Ajusta tu enfoque basado en los resultados",
          ],
        },
      ],
      kpis: ["3+ experimentos documentados", "1 aplicación en situación real", "Reflexión escrita sobre aprendizajes"],
    },
    month3: {
      title: "Mes 3: Consolidación y Sistema",
      objective: "Crear hábitos sostenibles para seguir desarrollándote",
      weeks: [
        {
          week: "Semana 9-10",
          focus: "Rutinas de desarrollo",
          actions: [
            "Establece una práctica semanal de autoobservación",
            "Crea recordatorios para aplicar tus aprendizajes",
            "Completa el test MBTI para profundizar tu autoconocimiento",
          ],
        },
        {
          week: "Semana 11-12",
          focus: "Plan a largo plazo",
          actions: [
            "Revisa tu progreso en los 3 meses",
            "Define objetivos para los próximos 6 meses",
            "Agenda una sesión con Coach Sofia para revisar tu plan",
          ],
        },
      ],
      kpis: ["Rutina semanal establecida", "Plan de 6 meses creado", "Test MBTI completado"],
    },
  }

  const toggleAction = (actionId: string) => {
    setCompletedActions((prev) => ({ ...prev, [actionId]: !prev[actionId] }))
  }

  const calculateMonthProgress = (monthKey: string) => {
    const monthActions = Object.keys(completedActions).filter((key) => key.startsWith(monthKey))
    if (monthActions.length === 0) return 0
    const completed = monthActions.filter((key) => completedActions[key]).length
    return Math.round((completed / 6) * 100) // 6 actions per month approx
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <main className="container mx-auto max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={() => router.push(isDemoMode ? "/" : "/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {isDemoMode ? "Volver al Inicio" : "Volver al Dashboard"}
          </Button>
          <div className="flex items-center space-x-2">
            {isDemoMode && (
              <Badge variant="secondary" className="mr-2">
                Modo Demo
              </Badge>
            )}
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Descargar PDF
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Compartir
            </Button>
          </div>
        </div>

        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Brain className="h-8 w-8 text-blue-600" />
            </div>
            <CardTitle className="text-3xl">Resultados de Despega Cerebral</CardTitle>
            <CardDescription>Completado el {new Date(discResult.created_at).toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <Badge variant="default" className="text-lg px-4 py-2">
                Estilo Principal: {styleInfo.title}
              </Badge>
              <p className="text-gray-600 mt-4 max-w-2xl mx-auto">{styleInfo.description}</p>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7 gap-1">
            <TabsTrigger value="overview" className="text-xs">
              Resumen
            </TabsTrigger>
            <TabsTrigger value="details" className="text-xs">
              Detalles
            </TabsTrigger>
            <TabsTrigger value="development" className="text-xs">
              Desarrollo
            </TabsTrigger>
            <TabsTrigger value="connections" className="text-xs">
              Conexiones
            </TabsTrigger>
            <TabsTrigger value="reflection" className="text-xs">
              Reflexión
            </TabsTrigger>
            <TabsTrigger value="plan90" className="text-xs">
              Plan 90 Días
            </TabsTrigger>
            <TabsTrigger value="coach" className="text-xs">
              Coach IA
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  Tu Perfil DISC
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-red-50 rounded-lg text-center">
                    <div className="text-3xl font-bold text-red-600">{discResult.d_score}%</div>
                    <div className="font-semibold mt-1">Dominancia</div>
                  </div>
                  <div className="p-4 bg-yellow-50 rounded-lg text-center">
                    <div className="text-3xl font-bold text-yellow-600">{discResult.i_score}%</div>
                    <div className="font-semibold mt-1">Influencia</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg text-center">
                    <div className="text-3xl font-bold text-green-600">{discResult.s_score}%</div>
                    <div className="font-semibold mt-1">Estabilidad</div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg text-center">
                    <div className="text-3xl font-bold text-blue-600">{discResult.c_score}%</div>
                    <div className="font-semibold mt-1">Cumplimiento</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Fortalezas Clave</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {styleInfo.strengths.map((strength, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <span>{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Áreas de Desarrollo</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {styleInfo.challenges.map((challenge, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Target className="h-5 w-5 text-orange-600 mt-0.5 flex-shrink-0" />
                        <span>{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-8 border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Heart className="w-6 h-6 text-purple-600" />
                  Impacto en tu Vida Personal
                </CardTitle>
                <CardDescription>
                  Cómo tu perfil {discResult.primary_type} influye en tus relaciones, bienestar y vida diaria
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2 text-purple-900">
                      <Users className="w-5 h-5" />
                      Relaciones Personales
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {discResult.primary_type === "Dominance"
                        ? "En tu familia y pareja, tu estilo directo puede ser percibido como autoritario. Practica escucha activa y cede el control en decisiones cotidianas."
                        : discResult.primary_type === "Influence"
                          ? "Tu energía social enriquece tus amistades, pero puede agotar a personas más introvertidas. Reserva momentos de calidad sin distracciones."
                          : discResult.primary_type === "Steadiness"
                            ? "Tu lealtad es tu mayor fortaleza en relaciones, pero evita sacrificar tus necesidades por complacer. Practica poner límites con amor."
                            : "Tu tendencia al análisis puede hacer que parezcas distante. Comparte más tus emociones y valora lo emocional tanto como lo lógico."}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2 text-purple-900">
                      <Home className="w-5 h-5" />
                      Vida Familiar
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {discResult.primary_type === "Dominance"
                        ? "Con tu familia, delega responsabilidades y permite que otros lideren. Pregunta '¿Qué opinas?' antes de decidir."
                        : discResult.primary_type === "Influence"
                          ? "Tu optimismo levanta el ánimo familiar, pero asegúrate de dar espacio a conversaciones serias y emocionales profundas."
                          : discResult.primary_type === "Steadiness"
                            ? "Eres el ancla emocional de tu familia. No olvides pedir apoyo cuando lo necesites - no siempre tienes que ser el fuerte."
                            : "Tu amor por el orden puede crear tensión en la rutina familiar. Aprende a soltar y disfrutar el caos controlado."}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2 text-purple-900">
                      <Heart className="w-5 h-5" />
                      Bienestar Emocional
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {discResult.primary_type === "Dominance"
                        ? "Tu ritmo acelerado puede llevarte al burnout. Programa momentos de descanso no negociables y practica mindfulness."
                        : discResult.primary_type === "Influence"
                          ? "Necesitas interacción social para recargar, pero también requieres soledad. Alterna entre socializar y tiempo a solas."
                          : discResult.primary_type === "Steadiness"
                            ? "Tu aversión al conflicto puede acumular resentimiento. Practica expresar molestias pequeñas antes de que se acumulen."
                            : "Tu mente analítica puede sobre-pensar. Incorpora actividades físicas para salir de tu cabeza y conectar con tu cuerpo."}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2 text-purple-900">
                      <Sparkles className="w-5 h-5" />
                      Desarrollo Personal
                    </h3>
                    <p className="text-gray-700 leading-relaxed">
                      {discResult.primary_type === "Dominance"
                        ? "Enfócate en desarrollar paciencia y empatía. Lee sobre inteligencia emocional y practica ponerte en los zapatos de otros."
                        : discResult.primary_type === "Influence"
                          ? "Desarrolla disciplina y seguimiento. Usa herramientas para mantener el enfoque y completa lo que inicias."
                          : discResult.primary_type === "Steadiness"
                            ? "Practica la asertividad y el cambio. Sal de tu zona de confort con pequeños experimentos seguros."
                            : "Desarrolla tu conexión emocional. Practica nombrar tus emociones y compartir cómo te sientes con personas de confianza."}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border-l-4 border-purple-600">
                  <h3 className="font-semibold text-lg mb-3 text-purple-900">
                    💡 Recuerda: Tu trabajo es solo una parte de tu vida
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    Este test te ayuda primero a mejorar tus relaciones personales, tu bienestar emocional y tu vida
                    familiar. Las mejoras en el ámbito laboral son una consecuencia natural de tu crecimiento personal
                    integral.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Análisis Detallado</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{discResult.analysis}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="development" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  Oportunidades de Desarrollo
                </CardTitle>
                <CardDescription>
                  Áreas específicas donde puedes potenciar tu perfil {discResult.primary_type}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {developmentOpportunities.map((opp, idx) => (
                    <AccordionItem key={idx} value={`opp-${idx}`}>
                      <AccordionTrigger className="text-left">
                        <div>
                          <div className="font-semibold">{opp.area}</div>
                          <div className="text-sm text-muted-foreground font-normal">{opp.description}</div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          <div>
                            <h4 className="font-medium mb-2">Acciones Concretas:</h4>
                            <ul className="space-y-2">
                              {opp.actions.map((action, aIdx) => (
                                <li key={aIdx} className="flex items-start gap-2">
                                  <Checkbox
                                    id={`dev-${idx}-${aIdx}`}
                                    checked={completedActions[`dev-${idx}-${aIdx}`] || false}
                                    onCheckedChange={() => toggleAction(`dev-${idx}-${aIdx}`)}
                                  />
                                  <label htmlFor={`dev-${idx}-${aIdx}`} className="text-sm cursor-pointer">
                                    {action}
                                  </label>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-medium mb-2">Recursos DTC:</h4>
                            <div className="flex flex-wrap gap-2">
                              {opp.resources.map((resource, rIdx) => (
                                <Badge key={rIdx} variant="secondary">
                                  {resource}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="connections" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link2 className="h-5 w-5 text-purple-600" />
                  Conexión con Otros Módulos DTC
                </CardTitle>
                <CardDescription>Cómo tu perfil DISC se relaciona con los demás tests del ecosistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {moduleConnections.map((conn, idx) => (
                    <Card key={idx} className="border-l-4 border-l-purple-500">
                      <CardContent className="pt-4">
                        <h4 className="font-semibold text-purple-700">{conn.module}</h4>
                        <p className="text-sm text-gray-600 mt-1">{conn.relation}</p>
                        <div className="mt-2 bg-purple-50 p-2 rounded text-sm">
                          <strong>Sinergia:</strong> {conn.synergy}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg">
                  <h4 className="font-semibold mb-2">Completa tu Perfil 360°</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Mientras más tests completes, más precisa será tu ruta de desarrollo personalizada.
                  </p>
                  <Button onClick={() => router.push("/test")} size="sm">
                    Ver Todos los Tests
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reflection" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-teal-600" />
                  Preguntas de Reflexión Profunda
                </CardTitle>
                <CardDescription>
                  Tómate tu tiempo para reflexionar. Tus respuestas se guardan automáticamente.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {reflectionQuestions.map((category, idx) => (
                    <AccordionItem key={idx} value={`cat-${idx}`}>
                      <AccordionTrigger>{category.category}</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-4 pt-2">
                          {category.questions.map((question, qIdx) => (
                            <div key={qIdx}>
                              <label className="block text-sm font-medium mb-2">{question}</label>
                              <Textarea
                                placeholder="Escribe tu reflexión aquí..."
                                value={reflections[`${idx}-${qIdx}`] || ""}
                                onChange={(e) =>
                                  setReflections((prev) => ({
                                    ...prev,
                                    [`${idx}-${qIdx}`]: e.target.value,
                                  }))
                                }
                                className="min-h-[100px]"
                              />
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plan90" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Plan de Acción de 90 Días
                </CardTitle>
                <CardDescription>
                  Tu ruta personalizada para desarrollar tu potencial basado en tu perfil {discResult.primary_type}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full" defaultValue="month1">
                  <AccordionItem value="month1">
                    <AccordionTrigger>
                      <div className="flex items-center justify-between w-full pr-4">
                        <div>
                          <div className="font-semibold">{plan90Days.month1.title}</div>
                          <div className="text-sm text-muted-foreground font-normal">{plan90Days.month1.objective}</div>
                        </div>
                        <Badge variant="outline">{calculateMonthProgress("m1")}%</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <Progress value={calculateMonthProgress("m1")} className="h-2" />
                        {plan90Days.month1.weeks.map((week, wIdx) => (
                          <div key={wIdx} className="border rounded-lg p-4">
                            <h4 className="font-medium text-blue-700">
                              {week.week}: {week.focus}
                            </h4>
                            <ul className="mt-2 space-y-2">
                              {week.actions.map((action, aIdx) => (
                                <li key={aIdx} className="flex items-start gap-2">
                                  <Checkbox
                                    id={`m1-w${wIdx}-a${aIdx}`}
                                    checked={completedActions[`m1-w${wIdx}-a${aIdx}`] || false}
                                    onCheckedChange={() => toggleAction(`m1-w${wIdx}-a${aIdx}`)}
                                  />
                                  <label htmlFor={`m1-w${wIdx}-a${aIdx}`} className="text-sm cursor-pointer">
                                    {action}
                                  </label>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                        <div className="bg-blue-50 p-3 rounded-lg">
                          <h5 className="font-medium text-sm mb-1">KPIs del Mes:</h5>
                          <ul className="text-sm text-gray-600">
                            {plan90Days.month1.kpis.map((kpi, kIdx) => (
                              <li key={kIdx}>• {kpi}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="month2">
                    <AccordionTrigger>
                      <div className="flex items-center justify-between w-full pr-4">
                        <div>
                          <div className="font-semibold">{plan90Days.month2.title}</div>
                          <div className="text-sm text-muted-foreground font-normal">{plan90Days.month2.objective}</div>
                        </div>
                        <Badge variant="outline">{calculateMonthProgress("m2")}%</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <Progress value={calculateMonthProgress("m2")} className="h-2" />
                        {plan90Days.month2.weeks.map((week, wIdx) => (
                          <div key={wIdx} className="border rounded-lg p-4">
                            <h4 className="font-medium text-green-700">
                              {week.week}: {week.focus}
                            </h4>
                            <ul className="mt-2 space-y-2">
                              {week.actions.map((action, aIdx) => (
                                <li key={aIdx} className="flex items-start gap-2">
                                  <Checkbox
                                    id={`m2-w${wIdx}-a${aIdx}`}
                                    checked={completedActions[`m2-w${wIdx}-a${aIdx}`] || false}
                                    onCheckedChange={() => toggleAction(`m2-w${wIdx}-a${aIdx}`)}
                                  />
                                  <label htmlFor={`m2-w${wIdx}-a${aIdx}`} className="text-sm cursor-pointer">
                                    {action}
                                  </label>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                        <div className="bg-green-50 p-3 rounded-lg">
                          <h5 className="font-medium text-sm mb-1">KPIs del Mes:</h5>
                          <ul className="text-sm text-gray-600">
                            {plan90Days.month2.kpis.map((kpi, kIdx) => (
                              <li key={kIdx}>• {kpi}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="month3">
                    <AccordionTrigger>
                      <div className="flex items-center justify-between w-full pr-4">
                        <div>
                          <div className="font-semibold">{plan90Days.month3.title}</div>
                          <div className="text-sm text-muted-foreground font-normal">{plan90Days.month3.objective}</div>
                        </div>
                        <Badge variant="outline">{calculateMonthProgress("m3")}%</Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 pt-2">
                        <Progress value={calculateMonthProgress("m3")} className="h-2" />
                        {plan90Days.month3.weeks.map((week, wIdx) => (
                          <div key={wIdx} className="border rounded-lg p-4">
                            <h4 className="font-medium text-purple-700">
                              {week.week}: {week.focus}
                            </h4>
                            <ul className="mt-2 space-y-2">
                              {week.actions.map((action, aIdx) => (
                                <li key={aIdx} className="flex items-start gap-2">
                                  <Checkbox
                                    id={`m3-w${wIdx}-a${aIdx}`}
                                    checked={completedActions[`m3-w${wIdx}-a${aIdx}`] || false}
                                    onCheckedChange={() => toggleAction(`m3-w${wIdx}-a${aIdx}`)}
                                  />
                                  <label htmlFor={`m3-w${wIdx}-a${aIdx}`} className="text-sm cursor-pointer">
                                    {action}
                                  </label>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                        <div className="bg-purple-50 p-3 rounded-lg">
                          <h5 className="font-medium text-sm mb-1">KPIs del Mes:</h5>
                          <ul className="text-sm text-gray-600">
                            {plan90Days.month3.kpis.map((kpi, kIdx) => (
                              <li key={kIdx}>• {kpi}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="coach" className="space-y-6">
            <EnhancedCoachFlow
              testType="DISC"
              testResults={{
                primary_type: discResult.primary_type,
                d_score: discResult.d_score,
                i_score: discResult.i_score,
                s_score: discResult.s_score,
                c_score: discResult.c_score,
              }}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
