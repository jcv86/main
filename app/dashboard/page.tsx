"use client"

import { Shell } from "@/components/shell"
import { DashboardHeader } from "@/components/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  BarChart3,
  FileText,
  MessageSquare,
  Search,
  GraduationCap,
  TrendingUp,
  Award,
  Clock,
} from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <Shell>
      <div className="space-y-6">
        <DashboardHeader title="Panel Principal" description="Bienvenido a tu plataforma de desarrollo profesional" />

        {/* Estadísticas de Progreso */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Progreso General</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">65%</div>
              <Progress value={65} className="mt-2" />
              <p className="text-xs text-muted-foreground mt-2">+12% desde el mes pasado</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Evaluaciones Completadas</CardTitle>
              <Brain className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
              <p className="text-xs text-muted-foreground">Personalidad, Habilidades Técnicas, Soft Skills</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Metas Activas</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4</div>
              <p className="text-xs text-muted-foreground">2 completadas este mes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Oportunidades UDD</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">Carreras recomendadas para ti</p>
            </CardContent>
          </Card>
        </div>

        {/* Acciones Rápidas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                Test de Personalidad
              </CardTitle>
              <CardDescription>
                Descubre tu tipo de personalidad y cómo se adapta al mercado laboral chileno
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">Completado</Badge>
                <Button asChild size="sm">
                  <Link href="/personality-test">Ver Resultados</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Evaluación de Habilidades
              </CardTitle>
              <CardDescription>Evalúa tus habilidades técnicas y blandas para el mercado chileno</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge variant="outline">En Progreso</Badge>
                <Button asChild size="sm">
                  <Link href="/skills-assessment">Continuar</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Coach Profesional
              </CardTitle>
              <CardDescription>Recibe consejos personalizados de carrera con IA especializada en Chile</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge variant="default">Disponible</Badge>
                <Button asChild size="sm">
                  <Link href="/career-coach">Iniciar Chat</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Constructor de CV
              </CardTitle>
              <CardDescription>Crea un CV profesional adaptado al mercado laboral chileno</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge variant="outline">Borrador</Badge>
                <Button asChild size="sm">
                  <Link href="/cv-builder">Editar CV</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="h-5 w-5" />
                Búsqueda de Empleo
              </CardTitle>
              <CardDescription>Encuentra oportunidades laborales en empresas chilenas</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge variant="secondary">15 Nuevas</Badge>
                <Button asChild size="sm">
                  <Link href="/job-search">Explorar</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5" />
                Carreras UDD
              </CardTitle>
              <CardDescription>Explora las carreras de la Universidad del Desarrollo</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Badge variant="default">Recomendado</Badge>
                <Button asChild size="sm">
                  <Link href="/udd-careers">Ver Carreras</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actividad Reciente */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Test de Personalidad completado</p>
                  <p className="text-xs text-muted-foreground">Hace 2 días</p>
                </div>
                <Badge variant="secondary">ENFP</Badge>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Evaluación de JavaScript completada</p>
                  <p className="text-xs text-muted-foreground">Hace 3 días</p>
                </div>
                <Badge variant="outline">85/100</Badge>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">CV actualizado</p>
                  <p className="text-xs text-muted-foreground">Hace 1 semana</p>
                </div>
                <Badge variant="outline">Revisado</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recomendaciones UDD */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Carreras UDD Recomendadas para Ti
            </CardTitle>
            <CardDescription>Basado en tu perfil de personalidad y habilidades</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold">Ingeniería Civil Industrial</h4>
                <p className="text-sm text-muted-foreground mt-1">Combina ingeniería con gestión empresarial</p>
                <div className="flex items-center justify-between mt-3">
                  <Badge variant="default">95% Match</Badge>
                  <span className="text-sm text-muted-foreground">$2.5M - $4M CLP</span>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold">Ingeniería en Informática</h4>
                <p className="text-sm text-muted-foreground mt-1">Desarrollo de software y sistemas</p>
                <div className="flex items-center justify-between mt-3">
                  <Badge variant="default">92% Match</Badge>
                  <span className="text-sm text-muted-foreground">$2.2M - $3.8M CLP</span>
                </div>
              </div>
              <div className="border rounded-lg p-4">
                <h4 className="font-semibold">Ingeniería Comercial</h4>
                <p className="text-sm text-muted-foreground mt-1">Negocios y administración estratégica</p>
                <div className="flex items-center justify-between mt-3">
                  <Badge variant="secondary">88% Match</Badge>
                  <span className="text-sm text-muted-foreground">$2M - $3.5M CLP</span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <Button asChild className="w-full">
                <Link href="/udd-careers">Explorar Todas las Carreras UDD</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Shell>
  )
}
