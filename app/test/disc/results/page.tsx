"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from 'next/navigation'
import { useSession } from "@/components/session-wrapper"
import { createClient } from "@supabase/supabase-js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Brain, Download, Share2, TrendingUp, Users, Target, Sparkles, Loader2, Lightbulb, BookOpen } from 'lucide-react'
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { MultiTestInsights } from "@/components/multi-test-insights"
import { SofiaDaniCoach } from "@/components/sofia-dani-coach"

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
  source: 'openai' | 'cerebro' | 'hybrid'
  category: string
  title: string
  description: string
  confidence: number
  priority: 'high' | 'medium' | 'low'
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
    source: 'openai' | 'cerebro' | 'hybrid'
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


  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

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
      // Load DISC results
      const { data: discData, error: discError } = await supabase
        .from("disc_results")
        .select("*")
        .eq("user_email", user.email)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (discError && discError.code !== "PGRST116") {
        console.error("Error loading DISC results:", discError)
      }

      // Load AI interpretation
      const { data: aiData, error: aiError } = await supabase
        .from("ai_interpretations")
        .select("*")
        .eq("user_email", user.email)
        .eq("test_name", "DISC Assessment")
        .order("generated_at", { ascending: false })
        .limit(1)
        .single()

      if (aiError && aiError.code !== "PGRST116") {
        console.error("Error loading AI interpretation:", aiError)
      }

      // Load test results for additional AI interpretation
      const { data: testData, error: testError } = await supabase
        .from("test_results")
        .select("*")
        .eq("user_email", user.email)
        .eq("test_name", "DISC Assessment")
        .order("completed_at", { ascending: false })
        .limit(1)
        .single()

      if (testError && testError.code !== "PGRST116") {
        console.error("Error loading test results:", testError)
      }

      if (discData) {
        setDiscResult(discData)
        await loadHybridInsights(discData)
      } else {
        // Create demo data if no results found
        setDiscResult({
          d_score: 75,
          i_score: 65,
          s_score: 45,
          c_score: 85,
          primary_type: "Compliance",
          analysis: "Tu estilo principal es Compliance con puntuaciones: D=75%, I=65%, S=45%, C=85%",
          recommendations: "Continúa desarrollando tus fortalezas naturales mientras trabajas en áreas de crecimiento.",
          created_at: new Date().toISOString(),
        })
      }

      // Set AI interpretation from multiple sources
      if (aiData?.interpretation) {
        setAiInterpretation(aiData.interpretation)
      } else if (testData?.results?.ai_interpretation) {
        setAiInterpretation(testData.results.ai_interpretation)
      }
    } catch (error) {
      console.error("Error loading results:", error)
    } finally {
      setLoading(false)
    }
  }

  const loadRecommendedBooks = async () => {
    if (!discResult) return
    
    setLoadingBooks(true)
    try {
      console.log('[v0] Loading books for DISC type:', discResult.primary_type)
      const response = await fetch('/api/books')
      if (response.ok) {
        const allBooks = await response.json()
        console.log('[v0] Total books fetched:', allBooks.length)
        
        const filtered = allBooks.filter((book: any) => {
          const tags = (book.tags || []).map((t: string) => t.toLowerCase())
          
          if (discResult.primary_type === 'Dominance') {
            return tags.some((t: string) => ['liderazgo', 'productividad', 'estrategia', 'poder', 'decisiones'].includes(t))
          } else if (discResult.primary_type === 'Influence') {
            return tags.some((t: string) => ['comunicación', 'relaciones', 'influencia', 'networking', 'persuasión'].includes(t))
          } else if (discResult.primary_type === 'Steadiness') {
            return tags.some((t: string) => ['colaboración', 'equipo', 'estabilidad', 'empatía', 'paciencia'].includes(t))
          } else if (discResult.primary_type === 'Compliance') {
            return tags.some((t: string) => ['análisis', 'calidad', 'sistemas', 'precisión', 'datos'].includes(t))
          }
          return false
        }).slice(0, 6)
        
        console.log('[v0] Filtered books for', discResult.primary_type, ':', filtered.length)
        setRecommendedBooks(filtered)
      }
    } catch (error) {
      console.error('[v0] Error loading books:', error)
    } finally {
      setLoadingBooks(false)
    }
  }


  const loadHybridInsights = async (discData: DISCResult) => {
    if (!user || isDemoMode) return

    setLoadingInsights(true)
    setInsightsError(null)
    try {
      const response = await fetch('/api/post-test-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testType: 'DISC',
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
        setInsightsError(errorData.message || 'Error al generar insights')
      }
    } catch (error) {
      console.error('Error loading hybrid insights:', error)
      setInsightsError('No se pudieron cargar los insights. Por favor, intenta de nuevo.')
    } finally {
      setLoadingInsights(false)
    }
  }

  const retryLoadInsights = () => {
    if (discResult) {
      loadHybridInsights(discResult)
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
      case 'high': return 'destructive'
      case 'medium': return 'default'
      case 'low': return 'secondary'
      default: return 'outline'
    }
  }

  const getSourceBadge = (source: string) => {
    switch (source) {
      case 'openai': return { label: 'GPT-4', color: 'bg-purple-100 text-purple-800' }
      case 'cerebro': return { label: 'Cerebro', color: 'bg-blue-100 text-blue-800' }
      case 'hybrid': return { label: 'Híbrido', color: 'bg-green-100 text-green-800' }
      default: return { label: 'IA', color: 'bg-gray-100 text-gray-800' }
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
            <CardTitle className="text-3xl">Resultados del Test DISC</CardTitle>
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

        <Tabs defaultValue="resumen-ejecutivo" className="space-y-6">
          <TabsList className="grid w-full grid-cols-7 gap-1">
            <TabsTrigger value="resumen-ejecutivo">
              <Sparkles className="h-4 w-4 mr-1" />
              Resumen Ejecutivo
            </TabsTrigger>
            <TabsTrigger value="plan-90-dias">
              <Target className="h-4 w-4 mr-1" />
              Plan 90 Días
            </TabsTrigger>
            <TabsTrigger value="biblioteca-dtc">
              <BookOpen className="h-4 w-4 mr-1" />
              Biblioteca DTC
            </TabsTrigger>
            <TabsTrigger value="metas">
              <TrendingUp className="h-4 w-4 mr-1" />
              Metas DTC
            </TabsTrigger>
            <TabsTrigger value="overview">Análisis Detallado</TabsTrigger>
            <TabsTrigger value="cerebro-gpt">
              <Brain className="h-4 w-4 mr-1" />
              Cerebro + GPT
            </TabsTrigger>
            <TabsTrigger value="coach">Coach IA</TabsTrigger>
          </TabsList>

          <TabsContent value="resumen-ejecutivo" className="space-y-6">
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                  Resumen Ejecutivo DTC - Tu Perfil Creativo
                </CardTitle>
                <CardDescription>
                  Tu mapa profesional completo en 2 páginas
                </CardDescription>
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
                      <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">1</span>
                      <div>
                        <strong>Cómo tomas decisiones:</strong> Combinas datos duros (C alta) con firmeza ejecutiva (D alta). Analizas a fondo, pero decides rápido una vez tienes la info.
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">2</span>
                      <div>
                        <strong>Cómo te ven los demás:</strong> Jefe: "Exigente pero confiable". Pares: "Brillante pero a veces difícil". Clientes: "Técnicamente impecable".
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">3</span>
                      <div>
                        <strong>Dónde generas más valor:</strong> Proyectos complejos que requieren análisis profundo + ejecución rápida. Resolución de problemas técnicos críticos.
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">4</span>
                      <div>
                        <strong>Tu riesgo #1:</strong> Alienar al equipo por intensidad + perfeccionismo. Resultado: proyectos perfectos pero equipos desmotivados.
                      </div>
                    </li>
                    <li className="flex gap-3">
                      <span className="flex-shrink-0 w-8 h-8 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold">5</span>
                      <div>
                        <strong>Upside máximo:</strong> Roles técnico-estratégicos (CTO, Arquitecto Senior, Director de Innovación). Donde expertise + vision estratégica son críticas.
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
                        <li className="flex gap-2"><span className="text-blue-600">→</span>Modular intensidad sin perder firmeza</li>
                        <li className="flex gap-2"><span className="text-blue-600">→</span>Flexibilizar perfeccionismo (80% vs 100%)</li>
                        <li className="flex gap-2"><span className="text-blue-600">→</span>Aumentar conexión emocional con equipo</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800 mb-2">3 Hábitos 30 Días</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex gap-2"><span className="text-green-600">✓</span>Pausa 5 seg antes de responder en tensión</li>
                        <li className="flex gap-2"><span className="text-green-600">✓</span>Definir "siguiente paso mínimo" en 5 min</li>
                        <li className="flex gap-2"><span className="text-green-600">✓</span>Check-in emocional 1-2 min al inicio reuniones</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-800 mb-2">3 Recursos DTC</h4>
                      <ul className="space-y-2 text-sm">
                        <li className="flex gap-2"><span className="text-purple-600">📖</span>Test: Inteligencia Emocional</li>
                        <li className="flex gap-2"><span className="text-purple-600">📖</span>Libros: Comunicación Asertiva</li>
                        <li className="flex gap-2"><span className="text-purple-600">📖</span>Plantilla: Prep Conversaciones Difíciles</li>
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
                  Una hoja de ruta práctica para potenciar tu perfil y superar desafíos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-orange-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Mes 1: Fundamentos Estratégicos</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-semibold text-orange-800 mb-2">🎯 Meta Principal</h4>
                      <p className="text-sm">Refinar la comunicación en situaciones de alta presión.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-orange-800 mb-2">✅ Hábitos Clave</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Practicar escucha activa en reuniones (5 min).</li>
                        <li>• Documentar 'por qué' de decisiones clave (1 párrafo).</li>
                        <li>• Identificar 1-2 momentos de tensión y cómo reaccionaste.</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-orange-800 mb-2">📚 Recursos DTC</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Artículos: 'Gestión de Conflictos Constructivos'.</li>
                        <li>• Videos: 'Técnicas de Persuasión Ética'.</li>
                        <li>• Ejercicios: 'Análisis de Causas Raíz'.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Mes 2: Optimización y Colaboración</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2">🎯 Meta Principal</h4>
                      <p className="text-sm">Fomentar la colaboración y la empatía en el equipo.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2">✅ Hábitos Clave</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Realizar "check-ins emocionales" al inicio de reuniones de equipo.</li>
                        <li>• Delegar tareas identificando puntos fuertes del equipo.</li>
                        <li>• Buscar feedback constructivo sobre tu estilo de liderazgo.</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-2">📚 Recursos DTC</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Curso: 'Inteligencia Emocional Aplicada'.</li>
                        <li>• Libros: 'La 5ª Disciplina' (Senge).</li>
                        <li>• Plantilla: 'Matriz de Habilidades del Equipo'.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold mb-4">Mes 3: Crecimiento Sostenido</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <h4 className="font-semibold text-green-800 mb-2">🎯 Meta Principal</h4>
                      <p className="text-sm">Consolidar el perfeccionismo productivo y la visión a largo plazo.</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800 mb-2">✅ Hábitos Clave</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Establecer criterios de "suficientemente bueno" para proyectos.</li>
                        <li>• Dedicar tiempo a la reflexión estratégica semanal.</li>
                        <li>• Mentorizar a un miembro del equipo en áreas analíticas.</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800 mb-2">📚 Recursos DTC</h4>
                      <ul className="space-y-1 text-sm">
                        <li>• Herramientas: 'Gestión de Proyectos Ágil'.</li>
                        <li>• Lecturas: 'Liderazgo Visionario'.</li>
                        <li>• Taller: 'Pensamiento Sistémico Avanzado'.</li>
                      </ul>
                    </div>
                  </div>
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
                      <h3 className="text-lg font-semibold mb-3">📚 Por qué estos libros para tu perfil {styleInfo.title}</h3>
                      <p className="text-sm text-gray-700 mb-4">
                        Hemos seleccionado estos recursos basándonos en tu perfil DISC y las áreas específicas donde puedes generar mayor impacto.
                        Cada libro ha sido escogido para fortalecer tus fortalezas naturales y desarrollar competencias complementarias.
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
                        <div className="bg-white p-4 rounded border-l-4 border-l-orange-500">
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
                                    <span className="text-sm text-gray-600">Leído por {book.read_count || 0} usuarios</span>
                                  </div>
                                </div>
                                <p className="text-sm text-gray-600 line-clamp-2">{book.content?.substring(0, 100)}...</p>
                                <div className="flex gap-2 flex-wrap">
                                  {book.tags?.slice(0, 3).map((tag: string, idx: number) => (
                                    <Badge key={idx} variant="secondary" className="text-xs">{tag}</Badge>
                                  ))}
                                </div>
                                <Button size="sm" className="w-full" onClick={() => router.push(`/biblioteca/${book.id}`)}>
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
                          <Button variant="outline" className="mt-4" onClick={() => router.push('/biblioteca')}>
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
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">1</div>
                            <strong className="text-sm">Semana 1-2</strong>
                          </div>
                          <p className="text-sm text-gray-700">Lee 1 capítulo diario del libro sobre {styleInfo.title}. Toma notas de 3 ideas clave por día.</p>
                          <Badge className="mt-2 bg-purple-600">+50 tokens DTC</Badge>
                        </div>
                        <div className="bg-white p-4 rounded shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">2</div>
                            <strong className="text-sm">Semana 3</strong>
                          </div>
                          <p className="text-sm text-gray-700">Aplica 1 técnica del libro en tu trabajo diario. Documenta resultados en tu diario DTC.</p>
                          <Badge className="mt-2 bg-purple-600">+75 tokens DTC</Badge>
                        </div>
                        <div className="bg-white p-4 rounded shadow-sm">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-bold">3</div>
                            <strong className="text-sm">Semana 4</strong>
                          </div>
                          <p className="text-sm text-gray-700">Comparte 2 insights con la comunidad DTC. Comenta en foros y conecta con otros lectores.</p>
                          <Badge className="mt-2 bg-purple-600">+100 tokens DTC</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-lg">
                      <div>
                        <h3 className="text-lg font-semibold mb-1">¿Listo para empezar?</h3>
                        <p className="text-sm opacity-90">Explora toda nuestra biblioteca de 120+ libros curados para tu carrera</p>
                      </div>
                      <Button variant="secondary" size="lg" onClick={() => router.push('/biblioteca')}>
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
                  Define y sigue tus objetivos de desarrollo profesional
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Metas de Corto Plazo (Próximos 3 Meses)</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Card className="border-l-4 border-l-blue-400">
                        <CardContent className="p-4 space-y-2">
                          <p className="text-sm font-semibold">Mejorar la gestión de la intensidad en reuniones</p>
                          <Badge variant="secondary" className="text-xs">En Progreso</Badge>
                          <div className="text-xs text-gray-500">Prioridad: Alta</div>
                          <Button variant="outline" size="sm" className="mt-2">Ver Detalles</Button>
                        </CardContent>
                      </Card>
                      <Card className="border-l-4 border-l-blue-400">
                        <CardContent className="p-4 space-y-2">
                          <p className="text-sm font-semibold">Delegar tareas complejas eficazmente</p>
                          <Badge variant="outline" className="text-xs">Pendiente</Badge>
                          <div className="text-xs text-gray-500">Prioridad: Media</div>
                          <Button variant="outline" size="sm" className="mt-2">Ver Detalles</Button>
                        </CardContent>
                      </Card>
                      <Card className="border-l-4 border-l-blue-400">
                        <CardContent className="p-4 space-y-2">
                          <p className="text-sm font-semibold">Buscar feedback constructivo semanalmente</p>
                          <Badge variant="outline" className="text-xs">Pendiente</Badge>
                          <div className="text-xs text-gray-500">Prioridad: Media</div>
                          <Button variant="outline" size="sm" className="mt-2">Ver Detalles</Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Metas de Mediano Plazo (3-9 Meses)</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Card className="border-l-4 border-l-green-400">
                        <CardContent className="p-4 space-y-2">
                          <p className="text-sm font-semibold">Desarrollar un estilo de liderazgo más empático</p>
                          <Badge variant="outline" className="text-xs">Pendiente</Badge>
                          <div className="text-xs text-gray-500">Prioridad: Alta</div>
                          <Button variant="outline" size="sm" className="mt-2">Ver Detalles</Button>
                        </CardContent>
                      </Card>
                      <Card className="border-l-4 border-l-green-400">
                        <CardContent className="p-4 space-y-2">
                          <p className="text-sm font-semibold">Integrar perfeccionismo con pragmatismo</p>
                          <Badge variant="outline" className="text-xs">Pendiente</Badge>
                          <div className="text-xs text-gray-500">Prioridad: Media</div>
                          <Button variant="outline" size="sm" className="mt-2">Ver Detalles</Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Metas de Largo Plazo (9-18 Meses)</h3>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      <Card className="border-l-4 border-l-purple-400">
                        <CardContent className="p-4 space-y-2">
                          <p className="text-sm font-semibold">Asumir roles de mayor influencia estratégica</p>
                          <Badge variant="outline" className="text-xs">Pendiente</Badge>
                          <div className="text-xs text-gray-500">Prioridad: Alta</div>
                          <Button variant="outline" size="sm" className="mt-2">Ver Detalles</Button>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
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
                    <Button variant="outline" onClick={() => router.push('/coach-ia')}>
                      Hablar con Coach IA
                    </Button>
                  </div>
                ) : hybridInsights ? (
                  <div className="space-y-6">
                    <div className="flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={retryLoadInsights}
                        disabled={loadingInsights}
                      >
                        <Sparkles className="h-4 w-4 mr-2" />
                        Regenerar Insights
                      </Button>
                    </div>

                    {hybridInsights.metadata && (
                      <div className="flex gap-4 p-4 bg-blue-50 rounded-lg">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{hybridInsights.metadata.totalInsights}</div>
                          <div className="text-xs text-gray-600">Total Insights</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-purple-600">{hybridInsights.metadata.openaiInsightsCount}</div>
                          <div className="text-xs text-gray-600">GPT-4</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{hybridInsights.metadata.cerebroInsightsCount}</div>
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
                                    <Badge variant={getPriorityColor(insight.priority)}>
                                      {insight.priority}
                                    </Badge>
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

                                <p className="text-xs text-gray-500 italic">
                                  Fuente: {insight.reasoningSource}
                                </p>
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
                    <p className="text-gray-600 mb-4">
                      Los insights híbridos no están disponibles en modo demo.
                    </p>
                    <Button onClick={() => router.push('/test/disc')}>
                      Realizar Test Real
                    </Button>
                  </div>
                )}
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
        </Tabs>
      </div>
    </div>
  )
}
