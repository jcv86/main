"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { supabase } from "@/lib/supabase"
import { AiCoachChat } from "@/components/ai-coach-chat"
import {
  Target,
  Brain,
  Palette,
  Users,
  TrendingUp,
  FileText,
  BarChart3,
  LucidePieChart as RechartsPieChart,
  Radar,
  Sparkles,
  Award,
  BookOpen,
  Briefcase,
  ArrowRight,
  CheckCircle,
  Star,
  TrendingDown,
  AlertCircle,
} from "lucide-react"
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar as RechartsRadar,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  Legend,
  Pie,
} from "recharts"

interface RIASECResults {
  R: number
  I: number
  A: number
  S: number
  E: number
  C: number
  total_score: number
  max_score: number
  percentage: number
  holland_code: string
  top_categories: string[]
  career_matches: string[]
  strengths: string[]
  development_areas: string[]
  reflective_responses: Record<string, string>
}

export default function RIASECResults() {
  const router = useRouter()
  const [results, setResults] = useState<RIASECResults | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    loadResults()
  }, [])

  const loadResults = async () => {
    try {
      const { data, error } = await supabase
        .from("test_results")
        .select("*")
        .eq("user_email", "travis@example.com")
        .eq("test_type", "riasec")
        .order("completed_at", { ascending: false })
        .limit(1)
        .single()

      if (error) throw error
      setResults(data.results as RIASECResults)
    } catch (error) {
      console.error("Error loading results:", error)
    } finally {
      setLoading(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    const icons = {
      R: Target,
      I: Brain,
      A: Palette,
      S: Users,
      E: TrendingUp,
      C: FileText,
    }
    return icons[category as keyof typeof icons] || FileText
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      R: "#ef4444", // red
      I: "#3b82f6", // blue
      A: "#8b5cf6", // purple
      S: "#10b981", // green
      E: "#f59e0b", // orange
      C: "#6b7280", // gray
    }
    return colors[category as keyof typeof colors] || "#6b7280"
  }

  const getCategoryName = (category: string) => {
    const names = {
      R: "Realista",
      I: "Investigativo",
      A: "Artístico",
      S: "Social",
      E: "Emprendedor",
      C: "Convencional",
    }
    return names[category as keyof typeof names] || category
  }

  const getRadarData = () => {
    if (!results) return []
    return [
      { category: "Realista", value: results.R, fullMark: 15 },
      { category: "Investigativo", value: results.I, fullMark: 15 },
      { category: "Artístico", value: results.A, fullMark: 15 },
      { category: "Social", value: results.S, fullMark: 15 },
      { category: "Emprendedor", value: results.E, fullMark: 15 },
      { category: "Convencional", value: results.C, fullMark: 15 },
    ]
  }

  const getBarData = () => {
    if (!results) return []
    return [
      { name: "R", value: results.R, color: getCategoryColor("R") },
      { name: "I", value: results.I, color: getCategoryColor("I") },
      { name: "A", value: results.A, color: getCategoryColor("A") },
      { name: "S", value: results.S, color: getCategoryColor("S") },
      { name: "E", value: results.E, color: getCategoryColor("E") },
      { name: "C", value: results.C, color: getCategoryColor("C") },
    ]
  }

  const getPieData = () => {
    if (!results) return []
    return [
      { name: "Realista", value: results.R, color: getCategoryColor("R") },
      { name: "Investigativo", value: results.I, color: getCategoryColor("I") },
      { name: "Artístico", value: results.A, color: getCategoryColor("A") },
      { name: "Social", value: results.S, color: getCategoryColor("S") },
      { name: "Emprendedor", value: results.E, color: getCategoryColor("E") },
      { name: "Convencional", value: results.C, color: getCategoryColor("C") },
    ]
  }

  const getHollandCodeDescription = (code: string) => {
    const descriptions: Record<string, string> = {
      IEA: "Innovador Emprendedor Artístico - Combinas la investigación científica con el liderazgo empresarial y la creatividad. Eres ideal para roles que requieren innovación, análisis estratégico y visión creativa.",
      EIA: "Emprendedor Investigativo Artístico - Lideras con base científica y toque creativo. Excelente para dirigir equipos de innovación y desarrollo de productos disruptivos.",
      AIE: "Artístico Investigativo Emprendedor - Tu creatividad se fundamenta en investigación sólida y visión empresarial. Perfecto para industrias creativas con componente tecnológico.",
      ISE: "Investigativo Social Emprendedor - Combinas análisis profundo con impacto social y liderazgo. Ideal para organizaciones que buscan soluciones basadas en evidencia.",
      ESI: "Emprendedor Social Investigativo - Lideras iniciativas de impacto social con rigor analítico. Excelente para empresas B-Corp y organizaciones de cambio social.",
      ASI: "Artístico Social Investigativo - Usas la creatividad para generar impacto social basado en investigación. Perfecto para proyectos de innovación social.",
    }
    return (
      descriptions[code] ||
      `Tu código ${code} representa una combinación única de intereses que te posiciona para roles especializados en la intersección de estas áreas.`
    )
  }

  const getCareerPaths = (code: string) => {
    const paths: Record<string, { immediate: string[]; medium: string[]; long: string[] }> = {
      IEA: {
        immediate: ["Analista de Datos", "Desarrollador Junior", "Asistente de Investigación", "Diseñador UX/UI"],
        medium: ["Product Manager", "Consultor de Tecnología", "Líder de Proyecto", "Arquitecto de Sistemas"],
        long: ["Director de Innovación", "CTO", "Fundador de Startup", "Consultor Senior"],
      },
      EIA: {
        immediate: ["Coordinador de Proyectos", "Analista de Negocios", "Asistente de Gerencia", "Investigador Jr"],
        medium: ["Gerente de Producto", "Consultor de Estrategia", "Director de Operaciones", "Líder de Innovación"],
        long: ["CEO", "Director General", "Consultor Ejecutivo", "Inversionista"],
      },
      AIE: {
        immediate: ["Diseñador Gráfico", "Asistente Creativo", "Desarrollador Frontend", "Content Creator"],
        medium: ["Director de Arte", "Creative Director", "Diseñador de Productos", "Brand Manager"],
        long: ["Director Creativo Senior", "Fundador de Agencia", "Director de Marca", "Consultor de Diseño"],
      },
    }
    return (
      paths[code] || {
        immediate: ["Analista", "Asistente", "Coordinador", "Especialista Jr"],
        medium: ["Gerente", "Consultor", "Líder de Equipo", "Especialista Sr"],
        long: ["Director", "Consultor Senior", "Ejecutivo", "Fundador"],
      }
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mr-3"></div>
              <span>Cargando resultados RIASEC...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No se encontraron resultados</h3>
            <p className="text-gray-600 mb-4">Parece que aún no has completado el test RIASEC.</p>
            <Button onClick={() => router.push("/test/riasec")}>Realizar Test RIASEC</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-3xl font-bold text-blue-900 mb-2">
                  Resultados Test RIASEC
                  <Badge className="ml-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                    Código Holland: {results.holland_code}
                  </Badge>
                </CardTitle>
                <CardDescription className="text-lg">{getHollandCodeDescription(results.holland_code)}</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">{results.percentage}%</div>
                <div className="text-sm text-gray-500">Puntuación General</div>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <Award className="h-4 w-4" />
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
                <TabsTrigger value="reflective" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Reflexiones
                </TabsTrigger>
                <TabsTrigger value="coach" className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Coach IA
                </TabsTrigger>
                <TabsTrigger value="career" className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  Carrera
                </TabsTrigger>
              </TabsList>
            </CardContent>
          </Card>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Holland Code Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-blue-600" />
                    Tu Código Holland: {results.holland_code}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {results.holland_code.split("").map((letter, index) => {
                      const IconComponent = getCategoryIcon(letter)
                      const score = results[letter as keyof typeof results] as number
                      const percentage = Math.round((score / 15) * 100)
                      return (
                        <div key={letter} className="flex items-center gap-3">
                          <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                            style={{ backgroundColor: getCategoryColor(letter) }}
                          >
                            {index + 1}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <IconComponent className="h-4 w-4" style={{ color: getCategoryColor(letter) }} />
                              <span className="font-semibold">{getCategoryName(letter)}</span>
                              <Badge variant="outline">{score}/15 puntos</Badge>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Top Strengths */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Star className="h-5 w-5 text-yellow-600" />
                    Fortalezas Principales
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {results.strengths.slice(0, 4).map((strength, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{strength}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Career Matches */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="h-5 w-5 text-purple-600" />
                  Carreras Compatibles
                </CardTitle>
                <CardDescription>
                  Basado en tu código Holland {results.holland_code}, estas carreras son altamente compatibles con tu
                  perfil
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.career_matches.map((career, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                          {index + 1}
                        </div>
                        <span className="font-medium text-blue-900">{career}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Development Areas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-orange-600" />
                  Áreas de Desarrollo
                </CardTitle>
                <CardDescription>Aspectos en los que puedes enfocar tu crecimiento profesional</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {results.development_areas.map((area, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-3 bg-orange-50 rounded-lg border border-orange-200"
                    >
                      <AlertCircle className="h-5 w-5 text-orange-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-orange-800">{area}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Charts Tab */}
          <TabsContent value="charts" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Radar Chart */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Radar className="h-5 w-5 text-blue-600" />
                    Perfil RIASEC - Vista Radar
                  </CardTitle>
                  <CardDescription>Visualización completa de tus puntuaciones en las 6 dimensiones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={getRadarData()}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="category" />
                        <PolarRadiusAxis angle={90} domain={[0, 15]} />
                        <RechartsRadar
                          name="Puntuación"
                          dataKey="value"
                          stroke="#3b82f6"
                          fill="#3b82f6"
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
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    Puntuaciones por Categoría
                  </CardTitle>
                  <CardDescription>Comparación directa de tus puntuaciones RIASEC</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getBarData()}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 15]} />
                        <Tooltip formatter={(value, name) => [`${value} puntos`, getCategoryName(name as string)]} />
                        <Bar dataKey="value" fill="#8884d8">
                          {getBarData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Pie Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <RechartsPieChart className="h-5 w-5 text-purple-600" />
                  Distribución de Intereses
                </CardTitle>
                <CardDescription>Proporción de cada tipo de interés en tu perfil profesional</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={getPieData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {getPieData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              {/* Detailed Analysis */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    Análisis Detallado
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Tu Perfil {results.holland_code}</h4>
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {getHollandCodeDescription(results.holland_code)}
                    </p>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Fortalezas Clave</h4>
                    <div className="space-y-2">
                      {results.strengths.map((strength, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Star className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <Separator />
                  <div>
                    <h4 className="font-semibold mb-2">Oportunidades de Crecimiento</h4>
                    <div className="space-y-2">
                      {results.development_areas.map((area, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <TrendingUp className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{area}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Score Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-blue-600" />
                    Desglose de Puntuaciones
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(results)
                      .filter(([key]) => ["R", "I", "A", "S", "E", "C"].includes(key))
                      .sort(([, a], [, b]) => (b as number) - (a as number))
                      .map(([category, score], index) => {
                        const IconComponent = getCategoryIcon(category)
                        const percentage = Math.round(((score as number) / 15) * 100)
                        const isTop3 = index < 3
                        return (
                          <div key={category} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <IconComponent className="h-4 w-4" style={{ color: getCategoryColor(category) }} />
                                <span className="font-medium">{getCategoryName(category)}</span>
                                {isTop3 && (
                                  <Badge variant="secondary" className="text-xs">
                                    Top {index + 1}
                                  </Badge>
                                )}
                              </div>
                              <div className="text-right">
                                <div className="font-semibold">{score}/15</div>
                                <div className="text-xs text-gray-500">{percentage}%</div>
                              </div>
                            </div>
                            <Progress value={percentage} className="h-2" />
                          </div>
                        )
                      })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Reflective Tab */}
          <TabsContent value="reflective" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-green-600" />
                  Tus Respuestas Reflexivas
                </CardTitle>
                <CardDescription>
                  Análisis de tus respuestas abiertas que proporcionan insights adicionales sobre tu perfil profesional
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(results.reflective_responses).map(([questionKey, response]) => {
                    const questionTexts: Record<string, string> = {
                      q31: "¿Qué tipo de actividades te motivan más en el trabajo?",
                      q32: "¿Cómo te ves profesionalmente en 5 años?",
                      q33: "¿Cuál ha sido tu mayor logro personal o profesional?",
                      q34: "¿Cómo sueles enfrentar los desafíos o problemas?",
                      q35: "¿De qué manera contribuyes mejor en un equipo de trabajo?",
                    }
                    return (
                      <div key={questionKey} className="p-4 bg-gray-50 rounded-lg border">
                        <h4 className="font-semibold text-gray-900 mb-2">{questionTexts[questionKey]}</h4>
                        <p className="text-gray-700 text-sm leading-relaxed">{response}</p>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Coach IA Tab */}
          <TabsContent value="coach" className="space-y-6">
            <AiCoachChat
              userEmail="travis@example.com"
              initialContext={`Código Holland ${results.holland_code}: ${getHollandCodeDescription(results.holland_code)}`}
              suggestedQuestions={[
                `¿Cómo puedo aprovechar mi perfil ${results.holland_code}?`,
                "¿Qué carreras específicas me recomiendas?",
                "¿Cómo puedo desarrollar mis áreas de mejora?",
                "¿Qué habilidades debería priorizar?",
                "¿Cómo puedo destacar en entrevistas de trabajo?",
              ]}
            />
          </TabsContent>

          {/* Career Tab */}
          <TabsContent value="career" className="space-y-6">
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Short Term */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-green-600" />
                    Corto Plazo (0-2 años)
                  </CardTitle>
                  <CardDescription>Primeros pasos en tu carrera profesional</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getCareerPaths(results.holland_code).immediate.map((career, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-green-50 rounded border border-green-200"
                      >
                        <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                        <span className="text-sm text-green-800">{career}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Medium Term */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Mediano Plazo (2-5 años)
                  </CardTitle>
                  <CardDescription>Roles de crecimiento y especialización</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getCareerPaths(results.holland_code).medium.map((career, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-blue-50 rounded border border-blue-200"
                      >
                        <ArrowRight className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        <span className="text-sm text-blue-800">{career}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Long Term */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-purple-600" />
                    Largo Plazo (5+ años)
                  </CardTitle>
                  <CardDescription>Posiciones de liderazgo y expertise</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {getCareerPaths(results.holland_code).long.map((career, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 p-2 bg-purple-50 rounded border border-purple-200"
                      >
                        <Star className="h-4 w-4 text-purple-600 flex-shrink-0" />
                        <span className="text-sm text-purple-800">{career}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Plan */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-orange-600" />
                  Plan de Acción Personalizado
                </CardTitle>
                <CardDescription>
                  Pasos concretos para desarrollar tu carrera según tu perfil {results.holland_code}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Habilidades a Desarrollar</h4>
                    <div className="space-y-2">
                      {[
                        "Análisis de datos y metodologías de investigación",
                        "Liderazgo de equipos multidisciplinarios",
                        "Pensamiento creativo y design thinking",
                        "Comunicación estratégica y presentaciones",
                        "Gestión de proyectos de innovación",
                      ].map((skill, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3">Próximos Pasos</h4>
                    <div className="space-y-2">
                      {[
                        "Buscar roles que combinen análisis e innovación",
                        "Desarrollar portfolio de proyectos creativos",
                        "Networking en industrias tecnológicas",
                        "Considerar certificaciones en gestión de productos",
                        "Explorar oportunidades de liderazgo de equipos",
                      ].map((step, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <ArrowRight className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Action Buttons */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-wrap gap-4 justify-center">
              <Button onClick={() => router.push("/dashboard")} variant="outline">
                Volver al Dashboard
              </Button>
              <Button onClick={() => router.push("/test/riasec")} variant="outline">
                Repetir Test
              </Button>
              <Button onClick={() => window.print()} variant="outline">
                Imprimir Resultados
              </Button>
              <Button
                onClick={() => router.push("/test/soft-skills")}
                className="bg-gradient-to-r from-green-600 to-emerald-600"
              >
                Siguiente Test: Soft Skills
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
