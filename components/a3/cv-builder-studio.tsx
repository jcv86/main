'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  Eye,
  EyeOff,
  FileText,
  ListChecks,
  Loader2,
  Target,
  User,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { completeA3Module, type A3CompletionPayload } from '@/lib/a3/client-completion'
import { getA3Module } from '@/lib/a3/module-catalog'
import { validateA3ModuleSubmission } from '@/lib/a3/module-validation'
import {
  buildCvBuilderDeliverable,
  buildCvBuilderResponses,
  CV_BUILDER_ATS_ITEMS,
  CV_BUILDER_DRAFT_KEY,
  EMPTY_CV_BUILDER_STATE,
  normalizeCvBuilderState,
  splitCvList,
  type CvBuilderState,
} from '@/lib/a3/cv-builder'

const fieldClass =
  'w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-purple-500/60'

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <span className="text-sm font-semibold text-slate-200">{children}</span>
}

export function CvBuilderStudio() {
  const router = useRouter()
  const [state, setState] = useState<CvBuilderState>(EMPTY_CV_BUILDER_STATE)
  const [draftReady, setDraftReady] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [completion, setCompletion] = useState<A3CompletionPayload | null>(null)

  const module = useMemo(() => getA3Module('cv-builder-studio'), [])
  const deliverable = useMemo(() => buildCvBuilderDeliverable(state), [state])
  const responses = useMemo(() => buildCvBuilderResponses(state), [state])
  const validation = useMemo(
    () =>
      module
        ? validateA3ModuleSubmission(module, responses, deliverable)
        : null,
    [deliverable, module, responses],
  )

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(CV_BUILDER_DRAFT_KEY)
      if (stored) setState(normalizeCvBuilderState(JSON.parse(stored)))
    } catch (loadError) {
      console.error('[v0] Error restoring CV builder draft:', loadError)
      window.localStorage.removeItem(CV_BUILDER_DRAFT_KEY)
    } finally {
      setDraftReady(true)
    }
  }, [])

  useEffect(() => {
    if (!draftReady || completion?.success) return
    window.localStorage.setItem(CV_BUILDER_DRAFT_KEY, JSON.stringify(state))
  }, [completion?.success, draftReady, state])

  const update = <K extends keyof CvBuilderState>(
    key: K,
    value: CvBuilderState[K],
  ) => {
    setState((current) => ({ ...current, [key]: value }))
    setError(null)
  }

  const toggleAts = (id: string) => {
    update(
      'atsChecklist',
      state.atsChecklist.includes(id)
        ? state.atsChecklist.filter((item) => item !== id)
        : [...state.atsChecklist, id],
    )
  }

  const completedCriteria = validation?.criteria.filter((criterion) => criterion.met).length || 0
  const criteriaProgress = validation?.criteria.length
    ? Math.round((completedCriteria / validation.criteria.length) * 100)
    : 0
  const keywords = splitCvList(state.targetKeywords)
  const skills = splitCvList(state.skills)

  const submit = async () => {
    if (!module || !validation?.passed || submitting) return
    setSubmitting(true)
    setError(null)

    try {
      const result = await completeA3Module({
        moduleId: module.id,
        moduleNumber: module.number,
        responses,
        deliverable,
      })
      setCompletion(result)
      window.localStorage.removeItem(CV_BUILDER_DRAFT_KEY)
    } catch (submitError) {
      console.error('[v0] Error completing CV builder:', submitError)
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'No pudimos registrar el módulo.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (!module || !validation) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        El módulo no está disponible.
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white">
      <div className="mx-auto max-w-6xl space-y-7">
        <header className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Button
              variant="ghost"
              onClick={() => router.push('/despega/a3')}
              className="text-slate-300"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Volver a Entrenamiento
            </Button>
            <div className="flex flex-wrap gap-2">
              <Badge className="border-purple-500/35 bg-purple-500/15 text-purple-200">
                Módulo 3
              </Badge>
              <Badge className="border-amber-500/35 bg-amber-500/15 text-amber-200">
                {module.xp} XP
              </Badge>
              <Badge className="border-cyan-500/35 bg-cyan-500/15 text-cyan-200">
                Checkpoint Día {module.checkpointDay}
              </Badge>
            </div>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-purple-300">
                Entrenamiento · documento verificable
              </p>
              <h1 className="mt-2 text-4xl font-bold">Estudio Constructor de CV</h1>
              <p className="mt-3 max-w-3xl leading-relaxed text-slate-400">
                Convierte tu experiencia y la evidencia obtenida en Tu Ruta en una
                estructura de CV clara, trazable y preparada para filtros ATS.
              </p>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowPreview((current) => !current)}
              className="border-purple-500/40 text-purple-200"
            >
              {showPreview ? (
                <EyeOff className="mr-2 h-4 w-4" />
              ) : (
                <Eye className="mr-2 h-4 w-4" />
              )}
              {showPreview ? 'Ocultar vista previa' : 'Ver vista previa'}
            </Button>
          </div>
        </header>

        <Card className="border-slate-800 bg-slate-900/55 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white">Validación del módulo</p>
              <p className="mt-1 text-xs text-slate-500">
                Debes cumplir los seis bloques esenciales y alcanzar {validation.passScore}/100.
              </p>
            </div>
            <p
              className={`text-4xl font-bold ${
                validation.passed ? 'text-emerald-300' : 'text-amber-300'
              }`}
            >
              {validation.score}
            </p>
          </div>
          <Progress value={validation.score} className="mt-4 h-2 bg-slate-800" />
          <div className="mt-4 grid gap-2 md:grid-cols-3">
            {validation.criteria.map((criterion) => (
              <div
                key={criterion.key}
                className={`rounded-xl border px-3 py-2 ${
                  criterion.met
                    ? 'border-emerald-500/25 bg-emerald-500/10'
                    : 'border-slate-800 bg-slate-950/50'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-300">{criterion.label}</span>
                  <span
                    className={`text-xs font-semibold ${
                      criterion.met ? 'text-emerald-300' : 'text-slate-500'
                    }`}
                  >
                    {criterion.score}/{criterion.maxScore}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {showPreview && (
          <Card className="border-slate-300 bg-white p-7 text-slate-900">
            <div className="border-b border-slate-200 pb-4 text-center">
              <h2 className="text-2xl font-bold">{state.fullName || 'Tu nombre'}</h2>
              <p className="mt-1 text-sm font-medium text-slate-600">
                {state.targetRole || 'Rol objetivo'}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                {[state.email, state.phone, state.location, state.linkedin]
                  .filter(Boolean)
                  .join(' · ') || 'Correo · teléfono · ubicación · LinkedIn'}
              </p>
            </div>
            <section className="mt-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Resumen profesional
              </h3>
              <p className="mt-2 text-sm leading-relaxed">
                {state.professionalSummary || 'Tu resumen aparecerá aquí.'}
              </p>
            </section>
            <section className="mt-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Experiencia
              </h3>
              <div className="mt-2 flex justify-between gap-4 text-sm">
                <div>
                  <p className="font-semibold">{state.experienceTitle || 'Cargo'}</p>
                  <p className="text-slate-600">{state.experienceCompany || 'Empresa'}</p>
                </div>
                <p className="text-slate-500">{state.experienceDates || 'Fechas'}</p>
              </div>
              <ul className="mt-3 space-y-2 text-sm">
                {[state.achievement1, state.achievement2, state.achievement3]
                  .filter(Boolean)
                  .map((achievement) => (
                    <li key={achievement} className="flex gap-2">
                      <span>•</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
              </ul>
            </section>
            <section className="mt-5">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Competencias
              </h3>
              <p className="mt-2 text-sm">{skills.join(' · ') || 'Tus competencias'}</p>
            </section>
            {state.education && (
              <section className="mt-5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Formación
                </h3>
                <p className="mt-2 text-sm">{state.education}</p>
              </section>
            )}
          </Card>
        )}

        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="border-slate-800 bg-slate-900/45 p-6">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-cyan-300" />
              <div>
                <h2 className="text-lg font-semibold text-white">Identidad y contacto</h2>
                <p className="text-xs text-slate-500">Información visible y verificable.</p>
              </div>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="space-y-2 sm:col-span-2">
                <FieldLabel>Nombre completo</FieldLabel>
                <input className={fieldClass} value={state.fullName} onChange={(event) => update('fullName', event.target.value)} placeholder="Nombre y apellido" />
              </label>
              <label className="space-y-2">
                <FieldLabel>Correo profesional</FieldLabel>
                <input type="email" className={fieldClass} value={state.email} onChange={(event) => update('email', event.target.value)} placeholder="nombre@correo.cl" />
              </label>
              <label className="space-y-2">
                <FieldLabel>Teléfono</FieldLabel>
                <input className={fieldClass} value={state.phone} onChange={(event) => update('phone', event.target.value)} placeholder="+56 9 ..." />
              </label>
              <label className="space-y-2">
                <FieldLabel>Ubicación</FieldLabel>
                <input className={fieldClass} value={state.location} onChange={(event) => update('location', event.target.value)} placeholder="Santiago, Chile" />
              </label>
              <label className="space-y-2">
                <FieldLabel>LinkedIn (opcional)</FieldLabel>
                <input className={fieldClass} value={state.linkedin} onChange={(event) => update('linkedin', event.target.value)} placeholder="linkedin.com/in/..." />
              </label>
            </div>
          </Card>

          <Card className="border-slate-800 bg-slate-900/45 p-6">
            <div className="flex items-center gap-3">
              <Target className="h-5 w-5 text-purple-300" />
              <div>
                <h2 className="text-lg font-semibold text-white">Foco del CV</h2>
                <p className="text-xs text-slate-500">Un documento por rol objetivo.</p>
              </div>
            </div>
            <div className="mt-5 space-y-4">
              <label className="space-y-2">
                <FieldLabel>Rol objetivo</FieldLabel>
                <input className={fieldClass} value={state.targetRole} onChange={(event) => update('targetRole', event.target.value)} placeholder="Ej.: Analista de Riesgo Senior" />
              </label>
              <label className="space-y-2">
                <FieldLabel>Palabras clave del rol</FieldLabel>
                <textarea className={fieldClass} rows={4} value={state.targetKeywords} onChange={(event) => update('targetKeywords', event.target.value)} placeholder="riesgo crediticio, análisis financiero, cartera, SQL" />
                <span className="block text-right text-xs text-slate-600">
                  {keywords.length} palabras clave · mínimo 3
                </span>
              </label>
            </div>
          </Card>
        </section>

        <Card className="border-slate-800 bg-slate-900/45 p-6">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-purple-300" />
            <div>
              <h2 className="text-lg font-semibold text-white">Resumen profesional</h2>
              <p className="text-xs text-slate-500">
                Identidad, evidencia y dirección en un bloque breve.
              </p>
            </div>
          </div>
          <textarea
            className={`${fieldClass} mt-5`}
            rows={6}
            value={state.professionalSummary}
            onChange={(event) => update('professionalSummary', event.target.value)}
            placeholder="Describe tu especialidad, años o contexto de experiencia, dos fortalezas demostrables y el rol al que apuntas."
          />
          <p className="mt-2 text-right text-xs text-slate-600">
            {state.professionalSummary.length} caracteres · objetivo 80 a 600
          </p>
        </Card>

        <Card className="border-slate-800 bg-slate-900/45 p-6">
          <div className="flex items-center gap-3">
            <Briefcase className="h-5 w-5 text-emerald-300" />
            <div>
              <h2 className="text-lg font-semibold text-white">Experiencia como evidencia</h2>
              <p className="text-xs text-slate-500">
                Tres logros concretos; las métricas añaden hasta 10 puntos.
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <label className="space-y-2">
              <FieldLabel>Cargo</FieldLabel>
              <input className={fieldClass} value={state.experienceTitle} onChange={(event) => update('experienceTitle', event.target.value)} placeholder="Cargo desempeñado" />
            </label>
            <label className="space-y-2">
              <FieldLabel>Empresa</FieldLabel>
              <input className={fieldClass} value={state.experienceCompany} onChange={(event) => update('experienceCompany', event.target.value)} placeholder="Organización" />
            </label>
            <label className="space-y-2">
              <FieldLabel>Fechas</FieldLabel>
              <input className={fieldClass} value={state.experienceDates} onChange={(event) => update('experienceDates', event.target.value)} placeholder="2022–actualidad" />
            </label>
          </div>
          <div className="mt-5 grid gap-4">
            {(['achievement1', 'achievement2', 'achievement3'] as const).map((key, index) => (
              <label key={key} className="space-y-2">
                <FieldLabel>Logro {index + 1}</FieldLabel>
                <textarea className={fieldClass} rows={3} value={state[key]} onChange={(event) => update(key, event.target.value)} placeholder="Acción + contexto + resultado observable. Ej.: Rediseñé el flujo de evaluación y reduje 18% el tiempo promedio de respuesta." />
                <span className="block text-right text-xs text-slate-600">
                  {state[key].length} caracteres · mínimo 35
                </span>
              </label>
            ))}
          </div>
        </Card>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="border-slate-800 bg-slate-900/45 p-6">
            <h2 className="text-lg font-semibold text-white">Competencias y formación</h2>
            <div className="mt-5 space-y-4">
              <label className="space-y-2">
                <FieldLabel>Competencias priorizadas</FieldLabel>
                <textarea className={fieldClass} rows={5} value={state.skills} onChange={(event) => update('skills', event.target.value)} placeholder="Excel avanzado, SQL, análisis financiero, comunicación ejecutiva..." />
                <span className="block text-right text-xs text-slate-600">
                  {skills.length} competencias · mínimo 6
                </span>
              </label>
              <label className="space-y-2">
                <FieldLabel>Formación (opcional)</FieldLabel>
                <textarea className={fieldClass} rows={4} value={state.education} onChange={(event) => update('education', event.target.value)} placeholder="Título, institución, año y certificaciones relevantes." />
              </label>
            </div>
          </Card>

          <Card className="border-slate-800 bg-slate-900/45 p-6">
            <div className="flex items-center gap-3">
              <ListChecks className="h-5 w-5 text-amber-300" />
              <div>
                <h2 className="text-lg font-semibold text-white">Control ATS</h2>
                <p className="text-xs text-slate-500">
                  Los seis controles críticos son obligatorios.
                </p>
              </div>
            </div>
            <div className="mt-5 space-y-2">
              {CV_BUILDER_ATS_ITEMS.map((item) => {
                const selected = state.atsChecklist.includes(item.id)
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleAts(item.id)}
                    className={`flex w-full items-start gap-3 rounded-xl border p-3 text-left transition ${
                      selected
                        ? 'border-emerald-500/30 bg-emerald-500/10'
                        : 'border-slate-800 bg-slate-950/45 hover:border-amber-500/30'
                    }`}
                  >
                    <CheckCircle2
                      className={`mt-0.5 h-5 w-5 flex-shrink-0 ${
                        selected ? 'text-emerald-300' : 'text-slate-700'
                      }`}
                    />
                    <span className="flex-1 text-sm text-slate-300">{item.label}</span>
                    {item.critical && (
                      <Badge className="border-amber-500/25 bg-amber-500/10 text-amber-200">
                        crítico
                      </Badge>
                    )}
                  </button>
                )
              })}
            </div>
          </Card>
        </section>

        <Card className="border-purple-500/25 bg-purple-500/8 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white">
                {validation.passed
                  ? 'El CV cumple el contrato del módulo'
                  : `${completedCriteria}/${validation.criteria.length} bloques esenciales listos`}
              </p>
              <p className="mt-1 text-sm text-slate-400">
                {validation.passed
                  ? 'La evidencia está lista para registrarse de forma transaccional.'
                  : validation.errors[0] || 'Completa los campos pendientes.'}
              </p>
            </div>
            <div className="min-w-40">
              <div className="mb-2 flex justify-between text-xs text-slate-500">
                <span>Bloques esenciales</span>
                <span>{criteriaProgress}%</span>
              </div>
              <Progress value={criteriaProgress} className="h-2 bg-slate-800" />
            </div>
          </div>

          {error && (
            <p className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-100">
              {error}
            </p>
          )}

          {completion?.success ? (
            <div className="mt-5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-5">
              <p className="flex items-center gap-2 font-semibold text-emerald-200">
                <CheckCircle2 className="h-5 w-5" />
                Módulo registrado
              </p>
              <p className="mt-2 text-sm text-emerald-100/75">
                Puntaje {completion.score}/100 · Mejor puntaje {completion.bestScore}/100 ·{' '}
                {completion.xpAwarded
                  ? `${completion.xpAwarded} XP otorgados`
                  : 'repetición sin XP adicional'}.
              </p>
              <Button
                className="mt-4 bg-emerald-600 hover:bg-emerald-500"
                onClick={() => router.push('/despega/a3')}
              >
                Volver a Entrenamiento
              </Button>
            </div>
          ) : (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs text-slate-500">
                El borrador se guarda automáticamente en este dispositivo.
              </p>
              <Button
                onClick={() => void submit()}
                disabled={!validation.passed || submitting || !draftReady}
                className="bg-purple-600 px-6 hover:bg-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                )}
                {submitting ? 'Registrando…' : 'Completar módulo'}
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
