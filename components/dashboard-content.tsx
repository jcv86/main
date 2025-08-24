"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  BookOpen,
  Brain,
  FileText,
  MessageSquare,
  Target,
  TrendingUp,
  Calendar,
  Award,
  Users,
  Lightbulb,
  ChevronRight,
  Star,
  Clock,
  CheckCircle,
  LogOut,
  Loader2,
  Play,
  Download,
  Edit,
  RotateCcw,
  Search,
} from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import { useRouter } from "next/navigation"

interface UserProfile {
  email: string
  name: string
  profile_completion_percentage: number
  total_xp: number
  current_level: number
  tests_completed: number
  cv_generated: number
  interview_simulations: number
}

interface TestResult {
  test_name: string
  results: any
  score: number
  completed_at: string
  duration_minutes: number
}

interface UserActivity {
  activity_description: string
  xp_earned: number
  created_at: string
}

interface InterviewSimulation {
  simulation_type: string
  score: number
  feedback: string
  completed_at: string
  duration_minutes: number
}

export default function DashboardContent() {
  const [activeTab, setActiveTab] = useState("overview")
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [userActivities, setUserActivities] = useState<UserActivity[]>([])
  const [interviewHistory, setInterviewHistory] = useState<InterviewSimulation[]>([])
  const [loading, setLoading] = useState(true)
  const [userEmail, setUserEmail] = useState<string>("")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("Todos")

  const router = useRouter()
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

  // Datos de fallback para cuando no hay conexión a la base de datos
  const fallbackData = {
    profile: {
      email: "travis@nuanu.com",
      name: "Travis Nuanu",
      profile_completion_percentage: 65,
      total_xp: 150,
      current_level: 3,
      tests_completed: 3,
      cv_generated: 1,
      interview_simulations: 5,
    },
    tests: [
      {
        test_name: "DISC",
        results: {
          primary_type: "Influencer",
          scores: { D: 65, I: 85, S: 45, C: 35 },
          description: "Perfil Influencer con alta capacidad de comunicación y persuasión",
        },
        score: 85,
        completed_at: "2024-11-15T10:30:00Z",
        duration_minutes: 12,
      },
      {
        test_name: "Big Five",
        results: {
          scores: { openness: 78, conscientiousness: 72, extraversion: 82, agreeableness: 68, neuroticism: 35 },
          description: "Alta apertura y extraversión, baja en neuroticismo",
        },
        score: 72,
        completed_at: "2024-11-12T14:20:00Z",
        duration_minutes: 18,
      },
      {
        test_name: "MBTI",
        results: {
          type: "ENFP",
          description: "El Inspirador - Entusiasta, creativo y sociable",
          preferences: { E: 75, N: 68, F: 72, P: 80 },
        },
        score: 75,
        completed_at: "2024-11-10T16:45:00Z",
        duration_minutes: 25,
      },
    ],
    activities: [
      { activity_description: "Completaste el test DISC", xp_earned: 15, created_at: "2024-11-15T10:30:00Z" },
      { activity_description: "Completaste el test Big Five", xp_earned: 20, created_at: "2024-11-12T14:20:00Z" },
      { activity_description: "Completaste el test MBTI", xp_earned: 25, created_at: "2024-11-10T16:45:00Z" },
      { activity_description: "Generaste tu primer CV", xp_earned: 20, created_at: "2024-11-14T09:15:00Z" },
      {
        activity_description: "Desbloqueaste la insignia 'Explorador'",
        xp_earned: 10,
        created_at: "2024-11-13T11:20:00Z",
      },
    ],
    interviews: [
      {
        simulation_type: "general",
        score: 8.5,
        feedback: "Excelente comunicación y confianza. Mejorar en ejemplos específicos con metodología STAR.",
        completed_at: "2024-11-13T15:30:00Z",
        duration_minutes: 25,
      },
      {
        simulation_type: "technical",
        score: 7.2,
        feedback: "Buen conocimiento técnico. Practicar explicaciones más claras de conceptos complejos.",
        completed_at: "2024-11-06T10:15:00Z",
        duration_minutes: 35,
      },
    ],
  }

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/auth")
        return
      }

      setUserEmail(user.email || "")

      try {
        // Try to load from database
        const { data: profile } = await supabase.from("user_profiles").select("*").eq("email", user.email).single()

        const { data: tests } = await supabase
          .from("test_results")
          .select("*")
          .eq("user_email", user.email)
          .order("completed_at", { ascending: false })

        const { data: activities } = await supabase
          .from("user_activities")
          .select("*")
          .eq("user_email", user.email)
          .order("created_at", { ascending: false })
          .limit(5)

        const { data: interviews } = await supabase
          .from("interview_simulations")
          .select("*")
          .eq("user_email", user.email)
          .order("completed_at", { ascending: false })

        // Use database data if available, otherwise use fallback
        if (profile) {
          setUserProfile(profile)
        } else {
          setUserProfile({ ...fallbackData.profile, email: user.email || "" })
        }

        if (tests && tests.length > 0) {
          setTestResults(tests)
        } else {
          setTestResults(fallbackData.tests)
        }

        if (activities && activities.length > 0) {
          setUserActivities(activities)
        } else {
          setUserActivities(fallbackData.activities)
        }

        if (interviews && interviews.length > 0) {
          setInterviewHistory(interviews)
        } else {
          setInterviewHistory(fallbackData.interviews)
        }
      } catch (dbError) {
        console.log("Using fallback data due to database error:", dbError)
        // Use fallback data if database fails
        setUserProfile({ ...fallbackData.profile, email: user.email || "" })
        setTestResults(fallbackData.tests)
        setUserActivities(fallbackData.activities)
        setInterviewHistory(fallbackData.interviews)
      }
    } catch (error) {
      console.error("Error loading user data:", error)
      // Use fallback data as last resort
      setUserProfile(fallbackData.profile)
      setTestResults(fallbackData.tests)
      setUserActivities(fallbackData.activities)
      setInterviewHistory(fallbackData.interviews)
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
    router.refresh()
  }

  const isTestCompleted = (testName: string) => {
    return testResults.some((test) => test.test_name === testName)
  }

  const getTestResult = (testName: string) => {
    return testResults.find((test) => test.test_name === testName)
  }

  const availableTests = [
    {
      name: "DISC",
      description: "Evalúa tu estilo de comportamiento y comunicación en 4 dimensiones",
      duration: 12,
      questions: 28,
    },
    {
      name: "Big Five",
      description: "Mide los cinco grandes rasgos de personalidad",
      duration: 18,
      questions: 44,
    },
    {
      name: "MBTI",
      description: "Identifica tu tipo de personalidad Myers-Briggs",
      duration: 25,
      questions: 93,
    },
    {
      name: "RIASEC",
      description: "Descubre tus intereses profesionales según Holland",
      duration: 20,
      questions: 60,
    },
    {
      name: "Habilidades Blandas",
      description: "Evalúa tus competencias interpersonales",
      duration: 15,
      questions: 45,
    },
    {
      name: "Inteligencias Múltiples",
      description: "Identifica tus tipos de inteligencia según Gardner",
      duration: 22,
      questions: 72,
    },
  ]

  const knowledgeBaseDocuments = [
    {
      title: "Especificación Técnica DTC 1.5",
      category: "Técnico",
      description: "Arquitectura completa, funcionalidades y especificaciones técnicas de la plataforma",
      icon: BookOpen,
      color: "text-blue-600",
    },
    {
      title: "Guía de Inicio DTC",
      category: "Guía",
      description: "Primeros pasos, configuración inicial y maximización de tu experiencia en DTC",
      icon: Target,
      color: "text-green-600",
    },
    {
      title: "Guía de Carreras Chile",
      category: "Mercado",
      description: "Información detallada del mercado laboral chileno, salarios y oportunidades",
      icon: Users,
      color: "text-purple-600",
    },
    {
      title: "Módulos Psicométricos",
      category: "Psicometría",
      description: "Tests DISC, Big Five, MBTI, RIASEC y evaluaciones completas de personalidad",
      icon: Brain,
      color: "text-orange-600",
    },
    {
      title: "CV Generator & Entrevistas",
      category: "Herramientas",
      description: "Herramientas inteligentes para generación de CV y simulación de entrevistas con IA",
      icon: FileText,
      color: "text-red-600",
    },
    {
      title: "Biblioteca de Habilidades & Coach IA",
      category: "IA & Skills",
      description: "Catálogo completo de habilidades, coaching con IA y filosofías de mentores",
      icon: Lightbulb,
      color: "text-yellow-600",
    },
    {
      title: "Progreso, Gamificación & Integraciones",
      category: "Gamificación",
      description: "Sistema completo de progreso, logros, XP e integraciones con plataformas externas",
      icon: Award,
      color: "text-indigo-600",
    },
    {
      title: "Recursos Adicionales",
      category: "Recursos",
      description: "Información complementaria, casos de uso y recursos de desarrollo profesional",
      icon: BookOpen,
      color: "text-gray-600",
    },
  ]

  const categories = [
    "Todos",
    "Técnico",
    "Guía",
    "Mercado",
    "Psicometría",
    "Herramientas",
    "IA & Skills",
    "Gamificación",
    "Recursos",
  ]

  const filteredDocuments = knowledgeBaseDocuments.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "Todos" || doc.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Cargando tu perfil...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              ¡Bienvenido{userProfile?.name ? `, ${userProfile.name}` : ""}! 🚀
            </h1>
            <p className="text-xl text-gray-600">Tu plataforma integral de desarrollo profesional</p>
            <p className="text-sm text-gray-500">Conectado como: {userEmail}</p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Cerrar Sesión
          </Button>
        </div>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-8">
            <TabsTrigger value="overview">Inicio</TabsTrigger>
            <TabsTrigger value="tests">Tests</TabsTrigger>
            <TabsTrigger value="cv">CV</TabsTrigger>
            <TabsTrigger value="interviews">Entrevistas</TabsTrigger>
            <TabsTrigger value="coach">Coach IA</TabsTrigger>
            <TabsTrigger value="docs">Documentos</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Progress Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Tu Progreso
                </CardTitle>
                <CardDescription>Completa tu perfil para obtener mejores recomendaciones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>Perfil Completo</span>
                      <span>{userProfile?.profile_completion_percentage || 0}%</span>
                    </div>
                    <Progress value={userProfile?.profile_completion_percentage || 0} className="h-2" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{testResults.length}/6</div>
                      <div className="text-sm text-gray-600">Tests Completados</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{userProfile?.cv_generated || 0}</div>
                      <div className="text-sm text-gray-600">CV Creado</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">{interviewHistory.length}</div>
                      <div className="text-sm text-gray-600">Simulaciones</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{userProfile?.total_xp || 0}</div>
                      <div className="text-sm text-gray-600">XP Total</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("tests")}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-blue-600" />
                    Tests Psicométricos
                  </CardTitle>
                  <CardDescription>Descubre tu personalidad y fortalezas</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{testResults.length}/6 Completados</Badge>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("cv")}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    Generador de CV
                  </CardTitle>
                  <CardDescription>Crea un CV profesional optimizado</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant={userProfile?.cv_generated ? "outline" : "secondary"}>
                      {userProfile?.cv_generated ? "CV Disponible" : "No creado"}
                    </Badge>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>

              <Card
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setActiveTab("interviews")}
              >
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                    Simulador de Entrevistas
                  </CardTitle>
                  <CardDescription>Practica y mejora tus habilidades</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{interviewHistory.length} Simulaciones</Badge>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("coach")}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-orange-600" />
                    Coach IA
                  </CardTitle>
                  <CardDescription>Conversaciones personalizadas de carrera</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Disponible 24/7</Badge>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => setActiveTab("docs")}>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-indigo-600" />
                    Base de Conocimiento
                  </CardTitle>
                  <CardDescription>Guías y recursos de carrera</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">8 Módulos</Badge>
                    <ChevronRight className="h-4 w-4" />
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-red-600" />
                    Próximas Actividades
                  </CardTitle>
                  <CardDescription>Mantén el momentum</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {testResults.length < 6 && (
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-3 w-3" />
                        <span>Completar test RIASEC</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-3 w-3" />
                      <span>Actualizar CV</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="h-3 w-3" />
                      <span>Nueva simulación de entrevista</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5" />
                  Actividad Reciente
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {userActivities.length > 0 ? (
                    userActivities.map((activity, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm">{activity.activity_description}</span>
                        <Badge variant="outline" className="ml-auto">
                          +{activity.xp_earned} XP
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-4 text-gray-500">
                      <p>No hay actividades recientes</p>
                      <Button size="sm" className="mt-2" onClick={() => setActiveTab("tests")}>
                        Comenzar con un test
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tests Tab */}
          <TabsContent value="tests" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tests Psicométricos Disponibles</CardTitle>
                <CardDescription>
                  Completa estos tests para obtener insights sobre tu personalidad y preferencias profesionales
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {availableTests.map((test) => {
                    const completed = isTestCompleted(test.name)
                    const result = getTestResult(test.name)

                    return (
                      <div key={test.name} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{test.name}</h3>
                          <Badge variant={completed ? "secondary" : "default"}>
                            {completed ? "Completado" : "Pendiente"}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{test.description}</p>
                        <div className="flex gap-2 mb-3">
                          {completed ? (
                            <>
                              <Button variant="outline" size="sm">
                                Ver Resultados
                              </Button>
                              <Button variant="ghost" size="sm">
                                <RotateCcw className="h-3 w-3 mr-1" />
                                Repetir Test
                              </Button>
                            </>
                          ) : (
                            <>
                              <Button size="sm">
                                <Play className="h-3 w-3 mr-1" />
                                Comenzar Test
                              </Button>
                              <Button variant="ghost" size="sm">
                                Vista Previa
                              </Button>
                            </>
                          )}
                        </div>
                        {completed && result ? (
                          <div className="text-xs text-gray-500">
                            Completado: {new Date(result.completed_at).toLocaleDateString()} • Duración:{" "}
                            {result.duration_minutes} min • Score: {result.score}/100
                          </div>
                        ) : (
                          <div className="text-xs text-gray-500">
                            Duración estimada: {test.duration} min • {test.questions} preguntas
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>

                {/* Test Progress Summary */}
                <Card className="mt-6">
                  <CardHeader>
                    <CardTitle className="text-lg">Resumen de Progreso</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Tests Completados</span>
                          <span className="font-semibold">
                            {testResults.length} de 6 ({Math.round((testResults.length / 6) * 100)}%)
                          </span>
                        </div>
                        <Progress value={(testResults.length / 6) * 100} className="h-2" />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-green-50 rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{testResults.length}</div>
                          <div className="text-sm text-gray-600">Completados</div>
                        </div>
                        <div className="text-center p-3 bg-blue-50 rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{6 - testResults.length}</div>
                          <div className="text-sm text-gray-600">Pendientes</div>
                        </div>
                        <div className="text-center p-3 bg-purple-50 rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">
                            {testResults.reduce((total, test) => total + test.duration_minutes, 0)}
                          </div>
                          <div className="text-sm text-gray-600">Min. Invertidos</div>
                        </div>
                      </div>

                      {testResults.length > 0 && testResults.length < 6 && (
                        <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="font-semibold text-green-800">¡Buen progreso!</span>
                          </div>
                          <p className="text-sm text-green-700 mb-3">
                            Has completado {testResults.length} de 6 tests. Completa RIASEC para obtener recomendaciones
                            de carrera personalizadas.
                          </p>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700">
                            Continuar con RIASEC
                          </Button>
                        </div>
                      )}

                      {testResults.length === 0 && (
                        <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <Brain className="h-4 w-4 text-blue-600" />
                            <span className="font-semibold text-blue-800">¡Comienza tu evaluación!</span>
                          </div>
                          <p className="text-sm text-blue-700 mb-3">
                            Aún no has completado ningún test. Te recomendamos comenzar con el test DISC para conocer tu
                            estilo de comunicación.
                          </p>
                          <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                            Comenzar con DISC
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Results */}
                {testResults.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Resultados Recientes</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {testResults.slice(0, 3).map((test, index) => {
                          const results = typeof test.results === "string" ? JSON.parse(test.results) : test.results
                          return (
                            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                  <Brain className="h-5 w-5 text-blue-600" />
                                </div>
                                <div>
                                  <div className="font-semibold">{test.test_name}</div>
                                  <div className="text-sm text-gray-600">
                                    Score: {test.score}/100
                                    {test.test_name === "MBTI" && results.type && ` • ${results.type}`}
                                    {test.test_name === "DISC" && results.primary_type && ` • ${results.primary_type}`}
                                  </div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-sm text-gray-500">
                                  {new Date(test.completed_at).toLocaleDateString()}
                                </div>
                                <Button variant="outline" size="sm">
                                  Ver Detalle
                                </Button>
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Recommendations */}
                {testResults.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recomendaciones Personalizadas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {testResults.slice(0, 2).map((test, index) => {
                          const results = typeof test.results === "string" ? JSON.parse(test.results) : test.results
                          return (
                            <div key={index} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                              <div className="flex items-center gap-2 mb-2">
                                <Lightbulb className="h-4 w-4 text-blue-600" />
                                <span className="font-semibold text-blue-800">Basado en tu {test.test_name}</span>
                              </div>
                              <p className="text-sm text-blue-700">{results.description}</p>
                            </div>
                          )
                        })}

                        {testResults.length < 6 && (
                          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                              <Clock className="h-4 w-4 text-yellow-600" />
                              <span className="font-semibold text-yellow-800">Próximo paso recomendado</span>
                            </div>
                            <p className="text-sm text-yellow-700">
                              Completa más tests para obtener recomendaciones más precisas y personalizadas.
                            </p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* CV Tab */}
          <TabsContent value="cv" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generador de CV Inteligente</CardTitle>
                <CardDescription>Crea un CV profesional optimizado para tu industria objetivo</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {userProfile?.cv_generated ? (
                    <>
                      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="font-semibold text-green-800">CV Generado</span>
                        </div>
                        <p className="text-sm text-green-700">Tu CV está listo y optimizado para roles en tecnología</p>
                      </div>

                      <div className="flex gap-3">
                        <Button>
                          <FileText className="h-4 w-4 mr-2" />
                          Ver CV
                        </Button>
                        <Button variant="outline">
                          <Download className="h-4 w-4 mr-2" />
                          Descargar PDF
                        </Button>
                        <Button variant="outline">
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div className="p-4 border rounded-lg">
                          <h3 className="font-semibold mb-2">Análisis de CV</h3>
                          <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                              <span>Completitud</span>
                              <span className="font-semibold">95%</span>
                            </div>
                            <Progress value={95} className="h-2" />
                            <div className="flex justify-between text-sm">
                              <span>Optimización ATS</span>
                              <span className="font-semibold">88%</span>
                            </div>
                            <Progress value={88} className="h-2" />
                          </div>
                        </div>

                        <div className="p-4 border rounded-lg">
                          <h3 className="font-semibold mb-2">Sugerencias IA</h3>
                          <ul className="text-sm space-y-1">
                            <li>• Agregar más palabras clave técnicas</li>
                            <li>• Cuantificar logros en experiencia</li>
                            <li>• Incluir certificaciones recientes</li>
                            <li>• Mejorar sección de habilidades</li>
                          </ul>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="text-center py-8">
                      <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Aún no has creado tu CV</h3>
                      <p className="text-gray-600 mb-4">
                        Crea un CV profesional optimizado con IA basado en tus resultados de tests
                      </p>
                      <Button>
                        <FileText className="h-4 w-4 mr-2" />
                        Crear Mi CV
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Interviews Tab */}
          <TabsContent value="interviews" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Simulador de Entrevistas</CardTitle>
                <CardDescription>Practica entrevistas con IA y recibe feedback personalizado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <h3 className="font-semibold mb-2">Entrevista General</h3>
                      <p className="text-sm text-gray-600 mb-3">Preguntas comunes para cualquier industria</p>
                      <Button size="sm">
                        <Play className="h-3 w-3 mr-1" />
                        Iniciar Simulación
                      </Button>
                    </div>

                    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <h3 className="font-semibold mb-2">Entrevista Técnica</h3>
                      <p className="text-sm text-gray-600 mb-3">Enfocada en habilidades técnicas específicas</p>
                      <Button size="sm">
                        <Play className="h-3 w-3 mr-1" />
                        Iniciar Simulación
                      </Button>
                    </div>

                    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <h3 className="font-semibold mb-2">Entrevista Conductual</h3>
                      <p className="text-sm text-gray-600 mb-3">Situaciones y comportamientos profesionales</p>
                      <Button size="sm">
                        <Play className="h-3 w-3 mr-1" />
                        Iniciar Simulación
                      </Button>
                    </div>

                    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                      <h3 className="font-semibold mb-2">Entrevista por Competencias</h3>
                      <p className="text-sm text-gray-600 mb-3">Basada en competencias específicas del rol</p>
                      <Button size="sm">
                        <Play className="h-3 w-3 mr-1" />
                        Iniciar Simulación
                      </Button>
                    </div>
                  </div>

                  {/* Interview History */}
                  {interviewHistory.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Historial de Simulaciones</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {interviewHistory.map((interview, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded">
                              <div>
                                <div className="font-semibold capitalize">
                                  Entrevista{" "}
                                  {interview.simulation_type === "general" ? "General" : interview.simulation_type}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {new Date(interview.completed_at).toLocaleDateString()} • {interview.duration_minutes}{" "}
                                  min
                                </div>
                              </div>
                              <div className="text-right">
                                <div
                                  className={`font-semibold ${
                                    interview.score >= 8
                                      ? "text-green-600"
                                      : interview.score >= 7
                                        ? "text-yellow-600"
                                        : "text-red-600"
                                  }`}
                                >
                                  {interview.score}/10
                                </div>
                                <Button variant="outline" size="sm">
                                  Ver Feedback
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Interview Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{interviewHistory.length}</div>
                      <div className="text-sm text-gray-600">Simulaciones Realizadas</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">
                        {interviewHistory.length > 0
                          ? (interviewHistory.reduce((sum, i) => sum + i.score, 0) / interviewHistory.length).toFixed(1)
                          : "0"}
                      </div>
                      <div className="text-sm text-gray-600">Promedio Score</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">
                        {interviewHistory.reduce((total, i) => total + i.duration_minutes, 0)}
                      </div>
                      <div className="text-sm text-gray-600">Min. Practicados</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Coach Tab */}
          <TabsContent value="coach" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Coach IA - Dani</CardTitle>
                <CardDescription>Tu mentor personal de carrera disponible 24/7</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb className="h-4 w-4 text-blue-600" />
                      <span className="font-semibold text-blue-800">Consejo del Día</span>
                    </div>
                    <p className="text-sm text-blue-700">
                      "Basado en tu perfil ENFP, recuerda que tu creatividad y entusiasmo son tus superpoderes. Úsalos
                      para destacar en entrevistas y proyectos colaborativos."
                    </p>
                  </div>

                  <div className="border rounded-lg p-4">
                    <h3 className="font-semibold mb-3">Conversación de Ejemplo</h3>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      <div className="p-2 bg-gray-50 rounded text-sm">
                        <strong>Tú:</strong> ¿Cómo puedo mejorar mi CV para roles de data analyst?
                      </div>
                      <div className="p-2 bg-blue-50 rounded text-sm">
                        <strong>Dani:</strong> Basándome en tu perfil ENFP y tus resultados DISC como Influencer, te
                        sugiero enfocarte en proyectos que muestren tanto tu capacidad analítica como tu habilidad para
                        comunicar insights. Incluye métricas específicas como "Analicé datasets de 10M+ registros" y
                        destaca cómo presentaste hallazgos a stakeholders.
                      </div>
                      <div className="p-2 bg-gray-50 rounded text-sm">
                        <strong>Tú:</strong> ¿Qué herramientas debería mencionar?
                      </div>
                      <div className="p-2 bg-blue-50 rounded text-sm">
                        <strong>Dani:</strong> Para data analyst, menciona Python, SQL, Tableau/Power BI, Excel
                        avanzado. Pero como ENFP, también destaca herramientas de colaboración como Slack, Notion, y tu
                        capacidad para trabajar con equipos multidisciplinarios.
                      </div>
                    </div>
                  </div>

                  <Button className="w-full">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Iniciar Nueva Conversación
                  </Button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Temas Populares</h3>
                      <ul className="text-sm space-y-1">
                        <li>• Preparación para entrevistas</li>
                        <li>• Negociación salarial</li>
                        <li>• Cambio de carrera</li>
                        <li>• Desarrollo de habilidades</li>
                        <li>• Networking efectivo</li>
                      </ul>
                    </div>

                    <div className="p-4 border rounded-lg">
                      <h3 className="font-semibold mb-2">Tu Progreso con Dani</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Conversaciones</span>
                          <span>12</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Consejos aplicados</span>
                          <span>8</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Satisfacción</span>
                          <span>⭐⭐⭐⭐⭐</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Mentor Philosophies */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Filosofías de Mentores Disponibles</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-3 border rounded-lg text-center">
                          <div className="font-semibold mb-1">Bill Campbell</div>
                          <div className="text-xs text-gray-600">The Trillion Dollar Coach</div>
                          <div className="text-xs mt-2">Liderazgo y coaching ejecutivo</div>
                        </div>
                        <div className="p-3 border rounded-lg text-center">
                          <div className="font-semibold mb-1">Carol Dweck</div>
                          <div className="text-xs text-gray-600">Growth Mindset</div>
                          <div className="text-xs mt-2">Mentalidad de crecimiento</div>
                        </div>
                        <div className="p-3 border rounded-lg text-center">
                          <div className="font-semibold mb-1">Naval Ravikant</div>
                          <div className="text-xs text-gray-600">The Angel Philosopher</div>
                          <div className="text-xs mt-2">Emprendimiento y sabiduría</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Docs Tab */}
          <TabsContent value="docs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Base de Conocimiento</CardTitle>
                <CardDescription>Accede a guías completas y recursos de desarrollo profesional</CardDescription>
              </CardHeader>
              <CardContent>
                {/* Search and Filter Section */}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold mb-4">Buscar en la Documentación</h3>
                  <div className="flex gap-2 mb-4">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Buscar documentos..."
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Button variant="outline">Buscar</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Badge
                        key={category}
                        variant={selectedCategory === category ? "default" : "outline"}
                        className="cursor-pointer hover:bg-blue-50"
                        onClick={() => setSelectedCategory(category)}
                      >
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Documents Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredDocuments.map((doc, index) => {
                    const IconComponent = doc.icon
                    return (
                      <div
                        key={index}
                        className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <IconComponent className={`h-4 w-4 ${doc.color}`} />
                          <h3 className="font-semibold">{doc.title}</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">{doc.description}</p>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <BookOpen className="h-3 w-3 mr-1" />
                            Leer Documento
                          </Button>
                          <Badge variant="secondary">{doc.category}</Badge>
                        </div>
                      </div>
                    )
                  })}
                </div>

                {filteredDocuments.length === 0 && (
                  <div className="text-center py-8">
                    <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No se encontraron documentos</h3>
                    <p className="text-gray-600 mb-4">
                      Intenta con otros términos de búsqueda o selecciona una categoría diferente
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchTerm("")
                        setSelectedCategory("Todos")
                      }}
                    >
                      Limpiar Filtros
                    </Button>
                  </div>
                )}

                {/* Quick Stats */}
                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">8</div>
                    <div className="text-sm text-gray-600">Documentos</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">150+</div>
                    <div className="text-sm text-gray-600">Páginas</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">25+</div>
                    <div className="text-sm text-gray-600">Módulos</div>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-lg">
                    <div className="text-2xl font-bold text-orange-600">100%</div>
                    <div className="text-sm text-gray-600">Actualizado</div>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-blue-600" />
                    <span className="font-semibold text-blue-800">¿Necesitas ayuda navegando?</span>
                  </div>
                  <p className="text-sm text-blue-700 mb-3">
                    Si no encuentras lo que buscas, nuestro Coach IA puede ayudarte a encontrar la información
                    específica que necesitas
                  </p>
                  <Button size="sm" onClick={() => setActiveTab("coach")}>
                    Preguntar al Coach IA
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
