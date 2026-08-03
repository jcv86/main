'use client'

import { FormEvent, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  Archive,
  CheckCircle2,
  Clock3,
  ExternalLink,
  FileSearch,
  Plus,
  Radar,
  Save,
  ShieldCheck,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  A4_DECISION_STATUSES,
  A4_SIGNAL_CATEGORIES,
  A4_SIGNAL_CLASSIFICATIONS,
  A4_SOURCE_TYPES,
  type A4Decision,
  type A4DecisionStatus,
  type A4VerifiedSignal,
} from '@/lib/a4/strategic-radar'

interface StrategicRadarWorkspaceProps {
  initialSignals: A4VerifiedSignal[]
  initialDecisions: A4Decision[]
}

interface DecisionEditState {
  status: A4DecisionStatus
  outcome: string
}

function localDate(offsetDays = 0) {
  const date = new Date()
  date.setDate(date.getDate() + offsetDays)
  return date.toISOString().slice(0, 10)
}

function formatDate(value: string) {
  const date = new Date(`${value}T12:00:00`)
  if (Number.isNaN(date.getTime())) return value
  return new Intl.DateTimeFormat('es-CL', {
    dateStyle: 'medium',
    timeZone: 'America/Santiago',
  }).format(date)
}

function categoryLabel(value: string) {
  return A4_SIGNAL_CATEGORIES.find((item) => item.id === value)?.label || value
}

function classificationLabel(value: string) {
  return (
    A4_SIGNAL_CLASSIFICATIONS.find((item) => item.id === value)?.label || value
  )
}

function decisionStatusLabel(value: string) {
  return A4_DECISION_STATUSES.find((item) => item.id === value)?.label || value
}

function errorsFromResponse(payload: any): string[] {
  const validationErrors = payload?.validation?.errors
  if (Array.isArray(validationErrors)) {
    return validationErrors.filter((item): item is string => typeof item === 'string')
  }
  return typeof payload?.error === 'string'
    ? [payload.error]
    : ['No pudimos completar la operación.']
}

