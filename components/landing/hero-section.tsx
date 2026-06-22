'use client'

import Link from 'next/link'
import { ArrowRight, Play } from 'lucide-react'
import { useEffect, useState } from 'react'
import VeraCircularDiagram from '@/components/vera-circular-diagram'

const TEAL = 'rgb(80, 160, 170)'

const STATS = [
  { value: '90', unit: 'días', label: 'Programa estructurado' },
  { value: '4', unit: 'etapas', label: 'Sistema completo' },
  { value: '24/7', unit: '', label: 'Vera, tu coach IA' },
  { value: '9/10', unit: '', label: 'continúan después de semana 1' },
]

export default function HeroSection() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-hidden pt-16">
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div
          className="absolute left-1/4 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px] opacity-[0.06]"
          style={{ backgroundColor: TEAL }}
        />
        <div
          className="absolute right-1/4 top-1/2 translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[130px] opacity-[0.04]"
          style={{ backgroundColor: '#a78bfa' }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

          {/* LEFT: Copy */}
          <div className="flex flex-col">
            {/* Badge */}
            <div
              className={`inline-flex self-start items-center gap-2 rounded-full border px-4 py-1.5 mb-8 text-xs font-semibold uppercase tracking-wider transition-all duration-700 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
              style={{
                borderColor: `${TEAL}40`,
                color: TEAL,
                backgroundColor: `${TEAL}10`,
              }}
            >
              <span
                className="h-1.5 w-1.5 rounded-full animate-pulse"
                style={{ backgroundColor: TEAL }}
              />
              Plataforma AI-first · Chile
            </div>

            {/* Main Headline */}
            <h1
              className={`font-sans font-bold leading-[0.95] tracking-tight text-white mb-6 transition-all duration-700 delay-100 text-balance ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ fontSize: 'clamp(40px, 5.5vw, 80px)' }}
            >
              Tu siguiente versión{' '}
              <span
                style={{
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  backgroundImage: `linear-gradient(135deg, ${TEAL}, #7dd3d8)`,
                }}
              >
                empieza aquí.
              </span>
            </h1>

            {/* Subheadline */}
            <p
              className={`max-w-xl text-lg text-white/60 leading-relaxed mb-10 transition-all duration-700 delay-200 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              Un sistema AI-first que parte desde ti, no desde la vacante. En 90 días estructurados, descubrirás quién eres profesionalmente, qué roles casan contigo, y qué sigue.
            </p>

            {/* CTA buttons */}
            <div
              className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6 transition-all duration-700 delay-300 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
            >
              <Link
                href="/auth/signin"
                className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold text-black transition-all hover:opacity-90 hover:scale-[1.02] hover:shadow-lg"
                style={{
                  backgroundColor: TEAL,
                  boxShadow: `0 0 24px ${TEAL}40`,
                }}
              >
                Comenzar diagnóstico gratis
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/como-funciona"
                className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-medium text-white/80 border border-white/15 hover:border-white/30 hover:text-white transition-all"
              >
                <Play className="h-4 w-4" />
                Ver cómo funciona
              </Link>
            </div>

            {/* Trust line */}
            <p
              className={`text-xs text-white/35 mb-12 transition-all duration-700 delay-400 ${
                mounted ? 'opacity-100' : 'opacity-0'
              }`}
            >
              Sin tarjeta de crédito · 7 días de garantía · Cancela cuando quieras
            </p>

            {/* Stats strip */}
            <div
              className={`grid grid-cols-2 gap-px bg-white/[0.06] rounded-2xl overflow-hidden border border-white/[0.06] transition-all duration-700 delay-500 ${
                mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {STATS.map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-black px-5 py-4 flex flex-col gap-1 hover:bg-white/[0.025] transition-colors"
                >
                  <div className="flex items-baseline gap-1">
                    <span
                      className="text-2xl font-bold leading-none"
                      style={{ color: TEAL }}
                    >
                      {stat.value}
                    </span>
                    {stat.unit && (
                      <span className="text-xs font-semibold text-white/50">{stat.unit}</span>
                    )}
                  </div>
                  <p className="text-[11px] text-white/40 leading-snug">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT: Vera animated diagram */}
          <div
            className={`hidden lg:flex items-center justify-center transition-all duration-1000 delay-300 ${
              mounted ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            <div className="relative">
              {/* Extra ambient glow behind the diagram */}
              <div
                className="absolute inset-0 rounded-full blur-3xl opacity-20"
                style={{
                  background: `radial-gradient(circle, ${TEAL}, transparent 70%)`,
                }}
              />
              <VeraCircularDiagram />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
