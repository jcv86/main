"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useSession } from "@/components/session-wrapper"
import { createClient } from "@supabase/supabase-js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ArrowLeft,
  Brain,
  Download,
  Share2,
  TrendingUp,
  Target,
  Sparkles,
  Loader2,
  Lightbulb,
  BookOpen,
  Check,
  Calendar,
  ArrowRight,
} from "lucide-react"
import { MultiTestInsights } from "@/components/multi-test-insights"
import { SofiaDaniCoach } from "@/components/sofia-dani-coach"
import { useToast } from "@/hooks/use-toast"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Separator } from "@/components/ui/separator"
import { UnifiedTestSystem } from "@/lib/unified-test-system"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"

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

interface AIInterpretation {
  interpretation: string
  generated_at: string
}

interface HybridInsight {
  source: "openai" | "cerebro" | "hybrid"
  category: string
  title: string
  description: string
  confidence: number
  priority: "high" | "medium" | "low"
  reasoningSource: string
  personalizedContext?: string
  actionableSteps: string[]
}

interface HybridInsightsResponse {
  insights: HybridInsight[]
  recommendations: Array<{
    title: string
    description: string
    timeframe: string
    difficulty: string
    source: "openai" | "cerebro" | "hybrid"
  }>
  developmentPlan: {
    shortTerm: string[]
    mediumTerm: string[]
    longTerm: string[]
  }
  metadata?: {
    openaiInsightsCount: number
    cerebroInsightsCount: number
    totalInsights: number
  }
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export default function DISCResultsPage() {
  const { user } = useSession()
  const router = useRouter()
  const searchParams = useSearchParams()
  const isDemoMode = searchParams.get("demo") === "true"
  const { toast } = useToast()

  const [discResult, setDiscResult] = useState<DISCResult | null>(null)
  const [aiInterpretation, setAiInterpretation] = useState<string>("")
  const [hybridInsights, setHybridInsights] = useState<HybridInsightsResponse | null>(null)
  const [loadingInsights, setLoadingInsights] = useState(false)
  const [insightsError, setInsightsError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [demoQuestionsUsed, setDemoQuestionsUsed] = useState(0)
  const DEMO_QUESTION_LIMIT = 3

  const [recommendedBooks, setRecommendedBooks] = useState<any[]>([])
  const [loadingBooks, setLoadingBooks] = useState(false)

  const [userGoals, setUserGoals] = useState<any[]>([])
  const [isLoadingGoals, setIsLoadingGoals] = useState(false)
  const [isSavingGoal, setIsSavingGoal] = useState(false)

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  const [activeTab, setActiveTab] = useState("resumen-ejecutivo")

  useEffect(() => {
    if (!user && !isDemoMode) {
      router.push("/")
      return
    }
    loadResults()
  }, [user, router, isDemoMode])

  useEffect(() => {
    if (discResult) {
      loadRecommendedBooks()
    }
  }, [discResult])

  useEffect(() => {
    if (user?.email) {
      loadUserGoals()
    }
  }, [user?.email])

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
      setAiInterpretation(
        "Basado en tu perfil DISC, muestras un fuerte enfoque en Compliance (85%) y Dominancia (75%). Esto indica que eres una persona que valora la precisión, la calidad y los resultados. Tu combinación de alta C y alta D te hace excelente para roles que requieren tanto atención al detalle como capacidad de toma de decisiones.\n\nTus fortalezas incluyen:\n- Pensamiento analítico y sistemático\n- Orientación a resultados y eficiencia\n- Alta calidad en el trabajo\n- Capacidad de liderazgo basada en datos\n\nÁreas de desarrollo:\n- Flexibilidad en situaciones ambiguas\n- Paciencia con procesos menos estructurados\n- Delegación y confianza en otros\n- Balance entre perfección y pragmatismo",
      )
      setLoading(false)
      return
    }

    if (!user) return

    try {
      console.log("[v0] Loading DISC results for user:", user.email)

      const result = await UnifiedTestSystem.loadTestResult(user.email!, "DISC Assessment")

      if (result.success && result.data) {
        console.log("[v0] DISC results loaded from database via unified system")
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

        await loadHybridInsights({
          d_score: scores.D || 0,
          i_score: scores.I || 0,
          s_score: scores.S || 0,
          c_score: scores.C || 0,
          primary_type: scores.primary_style || "Compliance",
          analysis: "",
          recommendations: "",
          created_at: result.data.completed_at || new Date().toISOString(),
        })
      } else {
        console.log("[v0] No DISC results found:", result.error)
        toast({
          title: "No hay resultados",
          description: "No se encontraron resultados del test DISC",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("[v0] Error loading results:", error)
      toast({
        title: "Error",
        description: "Hubo un problema cargando tus resultados",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const loadRecommendedBooks = async () => {
    if (!discResult) return

    setLoadingBooks(true)
    try {
      console.log("[v0] Loading books for DISC type:", discResult.primary_type)
      const response = await fetch("/api/books")
      if (response.ok) {
        const allBooks = await response.json()
        console.log("[v0] Total books fetched:", allBooks.length)

        const filtered = allBooks
          .filter((book: any) => {
            const tags = (book.tags || []).map((t: string) => t.toLowerCase())

            if (discResult.primary_type === "Dominance") {
              return tags.some((t: string) =>
                ["liderazgo", "productividad", "estrategia", "poder", "decisiones"].includes(t),
              )
            } else if (discResult.primary_type === "Influence") {
              return tags.some((t: string) =>
                ["comunicación", "relaciones", "influencia", "networking", "persuasión"].includes(t),
              )
            } else if (discResult.primary_type === "Steadiness") {
              return tags.some((t: string) =>
                ["colaboración", "equipo", "estabilidad", "empatía", "paciencia"].includes(t),
              )
            } else if (discResult.primary_type === "Compliance") {
              return tags.some((t: string) => ["análisis", "calidad", "sistemas", "precisión", "datos"].includes(t))
            }
            return false
          })
          .slice(0, 6)

        console.log("[v0] Filtered books for", discResult.primary_type, ":", filtered.length)
        setRecommendedBooks(filtered)
      }
    } catch (error) {
      console.error("[v0] Error loading books:", error)
    } finally {
      setLoadingBooks(false)
    }
  }

  const loadHybridInsights = async (discData: DISCResult) => {
    if (!user || isDemoMode) return

    setLoadingInsights(true)
    setInsightsError(null)
    try {
      const response = await fetch("/api/post-test-insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          testType: "DISC",
          results: {
            d_score: discData.d_score,
            i_score: discData.i_score,
            s_score: discData.s_score,
            c_score: discData.c_score,
            primary_type: discData.primary_type,
          },
          userId: user.id,
          testResponses: discData,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setHybridInsights(data)
      } else {
        const errorData = await response.json()
        setInsightsError(errorData.message || "Error al generar insights")
      }
    } catch (error) {
      console.error("Error loading hybrid insights:", error)
      setInsightsError("No se pudieron cargar los insights. Por favor, intenta de nuevo.")
    } finally {
      setLoadingInsights(false)
    }
  }

  const retryLoadInsights = () => {
    if (discResult) {
      loadHybridInsights(discResult)
    }
  }

  const loadUserGoals = async () => {
    if (!user?.email) return

    setIsLoadingGoals(true)
    try {
      const response = await fetch(`/api/goals?userEmail=${encodeURIComponent(user.email)}`)
      const data = await response.json()

      if (response.ok) {
        setUserGoals(data.goals || [])
        console.log("[v0] Loaded user goals:", data.goals?.length || 0)
      } else {
        console.error("[v0] Error loading goals:", data.error)
      }
    } catch (error) {
      console.error("[v0] Failed to load goals:", error)
    } finally {
      setIsLoadingGoals(false)
    }
  }

  const saveGoalToDatabase = async (goal: any) => {
    if (!user?.email) {
      toast({ title: "Debes iniciar sesión para guardar metas", variant: "destructive" })
      return
    }

    setIsSavingGoal(true)
    try {
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userEmail: user.email,
          title: goal.goal,
          description: goal.description || "",
          timeframe: goal.timeframe,
          priority: goal.priority || "medium",
          targetDate: goal.deadline || null,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({ title: "¡Meta guardada!", description: "Tu meta ha sido guardada en tu dashboard" })
        await loadUserGoals()
      } else {
        toast({ title: "Error al guardar meta", description: data.error, variant: "destructive" })
      }
    } catch (error) {
      console.error("[v0] Failed to save goal:", error)
      toast({ title: "Error", description: "No se pudo guardar la meta", variant: "destructive" })
    } finally {
      setIsSavingGoal(false)
    }
  }

  const getPersonalizedGoals = (timeframe: "short" | "medium" | "long") => {
    const baseGoals = {
      short: [
        {
          goal: "Modular intensidad en reuniones",
          description: "Practicar pausa de 5 segundos antes de responder en situaciones tensas",
          steps: [
            "Identificar triggers de intensidad",
            "Practicar técnica de respiración 4-7-8",
            "Pedir feedback semanal al equipo",
          ],
          priority: "high",
        },
        {
          goal: 'Definir "siguiente paso mínimo"',
          description: 'Establecer criterios de "suficientemente bueno" para avanzar',
          steps: [
            "Listar tareas críticas vs opcionales",
            "Establecer timeboxing de 5 min para decisiones",
            "Documentar criterios de aceptación",
          ],
          priority: "high",
        },
      ],
      medium: [
        {
          goal: "Flexibilizar perfeccionismo",
          description: "Aprender a trabajar con 80% de calidad cuando es apropiado",
          steps: [
            "Identificar proyectos donde 80% es suficiente",
            "Practicar delegación con feedback constructivo",
            "Medir impacto de decisiones rápidas vs perfectas",
          ],
          priority: "medium",
        },
      ],
      long: [
        {
          goal: "Aumentar conexión emocional con equipo",
          description: "Desarrollar inteligencia emocional y empatía en liderazgo",
          steps: [
            "Realizar check-ins emocionales semanales",
            "Completar test de Inteligencia Emocional DTC",
            "Buscar mentoría en liderazgo empático",
          ],
          priority: "medium",
        },
      ],
    }

    return baseGoals[timeframe] || []
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

  const radarData = [
    { subject: "Dominancia", A: discResult.d_score, fullMark: 100 },
    { subject: "Influencia", A: discResult.i_score, fullMark: 100 },
    { subject: "Estabilidad", A: discResult.s_score, fullMark: 100 },
    { subject: "Cumplimiento", A: discResult.c_score, fullMark: 100 },
  ]

  const barData = [
    { name: "D", value: discResult.d_score, color: "#0088FE" },
    { name: "I", value: discResult.i_score, color: "#00C49F" },
    { name: "S", value: discResult.s_score, color: "#FFBB28" },
    { name: "C", value: discResult.c_score, color: "#FF8042" },
  ]

  const pieData = [
    { name: "Dominancia", value: discResult.d_score },
    { name: "Influencia", value: discResult.i_score },
    { name: "Estabilidad", value: discResult.s_score },
    { name: "Cumplimiento", value: discResult.c_score },
  ]

  const getStyleDescription = (type: string) => {
    switch (type) {
      case "Dominance":
        return {
          title: "Dominancia (D)",
          description: "Orientado a resultados, directo, decidido y competitivo",
          strengths: ["Liderazgo natural", "Toma de decisiones rápida", "Orientación a resultados", "Confianza"],
          challenges: ["Puede ser impaciente", "Necesita trabajar en diplomacia", "Tendencia a ser directo"],
          workStyle: "Prefiere autonomía, desafíos y responsabilidades de liderazgo",
        }
      case "Influence":
        return {
          title: "Influencia (I)",
          description: "Sociable, optimista, persuasivo y entusiasta",
          strengths: ["Excelente comunicador", "Motivador natural", "Optimista", "Trabajo en equipo"],
          challenges: ["Puede ser desorganizado", "Necesita estructura", "Tendencia a ser impulsivo"],
          workStyle: "Prefiere interacción social, variedad y reconocimiento público",
        }
      case "Steadiness":
        return {
          title: "Estabilidad (S)",
          description: "Paciente, leal, confiable y colaborativo",
          strengths: ["Muy confiable", "Excelente escucha", "Paciente", "Leal al equipo"],
          challenges: ["Resistencia al cambio", "Dificultad para decir no", "Evita conflictos"],
          workStyle: "Prefiere estabilidad, trabajo en equipo y ambiente armonioso",
        }
      case "Compliance":
        return {
          title: "Cumplimiento (C)",
          description: "Analítico, preciso, sistemático y orientado a la calidad",
          strengths: ["Atención al detalle", "Pensamiento analítico", "Alta calidad", "Sistemático"],
          challenges: ["Puede ser perfeccionista", "Lento en decisiones", "Crítico consigo mismo"],
          workStyle: "Prefiere precisión, datos claros y tiempo para analizar",
        }
      default:
        return {
          title: "Estilo Mixto",
          description: "Combinación equilibrada de diferentes estilos",
          strengths: ["Versatilidad", "Adaptabilidad", "Balance"],
          challenges: ["Puede necesitar más claridad en su enfoque"],
          workStyle: "Adaptable a diferentes situaciones y equipos",
        }
    }
  }

  const styleInfo = getStyleDescription(discResult.primary_type)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "outline"
    }
  }

  const getSourceBadge = (source: string) => {
    switch (source) {
      case "openai":
        return { label: "GPT-4", color: "bg-purple-100 text-purple-800" }
      case "cerebro":
        return { label: "Cerebro", color: "bg-blue-100 text-blue-800" }
      case "hybrid":
        return { label: "Híbrido", color: "bg-green-100 text-green-800" }
      default:
        return { label: "IA", color: "bg-gray-100 text-gray-800" }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-6xl">
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

        <Tabs defaultValue="resumen-ejecutivo" className="space-y-6" onValueChange={(value) => setActiveTab(value)}>
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-9 gap-2">
            <TabsTrigger value="resumen-ejecutivo">Resumen Ejecutivo</TabsTrigger>
            <TabsTrigger value="plan-90-dias">Plan 90 Días</TabsTrigger>
            <TabsTrigger value="oportunidades">Oportunidades</TabsTrigger>
            <TabsTrigger value="conexiones">Conexiones</TabsTrigger>
            <TabsTrigger value="reflexion">Reflexión</TabsTrigger>
            <TabsTrigger value="biblioteca-dtc">Biblioteca DTC</TabsTrigger>
            <TabsTrigger value="metas">Mis Metas</TabsTrigger>
            <TabsTrigger value="coach">Coach IA</TabsTrigger>
            <TabsTrigger value="siguientes-pasos">Siguientes Pasos</TabsTrigger>
          </TabsList>

          <TabsContent value="resumen-ejecutivo" className="space-y-6">
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                  Resumen Ejecutivo DTC - Tu Perfil Creativo
                </CardTitle>
                <CardDescription>Tu mapa profesional completo en 2 páginas</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* 1. Foto rápida del perfil */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
                  <h3 className="text-xl font-bold mb-2">Perfil: Creativo Estratégico</h3>
                  <p className="text-lg italic text-gray-700 mb-4">
                    "Cuestiona con criterio y transforma ideas en soluciones concretas"
                  </p>
                  <div className="grid md:grid-cols-2 gap-4 mt-4">
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">✓ 4 Fortalezas Clave</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Alta capacidad analítica y sistemática (C: {discResult.c_score}%)</li>
                        <li>• Firmeza en decisiones y orientación a resultados (D: {discResult.d_score}%)</li>
                        <li>• Pensamiento crítico y cuestionamiento constructivo</li>
                        <li>• Transformación de ideas complejas en planes accionables</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-orange-700 mb-2">⚠ 4 Riesgos Ciegos</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Intensidad percibida como agresividad por otros</li>
                        <li>• Perfeccionismo que puede paralizar la acción</li>
                        <li>• Baja empatía emocional en situaciones de equipo</li>
                        <li>• Impaciencia con procesos menos estructurados</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* 2. Mapa DISC simplificado */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">Mapa DISC Adaptado a DTC</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div className="p-4 bg-red-50 rounded-lg text-center">
                      <div className="text-3xl font-bold text-red-600">{discResult.d_score}%</div>
                      <div className="font-semibold mt-1">Dominancia</div>
                      <div className="text-xs text-gray-600 mt-1">Directo, decisivo, orientado a resultados</div>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg text-center">
                      <div className="text-3xl font-bold text-yellow-600">{discResult.i_score}%</div>
                      <div className="font-semibold mt-1">Influencia</div>
                      <div className="text-xs text-gray-600 mt-1">Comunicativo, entusiasta, persuasivo</div>
                    </div>
                    <div className="p-4 bg-green-50 rounded-lg text-center">
                      <div className="text-3xl font-bold text-green-600">{discResult.s_score}%</div>
                      <div className="font-semibold mt-1">Estabilidad</div>
                      <div className="text-xs text-gray-600 mt-1">Paciente, leal, colaborativo</div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg text-center">
                      <div className="text-3xl font-bold text-blue-600">{discResult.c_score}%</div>
                      <div className="font-semibold mt-1">Cumplimiento</div>
                      <div className="text-xs text-gray-600 mt-1">Analítico, preciso, sistemático</div>
                    </div>
                  </div>
                </div>

                {/* 3. Top 5 ideas clave para tu carrera */}
                <div className="bg-white p-6 rounded-lg border-2 border-purple-200">
                  <h3 className="text-lg font-semibold mb-4">Top 5 Ideas Clave para Tu Carrera</h3>
                  <ol className="space-y-3">
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                        1
                      </span>
                      <div>
                        <strong>Cómo tomas decisiones:</strong> Combinas datos duros (C alta) con firmeza ejecutiva (D
                        alta). Analizas a fondo, pero decides rápido una vez tienes la info.
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                        2
                      </span>
                      <div>
                        <strong>Cómo te ven los demás:</strong> Jefe: "Exigente pero confiable". Pares: "Brillante pero
                        a veces difícil". Clientes: "Técnicamente impecable".
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                        3
                      </span>
                      <div>
                        <strong>Dónde generas más valor:</strong> Proyectos complejos que requieren análisis profundo +
                        ejecución rápida. Resolución de problemas técnicos críticos.
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                        4
                      </span>
                      <div>
                        <strong>Tu riesgo #1:</strong> Alienar al equipo por intensidad + perfeccionismo. Resultado:
                        proyectos perfectos pero equipos desmotivados.
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">
                        5
                      </span>
                      <div>
                        <strong>Upside máximo:</strong> Roles técnico-estratégicos (CTO, Arquitecto Senior, Director de
                        Innovación). Donde expertise + vision estratégica son críticas.
                      </div>
                    </li>
                  </ol>
                </div>

                {/* 4. Plan DTC en una página */}
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Tu Plan DTC en Una Página</h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2">3 Metas de Desarrollo</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex gap-2">
                          <span className="text-blue-600">→</span>Modular intensidad sin perder firmeza
                        </li>
                        <li className="flex gap-2">
                          <span className="text-blue-600">→</span>Flexibilizar perfeccionismo (80% vs 100%)
                        </li>
                        <li className="flex gap-2">
                          <span className="text-blue-600">→</span>Aumentar conexión emocional con equipo
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800 mb-2">3 Hábitos 30 Días</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex gap-2">
                          <span className="text-green-600">✓</span>Pausa 5 seg antes de responder en tensión
                        </li>
                        <li className="flex gap-2">
                          <span className="text-green-600">✓</span>Definir "siguiente paso mínimo" en 5 min
                        </li>
                        <li className="flex gap-2">
                          <span className="text-green-600">✓</span>Check-in emocional 1-2 min al inicio reuniones
                        </li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-800 mb-2">3 Recursos DTC</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex gap-2">
                          <span className="text-purple-600">📖</span>Test: Inteligencia Emocional
                        </li>
                        <li className="flex gap-2">
                          <span className="text-purple-600">📖</span>Libros: Comunicación Asertiva
                        </li>
                        <li className="flex gap-2">
                          <span className="text-purple-600">📖</span>Plantilla: Prep Conversaciones Difíciles
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plan-90-dias" className="space-y-6">
            <Card className="border-l-4 border-l-orange-500">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Target className="h-6 w-6 text-orange-600" />
                  Tu Plan de Acción DTC de 90 Días
                </CardTitle>
                <CardDescription>
                  Hoja de ruta personalizada para tu perfil {discResult.primary_type} con seguimiento de progreso
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Progress Overview */}
                <div className="bg-gradient-to-r from-orange-50 to-amber-50 p-6 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">Tu Progreso General</h3>
                      <p className="text-sm text-gray-600">0 de 27 acciones completadas</p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-orange-600">0%</div>
                      <p className="text-xs text-gray-600">completado</p>
                    </div>
                  </div>
                  <Progress value={0} className="h-3" />
                </div>

                {/* Mes 1: Fundamentos */}
                <Card className="border-l-4 border-l-orange-400">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">Mes 1: Fundamentos Estratégicos (Días 1-30)</CardTitle>
                      <Badge variant="outline">0/9 completadas</Badge>
                    </div>
                    <CardDescription>
                      Establece bases sólidas para tu desarrollo basado en tu perfil {discResult.primary_type}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Meta Principal del Mes */}
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-orange-900 mb-2 flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Meta Principal del Mes
                      </h4>
                      <p className="text-sm text-orange-800">
                        {discResult.d_score > 70
                          ? "Desarrollar paciencia estratégica y habilidades de escucha activa sin sacrificar tu decisión."
                          : discResult.i_score > 70
                            ? "Canalizar tu energía social hacia conversaciones profundas y seguimiento consistente."
                            : discResult.s_score > 70
                              ? "Practicar asertividad gradual en situaciones de bajo riesgo antes de escalar."
                              : "Balancear tu precisión analítica con flexibilidad y comunicación empática."}
                      </p>
                    </div>

                    {/* KPIs Medibles */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-semibold text-orange-800">KPI 1: Frecuencia</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-orange-600">0/20</div>
                          <p className="text-xs text-gray-600">
                            {discResult.d_score > 70
                              ? "Momentos de pausa antes de responder"
                              : discResult.i_score > 70
                                ? "Conversaciones profundas (15+ min)"
                                : discResult.s_score > 70
                                  ? "Ocasiones expresando tu opinión"
                                  : "Momentos de decisión rápida"}
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-semibold text-orange-800">KPI 2: Calidad</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-orange-600">0/10</div>
                          <p className="text-xs text-gray-600">
                            {discResult.d_score > 70
                              ? "Feedback positivo sobre tu comunicación"
                              : discResult.i_score > 70
                                ? "Follow-ups completados exitosamente"
                                : discResult.s_score > 70
                                  ? "Situaciones manejadas asertivamente"
                                  : "Decisiones tomadas sin sobre-análisis"}
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-semibold text-orange-800">KPI 3: Impacto</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-orange-600">N/A</div>
                          <p className="text-xs text-gray-600">
                            Autoevaluación de confianza (escala 1-10) al final del mes
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Acciones Semanales con Checkboxes */}
                    <Accordion type="multiple" className="space-y-2">
                      <AccordionItem value="semana-1">
                        <AccordionTrigger className="bg-orange-50 px-4 rounded-lg hover:bg-orange-100">
                          <div className="flex items-center gap-3">
                            <Badge variant="secondary">Semana 1</Badge>
                            <span>Diagnóstico y Planificación (0/3)</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4 space-y-3">
                          <div className="flex items-start gap-3 p-3 bg-white rounded border">
                            <Checkbox id="m1s1a1" />
                            <label htmlFor="m1s1a1" className="text-sm cursor-pointer flex-1">
                              <strong>Día 1-2:</strong> Completa todos los tests DTC restantes (IE, MBTI, Big Five,
                              RIASEC, Soft Skills) para tener tu perfil 360°.
                            </label>
                          </div>
                          <div className="flex items-start gap-3 p-3 bg-white rounded border">
                            <Checkbox id="m1s1a2" />
                            <label htmlFor="m1s1a2" className="text-sm cursor-pointer flex-1">
                              <strong>Día 3-4:</strong> Lee los 3 informes completos más relevantes para ti (ej: DISC +
                              IE + RIASEC) e identifica 3 patrones recurrentes.
                            </label>
                          </div>
                          <div className="flex items-start gap-3 p-3 bg-white rounded border">
                            <Checkbox id="m1s1a3" />
                            <label htmlFor="m1s1a3" className="text-sm cursor-pointer flex-1">
                              <strong>Día 5-7:</strong> Conversa con Sofia o Dani en el Coach IA sobre tus patrones y
                              crea 1 meta SMART en "Mis Metas" para este mes.
                            </label>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="semana-2">
                        <AccordionTrigger className="bg-orange-50 px-4 rounded-lg hover:bg-orange-100">
                          <div className="flex items-center gap-3">
                            <Badge variant="secondary">Semana 2</Badge>
                            <span>Experimentación Inicial (0/3)</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4 space-y-3">
                          <div className="flex items-start gap-3 p-3 bg-white rounded border">
                            <Checkbox id="m1s2a1" />
                            <label htmlFor="m1s2a1" className="text-sm cursor-pointer flex-1">
                              <strong>Hábito Diario:</strong>{" "}
                              {discResult.d_score > 70
                                ? "Antes de responder en reuniones, cuenta mentalmente hasta 3. Anota cómo cambia la calidad de tu respuesta."
                                : discResult.i_score > 70
                                  ? "Al terminar conversaciones sociales, pregúntate: '¿Aprendí algo profundo de esta persona?' Si no, ajusta."
                                  : discResult.s_score > 70
                                    ? "Cada día, comparte 1 opinión en situaciones de bajo riesgo (ej: qué cenar, qué película ver)."
                                    : "Establece un límite de tiempo para decisiones pequeñas (ej: máximo 10 min para emails no críticos)."}
                            </label>
                          </div>
                          <div className="flex items-start gap-3 p-3 bg-white rounded border">
                            <Checkbox id="m1s2a2" />
                            <label htmlFor="m1s2a2" className="text-sm cursor-pointer flex-1">
                              <strong>Observación:</strong> Lleva un diario de 5 minutos/día documentando situaciones
                              donde aplicaste (o no) tu área de desarrollo.
                            </label>
                          </div>
                          <div className="flex items-start gap-3 p-3 bg-white rounded border">
                            <Checkbox id="m1s2a3" />
                            <label htmlFor="m1s2a3" className="text-sm cursor-pointer flex-1">
                              <strong>Recursos:</strong> Lee 2 artículos de la Biblioteca DTC relacionados con tu perfil
                              DISC. Toma notas de 1 insight aplicable.
                            </label>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="semana-3">
                        <AccordionTrigger className="bg-orange-50 px-4 rounded-lg hover:bg-orange-100">
                          <div className="flex items-center gap-3">
                            <Badge variant="secondary">Semana 3</Badge>
                            <span>Refinamiento y Feedback (0/3)</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4 space-y-3">
                          <div className="flex items-start gap-3 p-3 bg-white rounded border">
                            <Checkbox id="m1s3a1" />
                            <label htmlFor="m1s3a1" className="text-sm cursor-pointer flex-1">
                              <strong>Círculo de Retroalimentación:</strong> Pide a 2 personas cercanas (trabajo +
                              personal) que te den feedback específico sobre tu área de desarrollo este mes.
                            </label>
                          </div>
                          <div className="flex items-start gap-3 p-3 bg-white rounded border">
                            <Checkbox id="m1s3a2" />
                            <label htmlFor="m1s3a2" className="text-sm cursor-pointer flex-1">
                              <strong>Ajuste de Estrategia:</strong> Revisa tu diario de la Semana 2. ¿Qué funcionó?
                              ¿Qué no? Ajusta tu hábito diario según lo aprendido.
                            </label>
                          </div>
                          <div className="flex items-start gap-3 p-3 bg-white rounded border">
                            <Checkbox id="m1s3a3" />
                            <label htmlFor="m1s3a3" className="text-sm cursor-pointer flex-1">
                              <strong>Sesión de Coaching:</strong> Habla con Sofia o Dani sobre el feedback recibido y
                              cómo interpretarlo constructivamente.
                            </label>
                          </div>
                        </AccordionContent>
                      </AccordionItem>

                      <AccordionItem value="semana-4">
                        <AccordionTrigger className="bg-orange-50 px-4 rounded-lg hover:bg-orange-100">
                          <div className="flex items-center gap-3">
                            <Badge variant="secondary">Semana 4</Badge>
                            <span>Consolidación y Evaluación (0/3)</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pt-4 space-y-3">
                          <div className="flex items-start gap-3 p-3 bg-white rounded border">
                            <Checkbox id="m1s4a1" />
                            <label htmlFor="m1s4a1" className="text-sm cursor-pointer flex-1">
                              <strong>Prueba de Estrés:</strong> Aplica conscientemente tu hábito en una situación de
                              mayor presión (ej: reunión importante, conflicto). Documenta el resultado.
                            </label>
                          </div>
                          <div className="flex items-start gap-3 p-3 bg-white rounded border">
                            <Checkbox id="m1s4a2" />
                            <label htmlFor="m1s4a2" className="text-sm cursor-pointer flex-1">
                              <strong>Autoevaluación Final:</strong> Califica tu progreso en los 3 KPIs del mes y tu
                              nivel de confianza (1-10) comparado con el inicio.
                            </label>
                          </div>
                          <div className="flex items-start gap-3 p-3 bg-white rounded border">
                            <Checkbox id="m1s4a3" />
                            <label htmlFor="m1s4a3" className="text-sm cursor-pointer flex-1">
                              <strong>Preparación Mes 2:</strong> Identifica 1 área complementaria para desarrollar el
                              próximo mes (revisa "Oportunidades de Desarrollo").
                            </label>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>

                    {/* Recursos DTC Mes 1 */}
                    <Card className="bg-gradient-to-r from-orange-50 to-amber-50">
                      <CardHeader>
                        <CardTitle className="text-base flex items-center gap-2">
                          <BookOpen className="h-5 w-5 text-orange-600" />
                          Recursos DTC Recomendados para Mes 1
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2 text-sm">
                          <li className="flex items-start gap-2">
                            <span className="text-orange-600">→</span>
                            <span>
                              <strong>Artículos:</strong> "Comunicación Asertiva para perfiles {discResult.primary_type}
                              ", "El Poder de la Pausa Estratégica"
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-orange-600">→</span>
                            <span>
                              <strong>Videos:</strong> "Técnicas de Escucha Activa" (8 min), "Gestión de Conflictos
                              Constructivos" (12 min)
                            </span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-orange-600">→</span>
                            <span>
                              <strong>Ejercicios:</strong> Plantilla de Diario de Autoobservación, Framework STAR para
                              respuestas reflexivas
                            </span>
                          </li>
                        </ul>
                        <Button variant="outline" size="sm" className="w-full mt-4 bg-transparent">
                          Ver Recursos en Biblioteca DTC
                        </Button>
                      </CardContent>
                    </Card>
                  </CardContent>
                </Card>

                {/* Mes 2: Optimización */}
                <Card className="border-l-4 border-l-blue-400">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">Mes 2: Optimización y Colaboración (Días 31-60)</CardTitle>
                      <Badge variant="outline">0/9 completadas</Badge>
                    </div>
                    <CardDescription>
                      Expande tu desarrollo hacia la colaboración efectiva y la influencia positiva
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Meta Principal del Mes */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Meta Principal del Mes
                      </h4>
                      <p className="text-sm text-blue-800">
                        {discResult.d_score > 70
                          ? "Liderar un proyecto o iniciativa usando tu influencia sin imposición, co-creando con el equipo."
                          : discResult.i_score > 70
                            ? "Convertir conexiones superficiales en relaciones profesionales de largo plazo con follow-up consistente."
                            : discResult.s_score > 70
                              ? "Iniciar una conversación difícil que has pospuesto, usando técnicas de comunicación no violenta."
                              : "Presentar un análisis complejo de forma simple y persuasiva ante una audiencia no técnica."}
                      </p>
                    </div>

                    {/* KPIs Mes 2 */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-semibold text-blue-800">KPI 1: Colaboración</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-blue-600">0/15</div>
                          <p className="text-xs text-gray-600">
                            {discResult.d_score > 70
                              ? "Decisiones co-creadas con equipo"
                              : discResult.i_score > 70
                                ? "Follow-ups profundos realizados"
                                : discResult.s_score > 70
                                  ? "Conversaciones difíciles iniciadas"
                                  : "Presentaciones simplificadas exitosas"}
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-semibold text-blue-800">KPI 2: Impacto</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-blue-600">0/8</div>
                          <p className="text-xs text-gray-600">
                            Feedback positivo de colegas sobre tu estilo colaborativo o comunicativo
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-semibold text-blue-800">KPI 3: Resultados</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-blue-600">N/A</div>
                          <p className="text-xs text-gray-600">
                            1 proyecto o iniciativa completada usando tu nuevo estilo
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Placeholder for weekly actions */}
                    <div className="bg-blue-50 p-4 rounded-lg text-center">
                      <p className="text-sm text-blue-800">
                        Las acciones semanales detalladas para el Mes 2 se desbloquearán cuando completes el 80% del Mes
                        1
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Mes 3: Crecimiento Sostenido */}
                <Card className="border-l-4 border-l-green-400">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">Mes 3: Crecimiento Sostenido (Días 61-90)</CardTitle>
                      <Badge variant="outline">0/9 completadas</Badge>
                    </div>
                    <CardDescription>
                      Consolida tu transformación y establece sistemas para crecimiento continuo
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Meta Principal del Mes */}
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2 flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Meta Principal del Mes
                      </h4>
                      <p className="text-sm text-green-800">
                        Diseñar tu sistema personal de desarrollo continuo: cómo seguirás creciendo más allá de los 90
                        días, integrando lo aprendido en tu rutina diaria.
                      </p>
                    </div>

                    {/* KPIs Mes 3 */}
                    <div className="grid md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-semibold text-green-800">KPI 1: Consistencia</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-green-600">0/21</div>
                          <p className="text-xs text-gray-600">
                            Días aplicando conscientemente tu hábito desarrollado sin esfuerzo
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-semibold text-green-800">KPI 2: Mentoría</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-green-600">0/3</div>
                          <p className="text-xs text-gray-600">
                            Conversaciones donde enseñaste a otros lo que aprendiste
                          </p>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader className="pb-3">
                          <CardTitle className="text-sm font-semibold text-green-800">KPI 3: Legado</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold text-green-600">N/A</div>
                          <p className="text-xs text-gray-600">
                            Sistema personal documentado para crecimiento continuo
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Placeholder for weekly actions */}
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <p className="text-sm text-green-800">
                        Las acciones semanales detalladas para el Mes 3 se desbloquearán cuando completes el 80% del Mes
                        2
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Call to Action */}
                <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">Empieza Ahora</h3>
                  <p className="text-sm opacity-90 mb-4">
                    El mejor momento para empezar es HOY. Marca tu primera acción de la Semana 1 y observa cómo pequeños
                    cambios consistentes generan transformaciones profundas.
                  </p>
                  <div className="flex gap-3">
                    <Button variant="secondary" size="sm">
                      Crear Meta SMART para Mes 1
                    </Button>
                    <Button variant="secondary" size="sm" onClick={() => setActiveTab("coach")}>
                      Hablar con Coach sobre el Plan
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="oportunidades" className="space-y-6">
            <Card className="border-l-4 border-l-amber-500">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-amber-600" />
                  Oportunidades de Desarrollo
                </CardTitle>
                <CardDescription>
                  Áreas específicas donde puedes crecer basadas en tu perfil {discResult.primary_type}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">🎯 Por qué estas oportunidades son relevantes para ti</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Tu perfil {discResult.primary_type} con D:{discResult.d_score}%, I:{discResult.i_score}%, S:
                    {discResult.s_score}%, C:{discResult.c_score}% revela patrones únicos de fortalezas y áreas de
                    crecimiento. Estas oportunidades están diseñadas para expandir tu desarrollo más allá de lo laboral,
                    abarcando dimensiones personales, relacionales y de propósito de vida.
                  </p>
                </div>

                {/* Área 1: Desarrollo Personal */}
                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-blue-600" />
                      1. Desarrollo Personal e Identidad
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">Oportunidad Principal</h4>
                      <p className="text-sm text-blue-800">
                        {discResult.c_score > 70
                          ? "Integrar tu alta capacidad analítica con mayor flexibilidad emocional y espontaneidad en la vida diaria."
                          : discResult.d_score > 70
                            ? "Balancear tu orientación a resultados con momentos de introspección y autoconocimiento profundo."
                            : discResult.i_score > 70
                              ? "Canalizar tu energía social hacia la construcción de conexiones más profundas y significativas."
                              : "Desarrollar mayor confianza en ti mismo para tomar riesgos calculados en tu vida personal."}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Acciones Concretas:</h4>
                      <ul className="space-y-2">
                        <li className="flex gap-3">
                          <span className="text-blue-600 font-bold">→</span>
                          <div>
                            <strong>Diario de Autoconocimiento (5 min/día):</strong> Escribe 3 emociones que sentiste
                            hoy y qué las provocó.
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-blue-600 font-bold">→</span>
                          <div>
                            <strong>Ejercicio de Valores:</strong> Lista tus 5 valores fundamentales y evalúa cuánto tu
                            vida actual los refleja (escala 1-10).
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-blue-600 font-bold">→</span>
                          <div>
                            <strong>Exploración de Pasiones:</strong> Dedica 2 horas/semana a una actividad que te
                            apasione pero que no esté relacionada con el trabajo.
                          </div>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold mb-1">Recurso Recomendado DTC</p>
                          <p className="text-sm opacity-90">Test de Inteligencia Emocional Despega</p>
                        </div>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => router.push("/test/emotional-intelligence")}
                        >
                          Hacer Test
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Área 2: Relaciones y Comunicación */}
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-green-600" />
                      2. Relaciones y Comunicación
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-green-900 mb-2">Oportunidad Principal</h4>
                      <p className="text-sm text-green-800">
                        {discResult.i_score < 50
                          ? "Desarrollar habilidades para conectar emocionalmente en tus relaciones personales y profesionales."
                          : discResult.s_score < 50
                            ? "Cultivar la paciencia y la escucha activa para fortalecer relaciones a largo plazo."
                            : "Expandir tu círculo de influencia con conexiones más diversas y enriquecedoras."}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Acciones Concretas:</h4>
                      <ul className="space-y-2">
                        <li className="flex gap-3">
                          <span className="text-green-600 font-bold">→</span>
                          <div>
                            <strong>Conversaciones Profundas Semanales:</strong> Programa 1 conversación de 30 min con
                            alguien importante donde practiques escucha sin interrumpir.
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-green-600 font-bold">→</span>
                          <div>
                            <strong>Círculo de Retroalimentación:</strong> Pide a 3 personas cercanas que te den
                            feedback honesto sobre cómo te comunicas.
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-green-600 font-bold">→</span>
                          <div>
                            <strong>Reto de Empatía:</strong> Durante una semana, antes de responder en cualquier
                            conversación, pregúntate: "¿Qué está sintiendo esta persona?"
                          </div>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Área 3: Hábitos y Bienestar */}
                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Target className="h-5 w-5 text-purple-600" />
                      3. Hábitos y Bienestar Integral
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple-900 mb-2">Oportunidad Principal</h4>
                      <p className="text-sm text-purple-800">
                        {discResult.d_score > 70
                          ? "Integrar prácticas de descanso y recuperación para evitar el agotamiento por alta exigencia."
                          : discResult.c_score > 70
                            ? "Desarrollar flexibilidad en tus rutinas para permitir espontaneidad y disfrute."
                            : "Establecer hábitos consistentes que soporten tu bienestar físico, mental y emocional."}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Acciones Concretas:</h4>
                      <ul className="space-y-2">
                        <li className="flex gap-3">
                          <span className="text-purple-600 font-bold">→</span>
                          <div>
                            <strong>Ritual Matutino (15 min):</strong> Meditación, movimiento o lectura antes de revisar
                            el celular.
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-purple-600 font-bold">→</span>
                          <div>
                            <strong>Desconexión Digital:</strong> 1 hora antes de dormir sin pantallas, dedicada a
                            reflexión o conversación.
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-purple-600 font-bold">→</span>
                          <div>
                            <strong>Actividad Física Regular:</strong> 3 sesiones/semana de ejercicio que disfrutes (no
                            que "debas" hacer).
                          </div>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                {/* Área 4: Propósito y Contribución */}
                <Card className="border-l-4 border-l-orange-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Brain className="h-5 w-5 text-orange-600" />
                      4. Propósito y Contribución
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-orange-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-orange-900 mb-2">Oportunidad Principal</h4>
                      <p className="text-sm text-orange-800">
                        Clarificar tu propósito de vida más allá del éxito profesional y encontrar formas de contribuir
                        a algo más grande que tú mismo.
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Acciones Concretas:</h4>
                      <ul className="space-y-2">
                        <li className="flex gap-3">
                          <span className="text-orange-600 font-bold">→</span>
                          <div>
                            <strong>Declaración de Propósito:</strong> Escribe en una frase: "Existo para..." y revísala
                            mensualmente.
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-orange-600 font-bold">→</span>
                          <div>
                            <strong>Voluntariado o Mentoría:</strong> Dedica 2 horas/mes a ayudar a alguien sin esperar
                            nada a cambio.
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-orange-600 font-bold">→</span>
                          <div>
                            <strong>Legado Intencional:</strong> Pregúntate: "¿Qué quiero que la gente recuerde de mí en
                            20 años?"
                          </div>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">🚀 Próximo Paso</h3>
                  <p className="text-sm opacity-90 mb-4">
                    Elige UNA oportunidad de desarrollo que resuene contigo y conviértela en una meta SMART en la
                    sección "Mis Metas".
                  </p>
                  <Button variant="secondary" size="sm" onClick={() => setActiveTab("metas")}>
                    Ir a Mis Metas
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conexiones" className="space-y-6">
            <Card className="border-l-4 border-l-indigo-500">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Brain className="h-6 w-6 text-indigo-600" />
                  Conexión con Otros Módulos DTC
                </CardTitle>
                <CardDescription>
                  Cómo Despega Cerebral se relaciona con los demás tests del ecosistema DTC
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">🔗 El Ecosistema Completo de Autoconocimiento</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Despega Cerebral (DISC) es tu punto de partida, pero es solo una pieza del rompecabezas completo.
                    Cada test revela una dimensión diferente de quién eres, y juntos crean un mapa integral de tu
                    desarrollo personal y profesional.
                  </p>
                </div>

                {/* Connection Map */}
                <Card className="bg-gradient-to-br from-blue-50 to-purple-50">
                  <CardContent className="pt-6">
                    <div className="text-center mb-6">
                      <div className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full font-bold text-lg">
                        Despega Cerebral (DISC)
                      </div>
                      <p className="text-sm text-gray-600 mt-2">Tu comportamiento en el trabajo</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Inteligencia Emocional */}
                      <Card className="border-2 border-red-300">
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center text-lg">
                              ❤️
                            </div>
                            Inteligencia Emocional Despega
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="bg-red-50 p-3 rounded text-sm">
                            <strong className="text-red-900">Conexión:</strong>
                            <p className="text-red-800 mt-1">
                              DISC te dice <em>cómo actúas</em>, IE te dice <em>por qué sientes</em> lo que sientes al
                              actuar así.
                            </p>
                          </div>
                          <div className="text-sm">
                            <strong>Ejemplo:</strong> Si DISC muestra alto D (dominancia), IE revelará cómo manejas la
                            frustración cuando las cosas no salen como esperas.
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full bg-transparent"
                            onClick={() => router.push("/test/emotional-intelligence")}
                          >
                            Hacer Test IE
                          </Button>
                        </CardContent>
                      </Card>

                      {/* MBTI */}
                      <Card className="border-2 border-blue-300">
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-lg">
                              🧠
                            </div>
                            Mapa de Personalidad Despega
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="bg-blue-50 p-3 rounded text-sm">
                            <strong className="text-blue-900">Conexión:</strong>
                            <p className="text-blue-800 mt-1">
                              DISC mide comportamiento, MBTI mide <em>preferencias cognitivas</em> naturales.
                            </p>
                          </div>
                          <div className="text-sm">
                            <strong>Ejemplo:</strong> Tu DISC puede mostrar bajo I (influencia), pero si eres ENFP en
                            MBTI, significa que prefieres conexiones profundas sobre networking superficial.
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full bg-transparent"
                            onClick={() => router.push("/test/mbti")}
                          >
                            Hacer Test MBTI
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Big Five */}
                      <Card className="border-2 border-purple-300">
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-lg">
                              ⭐
                            </div>
                            5 Dimensiones Despega
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="bg-purple-50 p-3 rounded text-sm">
                            <strong className="text-purple-900">Conexión:</strong>
                            <p className="text-purple-800 mt-1">
                              Big Five profundiza rasgos de personalidad que DISC solo sugiere.
                            </p>
                          </div>
                          <div className="text-sm">
                            <strong>Ejemplo:</strong> Alto C en DISC + alta Conscientiousness en Big Five =
                            Perfeccionista analítico. Alto C + baja Conscientiousness = Analítico flexible.
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full bg-transparent"
                            onClick={() => router.push("/test/big-five")}
                          >
                            Hacer Test Big Five
                          </Button>
                        </CardContent>
                      </Card>

                      {/* RIASEC */}
                      <Card className="border-2 border-green-300">
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-lg">
                              💼
                            </div>
                            Brújula Vocacional Despega
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="bg-green-50 p-3 rounded text-sm">
                            <strong className="text-green-900">Conexión:</strong>
                            <p className="text-green-800 mt-1">
                              DISC te dice <em>cómo trabajas</em>, RIASEC te dice <em>qué tipo de trabajo</em> te
                              motiva.
                            </p>
                          </div>
                          <div className="text-sm">
                            <strong>Ejemplo:</strong> Alto D+C en DISC + tipo Investigador en RIASEC = Científico de
                            datos, investigador senior, arquitecto de soluciones.
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full bg-transparent"
                            onClick={() => router.push("/test/riasec")}
                          >
                            Hacer Test RIASEC
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Soft Skills */}
                      <Card className="border-2 border-yellow-300">
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-lg">
                              💡
                            </div>
                            Competencias Blandas Despega
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <div className="bg-yellow-50 p-3 rounded text-sm">
                            <strong className="text-yellow-900">Conexión:</strong>
                            <p className="text-yellow-800 mt-1">
                              DISC muestra tendencias, Soft Skills mide <em>competencias entrenables</em>.
                            </p>
                          </div>
                          <div className="text-sm">
                            <strong>Ejemplo:</strong> Bajo I en DISC no significa mala comunicación. Soft Skills te dirá
                            si has desarrollado la habilidad a pesar de tu preferencia natural.
                          </div>
                          <Button
                            size="sm"
                            variant="outline"
                            className="w-full bg-transparent"
                            onClick={() => router.push("/test/soft-skills")}
                          >
                            Hacer Test Soft Skills
                          </Button>
                        </CardContent>
                      </Card>

                      {/* Placeholder for 6th test if needed */}
                      <Card className="border-2 border-gray-300 opacity-60">
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-lg">
                              🔮
                            </div>
                            Más Tests Próximamente
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm text-gray-600">
                            El ecosistema DTC está en constante expansión. Próximamente: Test de Valores, Estilos de
                            Aprendizaje, y más.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </CardContent>
                </Card>

                {/* Synergy Examples */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-600" />
                      Ejemplos de Sinergia Entre Tests
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Caso 1: El Líder Analítico</h4>
                      <ul className="space-y-1 text-sm">
                        <li>
                          • <strong>DISC:</strong> Alto D + Alto C = Decisivo pero perfeccionista
                        </li>
                        <li>
                          • <strong>IE:</strong> Baja empatía emocional = Riesgo de alienar equipo
                        </li>
                        <li>
                          • <strong>MBTI:</strong> INTJ = Visionario estratégico pero poco social
                        </li>
                        <li>
                          • <strong>Acción DTC:</strong> Desarrollar IE para liderar con firmeza Y empatía
                        </li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Caso 2: El Comunicador Disperso</h4>
                      <ul className="space-y-1 text-sm">
                        <li>
                          • <strong>DISC:</strong> Alto I + Bajo C = Entusiasta pero poco detallista
                        </li>
                        <li>
                          • <strong>Big Five:</strong> Baja Conscientiousness = Dificultad para terminar proyectos
                        </li>
                        <li>
                          • <strong>Soft Skills:</strong> Alta comunicación, baja gestión del tiempo
                        </li>
                        <li>
                          • <strong>Acción DTC:</strong> Entrenar hábitos de follow-through sin perder creatividad
                        </li>
                      </ul>
                    </div>

                    <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
                      <h4 className="font-semibold mb-2">Caso 3: El Colaborador Invisible</h4>
                      <ul className="space-y-1 text-sm">
                        <li>
                          • <strong>DISC:</strong> Alto S + Bajo D = Leal pero poco asertivo
                        </li>
                        <li>
                          • <strong>RIASEC:</strong> Alto Social = Quiere ayudar pero no se atreve a liderar
                        </li>
                        <li>
                          • <strong>IE:</strong> Alta empatía, baja autoafirmación
                        </li>
                        <li>
                          • <strong>Acción DTC:</strong> Desarrollar asertividad sin perder tu esencia colaborativa
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">🎯 Recomendación DTC</h3>
                  <p className="text-sm opacity-90 mb-4">
                    Para obtener el máximo valor del ecosistema, completa al menos 3 tests: DISC (comportamiento) + IE
                    (emociones) + MBTI o RIASEC (preferencias/intereses). Esto te dará una visión 360° de tu perfil.
                  </p>
                  <Button variant="secondary" size="sm" onClick={() => router.push("/test")}>
                    Ver Todos los Tests
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reflexion" className="space-y-6">
            <Card className="border-l-4 border-l-pink-500">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Lightbulb className="h-6 w-6 text-pink-600" />
                  Preguntas de Reflexión Profunda
                </CardTitle>
                <CardDescription>Explora tu autoconocimiento más allá de los resultados del test</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-3">🤔 Por qué reflexionar es tan importante</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Los tests te dan datos, pero el verdadero autoconocimiento viene de la reflexión profunda. Estas
                    preguntas están diseñadas para ayudarte a conectar los resultados de Despega Cerebral con tu vida
                    real, tus valores y tu propósito.
                  </p>
                  <div className="bg-white p-4 rounded border-l-4 border-pink-500">
                    <p className="text-sm italic text-gray-700">
                      💡 <strong>Tip:</strong> Escribe tus respuestas en un diario. Revisarlas en 3-6 meses te mostrará
                      tu evolución personal.
                    </p>
                  </div>
                </div>

                {/* Categoría 1: Identidad y Valores */}
                <Accordion type="single" collapsible className="space-y-4">
                  <AccordionItem value="identidad">
                    <AccordionTrigger className="bg-blue-50 px-4 rounded-lg hover:bg-blue-100">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🎭</span>
                        <span className="font-semibold">Identidad y Valores</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 space-y-4">
                      <Card>
                        <CardContent className="pt-6 space-y-3">
                          <h4 className="font-semibold text-blue-900">
                            1. ¿Este perfil DISC realmente soy "yo", o es quién he aprendido a ser por presión externa?
                          </h4>
                          <p className="text-sm text-gray-600">
                            Reflexiona sobre cuánto de tu comportamiento actual viene de tus preferences naturales vs.
                            adaptaciones a expectativas familiares, culturales o laborales.
                          </p>
                          <textarea
                            placeholder="Escribe tu reflexión aquí..."
                            className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6 space-y-3">
                          <h4 className="font-semibold text-blue-900">
                            2. ¿Cuáles de mis dimensiones DISC (D, I, S, C) están más alineadas con mis valores
                            profundos?
                          </h4>
                          <p className="text-sm text-gray-600">
                            Ejemplo: Si valoras la justicia pero tu alto D te hace pasar por encima de otros, hay un
                            desalineamiento que genera fricción interna.
                          </p>
                          <textarea
                            placeholder="Escribe tu reflexión aquí..."
                            className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6 space-y-3">
                          <h4 className="font-semibold text-blue-900">
                            3. Si pudiera cambiar UNA de mis dimensiones DISC, ¿cuál sería y por qué?
                          </h4>
                          <p className="text-sm text-gray-600">
                            Esta pregunta revela qué parte de ti no aceptas plenamente. El autoconocimiento incluye
                            aceptación, no solo cambio.
                          </p>
                          <textarea
                            placeholder="Escribe tu reflexión aquí..."
                            className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
                          />
                        </CardContent>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="relaciones">
                    <AccordionTrigger className="bg-green-50 px-4 rounded-lg hover:bg-green-100">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">💬</span>
                        <span className="font-semibold">Relaciones y Comunicación</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 space-y-4">
                      <Card>
                        <CardContent className="pt-6 space-y-3">
                          <h4 className="font-semibold text-green-900">
                            4. ¿Cómo crees que las personas más cercanas a ti describirían tu perfil DISC?
                          </h4>
                          <p className="text-sm text-gray-600">
                            ¿Coincide con tu autopercepción? Si no, ¿qué dice eso sobre tu autoconocimiento o sobre cómo
                            te perciben?
                          </p>
                          <textarea
                            placeholder="Escribe tu reflexión aquí..."
                            className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                          />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6 space-y-3">
                          <h4 className="font-semibold text-green-900">
                            5. ¿Con qué tipo de personas (según DISC) tengo más conflictos? ¿Por qué?
                          </h4>
                          <p className="text-sm text-gray-600">
                            Ejemplo: Alto D con Alto S = choque entre urgencia y paciencia. Reconocer esto ayuda a
                            adaptar tu comunicación.
                          </p>
                          <textarea
                            placeholder="Escribe tu reflexión aquí..."
                            className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                          />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6 space-y-3">
                          <h4 className="font-semibold text-green-900">
                            6. ¿En qué situaciones mi perfil DISC me ha ayudado en relaciones? ¿En cuáles me ha
                            perjudicado?
                          </h4>
                          <p className="text-sm text-gray-600">
                            Reflexiona sobre momentos concretos. El autoconocimiento es reconocer patrones, no solo
                            teoría.
                          </p>
                          <textarea
                            placeholder="Escribe tu reflexión aquí..."
                            className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-green-500"
                          />
                        </CardContent>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="proposito">
                    <AccordionTrigger className="bg-purple-50 px-4 rounded-lg hover:bg-purple-100">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🎯</span>
                        <span className="font-semibold">Propósito y Carrera</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 space-y-4">
                      <Card>
                        <CardContent className="pt-6 space-y-3">
                          <h4 className="font-semibold text-purple-900">
                            7. ¿Mi trabajo actual aprovecha mis fortalezas DISC o me obliga a actuar contra mi
                            naturaleza?
                          </h4>
                          <p className="text-sm text-gray-600">
                            Si pasas 8 horas/día actuando contra tu perfil natural, es insostenible a largo plazo. ¿Qué
                            cambios puedes hacer?
                          </p>
                          <textarea
                            placeholder="Escribe tu reflexión aquí..."
                            className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                          />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6 space-y-3">
                          <h4 className="font-semibold text-purple-900">
                            8. ¿Qué tipo de contribución quiero hacer al mundo, y cómo mi perfil DISC puede ayudarme a
                            lograrlo?
                          </h4>
                          <p className="text-sm text-gray-600">
                            Conecta tu perfil con tu propósito. Ejemplo: Alto C + propósito de precisión = científico,
                            auditor, arquitecto de calidad.
                          </p>
                          <textarea
                            placeholder="Escribe tu reflexión aquí..."
                            className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                          />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6 space-y-3">
                          <h4 className="font-semibold text-purple-900">
                            9. Si tuviera libertad financiera total, ¿qué actividades haría que sean coherentes con mi
                            perfil DISC?
                          </h4>
                          <p className="text-sm text-gray-600">
                            Esta pregunta revela tus motivaciones intrínsecas. Lo que harías sin necesidad económica es
                            probablemente tu vocación real.
                          </p>
                          <textarea
                            placeholder="Escribe tu reflexión aquí..."
                            className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                          />
                        </CardContent>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="crecimiento">
                    <AccordionTrigger className="bg-orange-50 px-4 rounded-lg hover:bg-orange-100">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">🌱</span>
                        <span className="font-semibold">Crecimiento y Desarrollo</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-4 space-y-4">
                      <Card>
                        <CardContent className="pt-6 space-y-3">
                          <h4 className="font-semibold text-orange-900">
                            10. ¿Qué dimensión DISC baja me gustaría desarrollar, y qué tendría que sacrificar para
                            lograrlo?
                          </h4>
                          <p className="text-sm text-gray-600">
                            El crecimiento requiere trade-offs. Desarrollar I (influencia) puede significar menos tiempo
                            para análisis profundo (C).
                          </p>
                          <textarea
                            placeholder="Escribe tu reflexión aquí..."
                            className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                          />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6 space-y-3">
                          <h4 className="font-semibold text-orange-900">
                            11. ¿En qué momentos de mi vida he actuado fuera de mi perfil DISC natural? ¿Qué aprendí?
                          </h4>
                          <p className="text-sm text-gray-600">
                            La flexibilidad conductual es una habilidad. Reconoce cuando has adaptado tu estilo con
                            éxito.
                          </p>
                          <textarea
                            placeholder="Escribe tu reflexión aquí..."
                            className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                          />
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6 space-y-3">
                          <h4 className="font-semibold text-orange-900">
                            12. ¿Qué mentor, líder o referente admiro que tenga un perfil DISC diferente al mío?
                          </h4>
                          <p className="text-sm text-gray-600">
                            Estudiar perfiles complementarios te enseña lo que no ves naturalmente. Alto D puede
                            aprender de un líder Alto S sobre paciencia estratégica.
                          </p>
                          <textarea
                            placeholder="Escribe tu reflexión aquí..."
                            className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-orange-500"
                          />
                        </CardContent>
                      </Card>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <div className="bg-gradient-to-r from-pink-600 to-purple-600 text-white p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">💬 Comparte tu reflexión con tu Coach IA</h3>
                  <p className="text-sm opacity-90 mb-4">
                    Las mejores reflexiones emergen en conversación. Habla con Sofia o Dani para profundizar en tus
                    respuestas y obtener perspectivas que no habías considerado.
                  </p>
                  <Button variant="secondary" size="sm" onClick={() => setActiveTab("coach")}>
                    Hablar con Coach IA
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="biblioteca-dtc" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <BookOpen className="h-6 w-6 text-green-600" />
                  Biblioteca DTC: Recursos Curados para tu Perfil
                </CardTitle>
                <CardDescription>
                  120+ libros seleccionados por expertos para potenciar tu desarrollo profesional
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {loadingBooks ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-3" />
                    <p className="text-gray-600">Cargando libros recomendados...</p>
                  </div>
                ) : (
                  <>
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-3">
                        📚 Por qué estos libros para tu perfil {styleInfo.title}
                      </h3>
                      <p className="text-sm text-gray-700 mb-4">
                        Hemos seleccionado estos recursos basándonos en tu perfil DISC y las áreas específicas donde
                        puedes generar mayor impacto. Cada libro ha sido escogido para fortalecer tus fortalezas
                        naturales y desarrollar competencias complementarias.
                      </p>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded border-l-4 border-l-green-500">
                          <strong className="text-green-700">Fortalezas a potenciar:</strong>
                          <ul className="mt-2 space-y-1 text-sm">
                            {styleInfo.strengths.map((strength, idx) => (
                              <li key={idx}>• {strength}</li>
                            ))}
                          </ul>
                        </div>
                        <div className="bg-white p-4 rounded border-l-4 border-orange-500">
                          <strong className="text-orange-700">Áreas de desarrollo:</strong>
                          <ul className="mt-2 space-y-1 text-sm">
                            {styleInfo.challenges.map((challenge, idx) => (
                              <li key={idx}>• {challenge}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Libros Recomendados para Ti</h3>
                      {recommendedBooks.length > 0 ? (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                          {recommendedBooks.map((book) => (
                            <Card key={book.id} className="hover:shadow-lg transition-shadow">
                              <CardHeader>
                                <CardTitle className="text-base">{book.title}</CardTitle>
                                <CardDescription className="text-sm">{book.author}</CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <div>
                                  <Badge variant="outline">{book.category}</Badge>
                                  <div className="flex items-center gap-1 mt-2">
                                    <span className="text-yellow-500">★</span>
                                    <span className="text-sm text-gray-600">
                                      Leído por {book.read_count || 0} usuarios
                                    </span>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-2">
                                  {book.content?.substring(0, 100)}...
                                </p>
                                <div className="flex gap-2 flex-wrap">
                                  {book.tags?.slice(0, 3).map((tag: string, idx: number) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                                <Button
                                  size="sm"
                                  className="w-full"
                                  onClick={() => router.push(`/biblioteca/${book.id}`)}
                                >
                                  <BookOpen className="h-4 w-4 mr-2" />
                                  Leer Ahora
                                </Button>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 bg-gray-50 rounded-lg">
                          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600">No hay libros disponibles en este momento.</p>
                          <Button
                            variant="outline"
                            className="mt-4 bg-transparent"
                            onClick={() => router.push("/biblioteca")}
                          >
                            Explorar Biblioteca Completa
                          </Button>
                        </div>
                      )}
                    </div>

                    <div className="bg-purple-50 p-6 rounded-lg">
                      <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                        <Target className="h-5 w-5 text-purple-600" />
                        Mini-Desafíos de Lectura (30 días)
                      </h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-white p-4 rounded shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                              1
                            </div>
                            <strong className="text-sm">Semana 1-2</strong>
                          </div>
                          <p className="text-sm text-gray-700">
                            Lee 1 capítulo diario del libro sobre {styleInfo.title}. Toma notas de 3 ideas clave por
                            día.
                          </p>
                          <Badge className="mt-2 bg-purple-600">+50 tokens DTC</Badge>
                        </div>
                        <div className="bg-white p-4 rounded shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                              2
                            </div>
                            <strong className="text-sm">Semana 3</strong>
                          </div>
                          <p className="text-sm text-gray-700">
                            Aplica 1 técnica del libro en tu trabajo diario. Documenta resultados en tu diario DTC.
                          </p>
                          <Badge className="mt-2 bg-purple-600">+75 tokens DTC</Badge>
                        </div>
                        <div className="bg-white p-4 rounded shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">
                              3
                            </div>
                            <strong className="text-sm">Semana 4</strong>
                          </div>
                          <p className="text-sm text-gray-700">
                            Comparte 2 insights con la comunidad DTC. Comenta en foros y conecta con otros lectores.
                          </p>
                          <Badge className="mt-2 bg-purple-600">+100 tokens DTC</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">¿Listo para empezar?</h3>
                        <p className="text-sm opacity-90">
                          Explora toda nuestra biblioteca de 120+ libros curados para tu carrera
                        </p>
                      </div>
                      <Button variant="secondary" size="lg" onClick={() => router.push("/biblioteca")}>
                        Ir a Biblioteca Completa
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="metas" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                  Tus Metas DTC: Trayectoria de Crecimiento
                </CardTitle>
                <CardDescription>
                  Define y sigue tus objetivos de desarrollo profesional basados en tu perfil {discResult?.primary_type}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {isLoadingGoals ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                    Cargando tus metas...
                  </div>
                ) : userGoals.length > 0 ? (
                  <>
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">
                        Metas Activas ({userGoals.filter((g: any) => g.status === "active").length})
                      </h3>
                      {userGoals
                        .filter((g: any) => g.status === "active")
                        .map((goal: any) => (
                          <Card key={goal.id} className="border-l-4 border-l-blue-500">
                            <CardContent className="pt-6 space-y-2">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="font-semibold">{goal.title}</h4>
                                  {goal.description && (
                                    <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                                  )}
                                  <div className="flex items-center gap-4 mt-3 text-sm">
                                    <Badge variant="outline">{goal.category}</Badge>
                                    <Badge variant={goal.priority === "high" ? "destructive" : "secondary"}>
                                      {goal.priority === "high"
                                        ? "Alta"
                                        : goal.priority === "medium"
                                          ? "Media"
                                          : "Baja"}{" "}
                                      prioridad
                                    </Badge>
                                    {goal.target_date && (
                                      <span className="text-muted-foreground flex items-center gap-1">
                                        <Calendar className="h-3 w-3" />
                                        {new Date(goal.target_date).toLocaleDateString("es-CL")}
                                      </span>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-2xl font-bold text-blue-600">{goal.progress}%</div>
                                  <div className="text-xs text-muted-foreground">Progreso</div>
                                </div>
                              </div>
                              <div className="w-full bg-secondary rounded-full h-2 mt-3">
                                <div
                                  className="bg-blue-600 h-2 rounded-full transition-all"
                                  style={{ width: `${goal.progress}%` }}
                                />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                    </div>

                    <Separator />

                    <div>
                      <h3 className="font-semibold text-lg mb-4">
                        Metas Completadas ({userGoals.filter((g: any) => g.status === "completed").length})
                      </h3>
                      <div className="space-y-2">
                        {userGoals
                          .filter((g: any) => g.status === "completed")
                          .map((goal: any) => (
                            <div
                              key={goal.id}
                              className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800"
                            >
                              <Check className="h-5 w-5 text-green-600" />
                              <div className="flex-1">
                                <p className="font-medium text-green-900 dark:text-green-100">{goal.title}</p>
                                <p className="text-sm text-green-700 dark:text-green-300">
                                  Completada el {new Date(goal.updated_at).toLocaleDateString("es-CL")}
                                </p>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">Aún no tienes metas guardadas</p>
                    <p className="text-sm text-muted-foreground">Guarda las metas recomendadas abajo para empezar</p>
                  </div>
                )}

                <Separator />

                <div>
                  <h3 className="font-semibold text-lg mb-4">Metas Recomendadas para tu Perfil</h3>
                  <Accordion type="single" collapsible className="space-y-4">
                    <AccordionItem value="short-term">
                      <AccordionTrigger>
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-green-600" />
                          <span>Corto Plazo (1-3 meses)</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        {getPersonalizedGoals("short").map((goal: any, index: number) => (
                          <Card key={index} className="border-l-4 border-l-green-500">
                            <CardContent className="pt-6 space-y-3">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <h4 className="font-semibold">{goal.goal}</h4>
                                  {goal.description && (
                                    <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                                  )}
                                  {goal.steps && goal.steps.length > 0 && (
                                    <ul className="mt-3 space-y-1">
                                      {goal.steps.map((step: string, i: number) => (
                                        <li key={i} className="text-sm flex items-start gap-2">
                                          <ArrowRight className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                                          <span>{step}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => saveGoalToDatabase({ ...goal, timeframe: "short" })}
                                  disabled={isSavingGoal}
                                >
                                  {isSavingGoal ? "Guardando..." : "Guardar Meta"}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="medium-term">
                      <AccordionTrigger>
                        <div className="flex items-center gap-3">
                          <TrendingUp className="h-5 w-5 text-blue-600" />
                          <span>Mediano Plazo (3-6 meses)</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        {getPersonalizedGoals("medium").map((goal: any, index: number) => (
                          <Card key={index} className="border-l-4 border-l-blue-500">
                            <CardContent className="pt-6 space-y-3">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <h4 className="font-semibold">{goal.goal}</h4>
                                  {goal.description && (
                                    <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                                  )}
                                  {goal.steps && goal.steps.length > 0 && (
                                    <ul className="mt-3 space-y-1">
                                      {goal.steps.map((step: string, i: number) => (
                                        <li key={i} className="text-sm flex items-start gap-2">
                                          <ArrowRight className="h-4 w-4 mt-0.5 text-blue-600 flex-shrink-0" />
                                          <span>{step}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => saveGoalToDatabase({ ...goal, timeframe: "medium" })}
                                  disabled={isSavingGoal}
                                >
                                  {isSavingGoal ? "Guardando..." : "Guardar Meta"}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="long-term">
                      <AccordionTrigger>
                        <div className="flex items-center gap-3">
                          <Target className="h-5 w-5 text-purple-600" />
                          <span>Largo Plazo (6-12 meses)</span>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        {getPersonalizedGoals("long").map((goal: any, index: number) => (
                          <Card key={index} className="border-l-4 border-l-purple-500">
                            <CardContent className="pt-6 space-y-3">
                              <div className="flex items-start justify-between gap-4">
                                <div className="flex-1">
                                  <h4 className="font-semibold">{goal.goal}</h4>
                                  {goal.description && (
                                    <p className="text-sm text-muted-foreground mt-1">{goal.description}</p>
                                  )}
                                  {goal.steps && goal.steps.length > 0 && (
                                    <ul className="mt-3 space-y-1">
                                      {goal.steps.map((step: string, i: number) => (
                                        <li key={i} className="text-sm flex items-start gap-2">
                                          <ArrowRight className="h-4 w-4 mt-0.5 text-purple-600 flex-shrink-0" />
                                          <span>{step}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  )}
                                </div>
                                <Button
                                  size="sm"
                                  onClick={() => saveGoalToDatabase({ ...goal, timeframe: "long" })}
                                  disabled={isSavingGoal}
                                >
                                  {isSavingGoal ? "Guardando..." : "Guardar Meta"}
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Análisis Detallado</CardTitle>
                <CardDescription>Interpretación profunda de tus resultados DISC</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Análisis Automático</h3>
                  <p className="text-sm">{discResult.analysis}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <h4 className="font-semibold">Dimensiones Altas (&gt;70%)</h4>
                    {[
                      { name: "Dominancia", score: discResult.d_score },
                      { name: "Influencia", score: discResult.i_score },
                      { name: "Estabilidad", score: discResult.s_score },
                      { name: "Cumplimiento", score: discResult.c_score },
                    ]
                      .filter((item) => item.score > 70)
                      .map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                          <span className="text-sm font-medium">{item.name}</span>
                          <Badge variant="default">{item.score}%</Badge>
                        </div>
                      ))}
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Dimensiones a Desarrollar (&lt;50%)</h4>
                    {[
                      { name: "Dominancia", score: discResult.d_score },
                      { name: "Influencia", score: discResult.i_score },
                      { name: "Estabilidad", score: discResult.s_score },
                      { name: "Cumplimiento", score: discResult.c_score },
                    ]
                      .filter((item) => item.score < 50)
                      .map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-orange-50 rounded">
                          <span className="text-sm font-medium">{item.name}</span>
                          <Badge variant="outline">{item.score}%</Badge>
                        </div>
                      ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="cerebro-gpt" className="space-y-6">
            <MultiTestInsights userEmail={user?.email || ""} currentTestType="DISC" />

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-6 w-6 text-blue-600" />
                  Análisis Híbrido: Cerebro + GPT-4
                </CardTitle>
                <CardDescription>
                  Insights personalizados generados por el Cerebro (búsqueda semántica en 120+ libros) + GPT-4
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loadingInsights ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-blue-600 mr-3" />
                    <p className="text-gray-600">Generando insights personalizados con IA híbrida...</p>
                  </div>
                ) : insightsError ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Brain className="h-8 w-8 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar insights</h3>
                    <p className="text-gray-600 mb-4">{insightsError}</p>
                    <Button onClick={retryLoadInsights} className="mr-2">
                      Intentar de nuevo
                    </Button>
                    <Button variant="outline" onClick={() => router.push("/coach-ia")}>
                      Hablar con Coach IA
                    </Button>
                  </div>
                ) : hybridInsights ? (
                  <div className="space-y-6">
                    <div className="flex justify-end">
                      <Button variant="outline" size="sm" onClick={retryLoadInsights} disabled={loadingInsights}>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Regenerar Insights
                      </Button>
                    </div>

                    {hybridInsights.metadata && (
                      <div className="flex gap-4 p-4 bg-blue-50 rounded-lg">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {hybridInsights.metadata.totalInsights}
                          </div>
                          <div className="text-xs text-gray-600">Total Insights</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">
                            {hybridInsights.metadata.openaiInsightsCount}
                          </div>
                          <div className="text-xs text-gray-600">GPT-4</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">
                            {hybridInsights.metadata.cerebroInsightsCount}
                          </div>
                          <div className="text-xs text-gray-600">Cerebro</div>
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-yellow-600" />
                        Insights Clave
                      </h3>
                      <div className="grid gap-4">
                        {hybridInsights.insights.map((insight, index) => {
                          const sourceBadge = getSourceBadge(insight.source)
                          return (
                            <Card key={index} className="border-l-4 border-l-blue-500">
                              <CardHeader className="pb-3">
                                <div className="flex items-start justify-between gap-2">
                                  <CardTitle className="text-base">{insight.title}</CardTitle>
                                  <div className="flex gap-2">
                                    <Badge className={sourceBadge.color}>{sourceBadge.label}</Badge>
                                    <Badge variant={getPriorityColor(insight.priority)}>{insight.priority}</Badge>
                                  </div>
                                </div>
                                <CardDescription className="text-xs">
                                  {insight.category} • Confianza: {(insight.confidence * 100).toFixed(0)}%
                                </CardDescription>
                              </CardHeader>
                              <CardContent className="space-y-3">
                                <p className="text-sm text-gray-700">{insight.description}</p>

                                {insight.personalizedContext && (
                                  <div className="bg-blue-50 p-3 rounded text-sm">
                                    <strong>Contexto:</strong> {insight.personalizedContext}
                                  </div>
                                )}

                                {insight.actionableSteps.length > 0 && (
                                  <div>
                                    <p className="text-sm font-semibold mb-2">Pasos Accionables:</p>
                                    <ul className="space-y-1">
                                      {insight.actionableSteps.map((step, i) => (
                                        <li key={i} className="text-sm flex items-start gap-2">
                                          <span className="text-blue-600 font-bold">{i + 1}.</span>
                                          <span>{step}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                <p className="text-xs text-gray-500 italic">Fuente: {insight.reasoningSource}</p>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <BookOpen className="h-5 w-5 text-green-600" />
                        Recomendaciones
                      </h3>
                      <div className="grid gap-3">
                        {hybridInsights.recommendations.map((rec, index) => {
                          const sourceBadge = getSourceBadge(rec.source)
                          return (
                            <Card key={index}>
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-2 mb-2">
                                  <h4 className="font-semibold text-sm">{rec.title}</h4>
                                  <Badge className={sourceBadge.color} variant="outline">
                                    {sourceBadge.label}
                                  </Badge>
                                </div>
                                <p className="text-sm text-gray-700 mb-2">{rec.description}</p>
                                <div className="flex gap-2 text-xs text-gray-500">
                                  <span>📅 {rec.timeframe}</span>
                                  <span>•</span>
                                  <span>🎯 {rec.difficulty}</span>
                                </div>
                              </CardContent>
                            </Card>
                          )
                        })}
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold flex items-center gap-2">
                        <Target className="h-5 w-5 text-orange-600" />
                        Plan de Desarrollo
                      </h3>
                      <div className="grid md:grid-cols-3 gap-4">
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Corto Plazo (1-3 meses)</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {hybridInsights.developmentPlan.shortTerm.map((item, i) => (
                                <li key={i} className="text-sm flex gap-2">
                                  <span className="text-green-600">✓</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Mediano Plazo (3-6 meses)</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {hybridInsights.developmentPlan.mediumTerm.map((item, i) => (
                                <li key={i} className="text-sm flex gap-2">
                                  <span className="text-blue-600">→</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-sm">Largo Plazo (6-12 meses)</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="space-y-2">
                              {hybridInsights.developmentPlan.longTerm.map((item, i) => (
                                <li key={i} className="text-sm flex gap-2">
                                  <span className="text-purple-600">★</span>
                                  <span>{item}</span>
                                </li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Brain className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 mb-4">Los insights híbridos no están disponibles en modo demo.</p>
                    <Button onClick={() => router.push("/test/disc")}>Realizar Test Real</Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="coach" className="space-y-6">
            <SofiaDaniCoach
              conversationCategory="autoconocimiento"
              userContext={{
                testType: "DISC",
                testResults: discResult,
                userEmail: user?.email || "demo@example.com",
                completedAt: discResult.created_at,
              }}
              suggestedAction={`Completa el test de Soft Skills para desarrollar tus habilidades de comunicación`}
            />
          </TabsContent>

          <TabsContent value="siguientes-pasos" className="space-y-6">
            <Card className="border-l-4 border-l-indigo-500">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <ArrowRight className="h-6 w-6 text-indigo-600" />
                  Siguientes Pasos en Tu Journey DTC
                </CardTitle>
                <CardDescription>
                  Continúa tu desarrollo profesional explorando otros aspectos de tu perfil
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">🎯 Tu Ruta Personalizada de Desarrollo</h3>
                  <p className="text-sm text-gray-700 mb-4">
                    Basado en tu perfil DISC {discResult.primary_type}, estos son los tests recomendados para completar
                    tu análisis profesional.
                  </p>
                </div>

                <div className="grid gap-4">
                  {/* Inteligencia Emocional - Recomendado #1 */}
                  <Card className="border-2 border-red-300 relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-red-500 text-white px-3 py-1 text-xs font-bold rounded-bl">
                      RECOMENDADO
                    </div>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">❤️</div>
                        Test de Inteligencia Emocional
                      </CardTitle>
                      <CardDescription>15 min • Nivel: Fundamental</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-700">
                        <strong>Por qué después de DISC:</strong> Tu perfil {discResult.primary_type} muestra{" "}
                        {discResult.c_score}% en Cumplimiento y {discResult.d_score}% en Dominancia. La inteligencia
                        emocional te ayudará a{" "}
                        {discResult.c_score > 70
                          ? "conectar mejor emocionalmente con equipos mientras mantienes tu rigor analítico"
                          : discResult.d_score > 70
                            ? "balancear tu enfoque directo con empatía"
                            : "expandir tu círculo de influencia con conexiones más diversas y enriquecedoras."}
                        .
                      </p>
                      <div className="bg-red-50 p-3 rounded">
                        <p className="text-sm font-semibold text-red-800 mb-2">Qué aprenderás:</p>
                        <ul className="space-y-1 text-sm text-red-700">
                          <li>• Autoconciencia emocional y autorregulación</li>
                          <li>• Empatía y habilidades sociales</li>
                          <li>• Gestión de emociones en situaciones de presión</li>
                          <li>• Conexión emocional con equipos</li>
                        </ul>
                      </div>
                      <Button
                        className="w-full bg-red-500 hover:bg-red-600"
                        onClick={() => router.push("/test/emotional-intelligence")}
                      >
                        Hacer Test de Inteligencia Emocional
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>

                  {/* MBTI */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">🧠</div>
                        Test MBTI - Personalidad
                      </CardTitle>
                      <CardDescription>20 min • Nivel: Fundamental</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-700">
                        <strong>Complementa tu DISC:</strong> Mientras DISC mide comportamiento en el trabajo, MBTI
                        revela tu estilo cognitivo y preferencias de personalidad.
                      </p>
                      <div className="bg-blue-50 p-3 rounded">
                        <p className="text-sm font-semibold text-blue-800 mb-2">Qué aprenderás:</p>
                        <ul className="space-y-1 text-sm text-blue-700">
                          <li>• Cómo procesas información (Sensing vs Intuition)</li>
                          <li>• Tu estilo de toma de decisiones (Thinking vs Feeling)</li>
                          <li>• Energía social (Introversión vs Extroversión)</li>
                          <li>• Enfoque de vida (Judging vs Perceiving)</li>
                        </ul>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => router.push("/test/mbti")}
                      >
                        Hacer Test MBTI
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Big Five */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">⭐</div>
                        Test Big Five - 5 Dimensiones de Personalidad
                      </CardTitle>
                      <CardDescription>15 min • Nivel: Intermedio • Requiere: DISC + Int. Emocional</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-700">
                        <strong>Profundiza tu autoconocimiento:</strong> Big Five es el modelo más científicamente
                        validado de personalidad, usado en investigación psicológica global.
                      </p>
                      <div className="bg-purple-50 p-3 rounded">
                        <p className="text-sm font-semibold text-purple-800 mb-2">Qué aprenderás:</p>
                        <ul className="space-y-1 text-sm text-purple-700">
                          <li>• Apertura a experiencias nuevas</li>
                          <li>• Responsabilidad y organización</li>
                          <li>• Extroversión y energía social</li>
                          <li>• Amabilidad y cooperación</li>
                          <li>• Neuroticismo y estabilidad emocional</li>
                        </ul>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => router.push("/test/big-five")}
                      >
                        Hacer Test Big Five
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>

                  {/* RIASEC */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">💼</div>
                        Test RIASEC - Intereses Vocacionales
                      </CardTitle>
                      <CardDescription>15 min • Nivel: Intermedio • Requiere: MBTI</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-700">
                        <strong>Descubre tu vocación:</strong> RIASEC identifica qué tipos de trabajos y ambientes
                        laborales se alinean con tus intereses naturales.
                      </p>
                      <div className="bg-green-50 p-3 rounded">
                        <p className="text-sm font-semibold text-green-800 mb-2">Qué aprenderás:</p>
                        <ul className="space-y-1 text-sm text-green-700">
                          <li>• Realista: trabajo con objetos, herramientas, maquinas</li>
                          <li>• Investigativo: análisis, investigación, ciencia</li>
                          <li>• Artístico: creatividad, expresión, diseño</li>
                          <li>• Social: ayudar, enseñar, cuidar personas</li>
                          <li>• Emprendedor: liderar, persuadir, gestionar</li>
                          <li>• Convencional: organizar, administrar, datos</li>
                        </ul>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => router.push("/test/riasec")}
                      >
                        Hacer Test RIASEC
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Soft Skills */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">💡</div>
                        Test de Soft Skills
                      </CardTitle>
                      <CardDescription>20 min • Nivel: Avanzado • Requiere: Big Five + RIASEC</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-gray-700">
                        <strong>Evalúa competencias clave:</strong> Mide 10+ habilidades blandas críticas para el éxito
                        profesional en el mercado laboral chileno.
                      </p>
                      <div className="bg-yellow-50 p-3 rounded">
                        <p className="text-sm font-semibold text-yellow-800 mb-2">Qué aprenderás:</p>
                        <ul className="space-y-1 text-sm text-yellow-700">
                          <li>• Comunicación efectiva y asertiva</li>
                          <li>• Trabajo en equipo y colaboración</li>
                          <li>• Resolución de problemas complejos</li>
                          <li>• Adaptabilidad y aprendizaje continuo</li>
                          <li>• Pensamiento crítico y creatividad</li>
                        </ul>
                      </div>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => router.push("/test/soft-skills")}
                      >
                        Hacer Test de Soft Skills
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">🚀 Ecosistema Completo DTC</h3>
                  <p className="text-sm opacity-90 mb-4">
                    Completar los 6 tests te da acceso a análisis multi-dimensional, correlaciones entre perfiles, y
                    recomendaciones hiper-personalizadas de la Biblioteca DTC con búsqueda semántica en 120+ libros.
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4" />
                      <span>✅ DISC</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-60">
                      <div className="h-4 w-4 border-2 border-white rounded" />
                      <span>Int. Emocional</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-60">
                      <div className="h-4 w-4 border-2 border-white rounded" />
                      <span>MBTI</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-60">
                      <div className="h-4 w-4 border-2 border-white rounded" />
                      <span>Big Five</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-60">
                      <div className="h-4 w-4 border-2 border-white rounded" />
                      <span>RIASEC</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-60">
                      <div className="h-4 w-4 border-2 border-white rounded" />
                      <span>Soft Skills</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-analysis" className="space-y-6">
            <MultiTestInsights userEmail={user?.email || ""} currentTestType="DISC" />

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="h-5 w-5 mr-2 text-purple-600" />
                  Análisis con Inteligencia Artificial
                </CardTitle>
                <CardDescription>Interpretación avanzada de tus resultados DISC</CardDescription>
              </CardHeader>
              <CardContent>
                {aiInterpretation ? (
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 p-6 rounded-lg">
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-wrap text-gray-700">{aiInterpretation}</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="h-8 w-8 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Análisis IA no disponible</h3>
                    <p className="text-gray-600 mb-4">
                      El análisis con IA se genera automáticamente al completar el test.
                    </p>
                    <Button onClick={() => router.push("/test/disc")} variant="outline">
                      Realizar Test Nuevamente
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
