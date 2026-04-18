"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "@/components/session-provider" // Corrected import path
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
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
  BookOpen,
  TrendingUp,
  BarChart3,
  Rocket,
  AlertCircle,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { UnifiedTestSystem } from "@/lib/unified-test-system"
import { EnhancedCoachFlow } from "@/components/enhanced-coach-flow"
import { DISCContextForm, type UserContext } from "@/components/disc-context-form"
import { CompetencyRadarChart } from "@/components/competency-radar-chart"

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

  const [showContextForm, setShowContextForm] = useState(false)
  const [userContext, setUserContext] = useState<UserContext | null>(null)
  const [attemptNumber, setAttemptNumber] = useState(1)
  const [previousAttempts, setPreviousAttempts] = useState<any[]>([])

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

        const attempt = result.data.attempt_number || 1
        const context = result.data.user_context || null

        setAttemptNumber(attempt)
        setUserContext(context)

        if (attempt === 1 && !context) {
          setShowContextForm(true)
        }

        setDiscResult({
          d_score: scores.D || 0,
          i_score: scores.I || 0,
          s_score: scores.S || 0,
          c_score: scores.C || 0,
          primary_type: scores.primary_style || "Compliance",
          analysis: scores.analysis || `Tu estilo principal es ${scores.primary_type}`,
          recommendations: scores.recommendations || "Continúa desarrollando tus fortalezas",
          created_at: result.data.completed_at || new Date().toISOString(),
        })

        await loadPreviousAttempts(user.email!)
      } else {
        toast({
          title: "No hay resultados",
          description: "No se encontraron resultados de tu evaluación",
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

  const loadPreviousAttempts = async (email: string) => {
    try {
      // This would query all previous DISC attempts for comparison
      // For now, we'll just set an empty array
      setPreviousAttempts([])
    } catch (error) {
      console.error("Error loading previous attempts:", error)
    }
  }

  const handleContextSubmit = async (context: UserContext) => {
    if (!user) return

    setUserContext(context)
    setShowContextForm(false)

    // Save context to database
    try {
      await UnifiedTestSystem.updateTestContext(user.email!, "DISC Assessment", context)
      toast({
        title: "Contexto guardado",
        description: "Tu informe ahora está personalizado según tu contexto",
      })
    } catch (error) {
      console.error("Error saving context:", error)
    }
  }

  if (showContextForm && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue/5 to-indigo-100 flex items-center justify-center p-4">
        <DISCContextForm
          onSubmit={handleContextSubmit}
          onSkip={() => setShowContextForm(false)}
          attemptNumber={attemptNumber}
        />
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue/5 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue mx-auto mb-4"></div>
          <p className="text-muted/60">Cargando resultados...</p>
        </div>
      </div>
    )
  }

  if (!discResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue/5 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>No se encontraron resultados</CardTitle>
            <CardDescription>Parece que aún no has completado tu evaluación.</CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <Button onClick={() => router.push("/test/disc")} className="w-full">
              <Brain className="h-4 w-4 mr-2" />
              Realizar Evaluación
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

  const getContentTag = (priority: "now" | "next" | "later") => {
    const tags = {
      now: { label: "FOCO ACTUAL", color: "bg-red/10 text-red border-red/30" },
      next: { label: "PRÓXIMA MISIÓN", color: "bg-amber-100 text-amber-800 border-amber-300" },
      later: { label: "PARA CUANDO QUIERAS", color: "bg-blue/10 text-blue border-blue/30" },
    }
    const tag = tags[priority]
    return (
      <Badge variant="outline" className={`${tag.color} border font-semibold`}>
        {tag.label}
      </Badge>
    )
  }

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
    // Assuming 6 key actions/kpis per month for calculation
    // Adjust this number based on the actual number of actionable items per month in plan90Days
    let totalActions = 0
    if (monthKey === "m1")
      totalActions =
        plan90Days.month1.weeks.reduce((sum, week) => sum + week.actions.length, 0) + plan90Days.month1.kpis.length
    if (monthKey === "m2")
      totalActions =
        plan90Days.month2.weeks.reduce((sum, week) => sum + week.actions.length, 0) + plan90Days.month2.kpis.length
    if (monthKey === "m3")
      totalActions =
        plan90Days.month3.weeks.reduce((sum, week) => sum + week.actions.length, 0) + plan90Days.month3.kpis.length

    if (totalActions === 0) return 0
    return Math.round((completed / totalActions) * 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue/5 to-indigo-100 py-12 px-4">
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

        {attemptNumber > 1 && (
          <div className="mb-4 text-center">
            <Badge variant="outline" className="bg-purple/10 text-purple border-purple/30">
              Intento #{attemptNumber} - Ver Evolución
            </Badge>
          </div>
        )}

        <Card className="mb-6">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-blue/10 rounded-full flex items-center justify-center">
              <Brain className="h-8 w-8 text-blue" />
            </div>
            <CardTitle className="text-3xl">Resultados de Despega Cerebral</CardTitle>
            <CardDescription>Completado el {new Date(discResult.created_at).toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <Badge variant="default" className="text-lg px-4 py-2">
                Estilo Principal: {styleInfo.title}
              </Badge>
              <p className="text-muted/60 mt-4 max-w-2xl mx-auto">{styleInfo.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* PUENTE DE TRANSICION SECTION */}
        <Card className="mb-6 border-2 border-purple/30 bg-background dark:from-purple dark:to-blue-950">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple" />
              Tu Puente de Transición
            </CardTitle>
            <CardDescription>
              No es donde estás. Es cómo llegas a donde quieres ir.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-3 gap-4">
              {/* Eres Ahora */}
              <div className="p-4 bg-white dark:bg-background rounded-lg border-l-4 border-blue/50">
                <h4 className="font-semibold text-lg mb-2">Eres Ahora</h4>
                <p className="text-sm text-muted-foreground mb-3">Tu perfil actual</p>
                <div className="text-2xl font-bold text-blue">{styleInfo.title}</div>
                <p className="text-xs text-muted-foreground mt-2">{styleInfo.description}</p>
              </div>

              {/* Puedes Ser */}
              <div className="p-4 bg-white dark:bg-background rounded-lg border-l-4 border-purple/50 flex flex-col justify-between">
                <div>
                  <h4 className="font-semibold text-lg mb-2">Puedes Ser</h4>
                  <p className="text-sm text-muted-foreground mb-3">Nuevas dimensiones tuyas</p>
                  <div className="text-xs space-y-1 mb-3">
                    <p>• Versión más equilibrada de ti</p>
                    <p>• Mayor flexibilidad situacional</p>
                    <p>• Nuevas competencias</p>
                  </div>
                </div>
              </div>

              {/* Cómo Llegas */}
              <div className="p-4 bg-white dark:bg-background rounded-lg border-l-4 border-green">
                <h4 className="font-semibold text-lg mb-2">Cómo Llegas</h4>
                <p className="text-sm text-muted-foreground mb-3">El puente práctico</p>
                <ul className="text-xs space-y-1">
                  <li>1. Práctica consciente</li>
                  <li>2. Retroalimentación constante</li>
                  <li>3. Coaches IA + Comunidad</li>
                  <li>4. Celebra avances</li>
                </ul>
              </div>
            </div>

            <div className="p-4 bg-purple/10 dark:bg-purple/30 rounded-lg border border-purple/30">
              <p className="text-sm text-foreground">
                <strong>Tu Siguiente Paso:</strong> Usa la exploración de desarrollo abajo para descubrir exactamente qué competencias quieres expandir. Luego, tu coach IA te creará un plan personalizado.
              </p>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          {/* TabsList was updated to include new tabs */}
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8 gap-1">
            <TabsTrigger value="overview" className="text-xs">
              Resumen
            </TabsTrigger>
            <TabsTrigger value="details" className="text-xs">
              Detalles
            </TabsTrigger>
            <TabsTrigger value="development" className="text-xs">
              Desarrollo
            </TabsTrigger>
            <TabsTrigger value="biblioteca" className="text-xs">
              Biblioteca DTC
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

          {/* Updated TabsList for V2 sections */}
          <TabsList className="grid w-full grid-cols-9">
            <TabsTrigger value="overview" className="text-xs">
              Resumen
            </TabsTrigger>
            <TabsTrigger value="details" className="text-xs">
              Dimensiones
            </TabsTrigger>
            <TabsTrigger value="development" className="text-xs">
              Oportunidades
            </TabsTrigger>
            <TabsTrigger value="mini-tablero" className="text-xs">
              Mini Tablero
            </TabsTrigger>
            <TabsTrigger value="mision-3-meses" className="text-xs">
              Misión 3 Meses
            </TabsTrigger>
            <TabsTrigger value="plan90" className="text-xs">
              Plan 90 Días
            </TabsTrigger>
            <TabsTrigger value="semana-despegue" className="text-xs">
              Semana Despegue
            </TabsTrigger>
            <TabsTrigger value="biblioteca" className="text-xs">
              Biblioteca DTC
            </TabsTrigger>
            <TabsTrigger value="checklist" className="text-xs">
              Checklist 30/60/90
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <Card className="border-2 border-blue/50">
              <CardHeader className="bg-gradient-to-r from-blue/5 to-purple/5">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-blue" />
                  Resumen Ejecutivo Integral DTC
                </CardTitle>
                <CardDescription className="text-base">
                  Tu perfil Despega Cerebral en una vista 360° (vida personal + trabajo)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {/* Radar Chart Visualization */}
                <CompetencyRadarChart
                  data={[
                    {
                      name: "Dominancia",
                      value: discResult.d_score,
                      fullMark: 100,
                    },
                    {
                      name: "Influencia",
                      value: discResult.i_score,
                      fullMark: 100,
                    },
                    {
                      name: "Estabilidad",
                      value: discResult.s_score,
                      fullMark: 100,
                    },
                    {
                      name: "Cumplimiento",
                      value: discResult.c_score,
                      fullMark: 100,
                    },
                  ]}
                  title="Tu Perfil DISC Completo"
                  description="Visualización de tus 4 dimensiones de personalidad"
                  strokeColor="#3b82f6"
                  fillColor="#3b82f6"
                  height={400}
                />

                {/* Foto rápida del perfil */}
                <div className="bg-gradient-to-r from-blue/10 to-purple-100 p-6 rounded-lg">
                  <h3 className="text-xl font-bold text-blue mb-2">Tu perfil: {discResult.primary_type}</h3>
                  <p className="text-lg text-gray-800 italic">
                    "
                    {discResult.d_score > 70 && discResult.c_score > 70
                      ? "Cuestionas con criterio, buscas mejorar las cosas y te exiges mucho a ti mismo y a los demás."
                      : discResult.d_score > 70 && discResult.i_score > 70
                        ? "Eres enérgico, persuasivo y disfrutas estar en acción constante influyendo en otros."
                        : discResult.i_score > 70 && discResult.s_score > 70
                          ? "Conectas con las personas, generas confianza y prefieres ambientes armoniosos y colaborativos."
                          : discResult.s_score > 70 && discResult.c_score > 70
                            ? "Eres metódico, confiable y prefieres la estabilidad y la precisión en lo que haces."
                            : "Tienes un perfil equilibrado que te permite adaptarte a diferentes situaciones."}
                    "
                  </p>
                </div>

                {/* Top 5 ideas sobre tu forma de ser */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple" />
                    Top 5 ideas sobre tu forma de ser
                  </h3>
                  <div className="grid gap-3">
                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue/10 flex items-center justify-center font-bold text-blue">
                            1
                          </div>
                          <div>
                            <strong>Cómo piensas y decides:</strong>
                            <p className="text-sm text-muted/60 mt-1">
                              {discResult.d_score > 70
                                ? "Decides rápido, priorizas resultados y prefieres la acción inmediata."
                                : discResult.c_score > 70
                                  ? "Analizas a fondo, recopilas datos y buscas la opción más precisa antes de decidir."
                                  : discResult.s_score > 70
                                    ? "Prefieres consenso, evitas riesgos innecesarios y decides después de consultar con otros."
                                    : "Decides basándote en tu intuición social y en cómo afecta a las personas involucradas."}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-purple/10 flex items-center justify-center font-bold text-purple">
                            2
                          </div>
                          <div>
                            <strong>Cómo te ves a ti mismo:</strong>
                            <p className="text-sm text-muted/60 mt-1">
                              {discResult.d_score > 70
                                ? "Te ves como alguien competente, fuerte y capaz de superar cualquier obstáculo."
                                : discResult.i_score > 70
                                  ? "Te ves como alguien carismático, optimista y capaz de conectar con cualquier persona."
                                  : discResult.s_score > 70
                                    ? "Te ves como alguien confiable, leal y el soporte estable de quienes te rodean."
                                    : "Te ves como alguien inteligente, preciso y con altos estándares de calidad."}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-green/10 flex items-center justify-center font-bold text-green">
                            3
                          </div>
                          <div>
                            <strong>Cómo te perciben otros:</strong>
                            <p className="text-sm text-muted/60 mt-1">
                              Tu pareja/familia te ve como{" "}
                              {discResult.d_score > 70
                                ? "intenso pero confiable, aunque a veces demasiado directo."
                                : discResult.i_score > 70
                                  ? "divertido y sociable, aunque a veces disperso."
                                  : discResult.s_score > 70
                                    ? "paciente y comprensivo, aunque a veces demasiado complaciente."
                                    : "inteligente y detallista, aunque a veces crítico."}{" "}
                              Tus colegas te ven como{" "}
                              {discResult.d_score > 70
                                ? "eficiente y orientado a resultados."
                                : discResult.i_score > 70
                                  ? "motivador y con gran energía."
                                  : discResult.s_score > 70
                                    ? "colaborativo y confiable."
                                    : "experto y con alto nivel de calidad."}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-yellow/10 flex items-center justify-center font-bold text-yellow">
                            4
                          </div>
                          <div>
                            <strong>Dónde generas más impacto:</strong>
                            <p className="text-sm text-muted/60 mt-1">
                              Cuando estás en equilibrio, generas impacto en{" "}
                              {discResult.d_score > 70
                                ? "resolver problemas complejos y liderar cambios difíciles."
                                : discResult.i_score > 70
                                  ? "inspirar a otros y crear ambientes positivos."
                                  : discResult.s_score > 70
                                    ? "mantener la armonía y apoyar a otros de forma constante."
                                    : "asegurar calidad y precisión en todo lo que tocas."}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardContent className="pt-4">
                        <div className="flex gap-3">
                          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red/10 flex items-center justify-center font-bold text-red">
                            5
                          </div>
                          <div>
                            <strong>Qué pasa bajo estrés:</strong>
                            <p className="text-sm text-muted/60 mt-1">
                              Cuando estás estresado,{" "}
                              {discResult.d_score > 70
                                ? "puedes volverte autoritario, impaciente y poco receptivo."
                                : discResult.i_score > 70
                                  ? "puedes volverte desorganizado, superficial y evasivo."
                                  : discResult.s_score > 70
                                    ? "puedes volverte pasivo-agresivo, indeciso y resentido."
                                    : "puedes volverte crítico, perfeccionista y distante."}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Mapa de impacto */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Target className="h-5 w-5 text-orange" />
                    Mapa de Impacto: Cómo tu estilo afecta hoy
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <Card className="border-l-4 border-l-purple-500">
                      <CardContent className="pt-4">
                        <h4 className="font-semibold text-purple mb-2">Vida Personal</h4>
                        <p className="text-sm text-muted/60">
                          {discResult.d_score > 70
                            ? "Tus relaciones personales pueden sentir tu intensidad. Algunos te admiran, otros se sienten abrumados."
                            : discResult.i_score > 70
                              ? "Tu energía social enriquece tus vínculos, pero necesitas trabajar en el seguimiento y profundidad."
                              : discResult.s_score > 70
                                ? "Eres el ancla emocional de tus círculos cercanos, pero a veces descuidas tus propias necesidades."
                                : "Tu amor por el orden y la lógica puede hacer que parezcas distante emocionalmente."}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-blue-500">
                      <CardContent className="pt-4">
                        <h4 className="font-semibold text-blue mb-2">Trabajo/Estudios</h4>
                        <p className="text-sm text-muted/60">
                          {discResult.d_score > 70
                            ? "Eres el motor de resultados, pero a veces atropellas procesos o personas en el camino."
                            : discResult.i_score > 70
                              ? "Tu networking y comunicación son excelentes, pero la ejecución y seguimiento son tu reto."
                              : discResult.s_score > 70
                                ? "Eres el colaborador ideal, pero te cuesta liderar cambios o tomar decisiones difíciles."
                                : "Tu calidad de trabajo es impecable, pero tu perfeccionismo puede frenar el progreso."}
                        </p>
                      </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-green-500">
                      <CardContent className="pt-4">
                        <h4 className="font-semibold text-green mb-2">Proyectos/Decisiones</h4>
                        <p className="text-sm text-muted/60">
                          {discResult.d_score > 70
                            ? "Inicias muchos proyectos con energía, pero necesitas trabajar en la paciencia y el refinamiento."
                            : discResult.i_score > 70
                              ? "Tienes ideas brillantes y entusiasmo, pero te cuesta convertirlas en realidad sostenible."
                              : discResult.s_score > 70
                                ? "Prefieres proyectos estables y seguros, pero te cuesta tomar riesgos que podrían ser necesarios."
                                : "Planificas meticulosamente, pero a veces te quedas en análisis y no pasas a la acción."}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Tres movimientos clave */}
                <div className="bg-gradient-to-r from-orange/5 to-red-50 p-6 rounded-lg border-l-4 border-orange">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-orange" />
                    Tres Movimientos Clave para los próximos 90 días
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <div className="text-sm font-semibold text-orange mb-1">1. Cambio Personal</div>
                      <p className="text-sm text-muted">
                        {discResult.d_score > 70
                          ? "Practica pausar 5 segundos antes de responder en situaciones tensas."
                          : discResult.i_score > 70
                            ? "Completa al menos 3 tareas importantes antes de iniciar nuevas ideas."
                            : discResult.s_score > 70
                              ? "Di 'no' a al menos 2 solicitudes que no sean prioridad esta semana."
                              : "Termina un proyecto en versión 80% sin seguir perfeccionándolo."}
                      </p>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-orange mb-1">2. Cambio Relacional</div>
                      <p className="text-sm text-muted">
                        {discResult.d_score > 70
                          ? "Pregunta 'Qué opinas tú?' antes de dar tu opinión en conversaciones importantes."
                          : discResult.i_score > 70
                            ? "Programa 1 conversación profunda semanal sin distracciones."
                            : discResult.s_score > 70
                              ? "Expresa 1 molestia pequeña antes de que se acumule."
                              : "Comparte 1 emoción personal por día con alguien cercano."}
                      </p>
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-orange mb-1">3. Cambio Laboral</div>
                      <p className="text-sm text-muted">
                        {discResult.d_score > 70
                          ? "Delega 1 tarea importante sin micro-gestionar el proceso."
                          : discResult.i_score > 70
                            ? "Usa un sistema de seguimiento para terminar tus proyectos actuales."
                            : discResult.s_score > 70
                              ? "Propón 1 cambio o mejora sin esperar que otros lo sugieran primero."
                              : "Acepta feedback sin defender o explicar tu proceso por 1 semana."}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue" />
                  Tu Perfil DISC
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-red/5 rounded-lg text-center">
                    <div className="text-3xl font-bold text-red">{discResult.d_score}%</div>
                    <div className="font-semibold mt-1">Dominancia</div>
                  </div>
                  <div className="p-4 bg-yellow/5 rounded-lg text-center">
                    <div className="text-3xl font-bold text-yellow">{discResult.i_score}%</div>
                    <div className="font-semibold mt-1">Influencia</div>
                  </div>
                  <div className="p-4 bg-green/5 rounded-lg text-center">
                    <div className="text-3xl font-bold text-green">{discResult.s_score}%</div>
                    <div className="font-semibold mt-1">Estabilidad</div>
                  </div>
                  <div className="p-4 bg-blue/5 rounded-lg text-center">
                    <div className="text-3xl font-bold text-blue">{discResult.c_score}%</div>
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
                        <CheckCircle2 className="h-5 w-5 text-green mt-0.5 flex-shrink-0" />
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
                        <Target className="h-5 w-5 text-orange mt-0.5 flex-shrink-0" />
                        <span>{challenge}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-8 border-2 border-purple/20 bg-gradient-to-br from-purple/5 to-pink-50">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Heart className="w-6 h-6 text-purple" />
                  Impacto en tu Vida Personal
                </CardTitle>
                <CardDescription>
                  Cómo tu perfil {discResult.primary_type} influye en tus relaciones, bienestar y vida diaria
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2 text-purple">
                      <Users className="w-5 h-5" />
                      Relaciones Personales
                    </h3>
                    <p className="text-muted leading-relaxed">
                      {discResult.primary_type === "Dominance"
                        ? "En tu familia y pareja, tu estilo directo puede ser percibido como autoritario. Practica escucha activa y cede el control en decisiones cotidianas."
                        : discResult.primary_type === "Influence"
                          ? "Tu energía social enriquece tus amistades, pero puede agotar a personas más introvertidas. Reserva momentos de calidad sin distracciones."
                          : discResult.primary_type === "Steadiness"
                            ? "Tu lealtad es tu mayor fortaleza en relaciones, pero evita sacrificar tus necesidades por complacer. Practica poner límites con amor."
                            : "Tu tendencia al análisis puede hacer que parezcas distante emocionalmente. Comparte más tus emociones y valora lo emocional tanto como lo lógico."}
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2 text-purple">
                      <Home className="w-5 h-5" />
                      Vida Familiar
                    </h3>
                    <p className="text-muted leading-relaxed">
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
                    <h3 className="font-semibold text-lg flex items-center gap-2 text-purple">
                      <Heart className="w-5 h-5" />
                      Bienestar Emocional
                    </h3>
                    <p className="text-muted leading-relaxed">
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
                    <h3 className="font-semibold text-lg flex items-center gap-2 text-purple">
                      <Sparkles className="w-5 h-5" />
                      Desarrollo Personal
                    </h3>
                    <p className="text-muted leading-relaxed">
                      {discResult.primary_type === "Dominance"
                        ? "Enfócate en desarrollar paciencia y empatía. Lee sobre inteligencia emocional y practica puterte en los zapatos de otros."
                        : discResult.primary_type === "Influence"
                          ? "Desarrolla disciplina y seguimiento. Usa herramientas para mantener el enfoque y completa lo que inicias."
                          : discResult.primary_type === "Steadiness"
                            ? "Practica la asertividad y el cambio. Sal de tu zona de confort con pequeños experimentos seguros."
                            : "Desarrolla tu conexión emocional. Practica nombrar tus emociones y compartir cómo te sientes con personas de confianza."}
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border-l-4 border-purple">
                  <h3 className="font-semibold text-lg mb-3 text-purple">
                    💡 Recuerda: Tu trabajo es solo una parte de tu vida
                  </h3>
                  <p className="text-muted leading-relaxed">
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
                <p className="text-muted">{discResult.analysis}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="development" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow" />
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

          {/* New: Mini Tablero de Control section */}
          <TabsContent value="mini-tablero" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue" />
                  Mini Tablero de Control 90 Días
                </CardTitle>
                <CardDescription>Tu progreso de un vistazo - Actualizado en tiempo real</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="bg-blue/5">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-blue">Mes 1: Autoconocimiento</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-blue">{calculateMonthProgress("m1")}%</span>
                          <Badge variant={calculateMonthProgress("m1") >= 75 ? "default" : "secondary"}>
                            {calculateMonthProgress("m1") >= 75 ? "En curso" : "Pendiente"}
                          </Badge>
                        </div>
                        <Progress value={calculateMonthProgress("m1")} className="h-2 bg-blue/10" />
                        <p className="text-xs text-blue mt-2">Objetivo: Entender tu perfil DISC</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-green/5">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-green">Mes 2: Experimentación</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-green">{calculateMonthProgress("m2")}%</span>
                          <Badge variant={calculateMonthProgress("m2") >= 75 ? "default" : "secondary"}>
                            {calculateMonthProgress("m2") >= 75 ? "En curso" : "Próximo"}
                          </Badge>
                        </div>
                        <Progress value={calculateMonthProgress("m2")} className="h-2 bg-green/10" />
                        <p className="text-xs text-green mt-2">Objetivo: Practicar nuevos comportamientos</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple/5">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium text-purple">Mes 3: Consolidación</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-2xl font-bold text-purple">{calculateMonthProgress("m3")}%</span>
                          <Badge variant={calculateMonthProgress("m3") >= 75 ? "default" : "secondary"}>
                            {calculateMonthProgress("m3") >= 75 ? "En curso" : "Próximo"}
                          </Badge>
                        </div>
                        <Progress value={calculateMonthProgress("m3")} className="h-2 bg-purple/10" />
                        <p className="text-xs text-purple mt-2">Objetivo: Crear hábitos sostenibles</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Resumen de Progreso Global</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Progreso Total del Plan 90 Días</span>
                      <span className="text-lg font-bold">
                        {Math.round(
                          (calculateMonthProgress("m1") + calculateMonthProgress("m2") + calculateMonthProgress("m3")) /
                            3,
                        )}
                        %
                      </span>
                    </div>
                    <Progress
                      value={Math.round(
                        (calculateMonthProgress("m1") + calculateMonthProgress("m2") + calculateMonthProgress("m3")) /
                          3,
                      )}
                      className="h-3"
                    />
                    <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t">
                      <div>
                        <p className="text-xs text-muted-foreground">Tests Completados</p>
                        <p className="text-xl font-semibold">1/6</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Metas Creadas</p>
                        <p className="text-xl font-semibold">0/3</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* New: Misión 3 Meses section */}
          <TabsContent value="mision-3-meses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-purple" />
                  Tu Misión DTC de 3 Meses
                </CardTitle>
                <CardDescription>El marco integrador que guiará tu desarrollo personal y profesional</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-purple/5 to-blue/5 p-6 rounded-lg border-2 border-purple/20">
                  <h3 className="text-xl font-bold text-purple mb-3">
                    Desarrollar mi versatilidad conductual consciente
                  </h3>
                  <p className="text-muted leading-relaxed">
                    En los próximos 3 meses, voy a profundizar en mi autoconocimiento DISC para entender cómo mi perfil{" "}
                    <strong>{discResult.primary_type}</strong> me ayuda y me limita en mi vida personal y profesional.
                    Voy a experimentar conscientemente con comportamientos fuera de mi zona de confort, especialmente en
                    situaciones que requieren{" "}
                    {discResult.primary_type === "D"
                      ? "más paciencia y escucha"
                      : discResult.primary_type === "I"
                        ? "más estructura y seguimiento"
                        : discResult.primary_type === "S"
                          ? "más iniciativa y adaptabilidad"
                          : "más flexibilidad y conexión emocional"}
                    . Al final, habré creado un sistema personal de desarrollo continuo que me permita elegir
                    conscientemente cómo quiero comportarme según el contexto.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <Card className="bg-blue/5 border-blue/20">
                    <CardHeader>
                      <CardTitle className="text-sm text-blue">Por qué esta misión</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted">
                        Porque mi perfil {discResult.primary_type} es una fortaleza en muchas situaciones, pero puede
                        volverse un patrón automático que me limita. Quiero tener más opciones de respuesta y elegir
                        conscientemente.
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="bg-green/5 border-green/20">
                    <CardHeader>
                      <CardTitle className="text-sm text-green">Cómo sabré que lo logré</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="text-sm text-muted space-y-1">
                        <li>✓ Habré completado 3+ tests DTC</li>
                        <li>✓ Tendré 10+ experimentos documentados</li>
                        <li>✓ Habré recibido feedback positivo sobre mi versatilidad</li>
                        <li>✓ Tendré un sistema personal de desarrollo activo</li>
                      </ul>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple/5 border-purple/20">
                    <CardHeader>
                      <CardTitle className="text-sm text-purple">Qué gano con esto</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted">
                        Más libertad para ser quien necesito ser en cada momento. Mejores relaciones porque entiendo
                        mejor a los demás. Más efectividad porque puedo adaptar mi estilo al contexto.
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Conexión con tu vida real</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <h4 className="font-medium text-sm mb-1">En tu vida personal:</h4>
                      <p className="text-sm text-muted">
                        {discResult.primary_type === "D" &&
                          "Aprenderás a ser más paciente y presente con tu familia y pareja, sin perder tu determinación."}
                        {discResult.primary_type === "I" &&
                          "Aprenderás a dar seguimiento a compromisos personales importantes, sin perder tu calidez."}
                        {discResult.primary_type === "S" &&
                          "Aprenderás a poner límites y tomar más iniciativas, sin perder tu empatía."}
                        {discResult.primary_type === "C" &&
                          "Aprenderás a ser más flexible y espontáneo en tus relaciones, sin perder tu profundidad."}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm mb-1">En tu trabajo/estudio:</h4>
                      <p className="text-sm text-muted">
                        {discResult.primary_type === "D" &&
                          "Aprenderás a delegar más y confiar en el proceso, siendo más efectivo como líder."}
                        {discResult.primary_type === "I" &&
                          "Aprenderás a estructurar mejor tus proyectos y dar seguimiento, siendo más confiable."}
                        {discResult.primary_type === "S" &&
                          "Aprenderás a manejar mejor el cambio y tomar decisiones más rápido cuando es necesario."}
                        {discResult.primary_type === "C" &&
                          "Aprenderás a comunicar tus ideas con más calidez y conectar mejor con tu equipo."}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </CardContent>
            </Card>
          </TabsContent>

          {/* New: Semana Despegue section */}
          <TabsContent value="semana-despegue" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-orange" />
                  Semana Despegue: Tus Primeros 7 Días
                </CardTitle>
                <CardDescription>
                  Acciones concretas para empezar HOY (no esperes al lunes, ni al próximo mes)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert className="bg-orange/5 border-orange/20">
                  <AlertCircle className="h-4 w-4 text-orange" />
                  <AlertTitle className="text-orange">Regla de Oro</AlertTitle>
                  <AlertDescription className="text-orange">
                    Esta semana es de observación sin juicio. No intentes cambiar nada todavía, solo nota y registra.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  {[
                    {
                      day: "Día 1 (HOY)",
                      title: "Lectura y aceptación",
                      time: "15 min",
                      actions: [
                        "Lee completo tu informe DISC (sí, todo)",
                        "Marca con ⭐ las 5 frases que más te resonaron",
                        "Comparte 1 insight con alguien cercano",
                      ],
                    },
                    {
                      day: "Día 2",
                      title: "Primera observación",
                      time: "20 min",
                      actions: [
                        "Elige UNA situación típica de tu día (reunión, comida familiar, clase)",
                        "Observa cómo tu perfil DISC se manifiesta",
                        "Escribe 3 frases: qué hiciste, cómo te sentiste, qué resultado obtuviste",
                      ],
                    },
                    {
                      day: "Día 3",
                      title: "Feedback externo",
                      time: "30 min",
                      actions: [
                        "Pide a 1 persona cercana: '¿Cómo describirías mi forma de comunicarme/trabajar/relacionarme?'",
                        "NO le digas todavía tus resultados DISC",
                        "Compara lo que te dice con tu informe",
                      ],
                    },
                    {
                      day: "Día 4",
                      title: "Identificar patrón automático",
                      time: "15 min",
                      actions: [
                        "Revisa tu sección 'Riesgos y Sombras' del informe",
                        "Elige el riesgo que MÁS te resuena",
                        "Escribe 2 ejemplos recientes donde ese riesgo apareció",
                      ],
                    },
                    {
                      day: "Día 5",
                      title: "Mini experimento",
                      time: "Variable",
                      actions: [
                        "Elige UNA acción pequeña de la sección 'Oportunidades de Crecimiento'",
                        "Pruébala HOY en una situación de bajo riesgo",
                        "Documenta: qué hiciste diferente, cómo te sentiste, qué pasó",
                      ],
                    },
                    {
                      day: "Día 6",
                      title: "Reflexión semanal",
                      time: "20 min",
                      actions: [
                        "Revisa tus notas de los días 1-5",
                        "¿Qué aprendiste sobre ti que no sabías?",
                        "¿Qué quieres explorar más en las próximas semanas?",
                      ],
                    },
                    {
                      day: "Día 7",
                      title: "Próximos pasos",
                      time: "25 min",
                      actions: [
                        "Completa el test de Inteligencia Emocional (complementa tu DISC)",
                        "Crea tu primera meta en la plataforma basada en lo que descubriste",
                        "Agenda 10 min cada semana para seguir observándote",
                      ],
                    },
                  ].map((day, idx) => (
                    <Card key={idx} className="border-l-4 border-l-orange-400">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <CardTitle className="text-sm font-semibold text-orange">{day.day}</CardTitle>
                            <CardDescription className="text-xs">{day.title}</CardDescription>
                          </div>
                          <Badge variant="outline" className="text-orange border-orange/30">
                            {day.time}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1">
                          {day.actions.map((action, aIdx) => (
                            <li key={aIdx} className="text-sm text-muted flex items-start gap-2">
                              <span className="text-orange font-bold">•</span>
                              <span>{action}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Alert className="bg-green/5 border-green/20">
                  <CheckCircle2 className="h-4 w-4 text-green" />
                  <AlertTitle className="text-green">Al final de esta semana</AlertTitle>
                  <AlertDescription className="text-green">
                    Tendrás: observaciones concretas de tu comportamiento, feedback externo, un mini experimento
                    completado, y tu segundo test DTC hecho. Estarás 10x más consciente de tu estilo DISC.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="biblioteca" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue" />
                  Biblioteca DTC Recomendada para tu Perfil {discResult.primary_type}
                </CardTitle>
                <CardDescription>
                  Recursos específicos + mini-desafíos para aplicar lo aprendido (enfoque integral)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 font-semibold">Área de Desarrollo</th>
                        <th className="text-left p-3 font-semibold">Libro/Recurso DTC</th>
                        <th className="text-left p-3 font-semibold">Por qué es clave para ti</th>
                        <th className="text-left p-3 font-semibold">Mini-Desafío (7 días)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {discResult.d_score >= 50 && (
                        <>
                          <tr className="border-b hover:bg-muted/5">
                            <td className="p-3">
                              <Badge variant="outline" className="bg-red/5">
                                {discResult.d_score > 70 ? "Intensidad en discusiones" : "Asertividad equilibrada"}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <div className="font-medium">Comunicación No Violenta</div>
                              <div className="text-sm text-muted/50">Marshall Rosenberg</div>
                            </td>
                            <td className="p-3 text-sm">
                              {discResult.d_score > 70
                                ? "Tu D alta te hace ir rápido y fuerte; este libro te ayudará a bajar la intensidad sin perder claridad."
                                : "Te ayudará a mantener tu orientación a resultados mientras mejoras tu comunicación empática."}
                            </td>
                            <td className="p-3 text-sm">
                              <Button size="sm" variant="outline" className="text-xs bg-transparent">
                                Aplicar técnica del cap. 3 esta semana
                              </Button>
                            </td>
                          </tr>
                          <tr className="border-b hover:bg-muted/5">
                            <td className="p-3">
                              <Badge variant="outline" className="bg-orange/5">
                                Paciencia y escucha
                              </Badge>
                            </td>
                            <td className="p-3">
                              <div className="font-medium">El Arte de Escuchar</div>
                              <div className="text-sm text-muted/50">Erich Fromm</div>
                            </td>
                            <td className="p-3 text-sm">
                              {discResult.d_score > 70
                                ? "Tu urgencia por actuar puede hacer que no escuches completamente. Este libro te enseñará a frenar."
                                : "Fortalecerá tu capacidad de entender profundamente antes de actuar."}
                            </td>
                            <td className="p-3 text-sm">
                              <Button size="sm" variant="outline" className="text-xs bg-transparent">
                                Hacer 1 conversación de 30 min solo escuchando
                              </Button>
                            </td>
                          </tr>
                        </>
                      )}

                      {discResult.i_score >= 50 && (
                        <>
                          <tr className="border-b hover:bg-muted/5">
                            <td className="p-3">
                              <Badge variant="outline" className="bg-yellow/5">
                                {discResult.i_score > 70 ? "Seguimiento y profundidad" : "Conexión significativa"}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <div className="font-medium">Esencialismo</div>
                              <div className="text-sm text-muted/50">Greg McKeown</div>
                            </td>
                            <td className="p-3 text-sm">
                              {discResult.i_score > 70
                                ? "Tu I alta te hace iniciar muchas conversaciones y proyectos; este libro te ayudará a enfocarte en lo que importa."
                                : "Te ayudará a mantener tu entusiasmo mientras priorizas lo verdaderamente importante."}
                            </td>
                            <td className="p-3 text-sm">
                              <Button size="sm" variant="outline" className="text-xs bg-transparent">
                                Elegir 3 prioridades y decir no al resto por 1 semana
                              </Button>
                            </td>
                          </tr>
                          <tr className="border-b hover:bg-muted/5">
                            <td className="p-3">
                              <Badge variant="outline" className="bg-yellow/5">
                                Organización personal
                              </Badge>
                            </td>
                            <td className="p-3">
                              <div className="font-medium">Getting Things Done</div>
                              <div className="text-sm text-muted/50">David Allen</div>
                            </td>
                            <td className="p-3 text-sm">
                              {discResult.i_score > 70
                                ? "Tu dispersión natural necesita un sistema simple para capturar y ejecutar tus ideas sin perder tu espontaneidad."
                                : "Fortalecerá tu capacidad de convertir ideas en resultados concretos."}
                            </td>
                            <td className="p-3 text-sm">
                              <Button size="sm" variant="outline" className="text-xs bg-transparent">
                                Implementar sistema de captura rápida por 7 días
                              </Button>
                            </td>
                          </tr>
                        </>
                      )}

                      {discResult.s_score >= 50 && (
                        <>
                          <tr className="border-b hover:bg-muted/5">
                            <td className="p-3">
                              <Badge variant="outline" className="bg-green/5">
                                {discResult.s_score > 70 ? "Límites saludables" : "Estabilidad y apoyo"}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <div className="font-medium">Boundaries (Límites)</div>
                              <div className="text-sm text-muted/50">Henry Cloud & John Townsend</div>
                            </td>
                            <td className="p-3 text-sm">
                              {discResult.s_score > 70
                                ? "Tu S alta te hace complacer a otros en exceso; este libro te enseñará a cuidarte sin dejar de ser amable."
                                : "Te ayudará a mantener tu capacidad de apoyo sin sacrificar tus propias necesidades."}
                            </td>
                            <td className="p-3 text-sm">
                              <Button size="sm" variant="outline" className="text-xs bg-transparent">
                                Practicar decir 'no' a 2 pedidos no prioritarios
                              </Button>
                            </td>
                          </tr>
                          <tr className="border-b hover:bg-muted/5">
                            <td className="p-3">
                              <Badge variant="outline" className="bg-teal-50">
                                Expresión de necesidades
                              </Badge>
                            </td>
                            <td className="p-3">
                              <div className="font-medium">Conversaciones Cruciales</div>
                              <div className="text-sm text-muted/50">Kerry Patterson et al.</div>
                            </td>
                            <td className="p-3 text-sm">
                              {discResult.s_score > 70
                                ? "Tu tendencia a evitar conflictos puede hacer que acumules resentimiento. Aprende a hablar cuando importa."
                                : "Fortalecerá tu habilidad para mantener conversaciones difíciles sin perder la armonía."}
                            </td>
                            <td className="p-3 text-sm">
                              <Button size="sm" variant="outline" className="text-xs bg-transparent">
                                Tener 1 conversación difícil que has postergado
                              </Button>
                            </td>
                          </tr>
                        </>
                      )}

                      {discResult.c_score >= 50 && (
                        <>
                          <tr className="border-b hover:bg-muted/5">
                            <td className="p-3">
                              <Badge variant="outline" className="bg-blue/5">
                                {discResult.c_score > 70 ? "Perfeccionismo paralizante" : "Excelencia equilibrada"}
                              </Badge>
                            </td>
                            <td className="p-3">
                              <div className="font-medium">La Trampa de la Perfección</div>
                              <div className="text-sm text-muted/50">Brené Brown</div>
                            </td>
                            <td className="p-3 text-sm">
                              {discResult.c_score > 70
                                ? "Tu C alta puede hacer que nunca te sientas 'suficiente'. Este libro te ayudará a aceptar la imperfección sin bajar estándares."
                                : "Te ayudará a mantener tu atención al detalle sin caer en la autocrítica excesiva."}
                            </td>
                            <td className="p-3 text-sm">
                              <Button size="sm" variant="outline" className="text-xs bg-transparent">
                                Entregar 1 proyecto en versión 80% sin seguir puliendo
                              </Button>
                            </td>
                          </tr>
                          <tr className="border-b hover:bg-muted/5">
                            <td className="p-3">
                              <Badge variant="outline" className="bg-blue/5">
                                Conexión emocional
                              </Badge>
                            </td>
                            <td className="p-3">
                              <div className="font-medium">Inteligencia Emocional 2.0</div>
                              <div className="text-sm text-muted/50">Travis Bradberry</div>
                            </td>
                            <td className="p-3 text-sm">
                              {discResult.c_score > 70
                                ? "Tu enfoque lógico puede distanciarte emocionalmente de otros. Aprende a conectar sin perder tu objetividad."
                                : "Fortalecerá tu capacidad de integrar análisis racional con inteligencia emocional."}
                            </td>
                            <td className="p-3 text-sm">
                              <Button size="sm" variant="outline" className="text-xs bg-transparent">
                                Compartir 1 emoción personal diaria con alguien cercano
                              </Button>
                            </td>
                          </tr>
                        </>
                      )}

                      {discResult.d_score < 50 &&
                        discResult.i_score < 50 &&
                        discResult.s_score < 50 &&
                        discResult.c_score < 50 && (
                          <>
                            <tr className="border-b hover:bg-muted/5">
                              <td className="p-3">
                                <Badge variant="outline" className="bg-purple/5">
                                  Autoconocimiento integral
                                </Badge>
                              </td>
                              <td className="p-3">
                                <div className="font-medium">Diseña Tu Vida</div>
                                <div className="text-sm text-muted/50">Bill Burnett & Dave Evans</div>
                              </td>
                              <td className="p-3 text-sm">
                                Tu perfil equilibrado te da flexibilidad. Este libro te ayudará a diseñar una vida que
                                aproveche esa versatilidad.
                              </td>
                              <td className="p-3 text-sm">
                                <Button size="sm" variant="outline" className="text-xs bg-transparent">
                                  Hacer ejercicio de "Odisea" del cap. 4
                                </Button>
                              </td>
                            </tr>
                            <tr className="border-b hover:bg-muted/5">
                              <td className="p-3">
                                <Badge variant="outline" className="bg-red/5">
                                  Desarrollo integral
                                </Badge>
                              </td>
                              <td className="p-3">
                                <div className="font-medium">Los 7 Hábitos de la Gente Altamente Efectiva</div>
                                <div className="text-sm text-muted/50">Stephen Covey</div>
                              </td>
                              <td className="p-3 text-sm">
                                Un clásico para construir efectividad personal y profesional desde lo más profundo.
                              </td>
                              <td className="p-3 text-sm">
                                <Button size="sm" variant="outline" className="text-xs bg-transparent">
                                  Implementar Hábito 1 durante 7 días
                                </Button>
                              </td>
                            </tr>
                          </>
                        )}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-blue/5 to-purple/5 rounded-lg">
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue" />
                    Accede a la biblioteca completa
                  </h4>
                  <p className="text-sm text-muted/60 mb-3">
                    Estos son solo algunos recursos. En la Biblioteca DTC encontrarás +50 libros, podcasts y ejercicios
                    personalizados para tu perfil.
                  </p>
                  <div className="flex gap-2">
                    <Button onClick={() => router.push("/biblioteca")} size="sm">
                      Ver Biblioteca Completa
                    </Button>
                    <Button onClick={() => router.push("/recursos")} size="sm" variant="outline">
                      Motor de Recomendación
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="connections" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Link2 className="h-5 w-5 text-purple" />
                  Conexión con Otros Módulos DTC
                </CardTitle>
                <CardDescription>Cómo tu perfil DISC se relaciona con los demás tests del ecosistema</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {moduleConnections.map((conn, idx) => (
                    <Card key={idx} className="border-l-4 border-l-purple-500">
                      <CardContent className="pt-4">
                        <h4 className="font-semibold text-purple">{conn.module}</h4>
                        <p className="text-sm text-muted/60 mt-1">{conn.relation}</p>
                        <div className="mt-2 bg-purple/5 p-2 rounded text-sm">
                          <strong>Sinergia:</strong> {conn.synergy}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-purple/10 to-blue/10 rounded-lg">
                  <h4 className="font-semibold mb-2">Completa tu Perfil 360°</h4>
                  <p className="text-sm text-muted/60 mb-3">
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
                  <MessageSquare className="h-5 w-5 text-blue" />
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
                  <Calendar className="h-5 w-5 text-blue" />
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
                            <h4 className="font-medium text-blue">
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
                        <div className="bg-blue/5 p-3 rounded-lg">
                          <h5 className="font-medium text-sm mb-1">KPIs del Mes:</h5>
                          <ul className="text-sm text-muted/60">
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
                            <h4 className="font-medium text-green">
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
                        <div className="bg-green/5 p-3 rounded-lg">
                          <h5 className="font-medium text-sm mb-1">KPIs del Mes:</h5>
                          <ul className="text-sm text-muted/60">
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
                            <h4 className="font-medium text-purple">
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
                        <div className="bg-purple/5 p-3 rounded-lg">
                          <h5 className="font-medium text-sm mb-1">KPIs del Mes:</h5>
                          <ul className="text-sm text-muted/60">
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

          {/* New: Checklist 30/60/90 section */}
          <TabsContent value="checklist" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green" />
                  Checklist de Seguimiento 30/60/90 Días
                </CardTitle>
                <CardDescription>
                  Indicadores concretos para saber que vas por buen camino (marca los que completes)
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-6">
                  <Card className="bg-blue/5 border-blue/20">
                    <CardHeader>
                      <CardTitle className="text-base text-blue">✓ Día 30: Checkpoint "Autoconocimiento"</CardTitle>
                      <CardDescription className="text-sm text-blue">
                        Ya debes tener claridad sobre tu perfil y haber empezado a observarte
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-blue mb-2">Tests y Evaluaciones:</h4>
                        <div className="flex items-start gap-2">
                          <Checkbox id="c30-t1" />
                          <label htmlFor="c30-t1" className="text-sm cursor-pointer">
                            Completaste el test de Inteligencia Emocional para complementar tu DISC
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="c30-t2" />
                          <label htmlFor="c30-t2" className="text-sm cursor-pointer">
                            Leíste completo tu informe DISC al menos 2 veces
                          </label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-blue mb-2">Observación y Registro:</h4>
                        <div className="flex items-start gap-2">
                          <Checkbox id="c30-o1" />
                          <label htmlFor="c30-o1" className="text-sm cursor-pointer">
                            Tienes un diario con al menos 15 entradas de situaciones donde tu estilo DISC fue evidente
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="c30-o2" />
                          <label htmlFor="c30-o2" className="text-sm cursor-pointer">
                            Identificaste al menos 3 situaciones donde tu estilo te ayudó y 3 donde te limitó
                          </label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-blue mb-2">Feedback Externo:</h4>
                        <div className="flex items-start gap-2">
                          <Checkbox id="c30-f1" />
                          <label htmlFor="c30-f1" className="text-sm cursor-pointer">
                            Pediste a 3 personas cercanas que describan tu estilo de comunicación/trabajo
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="c30-f2" />
                          <label htmlFor="c30-f2" className="text-sm cursor-pointer">
                            Comparaste su percepción con tus resultados y encontraste al menos 2 puntos ciegos
                          </label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-green/5 border-green/20">
                    <CardHeader>
                      <CardTitle className="text-base text-green">✓ Día 60: Checkpoint "Experimentación"</CardTitle>
                      <CardDescription className="text-sm text-green">
                        Ya debes haber salido de tu zona de confort varias veces
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-green mb-2">Experimentos Conductuales:</h4>
                        <div className="flex items-start gap-2">
                          <Checkbox id="c60-e1" />
                          <label htmlFor="c60-e1" className="text-sm cursor-pointer">
                            Identificaste tu dimensión DISC más baja y practicaste comportamientos de ese estilo
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="c60-e2" />
                          <label htmlFor="c60-e2" className="text-sm cursor-pointer">
                            Tienes documentados al menos 5 experimentos en situaciones de bajo riesgo
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="c60-e3" />
                          <label htmlFor="c60-e3" className="text-sm cursor-pointer">
                            Aplicaste lo aprendido en al menos 2 situaciones de mayor importancia
                          </label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-green mb-2">Reflexión y Ajustes:</h4>
                        <div className="flex items-start gap-2">
                          <Checkbox id="c60-r1" />
                          <label htmlFor="c60-r1" className="text-sm cursor-pointer">
                            Escribiste qué funcionó y qué no en tus experimentos
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="c60-r2" />
                          <label htmlFor="c60-r2" className="text-sm cursor-pointer">
                            Ajustaste tu enfoque basado en los resultados obtenidos
                          </label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-green mb-2">Profundización:</h4>
                        <div className="flex items-start gap-2">
                          <Checkbox id="c60-p1" />
                          <label htmlFor="c60-p1" className="text-sm cursor-pointer">
                            Completaste al menos 1 test adicional (MBTI, Big Five o RIASEC)
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="c60-p2" />
                          <label htmlFor="c60-p2" className="text-sm cursor-pointer">
                            Leíste al menos 1 libro o recurso de la Biblioteca DTC recomendada
                          </label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-purple/5 border-purple/20">
                    <CardHeader>
                      <CardTitle className="text-base text-purple">✓ Día 90: Checkpoint "Consolidación"</CardTitle>
                      <CardDescription className="text-sm text-purple">
                        Ya debes tener un sistema personal de desarrollo continuo activo
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-purple mb-2">Sistema y Hábitos:</h4>
                        <div className="flex items-start gap-2">
                          <Checkbox id="c90-s1" />
                          <label htmlFor="c90-s1" className="text-sm cursor-pointer">
                            Estableciste una práctica semanal de autoobservación (ej: journaling cada domingo)
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="c90-s2" />
                          <label htmlFor="c90-s2" className="text-sm cursor-pointer">
                            Creaste recordatorios/triggers para aplicar tus aprendizajes en situaciones clave
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="c90-s3" />
                          <label htmlFor="c90-s3" className="text-sm cursor-pointer">
                            Tienes al menos 3 metas activas en la plataforma relacionadas con tu desarrollo DISC
                          </label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-purple mb-2">Resultados Tangibles:</h4>
                        <div className="flex items-start gap-2">
                          <Checkbox id="c90-r1" />
                          <label htmlFor="c90-r1" className="text-sm cursor-pointer">
                            Recibiste feedback positivo sobre cambios en tu comportamiento de al menos 2 personas
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="c90-r2" />
                          <label htmlFor="c90-r2" className="text-sm cursor-pointer">
                            Puedes dar 3 ejemplos concretos de situaciones donde elegiste conscientemente adaptar tu
                            estilo
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="c90-r3" />
                          <label htmlFor="c90-r3" className="text-sm cursor-pointer">
                            Tus relaciones personales o profesionales mejoraron tangiblemente (menos conflictos, más
                            conexión)
                          </label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-purple mb-2">Visión a Futuro:</h4>
                        <div className="flex items-start gap-2">
                          <Checkbox id="c90-v1" />
                          <label htmlFor="c90-v1" className="text-sm cursor-pointer">
                            Revisaste tu progreso de los 3 meses y documentaste tus principales aprendizajes
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="c90-v2" />
                          <label htmlFor="c90-v2" className="text-sm cursor-pointer">
                            Definiste objetivos claros para los próximos 6 meses de desarrollo personal
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="c90-v3" />
                          <label htmlFor="c90-v3" className="text-sm cursor-pointer">
                            Agendaste una sesión con Coach Sofia para revisar tu plan y siguientes pasos
                          </label>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-sm font-semibold text-purple mb-2">Ecosistema DTC Completo:</h4>
                        <div className="flex items-start gap-2">
                          <Checkbox id="c90-d1" />
                          <label htmlFor="c90-d1" className="text-sm cursor-pointer">
                            Completaste al menos 3 de los 6 tests DTC (DISC, IE, MBTI, Big Five, RIASEC, Soft Skills)
                          </label>
                        </div>
                        <div className="flex items-start gap-2">
                          <Checkbox id="c90-d2" />
                          <label htmlFor="c90-d2" className="text-sm cursor-pointer">
                            Exploraste tu Perfil Integral DTC para ver cómo se conectan todos tus resultados
                          </label>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Alert className="bg-yellow/5 border-yellow/20">
                  <AlertCircle className="h-4 w-4 text-yellow" />
                  <AlertTitle className="text-yellow">Importante</AlertTitle>
                  <AlertDescription className="text-yellow">
                    Estos checkpoints son indicadores, no requisitos rígidos. El desarrollo personal no es lineal. Si
                    algún checkpoint no lo cumpliste al 100%, está bien - lo importante es que sigas avanzando a tu
                    ritmo.
                  </AlertDescription>
                </Alert>
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
              userEmail={user?.email || ""}
            />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
