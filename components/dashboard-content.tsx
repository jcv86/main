"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  BookOpen,
  Brain,
  Target,
  Award,
  Clock,
  FileText,
  BarChart3,
  CheckCircle,
  Play,
  Eye,
  RotateCcw,
  Heart,
  Palette,
  Compass,
  Zap,
} from "lucide-react"
import { supabase, type UserProfile, type TestResult } from "@/lib/supabase"

// Test configurations with icons and colors
const testConfigs = {
  disc: {
    name: "DISC Assessment",
    icon: Target,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    description: "Evalúa tu estilo de comportamiento y comunicación",
    duration: "10-15 min",
  },
  "big-five": {
    name: "Big Five",
    icon: Brain,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    description: "Analiza los cinco grandes factores de personalidad",
    duration: "15-20 min",
  },
  mbti: {
    name: "MBTI",
    icon: Palette,
    color: "text-green-600",
    bgColor: "bg-green-50",
    borderColor: "border-green-200",
    description: "Descubre tu tipo de personalidad Myers-Briggs",
    duration: "20-25 min",
  },
  riasec: {
    name: "RIASEC",
    icon: Compass,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    description: "Identifica tus intereses profesionales y carreras afines",
    duration: "15-20 min",
  },
  "soft-skills": {
    name: "Habilidades Blandas",
    icon: Heart,
    color: "text-pink-600",
    bgColor: "bg-pink-50",
    borderColor: "border-pink-200",
    description: "Evalúa tus competencias interpersonales y profesionales",
    duration: "20-30 min",
  },
}

