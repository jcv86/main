'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { A2_BARRIERS, type A2Barrier, type A2AdjustmentRequest, type adjustmentContent } from '@/lib/a2/practice-adjustment'
import type { A2MissionSubmission } from '@/lib/a2/day-submission'

type Saved = ReturnType<typeof adjustmentContent> & { id: string; createdAt?: string }
const field = 'w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-white'

export function A2PracticeAdjustment({ dayNumber, draftScope, draft, onRestoreDraft }: { dayNumber: number; draftScope: string; draft?: A2MissionSubmission; onRestoreDraft?: (draft: A2MissionSubmission) => void }) {
  const [outcome, setOutcome] = useState<A2AdjustmentRequest['outcome'] | null>(null)
  const [barrier, setBarrier] = useState<A2Barrier>('time')
  const [retainedWork, setRetainedWork] = useState('')
  const [nextAction, setNextAction] = useState('')
  const [reviewDate, setReviewDate] = useState('')
  const [history, setHistory] = useState<Saved[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const pendingRequest = useRef<A2AdjustmentRequest | null>(null)
  const draftKey = `dtc:a2:${draftScope}:adjustment:${dayNumber}`

  useEffect(() => {
    const controller = new AbortController()
    void fetch(`/api/a2/practice-adjustments?day=${dayNumber}`, { credentials: 'include', cache: 'no-store', signal: controller.signal })
      .then(async (response) => {
        if (!response.ok) throw new Error('No pudimos recuperar los ajustes anteriores.')
        return response.json()
      }).then((data) => setHistory(data.adjustments || []))
      .catch((cause) => { if (!controller.signal.aborted) setError(cause.message) })
    try {
      const local = JSON.parse(window.localStorage.getItem(draftKey) || 'null')
      if (local?.outcome === 'could_not' || local?.outcome === 'change') {
        setOutcome(local.outcome)
        if (local.barrier in A2_BARRIERS) setBarrier(local.barrier)
        setRetainedWork(typeof local.retainedWork === 'string' ? local.retainedWork : '')
        setNextAction(typeof local.nextAction === 'string' ? local.nextAction : '')
        setReviewDate(typeof local.reviewDate === 'string' ? local.reviewDate : '')
      }
    } catch { /* A damaged local draft never hides server history. */ }
    return () => controller.abort()
  }, [dayNumber, draftKey])

  const save = async () => {
    if (!outcome || saving) return
    const fields = { dayNumber, outcome, barrier, retainedWork, nextAction, reviewDate, ...(draft ? { draft } : {}) }
    const prior = pendingRequest.current
    const candidate = { ...fields, requestId: prior?.requestId || crypto.randomUUID() }
    if (prior && JSON.stringify({ ...prior, requestId: '' }) !== JSON.stringify({ ...candidate, requestId: '' })) candidate.requestId = crypto.randomUUID()
    pendingRequest.current = candidate
    try { window.localStorage.setItem(draftKey, JSON.stringify(fields)) } catch { /* Server save remains available. */ }
    setSaving(true); setError(null); setNotice(null)
    try {
      const response = await fetch('/api/a2/practice-adjustments', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(candidate) })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || 'No pudimos guardar el ajuste.')
      setHistory((current) => [{ ...data.adjustment, id: data.id }, ...current.filter((item) => item.id !== data.id)].slice(0, 10))
      pendingRequest.current = null
      try { window.localStorage.removeItem(draftKey) } catch { /* Saved in the account. */ }
      setNotice('Ajuste guardado en tu cuenta. Los entregables y días completados se conservan.')
      setOutcome(null)
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'No pudimos guardar el ajuste.') }
    finally { setSaving(false) }
  }

  return <section className="space-y-4 rounded-2xl border border-cyan-500/25 bg-slate-950/50 p-5">
    <div><h2 className="font-semibold text-white">¿Cómo va tu práctica?</h2><p className="mt-1 text-sm text-slate-400">Puedes guardar lo realizado o ajustar la acción a una barrera real. El calendario orienta; conserva tu ritmo y tus evidencias.</p></div>
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => { setOutcome(null); document.getElementById('a2-deliverable')?.focus(); document.getElementById('a2-deliverable')?.scrollIntoView({ behavior: 'smooth' }) }}>HECHO · Ir al entregable</Button>
      <Button variant={outcome === 'could_not' ? 'default' : 'outline'} onClick={() => { setOutcome('could_not'); setNotice(null) }}>NO PUDE</Button>
      <Button variant={outcome === 'change' ? 'default' : 'outline'} onClick={() => { setOutcome('change'); setNotice(null) }}>CAMBIAR</Button>
    </div>
    {outcome && <fieldset disabled={saving} className="space-y-4">
      <label className="block space-y-2"><span className="text-sm text-slate-200">¿Qué necesitas ajustar?</span><select className={field} value={barrier} onChange={(event) => { const value = event.target.value as A2Barrier; setBarrier(value); pendingRequest.current = null }}>{Object.entries(A2_BARRIERS).map(([key, value]) => <option key={key} value={key}>{value.label}</option>)}</select></label>
      <p className="rounded-lg bg-cyan-500/10 p-3 text-sm text-cyan-100"><strong>Ajuste sugerido:</strong> {A2_BARRIERS[barrier].suggestion}</p>
      <label className="block space-y-2"><span className="text-sm text-slate-200">Qué conservas de lo realizado, o qué quedó pendiente</span><textarea className={field} maxLength={4000} rows={3} value={retainedWork} onChange={(event) => setRetainedWork(event.target.value)} /></label>
      <label className="block space-y-2"><span className="text-sm text-slate-200">Tu siguiente acción concreta</span><textarea className={field} maxLength={2000} rows={2} value={nextAction} onChange={(event) => setNextAction(event.target.value)} placeholder={A2_BARRIERS[barrier].suggestion} /></label>
      <label className="block space-y-2"><span className="text-sm text-slate-200">Cuándo revisarás el ajuste</span><input className={field} type="date" value={reviewDate} onChange={(event) => setReviewDate(event.target.value)} /></label>
      <Button onClick={() => void save()} disabled={saving || !retainedWork.trim() || !nextAction.trim() || !reviewDate}>{saving ? 'Guardando…' : 'Guardar ajuste y conservar avance'}</Button>
    </fieldset>}
    {error && <p role="alert" className="text-sm text-amber-200">{error}</p>}
    {notice && <p role="status" className="text-sm text-emerald-200">{notice}</p>}
    {history.length > 0 && <details className="text-sm text-slate-300"><summary className="cursor-pointer">Ajustes guardados de este día ({history.length})</summary><ol className="mt-3 space-y-3">{history.map((item) => <li key={item.id} className="rounded-lg border border-slate-800 p-3"><p className="font-medium">{item.outcome === 'could_not' ? 'NO PUDE' : 'CAMBIAR'} · {A2_BARRIERS[item.barrier].label}</p><p className="mt-1">Conservo: {item.retainedWork}</p><p className="mt-1">Siguiente acción: {item.nextAction}</p><p className="mt-1 text-slate-400">Revisión: {item.reviewDate}</p>{item.draft && onRestoreDraft && <Button className="mt-3" variant="outline" size="sm" onClick={() => { onRestoreDraft(item.draft!); setNotice('Recuperaste el trabajo guardado en este ajuste. Puedes continuar y guardar el entregable cuando esté listo.') }}>Recuperar trabajo de este ajuste</Button>}</li>)}</ol></details>}
  </section>
}
