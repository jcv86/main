'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AlertCircle, ArrowLeft, CheckCircle2, Clock3, Loader2, Play, Pause, RotateCcw, Target, UserRound } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Textarea } from '@/components/ui/textarea'
import { completeA3Module } from '@/lib/a3/client-completion'
import { getActiveA3Module } from '@/lib/a3/active-module'
import {
  EMPTY_FIRST_RECRUITER_DRAFT,
  FIRST_RECRUITER_DRAFT_KEY,
  FIRST_RECRUITER_QUESTION_IDS,
  SAMPLE_FIRST_RECRUITER_DRAFT,
  countFirstRecruiterWords,
  type FirstRecruiterContext,
  type FirstRecruiterDraft,
  type FirstRecruiterQuestionId,
} from '@/lib/a3/first-recruiter-simulation'
import { validateFirstRecruiterSimulationSubmission } from '@/lib/a3/first-recruiter-simulation-validation'

const moduleDefinition = getActiveA3Module('first-recruiter-simulation')

const QUESTIONS: Array<{
  id: FirstRecruiterQuestionId
  stage: string
  question: string
  guidance: string
  range: string
}> = [
  { id: 'greeting', stage: 'Apertura', question: '¿Cómo estás hoy?', guidance: 'Responde de forma breve, profesional y natural.', range: '5–20 s' },
  { id: 'introduction', stage: 'Presentación', question: 'Cuéntame sobre ti.', guidance: 'Identidad profesional, experiencia relevante y aporte al rol.', range: '25–60 s' },
  { id: 'experience', stage: 'Experiencia', question: '¿Cuál fue tu principal responsabilidad y qué resultado lograste?', guidance: 'Describe responsabilidad, acción propia y evidencia.', range: '30–75 s' },
  { id: 'motivation', stage: 'Motivación', question: '¿Por qué te interesa este puesto y esta empresa?', guidance: 'Conecta la oportunidad con evidencia real de tu trayectoria.', range: '25–60 s' },
  { id: 'strength', stage: 'Fortaleza', question: '¿Cuál es tu principal fortaleza para este rol?', guidance: 'Nombra una fortaleza y demuéstrala con un ejemplo.', range: '25–60 s' },
  { id: 'behavioral', stage: 'Conductual', question: 'Cuéntame sobre un desafío relevante que hayas resuelto.', guidance: 'Usa situación, tarea, acción personal y resultado.', range: '45–100 s' },
  { id: 'candidateQuestion', stage: 'Tu pregunta', question: '¿Qué te gustaría preguntar sobre el rol?', guidance: 'Formula una pregunta que te ayude a comprender resultados, equipo o prioridades.', range: '8–35 s' },
  { id: 'closing', stage: 'Cierre', question: '¿Hay algo más que quieras agregar?', guidance: 'Resume interés y contribución concreta.', range: '8–30 s' },
]

interface ContextPayload {
  context?: FirstRecruiterContext
  error?: string
}

function formatSeconds(seconds: number): string {
  const minutes = Math.floor(seconds / 60)
  return `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`
}

