'use client'

import React from 'react'
import { Brain, Compass, Dumbbell, Radar, ShieldCheck, Sparkles, Workflow } from 'lucide-react'
import { PRODUCT_STAGE_ORDER, PRODUCT_STAGES } from '@/lib/dtc/product-language'
import { COLORS, Eyebrow, GradientText, Reveal } from './theme'

const ICONS = {
  A1: Brain,
  A2: Compass,
  A3: Dumbbell,
  A4: Radar,
} as const

const META = {
  A1: {
    tag: 'Diagnóstico',
    timing: 'Punto de partida',
    outcome: 'Plan Ejecutivo',
    color: COLORS.purple,
  },
  A2: {
    tag: 'Dirección',
    timing: 'Ciclo inicial de 30 días',
    outcome: 'Misión personalizada',
    color: COLORS.blue,
  },
  A3: {
    tag: 'Práctica',
    timing: 'Durante tu recorrido',
    outcome: 'Entrenamiento observable',
    color: '#f472b6',
  },
  A4: {
    tag: 'Contexto',
    timing: 'Señales continuas',
    outcome: 'Criterio estratégico',
    color: COLORS.teal,
  },
} as const

const INITIAL_READING = [
  { label: 'Claridad sobre tu punto de partida', value: 82 },
  { label: 'Foco y dirección', value: 68 },
  { label: 'Preparación para conversaciones', value: 54 },
  { label: 'Lectura del entorno', value: 40 },
]

export default function CanonicalJourney() {
  return (
    <>
      <section id="como-funciona" className="relative border-t py-24" style={{ borderColor: COLORS.border }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto mb-14 max-w-2xl text-center">
            <Eyebrow>Cómo funciona</Eyebrow>
            <h2 className="text-balance text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
              Un recorrido conectado para <GradientText>avanzar con claridad.</GradientText>
            </h2>
            <p className="mt-4 text-base leading-relaxed" style={{ color: COLORS.textMuted }}>
              El proceso comienza contigo, se transforma en una ruta concreta y se fortalece con práctica y contexto.
            </p>
          </Reveal>

          <div className="grid gap-5 md:grid-cols-2">
            {PRODUCT_STAGE_ORDER.map((stageId, index) => {
              const stage = PRODUCT_STAGES[stageId]
              const meta = META[stageId]
              const Icon = ICONS[stageId]

              return (
                <Reveal key={stageId} delay={index * 80}>
                  <article
                    data-stage-id={stageId}
                    className="group relative h-full overflow-hidden rounded-3xl p-6 transition-transform duration-300 hover:-translate-y-1"
                    style={{
                      border: `1px solid ${meta.color}55`,
                      background: `linear-gradient(145deg, ${meta.color}14, rgba(255,255,255,0.02))`,
                    }}
                  >
                    <div className="mb-5 flex items-start justify-between gap-4">
                      <span
                        className="flex h-12 w-12 items-center justify-center rounded-2xl"
                        style={{ background: `${meta.color}1f`, color: meta.color }}
                      >
                        <Icon className="h-6 w-6" />
                      </span>
                      <span
                        className="rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider"
                        style={{ border: `1px solid ${meta.color}40`, color: meta.color }}
                      >
                        {meta.tag}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold text-white">{stage.name}</h3>
                    <p className="mt-2 text-sm leading-relaxed" style={{ color: COLORS.textMuted }}>
                      {stage.shortDescription}
                    </p>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl p-3" style={{ background: 'rgba(255,255,255,0.035)' }}>
                        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: COLORS.textFaint }}>
                          Momento
                        </p>
                        <p className="mt-1 text-xs font-medium text-white">{meta.timing}</p>
                      </div>
                      <div className="rounded-2xl p-3" style={{ background: 'rgba(255,255,255,0.035)' }}>
                        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: COLORS.textFaint }}>
                          Resultado
                        </p>
                        <p className="mt-1 text-xs font-medium text-white">{meta.outcome}</p>
                      </div>
                    </div>
                  </article>
                </Reveal>
              )
            })}
          </div>

          <Reveal delay={120}>
            <p className="mx-auto mt-10 max-w-2xl text-center text-sm" style={{ color: COLORS.textFaint }}>
              Conozcámonos es la entrada humana al recorrido: primero entendemos tu situación y después construimos la siguiente etapa.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="relative border-t py-24" style={{ borderColor: COLORS.border }}>
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <Reveal>
            <Eyebrow>Un sistema serio detrás</Eyebrow>
            <h2 className="text-balance text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
              Personalización con <GradientText>continuidad real.</GradientText>
            </h2>
            <p className="mt-4 text-base leading-relaxed" style={{ color: COLORS.textMuted }}>
              Despega Cerebral construye tu lectura inicial. Tu Ruta convierte esa información en acciones. Entrenamiento practica lo que necesitas mejorar y Radar Estratégico aporta señales para decidir mejor.
            </p>
            <ul className="mt-7 space-y-3">
              {[
                { icon: Sparkles, text: 'IA aplicada a tu contexto, no respuestas genéricas' },
                { icon: Workflow, text: 'Una sola trayectoria entre diagnóstico, acción y práctica' },
                { icon: ShieldCheck, text: 'Privacidad, consentimiento y control humano' },
              ].map((item) => (
                <li key={item.text} className="flex items-center gap-3 text-sm" style={{ color: COLORS.textMuted }}>
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{ background: 'rgba(63,169,255,0.1)', border: '1px solid rgba(63,169,255,0.25)' }}
                  >
                    <item.icon className="h-4 w-4" style={{ color: COLORS.blue }} />
                  </span>
                  {item.text}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={120}>
            <div
              className="rounded-3xl p-7"
              style={{
                border: `1px solid ${COLORS.border}`,
                background: 'linear-gradient(160deg, rgba(124,92,255,0.08), rgba(63,169,255,0.04))',
              }}
            >
              <div className="mb-6 flex items-center justify-between">
                <p className="text-sm font-semibold text-white">Tu lectura inicial</p>
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[11px] font-bold text-[#05060e]"
                  style={{ background: COLORS.teal }}
                >
                  IA
                </span>
              </div>
              <div className="space-y-5">
                {INITIAL_READING.map((item, index) => (
                  <ResultBar key={item.label} {...item} delay={index * 150} />
                ))}
              </div>
              <p className="mt-6 text-[11px] leading-relaxed" style={{ color: COLORS.textFaint }}>
                Vista ilustrativa. Los resultados se generan desde la información y evidencia de cada persona.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}

function ResultBar({ label, value, delay }: { label: string; value: number; delay: number }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [width, setWidth] = React.useState(0)

  React.useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.setTimeout(() => setWidth(value), delay)
          observer.disconnect()
        }
      },
      { threshold: 0.3 },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [delay, value])

  return (
    <div ref={ref}>
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm" style={{ color: COLORS.textMuted }}>{label}</span>
        <span className="text-sm font-semibold text-white">{value}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${width}%`, background: `linear-gradient(90deg, ${COLORS.purple}, ${COLORS.teal})` }}
        />
      </div>
    </div>
  )
}
