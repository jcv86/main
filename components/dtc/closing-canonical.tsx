'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Minus, Plus } from 'lucide-react'
import { PRODUCT_STAGE_ORDER, PRODUCT_STAGES } from '@/lib/dtc/product-language'
import { COLORS, Eyebrow, GradientText, GRADIENT, GRADIENT_BTN, Reveal, ROUTES } from './theme'

const FAQS = [
  {
    question: '¿Esto es solo un test de personalidad?',
    answer:
      'No. Despega Cerebral es el punto de partida, pero su lectura se transforma en un Plan Ejecutivo, una ruta concreta, entrenamiento y criterio para leer tu entorno.',
  },
  {
    question: '¿Me sirve si estoy estancado y no sé por dónde empezar?',
    answer:
      'Sí. DTC parte desde tu situación actual, identifica fortalezas y brechas, y construye una misión inicial de 30 días con un foco claro y alcanzable.',
  },
  {
    question: '¿Está pensado solo para encontrar trabajo?',
    answer:
      'No. DTC trabaja claridad, estructura, práctica y criterio. La empleabilidad mejora como consecuencia visible del avance; no prometemos empleo rápido ni garantizado.',
  },
  {
    question: '¿Qué hace diferente a DTC?',
    answer:
      'No parte desde una vacante ni desde palabras clave. Parte desde la persona y conecta diagnóstico, ruta, entrenamiento y radar en una sola continuidad.',
  },
  {
    question: '¿Qué es el Perfil Vivo?',
    answer:
      'Es una representación dinámica de tus cualidades, objetivos, avances, habilidades entrenadas, brechas y oportunidades. Se actualiza a medida que avanzas.',
  },
  {
    question: '¿La IA decide por mí?',
    answer:
      'No. La IA ayuda a leer, ordenar y personalizar. Las decisiones siguen siendo tuyas y el sistema busca aumentar tu claridad, no reemplazar tu juicio.',
  },
  {
    question: '¿Cuánto tiempo toma?',
    answer:
      'El diagnóstico inicial toma minutos. Después comienzas con un ciclo de 30 días, expandible a 60 y 90 según tu contexto y avance.',
  },
  {
    question: '¿Qué ocurre con mis datos?',
    answer:
      'Tu información se usa para personalizar el proceso bajo reglas de privacidad, consentimiento, trazabilidad y control humano. Tú decides qué compartes.',
  },
  {
    question: '¿DTC garantiza un empleo?',
    answer:
      'No. DTC aumenta claridad, preparación y empleabilidad. El empleo depende de múltiples factores y no es una promesa automática de la plataforma.',
  },
  {
    question: '¿Sirve para universidades, municipios o empresas?',
    answer:
      'Sí. DTC puede convertir el avance de las personas en evidencia y trazabilidad, lo que permite acompañar programas de orientación, formación e inserción.',
  },
]

const PRODUCT_LINKS = PRODUCT_STAGE_ORDER.map((stageId) => ({
  label: PRODUCT_STAGES[stageId].name,
  href: ROUTES.diagnostico,
}))

const DTC_LINKS = [
  { label: 'Pruébalo en vivo', href: ROUTES.pruebaEnVivo },
  { label: 'Empleo', href: ROUTES.empleo },
  { label: 'Para instituciones', href: ROUTES.instituciones },
  { label: 'Preguntas frecuentes', href: ROUTES.preguntas },
]

