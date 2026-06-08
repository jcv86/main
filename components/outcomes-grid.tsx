'use client'

import { useEffect, useRef, useState } from 'react'
import { Brain, Target, Zap, FileText, Users, TrendingUp } from 'lucide-react'

const OUTCOMES = [
  { icon: Brain, title: 'Autoconocimiento Real', desc: 'Qué roles casan contigo (datos + intuición)' },
  { icon: Target, title: 'Ruta Personalizada', desc: 'Próximos pasos claros, sin ambigüedad' },
  { icon: Zap, title: 'Skills Entrenadas', desc: 'Lo que el mercado pide, practicado' },
  { icon: FileText, title: 'CV ATS Armado', desc: 'Resume + portfolio que abre puertas' },
  { icon: Users, title: 'Red Expandida', desc: 'Contactos + referencias cualificadas' },
  { icon: TrendingUp, title: 'Visibilidad', desc: 'Presencia que te diferencia en el mercado' },
]

export default function OutcomesGrid() {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
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
    <div ref={ref} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {OUTCOMES.map((item, idx) => (
        <div
          key={idx}
          className="group relative p-6 rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden transition-all duration-300 hover:border-teal-400/40 hover:bg-white/[0.04]"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: `opacity 0.6s ease ${idx * 0.09}s, transform 0.6s cubic-bezier(0.22,1,0.36,1) ${idx * 0.09}s, border-color 0.3s, background-color 0.3s`,
          }}
        >
          {/* hover glow */}
          <div
            className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            style={{ background: 'radial-gradient(380px circle at 30% 0%, rgba(45,212,191,0.10), transparent 60%)' }}
          />

          {/* index */}
          <span className="absolute top-5 right-5 text-xs font-mono text-foreground/25 group-hover:text-teal-400/60 transition-colors">
            {String(idx + 1).padStart(2, '0')}
          </span>

          <div className="relative">
            <div className="inline-flex items-center justify-center h-12 w-12 rounded-xl border border-teal-400/30 bg-teal-400/10 mb-4 group-hover:scale-110 group-hover:border-teal-400/60 transition-transform duration-300">
              <item.icon className="h-6 w-6 text-teal-400" />
            </div>
            <h3 className="font-semibold text-lg mb-2 text-balance">{item.title}</h3>
            <p className="text-sm text-foreground/65 leading-relaxed">{item.desc}</p>
          </div>

          {/* bottom accent line */}
          <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-teal-400 to-cyan-400 w-0 group-hover:w-full transition-all duration-500" />
        </div>
      ))}
    </div>
  )
}
