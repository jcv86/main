'use client'

import Link from 'next/link'
import { Check, Shield, Sparkles } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

const TEAL = 'rgb(80, 160, 170)'

const PLANS = [
  {
    name: 'Gratuito',
    price: '$0',
    period: '',
    tagline: 'Empieza sin riesgo',
    description: 'Perfecto para explorar la plataforma y completar tu diagnóstico inicial.',
    features: [
      'Diagnóstico completo (30 min)',
      'Perfil Vivo con primeras insights',
      'Acceso 7 días a Vera',
      'Recursos y FAQ',
      'Garantía total',
    ],
    cta: 'Comenzar gratis',
    href: '/auth/signin',
    featured: false,
  },
  {
    name: 'Pro',
    price: '$4.390',
    period: '/mes',
    tagline: 'El programa completo',
    description: 'Todo lo que necesitas para los 90 días de transformación profesional.',
    features: [
      'Acceso completo 90 días',
      'Vera 24/7 — conversaciones ilimitadas',
      'CV ATS builder + portfolio',
      'Ruta personalizada de 90 días',
      'Simulaciones de entrevista con video',
      'Radar del mercado laboral chileno',
      'Templates y recursos premium',
      'Garantía 7 días — sin preguntas',
    ],
    cta: 'Comenzar con Pro',
    href: '/auth/signin',
    featured: true,
  },
]

export default function PricingSection() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); obs.disconnect() }
      },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section className="relative py-24 border-t border-white/[0.06]" id="precios">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: TEAL }}
          >
            Precios
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight text-balance">
            Empieza gratis.
            <br />
            Sube cuando lo necesites.
          </h2>
          <p className="mt-4 text-base text-white/50 leading-relaxed">
            Sin compromisos. Sin tarjeta de crédito para empezar. Cancela cuando quieras.
          </p>
        </div>

        {/* Plans */}
        <div ref={ref} className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {PLANS.map((plan, idx) => (
            <div
              key={plan.name}
              className="relative flex flex-col rounded-2xl overflow-hidden"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(28px)',
                transition: `opacity 0.6s ease ${idx * 150}ms, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${idx * 150}ms`,
              }}
            >
              {/* Featured badge */}
              {plan.featured && (
                <div
                  className="flex items-center justify-center gap-1.5 px-4 py-2 text-xs font-semibold text-black"
                  style={{ backgroundColor: TEAL }}
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  Más popular · Recomendado
                </div>
              )}

              <div
                className={`flex flex-col flex-1 p-8 border ${
                  plan.featured
                    ? 'border-[rgba(80,160,170,0.5)] bg-[rgba(80,160,170,0.05)]'
                    : 'border-white/[0.08] bg-white/[0.025]'
                } ${plan.featured ? '' : 'rounded-2xl'}`}
                style={plan.featured ? { borderTop: 'none', borderRadius: '0 0 1rem 1rem' } : {}}
              >
                {/* Plan name + description */}
                <div className="mb-6">
                  <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                  <p className="text-sm text-white/50">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="flex items-end gap-1 mb-8">
                  <span
                    className="text-5xl font-bold leading-none"
                    style={{ color: plan.featured ? TEAL : 'white' }}
                  >
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-sm text-white/40 mb-1.5">{plan.period}</span>
                  )}
                </div>

                {/* Features */}
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-3 text-sm">
                      <span
                        className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
                        style={{
                          backgroundColor: `${TEAL}20`,
                        }}
                      >
                        <Check className="h-3 w-3" style={{ color: TEAL }} />
                      </span>
                      <span className="text-white/75">{feature}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <Link
                  href={plan.href}
                  className={`inline-flex items-center justify-center rounded-full py-3.5 text-sm font-semibold transition-all hover:scale-[1.02] ${
                    plan.featured
                      ? 'text-black hover:opacity-90'
                      : 'text-white border border-white/20 hover:bg-white/[0.06] hover:border-white/30'
                  }`}
                  style={plan.featured ? { backgroundColor: TEAL } : {}}
                >
                  {plan.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Guarantee note */}
        <div className="flex items-center justify-center gap-3 mt-10 text-sm text-white/40">
          <Shield className="h-4 w-4 flex-shrink-0" style={{ color: TEAL }} />
          <span>
            Garantía 7 días sin preguntas. Si no es para ti, te devolvemos cada peso.
          </span>
        </div>
      </div>
    </section>
  )
}
