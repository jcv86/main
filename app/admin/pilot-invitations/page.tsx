'use client'

import { FormEvent, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function PilotInvitationsPage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState('')
  const [sending, setSending] = useState(false)

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSending(true)
    setStatus('')

    try {
      const response = await fetch('/api/admin/pilot-invitations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error || 'No se pudo enviar la invitación.')
      setStatus(`Invitación enviada a ${email}.`)
      setEmail('')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'No se pudo enviar la invitación.')
    } finally {
      setSending(false)
    }
  }

  return (
    <section className="mx-auto w-full max-w-2xl px-5 py-12 sm:px-8">
      <p className="text-sm font-semibold uppercase tracking-[0.14em] text-cyan">Administración del piloto</p>
      <h1 className="mt-2 text-3xl font-bold">Enviar una invitación</h1>
      <p className="mt-3 text-muted-foreground">
        Crea un acceso personal, de un solo uso y válido con vigencia de siete días.
      </p>

      <form onSubmit={submit} className="mt-8 space-y-5 rounded-2xl border border-border bg-card p-6">
        <div className="space-y-2">
          <Label htmlFor="pilot-email">Correo de la persona invitada</Label>
          <Input
            id="pilot-email"
            type="email"
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="persona@correo.com"
            required
          />
        </div>
        <Button type="submit" disabled={sending || !email.trim()}>
          {sending ? 'Enviando…' : 'Enviar invitación'}
        </Button>
        <p aria-live="polite" role="status" className="text-sm text-muted-foreground">{status}</p>
      </form>
    </section>
  )
}
