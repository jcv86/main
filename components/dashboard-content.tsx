"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import {
  BookOpen,
  Brain,
  Target,
  TrendingUp,
  Users,
  Award,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Zap,
  BarChart3,
  Calendar,
  MessageSquare,
  FileText,
  ExternalLink,
} from "lucide-react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

interface UserProfile {
  id: string
  email: string
  full_name: string
  avatar_url?: string
  created_at: string
  updated_at: string
}

interface TestResult {
  id: number
  test_type: string
  results: any
  completed_at: string
  score?: number
}

interface DashboardStats {
  testsCompleted: number
  totalTests: number
  knowledgeBooks: number
  aiInteractions: number
  lastActivity: string
}

export default function DashboardContent() {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [stats, setStats] = useState<DashboardStats>({
    testsCompleted: 0,
    totalTests: 5,
    knowledgeBooks: 0,
    aiInteractions: 0,
    lastActivity: "Hoy",
  })
  const [loading, setLoading] = useState(true)

  const userEmail = "demo@example.com" // In real app, get from auth

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      // Load user profile
      const { data: profileData } = await supabase.from("user_profiles").select("*").eq("email", userEmail).single()

      // Load test results
      const { data: resultsData } = await supabase
        .from("test_results")
        .select("*")
        .eq("user_email", userEmail)
        .order("completed_at", { ascending: false })

      // Load knowledge base count
      const { count: booksCount } = await supabase.from("knowledge_base").select("*", { count: "exact", head: true })

      // Load AI interactions count
      const { count: aiCount } = await supabase
        .from("ai_interactions")
        .select("*", { count: "exact", head: true })
        .eq("user_email", userEmail)

      setProfile(profileData)
      setTestResults(resultsData || [])
      setStats({
        testsCompleted: resultsData?.length || 0,
        totalTests: 5,
        knowledgeBooks: booksCount || 139,
        aiInteractions: aiCount || 0,
        lastActivity: "Hoy",
      })
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  const getTestProgress = () => {
    return Math.round((stats.testsCompleted / stats.totalTests) * 100)
  }

  const getTestTypeLabel = (testType: string) => {
    const labels: { [key: string]: string } = {
      disc: "DISC",
      "big-five": "Big Five",
      mbti: "MBTI",
      riasec: "RIASEC",
      "soft-skills": "Habilidades Blandas",
    }
    return labels[testType] || testType
  }

  const getTestTypeIcon = (testType: string) => {
    switch (testType) {
      case "disc":
        return <Users className="h-4 w-4" />
      case "big-five":
        return <Brain className="h-4 w-4" />
      case "mbti":
        return <Target className="h-4 w-4" />
      case "riasec":
        return <Award className="h-4 w-4" />
      case "soft-skills":
        return <Star className="h-4 w-4" />
      default:
        return <CheckCircle className="h-4 w-4" />
    }
  }

  const availableTests = [
    {
      id: "disc",
      name: "Test DISC",
      description: "Evalúa tu estilo de comportamiento y comunicación",
      icon: <Users className="h-6 w-6" />,
      color: "bg-blue-500",
      href: "/test/disc",
    },
    {
      id: "big-five",
      name: "Big Five",
      description: "Analiza los cinco grandes rasgos de personalidad",
      icon: <Brain className="h-6 w-6" />,
      color: "bg-purple-500",
      href: "/test/big-five",
    },
    {
      id: "mbti",
      name: "MBTI",
      description: "Descubre tu tipo de personalidad Myers-Briggs",
      icon: <Target className="h-6 w-6" />,
      color: "bg-green-500",
      href: "/test/mbti",
    },
    {
      id: "riasec",
      name: "RIASEC",
      description: "Identifica tus intereses profesionales",
      icon: <Award className="h-6 w-6" />,
      color: "bg-orange-500",
      href: "/test/riasec",
    },
    {
      id: "soft-skills",
      name: "Habilidades Blandas",
      description: "Evalúa tus competencias interpersonales",
      icon: <Star className="h-6 w-6" />,
      color: "bg-pink-500",
      href: "/test/soft-skills",
    },
  ]

  const completedTestIds = testResults.map((result) => result.test_type)

  if (loading) {
    return (
      <div className="space-y-6 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white p-6 rounded-lg border animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-20 mb-2" />
              <div className="h-8 bg-gray-200 rounded w-12" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">¡Bienvenido de vuelta, {profile?.full_name || "Usuario"}! 👋</h1>
          <p className="text-gray-600 mt-1">Continúa tu desarrollo profesional</p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">Última actividad</p>
          <p className="font-medium">{stats.lastActivity}</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Tests Completados</p>
                <p className="text-2xl font-bold">{stats.testsCompleted}</p>
                <p className="text-xs text-gray-500">de {stats.totalTests} disponibles</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Progreso</p>
                <p className="text-2xl font-bold">{getTestProgress()}%</p>
                <Progress value={getTestProgress()} className="w-full mt-2" />
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Biblioteca</p>
                <p className="text-2xl font-bold">{stats.knowledgeBooks}</p>
                <p className="text-xs text-gray-500">libros disponibles</p>
              </div>
              <BookOpen className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">AI Coach</p>
                <p className="text-2xl font-bold">{stats.aiInteractions}</p>
                <p className="text-xs text-gray-500">interacciones</p>
              </div>
              <Zap className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="tests">Tests</TabsTrigger>
          <TabsTrigger value="results">Resultados</TabsTrigger>
          <TabsTrigger value="resources">Recursos</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Acciones Rápidas
              </CardTitle>
              <CardDescription>Continúa donde lo dejaste</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link href="/biblioteca">
                  <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                    <BookOpen className="h-6 w-6" />
                    <span>Explorar Biblioteca</span>
                  </Button>
                </Link>
                <Link href="/ai-coach">
                  <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                    <MessageSquare className="h-6 w-6" />
                    <span>AI Coach</span>
                  </Button>
                </Link>
                <Link href="/test/disc">
                  <Button variant="outline" className="w-full h-20 flex flex-col gap-2 bg-transparent">
                    <Target className="h-6 w-6" />
                    <span>Hacer Test</span>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Actividad Reciente
              </CardTitle>
            </CardHeader>
            <CardContent>
              {testResults.length > 0 ? (
                <div className="space-y-3">
                  {testResults.slice(0, 5).map((result) => (
                    <div key={result.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getTestTypeIcon(result.test_type)}
                        <div>
                          <div className="font-medium">Test {getTestTypeLabel(result.test_type)} completado</div>
                          <div className="text-sm text-gray-500">
                            {new Date(result.completed_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary">Completado</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay actividad reciente</h3>
                  <p className="text-gray-600 mb-4">Comienza realizando tu primer test de personalidad</p>
                  <Link href="/test/disc">
                    <Button>Hacer mi primer test</Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tests" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableTests.map((test) => {
              const isCompleted = completedTestIds.includes(test.id)
              return (
                <Card key={test.id} className={`relative ${isCompleted ? "border-green-200 bg-green-50" : ""}`}>
                  {isCompleted && (
                    <div className="absolute top-4 right-4">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                  )}
                  <CardHeader>
                    <div
                      className={`w-12 h-12 ${test.color} rounded-lg flex items-center justify-center text-white mb-4`}
                    >
                      {test.icon}
                    </div>
                    <CardTitle className="text-lg">{test.name}</CardTitle>
                    <CardDescription>{test.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant={isCompleted ? "default" : "secondary"}>
                        {isCompleted ? "Completado" : "Disponible"}
                      </Badge>
                      <Link href={test.href}>
                        <Button size="sm" variant={isCompleted ? "outline" : "default"}>
                          {isCompleted ? "Ver Resultado" : "Comenzar"}
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="results" className="space-y-6">
          {testResults.length > 0 ? (
            <div className="space-y-4">
              {testResults.map((result) => (
                <Card key={result.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        {getTestTypeIcon(result.test_type)}
                        <div>
                          <CardTitle className="text-lg">Test {getTestTypeLabel(result.test_type)}</CardTitle>
                          <CardDescription>
                            Completado el {new Date(result.completed_at).toLocaleDateString()}
                          </CardDescription>
                        </div>
                      </div>
                      <Link href={`/test/${result.test_type}/results`}>
                        <Button variant="outline" size="sm">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Ver Detalles
                        </Button>
                      </Link>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-gray-600">
                      {result.score && <p>Puntuación: {result.score}%</p>}
                      <p>Resultado guardado y disponible para consulta</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay resultados aún</h3>
                  <p className="text-gray-600 mb-4">Completa algunos tests para ver tus resultados aquí</p>
                  <Link href="/test/disc">
                    <Button>Hacer mi primer test</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="resources" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Biblioteca de Conocimiento
                </CardTitle>
                <CardDescription>
                  Accede a {stats.knowledgeBooks} libros especializados en desarrollo profesional
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Libros disponibles</span>
                    <span className="font-medium">{stats.knowledgeBooks}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Categorías</span>
                    <span className="font-medium">13</span>
                  </div>
                  <Link href="/biblioteca">
                    <Button className="w-full mt-4">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Explorar Biblioteca
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  AI Coach Personal
                </CardTitle>
                <CardDescription>Tu asistente inteligente para desarrollo profesional</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Interacciones</span>
                    <span className="font-medium">{stats.aiInteractions}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Disponibilidad</span>
                    <Badge variant="default" className="text-xs">
                      24/7
                    </Badge>
                  </div>
                  <Link href="/ai-coach">
                    <Button className="w-full mt-4">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Chatear con AI Coach
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Documentos y Guías
                </CardTitle>
                <CardDescription>Recursos adicionales para tu desarrollo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Link href="/biblioteca" className="block">
                    <Button variant="ghost" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Guías de Carrera
                    </Button>
                  </Link>
                  <Link href="/biblioteca" className="block">
                    <Button variant="ghost" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Templates y Herramientas
                    </Button>
                  </Link>
                  <Link href="/biblioteca" className="block">
                    <Button variant="ghost" className="w-full justify-start">
                      <FileText className="h-4 w-4 mr-2" />
                      Casos de Estudio
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Planificación
                </CardTitle>
                <CardDescription>Organiza tu desarrollo profesional</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Button variant="ghost" className="w-full justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Plan de Desarrollo
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <Target className="h-4 w-4 mr-2" />
                    Objetivos SMART
                  </Button>
                  <Button variant="ghost" className="w-full justify-start">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Seguimiento de Progreso
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
