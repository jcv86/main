"use client"

// Cache bust: 2026-02-06T16:55:00Z - Fixed BookOpen undefined error
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Target,
  Award,
  BarChart3,
  MessageSquare,
  Trophy,
  Lightbulb,
  Sparkles,
  TrendingUp,
  Calendar,
  Shield,
  Gamepad2,
  RefreshCw,
  ChevronRight,
  Flame,
  CircleDot,
  Zap,
  ArrowRight,
  Users,
  Clock,
  CheckCircle2,
  Globe,
} from "lucide-react"
import Link from "next/link"

export default function LandingPageOptimized() {
  // Force complete recompile - timestamp: 2026-02-06T17:00:00Z
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <div className="text-center max-w-5xl mx-auto">
          {/* Badge hidden - removed to reduce clutter */}
          {/* 
          <Badge className="mb-6 bg-gradient-to-r from-purple-600 to-blue-600 text-white border-0 px-4 py-2 text-sm">
            <Sparkles className="h-4 w-4 mr-2" />
            El Momento Para Descubrir Tu Siguiente Versión
          </Badge>
          */}

          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent leading-tight">
            Entiende cómo funcionas.<br />Ordena tu camino.<br />Avanza con más claridad.
          </h1>

          <p className="text-xl md:text-2xl text-foreground mb-12 max-w-3xl mx-auto leading-relaxed opacity-80">
            No es crisis. Es transición. Descubre quién eres ahora, explora quién podrías ser, y construye el puente que te llevará allá. Con tests científicos, conocimiento y coaching personalizado con IA disponible 24/7.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link href="/auth/signin" prefetch={true}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-6 w-full sm:w-auto shadow-lg hover:shadow-xl transition-all"
              >
                Quiero comenzar mi diagnóstico
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#how-it-works" prefetch={true}>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 w-full sm:w-auto border-2 hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                Ver cómo funciona DTC
              </Button>
            </Link>
          </div>

          {/* Trust Indicators - HIDDEN */}
          {/*
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-foreground mb-12 opacity-75">
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
              <span>100% Gratis</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <span>+10,000 En Transición</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              <span>Tests Científicos</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
              <span>Resultados Inmediatos</span>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
            <Card className="border-2 border-purple-200 dark:border-purple-900/50 bg-card">
              <CardContent className="pt-6 text-center">
                <p className="text-4xl font-bold text-purple-700 dark:text-purple-400 mb-2">6</p>
                <p className="text-sm font-medium text-foreground">Tests Psicométricos</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-blue-200 dark:border-blue-900/50 bg-card">
              <CardContent className="pt-6 text-center">
                <p className="text-4xl font-bold text-blue-700 dark:text-blue-400 mb-2">120+</p>
                <p className="text-sm font-medium text-foreground">Libros Profesionales</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-cyan-200 dark:border-cyan-900/50 bg-card">
              <CardContent className="pt-6 text-center">
                <p className="text-4xl font-bold text-cyan-700 dark:text-cyan-400 mb-2">100+</p>
                <p className="text-sm font-medium text-foreground">Recursos Web</p>
              </CardContent>
            </Card>
            <Card className="border-2 border-purple-200 dark:border-purple-900/50 bg-card">
              <CardContent className="pt-6 text-center">
                <p className="text-4xl font-bold text-purple-700 dark:text-purple-400 mb-2">24/7</p>
                <p className="text-sm font-medium text-foreground">Coach con IA</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* SECTION 2 — El Problema / Identificación */}
      <section className="container mx-auto px-4 py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            ¿Te reconoces aquí?
          </h2>
          <p className="text-xl text-center text-foreground/75 mb-12 max-w-2xl mx-auto">
            Muchos no están atrapados por falta de talento. Están atrapados por falta de claridad, estructura y autoconocimiento.
          </p>

          {/* Pain Points Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Pain Point 1 */}
            <div className="flex gap-4 p-6 bg-white dark:bg-slate-800 rounded-xl border border-red-200 dark:border-red-900/30 hover:shadow-lg transition-shadow">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold text-red-600 dark:text-red-400">01</span>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Desorden Interno</h3>
                <p className="text-foreground/75">No tienes claridad sobre ti mismo. Tienes potencial pero todo se siente desordenado y sin dirección clara.</p>
              </div>
            </div>

            {/* Pain Point 2 */}
            <div className="flex gap-4 p-6 bg-white dark:bg-slate-800 rounded-xl border border-amber-200 dark:border-amber-900/30 hover:shadow-lg transition-shadow">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold text-amber-600 dark:text-amber-400">02</span>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Falta de Claridad</h3>
                <p className="text-foreground/75">¿En qué eres realmente bueno? ¿Cuál es tu camino? Avanzas sin dirección clara, casi por inercia.</p>
              </div>
            </div>

            {/* Pain Point 3 */}
            <div className="flex gap-4 p-6 bg-white dark:bg-slate-800 rounded-xl border border-orange-200 dark:border-orange-900/30 hover:shadow-lg transition-shadow">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold text-orange-600 dark:text-orange-400">03</span>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Falta de Dirección</h3>
                <p className="text-foreground/75">¿Para dónde voy? ¿Es este el camino correcto? Estás estancado más de lo que creías.</p>
              </div>
            </div>

            {/* Pain Point 4 */}
            <div className="flex gap-4 p-6 bg-white dark:bg-slate-800 rounded-xl border border-blue-200 dark:border-blue-900/30 hover:shadow-lg transition-shadow">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">04</span>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Falta de Práctica Guiada</h3>
                <p className="text-foreground/75">Sabes que necesitas entrenar habilidades clave (entrevistas, comunicación). Pero no sabes cómo empezar.</p>
              </div>
            </div>

            {/* Pain Point 5 */}
            <div className="flex gap-4 p-6 bg-white dark:bg-slate-800 rounded-xl border border-purple-200 dark:border-purple-900/30 hover:shadow-lg transition-shadow">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold text-purple-600 dark:text-purple-400">05</span>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Falta de Lectura del Contexto</h3>
                <p className="text-foreground/75">No comprendes bien cómo funciona el mercado laboral ni cómo tu perfil se traduce en oportunidades reales.</p>
              </div>
            </div>

            {/* Summary */}
            <div className="flex gap-4 p-6 bg-white dark:bg-slate-800 rounded-xl border border-cyan-200 dark:border-cyan-900/30 hover:shadow-lg transition-shadow">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-lg font-bold text-cyan-600 dark:text-cyan-400">→</span>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">El Resultado</h3>
                <p className="text-foreground/75 font-medium">Tienes potencial pero no avanzas. Necesitas estructura, foco y una ruta clara. DTC está diseñado para esto.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — Cómo funciona en 60 segundos */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Cómo funciona en 60 segundos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="relative">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4">
                  1
                </div>
                <h3 className="font-bold text-xl mb-2 text-center">Te entiendes</h3>
                <p className="text-foreground/75 text-center text-sm leading-relaxed">
                  Diagnóstico profundo de quién eres, qué haces bien y tus patrones. El autoconocimiento es el primer paso.
                </p>
              </div>
              {/* Arrow to next step */}
              <div className="hidden md:block absolute top-8 -right-6 w-12 h-12">
                <svg className="w-full h-full text-purple-300 dark:text-purple-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4">
                  2
                </div>
                <h3 className="font-bold text-xl mb-2 text-center">Ordenas tu avance</h3>
                <p className="text-foreground/75 text-center text-sm leading-relaxed">
                  Ruta personalizada en 90 días con metas claras, sprints y puntos de control. Avanzar con dirección.
                </p>
              </div>
              {/* Arrow to next step */}
              <div className="hidden md:block absolute top-8 -right-6 w-12 h-12">
                <svg className="w-full h-full text-cyan-300 dark:text-cyan-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            {/* Step 3 */}
            <div>
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-600 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4">
                  3
                </div>
                <h3 className="font-bold text-xl mb-2 text-center">Practicas y mejoras</h3>
                <p className="text-foreground/75 text-center text-sm leading-relaxed">
                  Entrenamiento guiado en habilidades clave con feedback real. Crecer practicando de manera efectiva.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          {/* Badge "Tu Puente de Transformación" - HIDDEN */}
          {/*
          <Badge className="mb-4 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800">
            <Target className="h-3 w-3 mr-1" />
            Tu Puente de Transformación
          </Badge>
          */}
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Tu Viaje en{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              4 Pilares de Tu Transformación
            </span>
          </h2>
          <p className="text-xl text-foreground max-w-3xl mx-auto opacity-75">
            Desde quién eres ahora, a cómo prácticas siendo, hasta vivir tu nueva realidad
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          <Card className="bg-card border-2 border-purple-100 dark:border-purple-900/50 hover:border-purple-300 dark:hover:border-purple-700 hover:shadow-xl transition-all group">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <RefreshCw className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">El Ritual - Quién Eres Ahora</CardTitle>
              <p className="text-sm text-foreground opacity-75 mt-2">
                Descubre tu verdadero perfil sin filtros, con diagnósticos profundos
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Evaluación Integral</p>
                    <p className="text-sm text-foreground opacity-75">Personalidad, valores, emociones</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Tests Científicos</p>
                    <p className="text-sm text-foreground opacity-75">6 evaluaciones validadas</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Punto de Partida</p>
                    <p className="text-sm text-foreground opacity-75">De donde realmente estás</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-purple-600 dark:text-purple-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Análisis Personal</p>
                    <p className="text-sm text-foreground opacity-75">15-20 minutos por test</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card border-2 border-blue-100 dark:border-blue-900/50 hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-xl transition-all group">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Lightbulb className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Exploración - Aprende Nuevas Formas</CardTitle>
              <p className="text-sm text-foreground opacity-75 mt-2">
                Descubre tu ruta de 30/60/90 días con 120+ recursos y estrategias reales
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">120+ Libros Profesionales</p>
                    <p className="text-sm text-foreground opacity-75">Narrativas de transformación</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Búsqueda Semántica</p>
                    <p className="text-sm text-foreground opacity-75">Respuestas de tu transición</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">100+ Recursos Web</p>
                    <p className="text-sm text-foreground opacity-75">Estrategias y ejemplos reales</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Plan Personalizado</p>
                    <p className="text-sm text-foreground opacity-75">Ruta 30/60/90 días según tu ritmo</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card border-2 border-orange-100 dark:border-orange-900/50 hover:border-orange-300 dark:hover:border-orange-700 hover:shadow-xl transition-all group">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Entrenamiento - Practica Siendo</CardTitle>
              <p className="text-sm text-foreground opacity-75 mt-2">
                Entrenamiento de entrevistas con escenarios reales y feedback
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Entrenamiento de Entrevistas</p>
                    <p className="text-sm text-foreground opacity-75">Escenarios realistas con múltiples opciones de respuesta</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Feedback Conductual</p>
                    <p className="text-sm text-foreground opacity-75">Análisis de tus respuestas en tiempo real</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Progresión Adaptada</p>
                    <p className="text-sm text-foreground opacity-75">Dificultad que crece con tu nivel</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-orange-600 dark:text-orange-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Coach IA Personalizado</p>
                    <p className="text-sm text-foreground opacity-75">Acompañamiento en cada sesión de entrenamiento</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-card border-2 border-cyan-100 dark:border-cyan-900/50 hover:border-cyan-300 dark:hover:border-cyan-700 hover:shadow-xl transition-all group">
            <CardHeader className="pb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <CardTitle className="text-2xl">La Realidad - Vive Tu Nueva Identidad</CardTitle>
              <p className="text-sm text-foreground opacity-75 mt-2">
                Inteligencia de mercado, coaching 24/7 y plan de acción
              </p>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-cyan-600 dark:text-cyan-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Noticias del Mercado</p>
                    <p className="text-sm text-foreground opacity-75">Contexto y oportunidades en tiempo real</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-cyan-600 dark:text-cyan-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Coach IA Personalizado</p>
                    <p className="text-sm text-foreground opacity-75">Sofía & Dani acompañan 24/7</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-cyan-600 dark:text-cyan-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Plan de Acción - 30, 60 o 90 Días</p>
                    <p className="text-sm text-foreground opacity-75">Elige tu ritmo: intenso, balanceado o completo</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-cyan-600 dark:text-cyan-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium">Contexto Chileno</p>
                    <p className="text-sm text-foreground opacity-75">Adaptado al mercado y oportunidades locales</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* SECTION 5 — CTA de Cierre */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-r from-purple-600/10 to-blue-600/10 dark:from-purple-600/5 dark:to-blue-600/5 rounded-3xl my-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            ¿Listo para entenderte mejor?
          </h2>
          <p className="text-xl text-foreground/75 mb-8 max-w-2xl mx-auto">
            Tu diagnóstico te espera. Descubre quién eres realmente, ordena tu camino y comienza tu transformación hoy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signin" prefetch={true}>
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-lg px-8 py-6 w-full sm:w-auto shadow-lg hover:shadow-xl transition-all"
              >
                Quiero empezar mi proceso
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#how-it-works" prefetch={true}>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 w-full sm:w-auto border-2 hover:bg-slate-100 dark:hover:bg-slate-900"
              >
                Despejar dudas primero
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works Section - HIDDEN (Duplicate of Features Section) */}
      {/* 
      <section className="container mx-auto px-4 py-20 bg-card rounded-3xl my-16 border border-border">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800">
            <TrendingUp className="h-3 w-3 mr-1" />
            Tu Ritual de Entrada
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Descubre Los{" "}
            <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              3 Pilares
            </span>
            {" "}De Tu Transformación
          </h2>
          <p className="text-xl text-foreground max-w-3xl mx-auto opacity-75">
            Todo comienza con el autoconocimiento. Luego, la exploración. Finalmente, la acción.
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
              <h3 className="text-xl font-bold mb-3">El Ritual - Quién Eres Ahora</h3>
              <p className="text-foreground opacity-75">
                Descubre tu verdadero perfil sin filtros. Tests científicos que te muestran exactamente quién eres hoy.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-background border-2 border-blue-100 dark:border-blue-900/50 relative overflow-hidden">
            <div className="absolute top-4 right-4 w-12 h-12 bg-blue-100 dark:bg-blue-900/40 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">2</span>
            </div>
            <CardContent className="pt-8">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4">
                <Target className="h-7 w-7 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-3">Exploración & Ensayo</h3>
              <p className="text-foreground opacity-75">
                Explora identidades futuras. 120+ recursos, narrativas reales y nuevas versiones de ti para practicar.
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
              <h3 className="text-xl font-bold mb-3">La Realidad - Dónde Vive</h3>
              <p className="text-foreground opacity-75">
                Coach IA 24/7, noticias del mercado y tu plan de acción. Construye tu puente a la nueva identidad.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
      */}

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <Card className="bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 text-white border-0 max-w-4xl mx-auto overflow-hidden relative">
          <div className="absolute inset-0 bg-grid-white/10"></div>
          <CardContent className="py-16 px-8 relative z-10">
            <div className="text-center">
              {/* Badge "100% Gratis - Sin Tarjeta de Crédito" - HIDDEN */}
              {/*
              <Badge className="mb-6 bg-white/20 text-white border-0 backdrop-blur-sm">
                <Sparkles className="h-4 w-4 mr-2" />
                100% Gratis - Sin Tarjeta de Crédito
              </Badge>
              */}
              <h2 className="text-4xl md:text-5xl font-bold mb-6">¿Sientes que estás en una encrucijada?</h2>
              <p className="text-xl mb-10 text-purple-100 max-w-2xl mx-auto">
                No es crisis. Es el momento perfecto. Únete a más de 10,000 personas que ya están transitando y descubriendo su siguiente versión con Despega Tu Carrera
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth">
                  <Button
                    size="lg"
                    className="bg-white text-purple-800 hover:bg-gray-100 text-lg px-8 py-6 w-full sm:w-auto shadow-xl font-semibold"
                  >
                    Empieza Tu Transición
                    <ArrowRight className="ml-2 h-5 w-5" />
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
