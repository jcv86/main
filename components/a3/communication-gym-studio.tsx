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
  Mic,
  Pause,
  Play,
  RotateCcw,
  Target,
  Volume2,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { completeA3Module } from '@/lib/a3/client-completion'
import { getActiveA3Module } from '@/lib/a3/active-module'
import {
  COMMUNICATION_GYM_DRAFT_KEY,
  EMPTY_COMMUNICATION_GYM_DRAFT,
  SAMPLE_COMMUNICATION_GYM,
  countCommunicationWords,
  type CommunicationGymContext,
  type CommunicationGymDraft,
} from '@/lib/a3/communication-gym'
import { validateCommunicationGymSubmission } from '@/lib/a3/communication-gym-validation'

interface ContextPayload {
  success?: boolean
  context?: CommunicationGymContext
  error?: string
}

type DurationField =
  | 'introDurationSeconds'
  | 'motivationDurationSeconds'
  | 'improvedDurationSeconds'

type TimedField = DurationField | `pause-${number}`

const moduleDefinition = getActiveA3Module('communication-gym')

function formatSeconds(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  const remainder = seconds % 60
  return `${minutes}:${remainder.toString().padStart(2, '0')}`
}

const assessmentOptions: Record<string, string[]> = {
  paceAssessment: ['rápido', 'estable', 'lento'],
  clarityAssessment: ['difusa', 'comprensible', 'clara'],
  fillerAssessment: ['muchos', 'algunos', 'pocos'],
  confidenceAssessment: ['baja', 'media', 'alta'],
  endingAssessment: ['débil', 'adecuado', 'firme'],
}

