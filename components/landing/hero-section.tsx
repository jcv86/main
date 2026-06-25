'use client'

import Link from 'next/link'
import { ArrowRight, Play } from 'lucide-react'
import VeraCircularDiagram from '@/components/vera-circular-diagram'

const TEAL = '#50a0aa'

const STATS = [
  { value: '90', unit: 'días', label: 'Programa estructurado' },
  { value: '4', unit: 'etapas', label: 'Sistema completo' },
  { value: '24/7', unit: '', label: 'Vera, tu coach IA' },
  { value: '9/10', unit: '', label: 'Continúan después de semana 1' },
]

export default function HeroSection() {
  return (
    <>
      <style>{`
        @keyframes heroFadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes heroFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes heroScaleIn {
          from { opacity: 0; transform: scale(0.95); }
          to   { opacity: 1; transform: scale(1); }
        }
        .hero-badge    { animation: heroFadeUp 0.6s ease 0.1s both; }
        .hero-h1       { animation: heroFadeUp 0.7s ease 0.2s both; }
        .hero-sub      { animation: heroFadeUp 0.7s ease 0.35s both; }
        .hero-ctas     { animation: heroFadeUp 0.7s ease 0.45s both; }
        .hero-trust    { animation: heroFadeIn 0.6s ease 0.6s both; }
        .hero-stats    { animation: heroFadeUp 0.7s ease 0.55s both; }
        .hero-diagram  { animation: heroScaleIn 1s ease 0.3s both; }
      `}</style>

      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden" style={{ paddingTop: '72px' }}>
        {/* Ambient background glows */}
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div
            className="absolute left-1/4 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[150px]"
            style={{ backgroundColor: TEAL, opacity: 0.06 }}
          />
          <div
            className="absolute right-1/4 top-1/2 w-[400px] h-[400px] rounded-full blur-[120px]"
            style={{ backgroundColor: '#a78bfa', opacity: 0.04 }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-12 md:py-20">
          {/* Two-column layout */}
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

            {/* LEFT: Copy */}
            <div className="flex flex-col">
              {/* Badge */}
              <div
                className="hero-badge inline-flex self-start items-center gap-2 rounded-full border px-4 py-1.5 mb-8 text-xs font-semibold uppercase tracking-wider"
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
                className="hero-h1 font-sans font-bold leading-[0.95] tracking-tight text-white mb-6 text-balance"
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
              <p className="hero-sub max-w-xl text-lg text-white/60 leading-relaxed mb-10">
                Un sistema AI-first que parte desde ti, no desde la vacante. En 90 días estructurados, descubrirás quién eres profesionalmente, qué roles casan contigo, y qué sigue.
              </p>

              {/* CTA buttons */}
              <div className="hero-ctas flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
                <Link
                  href="/auth/signin"
                  className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold text-black transition-all hover:opacity-90 hover:scale-[1.02]"
                  style={{
                    backgroundColor: TEAL,
                    boxShadow: `0 0 28px ${TEAL}50`,
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
              <p className="hero-trust text-xs text-white/35 mb-12">
                Sin tarjeta de crédito · 7 días de garantía · Cancela cuando quieras
              </p>

              {/* Stats strip */}
              <div
                className="hero-stats grid grid-cols-2 gap-px rounded-2xl overflow-hidden"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
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
            <div className="hero-diagram hidden lg:flex items-center justify-center">
              <div
                className="relative rounded-3xl p-6 flex items-center justify-center"
                style={{
                  background: 'linear-gradient(145deg, #0f1014, #0a0c10)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  boxShadow: `0 0 80px ${TEAL}10, 0 40px 100px rgba(0,0,0,0.6)`,
                }}
              >
                <VeraCircularDiagram />
              </div>
            </div>

          </div>
        </div>
      </section>
    </>
  )
}
