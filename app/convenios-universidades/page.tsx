import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Brain, Compass, Dumbbell, Radar, ShieldCheck, Users } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Instituciones | Despega Tu Carrera',
  description:
    'Conoce cómo Despega Tu Carrera puede evaluarse con instituciones mediante un piloto controlado, con foco en desarrollo profesional, evidencia y aprendizaje antes de escalar.',
  alternates: {
    canonical: 'https://www.despegatucarrera.com/convenios-universidades',
  },
  openGraph: {
    title: 'Instituciones | Despega Tu Carrera',
    description:
      'Una propuesta de piloto institucional para evaluar el recorrido A1–A4 con objetivos, alcance y métricas acordadas antes de cualquier expansión.',
    url: 'https://www.despegatucarrera.com/convenios-universidades',
    type: 'website',
  },
}

const stages = [
  {
    code: 'A1',
    title: 'Comprender el punto de partida',
    description: 'Ayuda a la persona a observar patrones, preferencias y evidencia de su identidad profesional.',
    icon: Brain,
  },
  {
    code: 'A2',
    title: 'Construir una ruta',
    description: 'Convierte lo aprendido en prioridades, misiones y una ruta profesional documentada de 90 días.',
    icon: Compass,
  },
  {
    code: 'A3',
    title: 'Practicar antes del momento real',
    description: 'Permite entrenar conversaciones, entrevistas y decisiones en un entorno de práctica.',
    icon: Dumbbell,
  },
  {
    code: 'A4',
    title: 'Leer señales del entorno',
    description: 'Conecta contexto de mercado con el objetivo y la evidencia que la persona ya construyó.',
    icon: Radar,
  },
] as const

const pilotPrinciples = [
  'Definir población, objetivos y duración antes de comenzar.',
  'Usar únicamente métricas acordadas y observables; no prometer resultados de empleabilidad.',
  'Separar información individual de reportes agregados y respetar las reglas de privacidad aplicables.',
  'Evaluar experiencia, participación y utilidad percibida antes de decidir cualquier expansión.',
]

export default function UniversityPartnershipsPage() {
  return (
    <main className="min-h-screen bg-background text-foreground">
      <section className="border-b border-border">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <Link
            href="/"
            className="mb-6 inline-flex text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            ← Volver al inicio
          </Link>
          <div className="max-w-4xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan">Instituciones</p>
            <h1 className="mt-3 text-balance text-4xl font-black tracking-tight text-white sm:text-6xl">
              Evaluar DTC con evidencia antes de escalar.
            </h1>
            <p className="mt-6 max-w-3xl text-pretty text-lg leading-8 text-white/65 sm:text-xl">
              Despega Tu Carrera puede explorarse con universidades y otras instituciones mediante un piloto acotado. La propuesta es simple: definir qué queremos aprender, probar el recorrido con una población acordada y revisar evidencia real antes de tomar decisiones mayores.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/contact"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Conversar sobre un piloto
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href="/como-funciona"
                className="inline-flex min-h-12 items-center justify-center rounded-xl border border-white/10 px-6 py-3 text-sm font-semibold text-white/80 transition-colors hover:bg-white/5 hover:text-white"
              >
                Ver cómo funciona DTC
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl space-y-20 px-4 py-16 sm:px-6 sm:py-20">
        <section aria-labelledby="institution-value">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan">Qué se evalúa</p>
            <h2 id="institution-value" className="mt-2 text-3xl font-bold text-white sm:text-4xl">
              Un recorrido conectado, no una colección de tests.
            </h2>
            <p className="mt-4 leading-7 text-white/60">
              El valor a observar está en la continuidad entre las etapas: lo que una persona construye al comienzo puede acompañar su ruta, su práctica y la lectura posterior del mercado.
            </p>
          </div>

          <div className="mt-9 grid gap-5 md:grid-cols-2">
            {stages.map(({ code, title, description, icon: Icon }) => (
              <article key={code} className="rounded-2xl border border-white/10 bg-white/[0.035] p-6 sm:p-7">
                <div className="flex items-start gap-4">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan/25 bg-cyan/10 text-cyan">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-cyan">{code}</p>
                    <h3 className="mt-1 text-xl font-bold text-white">{title}</h3>
                  </div>
                </div>
                <p className="mt-5 leading-7 text-white/60">{description}</p>
              </article>
            ))}
          </div>
        </section>

        <section
          aria-labelledby="pilot-title"
          className="grid gap-8 rounded-3xl border border-cyan/20 bg-gradient-to-br from-cyan/10 to-purple/10 p-7 md:grid-cols-[0.85fr_1.15fr] md:p-10"
        >
          <div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan/20 bg-cyan/10 text-cyan">
              <Users className="h-6 w-6" aria-hidden />
            </div>
            <h2 id="pilot-title" className="mt-5 text-3xl font-bold text-white">
              Piloto primero. Escala después.
            </h2>
            <p className="mt-4 leading-7 text-white/60">
              No publicamos una licencia institucional estándar ni resultados garantizados. El alcance, la población, la duración y cualquier condición comercial se acuerdan específicamente con cada institución.
            </p>
          </div>

          <ol className="space-y-3">
            {[
              ['1', 'Definir el objetivo', 'Acordar qué pregunta queremos responder con el piloto.'],
              ['2', 'Acotar el alcance', 'Determinar población, acceso, duración y soporte necesario.'],
              ['3', 'Ejecutar con resguardos', 'Probar el recorrido sin relajar privacidad ni boundaries del producto.'],
              ['4', 'Revisar evidencia', 'Separar lo observado de las hipótesis y decidir si vale la pena continuar.'],
            ].map(([number, title, copy]) => (
              <li key={number} className="flex gap-4 rounded-xl border border-white/8 bg-black/15 p-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/8 text-sm font-bold text-cyan">
                  {number}
                </span>
                <div>
                  <h3 className="font-semibold text-white">{title}</h3>
                  <p className="mt-1 text-sm leading-6 text-white/60">{copy}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="guardrails-title" className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
            <ShieldCheck className="h-7 w-7 text-cyan" aria-hidden />
            <h2 id="guardrails-title" className="mt-4 text-2xl font-bold text-white">Qué cuidamos</h2>
            <ul className="mt-5 space-y-3">
              {pilotPrinciples.map((principle) => (
                <li key={principle} className="flex gap-3 text-sm leading-6 text-white/65">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan" />
                  <span>{principle}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
            <h2 className="text-2xl font-bold text-white">Qué no prometemos</h2>
            <p className="mt-4 leading-7 text-white/60">
              DTC no es un diagnóstico clínico, no garantiza empleo y no sustituye el criterio de profesionales o equipos de empleabilidad. Vera ayuda a organizar contexto y evidencia; la decisión permanece en la persona y la institución.
            </p>
            <p className="mt-4 leading-7 text-white/60">
              Tampoco publicamos cifras de impacto institucional, rankings, ahorros o retorno sobre inversión hasta contar con evidencia verificable que las respalde.
            </p>
          </div>
        </section>

        <section className="rounded-3xl border border-white/10 bg-white/[0.035] p-8 text-center sm:p-12">
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan">Siguiente paso</p>
          <h2 className="mt-2 text-3xl font-bold text-white">Diseñemos una prueba que realmente podamos medir.</h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-white/60">
            Si representas a una institución, podemos revisar el producto actual y definir juntos qué sería razonable validar en un piloto.
          </p>
          <Link
            href="/contact"
            className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Contactar al equipo
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </section>
      </div>
    </main>
  )
}
