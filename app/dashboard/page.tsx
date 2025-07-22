"use client"

import { Shell } from "@/components/shell"
import { Header } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import {
  Brain,
  Target,
  FileText,
  MessageSquare,
  TrendingUp,
  CheckCircle,
  GraduationCap,
  ArrowRight,
} from "lucide-react"

export default function DashboardPage() {
  return (
    <Shell>
      <div className="space-y-8">
        <Header title="Panel Principal" description="Bienvenido a tu plataforma de desarrollo profesional" />

        {/* Estadísticas de Progreso */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Perfil Completado</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">75%</div>
              <Progress value={75} className="mt-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tests Completados</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3/5</div>
              <p className="text-xs text-muted-foreground">2 tests pendientes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CVs Creados</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2</div>
              <p className="text-xs text-muted-foreground">Última actualización: hace 2 días</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sesiones de Coaching</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">+2 esta semana</p>
            </CardContent>
          </Card>
        </div>

        {/* Acciones Rápidas */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>Continúa con tu desarrollo profesional</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Button asChild className="h-auto p-4 flex flex-col items-center space-y-2">
                <Link href="/personality-test">
                  <Brain className="h-8 w-8" />
                  <span className="text-sm">Test de Personalidad</span>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
              >
                <Link href="/skills-assessment">
                  <Target className="h-8 w-8" />
                  <span className="text-sm">Evaluar Habilidades</span>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
              >
                <Link href="/cv-builder">
                  <FileText className="h-8 w-8" />
                  <span className="text-sm">Crear CV</span>
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2 bg-transparent"
              >
                <Link href="/career-coach">
                  <MessageSquare className="h-8 w-8" />
                  <span className="text-sm">Coach IA</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Actividad Reciente */}
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100">
                  <Brain className="h-4 w-4 text-blue-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Test de Personalidad DISC completado</p>
                  <p className="text-sm text-muted-foreground">Hace 2 días</p>
                </div>
                <Badge variant="secondary">Completado</Badge>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-green-100">
                  <FileText className="h-4 w-4 text-green-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">CV actualizado - Plantilla Moderna</p>
                  <p className="text-sm text-muted-foreground">Hace 3 días</p>
                </div>
                <Badge variant="secondary">Actualizado</Badge>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-100">
                  <MessageSquare className="h-4 w-4 text-purple-600" />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium leading-none">Sesión de coaching sobre entrevistas</p>
                  <p className="text-sm text-muted-foreground">Hace 1 semana</p>
                </div>
                <Badge variant="secondary">Completado</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recomendaciones de Carreras UDD */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <GraduationCap className="h-5 w-5" />
              <span>Carreras UDD Recomendadas</span>
            </CardTitle>
            <CardDescription>Basado en tu perfil de personalidad y habilidades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <h4 className="font-medium">Ingeniería Comercial</h4>
                <p className="text-sm text-muted-foreground">
                  Combina habilidades analíticas con liderazgo empresarial
                </p>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">95% Empleabilidad</Badge>
                  <Badge variant="outline">$2.5M CLP</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Psicología</h4>
                <p className="text-sm text-muted-foreground">Perfecta para tu perfil empático y comunicativo</p>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline">88% Empleabilidad</Badge>
                  <Badge variant="outline">$1.8M CLP</Badge>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <Button asChild variant="outline" className="w-full bg-transparent">
                <Link href="/udd-careers">
                  Explorar Todas las Carreras UDD
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Shell>
  )
}
