"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Brain,
  Heart,
  Users,
  Target,
  Lightbulb,
  TrendingUp,
  Award,
  BookOpen,
  Download,
  Share2,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Star,
  Zap,
  Trophy,
  Clock,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Sparkles,
  Rocket,
  Shield,
  Compass,
} from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface TestResult {
  id: number
  test_type: string
  test_name: string
  results: {
    overall_score: number
    competency_scores: {
      self_awareness: number
      self_regulation: number
      motivation: number
      empathy: number
      social_skills: number
    }
    detailed_analysis: {
      [key: string]: {
        score: number
        level: string
        description: string
        strengths: string[]
        development_areas: string[]
      }
    }
    ei_profile: string
    profile_description: string
    career_implications: {
      ideal_roles: string[]
      work_environments: string[]
      leadership_style: string
    }
    development_recommendations: Array<{
      area: string
      recommendation: string
      timeframe: string
      priority: string
    }>
    strengths_summary: string[]
    growth_areas: string[]
  }
  score: number
  completed_at: string
  duration_minutes?: number
}

const categoryInfo = {
  self_awareness: {
    name: "Autoconciencia",
    icon: Brain,
    color: "bg-blue-500",
    lightColor: "bg-blue-50",
    textColor: "text-blue-600",
    description: "Reconocimiento de tus propias emociones y su impacto",
  },
  self_regulation: {
    name: "Autorregulación",
    icon: Target,
    color: "bg-green-500",
    lightColor: "bg-green-50",
    textColor: "text-green-600",
    description: "Manejo efectivo de tus emociones y impulsos",
  },
  motivation: {
    name: "Motivación",
    icon: Lightbulb,
    color: "bg-yellow-500",
    lightColor: "bg-yellow-50",
    textColor: "text-yellow-600",
    description: "Impulso interno hacia el logro y la excelencia",
  },
  empathy: {
    name: "Empatía",
    icon: Heart,
    color: "bg-red-500",
    lightColor: "bg-red-50",
    textColor: "text-red-600",
    description: "Comprensión y conexión con las emociones de otros",
  },
  social_skills: {
    name: "Habilidades Sociales",
    icon: Users,
    color: "bg-purple-500",
    lightColor: "bg-purple-50",
    textColor: "text-purple-600",
    description: "Manejo efectivo de relaciones interpersonales",
  },
}

