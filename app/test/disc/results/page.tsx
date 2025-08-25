"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "@/components/session-wrapper"
import { createClient } from "@supabase/supabase-js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, Brain, Download, Share2, TrendingUp, Users, Target, Lightbulb, BookOpen } from "lucide-react"
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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

export default function DISCResultsPage() {
  const { user } = useSession()
  const router = useRouter()
  const [discResult, setDiscResult] = useState<DISCResult | null>(null)
  const [loading, setLoading] = useState(true)

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  useEffect(() => {
    if (!user) {
      router.push("/")
      return
    }
    loadResults()
  }, [user, router])

  const loadResults = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("disc_results")
        .select("*")
        .eq("user_email", user.email)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (error && error.code !== "PGRST116") {
        console.error("Error loading DISC results:", error)
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
      } else if (data) {
        setDiscResult(data)
      }
    } catch (error) {
      console.error("Error loading results:", error)
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
            <Button variant="outline" onClick={() => router.push("/dashboard")} className="w-full">
              Volver al Dashboard
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <Button variant="outline" onClick={() => router.push("/dashboard")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Dashboard
          </Button>
          <div className="flex items-center space-x-2">
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

        {/* Results Header */}
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

        {/* Charts and Analysis */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="charts">Gráficos</TabsTrigger>
            <TabsTrigger value="analysis">Análisis</TabsTrigger>
            <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Scores Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Puntuaciones DISC</CardTitle>
                  <CardDescription>Tus puntuaciones en cada dimensión</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Dominancia (D)</span>
                        <span className="text-sm text-gray-600">{discResult.d_score}%</span>
                      </div>
                      <Progress value={discResult.d_score} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Influencia (I)</span>
                        <span className="text-sm text-gray-600">{discResult.i_score}%</span>
                      </div>
                      <Progress value={discResult.i_score} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Estabilidad (S)</span>
                        <span className="text-sm text-gray-600">{discResult.s_score}%</span>
                      </div>
                      <Progress value={discResult.s_score} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">Cumplimiento (C)</span>
                        <span className="text-sm text-gray-600">{discResult.c_score}%</span>
                      </div>
                      <Progress value={discResult.c_score} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Style Overview */}
              <Card>
                <CardHeader>
                  <CardTitle>Tu Estilo: {styleInfo.title}</CardTitle>
                  <CardDescription>Características principales</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center">
                        <TrendingUp className="h-4 w-4 mr-2 text-green-600" />
                        Fortalezas
                      </h4>
                      <ul className="text-sm space-y-1">
                        {styleInfo.strengths.map((strength, index) => (
                          <li key={index} className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2"></div>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-2 flex items-center">
                        <Target className="h-4 w-4 mr-2 text-orange-600" />
                        Áreas de Desarrollo
                      </h4>
                      <ul className="text-sm space-y-1">
                        {styleInfo.challenges.map((challenge, index) => (
                          <li key={index} className="flex items-center">
                            <div className="w-1.5 h-1.5 bg-orange-600 rounded-full mr-2"></div>
                            {challenge}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Work Style */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Estilo de Trabajo Preferido
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{styleInfo.workStyle}</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="charts" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Radar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Gráfico Radar - Perfil DISC</CardTitle>
                  <CardDescription>Visualización completa de tu perfil</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="subject" />
                        <PolarRadiusAxis angle={90} domain={[0, 100]} />
                        <Radar
                          name="DISC"
                          dataKey="A"
                          stroke="#0088FE"
                          fill="#0088FE"
                          fillOpacity={0.3}
                          strokeWidth={2}
                        />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>

              {/* Bar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle>Gráfico de Barras - Puntuaciones</CardTitle>
                  <CardDescription>Comparación de puntuaciones por dimensión</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Bar dataKey="value" fill="#0088FE" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Estilos</CardTitle>
                <CardDescription>Proporción de cada estilo en tu perfil</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Análisis Detallado</CardTitle>
                <CardDescription>Interpretación profunda de tus resultados</CardDescription>
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

          <TabsContent value="recommendations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Lightbulb className="h-5 w-5 mr-2" />
                  Recomendaciones Personalizadas
                </CardTitle>
                <CardDescription>Sugerencias para tu desarrollo profesional</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Recomendación Principal</h3>
                  <p className="text-sm">{discResult.recommendations}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-3">Para el Desarrollo Profesional</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2 mt-2"></div>
                        Busca roles que aprovechen tus fortalezas naturales
                      </li>
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2 mt-2"></div>
                        Desarrolla habilidades complementarias
                      </li>
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mr-2 mt-2"></div>
                        Considera mentoring en áreas de crecimiento
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Para el Trabajo en Equipo</h4>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2 mt-2"></div>
                        Comunica tu estilo de trabajo al equipo
                      </li>
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2 mt-2"></div>
                        Adapta tu comunicación según el estilo de otros
                      </li>
                      <li className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full mr-2 mt-2"></div>
                        Busca roles que complementen tus habilidades
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-3">Próximos Pasos Sugeridos</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <Button variant="outline" className="justify-start h-auto p-4 bg-transparent">
                      <BookOpen className="h-4 w-4 mr-2" />
                      <div className="text-left">
                        <div className="font-medium">Leer Recursos</div>
                        <div className="text-xs text-gray-500">Sobre tu estilo</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="justify-start h-auto p-4 bg-transparent">
                      <Users className="h-4 w-4 mr-2" />
                      <div className="text-left">
                        <div className="font-medium">Compartir Resultados</div>
                        <div className="text-xs text-gray-500">Con tu equipo</div>
                      </div>
                    </Button>
                    <Button variant="outline" className="justify-start h-auto p-4 bg-transparent">
                      <Target className="h-4 w-4 mr-2" />
                      <div className="text-left">
                        <div className="font-medium">Plan de Desarrollo</div>
                        <div className="text-xs text-gray-500">Personalizado</div>
                      </div>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
