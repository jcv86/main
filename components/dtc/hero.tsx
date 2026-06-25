'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Brain, Map, Dumbbell, Radar, Check } from 'lucide-react'
import { COLORS, GRADIENT_BTN, GradientText, ROUTES } from './theme'

const ORBIT = [
  { icon: Radar, label: 'Radar Estratégico', color: COLORS.teal, angle: -90 },
  { icon: Brain, label: 'Despega Cerebral', color: COLORS.purple, angle: 0 },
  { icon: Dumbbell, label: 'Entrenamiento', color: COLORS.blue, angle: 90 },
  { icon: Map, label: 'Tu Ruta', color: '#f0a' , angle: 180 },
]

const TRUST = [
  'Diagnóstico en minutos',
  'Ruta inicial de 30 días',
  'Sin promesas de empleo rápido',
]

const STATS = [
  { value: '4', label: 'etapas que se preparan' },
  { value: '30', label: 'días tu primera misión' },
  { value: '24/7', label: 'con Vera, tu coach' },
  { value: '100%', label: 'desde ti, no la vacante' },
]

export default function DtcHero() {
  return (
    <section className="relative overflow-hidden pt-24 pb-16 sm:pt-28 sm:pb-20 lg:pt-[120px] lg:pb-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-8 items-center">
          {/* LEFT */}
          <div>
            <div
              className="inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium mb-7"
              style={{ border: `1px solid ${COLORS.border}`, background: COLORS.cardBg, color: COLORS.textMuted }}
            >
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: COLORS.teal }} />
              Plataforma AI-first humana
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-bold leading-[1.08] tracking-tight text-balance text-white">
              Entiende cómo funcionas. Ordena tu camino. Avanza con{' '}
              <GradientText>más claridad.</GradientText>
            </h1>

            <p className="mt-6 text-base leading-relaxed max-w-xl" style={{ color: COLORS.textMuted }}>
              DespegaTuCarrera es una plataforma de desarrollo personal con IA que te ayuda a entender tu
              perfil, ordenar tu foco, entrenar habilidades reales y avanzar con más criterio en tu vida
              personal y laboral.
            </p>
            <p className="mt-4 text-sm leading-relaxed max-w-xl" style={{ color: COLORS.textFaint }}>
              DTC fortalece la empleabilidad de las personas porque mejora primero su claridad, su
              estructura, su preparación y su capacidad de avanzar con más foco en el mundo real.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href={ROUTES.diagnostico}
                className="group inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-[#05060e] transition-transform hover:scale-[1.03]"
                style={{ background: GRADIENT_BTN }}
              >
                Quiero comenzar mi diagnóstico
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href={ROUTES.pruebaEnVivo}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold transition-colors hover:bg-white/5"
                style={{ border: `1px solid ${COLORS.border}`, color: COLORS.text }}
              >
                Pruébalo en vivo
              </Link>
            </div>

            <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2">
              {TRUST.map((t) => (
                <li key={t} className="flex items-center gap-2 text-sm" style={{ color: COLORS.textMuted }}>
                  <Check className="h-4 w-4" style={{ color: COLORS.teal }} />
                  {t}
                </li>
              ))}
            </ul>
          </div>

          {/* RIGHT: Vera orbit */}
          <div className="flex items-center justify-center">
            <VeraOrbit />
          </div>
        </div>

        {/* Stats strip */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden" style={{ border: `1px solid ${COLORS.border}` }}>
          {STATS.map((s) => (
            <div key={s.label} className="p-5 text-center" style={{ background: COLORS.cardBg }}>
              <div className="text-3xl font-bold">
                <GradientText>{s.value}</GradientText>
              </div>
              <div className="mt-1 text-xs leading-snug" style={{ color: COLORS.textMuted }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const VERA_MESSAGES = [
  { text: 'Hola, soy Vera.', focus: -1 },
  { text: 'Analizando tu perfil…', focus: 1 },
  { text: 'Leyendo tus patrones…', focus: 0 },
  { text: 'Trazando tu ruta…', focus: 3 },
  { text: 'Detecto fortalezas clave.', focus: 2 },
  { text: 'Todo listo para empezar.', focus: -1 },
]

function VeraOrbit() {
  const [angle, setAngle] = useState(0)
  const [msgIndex, setMsgIndex] = useState(0)
  const [typed, setTyped] = useState('')
  const wrapRef = React.useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  const SIZE = 420
  const R = 168
  // true visual width including the orbit cards that overhang the 420px box
  const CONTENT = 540

  // scale the whole diagram to fit its container (prevents mobile overflow)
  useEffect(() => {
    const measure = () => {
      const w = wrapRef.current?.clientWidth ?? CONTENT
      setScale(Math.min(1, w / CONTENT))
    }
    measure()
    const ro = new ResizeObserver(measure)
    if (wrapRef.current) ro.observe(wrapRef.current)
    window.addEventListener('resize', measure)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  // continuous orbital rotation
  useEffect(() => {
    let raf = 0
    let last = performance.now()
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduce) return
    const tick = (now: number) => {
      const dt = now - last
      last = now
      setAngle((a) => (a + dt * 0.011) % 360) // ~32s per full revolution
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [])

  // typing + cycling Vera messages
  useEffect(() => {
    const full = VERA_MESSAGES[msgIndex].text
    let i = 0
    setTyped('')
    const typeId = setInterval(() => {
      i++
      setTyped(full.slice(0, i))
      if (i >= full.length) clearInterval(typeId)
    }, 50)
    const nextId = setTimeout(() => {
      setMsgIndex((m) => (m + 1) % VERA_MESSAGES.length)
    }, 2900)
    return () => {
      clearInterval(typeId)
      clearTimeout(nextId)
    }
  }, [msgIndex])

  const focus = VERA_MESSAGES[msgIndex].focus

  return (
    <div ref={wrapRef} className="w-full flex justify-center" style={{ maxWidth: CONTENT }}>
    <div style={{ width: SIZE * scale, height: SIZE * scale, position: 'relative' }}>
    <div
      className="relative"
      style={{ width: SIZE, height: SIZE, position: 'absolute', top: 0, left: 0, transformOrigin: 'top left', transform: `scale(${scale})` }}
    >
      {/* static guide rings */}
      <div
        className="absolute inset-0 rounded-full"
        style={{ border: `1px dashed rgba(255,255,255,0.10)` }}
      />
      <div
        className="absolute rounded-full"
        style={{ inset: '54px', border: `1px solid rgba(124,92,255,0.16)` }}
      />

      {/* sweeping radar beam */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(from ${angle}deg, transparent 0deg, ${COLORS.teal}22 28deg, transparent 56deg)`,
          maskImage: 'radial-gradient(circle, transparent 38%, black 39%)',
          WebkitMaskImage: 'radial-gradient(circle, transparent 38%, black 39%)',
        }}
      />

      {/* center disc */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="flex flex-col items-center justify-center rounded-full text-center px-3"
          style={{
            width: 154,
            height: 154,
            background: 'linear-gradient(150deg, rgba(124,92,255,0.24), rgba(63,169,255,0.12))',
            border: `1px solid rgba(124,92,255,0.4)`,
            boxShadow: '0 0 60px rgba(124,92,255,0.3)',
          }}
        >
          <span className="text-2xl font-bold text-white">Vera</span>
          <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: COLORS.teal }}>
            Tu coach IA
          </span>
          <span className="mt-2 text-[11px] leading-tight min-h-[28px] flex items-center justify-center" style={{ color: COLORS.textMuted }}>
            {typed}
            <span className="inline-block w-1 animate-pulse">▍</span>
          </span>
        </div>
      </div>

      {/* orbit cards */}
      {ORBIT.map((o, idx) => {
        const rad = ((o.angle + angle) * Math.PI) / 180
        const x = Math.cos(rad) * R
        const y = Math.sin(rad) * R
        const Icon = o.icon
        const active = focus === idx
        return (
          <div
            key={o.label}
            className="absolute flex items-center gap-2 rounded-xl px-3 py-2 whitespace-nowrap"
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${active ? 1.08 : 1})`,
              background: active ? `${o.color}1f` : 'rgba(12,14,26,0.92)',
              border: `1px solid ${o.color}${active ? 'aa' : '55'}`,
              boxShadow: active ? `0 0 32px ${o.color}66` : `0 0 24px ${o.color}22`,
              backdropFilter: 'blur(6px)',
              transition: 'background 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease, scale 0.4s ease',
            }}
          >
            <span
              className="flex h-7 w-7 items-center justify-center rounded-lg"
              style={{ background: `${o.color}1f`, border: `1px solid ${o.color}44` }}
            >
              <Icon className="h-3.5 w-3.5" style={{ color: o.color }} />
            </span>
            <span className="text-xs font-medium text-white">{o.label}</span>
          </div>
        )
      })}
    </div>
    </div>
    </div>
  )
}
