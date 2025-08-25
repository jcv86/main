"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  Heart,
  ArrowLeft,
  Download,
  Share2,
  MessageCircle,
  Crown,
  Users,
  Puzzle,
  RotateCcw,
  Clock,
  Target,
  Sparkles,
  TrendingUp,
  BookOpen,
  Award,
  Calendar,
  CheckCircle,
  AlertCircle,
  Brain,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts"

interface TestResult {
  overall_score: number
  competency_scores: Record<string, number>
  answers: Record<string, number>
  total_questions: number
  answered_questions: number
}

const competencyInfo = {
  communication: {
    name: "Comunicación",
    icon: MessageCircle,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    description: "Capacidad para transmitir ideas de forma clara y efectiva",
  },
  leadership: {
    name: "Liderazgo",
    icon: Crown,
    color: "text-purple-500",
    bgColor: "bg-purple-50",
    description: "Habilidad para guiar, motivar e inspirar a otros",
  },
  teamwork: {
    name: "Trabajo en Equipo",
    icon: Users,
    color: "text-green-500",
    bgColor: "bg-green-50",
    description: "Colaboración efectiva con colegas y equipos",
  },
  "problem-solving": {
    name: "Resolución de Problemas",
    icon: Puzzle,
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    description: "Capacidad para analizar y resolver desafíos complejos",
  },
  adaptability: {
    name: "Adaptabilidad",
    icon: RotateCcw,
    color: "text-cyan-500",
    bgColor: "bg-cyan-50",
    description: "Flexibilidad ante cambios y nuevas situaciones",
  },
  "emotional-intelligence": {
    name: "Inteligencia Emocional",
    icon: Heart,
    color: "text-pink-500",
    bgColor: "bg-pink-50",
    description: "Comprensión y gestión de emociones propias y ajenas",
  },
  "time-management": {
    name: "Gestión del Tiempo",
    icon: Clock,
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
    description: "Organización eficiente de tareas y prioridades",
  },
  "critical-thinking": {
    name: "Pensamiento Crítico",
    icon: Target,
    color: "text-indigo-500",
    bgColor: "bg-indigo-50",
    description: "Análisis objetivo y toma de decisiones fundamentadas",
  },
  creativity: {
    name: "Creatividad",
    icon: Sparkles,
    color: "text-rose-500",
    bgColor: "bg-rose-50",
    description: "Generación de ideas innovadoras y soluciones originales",
  },
}

