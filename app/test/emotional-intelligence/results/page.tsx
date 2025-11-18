"use client"

import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Brain, Heart, Users, Target, Lightbulb, ArrowRight, TrendingUp, Star, Award, BookOpen, Download, Share2, BarChart3, PieChart, Activity, Zap } from 'lucide-react'
import { toast } from "@/hooks/use-toast"
import { loadTestResult } from "@/lib/test-storage"
import { useSession } from "@/components/session-wrapper"

interface TestResults {
  overall_score: number
  competency_scores: {
    self_awareness: number
    self_regulation: number
    motivation: number
    empathy: number
    social_skills: number
  }
  completed_at: string
  duration?: number
}

const competencyInfo = {
  self_awareness: {
    name: "Autoconciencia",
    icon: Brain,
    color: "bg-blue-500",
    description: "Capacidad para reconocer y entender tus propias emociones",
    lowDescription: "Desarrolla mayor conciencia de tus estados emocionales",
    mediumDescription: "Tienes buena conciencia emocional, sigue desarrollándola",
    highDescription: "Excelente autoconciencia emocional",
  },
  self_regulation: {
    name: "Autorregulación",
    icon: Target,
    color: "bg-green-500",
    description: "Habilidad para manejar y controlar tus emociones efectivamente",
    lowDescription: "Trabaja en técnicas de manejo emocional",
    mediumDescription: "Buen control emocional, continúa practicando",
    highDescription: "Excelente autorregulación emocional",
  },
  motivation: {
    name: "Motivación",
    icon: Lightbulb,
    color: "bg-yellow-500",
    description: "Impulso interno hacia el logro y la perseverancia",
    lowDescription: "Busca fuentes de motivación intrínseca",
    mediumDescription: "Buena motivación, mantén el enfoque en tus objetivos",
    highDescription: "Motivación excepcional y orientación al logro",
  },
  empathy: {
    name: "Empatía",
    icon: Heart,
    color: "bg-red-500",
    description: "Capacidad para entender y conectar con las emociones de otros",
    lowDescription: "Practica la escucha activa y observación emocional",
    mediumDescription: "Buena empatía, sigue desarrollando la conexión emocional",
    highDescription: "Empatía excepcional y conexión emocional",
  },
  social_skills: {
    name: "Habilidades Sociales",
    icon: Users,
    color: "bg-purple-500",
    description: "Efectividad en el manejo de relaciones interpersonales",
    lowDescription: "Desarrolla habilidades de comunicación y liderazgo",
    mediumDescription: "Buenas habilidades sociales, continúa mejorando",
    highDescription: "Habilidades sociales excepcionales",
  },
}

const getScoreLevel = (score: number) => {
  if (score >= 85) return { level: "Excelente", color: "text-green-600", bgColor: "bg-green-100" }
  if (score >= 70) return { level: "Bueno", color: "text-blue-600", bgColor: "bg-blue-100" }
  if (score >= 55) return { level: "Promedio", color: "text-yellow-600", bgColor: "bg-yellow-100" }
  return { level: "En Desarrollo", color: "text-orange-600", bgColor: "bg-orange-100" }
}

const getRecommendations = (competencyScores: any) => {
  const recommendations = []

  if (competencyScores.self_awareness < 70) {
    recommendations.push({
      title: "Desarrolla tu Autoconciencia",
      description: "Practica la meditación mindfulness y lleva un diario emocional",
      icon: Brain,
      priority: "Alta",
    })
  }

  if (competencyScores.self_regulation < 70) {
    recommendations.push({
      title: "Mejora tu Autorregulación",
      description: "Aprende técnicas de respiración y manejo del estrés",
      icon: Target,
      priority: "Alta",
    })
  }

  if (competencyScores.empathy < 70) {
    recommendations.push({
      title: "Fortalece tu Empatía",
      description: "Practica la escucha activa y observa las señales no verbales",
      icon: Heart,
      priority: "Media",
    })
  }

  if (competencyScores.social_skills < 70) {
    recommendations.push({
      title: "Desarrolla Habilidades Sociales",
      description: "Participa en actividades de liderazgo y comunicación",
      icon: Users,
      priority: "Media",
    })
  }

  if (recommendations.length === 0) {
    recommendations.push({
      title: "Mantén tu Excelencia",
      description: "Continúa desarrollando tus fortalezas y ayuda a otros",
      icon: Star,
      priority: "Mantenimiento",
    })
  }

  return recommendations
}

