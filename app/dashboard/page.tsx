"use client"

import { Shell } from "@/components/shell"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Brain, Target, MessageSquare, FileText, GraduationCap, TrendingUp, Clock, CheckCircle } from "lucide-react"
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
      title: "Test de Personalidad",
      description: "Descubre tu tipo de personalidad DISC",
      icon: Brain,
      href: "/personality-test",
      color: "text-blue-600",
    },
    {
      title: "Evaluación de Habilidades",
      description: "Evalúa tus competencias técnicas",
      icon: Target,
      href: "/skills-assessment",
      color: "text-green-600",
    },
    {
      title: "Coach Profesional",
      description: "Recibe orientación personalizada",
      icon: MessageSquare,
      href: "/career-coach",
      color: "text-purple-600",
    },
    {
      title: "Constructor de CV",
      description: "Crea tu currículum profesional",
      icon: FileText,
      href: "/cv-builder",
      color: "text-orange-600",
    },
  ]

  const recentActivity = [
    {
      action: "Completaste el Test de Personalidad DISC",
      time: "Hace 2 horas",
      status: "completed",
    },
    {
      action: "Iniciaste la Evaluación de Habilidades Técnicas",
      time: "Hace 1 día",
      status: "in-progress",
    },
    {
      action: "Actualizaste tu perfil profesional",
      time: "Hace 3 días",
      status: "completed",
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
      career: "Arquitectura",
      match: 78,
      reason: "Alineado con tu creatividad y pensamiento espacial",
    },
  ]

  return (
    <Shell>
      <Header
        title={`¡Bienvenido, ${user?.name || "Usuario"}!`}
        description="Aquí tienes un resumen de tu progreso en el desarrollo profesional"
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tests Completados</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">+1 desde la semana pasada</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso General</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">+12% desde el mes pasado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sesiones de Coaching</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">2 programadas esta semana</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tiempo Invertido</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24h</div>
            <p className="text-xs text-muted-foreground">Este mes</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Progress Overview */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Tu Progreso</CardTitle>
            <CardDescription>Seguimiento de tu desarrollo profesional</CardDescription>
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

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start space-x-3">
                <div
                  className={`w-2 h-2 rounded-full mt-2 ${
                    activity.status === "completed" ? "bg-green-500" : "bg-yellow-500"
                  }`}
                />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Continúa con tu desarrollo profesional</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {quickActions.map((action, index) => (
                <Link key={index} href={action.href}>
                  <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-accent transition-colors cursor-pointer">
                    <action.icon className={`h-8 w-8 ${action.color}`} />
                    <div className="flex-1">
                      <h3 className="font-medium">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* UDD Career Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Carreras UDD Recomendadas
            </CardTitle>
            <CardDescription>Basado en tu perfil y evaluaciones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {uddRecommendations.map((rec, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-sm">{rec.career}</h4>
                  <Badge variant="secondary">{rec.match}%</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{rec.reason}</p>
              </div>
            ))}
            <Button asChild className="w-full mt-4">
              <Link href="/udd-careers">Explorar Todas las Carreras</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </Shell>
  )
}
