"use client"

import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Search,
  MessageSquare,
  BookOpen,
  TrendingUp,
  Users,
  Award,
  Zap,
  ArrowRight,
  CheckCircle,
} from "lucide-react"

export default function HomePage() {
  const { user, loading } = useAuth()
  const { t } = useLanguage()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (user) {
    return (
      <div className="flex-1">
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                  Bienvenido de vuelta, {user.user_metadata?.full_name || user.email?.split("@")[0]}
                </h1>
                <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                  Continúa desarrollando tu carrera profesional con nuestras herramientas de IA
                </p>
              </div>
              <div className="space-x-4">
                <Button asChild>
                  <Link href="/dashboard">
                    Ir al Dashboard
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/career-coach">Hablar con el Coach IA</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
          <div className="container px-4 md:px-6">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-center mb-12">
              Continúa tu desarrollo
            </h2>
            <div className="grid gap-6 lg:grid-cols-3 lg:gap-12">
              <Card>
                <CardHeader>
                  <Brain className="h-10 w-10 mb-2 text-primary" />
                  <CardTitle>Tests de Personalidad</CardTitle>
                  <CardDescription>Completa evaluaciones para conocer mejor tu perfil profesional</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href="/personality-test">Realizar Test</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <Search className="h-10 w-10 mb-2 text-primary" />
                  <CardTitle>Búsqueda de Empleos</CardTitle>
                  <CardDescription>Encuentra oportunidades laborales que se ajusten a tu perfil</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href="/job-search">Buscar Empleos</Link>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <MessageSquare className="h-10 w-10 mb-2 text-primary" />
                  <CardTitle>Coach con IA</CardTitle>
                  <CardDescription>Recibe orientación personalizada para tu desarrollo profesional</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild className="w-full">
                    <Link href="/career-coach">Iniciar Conversación</Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="flex-1">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <Badge variant="secondary" className="mb-4">
                🚀 Plataforma de Desarrollo Profesional con IA
              </Badge>
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                {t("hero.title")}
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">{t("hero.subtitle")}</p>
            </div>
            <div className="space-x-4">
              <Button size="lg" asChild>
                <Link href="/auth/register">
                  {t("hero.cta")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/auth/login">Iniciar Sesión</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                Herramientas para tu éxito profesional
              </h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Descubre tu potencial con nuestras herramientas de evaluación, búsqueda de empleo y orientación
                profesional
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-2 lg:gap-12">
            <div className="flex flex-col justify-center space-y-4">
              <div className="grid gap-6">
                <div className="flex items-start space-x-4">
                  <Brain className="h-6 w-6 mt-1 text-primary" />
                  <div>
                    <h3 className="font-bold">{t("features.tests")}</h3>
                    <p className="text-gray-500 dark:text-gray-400">{t("features.tests.desc")}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <Search className="h-6 w-6 mt-1 text-primary" />
                  <div>
                    <h3 className="font-bold">{t("features.jobs")}</h3>
                    <p className="text-gray-500 dark:text-gray-400">{t("features.jobs.desc")}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <MessageSquare className="h-6 w-6 mt-1 text-primary" />
                  <div>
                    <h3 className="font-bold">{t("features.coach")}</h3>
                    <p className="text-gray-500 dark:text-gray-400">{t("features.coach.desc")}</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <BookOpen className="h-6 w-6 mt-1 text-primary" />
                  <div>
                    <h3 className="font-bold">{t("features.library")}</h3>
                    <p className="text-gray-500 dark:text-gray-400">{t("features.library.desc")}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <div className="grid gap-4 w-full max-w-sm">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Análisis de Carrera
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Perfil completado
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Red Profesional
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Zap className="h-4 w-4 text-blue-500" />
                      Conecta con profesionales
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2">
                      <Award className="h-5 w-5" />
                      Certificaciones
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      Valida tus habilidades
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">¿Listo para despegar tu carrera?</h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Únete a miles de profesionales que ya están transformando su futuro laboral
              </p>
            </div>
            <div className="w-full max-w-sm space-y-2">
              <Button size="lg" className="w-full" asChild>
                <Link href="/auth/register">Crear cuenta gratuita</Link>
              </Button>
              <p className="text-xs text-gray-500 dark:text-gray-400">Sin compromiso. Cancela cuando quieras.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
