'use client'

import React, { useEffect, useRef, useState } from 'react'
import { MessageCircle, TrendingUp, UserCheck } from 'lucide-react'
import { COLORS, GradientText, Eyebrow, Reveal } from './theme'

const VERA_BENEFITS = [
  { icon: MessageCircle, title: 'Vera, 24/7', desc: 'Te orienta con tu contexto real, sin esperar a una sesión agendada.' },
  { icon: TrendingUp, title: 'Inteligencia de mercado (A4)', desc: 'Señales del entorno, oportunidades y tendencias para activar con criterio.' },
  { icon: UserCheck, title: 'Con criterio humano', desc: 'Las decisiones siguen siendo tuyas; la IA aporta claridad, no las toma por ti.' },
]

const CHAT = [
  { from: 'user' as const, text: '¿Por dónde empiezo esta semana?' },
  {
    from: 'vera' as const,
    text: 'Según tu Perfil Vivo, enfócate en 3 prioridades. Te preparo una entrevista simulada para el jueves y reviso señales de tu sector.',
  },
]

const CV_STEPS = [
  { code: '01 · Radar (A4)', title: 'La vacante pide', items: ['Comunicación', 'Análisis', 'Excel', 'Inglés'], tone: 'neutral' },
  { code: '02 · Tu match', title: 'Lo que tienes', items: ['Comunicación ✓', 'Análisis ✓', 'Excel (declarado)', 'Inglés · brecha'], tone: 'mix' },
  { code: '03 · CV ATS', title: 'Vera arma tu CV', items: ['Evidenciadas DTC', 'Declaradas (confirmas)'], tone: 'good' },
  { code: '04 · A3', title: 'La brecha se entrena', items: ['Inglés → práctica', '→ futuro Sello DTC'], tone: 'train' },
]

