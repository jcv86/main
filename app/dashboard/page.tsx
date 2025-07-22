"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, FileText, MessageSquare, Search, Target, TrendingUp, Users, Calendar, Award } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
          <p className="mt-4 text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Welcome Section */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">¡Hola, {user.name}! 👋</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Bienvenido a tu plataforma de desarrollo profesional. Aquí puedes evaluar tus habilidades, recibir coaching
          personalizado y construir tu carrera ideal.
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
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

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Award className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-sm text-muted-foreground">Habilidades Evaluadas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <MessageSquare className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">8</p>
                <p className="text-sm text-muted-foreground">Sesiones de Coaching</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">94%</p>
                <p className="text-sm text-muted-foreground">Compatibilidad CV</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>Evaluación de Habilidades</span>
            </CardTitle>
            <CardDescription>Evalúa tus habilidades técnicas y blandas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Habilidades Técnicas</span>
                <span>80%</span>
              </div>
              <Progress value={80} />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Habilidades Blandas</span>
                <span>90%</span>
              </div>
              <Progress value={90} />
            </div>
            <Link href="/skills-assessment">
              <Button className="w-full">Continuar Evaluación</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Coach de Carrera</span>
            </CardTitle>
            <CardDescription>Recibe consejos personalizados para tu carrera</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Badge variant="secondary">Última sesión: Hace 2 días</Badge>
              <p className="text-sm text-muted-foreground">
                "Enfócate en desarrollar habilidades de liderazgo para tu próximo ascenso"
              </p>
            </div>
            <Link href="/career-coach">
              <Button className="w-full">Iniciar Sesión de Coaching</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5" />
              <span>Constructor de CV</span>
            </CardTitle>
            <CardDescription>Crea y optimiza tu currículum vitae</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Badge variant="outline">CV actualizado hace 1 semana</Badge>
              <p className="text-sm text-muted-foreground">
                Tu CV tiene una compatibilidad del 94% con ofertas de trabajo actuales
              </p>
            </div>
            <Link href="/cv-builder">
              <Button className="w-full">Editar CV</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5" />
              <span>Búsqueda de Empleo</span>
            </CardTitle>
            <CardDescription>Encuentra oportunidades laborales perfectas para ti</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Badge>15 nuevas ofertas</Badge>
              <p className="text-sm text-muted-foreground">Basadas en tu perfil y preferencias</p>
            </div>
            <Link href="/job-search">
              <Button className="w-full">Ver Ofertas</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>Test de Personalidad</span>
            </CardTitle>
            <CardDescription>Descubre tu perfil DISC y fortalezas</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Badge variant="secondary">Tipo: Dominante-Influyente</Badge>
              <p className="text-sm text-muted-foreground">Líder natural con excelentes habilidades de comunicación</p>
            </div>
            <Link href="/personality-test">
              <Button className="w-full">Ver Resultados</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Carreras UDD</span>
            </CardTitle>
            <CardDescription>Explora carreras recomendadas según tu perfil</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Badge>3 carreras recomendadas</Badge>
              <p className="text-sm text-muted-foreground">Ingeniería Comercial (95% compatibilidad)</p>
            </div>
            <Link href="/udd-careers">
              <Button className="w-full">Explorar Carreras</Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Calendar className="h-5 w-5" />
            <span>Actividad Reciente</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 border rounded-lg">
              <div className="h-2 w-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium">Completaste el test de habilidades técnicas</p>
                <p className="text-sm text-muted-foreground">Hace 2 horas</p>
              </div>
              <Badge>Completado</Badge>
            </div>

            <div className="flex items-center space-x-4 p-4 border rounded-lg">
              <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium">Sesión de coaching: Desarrollo de liderazgo</p>
                <p className="text-sm text-muted-foreground">Hace 2 días</p>
              </div>
              <Badge variant="secondary">Coaching</Badge>
            </div>

            <div className="flex items-center space-x-4 p-4 border rounded-lg">
              <div className="h-2 w-2 bg-purple-500 rounded-full"></div>
              <div className="flex-1">
                <p className="font-medium">Actualizaste tu CV con nuevas habilidades</p>
                <p className="text-sm text-muted-foreground">Hace 1 semana</p>
              </div>
              <Badge variant="outline">CV</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
