"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Target,
  TrendingUp,
  Award,
  BookOpen,
  Calendar,
  Star,
  Clock,
  ChevronRight,
  Brain,
  Briefcase,
  MessageSquare,
  Code,
  Heart,
  Users,
  GraduationCap,
  BarChart3,
  TestTube,
  Play,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Test categories with all available tests
const testCategories = [
  {
    title: "Tests de Personalidad",
    description: "Descubre tu perfil profesional y personal",
    icon: Brain,
    color: "bg-blue-100 text-blue-700",
    tests: [
      {
        name: "Test de Personalidad Completo",
        href: "/personality-test",
        description: "Análisis completo de tu personalidad profesional",
        duration: "15-20 min",
        completed: true,
        score: 85,
      },
      {
        name: "Test DISC",
        href: "/disc-test",
        description: "Evalúa tu estilo de comportamiento y comunicación",
        duration: "10-15 min",
        completed: true,
        score: 92,
      },
    ],
  },
  {
    title: "Habilidades Técnicas",
    description: "Evalúa tus competencias técnicas específicas",
    icon: Code,
    color: "bg-green-100 text-green-700",
    tests: [
      {
        name: "Evaluación de Habilidades Técnicas",
        href: "/technical-skills-test",
        description: "Mide tus conocimientos en tecnologías específicas",
        duration: "20-30 min",
        completed: false,
        score: null,
      },
      {
        name: "Evaluación General de Habilidades",
        href: "/skills-assessment",
        description: "Evaluación integral de competencias profesionales",
        duration: "25-35 min",
        completed: true,
        score: 78,
      },
    ],
  },
  {
    title: "Habilidades Blandas",
    description: "Desarrolla tus competencias interpersonales",
    icon: Heart,
    color: "bg-purple-100 text-purple-700",
    tests: [
      {
        name: "Test de Habilidades Blandas",
        href: "/soft-skills-test",
        description: "Evalúa comunicación, liderazgo y trabajo en equipo",
        duration: "15-20 min",
        completed: true,
        score: 88,
      },
    ],
  },
  {
    title: "Preparación Profesional",
    description: "Herramientas para tu desarrollo de carrera",
    icon: Users,
    color: "bg-orange-100 text-orange-700",
    tests: [
      {
        name: "Simulador de Entrevistas",
        href: "/interview-simulator",
        description: "Practica entrevistas con IA y recibe feedback",
        duration: "Variable",
        completed: false,
        score: null,
      },
    ],
  },
]

// Recommended books with real cover images
const recommendedBooks = [
  {
    id: "1",
    title: "Atomic Habits",
    author: "James Clear",
    description: "Perfecto para desarrollar hábitos de productividad",
    rating: 4.8,
    progress: 0,
    coverUrl: "/books/atomic-habits.jpg",
    reason: "Basado en tu interés por la productividad personal",
  },
  {
    id: "3",
    title: "Lean In",
    author: "Sheryl Sandberg",
    description: "Ideal para tu desarrollo de liderazgo profesional",
    rating: 4.5,
    progress: 35,
    coverUrl: "/books/lean-in.jpg",
    reason: "Complementa tus evaluaciones de liderazgo",
  },
  {
    id: "5",
    title: "Emotional Intelligence 2.0",
    author: "Travis Bradberry",
    description: "Complementa tus evaluaciones de habilidades blandas",
    rating: 4.4,
    progress: 60,
    coverUrl: "/books/emotional-intelligence.jpg",
    reason: "Fortalece tus habilidades interpersonales",
  },
]

interface RecentActivity {
  id: string
  type: "reading" | "assessment" | "course" | "goal"
  title: string
  description: string
  timestamp: string
  progress?: number
}

