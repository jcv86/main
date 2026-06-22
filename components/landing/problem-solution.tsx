'use client'

import { useEffect, useRef, useState } from 'react'
import { X, ArrowRight } from 'lucide-react'

const TEAL = 'rgb(80, 160, 170)'

const PROBLEMS = [
  'Mandas CVs al vacío y no recibes respuesta',
  'Sabes que puedes más, pero no sabes exactamente qué',
  'Cambias de trabajo sin cambiar el problema de fondo',
  'Tomas un curso más, pero la confusión no se va',
  'No sabes cómo presentarte en entrevistas con claridad',
  'El mercado pide experiencia que aún no tienes',
]

const SOLUTIONS = [
  'Diagnóstico profundo que revela quién eres realmente',
  'Ruta personalizada de 90 días desde tu perfil real',
  'Vera te acompaña en cada decisión con contexto completo',
  'CV ATS armado que abre puertas en 48 horas',
  'Simulaciones de entrevista con feedback en tiempo real',
  'Radar del mercado laboral para saber dónde enfocarte',
]

export default function ProblemSolution() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) { setVisible(true); obs.disconnect() }
      },
      { threshold: 0.1 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <section className="relative py-24 border-t border-white/[0.06]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: TEAL }}
          >
            El problema y la solución
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight text-balance">
            El problema no es la falta de opciones.
            <br />
            <span className="text-white/50">Es la falta de claridad.</span>
          </h2>
        </div>

        {/* Two columns */}
        <div ref={ref} className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {/* Problems */}
          <div
            className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8"
            style={{
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0)' : 'translateX(-24px)',
              transition: 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.22,1,0.36,1)',
            }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div className="h-6 w-6 rounded-full bg-red-500/20 flex items-center justify-center">
                <X className="h-3.5 w-3.5 text-red-400" />
              </div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white/50">Sin claridad</h3>
            </div>
            <ul className="space-y-4">
              {PROBLEMS.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-sm text-white/55"
                  style={{
                    opacity: visible ? 1 : 0,
                    transition: `opacity 0.5s ease ${idx * 80 + 300}ms`,
                  }}
                >
                  <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-red-400/50" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Arrow separator (desktop) */}
          <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center justify-center pointer-events-none">
            <ArrowRight className="h-6 w-6 text-white/20" />
          </div>

          {/* Solutions */}
          <div
            className="rounded-2xl border p-8"
            style={{
              borderColor: `${TEAL}30`,
              backgroundColor: `${TEAL}06`,
              opacity: visible ? 1 : 0,
              transform: visible ? 'translateX(0)' : 'translateX(24px)',
              transition: 'opacity 0.6s ease 0.15s, transform 0.6s cubic-bezier(0.22,1,0.36,1) 0.15s',
            }}
          >
            <div className="flex items-center gap-2 mb-6">
              <div
                className="h-6 w-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${TEAL}25` }}
              >
                <span className="text-xs font-bold" style={{ color: TEAL }}>✓</span>
              </div>
              <h3 className="text-sm font-semibold uppercase tracking-wide" style={{ color: TEAL }}>
                Con DTC
              </h3>
            </div>
            <ul className="space-y-4">
              {SOLUTIONS.map((item, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-sm text-white/75"
                  style={{
                    opacity: visible ? 1 : 0,
                    transition: `opacity 0.5s ease ${idx * 80 + 450}ms`,
                  }}
                >
                  <span
                    className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full"
                    style={{ backgroundColor: TEAL }}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
