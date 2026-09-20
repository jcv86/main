'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  A1_CLARITY_PROMPTS,
  type A1ClarityResponses,
  scoreA1ProfessionalClarity,
} from '@/lib/outcomes/a1-professional-clarity'
import { OutcomeProgressCard } from '@/components/outcomes/outcome-progress-card'

type MeasurementRole = 'baseline' | 'follow_up'

interface A1ProfessionalClarityFormProps {
  role: MeasurementRole
  onSaved?: () => void
}

const EMPTY: A1ClarityResponses = { target: '', value: '', evidence: '', gap: '' }

export function A1ProfessionalClarityForm({ role, onSaved }: A1ProfessionalClarityFormProps) {
  const [responses, setResponses] = useState<A1ClarityResponses>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<{
    comparable: boolean
    normalizedBaseline: number | null
    normalizedLatest: number | null
    normalizedDelta: number | null
  } | null>(null)

  const complete = A1_CLARITY_PROMPTS.every(({ key }) => responses[key].trim().split(/\s+/).filter(Boolean).length >= 5)

  async function save() {
    if (!complete || saving) return
    setSaving(true)
    setError('')

    const scored = scoreA1ProfessionalClarity(responses)
    const response = await fetch('/api/outcomes/observations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        outcomeKey: 'professional_clarity',
        measurementRole: role,
        instrumentKey: 'a1_professional_clarity',
        instrumentVersion: '1',
        score: scored.score,
        scoreScaleMin: 0,
        scoreScaleMax: 16,
        dimensions: scored.dimensions,
        evidenceRefs: [{ source: 'a1_professional_clarity_v1', ref: role }],
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
      <div className="space-y-4">
        <OutcomeProgressCard
          label="Claridad profesional"
          comparable={result.comparable}
          baseline={result.normalizedBaseline}
          latest={result.normalizedLatest}
          delta={result.normalizedDelta}
        />
        {role === 'baseline' && (
          <p className="text-sm text-white/60">
            Baseline guardado. Aún no mostramos una mejora: necesitamos la medición comparable después de A1.
          </p>
        )}
      </div>
    )
  }

  return (
    <section className="space-y-5 rounded-2xl border border-cyan/20 bg-cyan/5 p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan">
          {role === 'baseline' ? 'Antes de ver tu análisis' : 'Después de revisar tu análisis'}
        </p>
        <h2 className="mt-2 text-2xl font-bold text-white">Medición de claridad profesional</h2>
        <p className="mt-2 text-sm leading-6 text-white/70">
          Responde con tus propias palabras. No buscamos una respuesta “correcta”: queremos una base comparable para mostrarte evidencia de cambio.
        </p>
      </div>

      {A1_CLARITY_PROMPTS.map(({ key, label, prompt }) => (
        <label key={key} className="block space-y-2">
          <span className="text-sm font-semibold text-white">{label}</span>
          <span className="block text-sm text-white/60">{prompt}</span>
          <Textarea
            value={responses[key]}
            onChange={(event) => setResponses((current) => ({ ...current, [key]: event.target.value }))}
            rows={3}
            maxLength={900}
            disabled={saving}
            className="border-white/10 bg-black/20 text-white"
          />
        </label>
      ))}

      {error && <p role="alert" className="text-sm text-red">{error}</p>}

      <Button type="button" onClick={save} disabled={!complete || saving} className="w-full">
        {saving ? 'Guardando medición...' : role === 'baseline' ? 'Guardar baseline y continuar' : 'Guardar y ver mi cambio'}
      </Button>
      <p className="text-xs text-white/50">Cada respuesta necesita al menos 5 palabras para ser evaluable.</p>
    </section>
  )
}