export default function EmotionalIntelligenceResults() {
  const router = useRouter()
  const [results, setResults] = useState<TestResults | null>(null)
  const [loading, setLoading] = useState(true)
  const { user } = useSession()

  useEffect(() => {
    loadResults()
  }, [user])

  const loadResults = async () => {
    try {
      setLoading(true)

      console.log("[v0] Loading EI test results...")
      console.log("[v0] User email:", user?.email)

      const loadedResults = await loadTestResult("emotional-intelligence")
      
      if (loadedResults) {
        console.log("[v0] Found results:", loadedResults)
        // Handle both wrapped and direct results
        const resultsData = loadedResults.results || loadedResults
        setResults(resultsData)
      } else {
        console.log("[v0] No test results found")
      }
    } catch (error: any) {
      console.error("[v0] Error loading results:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los resultados",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: "Mis Resultados de Inteligencia Emocional",
        text: `He completado el test de Inteligencia Emocional con una puntuación de ${results?.overall_score}%`,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Enlace copiado",
        description: "El enlace ha sido copiado al portapapeles",
      })
    }
  }

  const handleDownload = () => {
    toast({
      title: "Descarga iniciada",
      description: "Tu reporte detallado se está generando",
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <div className="text-center">
          <Heart className="h-12 w-12 animate-pulse mx-auto mb-4 text-red-500" />
          <p className="text-gray-600">Cargando tus resultados...</p>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <Heart className="h-16 w-16 mx-auto mb-6 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">No se encontraron resultados</h2>
            <p className="text-xl text-gray-600 mb-6">Parece que aún no has completado el test de Inteligencia Emocional.</p>
            <Button onClick={() => router.push("/test/emotional-intelligence")} className="bg-red-500 hover:bg-red-600">
              Realizar Test
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const overallLevel = getScoreLevel(results.overall_score)
  const recommendations = getRecommendations(results.competency_scores)

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-6 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-lg">
              <Heart className="h-16 w-16 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Resultados de Inteligencia Emocional</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Tu perfil emocional completo con análisis detallado y recomendaciones personalizadas
          </p>
        </div>

        {/* Overall Score */}
        <Card className="mb-8 shadow-xl bg-gradient-to-r from-red-500 to-pink-500 text-white">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-4">Tu Puntuación General</h2>
                <div className="text-6xl font-bold mb-4">{results.overall_score}%</div>
                <Badge className={`${overallLevel.bgColor} ${overallLevel.color} text-lg px-4 py-2`}>
                  {overallLevel.level}
                </Badge>
                <p className="text-red-100 mt-4 text-lg">
                  {results.overall_score >= 85
                    ? "¡Excelente! Tienes una inteligencia emocional muy desarrollada que te permite navegar efectivamente las situaciones sociales y profesionales."
                    : results.overall_score >= 70
                      ? "¡Muy bien! Tienes una buena base de inteligencia emocional con oportunidades específicas de crecimiento."
                      : results.overall_score >= 55
                        ? "Tienes una inteligencia emocional promedio con varias áreas donde puedes desarrollar tus habilidades."
                        : "Hay grandes oportunidades para desarrollar tu inteligencia emocional y mejorar tus relaciones interpersonales."}
                </p>
              </div>
              <div className="text-center">
                <div className="bg-white bg-opacity-20 rounded-2xl p-8">
                  <div className="text-4xl font-bold mb-2">Nivel {overallLevel.level}</div>
                  <div className="text-red-100 mb-4">Inteligencia Emocional</div>
                  <div className="flex justify-center space-x-4 text-sm">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{Object.keys(results.competency_scores).length}</div>
                      <div className="text-red-100">Competencias</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{results.duration || 25}m</div>
                      <div className="text-red-100">Duración</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Button onClick={handleShare} variant="outline" className="bg-white">
            <Share2 className="h-4 w-4 mr-2" />
            Compartir Resultados
          </Button>
          <Button onClick={handleDownload} variant="outline" className="bg-white">
            <Download className="h-4 w-4 mr-2" />
            Descargar Reporte
          </Button>
          <Button onClick={() => router.push("/test")} variant="outline" className="bg-white">
            <BookOpen className="h-4 w-4 mr-2" />
            Otros Tests
          </Button>
          <Button onClick={() => router.push("/dashboard")} className="bg-blue-500 hover:bg-blue-600">
            <BarChart3 className="h-4 w-4 mr-2" />
            Ver Dashboard
          </Button>
        </div>

        {/* Detailed Results Tabs */}
        <Tabs defaultValue="competencies" className="space-y-8">
          <TabsList className="grid w-full grid-cols-4 bg-white shadow-lg">
            <TabsTrigger value="competencies" className="flex items-center space-x-2">
              <PieChart className="h-4 w-4" />
              <span>Competencias</span>
            </TabsTrigger>
            <TabsTrigger value="analysis" className="flex items-center space-x-2">
              <Activity className="h-4 w-4" />
              <span>Análisis</span>
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="flex items-center space-x-2">
              <Lightbulb className="h-4 w-4" />
              <span>Recomendaciones</span>
            </TabsTrigger>
            <TabsTrigger value="development" className="flex items-center space-x-2">
              <TrendingUp className="h-4 w-4" />
              <span>Desarrollo</span>
            </TabsTrigger>
          </TabsList>

          {/* Competencies Tab */}
          <TabsContent value="competencies" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(results.competency_scores).map(([key, score]) => {
                const competency = competencyInfo[key as keyof typeof competencyInfo]
                const level = getScoreLevel(score)
                const IconComponent = competency.icon

                return (
                  <Card key={key} className="shadow-lg hover:shadow-xl transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-lg ${competency.color} bg-opacity-20`}>
                          <IconComponent className="h-8 w-8 text-gray-700" />
                        </div>
                        <Badge className={`${level.bgColor} ${level.color}`}>{level.level}</Badge>
                      </div>
                      <CardTitle className="text-xl">{competency.name}</CardTitle>
                      <CardDescription>{competency.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-2xl font-bold text-gray-900">{score}%</span>
                          <span className="text-sm text-gray-500">de 100</span>
                        </div>
                        <Progress value={score} className="h-3" />
                        <p className="text-sm text-gray-600 leading-relaxed">
                          {score >= 85
                            ? competency.highDescription
                            : score >= 70
                              ? competency.mediumDescription
                              : competency.lowDescription}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Analysis Tab */}
          <TabsContent value="analysis" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-6 w-6 text-blue-500" />
                    <span>Fortalezas Principales</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(results.competency_scores)
                      .sort(([, a], [, b]) => b - a)
                      .slice(0, 3)
                      .map(([key, score], index) => {
                        const competency = competencyInfo[key as keyof typeof competencyInfo]
                        const IconComponent = competency.icon
                        return (
                          <div key={key} className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                            <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full text-green-600 font-bold text-sm">
                              {index + 1}
                            </div>
                            <IconComponent className="h-6 w-6 text-green-600" />
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900">{competency.name}</div>
                              <div className="text-sm text-gray-600">
                                {score}% - {getScoreLevel(score).level}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-6 w-6 text-orange-500" />
                    <span>Áreas de Oportunidad</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {Object.entries(results.competency_scores)
                      .sort(([, a], [, b]) => a - b)
                      .slice(0, 3)
                      .map(([key, score], index) => {
                        const competency = competencyInfo[key as keyof typeof competencyInfo]
                        const IconComponent = competency.icon
                        return (
                          <div key={key} className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                            <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full text-orange-600 font-bold text-sm">
                              {index + 1}
                            </div>
                            <IconComponent className="h-6 w-6 text-orange-600" />
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900">{competency.name}</div>
                              <div className="text-sm text-gray-600">{score}% - Potencial de mejora</div>
                            </div>
                          </div>
                        )
                      })}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BarChart3 className="h-6 w-6 text-purple-500" />
                  <span>Perfil Emocional Detallado</span>
                </CardTitle>
                <CardDescription>Análisis comparativo de tus competencias emocionales</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {Object.entries(results.competency_scores).map(([key, score]) => {
                    const competency = competencyInfo[key as keyof typeof competencyInfo]
                    const level = getScoreLevel(score)
                    return (
                      <div key={key} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-gray-900">{competency.name}</span>
                          <div className="flex items-center space-x-2">
                            <Badge className={`${level.bgColor} ${level.color} text-xs`}>{level.level}</Badge>
                            <span className="font-bold text-gray-900">{score}%</span>
                          </div>
                        </div>
                        <Progress value={score} className="h-2" />
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Recommendations Tab */}
          <TabsContent value="recommendations" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {recommendations.map((rec, index) => {
                const IconComponent = rec.icon
                return (
                  <Card key={index} className="shadow-lg">
                    <CardHeader>
                      <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <IconComponent className="h-6 w-6 text-blue-600" />
                        </div>
                        <Badge
                          variant={
                            rec.priority === "Alta" ? "destructive" : rec.priority === "Media" ? "default" : "secondary"
                          }
                        >
                          Prioridad {rec.priority}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{rec.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 leading-relaxed">{rec.description}</p>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <Card className="shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="h-6 w-6 text-blue-500" />
                  <span>Plan de Acción Inmediato</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full font-bold text-sm">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Esta Semana</h4>
                      <p className="text-gray-600">Comienza un diario emocional para aumentar tu autoconciencia</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full font-bold text-sm">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Este Mes</h4>
                      <p className="text-gray-600">Practica técnicas de respiración y mindfulness diariamente</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex items-center justify-center w-8 h-8 bg-blue-500 text-white rounded-full font-bold text-sm">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Próximos 3 Meses</h4>
                      <p className="text-gray-600">Busca oportunidades de liderazgo y feedback de colegas</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Development Tab */}
          <TabsContent value="development" className="space-y-6">
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="h-6 w-6 text-green-500" />
                    <span>Recursos Recomendados</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Libros</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• "Inteligencia Emocional" - Daniel Goleman</li>
                        <li>• "Emotional Intelligence 2.0" - Travis Bradberry</li>
                        <li>• "The EQ Edge" - Steven Stein</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Cursos Online</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Mindfulness y Meditación</li>
                        <li>• Comunicación Efectiva</li>
                        <li>• Liderazgo Emocional</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Activity className="h-6 w-6 text-purple-500" />
                    <span>Ejercicios Prácticos</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Diarios</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Diario de emociones diario</li>
                        <li>• Registro de desencadenantes</li>
                        <li>• Reflexiones de interacciones sociales</li>
                      </ul>
                    </div>
                    <div className="p-4 bg-yellow-50 rounded-lg">
                      <h4 className="font-semibold text-gray-900 mb-2">Técnicas</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Respiración 4-7-8</li>
                        <li>• Escucha activa</li>
                        <li>• Pausa antes de reaccionar</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-6 w-6 text-gold-500" />
                  <span>Próximos Pasos</span>
                </CardTitle>
                <CardDescription>Continúa tu desarrollo con estas evaluaciones complementarias</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <Button
                    onClick={() => router.push("/test/disc")}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center space-y-2"
                  >
                    <Target className="h-8 w-8 text-blue-500" />
                    <span className="font-semibold">Test DISC</span>
                    <span className="text-xs text-gray-500">Estilo de comportamiento</span>
                  </Button>
                  <Button
                    onClick={() => router.push("/test/big-five")}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center space-y-2"
                  >
                    <Brain className="h-8 w-8 text-purple-500" />
                    <span className="font-semibold">Big Five</span>
                    <span className="text-xs text-gray-500">Personalidad completa</span>
                  </Button>
                  <Button
                    onClick={() => router.push("/test/soft-skills")}
                    variant="outline"
                    className="h-auto p-4 flex flex-col items-center space-y-2"
                  >
                    <Users className="h-8 w-8 text-green-500" />
                    <span className="font-semibold">Habilidades Blandas</span>
                    <span className="text-xs text-gray-500">Competencias profesionales</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <div className="text-center mt-12 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">¿Qué sigue?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Usa estos resultados para desarrollar tu inteligencia emocional y mejorar tus relaciones personales y
            profesionales.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              onClick={() => router.push("/dashboard")}
              size="lg"
              className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600"
            >
              Ver Dashboard Completo
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button onClick={() => router.push("/test")} variant="outline" size="lg" className="bg-white">
              Realizar Más Tests
              <BookOpen className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
