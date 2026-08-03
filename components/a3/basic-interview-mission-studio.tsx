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
  Target,
  Trophy,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { completeA3Module } from '@/lib/a3/client-completion'
import { getActiveA3Module } from '@/lib/a3/active-module'
import {
  BASIC_INTERVIEW_DRAFT_KEY,
  BASIC_INTERVIEW_EVALUATION_IDS,
  EMPTY_BASIC_INTERVIEW_DRAFT,
  SAMPLE_BASIC_INTERVIEW_DRAFT,
  countBasicInterviewWords,
  toBasicInterviewDraft,
  type BasicInterviewContext,
  type BasicInterviewDraft,
  type BasicInterviewEvaluationId,
  type BasicInterviewQuestionId,
} from '@/lib/a3/basic-interview-mission'
import { validateBasicInterviewMissionSubmission } from '@/lib/a3/basic-interview-mission-validation'

const moduleDefinition = getActiveA3Module('basic-interview-mission')

const QUESTIONS: Array<{
  id: BasicInterviewQuestionId
  stage: string
  question: string
  guidance: string
  range: string
}> = [
  {
    id: 'warmup',
    stage: 'Apertura',
    question: '¿Cómo estás hoy?',
    guidance: 'Responde de manera breve, natural y profesional.',
    range: '5–20 s',
  },
  {
    id: 'introduction',
    stage: 'Presentación',
    question: 'Cuéntame sobre ti.',
    guidance: 'Identidad profesional, experiencia relevante y aporte al rol.',
    range: '25–60 s',
  },
  {
    id: 'careerWalk',
    stage: 'Trayectoria',
    question: 'Cuéntame tu recorrido profesional hasta ahora.',
    guidance: 'Prioriza transiciones que expliquen tu preparación para esta oportunidad.',
    range: '45–110 s',
  },
  {
    id: 'currentRole',
    stage: 'Experiencia reciente',
    question: '¿Cuáles son tus principales responsabilidades y resultados?',
    guidance: 'Habla de decisiones, acciones y resultados, no solo de tareas.',
    range: '30–75 s',
  },
  {
    id: 'motivation',
    stage: 'Motivación',
    question: '¿Por qué te interesa este puesto y esta empresa?',
    guidance: 'Conecta prioridades de la oferta con evidencia de tu trayectoria.',
    range: '25–60 s',
  },
  {
    id: 'departure',
    stage: 'Cambio profesional',
    question: '¿Qué te motivó a buscar una nueva oportunidad?',
    guidance: 'Mantén una explicación positiva, responsable y orientada al futuro.',
    range: '25–60 s',
  },
  {
    id: 'achievement',
    stage: 'Logro',
    question: 'Cuéntame sobre un logro del que estés particularmente orgulloso.',
    guidance: 'Usa situación, tarea, acción personal y resultado verificable.',
    range: '50–100 s',
  },
  {
    id: 'challenge',
    stage: 'Desafío',
    question: 'Describe una situación compleja y cómo la resolviste.',
    guidance: 'Explica tu acción específica y el resultado observable.',
    range: '50–100 s',
  },
  {
    id: 'teamwork',
    stage: 'Trabajo en equipo',
    question: 'Dame un ejemplo de colaboración efectiva entre personas o áreas.',
    guidance: 'Muestra tu contribución sin apropiarte del resultado del equipo.',
    range: '40–90 s',
  },
  {
    id: 'weakness',
    stage: 'Pregunta difícil',
    question: '¿Cuál es tu principal área de mejora?',
    guidance: 'Nombra una limitación real, su impacto, el cambio aplicado y el progreso.',
    range: '30–70 s',
  },
  {
    id: 'candidateQuestions',
    stage: 'Tus preguntas',
    question: '¿Qué preguntas harías sobre el rol o la empresa?',
    guidance: 'Formula al menos dos preguntas que ayuden a comprender resultados y desafíos.',
    range: '20–60 s',
  },
  {
    id: 'closing',
    stage: 'Cierre',
    question: '¿Hay algo más que quieras agregar antes de terminar?',
    guidance: 'Resume interés y contribución concreta sin repetir toda la entrevista.',
    range: '15–40 s',
  },
]

