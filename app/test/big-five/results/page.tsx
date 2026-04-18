"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { createClient } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { useUser } from "@/hooks/use-user" // Import useUser hook
import {
  ArrowLeft,
  Brain,
  TrendingUp,
  Users,
  Target,
  Lightbulb,
  MessageSquare,
  BarChart3,
  PieChart,
  Radar,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Calendar,
  Heart,
  Home,
  BookOpen,
  Briefcase,
  Zap,
} from "lucide-react"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar as RechartsRadar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart as RechartsPieChart,
  Cell,
  Legend,
  Pie, // Import Pie from recharts
} from "recharts"
import { AiInsightsPanel } from "@/components/ai-insights-panel"
import { MultiTestInsights } from "@/components/multi-test-insights"
import { EnhancedCoachFlow } from "@/components/enhanced-coach-flow"
import { UnifiedTestSystem } from "@/lib/unified-test-system"
import { useSession } from "@/components/session-wrapper"
import { useToast } from "@/hooks/use-toast"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Checkbox } from "@/components/ui/checkbox"

interface TestResult {
  id: number
  user_email: string
  test_type: string
  test_name: string
  results: any
  score: number
  completed_at: string
  duration_minutes: number
}

interface AiInterpretation {
  id: number
  user_email: string
  test_name: string
  interpretation: string
  generated_at: string
  model_version: string
}

const factorNames = {
  O: "Apertura a la Experiencia",
  C: "Responsabilidad",
  E: "Extraversión",
  A: "Amabilidad",
  N: "Neuroticismo",
}

const factorDescriptions = {
  O: "Creatividad, curiosidad intelectual y apertura a nuevas experiencias",
  C: "Organización, disciplina y orientación hacia objetivos",
  E: "Sociabilidad, asertividad y búsqueda de estimulación",
  A: "Cooperación, confianza y orientación prosocial",
  N: "Tendencia a experimentar emociones negativas y estrés",
}

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7c7c", "#8dd1e1"]

