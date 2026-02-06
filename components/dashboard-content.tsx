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
  Target,
  BookOpen,
  Award,
  BarChart3,
  MessageSquare,
  Trophy,
  Lightbulb,
  Sparkles,
  TrendingUp,
  Calendar,
  Shield,
  Gamepad2,
  RefreshCw,
  ChevronRight,
  Flame,
  CircleDot,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useSession } from "@/components/session-wrapper"
import { BetterMeIntegration } from "@/components/betterme-integration"
interface TestResult {
  id: string
  name: string
  score: number
  completedAt: string
  insights: string[]
}

interface UserProfile {
  name: string
  email: string
  completedTests: number
  totalTests: number
  level: string
  points: number
}

interface ActiveGoal {
  id: string
  name: string
  type: "personal" | "laboral" | "mixto"
  progress: number
  dueDate: string
  origin: string
}

interface BookInProgress {
  id: string
  title: string
  author: string
  progress: number
  lastRead: string
  cover?: string
}

interface SimulationHistory {
  id: string
  type: string
  scenario: string
  score: number
  completedAt: string
  feedback: string
}

interface TestEvolution {
  testId: string
  testName: string
  attempts: { date: string; score: number }[]
}

const TEST_NAMES = {
  disc: {
    name: "Despega Cerebral™",
    description: "Descubre tu estilo de comportamiento y preferencias de comunicación profesional",
  },
  emotionalIntelligence: {
    name: "Inteligencia Emocional Despega™",
    description: "Evalúa tu capacidad para reconocer, entender y gestionar emociones",
  },
  mbti: {
    name: "Mapa de Personalidad Despega™",
    description: "Identifica tu tipo de personalidad y preferencias psicológicas",
  },
  bigFive: {
    name: "5 Dimensiones Despega™",
    description: "Evaluación integral de personalidad en cinco dimensiones principales",
  },
  riasec: {
    name: "Brújula Vocacional Despega™",
    description: "Descubre tus intereses profesionales y carreras compatibles",
  },
  softSkills: {
    name: "Competencias Despega™",
    description: "Evalúa tus habilidades interpersonales y competencias profesionales",
  },
}

