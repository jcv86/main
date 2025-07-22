"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Brain,
  Target,
  TrendingUp,
  Users,
  Clock,
  Play,
  CheckCircle,
  Star,
  Calendar,
  MessageSquare,
  FileText,
  Briefcase,
  GraduationCap,
  BarChart3,
  Zap,
} from "lucide-react"
import Link from "next/link"
import { getUserStats, getUserProgress, getUserAchievements, getUserCareerGoals } from "@/lib/database"
import type { UserStats, UserProgress, Achievement, CareerGoal } from "@/lib/database"

export default function DashboardPage() {
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null)
  const [achievements, setAchievements] = useState<Achievement[]>([])
  const [careerGoals, setCareerGoals] = useState<CareerGoal[]>([])
  const [loading, setLoading] = useState(true)

  const userId = "demo-user-id" // In a real app, this would come from auth context

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [statsData, progressData, achievementsData, goalsData] = await Promise.all([
          getUserStats(userId),
          getUserProgress(userId),
          getUserAchievements(userId),
          getUserCareerGoals(userId),
        ])

        setUserStats(statsData)
        setUserProgress(progressData)
        setAchievements(achievementsData)
        setCareerGoals(goalsData)
      } catch (error) {
        console.error("Error loading dashboard data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, [userId])

  // Updated test data with all tests showing as not started
  const availableTests = [
    {
      id: "personality",
      title: "Test de Personalidad",
      description: "Descubre tu perfil de personalidad adaptado al mercado laboral chileno",
      icon: Brain,
      color: "bg-blue-500",
      href: "/personality-test",
      completed: false,
      score: null,
      estimatedTime: "15 min",
    },
    {
      id: "disc",
      title: "Test DISC",
      description: "Evalúa tu estilo de comportamiento y comunicación en el contexto profesional chileno",
      icon: Users,
      color: "bg-green-500",
      href: "/disc-test",
      completed: false,
      score: null,
      estimatedTime: "12 min",
    },
    {
      id: "soft-skills",
      title: "Habilidades Blandas",
      description: "Mide tus competencias interpersonales valoradas en empresas chilenas",
      icon: MessageSquare,
      color: "bg-purple-500",
      href: "/soft-skills-test",
      completed: false,
      score: null,
      estimatedTime: "20 min",
    },
    {
      id: "technical-skills",
      title: "Habilidades Técnicas",
      description: "Evalúa tus competencias técnicas para el mercado tech chileno",
      icon: FileText,
      color: "bg-orange-500",
      href: "/technical-skills-test",
      completed: false,
      score: null,
      estimatedTime: "25 min",
    },
    {
      id: "skills-assessment",
      title: "Evaluación de Habilidades",
      description: "Análisis completo de tus competencias profesionales",
      icon: BarChart3,
      color: "bg-indigo-500",
      href: "/skills-assessment",
      completed: false,
      score: null,
      estimatedTime: "18 min",
    },
    {
      id: "interview-simulator",
      title: "Simulador de Entrevistas",
      description: "Practica entrevistas para empresas chilenas con IA",
      icon: Briefcase,
      color: "bg-red-500",
      href: "/interview-simulator",
      completed: false,
      score: null,
      estimatedTime: "30 min",
    },
  ]

  // Updated recommended books without images
  const recommendedBooks = [
    {
      id: "1",
      title: "Atomic Habits",
      author: "James Clear",
      description: "Un método fácil y comprobado para crear buenos hábitos y eliminar los malos.",
      category: "Productividad",
      rating: 4.8,
      readingTime: "4h 30min",
      href: "/library/reader/1",
    },
    {
      id: "2",
      title: "Deep Work",
      author: "Cal Newport",
      description: "Reglas para el éxito enfocado en un mundo distraído.",
      category: "Productividad",
      rating: 4.7,
      readingTime: "4h 45min",
      href: "/library/reader/2",
    },
    {
      id: "3",
      title: "Emotional Intelligence 2.0",
      author: "Travis Bradberry",
      description: "Estrategias para aumentar tu EQ y mejorar tus habilidades interpersonales.",
      category: "Habilidades Blandas",
      rating: 4.4,
      readingTime: "3h 50min",
      href: "/library/reader/3",
    },
  ]

  // Updated recent activity to reflect initial state
  const recentActivity = [
    {
      id: "1",
      type: "test",
      title: "Iniciaste el Test DISC",
      description: "Comenzaste tu evaluación de estilo de comportamiento",
      time: "hace 2 horas",
      icon: Users,
      color: "text-green-600",
    },
    {
      id: "2",
      type: "book",
      title: "Agregaste libro a tu biblioteca",
      description: "Atomic Habits se añadió a tu lista de lectura",
      time: "hace 1 día",
      icon: BookOpen,
      color: "text-blue-600",
    },
    {
      id: "3",
      type: "assessment",
      title: "Exploraste evaluación de habilidades",
      description: "Revisaste las opciones de evaluación técnica",
      time: "hace 2 días",
      icon: BarChart3,
      color: "text-purple-600",
    },
    {
      id: "4",
      type: "goal",
      title: "Estableciste nueva meta",
      description: "Dominar React para Startups Chilenas",
      time: "hace 3 días",
      icon: Target,
      color: "text-orange-600",
    },
  ]

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 w-4 bg-gray-200 rounded"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-8 bg-gray-200 rounded w-16 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Bienvenido a tu plataforma de desarrollo profesional para el mercado chileno</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso General</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0%</div>
            <p className="text-xs text-muted-foreground">Comienza tu journey</p>
            <Progress value={0} className="mt-2" />
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests Completados</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">de {availableTests.length} disponibles</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Libros Disponibles</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">recomendados para ti</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests Disponibles</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{availableTests.length}</div>
            <p className="text-xs text-muted-foreground">evaluaciones esperando</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="tests" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="tests">Tests y Evaluaciones</TabsTrigger>
          <TabsTrigger value="books">Libros Recomendados</TabsTrigger>
          <TabsTrigger value="goals">Metas de Carrera</TabsTrigger>
          <TabsTrigger value="activity">Actividad Reciente</TabsTrigger>
        </TabsList>

        <TabsContent value="tests" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {availableTests.map((test) => {
              const IconComponent = test.icon
              return (
                <Card key={test.id} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-2 rounded-lg ${test.color} bg-opacity-10`}>
                        <IconComponent className={`h-6 w-6 ${test.color.replace("bg-", "text-")}`} />
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-500">{test.estimatedTime}</span>
                      </div>
                    </div>
                    <CardTitle className="text-lg">{test.title}</CardTitle>
                    <CardDescription className="text-sm">{test.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <span className="text-sm text-gray-600">Pendiente</span>
                      </div>
                      <Link href={test.href}>
                        <Button size="sm" className="gap-2">
                          <Play className="h-4 w-4" />
                          Comenzar Test
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="books" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {recommendedBooks.map((book) => (
              <Card key={book.id} className="hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {book.category}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{book.rating}</span>
                    </div>
                  </div>
                  <CardTitle className="text-lg line-clamp-2">{book.title}</CardTitle>
                  <CardDescription className="text-sm text-gray-600">por {book.author}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">{book.description}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="text-sm text-gray-600">{book.readingTime}</span>
                    </div>
                    <Link href={book.href}>
                      <Button size="sm" variant="outline">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Leer
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Link href="/library">
              <Button variant="outline" size="lg">
                Ver Toda la Biblioteca
                <BookOpen className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </TabsContent>

        <TabsContent value="goals" className="space-y-6">
          <div className="grid gap-4">
            {careerGoals.map((goal) => (
              <Card key={goal.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{goal.title}</CardTitle>
                    <Badge
                      variant={
                        goal.priority === "alta" ? "destructive" : goal.priority === "media" ? "default" : "secondary"
                      }
                    >
                      {goal.priority}
                    </Badge>
                  </div>
                  <CardDescription>{goal.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Meta: {new Date(goal.target_date).toLocaleDateString("es-ES")}
                      </span>
                    </div>
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      {goal.status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center">
            <Link href="/profile">
              <Button variant="outline" size="lg">
                Gestionar Metas
                <Target className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <div className="space-y-4">
            {recentActivity.map((activity) => {
              const IconComponent = activity.icon
              return (
                <Card key={activity.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 rounded-lg bg-gray-50">
                        <IconComponent className={`h-5 w-5 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-900">{activity.title}</h4>
                        <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                        <p className="text-xs text-gray-400 mt-2">{activity.time}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Quick Actions */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              Acciones Rápidas
            </CardTitle>
            <CardDescription>Comienza tu desarrollo profesional ahora</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Link href="/personality-test">
                <Button variant="outline" className="w-full justify-start gap-2 h-auto p-4 bg-transparent">
                  <Brain className="h-5 w-5 text-blue-500" />
                  <div className="text-left">
                    <div className="font-medium">Test de Personalidad</div>
                    <div className="text-xs text-gray-500">15 min</div>
                  </div>
                </Button>
              </Link>
              <Link href="/cv-builder">
                <Button variant="outline" className="w-full justify-start gap-2 h-auto p-4 bg-transparent">
                  <FileText className="h-5 w-5 text-green-500" />
                  <div className="text-left">
                    <div className="font-medium">Crear CV</div>
                    <div className="text-xs text-gray-500">Plantillas profesionales</div>
                  </div>
                </Button>
              </Link>
              <Link href="/job-search">
                <Button variant="outline" className="w-full justify-start gap-2 h-auto p-4 bg-transparent">
                  <Briefcase className="h-5 w-5 text-purple-500" />
                  <div className="text-left">
                    <div className="font-medium">Buscar Empleos</div>
                    <div className="text-xs text-gray-500">Mercado chileno</div>
                  </div>
                </Button>
              </Link>
              <Link href="/career-coach">
                <Button variant="outline" className="w-full justify-start gap-2 h-auto p-4 bg-transparent">
                  <GraduationCap className="h-5 w-5 text-orange-500" />
                  <div className="text-left">
                    <div className="font-medium">Coach de Carrera</div>
                    <div className="text-xs text-gray-500">IA personalizada</div>
                  </div>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
