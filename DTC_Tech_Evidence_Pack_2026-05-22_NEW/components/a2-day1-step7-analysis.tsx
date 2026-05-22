'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Loader2, CheckCircle, AlertCircle, RotateCcw } from 'lucide-react'

interface Step7AnalysisProps {
  visionData: {
    role: string
    environment: string
    desiredOutcome: string
  }
  milestonesData: {
    day10: string
    day20: string
    day30: string
  }
  actionPlanData: any
  onComplete: () => void
  onRevise: () => void
}

interface AnalysisResult {
  totalScore: number
  passFail: 'pass' | 'fail'
  scores: {
    visionClarity: number
    milestoneQuality: number
    actionCompleteness: number
    realismCoherence: number
  }
  feedback: string
  strengths: string[]
  improvements: string[]
}

export function A2Day1Step7Analysis({
  visionData,
  milestonesData,
  actionPlanData,
  onComplete,
  onRevise,
}: Step7AnalysisProps) {
  const [analyzing, setAnalyzing] = useState(true)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const runAnalysis = async () => {
      try {
        const response = await fetch('/api/a2/day1/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            visionRole: visionData.role,
            visionEnvironment: visionData.environment,
            visionDesiredOutcome: visionData.desiredOutcome,
            milestones: milestonesData,
            actionPlan: actionPlanData,
          }),
        })

        if (!response.ok) throw new Error('Analysis failed')

        const { analysis } = await response.json()
        setResult(analysis)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Analysis failed')
      } finally {
        setAnalyzing(false)
      }
    }

    runAnalysis()
  }, [])

  if (analyzing) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">AI Analysis in Progress</h2>
          <p className="text-white/60">Your Day 1 plan is being analyzed by our AI coach...</p>
        </div>

        <div className="rounded-[28px] border p-8 flex flex-col items-center justify-center min-h-48" style={{ backgroundColor: 'rgba(90, 90, 150, 0.1)', borderColor: 'rgba(90, 90, 150, 0.3)' }}>
          <Loader2 className="w-12 h-12 animate-spin mb-4" style={{ color: 'rgba(90, 90, 150, 0.8)' }} />
          <p className="text-white/70">Analyzing your vision, milestones, and action plan...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">Analysis Error</h2>
          <p className="text-white/60">{error}</p>
        </div>

        <div className="flex gap-3">
          <Button onClick={onRevise} variant="outline" className="flex-1">
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const isPassed = result?.passFail === 'pass'

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Your Day 1 Score</h2>
        <p className="text-white/60">Here&apos;s how your plan scored across all dimensions.</p>
      </div>

      {/* Overall Score */}
      <div className="rounded-[28px] border p-6" style={{ backgroundColor: isPassed ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', borderColor: isPassed ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)' }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-white">Total Score</h3>
          <div className="flex items-center gap-2">
            {isPassed ? (
              <CheckCircle className="w-6 h-6" style={{ color: 'rgba(16, 185, 129, 0.8)' }} />
            ) : (
              <AlertCircle className="w-6 h-6" style={{ color: 'rgba(239, 68, 68, 0.8)' }} />
            )}
            <span className="text-2xl font-bold" style={{ color: isPassed ? 'rgba(16, 185, 129, 0.8)' : 'rgba(239, 68, 68, 0.8)' }}>
              {result?.totalScore}/100
            </span>
          </div>
        </div>

        <p className="text-sm" style={{ color: isPassed ? 'rgba(16, 185, 129, 0.7)' : 'rgba(239, 68, 68, 0.7)' }}>
          {isPassed
            ? '✓ Congratulations! You passed Day 1. Day 2 is now unlocked.'
            : '↻ Keep refining your plan. You can resubmit unlimited times!'}
        </p>
      </div>

      {/* Detailed Scores */}
      <div className="space-y-4">
        {result?.scores && (
          <>
            {[
              { label: 'Vision Clarity', key: 'visionClarity' },
              { label: 'Milestone Quality', key: 'milestoneQuality' },
              { label: 'Action Completeness', key: 'actionCompleteness' },
              { label: 'Realism & Coherence', key: 'realismCoherence' },
            ].map((item) => (
              <div key={item.key} className="space-y-2">
                <div className="flex justify-between items-center">
                  <p className="text-white/80">{item.label}</p>
                  <span className="text-white font-semibold">
                    {result.scores[item.key as keyof typeof result.scores]}/25
                  </span>
                </div>
                <div className="h-2 rounded-full" style={{ backgroundColor: 'rgba(90, 90, 150, 0.2)' }}>
                  <div 
                    className="h-full rounded-full transition-all"
                    style={{ 
                      width: `${(result.scores[item.key as keyof typeof result.scores] / 25) * 100}%`,
                      backgroundColor: 'rgba(90, 90, 150, 0.8)'
                    }} 
                  />
                </div>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Feedback */}
      <div className="rounded-[28px] border p-4 space-y-3" style={{ backgroundColor: 'rgba(90, 90, 150, 0.1)', borderColor: 'rgba(90, 90, 150, 0.3)' }}>
        <h3 className="font-semibold text-white">Detailed Feedback</h3>
        <p className="text-white/70 text-sm">{result?.feedback}</p>
      </div>

      {/* Strengths */}
      {result?.strengths && result.strengths.length > 0 && (
        <div className="rounded-[28px] border p-4 space-y-3" style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
          <h3 className="font-semibold" style={{ color: 'rgba(16, 185, 129, 0.8)' }}>Strengths</h3>
          <ul className="space-y-1">
            {result.strengths.map((strength, idx) => (
              <li key={idx} className="text-sm text-white/70">• {strength}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Areas for Improvement */}
      {result?.improvements && result.improvements.length > 0 && (
        <div className="rounded-[28px] border p-4 space-y-3" style={{ backgroundColor: 'rgba(100, 150, 255, 0.1)', borderColor: 'rgba(100, 150, 255, 0.3)' }}>
          <h3 className="font-semibold" style={{ color: 'rgba(100, 150, 255, 0.8)' }}>Areas for Improvement</h3>
          <ul className="space-y-1">
            {result.improvements.map((improvement, idx) => (
              <li key={idx} className="text-sm text-white/70">• {improvement}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-4 pt-4">
        {!isPassed && (
          <Button
            onClick={onRevise}
            variant="outline"
            className="flex-1 text-white hover:opacity-80 transition py-6 rounded-full font-semibold"
            style={{ borderColor: 'rgba(90, 90, 150, 0.5)', backgroundColor: 'rgba(90, 90, 150, 0.1)' }}
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Revisar y Reenviar
          </Button>
        )}
        <Button
          onClick={onComplete}
          className={`flex-1 py-6 rounded-full ${isPassed ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-teal-600 hover:bg-teal-700'}`}
        >
          {isPassed ? 'Desbloquear Día 2' : 'Cerrar'}
        </Button>
      </div>
    </div>
  )
}