export function StrategicRadarWorkspace({
  initialSignals,
  initialDecisions,
}: StrategicRadarWorkspaceProps) {
  const router = useRouter()
  const [signals, setSignals] = useState(initialSignals)
  const [decisions, setDecisions] = useState(initialDecisions)
  const [signalBusy, setSignalBusy] = useState(false)
  const [decisionBusy, setDecisionBusy] = useState(false)
  const [signalErrors, setSignalErrors] = useState<string[]>([])
  const [decisionErrors, setDecisionErrors] = useState<string[]>([])
  const [signalMessage, setSignalMessage] = useState('')
  const [decisionMessage, setDecisionMessage] = useState('')
  const [signalForm, setSignalForm] = useState({
    title: '',
    category: 'labor_market',
    classification: 'fact',
    summary: '',
    relevance: '',
    confidence: '3',
    sourceType: 'external_url',
    sourceName: '',
    sourceUrl: '',
    sourceReference: '',
    sourceDate: localDate(),
  })
  const [decisionForm, setDecisionForm] = useState({
    signalId: initialSignals.find((signal) => signal.status === 'active')?.id || '',
    decision: '',
    rationale: '',
    expectedEvidence: '',
    status: 'watching',
    reviewOn: localDate(7),
  })
  const [decisionEdits, setDecisionEdits] = useState<Record<string, DecisionEditState>>(
    () =>
      Object.fromEntries(
        initialDecisions.map((decision) => [
          decision.id,
          {
            status: decision.status,
            outcome: decision.outcome || '',
          },
        ]),
      ),
  )

  const activeSignals = useMemo(
    () => signals.filter((signal) => signal.status === 'active'),
    [signals],
  )
  const facts = activeSignals.filter((signal) => signal.classification === 'fact').length
  const hypotheses = activeSignals.filter(
    (signal) => signal.classification === 'hypothesis',
  ).length
  const upcomingReviews = decisions.filter(
    (decision) =>
      decision.status !== 'reviewed' && decision.status !== 'discarded',
  ).length
  const signalsById = useMemo(
    () => new Map(signals.map((signal) => [signal.id, signal])),
    [signals],
  )

  function resetSignalForm() {
    setSignalForm({
      title: '',
      category: 'labor_market',
      classification: 'fact',
      summary: '',
      relevance: '',
      confidence: '3',
      sourceType: 'external_url',
      sourceName: '',
      sourceUrl: '',
      sourceReference: '',
      sourceDate: localDate(),
    })
  }

  async function submitSignal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSignalBusy(true)
    setSignalErrors([])
    setSignalMessage('')

    try {
      const response = await fetch('/api/a4/signals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...signalForm,
          confidence: Number(signalForm.confidence),
        }),
      })
      const payload = await response.json()
      if (!response.ok) {
        setSignalErrors(errorsFromResponse(payload))
        return
      }

      const created = payload.signal as A4VerifiedSignal
      setSignals((current) => [created, ...current])
      setDecisionForm((current) => ({
        ...current,
        signalId: current.signalId || created.id,
      }))
      resetSignalForm()
      setSignalMessage('Señal guardada con su fuente y fecha verificables.')
      router.refresh()
    } catch {
      setSignalErrors(['No pudimos conectar con la bitácora de señales.'])
    } finally {
      setSignalBusy(false)
    }
  }

  async function toggleSignal(signal: A4VerifiedSignal) {
    const nextStatus = signal.status === 'active' ? 'archived' : 'active'
    setSignalBusy(true)
    setSignalErrors([])

    try {
      const response = await fetch('/api/a4/signals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ signalId: signal.id, status: nextStatus }),
      })
      const payload = await response.json()
      if (!response.ok) {
        setSignalErrors(errorsFromResponse(payload))
        return
      }
      const updated = payload.signal as A4VerifiedSignal
      setSignals((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      )
      if (nextStatus === 'archived' && decisionForm.signalId === signal.id) {
        const replacement = activeSignals.find((item) => item.id !== signal.id)
        setDecisionForm((current) => ({
          ...current,
          signalId: replacement?.id || '',
        }))
      }
      router.refresh()
    } catch {
      setSignalErrors(['No pudimos actualizar la señal.'])
    } finally {
      setSignalBusy(false)
    }
  }

  async function submitDecision(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setDecisionBusy(true)
    setDecisionErrors([])
    setDecisionMessage('')

    try {
      const response = await fetch('/api/a4/decisions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(decisionForm),
      })
      const payload = await response.json()
      if (!response.ok) {
        setDecisionErrors(errorsFromResponse(payload))
        return
      }

      const created = payload.decision as A4Decision
      setDecisions((current) => [created, ...current])
      setDecisionEdits((current) => ({
        ...current,
        [created.id]: { status: created.status, outcome: created.outcome || '' },
      }))
      setDecisionForm((current) => ({
        ...current,
        decision: '',
        rationale: '',
        expectedEvidence: '',
        status: 'watching',
        reviewOn: localDate(7),
      }))
      setDecisionMessage('Decisión registrada con una fecha explícita de revisión.')
      router.refresh()
    } catch {
      setDecisionErrors(['No pudimos conectar con la bitácora de decisiones.'])
    } finally {
      setDecisionBusy(false)
    }
  }

  async function updateDecision(decisionId: string) {
    const edit = decisionEdits[decisionId]
    if (!edit) return
    setDecisionBusy(true)
    setDecisionErrors([])

    try {
      const response = await fetch('/api/a4/decisions', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decisionId, ...edit }),
      })
      const payload = await response.json()
      if (!response.ok) {
        setDecisionErrors(errorsFromResponse(payload))
        return
      }
      const updated = payload.decision as A4Decision
      setDecisions((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      )
      setDecisionMessage('La revisión quedó actualizada con evidencia persistida.')
      router.refresh()
    } catch {
      setDecisionErrors(['No pudimos actualizar la decisión.'])
    } finally {
      setDecisionBusy(false)
    }
  }

  return (
    <div className="space-y-8">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ['Señales activas', activeSignals.length, <Radar key="radar" className="h-5 w-5 text-rose-300" />],
          ['Hechos verificados', facts, <ShieldCheck key="shield" className="h-5 w-5 text-emerald-300" />],
          ['Hipótesis abiertas', hypotheses, <FileSearch key="search" className="h-5 w-5 text-amber-300" />],
          ['Revisiones pendientes', upcomingReviews, <Clock3 key="clock" className="h-5 w-5 text-cyan-300" />],
        ].map(([label, value, icon]) => (
          <Card key={String(label)} className="border-slate-800 bg-slate-900/70">
            <CardContent className="flex items-center justify-between gap-4 p-5">
              <div>
                <p className="text-sm text-slate-400">{label}</p>
                <p className="mt-2 text-3xl font-bold text-white">{value}</p>
              </div>
              {icon}
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        <Card className="border-slate-800 bg-slate-900/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-rose-300" /> Registrar señal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={submitSignal}>
              <div>
                <label className="text-sm font-medium text-slate-200">Título</label>
                <Input
                  value={signalForm.title}
                  onChange={(event) =>
                    setSignalForm((current) => ({ ...current, title: event.target.value }))
                  }
                  placeholder="Cambio concreto que merece seguimiento"
                  className="mt-2"
                  maxLength={160}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-200">Categoría</label>
                  <select
                    value={signalForm.category}
                    onChange={(event) =>
                      setSignalForm((current) => ({ ...current, category: event.target.value }))
                    }
                    className="mt-2 h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-white"
                  >
                    {A4_SIGNAL_CATEGORIES.map((item) => (
                      <option key={item.id} value={item.id}>{item.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-200">Clasificación</label>
                  <select
                    value={signalForm.classification}
                    onChange={(event) =>
                      setSignalForm((current) => ({ ...current, classification: event.target.value }))
                    }
                    className="mt-2 h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-white"
                  >
                    {A4_SIGNAL_CLASSIFICATIONS.map((item) => (
                      <option key={item.id} value={item.id}>{item.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-200">Qué observaste</label>
                <Textarea
                  value={signalForm.summary}
                  onChange={(event) =>
                    setSignalForm((current) => ({ ...current, summary: event.target.value }))
                  }
                  placeholder="Describe la señal sin convertirla todavía en una conclusión."
                  className="mt-2 min-h-28"
                  maxLength={1200}
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-200">Por qué importa para tu ruta</label>
                <Textarea
                  value={signalForm.relevance}
                  onChange={(event) =>
                    setSignalForm((current) => ({ ...current, relevance: event.target.value }))
                  }
                  placeholder="Conecta la señal con tu rol, empresa, industria o ejecución."
                  className="mt-2"
                  maxLength={800}
                />
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-200">Confianza</label>
                  <select
                    value={signalForm.confidence}
                    onChange={(event) =>
                      setSignalForm((current) => ({ ...current, confidence: event.target.value }))
                    }
                    className="mt-2 h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-white"
                  >
                    {[1, 2, 3, 4, 5].map((value) => (
                      <option key={value} value={value}>{value}/5</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-200">Fecha de la fuente</label>
                  <Input
                    type="date"
                    max={localDate()}
                    value={signalForm.sourceDate}
                    onChange={(event) =>
                      setSignalForm((current) => ({ ...current, sourceDate: event.target.value }))
                    }
                    className="mt-2"
                  />
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-slate-200">Tipo de fuente</label>
                  <select
                    value={signalForm.sourceType}
                    onChange={(event) =>
                      setSignalForm((current) => ({ ...current, sourceType: event.target.value }))
                    }
                    className="mt-2 h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-white"
                  >
                    {A4_SOURCE_TYPES.map((item) => (
                      <option key={item.id} value={item.id}>{item.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-200">Nombre de la fuente</label>
                  <Input
                    value={signalForm.sourceName}
                    onChange={(event) =>
                      setSignalForm((current) => ({ ...current, sourceName: event.target.value }))
                    }
                    placeholder="Medio, informe, reunión o documento"
                    className="mt-2"
                    maxLength={180}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-slate-200">URL</label>
                <Input
                  type="url"
                  value={signalForm.sourceUrl}
                  onChange={(event) =>
                    setSignalForm((current) => ({ ...current, sourceUrl: event.target.value }))
                  }
                  placeholder="https://..."
                  className="mt-2"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-slate-200">Referencia alternativa</label>
                <Textarea
                  value={signalForm.sourceReference}
                  onChange={(event) =>
                    setSignalForm((current) => ({ ...current, sourceReference: event.target.value }))
                  }
                  placeholder="Nombre del documento, reunión, página o sección que permite verificarla."
                  className="mt-2"
                />
              </div>

              {signalErrors.length > 0 && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                  {signalErrors.map((error) => <p key={error}>• {error}</p>)}
                </div>
              )}
              {signalMessage && (
                <p className="flex items-center gap-2 text-sm text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" /> {signalMessage}
                </p>
              )}

              <Button type="submit" disabled={signalBusy} className="w-full">
                <Save className="mr-2 h-4 w-4" />
                {signalBusy ? 'Guardando…' : 'Guardar señal verificable'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-slate-800 bg-slate-900/70">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-cyan-300" /> Registrar decisión
            </CardTitle>
          </CardHeader>
          <CardContent>
            {activeSignals.length === 0 ? (
              <div className="rounded-xl border border-amber-500/25 bg-amber-500/5 p-5 text-sm text-amber-100/75">
                Registra al menos una señal activa antes de abrir una decisión.
              </div>
            ) : (
              <form className="space-y-4" onSubmit={submitDecision}>
                <div>
                  <label className="text-sm font-medium text-slate-200">Señal vinculada</label>
                  <select
                    value={decisionForm.signalId}
                    onChange={(event) =>
                      setDecisionForm((current) => ({ ...current, signalId: event.target.value }))
                    }
                    className="mt-2 h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-white"
                  >
                    {activeSignals.map((signal) => (
                      <option key={signal.id} value={signal.id}>{signal.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-200">Decisión o postura</label>
                  <Textarea
                    value={decisionForm.decision}
                    onChange={(event) =>
                      setDecisionForm((current) => ({ ...current, decision: event.target.value }))
                    }
                    placeholder="Qué harás, probarás, mantendrás en observación o descartarás."
                    className="mt-2 min-h-24"
                    maxLength={500}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-200">Fundamento</label>
                  <Textarea
                    value={decisionForm.rationale}
                    onChange={(event) =>
                      setDecisionForm((current) => ({ ...current, rationale: event.target.value }))
                    }
                    placeholder="Explica cómo la señal respalda esta postura y qué incertidumbre permanece."
                    className="mt-2 min-h-24"
                    maxLength={1000}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-200">Evidencia que observarás</label>
                  <Textarea
                    value={decisionForm.expectedEvidence}
                    onChange={(event) =>
                      setDecisionForm((current) => ({ ...current, expectedEvidence: event.target.value }))
                    }
                    placeholder="Define qué dato futuro confirmaría, modificaría o descartaría la postura."
                    className="mt-2"
                    maxLength={800}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-slate-200">Estado</label>
                    <select
                      value={decisionForm.status}
                      onChange={(event) =>
                        setDecisionForm((current) => ({ ...current, status: event.target.value }))
                      }
                      className="mt-2 h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-white"
                    >
                      {A4_DECISION_STATUSES.filter((item) => item.id !== 'reviewed').map((item) => (
                        <option key={item.id} value={item.id}>{item.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-200">Revisar el</label>
                    <Input
                      type="date"
                      min={localDate()}
                      value={decisionForm.reviewOn}
                      onChange={(event) =>
                        setDecisionForm((current) => ({ ...current, reviewOn: event.target.value }))
                      }
                      className="mt-2"
                    />
                  </div>
                </div>

                {decisionErrors.length > 0 && (
                  <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
                    {decisionErrors.map((error) => <p key={error}>• {error}</p>)}
                  </div>
                )}
                {decisionMessage && (
                  <p className="flex items-center gap-2 text-sm text-emerald-300">
                    <CheckCircle2 className="h-4 w-4" /> {decisionMessage}
                  </p>
                )}

                <Button type="submit" disabled={decisionBusy} className="w-full">
                  <Save className="mr-2 h-4 w-4" />
                  {decisionBusy ? 'Guardando…' : 'Guardar decisión y revisión'}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-rose-300">Bitácora</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Señales con trazabilidad</h2>
        </div>
        {signals.length === 0 ? (
          <Card className="border-slate-800 bg-slate-900/70">
            <CardContent className="p-6 text-sm text-slate-400">
              Todavía no hay señales registradas. El Radar no rellenará este espacio con información simulada.
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 lg:grid-cols-2">
            {signals.map((signal) => (
              <Card key={signal.id} className="border-slate-800 bg-slate-900/70">
                <CardContent className="space-y-4 p-5">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="outline">{categoryLabel(signal.category)}</Badge>
                        <Badge className={signal.classification === 'fact' ? 'bg-emerald-500/15 text-emerald-200' : 'bg-amber-500/15 text-amber-200'}>
                          {classificationLabel(signal.classification)}
                        </Badge>
                        {signal.status === 'archived' && <Badge variant="secondary">Archivada</Badge>}
                      </div>
                      <h3 className="mt-3 text-lg font-semibold text-white">{signal.title}</h3>
                    </div>
                    <Badge variant="outline">Confianza {signal.confidence}/5</Badge>
                  </div>

                  <p className="text-sm leading-relaxed text-slate-300">{signal.summary}</p>
                  <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                    <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Por qué importa</p>
                    <p className="mt-2 text-sm leading-relaxed text-slate-300">{signal.relevance}</p>
                  </div>

                  <div className="text-xs leading-relaxed text-slate-500">
                    <p>Fuente: <span className="text-slate-300">{signal.source_name}</span></p>
                    <p>Fecha de la fuente: <span className="text-slate-300">{formatDate(signal.source_date)}</span></p>
                    {signal.source_reference && <p>Referencia: <span className="text-slate-300">{signal.source_reference}</span></p>}
                    {signal.source_url && (
                      <a href={signal.source_url} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-cyan-300 hover:underline">
                        Abrir fuente <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    disabled={signalBusy}
                    onClick={() => toggleSignal(signal)}
                  >
                    <Archive className="mr-2 h-4 w-4" />
                    {signal.status === 'active' ? 'Archivar señal' : 'Reactivar señal'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">Seguimiento</p>
          <h2 className="mt-2 text-2xl font-bold text-white">Decisiones y fechas de revisión</h2>
        </div>
        {decisions.length === 0 ? (
          <Card className="border-slate-800 bg-slate-900/70">
            <CardContent className="p-6 text-sm text-slate-400">
              Todavía no hay decisiones vinculadas a señales.
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {decisions.map((decision) => {
              const signal = signalsById.get(decision.signal_id)
              const edit = decisionEdits[decision.id] || {
                status: decision.status,
                outcome: decision.outcome || '',
              }
              return (
                <Card key={decision.id} className="border-slate-800 bg-slate-900/70">
                  <CardContent className="grid gap-5 p-5 lg:grid-cols-[1fr_0.75fr]">
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        <Badge>{decisionStatusLabel(decision.status)}</Badge>
                        <Badge variant="outline">Revisión {formatDate(decision.review_on)}</Badge>
                      </div>
                      <h3 className="text-lg font-semibold text-white">{decision.decision}</h3>
                      <p className="text-sm leading-relaxed text-slate-300">{decision.rationale}</p>
                      <div className="rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Evidencia esperada</p>
                        <p className="mt-2 text-sm leading-relaxed text-slate-300">{decision.expected_evidence}</p>
                      </div>
                      <p className="text-xs text-slate-500">
                        Señal vinculada: <span className="text-slate-300">{signal?.title || 'Señal no disponible'}</span>
                      </p>
                    </div>

                    <div className="space-y-3 rounded-xl border border-slate-800 bg-slate-950/50 p-4">
                      <label className="text-sm font-medium text-slate-200">Actualizar estado</label>
                      <select
                        value={edit.status}
                        onChange={(event) =>
                          setDecisionEdits((current) => ({
                            ...current,
                            [decision.id]: {
                              ...edit,
                              status: event.target.value as A4DecisionStatus,
                            },
                          }))
                        }
                        className="h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-sm text-white"
                      >
                        {A4_DECISION_STATUSES.map((item) => (
                          <option key={item.id} value={item.id}>{item.label}</option>
                        ))}
                      </select>
                      <label className="text-sm font-medium text-slate-200">Resultado observado</label>
                      <Textarea
                        value={edit.outcome}
                        onChange={(event) =>
                          setDecisionEdits((current) => ({
                            ...current,
                            [decision.id]: { ...edit, outcome: event.target.value },
                          }))
                        }
                        placeholder="Obligatorio al marcar la decisión como revisada."
                        maxLength={1200}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        disabled={decisionBusy}
                        onClick={() => updateDecision(decision.id)}
                      >
                        <Save className="mr-2 h-4 w-4" /> Guardar revisión
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
