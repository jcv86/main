"use client"

import { Shell } from "@/components/shell"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { UDDCareerRecommendations } from "@/components/udd-career-recommendations"
import {
  Brain,
  Target,
  MessageCircle,
  FileText,
  Search,
  GraduationCap,
  TrendingUp,
  Clock,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <Shell>
      <Header title="Panel Principal" description="Bienvenido a tu plataforma de desarrollo profesional" />

      {/* Progress Overview */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Test de Personalidad</CardTitle>
            <Brain className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <Progress value={85} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">Completado</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Habilidades Técnicas</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">72%</div>
            <Progress value={72} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">En progreso</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">CV Completado</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">90%</div>
            <Progress value={90} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-2">Casi listo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aplicaciones</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground mt-2">Este mes</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Continúa tu desarrollo profesional</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full justify-start">
              <Link href="/personality-test">
                <Brain className="mr-2 h-4 w-4" />
                Completar Test de Personalidad
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start bg-transparent">
              <Link href="/skills-assessment">
                <Target className="mr-2 h-4 w-4" />
                Evaluar Habilidades
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start bg-transparent">
              <Link href="/career-coach">
                <MessageCircle className="mr-2 h-4 w-4" />
                Consultar Coach
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start bg-transparent">
              <Link href="/cv-builder">
                <FileText className="mr-2 h-4 w-4" />
                Actualizar CV
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start bg-transparent">
              <Link href="/job-search">
                <Search className="mr-2 h-4 w-4" />
                Buscar Empleos
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
            <CardDescription>Tus últimas acciones en la plataforma</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center space-x-4">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Test DISC completado</p>
                <p className="text-xs text-muted-foreground">Hace 2 horas</p>
              </div>
              <Badge variant="secondary">Completado</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Clock className="h-4 w-4 text-yellow-500" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">CV actualizado</p>
                <p className="text-xs text-muted-foreground">Ayer</p>
              </div>
              <Badge variant="outline">Actualizado</Badge>
            </div>
            <div className="flex items-center space-x-4">
              <Search className="h-4 w-4 text-blue-500" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">5 empleos guardados</p>
                <p className="text-xs text-muted-foreground">Hace 3 días</p>
              </div>
              <Badge variant="outline">Guardado</Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* UDD Career Recommendations */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <GraduationCap className="mr-2 h-5 w-5" />
              Carreras UDD Recomendadas
            </CardTitle>
            <CardDescription>Basado en tu perfil de personalidad y habilidades</CardDescription>
          </CardHeader>
          <CardContent>
            <UDDCareerRecommendations />
            <div className="mt-4">
              <Button asChild>
                <Link href="/udd-careers">Ver Todas las Carreras UDD</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Shell>
  )
}