const EVALUATION_LABELS: Record<BasicInterviewEvaluationId, string> = {
  clarity: 'Claridad',
  structure: 'Estructura',
  relevance: 'Relevancia',
  confidence: 'Confianza',
  authenticity: 'Autenticidad',
}

interface ContextPayload {
  context?: BasicInterviewContext
  error?: string
}

function formatSeconds(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`
}

export function BasicInterviewMissionStudio() {
  const router = useRouter()
  const [draft, setDraft] = useState<BasicInterviewDraft>(EMPTY_BASIC_INTERVIEW_DRAFT)
  const [context, setContext] = useState<BasicInterviewContext | null>(null)
  const [contextLoading, setContextLoading] = useState(true)
  const [contextError, setContextError] = useState('')
  const [activeTimer, setActiveTimer] = useState<BasicInterviewQuestionId | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const stored = window.localStorage.getItem(BASIC_INTERVIEW_DRAFT_KEY)
    if (stored) {
      try {
        setDraft(toBasicInterviewDraft(JSON.parse(stored)))
      } catch {
        window.localStorage.removeItem(BASIC_INTERVIEW_DRAFT_KEY)
      }
    }

    fetch('/api/a3/module-context/basic-interview-mission', { credentials: 'include' })
      .then(async (response) => {
        const payload = (await response.json().catch(() => ({}))) as ContextPayload
        if (!response.ok) throw new Error(payload.error || 'No pudimos cargar el contexto.')
        setContext(payload.context || null)
      })
      .catch((error) => {
        setContextError(
          error instanceof Error ? error.message : 'No pudimos cargar el contexto.',
        )
      })
      .finally(() => setContextLoading(false))
  }, [])

  useEffect(() => {
    window.localStorage.setItem(BASIC_INTERVIEW_DRAFT_KEY, JSON.stringify(draft))
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
    return validateBasicInterviewMissionSubmission(moduleDefinition, [], draft, context)
  }, [context, draft])

  const progress = validation?.criteria.length
    ? Math.round(
        (validation.criteria.filter((criterion) => criterion.met).length /
          validation.criteria.length) *
          100,
      )
    : 0

  const updateAnswer = (
    id: BasicInterviewQuestionId,
    key: 'text' | 'durationSeconds' | 'selfRating',
    value: string | number,
  ) => {
    setDraft((current) => ({
      ...current,
      answers: {
        ...current.answers,
        [id]: { ...current.answers[id], [key]: value },
      },
    }))
  }

  const updateEvaluation = (
    id: BasicInterviewEvaluationId,
    key: 'rating' | 'observation',
    value: string | number,
  ) => {
    setDraft((current) => ({
      ...current,
      evaluation: {
        ...current.evaluation,
        [id]: { ...current.evaluation[id], [key]: value },
      },
    }))
  }

  const startTimer = (id: BasicInterviewQuestionId) => {
    if (activeTimer) return
    setElapsedSeconds(0)
    setActiveTimer(id)
  }

  const stopTimer = () => {
    if (!activeTimer) return
    updateAnswer(activeTimer, 'durationSeconds', Math.max(1, elapsedSeconds))
    setActiveTimer(null)
    setElapsedSeconds(0)
  }

  const useVerifiedContext = () => {
    if (!context) return
    setDraft((current) => ({
      ...current,
      answers: {
        ...current.answers,
        introduction: {
          ...current.answers.introduction,
          text: context.approvedIntroduction || current.answers.introduction.text,
        },
        motivation: {
          ...current.answers.motivation,
          text: context.approvedMotivation || current.answers.motivation.text,
        },
        weakness: {
          ...current.answers.weakness,
          text: context.preparedWeaknessAnswer || current.answers.weakness.text,
        },
      },
      weakestAnswer:
        context.previousWeakestAnswer || current.weakestAnswer,
      nextPracticeAction:
        context.previousImprovementAction || current.nextPracticeAction,
    }))
  }

  const submit = async () => {
    if (!moduleDefinition || !validation?.passed) return
    setSubmitting(true)
    setSubmitError('')
    try {
      const result = await completeA3Module({
        moduleId: moduleDefinition.id,
        moduleNumber: moduleDefinition.number,
        responses: [],
        deliverable: draft,
      })
      if (!result.routeCompleted) {
        throw new Error('La misión fue guardada, pero la ruta no confirmó su cierre.')
      }
      window.localStorage.removeItem(BASIC_INTERVIEW_DRAFT_KEY)
      router.push('/despega/a3?completed=basic-interview-mission&final=true')
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'No pudimos completar la misión final.',
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
          <div className="flex gap-2">
            <Badge variant="secondary">Misión final</Badge>
            <Badge variant="outline">Día 88 · 220 XP</Badge>
          </div>
        </div>

        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Misión de Entrevista Básica</h1>
              <p className="text-muted-foreground">
                Entrevista completa, informe final y cierre verificable de la ruta.
              </p>
            </div>
          </div>
          <p className="max-w-3xl text-muted-foreground">
            Integra lo construido en los nueve módulos anteriores. No se graba audio ni video:
            practica en voz alta, registra tiempos reales y conserva evidencia escrita de tu desempeño.
          </p>
        </section>

        <Card className="space-y-4 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold">Contexto completo de la ruta</p>
              <p className="text-sm text-muted-foreground">
                CV, oferta, Arquitectura de Respuestas, primera simulación y laboratorio difícil.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={useVerifiedContext}
              disabled={!context || contextLoading}
            >
              <Target className="mr-2 h-4 w-4" /> Usar evidencia verificada
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
                <p className="text-xs uppercase text-muted-foreground">Persona</p>
                <p className="mt-1 font-medium">{context?.fullName || 'Sin nombre registrado'}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs uppercase text-muted-foreground">Rol</p>
                <p className="mt-1 font-medium">{context?.targetRole || 'Sin rol registrado'}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs uppercase text-muted-foreground">Riesgo pendiente</p>
                <p className="mt-1 text-sm">{context?.remainingRisk || 'Sin riesgo pendiente registrado'}</p>
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
              {validation?.passed ? 'Lista para cerrar la ruta' : 'En desarrollo'}
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

        {QUESTIONS.map((item, index) => {
          const answer = draft.answers[item.id]
          const isActive = activeTimer === item.id
          return (
            <Card key={item.id} className="space-y-4 p-6">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase text-muted-foreground">
                    {index + 1}. {item.stage}
                  </p>
                  <h2 className="mt-1 text-xl font-semibold">{item.question}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{item.guidance}</p>
                </div>
                <Badge variant="outline">{item.range}</Badge>
              </div>
              <Textarea
                value={answer.text}
                onChange={(event) => updateAnswer(item.id, 'text', event.target.value)}
                className="min-h-32"
                placeholder="Escribe lo que dirás y practícalo en voz alta…"
              />
              <p className="text-xs text-muted-foreground">
                {countBasicInterviewWords(answer.text)} palabras · tiempo registrado{' '}
                {answer.durationSeconds ? formatSeconds(answer.durationSeconds) : '—'}
              </p>
              <div className="flex flex-wrap items-center gap-2">
                <Button
                  variant={isActive ? 'destructive' : 'outline'}
                  onClick={isActive ? stopTimer : () => startTimer(item.id)}
                  disabled={Boolean(activeTimer && !isActive)}
                >
                  {isActive ? (
                    <Pause className="mr-2 h-4 w-4" />
                  ) : (
                    <Play className="mr-2 h-4 w-4" />
                  )}
                  {isActive
                    ? `Detener · ${formatSeconds(elapsedSeconds)}`
                    : 'Iniciar respuesta'}
                </Button>
                {answer.durationSeconds > 0 ? (
                  <Button
                    variant="ghost"
                    onClick={() => updateAnswer(item.id, 'durationSeconds', 0)}
                  >
                    <RotateCcw className="mr-2 h-4 w-4" /> Repetir
                  </Button>
                ) : null}
                <label className="ml-auto flex items-center gap-2 text-sm">
                  Autoevaluación
                  <select
                    value={answer.selfRating || ''}
                    onChange={(event) =>
                      updateAnswer(item.id, 'selfRating', Number(event.target.value))
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

        <Card className="space-y-5 p-6">
          <div>
            <h2 className="text-xl font-semibold">Evaluación transversal</h2>
            <p className="text-sm text-muted-foreground">
              Puntúa cada dimensión y registra una observación concreta de la misión.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {BASIC_INTERVIEW_EVALUATION_IDS.map((id) => (
              <div key={id} className="space-y-2 rounded-lg border p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium">{EVALUATION_LABELS[id]}</p>
                  <select
                    value={draft.evaluation[id].rating || ''}
                    onChange={(event) =>
                      updateEvaluation(id, 'rating', Number(event.target.value))
                    }
                    className="rounded-md border bg-background px-3 py-2 text-sm"
                  >
                    <option value="">—</option>
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <option key={rating} value={rating}>
                        {rating}/5
                      </option>
                    ))}
                  </select>
                </div>
                <Textarea
                  value={draft.evaluation[id].observation}
                  onChange={(event) =>
                    updateEvaluation(id, 'observation', event.target.value)
                  }
                  placeholder="¿Qué observaste en esta dimensión?"
                  className="min-h-24"
                />
              </div>
            ))}
          </div>
        </Card>

        <Card className="space-y-4 p-6">
          <div>
            <h2 className="text-xl font-semibold">Informe final de ruta</h2>
            <p className="text-sm text-muted-foreground">
              Cierra la práctica con evidencia, no con una impresión general.
            </p>
          </div>
          <Textarea
            value={draft.strongestAnswer}
            onChange={(event) =>
              setDraft((current) => ({ ...current, strongestAnswer: event.target.value }))
            }
            placeholder="¿Cuál fue tu respuesta más fuerte y por qué?"
          />
          <Textarea
            value={draft.weakestAnswer}
            onChange={(event) =>
              setDraft((current) => ({ ...current, weakestAnswer: event.target.value }))
            }
            placeholder="¿Cuál fue la respuesta más débil y qué faltó?"
          />
          <Textarea
            value={draft.difficultQuestionLearning}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                difficultQuestionLearning: event.target.value,
              }))
            }
            placeholder="¿Qué aprendiste al responder la pregunta difícil?"
          />
          <Textarea
            value={draft.nextPracticeAction}
            onChange={(event) =>
              setDraft((current) => ({ ...current, nextPracticeAction: event.target.value }))
            }
            placeholder="¿Qué acción específica realizarás antes de tu próxima entrevista?"
          />
          <Textarea
            value={draft.routeReflection}
            onChange={(event) =>
              setDraft((current) => ({ ...current, routeReflection: event.target.value }))
            }
            className="min-h-32"
            placeholder="¿Qué cambió desde el inicio de Entrenamiento y qué mantendrás en entrevistas reales?"
          />
          <label className="space-y-2 text-sm font-medium">
            Estado de preparación observado
            <select
              value={draft.readinessState}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  readinessState: event.target.value as BasicInterviewDraft['readinessState'],
                }))
              }
              className="w-full rounded-md border bg-background px-3 py-2"
            >
              <option value="">Seleccionar…</option>
              <option value="ready">Preparado para entrevistas reales</option>
              <option value="targeted-practice">Preparado con práctica focalizada pendiente</option>
              <option value="repeat-mission">Conviene repetir la misión completa</option>
            </select>
          </label>
        </Card>

        <Card className="space-y-4 p-5">
          <div className="flex flex-wrap gap-3">
            <Button
              variant="outline"
              onClick={() => setDraft(SAMPLE_BASIC_INTERVIEW_DRAFT)}
            >
              Cargar ejemplo completo
            </Button>
            <Button
              variant="ghost"
              onClick={() => setDraft(EMPTY_BASIC_INTERVIEW_DRAFT)}
            >
              Limpiar misión
            </Button>
          </div>
          {validation?.errors.length ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <p className="font-medium text-destructive">Antes de cerrar la ruta:</p>
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
            Completar misión y cerrar ruta básica
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            El borrador se guarda automáticamente. El cierre, XP y desbloqueo Pro se aplican juntos.
          </p>
        </Card>
      </div>
    </main>
  )
}
