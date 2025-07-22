"use client"

import { Shell } from "@/components/shell"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Target,
  MessageSquare,
  FileText,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  GraduationCap,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

export default function DashboardPage() {
  const { user } = useAuth()

  const progressData = [
    { label: "Test de Personalidad", value: 100, color: "bg-green-500" },
    { label: "Evaluación de Habilidades", value: 75, color: "bg-blue-500" },
    { label: "Perfil Profesional", value: 60, color: "bg-yellow-500" },
    { label: "CV Completado", value: 40, color: "bg-purple-500" },
  ]

  const quickActions = [
    {
      title: "Continuar Test de Personalidad",
      description: "Completa tu evaluación DISC",
      icon: Brain,
      href: "/personality-test",
      color: "bg-blue-50 text-blue-600",
    },
    {
      title: "Evaluación de Habilidades",
      description: "Evalúa tus competencias técnicas",
      icon: Target,
      href: "/skills-assessment",
      color: "bg-green-50 text-green-600",
    },
    {
      title: "Consultar Coach",
      description: "Obtén consejos personalizados",
      icon: MessageSquare,
      href: "/career-coach",
      color: "bg-purple-50 text-purple-600",
    },
    {
      title: "Crear CV",
      description: "Construye tu currículum profesional",
      icon: FileText,
      href: "/cv-builder",
      color: "bg-orange-50 text-orange-600",
    },
  ]

  const recentActivity = [
    {
      action: "Test DISC completado",
      time: "Hace 2 horas",
      status: "success",
    },
    {
      action: "Perfil actualizado",
      time: "Hace 1 día",
      status: "info",
    },
    {
      action: "CV descargado",
      time: "Hace 3 días",
      status: "success",
    },
  ]

  const uddRecommendations = [
    {
      career: "Ingeniería Civil Industrial",
      match: 92,
      reason: "Alta compatibilidad con tu perfil analítico",
    },
    {
      career: "Psicología",
      match: 87,
      reason: "Coincide con tus habilidades interpersonales",
    },
    {
      career: "Administración de Empresas",
      match: 83,
      reason: "Alineado con tus intereses de liderazgo",
    },
  ]

  return (
    <Shell>
      <Header
        title={`¡Bienvenido, ${user?.name}!`}
        description="Aquí tienes un resumen de tu progreso y actividades recientes."
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">+12% desde la semana pasada</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests Completados</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">de 5 evaluaciones</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Invertido</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.2h</div>
            <p className="text-xs text-muted-foreground">esta semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recomendaciones</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">carreras sugeridas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Progreso de Evaluaciones</CardTitle>
            <CardDescription>Tu avance en las diferentes áreas de evaluación</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {progressData.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{item.label}</span>
                  <span>{item.value}%</span>
                </div>
                <Progress value={item.value} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Tus últimas acciones en la plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full ${activity.status === "success" ? "bg-green-500" : "bg-blue-500"}`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Continúa donde lo dejaste</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon
                return (
                  <Link key={index} href={action.href}>
                    <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors">
                      <div className={`p-2 rounded-md ${action.color}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{action.title}</p>
                        <p className="text-xs text-muted-foreground">{action.description}</p>
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <GraduationCap className="h-5 w-5" />
              <span>Carreras UDD Recomendadas</span>
            </CardTitle>
            <CardDescription>Basado en tu perfil y evaluaciones</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uddRecommendations.map((rec, index) => (
                <div key={index} className="p-3 border rounded-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium text-sm">{rec.career}</h4>
                    <Badge variant="secondary">{rec.match}% match</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{rec.reason}</p>
                </div>
              ))}
              <Button asChild className="w-full">
                <Link href="/udd-careers">Ver Todas las Carreras UDD</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Shell>
  )
}
