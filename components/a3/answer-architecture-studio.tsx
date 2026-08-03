'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  FileText,
  MessageSquare,
  Save,
  Sparkles,
  Target,
  Timer,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { getActiveA3Module } from '@/lib/a3/active-module'
import { completeA3Module } from '@/lib/a3/client-completion'
import {
  ANSWER_ARCHITECTURE_DRAFT_KEY,
  EMPTY_ANSWER_ARCHITECTURE_DRAFT,
  SAMPLE_ANSWER_ARCHITECTURE,
  countAnswerWords,
  type AnswerArchitectureContext,
  type AnswerArchitectureDraft,
} from '@/lib/a3/answer-architecture'
import { validateAnswerArchitectureSubmission } from '@/lib/a3/answer-architecture-validation'

const MODULE = getActiveA3Module('answer-architecture')
if (!MODULE) throw new Error('Answer architecture module not found')

const EMPTY_CONTEXT: AnswerArchitectureContext = {
  jobTitle: '',
  company: '',
  mustHaveRequirements: [],
  likelyQuestions: [],
  priorityKeywords: [],
  cvRole: '',
  cvKeywords: [],
  cvSkills: [],
  cvAchievements: [],
  available: false,
}

interface ContextPayload {
  success?: boolean
  context?: AnswerArchitectureContext
  error?: string
}

interface CompletionSummary {
  score: number
  xpAwarded: number
  isFirstCompletion: boolean
  bestScore: number
}

const fieldClass =
  'w-full rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none transition placeholder:text-white/30 focus:border-[rgb(170,70,170)]/60'

function TextAreaField({
  label,
  description,
  value,
  onChange,
  placeholder,
  minHeight = 'min-h-36',
}: {
  label: string
  description: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  minHeight?: string
}) {
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <label className="font-medium text-white">{label}</label>
          <p className="mt-1 text-xs text-white/50">{description}</p>
        </div>
        <span className="text-xs text-white/40">{countAnswerWords(value)} palabras</span>
      </div>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className={`${fieldClass} ${minHeight}`}
      />
    </div>
  )
}

