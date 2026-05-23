'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Loader2, Sparkles, RefreshCw } from 'lucide-react'

interface Step2CoachProps {
  visionData: {
    role: string
    environment: string
    desiredOutcome: string
  }
  onNext: (data: {
    role: string
    environment: string
    desiredOutcome: string
  }) => void
  onBack: () => void
}

export function A2Day1Step2Coach({ visionData, onNext, onBack }: Step2CoachProps) {
  const [enhanced, setEnhanced] = useState<typeof visionData | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleEnhance = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/a2/day1/coach-enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: visionData.role,
          environment: visionData.environment,
          desiredOutcome: visionData.desiredOutcome,
        }),
      })

      if (!response.ok) throw new Error('Failed to enhance vision')

      const { enhanced: enhancedData } = await response.json()
      setEnhanced({
        role: enhancedData.role,
        environment: enhancedData.environment,
        desiredOutcome: enhancedData.desiredOutcome,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to enhance vision')
    } finally {
      setLoading(false)
    }
  }

  const handleAccept = () => {
    if (enhanced) {
      onNext(enhanced)
    }
  }

  const handleReject = () => {
    setEnhanced(null)
  }

  const handleSkip = () => {
    // Continue with original vision (no enhancement)
    onNext(visionData)
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Mejora del Coach IA</h2>
        <p className="text-white/60">Deja que tu coach IA refine tu visión para hacerla más específica y accionable.</p>
      </div>

      {!enhanced ? (
        <div className="space-y-6">
          {/* Your Original Vision */}
          <div className="bg-slate-900/30 border border-[rgb(80,160,170)]/50 rounded-lg p-4 space-y-4">
            <p className="text-sm font-semibold text-white/70">TU VISIÓN ORIGINAL:</p>
            <div className="space-y-3 text-white/80">
              <div>
                <p className="text-xs text-white/60 mb-1">Rol:</p>
                <p>{visionData.role}</p>
              </div>
              <div>
                <p className="text-xs text-white/60 mb-1">Ambiente:</p>
                <p>{visionData.environment}</p>
              </div>
              <div>
                <p className="text-xs text-white/60 mb-1">Resultado Deseado:</p>
                <p>{visionData.desiredOutcome}</p>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-3">
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <Button
            onClick={handleEnhance}
            disabled={loading}
            className="w-full text-white hover:opacity-80 transition py-6 rounded-full font-semibold"
            style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Enhancing with AI Coach...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Get AI Coach Enhancement
              </>
            )}
          </Button>

          <Button
            onClick={handleSkip}
            variant="outline"
            className="w-full text-white/70 hover:text-white"
            style={{ borderColor: 'rgba(90, 90, 150, 0.3)' }}
          >
            Continue Without Enhancement
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Enhanced Vision */}
          <div className="rounded-lg p-4 space-y-4" style={{ backgroundColor: 'rgba(90, 90, 150, 0.15)', borderColor: 'rgba(90, 90, 150, 0.4)', borderWidth: '1px' }}>
            <p className="text-sm font-semibold" style={{ color: 'rgb(90, 90, 150)' }}>AI COACH ENHANCED VERSION:</p>
            <div className="space-y-3 text-white/80">
              <div>
                <p className="text-xs mb-1" style={{ color: 'rgb(90, 90, 150)' }}>Role:</p>
                <p>{enhanced.role}</p>
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: 'rgb(90, 90, 150)' }}>Ambiente:</p>
                <p>{enhanced.environment}</p>
              </div>
              <div>
                <p className="text-xs mb-1" style={{ color: 'rgb(90, 90, 150)' }}>Resultado Deseado:</p>
                <p>{enhanced.desiredOutcome}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleReject}
              variant="outline"
              className="flex-1"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Intentar de Nuevo
            </Button>
            <Button
              onClick={handleAccept}
              className="flex-1 text-white hover:opacity-80 transition py-6 rounded-full font-semibold"
              style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}
            >
              Aceptar Mejora
            </Button>
          </div>
        </div>
      )}

      <Button
        onClick={onBack}
        variant="ghost"
        className="w-full text-white/60 hover:text-white"
      >
        Back
      </Button>
    </div>
  )
}
