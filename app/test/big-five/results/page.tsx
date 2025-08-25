"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { createClient } from "@supabase/supabase-js"
import { useRouter, useSearchParams } from "next/navigation"
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
import {
  Brain,
  ArrowLeft,
  Download,
  Share2,
  TrendingUp,
  Users,
  Target,
  Lightbulb,
  Heart,
  Star,
  BookOpen,
  Award,
} from "lucide-react"

interface BigFiveResults {
  O: number // Openness
  C: number // Conscientiousness
  E: number // Extraversion
  A: number // Agreeableness
  N: number // Neuroticism
  primary_traits: string[]
  detailed_analysis: {
    openness: string
    conscientiousness: string
    extraversion: string
    agreeableness: string
    neuroticism: string
  }
}

const COLORS = ["#8B5CF6", "#A855F7", "#C084FC", "#DDD6FE", "#EDE9FE"]

const factorDescriptions = {
  O: {
    name: "Apertura a la Experiencia",
    description: "Creatividad, curiosidad intelectual y apertura a nuevas ideas",
    icon: <Lightbulb className="h-5 w-5" />,
    color: "#8B5CF6",
  },
  C: {
    name: "Responsabilidad",
    description: "Organización, disciplina y orientación al logro",
    icon: <Target className="h-5 w-5" />,
    color: "#A855F7",
  },
  E: {
    name: "Extraversión",
    description: "Sociabilidad, asertividad y búsqueda de estimulación",
    icon: <Users className="h-5 w-5" />,
    color: "#C084FC",
  },
  A: {
    name: "Amabilidad",
    description: "Cooperación, confianza y preocupación por otros",
    icon: <Heart className="h-5 w-5" />,
    color: "#DDD6FE",
  },
  N: {
    name: "Neuroticismo",
    description: "Estabilidad emocional y manejo del estrés",
    icon: <Brain className="h-5 w-5" />,
    color: "#EDE9FE",
  },
}

