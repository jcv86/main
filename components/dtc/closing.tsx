'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Plus, Minus } from 'lucide-react'
import { COLORS, GradientText, Eyebrow, Reveal, GRADIENT, GRADIENT_BTN, ROUTES } from './theme'

const FAQS = [
  {
    q: '¿Esto es solo un test de personalidad?',
    a: 'No. El diagnóstico A1 “Despega Cerebral” es el punto de partida, pero no termina ahí: se traduce en un Plan Ejecutivo y en una ruta concreta, luego en entrenamiento y en criterio para leer tu entorno.',
  },
  {
    q: '¿Me sirve si me siento estancado y no sé por dónde empezar?',
    a: 'Es justamente para eso. DTC parte desde ti, te muestra tus fortalezas y brechas, y construye una misión inicial de 30 días para que tengas un primer foco claro y alcanzable.',
  },
  {
    q: '¿Esto está pensado solo para encontrar trabajo?',
    a: 'No. DTC es desarrollo personal integral: claridad, estructura, práctica y criterio. La empleabilidad mejora como consecuencia visible de ese avance —no prometemos empleo rápido ni garantizado.',
  },
  {
    q: '¿Qué hace diferente a DTC frente a otras plataformas?',
    a: 'DTC no parte desde la vacante ni cruza palabras clave. Parte desde la persona y conecta diagnóstico, ruta, entrenamiento y radar en una sola continuidad, con la IA como motor de personalización.',
  },
  {
    q: '¿Me sirve si ya tengo experiencia laboral?',
    a: 'Sí. Con experiencia, el valor está en el foco y el criterio: entender tus patrones, ordenar tu siguiente etapa, entrenar lo que mueve la aguja y leer tu entorno.',
  },
  {
    q: '¿Qué es el “Perfil Vivo”?',
    a: 'Es una representación dinámica de ti: cualidades, objetivos, avances, habilidades entrenadas, brechas y oportunidades. Se actualiza a medida que avanzas por las etapas.',
  },
  {
    q: '¿Qué pasa con mis datos y mi privacidad?',
    a: 'Tu información se usa para personalizar tu proceso, bajo reglas de privacidad, consentimiento, trazabilidad y control humano. Tú decides qué compartes.',
  },
  {
    q: '¿DTC me garantiza un empleo?',
    a: 'No. DTC aumenta tu claridad, tu preparación y tu empleabilidad. La empleabilidad es una consecuencia del avance, no una promesa automática de empleo.',
  },
  {
    q: '¿La IA decide por mí?',
    a: 'No. La IA es el motor que te lee, ordena y propone; las decisiones siguen siendo tuyas. Buscamos darte claridad y criterio, no reemplazar tu juicio.',
  },
  {
    q: '¿Cuánto tiempo toma?',
    a: 'El diagnóstico inicial toma minutos. A partir de ahí avanzas a tu ritmo con una misión inicial de 30 días, expandible a 60 y 90 según tu contexto.',
  },
  {
    q: '¿Necesito saber de tecnología o tener un CV listo?',
    a: 'No. Empiezas desde donde estás. DTC parte de conocerte; lo demás —incluido un CV más pertinente— se construye sobre ese avance.',
  },
  {
    q: '¿Sirve para universidades, municipios o programas?',
    a: 'Sí. DTC traduce el avance de las personas en empleabilidad verificable, con trazabilidad, lo que lo hace útil para instituciones que buscan mejorar orientación e inserción.',
  },
]

const FOOTER_PRODUCT = [
  { label: 'Pruébalo en vivo', href: ROUTES.pruebaEnVivo },
  { label: 'A1 “Despega Cerebral”', href: ROUTES.diagnostico },
  { label: 'A2 “Tu Ruta”', href: ROUTES.diagnostico },
  { label: 'A3 “Entrenamiento”', href: ROUTES.diagnostico },
  { label: 'A4 “Radar Estratégico”', href: ROUTES.diagnostico },
]

const FOOTER_DTC = [
  { label: 'Empleo', href: ROUTES.empleo },
  { label: 'Para instituciones', href: ROUTES.instituciones },
  { label: 'Preguntas frecuentes', href: ROUTES.preguntas },
  { label: 'Comenzar mi diagnóstico', href: ROUTES.diagnostico },
]

