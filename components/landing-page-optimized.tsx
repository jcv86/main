"use client"

// Cache bust: 2026-02-06T16:55:00Z - Fixed BookOpen undefined error
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Brain,
  Target,
  Award,
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
      </section>

      {/* SECTION 7 — Para ti si... (Público específico) */}
      <section className="container mx-auto px-4 py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            DTC es para ti si...
          </h2>
          <p className="text-lg text-center text-foreground/70 mb-12 max-w-2xl mx-auto">
            Reconoce tu situación y descubre si este es tu camino.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Situación 1 */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <span className="text-purple-600 dark:text-purple-400 text-xl">✓</span>
                Te sientes estancado
              </h3>
              <p className="text-foreground/70 text-sm">
                Hace tiempo que no avanzas de verdad. Hay talento pero sin dirección clara. Necesitas un impulso estructurado.
              </p>
            </div>

            {/* Situación 2 */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <span className="text-blue-600 dark:text-blue-400 text-xl">✓</span>
                Estás en transición
              </h3>
              <p className="text-foreground/70 text-sm">
                Cambio de área, empresa o carrera. Necesitas entender si el nuevo camino es el correcto.
              </p>
            </div>

            {/* Situación 3 */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <span className="text-green-600 dark:text-green-400 text-xl">✓</span>
                Quieres reenfocarte
              </h3>
              <p className="text-foreground/70 text-sm">
                Ya tienes experiencia pero sientes que no estás en el lugar correcto. Buscas realinearte.
              </p>
            </div>

            {/* Situación 4 */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border-l-4 border-cyan-500 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <span className="text-cyan-600 dark:text-cyan-400 text-xl">✓</span>
                Necesitas estructura
              </h3>
              <p className="text-foreground/70 text-sm">
                Tienes ideas pero no sabes por dónde empezar. Necesitas un plan claro y guía.
              </p>
            </div>

            {/* Situación 5 */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <span className="text-orange-600 dark:text-orange-400 text-xl">✓</span>
                Quieres entrenar entrevistas
              </h3>
              <p className="text-foreground/70 text-sm">
                Buscas trabajo o quieres estar mejor preparado. Necesitas práctica con feedback real.
              </p>
            </div>

            {/* Situación 6 */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border-l-4 border-pink-500 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <span className="text-pink-600 dark:text-pink-400 text-xl">✓</span>
                Buscas avanzar con criterio
              </h3>
              <p className="text-foreground/70 text-sm">
                No solo quieres crecer, quieres hacerlo de forma consciente y alineada con quién eres.
              </p>
            </div>
          </div>

          <div className="mt-12 p-8 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-center text-foreground text-lg">
              Si alguna de estas situaciones es tuya, <span className="font-bold">DTC está diseñado para ti</span>.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 1.5 — Mini banda de Social Proof / Credibilidad */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-sm font-semibold text-foreground/60 mb-8 uppercase tracking-wider">Lo que te espera en DTC</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Reporte */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-sm mb-2">Reporte Profundo</h3>
              <p className="text-xs text-foreground/70">Diagnóstico de tu perfil con tensiones internas, patrones y lectura del mercado.</p>
            </div>

            {/* Ruta */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-sm mb-2">Ruta Personalizada</h3>
              <p className="text-xs text-foreground/70">90 días estructurados en sprints, checkpoints y revisiones semanales guiadas.</p>
            </div>

            {/* Entrenamiento */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                </svg>
              </div>
              <h3 className="font-semibold text-sm mb-2">Entrenamiento Práctico</h3>
              <p className="text-xs text-foreground/70">Habilidades clave como entrevistas, comunicación y negociación con feedback real.</p>
            </div>

            {/* IA aplicada */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-cyan-600 dark:text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-sm mb-2">Coach con IA</h3>
              <p className="text-xs text-foreground/70">Retroalimentación continua, disponibilidad 24/7 y adaptación a tu ritmo.</p>
            </div>
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

      {/* SECTION 5 — Diferenciadores de Marca */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            ¿Por qué DTC es diferente?
          </h2>
          <p className="text-lg text-center text-foreground/70 mb-12 max-w-2xl mx-auto">
            No somos un test cualquiera ni una plataforma genérica. Somos un sistema de interpretación y acompañamiento.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Diferenciador 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold text-purple-600 dark:text-purple-400">✓</span>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Interpretamos, no solo medimos</h3>
                <p className="text-foreground/70 text-sm">
                  Los tests dan números. DTC interpreta qué significan realmente tus patrones y tensiones en tu contexto.
                </p>
              </div>
            </div>

            {/* Diferenciador 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold text-blue-600 dark:text-blue-400">✓</span>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Personalizamos, no estandarizamos</h3>
                <p className="text-foreground/70 text-sm">
                  Tu ruta, entrenamiento y asesoría se adaptan a tu perfil. No hay rutas genéricas para todos.
                </p>
              </div>
            </div>

            {/* Diferenciador 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold text-green-600 dark:text-green-400">✓</span>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Entrenamos, no solo informamos</h3>
                <p className="text-foreground/70 text-sm">
                  Practicas habilidades reales con feedback de verdad. Aprendes haciendo, no leyendo.
                </p>
              </div>
            </div>

            {/* Diferenciador 4 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold text-cyan-600 dark:text-cyan-400">✓</span>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Acompañamos, no solo entregamos</h3>
                <p className="text-foreground/70 text-sm">
                  Coach con IA disponible 24/7. Tu progreso se monitorea, ajusta y celebra en el camino.
                </p>
              </div>
            </div>

            {/* Diferenciador 5 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold text-orange-600 dark:text-orange-400">✓</span>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Conectamos desarrollo con contexto real</h3>
                <p className="text-foreground/70 text-sm">
                  No es autoconocimiento por autoconocimiento. Todo se traduce en oportunidades y direcciones reales del mercado.
                </p>
              </div>
            </div>

            {/* Diferenciador 6 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold text-pink-600 dark:text-pink-400">✓</span>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Estructura con flexibilidad</h3>
                <p className="text-foreground/70 text-sm">
                  90 días bien planificados pero que se ajustan. Progreso medible sin ser rígido.
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

      {/* SECTION 9 — FAQ Estratégico */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Preguntas frecuentes
          </h2>
          <p className="text-lg text-center text-foreground/70 mb-12 max-w-2xl mx-auto">
            Resolvemos las dudas más comunes para que tomes la mejor decisión.
          </p>

          <div className="space-y-4">
            {/* FAQ 1 */}
            <details className="group bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow cursor-pointer">
              <summary className="flex items-center justify-between font-semibold text-lg text-foreground">
                <span>¿Es DTC un test cualquiera o algo más?</span>
                <svg className="w-6 h-6 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </summary>
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-foreground/80 text-sm leading-relaxed space-y-2">
                <p>
                  No es un test cualquiera. DTC es un sistema integral que combina diagnóstico profundo, ruta personalizada, entrenamiento práctico y contexto laboral.
                </p>
                <p>
                  Mientras otros tests solo dan números o descripciones, DTC interpreta esos datos, construye una ruta, te entrena en habilidades reales y te mantiene conectado al mercado laboral.
                </p>
                <p>
                  Es más parecido a tener un coach personal con IA que a completar un cuestionario.
                </p>
              </div>
            </details>

            {/* FAQ 2 */}
            <details className="group bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow cursor-pointer">
              <summary className="flex items-center justify-between font-semibold text-lg text-foreground">
                <span>¿Qué pasa si estoy estancado? ¿Realmente ayuda?</span>
                <svg className="w-6 h-6 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </summary>
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-foreground/80 text-sm leading-relaxed space-y-2">
                <p>
                  La mayoría de personas estancadas no lo están por falta de talento, sino por falta de claridad, dirección y estructura.
                </p>
                <p>
                  DTC funciona precisamente para eso: te ayuda a entender qué te está frenando realmente, crea una ruta clara de 90 días con hitos medibles, y te entrena en habilidades específicas donde te bloqueas.
                </p>
                <p>
                  El cambio ocurre cuando el desorden se convierte en dirección, y la comprensión en práctica.
                </p>
              </div>
            </details>

            {/* FAQ 3 */}
            <details className="group bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow cursor-pointer">
              <summary className="flex items-center justify-between font-semibold text-lg text-foreground">
                <span>¿Es solo para buscar trabajo o también para crecimiento integral?</span>
                <svg className="w-6 h-6 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </summary>
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-foreground/80 text-sm leading-relaxed space-y-2">
                <p>
                  Es para ambas cosas. DTC trabaja tanto la búsqueda de oportunidades laborales como tu desarrollo integral como persona.
                </p>
                <p>
                  El diagnóstico te ayuda a entender cómo funcionas realmente. La ruta personalizada puede enfocarse en búsqueda activa o en crecimiento interno. El entrenamiento incluye tanto habilidades de mercado como liderazgo personal.
                </p>
                <p>
                  Tú eliges el foco, pero el sistema está diseñado para que ambos aspectos mejoren.
                </p>
              </div>
            </details>

            {/* FAQ 4 */}
            <details className="group bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow cursor-pointer">
              <summary className="flex items-center justify-between font-semibold text-lg text-foreground">
                <span>¿Cómo me diferencio realmente en el mercado?</span>
                <svg className="w-6 h-6 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </summary>
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-foreground/80 text-sm leading-relaxed space-y-2">
                <p>
                  La diferenciación viene de dos cosas: entender dónde realmente eres bueno (y dónde no) y saber comunicarlo con claridad.
                </p>
                <p>
                  DTC te ayuda a identificar tus tensiones internas, patrones reales de avance, y fortalezas que otros no ven. Luego, el entrenamiento en entrevistas y comunicación te da las herramientas para comunicar esa diferencia de forma natural y creíble.
                </p>
                <p>
                  La diferenciación auténtica viene de autoconocimiento + práctica. Eso es DTC.
                </p>
              </div>
            </details>

            {/* FAQ 5 */}
            <details className="group bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow cursor-pointer">
              <summary className="flex items-center justify-between font-semibold text-lg text-foreground">
                <span>¿Es útil si ya tengo experiencia o es solo para junior?</span>
                <svg className="w-6 h-6 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                </svg>
              </summary>
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-foreground/80 text-sm leading-relaxed space-y-2">
                <p>
                  Es especialmente útil para gente con experiencia. A veces después de años en el mercado, la claridad puede nublarse.
                </p>
                <p>
                  Personas con experiencia se benefician de reenfocarse, entender qué quieren realmente, identificar si están en el rol correcto, y desarrollar criterio más profundo sobre su carrera. DTC es perfecto para eso.
                </p>
                <p>
                  Si tienes experiencia pero sientes que hay algo desordenado o desalineado, este es tu momento.
                </p>
              </div>
            </details>
          </div>
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
