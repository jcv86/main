"use client"

import { Shell } from "@/components/shell"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Brain, Target, MessageSquare, FileText, GraduationCap, TrendingUp, Clock, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <div className="md:pl-64">
      <Shell>
        <Header title="Panel Principal" description="Bienvenido a tu plataforma de desarrollo profesional" />

        {/* Progress Overview */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Perfil Completado</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">75%</div>
              <Progress value={75} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tests Completados</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3/5</div>
              <Progress value={60} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sesiones de Coaching</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+2 esta semana</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CVs Creados</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Último actualizado hace 3 días</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Test de Personalidad
              </CardTitle>
              <CardDescription>Descubre tu tipo de personalidad y fortalezas</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/personality-test">Comenzar Test</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Evaluación de Habilidades
              </CardTitle>
              <CardDescription>Evalúa tus habilidades técnicas y blandas</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/skills-assessment">Evaluar Habilidades</Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Carreras UDD
              </CardTitle>
              <CardDescription>Explora programas académicos recomendados</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/udd-careers">Explorar Carreras</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Actividad Reciente
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Test DISC completado</p>
                  <p className="text-xs text-muted-foreground">Hace 2 días</p>
                </div>
                <Badge variant="secondary">Completado</Badge>
              </div>

              <div className="flex items-center gap-3">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">CV actualizado</p>
                  <p className="text-xs text-muted-foreground">Hace 3 días</p>
                </div>
                <Badge variant="secondary">Actualizado</Badge>
              </div>

              <div className="flex items-center gap-3">
                <MessageSquare className="h-4 w-4 text-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Sesión de coaching</p>
                  <p className="text-xs text-muted-foreground">Hace 1 semana</p>
                </div>
                <Badge variant="outline">Coaching</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Recomendaciones UDD
              </CardTitle>
              <CardDescription>Basado en tu perfil de personalidad</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium">Ingeniería Civil Industrial</h4>
                <p className="text-sm text-muted-foreground">95% compatibilidad</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary">Liderazgo</Badge>
                  <Badge variant="secondary">Análisis</Badge>
                </div>
              </div>

              <div className="p-3 border rounded-lg">
                <h4 className="font-medium">Psicología</h4>
                <p className="text-sm text-muted-foreground">88% compatibilidad</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary">Empatía</Badge>
                  <Badge variant="secondary">Comunicación</Badge>
                </div>
              </div>

              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/udd-careers">Ver Todas las Recomendaciones</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Shell>
    </div>
  )
}