interface CareerGoal {
  id: string
  title: string
  description: string
  targetDate: string
  progress: number
  category: string
  priority: "high" | "medium" | "low"
}

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [careerGoals, setCareerGoals] = useState<CareerGoal[]>([])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !loading && !user) {
      router.push("/auth/login")
      return
    }
  }, [mounted, user, loading, router])

  useEffect(() => {
    // Set demo recent activity
    setRecentActivity([
      {
        id: "1",
        type: "reading",
        title: "Continuaste leyendo 'Lean In'",
        description: "Progreso: 35% completado",
        timestamp: "Hace 2 horas",
        progress: 35,
      },
      {
        id: "2",
        type: "assessment",
        title: "Completaste el Test DISC",
        description: "Puntuación: 92/100 - Perfil Dominante",
        timestamp: "Ayer",
      },
      {
        id: "3",
        type: "goal",
        title: "Actualizaste tu objetivo de carrera",
        description: "Líder de Proyecto en Tecnología",
        timestamp: "Hace 3 días",
      },
      {
        id: "4",
        type: "assessment",
        title: "Completaste evaluación de habilidades blandas",
        description: "Puntuación: 88/100 - Excelente comunicación",
        timestamp: "Hace 5 días",
      },
    ])

    // Set demo career goals
    setCareerGoals([
      {
        id: "1",
        title: "Obtener certificación en Gestión de Proyectos",
        description: "Completar curso PMP y rendir examen de certificación",
        targetDate: "2024-06-30",
        progress: 60,
        category: "Certificación",
        priority: "high",
      },
      {
        id: "2",
        title: "Mejorar habilidades de liderazgo",
        description: "Leer 5 libros sobre liderazgo y aplicar técnicas en el trabajo",
        targetDate: "2024-05-15",
        progress: 40,
        category: "Desarrollo Personal",
        priority: "medium",
      },
      {
        id: "3",
        title: "Expandir red profesional",
        description: "Conectar con 50 profesionales del sector tecnológico",
        targetDate: "2024-08-31",
        progress: 25,
        category: "Networking",
        priority: "medium",
      },
    ])
  }, [])

  // Show loading state
  if (!mounted || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  // Don't render anything if not authenticated
  if (!user) {
    return null
  }

  const currentDate = new Date().toLocaleDateString("es-CL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "reading":
        return <BookOpen className="h-4 w-4" />
      case "assessment":
        return <BarChart3 className="h-4 w-4" />
      case "course":
        return <GraduationCap className="h-4 w-4" />
      case "goal":
        return <Target className="h-4 w-4" />
      default:
        return <CheckCircle className="h-4 w-4" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 border-green-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-CL", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 pt-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            ¡Bienvenido de vuelta, {user?.name || user?.email?.split("@")[0]}!
          </h1>
          <p className="text-gray-600">Continúa tu desarrollo profesional</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>{currentDate}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">85%</p>
                <p className="text-sm text-muted-foreground">Progreso General</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Award className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">4</p>
                <p className="text-sm text-muted-foreground">Tests Completados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">3</p>
                <p className="text-sm text-muted-foreground">Libros en Progreso</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">88</p>
                <p className="text-sm text-muted-foreground">Puntuación Promedio</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* All Available Tests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TestTube className="h-5 w-5" />
                <span>Evaluaciones Disponibles</span>
              </CardTitle>
              <CardDescription>Completa todas las evaluaciones para obtener un perfil completo</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {testCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${category.color}`}>
                      <category.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{category.title}</h3>
                      <p className="text-sm text-gray-600">{category.description}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-10">
                    {category.tests.map((test, testIndex) => (
                      <div key={testIndex} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h4 className="font-medium text-sm">{test.name}</h4>
                              {test.completed ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <Clock className="h-4 w-4 text-gray-400" />
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mb-2">{test.description}</p>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>Duración: {test.duration}</span>
                              {test.completed && test.score && (
                                <Badge variant="secondary" className="text-xs">
                                  {test.score}/100
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                        <Link href={test.href}>
                          <Button size="sm" variant={test.completed ? "outline" : "default"} className="w-full">
                            {test.completed ? (
                              <>
                                <BarChart3 className="h-3 w-3 mr-1" />
                                Ver Resultados
                              </>
                            ) : (
                              <>
                                <Play className="h-3 w-3 mr-1" />
                                Comenzar Test
                              </>
                            )}
                          </Button>
                        </Link>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>Herramientas principales para tu desarrollo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/career-coach">
                  <Button variant="outline" className="w-full justify-start h-auto p-4 bg-transparent">
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="h-8 w-8 text-blue-600" />
                      <div className="text-left">
                        <p className="font-medium">Coach de Carrera IA</p>
                        <p className="text-sm text-muted-foreground">Recibe consejos personalizados</p>
                      </div>
                    </div>
                  </Button>
                </Link>

                <Link href="/job-search">
                  <Button variant="outline" className="w-full justify-start h-auto p-4 bg-transparent">
                    <div className="flex items-center space-x-3">
                      <Briefcase className="h-8 w-8 text-green-600" />
                      <div className="text-left">
                        <p className="font-medium">Búsqueda de Empleos</p>
                        <p className="text-sm text-muted-foreground">Encuentra oportunidades</p>
                      </div>
                    </div>
                  </Button>
                </Link>

                <Link href="/cv-builder">
                  <Button variant="outline" className="w-full justify-start h-auto p-4 bg-transparent">
                    <div className="flex items-center space-x-3">
                      <Users className="h-8 w-8 text-purple-600" />
                      <div className="text-left">
                        <p className="font-medium">Constructor de CV</p>
                        <p className="text-sm text-muted-foreground">Crea tu currículum perfecto</p>
                      </div>
                    </div>
                  </Button>
                </Link>

                <Link href="/library">
                  <Button variant="outline" className="w-full justify-start h-auto p-4 bg-transparent">
                    <div className="flex items-center space-x-3">
                      <BookOpen className="h-8 w-8 text-orange-600" />
                      <div className="text-left">
                        <p className="font-medium">Biblioteca Digital</p>
                        <p className="text-sm text-muted-foreground">Libros de desarrollo profesional</p>
                      </div>
                    </div>
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Career Goals */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Objetivos de Carrera
                </CardTitle>
                <Link href="/profile">
                  <Button variant="ghost" size="sm">
                    Gestionar
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {careerGoals.map((goal) => (
                  <div key={goal.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm">{goal.title}</h4>
                          <Badge variant="outline" className={getPriorityColor(goal.priority)}>
                            {goal.priority === "high" ? "Alta" : goal.priority === "medium" ? "Media" : "Baja"}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 mb-2">{goal.description}</p>
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          Meta: {formatDate(goal.targetDate)}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-600">Progreso</span>
                        <span className="font-medium">{goal.progress}%</span>
                      </div>
                      <Progress value={goal.progress} className="h-2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recommended Books */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <CardTitle className="text-lg">Libros Recomendados</CardTitle>
              </div>
              <Link href="/library">
                <Button variant="ghost" size="sm" className="text-xs">
                  Ver todos <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardDescription className="px-6 pb-4">Basado en tu perfil y objetivos</CardDescription>
            <CardContent className="space-y-4">
              {recommendedBooks.map((book) => (
                <Link key={book.id} href={`/library/reader/${book.id}`}>
                  <div className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="relative w-12 h-16 flex-shrink-0">
                      <Image
                        src={book.coverUrl || "/placeholder.svg"}
                        alt={book.title}
                        fill
                        className="object-cover rounded shadow-sm"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = `/placeholder.svg?height=64&width=48&text=${encodeURIComponent(book.title)}`
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm line-clamp-1">{book.title}</h4>
                      <p className="text-xs text-gray-600 mb-1">por {book.author}</p>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-2">{book.description}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-medium">{book.rating}</span>
                        </div>
                        {book.progress > 0 && (
                          <div className="flex items-center space-x-1">
                            <div className="w-8 h-1 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-600 rounded-full" style={{ width: `${book.progress}%` }} />
                            </div>
                            <span className="text-xs text-gray-500">{book.progress}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
              <Link href="/library">
                <Button variant="outline" className="w-full mt-4 bg-transparent" size="sm">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Explorar Biblioteca Completa
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Clock className="h-5 w-5" />
                <span>Actividad Reciente</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 line-clamp-2">{activity.title}</p>
                    <p className="text-xs text-gray-600 mb-1">{activity.description}</p>
                    <p className="text-xs text-gray-500">{activity.timestamp}</p>
                    {activity.progress && <Progress value={activity.progress} className="mt-2 h-1" />}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="h-5 w-5" />
                Próximas Fechas Límite
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-200">
                  <div>
                    <p className="text-sm font-medium text-red-900">Examen PMP</p>
                    <p className="text-xs text-red-700">Certificación de Gestión de Proyectos</p>
                  </div>
                  <Badge variant="destructive">15 días</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div>
                    <p className="text-sm font-medium text-yellow-900">Entrega de Proyecto</p>
                    <p className="text-xs text-yellow-700">Sistema de gestión interno</p>
                  </div>
                  <Badge variant="secondary">22 días</Badge>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div>
                    <p className="text-sm font-medium text-blue-900">Revisión de Desempeño</p>
                    <p className="text-xs text-blue-700">Evaluación anual</p>
                  </div>
                  <Badge variant="outline">45 días</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
