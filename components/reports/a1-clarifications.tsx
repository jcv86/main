'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { RECOGNITION_OPTIONS, type ClarificationQuestion, type ClarificationAnswers } from '@/lib/a1/individual-evidence'

interface Props { revision: string; editRevision: string; questions: ClarificationQuestion[]; initial: ClarificationAnswers | null; stale: boolean }

export function A1Clarifications({ revision, editRevision, questions, initial, stale }: Props) {
  const router = useRouter()
  const [answers, setAnswers] = useState<ClarificationAnswers>(initial || { selections: {}, recognition: null })
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [conflict, setConflict] = useState(false)
  const [saved, setSaved] = useState(false)
  const saving = useRef(false)
  const changed = () => { setMessage(''); setSaved(false) }
  const save = async (clear = false) => {
    if (saving.current || conflict || saved) return
    saving.current = true
    setBusy(true)
    setMessage('')
    const next = clear ? { selections: {}, recognition: null } : answers
    try {
      const response = await fetch('/api/a1/clarifications', { method: 'PUT', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ revision, editRevision, answers: next }) })
      const payload = await response.json().catch(() => ({})) as { error?: string; success?: boolean }
      if (!response.ok || !payload.success) { if (response.status === 409) setConflict(true); throw new Error(payload.error || 'No pudimos guardar tus aclaraciones.') }
      setAnswers(next)
      setSaved(true)
      setMessage(clear ? 'Aclaraciones retiradas de esta lectura.' : 'Aclaraciones guardadas. Estamos actualizando tu lectura.')
      router.refresh()
    } catch (error) { setMessage(error instanceof Error ? error.message : 'No pudimos guardar. Intenta nuevamente.') }
    finally { saving.current = false; setBusy(false) }
  }
  return (
    <section className="rounded-2xl border border-cyan-400/30 bg-cyan-500/5 p-5 sm:p-6 print:hidden" aria-labelledby="a1-clarifications-heading" data-report-actions>
      <h2 id="a1-clarifications-heading" className="text-2xl font-semibold text-white">Añade los matices que el cuestionario no ve</h2>
      <p className="mt-3 text-sm leading-relaxed text-slate-300">Cuatro aclaraciones opcionales, sin escribir. Puedes responder solo algunas o continuar sin responder. Se guardan con esta lectura y no modifican tus puntajes.</p>
      {stale && <p className="mt-3 rounded-lg border border-amber-400/30 p-3 text-sm text-amber-100">El contexto o la evaluación cambió desde las aclaraciones anteriores. No las aplicamos a esta versión; puedes responder nuevamente.</p>}
      <form className="mt-6 space-y-6" onSubmit={(event) => { event.preventDefault(); void save() }}>
        {questions.map((question, index) => <fieldset key={question.id} disabled={busy || conflict || saved} className="space-y-3">
          <legend className="font-semibold text-slate-100">{index + 1}. {question.prompt}</legend>
          <p className="text-xs leading-relaxed text-slate-400">{question.reason}</p>
          <div className="grid gap-2">{question.options.map((option) => <label key={option.id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-700 p-3 text-sm leading-relaxed text-slate-200 focus-within:outline focus-within:outline-2 focus-within:outline-cyan-300"><input type="radio" name={`clarification-${question.id}`} value={option.id} checked={answers.selections[question.id] === option.id} onChange={() => { setAnswers((current) => ({ ...current, selections: { ...current.selections, [question.id]: option.id } })); changed() }} className="mt-1 shrink-0 accent-cyan-400" /><span>{option.label}</span></label>)}</div>
        </fieldset>)}
        <fieldset disabled={busy || conflict || saved} className="space-y-3">
          <legend className="font-semibold text-slate-100">¿Cómo recibes esta lectura?</legend>
          <p className="text-xs text-slate-400">Tu acuerdo o desacuerdo se conserva como tu perspectiva, no como prueba de que el cuestionario acertó o se equivocó.</p>
          <div className="grid gap-2 sm:grid-cols-2">{RECOGNITION_OPTIONS.map((option) => <label key={option.id} className="flex cursor-pointer items-start gap-3 rounded-xl border border-slate-700 p-3 text-sm text-slate-200 focus-within:outline focus-within:outline-2 focus-within:outline-cyan-300"><input type="radio" name="a1-recognition" value={option.id} checked={answers.recognition === option.id} onChange={() => { setAnswers((current) => ({ ...current, recognition: option.id })); changed() }} className="mt-1 accent-cyan-400" /><span>{option.label}</span></label>)}</div>
        </fieldset>
        <p role="status" aria-live="polite" className="text-sm text-slate-200">{message}</p>
        <div className="flex flex-wrap gap-3"><Button type="submit" className="bg-emerald-700 text-white hover:bg-emerald-800" disabled={busy || conflict || saved}>{busy ? 'Guardando…' : saved ? 'Guardado' : 'Guardar mis matices'}</Button>{initial && <Button type="button" variant="outline" disabled={busy || conflict || saved} onClick={() => void save(true)}>Retirar mis aclaraciones</Button>}{conflict && <Button type="button" variant="outline" onClick={() => router.refresh()}>Recargar versión actual</Button>}</div>
      </form>
    </section>
  )
}
