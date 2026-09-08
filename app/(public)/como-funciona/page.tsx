import Link from 'next/link'
import { ArrowRight, Brain, CheckCircle2, Compass, Radar, Target } from 'lucide-react'

import { Button } from '@/components/ui/button'

const stages = [
  { code: 'A1', title: 'Despega Cerebral', description: 'Reconoce cómo tiendes a decidir, comunicarte y responder a distintas situaciones profesionales.', evidence: 'Lectura personal con metodología, matices y límites explícitos.', icon: Brain },
  { code: 'A2', title: 'Tu Ruta', description: 'Convierte lo que sabes de ti en prioridades, misiones y una ruta profesional de 90 días.', evidence: 'Acciones, entregables y reflexiones guardadas en tu recorrido.', icon: Compass },
  { code: 'A3', title: 'Entrenamiento', description: 'Practica conversaciones, entrevistas y decisiones antes de enfrentar el momento real.', evidence: 'Prácticas evaluadas y oportunidades concretas de mejora.', icon: Target },
  { code: 'A4', title: 'Radar Estratégico', description: 'Relaciona señales del mercado con tu objetivo, tu evidencia y tus próximas decisiones.', evidence: 'Señales verificables, documentos y decisiones registradas.', icon: Radar },
]

const principles = [
  'Tu progreso se guarda para que puedas retomar sin empezar de nuevo.',
  'Las preferencias declaradas no se presentan como habilidades demostradas.',
  'Cada etapa explica qué significa el resultado y cuál es el siguiente paso.',
  'Tú decides: DTC organiza evidencia y contexto, no decide tu carrera por ti.',
]

export default function ComoFuncionaPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
          <Link href="/" className="mb-5 inline-flex text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">← Volver al inicio</Link>
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-cyan">Un recorrido conectado</p>
          <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white sm:text-6xl">Cómo funciona DespegaTuCarrera</h1>
          <p className="mt-5 max-w-3xl text-lg leading-relaxed text-white/65 sm:text-xl">Primero comprende tu punto de partida. Después organiza una ruta, practica y observa el mercado con evidencia. Las cuatro etapas comparten el mismo contexto para evitar respuestas genéricas o desconectadas.</p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-20 px-4 py-16 sm:px-6 sm:py-20">
        <section aria-labelledby="stages-title">
          <div className="mb-9 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan">Tu recorrido</p>
            <h2 id="stages-title" className="mt-2 text-3xl font-bold text-white sm:text-4xl">Cuatro etapas, una sola historia</h2>
            <p className="mt-3 text-white/60">El avance es secuencial para que cada nueva actividad pueda usar lo que ya construiste.</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {stages.map(({ code, title, description, evidence, icon: Icon }) => (
              <article key={code} className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 sm:p-7">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan/25 bg-cyan/10 text-cyan"><Icon className="h-6 w-6" aria-hidden="true" /></span>
                  <div className="min-w-0"><p className="text-xs font-bold uppercase tracking-[0.14em] text-cyan">{code}</p><h3 className="mt-1 text-2xl font-bold text-white">{title}</h3></div>
                </div>
                <p className="mt-5 leading-relaxed text-white/65">{description}</p>
                <div className="mt-5 rounded-xl border border-white/8 bg-black/20 p-4"><p className="text-xs font-semibold uppercase tracking-wider text-white/40">Qué conservas</p><p className="mt-2 text-sm leading-relaxed text-white/75">{evidence}</p></div>
              </article>
            ))}
          </div>
        </section>

        <section aria-labelledby="principles-title" className="grid gap-8 rounded-3xl border border-cyan/20 bg-gradient-to-br from-cyan/10 to-purple/10 p-7 md:grid-cols-[0.8fr_1.2fr] md:p-10">
          <div><p className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan">Cómo cuidamos la interpretación</p><h2 id="principles-title" className="mt-2 text-3xl font-bold text-white">Claridad sin etiquetarte</h2><p className="mt-4 leading-relaxed text-white/60">DTC es una herramienta de desarrollo personal y profesional. No es un diagnóstico clínico ni una promesa de empleo.</p></div>
          <ul className="space-y-3">
            {principles.map((principle) => <li key={principle} className="flex gap-3 rounded-xl border border-white/8 bg-black/15 p-4 text-sm leading-relaxed text-white/75"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-cyan" aria-hidden="true" /><span>{principle}</span></li>)}
          </ul>
        </section>

        <section aria-labelledby="pace-title" className="grid gap-5 md:grid-cols-3">
          <div className="md:col-span-3"><h2 id="pace-title" className="text-3xl font-bold text-white">Avanza a tu ritmo</h2></div>
          {[
            ['Primera lectura', 'A1 toma aproximadamente 10 minutos y construye la base interpretativa.'],
            ['Ruta de 90 días', 'A2 organiza el trabajo en misiones que puedes retomar y documentar.'],
            ['Continuidad', 'Tu información se guarda bajo tu cuenta y acompaña las etapas siguientes.'],
          ].map(([title, copy]) => <article key={title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"><h3 className="font-semibold text-white">{title}</h3><p className="mt-2 text-sm leading-relaxed text-white/55">{copy}</p></article>)}
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-8 text-center sm:p-12">
          <h2 className="text-3xl font-bold text-white">Empieza por conocerte mejor</h2>
          <p className="mx-auto mt-3 max-w-2xl text-white/60">Ingresa al piloto y continúa desde el punto exacto que corresponda a tu recorrido.</p>
          <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="font-semibold"><Link href="/auth/signin">Comenzar mi recorrido <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
            <Button asChild size="lg" variant="outline"><Link href="/contact">Hablar con el equipo</Link></Button>
          </div>
        </section>
      </div>
    </main>
  )
}
