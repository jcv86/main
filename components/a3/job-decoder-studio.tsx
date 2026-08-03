'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  FileText,
  Loader2,
  Search,
  ShieldCheck,
  Target,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { completeA3Module } from '@/lib/a3/client-completion'
import { getActiveA3Module } from '@/lib/a3/active-module'
import { validateJobDecoderSubmission } from '@/lib/a3/job-decoder-validation'
import {
  EMPTY_JOB_DECODER_DRAFT,
  JOB_DECODER_DRAFT_KEY,
  type A3CvContext,
  type JobDecoderDraft,
} from '@/lib/a3/job-decoder'

const SAMPLE_DRAFT: JobDecoderDraft = {
  jobTitle: 'Líder de Operaciones y Mejora Continua',
  company: 'Empresa tecnológica en expansión',
  jobPosting:
    'Buscamos una persona para liderar la operación diaria, coordinar equipos comerciales y técnicos, controlar indicadores, mejorar procesos y presentar avances a la gerencia. Se requiere experiencia de al menos cuatro años en operaciones o proyectos, dominio avanzado de Excel, capacidad para documentar procesos y comunicación ejecutiva. Se valorará experiencia en empresas tecnológicas, metodologías Lean, automatización y análisis de datos. El entorno cambia rápidamente y exige autonomía, criterio y colaboración transversal.',
  mustHaveRequirements:
    'Experiencia de al menos cuatro años en operaciones o proyectos\nDominio avanzado de Excel y control de indicadores\nCapacidad para coordinar equipos comerciales y técnicos',
  niceToHaveRequirements:
    'Experiencia previa en empresas tecnológicas\nConocimiento de metodologías Lean y automatización',
  hiddenSignals:
    'El entorno cambiante implica autonomía, priorización y tolerancia a la ambigüedad',
  strongMatches:
    'Coordinación transversal: lideré comités diarios con áreas comerciales, técnicas y de riesgo durante más de tres años\nIndicadores: construí tableros semanales para controlar volumen, tiempos y excepciones operativas',
  partialMatches:
    'Mejora continua: he documentado y ajustado procesos, aunque no cuento con certificación formal Lean',
  gapPlan:
    'Automatización: prepararé una evidencia breve de los flujos que optimicé y reforzaré ejemplos concretos antes de postular',
  likelyQuestions:
    'Cuéntame sobre una ocasión en que coordinaste áreas con prioridades diferentes\n¿Qué indicadores utilizarías para controlar una operación de alto volumen?\n¿Cómo decides qué proceso mejorar primero cuando existen varias urgencias?',
  applicationAdjustments:
    'Mover al inicio del CV los logros relacionados con coordinación transversal\nIncorporar Excel, indicadores y mejora de procesos en el resumen profesional\nPreparar dos historias de entrevista sobre autonomía y manejo de ambigüedad',
  priorityKeywords:
    'operaciones, coordinación transversal, Excel, indicadores, mejora continua, autonomía',
}

interface ContextPayload {
  success?: boolean
  cvBuilder?: A3CvContext
  error?: string
}

const SECTIONS = [
  {
    title: '1. Leer la oferta',
    description: 'Captura el contexto y separa lo obligatorio, deseable e implícito.',
    icon: Search,
  },
  {
    title: '2. Mapear tu ajuste',
    description: 'Conecta cada exigencia con evidencia, coincidencias parciales y brechas.',
    icon: Target,
  },
  {
    title: '3. Preparar la postulación',
    description: 'Anticipa preguntas y define ajustes concretos para CV y entrevista.',
    icon: ShieldCheck,
  },
] as const

function TextAreaField({
  label,
  help,
  value,
  onChange,
  placeholder,
  rows = 5,
}: {
  label: string
  help: string
  value: string
  onChange: (value: string) => void
  placeholder: string
  rows?: number
}) {
  return (
    <label className="block space-y-2">
      <span className="text-sm font-semibold text-white">{label}</span>
      <span className="block text-xs leading-relaxed text-slate-500">{help}</span>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400"
      />
    </label>
  )
}

