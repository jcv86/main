"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@supabase/supabase-js"
import { useRouter, useSearchParams } from "next/navigation"
import AICoachChat from "@/components/ai-coach-chat"
import AIInsightsPanel from "@/components/ai-insights-panel"
import { aiCoach } from "@/lib/ai-coach"
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
} from "recharts"
import {
  Lightbulb,
  ArrowLeft,
  Download,
  Share2,
  TrendingUp,
  Users,
  Target,
  Brain,
  Star,
  BookOpen,
  Award,
  Briefcase,
  Sparkles,
} from "lucide-react"

interface MBTIResults {
  type: string
  type_name: string
  type_description: string
  scores: {
    E: number
    I: number
    S: number
    N: number
    T: number
    F: number
    J: number
    P: number
  }
  traits: string[]
}

export default function MBTIResults() {
  const [results, setResults] = useState<MBTIResults | null>(null)
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState("")
  const [aiInterpretation, setAiInterpretation] = useState("")
  const [loadingInterpretation, setLoadingInterpretation] = useState(false)

  const router = useRouter()
  const searchParams = useSearchParams()
  const isDemo = searchParams.get("demo") === "true"
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  useEffect(() => {
    if (isDemo) {
      loadDemoData()
    } else {
      checkUserAndLoadResults()
    }
  }, [isDemo])

  const loadDemoData = () => {
    const demoResults: MBTIResults = {
      type: "ENTJ",
      type_name: "El Comandante",
      type_description: "Líder audaz, imaginativo y con voluntad fuerte",
      scores: { E: 12, I: 8, N: 14, S: 6, T: 15, F: 5, J: 13, P: 7 },
      traits: ["Líder natural", "Estratégico", "Eficiente", "Confiado"],
    }
    setResults(demoResults)
    setUserEmail("demo@dtcfinal.com")
    setLoading(false)
  }

  const checkUserAndLoadResults = async () => {
    const localSession = localStorage.getItem("dtc_session")
    let email = ""

    if (localSession) {
      try {
        const sessionData = JSON.parse(localSession)
        if (sessionData.authenticated && sessionData.user) {
          email = sessionData.user.email
        }
      } catch (error) {
        console.log("Invalid local session")
      }
    }

    if (!email) {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()
        if (user) {
          email = user.email || ""
        } else {
          router.push("/auth")
          return
        }
      } catch (error) {
        router.push("/auth")
        return
      }
    }

    setUserEmail(email)
    await loadResults(email)
  }

  const loadResults = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from("test_results")
        .select("*")
        .eq("user_email", email)
        .eq("test_name", "MBTI")
        .order("completed_at", { ascending: false })
        .limit(1)

      if (error) {
        console.error("Error loading results:", error)
        loadDemoData()
        return
      }

      if (data && data.length > 0) {
        setResults(data[0].results as MBTIResults)
      } else {
        loadDemoData()
      }
    } catch (error) {
      console.error("Error:", error)
      loadDemoData()
    } finally {
      setLoading(false)
    }
  }

  const generateAIInterpretation = async () => {
    if (!results || !userEmail) return

    setLoadingInterpretation(true)
    try {
      const interpretation = await aiCoach.interpretTestResults(userEmail, "MBTI", results)
      setAiInterpretation(interpretation)
    } catch (error) {
      console.error("Error generating AI interpretation:", error)
      setAiInterpretation("Lo siento, no pude generar una interpretación en este momento.")
    } finally {
      setLoadingInterpretation(false)
    }
  }

  const getRadarData = () => {
    if (!results) return []
    return [
      { dimension: "Extraversión", value: (results.scores.E / (results.scores.E + results.scores.I)) * 100 },
      { dimension: "Intuición", value: (results.scores.N / (results.scores.N + results.scores.S)) * 100 },
      { dimension: "Pensamiento", value: (results.scores.T / (results.scores.T + results.scores.F)) * 100 },
      { dimension: "Juicio", value: (results.scores.J / (results.scores.J + results.scores.P)) * 100 },
    ]
  }

  const getBarData = () => {
    if (!results) return []
    return [
      { name: "E vs I", E: results.scores.E, I: results.scores.I },
      { name: "S vs N", S: results.scores.S, N: results.scores.N },
      { name: "T vs F", T: results.scores.T, F: results.scores.F },
      { name: "J vs P", J: results.scores.J, P: results.scores.P },
    ]
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      NT: "#10B981", // Green for Analysts
      NF: "#8B5CF6", // Purple for Diplomats
      SJ: "#3B82F6", // Blue for Sentinels
      SP: "#F59E0B", // Orange for Explorers
    }

    const temperament =
      type.includes("N") && type.includes("T")
        ? "NT"
        : type.includes("N") && type.includes("F")
          ? "NF"
          : type.includes("S") && type.includes("J")
            ? "SJ"
            : "SP"

    return colors[temperament] || "#6B7280"
  }

  const getCareerMatches = (type: string) => {
    const careers: Record<string, string[]> = {
      ENTJ: ["CEO/Ejecutivo", "Consultor de Gestión", "Emprendedor", "Director de Proyecto"],
      ENTP: ["Consultor", "Inventor", "Periodista", "Analista de Sistemas"],
      INTJ: ["Arquitecto de Software", "Científico", "Estratega", "Consultor"],
      INTP: ["Investigador", "Programador", "Analista", "Profesor Universitario"],
      ENFJ: ["Psicólogo", "Consejero", "Profesor", "Director de RRHH"],
      ENFP: ["Periodista", "Psicólogo", "Consultor", "Artista"],
      INFJ: ["Consejero", "Escritor", "Psicólogo", "Trabajador Social"],
      INFP: ["Escritor", "Psicólogo", "Artista", "Consejero"],
      ESTJ: ["Gerente", "Administrador", "Juez", "Contador"],
      ESFJ: ["Maestro", "Enfermero", "Gerente de RRHH", "Trabajador Social"],
      ISTJ: ["Contador", "Ingeniero", "Administrador", "Auditor"],
      ISFJ: ["Enfermero", "Maestro", "Bibliotecario", "Consejero"],
      ESTP: ["Vendedor", "Paramédico", "Empresario", "Atleta Profesional"],
      ESFP: ["Maestro", "Consejero", "Artista", "Trabajador Social"],
      ISTP: ["Ingeniero", "Mecánico", "Piloto", "Programador"],
      ISFP: ["Artista", "Diseñador", "Músico", "Consejero"],
    }

    return careers[type] || ["Consultor", "Analista", "Especialista", "Coordinador"]
  }

  const getOverallScore = () => {
    if (!results) return 0
    const maxScore = Math.max(
      results.scores.E + results.scores.I,
      results.scores.S + results.scores.N,
      results.scores.T + results.scores.F,
      results.scores.J + results.scores.P,
    )
    return Math.round((maxScore / 25) * 100) // Assuming 25 questions total
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tus resultados...</p>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron resultados</h3>
            <p className="text-gray-600 mb-4">Completa el test MBTI para ver tus resultados aquí</p>
            <Button onClick={() => router.push("/test/mbti")}>Realizar Test</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const initialContext = `He analizado tu perfil MBTI:
• Tipo: ${results.type} (${results.type_name})
• Descripción: ${results.type_description}
• Puntuaciones: E:${results.scores.E} I:${results.scores.I} S:${results.scores.S} N:${results.scores.N} T:${results.scores.T} F:${results.scores.F} J:${results.scores.J} P:${results.scores.P}
• Rasgos principales: ${results.traits.join(", ")}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Dashboard
          </Button>
          <div className="flex items-center gap-2">
            {isDemo && <Badge variant="secondary">Modo Demo</Badge>}
            <Button variant="outline" size="sm">
              <Share2 className="h-4 w-4 mr-2" />
              Compartir
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Descargar PDF
            </Button>
          </div>
        </div>

        {/* Results Header */}
        <Card className="mb-8" style={{ borderColor: getTypeColor(results.type) }}>
          <CardContent className="p-8">
            <div className="text-center">
              <div
                className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 text-white text-2xl font-bold"
                style={{ backgroundColor: getTypeColor(results.type) }}
              >
                {results.type}
              </div>
              <h1 className="text-3xl font-bold text-green-800 mb-2">{results.type_name}</h1>
              <p className="text-green-600 mb-4 text-lg">{results.type_description}</p>
              <div className="flex items-center justify-center gap-4">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  <Award className="h-4 w-4 mr-2" />
                  Claridad del Tipo: {getOverallScore()}%
                </Badge>
                <Badge variant="outline" className="text-lg px-4 py-2">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Con IA
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="dimensions">Dimensiones</TabsTrigger>
            <TabsTrigger value="career">Carrera</TabsTrigger>
            <TabsTrigger value="ai-coach">Coach IA</TabsTrigger>
            <TabsTrigger value="insights">Insights IA</TabsTrigger>
            <TabsTrigger value="growth">Crecimiento</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Radar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Perfil de Dimensiones
                  </CardTitle>
                  <CardDescription>Visualización de tus preferencias MBTI</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={getRadarData()}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="dimension" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar
                        name="Preferencia"
                        dataKey="value"
                        stroke={getTypeColor(results.type)}
                        fill={getTypeColor(results.type)}
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5" />
                    Comparación de Preferencias
                  </CardTitle>
                  <CardDescription>Puntuaciones detalladas por dimensión</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getBarData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="E" fill="#10B981" name="Extraversión" />
                      <Bar dataKey="I" fill="#6B7280" name="Introversión" />
                      <Bar dataKey="S" fill="#3B82F6" name="Sensación" />
                      <Bar dataKey="N" fill="#8B5CF6" name="Intuición" />
                      <Bar dataKey="T" fill="#EF4444" name="Pensamiento" />
                      <Bar dataKey="F" fill="#F59E0B" name="Sentimiento" />
                      <Bar dataKey="J" fill="#059669" name="Juicio" />
                      <Bar dataKey="P" fill="#DC2626" name="Percepción" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Traits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Características Principales
                </CardTitle>
                <CardDescription>Rasgos distintivos de tu tipo de personalidad</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {results.traits.map((trait, index) => (
                    <div key={index} className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                        <Star className="h-6 w-6 text-green-600" />
                      </div>
                      <p className="font-medium text-green-800">{trait}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Interpretation Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Interpretación con IA
                </CardTitle>
                <CardDescription>Análisis personalizado generado por inteligencia artificial</CardDescription>
              </CardHeader>
              <CardContent>
                {aiInterpretation ? (
                  <div className="prose prose-sm max-w-none">
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{aiInterpretation}</p>
                  </div>
                ) : (
                  <div className="text-center py-6">
                    <Button onClick={generateAIInterpretation} disabled={loadingInterpretation}>
                      {loadingInterpretation ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Generando interpretación...
                        </>
                      ) : (
                        <>
                          <Sparkles className="h-4 w-4 mr-2" />
                          Generar Interpretación con IA
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dimensions Tab */}
          <TabsContent value="dimensions" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* E vs I */}
              <Card>
                <CardHeader>
                  <CardTitle>Extraversión vs Introversión</CardTitle>
                  <CardDescription>Cómo obtienes y diriges tu energía</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Extraversión (E)</span>
                      <span className="text-2xl font-bold text-green-600">{results.scores.E}</span>
                    </div>
                    <Progress value={(results.scores.E / (results.scores.E + results.scores.I)) * 100} />
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Introversión (I)</span>
                      <span className="text-2xl font-bold text-gray-600">{results.scores.I}</span>
                    </div>
                    <Progress value={(results.scores.I / (results.scores.E + results.scores.I)) * 100} />
                  </div>
                </CardContent>
              </Card>

              {/* S vs N */}
              <Card>
                <CardHeader>
                  <CardTitle>Sensación vs Intuición</CardTitle>
                  <CardDescription>Cómo percibes y procesas información</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Sensación (S)</span>
                      <span className="text-2xl font-bold text-blue-600">{results.scores.S}</span>
                    </div>
                    <Progress value={(results.scores.S / (results.scores.S + results.scores.N)) * 100} />
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Intuición (N)</span>
                      <span className="text-2xl font-bold text-purple-600">{results.scores.N}</span>
                    </div>
                    <Progress value={(results.scores.N / (results.scores.S + results.scores.N)) * 100} />
                  </div>
                </CardContent>
              </Card>

              {/* T vs F */}
              <Card>
                <CardHeader>
                  <CardTitle>Pensamiento vs Sentimiento</CardTitle>
                  <CardDescription>Cómo tomas decisiones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Pensamiento (T)</span>
                      <span className="text-2xl font-bold text-red-600">{results.scores.T}</span>
                    </div>
                    <Progress value={(results.scores.T / (results.scores.T + results.scores.F)) * 100} />
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Sentimiento (F)</span>
                      <span className="text-2xl font-bold text-orange-600">{results.scores.F}</span>
                    </div>
                    <Progress value={(results.scores.F / (results.scores.T + results.scores.F)) * 100} />
                  </div>
                </CardContent>
              </Card>

              {/* J vs P */}
              <Card>
                <CardHeader>
                  <CardTitle>Juicio vs Percepción</CardTitle>
                  <CardDescription>Cómo te relacionas con el mundo exterior</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Juicio (J)</span>
                      <span className="text-2xl font-bold text-green-600">{results.scores.J}</span>
                    </div>
                    <Progress value={(results.scores.J / (results.scores.J + results.scores.P)) * 100} />
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Percepción (P)</span>
                      <span className="text-2xl font-bold text-red-600">{results.scores.P}</span>
                    </div>
                    <Progress value={(results.scores.P / (results.scores.J + results.scores.P)) * 100} />
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Career Tab */}
          <TabsContent value="career" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5" />
                  Carreras Ideales para {results.type}
                </CardTitle>
                <CardDescription>Profesiones que se alinean con tu tipo de personalidad</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {getCareerMatches(results.type).map((career, index) => (
                    <Card key={index} className="p-4 text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Briefcase className="h-6 w-6 text-green-600" />
                      </div>
                      <h3 className="font-semibold text-green-800">{career}</h3>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Fortalezas Profesionales
                </CardTitle>
                <CardDescription>Habilidades naturales que puedes aprovechar en tu carrera</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <h4 className="font-semibold text-green-800">Fortalezas Clave</h4>
                    <ul className="space-y-2 text-sm">
                      {results.type.includes("E") && <li>• Excelente comunicador y networker</li>}
                      {results.type.includes("I") && <li>• Pensador profundo y reflexivo</li>}
                      {results.type.includes("N") && <li>• Visionario e innovador</li>}
                      {results.type.includes("S") && <li>• Práctico y orientado a detalles</li>}
                      {results.type.includes("T") && <li>• Toma decisiones lógicas y objetivas</li>}
                      {results.type.includes("F") && <li>• Empático y orientado a las personas</li>}
                      {results.type.includes("J") && <li>• Organizado y orientado a objetivos</li>}
                      {results.type.includes("P") && <li>• Flexible y adaptable</li>}
                    </ul>
                  </div>
                  <div className="space-y-3">
                    <h4 className="font-semibold text-green-800">Áreas de Desarrollo</h4>
                    <ul className="space-y-2 text-sm">
                      {results.type.includes("E") && <li>• Desarrollar habilidades de escucha activa</li>}
                      {results.type.includes("I") && <li>• Mejorar habilidades de presentación</li>}
                      {results.type.includes("N") && <li>• Prestar más atención a los detalles</li>}
                      {results.type.includes("S") && <li>• Desarrollar pensamiento estratégico</li>}
                      {results.type.includes("T") && <li>• Considerar más el factor humano</li>}
                      {results.type.includes("F") && <li>• Desarrollar habilidades analíticas</li>}
                      {results.type.includes("J") && <li>• Ser más flexible ante cambios</li>}
                      {results.type.includes("P") && <li>• Mejorar habilidades de planificación</li>}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Coach Tab */}
          <TabsContent value="ai-coach" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <AICoachChat
                  userEmail={userEmail}
                  initialContext={initialContext}
                  suggestedQuestions={[
                    `¿Qué significa ser ${results.type}?`,
                    "¿Cómo puedo aprovechar mis fortalezas naturales?",
                    "¿Qué carreras son ideales para mi tipo?",
                    "¿Cómo puedo mejorar mi comunicación?",
                    "¿Qué desafíos enfrenta mi tipo de personalidad?",
                  ]}
                />
              </div>
              <div>
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Acciones Rápidas
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      onClick={generateAIInterpretation}
                      disabled={loadingInterpretation}
                      className="w-full bg-transparent"
                      variant="outline"
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Interpretación Detallada
                    </Button>
                    <Button onClick={() => aiCoach.getCareerGuidance(userEmail)} className="w-full" variant="outline">
                      <Lightbulb className="h-4 w-4 mr-2" />
                      Orientación de Carrera
                    </Button>
                    <Button onClick={() => aiCoach.getDevelopmentPlan(userEmail)} className="w-full" variant="outline">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Plan de Desarrollo
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* AI Insights Tab */}
          <TabsContent value="insights" className="space-y-6">
            <AIInsightsPanel userEmail={userEmail} />
          </TabsContent>

          {/* Growth Tab */}
          <TabsContent value="growth" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Plan de Desarrollo Personal
                </CardTitle>
                <CardDescription>Recomendaciones específicas para tu crecimiento como {results.type}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Recursos Recomendados</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="p-4">
                        <h5 className="font-medium mb-2">📚 Lectura Sugerida</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• "MBTI en el Ambiente Laboral"</li>
                          <li>• "Comunicación Efectiva por Tipo de Personalidad"</li>
                          <li>• "Leadership Fundamentals"</li>
                        </ul>
                      </Card>
                      <Card className="p-4">
                        <h5 className="font-medium mb-2">🎯 Próximos Tests</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Test DISC (Estilos de comportamiento)</li>
                          <li>• Test Big Five (Factores de personalidad)</li>
                          <li>• Evaluación de Habilidades Blandas</li>
                        </ul>
                      </Card>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Objetivos de Desarrollo Específicos</h4>
                    <div className="space-y-3">
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <h5 className="font-medium text-green-800">Desarrollar Función Auxiliar</h5>
                        <p className="text-sm text-green-700">
                          Fortalece tu segunda función cognitiva para un desarrollo más equilibrado
                        </p>
                      </div>
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <h5 className="font-medium text-blue-800">Gestionar Función Inferior</h5>
                        <p className="text-sm text-blue-700">
                          Aprende a reconocer y manejar tu función menos desarrollada
                        </p>
                      </div>
                      <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                        <h5 className="font-medium text-purple-800">Ampliar Perspectiva</h5>
                        <p className="text-sm text-purple-700">
                          Practica usar las preferencias opuestas para mayor flexibilidad
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <Button onClick={() => router.push("/test/disc")} size="lg">
            <Users className="h-4 w-4 mr-2" />
            Realizar Test DISC
          </Button>
          <Button variant="outline" onClick={() => router.push("/test/big-five")} size="lg">
            <Brain className="h-4 w-4 mr-2" />
            Realizar Test Big Five
          </Button>
          <Button variant="outline" onClick={() => router.push("/dashboard")} size="lg">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Dashboard
          </Button>
        </div>
      </div>
    </div>
  )
}
