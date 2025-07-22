"use client"

import { Shell } from "@/components/shell"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { Brain, Target, MessageCircle, FileText, GraduationCap, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const { user } = useAuth()

  const progressStats = [
    { label: "Perfil Completado", value: 75, color: "bg-blue-500" },
    { label: "Tests Realizados", value: 60, color: "bg-green-500" },
    { label: "CV Actualizado", value: 90, color: "bg-purple-500" },
    { label: "Aplicaciones Enviadas", value: 40, color: "bg-orange-500" },
  ]

  const quickActions = [
    {
      title: "Test de Personalidad",
      description: "Descubre tu tipo de personalidad DISC",
      icon: Brain,
      href: "/personality-test",
      color: "bg-blue-50 text-blue-600 border-blue-200",
    },
    {
      title: "Evaluación de Habilidades",
      description: "Evalúa tus competencias técnicas",
      icon: Target,
      href: "/skills-assessment",
      color: "bg-green-50 text-green-600 border-green-200",
    },
    {
      title: "Coach Profesional",
      description: "Recibe orientación personalizada",
      icon: MessageCircle,
      href: "/career-coach",
      color: "bg-purple-50 text-purple-600 border-purple-200",
    },
    {
      title: "Constructor de CV",
      description: "Crea tu currículum profesional",
      icon: FileText,
      href: "/cv-builder",
      color: "bg-orange-50 text-orange-600 border-orange-200",
    },
  ]

  const recentActivity = [
    {
      action: "Completaste el Test de Personalidad DISC",
      time: "Hace 2 horas",
      status: "completed",
    },
    {
      action: "Actualizaste tu perfil profesional",
      time: "Hace 1 día",
      status: "completed",
    },
    {
      action: "Nueva recomendación de carrera disponible",
      time: "Hace 2 días",
      status: "pending",
    },
    {
      action: "Aplicaste a 3 ofertas de trabajo",
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
      reason: "Alineado con tu creatividad y visión espacial",
    },
  ]

  return (
    <Shell>
      <Header
        title={`¡Hola, ${user?.name || "Usuario"}!`}
        description="Bienvenido a tu panel de desarrollo profesional. Aquí puedes ver tu progreso y acceder a todas las herramientas."
      />

      {/* Progress Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {progressStats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-2">
                <Progress value={stat.value} className="flex-1" />
                <span className="text-sm font-medium">{stat.value}%</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Acciones Rápidas</h2>
          <div className="grid gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <Card key={index} className={`border-2 ${action.color} hover:shadow-md transition-shadow`}>
                  <CardHeader className="pb-2">
                    <div className="flex items-center space-x-3">
                      <Icon className="h-6 w-6" />
                      <div>
                        <CardTitle className="text-lg">{action.title}</CardTitle>
                        <CardDescription>{action.description}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full">
                      <Link href={action.href}>Comenzar</Link>
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Recent Activity & UDD Recommendations */}
        <div className="space-y-8">
          {/* Recent Activity */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Actividad Reciente</h2>
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="mt-1">
                        {activity.status === "completed" ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Clock className="h-4 w-4 text-orange-500" />
                        )}
                      </div>
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

          {/* UDD Career Recommendations */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Recomendaciones de Carreras UDD</h2>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <GraduationCap className="h-5 w-5" />
                  <span>Carreras Recomendadas</span>
                </CardTitle>
                <CardDescription>Basado en tu perfil de personalidad y habilidades</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {uddRecommendations.map((rec, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{rec.career}</h4>
                        <p className="text-sm text-muted-foreground">{rec.reason}</p>
                      </div>
                      <Badge variant="secondary" className="ml-2">
                        {rec.match}% match
                      </Badge>
                    </div>
                  ))}
                </div>
                <Button asChild className="w-full mt-4">
                  <Link href="/udd-careers">
                    <GraduationCap className="mr-2 h-4 w-4" />
                    Explorar Todas las Carreras UDD
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Shell>
  )
}
