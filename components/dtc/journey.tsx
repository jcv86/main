'use client'

import React from 'react'
import { Brain, Map, Dumbbell, Radar, Cpu, Cloud, ShieldCheck } from 'lucide-react'
import { COLORS, GradientText, Eyebrow, Reveal } from './theme'

const STAGES = [
  {
    code: 'A1',
    name: '“Despega Cerebral”',
    tag: 'Diagnóstico',
    desc: 'Autoconocimiento, lectura de patrones y un punto de partida con tu Plan Ejecutivo.',
    icon: Brain,
    color: COLORS.purple,
  },
  {
    code: 'A2',
    name: '“Tu Ruta”',
    tag: 'Dirección',
    desc: 'Una misión inicial de 30 días, expandible a 60 y 90 según tu avance.',
    icon: Map,
    color: COLORS.blue,
  },
  {
    code: 'A3',
    name: '“Entrenamiento”',
    tag: 'Práctica',
    desc: 'Entrevistas, habilidades y simulaciones con mejora observable.',
    icon: Dumbbell,
    color: '#f472b6',
  },
  {
    code: 'A4',
    name: '“Radar Estratégico”',
    tag: 'Contexto',
    desc: 'Lectura del entorno, oportunidades y señales para decidir mejor.',
    icon: Radar,
    color: COLORS.teal,
  },
]

const RESULTS = [
  { label: 'Claridad sobre tu punto de partida', value: 82 },
  { label: 'Foco y dirección', value: 68 },
  { label: 'Preparación para entrevistas', value: 54 },
  { label: 'Lectura del entorno (Radar)', value: 40 },
]

