"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Brain,
  Target,
  MessageSquare,
  Search,
  FileText,
  BookOpen,
  Clock,
  CheckCircle,
  Star,
  Briefcase,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { supabase } from "@/lib/supabase"

interface DashboardStats {
  testsCompleted: number
  skillsAssessed: number
  jobsApplied: number
  booksRead: number
  profileCompletion: number
}

interface RecentActivity {
  id: string
  type: string
  title: string
  description: string
  timestamp: string
  icon: any
}

export default function DashboardPage() {
  const { user } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({
    testsCompleted: 0,
    skillsAssessed: 0,
    jobsApplied: 0,
    booksRead: 0,
    profileCompletion: 0,
  })
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadDashboardData()
    }
  }, [user])

  const loadDashboardData = async () => {
    try {
      // Cargar estadísticas del usuario
      const [testsResult, skillsResult, jobsResult, booksResult, profileResult] = await Promise.all([
        supabase.from("personality_results").select("id").eq("user_id", user?.id),
        supabase.from("skills_assessments").select("id").eq("user_id", user?.id),
        supabase.from("job_applications").select("id").eq("user_id", user?.id),
        supabase.from("reading_progress").select("id").eq("user_id", user?.id),
        supabase.from("profiles").select("*").eq("id", user?.id).single(),
      ])

      // Calcular completitud del perfil
      let completionScore = 0
      if (profileResult.data) {
        const profile = profileResult.data
        if (profile.full_name) completionScore += 20
        if (profile.bio) completionScore += 20
        if (profile.location) completionScore += 15
        if (profile.phone) completionScore += 15
        if (profile.linkedin_url) completionScore += 15
        if (profile.skills && profile.skills.length > 0) completionScore += 15
      }

      setStats({
        testsCompleted: testsResult.data?.length || 0,
        skillsAssessed: skillsResult.data?.length || 0,
        jobsApplied: jobsResult.data?.length || 0,
        booksRead: booksResult.data?.length || 0,
        profileCompletion: completionScore,
      })

      // Actividad reciente simulada
      setRecentActivity([
        {
          id: "1",
          type: "test",
          title: "Test de Personalidad Completado",
          description: "Has completado el test Big Five",
          timestamp: "2 horas",
          icon: Brain,
        },
        {
          id: "2",
          type: "skill",
          title: "Evaluación de Habilidades",
          description: "Evaluaste tus habilidades técnicas",
          timestamp: "1 día",
          icon: Target,
        },
        {
          id: "3",
          type: "job",
          title: "Postulación Enviada",
          description: "Postulaste a Desarrollador Frontend en Falabella",
          timestamp: "2 días",
          icon: Briefcase,
        },
      ])
    } catch (error) {
      console.error("Error cargando datos del dashboard:", error)
    } finally {
      setLoading(false)
    }
  }

  const quickActions = [
    {
      title: "Hacer Test de Personalidad",
      description: "Descubre tu perfil profesional",
      href: "/personality-test",
      icon: Brain,
      color: "bg-blue-500",
    },
    {
      title: "Evaluar Habilidades",
      description: "Identifica tus fortalezas",
      href: "/skills-assessment",
      icon: Target,
      color: "bg-green-500",
    },
    {
      title: "Hablar con Coach IA",
      description: "Recibe orientación personalizada",
      href: "/career-coach",
      icon: MessageSquare,
      color: "bg-purple-500",
    },
    {
      title: "Buscar Empleos",
      description: "Encuentra oportunidades",
      href: "/job-search",
      icon: Search,
      color: "bg-orange-500",
    },
    {
      title: "Crear CV",
      description: "Construye tu currículum",
      href: "/cv-builder",
      icon: FileText,
      color: "bg-red-500",
    },
    {
      title: "Explorar Biblioteca",
      description: "Lee libros de desarrollo",
      href: "/library",
      icon: BookOpen,
      color: "bg-indigo-500",
    },
  ]

  const userName = user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Usuario"
  const currentHour = new Date().getHours()
  let greeting = "Buenos días"
  if (currentHour >= 12 && currentHour < 18) greeting = "Buenas tardes"
  if (currentHour >= 18) greeting = "Buenas noches"

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando tu panel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      {/* Header */}
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {greeting}, {userName}! 👋
          </h2>
          <p className="text-muted-foreground">Aquí tienes un resumen de tu progreso profesional</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests Completados</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.testsCompleted}</div>
            <p className="text-xs text-muted-foreground">+2 desde la semana pasada</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Habilidades Evaluadas</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.skillsAssessed}</div>
            <p className="text-xs text-muted-foreground">+5 desde el mes pasado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Postulaciones</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.jobsApplied}</div>
            <p className="text-xs text-muted-foreground">+1 esta semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Libros Leídos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.booksRead}</div>
            <p className="text-xs text-muted-foreground">+3 este mes</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Profile Completion */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Completitud del Perfil</CardTitle>
            <CardDescription>Completa tu perfil para obtener mejores recomendaciones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progreso del perfil</span>
                <span className="text-sm text-muted-foreground">{stats.profileCompletion}%</span>
              </div>
              <Progress value={stats.profileCompletion} className="w-full" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Información básica completada</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-sm">Email verificado</span>
              </div>
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-yellow-500" />
                <span className="text-sm">Agrega tu experiencia laboral</span>
              </div>
            </div>

            <Button asChild className="w-full">
              <Link href="/profile">Completar Perfil</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Tus últimas acciones en la plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => {
                const Icon = activity.icon
                return (
                  <div key={activity.id} className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{activity.title}</p>
                      <p className="text-sm text-gray-500 truncate">{activity.description}</p>
                    </div>
                    <div className="flex-shrink-0 text-sm text-gray-400">hace {activity.timestamp}</div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div>
        <h3 className="text-lg font-medium mb-4">Acciones Rápidas</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {quickActions.map((action, index) => {
            const Icon = action.icon
            return (
              <Card key={index} className="group hover:shadow-md transition-all duration-200 cursor-pointer">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-lg ${action.color}`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{action.title}</CardTitle>
                      <CardDescription className="text-sm">{action.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button variant="ghost" className="w-full justify-start p-0 h-auto font-normal" asChild>
                    <Link href={action.href}>Comenzar →</Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-yellow-500" />
            <span>Recomendaciones Personalizadas</span>
          </CardTitle>
          <CardDescription>Basado en tu perfil y actividad reciente</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h4 className="font-medium">📚 Libro Recomendado</h4>
              <p className="text-sm text-muted-foreground">"Hábitos Atómicos" - Perfecto para tu desarrollo personal</p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/library">Ver en Biblioteca</Link>
              </Button>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium">💼 Oportunidad Laboral</h4>
              <p className="text-sm text-muted-foreground">
                Desarrollador Frontend en Falabella - 95% de compatibilidad
              </p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/job-search">Ver Empleos</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