export default function DashboardContent() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  const userEmail = "demo@example.com" // In real app, get from auth

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      // Load user profile
      const { data: profile } = await supabase.from("user_profiles").select("*").eq("email", userEmail).single()

      // Load test results
      const { data: results } = await supabase
        .from("test_results")
        .select("*")
        .eq("user_email", userEmail)
        .order("completed_at", { ascending: false })

      setUserProfile(profile)
      setTestResults(results || [])
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getTestStatus = (testType: string) => {
    const result = testResults.find((r) => r.test_type === testType)
    return result ? "completed" : "available"
  }

  const getTestScore = (testType: string) => {
    const result = testResults.find((r) => r.test_type === testType)
    return result?.score || 0
  }

  const getTestDate = (testType: string) => {
    const result = testResults.find((r) => r.test_type === testType)
    return result?.completed_at ? new Date(result.completed_at).toLocaleDateString() : null
  }

  const getQuickInsight = (testType: string, results: any) => {
    switch (testType) {
      case "disc":
        return results?.primary_type ? `Estilo principal: ${results.primary_type}` : "Completa para ver tu estilo"
      case "big-five":
        return results?.primary_traits?.length > 0
          ? `Rasgos principales: ${results.primary_traits.slice(0, 2).join(", ")}`
          : "Completa para ver tus rasgos"
      case "mbti":
        return results?.type ? `Tipo: ${results.type} (${results.type_name})` : "Completa para ver tu tipo"
      case "riasec":
        return results?.holland_code ? `Código Holland: ${results.holland_code}` : "Completa para ver tus intereses"
      case "soft-skills":
        return results?.category_scores
          ? `Puntuación general: ${results.overall_score}%`
          : "Completa para ver tus competencias"
      default:
        return "Test disponible"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  const completedTests = testResults.length
  const totalTests = Object.keys(testConfigs).length
  const completionPercentage = (completedTests / totalTests) * 100

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">¡Bienvenido, {userProfile?.full_name || "Usuario"}!</h1>
            <p className="text-blue-100">Continúa tu desarrollo profesional con nuestras evaluaciones personalizadas</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">
              {completedTests}/{totalTests}
            </div>
            <div className="text-sm text-blue-100">Tests completados</div>
          </div>
        </div>
        <div className="mt-4">
          <Progress value={completionPercentage} className="h-2 bg-blue-500" />
          <div className="text-sm text-blue-100 mt-1">{Math.round(completionPercentage)}% de progreso completado</div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="tests">Tests</TabsTrigger>
          <TabsTrigger value="results">Resultados</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Nivel Actual</p>
                    <p className="text-2xl font-bold">{userProfile?.current_level || 1}</p>
                  </div>
                  <Award className="h-8 w-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">XP Total</p>
                    <p className="text-2xl font-bold">{userProfile?.total_xp || 0}</p>
                  </div>
                  <Zap className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Tests Completados</p>
                    <p className="text-2xl font-bold">{userProfile?.tests_completed || 0}</p>
                  </div>
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Documentos Leídos</p>
                    <p className="text-2xl font-bold">{userProfile?.documents_read || 0}</p>
                  </div>
                  <BookOpen className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Actividad Reciente
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                <div className="space-y-3">
                  {testResults.slice(0, 5).map((result) => {
                    const config = testConfigs[result.test_type as keyof typeof testConfigs]
                    const Icon = config?.icon || Brain

                    return (
                      <div key={result.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Icon className={`h-5 w-5 ${config?.color || "text-gray-600"}`} />
                          <div>
                            <div className="font-medium">{config?.name || result.test_type}</div>
                            <div className="text-sm text-gray-500">
                              {new Date(result.completed_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <Badge variant="secondary">{result.score}%</Badge>
                      </div>
                    )
                  })}
                  {testResults.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      No hay actividad reciente. ¡Completa tu primer test!
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tests" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(testConfigs).map(([testType, config]) => {
              const status = getTestStatus(testType)
              const score = getTestScore(testType)
              const Icon = config.icon

              return (
                <Card key={testType} className={`${config.borderColor} border-2 hover:shadow-lg transition-shadow`}>
                  <CardHeader className={config.bgColor}>
                    <div className="flex items-center justify-between">
                      <Icon className={`h-8 w-8 ${config.color}`} />
                      {status === "completed" && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          Completado
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-xl">{config.name}</CardTitle>
                    <CardDescription>{config.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Duración:</span>
                        <span className="font-medium">{config.duration}</span>
                      </div>

                      {status === "completed" && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Puntuación:</span>
                            <span className="font-bold text-green-600">{score}%</span>
                          </div>
                          <Progress value={score} className="h-2" />
                        </div>
                      )}

                      <div className="flex gap-2">
                        {status === "completed" ? (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 bg-transparent"
                              onClick={() => (window.location.href = `/test/${testType}/results`)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ver Resultados
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 bg-transparent"
                              onClick={() => (window.location.href = `/test/${testType}`)}
                            >
                              <RotateCcw className="h-4 w-4 mr-1" />
                              Repetir Test
                            </Button>
                          </>
                        ) : (
                          <Button className="w-full" onClick={() => (window.location.href = `/test/${testType}`)}>
                            <Play className="h-4 w-4 mr-2" />
                            Comenzar Test
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          <div className="grid gap-6">
            {testResults.length > 0 ? (
              testResults.map((result) => {
                const config = testConfigs[result.test_type as keyof typeof testConfigs]
                const Icon = config?.icon || Brain
                const insight = getQuickInsight(result.test_type, result.results)

                return (
                  <Card key={result.id} className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-lg ${config?.bgColor || "bg-gray-50"}`}>
                            <Icon className={`h-6 w-6 ${config?.color || "text-gray-600"}`} />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold">{config?.name || result.test_type}</h3>
                            <p className="text-sm text-gray-600">Completado el {getTestDate(result.test_type)}</p>
                            <p className="text-sm text-gray-500 mt-1">{insight}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600 mb-1">{result.score}%</div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => (window.location.href = `/test/${result.test_type}/results`)}
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              Ver Detalles
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => (window.location.href = `/test/${result.test_type}`)}
                            >
                              <RotateCcw className="h-4 w-4 mr-1" />
                              Repetir
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center py-8">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No hay resultados disponibles</h3>
                    <p className="text-gray-600 mb-4">Completa tu primer test para ver tus resultados aquí</p>
                    <Button onClick={() => setActiveTab("tests")}>Explorar Tests</Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Biblioteca de Conocimiento
              </CardTitle>
              <CardDescription>Recursos y documentos para tu desarrollo profesional</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Próximamente</h3>
                <p className="text-gray-600">La biblioteca de documentos estará disponible pronto</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
