"use client"

import { Shell } from "@/components/shell"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { Target, MessageSquare, FileText, Search, GraduationCap, TrendingUp, Clock, CheckCircle } from "lucide-react"

export default function DashboardPage() {
  const { user } = useAuth()

  const progressData = [
    { name: "Test de Personalidad", progress: 100, status: "completed" },
    { name: "Evaluación de Habilidades", progress: 75, status: "in-progress" },
    { name: "Perfil Profesional", progress: 60, status: "in-progress" },
    { name: "CV Actualizado", progress: 40, status: "pending" },
  ]

  const quickActions = [
    {
      title: "Continuar Test de Habilidades",
      description: "Completa tu evaluación técnica",
      icon: Target,
      href: "/skills-assessment",
      color: "bg-blue-500",
    },
    {
      title: "Hablar con Coach IA",
      description: "Obtén consejos personalizados",
      icon: MessageSquare,
      href: "/career-coach",
      color: "bg-green-500",
    },
    {
      title: "Actualizar CV",
      description: "Mejora tu currículum",
      icon: FileText,
      href: "/cv-builder",
      color: "bg-purple-500",
    },
    {
      title: "Explorar Empleos",
      description: "Encuentra oportunidades",
      icon: Search,
      href: "/job-search",
      color: "bg-orange-500",
    },
  ]

  const recentActivity = [
    {
      action: "Completaste el Test de Personalidad DISC",
      time: "Hace 2 días",
      type: "success",
    },
    {
      action: "Actualizaste tu perfil profesional",
      time: "Hace 1 semana",
      type: "info",
    },
    {
      action: "Guardaste 3 ofertas de trabajo",
      time: "Hace 1 semana",
      type: "info",
    },
  ]

  const uddRecommendations = [
    {
      career: "Ingeniería en Informática",
      match: 92,
      reason: "Alta compatibilidad con tu perfil analítico",
    },
    {
      career: "Psicología",
      match: 87,
      reason: "Coincide con tu interés en ayudar a otros",
    },
    {
      career: "Administración de Empresas",
      match: 78,
      reason: "Alineado con tus habilidades de liderazgo",
    },
  ]

  return (
    <Shell>
      <Header
        title={`¡Hola, ${user?.name || "Usuario"}!`}
        description="Aquí tienes un resumen de tu progreso profesional"
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Perfil Completado</CardTitle>
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
            <div className="text-2xl font-bold">2/4</div>
            <p className="text-xs text-muted-foreground">Personalidad y habilidades blandas</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empleos Guardados</CardTitle>
            <Search className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">3 nuevos esta semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sesiones de Coaching</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Última sesión: ayer</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Tu Progreso</CardTitle>
            <CardDescription>Completa tu perfil para obtener mejores recomendaciones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {progressData.map((item) => (
              <div key={item.name} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className="text-sm text-muted-foreground">{item.progress}%</span>
                </div>
                <Progress value={item.progress} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Continúa desarrollando tu perfil profesional</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {quickActions.map((action) => (
              <Link key={action.href} href={action.href}>
                <div className="flex items-center space-x-4 rounded-lg border p-4 hover:bg-accent transition-colors">
                  <div className={`p-2 rounded-lg ${action.color}`}>
                    <action.icon className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium leading-none">{action.title}</p>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Tus últimas acciones en la plataforma</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">{activity.time}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm">{activity.action}</p>
                </div>
                <Badge variant={activity.type === "success" ? "default" : "secondary"}>
                  {activity.type === "success" ? "Completado" : "Actualizado"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <GraduationCap className="h-5 w-5" />
              <span>Carreras UDD Recomendadas</span>
            </CardTitle>
            <CardDescription>Basado en tu perfil de personalidad y habilidades</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {uddRecommendations.map((rec, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{rec.career}</span>
                  <Badge variant="outline">{rec.match}% match</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{rec.reason}</p>
                <Progress value={rec.match} className="h-1" />
              </div>
            ))}
            <Button asChild className="w-full mt-4">
              <Link href="/udd-careers">Explorar Todas las Carreras UDD</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </Shell>
  )
}
