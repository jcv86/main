"use client"

import { useEffect, useRef, useState, type FormEvent } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { GuidedNextAction } from '@/components/journey/guided-next-action'
import { A2ReviewedPlan } from '@/components/a2-reviewed-plan'
import { A2AssistantAction } from '@/components/a2-assistant-action'
import type { GuidedNextAction as Guidance } from '@/lib/journey/next-action'
import { A2_ASSISTANT_ACTOR_HEADER, A2_ASSISTANT_EXPECTED_ACTOR_HEADER } from '@/lib/a2/assistant-contract'
import { a2ActionProposalSchema, type A2ActionProposal } from '@/lib/a2/assistant-action-contract'
import { a2PlanGuidanceSchema } from '@/lib/a2/plan-contract'
import { ArrowRight, Loader2, MessageCircle, Send } from 'lucide-react'

type Message = { role: 'user' | 'assistant'; content: string }

export function A2ChatCoach({ actorId, initialGuidance }: { actorId: string; initialGuidance: Guidance }) {
  const [client] = useState(() => createClient())
  const [guidance, setGuidance] = useState(initialGuidance)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sessionChanged, setSessionChanged] = useState(false)
  const [identityVerified, setIdentityVerified] = useState(false)
  const [actionProposal, setActionProposal] = useState<A2ActionProposal | null>(null)
  const [actionGuidance, setActionGuidance] = useState<Guidance | null>(null)
  const [responseRevision, setResponseRevision] = useState(0)
  const [planRefreshKey, setPlanRefreshKey] = useState(0)
  const requestGeneration = useRef(0)
  const controllerRef = useRef<AbortController | null>(null)
  const invalidSessionRef = useRef(false)
  const transcriptRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  function invalidateSession() {
    invalidSessionRef.current = true
    requestGeneration.current += 1
    controllerRef.current?.abort()
    setMessages([])
    setInput('')
    setActionProposal(null)
    setActionGuidance(null)
    setError(null)
    setLoading(false)
    setSessionChanged(true)
    setIdentityVerified(false)
  }

  useEffect(() => {
    let active = true
    const { data: { subscription } } = client.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || (event === 'INITIAL_SESSION' && !session) || (session?.user?.id && session.user.id !== actorId)) invalidateSession()
    })
    void client.auth.getUser().then(({ data: { user }, error: authError }) => {
      if (!active || invalidSessionRef.current) return
      if (authError || !user || user.id !== actorId) invalidateSession()
      else setIdentityVerified(true)
    }).catch(() => { if (active) invalidateSession() })
    return () => {
      active = false
      requestGeneration.current += 1
      controllerRef.current?.abort()
      subscription.unsubscribe()
    }
  }, [client, actorId])

  useEffect(() => { setGuidance(initialGuidance) }, [initialGuidance])
  useEffect(() => {
    const element = transcriptRef.current
    if (element) element.scrollTop = element.scrollHeight
  }, [messages, loading])

  async function handleSendMessage(event: FormEvent) {
    event.preventDefault()
    const question = input.trim()
    if (question.length < 2 || loading || invalidSessionRef.current) return
    setLoading(true)
    setError(null)
    const generation = ++requestGeneration.current
    const controller = new AbortController()
    controllerRef.current = controller
    const timeout = window.setTimeout(() => controller.abort(), 30_000)
    try {
      const { data: { user }, error: authError } = await client.auth.getUser()
      if (generation !== requestGeneration.current) return
      if (authError || !user || user.id !== actorId) { invalidateSession(); return }
      const response = await fetch('/api/despega/a2-coach', {
        method: 'POST', credentials: 'same-origin', cache: 'no-store', signal: controller.signal,
        headers: { 'Content-Type': 'application/json', [A2_ASSISTANT_EXPECTED_ACTOR_HEADER]: actorId },
        body: JSON.stringify({
          message: question,
          conversationHistory: messages.slice(-12).map(message => ({ ...message, content: message.content.slice(0, 3_000) })),
        }),
      })
      const payload = await response.json().catch(() => null)
      if (generation !== requestGeneration.current || invalidSessionRef.current) return
      const verified = await client.auth.getUser()
      if (generation !== requestGeneration.current || invalidSessionRef.current) return
      if (verified.error || verified.data.user?.id !== actorId) { invalidateSession(); return }
      const responseActor = response.headers.get(A2_ASSISTANT_ACTOR_HEADER)
      if (response.status === 401 || response.status === 409 || (responseActor && responseActor !== actorId)) {
        invalidateSession(); return
      }
      const checkedGuidance = a2PlanGuidanceSchema.safeParse(payload?.guidance)
      if (responseActor === actorId && checkedGuidance.success) setGuidance(checkedGuidance.data)
      // Middleware failures can omit the actor header. Their body is never treated
      // as personal guidance, and the unanswered question remains in the editor.
      if (!response.ok) {
        setError(response.status === 429 ? 'Has alcanzado el límite de consultas por ahora. Puedes continuar con tu siguiente acción.'
          : responseActor === actorId && typeof payload?.error === 'string' ? payload.error
          : 'No pudimos recibir la respuesta. Tu pregunta se conserva; puedes reintentar.')
        return
      }
      if (responseActor !== actorId || typeof payload?.response !== 'string' || !payload.response.trim()
        || !checkedGuidance.success) {
        setError('No pudimos verificar la respuesta. Tu pregunta se conserva; puedes reintentar.')
        return
      }
      const proposed = payload.actionProposal === undefined ? null : a2ActionProposalSchema.safeParse(payload.actionProposal)
      if (proposed && (!proposed.success || checkedGuidance.data.action.href !== `/despega/a2/dia-${proposed.data.dayNumber}`)) {
        setError('No pudimos verificar la propuesta de ajuste. Tu pregunta se conserva; puedes reintentar.')
        return
      }
      setMessages(previous => [...previous, { role: 'user', content: question }, { role: 'assistant', content: payload.response }])
      // A new reply never overwrites an open action editor or its exact pending
      // command. The action card requires a fresh context review before reuse.
      setActionProposal(proposed?.success ? proposed.data : null)
      setActionGuidance(proposed?.success ? checkedGuidance.data : null)
      setResponseRevision(previous => previous + 1)
      setInput('')
    } catch {
      if (generation === requestGeneration.current && !invalidSessionRef.current) {
        setError('No pudimos recibir la respuesta. Tu pregunta se conserva; revisa tu conexión y reintenta.')
      }
    } finally {
      window.clearTimeout(timeout)
      if (generation === requestGeneration.current) {
        setLoading(false)
        inputRef.current?.focus()
      }
    }
  }

  if (sessionChanged) return <Alert role="alert">
    <AlertDescription>
      La sesión cambió. Vuelve a abrir el asistente para continuar con el recorrido correcto.{' '}
      <a href="/despega/a2/coach" className="mt-3 inline-flex min-h-11 items-center rounded-md font-semibold underline underline-offset-4 focus-visible:ring-2 focus-visible:ring-ring">Volver a abrir el asistente</a>
    </AlertDescription>
  </Alert>

  if (!identityVerified) return <p role="status" className="py-6 text-sm text-muted-foreground">Verificando tu sesión para abrir el asistente…</p>

  return <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
    <Card className="min-w-0 self-start">
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><MessageCircle className="h-5 w-5" aria-hidden="true" />Asistente de Tu Ruta</CardTitle>
        <CardDescription>Pregunta, revisa una dificultad o piensa una acción más pequeña. Esta conversación dura mientras mantienes abierta la página.</CardDescription>
      </CardHeader>
      <CardContent className="min-w-0 space-y-4">
        <div ref={transcriptRef} role="log" tabIndex={0} aria-label="Conversación con el asistente" aria-live="polite" aria-relevant="additions"
          className="max-h-[28rem] min-h-32 space-y-4 overflow-y-auto rounded-xl border border-border p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          {messages.length === 0 && <p className="text-sm leading-6 text-muted-foreground">Puedes empezar con: «No pude realizar mi última acción. ¿Cómo la hago más abordable?»</p>}
          {messages.map((message, index) => <div key={index} className="min-w-0 space-y-1">
            <p className="text-xs font-semibold text-muted-foreground">{message.role === 'user' ? 'Tú' : 'Asistente DTC'}</p>
            <p className="whitespace-pre-wrap break-words text-sm leading-6 text-foreground">{message.content}</p>
          </div>)}
        </div>
        {error && <Alert variant="destructive" role="alert"><AlertDescription>{error}</AlertDescription></Alert>}
        <form onSubmit={handleSendMessage} className="space-y-3" aria-busy={loading}>
          <label htmlFor="a2-assistant-question" className="block text-sm font-medium">Tu pregunta</label>
          <textarea id="a2-assistant-question" ref={inputRef} value={input} onChange={event => setInput(event.target.value)}
            readOnly={loading} maxLength={2_000} rows={4} aria-describedby="a2-assistant-help"
            className="w-full resize-y rounded-lg border border-input bg-background px-3 py-2 text-base text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            placeholder="¿Qué puedo intentar con el tiempo que tengo?" />
          <p id="a2-assistant-help" className="text-xs leading-5 text-muted-foreground">Si aparece una propuesta de ajuste, revísala antes de confirmar. Para completar una práctica, continúa en el día correspondiente.</p>
          <Button type="submit" disabled={loading || input.trim().length < 2} className="min-h-11 bg-emerald-700 text-white hover:bg-emerald-800">
            {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin motion-reduce:animate-none" aria-hidden="true" /> : <Send className="mr-2 h-4 w-4" aria-hidden="true" />}
            {loading ? 'Preparando respuesta…' : error ? 'Reintentar pregunta' : 'Enviar pregunta'}
          </Button>
          <p role="status" className="text-sm text-muted-foreground">{loading ? 'Estamos revisando tu consulta y el recorrido guardado.' : ''}</p>
        </form>
      </CardContent>
    </Card>
    <div className="min-w-0 space-y-6 self-start">
    <Card className="min-w-0">
      <CardHeader><CardTitle className="text-xl">Tu siguiente acción</CardTitle><CardDescription>{guidance.action.title}</CardDescription></CardHeader>
      <CardContent className="min-w-0">
        <p className="text-sm leading-6 text-muted-foreground">{guidance.action.description}</p>
        <GuidedNextAction guidance={guidance} reloadHref="/despega/a2/coach" />
        <Button asChild className="mt-5 h-auto min-h-11 w-full whitespace-normal bg-emerald-700 text-white hover:bg-emerald-800 hover:text-white">
          <Link href={guidance.action.href}>{guidance.action.label}<ArrowRight className="ml-2 h-4 w-4 shrink-0" aria-hidden="true" /></Link>
        </Button>
      </CardContent>
    </Card>
    <A2AssistantAction actorId={actorId} proposal={actionProposal} proposalGuidance={actionGuidance}
      responseRevision={responseRevision} assistantBusy={loading} onSessionChanged={invalidateSession}
      onGuidanceUpdated={setGuidance} onSaved={() => setPlanRefreshKey(previous => previous + 1)} />
    <A2ReviewedPlan actorId={actorId} refreshKey={planRefreshKey} onSessionChanged={invalidateSession} onGuidanceUpdated={setGuidance} />
    </div>
  </div>
}