export default function VeraCv() {
  return (
    <>
      {/* ACOMPAÑAMIENTO VERA */}
      <section className="relative py-24 border-t" style={{ borderColor: COLORS.border }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <Eyebrow>Vera, tu coach + Radar</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight text-balance text-white">
              Un acompañamiento que <GradientText>no se apaga.</GradientText>
            </h2>
            <p className="mt-4 text-base leading-relaxed" style={{ color: COLORS.textMuted }}>
              Vera está disponible cuando la necesitas, y A4 “Radar Estratégico” lee el entorno para que
              decidas mejor informado. Vera propone; tú decides.
            </p>
            <div className="mt-7 space-y-3">
              {VERA_BENEFITS.map((b) => {
                const Icon = b.icon
                return (
                  <div
                    key={b.title}
                    className="flex gap-3.5 rounded-xl p-4"
                    style={{ border: `1px solid ${COLORS.border}`, background: COLORS.cardBg }}
                  >
                    <span
                      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg"
                      style={{ background: 'rgba(54,224,192,0.1)', border: `1px solid rgba(54,224,192,0.25)` }}
                    >
                      <Icon className="h-4 w-4" style={{ color: COLORS.teal }} />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-white">{b.title}</p>
                      <p className="text-xs mt-0.5 leading-relaxed" style={{ color: COLORS.textMuted }}>{b.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </Reveal>

          <Reveal delay={120}>
            <VeraChat />
          </Reveal>
        </div>
      </section>

      {/* CV ATS */}
      <section className="relative py-24 border-t" style={{ borderColor: COLORS.border }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-2xl mx-auto mb-14">
            <Eyebrow>De tu perfil a la oferta</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight text-balance text-white">
              Tu CV ATS, armado con lo que <GradientText>sí puedes respaldar.</GradientText>
            </h2>
            <p className="mt-4 text-base leading-relaxed" style={{ color: COLORS.textMuted }}>
              Vera cruza tu perfil con vacantes reales, arma tu CV en formato ATS con tus habilidades, y lo
              que falta lo conviertes en tu próximo entrenamiento. Nunca inventamos skills.
            </p>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {CV_STEPS.map((s, i) => (
              <Reveal key={s.code} delay={i * 90}>
                <div className="h-full rounded-2xl p-5" style={{ border: `1px solid ${COLORS.border}`, background: COLORS.cardBg }}>
                  <p className="text-[11px] font-bold tracking-widest mb-3" style={{ color: COLORS.blue }}>{s.code}</p>
                  <p className="text-sm font-semibold text-white mb-3">{s.title}</p>
                  <ul className="space-y-2">
                    {s.items.map((it) => (
                      <li
                        key={it}
                        className="text-xs rounded-lg px-2.5 py-1.5"
                        style={{
                          background: 'rgba(255,255,255,0.03)',
                          border: `1px solid ${COLORS.border}`,
                          color: COLORS.textMuted,
                        }}
                      >
                        {it}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={150}>
            <p
              className="mt-8 rounded-xl p-4 text-center text-xs leading-relaxed mx-auto max-w-3xl"
              style={{ background: 'rgba(54,224,192,0.06)', border: `1px solid rgba(54,224,192,0.2)`, color: COLORS.textMuted }}
            >
              <span className="font-semibold" style={{ color: COLORS.teal }}>Honestidad primero:</span> optimizamos
              para ATS solo con habilidades evidenciadas en DTC o declaradas por ti (y confirmadas). Lo que
              falta no se inventa: se entrena.
            </p>
          </Reveal>
        </div>
      </section>
    </>
  )
}

function VeraChat() {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(0)
  const [typing, setTyping] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          obs.disconnect()
          setShown(1)
          setTyping(true)
          setTimeout(() => {
            setTyping(false)
            setShown(2)
          }, 1600)
        }
      },
      { threshold: 0.3 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className="rounded-3xl overflow-hidden" style={{ border: `1px solid ${COLORS.border}`, background: '#080a16' }}>
      {/* header */}
      <div className="flex items-center justify-between px-5 py-3.5" style={{ borderBottom: `1px solid ${COLORS.border}`, background: 'rgba(124,92,255,0.06)' }}>
        <div className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-[#05060e]" style={{ background: `linear-gradient(135deg, ${COLORS.purple}, ${COLORS.blue})` }}>
            V
          </span>
          <div>
            <p className="text-sm font-semibold text-white leading-none">Vera</p>
            <p className="text-[10px] mt-1" style={{ color: COLORS.teal }}>En línea · ilustrativo</p>
          </div>
        </div>
      </div>

      {/* messages */}
      <div className="p-5 space-y-3 min-h-[260px]">
        {CHAT.slice(0, shown).map((m, i) => (
          <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`} style={{ animation: 'vera-msg-in 0.4s ease' }}>
            <div
              className="max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed"
              style={
                m.from === 'user'
                  ? { background: 'rgba(63,169,255,0.16)', border: `1px solid rgba(63,169,255,0.3)`, color: '#fff' }
                  : { background: 'rgba(255,255,255,0.04)', border: `1px solid ${COLORS.border}`, color: COLORS.text }
              }
            >
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex justify-start">
            <div className="rounded-2xl px-4 py-3" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${COLORS.border}` }}>
              <div className="flex gap-1">
                {[0, 1, 2].map((d) => (
                  <span key={d} className="h-1.5 w-1.5 rounded-full" style={{ background: COLORS.teal, animation: `vera-dot 1.2s ${d * 0.2}s infinite` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        {shown >= 2 && (
          <div className="flex flex-wrap gap-2 pt-2" style={{ animation: 'vera-fade 0.5s ease' }}>
            {['Señal: demanda al alza', 'Brecha: visibilidad', 'Próximo: Entrevista 0'].map((tag) => (
              <span
                key={tag}
                className="rounded-full px-3 py-1 text-[11px]"
                style={{ background: 'rgba(54,224,192,0.1)', border: `1px solid rgba(54,224,192,0.25)`, color: COLORS.teal }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