export default function Closing() {
  return (
    <>
      {/* CTA FINAL */}
      <section className="relative py-28 border-t" style={{ borderColor: COLORS.border }}>
        <div
          className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 mx-auto h-72 max-w-3xl blur-3xl opacity-30"
          style={{ background: GRADIENT }}
        />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <h2 className="text-4xl md:text-5xl font-bold leading-[1.1] tracking-tight text-balance text-white">
              Da el primer paso hacia <GradientText>tu claridad.</GradientText>
            </h2>
            <p className="mt-5 text-lg leading-relaxed" style={{ color: COLORS.textMuted }}>
              Comienza con tu diagnóstico y deja que DTC ordene tu camino. Empezar toma minutos; el cambio se
              construye día a día.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                href={ROUTES.diagnostico}
                className="group inline-flex items-center justify-center gap-2 rounded-xl px-7 py-4 text-sm font-semibold text-[#05060e] transition-transform hover:scale-[1.03]"
                style={{ background: GRADIENT_BTN }}
              >
                Quiero comenzar mi diagnóstico
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href={ROUTES.diagnostico}
                className="inline-flex items-center justify-center gap-2 rounded-xl px-7 py-4 text-sm font-semibold transition-colors hover:bg-white/5"
                style={{ border: `1px solid ${COLORS.border}`, color: COLORS.text }}
              >
                Quiero empezar mi proceso
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section id="preguntas" className="relative py-24 border-t" style={{ borderColor: COLORS.border }}>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Reveal className="text-center max-w-2xl mx-auto mb-14">
            <Eyebrow>Preguntas frecuentes</Eyebrow>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight tracking-tight text-balance text-white">
              Lo que probablemente te estás <GradientText>preguntando.</GradientText>
            </h2>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-4">
            {FAQS.map((f, i) => (
              <FaqItem key={i} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative border-t pt-16 pb-10" style={{ borderColor: COLORS.border, background: '#04050b' }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
            <div>
              <Link href="/" className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl font-bold text-[#05060e] text-lg" style={{ background: GRADIENT }}>
                  D
                </span>
                <span className="text-[15px] leading-tight font-semibold text-white">
                  Despega<span className="block text-[11px] font-normal" style={{ color: COLORS.textMuted }}>TuCarrera</span>
                </span>
              </Link>
              <p className="mt-4 text-sm leading-relaxed max-w-sm" style={{ color: COLORS.textMuted }}>
                Plataforma AI-first humana que transforma autoconocimiento en empleabilidad verificable. Parte
                desde la persona, no desde la vacante.
              </p>
            </div>

            <FooterCol title="Producto" links={FOOTER_PRODUCT} />
            <FooterCol title="DTC" links={FOOTER_DTC} />
          </div>

          <div className="mt-12 pt-6 flex flex-col md:flex-row items-center justify-between gap-3" style={{ borderTop: `1px solid ${COLORS.border}` }}>
            <p className="text-xs" style={{ color: COLORS.textFaint }}>
              DespegaTuCarrera · Plataforma AI-first humana
            </p>
            <p className="text-xs text-center md:text-right" style={{ color: COLORS.textFaint }}>
              © 2026 DespegaTuCarrera. La empleabilidad aparece como consecuencia del avance; no es una promesa automática.
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="rounded-2xl overflow-hidden transition-colors"
      style={{ border: `1px solid ${open ? 'rgba(124,92,255,0.35)' : COLORS.border}`, background: COLORS.cardBg }}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="text-sm font-medium text-white">{q}</span>
        <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full" style={{ background: open ? COLORS.purple : 'rgba(255,255,255,0.06)' }}>
          {open ? <Minus className="h-3.5 w-3.5 text-white" /> : <Plus className="h-3.5 w-3.5" style={{ color: COLORS.textMuted }} />}
        </span>
      </button>
      <div
        className="grid transition-all duration-300 ease-out"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <p className="px-5 pb-4 text-sm leading-relaxed" style={{ color: COLORS.textMuted }}>{a}</p>
        </div>
      </div>
    </div>
  )
}

function FooterCol({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <p className="text-[11px] font-bold uppercase tracking-widest mb-4" style={{ color: COLORS.textFaint }}>{title}</p>
      <ul className="space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="text-sm transition-colors hover:text-white" style={{ color: COLORS.textMuted }}>
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
