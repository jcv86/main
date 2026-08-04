'use client'

import { useState } from 'react'
import { Sparkles, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface A2EnhancedInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label: string
  icon?: React.ReactNode
  minRows?: number
  /** @deprecated La identidad se resuelve exclusivamente desde la sesión del servidor. */
  userId?: string
}

export function A2EnhancedInput({
  value,
  onChange,
  placeholder = 'Especifica tu respuesta...',
  label,
  icon,
  minRows = 3,
}: A2EnhancedInputProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [coachSuggestion, setCoachSuggestion] = useState<{ suggestion: string; tips: string[] } | null>(null)

  const handleCoachAssist = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/a2/coach-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: label,
          currentAnswer: value,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        setCoachSuggestion(data)
      } else {
        alert('No se pudo obtener asistencia del coach. Intenta de nuevo.')
      }
    } catch (error) {
      console.error('[a2-enhanced-input] Coach assist error:', error)
      alert('Error al conectar con el coach.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        {icon && <span style={{ color: 'rgba(90, 90, 150, 0.8)' }}>{icon}</span>}
        <label className="text-sm font-semibold text-white uppercase tracking-wide">
          {label}
        </label>
      </div>

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="text-white placeholder-slate-500 rounded-[20px] focus:ring-0 min-h-24"
        style={{
          backgroundColor: 'rgba(30, 32, 42, 0.5)',
          borderColor: 'rgba(90, 90, 150, 0.6)',
          borderWidth: '1px',
        }}
        onFocus={(e) => {
          e.currentTarget.style.borderColor = 'rgba(90, 90, 150, 0.8)'
          e.currentTarget.style.backgroundColor = 'rgba(30, 32, 42, 0.8)'
        }}
        onBlur={(e) => {
          e.currentTarget.style.borderColor = 'rgba(90, 90, 150, 0.6)'
          e.currentTarget.style.backgroundColor = 'rgba(30, 32, 42, 0.5)'
        }}
        rows={minRows}
      />

      <div className="flex gap-2">
        <Button
          onClick={handleCoachAssist}
          variant="outline"
          size="sm"
          disabled={isLoading}
          className="flex-1 disabled:opacity-50"
          style={{
            borderColor: 'rgba(90, 90, 150, 0.5)',
            backgroundColor: 'rgba(90, 90, 150, 0.1)',
            color: 'rgba(90, 90, 150, 0.8)',
          }}
          type="button"
        >
          <Sparkles className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Cargando...' : 'Asistencia Tu Coach'}
        </Button>
      </div>

      {coachSuggestion && (
        <div className="rounded-lg p-4 space-y-3" style={{ backgroundColor: 'rgba(90, 90, 150, 0.1)', borderColor: 'rgba(90, 90, 150, 0.3)', border: '1px solid rgba(90, 90, 150, 0.3)' }}>
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'rgba(90, 90, 150, 0.8)' }} />
            <div className="flex-1 space-y-2">
              <p className="text-sm font-semibold" style={{ color: 'rgba(90, 90, 150, 0.8)' }}>Sugerencia del Coach:</p>
              <p className="text-sm text-white/80">{coachSuggestion.suggestion}</p>

              {coachSuggestion.tips && coachSuggestion.tips.length > 0 && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs font-semibold uppercase" style={{ color: 'rgba(90, 90, 150, 0.7)' }}>Tips:</p>
                  <ul className="text-xs text-white/70 space-y-1">
                    {coachSuggestion.tips.map((tip, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span style={{ color: 'rgba(90, 90, 150, 0.7)' }}>•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <Button
                onClick={() => setCoachSuggestion(null)}
                variant="ghost"
                size="sm"
                className="text-xs mt-2"
                style={{ color: 'rgba(90, 90, 150, 0.8)' }}
              >
                Cerrar sugerencia
              </Button>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-slate-400">Puedes seleccionar múltiples opciones</p>
    </div>
  )
}
