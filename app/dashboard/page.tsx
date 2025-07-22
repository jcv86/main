"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
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
} from "lucide-react"
import Link from "next/link"

// Recommended books with real cover images
const recommendedBooks = [
  {
    id: "1",
    title: "Atomic Habits",
    author: "James Clear",
    description: "Perfecto para desarrollar hábitos de productividad",
    rating: 4.8,
    progress: 0,
    coverUrl: "/books/atomic-habits-cover.png",
    reason: "Basado en tu interés por la productividad personal",
  },
  {
    id: "3",
    title: "Lean In",
    author: "Sheryl Sandberg",
    description: "Ideal para tu desarrollo de liderazgo profesional",
    rating: 4.5,
    progress: 35,
    coverUrl: "/placeholder.svg?height=64&width=48&text=Lean+In",
    reason: "Complementa tus evaluaciones de liderazgo",
  },
  {
    id: "5",
    title: "Emotional Intelligence 2.0",
    author: "Travis Bradberry",
    description: "Complementa tus evaluaciones de habilidades blandas",
    rating: 4.4,
    progress: 60,
    coverUrl: "/placeholder.svg?height=64&width=48&text=EQ+2.0",
    reason: "Fortalece tus habilidades interpersonales",
  },
]

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (mounted && !loading && !user) {
      router.push("/auth/login")
      return
    }
  }, [mounted, user, loading, router])

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

  return (
    <div className="container mx-auto px-4 py-8 space-y-8 pt-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">¡Bienvenido de vuelta, {user?.email?.split("@")[0]}!</h1>
          <p className="text-gray-600">Continúa tu desarrollo profesional</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-500">
          <Calendar className="h-4 w-4" />
          <span>{currentDate}</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Target className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">75%</p>
                <p className="text-sm text-muted-foreground">Progreso General</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Award className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Evaluaciones Completadas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
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

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">8.5</p>
                <p className="text-sm text-muted-foreground">Puntuación Promedio</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="h-5 w-5" />
                <span>Tu Progreso de Desarrollo</span>
              </CardTitle>
              <CardDescription>Resumen de tus actividades de desarrollo profesional</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Evaluaciones de Personalidad</span>
                  <span className="text-sm text-muted-foreground">100%</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Habilidades Técnicas</span>
                  <span className="text-sm text-muted-foreground">85%</span>
                </div>
                <Progress value={85} className="h-2" />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Habilidades Blandas</span>
                  <span className="text-sm text-muted-foreground">70%</span>
                </div>
                <Progress value={70} className="h-2" />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Desarrollo de Carrera</span>
                  <span className="text-sm text-muted-foreground">60%</span>
                </div>
                <Progress value={60} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>Continúa tu desarrollo profesional</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Link href="/personality-test">
                  <Button variant="outline" className="w-full justify-start h-auto p-4 bg-transparent">
                    <div className="flex items-center space-x-3">
                      <Brain className="h-8 w-8 text-blue-600" />
                      <div className="text-left">
                        <p className="font-medium">Test de Personalidad</p>
                        <p className="text-sm text-muted-foreground">Descubre tu perfil profesional</p>
                      </div>
                    </div>
                  </Button>
                </Link>

                <Link href="/skills-assessment">
                  <Button variant="outline" className="w-full justify-start h-auto p-4 bg-transparent">
                    <div className="flex items-center space-x-3">
                      <Code className="h-8 w-8 text-green-600" />
                      <div className="text-left">
                        <p className="font-medium">Evaluación de Habilidades</p>
                        <p className="text-sm text-muted-foreground">Mide tus competencias técnicas</p>
                      </div>
                    </div>
                  </Button>
                </Link>

                <Link href="/job-search">
                  <Button variant="outline" className="w-full justify-start h-auto p-4 bg-transparent">
                    <div className="flex items-center space-x-3">
                      <Briefcase className="h-8 w-8 text-purple-600" />
                      <div className="text-left">
                        <p className="font-medium">Búsqueda de Empleos</p>
                        <p className="text-sm text-muted-foreground">Encuentra oportunidades</p>
                      </div>
                    </div>
                  </Button>
                </Link>

                <Link href="/career-coach">
                  <Button variant="outline" className="w-full justify-start h-auto p-4 bg-transparent">
                    <div className="flex items-center space-x-3">
                      <MessageSquare className="h-8 w-8 text-orange-600" />
                      <div className="text-left">
                        <p className="font-medium">Coach de Carrera</p>
                        <p className="text-sm text-muted-foreground">Recibe consejos personalizados</p>
                      </div>
                    </div>
                  </Button>
                </Link>
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
                    <img
                      src={book.coverUrl || "/placeholder.svg"}
                      alt={book.title}
                      className="w-12 h-16 object-cover rounded shadow-sm"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = `/placeholder.svg?height=64&width=48&text=${encodeURIComponent(book.title)}`
                      }}
                    />
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
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Completaste el Test DISC</p>
                  <p className="text-xs text-muted-foreground">hace 2 horas</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Iniciaste "Lean In"</p>
                  <p className="text-xs text-muted-foreground">hace 1 día</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Evaluación de JavaScript</p>
                  <p className="text-xs text-muted-foreground">hace 3 días</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
                <div>
                  <p className="text-sm font-medium">Sesión con Career Coach</p>
                  <p className="text-xs text-muted-foreground">hace 1 semana</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
