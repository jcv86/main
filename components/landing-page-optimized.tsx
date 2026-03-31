"use client"

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
  return (
    <div className="min-h-screen bg-background">
      {/* HERO SECTION */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent leading-tight">
            Entiende cómo funcionas.<br />Ordena tu camino.<br />Avanza con más claridad.
          </h1>

          <p className="text-xl md:text-2xl text-foreground/80 mb-12 max-w-3xl mx-auto leading-relaxed">
            Tu transformación comienza con autoconocimiento real. DTC te ayuda a entenderte, trazar una ruta clara de 90 días y entrenar las habilidades que necesitas.
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
        </div>
      </section>

      {/* SOCIAL PROOF BAND */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-sm font-semibold text-foreground/60 mb-8 uppercase tracking-wider">Lo que te espera en DTC</p>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="font-semibold text-sm mb-2">Reporte Profundo</h3>
              <p className="text-xs text-foreground/70">Diagnóstico de tu perfil con tensiones internas, patrones y lectura del mercado.</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="font-semibold text-sm mb-2">Ruta Personalizada</h3>
              <p className="text-xs text-foreground/70">90 días estructurados en sprints, checkpoints y revisiones semanales guiadas.</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4">
                <Lightbulb className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-semibold text-sm mb-2">Entrenamiento Práctico</h3>
              <p className="text-xs text-foreground/70">Habilidades clave como entrevistas, comunicación y negociación con feedback real.</p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center mb-4">
                <Zap className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
              </div>
              <h3 className="font-semibold text-sm mb-2">Coach con IA</h3>
              <p className="text-xs text-foreground/70">Retroalimentación continua, disponibilidad 24/7 y adaptación a tu ritmo.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PROBLEM SECTION */}
      <section className="container mx-auto px-4 py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            ¿Te reconoces aquí?
          </h2>
          <p className="text-xl text-center text-foreground/75 mb-12 max-w-2xl mx-auto">
            Muchos no están atrapados por falta de talento. Están atrapados por falta de claridad, estructura y autoconocimiento.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
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

            <div className="flex gap-4 p-6 bg-white dark:bg-slate-800 rounded-xl border border-violet-200 dark:border-violet-900/30 hover:shadow-lg transition-shadow">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-violet-100 dark:bg-violet-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold text-violet-600 dark:text-violet-400">05</span>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Falta de Lectura del Contexto</h3>
                <p className="text-foreground/75">No comprendes bien cómo funciona el mercado laboral ni cómo tu perfil se traduce en oportunidades reales.</p>
              </div>
            </div>

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

      {/* HOW IT WORKS - 60 SECONDS */}
      <section className="container mx-auto px-4 py-16" id="how-it-works">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Cómo funciona en 60 segundos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4">
                1
              </div>
              <h3 className="font-bold text-xl mb-2">Te entiendes</h3>
              <p className="text-foreground/75 text-sm">
                Diagnóstico profundo de quién eres, qué haces bien y tus patrones. El autoconocimiento es el primer paso.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4">
                2
              </div>
              <h3 className="font-bold text-xl mb-2">Ordenas tu avance</h3>
              <p className="text-foreground/75 text-sm">
                Ruta personalizada en 90 días con metas claras, sprints y puntos de control. Avanzar con dirección.
              </p>
            </div>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-600 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-2xl mb-4">
                3
              </div>
              <h3 className="font-bold text-xl mb-2">Practicas y mejoras</h3>
              <p className="text-foreground/75 text-sm">
                Entrenamiento guiado en habilidades clave con feedback real. Crecer practicando de manera efectiva.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DIFFERENTIATORS */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            ¿Por qué DTC es diferente?
          </h2>
          <p className="text-lg text-center text-foreground/70 mb-12 max-w-2xl mx-auto">
            No somos un test cualquiera ni una plataforma genérica. Somos un sistema de interpretación y acompañamiento.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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

      {/* FOR YOU IF */}
      <section className="container mx-auto px-4 py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            DTC es para ti si...
          </h2>
          <p className="text-lg text-center text-foreground/70 mb-12 max-w-2xl mx-auto">
            Reconoce tu situación y descubre si este es tu camino.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border-l-4 border-purple-500">
              <h3 className="font-bold text-lg mb-3">✓ Te sientes estancado</h3>
              <p className="text-foreground/70 text-sm">
                Hace tiempo que no avanzas de verdad. Hay talento pero sin dirección clara. Necesitas un impulso estructurado.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border-l-4 border-blue-500">
              <h3 className="font-bold text-lg mb-3">✓ Estás en transición</h3>
              <p className="text-foreground/70 text-sm">
                Cambio de área, empresa o carrera. Necesitas entender si el nuevo camino es el correcto.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border-l-4 border-green-500">
              <h3 className="font-bold text-lg mb-3">✓ Quieres reenfocarte</h3>
              <p className="text-foreground/70 text-sm">
                Ya tienes experiencia pero sientes que no estás en el lugar correcto. Buscas realinearte.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border-l-4 border-cyan-500">
              <h3 className="font-bold text-lg mb-3">✓ Necesitas estructura</h3>
              <p className="text-foreground/70 text-sm">
                Tienes ideas pero no sabes por dónde empezar. Necesitas un plan claro y guía.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border-l-4 border-orange-500">
              <h3 className="font-bold text-lg mb-3">✓ Quieres entrenar entrevistas</h3>
              <p className="text-foreground/70 text-sm">
                Buscas trabajo o quieres estar mejor preparado. Necesitas práctica con feedback real.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border-l-4 border-pink-500">
              <h3 className="font-bold text-lg mb-3">✓ Buscas avanzar con criterio</h3>
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

      {/* FINAL CTA */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-r from-purple-600/10 to-blue-600/10 dark:from-purple-600/5 dark:to-blue-600/5 rounded-3xl">
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
    </div>
  )
}
