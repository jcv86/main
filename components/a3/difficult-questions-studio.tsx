'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock3,
  Loader2,
  Pause,
  Play,
  RotateCcw,
  Shield,
  Target,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { completeA3Module } from '@/lib/a3/client-completion'
import { getActiveA3Module } from '@/lib/a3/active-module'
import {
  DIFFICULT_QUESTIONS_DRAFT_KEY,
  DIFFICULT_RISK_IDS,
  DIFFICULT_RISK_LABELS,
  EMPTY_DIFFICULT_QUESTIONS_DRAFT,
  PRESSURE_QUESTION_IDS,
  REQUIRED_RED_FLAG_CHECKS,
  SAMPLE_DIFFICULT_QUESTIONS_DRAFT,
  countDifficultWords,
  toDifficultQuestionsDraft,
  type DifficultQuestionsContext,
  type DifficultQuestionsDraft,
  type DifficultRiskPlan,
  type PressureQuestionId,
} from '@/lib/a3/difficult-questions'
import { validateDifficultQuestionsSubmission } from '@/lib/a3/difficult-questions-validation'

const moduleDefinition = getActiveA3Module('risk-difficult-questions-lab')

const PRESSURE_QUESTIONS: Record<
  PressureQuestionId,
  { title: string; question: string; guidance: string; range: string }
> = {
  differentiate: {
    title: 'Diferenciación',
    question: '¿Por qué deberíamos contratarte en lugar de otra persona?',
    guidance: 'Conecta una capacidad distintiva con una necesidad concreta del rol y una evidencia.',
    range: '30–70 s',
  },
  failure: {
    title: 'Fracaso y aprendizaje',
    question: 'Cuéntame sobre una ocasión en que fallaste.',
    guidance: 'Muestra el error, tu responsabilidad, la corrección y el resultado posterior.',
    range: '45–100 s',
  },
  departure: {
    title: 'Motivo de salida',
    question: '¿Por qué dejaste o quieres dejar tu trabajo actual?',
    guidance: 'Mantén un tono respetuoso y explica qué buscas construir en la siguiente etapa.',
    range: '30–70 s',
  },
}

const RED_FLAG_LABELS: Record<string, string> = {
  'no-blame': 'No culpé a jefaturas, colegas ni empresas anteriores.',
  'no-evasion': 'No evadí la pregunta ni usé absolutos poco creíbles.',
  'honest-facts': 'Separé hechos verificables de interpretaciones personales.',
  'positive-close': 'Cerré mostrando aprendizaje, preparación o una conducta actual.',
}

interface ContextPayload {
  context?: DifficultQuestionsContext
  error?: string
}