export function FirstRecruiterSimulationStudio() {
  const router = useRouter()
  const [draft, setDraft] = useState<FirstRecruiterDraft>(EMPTY_FIRST_RECRUITER_DRAFT)
  const [context, setContext] = useState<FirstRecruiterContext | null>(null)
  const [contextLoading, setContextLoading] = useState(true)
  const [contextError, setContextError] = useState('')
  const [activeTimer, setActiveTimer] = useState<FirstRecruiterQuestionId | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    const stored = window.localStorage.getItem(FIRST_RECRUITER_DRAFT_KEY)
    if (stored) {
      try {
        setDraft({ ...EMPTY_FIRST_RECRUITER_DRAFT, ...JSON.parse(stored) })
      } catch {
        window.localStorage.removeItem(FIRST_RECRUITER_DRAFT_KEY)
      }
    }

    fetch('/api/a3/module-context/first-recruiter-simulation', { credentials: 'include' })
      .then(async (response) => {
        const payload = (await response.json().catch(() => ({}))) as ContextPayload
        if (!response.ok) throw new Error(payload.error || 'No pudimos cargar el contexto.')
        setContext(payload.context || null)
      })
      .catch((error) => setContextError(error instanceof Error ? error.message : 'No pudimos cargar el contexto.'))
      .finally(() => setContextLoading(false))
  }, [])

  useEffect(() => {
    window.localStorage.setItem(FIRST_RECRUITER_DRAFT_KEY, JSON.stringify(draft))
  }, [draft])

  useEffect(() => {
    if (!activeTimer) return
    intervalRef.current = setInterval(() => setElapsedSeconds((current) => current + 1), 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [activeTimer])

  const validation = useMemo(() => {
    if (!moduleDefinition) return null
    return validateFirstRecruiterSimulationSubmission(moduleDefinition, [], draft, context)
  }, [context, draft])

  const progress = validation?.criteria.length
    ? Math.round((validation.criteria.filter((criterion) => criterion.met).length / validation.criteria.length) * 100)
    : 0

  const updateAnswer = (id: FirstRecruiterQuestionId, key: 'text' | 'durationSeconds' | 'selfRating', value: string | number) => {
    setDraft((current) => ({
      ...current,
      answers: {
        ...current.answers,
        [id]: { ...current.answers[id], [key]: value },
      },
    }))
  }

  const stopTimer = () => {
    if (!activeTimer) return
    updateAnswer(activeTimer, 'durationSeconds', Math.max(1, elapsedSeconds))
    setActiveTimer(null)
    setElapsedSeconds(0)
  }

  const useApprovedAnswers = () => {
    if (!context) return
    setDraft((current) => ({
      ...current,
      answers: {
        ...current.answers,
        introduction: { ...current.answers.introduction, text: context.approvedIntroduction || current.answers.introduction.text },
        motivation: { ...current.answers.motivation, text: context.approvedMotivation || current.answers.motivation.text },
        strength: { ...current.answers.strength, text: context.approvedStrength || current.answers.strength.text },
        behavioral: { ...current.answers.behavioral, text: context.approvedChallenge || current.answers.behavioral.text },
      },
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
      window.localStorage.removeItem(FIRST_RECRUITER_DRAFT_KEY)
      router.push('/despega/a3?completed=first-recruiter-simulation')
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : 'No pudimos completar la simulación.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto max-w-5xl space-y-8 px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Link href="/despega/a3"><Button variant="ghost" size="sm"><ArrowLeft className="mr-2 h-4 w-4" /> Volver a Entrenamiento</Button></Link>
          <Badge variant="outline">Día 68 · 160 XP</Badge>
        </div>

        <section className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10"><UserRound className="h-6 w-6 text-primary" /></div>
            <div><h1 className="text-3xl font-bold">Primera Simulación con Reclutador</h1><p className="text-muted-foreground">Una entrevista completa, cronometrada y verificable.</p></div>
          </div>
          <p className="max-w-3xl text-muted-foreground">No se simula una videollamada ni se guarda audio. Practica en voz alta, registra el tiempo real y deja evidencia escrita de lo que dijiste y aprendiste.</p>
        </section>

        <Card className="space-y-4 p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><p className="font-semibold">Contexto verificado</p><p className="text-sm text-muted-foreground">CV, oferta y respuestas aprobadas de módulos anteriores.</p></div>
            <Button variant="outline" onClick={useApprovedAnswers} disabled={!context || contextLoading}><Target className="mr-2 h-4 w-4" /> Usar respuestas aprobadas</Button>
          </div>
          {contextLoading ? <p className="flex items-center gap-2 text-sm text-muted-foreground"><Loader2 className="h-4 w-4 animate-spin" /> Cargando contexto…</p> : contextError ? <p className="text-sm text-destructive">{contextError}</p> : (
            <div className="grid gap-3 md:grid-cols-3">
              <div className="rounded-lg border p-3"><p className="text-xs uppercase text-muted-foreground">Persona</p><p className="mt-1 font-medium">{context?.fullName || 'Sin nombre registrado'}</p></div>
              <div className="rounded-lg border p-3"><p className="text-xs uppercase text-muted-foreground">Rol</p><p className="mt-1 font-medium">{context?.targetRole || 'Sin rol registrado'}</p></div>
              <div className="rounded-lg border p-3"><p className="text-xs uppercase text-muted-foreground">Empresa</p><p className="mt-1 font-medium">{context?.company || 'Sin empresa registrada'}</p></div>
            </div>
          )}
        </Card>

        <Card className="space-y-3 p-5">
          <div className="flex items-center justify-between gap-4">
            <div><p className="font-semibold">Progreso verificable</p><p className="text-sm text-muted-foreground">{validation?.score || 0}/100 · mínimo 75</p></div>
            <Badge variant={validation?.passed ? 'default' : 'secondary'}>{validation?.passed ? 'Listo para completar' : 'En desarrollo'}</Badge>
          </div>
          <Progress value={progress} />
          <div className="grid gap-2 md:grid-cols-2">
            {validation?.criteria.map((criterion) => (
              <div key={criterion.key} className="flex items-center gap-2 text-sm">
                {criterion.met ? <CheckCircle2 className="h-4 w-4 text-emerald-500" /> : <AlertCircle className="h-4 w-4 text-muted-foreground" />}
                <span>{criterion.label}</span><span className="ml-auto text-muted-foreground">{criterion.score}/{criterion.maxScore}</span>
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
                <div><p className="text-xs uppercase text-muted-foreground">{index + 1}. {item.stage}</p><h2 className="mt-1 text-xl font-semibold">{item.question}</h2><p className="mt-1 text-sm text-muted-foreground">{item.guidance}</p></div>
                <Badge variant="outline">{item.range}</Badge>
              </div>
              <Textarea value={answer.text} onChange={(event) => updateAnswer(item.id, 'text', event.target.value)} className="min-h-32" placeholder="Escribe lo que vas a decir y practícalo en voz alta…" />
              <p className="text-xs text-muted-foreground">{countFirstRecruiterWords(answer.text)} palabras · tiempo registrado {answer.durationSeconds ? formatSeconds(answer.durationSeconds) : '—'}</p>
              <div className="flex flex-wrap items-center gap-2">
                <Button variant={isActive ? 'destructive' : 'outline'} onClick={isActive ? stopTimer : () => { setElapsedSeconds(0); setActiveTimer(item.id) }} disabled={Boolean(activeTimer && !isActive)}>
                  {isActive ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}{isActive ? `Detener · ${formatSeconds(elapsedSeconds)}` : 'Iniciar respuesta'}
                </Button>
                {answer.durationSeconds > 0 ? <Button variant="ghost" onClick={() => updateAnswer(item.id, 'durationSeconds', 0)}><RotateCcw className="mr-2 h-4 w-4" /> Repetir</Button> : null}
                <label className="ml-auto flex items-center gap-2 text-sm">Autoevaluación
                  <select value={answer.selfRating || ''} onChange={(event) => updateAnswer(item.id, 'selfRating', Number(event.target.value))} className="rounded-md border bg-background px-3 py-2">
                    <option value="">—</option>{[1, 2, 3, 4, 5].map((rating) => <option key={rating} value={rating}>{rating}/5</option>)}
                  </select>
                </label>
              </div>
            </Card>
          )
        })}

        <Card className="space-y-4 p-6">
          <div><h2 className="text-xl font-semibold">Debrief de la entrevista</h2><p className="text-sm text-muted-foreground">Convierte la práctica en una mejora concreta.</p></div>
          <Textarea value={draft.strongestAnswer} onChange={(event) => setDraft((current) => ({ ...current, strongestAnswer: event.target.value }))} placeholder="¿Cuál fue tu respuesta más fuerte y por qué?" />
          <Textarea value={draft.weakestAnswer} onChange={(event) => setDraft((current) => ({ ...current, weakestAnswer: event.target.value }))} placeholder="¿Cuál fue la respuesta más débil y qué faltó?" />
          <Textarea value={draft.improvementAction} onChange={(event) => setDraft((current) => ({ ...current, improvementAction: event.target.value }))} placeholder="¿Qué acción concreta realizarás antes de repetir?" />
          <Textarea value={draft.interviewReflection} onChange={(event) => setDraft((current) => ({ ...current, interviewReflection: event.target.value }))} className="min-h-28" placeholder="Reflexión final sobre coherencia, evidencia, ritmo y cierre…" />
        </Card>

        <Card className="space-y-4 p-5">
          <div className="flex flex-wrap gap-3"><Button variant="outline" onClick={() => setDraft(SAMPLE_FIRST_RECRUITER_DRAFT)}>Cargar ejemplo completo</Button><Button variant="ghost" onClick={() => setDraft(EMPTY_FIRST_RECRUITER_DRAFT)}>Limpiar simulación</Button></div>
          {validation?.errors.length ? <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4"><p className="font-medium text-destructive">Antes de completar:</p><ul className="mt-2 space-y-1 text-sm text-muted-foreground">{validation.errors.map((error) => <li key={error}>• {error}</li>)}</ul></div> : null}
          {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}
          <Button className="w-full" onClick={submit} disabled={!validation?.passed || submitting || Boolean(activeTimer)}>{submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Clock3 className="mr-2 h-4 w-4" />} Completar Primera Simulación</Button>
          <p className="text-center text-xs text-muted-foreground">El borrador se guarda automáticamente. No se guarda audio ni video.</p>
        </Card>
      </div>
    </main>
  )
}
