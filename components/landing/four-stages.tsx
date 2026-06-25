'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

const TEAL = 'rgb(80, 160, 170)'

const STAGES = [
  {
    number: '01',
    name: 'El Ritual',
    subtitle: 'Diagnóstico profundo',
    desc: 'Tests científicos (Big Five, DISC, MBTI, IE, RIASEC) para entender cómo funciona tu mente, qué te energiza y qué patrones te frenan.',
    weeks: 'Semana 1–2',
    color: 'rgb(168, 85, 247)',
  },
  {
    number: '02',
    name: 'Exploración',
    subtitle: 'Tu ruta de 90 días',
    desc: 'Diseñamos juntos tu ruta personalizada basada en tu perfil real. No en lo que debería gustarte. En lo que realmente eres.',
    weeks: 'Semana 3–4',
    color: TEAL,
  },
  {
    number: '03',
    name: 'Entrenamiento',
    subtitle: 'Práctica intensiva',
    desc: 'Simulaciones de entrevista con video, feedback en tiempo real de Vera, y práctica de las skills exactas que te faltan para el rol que quieres.',
    weeks: 'Semana 5–8',
    color: 'rgb(100, 180, 220)',
  },
  {
    number: '04',
    name: 'La Realidad',
    subtitle: 'Ejecución y lanzamiento',
    desc: 'CV ATS armado, portfolio profesional, radar del mercado chileno y Vera 24/7 para acompañarte mientras ejecutas.',
    weeks: 'Semana 9–12',
    color: 'rgb(80, 200, 160)',
  },
]

export default function FourStages() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    if (rect.top >= window.innerHeight) setVisible(false)
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); obs.disconnect() }
      },
      { threshold: 0.05, rootMargin: '0px 0px -60px 0px' }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section className="relative py-24 border-t border-white/[0.06]" id="como-funciona">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: TEAL }}
          >
            El programa
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight text-balance">
            90 días. 4 etapas. Una transformación.
          </h2>
          <p className="mt-4 text-base text-white/50 leading-relaxed">
            Cada etapa construye sobre la anterior. No es un curso. Es un proceso diseñado para producir claridad real.
          </p>
        </div>

        {/* Stages */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {STAGES.map((stage, idx) => (
            <div
              key={idx}
              className="group relative p-7 rounded-2xl border bg-white/[0.02] overflow-hidden transition-all duration-500 hover:bg-white/[0.04]"
              style={{
                borderColor: `${stage.color}25`,
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(28px)',
                transition: `opacity 0.6s ease ${idx * 0.12}s, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${idx * 0.12}s, background-color 0.3s`,
              }}
            >
              {/* hover glow */}
              <div
                className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: `radial-gradient(400px circle at 0% 0%, ${stage.color}10, transparent 60%)`,
                }}
              />

              <div className="relative">
                {/* Number + Week badge */}
                <div className="flex items-start justify-between mb-5">
                  <span
                    className="text-5xl font-bold leading-none opacity-20"
                    style={{ color: stage.color }}
                  >
                    {stage.number}
                  </span>
                  <span
                    className="text-xs font-medium rounded-full px-3 py-1"
                    style={{
                      color: stage.color,
                      backgroundColor: `${stage.color}15`,
                      border: `1px solid ${stage.color}30`,
                    }}
                  >
                    {stage.weeks}
                  </span>
                </div>

                <h3
                  className="text-xl font-bold mb-1"
                  style={{ color: stage.color }}
                >
                  {stage.name}
                </h3>
                <p className="text-sm font-semibold text-white/70 mb-3 uppercase tracking-wide">
                  {stage.subtitle}
                </p>
                <p className="text-sm text-white/50 leading-relaxed">{stage.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Link
            href="/auth/signin"
            className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-semibold text-black transition-all hover:opacity-90 hover:scale-[1.02]"
            style={{ backgroundColor: TEAL }}
          >
            Comenzar mi diagnóstico gratis
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
