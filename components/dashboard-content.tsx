"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { createClient } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"
import { Trophy, Target, BookOpen, Brain, FileText, TrendingUp, Clock, CheckCircle, Star, Users, Lightbulb, BarChart3, ArrowRight, Play, Sparkles, Compass, Heart } from 'lucide-react'

interface UserProfile {
  email: string
  full_name: string
  avatar_url?: string
  current_level: number
  total_xp: number
  tests_completed: number
  documents_read: number
  skills_learned: number
  career_goal?: string
  created_at: string
}

interface TestResult {
  id: string
  test_name: string
  test_type: string
  score: number
  results: any
  completed_at: string
  duration_minutes: number
}

interface Activity {
  id: string
  activity_type: string
  activity_description: string
  xp_earned: number
  created_at: string
}

interface Document {
  id: string
  title: string
  category: string
  content: string
  read_count: number
  created_at: string
}

export default function DashboardContent() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [recentActivities, setRecentActivities] = useState<Activity[]>([])
  const [documents, setDocuments] = useState<Document[]>([])
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState("")
  const [dataLoaded, setDataLoaded] = useState({
    profile: false,
    tests: false,
    activities: false,
    documents: false,
  })

  const router = useRouter()
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  useEffect(() => {
    checkUserSession()
  }, [])

  const checkUserSession = async () => {
    try {
      // Check local session first (faster)
      const localSession = localStorage.getItem("dtc_session")
      if (localSession) {
        try {
          const sessionData = JSON.parse(localSession)
          if (sessionData.authenticated && sessionData.user) {
            setUserEmail(sessionData.user.email)
            loadUserDataOptimized(sessionData.user.email)
            return
          }
        } catch (error) {
          console.log("Invalid local session")
        }
      }

      // Fallback to Supabase session
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (user) {
        setUserEmail(user.email || "")
        loadUserDataOptimized(user.email || "")
      } else {
        router.push("/auth")
      }
    } catch (error) {
      console.error("Session check error:", error)
      router.push("/auth")
    }
  }

  const loadUserDataOptimized = async (email: string) => {
    try {
      // Load profile first (most important)
      loadUserProfile(email)

      // Load other data in parallel but don't block UI
      Promise.all([loadTestResults(email), loadRecentActivities(email), loadDocuments()]).finally(() => {
        setLoading(false)
      })
    } catch (error) {
      console.error("Error loading user data:", error)
      setLoading(false)
    }
  }

  const loadUserProfile = async (email: string) => {
    try {
      const { data: profile, error } = await supabase.from("user_profiles").select("*").eq("email", email).single()

      if (error && error.code !== "PGRST116") {
        console.error("Profile error:", error)
        // Create default profile if doesn't exist
        const defaultProfile = {
          email,
          full_name: email.split("@")[0],
          current_level: 1,
          total_xp: 0,
          tests_completed: 0,
          documents_read: 0,
          skills_learned: 0,
          created_at: new Date().toISOString(),
        }
        setUserProfile(defaultProfile)
      } else if (profile) {
        setUserProfile(profile)
      }

      setDataLoaded((prev) => ({ ...prev, profile: true }))
    } catch (error) {
      console.error("Error loading profile:", error)
      setDataLoaded((prev) => ({ ...prev, profile: true }))
    }
  }

  const loadTestResults = async (email: string) => {
    try {
      const { data: tests, error } = await supabase
        .from("test_results")
        .select("id, test_name, test_type, score, completed_at, duration_minutes")
        .eq("user_email", email)
        .order("completed_at", { ascending: false })
        .limit(10) // Limit results for performance

      if (!error && tests) {
        setTestResults(tests)
      }
      setDataLoaded((prev) => ({ ...prev, tests: true }))
    } catch (error) {
      console.error("Error loading test results:", error)
      setDataLoaded((prev) => ({ ...prev, tests: true }))
    }
  }

  const loadRecentActivities = async (email: string) => {
    try {
      const { data: activities, error } = await supabase
        .from("user_activities")
        .select("id, activity_type, activity_description, xp_earned, created_at")
        .eq("user_email", email)
        .order("created_at", { ascending: false })
        .limit(5) // Limit for performance

      if (!error && activities) {
        setRecentActivities(activities)
      }
      setDataLoaded((prev) => ({ ...prev, activities: true }))
    } catch (error) {
      console.error("Error loading activities:", error)
      setDataLoaded((prev) => ({ ...prev, activities: true }))
    }
  }

  const loadDocuments = async () => {
    try {
      const { data: docs, error } = await supabase
        .from("knowledge_base")
        .select("id, title, category, read_count, created_at")
        .order("created_at", { ascending: false })
        .limit(6) // Limit for performance

      if (!error && docs) {
        setDocuments(docs)
      }
      setDataLoaded((prev) => ({ ...prev, documents: true }))
    } catch (error) {
      console.error("Error loading documents:", error)
      setDataLoaded((prev) => ({ ...prev, documents: true }))
    }
  }

  const getXPForNextLevel = (currentLevel: number) => {
    return currentLevel * 100
  }

  const getCurrentLevelProgress = (totalXP: number, currentLevel: number) => {
    const xpForCurrentLevel = (currentLevel - 1) * 100
    const xpForNextLevel = currentLevel * 100
    const currentLevelXP = totalXP - xpForCurrentLevel
    const neededXP = xpForNextLevel - xpForCurrentLevel
    return Math.max(0, Math.min(100, (currentLevelXP / neededXP) * 100))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("es-ES", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getActivityIcon = (activityType: string) => {
    switch (activityType) {
      case "test_completed":
        return <Brain className="h-4 w-4" />
      case "document_read":
        return <BookOpen className="h-4 w-4" />
      case "skill_learned":
        return <Target className="h-4 w-4" />
      case "level_up":
        return <Trophy className="h-4 w-4" />
      default:
        return <Star className="h-4 w-4" />
    }
  }

  const availableTests = [
    {
      id: "disc",
      name: "Test DISC",
      description: "Descubre tu estilo de comportamiento y comunicación",
      duration: "8-12 min",
      questions: 15,
      category: "Personalidad",
      icon: <Users className="h-6 w-6" />,
      color: "bg-blue-500",
      route: "/test/disc",
    },
    {
      id: "big-five",
      name: "Big Five",
      description: "Evalúa las cinco dimensiones principales de la personalidad",
      duration: "10-15 min",
      questions: 44,
      category: "Personalidad",
      icon: <Brain className="h-6 w-6" />,
      color: "bg-purple-500",
      route: "/test/big-five",
    },
    {
      id: "mbti",
      name: "MBTI",
      description: "Identifica tu tipo de personalidad Myers-Briggs",
      duration: "12-18 min",
      questions: 25,
      category: "Personalidad",
      icon: <Lightbulb className="h-6 w-6" />,
      color: "bg-green-500",
      route: "/test/mbti",
    },
    {
      id: "riasec",
      name: "RIASEC",
      description: "Descubre tus intereses profesionales y vocacionales",
      duration: "8-12 min",
      questions: 30,
      category: "Vocacional",
      icon: <Compass className="h-6 w-6" />,
      color: "bg-orange-500",
      route: "/test/riasec",
    },
    {
      id: "soft-skills",
      name: "Habilidades Blandas",
      description: "Evalúa tus competencias interpersonales y sociales",
      duration: "6-10 min",
      questions: 25,
      category: "Competencias",
      icon: <Heart className="h-6 w-6" />,
      color: "bg-pink-500",
      route: "/test/soft-skills",
      disabled: false, // Now enabled!
    },
  ]

  // Show loading only for initial load
  if (loading && !dataLoaded.profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tu dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto p-6 space-y-6">
        {/* Header del Dashboard */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              ¡Hola, {userProfile?.full_name || userEmail.split("@")[0]}! 👋
            </h1>
            <p className="text-gray-600 mt-1">Bienvenido a tu plataforma de desarrollo profesional</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary" className="text-sm">
              Nivel {userProfile?.current_level || 1}
            </Badge>
            <Avatar>
              <AvatarImage src={userProfile?.avatar_url || "/placeholder.svg"} />
              <AvatarFallback>{userProfile?.full_name?.charAt(0) || userEmail.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Estadísticas Principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Nivel Actual</p>
                  <p className="text-2xl font-bold">{userProfile?.current_level || 1}</p>
                </div>
                <Trophy className="h-8 w-8 text-yellow-500" />
              </div>
              <div className="mt-4">
                <Progress
                  value={getCurrentLevelProgress(userProfile?.total_xp || 0, userProfile?.current_level || 1)}
                />
                <p className="text-xs text-gray-500 mt-1">
                  {userProfile?.total_xp || 0} / {getXPForNextLevel(userProfile?.current_level || 1)} XP
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Tests Completados</p>
                  <p className="text-2xl font-bold">{testResults.length}</p>
                </div>
                <Brain className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Documentos Leídos</p>
                  <p className="text-2xl font-bold">{userProfile?.documents_read || 0}</p>
                </div>
                <BookOpen className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Habilidades</p>
                  <p className="text-2xl font-bold">{userProfile?.skills_learned || 0}</p>
                </div>
                <Target className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contenido Principal con Tabs */}
        <Tabs defaultValue="tests" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="tests">Tests</TabsTrigger>
            <TabsTrigger value="results">Resultados</TabsTrigger>
            <TabsTrigger value="documents">Documentos</TabsTrigger>
            <TabsTrigger value="activity">Actividad</TabsTrigger>
          </TabsList>

          {/* Tab de Tests */}
          <TabsContent value="tests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5" />
                  Tests Psicométricos Disponibles
                </CardTitle>
                <CardDescription>
                  Completa estos tests para conocer mejor tu personalidad, habilidades e intereses profesionales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {availableTests.map((test) => {
                    const isCompleted = testResults.some((result) =>
                      result.test_name.toLowerCase().includes(test.name.toLowerCase().split(" ")[0]),
                    )

                    return (
                      <Card
                        key={test.id}
                        className={`relative ${
                          test.disabled 
                            ? "opacity-60" 
                            : isCompleted 
                            ? "border-green-200 bg-green-50" 
                            : "hover:shadow-lg transition-shadow"
                        }`}
                      >
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-lg ${test.color} text-white`}>{test.icon}</div>
                            <div className="flex flex-col items-end gap-2">
                              <Badge variant="outline">{test.category}</Badge>
                              {isCompleted && <CheckCircle className="h-5 w-5 text-green-500" />}
                            </div>
                          </div>

                          <h3 className="font-semibold text-lg mb-2">{test.name}</h3>
                          <p className="text-gray-600 text-sm mb-4">{test.description}</p>

                          <div className="space-y-2 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Clock className="h-4 w-4" />
                              <span>{test.duration}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <FileText className="h-4 w-4" />
                              <span>{test.questions} preguntas</span>
                            </div>
                          </div>

                          {test.disabled ? (
                            <Button disabled className="w-full">
                              Próximamente
                            </Button>
                          ) : (
                            <div className="flex gap-2">
                              {isCompleted ? (
                                <>
                                  <Button
                                    onClick={() => router.push(`${test.route}/results`)}
                                    className="flex-1"
                                    variant="outline"
                                  >
                                    <BarChart3 className="h-4 w-4 mr-2" />
                                    Ver Resultados
                                  </Button>
                                  <Button onClick={() => router.push(test.route)} variant="outline" size="sm">
                                    Repetir
                                  </Button>
                                </>
                              ) : (
                                <Button onClick={() => router.push(test.route)} className="w-full">
                                  <Play className="h-4 w-4 mr-2" />
                                  Comenzar Test
                                </Button>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                {/* Demo Section */}
                <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-blue-800 mb-2">🚀 Dashboard con IA Integrada</h3>
                    <p className="text-blue-700 mb-4">
                      Explora análisis con IA, coaching personalizado y visualizaciones avanzadas
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button onClick={() => router.push("/test/disc/results?demo=true")} size="lg">
                        <Sparkles className="h-4 w-4 mr-2" />
                        Ver Demo con IA
                      </Button>
                      <Button variant="outline" onClick={() => router.push("/test/soft-skills")} size="lg">
                        <Heart className="h-4 w-4 mr-2" />
                        Nuevo: Test Habilidades Blandas
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab de Resultados */}
          <TabsContent value="results" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Mis Resultados de Tests
                  {!dataLoaded.tests && (
                    <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full ml-2" />
                  )}
                </CardTitle>
                <CardDescription>Revisa y analiza los resultados de todos los tests que has completado</CardDescription>
              </CardHeader>
              <CardContent>
                {!dataLoaded.tests ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-20 bg-gray-200 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : testResults.length === 0 ? (
                  <div className="text-center py-12">
                    <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay resultados aún</h3>
                    <p className="text-gray-500 mb-4">Completa tu primer test para ver tus resultados aquí</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                      <Button onClick={() => router.push("/test/disc")}>
                        <Play className="h-4 w-4 mr-2" />
                        Comenzar con DISC
                      </Button>
                      <Button variant="outline" onClick={() => router.push("/test/soft-skills")}>
                        <Heart className="h-4 w-4 mr-2" />
                        Test Habilidades Blandas
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {testResults.map((result) => (
                      <Card key={result.id}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="p-3 bg-blue-100 rounded-lg">
                                <Brain className="h-6 w-6 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold">{result.test_name}</h3>
                                <p className="text-sm text-gray-600">Completado el {formatDate(result.completed_at)}</p>
                                <p className="text-sm text-gray-500">Duración: {result.duration_minutes} minutos</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary">Puntuación: {result.score}%</Badge>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  const testRoute = result.test_name.toLowerCase().replace(/\s+/g, "-")
                                  router.push(`/test/${testRoute}/results`)
                                }}
                              >
                                <Sparkles className="h-4 w-4 mr-2" />
                                Ver con IA
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab de Documentos */}
          <TabsContent value="documents" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Biblioteca de Conocimiento
                  {!dataLoaded.documents && (
                    <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full ml-2" />
                  )}
                </CardTitle>
                <CardDescription>Accede a recursos, guías y documentos para tu desarrollo profesional</CardDescription>
              </CardHeader>
              <CardContent>
                {!dataLoaded.documents ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-48 bg-gray-200 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : documents.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay documentos disponibles</h3>
                    <p className="text-gray-500">Los documentos aparecerán aquí cuando estén disponibles</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {documents.map((doc) => (
                      <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="p-3 bg-green-100 rounded-lg">
                              <FileText className="h-6 w-6 text-green-600" />
                            </div>
                            <Badge variant="outline">{doc.category}</Badge>
                          </div>

                          <h3 className="font-semibold text-lg mb-2">{doc.title}</h3>

                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <Users className="h-4 w-4" />
                              <span>{doc.read_count} lecturas</span>
                            </div>
                            <Button size="sm">
                              <ArrowRight className="h-4 w-4 mr-2" />
                              Leer
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab de Actividad */}
          <TabsContent value="activity" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Actividad Reciente
                  {!dataLoaded.activities && (
                    <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full ml-2" />
                  )}
                </CardTitle>
                <CardDescription>Revisa tu progreso y actividades más recientes en la plataforma</CardDescription>
              </CardHeader>
              <CardContent>
                {!dataLoaded.activities ? (
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="animate-pulse">
                        <div className="h-16 bg-gray-200 rounded-lg"></div>
                      </div>
                    ))}
                  </div>
                ) : recentActivities.length === 0 ? (
                  <div className="text-center py-12">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay actividad reciente</h3>
                    <p className="text-gray-500">Tu actividad aparecerá aquí cuando comiences a usar la plataforma</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center gap-4 p-4 border rounded-lg">
                        <div className="p-2 bg-blue-100 rounded-full">{getActivityIcon(activity.activity_type)}</div>
                        <div className="flex-1">
                          <p className="font-medium">{activity.activity_description}</p>
                          <p className="text-sm text-gray-500">{formatDate(activity.created_at)}</p>
                        </div>
                        <Badge variant="secondary">+{activity.xp_earned} XP</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