export default function EmotionalIntelligenceResults() {
  const router = useRouter()
  const [result, setResult] = useState<TestResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("competencies")

  useEffect(() => {
    fetchResults()
  }, [])

  const fetchResults = async () => {
    try {
      const response = await fetch("/api/test-results?type=emotional-intelligence&latest=true")
      if (!response.ok) throw new Error("Failed to fetch results")
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Error fetching results:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los resultados",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getScoreLevel = (score: number) => {
    if (score >= 85) return { level: "Excepcional", color: "text-green-600", bgColor: "bg-green-100", icon: Trophy }
    if (score >= 70) return { level: "Alto", color: "text-blue-600", bgColor: "bg-blue-100", icon: Star }
    if (score >= 55) return { level: "Bueno", color: "text-yellow-600", bgColor: "bg-yellow-100", icon: CheckCircle }
    return { level: "En Desarrollo", color: "text-red-600", bgColor: "bg-red-100", icon: TrendingUp }
  }

  const downloadResults = () => {
    if (!result) return

    const resultsText = `
RESULTADOS DEL TEST DE INTELIGENCIA EMOCIONAL
============================================

INFORMACIÓN GENERAL
------------------
Fecha de realización: ${new Date(result.completed_at).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })}
Duración: ${result.duration_minutes || "N/A"} minutos
Perfil emocional: ${result.results.ei_profile}

PUNTUACIÓN GENERAL
-----------------
Puntuación total: ${result.results.overall_score}/100
Nivel: ${getScoreLevel(result.results.overall_score).level}

PUNTUACIONES POR COMPETENCIA
---------------------------
• Autoconciencia: ${result.results.competency_scores.self_awareness}/100 (${
      getScoreLevel(result.results.competency_scores.self_awareness).level
    })
• Autorregulación: ${result.results.competency_scores.self_regulation}/100 (${
      getScoreLevel(result.results.competency_scores.self_regulation).level
    })
• Motivación: ${result.results.competency_scores.motivation}/100 (${
      getScoreLevel(result.results.competency_scores.motivation).level
    })
• Empatía: ${result.results.competency_scores.empathy}/100 (${
      getScoreLevel(result.results.competency_scores.empathy).level
    })
• Habilidades Sociales: ${result.results.competency_scores.social_skills}/100 (${
      getScoreLevel(result.results.competency_scores.social_skills).level
    })

DESCRIPCIÓN DEL PERFIL
---------------------
${result.results.profile_description}

FORTALEZAS PRINCIPALES
---------------------
${result.results.strengths_summary.map((strength, index) => `${index + 1}. ${strength}`).join("\n")}

ÁREAS DE CRECIMIENTO
-------------------
${result.results.growth_areas.map((area, index) => `${index + 1}. ${area}`).join("\n")}

IMPLICACIONES PROFESIONALES
--------------------------
Roles ideales:
${result.results.career_implications.ideal_roles.map((role) => `• ${role}`).join("\n")}

Ambientes de trabajo recomendados:
${result.results.career_implications.work_environments.map((env) => `• ${env}`).join("\n")}

Estilo de liderazgo:
${result.results.career_implications.leadership_style}

PLAN DE DESARROLLO
-----------------
${result.results.development_recommendations
  .map(
    (rec, index) =>
      `${index + 1}. ${rec.area} (Prioridad: ${rec.priority})
   Recomendación: ${rec.recommendation}
   Plazo: ${rec.timeframe}
`,
  )
  .join("\n")}

---
Generado por la Plataforma de Desarrollo Profesional
© ${new Date().getFullYear()} - Todos los derechos reservados
    `

    const blob = new Blob([resultsText], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `inteligencia-emocional-resultados-${new Date().toISOString().split("T")[0]}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "✅ Descarga completada",
      description: "Tus resultados han sido descargados exitosamente",
    })
  }

  const shareResults = async () => {
    if (!result) return

    const shareText = `🧠❤️ ¡Completé mi Test de Inteligencia Emocional!

📊 Puntuación: ${result.results.overall_score}/100 (${getScoreLevel(result.results.overall_score).level})
🎯 Perfil: ${result.results.ei_profile}

✨ Mis principales fortalezas:
${result.results.strengths_summary
  .slice(0, 3)
  .map((strength, index) => `${index + 1}. ${strength}`)
  .join("\n")}

🚀 Áreas de crecimiento identificadas:
${result.results.growth_areas
  .slice(0, 2)
  .map((area, index) => `${index + 1}. ${area}`)
  .join("\n")}

#InteligenciaEmocional #DesarrolloPersonal #Liderazgo #Autoconocimiento #CrecimientoProfesional`

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Mis Resultados de Inteligencia Emocional",
          text: shareText,
        })
        toast({
          title: "✅ Compartido exitosamente",
          description: "Tus resultados han sido compartidos",
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      try {
        await navigator.clipboard.writeText(shareText)
        toast({
          title: "📋 Copiado al portapapeles",
          description: "El texto ha sido copiado para que puedas compartirlo",
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "No se pudo copiar al portapapeles",
          variant: "destructive",
        })
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center">
          <div className="relative">
            <Heart className="h-16 w-16 mx-auto mb-6 text-red-500 animate-pulse" />
            <div className="absolute inset-0 h-16 w-16 mx-auto border-4 border-red-200 border-t-red-500 rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Cargando resultados...</h2>
          <p className="text-gray-600">Analizando tu perfil de inteligencia emocional</p>
        </div>
      </div>
    )
  }

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <Card className="w-full max-w-md shadow-xl">
          <CardContent className="text-center p-8">
            <AlertCircle className="h-16 w-16 mx-auto mb-6 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No hay resultados disponibles</h2>
            <p className="text-gray-600 mb-6">
              No se encontraron resultados del test de inteligencia emocional. ¿Te gustaría tomar el test ahora?
            </p>
            <div className="space-y-3">
              <Button
                onClick={() => router.push("/test/emotional-intelligence")}
                className="w-full bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
                size="lg"
              >
                <Heart className="mr-2 h-5 w-5" />
                Tomar Test
              </Button>
              <Button onClick={() => router.push("/test")} variant="outline" className="w-full" size="lg">
                <BookOpen className="mr-2 h-5 w-5" />
                Ver Todos los Tests
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const overallLevel = getScoreLevel(result.results.overall_score)
  const LevelIcon = overallLevel.icon

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="p-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-2xl">
                <Heart className="h-16 w-16 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 p-2 bg-yellow-400 rounded-full shadow-lg">
                <LevelIcon className="h-6 w-6 text-yellow-800" />
              </div>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Resultados de Inteligencia Emocional</h1>
          <div className="flex flex-wrap justify-center items-center gap-4 text-gray-600">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5" />
              <span>
                {new Date(result.completed_at).toLocaleDateString("es-ES", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            {result.duration_minutes && (
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>{result.duration_minutes} minutos</span>
              </div>
            )}
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5" />
              <span>30 preguntas completadas</span>
            </div>
          </div>
        </div>

        {/* Overall Score Card */}
        <Card className="mb-12 shadow-2xl border-0 bg-gradient-to-r from-red-500 to-pink-500 text-white overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-red-600/20 to-pink-600/20"></div>
          <CardContent className="relative p-8">
            <div className="grid md:grid-cols-4 gap-8 items-center">
              <div className="text-center">
                <div className="text-7xl font-bold mb-3 bg-gradient-to-b from-white to-red-100 bg-clip-text text-transparent">
                  {result.results.overall_score}
                </div>
                <div className="text-red-100 text-lg font-medium">Puntuación General</div>
                <div className="text-red-200 text-sm">sobre 100</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <LevelIcon className="h-12 w-12 text-yellow-300" />
                </div>
                <Badge className={`${overallLevel.bgColor} ${overallLevel.color} text-lg px-4 py-2 mb-2 font-semibold`}>
                  {overallLevel.level}
                </Badge>
                <div className="text-red-100 text-sm">Nivel de IE</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <Sparkles className="h-12 w-12 text-yellow-300" />
                </div>
                <div className="text-2xl font-bold mb-2">{result.results.ei_profile}</div>
                <div className="text-red-100 text-sm">Tu Perfil Emocional</div>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-3">
                  <Rocket className="h-12 w-12 text-yellow-300" />
                </div>
                <div className="text-2xl font-bold mb-2">
                  {result.results.competency_scores.self_awareness >= 80 ? "Líder" : "Desarrollador"}
                </div>
                <div className="text-red-100 text-sm">Potencial</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Button onClick={downloadResults} variant="outline" size="lg" className="bg-white hover:bg-gray-50 shadow-lg">
            <Download className="mr-2 h-5 w-5" />
            Descargar Resultados
          </Button>
          <Button onClick={shareResults} variant="outline" size="lg" className="bg-white hover:bg-gray-50 shadow-lg">
            <Share2 className="mr-2 h-5 w-5" />
            Compartir
          </Button>
          <Button
            onClick={() => router.push("/test")}
            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg"
            size="lg"
          >
            <BookOpen className="mr-2 h-5 w-5" />
            Más Tests
          </Button>
          <Button
            onClick={() => router.push("/dashboard")}
            className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 shadow-lg"
            size="lg"
          >
            <BarChart3 className="mr-2 h-5 w-5" />
            Dashboard
          </Button>
        </div>

        {/* Detailed Results Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-xl rounded-xl p-2 h-auto">
            <TabsTrigger
              value="competencies"
              className="flex flex-col items-center space-y-2 p-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg"
            >
              <Brain className="h-6 w-6" />
              <span className="font-medium">Competencias</span>
            </TabsTrigger>
            <TabsTrigger
              value="analysis"
              className="flex flex-col items-center space-y-2 p-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg"
            >
              <TrendingUp className="h-6 w-6" />
              <span className="font-medium">Análisis</span>
            </TabsTrigger>
            <TabsTrigger
              value="career"
              className="flex flex-col items-center space-y-2 p-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg"
            >
              <Award className="h-6 w-6" />
              <span className="font-medium">Carrera</span>
            </TabsTrigger>
            <TabsTrigger
              value="development"
              className="flex flex-col items-center space-y-2 p-4 data-[state=active]:bg-gradient-to-r data-[state=active]:from-red-500 data-[state=active]:to-pink-500 data-[state=active]:text-white rounded-lg"
            >
              <Target className="h-6 w-6" />
              <span className="font-medium">Desarrollo</span>
            </TabsTrigger>
          </TabsList>

          {/* Competencies Tab */}
          <TabsContent value="competencies" className="space-y-8">
            <Card className="shadow-xl">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle className="flex items-center space-x-3 text-2xl">
                  <Brain className="h-8 w-8 text-blue-600" />
                  <span>Análisis por Competencias</span>
                </CardTitle>
                <CardDescription className="text-lg">
                  Evaluación detallada de tus cinco competencias de inteligencia emocional
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid gap-8">
                  {Object.entries(result.results.competency_scores).map(([key, score]) => {
                    const info = categoryInfo[key as keyof typeof categoryInfo]
                    const IconComponent = info.icon
                    const level = getScoreLevel(score)
                    const LevelIconComponent = level.icon

                    return (
                      <div key={key} className={`p-6 rounded-2xl ${info.lightColor} border-2 border-opacity-20`}>
                        <div className="flex items-center justify-between mb-6">
                          <div className="flex items-center space-x-4">
                            <div className={`p-4 rounded-xl ${info.color} bg-opacity-20 shadow-lg`}>
                              <IconComponent className="h-8 w-8 text-gray-700" />
                            </div>
                            <div>
                              <h3 className="text-2xl font-bold text-gray-900">{info.name}</h3>
                              <p className="text-gray-600 text-lg">{info.description}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-2 mb-2">
                              <div className="text-4xl font-bold text-gray-900">{score}</div>
                              <LevelIconComponent className={`h-8 w-8 ${level.color}`} />
                            </div>
                            <Badge className={`${level.bgColor} ${level.color} text-base px-4 py-1 font-semibold`}>
                              {level.level}
                            </Badge>
                          </div>
                        </div>
                        <div className="mb-4">
                          <div className="flex justify-between text-sm text-gray-600 mb-2">
                            <span>Progreso</span>
                            <span>{score}%</span>
                          </div>
                          <Progress value={score} className="h-4 bg-gray-200" />
                        </div>
                        {result.results.detailed_analysis[key] && (
                          <div className="bg-white bg-opacity-60 rounded-xl p-4">
                            <p className="text-gray-700 leading-relaxed">
                              {result.results.detailed_analysis[key].description}
                            </p>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Competency Radar Chart Visualization */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <PieChart className="h-6 w-6 text-purple-600" />
                  <span>Perfil de Competencias</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900">Distribución de Puntuaciones</h3>
                    {Object.entries(result.results.competency_scores).map(([key, score]) => {
                      const info = categoryInfo[key as keyof typeof categoryInfo]
                      return (
                        <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <span className="font-medium text-gray-900">{info.name}</span>
                          <div className="flex items-center space-x-3">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className={`${info.color} h-2 rounded-full transition-all duration-500`}
                                style={{ width: `${score}%` }}
                              />
                            </div>
                            <span className="font-bold text-gray-900 w-8">{score}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div className="bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Interpretación</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                        <span>85-100: Excepcional - Dominio avanzado</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                        <span>70-84: Alto - Competencia sólida</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                        <span>55-69: Bueno - Nivel competente</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                        <span>0-54: En desarrollo - Área de mejora</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-8">
            <div className="grid lg:grid-cols-2 gap-8">
              <Card className="shadow-xl">
                <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                  <CardTitle className="flex items-center space-x-3 text-green-800">
                    <Star className="h-8 w-8" />
                    <span>Fortalezas Principales</span>
                  </CardTitle>
                  <CardDescription className="text-green-700">
                    Tus competencias más desarrolladas en inteligencia emocional
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {result.results.strengths_summary.map((strength, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-4 p-4 bg-green-50 rounded-xl border border-green-200"
                      >
                        <div className="p-2 bg-green-500 rounded-full flex-shrink-0">
                          <CheckCircle className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-green-800 mb-1">Fortaleza #{index + 1}</div>
                          <span className="text-gray-800 leading-relaxed">{strength}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
                  <CardTitle className="flex items-center space-x-3 text-blue-800">
                    <Zap className="h-8 w-8" />
                    <span>Áreas de Crecimiento</span>
                  </CardTitle>
                  <CardDescription className="text-blue-700">
                    Oportunidades identificadas para tu desarrollo emocional
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {result.results.growth_areas.map((area, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-4 p-4 bg-blue-50 rounded-xl border border-blue-200"
                      >
                        <div className="p-2 bg-blue-500 rounded-full flex-shrink-0">
                          <TrendingUp className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="font-semibold text-blue-800 mb-1">Oportunidad #{index + 1}</div>
                          <span className="text-gray-800 leading-relaxed">{area}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle className="flex items-center space-x-3 text-purple-800">
                  <Heart className="h-8 w-8" />
                  <span>Tu Perfil Emocional: {result.results.ei_profile}</span>
                </CardTitle>
                <CardDescription className="text-purple-700">
                  Análisis personalizado de tu estilo de inteligencia emocional
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-200">
                  <p className="text-gray-800 text-lg leading-relaxed">{result.results.profile_description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Detailed Analysis by Competency */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <Compass className="h-8 w-8 text-indigo-600" />
                  <span>Análisis Detallado por Competencia</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-6">
                  {Object.entries(result.results.detailed_analysis).map(([key, analysis]) => {
                    const info = categoryInfo[key as keyof typeof categoryInfo]
                    const IconComponent = info.icon

                    return (
                      <div key={key} className={`p-6 rounded-xl ${info.lightColor} border border-opacity-30`}>
                        <div className="flex items-center space-x-3 mb-4">
                          <IconComponent className={`h-6 w-6 ${info.textColor}`} />
                          <h3 className="text-xl font-semibold text-gray-900">{info.name}</h3>
                          <Badge
                            className={`${getScoreLevel(analysis.score).bgColor} ${getScoreLevel(analysis.score).color}`}
                          >
                            {analysis.level}
                          </Badge>
                        </div>
                        <p className="text-gray-700 mb-4 leading-relaxed">{analysis.description}</p>
                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold text-green-800 mb-2">✅ Fortalezas</h4>
                            <ul className="space-y-1">
                              {analysis.strengths.map((strength, index) => (
                                <li key={index} className="text-sm text-gray-700">
                                  • {strength}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h4 className="font-semibold text-blue-800 mb-2">🎯 Áreas de desarrollo</h4>
                            <ul className="space-y-1">
                              {analysis.development_areas.map((area, index) => (
                                <li key={index} className="text-sm text-gray-700">
                                  • {area}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Career Tab */}
          <TabsContent value="career" className="space-y-8">
            <Card className="shadow-xl">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-indigo-50">
                <CardTitle className="flex items-center space-x-3 text-purple-800">
                  <Award className="h-8 w-8" />
                  <span>Implicaciones Profesionales</span>
                </CardTitle>
                <CardDescription className="text-purple-700 text-lg">
                  Cómo tu inteligencia emocional se traduce en oportunidades profesionales
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid lg:grid-cols-3 gap-8">
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <Trophy className="h-8 w-8 text-purple-600" />
                      <h3 className="text-xl font-bold text-purple-800">Roles Ideales</h3>
                    </div>
                    <div className="space-y-3">
                      {result.results.career_implications.ideal_roles.map((role, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                          <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                          <span className="text-gray-800 font-medium">{role}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <Shield className="h-8 w-8 text-blue-600" />
                      <h3 className="text-xl font-bold text-blue-800">Ambientes Ideales</h3>
                    </div>
                    <div className="space-y-3">
                      {result.results.career_implications.work_environments.map((env, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-white rounded-lg shadow-sm">
                          <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0" />
                          <span className="text-gray-800 font-medium">{env}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
                    <div className="flex items-center space-x-3 mb-4">
                      <Users className="h-8 w-8 text-green-600" />
                      <h3 className="text-xl font-bold text-green-800">Estilo de Liderazgo</h3>
                    </div>
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <p className="text-gray-800 leading-relaxed">
                        {result.results.career_implications.leadership_style}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Career Recommendations */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <Rocket className="h-8 w-8 text-orange-600" />
                  <span>Recomendaciones de Carrera</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Sectores Recomendados</h3>
                    <div className="space-y-3">
                      {[
                        "Recursos Humanos y Desarrollo Organizacional",
                        "Consultoría y Coaching Ejecutivo",
                        "Educación y Formación",
                        "Salud Mental y Bienestar",
                        "Liderazgo y Gestión de Equipos",
                        "Ventas y Relaciones con Clientes",
                      ].map((sector, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                          <Star className="h-5 w-5 text-orange-600" />
                          <span className="text-gray-800">{sector}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Competencias Valoradas</h3>
                    <div className="space-y-3">
                      {[
                        "Liderazgo empático y transformacional",
                        "Comunicación efectiva y asertiva",
                        "Resolución de conflictos",
                        "Trabajo en equipo y colaboración",
                        "Adaptabilidad y gestión del cambio",
                        "Toma de decisiones bajo presión",
                      ].map((competencia, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                          <Zap className="h-5 w-5 text-green-600" />
                          <span className="text-gray-800">{competencia}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Development Tab */}
          <TabsContent value="development" className="space-y-8">
            <Card className="shadow-xl">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className="flex items-center space-x-3 text-green-800">
                  <Target className="h-8 w-8" />
                  <span>Plan de Desarrollo Personalizado</span>
                </CardTitle>
                <CardDescription className="text-green-700 text-lg">
                  Recomendaciones específicas y accionables para mejorar tu inteligencia emocional
                </CardDescription>
              </CardHeader>
              <CardContent className="p-8">
                <div className="grid gap-6">
                  {result.results.development_recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="p-6 border-2 border-gray-200 rounded-2xl hover:border-green-300 transition-all duration-300 bg-gradient-to-r from-white to-green-50"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="p-3 bg-green-500 rounded-full">
                            <Target className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{rec.area}</h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <Clock className="h-4 w-4 text-gray-500" />
                              <span className="text-gray-600">Plazo: {rec.timeframe}</span>
                            </div>
                          </div>
                        </div>
                        <Badge
                          variant={
                            rec.priority === "Alta" ? "destructive" : rec.priority === "Media" ? "default" : "secondary"
                          }
                          className="text-sm px-3 py-1"
                        >
                          Prioridad {rec.priority}
                        </Badge>
                      </div>
                      <div className="bg-white rounded-xl p-4 border border-green-200">
                        <p className="text-gray-800 leading-relaxed text-lg">{rec.recommendation}</p>
                      </div>
                      <div className="mt-4 flex items-center space-x-4 text-sm text-gray-600">
                        <div className="flex items-center space-x-2">
                          <Activity className="h-4 w-4" />
                          <span>Acción requerida</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4" />
                          <span>Impacto esperado: Alto</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Development Resources */}
            <Card className="shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center space-x-3">
                  <BookOpen className="h-8 w-8 text-blue-600" />
                  <span>Recursos de Desarrollo</span>
                </CardTitle>
                <CardDescription>
                  Herramientas y recursos recomendados para tu crecimiento en inteligencia emocional
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                    <BookOpen className="h-8 w-8 text-blue-600 mb-3" />
                    <h3 className="font-semibold text-blue-800 mb-2">Lecturas Recomendadas</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• "Inteligencia Emocional" - Daniel Goleman</li>
                      <li>• "Emotional Intelligence 2.0" - Bradberry</li>
                      <li>• "Primal Leadership" - Goleman</li>
                    </ul>
                  </div>
                  <div className="p-6 bg-green-50 rounded-xl border border-green-200">
                    <Users className="h-8 w-8 text-green-600 mb-3" />
                    <h3 className="font-semibold text-green-800 mb-2">Práctica Social</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Grupos de networking profesional</li>
                      <li>• Voluntariado en organizaciones</li>
                      <li>• Mentoring y coaching</li>
                    </ul>
                  </div>
                  <div className="p-6 bg-purple-50 rounded-xl border border-purple-200">
                    <Brain className="h-8 w-8 text-purple-600 mb-3" />
                    <h3 className="font-semibold text-purple-800 mb-2">Técnicas de Mindfulness</h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• Meditación diaria (10-15 min)</li>
                      <li>• Ejercicios de respiración</li>
                      <li>• Journaling emocional</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Action Plan */}
            <Card className="shadow-xl">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-red-50">
                <CardTitle className="flex items-center space-x-3 text-orange-800">
                  <Rocket className="h-8 w-8" />
                  <span>Plan de Acción de 90 Días</span>
                </CardTitle>
                <CardDescription className="text-orange-700">
                  Pasos concretos para comenzar tu desarrollo inmediatamente
                </CardDescription>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="p-6 bg-gradient-to-br from-red-50 to-pink-50 rounded-xl border border-red-200">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold">
                        1
                      </div>
                      <h3 className="text-lg font-semibold text-red-800">Primeros 30 días</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>✅ Completar autoevaluación diaria</li>
                      <li>✅ Iniciar práctica de mindfulness</li>
                      <li>✅ Identificar triggers emocionales</li>
                      <li>✅ Leer primer libro recomendado</li>
                    </ul>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold">
                        2
                      </div>
                      <h3 className="text-lg font-semibold text-blue-800">Días 31-60</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>🎯 Practicar escucha activa</li>
                      <li>🎯 Buscar feedback de colegas</li>
                      <li>🎯 Unirse a grupo de networking</li>
                      <li>🎯 Implementar técnicas de regulación</li>
                    </ul>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold">
                        3
                      </div>
                      <h3 className="text-lg font-semibold text-green-800">Días 61-90</h3>
                    </div>
                    <ul className="space-y-2 text-sm text-gray-700">
                      <li>🚀 Liderar proyecto de equipo</li>
                      <li>🚀 Mentorear a un colega</li>
                      <li>🚀 Evaluar progreso y ajustar</li>
                      <li>🚀 Planificar siguiente fase</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Next Steps */}
            <div className="text-center bg-gradient-to-r from-red-500 to-pink-500 rounded-2xl p-8 text-white shadow-2xl">
              <Sparkles className="h-12 w-12 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-4">¡Tu Viaje de Desarrollo Comienza Ahora!</h2>
              <p className="text-red-100 text-lg mb-6 max-w-2xl mx-auto">
                Con tu perfil de inteligencia emocional identificado, tienes las herramientas para crecer profesional y
                personalmente. ¡El momento de actuar es ahora!
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button
                  onClick={() => router.push("/dashboard")}
                  size="lg"
                  className="bg-white text-red-500 hover:bg-gray-100 shadow-lg"
                >
                  Ver Dashboard Completo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  onClick={() => router.push("/test")}
                  variant="outline"
                  size="lg"
                  className="border-white text-white hover:bg-white hover:text-red-500 shadow-lg"
                >
                  Tomar Más Tests
                  <BookOpen className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
