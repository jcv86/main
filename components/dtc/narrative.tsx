'use client'

import React from 'react'
import { Brain, Map, Dumbbell, Target, AlertCircle, Compass } from 'lucide-react'
import { COLORS, GradientText, Eyebrow, Reveal } from './theme'

const PROBLEMS = [
  {
    icon: Compass,
    title: '“No sé por dónde empezar.”',
    desc: 'Mucho ruido, ningún punto de partida claro ni un orden que se sostenga.',
  },
  {
    icon: AlertCircle,
    title: 'Tests y cursos que no se conectan.',
    desc: 'Diagnósticos que terminan en un PDF y no se traducen en una ruta concreta.',
  },
  {
    icon: Target,
    title: 'Decisiones a ciegas.',
    desc: 'Avanzar sin leer el entorno ni medir el progreso, repitiendo lo mismo.',
  },
]

const SOLUTION = [
  { icon: Brain, title: 'Entiende', desc: 'Lee tus cualidades, patrones, contexto y punto de partida real.', color: COLORS.purple },
  { icon: Map, title: 'Ordena', desc: 'Convierte el diagnóstico en una ruta con foco y prioridades.', color: COLORS.blue },
  { icon: Dumbbell, title: 'Entrena', desc: 'Practica habilidades reales con simulaciones y feedback observable.', color: '#f472b6' },
  { icon: Target, title: 'Contextualiza', desc: 'Te da criterio para leer oportunidades, señales y entorno.', color: COLORS.teal },
]

export default function Narrative() {
  return (
    <>
      {/* TESIS */}
      <section className="relative py-24 border-t" style={{ borderColor: COLORS.border }}>
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <Eyebrow>Nuestra tesis</Eyebrow>
            <h2 className="text-3xl md:text-[2.6rem] font-bold leading-[1.12] tracking-tight text-balance text-white">
              No partimos de la vacante. <GradientText>Partimos de ti.</GradientText>
            </h2>
            <p className="mt-6 text-lg leading-relaxed" style={{ color: COLORS.textMuted }}>
              La empleabilidad no es el punto de partida: es la consecuencia visible de entender cómo
              funcionas, ordenar tu foco, entrenar lo que importa y leer tu entorno con criterio.
            </p>
          </Reveal>
        </div>
      </section>

      {/* PROBLEMA */}
      <section className="relative py-24 border-t" style={{ borderColor: COLORS.border }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-2xl mx-auto mb-14">
            <Eyebrow>El problema</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight text-balance text-white">
              El problema no es la falta de opciones. Es la falta de claridad.
            </h2>
            <p className="mt-4 text-base leading-relaxed" style={{ color: COLORS.textMuted }}>
              La mayoría no está estancada por pereza ni por falta de información: está saturada de consejos
              genéricos, tests sueltos y plataformas que parten desde la vacante, no desde la persona.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-3 gap-5">
            {PROBLEMS.map((p, i) => {
              const Icon = p.icon
              return (
                <Reveal key={p.title} delay={i * 100}>
                  <div
                    className="h-full rounded-2xl p-6"
                    style={{ border: `1px solid rgba(248,113,113,0.18)`, background: 'rgba(248,113,113,0.04)' }}
                  >
                    <span
                      className="flex h-11 w-11 items-center justify-center rounded-xl mb-4"
                      style={{ background: 'rgba(248,113,113,0.12)', border: `1px solid rgba(248,113,113,0.25)` }}
                    >
                      <Icon className="h-5 w-5 text-red-400" />
                    </span>
                    <h3 className="text-lg font-semibold text-white mb-2">{p.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: COLORS.textMuted }}>{p.desc}</p>
                  </div>
                </Reveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* SOLUCION */}
      <section className="relative py-24 border-t" style={{ borderColor: COLORS.border }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-2xl mx-auto mb-14">
            <Eyebrow>La solución</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight text-balance text-white">
              DTC parte desde ti, <GradientText>no desde la vacante.</GradientText>
            </h2>
            <p className="mt-4 text-base leading-relaxed" style={{ color: COLORS.textMuted }}>
              Un sistema AI-first humano que primero te entiende, luego ordena tu avance, después te hace
              practicar y, finalmente, te da criterio. La IA es el motor que personaliza todo.
            </p>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SOLUTION.map((s, i) => {
              const Icon = s.icon
              return (
                <Reveal key={s.title} delay={i * 90}>
                  <div
                    className="group h-full rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
                    style={{ border: `1px solid ${COLORS.border}`, background: COLORS.cardBg }}
                  >
                    <span
                      className="flex h-12 w-12 items-center justify-center rounded-xl mb-4 transition-transform group-hover:scale-110"
                      style={{ background: `${s.color}1a`, border: `1px solid ${s.color}40` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: s.color }} />
                    </span>
                    <h3 className="text-lg font-semibold text-white mb-2">{s.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: COLORS.textMuted }}>{s.desc}</p>
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
