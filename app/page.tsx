"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  BookOpen,
  Clock,
  Target,
  TrendingUp,
  Award,
  Zap,
  Users,
  BookMarked,
  Brain,
  Lightbulb,
  FileText,
  Search,
  MessageSquare,
  BarChart3,
  Star,
  ChevronRight,
  Flame,
  Trophy,
  CheckCircle,
  PlayCircle,
} from "lucide-react"
import Link from "next/link"
import { createClient } from "@/lib/supabase"
import { LibraryService } from "@/lib/supabase-library"

interface DashboardStats {
  booksRead: number
  readingStreak: number
  timeInvested: string
  goalsCompleted: number
  skillsAssessed: number
  cvUpdated: boolean
}

interface RecentBook {
  id: string
  title: string
  author: string
  cover_image: string
  progress: number
  currentChapter: number
  totalChapters: number
}

interface Activity {
  id: string
  type: "reading" | "test" | "goal" | "achievement"
  title: string
  description: string
  timestamp: string
  icon: string
  color: string
}

interface User {
  id: string
  email?: string
  user_metadata?: {
    full_name?: string
    avatar_url?: string
  }
}

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [recentBooks, setRecentBooks] = useState<RecentBook[]>([])
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("progress")

  const libraryService = new LibraryService()

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const supabase = createClient()

        // Get current user
        const {
          data: { user: currentUser },
        } = await supabase.auth.getUser()

        setUser(currentUser)

        if (currentUser) {
          // Fetch real user data
          const userStats = await libraryService.getUserStats(currentUser.id)
          const userRecentBooks = await libraryService.getUserRecentBooks(currentUser.id, 3)
          const userActivities = await libraryService.getRecentActivity(currentUser.id, 5)

          setStats({
            booksRead: userStats.booksCompleted,
            readingStreak: calculateReadingStreak(),
            timeInvested: calculateTimeInvested(userStats.averageProgress),
            goalsCompleted: userStats.booksCompleted,
            skillsAssessed: 0, // Would come from assessments table
            cvUpdated: false, // Would come from CV table
          })

          // Transform user recent books to match interface
          const transformedBooks: RecentBook[] = userRecentBooks.map((book) => ({
            id: book.id,
            title: book.title,
            author: book.author,
            cover_image: book.cover_image,
            progress: book.progress?.progress_percentage || 0,
            currentChapter: book.progress?.current_chapter || 1,
            totalChapters: 10, // Would need to count chapters
          }))

          setRecentBooks(transformedBooks)

          // Transform activities
          const transformedActivities: Activity[] = userActivities.map((activity) => ({
            id: activity.id,
            type: activity.type,
            title: activity.title,
            description: activity.description,
            timestamp: activity.timestamp,
            icon: "BookOpen",
            color: "text-blue-600",
          }))

          setActivities(transformedActivities)
        } else {
          // Set demo data for unauthenticated users
          setStats({
            booksRead: 3,
            readingStreak: 7,
            timeInvested: "12h 30min",
            goalsCompleted: 2,
            skillsAssessed: 4,
            cvUpdated: true,
          })

          setRecentBooks([
            {
              id: "1",
              title: "Hábitos Atómicos",
              author: "James Clear",
              cover_image: "/books/atomic-habits.jpg",
              progress: 65,
              currentChapter: 8,
              totalChapters: 12,
            },
            {
              id: "2",
              title: "Inteligencia Emocional",
              author: "Daniel Goleman",
              cover_image: "/books/emotional-intelligence.jpg",
              progress: 30,
              currentChapter: 3,
              totalChapters: 10,
            },
            {
              id: "3",
              title: "Lean In",
              author: "Sheryl Sandberg",
              cover_image: "/books/lean-in.jpg",
              progress: 85,
              currentChapter: 9,
              totalChapters: 11,
            },
          ])

          setActivities([
            {
              id: "1",
              type: "reading",
              title: "Progreso en lectura",
              description: 'Completaste el capítulo 8 de "Hábitos Atómicos"',
              timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
              icon: "BookOpen",
              color: "text-blue-600",
            },
            {
              id: "2",
              type: "achievement",
              title: "¡Logro desbloqueado!",
              description: "Racha de lectura de 7 días consecutivos",
              timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
              icon: "Trophy",
              color: "text-yellow-600",
            },
            {
              id: "3",
              type: "test",
              title: "Test completado",
              description: "Evaluación de Inteligencia Emocional - Puntuación: 85/100",
              timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
              icon: "CheckCircle",
              color: "text-green-600",
            },
            {
              id: "4",
              type: "goal",
              title: "Meta alcanzada",
              description: "Completaste tu objetivo de leer 3 libros este mes",
              timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              icon: "Target",
              color: "text-purple-600",
            },
          ])
        }
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
        // Set fallback demo data on error
        setStats({
          booksRead: 0,
          readingStreak: 0,
          timeInvested: "0min",
          goalsCompleted: 0,
          skillsAssessed: 0,
          cvUpdated: false,
        })
        setRecentBooks([])
        setActivities([])
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardData()
  }, [])

  const calculateReadingStreak = (): number => {
    // Simplified calculation - would need actual reading data
    return Math.floor(Math.random() * 14) + 1
  }

  const calculateTimeInvested = (averageProgress: number): string => {
    // Simplified calculation based on average progress
    const totalMinutes = Math.floor(averageProgress * 5) // Rough estimate
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60
    return hours > 0 ? `${hours}h ${minutes}min` : `${minutes}min`
  }

  const getActivityIcon = (iconName: string) => {
    const icons: Record<string, any> = {
      BookOpen,
      Trophy,
      CheckCircle,
      Target,
      Award,
      Star,
    }
    const IconComponent = icons[iconName] || BookOpen
    return <IconComponent className="h-4 w-4" />
  }

  const formatTimeAgo = (timestamp: string): string => {
    const now = new Date()
    const time = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "Hace menos de 1 hora"
    if (diffInHours < 24) return `Hace ${diffInHours} horas`
    const diffInDays = Math.floor(diffInHours / 24)
    return `Hace ${diffInDays} días`
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-8">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-gray-200 rounded"></div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            ¡Hola{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""}! 👋
          </h1>
          <p className="text-gray-600 mt-1">Aquí tienes un resumen de tu progreso de desarrollo profesional</p>
        </div>
        <Avatar className="h-12 w-12">
          <AvatarImage src={user?.user_metadata?.avatar_url || "/placeholder.svg"} />
          <AvatarFallback>
            {user?.user_metadata?.full_name
              ? user.user_metadata.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
              : "U"}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-blue-500 rounded-full shadow-lg">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-600">Libros Leídos</p>
                <p className="text-2xl font-bold text-blue-900">{stats?.booksRead || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-orange-500 rounded-full shadow-lg">
                <Flame className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-orange-600">Racha de Lectura</p>
                <p className="text-2xl font-bold text-orange-900">{stats?.readingStreak || 0} días</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-500 rounded-full shadow-lg">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-600">Tiempo Invertido</p>
                <p className="text-2xl font-bold text-green-900">{stats?.timeInvested || "0min"}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-purple-500 rounded-full shadow-lg">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-purple-600">Metas Completadas</p>
                <p className="text-2xl font-bold text-purple-900">{stats?.goalsCompleted || 0}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Continue Reading */}
          <Card className="shadow-sm border-0">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl font-semibold flex items-center gap-2">
                  <PlayCircle className="h-5 w-5 text-blue-600" />
                  Continuar Leyendo
                </CardTitle>
                <Button asChild variant="ghost" size="sm">
                  <Link href="/library" className="text-blue-600 hover:text-blue-700">
                    Ver todo <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentBooks.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {recentBooks.map((book) => (
                    <Card key={book.id} className="group hover:shadow-md transition-all duration-200 border-gray-100">
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-12 h-16 bg-gradient-to-br from-blue-100 to-blue-200 rounded flex items-center justify-center flex-shrink-0">
                            <BookOpen className="h-6 w-6 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-sm line-clamp-2 group-hover:text-blue-600 transition-colors">
                              {book.title}
                            </h4>
                            <p className="text-xs text-gray-500 mt-1">{book.author}</p>
                            <div className="mt-2 space-y-1">
                              <div className="flex justify-between text-xs text-gray-600">
                                <span>Progreso</span>
                                <span>{book.progress}%</span>
                              </div>
                              <Progress value={book.progress} className="h-1.5" />
                              <p className="text-xs text-gray-500">
                                Capítulo {book.currentChapter} de {book.totalChapters}
                              </p>
                            </div>
                          </div>
                        </div>
                        <Button asChild size="sm" className="w-full mt-3 h-8 text-xs">
                          <Link href={`/library/reader/${book.id}`}>Continuar</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No hay libros en progreso</h3>
                  <p className="text-gray-600 mb-4">Explora nuestra biblioteca y comienza tu viaje de aprendizaje</p>
                  <Button asChild>
                    <Link href="/library">
                      <BookMarked className="h-4 w-4 mr-2" />
                      Explorar Biblioteca
                    </Link>
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-sm border-0">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                Acciones Rápidas
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <Button
                  asChild
                  variant="outline"
                  className="h-auto p-4 flex-col space-y-2 hover:bg-blue-50 hover:border-blue-200 bg-transparent"
                >
                  <Link href="/library">
                    <BookOpen className="h-6 w-6 text-blue-600" />
                    <span className="text-sm font-medium">Biblioteca</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-auto p-4 flex-col space-y-2 hover:bg-green-50 hover:border-green-200 bg-transparent"
                >
                  <Link href="/skills-assessment">
                    <BarChart3 className="h-6 w-6 text-green-600" />
                    <span className="text-sm font-medium">Evaluaciones</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-auto p-4 flex-col space-y-2 hover:bg-purple-50 hover:border-purple-200 bg-transparent"
                >
                  <Link href="/cv-builder">
                    <FileText className="h-6 w-6 text-purple-600" />
                    <span className="text-sm font-medium">CV Builder</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-auto p-4 flex-col space-y-2 hover:bg-orange-50 hover:border-orange-200 bg-transparent"
                >
                  <Link href="/career-coach">
                    <MessageSquare className="h-6 w-6 text-orange-600" />
                    <span className="text-sm font-medium">Coach IA</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-auto p-4 flex-col space-y-2 hover:bg-red-50 hover:border-red-200 bg-transparent"
                >
                  <Link href="/goals">
                    <Target className="h-6 w-6 text-red-600" />
                    <span className="text-sm font-medium">Metas</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="h-auto p-4 flex-col space-y-2 hover:bg-indigo-50 hover:border-indigo-200 bg-transparent"
                >
                  <Link href="/job-search">
                    <Search className="h-6 w-6 text-indigo-600" />
                    <span className="text-sm font-medium">Empleos</span>
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Learning Insights */}
          <Card className="shadow-sm border-0">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold flex items-center gap-2">
                <Brain className="h-5 w-5 text-indigo-600" />
                Insights de Aprendizaje
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="grid w-full grid-cols-3 bg-gray-100">
                  <TabsTrigger value="progress" className="text-sm">
                    Progreso
                  </TabsTrigger>
                  <TabsTrigger value="skills" className="text-sm">
                    Habilidades
                  </TabsTrigger>
                  <TabsTrigger value="career" className="text-sm">
                    Carrera
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="progress" className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <TrendingUp className="h-5 w-5 text-blue-600" />
                        <div>
                          <p className="font-medium text-blue-900">Progreso Constante</p>
                          <p className="text-sm text-blue-700">
                            Has mantenido una racha de lectura de {stats?.readingStreak || 0} días
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-blue-100 text-blue-800">Excelente</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Award className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-green-900">Metas Alcanzadas</p>
                          <p className="text-sm text-green-700">
                            Has completado {stats?.goalsCompleted || 0} objetivos este mes
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-green-100 text-green-800">En progreso</Badge>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="skills" className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Brain className="h-5 w-5 text-purple-600" />
                        <div>
                          <p className="font-medium text-purple-900">Inteligencia Emocional</p>
                          <p className="text-sm text-purple-700">Área de enfoque recomendada basada en tu lectura</p>
                        </div>
                      </div>
                      <Badge className="bg-purple-100 text-purple-800">Recomendado</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Users className="h-5 w-5 text-orange-600" />
                        <div>
                          <p className="font-medium text-orange-900">Liderazgo</p>
                          <p className="text-sm text-orange-700">Considera tomar una evaluación de liderazgo</p>
                        </div>
                      </div>
                      <Badge className="bg-orange-100 text-orange-800">Siguiente</Badge>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="career" className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-indigo-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Lightbulb className="h-5 w-5 text-indigo-600" />
                        <div>
                          <p className="font-medium text-indigo-900">Actualiza tu CV</p>
                          <p className="text-sm text-indigo-700">Incluye las nuevas habilidades que has desarrollado</p>
                        </div>
                      </div>
                      <Button size="sm" asChild>
                        <Link href="/cv-builder">Actualizar</Link>
                      </Button>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-teal-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Search className="h-5 w-5 text-teal-600" />
                        <div>
                          <p className="font-medium text-teal-900">Oportunidades de Trabajo</p>
                          <p className="text-sm text-teal-700">Hay 12 nuevas ofertas que coinciden con tu perfil</p>
                        </div>
                      </div>
                      <Button size="sm" variant="outline" asChild>
                        <Link href="/job-search">Ver ofertas</Link>
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Activity */}
          <Card className="shadow-sm border-0">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Clock className="h-5 w-5 text-gray-600" />
                Actividad Reciente
              </CardTitle>
            </CardHeader>
            <CardContent>
              {activities.length > 0 ? (
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div
                      key={activity.id}
                      className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div
                        className={`p-2 rounded-full ${activity.color === "text-blue-600" ? "bg-blue-100" : activity.color === "text-yellow-600" ? "bg-yellow-100" : activity.color === "text-green-600" ? "bg-green-100" : "bg-purple-100"}`}
                      >
                        {getActivityIcon(activity.icon)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-900">{activity.title}</p>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(activity.timestamp)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6">
                  <Clock className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">No hay actividad reciente</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Achievement Badges */}
          <Card className="shadow-sm border-0">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Trophy className="h-5 w-5 text-yellow-600" />
                Logros
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <div className="text-center p-3 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg border border-yellow-200">
                  <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Flame className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-xs font-medium text-yellow-800">Lector Constante</p>
                  <p className="text-xs text-yellow-600">7 días seguidos</p>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <BookOpen className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-xs font-medium text-blue-800">Bibliófilo</p>
                  <p className="text-xs text-blue-600">{stats?.booksRead || 0} libros</p>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Target className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-xs font-medium text-green-800">Enfocado</p>
                  <p className="text-xs text-green-600">{stats?.goalsCompleted || 0} metas</p>
                </div>
                <div className="text-center p-3 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Star className="h-4 w-4 text-white" />
                  </div>
                  <p className="text-xs font-medium text-purple-800">Evaluado</p>
                  <p className="text-xs text-purple-600">{stats?.skillsAssessed || 0} tests</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="shadow-sm border-0">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-gray-600" />
                Resumen Semanal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Tiempo de lectura</span>
                <span className="font-medium">{stats?.timeInvested || "0min"}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Páginas leídas</span>
                <span className="font-medium">127</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Capítulos completados</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Notas tomadas</span>
                <span className="font-medium">15</span>
              </div>
              <div className="pt-2 border-t border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900">Progreso general</span>
                  <span className="font-bold text-blue-600">+12%</span>
                </div>
                <Progress value={75} className="mt-2 h-2" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