function formatSeconds(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`
}

export function DifficultQuestionsStudio() {
  const router = useRouter()
  const [draft, setDraft] = useState<DifficultQuestionsDraft>(EMPTY_DIFFICULT_QUESTIONS_DRAFT)
  const [context, setContext] = useState<DifficultQuestionsContext | null>(null)
  const [contextLoading, setContextLoading] = useState(true)
  const [contextError, setContextError] = useState('')
  const [activeTimer, setActiveTimer] = useState<PressureQuestionId | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const stored = window.localStorage.getItem(DIFFICULT_QUESTIONS_DRAFT_KEY)
    if (stored) {
      try {
        setDraft(toDifficultQuestionsDraft(JSON.parse(stored)))
      } catch {
        window.localStorage.removeItem(DIFFICULT_QUESTIONS_DRAFT_KEY)
      }
    }

    fetch('/api/a3/module-context/risk-difficult-questions-lab', {
      credentials: 'include',
    })
      .then(async (response) => {
        const payload = (await response.json().catch(() => ({}))) as ContextPayload
        if (!response.ok) throw new Error(payload.error || 'No pudimos cargar el contexto.')
        setContext(payload.context || null)
      })
      .catch((error) =>
        setContextError(error instanceof Error ? error.message : 'No pudimos cargar el contexto.'),
      )
      .finally(() => setContextLoading(false))
  }, [])

  useEffect(() => {
    window.localStorage.setItem(DIFFICULT_QUESTIONS_DRAFT_KEY, JSON.stringify(draft))
  }, [draft])

  useEffect(() => {
    if (!activeTimer) return
    intervalRef.current = setInterval(() => {
      setElapsedSeconds((current) => current + 1)
    }, 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [activeTimer])

  const validation = useMemo(() => {
    if (!moduleDefinition) return null
    return validateDifficultQuestionsSubmission(moduleDefinition, [], draft, context)
  }, [context, draft])

  const progress = validation?.criteria.length
    ? Math.round(
        (validation.criteria.filter((criterion) => criterion.met).length /
          validation.criteria.length) *
          100,
      )
    : 0

  const updateRiskPlan = (
    index: number,
    key: keyof DifficultRiskPlan,
    value: string,
  ) => {
    setDraft((current) => {
      const riskPlans = [...current.riskPlans]
      riskPlans[index] = { ...riskPlans[index], [key]: value }
      return { ...current, riskPlans }
    })
  }

  const updatePressureAnswer = (
    id: PressureQuestionId,
    key: 'text' | 'durationSeconds' | 'selfRating',
    value: string | number,
  ) => {
    setDraft((current) => ({
      ...current,
      pressureAnswers: {
        ...current.pressureAnswers,
        [id]: { ...current.pressureAnswers[id], [key]: value },
      },
    }))
  }

  const toggleRedFlagCheck = (check: string) => {
    setDraft((current) => ({
      ...current,
      redFlagChecks: current.redFlagChecks.includes(check)
        ? current.redFlagChecks.filter((item) => item !== check)
        : [...current.redFlagChecks, check],
    }))
  }

  const stopTimer = () => {
    if (!activeTimer) return
    updatePressureAnswer(activeTimer, 'durationSeconds', Math.max(1, elapsedSeconds))
    setActiveTimer(null)
    setElapsedSeconds(0)
  }

  const usePreviousLearning = () => {
    if (!context) return
    setDraft((current) => ({
      ...current,
      remainingRisk: context.previousWeakestAnswer || current.remainingRisk,
      improvementAction:
        context.previousImprovementAction || current.improvementAction,
      reflection: context.previousReflection || current.reflection,
    }))
  }

  const submit = async () => {
    if (!moduleDefinition || !validation?.passed) return
    setSubmitting(true)
    setSubmitError('')
    try {
      await completeA3Module({
        moduleId: moduleDefinition.id,
        moduleNumber: moduleDefinition.number,
        responses: [],
        deliverable: draft,
      })
      window.localStorage.removeItem(DIFFICULT_QUESTIONS_DRAFT_KEY)
      router.push('/despega/a3?completed=risk-difficult-questions-lab')
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'No pudimos completar el laboratorio.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-5xl space-y-8 px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/despega/a3">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" /> Volver a Entrenamiento
            </Button>
          </Link>
          <Badge variant="outline">Día 78 · 170 XP</Badge>
        </div>

        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Laboratorio de Preguntas Difíciles</h1>
              <p className="text-muted-foreground">
                Honestidad, responsabilidad y preparación bajo presión.
              </p>
            </div>
          </div>
          <p className="max-w-3xl text-muted-foreground">
            Prepara respuestas que expliquen hechos sensibles sin evasión ni culpabilización. El sistema conserva texto, tiempos y reflexión; no graba audio ni video.
          </p>
        </section>

        <Card className="space-y-4 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold">Contexto verificado</p>
              <p className="text-sm text-muted-foreground">
                Oferta analizada y aprendizaje de la primera simulación.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={usePreviousLearning}
              disabled={!context || contextLoading}
            >
              <Target className="mr-2 h-4 w-4" /> Recuperar aprendizaje anterior
            </Button>
          </div>
          {contextLoading ? (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Cargando contexto…
            </p>
          ) : contextError ? (
            <p className="text-sm text-destructive">{contextError}</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-lg border p-3">
                <p className="text-xs uppercase text-muted-foreground">Rol</p>
                <p className="mt-1 font-medium">{context?.targetRole || 'Sin rol registrado'}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs uppercase text-muted-foreground">Empresa</p>
                <p className="mt-1 font-medium">{context?.company || 'Sin empresa registrada'}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs uppercase text-muted-foreground">Riesgo detectado</p>
                <p className="mt-1 text-sm">
                  {context?.previousWeakestAnswer || 'Sin riesgo previo registrado'}
                </p>
              </div>
            </div>
          )}
        </Card>

        <Card className="space-y-3 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold">Progreso verificable</p>
              <p className="text-sm text-muted-foreground">
                {validation?.score || 0}/100 · mínimo 75
              </p>
            </div>
            <Badge variant={validation?.passed ? 'default' : 'secondary'}>
              {validation?.passed ? 'Listo para completar' : 'En desarrollo'}
            </Badge>
          </div>
          <Progress value={progress} />
          <div className="grid gap-2 md:grid-cols-2">
            {validation?.criteria.map((criterion) => (
              <div key={criterion.key} className="flex items-center gap-2 text-sm">
                {criterion.met ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-muted-foreground" />
                )}
                <span>{criterion.label}</span>
                <span className="ml-auto text-muted-foreground">
                  {criterion.score}/{criterion.maxScore}
                </span>
              </div>
            ))}
          </div>
        </Card>

        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold">Tres riesgos prioritarios</h2>
            <p className="text-sm text-muted-foreground">
              Elige riesgos distintos y construye cada respuesta desde hechos, responsabilidad, aprendizaje y preparación actual.
            </p>
          </div>
          {draft.riskPlans.map((plan, index) => (
            <Card key={index} className="space-y-4 p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-semibold">Riesgo {index + 1}</h3>
                <select
                  value={plan.riskId}
                  onChange={(event) => updateRiskPlan(index, 'riskId', event.target.value)}
                  className="rounded-md border bg-background px-3 py-2 text-sm"
                >
                  <option value="">Seleccionar riesgo…</option>
                  {DIFFICULT_RISK_IDS.map((riskId) => (
                    <option key={riskId} value={riskId}>
                      {DIFFICULT_RISK_LABELS[riskId]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Textarea
                  value={plan.facts}
                  onChange={(event) => updateRiskPlan(index, 'facts', event.target.value)}
                  placeholder="Hechos breves y verificables…"
                  className="min-h-24"
                />
                <Textarea
                  value={plan.accountability}
                  onChange={(event) => updateRiskPlan(index, 'accountability', event.target.value)}
                  placeholder="Responsabilidad o límite que reconoces…"
                  className="min-h-24"
                />
                <Textarea
                  value={plan.learning}
                  onChange={(event) => updateRiskPlan(index, 'learning', event.target.value)}
                  placeholder="Qué aprendiste o cambiaste…"
                  className="min-h-24"
                />
                <Textarea
                  value={plan.readyNow}
                  onChange={(event) => updateRiskPlan(index, 'readyNow', event.target.value)}
                  placeholder="Cómo actúas hoy frente a ese riesgo…"
                  className="min-h-24"
                />
              </div>
              <Textarea
                value={plan.fullAnswer}
                onChange={(event) => updateRiskPlan(index, 'fullAnswer', event.target.value)}
                placeholder="Respuesta completa para practicar en entrevista…"
                className="min-h-36"
              />
              <p className="text-xs text-muted-foreground">
                {countDifficultWords(plan.fullAnswer)} palabras · mínimo 45
              </p>
            </Card>
          ))}
        </section>

        <Card className="space-y-4 p-6">
          <div>
            <h2 className="text-xl font-semibold">Auditoría de señales de riesgo</h2>
            <p className="text-sm text-muted-foreground">
              Confirma estos controles después de releer las tres respuestas completas.
            </p>
          </div>
          <div className="space-y-3">
            {REQUIRED_RED_FLAG_CHECKS.map((check) => (
              <button
                key={check}
                type="button"
                onClick={() => toggleRedFlagCheck(check)}
                className="flex w-full items-center gap-3 rounded-lg border p-3 text-left"
              >
                {draft.redFlagChecks.includes(check) ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-muted-foreground" />
                )}
                <span className="text-sm">{RED_FLAG_LABELS[check]}</span>
              </button>
            ))}
          </div>
        </Card>

        <section className="space-y-4">
          <div>
            <h2 className="text-2xl font-semibold">Ejercicio bajo presión</h2>
            <p className="text-sm text-muted-foreground">
              Practica en voz alta, detén el cronómetro al terminar y evalúa tu entrega.
            </p>
          </div>
          {PRESSURE_QUESTION_IDS.map((id) => {
            const item = PRESSURE_QUESTIONS[id]
            const answer = draft.pressureAnswers[id]
            const isActive = activeTimer === id
            return (
              <Card key={id} className="space-y-4 p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase text-muted-foreground">{item.title}</p>
                    <h3 className="mt-1 text-xl font-semibold">{item.question}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{item.guidance}</p>
                  </div>
                  <Badge variant="outline">{item.range}</Badge>
                </div>
                <Textarea
                  value={answer.text}
                  onChange={(event) => updatePressureAnswer(id, 'text', event.target.value)}
                  className="min-h-32"
                  placeholder="Escribe lo que vas a decir y luego practícalo en voz alta…"
                />
                <p className="text-xs text-muted-foreground">
                  {countDifficultWords(answer.text)} palabras · tiempo registrado{' '}
                  {answer.durationSeconds ? formatSeconds(answer.durationSeconds) : '—'}
                </p>
                <div className="flex flex-wrap items-center gap-2">
                  <Button
                    variant={isActive ? 'destructive' : 'outline'}
                    onClick={
                      isActive
                        ? stopTimer
                        : () => {
                            setElapsedSeconds(0)
                            setActiveTimer(id)
                          }
                    }
                    disabled={Boolean(activeTimer && !isActive)}
                  >
                    {isActive ? (
                      <Pause className="mr-2 h-4 w-4" />
                    ) : (
                      <Play className="mr-2 h-4 w-4" />
                    )}
                    {isActive ? `Detener · ${formatSeconds(elapsedSeconds)}` : 'Iniciar respuesta'}
                  </Button>
                  {answer.durationSeconds > 0 ? (
                    <Button
                      variant="ghost"
                      onClick={() => updatePressureAnswer(id, 'durationSeconds', 0)}
                    >
                      <RotateCcw className="mr-2 h-4 w-4" /> Repetir
                    </Button>
                  ) : null}
                  <label className="ml-auto flex items-center gap-2 text-sm">
                    Autoevaluación
                    <select
                      value={answer.selfRating || ''}
                      onChange={(event) =>
                        updatePressureAnswer(id, 'selfRating', Number(event.target.value))
                      }
                      className="rounded-md border bg-background px-3 py-2"
                    >
                      <option value="">—</option>
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <option key={rating} value={rating}>
                          {rating}/5
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
              </Card>
            )
          })}
        </section>

        <Card className="space-y-4 p-6">
          <div>
            <h2 className="text-xl font-semibold">Debrief del laboratorio</h2>
            <p className="text-sm text-muted-foreground">
              Identifica qué ya está sólido y qué debe cambiar antes de la entrevista final.
            </p>
          </div>
          <Textarea
            value={draft.strongestResponse}
            onChange={(event) =>
              setDraft((current) => ({ ...current, strongestResponse: event.target.value }))
            }
            placeholder="¿Cuál fue tu respuesta más sólida y por qué?"
          />
          <Textarea
            value={draft.remainingRisk}
            onChange={(event) =>
              setDraft((current) => ({ ...current, remainingRisk: event.target.value }))
            }
            placeholder="¿Qué riesgo sigue abierto o poco convincente?"
          />
          <Textarea
            value={draft.improvementAction}
            onChange={(event) =>
              setDraft((current) => ({ ...current, improvementAction: event.target.value }))
            }
            placeholder="¿Qué acción concreta realizarás antes de repetir?"
          />
          <Textarea
            value={draft.reflection}
            onChange={(event) =>
              setDraft((current) => ({ ...current, reflection: event.target.value }))
            }
            className="min-h-32"
            placeholder="Reflexión final sobre honestidad, responsabilidad, evidencia y manejo de presión…"
          />
        </Card>

        <Card className="space-y-4 p-5">
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => setDraft(SAMPLE_DIFFICULT_QUESTIONS_DRAFT)}
            >
              Cargar ejemplo completo
            </Button>
            <Button
              variant="ghost"
              onClick={() => setDraft(EMPTY_DIFFICULT_QUESTIONS_DRAFT)}
            >
              Limpiar laboratorio
            </Button>
          </div>
          {validation?.errors.length ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <p className="font-medium text-destructive">Antes de completar:</p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {validation.errors.map((error) => (
                  <li key={error}>• {error}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}
          <Button
            className="w-full"
            onClick={submit}
            disabled={!validation?.passed || submitting || Boolean(activeTimer)}
          >
            {submitting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Clock3 className="mr-2 h-4 w-4" />
            )}
            Completar Laboratorio de Preguntas Difíciles
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            El borrador se guarda automáticamente. No se guarda audio ni video.
          </p>
        </Card>
      </div>
    </main>
  )
}
