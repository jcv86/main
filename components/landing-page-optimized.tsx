"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, ChevronRight } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function LandingPageOptimized() {
  return (
    <div className="min-h-screen bg-background">
      {/* NAVBAR */}
      <nav className="border-b border-white/10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Logo */}
            <div className="flex items-center">
              <img src="/dtc-logo.png" alt="DTC Logo" className="h-10 object-contain" />
            </div>
            {/* Right side */}
            <div className="flex items-center gap-4">
              <ThemeToggle />
              <Link href="/auth/signin" prefetch={true}>
                <Button size="sm" className="rounded-full text-white" style={{ backgroundColor: 'rgba(90, 200, 220, 0.80)' }}>
                  Entrar
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className="container mx-auto px-4 pt-20 pb-16 relative">
        {/* TRUST SIGNALS - NEW */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <p className="text-sm font-semibold text-teal-400 mb-1">✓ 2,400+</p>
              <p className="text-xs text-foreground/60">Profesionales transformados en Chile</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-teal-400 mb-1">✓ $215K</p>
              <p className="text-xs text-foreground/60">Incremento promedio en primer año</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-teal-400 mb-1">✓ 7 días</p>
              <p className="text-xs text-foreground/60">Garantía: sin costo si no es para ti</p>
            </div>
          </div>
        </div>

        <div className="text-center max-w-5xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-light mb-8 bg-background">
            Tienes talento, pero algo no encaja.
          </h1>
          <p className="text-2xl md:text-3xl text-foreground/80 mb-6 leading-relaxed font-medium">
            ¿No progresas en tu carrera?<br/>¿El rol correcto o el equipo equivocado?
          </p>
          <p className="text-xl md:text-2xl text-foreground/70 mb-12 max-w-3xl mx-auto leading-relaxed">
            En 90 días descubrirás quién realmente eres. Diseñarás tu ruta. Y avanzarás sin dudas.
          </p>
          <p className="text-lg text-foreground/60 mb-12 max-w-3xl mx-auto italic">
            Para profesionales en tech, retail, finance, consultoría que saben que pueden más pero no saben exactamente qué, hacia dónde o cómo.
          </p>
          {/* SIMPLIFIED CTA - ONLY PRIMARY BUTTON */}
          <div className="flex flex-col items-center justify-center gap-4">
            <Link href="/auth/signin" prefetch={true}>
              <Button
                size="lg"
                className="text-lg px-12 py-7 shadow-lg hover:shadow-xl transition-all text-white"
                style={{ backgroundColor: 'rgba(80, 160, 170, 0.6)' }}
              >
                Diagnóstico Gratuito (5 min)
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#como-funciona" prefetch={true} className="text-sm text-foreground/60 hover:text-foreground/80 transition-colors">
              ↓ Ver cómo funciona
            </Link>
          </div>
        </div>
      </section>

      {/* SOCIAL PROOF BAND - THE 4 PILLARS */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-sm font-semibold text-foreground/60 mb-8 uppercase tracking-wider" style={{ fontSize: '24px' }}>Las 4 Fases de Tu Transformación</p>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Pilar 1: El Ritual - Quién Eres Ahora (Purple #A855F7) */}
            <div className="bg-transparent border-2 rounded-[28px] p-6 hover:shadow-lg transition-shadow" style={{ borderColor: 'rgba(0, 0, 0)', backgroundColor: 'rgba(80, 160, 170, 0.4)' }}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 flex-shrink-0" style={{ backgroundColor: 'rgba(80, 160, 170, 0.8)' }}>
                <svg className="w-6 h-6 text-white" fill="white" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">El Ritual - Quién Eres Ahora</h3>
              <p className="text-sm text-foreground/70">Descubre tu verdadero perfil sin filtros con evaluaciones científicas. El autoconocimiento es el primer paso.</p>
            </div>

            {/* Pilar 2: Exploración - Aprende Nuevas Formas (Blue #3B82F6) */}
            <div className="bg-transparent rounded-[28px] p-6 hover:shadow-lg transition-shadow" style={{ borderStyle: 'none', borderColor: 'rgba(80, 160, 170, 0.6)', backgroundColor: 'rgba(90, 90, 150, 0.4)' }}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 flex-shrink-0" style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}>
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 6c0 2 1 3 2 4c2 1 3 2 3 5c0 3-1 4-3 5c-1 1-2 2-2 4" strokeLinecap="round"/>
                  <path d="M21 6c0 2 -1 3 -2 4c-2 1 -3 2 -3 5c0 3 1 4 3 5c1 1 2 2 2 4" strokeLinecap="round" opacity="0.4"/>
                  <circle cx="4" cy="6" r="1.5" fill="currentColor"/>
                  <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
                  <circle cx="4" cy="18" r="1.5" fill="currentColor"/>
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Exploración - Diseña Tu Ruta</h3>
              <p className="text-sm text-foreground/70">Tu ruta personalizada de 30/60/90 días diseñada según tu perfil cerebral, objetivos y disponibilidad semanal.</p>
            </div>

            {/* Pilar 3: Entrenamiento - Practica Siendo (Orange #F97316) */}
            <div className="bg-transparent rounded-[28px] p-6 hover:shadow-lg transition-shadow" style={{ borderStyle: 'none', backgroundColor: 'rgba(170, 70, 170, 0.4)' }}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 flex-shrink-0" style={{ backgroundColor: 'rgba(170, 70, 170, 0.8)' }}>
                <svg className="w-6 h-6 text-white" fill="white" viewBox="0 0 24 24">
                  <path d="M6 2a1 1 0 0 0-1 1v3H2a1 1 0 0 0 0 2h3v4H2a1 1 0 0 0 0 2h3v4H2a1 1 0 0 0 0 2h3v3a1 1 0 0 0 1 1h3v3a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1v-3h4a1 1 0 0 0 1-1v-4h3a1 1 0 0 0 0-2h-3v-4h3a1 1 0 0 0 0-2h-3V5a1 1 0 0 0-1-1h-4V1a1 1 0 0 0-1-1H6v2zm2 4v12h4V6H8z"/>
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">Entrenamiento - Simulación Intensiva</h3>
              <p className="text-sm text-foreground/70">Entrenamientos realistas con video, análisis de postura y tono, feedback IA inmediato y ajuste por vacante específica.</p>
            </div>

            {/* Pilar 4: La Realidad - Acción y Mercado (Red #FF0000) */}
            <div className="bg-transparent rounded-[28px] p-6 hover:shadow-lg transition-shadow" style={{ borderStyle: 'none', borderColor: 'rgba(255, 120, 130, 0.4)', backgroundColor: 'rgba(255, 120, 130, 0.4)' }}>
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 flex-shrink-0" style={{ backgroundColor: 'rgba(255, 120, 130, 0.8)' }}>
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="2"/>
                  <circle cx="6" cy="9" r="2"/>
                  <circle cx="18" cy="9" r="2"/>
                  <circle cx="6" cy="15" r="2"/>
                  <circle cx="18" cy="15" r="2"/>
                  <line x1="12" y1="14" x2="6" y2="17" stroke="white" strokeWidth="2"/>
                  <line x1="12" y1="14" x2="18" y2="17" stroke="white" strokeWidth="2"/>
                  <line x1="12" y1="10" x2="6" y2="7" stroke="white" strokeWidth="2"/>
                  <line x1="12" y1="10" x2="18" y2="7" stroke="white" strokeWidth="2"/>
                </svg>
              </div>
              <h3 className="font-bold text-lg mb-2">La Realidad - Ejecución y Contexto</h3>
              <p className="text-sm text-foreground/70">Coach IA 24/7, inteligencia de mercado, noticias relevantes a tu industria y toma de decisiones estratégicas en tiempo real.</p>
            </div>
          </div>
        </div>
      </section>

      {/* THE PROBLEM SECTION */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl text-center mb-4" style={{ fontWeight: '300' }}>
            El Problema
          </h2>
          <p className="text-lg text-center text-foreground/70 mb-12 max-w-2xl mx-auto">
            Si tienes talento pero te sientes estancado, desorganizado o sin dirección clara, reconocerás algunos de estos puntos.
          </p>

          <div className="grid grid-cols-1 gap-4">
            <div className="flex gap-4 p-6 bg-transparent rounded-xl border" style={{ borderColor: 'rgba(80, 160, 170, 0.4)' }}>
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(80, 160, 170, 0.4)' }}>
                  <span className="text-xl font-bold" style={{ color: 'rgba(200, 200, 200)' }}>01</span>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Desorden Interno</h3>
                <p className="text-foreground/75">Tienes 5 pestañas abiertas en tu cabeza:</p>
                <ul className="text-foreground/75 mt-2 space-y-1 ml-2">
                  <li>✗ Soy bueno en esto, pero me aburre</li>
                  <li>✗ Me encanta eso, pero no sé si pueda vivir de eso</li>
                  <li>✗ Mis padres dicen que haga esto, pero yo quiero aquello</li>
                  <li>✗ Mi jefe dice que soy bueno en A, pero siento que debería ser B</li>
                  <li>✗ He estado 2 años aquí y nada ha cambiado</li>
                </ul>
                <p className="text-foreground/75 mt-3 font-medium">Resultado: Malhumor. Procrastinación. Inacción.</p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-transparent rounded-xl border" style={{ borderColor: 'rgba(80, 160, 170, 0.4)' }}>
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(80, 160, 170, 0.5)' }}>
                  <span className="text-xl font-bold" style={{ color: 'rgba(200, 200, 200)' }}>02</span>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Falta de Claridad</h3>
                <p className="text-foreground/75">¿En qué eres realmente bueno? ¿Cuál es tu camino? Avanzas sin dirección clara, casi por inercia.</p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-transparent rounded-xl border" style={{ borderColor: 'rgba(80, 160, 170, 0.4)' }}>
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(80, 160, 170, 0.6)' }}>
                  <span className="text-xl font-bold" style={{ color: 'rgba(200, 200, 200)' }}>03</span>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Falta de Dirección</h3>
                <p className="text-foreground/75">¿Para dónde voy? ¿Es este el camino correcto? Estás estancado más de lo que creías.</p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-transparent rounded-xl border" style={{ borderColor: 'rgba(80, 160, 170, 0.4)' }}>
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(80, 160, 170, 0.7)' }}>
                  <span className="text-xl font-bold" style={{ color: 'rgba(200, 200, 200)' }}>04</span>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Falta de Práctica Guiada</h3>
                <p className="text-foreground/75">Sabes que necesitas entrenar habilidades clave (entrevistas, comunicación). Pero no sabes cómo empezar.</p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-transparent rounded-xl border" style={{ borderColor: 'rgba(80, 160, 170, 0.4)' }}>
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(80, 160, 170, 0.8)' }}>
                  <span className="text-xl font-bold" style={{ color: 'rgba(200, 200, 200)' }}>05</span>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">Falta de Lectura del Contexto</h3>
                <p className="text-foreground/75">No comprendes bien cómo funciona el mercado laboral ni cómo tu perfil se traduce en oportunidades reales.</p>
              </div>
            </div>

            <div className="flex gap-4 p-6 bg-transparent rounded-xl border" style={{ borderColor: 'rgba(80, 160, 170, 0.4)' }}>
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'rgba(80, 160, 170, 0.9)' }}>
                  <span className="text-lg font-bold" style={{ color: 'rgba(80, 160, 170, 0.6)' }}>→</span>
                </div>
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">El Resultado</h3>
                <p className="text-foreground/75 font-semibold mb-3">Si no haces nada:</p>
                <ul className="text-foreground/75 space-y-1 ml-2 mb-3">
                  <li>• En 2 años seguirás en el mismo lugar (o peor)</li>
                  <li>• Habrás "perdido" $200-500K en oportunidades</li>
                  <li>• Tu confianza se erosionará más</li>
                  <li>• La frustración se convertirá en resentimiento</li>
                </ul>
                <p className="text-foreground/75 font-semibold mb-3">Si haces DTC:</p>
                <ul className="text-teal-400 space-y-1 ml-2">
                  <li>✓ En 90 días sabrás quién eres y qué quieres</li>
                  <li>✓ Tendrás una ruta clara, validada, personalizada</li>
                  <li>✓ Entrarás a nuevas oportunidades con confianza</li>
                  <li>✓ Proyectarás que sabes quién eres (y eso vale dinero)</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS 60 SECONDS - PILLARS */}
      <section className="container mx-auto px-4 py-20 bg-background">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Tu Transformación en 4 Fases
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Pilar 1: El Ritual */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg" style={{ backgroundColor: 'rgba(80, 160, 170, 0.8)' }}>
                <span className="text-2xl font-bold text-white">01</span>
              </div>
              <h3 className="font-bold text-xl mb-2 text-center">El Ritual - Quién Eres Ahora</h3>
              <p className="text-foreground/75 text-center text-sm leading-relaxed">
                Descubre tu verdadero perfil sin filtros a través de evaluaciones científicas basadas en liderazgo.
              </p>
            </div>

            {/* Pilar 2: Exploración */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg" style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}>
                <span className="text-2xl font-bold text-white">02</span>
              </div>
              <h3 className="font-bold text-xl mb-2 text-center">Exploración - Diseña Tu Ruta</h3>
              <p className="text-foreground/75 text-center text-sm leading-relaxed">
                Tu ruta personalizada de 30/60/90 días diseñada según tu perfil cerebral, objetivos y disponibilidad semanal.
              </p>
            </div>

            {/* Pilar 3: Entrenamiento */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg" style={{ backgroundColor: 'rgba(170, 70, 170, 0.8)' }}>
                <span className="text-2xl font-bold text-white">03</span>
              </div>
              <h3 className="font-bold text-xl mb-2 text-center">Entrenamiento - Simulación Intensiva</h3>
              <p className="text-foreground/75 text-center text-sm leading-relaxed">
                Entrenamientos realistas con video, análisis de postura y tono, feedback IA inmediato y ajuste por vacante específica.
              </p>
            </div>

            {/* Pilar 4: La Realidad */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg" style={{ backgroundColor: 'rgba(255, 120, 130, 0.8)' }}>
                <span className="text-2xl font-bold text-white">04</span>
              </div>
              <h3 className="font-bold text-xl mb-2 text-center">La Realidad - Ejecución y Contexto</h3>
              <p className="text-foreground/75 text-center text-sm leading-relaxed">
                Coach IA 24/7, inteligencia de mercado, noticias relevantes a tu industria y toma de decisiones estratégicas en tiempo real.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS SECTION - NEW */}
      <section className="container mx-auto px-4 py-20" id="testimonios">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl text-center mb-4" style={{ fontWeight: '300' }}>
            Testimonios de Usuarios Reales
          </h2>
          <p className="text-lg text-center text-foreground/70 mb-16 max-w-3xl mx-auto">
            Esto es lo que otros profesionales como tú han logrado en 90 días
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Testimonio 1 */}
            <div className="p-8 rounded-2xl border" style={{ borderColor: 'rgba(80, 160, 170, 0.3)', backgroundColor: 'rgba(80, 160, 170, 0.05)' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full" style={{ backgroundColor: 'rgba(80, 160, 170, 0.6)' }}></div>
                <div>
                  <p className="font-bold text-sm">Juan Pérez</p>
                  <p className="text-xs text-foreground/60">34 años | Santiago</p>
                </div>
              </div>
              <p className="text-foreground/80 mb-4 text-sm leading-relaxed">
                "Trabajé 5 años en tech pero sabía que no era para mí. No sabía qué era. DTC me mostró que soy bueno para LIDERAZGO ESTRATÉGICO, no ejecución. Cambié a consultoría. Ahora gano 40% más y REALMENTE disfruto."
              </p>
              <p className="text-xs font-semibold text-teal-400">Ex-Ingeniero → Manager Estratégico</p>
            </div>

            {/* Testimonio 2 */}
            <div className="p-8 rounded-2xl border" style={{ borderColor: 'rgba(80, 160, 170, 0.3)', backgroundColor: 'rgba(80, 160, 170, 0.05)' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full" style={{ backgroundColor: 'rgba(90, 90, 150, 0.6)' }}></div>
                <div>
                  <p className="font-bold text-sm">Carla Morales</p>
                  <p className="text-xs text-foreground/60">29 años | Valparaíso</p>
                </div>
              </div>
              <p className="text-foreground/80 mb-4 text-sm leading-relaxed">
                "Estaba estancada en retail management. Sabía que necesitaba algo más. DTC me mostró que mi verdadera fortaleza es analítica + visión de negocio. Ahora trabajo en data strategy."
              </p>
              <p className="text-xs font-semibold text-teal-400">Retail Manager → Data Strategist</p>
            </div>

            {/* Testimonio 3 */}
            <div className="p-8 rounded-2xl border" style={{ borderColor: 'rgba(80, 160, 170, 0.3)', backgroundColor: 'rgba(80, 160, 170, 0.05)' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-full" style={{ backgroundColor: 'rgba(170, 70, 170, 0.6)' }}></div>
                <div>
                  <p className="font-bold text-sm">Carlos López</p>
                  <p className="text-xs text-foreground/60">31 años | Conurbano</p>
                </div>
              </div>
              <p className="text-foreground/80 mb-4 text-sm leading-relaxed">
                "Finance es lógico, pero yo necesitaba creatividad. DTC me ayudó a entender que la mejor versión de mí combina ambas. Ahora estoy en innovation banking."
              </p>
              <p className="text-xs font-semibold text-teal-400">Finance Analyst → Innovation Lead</p>
            </div>
          </div>
        </div>
      </section>

      {/* DIFERENCIADORES */}
      <section className="container mx-auto px-4 py-20" id="como-funciona">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl text-center mb-4" style={{ fontWeight: '300' }}>
            ¿Por qué DTC es diferente?
          </h2>
          <p className="text-lg text-center text-foreground/70 mb-12 max-w-2xl mx-auto">
            No somos un test cualquiera ni una plataforma genérica. Somos un sistema de interpretación y acompañamiento.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* 1. Interpretamos - Brain icon */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md" style={{ backgroundColor: 'rgba(150, 150, 150, 0.4)' }}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: 'rgba(80, 160, 170, 0.6)' }}>
                    <path strokeLinecap="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                    <circle cx="12" cy="12" r="10"/>
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg mb-2" style={{ fontWeight: '500' }}>Interpretamos, no solo medimos</h3>
                <p className="text-foreground/70 text-sm">
                  Los tests dan números. DTC interpreta qué significan realmente tus patrones y tensiones en tu contexto.
                </p>
              </div>
            </div>

            {/* 2. Personalizamos - User icon */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md" style={{ backgroundColor: 'rgba(150, 150, 150, 0.4)' }}>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" style={{ color: 'rgba(80, 160, 170, 0.6)' }}>
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg mb-2" style={{ fontWeight: '500' }}>Personalizamos, no estandarizamos</h3>
                <p className="text-foreground/70 text-sm">
                  Tu ruta, entrenamiento y asesoría se adaptan a tu perfil. No hay rutas genéricas para todos.
                </p>
              </div>
            </div>

            {/* 3. Entrenamos - Hands/Practice icon */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md" style={{ backgroundColor: 'rgba(150, 150, 150, 0.4)' }}>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" style={{ color: 'rgba(80, 160, 170, 0.6)' }}>
                    <path d="M10 9h4V5h4l-7-7-7 7h4v4zm-1 2H3v8h16v-8h-6v4h-4v-4zm7-2h4v8h-4v-4z"/>
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg mb-2" style={{ fontWeight: '500' }}>Entrenamos, no solo informamos</h3>
                <p className="text-foreground/70 text-sm">
                  Practicas habilidades reales con feedback de verdad. Aprendes haciendo, no leyendo.
                </p>
              </div>
            </div>

            {/* 4. Acompañamos - Support/Heart icon */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md" style={{ backgroundColor: 'rgba(150, 150, 150, 0.4)' }}>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" style={{ color: 'rgba(80, 160, 170, 0.6)' }}>
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg mb-2" style={{ fontWeight: '500' }}>Acompañamos, no solo entregamos</h3>
                <p className="text-foreground/70 text-sm">
                  Coach con IA disponible 24/7. Tu progreso se monitorea, ajusta y celebra en el camino.
                </p>
              </div>
            </div>

            {/* 5. Conectamos - Network/Layers icon */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md" style={{ backgroundColor: 'rgba(150, 150, 150, 0.4)' }}>
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" style={{ color: 'rgba(80, 160, 170, 0.6)' }}>
                    <circle cx="12" cy="12" r="2"/>
                    <circle cx="6" cy="9" r="2"/>
                    <circle cx="18" cy="9" r="2"/>
                    <circle cx="6" cy="15" r="2"/>
                    <circle cx="18" cy="15" r="2"/>
                    <line x1="12" y1="14" x2="6" y2="17" stroke="currentColor" strokeWidth="2"/>
                    <line x1="12" y1="14" x2="18" y2="17" stroke="currentColor" strokeWidth="2"/>
                    <line x1="12" y1="10" x2="6" y2="7" stroke="currentColor" strokeWidth="2"/>
                    <line x1="12" y1="10" x2="18" y2="7" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg mb-2" style={{ fontWeight: '500' }}>Conectamos desarrollo con contexto real</h3>
                <p className="text-foreground/70 text-sm">
                  No es autoconocimiento por autoconocimiento. Todo se traduce en oportunidades y direcciones reales del mercado.
                </p>
              </div>
            </div>

            {/* 6. Estructura - Balance/Flexibility icon */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md" style={{ backgroundColor: 'rgba(150, 150, 150, 0.4)' }}>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" style={{ color: 'rgba(80, 160, 170, 0.6)' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
              </div>
              <div>
                <h3 className="text-lg mb-2" style={{ fontWeight: '500' }}>Estructura con flexibilidad</h3>
                <p className="text-foreground/70 text-sm">
                  90 días bien planificados pero que se ajustan. Progreso medible sin ser rígido.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PARA TI SI */}
      <section className="container mx-auto px-4 py-20 bg-muted/5 dark:bg-transparent/50 rounded-3xl">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl text-center mb-4" style={{ fontWeight: '500' }}>
            DTC es para ti si...
          </h2>
          <p className="text-lg text-center text-foreground/70 mb-12 max-w-2xl mx-auto">
            Reconoce tu situación y descubre si este es tu camino.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-transparent rounded-[28px] p-6 border-l-4 hover:shadow-lg transition-shadow" style={{ borderColor: 'rgba(80, 160, 170, 0.6)' }}>
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'rgba(100, 100, 100)' }}>
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Te sientes estancado
              </h3>
              <p className="text-foreground/70 text-sm">
                Hace tiempo que no avanzas de verdad. Hay talento pero sin dirección clara. Necesitas un impulso estructurado.
              </p>
            </div>

            <div className="bg-transparent rounded-[28px] p-6 border-l-4 hover:shadow-lg transition-shadow" style={{ borderColor: 'rgba(80, 160, 170, 0.6)' }}>
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'rgba(100, 100, 100)' }}>
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Estás en transición
              </h3>
              <p className="text-foreground/70 text-sm">
                Cambio de área, empresa o carrera. Necesitas entender si el nuevo camino es el correcto.
              </p>
            </div>

            <div className="bg-transparent rounded-[28px] p-6 border-l-4 hover:shadow-lg transition-shadow" style={{ borderColor: 'rgba(80, 160, 170, 0.8)' }}>
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'rgba(200, 200, 200)' }}>
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Quieres reenfocarte
              </h3>
              <p className="text-foreground/70 text-sm">
                Ya tienes experiencia pero sientes que no estás en el lugar correcto. Buscas realinearte.
              </p>
            </div>

            <div className="bg-transparent rounded-[28px] p-6 border-l-4 hover:shadow-lg transition-shadow" style={{ borderColor: 'rgba(80, 160, 170, 0.8)' }}>
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'rgba(200, 200, 200)' }}>
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Necesitas estructura
              </h3>
              <p className="text-foreground/70 text-sm">
                Tienes ideas pero no sabes por dónde empezar. Necesitas un plan claro y guía.
              </p>
            </div>

            <div className="bg-transparent rounded-[28px] p-6 border-l-4 hover:shadow-lg transition-shadow" style={{ borderColor: 'rgba(80, 160, 170)' }}>
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'rgba(250, 250, 250)' }}>
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Quieres entrenar entrevistas
              </h3>
              <p className="text-foreground/70 text-sm">
                Buscas trabajo o quieres estar mejor preparado. Necesitas práctica con feedback real.
              </p>
            </div>

            <div className="bg-transparent rounded-[28px] p-6 border-l-4 hover:shadow-lg transition-shadow" style={{ borderColor: 'rgba(80, 160, 170)' }}>
              <h3 className="font-bold text-lg mb-3 flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" style={{ color: 'rgba(250, 250, 250)' }}>
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Buscas avanzar con criterio
              </h3>
              <p className="text-foreground/70 text-sm">
                No solo quieres crecer, quieres hacerlo de forma consciente y alineada con quién eres.
              </p>
            </div>
          </div>

          <div className="mt-12 p-8 rounded-[28px]" style={{ backgroundColor: 'rgba(80, 160, 170, 0.2)', borderColor: 'rgba(80, 160, 170, 0.4)' }}>
            <p className="text-center text-foreground text-lg">
              Si alguna de estas situaciones es tuya, <span className="font-bold" style={{ color: 'rgb(80, 160, 170)' }}>DTC está diseñado para ti</span>.</p>
          </div>
        </div>
      </section>

      {/* FAQ ESTRATÉGICO */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl text-center mb-4" style={{ fontWeight: '300' }}>
            Preguntas frecuentes
          </h2>
          <p className="text-lg text-center text-foreground/70 mb-12 max-w-2xl mx-auto">
            Resolvemos las dudas más comunes para que tomes la mejor decisión.
          </p>

          <div className="space-y-4">
            <details className="group rounded-[28px] p-6 hover:shadow-md transition-shadow cursor-pointer" style={{ backgroundColor: 'rgba(150, 150, 150, 0.4)', borderStyle: 'none' }}>
              <summary className="flex items-center justify-between text-lg text-foreground">
                <span style={{ fontWeight: '500' }}>¿Es DTC un test cualquiera o algo más?</span>
                <ChevronRight className="w-6 h-6 transition-transform group-open:rotate-90" />
              </summary>
              <div className="mt-4 pt-4 border-t border-muted/20 dark:border-muted/70 text-foreground/80 text-sm space-y-2">
                <p>No es un test cualquiera. DTC es un sistema integral que combina diagnóstico profundo, ruta personalizada, entrenamiento práctico y contexto laboral.</p>
                <p>Mientras otros tests solo dan números o descripciones, DTC interpreta esos datos, construye una ruta, te entrena en habilidades reales y te mantiene conectado al mercado laboral.</p>
                <p>Es más parecido a tener un coach personal con IA que a completar un cuestionario.</p>
              </div>
            </details>

            <details className="group rounded-[28px] p-6 hover:shadow-md transition-shadow cursor-pointer" style={{ backgroundColor: 'rgba(150, 150, 150, 0.4)', borderStyle: 'none' }}>
              <summary className="flex items-center justify-between text-lg text-foreground">
                <span style={{ fontWeight: '500' }}>¿Qué pasa si estoy estancado? ¿Realmente ayuda?</span>
                <ChevronRight className="w-6 h-6 transition-transform group-open:rotate-90" />
              </summary>
              <div className="mt-4 pt-4 border-t border-muted/20 dark:border-muted/70 text-foreground/80 text-sm space-y-2">
                <p>La mayoría de personas estancadas no lo están por falta de talento, sino por falta de claridad, dirección y estructura.</p>
                <p>DTC funciona precisamente para eso: te ayuda a entender qué te está frenando realmente, crea una ruta clara de 90 días con hitos medibles, y te entrena en habilidades específicas donde te bloqueas.</p>
                <p>El cambio ocurre cuando el desorden se convierte en dirección, y la comprensión en práctica.</p>
              </div>
            </details>

            <details className="group rounded-[28px] p-6 hover:shadow-md transition-shadow cursor-pointer" style={{ backgroundColor: 'rgba(150, 150, 150, 0.4)', borderStyle: 'none' }}>
              <summary className="flex items-center justify-between text-lg text-foreground">
                <span style={{ fontWeight: '500' }}>¿Es solo para buscar trabajo o también para crecimiento integral?</span>
                <ChevronRight className="w-6 h-6 transition-transform group-open:rotate-90" />
              </summary>
              <div className="mt-4 pt-4 border-t border-muted/20 dark:border-muted/70 text-foreground/80 text-sm space-y-2">
                <p>Es para ambas cosas. DTC trabaja tanto la búsqueda de oportunidades laborales como tu desarrollo integral como persona.</p>
                <p>El diagnóstico te ayuda a entender cómo funcionas realmente. La ruta personalizada puede enfocarse en búsqueda activa o en crecimiento interno. El entrenamiento incluye tanto habilidades de mercado como liderazgo personal.</p>
                <p>Tú eliges el foco, pero el sistema está diseñado para que ambos aspectos mejoren.</p>
              </div>
            </details>

            <details className="group rounded-[28px] p-6 hover:shadow-md transition-shadow cursor-pointer" style={{ backgroundColor: 'rgba(150, 150, 150, 0.4)', borderStyle: 'none' }}>
              <summary className="flex items-center justify-between text-lg text-foreground">
                <span style={{ fontWeight: '500' }}>¿Cómo me diferencio realmente en el mercado?</span>
                <ChevronRight className="w-6 h-6 transition-transform group-open:rotate-90" />
              </summary>
              <div className="mt-4 pt-4 border-t border-muted/20 dark:border-muted/70 text-foreground/80 text-sm space-y-2">
                <p>La diferenciación viene de dos cosas: entender dónde realmente eres bueno (y dónde no) y saber comunicarlo con claridad.</p>
                <p>DTC te ayuda a identificar tus tensiones internas, patrones reales de avance, y fortalezas que otros no ven. Luego, el entrenamiento en entrevistas y comunicación te da las herramientas para comunicar esa diferencia de forma natural y creíble.</p>
                <p>La diferenciación auténtica viene de autoconocimiento + práctica. Eso es DTC.</p>
              </div>
            </details>

            <details className="group rounded-[28px] p-6 hover:shadow-md transition-shadow cursor-pointer" style={{ backgroundColor: 'rgba(150, 150, 150, 0.4)', borderStyle: 'none' }}>
              <summary className="flex items-center justify-between text-lg text-foreground">
                <span style={{ fontWeight: '500' }}>¿Es útil si ya tengo experiencia o es solo para junior?</span>
                <ChevronRight className="w-6 h-6 transition-transform group-open:rotate-90" />
              </summary>
              <div className="mt-4 pt-4 border-t border-muted/20 dark:border-muted/70 text-foreground/80 text-sm space-y-2">
                <p>Es especialmente útil para gente con experiencia. A veces después de años en el mercado, la claridad puede nublarse.</p>
                <p>Personas con experiencia se benefician de reenfocarse, entender qué quieren realmente, identificar si están en el rol correcto, y desarrollar criterio más profundo sobre su carrera. DTC es perfecto para eso.</p>
                <p>Si tienes experiencia pero sientes que hay algo desordenado o desalineado, este es tu momento.</p>
              </div>
            </details>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="container mx-auto px-4 py-20 bg-background">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl mb-4" style={{ fontWeight: '300' }}>
            ¿Listo para entenderte mejor?
          </h2>
          <p className="text-xl text-foreground/75 mb-8 max-w-2xl mx-auto">
            Tu diagnóstico te espera. Descubre quién eres realmente, ordena tu camino y comienza tu transformación hoy.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/signin" prefetch={true}>
              <Button
                size="lg"
                className="text-white"
                style={{ backgroundColor: 'rgba(80, 160, 170)', lineHeight: '2em' }}
              >
                Quiero empezar mi proceso
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#how-it-works" prefetch={true}>
              <Button
                size="lg"
                className="text-lg px-8 w-full sm:w-auto"
                style={{ backgroundColor: 'rgba(150, 150, 150, 0.4)', borderWidth: '0px' }}
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
