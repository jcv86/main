"use client"

import { Shell } from "@/components/shell"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Brain, Target, MessageCircle, FileText, TrendingUp, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <Shell>
      <div className="space-y-6">
        <Header title="Panel Principal" description="Bienvenido a tu plataforma de desarrollo profesional" />

        {/* Progress Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Test de Personalidad</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
              <p className="text-xs text-muted-foreground">Completado</p>
              <Progress value={85} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Evaluación de Habilidades</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">72%</div>
              <p className="text-xs text-muted-foreground">Completado</p>
              <Progress value={72} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sesiones de Coaching</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Completadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CV Actualizado</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">95%</div>
              <p className="text-xs text-muted-foreground">Completado</p>
              <Progress value={95} className="mt-2" />
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>Continúa con tu desarrollo profesional</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Button asChild className="w-full justify-start">
                  <Link href="/personality-test">
                    <Brain className="mr-2 h-4 w-4" />
                    Completar Test de Personalidad
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                  <Link href="/skills-assessment">
                    <Target className="mr-2 h-4 w-4" />
                    Evaluar Habilidades Técnicas
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                  <Link href="/career-coach">
                    <MessageCircle className="mr-2 h-4 w-4" />
                    Hablar con Coach Profesional
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full justify-start bg-transparent">
                  <Link href="/cv-builder">
                    <FileText className="mr-2 h-4 w-4" />
                    Actualizar CV
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>Tus últimas acciones en la plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Test DISC completado</p>
                    <p className="text-xs text-muted-foreground">Hace 2 horas</p>
                  </div>
                  <Badge variant="secondary">Completado</Badge>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    <Clock className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">Sesión de coaching programada</p>
                    <p className="text-xs text-muted-foreground">Hace 1 día</p>
                  </div>
                  <Badge variant="outline">Programado</Badge>
                </div>

                <div className="flex items-center space-x-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-100">
                    <TrendingUp className="h-4 w-4 text-purple-600" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <p className="text-sm font-medium">CV actualizado</p>
                    <p className="text-xs text-muted-foreground">Hace 3 días</p>
                  </div>
                  <Badge variant="secondary">Actualizado</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* UDD Career Recommendations */}
        <Card>
          <CardHeader>
            <CardTitle>Recomendaciones de Carreras UDD</CardTitle>
            <CardDescription>Basado en tu perfil de personalidad y habilidades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <h4 className="font-medium">Ingeniería en Informática</h4>
                <p className="text-sm text-muted-foreground">Compatibilidad: 92%</p>
                <Progress value={92} />
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Psicología</h4>
                <p className="text-sm text-muted-foreground">Compatibilidad: 87%</p>
                <Progress value={87} />
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Administración de Empresas</h4>
                <p className="text-sm text-muted-foreground">Compatibilidad: 78%</p>
                <Progress value={78} />
              </div>
            </div>
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
