'use client'

import { useEffect, useRef, useState } from 'react'
import { Brain, Map, Dumbbell, Target } from 'lucide-react'

const STEPS = [
  {
    icon: Brain,
    title: 'Entiende',
    desc: 'Tu tipo profesional real, tus fortalezas, qué te hace estar en flow',
    phase: 'Semana 1-2',
    accent: '#f472b6',
  },
  {
    icon: Map,
    title: 'Ordena',
    desc: 'Tu ruta clara: próximos pasos, industrias, roles que casan contigo',
    phase: 'Semana 3-4',
    accent: '#38bdf8',
  },
  {
    icon: Dumbbell,
    title: 'Entrena',
    desc: 'Skills específicas, credibilidad, portfolio armado que habla por ti',
    phase: 'Semana 5-8',
    accent: '#a78bfa',
  },
  {
    icon: Target,
    title: 'Contextualiza',
    desc: 'Mercado actual, networks, oportunidades reales en tu contexto',
    phase: 'Semana 9-12',
    accent: '#34d399',
  },
]

export default function NoventaDiasFlow() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(0)

  useEffect(() => {
    const node = ref.current
    if (!node) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          STEPS.forEach((_, i) => {
            setTimeout(() => setVisible((v) => Math.max(v, i + 1)), i * 320)
          })
          observer.disconnect()
        }
      },
      { threshold: 0.35 },
    )
    observer.observe(node)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="relative">
      {/* Connecting progress line (desktop) */}
      <div className="hidden md:block absolute top-7 left-0 right-0 px-[12.5%]">
        <div className="h-0.5 w-full bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-pink-400 via-sky-400 to-emerald-400 transition-all duration-700 ease-out"
            style={{ width: `${(Math.max(visible - 1, 0) / (STEPS.length - 1)) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6 relative">
        {STEPS.map((step, idx) => {
          const Icon = step.icon
          const shown = idx < visible
          return (
            <div
              key={step.title}
              className="flex flex-col items-center text-center transition-all duration-500 ease-out"
              style={{
                opacity: shown ? 1 : 0,
                transform: shown ? 'translateY(0)' : 'translateY(24px)',
              }}
            >
              {/* Icon node */}
              <div className="relative mb-5">
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-500"
                  style={{
                    borderColor: shown ? `${step.accent}66` : 'rgba(255,255,255,0.1)',
                    backgroundColor: shown ? `${step.accent}14` : 'rgba(0,0,0,0.4)',
                    boxShadow: shown ? `0 0 28px ${step.accent}33` : 'none',
                  }}
                >
                  <Icon className="w-6 h-6" style={{ color: step.accent }} />
                </div>
                {/* Step number badge */}
                <span
                  className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold text-[#0a0a0f]"
                  style={{ backgroundColor: step.accent }}
                >
                  {idx + 1}
                </span>
              </div>

              <p
                className="text-[11px] font-semibold tracking-widest mb-1.5"
                style={{ color: step.accent }}
              >
                {step.phase}
              </p>
              <h3 className="font-semibold text-lg mb-2 text-white">{step.title}</h3>
              <p className="text-sm text-foreground/70 leading-relaxed text-balance max-w-[15rem]">
                {step.desc}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
