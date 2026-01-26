"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  BookOpen,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  Target,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"

export function LandingPageOptimized() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent leading-tight">
            Transforma Tu Carrera Profesional
          </h1>

          <p className="text-xl md:text-2xl text-foreground mb-12 max-w-3xl mx-auto leading-relaxed opacity-80">
            Descubre tu verdadero potencial con tests científicos, accede a 120+ libros de desarrollo y recibe coaching
            personalizado con IA disponible 24/7
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/auth" prefetch={true}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-6 w-full sm:w-auto shadow-lg hover:shadow-xl transition-all"
              >
                Comenzar Demo Gratuito
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            {/* <Link href="/documents" prefetch={true}>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 w-full sm:w-auto border-2 bg-background hover:bg-card"
              >
                Chat con Documentos
                <MessageSquare className="ml-2 h-5 w-5" />
              </Button>
            </Link> */}
            <Link href="/biblioteca" prefetch={true}>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 w-full sm:w-auto border-2 bg-background hover:bg-card"
              >
                Explorar Biblioteca
                <BookOpen className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Card className="border-2 border-purple-200 dark:border-purple-900/50 bg-card">
              <CardContent className="pt-6 text-center">
                <p className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">6</p>
                <p className="text-sm font-medium text-foreground opacity-75">Tests Psicométricos</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-blue-200 dark:border-blue-900/50 bg-card">
              <CardContent className="pt-6 text-center">
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">120+</p>
                <p className="text-sm font-medium text-foreground opacity-75">Libros Profesionales</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-cyan-200 dark:border-cyan-900/50 bg-card">
              <CardContent className="pt-6 text-center">
                <p className="text-4xl font-bold text-cyan-600 dark:text-cyan-400 mb-2">100+</p>
                <p className="text-sm font-medium text-foreground opacity-75">Recursos Web</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-purple-200 dark:border-purple-900/50 bg-card">
              <CardContent className="pt-6 text-center">
                <p className="text-4xl font-bold text-purple-600 dark:text-purple-400 mb-2">24/7</p>
                <p className="text-sm font-medium text-foreground opacity-75">Coach con IA</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
            <Target className="h-3 w-3 mr-1" />
            Plataforma Integral
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Todo lo que necesitas para{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              alcanzar tus metas
            </span>
          </h2>
          <p className="text-xl text-foreground max-w-3xl mx-auto opacity-75">
            Combina ciencia, tecnología y contenido de clase mundial en una sola plataforma diseñada para tu crecimiento
            profesional
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="bg-card border-2 border-purple-100 dark:border-purple-900/50 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-xl transition-all group">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Tests Psicométricos Científicos</CardTitle>
              <p className="text-sm text-foreground opacity-75 mt-2">
                Evaluaciones validadas científicamente para conocer tu perfil profesional
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Despega Cerebral & Mapa de Personalidad</p>
                    <p className="text-sm text-foreground opacity-75">Comportamiento y personalidad</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">5 Dimensiones & Brújula Vocacional</p>
                    <p className="text-sm text-foreground opacity-75">Rasgos y orientación vocacional</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Inteligencia Emocional Despega</p>
                    <p className="text-sm text-foreground opacity-75">Gestión de emociones</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Competencias Despega</p>
                    <p className="text-sm text-foreground opacity-75">Habilidades blandas clave</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card border-2 border-blue-100 dark:border-blue-900/50 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-xl transition-all group">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Biblioteca Profesional Completa</CardTitle>
              <p className="text-sm text-foreground opacity-75 mt-2">
                Acceso ilimitado a los mejores libros de desarrollo profesional
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">120+ Libros Completos</p>
                    <p className="text-sm text-foreground opacity-75">Bestsellers de desarrollo</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">100+ Recursos Web</p>
                    <p className="text-sm text-foreground opacity-75">Contenido curado del mercado chileno</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Búsqueda Semántica</p>
                    <p className="text-sm text-foreground opacity-75">Encuentra respuestas con IA</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Actualización Constante</p>
                    <p className="text-sm text-foreground opacity-75">Nuevo contenido cada mes</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card border-2 border-cyan-100 dark:border-cyan-900/50 hover:border-cyan-300 dark:hover:border-cyan-700 hover:shadow-xl transition-all group">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Coach Virtual con IA</CardTitle>
              <p className="text-sm text-foreground opacity-75 mt-2">
                Tu mentor personal disponible cuando lo necesites
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-cyan-600 dark:text-cyan-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Personalizado a Tu Perfil</p>
                    <p className="text-sm text-foreground opacity-75">Basado en tus tests</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-cyan-600 dark:text-cyan-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Disponible 24/7</p>
                    <p className="text-sm text-foreground opacity-75">Respuestas instantáneas</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-cyan-600 dark:text-cyan-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Conocimiento Experto</p>
                    <p className="text-sm text-foreground opacity-75">Entrenado con 120+ libros</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-cyan-600 dark:text-cyan-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Contexto Chileno</p>
                    <p className="text-sm text-foreground opacity-75">Adaptado al mercado local</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-20 bg-card rounded-3xl my-16 border border-border">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
            <TrendingUp className="h-3 w-3 mr-1" />
            Proceso Simple
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Comienza en{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              3 pasos simples
            </span>
          </h2>
          <p className="text-xl text-foreground max-w-3xl mx-auto opacity-75">
            Tu camino hacia el desarrollo profesional comienza hoy
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="bg-background border-2 border-purple-100 dark:border-purple-900/50 relative overflow-hidden">
            <div className="absolute top-4 right-4 w-12 h-12 bg-purple-100 dark:bg-purple-900/40 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">1</span>
            </div>
            <CardContent className="pt-8">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-4">
                <Brain className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Realiza los Tests</h3>
              <p className="text-foreground opacity-75">
                Completa las evaluaciones psicométricas en 15-20 minutos cada una. Descubre tu perfil profesional único.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-background border-2 border-blue-100 dark:border-blue-900/50 relative overflow-hidden">
            <div className="absolute top-4 right-4 w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">2</span>
            </div>
            <CardContent className="pt-8">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <BookOpen className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Explora la Biblioteca</h3>
              <p className="text-foreground opacity-75">
                Accede a 120+ libros profesionales y recursos curados. Aprende de los mejores expertos del mundo.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-background border-2 border-cyan-100 dark:border-cyan-900/50 relative overflow-hidden">
            <div className="absolute top-4 right-4 w-12 h-12 bg-cyan-100 dark:bg-cyan-900/40 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">3</span>
            </div>
            <CardContent className="pt-8">
              <div className="w-14 h-14 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center mb-4">
                <Zap className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Recibe Coaching IA</h3>
              <p className="text-foreground opacity-75">
                Obtén recomendaciones personalizadas basadas en tu perfil. Tu coach virtual está disponible 24/7.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 text-white border-0 max-w-4xl mx-auto overflow-hidden relative">
          <div className="absolute inset-0 bg-grid-white/10"></div>
          <CardContent className="py-16 px-8 relative z-10">
            <div className="text-center">
              <Badge className="mb-6 bg-white/20 text-white border-0 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 mr-2" />
                100% Gratis - Sin Tarjeta de Crédito
              </Badge>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">¿Listo para transformar tu carrera?</h2>
              <p className="text-xl mb-10 text-purple-100 max-w-2xl mx-auto">
                Únete a más de 10,000 profesionales que ya están desarrollando sus habilidades y alcanzando sus metas
                con Despega Tu Carrera
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth">
                  <Button
                    size="lg"
                    className="bg-white text-purple-600 hover:bg-gray-100 text-lg px-8 py-6 w-full sm:w-auto shadow-xl"
                  >
                    Comenzar Ahora Gratis
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                {/* <Link href="/documents">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6 w-full sm:w-auto"
                  >
                    Chat con Documentos
                    <MessageSquare className="ml-2 h-5 w-5" />
                  </Button>
                </Link> */}
                <Link href="/biblioteca">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-transparent border-2 border-white text-white hover:bg-white/10 text-lg px-8 py-6 w-full sm:w-auto"
                  >
                    Ver Biblioteca
                    <BookOpen className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

export default LandingPageOptimized
