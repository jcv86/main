'use client'

import React, { useState } from 'react'
import { Compass, Target, MessageCircle, ArrowRight, Sparkles, Check } from 'lucide-react'
import { COLORS, GradientText, Eyebrow, Reveal } from './theme'

type Key = 'feeling' | 'seeking' | 'style'

const QUESTIONS: { key: Key; n: number; label: string; icon: React.ElementType; options: string[] }[] = [
  {
    key: 'feeling',
    n: 1,
    label: '¿Cómo te sientes con tu rumbo hoy?',
    icon: Compass,
    options: ['Perdido', 'Estancado', 'Explorando', 'Con claridad'],
  },
  {
    key: 'seeking',
    n: 2,
    label: '¿Qué buscas ahora?',
    icon: Target,
    options: ['Encontrar mi foco', 'Prepararme para entrevistas', 'Cambiar de rumbo', 'Crecer donde estoy'],
  },
  {
    key: 'style',
    n: 3,
    label: 'Tu estilo de comunicación',
    icon: MessageCircle,
    options: ['Directo y asertivo', 'Abierto y conversacional', 'Calmado y reflexivo', 'Preciso y estructurado'],
  },
]

const VERA_LINE: Record<string, string> = {
  Perdido: 'Te ayudo a encontrar tu primer punto de partida claro.',
  Estancado: 'Te ayudo a destrabar tu avance y recuperar el foco.',
  Explorando: 'Te ayudo a ordenar tus opciones y elegir con criterio.',
  'Con claridad': 'Potenciamos tu foco y aceleramos tu siguiente etapa.',
}

const STYLE_TONE: Record<string, string> = {
  'Directo y asertivo': 'Directo (Rojo)',
  'Abierto y conversacional': 'Cálido (Amarillo)',
  'Calmado y reflexivo': 'Calmado (Verde)',
  'Preciso y estructurado': 'Preciso (Azul)',
}

