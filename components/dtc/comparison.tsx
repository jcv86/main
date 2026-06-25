'use client'

import React from 'react'
import { Check, X, Brain, Compass, Dumbbell, Radar, Activity, BadgeCheck } from 'lucide-react'
import { COLORS, GradientText, Eyebrow, Reveal } from './theme'

const COLUMNS = ['DTC', 'Test de personalidad', 'Bolsa de empleo', 'Coach genérico']

const ROWS: { label: string; values: boolean[] }[] = [
  { label: 'Parte desde la persona, no desde la vacante', values: [true, false, false, true] },
  { label: 'Diagnóstico que se traduce en una ruta accionable', values: [true, false, false, false] },
  { label: 'Entrenamiento con mejora observable', values: [true, false, false, false] },
  { label: 'Lee tu entorno y tus oportunidades (Radar)', values: [true, false, true, false] },
  { label: 'IA como motor de personalización, no chatbot lateral', values: [true, false, false, false] },
  { label: 'Empleabilidad verificable como consecuencia', values: [true, false, true, false] },
]

const OUTCOMES = [
  { icon: Brain, title: 'Claridad sobre ti', desc: 'Entiendes cómo funcionas: fortalezas, patrones y brechas entrenables.' },
  { icon: Compass, title: 'Foco y estructura', desc: 'Dejas de improvisar: una ruta con prioridades claras y pasos concretos.' },
  { icon: Dumbbell, title: 'Preparación real', desc: 'Practicas entrevistas y habilidades hasta que mejoran de forma observable.' },
  { icon: Radar, title: 'Criterio para decidir', desc: 'Lees tu entorno y tus oportunidades con más contexto.' },
  { icon: Activity, title: 'Perfil Vivo', desc: 'Un perfil que evoluciona contigo: avances, habilidades y próximos pasos.' },
  { icon: BadgeCheck, title: 'Empleabilidad verificable', desc: 'Aparece como consecuencia visible de tu avance, no como una promesa automática.' },
]

export default function Comparison() {
  return (
    <>
      {/* COMPARISON TABLE */}
      <section className="relative py-24 border-t" style={{ borderColor: COLORS.border }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-2xl mx-auto mb-14">
            <Eyebrow>Comparación</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight text-balance text-white">
              Por qué DTC no se parece a <GradientText>“lo de siempre”.</GradientText>
            </h2>
            <p className="mt-4 text-base leading-relaxed" style={{ color: COLORS.textMuted }}>
              No competimos con un test, una bolsa de empleo o un coach genérico. Hacemos algo distinto:
              conectamos todo en una sola continuidad.
            </p>
          </Reveal>

          <Reveal>
            <p className="mb-2 text-center text-xs sm:hidden" style={{ color: COLORS.textFaint }}>
              Desliza para comparar →
            </p>
            <div className="overflow-x-auto rounded-2xl" style={{ border: `1px solid ${COLORS.border}`, WebkitOverflowScrolling: 'touch' }}>
              <table className="w-full min-w-[560px] border-collapse">
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.03)' }}>
                    <th
                      className="sticky left-0 z-10 text-left p-3 sm:p-4 text-sm font-medium"
                      style={{ color: COLORS.textMuted, background: '#0a0c16' }}
                    ></th>
                    {COLUMNS.map((c, i) => (
                      <th
                        key={c}
                        className="p-3 sm:p-4 text-center text-xs sm:text-sm font-semibold"
                        style={{ color: i === 0 ? '#fff' : COLORS.textMuted, width: '16%' }}
                      >
                        {i === 0 ? <GradientText>{c}</GradientText> : c}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {ROWS.map((row) => (
                    <tr key={row.label} style={{ borderTop: `1px solid ${COLORS.border}` }}>
                      <td
                        className="sticky left-0 z-10 p-3 sm:p-4 text-xs sm:text-sm"
                        style={{ color: COLORS.text, background: '#080a16' }}
                      >
                        {row.label}
                      </td>
                      {row.values.map((v, ci) => (
                        <td key={ci} className="p-3 sm:p-4 text-center" style={{ background: ci === 0 ? 'rgba(54,224,192,0.04)' : 'transparent' }}>
                          {v ? (
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full" style={{ background: 'rgba(54,224,192,0.15)' }}>
                              <Check className="h-4 w-4" style={{ color: COLORS.teal }} />
                            </span>
                          ) : (
                            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full" style={{ background: 'rgba(255,255,255,0.04)' }}>
                              <X className="h-4 w-4" style={{ color: 'rgba(255,255,255,0.25)' }} />
                            </span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* LO QUE TE LLEVAS */}
      <section className="relative py-24 border-t" style={{ borderColor: COLORS.border }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-2xl mx-auto mb-14">
            <Eyebrow>Lo que te llevas</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight text-balance text-white">
              Claridad primero. <GradientText>Resultados, en consecuencia.</GradientText>
            </h2>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {OUTCOMES.map((o, i) => {
              const Icon = o.icon
              return (
                <Reveal key={o.title} delay={(i % 3) * 90}>
                  <div
                    className="group h-full rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
                    style={{ border: `1px solid ${COLORS.border}`, background: COLORS.cardBg }}
                  >
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-xl mb-4 transition-transform group-hover:scale-110"
                      style={{ background: 'rgba(124,92,255,0.12)', border: `1px solid rgba(124,92,255,0.3)` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: COLORS.purple }} />
                    </span>
                    <h3 className="text-lg font-semibold text-white mb-2">{o.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: COLORS.textMuted }}>{o.desc}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>
    </>
  )
}