export function DashboardContent() {
  const router = useRouter()
  const { user: sessionUser } = useSession()
  const [userId, setUserId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Usuario",
    email: "",
    completedTests: 0,
    totalTests: 6,
    level: "Principiante",
    points: 0,
  })

  const [activeGoals, setActiveGoals] = useState<ActiveGoal[]>([])

  const [booksInProgress, setBooksInProgress] = useState<BookInProgress[]>([])

  const [simulationHistory, setSimulationHistory] = useState<SimulationHistory[]>([])

  const [testEvolution, setTestEvolution] = useState<TestEvolution[]>([])

  const [recentResults, setRecentResults] = useState<TestResult[]>([])

  const [userAchievements, setUserAchievements] = useState<any[]>([])
  const [loadingAchievements, setLoadingAchievements] = useState(true)

  // State for hybrid AI recommendations
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loadingRecommendations, setLoadingRecommendations] = useState(true)

  const [isAdmin, setIsAdmin] = useState(false)
  const [checkingAdmin, setCheckingAdmin] = useState(true)
  
  // Add loading state for initial data fetch
  const [isLoadingInitialData, setIsLoadingInitialData] = useState(true)
  const [shouldRefresh, setShouldRefresh] = useState(false)

  // Detect refresh parameter on client-side only
  useEffect(() => {
    if (typeof window !== "undefined") {
      const searchParams = new URLSearchParams(window.location.search)
      const hasRefresh = searchParams.get("refresh") === "true"
      if (hasRefresh) {
        console.log("[v0] Refresh parameter detected in URL")
        setShouldRefresh(true)
      }
    }
  }, [])

  useEffect(() => {
    console.log("[v0] DashboardContent mounted")

    if (!sessionUser) {
      console.log("[v0] No session user found")
      setLoadingRecommendations(false)
      setLoadingAchievements(false)
      setCheckingAdmin(false)
      return
    }

    // Set user data immediately
    const userEmail = sessionUser.email || ""
    const userName = sessionUser.name || sessionUser.email.split("@")[0] || "Usuario"

    console.log("[v0] Session user:", { id: sessionUser.id, email: userEmail, name: userName })

    setUserId(sessionUser.id || null)
    // Reset completedTests to 0 initially, will update from database
    setUserProfile({ name: userName, email: userEmail, completedTests: 0, totalTests: 6, level: "Principiante", points: 0 })

    // Fetch all data in parallel instead of sequential
    const fetchAllData = async () => {
      if (!userEmail) return

      try {
        const supabase = createClient()
        
        // Fetch user data from users table to get the correct name
        const { data: userData } = await supabase
          .from("users")
          .select("id, email, name")
          .eq("email", userEmail)
          .single()

        if (userData && userData.name) {
          console.log("[v0] Fetched user name from database:", userData.name)
          setUserProfile((prev) => ({ ...prev, name: userData.name }))
        }
        
        // Fetch real test results from Supabase - using correct table name
        const { data: testResults } = await supabase
          .from("test_results")
          .select("*")
          .eq("user_email", userEmail)
          .order("completed_at", { ascending: false })
          .limit(10)

        if (testResults && testResults.length > 0) {
          const mapped = testResults.map((result: any) => {
            let name = result.test_type
            let score = 0

            // Extract score from test_results
            if (result.test_results) {
              const scores = Object.values(result.test_results as any)
              if (scores.length > 0) {
                score = Math.round(scores.reduce((a: any, b: any) => a + b, 0) / scores.length)
              }
            }

            return {
              id: result.id,
              name: name,
              score: score || 0,
              completedAt: new Date(result.created_at).toLocaleDateString("es-AR"),
              insights: [],
            }
          })
          setRecentResults(mapped)
          // UPDATE completedTests count from database
          setUserProfile((prev) => ({ ...prev, completedTests: testResults.length }))
          console.log("[v0] Updated completedTests count:", testResults.length)
        } else {
          console.log("[v0] No test results found for user")
        }

        // Mark initial data loading complete AFTER checking database
        setIsLoadingInitialData(false)

        const [achievementsRes, recommendationsRes, adminRes] = await Promise.all([
          fetch(`/api/user-achievements?email=${userEmail}`).catch(() => null),
          fetch(`/api/recommendations?userEmail=${encodeURIComponent(userEmail)}`).catch(() => null),
          fetch(`/api/admin/check?email=${encodeURIComponent(userEmail)}`).catch(() => null),
        ])

        // Process achievements
        if (achievementsRes?.ok) {
          const data = await achievementsRes.json()
          setUserAchievements(data.achievements || [])
        }

        // Process recommendations
        if (recommendationsRes?.ok) {
          const data = await recommendationsRes.json()
          if (data.success && data.recommendations) {
            const recs = data.recommendations.map((rec: any) => ({
              title: rec.title,
              description: rec.description,
              action: rec.action || "Ver más",
              icon: getCategoryIcon(rec.category),
              source: rec.source,
              confidence: rec.confidence,
            }))
            setRecommendations(recs)
          } else {
            setRecommendations(getFallbackRecommendations())
          }
        } else {
          setRecommendations(getFallbackRecommendations())
        }

        // Process admin status
        if (adminRes?.ok) {
          const data = await adminRes.json()
          setIsAdmin(data.isAdmin)
        }
      } catch (error) {
        console.error("[v0] Error fetching data:", error)
        setRecommendations(getFallbackRecommendations())
      } finally {
        setLoadingAchievements(false)
        setLoadingRecommendations(false)
        setCheckingAdmin(false)
      }
    }

    fetchAllData()
  }, [sessionUser])

  // Handle refresh parameter - refetch test results after test completion
  useEffect(() => {
    // Check for refresh parameter in URL
    const searchParams = new URLSearchParams(window.location.search)
    const hasRefresh = searchParams.get("refresh") === "true"
    
    console.log("[v0] Refresh effect triggered. hasRefresh:", hasRefresh, "sessionUser:", sessionUser?.email, "location:", window.location.href)
    
    if (!hasRefresh || !sessionUser?.email) {
      console.log("[v0] Skipping refresh - no refresh param or no session user")
      return
    }

    console.log("[v0] Refresh parameter detected, refetching test results for:", sessionUser.email)
    
    const supabase = createClient()
    const fetchLatestTestResults = async () => {
      try {
        // Small delay to ensure database write is complete
        await new Promise((resolve) => setTimeout(resolve, 500))
        
        const { data: testResults, error } = await supabase
          .from("test_results")
          .select("*")
          .eq("user_email", sessionUser.email!)
          .order("completed_at", { ascending: false })
          .limit(10)

        if (error) {
          console.error("[v0] Error fetching test results:", error)
          return
        }

        console.log("[v0] Fetched test results count:", testResults?.length || 0)
        
        if (testResults && testResults.length > 0) {
          console.log("[v0] Updated test results after refresh. Count:", testResults.length)
          const mapped = testResults.map((result: any) => {
            let name = result.test_type
            let score = 0

            if (result.results) {
              const scores = Object.values(result.results as any)
              if (scores.length > 0) {
                score = Math.round(scores.reduce((a: any, b: any) => a + b, 0) / scores.length)
              }
            }

            return {
              id: result.id,
              name: name,
              score: score || 0,
              completedAt: new Date(result.completed_at).toLocaleDateString("es-AR"),
              insights: [],
            }
          })
          setRecentResults(mapped)
          setUserProfile((prev) => {
            console.log("[v0] Updating completedTests from", prev.completedTests, "to", testResults.length)
            return { ...prev, completedTests: testResults.length }
          })
        } else {
          console.log("[v0] No test results found in database")
        }
        
        // Clean up the refresh parameter from URL
        window.history.replaceState({}, document.title, window.location.pathname)
      } catch (error) {
        console.error("[v0] Error in refresh fetch:", error)
      }
    }

    fetchLatestTestResults()
  }, [sessionUser?.email, shouldRefresh])

  const achievements = [
    {
      title: "Primer Test Completado",
      description: "Completaste tu primera evaluación",
      icon: Trophy,
      earned: true,
      date: "2024-01-15",
    },
    {
      title: "Explorador de Personalidad",
      description: "Completaste 3 tests de personalidad",
      icon: Brain,
      earned: true,
      date: "2024-01-10",
    },
    {
      title: "Maestro del Autoconocimiento",
      description: "Completa todos los tests disponibles",
      icon: Award,
      earned: false,
      date: null,
    },
  ]

  const handleStartTest = (testRoute: string) => {
    router.push(testRoute)
  }

  const handleViewResults = (testId: string) => {
    router.push(`/test/${testId}/results`)
  }

  const completionPercentage = Math.round((userProfile.completedTests / userProfile.totalTests) * 100)

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "assessment":
        return Brain
      case "skill_development":
        return Lightbulb
      case "learning":
        return BookOpen
      case "coaching":
        return MessageSquare
      case "career_planning":
        return Target
      default:
        return TrendingUp
    }
  }

  const getTypeBadgeColor = (type: string) => {
    switch (type) {
      case "personal":
        return "bg-purple-100 text-purple-700 border-purple-200"
      case "laboral":
        return "bg-blue-100 text-blue-700 border-blue-200"
      case "mixto":
        return "bg-green-100 text-green-700 border-green-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getDaysRemaining = (dueDate: string) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return diff
  }

  const getFallbackRecommendations = () => [
    {
      title: "Completa tus Evaluaciones",
      description: "Realiza los tests pendientes para obtener insights personalizados",
      action: "Ver Tests",
      icon: Brain,
      source: "system",
      confidence: 0.9,
    },
    {
      title: "Consulta el Coach IA",
      description: "Obtén orientación profesional personalizada con Cerebro",
      action: "Hablar con Coach",
      icon: MessageSquare,
      source: "cerebro",
      confidence: 0.85,
    },
    {
      title: "Explora la Biblioteca",
      description: "Accede a recursos de desarrollo profesional curados",
      action: "Ver Recursos",
      icon: BookOpen,
      source: "system",
      confidence: 0.8,
    },
  ]

  console.log("[v0] Rendering dashboard, isAdmin:", isAdmin, "checkingAdmin:", checkingAdmin)

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Panel de Control</h1>
            <p className="text-muted-foreground">Bienvenido de vuelta, {userProfile.name}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {isAdmin && (
              <Button
                variant="outline"
                onClick={() => router.push("/admin/users")}
                className="border-red-500 text-red-600 hover:bg-red-50"
              >
                <Shield className="h-4 w-4 mr-2" />
                Admin
              </Button>
            )}
          </div>
        </div>

        {/* TEST GATE: Show blocker if no tests completed (only after data loads) */}
        {!isLoadingInitialData && userProfile.completedTests === 0 && (
          <Card className="border-2 border-blue-500 bg-blue-50 dark:bg-blue-950">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-900 dark:text-blue-100 flex items-center gap-2">
                <Gamepad2 className="h-6 w-6" />
                ¡Comienza tu Viaje Profesional!
              </CardTitle>
              <CardDescription className="text-base text-blue-800 dark:text-blue-200">
                Completa tu primer test psicométrico para desbloquear tu dashboard personalizado, biblioteca de desarrollo y recomendaciones con IA.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CircleDot className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Descubre tu Perfil Profesional</p>
                    <p className="text-sm text-muted-foreground">Realiza tests psicométricos validados internacionalmente</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CircleDot className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Análisis Personalizado con IA</p>
                    <p className="text-sm text-muted-foreground">Recibe insights y recomendaciones basadas en tus resultados</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CircleDot className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">Coach Virtual 24/7</p>
                    <p className="text-sm text-muted-foreground">Accede a tu coach IA para acompañarte en tu desarrollo</p>
                  </div>
                </div>
              </div>
              <Button 
                onClick={() => router.push("/despega/a1-cerebral")}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12 text-base font-semibold"
              >
                <Sparkles className="h-5 w-5 mr-2" />
                Realizar Mi Primer Test
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Toma unos 15-20 minutos • Resultados inmediatos • Sin compromiso
              </p>
            </CardContent>
          </Card>
        )}

        {!isLoadingInitialData && userProfile.completedTests === 0 ? (
          <div className="opacity-50 pointer-events-none">
            <Card>
              <CardHeader>
                <CardTitle className="text-muted-foreground">Contenido Bloqueado</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Completa tu primer test para acceder a todas las funcionalidades del dashboard</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
        {/* BetterMe Integration Section */}
        <div className="rounded-lg border border-blue-200 bg-blue-50 dark:bg-blue-950 p-6">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-100">Aprendizaje Inteligente</h2>
          </div>
          <BetterMeIntegration />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 h-auto p-1">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-foreground data-[state=active]:text-background"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Resumen
            </TabsTrigger>
            <TabsTrigger
              value="goals"
              className="data-[state=active]:bg-foreground data-[state=active]:text-background"
            >
              <Target className="h-4 w-4 mr-2" />
              Metas
            </TabsTrigger>
            <TabsTrigger
              value="library"
              className="data-[state=active]:bg-foreground data-[state=active]:text-background"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Lectura
            </TabsTrigger>
            <TabsTrigger
              value="simulations"
              className="data-[state=active]:bg-foreground data-[state=active]:text-background"
            >
              <Gamepad2 className="h-4 w-4 mr-2" />
              Simulaciones
            </TabsTrigger>
            <TabsTrigger
              value="evolution"
              className="data-[state=active]:bg-foreground data-[state=active]:text-background"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Evolución
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Progress Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="border-border bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Tests Completados</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {userProfile.completedTests}/{userProfile.totalTests}
                  </div>
                  <Progress value={completionPercentage} className="mt-2" />
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Metas Activas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{activeGoals.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activeGoals.filter((g) => g.progress >= 50).length} al 50%+
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Libros en Curso</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{booksInProgress.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.round(booksInProgress.reduce((acc, b) => acc + b.progress, 0) / booksInProgress.length)}%
                    promedio
                  </p>
                </CardContent>
              </Card>

              <Card className="border-border bg-card">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">Simulaciones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">{simulationHistory.length}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Puntaje promedio:{" "}
                    {Math.round(simulationHistory.reduce((acc, s) => acc + s.score, 0) / simulationHistory.length)}%
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Recent Tests */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5" />
                    Tests Recientes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {recentResults.slice(0, 3).map((result) => (
                    <div
                      key={result.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer"
                      onClick={() => handleViewResults(result.id)}
                    >
                      <div>
                        <p className="font-medium text-sm">{result.name}</p>
                        <p className="text-xs text-muted-foreground">{result.completedAt}</p>
                      </div>
                      <Badge variant="secondary">{result.score}%</Badge>
                    </div>
                  ))}
                  <Button variant="ghost" className="w-full" onClick={() => router.push("/test")}>
                    Ver todos los tests
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Active Goals Preview */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Metas Activas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {activeGoals.slice(0, 3).map((goal) => (
                    <div key={goal.id} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-sm truncate flex-1">{goal.name}</p>
                        <Badge className={getTypeBadgeColor(goal.type)} variant="outline">
                          {goal.type}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <Progress value={goal.progress} className="flex-1 h-2" />
                        <span className="text-xs text-muted-foreground">{goal.progress}%</span>
                      </div>
                    </div>
                  ))}
                  <Button variant="ghost" className="w-full" onClick={() => router.push("/metas")}>
                    Gestionar metas
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Books in Progress Preview */}
              <Card className="border-border bg-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Lectura Actual
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {booksInProgress.slice(0, 2).map((book) => (
                    <div key={book.id} className="space-y-1">
                      <p className="font-medium text-sm">{book.title}</p>
                      <p className="text-xs text-muted-foreground">{book.author}</p>
                      <div className="flex items-center gap-2">
                        <Progress value={book.progress} className="flex-1 h-2" />
                        <span className="text-xs text-muted-foreground">{book.progress}%</span>
                      </div>
                    </div>
                  ))}
                  <Button variant="ghost" className="w-full" onClick={() => router.push("/biblioteca")}>
                    Ver biblioteca
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Achievements */}
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5" />
                  Logros
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        achievement.earned
                          ? "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200"
                          : "bg-muted/30 border-muted opacity-60"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-full ${
                            achievement.earned ? "bg-amber-100 text-amber-600" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <achievement.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">{achievement.title}</p>
                          <p className="text-xs text-muted-foreground">{achievement.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="goals" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Mis Metas SMART</h2>
              <Button onClick={() => router.push("/metas")}>
                <Target className="h-4 w-4 mr-2" />
                Crear Nueva Meta
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeGoals.map((goal) => {
                const daysLeft = getDaysRemaining(goal.dueDate)
                return (
                  <Card key={goal.id} className="border-border bg-card hover:shadow-md transition-shadow">
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-base">{goal.name}</CardTitle>
                        <Badge className={getTypeBadgeColor(goal.type)} variant="outline">
                          {goal.type}
                        </Badge>
                      </div>
                      <CardDescription className="flex items-center gap-2">
                        <CircleDot className="h-3 w-3" />
                        Origen: {goal.origin}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Progreso</span>
                          <span className="font-medium">{goal.progress}%</span>
                        </div>
                        <Progress value={goal.progress} className="h-2" />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {daysLeft > 0 ? `${daysLeft} días restantes` : "Vencida"}
                        </span>
                        {goal.progress >= 50 && (
                          <Badge variant="secondary" className="bg-green-100 text-green-700">
                            <Flame className="h-3 w-3 mr-1" />
                            En camino
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <Card
              className="border-dashed border-2 border-muted hover:border-foreground/50 transition-colors cursor-pointer"
              onClick={() => router.push("/metas")}
            >
              <CardContent className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                <Target className="h-8 w-8 mb-2" />
                <p className="font-medium">Agregar Nueva Meta</p>
                <p className="text-sm">Define objetivos SMART basados en tus tests</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="library" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Libros en Progreso</h2>
              <Button onClick={() => router.push("/biblioteca")}>
                <BookOpen className="h-4 w-4 mr-2" />
                Explorar Biblioteca
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {booksInProgress.map((book) => (
                <Card key={book.id} className="border-border bg-card">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      <div className="w-16 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center">
                        <BookOpen className="h-8 w-8 text-blue-600" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <h3 className="font-semibold">{book.title}</h3>
                        <p className="text-sm text-muted-foreground">{book.author}</p>
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>Progreso</span>
                            <span>{book.progress}%</span>
                          </div>
                          <Progress value={book.progress} className="h-2" />
                        </div>
                        <p className="text-xs text-muted-foreground">Última lectura: {book.lastRead}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5" />
                  Recomendados para Ti
                </CardTitle>
                <CardDescription>Basado en tus resultados de tests</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { title: "Inteligencia Emocional", author: "Daniel Goleman", match: 95 },
                    { title: "Mindset", author: "Carol Dweck", match: 88 },
                    { title: "Drive", author: "Daniel Pink", match: 82 },
                  ].map((book, i) => (
                    <div key={i} className="p-3 rounded-lg bg-muted/50 hover:bg-muted cursor-pointer transition-colors">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-700">
                          {book.match}% match
                        </Badge>
                      </div>
                      <p className="font-medium text-sm">{book.title}</p>
                      <p className="text-xs text-muted-foreground">{book.author}</p>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" className="w-full mt-4" onClick={() => router.push("/recursos")}>
                  Ver más recomendaciones
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="simulations" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Historial de Simulaciones</h2>
              <Button onClick={() => router.push("/simulaciones")}>
                <Gamepad2 className="h-4 w-4 mr-2" />
                Nueva Simulación
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {simulationHistory.map((sim) => (
                <Card key={sim.id} className="border-border bg-card">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <Badge variant="outline" className="mb-2">
                          {sim.type === "entrevista" ? "Entrevista" : "Conversación"}
                        </Badge>
                        <h3 className="font-semibold">{sim.scenario}</h3>
                      </div>
                      <div className="text-right">
                        <div className={`text-2xl font-bold ${sim.score >= 70 ? "text-green-600" : "text-amber-600"}`}>
                          {sim.score}%
                        </div>
                        <p className="text-xs text-muted-foreground">{sim.completedAt}</p>
                      </div>
                    </div>
                    <div className="p-2 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">
                        <strong>Feedback:</strong> {sim.feedback}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm" className="w-full mt-2">
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Repetir Simulación
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Simulaciones Recomendadas</CardTitle>
                <CardDescription>Basadas en tus áreas de mejora</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {[
                    { name: "Entrevista Técnica", difficulty: "Intermedio", relevance: "Alta" },
                    { name: "Conversación con Jefe", difficulty: "Avanzado", relevance: "Media" },
                  ].map((sim, i) => (
                    <div
                      key={i}
                      className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => router.push("/simulaciones")}
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{sim.name}</span>
                        <Badge variant="secondary">{sim.difficulty}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">Relevancia: {sim.relevance}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="evolution" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Evolución de Tests</h2>
              <Button variant="outline" onClick={() => router.push("/test")}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Re-tomar Test
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {testEvolution.map((test) => {
                const improvement =
                  test.attempts.length > 1 ? test.attempts[test.attempts.length - 1].score - test.attempts[0].score : 0
                return (
                  <Card key={test.testId} className="border-border bg-card">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base flex items-center justify-between">
                        {test.testName}
                        {improvement > 0 && (
                          <Badge className="bg-green-100 text-green-700">
                            <TrendingUp className="h-3 w-3 mr-1" />+{improvement}%
                          </Badge>
                        )}
                      </CardTitle>
                      <CardDescription>{test.attempts.length} intentos</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {test.attempts.map((attempt, i) => (
                          <div key={i} className="flex items-center justify-between p-2 bg-muted/50 rounded-lg">
                            <span className="text-sm text-muted-foreground">{attempt.date}</span>
                            <div className="flex items-center gap-2">
                              <Progress value={attempt.score} className="w-24 h-2" />
                              <span className="font-medium text-sm w-12 text-right">{attempt.score}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-3 bg-transparent"
                        onClick={() => router.push(`/test/${test.testId}`)}
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Volver a tomar
                      </Button>
                    </CardContent>
                  </Card>
                )
              })}
            </div>

            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5" />
                  Recomendación de Re-test
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Se recomienda re-tomar los tests cada 3-6 meses para medir tu evolución y ajustar tu plan de
                  desarrollo personal.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {Object.entries(TEST_NAMES)
                    .slice(0, 3)
                    .map(([id, test]) => (
                      <div
                        key={id}
                        className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                        onClick={() => router.push(`/test/${id}`)}
                      >
                        <p className="font-medium text-sm">{test.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">Último: hace 3 meses</p>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        </>
        )}
      </div>
    </div>
  )
}
