"use client"

import { Shell } from "@/components/shell"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Target, MessageSquare, FileText, GraduationCap, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

export default function DashboardPage() {
  const { user } = useAuth()

  const progressData = [
    { label: "Test de Personalidad", value: 100, color: "bg-green-500" },
    { label: "Evaluación Técnica", value: 75, color: "bg-blue-500" },
    { label: "Habilidades Blandas", value: 60, color: "bg-yellow-500" },
    { label: "Perfil Completo", value: 85, color: "bg-purple-500" },
  ]

  const quickActions = [
    {
      title: "Continuar Test de Personalidad",
      description: "Completa tu evaluación DISC",
      icon: Brain,
      href: "/personality-test",
      color: "bg-blue-500",
    },
    {
      title: "Evaluación de Habilidades",
      description: "Evalúa tus competencias técnicas",
      icon: Target,
      href: "/skills-assessment",
      color: "bg-green-500",
    },
    {
      title: "Sesión con Coach",
      description: "Obtén orientación personalizada",
      icon: MessageSquare,
      href: "/career-coach",
      color: "bg-purple-500",
    },
    {
      title: "Crear CV",
      description: "Construye tu currículum profesional",
      icon: FileText,
      href: "/cv-builder",
      color: "bg-orange-500",
    },
  ]

  const recentActivity = [
    {
      action: "Test DISC completado",
      time: "Hace 2 horas",
      status: "completed",
    },
    {
      action: "CV actualizado",
      time: "Ayer",
      status: "completed",
    },
    {
      action: "Sesión de coaching programada",
      time: "Hace 3 días",
      status: "pending",
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
      match: 88,
      reason: "Excelente para tus habilidades interpersonales",
    },
    {
      career: "Administración de Empresas",
      match: 85,
      reason: "Ideal para tu orientación hacia el liderazgo",
    },
  ]

  return (
    <Shell>
      <Header
        title={`¡Bienvenido, ${user?.name}!`}
        description="Aquí tienes un resumen de tu progreso en desarrollo profesional"
      />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {progressData.map((item, index) => (
          <Card key={index}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">{item.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{item.value}%</div>
              <Progress value={item.value} className="mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>Continúa con tu desarrollo profesional</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {quickActions.map((action, index) => {
                  const Icon = action.icon
                  return (
                    <Link key={index} href={action.href}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${action.color}`}>
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-sm">{action.title}</h3>
                              <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {activity.status === "completed" ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <Clock className="h-5 w-5 text-yellow-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <GraduationCap className="h-5 w-5" />
            <span>Carreras UDD Recomendadas</span>
          </CardTitle>
          <CardDescription>Basado en tu perfil de personalidad y habilidades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {uddRecommendations.map((rec, index) => (
              <Card key={index} className="border-l-4 border-l-blue-500">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-sm">{rec.career}</h3>
                    <Badge variant="secondary">{rec.match}% match</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{rec.reason}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="mt-4">
            <Button asChild>
              <Link href="/udd-careers">
                <GraduationCap className="mr-2 h-4 w-4" />
                Explorar Todas las Carreras UDD
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </Shell>
  )
}