export function AnswerArchitectureStudio() {
  const router = useRouter()
  const [draft, setDraft] = useState<AnswerArchitectureDraft>(
    EMPTY_ANSWER_ARCHITECTURE_DRAFT,
  )
  const [context, setContext] = useState<AnswerArchitectureContext>(EMPTY_CONTEXT)
  const [contextLoading, setContextLoading] = useState(true)
  const [contextError, setContextError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [completion, setCompletion] = useState<CompletionSummary | null>(null)
  const [timerSeconds, setTimerSeconds] = useState<number | null>(null)

  useEffect(() => {
    const saved = window.localStorage.getItem(ANSWER_ARCHITECTURE_DRAFT_KEY)
    if (saved) {
      try {
        setDraft({
          ...EMPTY_ANSWER_ARCHITECTURE_DRAFT,
          ...(JSON.parse(saved) as Partial<AnswerArchitectureDraft>),
        })
      } catch {
        window.localStorage.removeItem(ANSWER_ARCHITECTURE_DRAFT_KEY)
      }
    }

    void fetch('/api/a3/module-context/answer-architecture', {
      credentials: 'include',
    })
      .then(async (response) => {
        const payload = (await response.json().catch(() => ({}))) as ContextPayload
        if (!response.ok) throw new Error(payload.error || 'No pudimos cargar el contexto.')
        setContext(payload.context || EMPTY_CONTEXT)
      })
      .catch((error: unknown) => {
        setContextError(
          error instanceof Error ? error.message : 'No pudimos cargar el contexto.',
        )
      })
      .finally(() => setContextLoading(false))
  }, [])

  useEffect(() => {
    window.localStorage.setItem(ANSWER_ARCHITECTURE_DRAFT_KEY, JSON.stringify(draft))
  }, [draft])

  useEffect(() => {
    if (timerSeconds === null || timerSeconds <= 0) return
    const timer = window.setInterval(() => {
      setTimerSeconds((current) => {
        if (current === null || current <= 1) {
          window.clearInterval(timer)
          return null
        }
        return current - 1
      })
    }, 1000)
    return () => window.clearInterval(timer)
  }, [timerSeconds])

  const validation = useMemo(
    () => validateAnswerArchitectureSubmission(MODULE, [], draft, context),
    [draft, context],
  )

  const update = (key: keyof AnswerArchitectureDraft, value: string) => {
    setDraft((current) => ({ ...current, [key]: value }))
    setSubmitError(null)
    setCompletion(null)
  }

  const handleSubmit = async () => {
    if (!validation.passed || contextLoading || contextError) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const result = await completeA3Module({
        moduleId: 'answer-architecture',
        moduleNumber: 5,
        responses: Object.values(draft),
        deliverable: draft,
      })
      window.localStorage.removeItem(ANSWER_ARCHITECTURE_DRAFT_KEY)
      setCompletion({
        score: result.score || validation.score,
        xpAwarded: result.xpAwarded || 0,
        isFirstCompletion: Boolean(result.isFirstCompletion),
        bestScore: result.bestScore || result.score || validation.score,
      })
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : 'No pudimos completar el entrenamiento.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  const contextTags = [
    ...context.mustHaveRequirements.slice(0, 4),
    ...context.priorityKeywords.slice(0, 4),
  ].filter(Boolean)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-5xl space-y-8 px-4 py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link href="/despega/a3">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Entrenamiento
            </Button>
          </Link>
          <div className="flex items-center gap-2">
            <Badge variant="outline">Checkpoint Día 43</Badge>
            <Badge className="bg-[rgba(170,70,170,0.2)] text-[rgb(210,145,210)]">
              120 XP
            </Badge>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[rgba(170,70,170,0.15)]">
              <MessageSquare className="h-6 w-6 text-[rgb(200,130,200)]" />
            </div>
            <div>
              <p className="text-sm text-white/50">Entrenamiento · Módulo 5</p>
              <h1 className="text-3xl font-bold text-white">Arquitectura de Respuestas</h1>
            </div>
          </div>
          <p className="max-w-3xl text-white/65">
            Convierte tu CV y la oferta analizada en respuestas claras, verificables y adaptables
            a distintos tiempos de entrevista.
          </p>
        </div>

        <Card className="rounded-[2px] border-white/10 bg-white/[0.03] p-5">
          <div className="flex items-start gap-3">
            <Target className="mt-0.5 h-5 w-5 text-[rgb(80,160,170)]" />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="font-medium text-white">Contexto verificado</p>
                  <p className="text-sm text-white/50">
                    Recuperado del CV y del Decodificador de Ofertas; no se puntúa desde datos inventados en el navegador.
                  </p>
                </div>
                {contextLoading && <Badge variant="outline">Cargando</Badge>}
                {!contextLoading && context.available && (
                  <Badge className="bg-emerald-500/15 text-emerald-300">Disponible</Badge>
                )}
              </div>

              {contextError && (
                <div className="mt-4 flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
                  <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                  {contextError}
                </div>
              )}

              {!contextLoading && !contextError && (
                <div className="mt-4 space-y-4">
                  <div className="grid gap-3 md:grid-cols-3">
                    <div className="rounded-lg bg-black/20 p-3">
                      <p className="text-xs uppercase tracking-wide text-white/40">Oferta</p>
                      <p className="mt-1 text-sm font-medium text-white">
                        {context.jobTitle || 'Cargo no disponible'}
                      </p>
                      <p className="text-xs text-white/50">{context.company || 'Empresa no disponible'}</p>
                    </div>
                    <div className="rounded-lg bg-black/20 p-3">
                      <p className="text-xs uppercase tracking-wide text-white/40">CV aprobado</p>
                      <p className="mt-1 text-sm font-medium text-white">
                        {context.cvRole || 'Rol objetivo no disponible'}
                      </p>
                      <p className="text-xs text-white/50">
                        {context.cvSkills.slice(0, 3).join(' · ') || 'Sin competencias recuperadas'}
                      </p>
                    </div>
                    <div className="rounded-lg bg-black/20 p-3">
                      <p className="text-xs uppercase tracking-wide text-white/40">Preguntas probables</p>
                      <p className="mt-1 text-sm text-white/70">
                        {context.likelyQuestions[0] || 'Sin preguntas recuperadas'}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {contextTags.map((tag) => (
                      <Badge key={tag} variant="outline" className="max-w-full truncate">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        <div className="grid gap-6 lg:grid-cols-[1fr_310px]">
          <div className="space-y-6">
            <Card className="rounded-[2px] border-white/10 bg-white/[0.03] p-6">
              <div className="mb-5 flex items-center gap-3">
                <FileText className="h-5 w-5 text-[rgb(200,130,200)]" />
                <div>
                  <h2 className="font-semibold text-white">Mensaje profesional</h2>
                  <p className="text-sm text-white/50">Abre con identidad, foco y motivación específica.</p>
                </div>
              </div>
              <div className="space-y-6">
                <TextAreaField
                  label="Autopresentación"
                  description="Quién eres profesionalmente, qué haces bien y qué buscas en esta oportunidad."
                  value={draft.selfIntroduction}
                  onChange={(value) => update('selfIntroduction', value)}
                  placeholder="Soy... Mi experiencia principal está en... Busco..."
                />
                <TextAreaField
                  label="Motivación por la oportunidad"
                  description="Conecta la empresa, el cargo y tu dirección profesional sin frases genéricas."
                  value={draft.motivation}
                  onChange={(value) => update('motivation', value)}
                  placeholder="Me interesa esta oportunidad porque..."
                />
              </div>
            </Card>

            <Card className="rounded-[2px] border-white/10 bg-white/[0.03] p-6">
              <div className="mb-5 flex items-center gap-3">
                <Sparkles className="h-5 w-5 text-[rgb(80,160,170)]" />
                <div>
                  <h2 className="font-semibold text-white">Evidencia y estructura</h2>
                  <p className="text-sm text-white/50">Respalda fortalezas y desafíos con hechos observables.</p>
                </div>
              </div>
              <div className="space-y-6">
                <TextAreaField
                  label="Fortaleza con evidencia"
                  description="Nombra una fortaleza relevante, muestra dónde la aplicaste y qué resultado produjo."
                  value={draft.strengthEvidence}
                  onChange={(value) => update('strengthEvidence', value)}
                  placeholder="Mi principal fortaleza es... Por ejemplo... El resultado fue..."
                />
                <TextAreaField
                  label="Historia de desafío STAR"
                  description="Incluye explícitamente Situación, Tarea, Acción y Resultado."
                  value={draft.challengeStar}
                  onChange={(value) => update('challengeStar', value)}
                  placeholder="Situación: ... Tarea: ... Acción: ... Resultado: ..."
                  minHeight="min-h-52"
                />
                <TextAreaField
                  label="¿Por qué deberían contratarte?"
                  description="Cierra conectando valor, evidencia y contribución futura al cargo."
                  value={draft.whyHire}
                  onChange={(value) => update('whyHire', value)}
                  placeholder="Puedo aportar... Ya he demostrado... En este cargo puedo..."
                />
              </div>
            </Card>

            <Card className="rounded-[2px] border-white/10 bg-white/[0.03] p-6">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Timer className="h-5 w-5 text-[rgb(200,130,200)]" />
                  <div>
                    <h2 className="font-semibold text-white">Versiones temporales</h2>
                    <p className="text-sm text-white/50">Mantén la misma idea y aumenta progresivamente la profundidad.</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {[30, 45, 60].map((seconds) => (
                    <Button
                      key={seconds}
                      variant="outline"
                      size="sm"
                      onClick={() => setTimerSeconds(seconds)}
                    >
                      <Clock className="mr-1 h-3.5 w-3.5" />
                      {seconds}s
                    </Button>
                  ))}
                </div>
              </div>

              {timerSeconds !== null && (
                <div className="mb-5 rounded-lg border border-[rgba(170,70,170,0.35)] bg-[rgba(170,70,170,0.08)] p-4 text-center">
                  <p className="text-xs uppercase tracking-wide text-white/50">Tiempo restante</p>
                  <p className="mt-1 text-3xl font-bold text-[rgb(210,145,210)]">{timerSeconds}s</p>
                </div>
              )}

              <div className="space-y-6">
                <TextAreaField
                  label="Versión de 30 segundos"
                  description="Titular profesional, fortaleza y objetivo. Debe ser la versión más breve."
                  value={draft.timing30}
                  onChange={(value) => update('timing30', value)}
                  placeholder="Versión breve..."
                />
                <TextAreaField
                  label="Versión de 45 segundos"
                  description="Añade contexto y una evidencia concreta."
                  value={draft.timing45}
                  onChange={(value) => update('timing45', value)}
                  placeholder="Versión intermedia..."
                />
                <TextAreaField
                  label="Versión de 60 segundos"
                  description="Completa el mensaje con resultado y conexión explícita con la oportunidad."
                  value={draft.timing60}
                  onChange={(value) => update('timing60', value)}
                  placeholder="Versión completa..."
                  minHeight="min-h-44"
                />
              </div>
            </Card>
          </div>

          <div className="space-y-5 lg:sticky lg:top-6 lg:self-start">
            <Card className="rounded-[2px] border-white/10 bg-white/[0.04] p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/50">Puntuación actual</p>
                  <p className="text-3xl font-bold text-white">{validation.score}/100</p>
                </div>
                <Badge
                  className={
                    validation.passed
                      ? 'bg-emerald-500/15 text-emerald-300'
                      : 'bg-amber-500/15 text-amber-200'
                  }
                >
                  {validation.passed ? 'Listo para enviar' : 'En desarrollo'}
                </Badge>
              </div>
              <Progress value={validation.score} className="mt-4 h-2" />
              <p className="mt-2 text-xs text-white/45">Umbral de finalización: 75/100</p>

              <div className="mt-5 space-y-3">
                {validation.criteria.map((criterion) => (
                  <div key={criterion.key} className="flex items-start gap-2 text-sm">
                    {criterion.met ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    ) : (
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-white/30" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className={criterion.met ? 'text-white/80' : 'text-white/50'}>
                        {criterion.label}
                      </p>
                      <p className="text-xs text-white/35">
                        {criterion.score}/{criterion.maxScore} puntos
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="rounded-[2px] border-white/10 bg-white/[0.03] p-5">
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Save className="h-4 w-4" />
                El borrador se guarda automáticamente en este dispositivo.
              </div>
              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={() => setDraft(SAMPLE_ANSWER_ARCHITECTURE)}
              >
                Cargar ejemplo completo
              </Button>
            </Card>

            {validation.errors.length > 0 && (
              <Card className="rounded-[2px] border-amber-500/25 bg-amber-500/5 p-5">
                <p className="font-medium text-amber-100">Antes de completar</p>
                <ul className="mt-3 space-y-2 text-sm text-amber-100/70">
                  {validation.errors.map((error) => (
                    <li key={error} className="flex gap-2">
                      <span>•</span>
                      <span>{error}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            )}

            {submitError && (
              <Card className="rounded-[2px] border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                {submitError}
              </Card>
            )}

            {completion ? (
              <Card className="rounded-[2px] border-emerald-500/30 bg-emerald-500/10 p-5">
                <CheckCircle2 className="h-8 w-8 text-emerald-300" />
                <h3 className="mt-3 font-semibold text-white">Entrenamiento completado</h3>
                <p className="mt-1 text-sm text-white/60">
                  Puntaje {completion.score}/100 · Mejor puntaje {completion.bestScore}/100
                </p>
                <p className="mt-1 text-sm text-emerald-200">
                  {completion.isFirstCompletion
                    ? `Obtuviste ${completion.xpAwarded} XP.`
                    : 'Repetición registrada sin duplicar XP.'}
                </p>
                <Button className="mt-4 w-full" onClick={() => router.push('/despega/a3')}>
                  Continuar en Entrenamiento
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Card>
            ) : (
              <Button
                className="w-full"
                size="lg"
                disabled={
                  !validation.passed ||
                  submitting ||
                  contextLoading ||
                  Boolean(contextError)
                }
                onClick={handleSubmit}
              >
                {submitting ? 'Validando y guardando…' : 'Completar Arquitectura de Respuestas'}
                {!submitting && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