export default function BigFiveResults() {
  const [results, setResults] = useState<BigFiveResults | null>(null)
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState("")

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
    const demoResults: BigFiveResults = {
      O: 78,
      C: 65,
      E: 82,
      A: 71,
      N: 35,
      primary_traits: ["Abierto a experiencias", "Extrovertido", "Emocionalmente estable"],
      detailed_analysis: {
        openness: "Alto nivel de creatividad y curiosidad intelectual",
        conscientiousness: "Moderadamente organizado y disciplinado",
        extraversion: "Muy sociable y enérgico",
        agreeableness: "Cooperativo y empático",
        neuroticism: "Emocionalmente estable y resiliente",
      },
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
        .eq("test_name", "Big Five")
        .order("completed_at", { ascending: false })
        .limit(1)

      if (error) {
        console.error("Error loading results:", error)
        loadDemoData()
        return
      }

      if (data && data.length > 0) {
        setResults(data[0].results as BigFiveResults)
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

  const getRadarData = () => {
    if (!results) return []
    return [
      { factor: "Apertura", value: results.O, fullMark: 100 },
      { factor: "Responsabilidad", value: results.C, fullMark: 100 },
      { factor: "Extraversión", value: results.E, fullMark: 100 },
      { factor: "Amabilidad", value: results.A, fullMark: 100 },
      { factor: "Estabilidad", value: 100 - results.N, fullMark: 100 }, // Inverted for better interpretation
    ]
  }

  const getBarData = () => {
    if (!results) return []
    return [
      { name: "Apertura", value: results.O, color: "#8B5CF6" },
      { name: "Responsabilidad", value: results.C, color: "#A855F7" },
      { name: "Extraversión", value: results.E, color: "#C084FC" },
      { name: "Amabilidad", value: results.A, color: "#DDD6FE" },
      { name: "Estabilidad", value: 100 - results.N, color: "#EDE9FE" },
    ]
  }

  const getPieData = () => {
    if (!results) return []
    const total = results.O + results.C + results.E + results.A + (100 - results.N)
    return [
      { name: "Apertura", value: Math.round((results.O / total) * 100), color: "#8B5CF6" },
      { name: "Responsabilidad", value: Math.round((results.C / total) * 100), color: "#A855F7" },
      { name: "Extraversión", value: Math.round((results.E / total) * 100), color: "#C084FC" },
      { name: "Amabilidad", value: Math.round((results.A / total) * 100), color: "#DDD6FE" },
      { name: "Estabilidad", value: Math.round(((100 - results.N) / total) * 100), color: "#EDE9FE" },
    ]
  }

  const getOverallScore = () => {
    if (!results) return 0
    return Math.round((results.O + results.C + results.E + results.A + (100 - results.N)) / 5)
  }

  const getCareerRecommendations = () => {
    if (!results) return []
    const recommendations = []

    if (results.O > 70 && results.E > 70) {
      recommendations.push("Roles creativos y de liderazgo", "Consultoría e innovación", "Emprendimiento")
    } else if (results.C > 70 && results.A > 70) {
      recommendations.push("Gestión de proyectos", "Recursos humanos", "Administración")
    } else if (results.E > 70) {
      recommendations.push("Ventas y marketing", "Relaciones públicas", "Gestión de equipos")
    } else if (results.O > 70) {
      recommendations.push("Investigación y desarrollo", "Diseño y creatividad", "Análisis estratégico")
    }

    return recommendations.slice(0, 3)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
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
            <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron resultados</h3>
            <p className="text-gray-600 mb-4">Completa el test Big Five para ver tus resultados aquí</p>
            <Button onClick={() => router.push("/test/big-five")}>Realizar Test</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
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
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
                <Brain className="h-8 w-8 text-purple-600" />
              </div>
              <h1 className="text-3xl font-bold text-purple-800 mb-2">Resultados del Test Big Five</h1>
              <p className="text-purple-600 mb-4">
                Análisis completo de tu personalidad basado en los cinco grandes factores
              </p>
              <div className="flex items-center justify-center gap-4">
                <Badge variant="secondary" className="text-lg px-4 py-2">
                  <Award className="h-4 w-4 mr-2" />
                  Puntuación General: {getOverallScore()}%
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="radar">Gráfico Radar</TabsTrigger>
            <TabsTrigger value="detailed">Análisis Detallado</TabsTrigger>
            <TabsTrigger value="career">Carrera</TabsTrigger>
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
                    Perfil de Personalidad
                  </CardTitle>
                  <CardDescription>Visualización de tus cinco factores principales</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <RadarChart data={getRadarData()}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="factor" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar
                        name="Puntuación"
                        dataKey="value"
                        stroke="#8B5CF6"
                        fill="#8B5CF6"
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
                    Puntuaciones por Factor
                  </CardTitle>
                  <CardDescription>Comparación detallada de cada dimensión</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={getBarData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Primary Traits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Rasgos Principales
                </CardTitle>
                <CardDescription>Características más destacadas de tu personalidad</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {results.primary_traits.map((trait, index) => (
                    <Badge key={index} variant="secondary" className="text-sm px-3 py-1">
                      {trait}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Radar Tab */}
          <TabsContent value="radar" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Gráfico Radar Interactivo</CardTitle>
                  <CardDescription>Visualización completa de tu perfil Big Five</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={getRadarData()}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="factor" />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} />
                      <Radar
                        name="Tu Perfil"
                        dataKey="value"
                        stroke="#8B5CF6"
                        fill="#8B5CF6"
                        fillOpacity={0.3}
                        strokeWidth={3}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Distribución de Factores</CardTitle>
                  <CardDescription>Proporción relativa de cada factor</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <PieChart>
                      <Pie
                        data={getPieData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {getPieData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Detailed Analysis Tab */}
          <TabsContent value="detailed" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(factorDescriptions).map(([key, factor]) => {
                const score = key === "N" ? 100 - results.N : (results[key as keyof typeof results] as number)
                const analysis = results.detailed_analysis[key.toLowerCase() as keyof typeof results.detailed_analysis]

                return (
                  <Card key={key}>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2" style={{ color: factor.color }}>
                        {factor.icon}
                        {factor.name}
                      </CardTitle>
                      <CardDescription>{factor.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Puntuación</span>
                            <span className="text-2xl font-bold" style={{ color: factor.color }}>
                              {score}%
                            </span>
                          </div>
                          <Progress value={score} className="h-2" />
                        </div>
                        <p className="text-sm text-gray-600">{analysis}</p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Career Tab */}
          <TabsContent value="career" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Recomendaciones de Carrera
                </CardTitle>
                <CardDescription>Áreas profesionales que se alinean con tu perfil de personalidad</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {getCareerRecommendations().map((career, index) => (
                    <Card key={index} className="p-4">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                          <Target className="h-6 w-6 text-purple-600" />
                        </div>
                        <h3 className="font-semibold text-purple-800">{career}</h3>
                      </div>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Compatibilidad en Equipos
                </CardTitle>
                <CardDescription>Cómo tu personalidad se adapta a diferentes dinámicas de equipo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Fortalezas en Equipo</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      {results.E > 70 && <li>• Excelente comunicador y motivador del equipo</li>}
                      {results.A > 70 && <li>• Facilita la colaboración y resuelve conflictos</li>}
                      {results.O > 70 && <li>• Aporta ideas creativas e innovadoras</li>}
                      {results.C > 70 && <li>• Mantiene al equipo organizado y enfocado</li>}
                    </ul>
                  </div>
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Áreas de Desarrollo</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      {results.E < 50 && <li>• Desarrollar habilidades de comunicación en grupo</li>}
                      {results.A < 50 && <li>• Practicar la escucha activa y empatía</li>}
                      {results.C < 50 && <li>• Mejorar la organización y seguimiento de tareas</li>}
                      {results.N > 70 && <li>• Desarrollar técnicas de manejo del estrés</li>}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Growth Tab */}
          <TabsContent value="growth" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Plan de Desarrollo Personal
                </CardTitle>
                <CardDescription>Recomendaciones específicas para tu crecimiento profesional</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-3">Recursos Recomendados</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="p-4">
                        <h5 className="font-medium mb-2">📚 Lectura Sugerida</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• "Big Five: Los Cinco Grandes Factores"</li>
                          <li>• "Desarrollo de Inteligencia Emocional"</li>
                          <li>• "Comunicación Efectiva por Tipo de Personalidad"</li>
                        </ul>
                      </Card>
                      <Card className="p-4">
                        <h5 className="font-medium mb-2">🎯 Próximos Tests</h5>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>• Test DISC (Estilos de comportamiento)</li>
                          <li>• Test MBTI (Tipos de personalidad)</li>
                          <li>• Evaluación de Habilidades Blandas</li>
                        </ul>
                      </Card>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Objetivos de Desarrollo</h4>
                    <div className="space-y-3">
                      {results.O < 50 && (
                        <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg">
                          <h5 className="font-medium text-orange-800">Desarrollar Apertura Mental</h5>
                          <p className="text-sm text-orange-700">
                            Practica la curiosidad intelectual y busca nuevas experiencias de aprendizaje
                          </p>
                        </div>
                      )}
                      {results.C < 50 && (
                        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <h5 className="font-medium text-blue-800">Mejorar Organización</h5>
                          <p className="text-sm text-blue-700">
                            Implementa sistemas de planificación y establece rutinas productivas
                          </p>
                        </div>
                      )}
                      {results.E < 50 && (
                        <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                          <h5 className="font-medium text-green-800">Fortalecer Habilidades Sociales</h5>
                          <p className="text-sm text-green-700">
                            Participa en actividades grupales y practica la comunicación asertiva
                          </p>
                        </div>
                      )}
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
            <Brain className="h-4 w-4 mr-2" />
            Realizar Test DISC
          </Button>
          <Button variant="outline" onClick={() => router.push("/test/mbti")} size="lg">
            <Lightbulb className="h-4 w-4 mr-2" />
            Realizar Test MBTI
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
