"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Brain,
  Target,
  Lightbulb,
  Zap,
  ArrowRight,
  ChevronRight,
} from "lucide-react"

export default function LandingPageOptimized() {
  return (
    <div className="min-h-screen bg-background">
      {/* HERO SECTION */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 bg-clip-text text-transparent leading-tight">
            Entiende cómo funcionas.<br />Ordena tu camino.<br />Avanza con más claridad.
          </h1>
          <p className="text-xl md:text-2xl text-foreground/70 mb-12 max-w-3xl mx-auto leading-relaxed">
            DTC te ayuda a descubrir quién eres realmente, a ordenar tus tensiones internas y a construir una ruta clara de 90 días con coaching IA personalizado.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
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
            {/* Reporte Profundo */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-4 flex-shrink-0">
                <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
                </svg>
              </div>
              <h3 className="font-semibold text-sm font-bold mb-2">Reporte Profundo</h3>
              <p className="text-xs text-foreground/70">Diagnóstico integral de quién eres: tu perfil, tensiones internas, patrones reales y cómo el mercado te ve.</p>
            </div>

            {/* Ruta Personalizada */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-4 flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h3 className="font-semibold text-sm font-bold mb-2">Ruta Personalizada</h3>
              <p className="text-xs text-foreground/70">90 días estructurados con sprints semanales, checkpoints medibles y ajustes basados en tu progreso real.</p>
            </div>

            {/* Entrenamiento Práctico */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mb-4 flex-shrink-0">
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
                </svg>
              </div>
              <h3 className="font-semibold text-sm font-bold mb-2">Entrenamiento Práctico</h3>
              <p className="text-xs text-foreground/70">Simula entrevistas, practica comunicación, negocia en escenarios reales. Feedback inmediato, no teoría.</p>
            </div>

            {/* Coach con IA */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center mb-4 flex-shrink-0">
                <svg className="w-6 h-6 text-cyan-600 dark:text-cyan-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
              </div>
              <h3 className="font-semibold text-sm font-bold mb-2">Coach con IA</h3>
              <p className="text-xs text-foreground/70">Disponible 24/7. Retroalimentación personalizada, ajustes a tu ritmo, y acompañamiento en momentos clave.</p>
            </div>
          </div>
        </div>
      </section>

      {/* THE PROBLEM SECTION */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            El Problema
          </h2>
          <p className="text-lg text-center text-foreground/70 mb-12 max-w-2xl mx-auto">
            Si tienes talento pero te sientes estancado, desorganizado o sin dirección clara, reconocerás algunos de estos puntos.
          </p>

          <div className="grid grid-cols-1 gap-4">
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

      {/* HOW IT WORKS 60 SECONDS */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-900/20 rounded-3xl my-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Cómo funciona en 60 segundos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600 dark:text-purple-400">01</span>
              </div>
              <h3 className="font-bold text-xl mb-2 text-center">Te entiendes</h3>
              <p className="text-foreground/75 text-center text-sm leading-relaxed">
                Diagnóstico profundo de quién eres, qué haces bien y tus patrones. El autoconocimiento es el primer paso.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">02</span>
              </div>
              <h3 className="font-bold text-xl mb-2 text-center">Ordenas tu camino</h3>
              <p className="text-foreground/75 text-center text-sm leading-relaxed">
                Ruta personalizada de 90 días. De la claridad emerge la dirección. Sabes exactamente hacia dónde ir.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">03</span>
              </div>
              <h3 className="font-bold text-xl mb-2 text-center">Practicas y mejoras</h3>
              <p className="text-foreground/75 text-center text-sm leading-relaxed">
                Entrenamiento guiado en habilidades clave con feedback real. Crecer practicando de manera efectiva.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DIFERENCIADORES */}
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
                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
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
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
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
                <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
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
                <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-cyan-600 dark:text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
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
                <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
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
                <div className="w-12 h-12 bg-pink-100 dark:bg-pink-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-pink-600 dark:text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
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

      {/* PARA TI SI */}
      <section className="container mx-auto px-4 py-20 bg-slate-50 dark:bg-slate-900/50 rounded-3xl">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            DTC es para ti si...
          </h2>
          <p className="text-lg text-center text-foreground/70 mb-12 max-w-2xl mx-auto">
            Reconoce tu situación y descubre si este es tu camino.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border-l-4 border-purple-500 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Te sientes estancado
              </h3>
              <p className="text-foreground/70 text-sm">
                Hace tiempo que no avanzas de verdad. Hay talento pero sin dirección clara. Necesitas un impulso estructurado.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border-l-4 border-blue-500 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Estás en transición
              </h3>
              <p className="text-foreground/70 text-sm">
                Cambio de área, empresa o carrera. Necesitas entender si el nuevo camino es el correcto.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border-l-4 border-green-500 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Quieres reenfocarte
              </h3>
              <p className="text-foreground/70 text-sm">
                Ya tienes experiencia pero sientes que no estás en el lugar correcto. Buscas realinearte.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border-l-4 border-cyan-500 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-cyan-600 dark:text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Necesitas estructura
              </h3>
              <p className="text-foreground/70 text-sm">
                Tienes ideas pero no sabes por dónde empezar. Necesitas un plan claro y guía.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border-l-4 border-orange-500 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-orange-600 dark:text-orange-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Quieres entrenar entrevistas
              </h3>
              <p className="text-foreground/70 text-sm">
                Buscas trabajo o quieres estar mejor preparado. Necesitas práctica con feedback real.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border-l-4 border-pink-500 hover:shadow-lg transition-shadow">
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <svg className="w-5 h-5 text-pink-600 dark:text-pink-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
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

      {/* FAQ ESTRATÉGICO */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4">
            Preguntas frecuentes
          </h2>
          <p className="text-lg text-center text-foreground/70 mb-12 max-w-2xl mx-auto">
            Resolvemos las dudas más comunes para que tomes la mejor decisión.
          </p>

          <div className="space-y-4">
            <details className="group bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow cursor-pointer">
              <summary className="flex items-center justify-between font-semibold text-lg text-foreground">
                <span>¿Es DTC un test cualquiera o algo más?</span>
                <ChevronRight className="w-6 h-6 transition-transform group-open:rotate-90" />
              </summary>
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-foreground/80 text-sm space-y-2">
                <p>No es un test cualquiera. DTC es un sistema integral que combina diagnóstico profundo, ruta personalizada, entrenamiento práctico y contexto laboral.</p>
                <p>Mientras otros tests solo dan números o descripciones, DTC interpreta esos datos, construye una ruta, te entrena en habilidades reales y te mantiene conectado al mercado laboral.</p>
                <p>Es más parecido a tener un coach personal con IA que a completar un cuestionario.</p>
              </div>
            </details>

            <details className="group bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow cursor-pointer">
              <summary className="flex items-center justify-between font-semibold text-lg text-foreground">
                <span>¿Qué pasa si estoy estancado? ¿Realmente ayuda?</span>
                <ChevronRight className="w-6 h-6 transition-transform group-open:rotate-90" />
              </summary>
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-foreground/80 text-sm space-y-2">
                <p>La mayoría de personas estancadas no lo están por falta de talento, sino por falta de claridad, dirección y estructura.</p>
                <p>DTC funciona precisamente para eso: te ayuda a entender qué te está frenando realmente, crea una ruta clara de 90 días con hitos medibles, y te entrena en habilidades específicas donde te bloqueas.</p>
                <p>El cambio ocurre cuando el desorden se convierte en dirección, y la comprensión en práctica.</p>
              </div>
            </details>

            <details className="group bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow cursor-pointer">
              <summary className="flex items-center justify-between font-semibold text-lg text-foreground">
                <span>¿Es solo para buscar trabajo o también para crecimiento integral?</span>
                <ChevronRight className="w-6 h-6 transition-transform group-open:rotate-90" />
              </summary>
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-foreground/80 text-sm space-y-2">
                <p>Es para ambas cosas. DTC trabaja tanto la búsqueda de oportunidades laborales como tu desarrollo integral como persona.</p>
                <p>El diagnóstico te ayuda a entender cómo funcionas realmente. La ruta personalizada puede enfocarse en búsqueda activa o en crecimiento interno. El entrenamiento incluye tanto habilidades de mercado como liderazgo personal.</p>
                <p>Tú eliges el foco, pero el sistema está diseñado para que ambos aspectos mejoren.</p>
              </div>
            </details>

            <details className="group bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow cursor-pointer">
              <summary className="flex items-center justify-between font-semibold text-lg text-foreground">
                <span>¿Cómo me diferencio realmente en el mercado?</span>
                <ChevronRight className="w-6 h-6 transition-transform group-open:rotate-90" />
              </summary>
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-foreground/80 text-sm space-y-2">
                <p>La diferenciación viene de dos cosas: entender dónde realmente eres bueno (y dónde no) y saber comunicarlo con claridad.</p>
                <p>DTC te ayuda a identificar tus tensiones internas, patrones reales de avance, y fortalezas que otros no ven. Luego, el entrenamiento en entrevistas y comunicación te da las herramientas para comunicar esa diferencia de forma natural y creíble.</p>
                <p>La diferenciación auténtica viene de autoconocimiento + práctica. Eso es DTC.</p>
              </div>
            </details>

            <details className="group bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow cursor-pointer">
              <summary className="flex items-center justify-between font-semibold text-lg text-foreground">
                <span>¿Es útil si ya tengo experiencia o es solo para junior?</span>
                <ChevronRight className="w-6 h-6 transition-transform group-open:rotate-90" />
              </summary>
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-foreground/80 text-sm space-y-2">
                <p>Es especialmente útil para gente con experiencia. A veces después de años en el mercado, la claridad puede nublarse.</p>
                <p>Personas con experiencia se benefician de reenfocarse, entender qué quieren realmente, identificar si están en el rol correcto, y desarrollar criterio más profundo sobre su carrera. DTC es perfecto para eso.</p>
                <p>Si tienes experiencia pero sientes que hay algo desordenado o desalineado, este es tu momento.</p>
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
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
    </div>
  )
}
