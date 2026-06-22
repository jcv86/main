'use client'

import Link from 'next/link'
import { ArrowRight, Play } from 'lucide-react'
import { useEffect, useState } from 'react'

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
      {/* Subtle background glow */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div
          className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full blur-[120px] opacity-[0.07]"
          style={{ backgroundColor: TEAL }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 md:py-32">
        {/* Badge */}
        <div
          className={`inline-flex items-center gap-2 rounded-full border px-4 py-1.5 mb-8 text-xs font-semibold uppercase tracking-wider transition-all duration-700 ${
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
          className={`max-w-4xl font-sans font-bold leading-[0.95] tracking-tight text-white mb-6 transition-all duration-700 delay-100 text-balance ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
          style={{ fontSize: 'clamp(48px, 7vw, 96px)' }}
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
          className={`max-w-2xl text-lg md:text-xl text-white/60 leading-relaxed mb-10 transition-all duration-700 delay-200 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          Un sistema AI-first que parte desde ti, no desde la vacante. En 90 días estructurados, descubrirás quién eres profesionalmente, qué roles casan contigo, y qué sigue.
        </p>

        {/* CTA buttons */}
        <div
          className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-16 transition-all duration-700 delay-300 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold text-black transition-all hover:opacity-90 hover:scale-[1.02] hover:shadow-lg"
            style={{
              backgroundColor: TEAL,
              boxShadow: `0 0 0 0 ${TEAL}`,
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

        {/* Social proof note */}
        <p
          className={`text-xs text-white/35 mb-16 transition-all duration-700 delay-400 ${
            mounted ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Sin tarjeta de crédito · 7 días de garantía · Cancela cuando quieras
        </p>

        {/* Stats strip */}
        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-px bg-white/[0.06] rounded-2xl overflow-hidden border border-white/[0.06] transition-all duration-700 delay-500 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          {STATS.map((stat, idx) => (
            <div
              key={idx}
              className="bg-black px-6 py-5 flex flex-col gap-1 hover:bg-white/[0.025] transition-colors"
            >
              <div className="flex items-baseline gap-1">
                <span
                  className="text-3xl font-bold leading-none"
                  style={{ color: TEAL }}
                >
                  {stat.value}
                </span>
                {stat.unit && (
                  <span className="text-sm font-semibold text-white/50">{stat.unit}</span>
                )}
              </div>
              <p className="text-xs text-white/40 leading-snug">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
