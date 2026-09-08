import Link from 'next/link'
import { ArrowRight, BarChart3, CheckCircle2, ShieldCheck, Users } from 'lucide-react'

import { Button } from '@/components/ui/button'

const pilotSteps = [
  ['1. Punto de partida', 'Definimos participantes, objetivo del piloto y señales que sí vale la pena observar.'],
  ['2. Recorrido individual', 'Cada persona avanza por A1–A4 con contexto, práctica y evidencia de su propio proceso.'],
  ['3. Seguimiento acordado', 'El equipo recibe una lectura de avance definida para el piloto, sin exponer respuestas personales.'],
  ['4. Cierre y decisión', 'Revisamos participación, aprendizajes y próximos pasos antes de ampliar el programa.'],
]

const valueCards = [
  { icon: Users, title: 'Recorrido personal', copy: 'Cada participante trabaja desde su situación, objetivo y evidencia; no desde una plantilla idéntica para todos.' },
  { icon: BarChart3, title: 'Avance trazable', copy: 'El piloto observa hitos y participación acordados, sin convertir actividad en resultados laborales garantizados.' },
  { icon: ShieldCheck, title: 'Privacidad por diseño', copy: 'Las respuestas individuales permanecen protegidas. Los reportes organizacionales requieren alcance y permisos explícitos.' },
]

export default function ParaEmpresasPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <Link href="/" className="mb-5 inline-flex text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">← Volver al inicio</Link>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-cyan">DTC para organizaciones</p>
          <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white sm:text-6xl">Desarrollo profesional con progreso observable</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/65 sm:text-xl">Diseñamos pilotos acotados para equipos que quieren fortalecer claridad, preparación y capacidad de acción. El alcance, los indicadores y la protección de datos se acuerdan antes de comenzar.</p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-20 px-4 py-16 sm:px-6 sm:py-20">
        <section aria-labelledby="value-title">
          <div className="mb-9 max-w-3xl"><p className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan">Qué aporta</p><h2 id="value-title" className="mt-2 text-3xl font-bold text-white sm:text-4xl">Un sistema que conecta reflexión y práctica</h2></div>
          <div className="grid gap-5 md:grid-cols-3">
            {valueCards.map(({ icon: Icon, title, copy }) => (
              <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.035] p-6">
                <Icon className="h-8 w-8 text-cyan" aria-hidden="true" />
                <h3 className="mt-5 text-xl font-bold text-white">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-white/60">{copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="pilot-title" className="grid gap-10 md:grid-cols-[0.8fr_1.2fr]">
          <div><p className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan">Programa piloto</p><h2 id="pilot-title" className="mt-2 text-3xl font-bold text-white">Un alcance pequeño antes de ampliar</h2><p className="mt-4 leading-relaxed text-white/60">No publicamos integraciones, precios ni resultados que todavía no hayan sido acordados y demostrados. Cada piloto define qué se entrega, cómo se mide y qué datos puede observar la organización.</p></div>
          <ol className="space-y-4">
            {pilotSteps.map(([title, copy]) => <li key={title} className="rounded-2xl border border-white/10 bg-white/[0.035] p-5"><h3 className="font-semibold text-white">{title}</h3><p className="mt-2 text-sm leading-relaxed text-white/60">{copy}</p></li>)}
          </ol>
        </section>

        <section aria-labelledby="scope-title" className="rounded-3xl border border-cyan/20 bg-gradient-to-br from-cyan/10 to-purple/10 p-7 md:p-10">
          <h2 id="scope-title" className="text-3xl font-bold text-white">Qué definimos antes de comenzar</h2>
          <ul className="mt-7 grid gap-3 md:grid-cols-2">
            {[
              'Objetivo, participantes y duración.',
              'Hitos de avance que se observarán.',
              'Acompañamiento y responsables.',
              'Privacidad de respuestas y evidencia.',
              'Soporte y recuperación ante problemas.',
              'Criterios para continuar, ajustar o cerrar.',
            ].map((item) => <li key={item} className="flex gap-3 rounded-xl border border-white/8 bg-black/15 p-4 text-sm leading-relaxed text-white/75"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-cyan" aria-hidden="true" /><span>{item}</span></li>)}
          </ul>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-8 text-center sm:p-12">
          <h2 className="text-3xl font-bold text-white">Conversemos sobre un piloto</h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/60">Cuéntanos el desafío de tu equipo. Prepararemos una propuesta con alcance, medición y responsabilidades explícitas.</p>
          <Button asChild size="lg" className="mt-7 font-semibold"><Link href="/contact">Hablar con el equipo <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
        </section>
      </div>
    </main>
  )
}
