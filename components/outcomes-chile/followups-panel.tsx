'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'
import { CalendarDays, CheckCircle2, Loader2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import type { ChileWorkspaceFollowup, OutcomesChileSummary } from '@/lib/outcomes-chile/workspace'
import { FormField, OUTCOME_PRIMARY_BUTTON, SELECT_CLASS, SubmissionNotice, useOutcomeSubmission, type CaptureCallbacks } from './capture-forms'
import { formatDate } from './client'
import { VerificationBadge } from './result-panels'

const FOLLOWUP_STATES = { upcoming: 'Programado', due: 'Disponible hoy', overdue: 'Pendiente de responder', completed: 'Respondido', needs_review: 'Requiere revisión' }

function FollowupItem({ followup, ...callbacks }: CaptureCallbacks & { followup: ChileWorkspaceFollowup }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('')
  const [sameRole, setSameRole] = useState('')
  const firstField = useRef<HTMLSelectElement>(null)
  const submission = useOutcomeSubmission(callbacks)
  useEffect(() => { if (open && followup.canComplete) firstField.current?.focus() }, [open, followup.canComplete])
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!active) return
    void submission.submit({ action: 'complete_followup', followupId: followup.id, employmentActive: active === 'yes', sameRole: active === 'yes' && sameRole ? sameRole === 'yes' : null })
  }
  const completed = followup.state === 'completed'
  return <li className="min-w-0 rounded-xl border border-border bg-background/30 p-4">
    <div className="flex items-start gap-3"><CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <div className="min-w-0 flex-1"><div className="flex flex-wrap items-center justify-between gap-2"><h3 id={`followup-heading-${followup.id}`} tabIndex={-1} className="rounded-md text-sm font-semibold outline-none focus-visible:ring-2 focus-visible:ring-ring">Seguimiento de {followup.day} días</h3><span className={`text-xs font-medium ${followup.state === 'overdue' || followup.state === 'needs_review' ? 'text-amber-200' : 'text-muted-foreground'}`}>{FOLLOWUP_STATES[followup.state]}</span></div>
        <p className="mt-2 break-words text-sm leading-6 text-foreground">{followup.roleTitle}</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Programado para el {formatDate(followup.dueAt)}</p>
      </div>
    </div>
    {completed && <div className="mt-4 space-y-2 border-t border-border/60 pt-3">
      <p className="text-sm leading-6">{followup.employmentActive === true ? 'Al responder, seguías en este empleo.' : followup.employmentActive === false ? 'Al responder, ya no estabas en este empleo.' : 'La situación laboral no quedó informada en la respuesta.'}</p>
      {followup.employmentActive === true && followup.sameRole !== null && <p className="text-xs text-muted-foreground">{followup.sameRole ? 'En el mismo cargo.' : 'Con un cambio de cargo.'}</p>}
      <p className="text-xs text-muted-foreground">Respondido el {formatDate(followup.completedAt!)}</p><VerificationBadge status={followup.verification} />
    </div>}
    {followup.state === 'needs_review' && <p className="mt-3 text-xs leading-6 text-muted-foreground">La fecha de esta respuesta requiere revisión. Todavía no la contamos como seguimiento completado.</p>}
    {!completed && followup.state !== 'needs_review' && !followup.canComplete && <p className="mt-3 text-xs leading-6 text-muted-foreground">{followup.state === 'upcoming' ? 'Podrás responder desde su fecha programada.' : 'Este seguimiento tiene evidencia revisada y no admite cambios desde aquí.'}</p>}
    {followup.canComplete && !open && <Button type="button" variant="outline" onClick={() => setOpen(true)} className="mt-4 w-full gap-2"><CheckCircle2 className="h-4 w-4" aria-hidden="true" />Responder seguimiento<span className="sr-only"> de {followup.day} días para {followup.roleTitle}</span></Button>}
    {followup.canComplete && open && <form onSubmit={submit} onChange={submission.clearMessage} className="mt-5 space-y-4 border-t border-border pt-4" aria-label={`Responder seguimiento de ${followup.day} días para ${followup.roleTitle}`}>
      <p className="text-xs leading-6 text-muted-foreground">Responde cómo estás hoy. Una respuesta tardía describe tu situación al responder; no acredita cómo estabas exactamente en el día {followup.day}.</p>
      <fieldset disabled={submission.state.phase === 'saving'} className="min-w-0 space-y-4">
        <legend className="sr-only">Situación laboral actual</legend>
        <FormField id={`followup-active-${followup.id}`} label="¿Sigues trabajando en este empleo?">
          <select ref={firstField} id={`followup-active-${followup.id}`} value={active} onChange={event => { setActive(event.target.value); if (event.target.value !== 'yes') setSameRole('') }} className={SELECT_CLASS} required>
            <option value="">Selecciona una respuesta</option><option value="yes">Sí, sigo en este empleo</option><option value="no">No, ya no estoy en este empleo</option>
          </select>
        </FormField>
        {active === 'yes' && <FormField id={`followup-role-${followup.id}`} label="¿Sigues en el mismo cargo? (opcional)">
          <select id={`followup-role-${followup.id}`} value={sameRole} onChange={event => setSameRole(event.target.value)} className={SELECT_CLASS}>
            <option value="">No quiero precisar</option><option value="yes">Sí, en el mismo cargo</option><option value="no">No, cambié de cargo</option>
          </select>
        </FormField>}
      </fieldset>
      <SubmissionNotice state={submission.state} onRefresh={callbacks.onRefresh} />
      {submission.state.phase !== 'saved' && <Button type="submit" className={`w-full gap-2 ${OUTCOME_PRIMARY_BUTTON}`} disabled={submission.state.phase === 'saving'}>{submission.state.phase === 'saving' && <Loader2 className="h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />}{submission.state.phase === 'saving' ? 'Guardando…' : submission.state.phase === 'error' ? 'Reintentar seguimiento' : 'Guardar seguimiento'}</Button>}
    </form>}
  </li>
}

export function OutcomeFollowups({ summary, ...callbacks }: CaptureCallbacks & { summary: OutcomesChileSummary }) {
  const { followups, followupCount, followupsTruncated } = summary.workspace
  const [savedFollowup, setSavedFollowup] = useState<string | null>(null)
  const more = useRef<HTMLDetailsElement>(null)
  useEffect(() => {
    const index = followups.findIndex(item => item.id === savedFollowup && item.state === 'completed')
    if (index === -1 || !savedFollowup) return
    if (index >= 3 && more.current) more.current.open = true
    document.getElementById(`followup-heading-${savedFollowup}`)?.focus()
    setSavedFollowup(null)
  }, [followups, savedFollowup])
  const itemCallbacks = (id: string) => ({ ...callbacks, onSaved: () => { setSavedFollowup(id); callbacks.onSaved() } })
  return <section aria-labelledby="outcome-followups-title"><Card className="h-full"><CardContent className="space-y-5 p-5 sm:p-6">
    <div><p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--dtc-indigo-300)]">Después del cambio</p><h2 id="outcome-followups-title" className="mt-2 text-xl font-semibold tracking-tight">Cómo sigue tu trabajo</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Revisa tus seguimientos de 30, 90 y 180 días. La fecha programada por sí sola no demuestra permanencia laboral.</p></div>
    {followups.length ? <>
      <ul className="space-y-3">{followups.slice(0, 3).map(followup => <FollowupItem key={followup.id} followup={followup} {...itemCallbacks(followup.id)} />)}</ul>
      {followups.length > 3 && <details ref={more} className="border-t border-border pt-4"><summary className="cursor-pointer rounded-md text-sm font-medium leading-6 text-[hsl(var(--ring))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">Ver {followups.length - 3} seguimientos más</summary><ul className="mt-4 space-y-3">{followups.slice(3).map(followup => <FollowupItem key={followup.id} followup={followup} {...itemCallbacks(followup.id)} />)}</ul></details>}
    </> : <p className="rounded-xl border border-dashed border-border p-5 text-sm leading-6 text-muted-foreground">Cuando registres un trabajo, aquí aparecerán las fechas para contar cómo sigues. Puedes comenzar en la sección Trabajo.</p>}
    {followupsTruncated && <p className="text-xs leading-5 text-muted-foreground">Esta vista muestra {followups.length} de {followupCount} seguimientos, dando prioridad a los que puedes responder. Los indicadores consideran todos los registros elegibles.</p>}
  </CardContent></Card></section>
}
