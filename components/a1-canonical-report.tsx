'use client'

import { Brain, CheckCircle2, Compass, Sparkles, Target } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PhaseTransitionHandler } from '@/components/phase-transition-handler'
import { CONOZCAMONOS_2_QUESTIONS } from '@/lib/conozcamonos-2-questions'

interface A1CanonicalReportProps {
  scores: Record<'D' | 'I' | 'S' | 'C', number>
  responses: Record<string, unknown>
}

const DIMENSIONS = {
  D: {
    name: 'Energía',
    strength: 'Inicias, decides y conviertes intención en movimiento.',
    tension: 'El ritmo puede adelantarse a la reflexión o al contexto de otras personas.',
  },
  I: {
    name: 'Plan Ejecutivo',
    strength: 'Comunicas dirección, conectas ideas y movilizas a otros.',
    tension: 'La amplitud de posibilidades puede competir con el foco y el cierre.',
  },
  S: {
    name: 'Relaciones',
    strength: 'Construyes confianza, continuidad y cooperación sostenida.',
    tension: 'La búsqueda de armonía puede retrasar conversaciones o decisiones necesarias.',
  },
  C: {
    name: 'Enfoque',
    strength: 'Analizas, estructuras y proteges la calidad de las decisiones.',
    tension: 'La necesidad de precisión puede extender la preparación más de lo útil.',
  },
} as const

function answerText(value: unknown): string {
  if (Array.isArray(value)) return value.join(', ')
  return typeof value === 'string' ? value.trim() : ''
}

export function A1CanonicalReport({ scores, responses }: A1CanonicalReportProps) {
  const ordered = (Object.entries(scores) as Array<[
    keyof typeof DIMENSIONS,
    number,
  ]>).sort((left, right) => right[1] - left[1])
  const primary = ordered[0]
  const secondary = ordered[1]
  const contextAnswers = CONOZCAMONOS_2_QUESTIONS.map((question) => ({
    question: question.question,
    answer: answerText(responses[String(question.id)]),
  })).filter((item) => item.answer)

  return (
    <main className="min-h-screen bg-background px-4 py-10 text-white">
      <div className="mx-auto max-w-5xl space-y-8">
        <header className="space-y-4 text-center">
          <Badge className="border-cyan-500/30 bg-cyan-500/10 text-cyan-200">
            A1 completo · Despega Cerebral
          </Badge>
          <h1 className="text-4xl font-semibold md:text-6xl">
            Tu informe integral está listo
          </h1>
          <p className="mx-auto max-w-3xl text-lg leading-relaxed text-white/65">
            Este informe combina Conozcámonos 1, tu perfil Despega Cerebral y
            Conozcámonos 2. No es una etiqueta: es la base que Tu Ruta transforma en
            acciones y evidencia.
          </p>
        </header>

        <section className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <Card className="border-cyan-500/25 bg-cyan-500/5">
            <CardHeader>
              <Brain className="h-7 w-7 text-cyan-300" />
              <CardTitle>Tu combinación principal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div>
                <p className="text-sm uppercase tracking-[0.14em] text-white/40">
                  Dimensión dominante
                </p>
                <p className="mt-2 text-3xl font-semibold text-cyan-200">
                  {DIMENSIONS[primary[0]].name} · {Math.round(primary[1])}%
                </p>
                <p className="mt-2 text-white/70">
                  {DIMENSIONS[primary[0]].strength}
                </p>
              </div>
              <div className="border-t border-white/10 pt-5">
                <p className="text-sm uppercase tracking-[0.14em] text-white/40">
                  Dimensión secundaria
                </p>
                <p className="mt-2 text-2xl font-semibold text-purple-200">
                  {DIMENSIONS[secondary[0]].name} · {Math.round(secondary[1])}%
                </p>
                <p className="mt-2 text-white/70">
                  {DIMENSIONS[secondary[0]].strength}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-purple-500/25 bg-purple-500/5">
            <CardHeader>
              <Compass className="h-7 w-7 text-purple-300" />
              <CardTitle>Lectura de avance y freno</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-relaxed text-white/70">
              <p>
                <strong className="text-white">Tu motor:</strong>{' '}
                {DIMENSIONS[primary[0]].strength}
              </p>
              <p>
                <strong className="text-white">Tensión observable:</strong>{' '}
                {DIMENSIONS[primary[0]].tension}
              </p>
              <p>
                <strong className="text-white">Contrapeso disponible:</strong>{' '}
                {DIMENSIONS[secondary[0]].strength}
              </p>
            </CardContent>
          </Card>
        </section>

        <Card className="border-white/10 bg-white/5">
          <CardHeader>
            <Sparkles className="h-7 w-7 text-amber-300" />
            <CardTitle>Tu lectura en cuatro dimensiones</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {ordered.map(([key, score]) => (
              <div key={key} className="rounded-xl border border-white/10 bg-black/20 p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-white">{DIMENSIONS[key].name}</p>
                  <span className="text-lg font-semibold text-cyan-200">
                    {Math.round(score)}%
                  </span>
                </div>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-cyan-400"
                    style={{ width: `${Math.max(0, Math.min(100, score))}%` }}
                  />
                </div>
                <p className="mt-3 text-xs leading-relaxed text-white/55">
                  {DIMENSIONS[key].strength}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-indigo-500/25 bg-indigo-500/5">
          <CardHeader>
            <Target className="h-7 w-7 text-indigo-300" />
            <CardTitle>El contexto que completa tu diagnóstico</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2">
            {contextAnswers.map((item) => (
              <div key={item.question} className="rounded-xl border border-white/10 bg-black/15 p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-indigo-200/70">
                  {item.question}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-white/70">
                  {item.answer}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            ['A1 diagnostica', 'Ya sabes cómo funcionas y cuál es tu contexto actual.'],
            ['A2 traduce', 'Tu Ruta comienza con 30 días de acciones, evidencia y revisión.'],
            ['A3 entrena', 'Desde el Día 7 aparecen checkpoints que usan lo construido antes.'],
          ].map(([title, description]) => (
            <Card key={title} className="border-emerald-500/20 bg-emerald-500/5 p-5">
              <p className="flex items-center gap-2 font-semibold text-emerald-200">
                <CheckCircle2 className="h-4 w-4" /> {title}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                {description}
              </p>
            </Card>
          ))}
        </section>

        <PhaseTransitionHandler
          currentPhase="a1"
          isComplete
          nextPhaseLabel="Continuar a la introducción de Tu Ruta"
          nextPhaseUrl="/despega/a2/intro"
        />
      </div>
    </main>
  )
}
