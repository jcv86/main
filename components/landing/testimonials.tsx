'use client'

import { useEffect, useRef, useState } from 'react'

const TEAL = 'rgb(80, 160, 170)'

const TESTIMONIALS = [
  {
    quote: 'Después de 8 años en retail decidí cambiar de industria. DTC me ayudó a entender que mis skills eran más transferibles de lo que pensaba. En 3 meses conseguí un rol en tech.',
    name: 'Camila R.',
    role: 'Ex-Gerente Retail → Product Manager',
    initials: 'CR',
    color: TEAL,
  },
  {
    quote: 'Vera es increíble. La usé para prepararme para mis entrevistas finales y me dio feedback que ningún amigo pudo darme. Pasé todas las etapas del proceso.',
    name: 'Matías V.',
    role: 'Ingeniero Civil → Senior Software Engineer',
    initials: 'MV',
    color: 'rgb(100, 160, 220)',
  },
  {
    quote: 'Lo que más me sorprendió fue el diagnóstico. Creía que me conocía pero el Perfil Vivo reveló patrones que nunca había conectado. Cambió cómo me presento.',
    name: 'Daniela M.',
    role: 'Consultora → Head of Strategy',
    initials: 'DM',
    color: 'rgb(168, 85, 247)',
  },
  {
    quote: 'El CV ATS builder me ahorró semanas de frustración. Antes mandaba aplicaciones al vacío. Después de DTC empecé a recibir respuestas en 48 horas.',
    name: 'Felipe A.',
    role: 'Finance → Fintech Operations Lead',
    initials: 'FA',
    color: 'rgb(80, 200, 160)',
  },
  {
    quote: 'Pensé que era otro curso más. Me equivoqué. DTC parte desde quién eres, no desde lo que el mercado quiere. Eso cambia todo. Claridad real desde semana 2.',
    name: 'Valentina C.',
    role: 'Marketing → Brand Director',
    initials: 'VC',
    color: 'rgb(220, 160, 80)',
  },
  {
    quote: 'El Radar Estratégico del mercado chileno fue oro puro. Saber exactamente qué roles están creciendo y cuáles están contrayéndose me ayudó a decidir en dónde enfocarme.',
    name: 'Rodrigo P.',
    role: 'Operaciones → Supply Chain Manager',
    initials: 'RP',
    color: 'rgb(100, 180, 220)',
  },
]

function TestimonialCard({
  quote, name, role, initials, color, delay, visible,
}: {
  quote: string
  name: string
  role: string
  initials: string
  color: string
  delay: number
  visible: boolean
}) {
  return (
    <div
      className="group relative flex flex-col gap-4 p-6 rounded-2xl border border-white/[0.07] bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-300 hover:border-white/[0.12]"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${delay}ms`,
      }}
    >
      {/* Quote marks */}
      <div
        className="text-4xl font-serif leading-none opacity-30 -mb-2"
        style={{ color }}
        aria-hidden="true"
      >
        &ldquo;
      </div>

      <p className="text-sm text-white/65 leading-relaxed flex-1">{quote}</p>

      <div className="flex items-center gap-3 pt-2 border-t border-white/[0.06]">
        <div
          className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-black"
          style={{ backgroundColor: color }}
        >
          {initials}
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{name}</p>
          <p className="text-xs text-white/40">{role}</p>
        </div>
      </div>
    </div>
  )
}

export default function Testimonials() {
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
            Historias reales
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight text-balance">
            Personas que ya despegaron.
          </h2>
          <p className="mt-4 text-base text-white/50 leading-relaxed">
            9 de 10 usuarios continúan el programa después de la primera semana. Estas son algunas de sus historias.
          </p>
        </div>

        {/* Grid */}
        <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, idx) => (
            <TestimonialCard
              key={idx}
              {...t}
              delay={idx * 80}
              visible={visible}
            />
          ))}
        </div>

        {/* Trust bar */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-8 text-center">
          {[
            { value: '9/10', label: 'continúan semana 1' },
            { value: '7 días', label: 'garantía completa' },
            { value: '$0', label: 'para empezar' },
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1">
              <span className="text-2xl font-bold" style={{ color: TEAL }}>{item.value}</span>
              <span className="text-xs text-white/40">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
