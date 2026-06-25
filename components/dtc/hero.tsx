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
    <section className="relative overflow-hidden" style={{ paddingTop: '120px', paddingBottom: '80px' }}>
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

function VeraOrbit() {
  const [typed, setTyped] = useState('')
  const full = 'Hola, soy Vera.'

  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      i++
      setTyped(full.slice(0, i))
      if (i >= full.length) {
        clearInterval(id)
        setTimeout(() => {
          i = 0
        }, 1800)
      }
    }, 90)
    return () => clearInterval(id)
  }, [])

  const SIZE = 420
  const R = 168

  return (
    <div className="relative" style={{ width: SIZE, height: SIZE, maxWidth: '100%' }}>
      {/* rotating ring */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          border: `1px dashed rgba(255,255,255,0.12)`,
          animation: 'vera-spin 40s linear infinite',
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          inset: '54px',
          border: `1px solid rgba(124,92,255,0.18)`,
          animation: 'vera-spin 30s linear infinite reverse',
        }}
      />

      {/* center disc */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="flex flex-col items-center justify-center rounded-full text-center"
          style={{
            width: 150,
            height: 150,
            background: 'linear-gradient(150deg, rgba(124,92,255,0.22), rgba(63,169,255,0.12))',
            border: `1px solid rgba(124,92,255,0.35)`,
            boxShadow: '0 0 60px rgba(124,92,255,0.25)',
          }}
        >
          <span className="text-2xl font-bold text-white">Vera</span>
          <span className="mt-1 text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: COLORS.teal }}>
            Tu coach IA
          </span>
          <span className="mt-2 text-[11px]" style={{ color: COLORS.textMuted }}>
            {typed}
            <span className="inline-block w-1 animate-pulse">▍</span>
          </span>
        </div>
      </div>

      {/* orbit cards */}
      {ORBIT.map((o) => {
        const rad = (o.angle * Math.PI) / 180
        const x = Math.cos(rad) * R
        const y = Math.sin(rad) * R
        const Icon = o.icon
        return (
          <div
            key={o.label}
            className="absolute flex items-center gap-2 rounded-xl px-3 py-2 whitespace-nowrap"
            style={{
              left: '50%',
              top: '50%',
              transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              background: 'rgba(12,14,26,0.92)',
              border: `1px solid ${o.color}55`,
              boxShadow: `0 0 24px ${o.color}22`,
              backdropFilter: 'blur(6px)',
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
  )
}
