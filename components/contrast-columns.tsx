'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, X } from 'lucide-react'

const NO_ES = [
  'Un test que te dice "eres extrovertido" (no, es mucho más profundo)',
  'Una bolsa de empleos (no encontramos trabajo, TE PREPARAMOS para encontrarlo)',
  'Un coach que te dice qué hacer (nosotros clarificamos, vos decides)',
  'Un cursito rápido (son 90 días de trabajo real en tu carrera)',
]

const SI_ES = [
  'Un sistema que te entiende: tu mente, tus miedos, tus fortalezas reales',
  'Un acompañamiento estructurado: diagnóstico → dirección → práctica → contexto',
  'IA + humano: datos que significan algo + intuición que orienta',
  'Garantizado: si no es para ti, devolvemos cada peso en 7 días',
]

export default function ContrastColumns() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="grid md:grid-cols-2 gap-6">
      {/* NO ES */}
      <div className="rounded-2xl border border-red-500/20 bg-red-500/[0.04] p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-red-500/30 bg-red-500/10">
            <X className="h-5 w-5 text-red-400" />
          </div>
          <h3 className="text-xl font-medium text-foreground">No es:</h3>
        </div>
        <ul className="space-y-3">
          {NO_ES.map((item, idx) => (
            <li
              key={idx}
              className="flex gap-3 rounded-xl border border-white/5 bg-white/[0.02] p-3.5 transition-all duration-500"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(12px)',
                transitionDelay: `${idx * 110}ms`,
              }}
            >
              <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-500/15">
                <X className="h-3.5 w-3.5 text-red-400" />
              </span>
              <span className="text-sm leading-relaxed text-foreground/70">{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* SÍ ES */}
      <div
        className="rounded-2xl border p-6 md:p-8"
        style={{
          borderColor: 'rgba(80, 160, 170, 0.25)',
          background: 'rgba(80, 160, 170, 0.05)',
        }}
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-teal-500/30 bg-teal-500/10">
            <Check className="h-5 w-5 text-teal-400" />
          </div>
          <h3 className="text-xl font-medium text-foreground">Sí es:</h3>
        </div>
        <ul className="space-y-3">
          {SI_ES.map((item, idx) => (
            <li
              key={idx}
              className="flex gap-3 rounded-xl border border-teal-500/10 bg-teal-500/[0.04] p-3.5 transition-all duration-500"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(12px)',
                transitionDelay: `${idx * 110 + 220}ms`,
              }}
            >
              <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-teal-500/15">
                <Check className="h-3.5 w-3.5 text-teal-400" />
              </span>
              <span className="text-sm leading-relaxed text-foreground/80">{item}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
