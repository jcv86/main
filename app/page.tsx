"use client"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Briefcase, Users, TrendingUp, BookOpen, Target, Award, ArrowRight, CheckCircle, Star } from "lucide-react"

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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Section */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">
              {t("welcomeBack")}, {user.user_metadata?.first_name || user.email}!
            </h1>
            <p className="text-xl text-muted-foreground mb-8">Continúa desarrollando tu carrera profesional</p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <Link href="/cv-builder">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">Constructor CV</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>Crea y personaliza tu currículum vitae profesional</CardDescription>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <Link href="/career-coach">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">Coach de Carrera</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>Recibe orientación personalizada para tu desarrollo profesional</CardDescription>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <Link href="/skills-assessment">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">Evaluaciones</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>Evalúa tus habilidades técnicas y blandas</CardDescription>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer">
              <Link href="/job-search">
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-2">
                    <Target className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">Búsqueda de Empleos</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription>Encuentra oportunidades laborales que se ajusten a tu perfil</CardDescription>
                </CardContent>
              </Link>
            </Card>
          </div>

          {/* Progress Overview */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Award className="h-5 w-5" />
                  <span>Tu Progreso</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Perfil completado</span>
                  </span>
                  <Badge variant="secondary">100%</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>CV creado</span>
                  </span>
                  <Badge variant="secondary">Completado</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center space-x-2">
                    <div className="h-4 w-4 rounded-full border-2 border-muted-foreground" />
                    <span>Test de personalidad</span>
                  </span>
                  <Badge variant="outline">Pendiente</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Recursos Recomendados</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Link href="/library" className="block hover:bg-muted p-2 rounded transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Biblioteca de Desarrollo</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Accede a libros y recursos para tu crecimiento profesional
                    </p>
                  </Link>
                  <Link href="/personality-test" className="block hover:bg-muted p-2 rounded transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Test de Personalidad</span>
                      <ArrowRight className="h-4 w-4" />
                    </div>
                    <p className="text-sm text-muted-foreground">Descubre tu tipo de personalidad y fortalezas</p>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Actividad Reciente</CardTitle>
              <CardDescription>Tus últimas acciones en la plataforma</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Briefcase className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">CV actualizado</p>
                    <p className="text-sm text-muted-foreground">Hace 2 días</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Sesión con coach completada</p>
                    <p className="text-sm text-muted-foreground">Hace 1 semana</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Star className="h-4 w-4 text-primary" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Perfil creado</p>
                    <p className="text-sm text-muted-foreground">Hace 2 semanas</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto max-w-4xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Despega tu Carrera
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            La plataforma integral de desarrollo profesional diseñada para el mercado laboral chileno
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="text-lg px-8 py-3">
                Comenzar Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="/auth/login">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3 bg-transparent">
                {t("login")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Todo lo que necesitas para tu desarrollo profesional
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Herramientas especializadas para el mercado laboral chileno
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Briefcase className="h-8 w-8 text-primary" />
                  <CardTitle>Constructor de CV</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Crea currículums profesionales adaptados a los estándares chilenos con plantillas modernas y consejos
                  personalizados.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Users className="h-8 w-8 text-primary" />
                  <CardTitle>Coach de Carrera IA</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Recibe orientación personalizada con inteligencia artificial especializada en el mercado laboral
                  chileno.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-8 w-8 text-primary" />
                  <CardTitle>Evaluaciones de Habilidades</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Tests de personalidad, habilidades técnicas y blandas para identificar tus fortalezas y áreas de
                  mejora.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Target className="h-8 w-8 text-primary" />
                  <CardTitle>Búsqueda de Empleos</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Encuentra oportunidades laborales en Chile con filtros avanzados y recomendaciones personalizadas.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-8 w-8 text-primary" />
                  <CardTitle>Biblioteca de Desarrollo</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Accede a libros, cursos y recursos especializados para tu crecimiento profesional continuo.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Award className="h-8 w-8 text-primary" />
                  <CardTitle>Seguimiento de Progreso</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Monitorea tu desarrollo profesional con métricas claras y objetivos personalizados.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary/5">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">¿Listo para impulsar tu carrera?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Únete a miles de profesionales que ya están desarrollando su carrera con nuestra plataforma
          </p>
          <Link href="/auth/register">
            <Button size="lg" className="text-lg px-8 py-3">
              Comenzar Ahora - Es Gratis
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
