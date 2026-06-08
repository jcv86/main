'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Sparkles } from 'lucide-react'

type Plan = {
  name: string
  price: string
  period?: string
  tagline: string
  features: string[]
  featured: boolean
  note?: string
}

const plans: Plan[] = [
  {
    name: 'Gratuito',
    price: '$0',
    tagline: 'Para comenzar sin riesgo',
    features: [
      'Diagnóstico inicial (30 min)',
      'Perfil vivo (primeras insights)',
      'Acceso 7 días a Vera',
      'FAQ + recursos',
    ],
    featured: false,
    note: 'Perfectamente válido para muchos',
  },
  {
    name: 'Pro',
    price: '$4,390',
    period: '/mes',
    tagline: 'Todo lo que necesitas para los 90 días',
    features: [
      'Acceso 90 días completos',
      'Vera 24/7 + ilimitado',
      'CV ATS builder + portfolio',
      'Ruta personalizada',
      'Recursos + templates',
      '7 días garantía (sin costo)',
    ],
    featured: true,
  },
]

export default function PricingCards() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
      {plans.map((plan, idx) => (
        <div
          key={plan.name}
          className={`relative flex flex-col text-left rounded-2xl p-8 transition-all duration-700 ${
            plan.featured
              ? 'border-2 bg-teal-500/[0.07]'
              : 'border border-white/10 bg-white/[0.02] hover:border-white/20'
          }`}
          style={{
            borderColor: plan.featured ? 'rgba(80, 160, 170, 0.55)' : undefined,
            boxShadow: plan.featured && visible ? '0 0 40px -12px rgba(80, 160, 170, 0.35)' : undefined,
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transitionDelay: `${idx * 120}ms`,
          }}
        >
          {plan.featured && (
            <div
              className="absolute -top-3 right-6 flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-white"
              style={{ backgroundColor: 'rgba(80, 160, 170, 0.9)' }}
            >
              <Sparkles className="h-3.5 w-3.5" />
              Recomendado
            </div>
          )}

          <div className="mb-6">
            <p className="text-xl font-semibold mb-1">{plan.name}</p>
            <p className="text-sm text-foreground/55">{plan.tagline}</p>
          </div>

          <div className="mb-6 flex items-end gap-1">
            <span className={`text-4xl font-bold ${plan.featured ? 'text-teal-400' : 'text-foreground'}`}>
              {plan.price}
            </span>
            {plan.period && <span className="text-foreground/50 mb-1">{plan.period}</span>}
          </div>

          <ul className="space-y-3 mb-8 flex-1">
            {plan.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3 text-sm">
                <span
                  className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full"
                  style={{ backgroundColor: 'rgba(80, 160, 170, 0.15)' }}
                >
                  <Check className="h-3 w-3 text-teal-400" />
                </span>
                <span className="text-foreground/80">{feature}</span>
              </li>
            ))}
          </ul>

          {plan.note && (
            <p className="mt-4 text-center text-xs text-foreground/45">{plan.note}</p>
          )}
        </div>
      ))}
    </div>
  )
}
