"use client"

import { useState, useEffect } from "react"
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
  Library,
  RefreshCw,
  ChevronRight,
  Flame,
  CircleDot,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { DailyCareerTip } from "@/components/daily-career-tip"
import { useSession } from "@/components/session-wrapper"

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
    completedTests: 3,
    totalTests: 6,
    level: "Explorador",
    points: 1250,
  })

  const [activeGoals, setActiveGoals] = useState<ActiveGoal[]>([
    {
      id: "1",
      name: "Mejorar comunicación asertiva",
      type: "laboral",
      progress: 65,
      dueDate: "2025-02-15",
      origin: "DISC",
    },
    {
      id: "2",
      name: "Desarrollar liderazgo situacional",
      type: "mixto",
      progress: 40,
      dueDate: "2025-03-01",
      origin: "Big Five",
    },
    {
      id: "3",
      name: "Equilibrio vida-trabajo",
      type: "personal",
      progress: 25,
      dueDate: "2025-02-28",
      origin: "IE",
    },
  ])

  const [booksInProgress, setBooksInProgress] = useState<BookInProgress[]>([
    {
      id: "1",
      title: "Comunicación No Violenta",
      author: "Marshall Rosenberg",
      progress: 72,
      lastRead: "2025-01-24",
    },
    {
      id: "2",
      title: "Los 7 Hábitos",
      author: "Stephen Covey",
      progress: 35,
      lastRead: "2025-01-22",
    },
  ])

  const [simulationHistory, setSimulationHistory] = useState<SimulationHistory[]>([
    {
      id: "1",
      type: "entrevista",
      scenario: "Entrevista Conductual",
      score: 78,
      completedAt: "2025-01-23",
      feedback: "Buen uso del método STAR",
    },
    {
      id: "2",
      type: "conversacion",
      scenario: "Negociación Salarial",
      score: 65,
      completedAt: "2025-01-20",
      feedback: "Mejorar confianza al negociar",
    },
  ])

  const [testEvolution, setTestEvolution] = useState<TestEvolution[]>([
    {
      testId: "disc",
      testName: "Despega Cerebral",
      attempts: [
        { date: "2024-10-15", score: 72 },
        { date: "2025-01-15", score: 85 },
      ],
    },
    {
      testId: "emotionalIntelligence",
      testName: "Inteligencia Emocional",
      attempts: [
        { date: "2024-11-01", score: 68 },
        { date: "2025-01-10", score: 79 },
      ],
    },
  ])

  const [recentResults, setRecentResults] = useState<TestResult[]>([
    {
      id: "disc",
      name: TEST_NAMES.disc.name,
      score: 85,
      completedAt: "2024-01-15",
      insights: ["Alto en Dominancia", "Orientado a resultados"],
    },
    {
      id: "emotionalIntelligence",
      name: TEST_NAMES.emotionalIntelligence.name,
      score: 79,
      completedAt: "2024-01-10",
      insights: ["Buena autoconciencia", "Mejorar regulación"],
    },
    {
      id: "bigFive",
      name: TEST_NAMES.bigFive.name,
      score: 82,
      completedAt: "2024-01-08",
      insights: ["Alta apertura", "Responsabilidad moderada"],
    },
  ])

  const [userAchievements, setUserAchievements] = useState<any[]>([])
  const [loadingAchievements, setLoadingAchievements] = useState(true)

  // State for hybrid AI recommendations
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loadingRecommendations, setLoadingRecommendations] = useState(true)

  const [isAdmin, setIsAdmin] = useState(false)
  const [checkingAdmin, setCheckingAdmin] = useState(true)

  useEffect(() => {
    console.log("[v0] DashboardContent mounted")
    console.log("[v0] sessionUser:", sessionUser)

    if (sessionUser) {
      console.log("[v0] Loading user from session:", sessionUser)
      setUserId(sessionUser.id)
      setUserProfile((prev) => ({
        ...prev,
        email: sessionUser.email,
        name: sessionUser.name || sessionUser.email.split("@")[0],
      }))
      console.log("[v0] User profile updated with email:", sessionUser.email)
    } else {
      console.log("[v0] No session user found")
    }
  }, [sessionUser])

  useEffect(() => {
    console.log("[v0] Achievements effect triggered, email:", userProfile.email)

    const fetchAchievements = async () => {
      if (!userProfile.email) {
        console.log("[v0] Skipping achievements fetch - no email yet")
        return
      }

      try {
        console.log("[v0] Fetching achievements for:", userProfile.email)
        const response = await fetch(`/api/user-achievements?email=${userProfile.email}`)
        const data = await response.json()
        console.log("[v0] Fetched achievements:", data)
        setUserAchievements(data.achievements || [])
      } catch (error) {
        console.error("[v0] Error fetching achievements:", error)
        setUserAchievements([]) // Set empty array on error
      } finally {
        setLoadingAchievements(false)
        console.log("[v0] Achievements loading complete")
      }
    }

    fetchAchievements()
  }, [userProfile.email])

  useEffect(() => {
    console.log("[v0] Recommendations effect triggered, email:", userProfile.email)

    const fetchRecommendations = async () => {
      if (!userProfile.email) {
        console.log("[v0] Skipping recommendations - no email yet")
        setLoadingRecommendations(false)
        setRecommendations(getFallbackRecommendations())
        return
      }

      try {
        setLoadingRecommendations(true)
        console.log("[v0] Fetching recommendations for userEmail:", userProfile.email)

        const url = `/api/recommendations?userEmail=${encodeURIComponent(userProfile.email)}`
        console.log("[v0] Recommendations URL:", url)

        const controller = new AbortController()
        const timeoutId = setTimeout(() => {
          console.log("[v0] Recommendations request timed out")
          controller.abort()
        }, 10000)

        const response = await fetch(url, { signal: controller.signal })
        clearTimeout(timeoutId)

        console.log("[v0] Recommendations response status:", response.status)

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log("[v0] Recommendations response:", data)

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
          console.log("[v0] Set", recs.length, "recommendations")
        } else {
          console.log("[v0] No recommendations in response, using fallback")
          setRecommendations(getFallbackRecommendations())
        }
      } catch (error) {
        console.error("[v0] Error fetching recommendations:", error)
        setRecommendations(getFallbackRecommendations())
      } finally {
        setLoadingRecommendations(false)
        console.log("[v0] Finished loading recommendations")
      }
    }

    fetchRecommendations()
  }, [userProfile.email])

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!userProfile.email) {
        console.log("[v0] No email yet, skipping admin check")
        setCheckingAdmin(false)
        return
      }

      try {
        console.log("[v0] Checking admin status for:", userProfile.email)
        const response = await fetch(`/api/admin/check?email=${encodeURIComponent(userProfile.email)}`)
        const data = await response.json()
        console.log("[v0] Admin check result:", data)
        console.log("[v0] Setting isAdmin to:", data.isAdmin)
        setIsAdmin(data.isAdmin)
        console.log("[v0] isAdmin state updated")
      } catch (error) {
        console.error("[v0] Error checking admin status:", error)
        setIsAdmin(false)
      } finally {
        setCheckingAdmin(false)
        console.log("[v0] Admin check complete, checkingAdmin set to false")
      }
    }

    checkAdminStatus()
  }, [userProfile.email])

  // Cleaned up useEffect for sessionUser and Admin check
  useEffect(() => {
    if (sessionUser) {
      setUserId(sessionUser.id || null)
      setUserProfile((prev) => ({
        ...prev,
        name: sessionUser.user_metadata?.full_name || sessionUser.email?.split("@")[0] || "Usuario",
        email: sessionUser.email || "",
      }))
    }
  }, [sessionUser])

  useEffect(() => {
    async function checkAdminStatus() {
      if (!userProfile.email) {
        setCheckingAdmin(false)
        return
      }
      try {
        const response = await fetch(`/api/admin/check?email=${encodeURIComponent(userProfile.email)}`)
        const data = await response.json()
        setIsAdmin(data.isAdmin)
      } catch (error) {
        console.error("Error checking admin status:", error)
        setIsAdmin(false)
      } finally {
        setCheckingAdmin(false)
      }
    }
    checkAdminStatus()
  }, [userProfile.email])

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
            {/* Added new navigation buttons */}
            <Button variant="outline" onClick={() => router.push("/metas")}>
              <Target className="h-4 w-4 mr-2" />
              Metas
            </Button>
            <Button variant="outline" onClick={() => router.push("/recursos")}>
              <Library className="h-4 w-4 mr-2" />
              Recursos
            </Button>
            <Button variant="outline" onClick={() => router.push("/simulaciones")}>
              <Gamepad2 className="h-4 w-4 mr-2" />
              Simulaciones
            </Button>
            <Button onClick={() => router.push("/biblioteca")} className="bg-foreground text-background">
              <BookOpen className="h-4 w-4 mr-2" />
              Biblioteca
            </Button>
          </div>
        </div>

        <DailyCareerTip careerStage="intermediate" />

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
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

        {/* Removed Quick Actions section as it's now integrated into the overview tab */}
      </div>
    </div>
  )
}
