'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
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
import { useA3DraftStorage } from '@/lib/a3/draft-storage'
import { completeA3Module, type A3CompletionPayload } from '@/lib/a3/client-completion'
import { getA3Module } from '@/lib/a3/module-catalog'
import { validateA3ModuleSubmission } from '@/lib/a3/module-validation'
import {
  buildCvBuilderDeliverable,
  buildCvPlainText,
  buildCvPreviewText,
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
  const [showPreview, setShowPreview] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [savedCv, setSavedCv] = useState<CvBuilderState | null>(null)
  const [savedCvError, setSavedCvError] = useState<string | null>(null)
  const [completion, setCompletion] = useState<A3CompletionPayload | null>(null)
  const saving = useRef(false)
  const confirmedSaveRevision = useRef(0)
  const ownerGeneration = useRef(0)

  const { clearDraft, ready: draftReady, ownerId, error: draftError, retry: retryDraft } = useA3DraftStorage({
    moduleId: 'cv-builder-studio',
    legacyKey: CV_BUILDER_DRAFT_KEY,
    value: state,
    onRestore: (stored) => setState(normalizeCvBuilderState(stored)),
    onReset: () => {
      ownerGeneration.current++; confirmedSaveRevision.current++; saving.current = false
      setState(EMPTY_CV_BUILDER_STATE); setSavedCv(null); setCompletion(null); setSubmitting(false); setError(null); setSavedCvError(null)
    },
    enabled: !completion?.success,
  })

  useEffect(() => {
    if (!ownerId) return
    const controller = new AbortController()
    const requestedAtRevision = confirmedSaveRevision.current
    void fetch('/api/a3/module-context/cv-builder-studio', { credentials: 'include', cache: 'no-store', signal: controller.signal })
      .then(async (response) => {
        const payload = await response.json()
        if (!response.ok) throw new Error(payload.error || 'No pudimos recuperar el CV guardado.')
        if (!controller.signal.aborted && requestedAtRevision === confirmedSaveRevision.current && payload.savedCv) setSavedCv(normalizeCvBuilderState(payload.savedCv))
      })
      .catch((cause) => { if (!controller.signal.aborted && requestedAtRevision === confirmedSaveRevision.current) setSavedCvError(cause instanceof Error ? cause.message : 'No pudimos recuperar el CV guardado.') })
    return () => controller.abort()
  }, [ownerId])

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

  const update = <K extends keyof CvBuilderState>(
    key: K,
    value: CvBuilderState[K],
  ) => {
    if (saving.current) return
    setState((current) => ({ ...current, [key]: value, factsConfirmed: key === 'factsConfirmed' ? Boolean(value) : false }))
    setCompletion(null)
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

  const exportCv = () => {
    if (!validation?.passed) return
    const blob = new Blob([buildCvPlainText(state)], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'mi-cv.txt'
    link.click()
    URL.revokeObjectURL(url)
  }

  const submit = async () => {
    if (!module || !validation?.passed || !draftReady || saving.current) return
    saving.current = true
    const submittedOwner = ownerGeneration.current
    setSubmitting(true)
    setError(null)

    try {
      const result = await completeA3Module({
        moduleId: module.id,
        moduleNumber: module.number,
        responses,
        deliverable,
      })
      if (submittedOwner !== ownerGeneration.current) return
      confirmedSaveRevision.current++
      setCompletion(result)
      setSavedCv(state)
      setSavedCvError(null)
      clearDraft(state)
    } catch (submitError) {
      if (submittedOwner !== ownerGeneration.current) return
      console.error('[v0] Error completing CV builder:', submitError)
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'No pudimos registrar el módulo.',
      )
    } finally {
      if (submittedOwner === ownerGeneration.current) { saving.current = false; setSubmitting(false) }
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
                estructura de CV clara con hechos que tú confirmas. Revisa el formato según las instrucciones de cada postulación.
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

        {!draftReady && <div className="space-y-3"><p role="status" className="text-sm text-slate-300">{draftError || 'Recuperando el borrador de tu cuenta en este dispositivo…'}</p>{draftError && <Button variant="outline" onClick={retryDraft}>Volver a intentar</Button>}</div>}
        {draftReady && draftError && <p role="status" className="text-sm text-amber-200">{draftError}</p>}
        <fieldset disabled={submitting || !draftReady} className="min-w-0 space-y-7">
        <legend className="sr-only">Editor del CV</legend>
        {savedCv && <Card className="space-y-3 border-cyan-500/25 bg-cyan-500/5 p-5"><p className="text-sm text-slate-300">Tienes un CV guardado en tu cuenta. Puedes recuperar esa versión para revisarla o descargar su texto; cargarla reemplaza el borrador visible.</p><Button variant="outline" disabled={submitting} onClick={() => { if (saving.current) return; setState({ ...savedCv, factsConfirmed: false }); setCompletion(null); setShowPreview(true) }}>Cargar el CV guardado en mi cuenta</Button></Card>}
        {savedCvError && <p role="status" className="text-sm text-amber-200">{savedCvError} Tu borrador local sigue disponible.</p>}

        <Card className="border-slate-800 bg-slate-900/55 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white">Revisión del documento</p>
              <p className="mt-1 text-xs text-slate-500">
                Completa los campos y confirma tus hechos. Esta revisión no mide empleabilidad ni predice aceptación por un ATS.
              </p>
            </div>
            <p
              className={`text-4xl font-bold ${
                validation.passed ? 'text-emerald-300' : 'text-amber-300'
              }`}
            >
              {completedCriteria}/{validation.criteria.length}
            </p>
          </div>
          <Progress value={criteriaProgress} className="mt-4 h-2 bg-slate-800" />
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
                    {criterion.met ? 'Revisado' : 'Pendiente'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {showPreview && (
          <Card className="border-slate-300 bg-white p-7 text-slate-900">
            <h2 className="font-semibold">Vista previa del texto</h2>
            <p className="mt-1 text-xs text-slate-600">Los campos vacíos y las notas pendientes se omiten. La exportación conserva este contenido.</p>
            <pre className="mt-4 whitespace-pre-wrap break-words font-sans text-sm leading-relaxed">{buildCvPreviewText(state) || 'Añade tus datos para ver el borrador.'}</pre>
          </Card>
        )}

        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="border-slate-800 bg-slate-900/45 p-6">
            <div className="flex items-center gap-3">
              <User className="h-5 w-5 text-cyan-300" />
              <div>
                <h2 className="text-lg font-semibold text-white">Identidad y contacto</h2>
                <p className="text-xs text-slate-500">Datos que revisas antes de compartir.</p>
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
                <FieldLabel>Teléfono (opcional)</FieldLabel>
                <input className={fieldClass} value={state.phone} onChange={(event) => update('phone', event.target.value)} placeholder="+56 9 ..." />
              </label>
              <label className="space-y-2">
                <FieldLabel>Ubicación (opcional)</FieldLabel>
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
                <p className="text-xs text-slate-500">Declara un rol o área de interés. No necesitas aportar una vacante.</p>
              </div>
            </div>
            <div className="mt-5 space-y-4">
              <label className="space-y-2">
                <FieldLabel>Rol objetivo</FieldLabel>
                <input className={fieldClass} value={state.targetRole} onChange={(event) => update('targetRole', event.target.value)} placeholder="Ej.: Analista de Riesgo Senior" />
              </label>
              <label className="space-y-2">
                <FieldLabel>Palabras clave reales (opcional)</FieldLabel>
                <textarea className={fieldClass} rows={4} value={state.targetKeywords} onChange={(event) => update('targetKeywords', event.target.value)} placeholder="riesgo crediticio, análisis financiero, cartera, SQL" />
                <span className="block text-right text-xs text-slate-600">
                  {keywords.length} palabras clave · incluye sólo las que puedas respaldar
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
            placeholder="Describe qué sabes, en qué contexto lo aprendiste y qué te interesa hacer. No añadas años, títulos o logros que no puedas confirmar."
          />
          <p className="mt-2 text-right text-xs text-slate-600">
            {state.professionalSummary.length} caracteres · busca claridad, sin longitud mínima
          </p>
        </Card>

        <Card className="border-slate-800 bg-slate-900/45 p-6">
          <div className="flex items-center gap-3">
            <Briefcase className="h-5 w-5 text-emerald-300" />
            <div>
              <h2 className="text-lg font-semibold text-white">Experiencia como evidencia</h2>
              <p className="text-xs text-slate-500">
                Un ejemplo real basta para comenzar. Añade cifras sólo si puedes confirmarlas; también puedes usar proyectos, voluntariado o formación inicial.
              </p>
            </div>
          </div>
          <label className="mt-5 block space-y-2"><FieldLabel>Qué evidencia puedes aportar hoy</FieldLabel><select className={fieldClass} value={state.evidenceKind} onChange={(event) => update('evidenceKind', event.target.value as CvBuilderState['evidenceKind'])}><option value="experience">Experiencia laboral o voluntariado</option><option value="project">Proyecto propio o académico</option><option value="education">Formación inicial, aún sin experiencia o proyecto</option></select></label>
          <div className="mt-5 grid gap-4 md:grid-cols-3">
            <label className="space-y-2">
              <FieldLabel>Cargo o función en el proyecto</FieldLabel>
              <input className={fieldClass} value={state.experienceTitle} onChange={(event) => update('experienceTitle', event.target.value)} placeholder="Cargo desempeñado" />
            </label>
            <label className="space-y-2">
              <FieldLabel>Organización o contexto propio</FieldLabel>
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
                <FieldLabel>Ejemplo {index + 1}{index > 0 ? " (opcional)" : ""}</FieldLabel>
                <textarea className={fieldClass} rows={3} value={state[key]} onChange={(event) => update(key, event.target.value)} placeholder="Qué hiciste tú, en qué contexto y qué ocurrió. Si desconoces el resultado, deja la duda en tus notas pendientes." />
                <span className="block text-right text-xs text-slate-600">
                  {state[key].length} caracteres · hechos propios, sin premio por escribir más
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
                  {skills.length} competencias · cada una debe poder explicarse con un ejemplo
                </span>
              </label>
              <label className="space-y-2">
                <FieldLabel>Formación (necesaria si eliges formación inicial)</FieldLabel>
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
                  Autorrevisión del formato. Los sistemas ATS varían; esto no garantiza una aceptación.
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

        <Card className="space-y-4 border-cyan-500/25 bg-slate-900/45 p-6">
          <h2 className="text-lg font-semibold text-white">Revisa la fidelidad antes de guardar</h2>
          <p className="text-sm text-slate-400">Comprueba nombres, funciones, fechas, formación y resultados contra tus propios registros. Las ayudas de escritura pueden mejorar la presentación; no comprueban que una experiencia haya ocurrido.</p>
          <label className="block space-y-2"><FieldLabel>Datos pendientes de confirmar (notas privadas, no se exportan)</FieldLabel><textarea className={fieldClass} rows={3} value={state.pendingFacts} onChange={(event) => update('pendingFacts', event.target.value)} placeholder="Ej.: confirmar la fecha exacta del proyecto. Omite ese dato del CV hasta revisarlo." /></label>
          <label className="flex items-start gap-3 text-sm text-slate-200"><input type="checkbox" className="mt-1 h-4 w-4" checked={state.factsConfirmed} onChange={(event) => update('factsConfirmed', event.target.checked)} /><span>Revisé el texto incluido y confirmo que describe mis hechos. No añadí experiencia, competencias, fechas ni cifras para rellenar campos. Mi confirmación no equivale a una verificación externa.</span></label>
          <Button variant="outline" disabled={!validation.passed} onClick={exportCv}>Descargar texto revisado (.txt)</Button>
        </Card>

        <Card className="border-purple-500/25 bg-purple-500/8 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-white">
                {validation.passed
                  ? 'Los campos y la revisión están completos'
                  : `${completedCriteria}/${validation.criteria.length} bloques esenciales listos`}
              </p>
              <p className="mt-1 text-sm text-slate-400">
                {validation.passed
                  ? 'Puedes guardar el documento y descargar el texto revisado.'
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
                {completion.xpAwarded
                  ? `${completion.xpAwarded} XP otorgados`
                  : 'repetición sin XP adicional'}.
              </p>
              <Button
                className="mt-4 bg-emerald-600 hover:bg-emerald-500"
                onClick={() => router.push(`/despega/a2/dia-${module.checkpointDay}`)}
              >
                Volver al checkpoint del Día {module.checkpointDay}
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
        </fieldset>
      </div>
    </div>
  )
}