export default function SoftSkillsResults() {
  const router = useRouter()
  const [results, setResults] = useState<TestResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadResults()
  }, [])

  const loadResults = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("test_results")
        .select("*")
        .eq("user_email", "demo@example.com")
        .eq("test_type", "soft-skills")
        .order("completed_at", { ascending: false })
        .limit(1)
        .single()

      if (error) throw error

      if (!data) {
        throw new Error("No se encontraron resultados del test")
      }

      setResults(data.results)
    } catch (err) {
      console.error("Error loading results:", err)
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  const getPerformanceLevel = (score: number) => {
    if (score >= 90) return { level: "Excepcional", color: "text-green-600", bgColor: "bg-green-100" }
    if (score >= 80) return { level: "Avanzado", color: "text-blue-600", bgColor: "bg-blue-100" }
    if (score >= 70) return { level: "Competente", color: "text-purple-600", bgColor: "bg-purple-100" }
    if (score >= 60) return { level: "En desarrollo", color: "text-orange-600", bgColor: "bg-orange-100" }
    return { level: "Inicial", color: "text-red-600", bgColor: "bg-red-100" }
  }

  const getRadarData = () => {
    if (!results) return []

    return Object.entries(competencyInfo).map(([key, info]) => ({
      competency: info.name,
      score: results.competency_scores[key] || 0,
      fullMark: 100,
    }))
  }

  const getBarData = () => {
    if (!results) return []

    return Object.entries(competencyInfo).map(([key, info]) => ({
      name: info.name,
      score: results.competency_scores[key] || 0,
      color: info.color.replace("text-", ""),
    }))
  }

  const getStrengths = () => {
    if (!results) return []

    return Object.entries(results.competency_scores)
      .filter(([_, score]) => score >= 85)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([key, score]) => ({
        name: competencyInfo[key as keyof typeof competencyInfo]?.name || key,
        score,
        icon: competencyInfo[key as keyof typeof competencyInfo]?.icon || Target,
      }))
  }

  const getDevelopmentAreas = () => {
    if (!results) return []

    return Object.entries(results.competency_scores)
      .filter(([_, score]) => score < 80)
      .sort(([, a], [, b]) => a - b)
      .slice(0, 2)
      .map(([key, score]) => ({
        name: competencyInfo[key as keyof typeof competencyInfo]?.name || key,
        score,
        icon: competencyInfo[key as keyof typeof competencyInfo]?.icon || AlertCircle,
      }))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100">
        <div className="container mx-auto p-6">
          <div className="text-center">
            <Heart className="h-12 w-12 text-pink-500 mx-auto mb-4 animate-pulse" />
            <h2 className="text-2xl font-semibold mb-2">Cargando Resultados</h2>
            <p className="text-gray-600">Analizando tu perfil de habilidades blandas...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error || !results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2 text-red-700">Error</h2>
            <p className="text-gray-600 mb-4">{error || "No se pudieron cargar los resultados"}</p>
            <Button onClick={() => router.push("/test/soft-skills")} variant="outline">
              Realizar Test
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const overallPerformance = getPerformanceLevel(results.overall_score)
  const strengths = getStrengths()
  const developmentAreas = getDevelopmentAreas()

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push("/dashboard")} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al Dashboard
          </Button>

          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Heart className="h-8 w-8 text-pink-500" />
                <h1 className="text-3xl font-bold text-gray-900">Resultados: Habilidades Blandas</h1>
              </div>
              <p className="text-gray-600">Tu perfil completo de competencias profesionales</p>
            </div>
            <div className="text-right">
              <Badge className={`${overallPerformance.bgColor} ${overallPerformance.color} text-lg px-4 py-2`}>
                {results.overall_score}/100
              </Badge>
              <div className="text-sm text-gray-500 mt-1">{overallPerformance.level}</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
              <Brain className="h-4 w-4 mr-2" />
              Insights IA
            </Button>
            <Button variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Descargar
            </Button>
            <Button variant="outline">
              <Share2 className="h-4 w-4 mr-2" />
              Compartir
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Resumen</TabsTrigger>
            <TabsTrigger value="competencies">Competencias</TabsTrigger>
            <TabsTrigger value="development">Desarrollo</TabsTrigger>
            <TabsTrigger value="recommendations">Recomendaciones</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Overall Score */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-pink-500" />
                    Puntuación General
                  </CardTitle>
                  <CardDescription>Tu nivel global de habilidades blandas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <div className="text-4xl font-bold text-pink-600 mb-2">{results.overall_score}/100</div>
                    <Badge className={`${overallPerformance.bgColor} ${overallPerformance.color} mb-4`}>
                      {overallPerformance.level}
                    </Badge>
                    <p className="text-gray-600 text-sm">
                      Basado en {results.answered_questions} de {results.total_questions} preguntas respondidas
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Top Competencies */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5 text-green-500" />
                    Principales Fortalezas
                  </CardTitle>
                  <CardDescription>Tus competencias más desarrolladas</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {strengths.length > 0 ? (
                    strengths.map((strength, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <strength.icon className="h-4 w-4 text-green-500" />
                          <span className="font-medium">{strength.name}</span>
                        </div>
                        <Badge variant="secondary">{strength.score}/100</Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">Continúa desarrollando tus habilidades</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Radar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  Perfil de Competencias
                </CardTitle>
                <CardDescription>Visualización completa de tus habilidades blandas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={getRadarData()}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="competency" tick={{ fontSize: 12 }} />
                      <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <Radar
                        name="Puntuación"
                        dataKey="score"
                        stroke="#ec4899"
                        fill="#ec4899"
                        fillOpacity={0.3}
                        strokeWidth={2}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Competencies Tab */}
          <TabsContent value="competencies" className="space-y-6">
            {/* Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-500" />
                  Puntuaciones por Competencia
                </CardTitle>
                <CardDescription>Comparación detallada de todas tus habilidades</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-96">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={getBarData()} layout="horizontal">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" domain={[0, 100]} />
                      <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="score" fill="#ec4899" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Individual Competency Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(competencyInfo).map(([key, info]) => {
                const score = results.competency_scores[key] || 0
                const performance = getPerformanceLevel(score)
                const IconComponent = info.icon

                return (
                  <Card key={key}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <IconComponent className={`h-5 w-5 ${info.color}`} />
                          <CardTitle className="text-base">{info.name}</CardTitle>
                        </div>
                        <Badge className={`${performance.bgColor} ${performance.color}`}>{score}/100</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <Progress value={score} className="h-2 mb-3" />
                      <p className="text-sm text-gray-600 mb-2">{info.description}</p>
                      <Badge variant="outline" className={performance.color}>
                        {performance.level}
                      </Badge>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Development Tab */}
          <TabsContent value="development" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Strengths */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    Fortalezas Identificadas
                  </CardTitle>
                  <CardDescription>Competencias en las que destacas</CardDescription>
                </CardHeader>
                <CardContent>
                  {strengths.length > 0 ? (
                    <div className="space-y-3">
                      {strengths.map((strength, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                          <strength.icon className="h-5 w-5 text-green-600" />
                          <div className="flex-1">
                            <div className="font-medium text-green-800">{strength.name}</div>
                            <div className="text-sm text-green-600">Puntuación: {strength.score}/100</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">Continúa desarrollando para identificar fortalezas</p>
                  )}
                </CardContent>
              </Card>

              {/* Development Areas */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertCircle className="h-5 w-5 text-orange-500" />
                    Áreas de Desarrollo
                  </CardTitle>
                  <CardDescription>Competencias con mayor potencial de crecimiento</CardDescription>
                </CardHeader>
                <CardContent>
                  {developmentAreas.length > 0 ? (
                    <div className="space-y-3">
                      {developmentAreas.map((area, index) => (
                        <div key={index} className="flex items-center gap-3 p-3 bg-orange-50 rounded-lg">
                          <area.icon className="h-5 w-5 text-orange-600" />
                          <div className="flex-1">
                            <div className="font-medium text-orange-800">{area.name}</div>
                            <div className="text-sm text-orange-600">Puntuación: {area.score}/100</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">¡Excelente! Todas tus competencias están bien desarrolladas</p>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Development Resources */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                  Recursos de Desarrollo
                </CardTitle>
                <CardDescription>Materiales recomendados para mejorar tus habilidades</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">📚 Libros Recomendados</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• "Inteligencia Emocional" - Daniel Goleman</li>
                      <li>• "Crucial Conversations" - Kerry Patterson</li>
                      <li>• "The 7 Habits" - Stephen Covey</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">🎓 Cursos Online</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Comunicación Efectiva (Coursera)</li>
                      <li>• Liderazgo Transformacional (edX)</li>
                      <li>• Gestión del Tiempo (LinkedIn Learning)</li>
                    </ul>
                  </div>
                  <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold mb-2">🛠️ Herramientas Prácticas</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Técnicas de escucha activa</li>
                      <li>• Matriz de Eisenhower</li>
                      <li>• Feedback 360 grados</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            {/* Development Timeline */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-500" />
                  Plan de Desarrollo Personalizado
                </CardTitle>
                <CardDescription>Ruta recomendada para mejorar tus habilidades blandas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold text-sm">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-800 mb-1">Primeros 30 días</h4>
                      <p className="text-gray-600 text-sm mb-2">Enfócate en la autoconciencia y evaluación</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Solicita feedback de colegas y supervisores</li>
                        <li>• Identifica situaciones donde puedes practicar</li>
                        <li>• Comienza un diario de reflexión diaria</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-semibold text-sm">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-purple-800 mb-1">Siguientes 3 meses</h4>
                      <p className="text-gray-600 text-sm mb-2">Desarrollo activo de competencias prioritarias</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Toma un curso online en tu área de desarrollo</li>
                        <li>• Busca oportunidades de liderazgo en proyectos</li>
                        <li>• Practica técnicas de comunicación asertiva</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-semibold text-sm">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-green-800 mb-1">6 meses</h4>
                      <p className="text-gray-600 text-sm mb-2">Consolidación y aplicación avanzada</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Mentoriza a un colega junior</li>
                        <li>• Lidera un proyecto de equipo completo</li>
                        <li>• Realiza una nueva evaluación de progreso</li>
                      </ul>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center font-semibold text-sm">
                      4
                    </div>
                    <div>
                      <h4 className="font-semibold text-pink-800 mb-1">Desarrollo continuo</h4>
                      <p className="text-gray-600 text-sm mb-2">Mantenimiento y crecimiento sostenido</p>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Establece metas de desarrollo anuales</li>
                        <li>• Participa en programas de liderazgo</li>
                        <li>• Comparte conocimientos con tu equipo</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-pink-500" />
                  Próximos Pasos Recomendados
                </CardTitle>
                <CardDescription>Acciones específicas para comenzar tu desarrollo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">🎯 Acción Inmediata</h4>
                    <p className="text-sm text-blue-700">
                      Programa una conversación con tu supervisor para discutir oportunidades de desarrollo en tus áreas
                      de mejora identificadas.
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">📚 Aprendizaje</h4>
                    <p className="text-sm text-green-700">
                      Inscríbete en un curso online sobre tu competencia con menor puntuación para comenzar el
                      desarrollo estructurado.
                    </p>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">🤝 Networking</h4>
                    <p className="text-sm text-purple-700">
                      Conecta con colegas que destaquen en las áreas donde quieres mejorar y solicita consejos o
                      mentoría.
                    </p>
                  </div>
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">📊 Seguimiento</h4>
                    <p className="text-sm text-orange-700">
                      Programa una reevaluación en 3 meses para medir tu progreso y ajustar tu plan de desarrollo.
                    </p>
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
