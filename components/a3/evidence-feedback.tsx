'use client'

import { useEffect, useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import type { EvidenceFeedback as Feedback, PracticeReview } from '@/lib/a3/practice-feedback'

export function EvidenceFeedback({ question, answer, context = '', disabled = false, onApplyAttempt, onRecordReview }: {
  question: string
  answer: string
  context?: string
  disabled?: boolean
  onApplyAttempt: (answer: string) => void
  onRecordReview?: (review: PracticeReview) => void
}) {
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [firstAttempt, setFirstAttempt] = useState('')
  const [secondAttempt, setSecondAttempt] = useState('')
  const [retrying, setRetrying] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)
  const request = useRef<AbortController | null>(null)
  const currentInput = useRef({ question, answer, context, disabled })
  currentInput.current = { question, answer, context, disabled }
  useEffect(() => () => request.current?.abort(), [])

  const review = async () => {
    if (!answer.trim() || busy || currentInput.current.disabled) return
    const submittedAnswer = answer
    request.current?.abort()
    const controller = new AbortController()
    request.current = controller
    setBusy(true); setError(null); setNotice(null)
    try {
      const response = await fetch('/api/a3/coach-suggestion', {
        method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' },
        signal: controller.signal, body: JSON.stringify({ question, answer: submittedAnswer, context }),
      })
      const payload = await response.json()
      if (!response.ok || !payload.feedback) throw new Error('No pudimos obtener una observación vinculada a tu texto. Puedes seguir practicando con los criterios de abajo.')
      if (controller.signal.aborted || request.current !== controller) return
      if (currentInput.current.answer !== submittedAnswer || currentInput.current.question !== question || currentInput.current.context !== context) {
        setError('Tu respuesta cambió mientras se revisaba. Solicita una revisión del texto actual.')
        return
      }
      setFeedback(payload.feedback)
      setFirstAttempt(submittedAnswer)
      setSecondAttempt('')
      setRetrying(false)
    } catch (cause) {
      if (!controller.signal.aborted) setError(cause instanceof Error ? cause.message : 'No pudimos revisar el texto.')
    } finally { if (!controller.signal.aborted) setBusy(false) }
  }

  const saveRetry = () => {
    if (currentInput.current.disabled || !feedback || !secondAttempt.trim() || secondAttempt.trim() === firstAttempt.trim()) return
    if (currentInput.current.answer !== firstAttempt) {
      setError('Tu respuesta cambió después de la observación. Conservamos tu nuevo texto: solicita una revisión antes de aplicar otro intento.')
      return
    }
    onRecordReview?.({ question, firstAttempt, secondAttempt: secondAttempt.trim(), feedback, recordedAt: new Date().toISOString() })
    onApplyAttempt(secondAttempt.trim())
    setRetrying(false)
    setNotice('Segundo intento aplicado. Conserva ambos textos para revisar qué cambió; un cambio de redacción no demuestra por sí solo aprendizaje.')
  }

  return <section className="space-y-3 rounded-xl border border-cyan-500/25 bg-cyan-500/5 p-4">
    <h3 className="font-semibold text-cyan-100">Practica con evidencia de tu respuesta</h3>
    <p className="text-sm text-slate-400">Revisa claridad, evidencia propia, relación con la pregunta y orden. La sugerencia elige un criterio para practicar; no califica tu capacidad ni verifica tu historia.</p>
    <Button variant="outline" disabled={disabled || !answer.trim() || busy} onClick={() => void review()}>{busy ? 'Revisando el fragmento…' : 'Obtener una observación con cita'}</Button>
    {error && <p role="alert" className="text-sm text-amber-200">{error}</p>}
    {feedback && <div className="space-y-3">
      <p className="text-sm font-semibold text-cyan-200">Criterio para revisar: {feedback.label}</p>
      <blockquote className="whitespace-pre-wrap border-l-2 border-cyan-500 pl-3 text-sm text-slate-200">{feedback.quote}</blockquote>
      <p className="text-xs text-slate-400">Fuente: tu primer intento. La cita se comprobó contra ese texto.</p>
      <p className="text-sm text-slate-200">{feedback.action}</p>
      {answer !== firstAttempt && !notice && <p className="text-xs text-amber-200">La observación corresponde al intento anterior; tu borrador actual cambió.</p>}
      <details className="text-sm text-slate-300"><summary className="cursor-pointer">Conservar y consultar el primer intento</summary><p className="mt-2 whitespace-pre-wrap">{firstAttempt}</p></details>
      {!retrying && <Button variant="outline" disabled={disabled || busy || answer !== firstAttempt} onClick={() => { if (currentInput.current.disabled || currentInput.current.answer !== firstAttempt) return; setRetrying(true); setSecondAttempt(answer); setNotice(null) }}>Hacer un segundo intento</Button>}
      {retrying && <div className="space-y-3"><label className="block space-y-2"><span className="text-sm text-slate-200">{feedback.secondAttemptPrompt}</span><textarea className="min-h-32 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-white" disabled={disabled || busy} maxLength={8000} value={secondAttempt} onChange={(event) => setSecondAttempt(event.target.value)} /></label><p className="text-xs text-slate-400">Haz primero el intento con tus propias palabras. Después contrasta los hechos con tu CV o tus registros; deja lo desconocido como pendiente.</p><Button disabled={disabled || busy || answer !== firstAttempt || !secondAttempt.trim() || secondAttempt.trim() === firstAttempt.trim()} onClick={saveRetry}>Conservar ambos y usar el segundo intento</Button></div>}
    </div>}
    {notice && <p role="status" className="text-sm text-emerald-200">{notice}</p>}
  </section>
}
