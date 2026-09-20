'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { OutcomeProgressCard } from '@/components/outcomes/outcome-progress-card'
import {
  A3_INTERVIEW_PROMPTS,
  type A3InterviewResponses,
  scoreA3InterviewCapability,
} from '@/lib/outcomes/a3-interview-capability'

type MeasurementRole = 'baseline' | 'follow_up'
const EMPTY: A3InterviewResponses = { behavioral: '', value_fit: '', challenge: '' }

export function A3InterviewOutcomeForm({
  role,
  onSaved,
}: {
  role: MeasurementRole
  onSaved?: () => void
}) {
  const [responses, setResponses] = useState<A3InterviewResponses>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<{
    comparable: boolean
    normalizedBaseline: number | null
    normalizedLatest: number | null
    normalizedDelta: number | null
  } | null>(null)

  const complete = A3_INTERVIEW_PROMPTS.every(({ key }) => responses[key].trim().split(/\s+/).filter(Boolean).length >= 8)

  async function save() {
    if (!complete || saving) return
    setSaving(true)
    setError('')
    const scored = scoreA3InterviewCapability(responses)

    const response = await fetch('/api/outcomes/observations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        outcomeKey: 'interview_capability',
        measurementRole: role,
        instrumentKey: 'a3_structured_interview',
        instrumentVersion: '1',
        score: scored.score,
        scoreScaleMin: 0,
        scoreScaleMax: 20,
        dimensions: scored.dimensions,
        evidenceRefs: [{ source: 'a3_structured_interview_v1', ref: role }],
        confidence: scored.confidence,
        responsePayload: responses,
      }),
    })
    const data = await response.json()
    setSaving(false)

    if (!response.ok) {
      setError(data.error ?? 'No pudimos guardar esta medición.')
      return
    }

    setResult({
      comparable: data.comparable === true,
      normalizedBaseline: data.normalizedBaseline ?? null,
      normalizedLatest: data.normalizedLatest ?? null,
      normalizedDelta: data.normalizedDelta ?? null,
    })
    onSaved?.()
  }

  if (result) {
    return (
      <OutcomeProgressCard
        label="Capacidad de entrevista"
        comparable={result.comparable}
        baseline={result.normalizedBaseline}
        latest={result.normalizedLatest}
        delta={result.normalizedDelta}
      />
    )
  }

  return (
    <section className="space-y-5 rounded-2xl border border-fuchsia-500/20 bg-fuchsia-500/5 p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fuchsia-300">
          {role === 'baseline' ? 'Antes de entrenar' : 'Después de completar la ruta'}
        </p>
        <h2 className="mt-2 text-2xl font-bold">Medición comparable de entrevista</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          Responde como si estuvieras frente a un entrevistador. Esta medición es distinta de los puntajes de práctica de los módulos.
        </p>
      </div>

      {A3_INTERVIEW_PROMPTS.map(({ key, label, prompt }) => (
        <label key={key} className="block space-y-2">
          <span className="text-sm font-semibold">{label}</span>
          <span className="block text-sm text-muted-foreground">{prompt}</span>
          <Textarea
            value={responses[key]}
            onChange={(event) => setResponses((current) => ({ ...current, [key]: event.target.value }))}
            rows={4}
            maxLength={1200}
            disabled={saving}
          />
        </label>
      ))}

      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <Button type="button" onClick={save} disabled={!complete || saving} className="w-full">
        {saving ? 'Guardando medición...' : role === 'baseline' ? 'Guardar baseline y comenzar A3' : 'Guardar y ver mi cambio'}
      </Button>
      <p className="text-xs text-muted-foreground">Cada respuesta necesita al menos 8 palabras para ser evaluable.</p>
    </section>
  )
}
