"use client"

import { useState, useEffect } from "react"
import {
  BookOpen,
  TrendingUp,
  Target,
  Clock,
  ChevronRight,
  Calendar,
  Users,
  Briefcase,
  GraduationCap,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Play,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { getReadingStats, getBooksWithProgress, type BookWithProgress } from "@/lib/supabase-library"
import Link from "next/link"
import Image from "next/image"

interface DashboardStats {
  skillsAssessmentScore: number
  completedCourses: number
  readingProgress: number
  careerGoalProgress: number
  weeklyReadingTime: number
  upcomingDeadlines: number
}

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
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentBooks, setRecentBooks] = useState<BookWithProgress[]>([])
  const [readingStats, setReadingStats] = useState<any>(null)
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [careerGoals, setCareerGoals] = useState<CareerGoal[]>([])
  const [loading, setLoading] = useState(true)

  const userId = "00000000-0000-0000-0000-000000000000" // Demo user ID

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      // Load library data
      const [booksResult, statsResult] = await Promise.all([getBooksWithProgress(userId), getReadingStats(userId)])

      if (booksResult.data) {
        // Get books currently being read
        const currentlyReading = booksResult.data.filter((book) => book.reading_status === "reading")
        setRecentBooks(currentlyReading.slice(0, 3))
      }

      if (statsResult.data) {
        setReadingStats(statsResult.data)
      }

      // Set demo dashboard stats
      setStats({
        skillsAssessmentScore: 78,
        completedCourses: 12,
        readingProgress: 65,
        careerGoalProgress: 45,
        weeklyReadingTime: 8.5,
        upcomingDeadlines: 3,
      })

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
          title: "Completaste la evaluación de habilidades blandas",
          description: "Puntuación: 82/100",
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
          type: "course",
          title: "Iniciaste el curso de Liderazgo Digital",
          description: "Módulo 1: Fundamentos del liderazgo",
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
    } catch (error) {
      console.error("Error loading dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 h-96 bg-gray-200 rounded-lg"></div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Panel de Control</h1>
        <p className="text-gray-600">Bienvenido de vuelta. Aquí tienes un resumen de tu progreso profesional.</p>
      </div>

      {/* Stats Overview */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Evaluación de Habilidades</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{stats.skillsAssessmentScore}%</div>
              <p className="text-xs text-muted-foreground">Puntuación promedio</p>
              <Progress value={stats.skillsAssessmentScore} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progreso de Lectura</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stats.readingProgress}%</div>
              <p className="text-xs text-muted-foreground">Libros en progreso</p>
              <Progress value={stats.readingProgress} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Objetivos de Carrera</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">{stats.careerGoalProgress}%</div>
              <p className="text-xs text-muted-foreground">Progreso general</p>
              <Progress value={stats.careerGoalProgress} className="mt-2 h-2" />
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tiempo de Lectura</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.weeklyReadingTime}h</div>
              <p className="text-xs text-muted-foreground">Esta semana</p>
              <div className="flex items-center mt-2 text-xs text-green-600">
                <TrendingUp className="h-3 w-3 mr-1" />
                +2.3h vs semana anterior
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Currently Reading */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Leyendo Actualmente
                </CardTitle>
                <Link href="/library">
                  <Button variant="ghost" size="sm">
                    Ver todo
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentBooks.length > 0 ? (
                <div className="space-y-4">
                  {recentBooks.map((book) => (
                    <div
                      key={book.id}
                      className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="relative w-12 h-16 flex-shrink-0">
                        <Image
                          src={book.cover_url || "/placeholder.svg"}
                          alt={book.title}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-sm line-clamp-1">{book.title}</h4>
                        <p className="text-xs text-gray-600 mb-2">{book.author}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center text-xs text-gray-500">
                            <span>
                              Página {book.current_page} de {book.pages}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Progress value={book.progress} className="w-16 h-1" />
                            <span className="text-xs text-gray-600">{book.progress}%</span>
                          </div>
                        </div>
                      </div>
                      <Link href={`/library/reader/${book.id}`}>
                        <Button size="sm" variant="outline">
                          <Play className="h-3 w-3 mr-1" />
                          Continuar
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay libros en progreso</h3>
                  <p className="text-gray-600 mb-4">Comienza a leer para ver tu progreso aquí</p>
                  <Link href="/library">
                    <Button>Explorar Biblioteca</Button>
                  </Link>
                </div>
              )}
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
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/skills-assessment">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Evaluación de Habilidades
                </Button>
              </Link>
              <Link href="/career-coach">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Users className="h-4 w-4 mr-2" />
                  Consultar Coach de Carrera
                </Button>
              </Link>
              <Link href="/cv-builder">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Briefcase className="h-4 w-4 mr-2" />
                  Actualizar CV
                </Button>
              </Link>
              <Link href="/job-search">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Target className="h-4 w-4 mr-2" />
                  Buscar Empleos
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Actividad Reciente</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
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
              </div>
            </CardContent>
          </Card>

          {/* Reading Stats */}
          {readingStats && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estadísticas de Lectura</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Libros completados</span>
                  <span className="font-medium">{readingStats.books_completed}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">En progreso</span>
                  <span className="font-medium">{readingStats.books_in_progress}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Tiempo total</span>
                  <span className="font-medium">
                    {Math.floor(readingStats.total_reading_time / 60)}h {readingStats.total_reading_time % 60}m
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Racha de lectura</span>
                  <span className="font-medium">{readingStats.reading_streak} días</span>
                </div>
                <div className="pt-2 border-t">
                  <Link href="/library">
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Ir a Biblioteca
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          )}

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