export default function CanonicalClosing() {
  return (
    <>
      <section className="relative border-t py-28" style={{ borderColor: COLORS.border }}>
        <div
          className="pointer-events-none absolute inset-x-0 top-1/2 mx-auto h-72 max-w-3xl -translate-y-1/2 opacity-30 blur-3xl"
          style={{ background: GRADIENT }}
        />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="text-balance text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl">
              Da el primer paso hacia <GradientText>tu claridad.</GradientText>
            </h2>
            <p className="mt-5 text-lg leading-relaxed" style={{ color: COLORS.textMuted }}>
              Comienza con tu diagnóstico y deja que DTC ordene el siguiente paso. Empezar toma minutos; el avance se construye día a día.
            </p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href={ROUTES.diagnostico}
                className="group inline-flex items-center justify-center gap-2 rounded-xl px-7 py-4 text-sm font-semibold text-[#05060e] transition-transform hover:scale-[1.03]"
                style={{ background: GRADIENT_BTN }}
              >
                Comenzar mi diagnóstico
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href={ROUTES.pruebaEnVivo}
                className="inline-flex items-center justify-center rounded-xl px-7 py-4 text-sm font-semibold transition-colors hover:bg-white/5"
                style={{ border: `1px solid ${COLORS.border}`, color: COLORS.text }}
              >
                Ver la experiencia
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="preguntas" className="relative border-t py-24" style={{ borderColor: COLORS.border }}>
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto mb-14 max-w-2xl text-center">
            <Eyebrow>Preguntas frecuentes</Eyebrow>
            <h2 className="text-balance text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
              Lo que probablemente te estás <GradientText>preguntando.</GradientText>
            </h2>
          </Reveal>

          <div className="grid gap-4 md:grid-cols-2">
            {FAQS.map((faq) => (
              <FaqItem key={faq.question} {...faq} />
            ))}
          </div>
        </div>
      </section>

      <footer className="relative border-t bg-[#04050b] pb-10 pt-16" style={{ borderColor: COLORS.border }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr]">
            <div>
              <Link href="/" className="flex items-center gap-2.5">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-xl text-lg font-bold text-[#05060e]"
                  style={{ background: GRADIENT }}
                >
                  D
                </span>
                <span className="text-[15px] font-semibold leading-tight text-white">
                  Despega
                  <span className="block text-[11px] font-normal" style={{ color: COLORS.textMuted }}>
                    TuCarrera
                  </span>
                </span>
              </Link>
              <p className="mt-4 max-w-sm text-sm leading-relaxed" style={{ color: COLORS.textMuted }}>
                Plataforma AI-first humana que transforma autoconocimiento en avance verificable. Parte desde la persona, no desde la vacante.
              </p>
            </div>

            <FooterColumn title="Tu recorrido" links={PRODUCT_LINKS} />
            <FooterColumn title="DTC" links={DTC_LINKS} />
          </div>

          <div
            className="mt-12 flex flex-col items-center justify-between gap-3 pt-6 md:flex-row"
            style={{ borderTop: `1px solid ${COLORS.border}` }}
          >
            <p className="text-xs" style={{ color: COLORS.textFaint }}>
              DespegaTuCarrera · Plataforma AI-first humana
            </p>
            <p className="text-center text-xs md:text-right" style={{ color: COLORS.textFaint }}>
              © 2026 DespegaTuCarrera. La empleabilidad es una consecuencia del avance, no una promesa automática.
            </p>
          </div>
        </div>
      </footer>
    </>
  )
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className="overflow-hidden rounded-2xl transition-colors"
      style={{
        border: `1px solid ${open ? 'rgba(124,92,255,0.35)' : COLORS.border}`,
        background: COLORS.cardBg,
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
        aria-expanded={open}
      >
        <span className="text-sm font-medium text-white">{question}</span>
        <span
          className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full"
          style={{ background: open ? COLORS.purple : 'rgba(255,255,255,0.06)' }}
        >
          {open ? (
            <Minus className="h-3.5 w-3.5 text-white" />
          ) : (
            <Plus className="h-3.5 w-3.5" style={{ color: COLORS.textMuted }} />
          )}
        </span>
      </button>
      <div className="grid transition-all duration-300 ease-out" style={{ gridTemplateRows: open ? '1fr' : '0fr' }}>
        <div className="overflow-hidden">
          <p className="px-5 pb-4 text-sm leading-relaxed" style={{ color: COLORS.textMuted }}>
            {answer}
          </p>
        </div>
      </div>
    </div>
  )
}

function FooterColumn({ title, links }: { title: string; links: Array<{ label: string; href: string }> }) {
  return (
    <div>
      <p className="mb-4 text-[11px] font-bold uppercase tracking-widest" style={{ color: COLORS.textFaint }}>
        {title}
      </p>
      <ul className="space-y-2.5">
        {links.map((link) => (
          <li key={link.label}>
            <Link href={link.href} className="text-sm transition-colors hover:text-white" style={{ color: COLORS.textMuted }}>
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
