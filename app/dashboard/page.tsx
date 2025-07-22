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
  Search,
  GraduationCap,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"

export default function DashboardPage() {
  const { user } = useAuth()

  const progressData = [
    {
      title: "Test de Personalidad",
      description: "Completa tu perfil DISC",
      progress: 100,
      icon: Brain,
      href: "/personality-test",
      status: "completed",
    },
    {
      title: "Evaluación de Habilidades",
      description: "Evalúa tus competencias técnicas",
      progress: 75,
      icon: Target,
      href: "/skills-assessment",
      status: "in-progress",
    },
    {
      title: "Constructor de CV",
      description: "Crea tu currículum profesional",
      progress: 50,
      icon: FileText,
      href: "/cv-builder",
      status: "in-progress",
    },
    {
      title: "Coach Profesional",
      description: "Recibe orientación personalizada",
      progress: 25,
      icon: MessageSquare,
      href: "/career-coach",
      status: "pending",
    },
  ]

  const quickActions = [
    {
      title: "Explorar Carreras UDD",
      description: "Descubre programas académicos que se ajusten a tu perfil",
      icon: GraduationCap,
      href: "/udd-careers",
      color: "bg-blue-500",
    },
    {
      title: "Buscar Empleos",
      description: "Encuentra oportunidades laborales en Chile",
      icon: Search,
      href: "/job-search",
      color: "bg-green-500",
    },
    {
      title: "Simulador de Entrevistas",
      description: "Practica para tus próximas entrevistas",
      icon: MessageSquare,
      href: "/interview-simulator",
      color: "bg-purple-500",
    },
  ]

  const recentActivity = [
    {
      title: "Test DISC completado",
      description: "Perfil: Dominante-Influyente",
      timestamp: "Hace 2 días",
      type: "success",
    },
    {
      title: "CV actualizado",
      description: "Plantilla moderna aplicada",
      timestamp: "Hace 1 semana",
      type: "info",
    },
    {
      title: "Nueva recomendación de carrera",
      description: "Ingeniería en Informática - 95% compatibilidad",
      timestamp: "Hace 3 días",
      type: "success",
    },
  ]

  const uddRecommendations = [
    {
      name: "Ingeniería en Informática",
      faculty: "Facultad de Ingeniería",
      compatibility: 95,
      description: "Basado en tu perfil técnico y personalidad analítica",
    },
    {
      name: "Psicología",
      faculty: "Facultad de Psicología",
      compatibility: 88,
      description: "Tu perfil empático y habilidades interpersonales",
    },
    {
      name: "Administración de Empresas",
      faculty: "Facultad de Economía y Empresa",
      compatibility: 82,
      description: "Liderazgo natural y orientación a resultados",
    },
  ]

  return (
    <Shell>
      <Header
        title={`¡Hola, ${user?.name || "Usuario"}!`}
        description="Aquí tienes un resumen de tu progreso en desarrollo profesional"
      />

      {/* Progress Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        {progressData.map((item) => (
          <Card key={item.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
              <item.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Progress value={item.progress} className="h-2" />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.progress}% completado</span>
                  {item.status === "completed" && <CheckCircle className="h-4 w-4 text-green-500" />}
                </div>
                <p className="text-xs text-muted-foreground">{item.description}</p>
                <Button asChild size="sm" variant="outline" className="w-full bg-transparent">
                  <Link href={item.href}>{item.status === "completed" ? "Ver resultados" : "Continuar"}</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Acciones Rápidas
            </CardTitle>
            <CardDescription>Herramientas para impulsar tu desarrollo profesional</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {quickActions.map((action) => (
                <Link key={action.title} href={action.href}>
                  <div className="group cursor-pointer rounded-lg border p-4 hover:bg-accent transition-colors">
                    <div
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-lg ${action.color} text-white mb-3`}
                    >
                      <action.icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-semibold group-hover:text-accent-foreground">{action.title}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div
                    className={`mt-1 h-2 w-2 rounded-full ${
                      activity.type === "success" ? "bg-green-500" : "bg-blue-500"
                    }`}
                  />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">{activity.title}</p>
                    <p className="text-xs text-muted-foreground">{activity.description}</p>
                    <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* UDD Career Recommendations */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Recomendaciones de Carreras UDD
          </CardTitle>
          <CardDescription>Basado en tu perfil de personalidad y habilidades</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            {uddRecommendations.map((career) => (
              <div key={career.name} className="rounded-lg border p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">{career.name}</h3>
                  <Badge variant="secondary">{career.compatibility}%</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{career.faculty}</p>
                <p className="text-xs text-muted-foreground">{career.description}</p>
                <Button asChild size="sm" variant="outline" className="w-full mt-3 bg-transparent">
                  <Link href="/udd-careers">Ver detalles</Link>
                </Button>
              </div>
            ))}
          </div>
          <div className="mt-4 text-center">
            <Button asChild>
              <Link href="/udd-careers">Explorar todas las carreras UDD</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </Shell>
  )
}
