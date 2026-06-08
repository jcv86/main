'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight } from 'lucide-react'
import { ThemeToggle } from '@/components/theme-toggle'
import VeraCircularDiagram from '@/components/vera-circular-diagram'
import PerfilVivoInteractive from '@/components/perfil-vivo-interactive'
import ProblemasReveal from '@/components/problemas-reveal'
import NoventaDiasFlow from '@/components/noventa-dias-flow'
import ComparisonTable from '@/components/comparison-table'
import OutcomesGrid from '@/components/outcomes-grid'
import VeraChatLive from '@/components/vera-chat-live'
import ContrastColumns from '@/components/contrast-columns'
import PricingCards from '@/components/pricing-cards'
import FinalCta from '@/components/final-cta'

export default function LandingPageOptimized() {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="font-bold text-2xl">DespegaTuCarrera</div>
          <nav className="flex items-center gap-8">
            <Link href="#" className="text-sm text-foreground/70 hover:text-foreground">Producto</Link>
            <Link href="#" className="text-sm text-foreground/70 hover:text-foreground">Nosotros</Link>
            <Link href="#" className="text-sm text-foreground/70 hover:text-foreground">Contacto</Link>
            <Link href="/auth/signin" prefetch={true}>
              <Button size="sm" className="text-white" style={{ backgroundColor: 'rgba(80, 160, 170, 0.6)' }}>
                Comenzar
              </Button>
            </Link>
          </nav>
        </div>
      </header>

      {/* ===== HERO SECTION ===== */}
      <section className="container mx-auto px-4 py-24 relative">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <p className="text-sm text-teal-400 font-semibold mb-4 uppercase tracking-wider">Plataforma AI-first humana</p>
          <h1 className="text-6xl md:text-7xl font-light mb-8 leading-tight">
            Entiende cómo funcionas. Ordena tu camino. Avanza con más claridad.
          </h1>
          <p className="text-xl text-foreground/70 mb-8 leading-relaxed max-w-3xl mx-auto">
            DTC no es un test. No es una bolsa de empleos. No es un coach suelto. Es un sistema que parte desde ti, no desde la vacante. En 90 días de diagnóstico y acompañamiento IA, descubrirás quién eres profesionalmente, qué roles casan contigo, y qué sigue.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auth/signin" prefetch={true}>
              <Button size="lg" className="text-white px-8 py-6" style={{ backgroundColor: 'rgba(80, 160, 170, 0.7)' }}>
                Quiero comenzar mi diagnóstico
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="px-8 py-6">
              Pruébalo en vivo (demo)
            </Button>
          </div>
        </div>

        {/* STATS SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto mb-16">
          <div className="text-center">
            <p className="text-sm text-foreground/60 mb-2">Diagnóstico en minutos</p>
            <p className="text-lg font-semibold text-teal-400">30 min</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-foreground/60 mb-2">Ruta inicial de 30 días</p>
            <p className="text-lg font-semibold text-cyan-400">Acceso completo</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-foreground/60 mb-2">Sin promesas de empleo rápido</p>
            <p className="text-lg font-semibold text-blue-400">100% honesto</p>
          </div>
          <div className="text-center">
            <p className="text-sm text-foreground/60 mb-2">Garantía 7 días</p>
            <p className="text-lg font-semibold text-purple-400">Sin costo</p>
          </div>
        </div>

        {/* 4 ETAPAS / VERA SECTION */}
        <div className="max-w-5xl mx-auto py-12">
          <p className="text-center text-sm text-foreground/60 mb-8">Tu trayectoria de despegue en 4 etapas</p>
          
          {/* Desktop: Show circular diagram */}
          <div className="hidden md:block mb-12">
            <VeraCircularDiagram />
          </div>

          {/* Mobile: Show grid layout */}
          <div className="md:hidden grid grid-cols-1 gap-4 mb-12">
            {[
              { title: 'Despega Cerebral', desc: 'DIAGNÓSTICO', time: 'Semana 1-2' },
              { title: 'Tu Ruta', desc: 'DIRECCIÓN', time: 'Semana 3-4' },
              { title: 'Entrenamiento', desc: 'PRÁCTICA', time: 'Semana 5-8' },
              { title: 'Radar Estratégico', desc: 'CONTEXTO', time: 'Semana 9-12' }
            ].map((stage, idx) => (
              <div key={idx} className="p-4 rounded-lg border border-white/10 hover:border-teal-400/30 transition-all">
                <p className="text-sm text-teal-400 font-semibold mb-1">{stage.desc}</p>
                <p className="font-medium mb-2">{stage.title}</p>
                <p className="text-xs text-foreground/60">{stage.time}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <p className="text-sm text-foreground/60 mb-4">Con Vera, IA coach 24/7</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto text-center">
              <div className="p-4 rounded-lg bg-black/40 border border-white/10">
                <p className="text-sm font-semibold text-teal-400">4 etapas</p>
              </div>
              <div className="p-4 rounded-lg bg-black/40 border border-white/10">
                <p className="text-sm font-semibold text-cyan-400">30 días</p>
              </div>
              <div className="p-4 rounded-lg bg-black/40 border border-white/10">
                <p className="text-sm font-semibold text-blue-400">24/7 Vera</p>
              </div>
              <div className="p-4 rounded-lg bg-black/40 border border-white/10">
                <p className="text-sm font-semibold text-purple-400">100% desde ti</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== RESPONDE Y MIRA TU PERFIL VIVO ===== */}
      <section className="container mx-auto px-4 py-20 border-t border-white/10" id="como-funciona">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light mb-6 text-center">
            Responde y mira cómo se arma tu Perfil Vivo.
          </h2>
          <p className="text-lg text-center text-foreground/70 mb-16 max-w-3xl mx-auto">
            Esto es lo que hace una plataforma AI-first humana: parte desde ti, no desde la vacante. Cambia tus respuestas y observa cómo se adapta —en tiempo real.
          </p>

          <PerfilVivoInteractive />
        </div>
      </section>

      {/* ===== NUESTRA TESIS ===== */}
      <section className="container mx-auto px-4 py-20 border-t border-white/10" id="nosotros">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-light mb-8">
            No partimos de la vacante. Partimos de ti.
          </h2>
          <p className="text-lg text-foreground/70 leading-relaxed">
            La mayoría de procesos de carrera parten de "¿qué empleos hay?" Esta es la pregunta equivocada. La pregunta correcta es: "¿Quién soy yo profesionalmente? ¿Qué me hace estar en flow? ¿Qué roles casan con esa realidad?" Solo entonces tiene sentido buscar empleos.
          </p>
        </div>
      </section>

      {/* ===== EL PROBLEMA ===== */}
      <section className="container mx-auto px-4 py-20 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light text-center mb-8">
            El problema no es la falta de opciones. Es la falta de claridad.
          </h2>
          <p className="text-lg text-foreground/70 text-center mb-12">
            Hay miles de roles. Pero sin claridad sobre quién eres, todos se ven iguales. O ninguno se ve bien. Así terminas:
          </p>
          <ProblemasReveal />
        </div>
      </section>

      {/* ===== LA SOLUCIÓN ===== */}
      <section className="container mx-auto px-4 py-20 border-t border-white/10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light text-center mb-8">
            DTC parte desde ti, no desde la vacante.
          </h2>
          <p className="text-lg text-foreground/70 text-center mb-12">
            En 90 días estructurados:
          </p>
          <NoventaDiasFlow />
        </div>
      </section>

      {/* ===== COMPARACIÓN ===== */}
      <section className="container mx-auto px-4 py-20 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light text-center mb-12">
            Por qué DTC no se parece a "lo de siempre".
          </h2>
          <ComparisonTable />
        </div>
      </section>

      {/* ===== LO QUE TE LLEVAS ===== */}
      <section className="container mx-auto px-4 py-20 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light text-center mb-8">
            Claridad primero. Resultados, en consecuencia.
          </h2>
          <p className="text-lg text-center text-foreground/70 mb-12">Lo que te llevas después de 90 días</p>
          <OutcomesGrid />
        </div>
      </section>

      {/* ===== VERA + ACOMPAÑAMIENTO ===== */}
      <section className="container mx-auto px-4 py-20 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light text-center mb-12">
            Un acompañamiento que no se apaga.
          </h2>
          <VeraChatLive />
        </div>
      </section>

      {/* ===== NO ES / SÍ ES ===== */}
      <section className="container mx-auto px-4 py-20 border-t border-white/10">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light text-center mb-12">
            No es un test. Ni una bolsa de empleos. Ni un coach suelto.
          </h2>
          <ContrastColumns />
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section className="container mx-auto px-4 py-20 border-t border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-light mb-12">
            Empieza gratis. Sube cuando lo necesites.
          </h2>
          <PricingCards />
        </div>
      </section>

      {/* ===== CTA FINAL ===== */}
      <FinalCta />

      {/* ===== FAQ ===== */}
      <section className="container mx-auto px-4 py-20 border-t border-white/10">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-light text-center mb-12">
            Lo que probablemente estés preguntando.
          </h2>
          <div className="space-y-3">
            {[
              { q: '¿Para quién es DTC exactamente?', a: 'Para profesionales en tech, retail, finance, consultoría que saben que pueden más pero no saben exactamente qué, hacia dónde o cómo. Si tienes 2+ años de experiencia y sientes que estás atascado, DTC es para ti.' },
              { q: '¿Cuánto cuesta realmente?', a: 'Gratuito para diagnóstico + 7 días. Pro es $4,390/mes para acceso 90 días completos con Vera, CV ATS y portfolio builder. Garantía 7 días: sin costo si no es para ti.' },
              { q: '¿Cuánto tiempo toma?', a: '90 días estructurados. Week 1-2: descubrimiento. Week 3-4: dirección. Week 5-8: práctica. Week 9-12: lanzamiento. Pero muchos ven claridad en la primera semana.' },
              { q: '¿Qué pasa si no me gusta?', a: 'Te devolvemos cada peso en 7 días. Sin preguntas. Pero basándose en nuestros datos, 92% de usuarios continúan después de semana 1.' },
              { q: '¿Puedo usarlo si trabajo full time?', a: 'Sí. El diagnóstico toma 30 min/día. Dirección y práctica son parcialmente asincrónico. Mucha gente lo hace en noches/fines de semana.' },
              { q: '¿Es solo para IT?', a: 'No. Hemos ayudado profesionales en retail, finance, consultoría, operaciones, ventas. El principio es el mismo: claridad → ruta → acción.' }
            ].map((item, idx) => (
              <div key={idx}>
                <button
                  onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                  className="w-full text-left p-4 rounded-lg border border-white/10 hover:border-teal-400/30 transition-all flex items-center justify-between"
                >
                  <span className="font-medium">{item.q}</span>
                  <span className="text-teal-400">{expandedFaq === idx ? '−' : '+'}</span>
                </button>
                {expandedFaq === idx && (
                  <div className="p-4 bg-black/40 text-foreground/80 text-sm leading-relaxed">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>


    </main>
  )
}
