'use client'

import React from 'react'
import Link from 'next/link'
import { Check, X, Users, Building2, ArrowRight, Activity, Layers, Award, Network } from 'lucide-react'
import { COLORS, GradientText, Eyebrow, Reveal, GRADIENT_BTN, ROUTES } from './theme'

const NO_ES = [
  'Un test de personalidad que termina en un PDF.',
  'Una bolsa de empleo que solo cruza palabras clave.',
  'Un curso genérico igual para todos.',
  'Un coach aislado o un chatbot lateral.',
]

const SI_ES = [
  'Un sistema AI-first humano que parte desde ti.',
  'Una continuidad real: diagnóstico → ruta → entrenamiento → radar.',
  'Personalización que de verdad cambia tu recorrido.',
  'Avance traducido en empleabilidad verificable.',
]

const PERSONAS = [
  'Te sientes estancado y no sabes por dónde empezar.',
  'Tienes experiencia, pero quieres más foco y criterio.',
  'Quieres prepararte para entrevistas y mejorar tu empleabilidad.',
]

const INSTITUCIONES = [
  'Necesitas mejorar orientación, preparación e inserción.',
  'Quieres traducir el avance en empleabilidad verificable.',
  'Buscas un sistema serio, con trazabilidad.',
]

const ROADMAP = [
  { tag: 'Próximo', title: 'Perfil Vivo', desc: 'Representación dinámica de tu avance, habilidades y oportunidades.', icon: Activity, color: COLORS.teal },
  { tag: 'Roadmap', title: 'DTC Matrix', desc: 'Capa de memoria, señales y aprendizaje para más continuidad y criterio.', icon: Layers, color: COLORS.blue },
  { tag: 'Roadmap', title: 'Sello DTC', desc: 'Habilidades comprobadas con rúbricas y trazabilidad verificable.', icon: Award, color: COLORS.purple },
  { tag: 'Roadmap avanzado', title: 'DTC Talent', desc: 'Conexión humana-asistida con oportunidades, con opt-in y consentimiento.', icon: Network, color: '#f472b6' },
]

