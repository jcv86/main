'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { OutcomeProgressCard } from '@/components/outcomes/outcome-progress-card'
import { A2_EXECUTION_PROMPTS, type A2ExecutionResponses, scoreA2ExecutionCapability } from '@/lib/outcomes/a2-execution-capability'

type MeasurementRole = 'baseline' | 'follow_up'
const EMPTY: A2ExecutionResponses = { objective: '', actions: '', evidence: '', obstacle: '', review: '' }

export function A2ExecutionOutcomeForm({ role, onSaved }: { role: MeasurementRole; onSaved?: () => void }) {
  const [responses, setResponses] = useState<A2ExecutionResponses>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [result, setResult] = useState<{ comparable: boolean; normalizedBaseline: number | null; normalizedLatest: number | null; normalizedDelta: number | null } | null>(null)
  const complete = A2_EXECUTION_PROMPTS.every(({ key }) => responses[key].trim().split(/\s+/).filter(Boolean).length >= 6)

  async function save() {
    if (!complete || saving) return
    setSaving(true)
    setError('')
    const scored = scoreA2ExecutionCapability(responses)
    const response = await fetch('/api/outcomes/observations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        outcomeKey: 'execution_capability',
        measurementRole: role,
        instrumentKey: 'a2_execution_checkpoint',
        instrumentVersion: '1',
        score: scored.score,
        scoreScaleMin: 0,
        scoreScaleMax: 20,
        dimensions: scored.dimensions,
        evidenceRefs: [{ source: 'a2_execution_checkpoint_v1', ref: role }],
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
    return <OutcomeProgressCard label="Capacidad de ejecución" comparable={result.comparable} baseline={result.normalizedBaseline} latest={result.normalizedLatest} delta={result.normalizedDelta} />
  }

  return (
    <section className="space-y-5 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-6">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-300">{role === 'baseline' ? 'Antes de comenzar Tu Ruta' : 'Checkpoint comparable'}</p>
        <h2 className="mt-2 text-2xl font-bold">Capacidad de ejecución</h2>
        <p className="mt-2 text-sm text-muted-foreground">Esto no mide cuántas misiones completas. Mide cómo conviertes una intención profesional en un plan ejecutable y verificable.</p>
      </div>
      {A2_EXECUTION_PROMPTS.map(({ key, label, prompt }) => (
        <label key={key} className="block space-y-2">
          <span className="text-sm font-semibold">{label}</span>
          <span className="block text-sm text-muted-foreground">{prompt}</span>
          <Textarea value={responses[key]} onChange={(event) => setResponses((current) => ({ ...current, [key]: event.target.value }))} rows={3} maxLength={1000} disabled={saving} />
        </label>
      ))}
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      <Button type="button" onClick={save} disabled={!complete || saving} className="w-full">
        {saving ? 'Guardando medición...' : role === 'baseline' ? 'Guardar baseline y comenzar Tu Ruta' : 'Guardar y ver mi cambio'}
      </Button>
      <p className="text-xs text-muted-foreground">Cada respuesta necesita al menos 6 palabras.</p>
    </section>
  )
}
