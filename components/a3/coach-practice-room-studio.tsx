'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  AlertCircle,
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Loader2,
  MessageCircle,
  RefreshCw,
  Sparkles,
  Target,
  Users,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { completeA3Module } from '@/lib/a3/client-completion'
import { getActiveA3Module } from '@/lib/a3/active-module'
import { useCoaching } from '@/lib/hooks/use-coaching'
import {
  COACH_PRACTICE_DRAFT_KEY,
  COACH_PRACTICE_SESSIONS,
  EMPTY_COACH_PRACTICE_DRAFT,
  SAMPLE_COACH_PRACTICE,
  countCoachWords,
  formatCoachingFeedback,
  type CoachPracticeContext,
  type CoachPracticeDraft,
  type CoachPracticeSessionDefinition,
} from '@/lib/a3/coach-practice'
import { validateCoachPracticeSubmission } from '@/lib/a3/coach-practice-validation'

interface ContextPayload {
  success?: boolean
  context?: CoachPracticeContext
  error?: string
}

type FeedbackMap = Partial<Record<string, string>>

const moduleDefinition = getActiveA3Module('coach-practice-room')

function fieldValue(draft: CoachPracticeDraft, key: keyof CoachPracticeDraft): string {
  return draft[key]
}

export function CoachPracticeRoomStudio() {
  const router = useRouter()
  const { generateFeedback, loading: coachingLoading, error: coachingError } = useCoaching()
  const [draft, setDraft] = useState<CoachPracticeDraft>(EMPTY_COACH_PRACTICE_DRAFT)
  const [context, setContext] = useState<CoachPracticeContext | null>(null)
  const [feedback, setFeedback] = useState<FeedbackMap>({})
  const [activeFeedback, setActiveFeedback] = useState<string | null>(null)
  const [contextLoading, setContextLoading] = useState(true)
  const [contextError, setContextError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    const stored = window.localStorage.getItem(COACH_PRACTICE_DRAFT_KEY)
    if (stored) {
      try {
        setDraft({ ...EMPTY_COACH_PRACTICE_DRAFT, ...JSON.parse(stored) })
      } catch {
        window.localStorage.removeItem(COACH_PRACTICE_DRAFT_KEY)
      }
    }

    fetch('/api/a3/module-context/coach-practice-room', {
      credentials: 'include',
    })
      .then(async (response) => {
        const payload = (await response.json().catch(() => ({}))) as ContextPayload
        if (!response.ok) throw new Error(payload.error || 'No pudimos cargar el contexto.')
        setContext(payload.context || null)
      })
      .catch((error) => {
        setContextError(error instanceof Error ? error.message : 'No pudimos cargar el contexto.')
      })
      .finally(() => setContextLoading(false))
  }, [])

  useEffect(() => {
    window.localStorage.setItem(COACH_PRACTICE_DRAFT_KEY, JSON.stringify(draft))
  }, [draft])

  const validation = useMemo(() => {
    if (!moduleDefinition) return null
    return validateCoachPracticeSubmission(moduleDefinition, [], draft, context)
  }, [context, draft])

  const completedCriteria = validation?.criteria.filter((criterion) => criterion.met).length || 0
  const progress = validation?.criteria.length
    ? Math.round((completedCriteria / validation.criteria.length) * 100)
    : 0

  const updateField = (key: keyof CoachPracticeDraft, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }))
  }

  const useVerifiedAnswers = () => {
    if (!context) return
    setDraft((current) => ({
      ...current,
      introOriginal: context.answerArchitecture.selfIntroduction || current.introOriginal,
      motivationOriginal: context.answerArchitecture.motivation || current.motivationOriginal,
      challengeOriginal: context.answerArchitecture.challengeStar || current.challengeOriginal,
    }))
  }

  const requestFeedback = async (session: CoachPracticeSessionDefinition) => {
    const answer = fieldValue(draft, session.originalKey)
    if (countCoachWords(answer) < session.minimumWords) {
      setFeedback((current) => ({
        ...current,
        [session.id]: `Desarrolla primero al menos ${session.minimumWords} palabras para recibir retroalimentación útil.`,
      }))
      return
    }

    setActiveFeedback(session.id)
    const result = await generateFeedback({
      question: session.question,
      userResponse: answer,
      interviewType: 'behavioral',
      roleContext: [
        context?.jobTitle,
        context?.company,
        ...(context?.mustHaveRequirements || []),
      ]
        .filter(Boolean)
        .join(' · '),
    })

    setFeedback((current) => ({
      ...current,
      [session.id]: result.success
        ? formatCoachingFeedback(result.feedback)
        : result.error || 'No pudimos generar retroalimentación en este intento.',
    }))
    setActiveFeedback(null)
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
      window.localStorage.removeItem(COACH_PRACTICE_DRAFT_KEY)
      router.push('/despega/a3?completed=coach-practice-room')
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'No pudimos completar la práctica.')
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
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Entrenamiento
            </Button>
          </Link>
          <Badge variant="outline">Día 51 · 130 XP</Badge>
        </div>

        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Sala de Práctica del Coach</h1>
              <p className="text-muted-foreground">Responder, observar, revisar y explicar qué cambió.</p>
            </div>
          </div>
          <p className="max-w-3xl text-muted-foreground">
            Practica tres preguntas centrales con retroalimentación de IA. La evaluación final no depende de la opinión del modelo: valida la evidencia escrita, la revisión sustantiva y la estructura de tus respuestas.
          </p>
        </section>

        <Card className="space-y-4 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold">Contexto verificado</p>
              <p className="text-sm text-muted-foreground">
                Recuperado desde tu CV, la oferta decodificada y Arquitectura de Respuestas.
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={useVerifiedAnswers}
              disabled={contextLoading || !context}
            >
              <BookOpen className="mr-2 h-4 w-4" />
              Usar respuestas aprobadas como punto de partida
            </Button>
          </div>
          {contextLoading ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Cargando contexto…
            </div>
          ) : contextError ? (
            <p className="text-sm text-destructive">{contextError}</p>
          ) : (
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-lg border p-3">
                <p className="text-xs uppercase text-muted-foreground">Rol</p>
                <p className="mt-1 font-medium">{context?.jobTitle || context?.cvRole || 'Sin rol registrado'}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs uppercase text-muted-foreground">Empresa</p>
                <p className="mt-1 font-medium">{context?.company || 'Sin empresa registrada'}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs uppercase text-muted-foreground">Señales prioritarias</p>
                <p className="mt-1 text-sm">
                  {[...(context?.priorityKeywords || []), ...(context?.mustHaveRequirements || [])]
                    .slice(0, 3)
                    .join(' · ') || 'Sin señales registradas'}
                </p>
              </div>
            </div>
          )}
        </Card>

        <Card className="space-y-3 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold">Progreso verificable</p>
              <p className="text-sm text-muted-foreground">{validation?.score || 0}/100 · mínimo 75</p>
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
                <span className="ml-auto text-muted-foreground">{criterion.score}/{criterion.maxScore}</span>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          {COACH_PRACTICE_SESSIONS.map((session, index) => {
            const original = fieldValue(draft, session.originalKey)
            const improved = fieldValue(draft, session.improvedKey)
            const learning = fieldValue(draft, session.learningKey)
            const isLoading = coachingLoading && activeFeedback === session.id

            return (
              <Card key={session.id} className="space-y-5 p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 font-semibold text-primary">
                    {index + 1}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold">{session.title}</h2>
                    <p className="mt-1 text-muted-foreground">{session.question}</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      <Target className="mr-1 inline h-4 w-4" /> {session.coachFocus}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-medium">Respuesta inicial</label>
                  <Textarea
                    value={original}
                    onChange={(event) => updateField(session.originalKey, event.target.value)}
                    placeholder="Escribe la respuesta tal como la dirías hoy…"
                    className="min-h-36"
                  />
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                    <span>{countCoachWords(original)} palabras · mínimo {session.minimumWords}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => requestFeedback(session)}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <MessageCircle className="mr-2 h-4 w-4" />
                      )}
                      Pedir retroalimentación
                    </Button>
                  </div>
                </div>

                {(feedback[session.id] || (coachingError && activeFeedback === session.id)) && (
                  <div className="rounded-lg border bg-muted/40 p-4">
                    <p className="mb-2 flex items-center gap-2 font-medium">
                      <Sparkles className="h-4 w-4 text-primary" /> Retroalimentación del coach
                    </p>
                    <p className="whitespace-pre-wrap text-sm text-muted-foreground">
                      {feedback[session.id] || coachingError}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <label className="font-medium">Versión mejorada</label>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => updateField(session.improvedKey, original)}
                      disabled={!original}
                    >
                      <RefreshCw className="mr-2 h-4 w-4" /> Copiar inicial como base
                    </Button>
                  </div>
                  <Textarea
                    value={improved}
                    onChange={(event) => updateField(session.improvedKey, event.target.value)}
                    placeholder={
                      session.id === 'challenge'
                        ? 'Situación: … Tarea: … Acción: … Resultado: … Aprendizaje: …'
                        : 'Reescribe incorporando foco, evidencia y un cierre claro…'
                    }
                    className="min-h-40"
                  />
                  <p className="text-xs text-muted-foreground">
                    {countCoachWords(improved)} palabras · mínimo {session.minimumWords}
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="font-medium">Qué cambió y qué aprendiste</label>
                  <Textarea
                    value={learning}
                    onChange={(event) => updateField(session.learningKey, event.target.value)}
                    placeholder="Explica el cambio concreto entre ambas versiones…"
                    className="min-h-24"
                  />
                  <p className="text-xs text-muted-foreground">{learning.length} caracteres · mínimo 35</p>
                </div>
              </Card>
            )
          })}
        </div>

        <Card className="space-y-4 p-5">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => setDraft(SAMPLE_COACH_PRACTICE)}>
              Cargar ejemplo completo
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                setDraft(EMPTY_COACH_PRACTICE_DRAFT)
                setFeedback({})
              }}
            >
              Limpiar práctica
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

          <Button className="w-full" onClick={submit} disabled={!validation?.passed || submitting}>
            {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Completar Sala de Práctica
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            El borrador se guarda automáticamente en este dispositivo.
          </p>
        </Card>
      </div>
    </main>
  )
}
