"use client"

import { Shell } from "@/components/shell"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, Target, MessageSquare, FileText, TrendingUp, Clock, CheckCircle, GraduationCap } from "lucide-react"
import Link from "next/link"
import { UDDCareerRecommendations } from "@/components/udd-career-recommendations"

export default function DashboardPage() {
  return (
    <Shell>
      <Header title="Panel Principal" description="Bienvenido a tu plataforma de desarrollo profesional" />

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {/* Progress Cards */}
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
            <CardTitle className="text-sm font-medium">Habilidades</CardTitle>
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
            <CardTitle className="text-sm font-medium">Sesiones de Coach</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground mt-2">Sesiones completadas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mt-6">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Continúa con tu desarrollo profesional</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start">
              <Link href="/personality-test">
                <Brain className="mr-2 h-4 w-4" />
                Continuar Test de Personalidad
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
                <MessageSquare className="mr-2 h-4 w-4" />
                Hablar con Coach
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
            <div className="flex items-center space-x-3">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Test DISC completado</p>
                <p className="text-xs text-muted-foreground">Hace 2 horas</p>
              </div>
              <Badge variant="secondary">Completado</Badge>
            </div>
            <div className="flex items-center space-x-3">
              <Clock className="h-4 w-4 text-yellow-500" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">CV actualizado</p>
                <p className="text-xs text-muted-foreground">Ayer</p>
              </div>
              <Badge variant="outline">Actualizado</Badge>
            </div>
            <div className="flex items-center space-x-3">
              <TrendingUp className="h-4 w-4 text-blue-500" />
              <div className="flex-1 space-y-1">
                <p className="text-sm font-medium">Sesión de coaching</p>
                <p className="text-xs text-muted-foreground">Hace 3 días</p>
              </div>
              <Badge variant="secondary">Completado</Badge>
            </div>
          </CardContent>
        </Card>

        {/* UDD Careers CTA */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Carreras UDD
            </CardTitle>
            <CardDescription>Descubre las carreras que mejor se adaptan a tu perfil</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm text-muted-foreground">
              Basado en tu personalidad y habilidades, hemos encontrado carreras UDD perfectas para ti.
            </div>
            <Button asChild className="w-full">
              <Link href="/udd-careers">
                <GraduationCap className="mr-2 h-4 w-4" />
                Explorar Carreras UDD
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* UDD Career Recommendations */}
      <div className="mt-8">
        <UDDCareerRecommendations />
      </div>
    </Shell>
  )
}