export default function Audience() {
  return (
    <>
      {/* NO ES / SI ES */}
      <section className="relative py-24 border-t" style={{ borderColor: COLORS.border }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-2xl mx-auto mb-14">
            <Eyebrow>Qué hace diferente a DTC</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight text-balance text-white">
              No es un test, ni una bolsa de empleo, ni un coach suelto.
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-5">
            <Reveal>
              <div className="h-full rounded-2xl p-7" style={{ border: `1px solid rgba(248,113,113,0.2)`, background: 'rgba(248,113,113,0.04)' }}>
                <h3 className="text-lg font-semibold text-white mb-5">Lo que DTC no es</h3>
                <ul className="space-y-3">
                  {NO_ES.map((t) => (
                    <li key={t} className="flex gap-3 text-sm" style={{ color: COLORS.textMuted }}>
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full" style={{ background: 'rgba(248,113,113,0.15)' }}>
                        <X className="h-3 w-3 text-red-400" />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={100}>
              <div className="h-full rounded-2xl p-7" style={{ border: `1px solid rgba(54,224,192,0.25)`, background: 'rgba(54,224,192,0.05)' }}>
                <h3 className="text-lg font-semibold text-white mb-5">Lo que DTC sí es</h3>
                <ul className="space-y-3">
                  {SI_ES.map((t) => (
                    <li key={t} className="flex gap-3 text-sm" style={{ color: COLORS.text }}>
                      <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full" style={{ background: 'rgba(54,224,192,0.15)' }}>
                        <Check className="h-3 w-3" style={{ color: COLORS.teal }} />
                      </span>
                      {t}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* PARA QUIEN ES */}
      <section className="relative py-24 border-t" style={{ borderColor: COLORS.border }}>
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-2xl mx-auto mb-14">
            <Eyebrow>Para quién es</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight text-balance text-white">
              Pensado para las personas. <GradientText>Vendible para las instituciones.</GradientText>
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-5">
            <Reveal>
              <AudienceCard
                icon={Users}
                title="Personas"
                subtitle="Estudiantes, profesionales y quienes buscan reorientarse"
                items={PERSONAS}
                color={COLORS.blue}
              />
            </Reveal>
            <Reveal delay={100}>
              <AudienceCard
                icon={Building2}
                title="Instituciones"
                subtitle="Universidades, municipalidades, OTEC y programas"
                items={INSTITUCIONES}
                color={COLORS.purple}
              />
            </Reveal>
          </div>

          {/* institutional CTA */}
          <Reveal delay={150}>
            <div
              className="mt-6 rounded-2xl p-7 md:p-9 flex flex-col md:flex-row md:items-center justify-between gap-6"
              style={{ border: `1px solid ${COLORS.border}`, background: 'linear-gradient(120deg, rgba(124,92,255,0.12), rgba(63,169,255,0.06))' }}
            >
              <div>
                <h3 className="text-xl font-semibold text-white text-balance">
                  ¿Eres una universidad, municipio o programa de empleabilidad?
                </h3>
                <p className="mt-2 text-sm leading-relaxed" style={{ color: COLORS.textMuted }}>
                  Lleva orientación e inserción a tus personas con una plataforma AI-first humana.
                </p>
              </div>
              <Link
                href={ROUTES.instituciones}
                className="group inline-flex flex-shrink-0 items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-semibold text-[#05060e] transition-transform hover:scale-[1.03]"
                style={{ background: GRADIENT_BTN }}
              >
                Hablemos para tu institución
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ROADMAP */}
      <section className="relative py-24 border-t" style={{ borderColor: COLORS.border }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-2xl mx-auto mb-14">
            <Eyebrow>Visión · Roadmap</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight text-balance text-white">
              Hacia dónde <GradientText>vamos.</GradientText>
            </h2>
            <p className="mt-4 text-base leading-relaxed" style={{ color: COLORS.textMuted }}>
              Estas capas son nuestra visión de inteligencia propia. Las mostramos con transparencia: aún no
              son funcionalidades plenamente operativas, y avanzan con reglas de privacidad, consentimiento y
              trazabilidad.
            </p>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ROADMAP.map((r, i) => {
              const Icon = r.icon
              return (
                <Reveal key={r.title} delay={i * 90}>
                  <div className="h-full rounded-2xl p-6" style={{ border: `1px solid ${COLORS.border}`, background: COLORS.cardBg }}>
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className="flex h-11 w-11 items-center justify-center rounded-xl"
                        style={{ background: `${r.color}1a`, border: `1px solid ${r.color}40` }}
                      >
                        <Icon className="h-5 w-5" style={{ color: r.color }} />
                      </span>
                      <span
                        className="rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider"
                        style={{ background: `${r.color}14`, border: `1px solid ${r.color}33`, color: r.color }}
                      >
                        {r.tag}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-white mb-2">{r.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: COLORS.textMuted }}>{r.desc}</p>
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

function AudienceCard({
  icon: Icon,
  title,
  subtitle,
  items,
  color,
}: {
  icon: React.ElementType
  title: string
  subtitle: string
  items: string[]
  color: string
}) {
  return (
    <div className="h-full rounded-2xl p-7" style={{ border: `1px solid ${COLORS.border}`, background: COLORS.cardBg }}>
      <div className="flex items-center gap-3 mb-2">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl" style={{ background: `${color}1a`, border: `1px solid ${color}40` }}>
          <Icon className="h-5 w-5" style={{ color }} />
        </span>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
      </div>
      <p className="text-sm mb-5" style={{ color: COLORS.textFaint }}>{subtitle}</p>
      <ul className="space-y-3">
        {items.map((t) => (
          <li key={t} className="flex gap-3 text-sm" style={{ color: COLORS.textMuted }}>
            <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full" style={{ background: `${color}26` }}>
              <Check className="h-3 w-3" style={{ color }} />
            </span>
            {t}
          </li>
        ))}
      </ul>
    </div>
  )
}
