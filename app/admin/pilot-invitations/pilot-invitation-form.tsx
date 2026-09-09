'use client'

import { FormEvent, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function PilotInvitationForm() {
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
    <form onSubmit={submit} className="mt-8 space-y-5 rounded-2xl border border-border bg-card p-6">
      <div className="space-y-2">
        <Label htmlFor="pilot-email">Correo de la persona invitada</Label>
        <Input id="pilot-email" type="email" autoComplete="email" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="persona@correo.com" required />
      </div>
      <Button type="submit" disabled={sending || !email.trim()}>
        {sending ? 'Enviando…' : 'Enviar invitación'}
      </Button>
      <p aria-live="polite" role="status" className="text-sm text-muted-foreground">{status}</p>
    </form>
  )
}
