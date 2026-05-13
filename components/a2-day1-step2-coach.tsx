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
        <h2 className="text-2xl font-bold text-white mb-2">AI Coach Enhancement</h2>
        <p className="text-white/60">Let your AI coach refine your vision to make it more specific and actionable.</p>
      </div>

      {!enhanced ? (
        <div className="space-y-6">
          {/* Your Original Vision */}
          <div className="bg-slate-900/30 border border-slate-700/50 rounded-lg p-4 space-y-4">
            <p className="text-sm font-semibold text-white/70">YOUR ORIGINAL VISION:</p>
            <div className="space-y-3 text-white/80">
              <div>
                <p className="text-xs text-white/60 mb-1">Role:</p>
                <p>{visionData.role}</p>
              </div>
              <div>
                <p className="text-xs text-white/60 mb-1">Environment:</p>
                <p>{visionData.environment}</p>
              </div>
              <div>
                <p className="text-xs text-white/60 mb-1">Desired Outcome:</p>
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
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white"
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
            className="w-full border-slate-600 text-white/70 hover:text-white"
          >
            Continue Without Enhancement
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Enhanced Vision */}
          <div className="bg-cyan-900/20 border border-cyan-500/30 rounded-lg p-4 space-y-4">
            <p className="text-sm font-semibold text-cyan-400">AI COACH ENHANCED VERSION:</p>
            <div className="space-y-3 text-white/80">
              <div>
                <p className="text-xs text-cyan-400 mb-1">Role:</p>
                <p>{enhanced.role}</p>
              </div>
              <div>
                <p className="text-xs text-cyan-400 mb-1">Environment:</p>
                <p>{enhanced.environment}</p>
              </div>
              <div>
                <p className="text-xs text-cyan-400 mb-1">Desired Outcome:</p>
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
              Try Again
            </Button>
            <Button
              onClick={handleAccept}
              className="flex-1 bg-emerald-600 hover:bg-emerald-700"
            >
              Accept Enhancement
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