export default function PerfilVivo() {
  const [resp, setResp] = useState<Record<Key, string>>({
    feeling: 'Estancado',
    seeking: 'Encontrar mi foco',
    style: 'Directo y asertivo',
  })

  return (
    <section id="perfil-vivo" className="relative py-24 border-t" style={{ borderColor: COLORS.border }}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <Eyebrow>Conozcámonos · Pruébalo en vivo</Eyebrow>
          <h2 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight text-balance text-white">
            Responde y mira cómo se arma tu <GradientText>Perfil Vivo.</GradientText>
          </h2>
          <p className="mt-4 text-base leading-relaxed" style={{ color: COLORS.textMuted }}>
            Esto es lo que hace una plataforma AI-first humana: parte desde ti, no desde la vacante. Cambia
            tus respuestas y observa cómo se adapta —en tiempo real.
          </p>
        </Reveal>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Questions */}
          <div className="space-y-7">
            {QUESTIONS.map((q) => {
              const Icon = q.icon
              return (
                <div key={q.key}>
                  <div className="flex items-center gap-2.5 mb-3">
                    <span
                      className="flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold text-[#05060e]"
                      style={{ background: COLORS.teal }}
                    >
                      {q.n}
                    </span>
                    <Icon className="h-4 w-4" style={{ color: COLORS.blue }} />
                    <p className="text-sm font-medium text-white">{q.label}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {q.options.map((opt) => {
                      const active = resp[q.key] === opt
                      return (
                        <button
                          key={opt}
                          onClick={() => setResp((p) => ({ ...p, [q.key]: opt }))}
                          className="relative rounded-xl px-3.5 py-3 text-sm font-medium text-left transition-all duration-300"
                          style={{
                            border: `1px solid ${active ? COLORS.purple : COLORS.border}`,
                            background: active ? 'rgba(124,92,255,0.16)' : COLORS.cardBg,
                            color: active ? '#fff' : COLORS.textMuted,
                            boxShadow: active ? `0 0 22px rgba(124,92,255,0.25)` : 'none',
                          }}
                        >
                          {opt}
                          {active && (
                            <span
                              className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full animate-pulse"
                              style={{ background: COLORS.teal }}
                            />
                          )}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
            <p className="flex items-center gap-2 text-xs pt-1" style={{ color: COLORS.textFaint }}>
              Cambia tus respuestas y observa tu Perfil Vivo <ArrowRight className="h-3.5 w-3.5" />
            </p>
          </div>

          {/* Live profile card */}
          <div
            className="relative rounded-3xl p-7 lg:sticky lg:top-28 overflow-hidden"
            style={{
              border: `1px solid rgba(124,92,255,0.3)`,
              background: 'linear-gradient(160deg, rgba(124,92,255,0.10), rgba(63,169,255,0.05))',
            }}
          >
            <div
              className="pointer-events-none absolute -top-20 -right-20 h-48 w-48 rounded-full blur-3xl"
              style={{ background: 'radial-gradient(circle, rgba(124,92,255,0.3), transparent 70%)' }}
            />
            <div className="relative flex items-center justify-between mb-6">
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em]" style={{ color: COLORS.teal }}>
                  Tu Perfil Vivo
                </p>
                <p className="text-sm mt-0.5" style={{ color: COLORS.textMuted }}>Vera lo construye contigo</p>
              </div>
              <span
                className="rounded-full px-2.5 py-1 text-[10px] font-medium"
                style={{ border: `1px solid ${COLORS.border}`, color: COLORS.textFaint }}
              >
                ilustrativo
              </span>
            </div>

            <div className="relative rounded-2xl p-4 mb-5" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${COLORS.border}` }}>
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4" style={{ color: COLORS.teal }} />
                <p className="text-sm font-semibold text-white">Perfil 100% construido</p>
              </div>
              <p className="text-xs" style={{ color: COLORS.textFaint }}>A partir de tus 3 respuestas</p>
            </div>

            <div className="relative space-y-4 text-sm">
              <div key={resp.feeling} style={{ animation: 'vera-fade 0.4s ease' }}>
                <p className="text-xs mb-1" style={{ color: COLORS.textFaint }}>Vera:</p>
                <p className="text-white leading-relaxed">{VERA_LINE[resp.feeling]}</p>
              </div>
              <div key={resp.style}>
                <p className="text-xs" style={{ color: COLORS.textMuted }}>
                  Vera te habla en tu estilo: <span className="text-white font-medium">{STYLE_TONE[resp.style]}</span>
                </p>
              </div>
              <hr style={{ borderColor: COLORS.border }} />
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest mb-2" style={{ color: COLORS.textFaint }}>
                  Fortalezas detectadas
                </p>
                <div className="flex flex-wrap gap-2">
                  {['Constancia', 'Pensamiento analítico', 'Comunicación directa'].map((f) => (
                    <span
                      key={f}
                      className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs"
                      style={{ background: 'rgba(54,224,192,0.1)', border: `1px solid rgba(54,224,192,0.3)`, color: COLORS.teal }}
                    >
                      <Check className="h-3 w-3" /> {f}
                    </span>
                  ))}
                </div>
              </div>
              <div className="rounded-xl p-3.5" style={{ background: 'rgba(63,169,255,0.08)', border: `1px solid rgba(63,169,255,0.2)` }}>
                <p className="text-xs mb-1" style={{ color: COLORS.blue }}>Brecha: visibilidad</p>
                <p className="text-sm text-white leading-snug">
                  A2 “Tu Ruta” · tu primera misión (30 días)
                </p>
                <p className="text-xs mt-1.5" style={{ color: COLORS.textMuted }}>
                  Define tu foco y tus 3 prioridades clave para los próximos 30 días.
                </p>
              </div>
              <p className="text-[11px]" style={{ color: COLORS.textFaint }}>
                Perfil Vivo · se actualiza con tu avance
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
