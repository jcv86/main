'use client'

import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'

const TEAL = 'rgb(80, 160, 170)'

const FAQS = [
  {
    q: '¿Para quién es DTC exactamente?',
    a: 'Para profesionales con 2+ años de experiencia en tech, retail, finance, consultoría u operaciones que saben que pueden más, pero no saben exactamente qué cambiar, hacia dónde ir o cómo. Si te sientes estancado o confundido sobre tu próximo paso, DTC es para ti.',
  },
  {
    q: '¿Es realmente gratis para empezar?',
    a: 'Sí. El diagnóstico inicial y los primeros 7 días con Vera son completamente gratuitos. No necesitas tarjeta de crédito. Si quieres continuar con el programa completo de 90 días, el plan Pro es $4.390/mes.',
  },
  {
    q: '¿Cuánto tiempo requiere al día?',
    a: 'El diagnóstico inicial toma ~30 minutos. Durante el programa, la mayoría de actividades están diseñadas para 20-40 minutos diarios. Muchos usuarios lo hacen en las noches o fines de semana trabajando full time.',
  },
  {
    q: '¿Qué pasa si el programa no me sirve?',
    a: 'Garantía total de 7 días. Si después de la primera semana sientes que DTC no es para ti, te devolvemos el 100% sin preguntas. Nuestro dato: 9 de 10 usuarios continúan después de semana 1.',
  },
  {
    q: '¿Qué es Vera exactamente?',
    a: 'Vera es tu coach IA 24/7. Tiene contexto completo de tu perfil, tus tests, tu ruta y tu progreso. Puedes usarla para preparar entrevistas, procesar una decisión difícil, afinar tu mensaje profesional, o simplemente reflexionar sobre tu carrera. Está disponible cuando tú estás listo.',
  },
  {
    q: '¿Es solo para profesionales de IT?',
    a: 'No. Hemos acompañado profesionales en retail, finanzas, consultoría, operaciones, ventas, marketing y más. El diagnóstico y el sistema funcionan para cualquier profesional que quiere claridad sobre su siguiente versión.',
  },
]

export default function FaqSection() {
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <section className="relative py-24 border-t border-white/[0.06]" id="faq">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-2xl mx-auto text-center mb-16">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-4"
            style={{ color: TEAL }}
          >
            FAQ
          </p>
          <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight tracking-tight text-balance">
            Lo que probablemente estés preguntando.
          </h2>
        </div>

        {/* Accordion */}
        <div className="max-w-2xl mx-auto space-y-2">
          {FAQS.map((item, idx) => {
            const isOpen = expanded === idx
            return (
              <div
                key={idx}
                className={`rounded-xl border transition-colors duration-200 overflow-hidden ${
                  isOpen
                    ? 'border-white/[0.12] bg-white/[0.04]'
                    : 'border-white/[0.06] bg-white/[0.02] hover:border-white/[0.10]'
                }`}
              >
                <button
                  onClick={() => setExpanded(isOpen ? null : idx)}
                  className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold text-white/90">{item.q}</span>
                  <span
                    className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full transition-colors duration-200"
                    style={{
                      backgroundColor: isOpen ? `${TEAL}20` : 'transparent',
                      color: isOpen ? TEAL : 'rgba(255,255,255,0.4)',
                    }}
                  >
                    {isOpen ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                  </span>
                </button>

                {isOpen && (
                  <div className="px-6 pb-5">
                    <p className="text-sm text-white/55 leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