export function JobDecoderStudio() {
  const router = useRouter()
  const module = useMemo(() => getActiveA3Module('job-decoder'), [])
  const [draft, setDraft] = useState<JobDecoderDraft>(EMPTY_JOB_DECODER_DRAFT)
  const [cvContext, setCvContext] = useState<A3CvContext | null>(null)
  const [contextLoading, setContextLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const stored = window.localStorage.getItem(JOB_DECODER_DRAFT_KEY)
    if (stored) {
      try {
        setDraft({ ...EMPTY_JOB_DECODER_DRAFT, ...(JSON.parse(stored) as JobDecoderDraft) })
      } catch {
        window.localStorage.removeItem(JOB_DECODER_DRAFT_KEY)
      }
    }

    let active = true
    const loadContext = async () => {
      try {
        const response = await fetch('/api/a3/module-context/job-decoder', {
          credentials: 'include',
          cache: 'no-store',
        })
        const payload = (await response.json().catch(() => ({}))) as ContextPayload
        if (!active) return
        if (response.ok && payload.cvBuilder) setCvContext(payload.cvBuilder)
      } catch (contextError) {
        console.error('[v0] Job decoder context load error:', contextError)
      } finally {
        if (active) setContextLoading(false)
      }
    }

    void loadContext()
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(JOB_DECODER_DRAFT_KEY, JSON.stringify(draft))
  }, [draft])

  const validation = useMemo(
    () =>
      module
        ? validateJobDecoderSubmission(module, [], draft, { cvBuilder: cvContext })
        : null,
    [cvContext, draft, module],
  )

  const update = <K extends keyof JobDecoderDraft>(
    key: K,
    value: JobDecoderDraft[K],
  ) => setDraft((current) => ({ ...current, [key]: value }))

  const handleSubmit = async () => {
    if (!module || !validation?.passed || submitting) return
    setSubmitting(true)
    setError(null)

    try {
      const payload = await completeA3Module({
        moduleId: 'job-decoder',
        moduleNumber: 4,
        responses: [],
        deliverable: draft,
      })
      window.localStorage.removeItem(JOB_DECODER_DRAFT_KEY)
      router.push(`/despega/a3?completed=job-decoder&score=${payload.score || validation.score}`)
      router.refresh()
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'No pudimos registrar el análisis de la oferta.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (!module || !validation) return null

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-white sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <header className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <Link
              href="/despega/a3"
              className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver a Entrenamiento
            </Link>
            <Badge className="border-purple-500/30 bg-purple-500/10 text-purple-200">
              Módulo 4 · 100 XP
            </Badge>
          </div>

          <div className="grid gap-5 lg:grid-cols-[1fr_260px] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
                Decodificador de Ofertas
              </p>
              <h1 className="mt-2 text-4xl font-bold">Lee la oferta como un mapa de evaluación</h1>
              <p className="mt-3 max-w-3xl leading-relaxed text-slate-400">
                Clasifica requisitos, contrástalos con tu CV aprobado y convierte la oferta en decisiones concretas para tu postulación y entrevista.
              </p>
            </div>

            <Card className="border-slate-800 bg-slate-900/70 p-5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Puntaje verificable</span>
                <strong className={validation.passed ? 'text-emerald-300' : 'text-amber-300'}>
                  {validation.score}/100
                </strong>
              </div>
              <Progress value={validation.score} className="mt-3 h-2 bg-slate-800" />
              <p className="mt-2 text-xs text-slate-500">Umbral de finalización: 75/100</p>
            </Card>
          </div>
        </header>

        <Card className="border-cyan-500/25 bg-cyan-500/5 p-5">
          <div className="flex items-start gap-3">
            <FileText className="mt-0.5 h-5 w-5 text-cyan-300" />
            <div className="min-w-0">
              <p className="font-semibold text-cyan-100">Contexto del CV aprobado</p>
              {contextLoading ? (
                <p className="mt-1 text-sm text-slate-400">Cargando evidencia del Módulo 3…</p>
              ) : cvContext?.available ? (
                <div className="mt-2 space-y-2 text-sm text-slate-300">
                  <p>
                    Rol objetivo: <strong>{cvContext.targetRole || 'No registrado'}</strong>
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {[...cvContext.targetKeywords, ...cvContext.skills].slice(0, 10).map((item) => (
                      <Badge key={item} className="border-slate-700 bg-slate-900 text-slate-300">
                        {item}
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="mt-1 text-sm text-slate-400">
                  No encontramos un entregable estructurado del CV. Puedes completar el módulo; la alineación con el CV no sumará el bono de 15 puntos.
                </p>
              )}
            </div>
          </div>
        </Card>

        <div className="grid gap-4 md:grid-cols-3">
          {SECTIONS.map((section) => (
            <Card key={section.title} className="border-slate-800 bg-slate-900/40 p-4">
              <section.icon className="h-5 w-5 text-purple-300" />
              <h2 className="mt-3 font-semibold">{section.title}</h2>
              <p className="mt-1 text-sm leading-relaxed text-slate-500">{section.description}</p>
            </Card>
          ))}
        </div>

        <Card className="space-y-5 border-slate-800 bg-slate-900/45 p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold">Oferta analizada</h2>
              <p className="text-sm text-slate-500">Puedes trabajar con una oferta real o cargar el ejemplo.</p>
            </div>
            <Button type="button" variant="outline" onClick={() => setDraft(SAMPLE_DRAFT)}>
              Cargar ejemplo completo
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="space-y-2">
              <span className="text-sm font-semibold">Cargo</span>
              <input
                value={draft.jobTitle}
                onChange={(event) => update('jobTitle', event.target.value)}
                placeholder="Ej.: Jefatura de Operaciones"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm outline-none focus:border-cyan-400"
              />
            </label>
            <label className="space-y-2">
              <span className="text-sm font-semibold">Empresa</span>
              <input
                value={draft.company}
                onChange={(event) => update('company', event.target.value)}
                placeholder="Nombre de la empresa"
                className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm outline-none focus:border-cyan-400"
              />
            </label>
          </div>

          <TextAreaField
            label="Texto completo de la oferta"
            help="Incluye responsabilidades, requisitos y cualquier información de contexto. Mínimo 180 caracteres."
            value={draft.jobPosting}
            onChange={(value) => update('jobPosting', value)}
            placeholder="Pega aquí la publicación completa…"
            rows={9}
          />
        </Card>

        <Card className="grid gap-5 border-slate-800 bg-slate-900/45 p-6 lg:grid-cols-3">
          <TextAreaField
            label="Requisitos obligatorios"
            help="Uno por línea. Registra al menos tres condiciones que probablemente filtren candidaturas."
            value={draft.mustHaveRequirements}
            onChange={(value) => update('mustHaveRequirements', value)}
            placeholder="Experiencia mínima…\nDominio de…\nDisponibilidad para…"
          />
          <TextAreaField
            label="Requisitos deseables"
            help="Uno por línea. Registra al menos dos elementos que entregan ventaja, pero no parecen excluyentes."
            value={draft.niceToHaveRequirements}
            onChange={(value) => update('niceToHaveRequirements', value)}
            placeholder="Experiencia en la industria…\nCertificación…"
          />
          <TextAreaField
            label="Señales implícitas"
            help="Explicita al menos una conducta o condición sugerida por el lenguaje de la oferta."
            value={draft.hiddenSignals}
            onChange={(value) => update('hiddenSignals', value)}
            placeholder="“Entorno dinámico” implica…"
          />
        </Card>

        <Card className="grid gap-5 border-slate-800 bg-slate-900/45 p-6 lg:grid-cols-3">
          <TextAreaField
            label="Coincidencias fuertes"
            help="Dos o más líneas. Vincula requisito y evidencia concreta de tu trayectoria."
            value={draft.strongMatches}
            onChange={(value) => update('strongMatches', value)}
            placeholder="Coordinación: lideré…"
            rows={7}
          />
          <TextAreaField
            label="Coincidencias parciales"
            help="Registra al menos una coincidencia que requiere contexto, traducción o refuerzo."
            value={draft.partialMatches}
            onChange={(value) => update('partialMatches', value)}
            placeholder="Mejora continua: tengo experiencia, pero…"
            rows={7}
          />
          <TextAreaField
            label="Brecha y plan"
            help="Describe una brecha real y cómo la abordarás en la postulación o entrevista."
            value={draft.gapPlan}
            onChange={(value) => update('gapPlan', value)}
            placeholder="No tengo X; mostraré Y y prepararé Z…"
            rows={7}
          />
        </Card>

        <Card className="grid gap-5 border-slate-800 bg-slate-900/45 p-6 lg:grid-cols-2">
          <TextAreaField
            label="Preguntas probables"
            help="Una por línea. Formula al menos tres preguntas derivadas de responsabilidades o requisitos."
            value={draft.likelyQuestions}
            onChange={(value) => update('likelyQuestions', value)}
            placeholder="Cuéntame sobre una ocasión en que…"
            rows={7}
          />
          <div className="space-y-5">
            <TextAreaField
              label="Ajustes para la postulación"
              help="Define al menos tres cambios concretos en CV, carta, LinkedIn o preparación."
              value={draft.applicationAdjustments}
              onChange={(value) => update('applicationAdjustments', value)}
              placeholder="Mover logros de…\nIncorporar palabra clave…\nPreparar historia…"
              rows={6}
            />
            <TextAreaField
              label="Palabras clave prioritarias"
              help="Separa por coma. Incluye al menos cinco términos de la oferta."
              value={draft.priorityKeywords}
              onChange={(value) => update('priorityKeywords', value)}
              placeholder="operaciones, Excel, indicadores, liderazgo, mejora continua"
              rows={3}
            />
          </div>
        </Card>

        <Card className="border-slate-800 bg-slate-900/60 p-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold">Criterios de finalización</h2>
              <p className="mt-1 text-sm text-slate-500">
                Los cinco primeros criterios son obligatorios. Los dos últimos mejoran la calidad del análisis.
              </p>
            </div>
            <Badge className={validation.passed ? 'bg-emerald-500/15 text-emerald-200' : 'bg-amber-500/15 text-amber-200'}>
              {validation.passed ? 'Listo para registrar' : 'Análisis en desarrollo'}
            </Badge>
          </div>

          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {validation.criteria.map((criterion) => (
              <div
                key={criterion.key}
                className={`rounded-xl border p-4 ${
                  criterion.met
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : 'border-slate-800 bg-slate-950/50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    {criterion.met ? (
                      <CheckCircle2 className="mt-0.5 h-4 w-4 text-emerald-300" />
                    ) : (
                      <AlertTriangle className="mt-0.5 h-4 w-4 text-amber-300" />
                    )}
                    <span className="text-sm font-medium text-slate-200">{criterion.label}</span>
                  </div>
                  <span className="text-xs text-slate-500">
                    {criterion.score}/{criterion.maxScore}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {validation.errors.length > 0 && (
            <div className="mt-5 rounded-xl border border-amber-500/25 bg-amber-500/5 p-4">
              <p className="font-semibold text-amber-200">Todavía falta:</p>
              <ul className="mt-2 space-y-1 text-sm text-amber-100/75">
                {validation.errors.map((message) => (
                  <li key={message}>• {message}</li>
                ))}
              </ul>
            </div>
          )}

          {error && (
            <p className="mt-5 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
              {error}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-slate-500">Tu borrador se guarda automáticamente en este dispositivo.</p>
            <Button
              type="button"
              onClick={() => void handleSubmit()}
              disabled={!validation.passed || submitting}
              className="min-w-52"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Registrando análisis…
                </>
              ) : (
                <>
                  Completar Decodificador
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
