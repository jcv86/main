'use client'

import { useEffect, useState } from 'react'
import { AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface Scores {
  clarity: number
  logic: number
  realism: number
  actionability: number
}

interface ServerAnalysis {
  totalScore: number
  passed: boolean
  scores: Scores
  breakdown: string[]
  recommendations: string[]
}

interface A2Day1ScoringProps {
  routeData: object
  onComplete: (
    scores: Scores,
    totalScore: number,
    passStatus: 'pass' | 'fail',
  ) => Promise<void>
  onRevise: () => void
}

const EMPTY_SCORES: Scores = {
  clarity: 0,
  logic: 0,
  realism: 0,
  actionability: 0,
}

export function A2Day1Scoring({
  routeData,
  onComplete,
  onRevise,
}: A2Day1ScoringProps) {
  const [analysis, setAnalysis] = useState<ServerAnalysis | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    const analyzeRoute = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch('/api/a2/day1/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(routeData),
          signal: controller.signal,
        })
        const result = await response.json()

        if (!response.ok || !result.analysis) {
          throw new Error(result.error || 'No pudimos analizar tu ruta.')
        }

        setAnalysis({
          totalScore: Number(result.analysis.totalScore) || 0,
          passed: Boolean(result.analysis.passed),
          scores: result.analysis.scores || EMPTY_SCORES,
          breakdown: Array.isArray(result.analysis.breakdown)
            ? result.analysis.breakdown
            : [],
          recommendations: Array.isArray(result.analysis.recommendations)
            ? result.analysis.recommendations
            : [],
        })
      } catch (analysisError) {
        if (
          analysisError instanceof DOMException &&
          analysisError.name === 'AbortError'
        ) {
          return
        }
        console.error('[v0] Error analyzing Day 1:', analysisError)
        setError(
          analysisError instanceof Error
            ? analysisError.message
            : 'No pudimos analizar tu ruta.',
        )
      } finally {
        if (!controller.signal.aborted) setIsLoading(false)
      }
    }

    analyzeRoute()
    return () => controller.abort()
  }, [routeData])

  const scores = analysis?.scores || EMPTY_SCORES
  const totalScore = analysis?.totalScore || 0
  const passStatus: 'pass' | 'fail' = analysis?.passed ? 'pass' : 'fail'

  const handleSubmit = async () => {
    if (!analysis?.passed || isSubmitting) return

    setIsSubmitting(true)
    setError(null)
    try {
      await onComplete(scores, totalScore, passStatus)
    } catch (submitError) {
      console.error('[v0] Error submitting Day 1:', submitError)
      setError(
        submitError instanceof Error
          ? submitError.message
          : 'No pudimos desbloquear el Día 2.',
      )
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-3xl space-y-6 px-4">
        <div className="space-y-4 rounded-lg bg-[rgba(90,90,150,0.1)] p-8">
          <div className="flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-cyan-300" />
            <p className="font-semibold text-white">Revisando los campos de tu acuerdo…</p>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-3/5 animate-pulse bg-gradient-to-r from-purple-500/40 to-cyan-400/80" />
          </div>
          <p className="text-xs text-white/50">
            Comprobando que registraste objetivo, momentos de revisión y una acción inicial.
          </p>
        </div>
      </div>
    )
  }

  if (error && !analysis) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4">
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-5">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 text-amber-300" />
            <div>
              <p className="font-semibold text-white">No pudimos revisar tu acuerdo</p>
              <p className="mt-1 text-sm text-white/70">{error}</p>
            </div>
          </div>
        </div>
        <Button onClick={() => window.location.reload()} className="w-full">
          Reintentar revisión
        </Button>
      </div>
    )
  }

  const dimensions = [
    {
      name: 'Objetivo y contexto',
      description: 'Campos de objetivo, resultado esperado y contexto.',
      score: scores.clarity,
    },
    {
      name: 'Momentos de revisión',
      description: 'Qué revisarás en los días 10, 20 y 30.',
      score: scores.logic,
    },
    {
      name: 'Primera acción',
      description: 'Una acción registrada para comenzar.',
      score: scores.realism,
    },
    {
      name: 'Acuerdo registrado',
      description: 'Presencia de los campos requeridos.',
      score: scores.actionability,
    },
  ]

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4">
      <div
        className={`space-y-4 rounded-lg border p-8 text-center ${
          passStatus === 'pass'
            ? 'border-cyan-400/30 bg-cyan-400/10'
            : 'border-amber-400/30 bg-amber-400/10'
        }`}
      >
        <div className="flex items-center justify-center gap-2">
          {passStatus === 'pass' ? (
            <CheckCircle className="h-6 w-6 text-cyan-300" />
          ) : (
            <AlertCircle className="h-6 w-6 text-amber-300" />
          )}
          <h2 className="text-2xl font-bold text-white">
            {passStatus === 'pass'
              ? 'Acuerdo inicial registrado'
              : 'Tu ruta necesita una revisión'}
          </h2>
        </div>
        <p className="text-sm text-white/70">
          {passStatus === 'pass' ? 'Puedes guardar tu acuerdo y comenzar el Día 2.' : 'Completa los campos pendientes para continuar.'}
          {' '}Este control no califica la calidad, la viabilidad ni tu capacidad para ejecutar el plan.
        </p>
      </div>

      <div className="space-y-4">
        <p className="font-semibold text-white">Campos del acuerdo</p>
        {dimensions.map((dimension) => (
          <div key={dimension.name} className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">{dimension.name}</p>
                <p className="text-xs text-white/50">{dimension.description}</p>
              </div>
              <p className="text-lg font-bold text-cyan-300">
                {dimension.score === 25 ? 'Registrado' : 'Pendiente'}
              </p>
            </div>

          </div>
        ))}
      </div>

      {analysis?.recommendations.length ? (
        <div className="rounded-lg border border-amber-500/25 bg-amber-500/5 p-4">
          <p className="font-semibold text-white">Campos pendientes</p>
          <ul className="mt-2 space-y-1 text-sm text-white/70">
            {analysis.recommendations.map((recommendation) => (
              <li key={recommendation}>• {recommendation}</li>
            ))}
          </ul>
        </div>
      ) : (
        <div className="rounded-lg border border-cyan-500/25 bg-cyan-500/5 p-4">
          <p className="font-semibold text-white">Revisión de campos completada</p>
          <p className="mt-1 text-sm text-white/70">
            Tu acuerdo inicial queda disponible para contrastarlo con lo que ocurra durante la práctica.
          </p>
        </div>
      )}

      {error && (
        <p className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-200">
          {error}
        </p>
      )}

      <div className="space-y-3 border-t border-cyan-500/20 pt-4">
        {passStatus === 'pass' ? (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? 'Guardando…' : 'Desbloquear Día 2'}
          </Button>
        ) : (
          <Button onClick={onRevise} className="w-full" size="lg">
            Revisar mi contrato de ruta
          </Button>
        )}
      </div>
    </div>
  )
}