export default function BigFiveResults() {
  const [testResult, setTestResult] = useState<TestResult | null>(null)
  const [aiInterpretation, setAiInterpretation] = useState<AiInterpretation | null>(null)
  const [userEmail, setUserEmail] = useState("")
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("summary")

  const { toast } = useToast()
  const router = useRouter()
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  const { user } = useUser() // Use user hook

  useEffect(() => {
    loadResults()
  }, [user])

  const loadResults = async () => {
    if (!user?.email) {
      router.push("/auth")
      return
    }

    setLoading(true)
    try {
      const email = user.email
      const result = await UnifiedTestSystem.loadTestResult(email, "Big Five")

      if (result.success && result.data) {
        setTestResult(result.data as TestResult)

        const { data: aiData, error: aiError } = await supabase
          .from("ai_interpretations")
          .select("*")
          .eq("user_email", email)
          .eq("test_name", "Big Five")
          .order("generated_at", { ascending: false })
          .limit(1)

        if (aiError) {
          console.error("Error loading AI interpretation:", aiError)
        } else if (aiData && aiData.length > 0) {
          setAiInterpretation(aiData[0])
        }
      } else {
        toast({
          title: "No se encontraron resultados",
          description: "No tienes resultados guardados para este test.",
          variant: "destructive",
        })
        router.push("/test/big-five")
      }
    } catch (error) {
      console.error("[v0] Error loading results:", error)
      toast({
        title: "Error al cargar resultados",
        description: "Hubo un problema cargando tus resultados.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple mx-auto mb-4"></div>
            <h3 className="text-lg font-semibold mb-2">Cargando Resultados</h3>
            <p className="text-muted/60">Preparando tu análisis personalizado...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!testResult) {
    return (
      <div className="min-h-screen bg-background">
        <Card className="w-96">
          <CardContent className="p-8 text-center">
            <AlertCircle className="h-12 w-12 text-orange mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron resultados</h3>
            <p className="text-muted/60 mb-4">Parece que aún no has completado el Test Big Five.</p>
            <Button onClick={() => router.push("/test/big-five")} className="bg-purple hover:bg-purple">
              Realizar Test
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const results = testResult.results
  const radarData = [
    { factor: "Apertura", value: results.O, fullMark: 100 },
    { factor: "Responsabilidad", value: results.C, fullMark: 100 },
    { factor: "Extraversión", value: results.E, fullMark: 100 },
    { factor: "Amabilidad", value: results.A, fullMark: 100 },
    { factor: "Estabilidad", value: 100 - results.N, fullMark: 100 },
  ]

  const barData = [
    { name: "Apertura", value: results.O, color: "#8884d8" },
    { name: "Responsabilidad", value: results.C, color: "#82ca9d" },
    { name: "Extraversión", value: results.E, color: "#ffc658" },
    { name: "Amabilidad", value: results.A, color: "#ff7c7c" },
    { name: "Estabilidad", value: 100 - results.N, color: "#8dd1e1" },
  ]

  const pieData = [
    { name: "Apertura", value: results.O, color: "#8884d8" },
    { name: "Responsabilidad", value: results.C, color: "#82ca9d" },
    { name: "Extraversión", value: results.E, color: "#ffc658" },
    { name: "Amabilidad", value: results.A, color: "#ff7c7c" },
    { name: "Estabilidad", value: 100 - results.N, color: "#8dd1e1" },
  ]

  return (
    <div className="min-h-screen bg-muted/5">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={() => router.push("/test")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Tests
          </Button>
          <Badge variant="secondary">
                  <Brain className="h-4 w-4 mr-1" />Despega Brújula
          </Badge>
        </div>

        <h1 className="text-4xl font-bold text-foreground mb-2">Resultados: Despega Brújula</h1>
        <p className="text-muted/60 mb-8">Tu perfil completo de personalidad según las cinco grandes dimensiones</p>

        {/* PUENTE DE TRANSICION SECTION */}
        <div className="mb-8 p-6 border-2 border-purple/30 bg-background950 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-purple" />
            <h2 className="text-2xl font-bold">Tu Puente de Transición</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-6">No es tu perfil fijo. Es cómo evolucionas en cada dimensión.</p>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-white dark:bg-background rounded border-l-4 border-blue/50">
              <h4 className="font-semibold mb-2">Eres Ahora</h4>
              <p className="text-xs text-muted-foreground">Tu perfil en las 5 dimensiones</p>
            </div>
            <div className="p-4 bg-white dark:bg-background rounded border-l-4 border-purple/50">
              <h4 className="font-semibold mb-2">Puedes Ser</h4>
              <p className="text-xs text-muted-foreground">Mayor flexibilidad y equilibrio en cada área</p>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-10 gap-2">
            <TabsTrigger value="summary" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Resumen
            </TabsTrigger>
            <TabsTrigger value="charts" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Gráficos
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Análisis
            </TabsTrigger>
            <TabsTrigger value="ai-analysis" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              Análisis IA
            </TabsTrigger>
            <TabsTrigger value="coach" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Coach IA
            </TabsTrigger>
            <TabsTrigger value="career" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Carrera
            </TabsTrigger>
            <TabsTrigger value="oportunidades">Oportunidades</TabsTrigger>
            <TabsTrigger value="conexiones">Conexiones</TabsTrigger>
            <TabsTrigger value="reflexion">Reflexión</TabsTrigger>
            <TabsTrigger value="plan-90-dias">Plan 90 Días</TabsTrigger>
            <TabsTrigger value="biblioteca">Biblioteca</TabsTrigger> {/* Added Biblioteca Tab Trigger */}
          </TabsList>

          <TabsContent value="summary" className="space-y-6">
            {/* CHANGE: Adding Resumen Ejecutivo Integral DTC at the beginning */}
            <Card className="mb-8 border-2 border-blue/20 bg-background">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Target className="w-6 h-6 text-blue" />
                  Resumen Ejecutivo Integral DTC
                </CardTitle>
                <CardDescription>Tu foto 360° y las ideas clave sobre tu personalidad</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Foto 360° */}
                <div className="bg-white rounded-lg p-6 border-l-4 border-blue">
                  <h3 className="font-semibold text-lg mb-4 text-blue">📸 Foto 360° de tu Perfil</h3>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-semibold text-blue">Apertura:</span>
                      <span className="ml-2 text-muted">
                        {results.O >= 70
                          ? "Curioso y creativo"
                          : results.O >= 40
                            ? "Equilibrado entre tradición e innovación"
                            : "Práctico y tradicional"}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-blue">Responsabilidad:</span>
                      <span className="ml-2 text-muted">
                        {results.C >= 70
                          ? "Organizado y disciplinado"
                          : results.C >= 40
                            ? "Flexible con estructura"
                            : "Espontáneo y adaptable"}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-blue">Extraversión:</span>
                      <span className="ml-2 text-muted">
                        {results.E >= 70
                          ? "Sociable y energético"
                          : results.E >= 40
                            ? "Ambiverte equilibrado"
                            : "Introspectivo y reflexivo"}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-blue">Amabilidad:</span>
                      <span className="ml-2 text-muted">
                        {results.A >= 70
                          ? "Empático y cooperativo"
                          : results.A >= 40
                            ? "Equilibrio entre asertividad y empatía"
                            : "Directo y competitivo"}
                      </span>
                    </div>
                    <div>
                      <span className="font-semibold text-blue">Estabilidad Emocional:</span>
                      <span className="ml-2 text-muted">
                        {100 - results.N >= 70
                          ? "Calmado y resiliente"
                          : 100 - results.N >= 40
                            ? "Sensible pero manejable"
                            : "Intenso emocionalmente"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Top 5 Ideas */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-blue">💡 Top 5 Ideas sobre tu Personalidad</h3>
                  <div className="space-y-3">
                    <div className="bg-blue/5 rounded-lg p-4 border-l-4 border-blue/40">
                      <span className="font-semibold text-blue">1. Cómo te ves a ti mismo:</span>
                      <p className="text-muted mt-1">
                        {results.O >= 60
                          ? "Te percibes como alguien curioso y abierto a nuevas experiencias."
                          : "Valoras la estabilidad y lo familiar sobre lo desconocido."}
                      </p>
                    </div>
                    <div className="bg-blue/5 rounded-lg p-4 border-l-4 border-indigo-400">
                      <span className="font-semibold text-indigo-900">2. Cómo te perciben otros:</span>
                      <p className="text-muted mt-1">
                        {results.E >= 60
                          ? "Te ven como alguien sociable y con energía contagiosa."
                          : "Te ven como alguien reflexivo y tranquilo."}
                      </p>
                    </div>
                    <div className="bg-purple/5 rounded-lg p-4 border-l-4 border-purple/40">
                      <span className="font-semibold text-purple">3. Tu estilo relacional:</span>
                      <p className="text-muted mt-1">
                        {results.A >= 60
                          ? "Priorizas la armonía y la empatía en tus relaciones."
                          : "Valoras la honestidad directa aunque genere fricción."}
                      </p>
                    </div>
                    <div className="bg-red/5 rounded-lg p-4 border-l-4 border-pink-400">
                      <span className="font-semibold text-pink-900">4. Tu enfoque de vida:</span>
                      <p className="text-muted mt-1">
                        {results.C >= 60
                          ? "Estructurado, con planes claros y seguimiento constante."
                          : "Espontáneo, adaptándote sobre la marcha."}
                      </p>
                    </div>
                    <div className="bg-red/5 rounded-lg p-4 border-l-4 border-red/40">
                      <span className="font-semibold text-red">5. Tu gestión emocional:</span>
                      <p className="text-muted mt-1">
                        {100 - results.N >= 60
                          ? "Mantienes la calma bajo presión."
                          : "Sientes las emociones intensamente, lo que te conecta profundamente con la vida."}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Mapa de Impacto */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-blue">🗺️ Mapa de Impacto en tu Vida</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="bg-background">
                      <h4 className="font-semibold text-green mb-2 flex items-center gap-2">
                        <Heart className="w-4 h-4" />
                        Vida Personal
                      </h4>
                      <p className="text-sm text-muted">
                        Tu estabilidad emocional ({100 - results.N}%) y apertura ({results.O}%) determinan tu bienestar
                        y satisfacción personal.
                      </p>
                    </div>
                    <div className="bg-background">
                      <h4 className="font-semibold text-purple mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Relaciones
                      </h4>
                      <p className="text-sm text-muted">
                        Tu amabilidad ({results.A}%) y extraversión ({results.E}%) impactan la calidad de tus vínculos
                        con familia, pareja y amigos.
                      </p>
                    </div>
                    <div className="bg-background">
                      <h4 className="font-semibold text-blue mb-2 flex items-center gap-2">
                        <Briefcase className="w-4 h-4" />
                        Trabajo
                      </h4>
                      <p className="text-sm text-muted">
                        Tu responsabilidad ({results.C}%) influye en tu productividad, pero recuerda: primero está tu
                        bienestar.
                      </p>
                    </div>
                  </div>
                </div>

                {/* 3 Movimientos Clave */}
                <div>
                  <h3 className="font-semibold text-lg mb-3 text-blue">
                    🎯 3 Movimientos Clave para los próximos 90 días
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 bg-white rounded-lg p-4 border border-muted/20">
                      <div className="bg-green/10 rounded-full p-2">
                        <Heart className="w-5 h-5 text-green" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">Personal:</h4>
                        <p className="text-sm text-muted mt-1">
                          {100 - results.N < 50
                            ? "Practica técnicas de regulación emocional diarias (respiración, meditación, journaling)."
                            : "Mantén tu estabilidad emocional explorando nuevos hobbies que te den alegría."}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-white rounded-lg p-4 border border-muted/20">
                      <div className="bg-purple/10 rounded-full p-2">
                        <Users className="w-5 h-5 text-purple" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">Relacional:</h4>
                        <p className="text-sm text-muted mt-1">
                          {results.A < 50
                            ? "Practica escucha activa y empatía en conversaciones con seres queridos."
                            : "Fortalece tus relaciones existentes con conversaciones profundas semanales."}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 bg-white rounded-lg p-4 border border-muted/20">
                      <div className="bg-blue/10 rounded-full p-2">
                        <Target className="w-5 h-5 text-blue" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-foreground">Laboral:</h4>
                        <p className="text-sm text-muted mt-1">
                          {results.C < 50
                            ? "Implementa un sistema simple de organización (to-do list o planner) sin obsesionarte."
                            : "Aplica tu organización natural a proyectos que te apasionen."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8 border-2 border-purple/20 bg-background">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Heart className="w-6 h-6 text-purple" />
                  Impacto en tu Vida Personal
                </CardTitle>
                <CardDescription>
                  Cómo tu perfil de personalidad influye en tus relaciones, bienestar y vida diaria
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
                      Tu nivel de Amabilidad ({results.A}%) determina qué tan empático y comprensivo eres con tus seres
                      queridos. Una alta amabilidad crea relaciones cálidas y de apoyo mutuo.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2 text-purple">
                      <Home className="w-5 h-5" />
                      Vida Familiar
                    </h3>
                    <p className="text-muted leading-relaxed">
                      Tu Responsabilidad ({results.C}%) impacta la organización del hogar. Equilibra estructura con
                      flexibilidad para que tu familia sienta tanto orden como libertad.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2 text-purple">
                      <Heart className="w-5 h-5" />
                      Bienestar Emocional
                    </h3>
                    <p className="text-muted leading-relaxed">
                      Tu Estabilidad Emocional ({100 - results.N}%) es clave para tu salud mental. Si es baja, prioriza
                      técnicas de regulación emocional y busca apoyo profesional si lo necesitas.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-semibold text-lg flex items-center gap-2 text-purple">
                      <Sparkles className="w-5 h-5" />
                      Desarrollo Personal
                    </h3>
                    <p className="text-muted leading-relaxed">
                      Tu Apertura ({results.O}%) refleja tu curiosidad por aprender y crecer. Una alta apertura te ayuda
                      a explorar nuevas experiencias que enriquecen tu vida personal.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border-l-4 border-purple">
                  <h3 className="font-semibold text-lg mb-3 text-purple">
                    💡 Recuerda: Tu personalidad impacta tu felicidad, no solo tu productividad
                  </h3>
                  <p className="text-muted leading-relaxed">
                    Los Big Five te ayudan a entender cómo te relacionas con otros, cómo manejas tus emociones, y cómo
                    construyes una vida significativa. El crecimiento personal siempre va primero que el éxito
                    profesional.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(factorNames).map(([key, name]) => {
                const score = key === "N" ? 100 - results[key] : results[key]
                const displayName = key === "N" ? "Estabilidad Emocional" : name
                return (
                  <Card key={key}>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{displayName}</CardTitle>
                      <CardDescription className="text-sm">
                        {factorDescriptions[key as keyof typeof factorDescriptions]}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-2xl font-bold text-purple">{score}%</span>
                        <Badge
                          variant={score >= 70 ? "default" : score >= 40 ? "secondary" : "outline"}
                          className={
                            score >= 70
                              ? "bg-green/10 text-green"
                              : score >= 40
                                ? "bg-yellow/10 text-yellow"
                                : "bg-red/10 text-red"
                          }
                        >
                          {score >= 70 ? "Alto" : score >= 40 ? "Medio" : "Bajo"}
                        </Badge>
                      </div>
                      <Progress value={score} className="h-2" />
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-green" />
                    Rasgos Principales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {results.primary_traits?.map((trait: string, index: number) => (
                      <Badge key={index} variant="secondary" className="mr-2 mb-2">
                        {trait}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-blue" />
                    Fortalezas Identificadas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {results.strengths?.slice(0, 3).map((strength: string, index: number) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="charts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Radar className="h-5 w-5" />
                    Perfil de Personalidad (Radar)
                  </CardTitle>
                  <CardDescription>Vista general de todos los factores</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="factor" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <RechartsRadar
                        name="Puntuación"
                        dataKey="value"
                        stroke="#8884d8"
                        fill="#8884d8"
                        fillOpacity={0.3}
                      />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Puntuaciones por Factor (Barras)
                  </CardTitle>
                  <CardDescription>Comparación directa de puntuaciones</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Distribución de Factores (Circular)
                </CardTitle>
                <CardDescription>Proporción relativa de cada factor</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RechartsPieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Análisis Detallado por Factor</CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-4">
                      {Object.entries(results.detailed_analysis || {}).map(([factor, analysis]) => (
                        <div key={factor} className="border-b pb-4 last:border-b-0">
                          <h4 className="font-semibold text-purple mb-2">
                            {factorNames[factor.charAt(0).toUpperCase() as keyof typeof factorNames] || factor}
                          </h4>
                          <p className="text-sm text-muted">{analysis as string}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Respuestas Abiertas</CardTitle>
                  <CardDescription>Tus respuestas a las preguntas de desarrollo</CardDescription>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-96">
                    <div className="space-y-4">
                      {results.open_responses &&
                        Object.entries(results.open_responses).map(([questionId, response]) => (
                          <div key={questionId} className="border-b pb-4 last:border-b-0">
                            <h4 className="font-semibold text-purple mb-2">Pregunta {questionId}</h4>
                            <p className="text-sm text-muted italic">"{response as string}"</p>
                          </div>
                        ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-orange" />
                  Áreas de Desarrollo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.development_areas?.map((area: string, index: number) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-orange/5 rounded-lg">
                      <AlertCircle className="h-4 w-4 text-orange mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{area}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-analysis">
            <div className="space-y-6">
              <MultiTestInsights userEmail={userEmail} currentTestType="Big Five" />
              <AiInsightsPanel
                testType="Big Five"
                testResults={results}
                aiInterpretation={aiInterpretation?.interpretation}
                userEmail={userEmail}
              />
            </div>
          </TabsContent>

          <TabsContent value="coach">
            <EnhancedCoachFlow testType="Big Five" testResults={results} userEmail={userEmail} />
          </TabsContent>

          <TabsContent value="career" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue" />
                    Recomendaciones Profesionales
                  </CardTitle>
                  <CardDescription>Roles que se alinean con tu perfil de personalidad</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.career_recommendations?.map((career: string, index: number) => (
                      <div key={index} className="flex items-center gap-3 p-3 bg-blue/5 rounded-lg">
                        <Users className="h-5 w-5 text-blue flex-shrink-0" />
                        <span className="font-medium">{career}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple" />
                    Resumen de Personalidad
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted mb-4">{results.personality_summary}</p>
                  <div className="space-y-2">
                    <h4 className="font-semibold text-purple">Rasgos Secundarios:</h4>
                    <div className="flex flex-wrap gap-2">
                      {results.secondary_traits?.map((trait: string, index: number) => (
                        <Badge key={index} variant="outline" className="bg-purple/5 text-purple">
                          {trait}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-green" />
                  Plan de Acción Personalizado
                </CardTitle>
                <CardDescription>Pasos recomendados para tu desarrollo profesional</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-green mb-3">Fortalezas a Potenciar:</h4>
                    <ul className="space-y-2">
                      {results.strengths?.slice(0, 3).map((strength: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-orange mb-3">Áreas de Mejora:</h4>
                    <ul className="space-y-2">
                      {results.development_areas?.slice(0, 3).map((area: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <AlertCircle className="h-4 w-4 text-orange mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="oportunidades" className="space-y-6">
            <Card className="border-l-4 border-l-amber-500">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-yellow" />
                  Oportunidades de Desarrollo
                </CardTitle>
                <CardDescription>Áreas específicas donde puedes crecer basadas en tu perfil Big Five</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-background">
                  <h3 className="text-lg font-semibold mb-3">Por qué estas oportunidades son relevantes para ti</h3>
                  <p className="text-sm text-muted">
                    Tu perfil Big Five con Apertura: {results.O}%, Responsabilidad: {results.C}%, Extraversión:{" "}
                    {results.E}%, Amabilidad: {results.A}%, Estabilidad Emocional: {100 - results.N}% revela patrones
                    únicos de tu personalidad profunda. Estas oportunidades están diseñadas para potenciar tus rasgos
                    naturales y desarrollar áreas que amplíen tu efectividad personal y profesional.
                  </p>
                </div>

                <Card className="border-l-4 border-l-blue-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-blue" />
                      1. Desarrollo de Apertura Mental
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-blue/5 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue mb-2">Oportunidad Principal</h4>
                      <p className="text-sm text-blue">
                        {results.O > 70
                          ? "Canalizar tu alta apertura hacia proyectos innovadores que generen impacto real en tu comunidad o industria."
                          : results.O < 40
                            ? "Expandir tu zona de confort explorando nuevas perspectivas, culturas y formas de pensar sin juzgar prematuramente."
                            : "Balancear tu apertura moderada con momentos de exploración activa y períodos de consolidación práctica."}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Acciones Concretas:</h4>
                      <ul className="space-y-2">
                        <li className="flex gap-3">
                          <span className="text-blue font-bold">→</span>
                          <div>
                            <strong>Reto de Perspectivas (semanal):</strong> Lee un artículo de opinión con el que
                            normalmente no estarías de acuerdo e identifica 3 puntos válidos.
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-blue font-bold">→</span>
                          <div>
                            <strong>Experiencia Cultural:</strong> Una vez al mes, sumérgete en una expresión cultural
                            completamente nueva (música, cocina, arte, filosofía).
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-blue font-bold">→</span>
                          <div>
                            <strong>Diario de Ideas:</strong> Dedica 10 minutos diarios a escribir ideas creativas sin
                            filtro, sin preocuparte por su viabilidad.
                          </div>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-green-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-green" />
                      2. Fortalecimiento de Responsabilidad
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-green/5 p-4 rounded-lg">
                      <h4 className="font-semibold text-green mb-2">Oportunidad Principal</h4>
                      <p className="text-sm text-green">
                        {results.C > 70
                          ? "Usar tu alta disciplina para enseñar sistemas de productividad a otros, consolidando tu maestría."
                          : results.C < 40
                            ? "Desarrollar estructuras mínimas viables que te den libertad sin caer en el caos."
                            : "Optimizar tu nivel actual de organización identificando el 20% de hábitos que generan el 80% de resultados."}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Acciones Concretas:</h4>
                      <ul className="space-y-2">
                        <li className="flex gap-3">
                          <span className="text-green font-bold">→</span>
                          <div>
                            <strong>Sistema de 3 Prioridades:</strong> Cada mañana, identifica solo 3 cosas no
                            negociables para el día.
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-green font-bold">→</span>
                          <div>
                            <strong>Revisión Semanal:</strong> Dedica 30 minutos cada domingo a revisar logros y ajustar
                            la próxima semana.
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-green font-bold">→</span>
                          <div>
                            <strong>Accountability Partner:</strong> Encuentra alguien con quien compartir metas
                            semanales y hacer check-ins.
                          </div>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-purple-500">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Users className="h-5 w-5 text-purple" />
                      3. Expansión de Conexión Social (Extraversión)
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-purple/5 p-4 rounded-lg">
                      <h4 className="font-semibold text-purple mb-2">Oportunidad Principal</h4>
                      <p className="text-sm text-purple">
                        {results.E > 70
                          ? "Convertir tu energía social en liderazgo de comunidad, creando espacios donde otros también puedan conectar."
                          : results.E < 40
                            ? "Desarrollar conexiones profundas 1-a-1 que te nutran sin agotarte, respetando tu necesidad de soledad."
                            : "Alternar intencionalmente entre momentos de conexión social activa y períodos de recarga en soledad."}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Acciones Concretas:</h4>
                      <ul className="space-y-2">
                        <li className="flex gap-3">
                          <span className="text-purple font-bold">→</span>
                          <div>
                            <strong>Mapeo de Energía Social:</strong> Durante una semana, registra qué interacciones te
                            energizan vs. te agotan.
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-purple font-bold">→</span>
                          <div>
                            <strong>Círculo Intencional:</strong> Identifica 5 personas clave con quienes quieres
                            profundizar relación y programa tiempo mensual con cada una.
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-purple font-bold">→</span>
                          <div>
                            <strong>Experimento Social:</strong> Si eres introvertido, prueba una actividad grupal
                            nueva. Si eres extrovertido, pasa un día completo en soledad reflexiva.
                          </div>
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-orange">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Brain className="h-5 w-5 text-orange" />
                      4. Cultivo de Estabilidad Emocional
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-orange/5 p-4 rounded-lg">
                      <h4 className="font-semibold text-orange mb-2">Oportunidad Principal</h4>
                      <p className="text-sm text-orange">
                        {results.N < 30
                          ? "Usar tu estabilidad para ser ancla emocional de otros en momentos de crisis, desarrollando liderazgo resiliente."
                          : results.N > 70
                            ? "Desarrollar herramientas de regulación emocional que te permitan navegar la intensidad sin ser abrumado."
                            : "Fortalecer tu capacidad de mantener calma en presión sin perder la sensibilidad emocional."}
                      </p>
                    </div>

                    <div>
                      <h4 className="font-semibold mb-3">Acciones Concretas:</h4>
                      <ul className="space-y-2">
                        <li className="flex gap-3">
                          <span className="text-orange font-bold">→</span>
                          <div>
                            <strong>Práctica de Mindfulness (diaria):</strong> 5 minutos de respiración consciente antes
                            de eventos estresantes.
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-orange font-bold">→</span>
                          <div>
                            <strong>Diario de Emociones:</strong> Al final del día, nombra 3 emociones que sentiste y
                            qué las provocó, sin juzgarlas.
                          </div>
                        </li>
                        <li className="flex gap-3">
                          <span className="text-orange font-bold">→</span>
                          <div>
                            <strong>Red de Apoyo:</strong> Identifica 2-3 personas de confianza con quienes puedas
                            hablar cuando te sientas emocionalmente desbordado.
                          </div>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-background">
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

                <div className="bg-background">
                  <h3 className="text-lg font-semibold mb-2">Próximo Paso</h3>
                  <p className="text-sm opacity-90 mb-4">
                    Elige UNA oportunidad que resuene contigo y conviértela en un compromiso de 30 días. El cambio real
                    viene de la acción consistente.
                  </p>
                  <Button variant="secondary" size="sm">
                    Crear Plan de Acción
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="conexiones" className="space-y-6">
            <Card className="border-l-4 border-l-indigo-500">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Brain className="h-6 w-6 text-blue" />
                  Conexión con Otros Módulos DTC
                </CardTitle>
                <CardDescription>Cómo Big Five se integra con los demás tests del ecosistema DTC</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-background">
                  <h3 className="text-lg font-semibold mb-3">El Mapa Completo de Tu Personalidad</h3>
                  <p className="text-sm text-muted mb-4">
                    Big Five mide los rasgos profundos de tu personalidad, la base sobre la cual se construyen tus
                    comportamientos (DISC), emociones (IE), preferences (MBTI), intereses (RIASEC) y habilidades (Soft
                    Skills). Es la arquitectura fundamental de quién eres.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <Card className="border-2 border-blue/30">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue/10 rounded-full flex items-center justify-center text-lg">
                          💼
                        </div>
                        Despega Cerebral (DISC)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="bg-blue/5 p-3 rounded text-sm">
                        <strong className="text-blue">Conexión:</strong>
                        <p className="text-blue mt-1">
                          Big Five mide RASGOS profundos, DISC mide COMPORTAMIENTOS visibles. Tus rasgos influyen en
                          cómo te comportas.
                        </p>
                      </div>
                      <div className="text-sm">
                        <strong>Ejemplo:</strong> Alta Extraversión (Big Five) + Alto I (DISC) = Comunicador natural
                        energético. Alta Extraversión + Bajo I = Energía social que no se traduce en influencia.
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full bg-transparent"
                        onClick={() => router.push("/test/disc")}
                      >
                        Hacer Test DISC
                      </Button>
                    </CardContent>
                  </Card>

                  <Card className="border-2 border-red/30">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <div className="w-8 h-8 bg-red/10 rounded-full flex items-center justify-center text-lg">
                          ❤️
                        </div>
                        Inteligencia Emocional Despega
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="bg-red/5 p-3 rounded text-sm">
                        <strong className="text-red">Conexión:</strong>
                        <p className="text-red mt-1">
                          Big Five muestra tu TENDENCIA emocional natural (Neuroticismo), IE mide tu HABILIDAD para
                          manejar emociones.
                        </p>
                      </div>
                      <div className="text-sm">
                        <strong>Ejemplo:</strong> Alto Neuroticismo + Alta IE = Sientes intensamente pero sabes
                        regularte. Bajo Neuroticismo + Baja IE = Estable pero desconectado emocionalmente.
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

                  <Card className="border-2 border-purple/30">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <div className="w-8 h-8 bg-purple/10 rounded-full flex items-center justify-center text-lg">
                          🧠
                        </div>
                        Mapa de Personalidad Despega (MBTI)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="bg-purple/5 p-3 rounded text-sm">
                        <strong className="text-purple">Conexión:</strong>
                        <p className="text-purple mt-1">
                          Big Five es DIMENSIONAL (grados), MBTI es TIPOLÓGICO (categorías). Se complementan, no
                          compiten.
                        </p>
                      </div>
                      <div className="text-sm">
                        <strong>Ejemplo:</strong> Alta Extraversión + INTJ = Líder visionario que disfruta debates
                        intelectuales. Baja Extraversión + ENFP = Creativo introspectivo con conexiones profundas.
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

                  <Card className="border-2 border-green/30">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <div className="w-8 h-8 bg-green/10 rounded-full flex items-center justify-center text-lg">
                          🎯
                        </div>
                        Brújula Vocacional Despega (RIASEC)
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="bg-green/5 p-3 rounded text-sm">
                        <strong className="text-green">Conexión:</strong>
                        <p className="text-green mt-1">
                          Big Five predice qué AMBIENTES laborales encajan contigo, RIASEC predice qué ACTIVIDADES te
                          motivan.
                        </p>
                      </div>
                      <div className="text-sm">
                        <strong>Ejemplo:</strong> Alta Apertura + tipo Artístico = Diseñador innovador. Alta
                        Responsabilidad + tipo Convencional = Auditor financiero de élite.
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

                  <Card className="border-2 border-yellow/30">
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <div className="w-8 h-8 bg-yellow/10 rounded-full flex items-center justify-center text-lg">
                          💡
                        </div>
                        Competencias Blandas Despega
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="bg-yellow/5 p-3 rounded text-sm">
                        <strong className="text-yellow">Conexión:</strong>
                        <p className="text-yellow mt-1">
                          Big Five muestra PREDISPOSICIONES naturales, Soft Skills mide COMPETENCIAS desarrolladas a
                          través de experiencia.
                        </p>
                      </div>
                      <div className="text-sm">
                        <strong>Ejemplo:</strong> Baja Amabilidad + Alta empatía entrenada = Líder directo pero
                        empático. Alta Amabilidad + Baja asertividad = Necesita entrenar límites.
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
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple" />
                      Casos de Sinergia Big Five + Otros Tests
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="bg-background">
                      <h4 className="font-semibold mb-2">Caso 1: El Innovador Estructurado</h4>
                      <ul className="space-y-1 text-sm">
                        <li>
                          • <strong>Big Five:</strong> Alta Apertura + Alta Responsabilidad = Creativo disciplinado
                        </li>
                        <li>
                          • <strong>DISC:</strong> Alto D + Alto C = Ejecutor perfeccionista
                        </li>
                        <li>
                          • <strong>RIASEC:</strong> Investigador + Emprendedor = Fundador de startup tech
                        </li>
                        <li>
                          • <strong>Insight DTC:</strong> Puede crear innovación sistemática, pero necesita equipo que
                          ejecute detalles
                        </li>
                      </ul>
                    </div>

                    <div className="bg-background">
                      <h4 className="font-semibold mb-2">Caso 2: El Líder Empático</h4>
                      <ul className="space-y-1 text-sm">
                        <li>
                          • <strong>Big Five:</strong> Alta Amabilidad + Baja Extraversión = Líder servicial
                          introvertido
                        </li>
                        <li>
                          • <strong>IE:</strong> Alta empatía + Alta regulación emocional
                        </li>
                        <li>
                          • <strong>Soft Skills:</strong> Alta escucha activa, baja auto-promoción
                        </li>
                        <li>
                          • <strong>Insight DTC:</strong> Excelente para liderar equipos técnicos, necesita trabajar
                          visibilidad
                        </li>
                      </ul>
                    </div>

                    <div className="bg-background">
                      <h4 className="font-semibold mb-2">Caso 3: El Ejecutor Volátil</h4>
                      <ul className="space-y-1 text-sm">
                        <li>
                          • <strong>Big Five:</strong> Alta Responsabilidad + Alto Neuroticismo = Perfeccionista ansioso
                        </li>
                        <li>
                          • <strong>DISC:</strong> Alto C + Bajo S = Crítico con otros y consigo mismo
                        </li>
                        <li>
                          • <strong>IE:</strong> Baja regulación emocional bajo presión
                        </li>
                        <li>
                          • <strong>Insight DTC:</strong> Alto desempeño pero riesgo de burnout. Urgente desarrollar IE
                          y prácticas de autocuidado
                        </li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <div className="bg-background">
                  <h3 className="text-lg font-semibold mb-2">Recomendación DTC</h3>
                  <p className="text-sm opacity-90 mb-4">
                    Big Five es tu fundamento. Para obtener el mapa completo, combínalo con DISC (comportamiento
                    laboral) + IE (manejo emocional). Esto te da una visión 360 grados de ti mismo.
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
                  <Lightbulb className="h-6 w-6 text-red" />
                  Preguntas de Reflexión Profunda
                </CardTitle>
                <CardDescription>Conecta tu perfil Big Five con tu vida real y propósito</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-background">
                  <h3 className="text-lg font-semibold mb-3">Por qué reflexionar sobre tu perfil Big Five</h3>
                  <p className="text-sm text-muted mb-4">
                    Big Five no es solo estadística, es el mapa de tu arquitectura psicológica. Estas preguntas te
                    ayudan a traducir los números en autoconocimiento aplicado: cómo tus rasgos moldean tus decisiones,
                    relaciones y camino de vida.
                  </p>
                </div>

                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base text-purple">
                        1. ¿Cuál de los 5 factores siento que me define más auténticamente? ¿Por qué?
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted/60 mb-3">
                        Reflexiona sobre cuál dimensión (Apertura, Responsabilidad, Extraversión, Amabilidad,
                        Estabilidad) resuena más profundamente con tu identidad.
                      </p>
                      <textarea
                        placeholder="Escribe tu reflexión aquí..."
                        className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base text-purple">
                        2. ¿En qué momentos de mi vida he actuado completamente FUERA de mi perfil Big Five natural?
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted/60 mb-3">
                        Identifica situaciones donde te comportaste de forma contraria a tus rasgos. ¿Qué provocó ese
                        cambio? ¿Fue positivo o costoso?
                      </p>
                      <textarea
                        placeholder="Escribe tu reflexión aquí..."
                        className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base text-purple">
                        3. Si pudiera "ajustar" UNO de mis rasgos Big Five, ¿cuál sería y hacia qué dirección?
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted/60 mb-3">
                        No para cambiarte, sino para entender qué aspecto de ti sientes que limita tu potencial. ¿Es
                        real o es juicio externo?
                      </p>
                      <textarea
                        placeholder="Escribe tu reflexión aquí..."
                        className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base text-purple">
                        4. ¿Cómo mi perfil Big Five ha afectado mis relaciones más importantes (pareja, familia,
                        amigos)?
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted/60 mb-3">
                        Ejemplo: Baja Amabilidad puede causar conflictos pero también establecer límites sanos. Alta
                        Amabilidad puede crear armonía pero también sacrificar necesidades propias.
                      </p>
                      <textarea
                        placeholder="Escribe tu reflexión aquí..."
                        className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base text-purple">
                        5. ¿Qué decisiones importantes he tomado que fueron ALINEADAS vs. CONTRA mi perfil Big Five?
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted/60 mb-3">
                        Carreras, relaciones, lugares de vida. ¿Cuáles resultaron mejor? Esto revela cuándo seguir tu
                        naturaleza vs. cuándo crecer más allá de ella.
                      </p>
                      <textarea
                        placeholder="Escribe tu reflexión aquí..."
                        className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base text-purple">
                        6. ¿Hay algún rasgo Big Five que la gente malinterpreta sobre mí?
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted/60 mb-3">
                        Ejemplo: Baja Extraversión no es timidez, es preferencia por profundidad. Alta Apertura no es
                        falta de practicidad, es capacidad de ver posibilidades.
                      </p>
                      <textarea
                        placeholder="Escribe tu reflexión aquí..."
                        className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base text-purple">
                        7. ¿Qué tipo de persona admiro que tenga un perfil Big Five OPUESTO al mío?
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted/60 mb-3">
                        Si eres highly Responsable, quizás admiras a alguien espontáneo. Si eres muy Estable, quizás
                        admiras la pasión emocional de alguien. ¿Qué te enseña eso sobre lo que necesitas integrar?
                      </p>
                      <textarea
                        placeholder="Escribe tu reflexión aquí..."
                        className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base text-purple">
                        8. ¿Mi trabajo actual me permite expresar mis rasgos Big Five naturales o me obliga a
                        reprimirlos?
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted/60 mb-3">
                        Si tu trabajo contradice constantemente tus rasgos, el costo emocional será alto. ¿Es temporal o
                        insostenible?
                      </p>
                      <textarea
                        placeholder="Escribe tu reflexión aquí..."
                        className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base text-purple">
                        9. ¿Cuál de mis rasgos Big Five ha sido mi mayor FORTALEZA y mi mayor DEBILIDAD simultáneamente?
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted/60 mb-3">
                        Ejemplo: Alta Responsabilidad = éxito profesional pero también rigidez. Alta Amabilidad =
                        relaciones profundas pero dificultad para decir no.
                      </p>
                      <textarea
                        placeholder="Escribe tu reflexión aquí..."
                        className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base text-purple">
                        10. ¿Si tuviera que diseñar mi vida IDEAL basándome únicamente en mi perfil Big Five, ¿cómo se
                        vería?
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted/60 mb-3">
                        Describe tu día típico, tipo de trabajo, relaciones, hobbies, entorno. ¿Qué tan diferente es de
                        tu vida actual? ¿Qué puedes empezar a cambiar YA?
                      </p>
                      <textarea
                        placeholder="Escribe tu reflexión aquí..."
                        className="w-full min-h-[100px] p-3 border rounded-lg focus:ring-2 focus:ring-purple-500"
                      />
                    </CardContent>
                  </Card>
                </div>

                <div className="bg-background">
                  <h3 className="text-lg font-semibold mb-2">Comparte tu reflexión con tu Coach IA</h3>
                  <p className="text-sm opacity-90 mb-4">
                    Las preguntas profundas se responden mejor en conversación. Habla con Sofia o Dani para explorar tus
                    respuestas y descubrir patrones que no habías visto.
                  </p>
                  <Button variant="secondary" size="sm" onClick={() => setActiveTab("coach")}>
                    Hablar con Coach IA
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="plan-90-dias" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple" />
                  Plan de Acción 90 Días - Desarrollo de Rasgos Big Five
                </CardTitle>
                <CardDescription>
                  Optimiza tus rasgos de personalidad con acciones concretas durante los próximos 3 meses
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Progress Overview */}
                <div className="bg-background">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">Progreso Total del Plan</span>
                    <span className="text-sm text-muted-foreground">0/12 semanas completadas</span>
                  </div>
                  <Progress value={0} className="h-2" />
                </div>

                <Accordion type="single" collapsible className="w-full">
                  {/* Mes 1: Apertura y Responsabilidad */}
                  <AccordionItem value="mes-1">
                    <AccordionTrigger className="text-lg font-semibold">
                      <div className="flex items-center gap-2">
                        <div className="bg-blue/50 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">
                          1
                        </div>
                        Mes 1: Apertura a la Experiencia y Responsabilidad
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <p className="text-muted-foreground">
                        Desarrolla tu curiosidad intelectual y tu capacidad de organización
                      </p>

                      <div className="grid gap-4">
                        <Card className="border-l-4 border-l-blue-500">
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2">Semana 1-2: Expandir Apertura</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <Checkbox id="bf-m1s1-1" />
                                <label htmlFor="bf-m1s1-1">
                                  Leer un libro de un género completamente nuevo para ti
                                </label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="bf-m1s1-2" />
                                <label htmlFor="bf-m1s1-2">Probar una actividad artística o creativa nueva</label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="bf-m1s1-3" />
                                <label htmlFor="bf-m1s1-3">
                                  Tener una conversación profunda sobre filosofía o ideas abstractas
                                </label>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-blue-500">
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2">Semana 3-4: Fortalecer Responsabilidad</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <Checkbox id="bf-m1s2-1" />
                                <label htmlFor="bf-m1s2-1">
                                  Implementar un sistema de organización personal (GTD, Bullet Journal, etc.)
                                </label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="bf-m1s2-2" />
                                <label htmlFor="bf-m1s2-2">
                                  Establecer y cumplir 3 metas pequeñas con fechas límite
                                </label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="bf-m1s2-3" />
                                <label htmlFor="bf-m1s2-3">Crear una rutina matutina y mantenerla por 2 semanas</label>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="bg-blue/5 dark:bg-blue/20 p-3 rounded-lg">
                        <p className="text-sm">
                          <strong>KPI del Mes:</strong> Completar 3 experiencias nuevas y establecer sistema de
                          organización
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Mes 2: Extraversión y Amabilidad */}
                  <AccordionItem value="mes-2">
                    <AccordionTrigger className="text-lg font-semibold">
                      <div className="flex items-center gap-2">
                        <div className="bg-green/50 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">
                          2
                        </div>
                        Mes 2: Extraversión y Amabilidad
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <p className="text-muted-foreground">
                        Mejora tus habilidades sociales y tu capacidad de conexión con otros
                      </p>

                      <div className="grid gap-4">
                        <Card className="border-l-4 border-l-green-500">
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2">Semana 5-6: Desarrollar Extraversión</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <Checkbox id="bf-m2s1-1" />
                                <label htmlFor="bf-m2s1-1">Iniciar conversación con 2 personas nuevas por semana</label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="bf-m2s1-2" />
                                <label htmlFor="bf-m2s1-2">Asistir a un evento social o networking</label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="bf-m2s1-3" />
                                <label htmlFor="bf-m2s1-3">
                                  Practicar hablar en público (reunión, presentación informal)
                                </label>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-green-500">
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2">Semana 7-8: Cultivar Amabilidad</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <Checkbox id="bf-m2s2-1" />
                                <label htmlFor="bf-m2s2-1">Realizar 3 actos de bondad aleatorios por semana</label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="bf-m2s2-2" />
                                <label htmlFor="bf-m2s2-2">
                                  Practicar dar feedback constructivo a colegas o amigos
                                </label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="bf-m2s2-3" />
                                <label htmlFor="bf-m2s2-3">Meditar sobre compasión o practicar gratitud diaria</label>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="bg-green/5 dark:bg-green/20 p-3 rounded-lg">
                        <p className="text-sm">
                          <strong>KPI del Mes:</strong> Expandir red de contactos en 5 personas, 12 actos de bondad
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  {/* Mes 3: Neuroticismo y Estabilidad */}
                  <AccordionItem value="mes-3">
                    <AccordionTrigger className="text-lg font-semibold">
                      <div className="flex items-center gap-2">
                        <div className="bg-purple/50 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">
                          3
                        </div>
                        Mes 3: Estabilidad Emocional e Integración
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="space-y-4 pt-4">
                      <p className="text-muted-foreground">
                        Fortalece tu resiliencia emocional e integra todos los rasgos
                      </p>

                      <div className="grid gap-4">
                        <Card className="border-l-4 border-l-purple-500">
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2">Semana 9-10: Reducir Neuroticismo</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <Checkbox id="bf-m3s1-1" />
                                <label htmlFor="bf-m3s1-1">
                                  Establecer práctica diaria de mindfulness (10 min/día)
                                </label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="bf-m3s1-2" />
                                <label htmlFor="bf-m3s1-2">
                                  Identificar y desafiar 5 patrones de pensamiento negativo
                                </label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="bf-m3s1-3" />
                                <label htmlFor="bf-m3s1-3">Crear un plan de manejo del estrés personalizado</label>
                              </div>
                            </div>
                          </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-purple-500">
                          <CardContent className="p-4">
                            <h4 className="font-medium mb-2">Semana 11-12: Integración de los 5 Rasgos</h4>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-start gap-2">
                                <Checkbox id="bf-m3s2-1" />
                                <label htmlFor="bf-m3s2-1">
                                  Crear perfil integrado de tus 5 rasgos con fortalezas y áreas de mejora
                                </label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="bf-m3s2-2" />
                                <label htmlFor="bf-m3s2-2">
                                  Diseñar plan de desarrollo continuo basado en tu perfil Big Five
                                </label>
                              </div>
                              <div className="flex items-start gap-2">
                                <Checkbox id="bf-m3s2-3" />
                                <label htmlFor="bf-m3s2-3">Compartir aprendizajes con alguien de confianza</label>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div className="bg-purple/5 dark:bg-purple/20 p-3 rounded-lg">
                        <p className="text-sm">
                          <strong>KPI del Mes:</strong> Plan de manejo del estrés activo + perfil Big Five integrado
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* CHANGE: Adding Biblioteca tab */}
          <TabsContent value="biblioteca" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-blue" />
                  Biblioteca DTC Recomendada para tu Perfil
                </CardTitle>
                <CardDescription>
                  Recursos específicos según tus rasgos de personalidad Big Five, con desafíos de 7 días
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-blue/5 border-b-2 border-blue/20">
                        <th className="text-left p-4 font-semibold text-blue">Área de Desarrollo</th>
                        <th className="text-left p-4 font-semibold text-blue">Recurso Recomendado</th>
                        <th className="text-left p-4 font-semibold text-blue">Por qué es relevante</th>
                        <th className="text-left p-4 font-semibold text-blue">Mini Desafío (7 días)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-muted/20 hover:bg-muted/5">
                        <td className="p-4 font-medium text-foreground">
                          <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4 text-red" />
                            Estabilidad Emocional
                          </div>
                        </td>
                        <td className="p-4 text-muted">
                          <span className="font-medium">Guía de Mindfulness</span>
                          <p className="text-sm text-muted/50 mt-1">Práctica de 10 minutos diarios</p>
                        </td>
                        <td className="p-4 text-sm text-muted/60">
                          {100 - results.N < 50
                            ? "Tu neuroticismo elevado indica que técnicas de regulación emocional serían muy beneficiosas para ti."
                            : "Mantén tu estabilidad emocional con prácticas que profundicen tu bienestar."}
                        </td>
                        <td className="p-4 text-sm text-muted">
                          Medita 10 min al despertar durante 7 días seguidos. Anota cómo te sientes antes y después.
                        </td>
                      </tr>
                      <tr className="border-b border-muted/20 hover:bg-muted/5">
                        <td className="p-4 font-medium text-foreground">
                          <div className="flex items-center gap-2">
                            <Users className="w-4 h-4 text-purple/50" />
                            Relaciones Interpersonales
                          </div>
                        </td>
                        <td className="p-4 text-muted">
                          <span className="font-medium">Taller de Empatía Activa</span>
                          <p className="text-sm text-muted/50 mt-1">Ejercicios de escucha</p>
                        </td>
                        <td className="p-4 text-sm text-muted/60">
                          {results.A >= 60
                            ? "Tu alta amabilidad es una fortaleza. Aprende a balancearla con asertividad."
                            : "Aumentar tu empatía mejorará significativamente tus relaciones personales."}
                        </td>
                        <td className="p-4 text-sm text-muted">
                          Practica escucha sin interrumpir en 3 conversaciones profundas con personas cercanas.
                        </td>
                      </tr>
                      <tr className="border-b border-muted/20 hover:bg-muted/5">
                        <td className="p-4 font-medium text-foreground">
                          <div className="flex items-center gap-2">
                            <Lightbulb className="w-4 h-4 text-orange" />
                            Creatividad Personal
                          </div>
                        </td>
                        <td className="p-4 text-muted">
                          <span className="font-medium">Programa de Creatividad Diaria</span>
                          <p className="text-sm text-muted/50 mt-1">30 ideas en 30 días</p>
                        </td>
                        <td className="p-4 text-sm text-muted/60">
                          {results.O >= 60
                            ? "Tu alta apertura necesita canales creativos para expresarse plenamente."
                            : "Desarrollar tu creatividad te abrirá nuevas perspectivas de vida."}
                        </td>
                        <td className="p-4 text-sm text-muted">
                          Escribe 3 ideas nuevas cada mañana durante 7 días. No las juzgues, solo escribe.
                        </td>
                      </tr>
                      <tr className="border-b border-muted/20 hover:bg-muted/5">
                        <td className="p-4 font-medium text-foreground">
                          <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-blue/50" />
                            Organización Personal
                          </div>
                        </td>
                        <td className="p-4 text-muted">
                          <span className="font-medium">Sistema GTD Simplificado</span>
                          <p className="text-sm text-muted/50 mt-1">Getting Things Done adaptado</p>
                        </td>
                        <td className="p-4 text-sm text-muted/60">
                          {results.C >= 60
                            ? "Optimiza tu alta responsabilidad con sistemas que te den más libertad."
                            : "Un sistema básico de organización reducirá tu estrés significativamente."}
                        </td>
                        <td className="p-4 text-sm text-muted">
                          Usa una lista simple de tareas diarias. Al final del día, revisa qué lograste.
                        </td>
                      </tr>
                      <tr className="border-b border-muted/20 hover:bg-muted/5">
                        <td className="p-4 font-medium text-foreground">
                          <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-orange" />
                            Energía Social
                          </div>
                        </td>
                        <td className="p-4 text-muted">
                          <span className="font-medium">Guía de Conexión Social</span>
                          <p className="text-sm text-muted/50 mt-1">Para introvertidos y extrovertidos</p>
                        </td>
                        <td className="p-4 text-sm text-muted/60">
                          {results.E >= 60
                            ? "Canaliza tu extraversión en conexiones de calidad, no solo cantidad."
                            : "Aprende a recargar energía social de forma que respete tu introversión."}
                        </td>
                        <td className="p-4 text-sm text-muted">
                          {results.E >= 60
                            ? "Organiza 1 encuentro de calidad con alguien importante para ti."
                            : "Programa 2 momentos sociales cortos pero significativos esta semana."}
                        </td>
                      </tr>
                      <tr className="border-b border-muted/20 hover:bg-muted/5">
                        <td className="p-4 font-medium text-foreground">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-red" />
                            Desarrollo Integral
                          </div>
                        </td>
                        <td className="p-4 text-muted">
                          <span className="font-medium">Plan de Vida Holístico</span>
                          <p className="text-sm text-muted/50 mt-1">Bienestar 360°</p>
                        </td>
                        <td className="p-4 text-sm text-muted/60">
                          Integra todos tus rasgos en un plan coherente que priorice tu felicidad y relaciones.
                        </td>
                        <td className="p-4 text-sm text-muted">
                          Dedica 1 hora a escribir tu visión de vida ideal en 3 áreas: personal, relaciones y propósito.
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 bg-blue/5 rounded-lg p-6 border-l-4 border-blue">
                  <h3 className="font-semibold text-lg mb-2 text-blue">💡 Enfoque DTC: Vida Personal Primero</h3>
                  <p className="text-muted leading-relaxed">
                    Estos recursos están diseñados para mejorar tu bienestar, tus relaciones y tu desarrollo personal
                    antes que tu productividad laboral. El éxito profesional es consecuencia de una vida personal
                    equilibrada y satisfactoria.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