export default function Journey() {
  return (
    <>
      {/* TIMELINE */}
      <section id="como-funciona" className="relative py-24 border-t" style={{ borderColor: COLORS.border }}>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-2xl mx-auto mb-16">
            <Eyebrow>Cómo funciona</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight text-balance text-white">
              Tu trayectoria de <GradientText>despegue.</GradientText>
            </h2>
            <p className="mt-4 text-base leading-relaxed" style={{ color: COLORS.textMuted }}>
              Cuatro etapas conectadas. A medida que avanzas, el sistema te lee mejor y prepara la siguiente.
              Desplázate y sigue la línea.
            </p>
          </Reveal>

          <Timeline />

          <Reveal delay={120}>
            <p className="mt-12 text-center text-sm max-w-2xl mx-auto" style={{ color: COLORS.textFaint }}>
              El “Conozcámonos” que probaste arriba es el inicio real del recorrido: un onboarding humano que
              te lee antes de guiarte. No es una encuesta.
            </p>
          </Reveal>
        </div>
      </section>

      {/* 60 SEGUNDOS */}
      <section className="relative py-24 border-t" style={{ borderColor: COLORS.border }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <Eyebrow>Hay un sistema serio detrás</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight text-balance text-white">
              Cómo funciona, <GradientText>en 60 segundos.</GradientText>
            </h2>
            <p className="mt-4 text-base leading-relaxed" style={{ color: COLORS.textMuted }}>
              Conozcámonos te lee, A1 “Despega Cerebral” diagnostica, A2 “Tu Ruta” organiza una misión de 30
              días, y A3 “Entrenamiento” y A4 “Radar Estratégico” te llevan al mundo real con práctica
              observable y criterio.
            </p>
            <ul className="mt-7 space-y-3">
              {[
                { icon: Cpu, t: 'Construido AI-first' },
                { icon: Cloud, t: 'Desplegado en Vercel' },
                { icon: ShieldCheck, t: 'Privacidad y consentimiento' },
              ].map((x) => (
                <li key={x.t} className="flex items-center gap-3 text-sm" style={{ color: COLORS.textMuted }}>
                  <span
                    className="flex h-8 w-8 items-center justify-center rounded-lg"
                    style={{ background: 'rgba(63,169,255,0.1)', border: `1px solid rgba(63,169,255,0.25)` }}
                  >
                    <x.icon className="h-4 w-4" style={{ color: COLORS.blue }} />
                  </span>
                  {x.t}
                </li>
              ))}
            </ul>
          </Reveal>

          {/* Results panel */}
          <Reveal delay={120}>
            <div
              className="rounded-3xl p-7"
              style={{ border: `1px solid ${COLORS.border}`, background: 'linear-gradient(160deg, rgba(124,92,255,0.08), rgba(63,169,255,0.04))' }}
            >
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm font-semibold text-white">Resultado A1 · tu lectura inicial</p>
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-[11px] font-bold text-[#05060e]"
                  style={{ background: COLORS.teal }}
                >
                  IA
                </span>
              </div>
              <div className="space-y-5">
                {RESULTS.map((r, i) => (
                  <ResultBar key={r.label} {...r} delay={i * 150} />
                ))}
              </div>
              <p className="mt-6 text-[11px] leading-relaxed" style={{ color: COLORS.textFaint }}>
                Vista ilustrativa. Los valores se generan a partir de tu diagnóstico, no de promesas.
              </p>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}

function Timeline() {
  const ref = React.useRef<HTMLDivElement>(null)
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    const onScroll = () => {
      const el = ref.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      const start = vh * 0.65 // line begins filling when timeline top reaches 65% down the viewport
      const scrolled = start - rect.top
      const p = Math.max(0, Math.min(1, scrolled / rect.height))
      setProgress(p)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <div ref={ref} className="relative">
      {/* track line */}
      <div
        className="absolute left-[27px] md:left-1/2 top-2 bottom-2 w-px md:-translate-x-1/2"
        style={{ background: 'rgba(255,255,255,0.08)' }}
      />
      {/* animated progress line */}
      <div
        className="absolute left-[27px] md:left-1/2 top-2 w-[2px] md:-translate-x-1/2 rounded-full"
        style={{
          height: `calc(${progress * 100}% - 4px)`,
          background: `linear-gradient(${COLORS.purple}, ${COLORS.blue}, ${COLORS.teal})`,
          boxShadow: `0 0 14px ${COLORS.blue}88`,
          transition: 'height 0.15s linear',
        }}
      />
      <div className="space-y-8">
        {STAGES.map((s, i) => {
          const Icon = s.icon
          const left = i % 2 === 0
          // node activates once the progress line reaches its position
          const nodePoint = (i + 0.5) / STAGES.length
          const active = progress >= nodePoint
          return (
            <Reveal key={s.code} delay={i * 80}>
              <div className={`relative flex items-start gap-5 md:gap-0 ${left ? 'md:flex-row' : 'md:flex-row-reverse'}`}>
                {/* node */}
                <span
                  className="relative z-10 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl md:absolute md:left-1/2 md:-translate-x-1/2"
                  style={{
                    background: active ? `${s.color}33` : `${s.color}12`,
                    border: `1px solid ${s.color}${active ? 'cc' : '44'}`,
                    boxShadow: active ? `0 0 34px ${s.color}77` : `0 0 14px ${s.color}1f`,
                    transform: `scale(${active ? 1.08 : 1})`,
                    transition: 'all 0.4s ease',
                  }}
                >
                  <Icon className="h-6 w-6" style={{ color: s.color }} />
                </span>
                {/* card */}
                <div className={`flex-1 md:w-[calc(50%-3rem)] ${left ? 'md:pr-16 md:text-right' : 'md:pl-16 md:ml-auto'}`}>
                  <div
                    className="rounded-2xl p-5 inline-block w-full transition-all duration-400"
                    style={{
                      border: `1px solid ${active ? `${s.color}55` : COLORS.border}`,
                      background: COLORS.cardBg,
                    }}
                  >
                    <div className={`flex items-center gap-2 mb-2 ${left ? 'md:justify-end' : ''}`}>
                      <span className="text-lg font-bold" style={{ color: s.color }}>{s.code}</span>
                      <span className="text-base font-semibold text-white">{s.name}</span>
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: COLORS.textFaint }}>
                      {s.tag}
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: COLORS.textMuted }}>{s.desc}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          )
        })}
      </div>
    </div>
  )
}

function ResultBar({ label, value, delay }: { label: string; value: number; delay: number }) {
  const ref = React.useRef<HTMLDivElement>(null)
  const [w, setW] = React.useState(0)
  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setTimeout(() => setW(value), delay)
          obs.disconnect()
        }
      },
      { threshold: 0.3 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [value, delay])

  return (
    <div ref={ref}>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-sm" style={{ color: COLORS.textMuted }}>{label}</span>
        <span className="text-sm font-semibold text-white">{value}%</span>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
        <div
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${w}%`, background: `linear-gradient(90deg, ${COLORS.purple}, ${COLORS.teal})` }}
        />
      </div>
    </div>
  )
}
