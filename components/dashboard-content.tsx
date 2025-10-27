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
  Users,
  BookOpen,
  Award,
  CheckCircle,
  Clock,
  BarChart3,
  MessageSquare,
  Star,
  ArrowRight,
  Play,
  Trophy,
  Zap,
  Heart,
  Lightbulb,
  Sparkles,
  TrendingUp,
  Calendar,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { DailyCareerTip } from "@/components/daily-career-tip"
import { AchievementBadge } from "@/components/achievement-badge"
import { GoalTracker } from "@/components/goal-tracker"
import { ActivityCalendar } from "@/components/activity-calendar" // Import ActivityCalendar component

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
  const [userId, setUserId] = useState<string | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile>({
    name: "Usuario",
    email: "usuario@ejemplo.com",
    completedTests: 3,
    totalTests: 6,
    level: "Explorador",
    points: 1250,
  })

  const [recentResults, setRecentResults] = useState<TestResult[]>([
    {
      id: "disc",
      name: TEST_NAMES.disc.name,
      score: 85,
      completedAt: "2024-01-15",
      insights: ["Estilo dominante", "Orientado a resultados", "Líder natural"],
    },
    {
      id: "big-five",
      name: TEST_NAMES.bigFive.name,
      score: 78,
      completedAt: "2024-01-10",
      insights: ["Alta apertura", "Consciencioso", "Extrovertido"],
    },
  ])

  const availableTests = [
    {
      id: "disc",
      name: TEST_NAMES.disc.name,
      description: TEST_NAMES.disc.description,
      duration: "10-15 min",
      icon: Users,
      color: "bg-blue-500",
      completed: true,
      route: "/test/disc",
    },
    {
      id: "emotional-intelligence",
      name: TEST_NAMES.emotionalIntelligence.name,
      description: TEST_NAMES.emotionalIntelligence.description,
      duration: "12-18 min",
      icon: Heart,
      color: "bg-pink-500",
      completed: false,
      route: "/test/emotional-intelligence",
    },
    {
      id: "mbti",
      name: TEST_NAMES.mbti.name,
      description: TEST_NAMES.mbti.description,
      duration: "15-20 min",
      icon: Brain,
      color: "bg-purple-500",
      completed: false,
      route: "/test/mbti",
    },
    {
      id: "big-five",
      name: TEST_NAMES.bigFive.name,
      description: TEST_NAMES.bigFive.description,
      duration: "12-18 min",
      icon: Star,
      color: "bg-yellow-500",
      completed: true,
      route: "/test/big-five",
    },
    {
      id: "riasec",
      name: TEST_NAMES.riasec.name,
      description: TEST_NAMES.riasec.description,
      duration: "10-15 min",
      icon: Target,
      color: "bg-green-500",
      completed: false,
      route: "/test/riasec",
    },
    {
      id: "soft-skills",
      name: TEST_NAMES.softSkills.name,
      description: TEST_NAMES.softSkills.description,
      duration: "15-20 min",
      icon: Lightbulb,
      color: "bg-orange-500",
      completed: false,
      route: "/test/soft-skills",
    },
  ]

  const [userAchievements, setUserAchievements] = useState<any[]>([])
  const [loadingAchievements, setLoadingAchievements] = useState(true)

  // State for hybrid AI recommendations
  const [recommendations, setRecommendations] = useState<any[]>([])
  const [loadingRecommendations, setLoadingRecommendations] = useState(true)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/user-profile")
        const data = await response.json()
        console.log("[v0] Fetched user profile:", data)
        if (data.user) {
          setUserId(data.user.id)
          setUserProfile((prev) => ({
            ...prev,
            email: data.user.email || prev.email,
            name: data.user.full_name || prev.name,
          }))
        }
      } catch (error) {
        console.error("[v0] Error fetching user:", error)
      }
    }

    fetchUser()
  }, [])

  useEffect(() => {
    const fetchAchievements = async () => {
      if (!userProfile.email) return

      try {
        const response = await fetch(`/api/user-achievements?email=${userProfile.email}`)
        const data = await response.json()
        console.log("[v0] Fetched achievements:", data)
        setUserAchievements(data.achievements || [])
      } catch (error) {
        console.error("[v0] Error fetching achievements:", error)
      } finally {
        setLoadingAchievements(false)
      }
    }

    fetchAchievements()
  }, [userProfile.email])

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoadingRecommendations(true)
        console.log("[v0] Fetching recommendations for userId:", userId)

        const url = userId ? `/api/recommendations?userId=${userId}` : `/api/recommendations`

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 15000) // 15 second timeout

        const response = await fetch(url, { signal: controller.signal })
        clearTimeout(timeoutId)

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
  }, [userId])

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

  return (
    <div className="min-h-screen bg-background p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Panel de Control</h1>
            <p className="text-mutedForeground">Bienvenido de vuelta, {userProfile.name}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push("/ai-coach")} className="border-border bg-transparent">
              <MessageSquare className="h-4 w-4 mr-2" />
              Coach IA
            </Button>
            <Button onClick={() => router.push("/biblioteca")} className="bg-foreground text-background">
              <BookOpen className="h-4 w-4 mr-2" />
              Biblioteca
            </Button>
          </div>
        </div>

        <DailyCareerTip careerStage="intermediate" />

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-mutedForeground">Tests Completados</CardTitle>
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
              <CardTitle className="text-sm font-medium text-mutedForeground">Nivel Actual</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{userProfile.level}</div>
              <div className="text-sm text-mutedForeground">{userProfile.points} puntos</div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-mutedForeground">Logros Obtenidos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{userAchievements.length}</div>
              <div className="text-sm text-mutedForeground">logros desbloqueados</div>
            </CardContent>
          </Card>

          <Card className="border-border bg-card">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-mutedForeground">Última Actividad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">Hoy</div>
              <div className="text-sm text-mutedForeground">Evaluación DISC</div>
            </CardContent>
          </Card>
        </div>

        {userId && <GoalTracker userId={userId} />}

        {userAchievements.length > 0 && (
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                Logros Recientes
              </CardTitle>
              <CardDescription>Tus últimos logros desbloqueados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 overflow-x-auto pb-2">
                {userAchievements.slice(0, 5).map((achievement) => (
                  <AchievementBadge
                    key={achievement.id}
                    name={achievement.achievement_name}
                    description={achievement.achievement_description}
                    icon={achievement.badge_icon}
                    size="md"
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Content Tabs */}
        <Tabs defaultValue="tests" className="space-y-4">
          <TabsList className="grid w-full grid-cols-5 bg-muted">
            {" "}
            {/* Changed from grid-cols-4 to grid-cols-5 */}
            <TabsTrigger value="tests" className="data-[state=active]:bg-background">
              Tests
            </TabsTrigger>
            <TabsTrigger value="results" className="data-[state=active]:bg-background">
              Resultados
            </TabsTrigger>
            <TabsTrigger value="recommendations" className="data-[state=active]:bg-background">
              Recomendaciones
            </TabsTrigger>
            <TabsTrigger value="calendar" className="data-[state=active]:bg-background">
              Calendario
            </TabsTrigger>
            <TabsTrigger value="achievements" className="data-[state=active]:bg-background">
              Logros
            </TabsTrigger>
          </TabsList>

          {/* Available Tests */}
          <TabsContent value="tests" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-foreground">Evaluaciones Disponibles</h2>
              <Badge variant="secondary" className="bg-muted text-mutedForeground">
                {availableTests.filter((t) => !t.completed).length} pendientes
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableTests.map((test) => (
                <Card key={test.id} className="border-border bg-card hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className={`w-10 h-10 rounded-lg ${test.color} flex items-center justify-center`}>
                        <test.icon className="h-5 w-5 text-white" />
                      </div>
                      {test.completed && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Completado
                        </Badge>
                      )}
                    </div>
                    <CardTitle className="text-foreground">{test.name}</CardTitle>
                    <CardDescription className="text-mutedForeground">{test.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-sm text-mutedForeground">
                        <Clock className="h-4 w-4 mr-1" />
                        {test.duration}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleStartTest(test.route)}
                        variant={test.completed ? "outline" : "default"}
                        className={
                          test.completed
                            ? "border-border bg-transparent"
                            : "bg-foreground text-background hover:bg-foreground/90"
                        }
                      >
                        {test.completed ? (
                          <>
                            <BarChart3 className="h-4 w-4 mr-1" />
                            Ver Resultados
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-1" />
                            Comenzar
                          </>
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Recent Results */}
          <TabsContent value="results" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Resultados Recientes</h2>

            {recentResults.length > 0 ? (
              <div className="grid gap-4">
                {recentResults.map((result) => (
                  <Card key={result.id} className="border-border bg-card">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-foreground">{result.name}</CardTitle>
                          <CardDescription className="text-mutedForeground">
                            Completado el {new Date(result.completedAt).toLocaleDateString("es-ES")}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-foreground">{result.score}%</div>
                          <div className="text-sm text-mutedForeground">Puntuación</div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <h4 className="font-medium text-foreground">Insights Clave:</h4>
                        <div className="flex flex-wrap gap-2">
                          {result.insights.map((insight, index) => (
                            <Badge key={index} variant="secondary" className="bg-muted text-mutedForeground">
                              {insight}
                            </Badge>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewResults(result.id)}
                          className="mt-3 border-border bg-transparent"
                        >
                          Ver Análisis Completo
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="border-border bg-card">
                <CardContent className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-mutedForeground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No hay resultados aún</h3>
                  <p className="text-mutedForeground mb-4">
                    Completa tu primera evaluación para ver tus resultados aquí
                  </p>
                  <Button onClick={() => handleStartTest("/test/disc")} className="bg-foreground text-background">
                    Comenzar Primera Evaluación
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Recommendations */}
          <TabsContent value="recommendations" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-foreground">Recomendaciones Personalizadas</h2>
              <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                <Sparkles className="h-3 w-3 mr-1" />
                Powered by Cerebro + OpenAI
              </Badge>
            </div>

            {loadingRecommendations ? (
              <Card className="border-border bg-card">
                <CardContent className="text-center py-8">
                  <Brain className="h-12 w-12 text-mutedForeground mx-auto mb-4 animate-pulse" />
                  <p className="text-mutedForeground">Generando recomendaciones personalizadas...</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {recommendations.map((rec, index) => (
                  <Card key={index} className="border-border bg-card hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                          <rec.icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <CardTitle className="text-foreground">{rec.title}</CardTitle>
                            {rec.source && (
                              <Badge variant="outline" className="text-xs">
                                {rec.source === "openai" && "🤖 OpenAI"}
                                {rec.source === "cerebro" && "🧠 Cerebro"}
                                {rec.source === "hybrid" && "✨ Hybrid"}
                              </Badge>
                            )}
                          </div>
                          <CardDescription className="text-mutedForeground">{rec.description}</CardDescription>
                          {rec.confidence && (
                            <div className="mt-2 flex items-center gap-2">
                              <Progress value={rec.confidence * 100} className="h-1 w-20" />
                              <span className="text-xs text-mutedForeground">
                                {Math.round(rec.confidence * 100)}% confianza
                              </span>
                            </div>
                          )}
                        </div>
                        <Button variant="outline" size="sm" className="border-border bg-transparent">
                          {rec.action}
                        </Button>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}

            {/* Refresh button for recommendations */}
            <Button
              variant="outline"
              className="w-full border-border bg-transparent"
              onClick={() => {
                setLoadingRecommendations(true)
                // Refetch recommendations
                fetch(`/api/recommendations?userId=${userId}`)
                  .then((res) => res.json())
                  .then((data) => {
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
                    }
                  })
                  .finally(() => setLoadingRecommendations(false))
              }}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Actualizar Recomendaciones
            </Button>
          </TabsContent>

          <TabsContent value="calendar" className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-foreground">Mi Calendario de Actividades</h2>
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Calendar className="h-3 w-3 mr-1" />
                WhatsApp Activo
              </Badge>
            </div>
            <ActivityCalendar userEmail={userProfile.email} />
          </TabsContent>

          {/* Achievements */}
          <TabsContent value="achievements" className="space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Logros y Reconocimientos</h2>

            <div className="grid gap-4">
              {achievements.map((achievement, index) => (
                <Card
                  key={index}
                  className={`border-border ${achievement.earned ? "bg-card" : "bg-muted/50"} transition-all`}
                >
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                          achievement.earned ? "bg-yellow-500" : "bg-muted"
                        }`}
                      >
                        <achievement.icon
                          className={`h-6 w-6 ${achievement.earned ? "text-white" : "text-mutedForeground"}`}
                        />
                      </div>
                      <div className="flex-1">
                        <CardTitle className={achievement.earned ? "text-foreground" : "text-mutedForeground"}>
                          {achievement.title}
                        </CardTitle>
                        <CardDescription className="text-mutedForeground">{achievement.description}</CardDescription>
                        {achievement.earned && achievement.date && (
                          <div className="text-sm text-mutedForeground mt-1">
                            Obtenido el {new Date(achievement.date).toLocaleDateString("es-ES")}
                          </div>
                        )}
                      </div>
                      {achievement.earned && (
                        <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                          <Trophy className="h-3 w-3 mr-1" />
                          Obtenido
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-foreground">Acciones Rápidas</CardTitle>
            <CardDescription className="text-mutedForeground">
              Continúa tu desarrollo profesional con estas acciones recomendadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                variant="outline"
                className="h-auto p-4 border-border bg-transparent"
                onClick={() => router.push("/ai-coach")}
              >
                <div className="text-center">
                  <MessageSquare className="h-8 w-8 mx-auto mb-2 text-foreground" />
                  <div className="font-medium text-foreground">Consultar Coach IA</div>
                  <div className="text-sm text-mutedForeground">Obtén consejos personalizados</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 border-border bg-transparent"
                onClick={() => router.push("/biblioteca")}
              >
                <div className="text-center">
                  <BookOpen className="h-8 w-8 mx-auto mb-2 text-foreground" />
                  <div className="font-medium text-foreground">Explorar Biblioteca</div>
                  <div className="text-sm text-mutedForeground">Recursos de desarrollo</div>
                </div>
              </Button>

              <Button
                variant="outline"
                className="h-auto p-4 border-border bg-transparent"
                onClick={() => handleStartTest("/test/emotional-intelligence")}
              >
                <div className="text-center">
                  <Zap className="h-8 w-8 mx-auto mb-2 text-foreground" />
                  <div className="font-medium text-foreground">Siguiente Test</div>
                  <div className="text-sm text-mutedForeground">Inteligencia Emocional</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