export function CommunicationGymStudio() {
  const router = useRouter()
  const [draft, setDraft] = useState<CommunicationGymDraft>(EMPTY_COMMUNICATION_GYM_DRAFT)
  const [context, setContext] = useState<CommunicationGymContext | null>(null)
  const [contextLoading, setContextLoading] = useState(true)
  const [contextError, setContextError] = useState('')
  const [activeTimer, setActiveTimer] = useState<TimedField | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const stored = window.localStorage.getItem(COMMUNICATION_GYM_DRAFT_KEY)
    if (stored) {
      try {
        setDraft({ ...EMPTY_COMMUNICATION_GYM_DRAFT, ...JSON.parse(stored) })
      } catch {
        window.localStorage.removeItem(COMMUNICATION_GYM_DRAFT_KEY)
      }
    }

    fetch('/api/a3/module-context/communication-gym', { credentials: 'include' })
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
    window.localStorage.setItem(COMMUNICATION_GYM_DRAFT_KEY, JSON.stringify(draft))
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
    return validateCommunicationGymSubmission(moduleDefinition, [], draft, context)
  }, [context, draft])

  const progress = validation?.criteria.length
    ? Math.round(
        (validation.criteria.filter((criterion) => criterion.met).length /
          validation.criteria.length) *
          100,
      )
    : 0

  const update = <K extends keyof CommunicationGymDraft>(
    key: K,
    value: CommunicationGymDraft[K],
  ) => setDraft((current) => ({ ...current, [key]: value }))

  const startTimer = (field: TimedField) => {
    if (activeTimer) return
    setElapsedSeconds(0)
    setActiveTimer(field)
  }

  const stopTimer = () => {
    if (!activeTimer) return
    const seconds = Math.max(1, elapsedSeconds)
    if (activeTimer.startsWith('pause-')) {
      const index = Number(activeTimer.split('-')[1])
      setDraft((current) => {
        const pauses = [...current.pauseDurations]
        pauses[index] = seconds
        return { ...current, pauseDurations: pauses }
      })
    } else {
      update(activeTimer as DurationField, seconds)
    }
    setActiveTimer(null)
    setElapsedSeconds(0)
  }

  const prefillFromPractice = () => {
    if (!context) return
    setDraft((current) => ({
      ...current,
      introScript: context.introApproved || current.introScript,
      motivationScript: context.motivationApproved || current.motivationScript,
      improvedScript: context.introApproved || current.improvedScript,
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
      window.localStorage.removeItem(COMMUNICATION_GYM_DRAFT_KEY)
      router.push('/despega/a3?completed=communication-gym')
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'No pudimos completar el gimnasio.')
    } finally {
      setSubmitting(false)
    }
  }

  const timedPractice = (
    title: string,
    field: 'introScript' | 'motivationScript' | 'improvedScript',
    durationField: DurationField,
    minimumWords: number,
    range: string,
  ) => {
    const isActive = activeTimer === durationField
    return (
      <Card className="space-y-4 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold">{title}</h2>
            <p className="text-sm text-muted-foreground">Habla en voz alta y registra el tiempo real. Rango: {range}.</p>
          </div>
          <Badge variant="outline">
            {draft[durationField] ? formatSeconds(draft[durationField]) : 'Sin tiempo'}
          </Badge>
        </div>
        <Textarea
          value={draft[field]}
          onChange={(event) => update(field, event.target.value)}
          className="min-h-36"
          placeholder="Prepara el guion que vas a decir…"
        />
        <p className="text-xs text-muted-foreground">
          {countCommunicationWords(draft[field])} palabras · mínimo {minimumWords}
        </p>
        <div className="flex gap-2">
          <Button
            variant={isActive ? 'destructive' : 'outline'}
            onClick={isActive ? stopTimer : () => startTimer(durationField)}
            disabled={Boolean(activeTimer && !isActive)}
          >
            {isActive ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            {isActive ? `Detener · ${formatSeconds(elapsedSeconds)}` : 'Iniciar práctica'}
          </Button>
          {draft[durationField] > 0 ? (
            <Button variant="ghost" onClick={() => update(durationField, 0)}>
              <RotateCcw className="mr-2 h-4 w-4" /> Repetir
            </Button>
          ) : null}
        </div>
      </Card>
    )
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
          <Badge variant="outline">Día 58 · 140 XP</Badge>
        </div>

        <section className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Volume2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Gimnasio de Comunicación</h1>
              <p className="text-muted-foreground">Ritmo, pausas, claridad y cierre.</p>
            </div>
          </div>
          <p className="max-w-3xl text-muted-foreground">
            Esta experiencia mide práctica oral y reflexión; no simula una grabación inexistente. El audio puede practicarse en voz alta y el sistema conserva tiempos, guiones y observaciones verificables.
          </p>
        </section>

        <Card className="space-y-4 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-semibold">Contexto verificado</p>
              <p className="text-sm text-muted-foreground">Recuperado desde la Sala de Práctica y la oferta analizada.</p>
            </div>
            <Button variant="outline" onClick={prefillFromPractice} disabled={!context || contextLoading}>
              <Target className="mr-2 h-4 w-4" /> Usar respuestas aprobadas
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
                <p className="mt-1 font-medium">{context?.jobTitle || 'Sin rol registrado'}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs uppercase text-muted-foreground">Empresa</p>
                <p className="mt-1 font-medium">{context?.company || 'Sin empresa registrada'}</p>
              </div>
              <div className="rounded-lg border p-3">
                <p className="text-xs uppercase text-muted-foreground">Señales</p>
                <p className="mt-1 text-sm">{context?.prioritySignals.slice(0, 3).join(' · ') || 'Sin señales registradas'}</p>
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

        {timedPractice(
          'Autopresentación cronometrada',
          'introScript',
          'introDurationSeconds',
          30,
          '20–45 segundos',
        )}
        {timedPractice(
          'Motivación cronometrada',
          'motivationScript',
          'motivationDurationSeconds',
          35,
          '30–65 segundos',
        )}

        <Card className="space-y-4 p-6">
          <div>
            <h2 className="text-xl font-semibold">Ejercicio de pausas</h2>
            <p className="text-sm text-muted-foreground">
              Antes de responder tres preguntas, inicia el cronómetro, mantén silencio entre dos y cinco segundos y deténlo.
            </p>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            {['Fortaleza principal', 'Desafío profesional', 'Por qué contratarte'].map((label, index) => {
              const timerKey = `pause-${index}` as TimedField
              const isActive = activeTimer === timerKey
              const duration = draft.pauseDurations[index] || 0
              return (
                <div key={label} className="rounded-lg border p-4">
                  <p className="font-medium">{label}</p>
                  <p className="mt-1 text-sm text-muted-foreground">Pausa registrada: {duration || '—'} s</p>
                  <Button
                    className="mt-3 w-full"
                    variant={isActive ? 'destructive' : 'outline'}
                    onClick={isActive ? stopTimer : () => startTimer(timerKey)}
                    disabled={Boolean(activeTimer && !isActive)}
                  >
                    {isActive ? <Pause className="mr-2 h-4 w-4" /> : <Clock3 className="mr-2 h-4 w-4" />}
                    {isActive ? `Detener · ${elapsedSeconds}s` : 'Medir pausa'}
                  </Button>
                </div>
              )
            })}
          </div>
        </Card>

        <Card className="space-y-4 p-6">
          <div>
            <h2 className="text-xl font-semibold">Autoevaluación de entrega</h2>
            <p className="text-sm text-muted-foreground">Describe lo observado, no lo que esperabas que ocurriera.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {Object.entries(assessmentOptions).map(([key, options]) => (
              <label key={key} className="space-y-2 text-sm font-medium">
                {key === 'paceAssessment'
                  ? 'Ritmo'
                  : key === 'clarityAssessment'
                    ? 'Claridad'
                    : key === 'fillerAssessment'
                      ? 'Muletillas'
                      : key === 'confidenceAssessment'
                        ? 'Confianza'
                        : 'Cierre'}
                <select
                  value={draft[key as keyof CommunicationGymDraft] as string}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, [key]: event.target.value }))
                  }
                  className="w-full rounded-md border bg-background px-3 py-2"
                >
                  <option value="">Seleccionar…</option>
                  {options.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </label>
            ))}
          </div>
        </Card>

        <Card className="space-y-4 p-6">
          <div>
            <h2 className="text-xl font-semibold">Segunda entrega</h2>
            <p className="text-sm text-muted-foreground">Elige un cambio observable y vuelve a practicar.</p>
          </div>
          <Textarea
            value={draft.improvementFocus}
            onChange={(event) => update('improvementFocus', event.target.value)}
            placeholder="Ejemplo: reducir muletillas y cerrar con una contribución específica…"
            className="min-h-24"
          />
          {timedPractice(
            'Versión mejorada cronometrada',
            'improvedScript',
            'improvedDurationSeconds',
            35,
            '25–60 segundos',
          )}
          <Textarea
            value={draft.reflection}
            onChange={(event) => update('reflection', event.target.value)}
            placeholder="¿Qué cambió entre la primera y la segunda entrega?"
            className="min-h-28"
          />
          <p className="text-xs text-muted-foreground">{draft.reflection.length} caracteres · mínimo 60</p>
        </Card>

        <Card className="space-y-4 p-5">
          <div className="flex flex-wrap gap-3">
            <Button variant="outline" onClick={() => setDraft(SAMPLE_COMMUNICATION_GYM)}>
              Cargar ejemplo completo
            </Button>
            <Button variant="ghost" onClick={() => setDraft(EMPTY_COMMUNICATION_GYM_DRAFT)}>
              Limpiar gimnasio
            </Button>
          </div>
          {validation?.errors.length ? (
            <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
              <p className="font-medium text-destructive">Antes de completar:</p>
              <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                {validation.errors.map((error) => <li key={error}>• {error}</li>)}
              </ul>
            </div>
          ) : null}
          {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}
          <Button className="w-full" onClick={submit} disabled={!validation?.passed || submitting || Boolean(activeTimer)}>
            {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mic className="mr-2 h-4 w-4" />}
            Completar Gimnasio de Comunicación
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            El borrador se guarda automáticamente. No se guarda audio en este módulo.
          </p>
        </Card>
      </div>
    </main>
  )
}
