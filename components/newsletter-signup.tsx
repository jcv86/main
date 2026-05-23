'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react'

interface NewsletterSignupProps {
  className?: string
}

export default function NewsletterSignup({ className = '' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email) {
      setStatus('error')
      setMessage('Por favor ingresa tu email')
      return
    }

    setLoading(true)
    setStatus('idle')

    try {
      const response = await fetch('/api/newsletter-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        setStatus('success')
        setMessage('¡Suscripción exitosa! Revisa tu email.')
        setEmail('')
        // Reset after 3 seconds
        setTimeout(() => setStatus('idle'), 3000)
      } else {
        setStatus('error')
        setMessage(data.message || 'Error al suscribirse. Intenta de nuevo.')
      }
    } catch (error) {
      console.error('[v0] Newsletter subscription error:', error)
      setStatus('error')
      setMessage('Error de conexión. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className={className}>
      <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
        <Input
          type="email"
          placeholder="tu@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          className="bg-white/10 border-white/20 text-white placeholder:text-white/60 focus:border-white"
        />
        <Button
          type="submit"
          disabled={loading}
          className="bg-white text-purple hover:bg-transparent font-semibold whitespace-nowrap"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Suscribiendo...
            </>
          ) : (
            'Suscribirse'
          )}
        </Button>
      </div>

      {status === 'success' && (
        <div className="flex items-center gap-2 mt-3 text-green/30">
          <CheckCircle2 className="w-4 h-4" />
          <span className="text-sm">{message}</span>
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-center gap-2 mt-3 text-[rgb(80,160,170)]/30">
          <AlertCircle className="w-4 h-4" />
          <span className="text-sm">{message}</span>
        </div>
      )}
    </form>
  )
}
