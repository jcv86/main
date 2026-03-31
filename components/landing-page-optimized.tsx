'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  ArrowRight,
  ChevronRight,
} from "lucide-react"

export default function LandingPageOptimized() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-28">
        <div className="text-center max-w-5xl mx-auto">
          <div className="mb-6 inline-block">
            <span className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-semibold">
              Transformación de Liderazgo para Talentos Estancados
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-balance">
            De Talentoso a Impactante en 90 Días
          </h1>
          <p className="text-xl text-foreground/70 mb-8 max-w-2xl mx-auto text-pretty">
            No es sobre mejorar. Es sobre transformarte. Descubre quién eres realmente, construye tu dirección y practica siendo quien quieres ser.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              Comienza Tu Transformación <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Ver Cómo Funciona
            </Button>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF BAND - THE 4 PILLARS */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-sm font-semibold text-foreground/60 mb-8 uppercase tracking-wider">Los 4 Pilares de Tu Transformación</p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Pilar 1: El Ritual - Quién Eres Ahora (Purple) */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-purple-200 dark:border-purple-900/30 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-600 dark:bg-purple-600 rounded-lg flex items-center justify-center mb-4 flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="white" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="white" strokeWidth="2"/>
                  <circle cx="12" cy="9" r="1.5" fill="white"/>
                  <path d="M12 13 Q10 15 14 15" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">El Ritual - Quién Eres Ahora</h3>
              <p className="text-sm text-foreground/70">Descubre tu verdadero perfil sin filtros con evaluaciones científicas. El autoconocimiento es el primer paso.</p>
            </div>

            {/* Pilar 2: Exploración - Aprende Nuevas Formas (Blue) */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-blue-200 dark:border-blue-900/30 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-600 dark:bg-blue-600 rounded-lg flex items-center justify-center mb-4 flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Exploración - Aprende Nuevas Formas</h3>
              <p className="text-sm text-foreground/70">Tu ruta personalizada de 30/60/90 días con 120+ recursos, libros y estrategias reales.</p>
            </div>

            {/* Pilar 3: Entrenamiento - Practica Siendo (Orange) */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-orange-200 dark:border-orange-900/30 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-600 dark:bg-orange-600 rounded-lg flex items-center justify-center mb-4 flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Entrenamiento - Practica Siendo</h3>
              <p className="text-sm text-foreground/70">Entrenamientos de entrevistas con escenarios realistas y feedback personalizado en tiempo real.</p>
            </div>

            {/* Pilar 4: La Realidad - Vive Tu Nueva Identidad (Turquoise) */}
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-cyan-200 dark:border-cyan-900/30 hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-cyan-600 dark:bg-cyan-600 rounded-lg flex items-center justify-center mb-4 flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11 11-4.925 11-11S18.075 1 12 1zm0 20c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9zm3.5-9c0 1.93-1.57 3.5-3.5 3.5S8.5 13.93 8.5 12 10.07 8.5 12 8.5s3.5 1.57 3.5 3.5z"/>
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">La Realidad - Vive Tu Nueva Identidad</h3>
              <p className="text-sm text-foreground/70">Coaching IA 24/7, noticias del mercado y plan de acción para materializar tu transformación.</p>
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
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-lg font-bold text-red-600 dark:text-red-400">•</span>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1">Te sientes estancado a pesar de tu talento</h4>
                <p className="text-foreground/70">Trabajas bien pero no avanzas. Tienes potencial pero no se ve reflejado.</p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-white dark:bg-slate-800 rounded-xl border border-red-200 dark:border-red-900/30 hover:shadow-lg transition-shadow">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-lg font-bold text-red-600 dark:text-red-400">•</span>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1">No sabes quién eres en contexto profesional</h4>
                <p className="text-foreground/70">No entiendes tus fortalezas reales, tus patrones o qué hace diferente.</p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-white dark:bg-slate-800 rounded-xl border border-red-200 dark:border-red-900/30 hover:shadow-lg transition-shadow">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-lg font-bold text-red-600 dark:text-red-400">•</span>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1">Tienes muchas ideas pero sin dirección clara</h4>
                <p className="text-foreground/70">Información fragmentada, sin roadmap estructurado para tu crecimiento.</p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-white dark:bg-slate-800 rounded-xl border border-red-200 dark:border-red-900/30 hover:shadow-lg transition-shadow">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
                  <span className="text-lg font-bold text-red-600 dark:text-red-400">•</span>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-lg mb-1">Necesitas práctica real pero sin contexto</h4>
                <p className="text-foreground/70">Los cursos son genéricos. No practicas lo que realmente necesitas.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS 60 SECONDS - PILLARS */}
      <section className="container mx-auto px-4 py-20 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900/50 dark:to-slate-900/20 rounded-3xl my-16">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Tu Transformación en 3 Momentos
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Pilar 1: El Ritual */}
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-600 dark:bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg" style={{ backgroundColor: '#A855F7' }}>
                <span className="text-2xl font-bold text-white">01</span>
              </div>
              <h3 className="font-bold text-xl mb-2 text-center">El Ritual - Quién Eres Ahora</h3>
              <p className="text-foreground/75 text-center text-sm leading-relaxed">
                Descubre tu verdadero perfil sin filtros a través de evaluaciones científicas basadas en liderazgo.
              </p>
            </div>

            {/* Pilar 2: Exploración */}
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 dark:bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg" style={{ backgroundColor: '#3B82F6' }}>
                <span className="text-2xl font-bold text-white">02</span>
              </div>
              <h3 className="font-bold text-xl mb-2 text-center">Exploración - Aprende Nuevas Formas</h3>
              <p className="text-foreground/75 text-center text-sm leading-relaxed">
                Construye tu ruta personalizada de 30/60/90 días con 120+ recursos y estrategias reales del mercado.
              </p>
            </div>

            {/* Pilar 3: Entrenamiento */}
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-600 dark:bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg" style={{ backgroundColor: '#F97316' }}>
                <span className="text-2xl font-bold text-white">03</span>
              </div>
              <h3 className="font-bold text-xl mb-2 text-center">Entrenamiento - Practica Siendo</h3>
              <p className="text-foreground/75 text-center text-sm leading-relaxed">
                Practícate con entrenamientos realistas, feedback conductual y un coach IA disponible 24/7.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* WHY DTC IS DIFFERENT */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-4">
            ¿Por qué DTC es diferente?
          </h2>
          <p className="text-lg text-center text-foreground/70 mb-12 max-w-2xl mx-auto">
            No somos un test cualquiera ni una plataforma genérica. Somos un sistema de interpretación y acompañamiento.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 1. Interpretamos - Brain icon */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-600 dark:bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/>
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

            {/* 2. Personalizamos - User icon */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-600 dark:bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
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

            {{/* 3. Entrenamos - Hands/Practice icon */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-600 dark:bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 9.5c0 .83-.67 1.5-1.5 1.5S11 13.33 11 12.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5z"/>
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

            {{/* 4. Acompañamos - Support/Heart icon */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-600 dark:bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
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

            {{/* 5. Conectamos - Network/Layers icon */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-600 dark:bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="2"/>
                    <circle cx="6" cy="9" r="2"/>
                    <circle cx="18" cy="9" r="2"/>
                    <circle cx="6" cy="15" r="2"/>
                    <circle cx="18" cy="15" r="2"/>
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

            {/* 6. Estructura - Balance/Flexibility icon */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-blue-600 dark:bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
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

      {/* CTA SECTION */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            ¿Estás Listo para Tu Transformación?
          </h2>
          <p className="text-xl text-foreground/70 mb-8">
            Talento sin dirección es solo potencial. Deja que DTC te ayude a convertirlo en impacto.
          </p>
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
            Comienza Tu Transformación Hoy <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </section>
    </div>
  )
}
