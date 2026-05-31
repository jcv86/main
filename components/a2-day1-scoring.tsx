'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { CheckCircle, AlertCircle } from 'lucide-react'

interface Scores {
  clarity: number
  logic: number
  realism: number
  actionability: number
}

interface A2Day1ScoringProps {
  routeData: any
  onComplete: (scores: Scores, totalScore: number, passStatus: 'pass' | 'fail') => Promise<void>
  onRevise: () => void
}

export function A2Day1Scoring({
  routeData,
  onComplete,
  onRevise,
}: A2Day1ScoringProps) {
  const [scores, setScores] = useState<Scores>({
    clarity: 0,
    logic: 0,
    realism: 0,
    actionability: 0,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0)
  const passStatus = totalScore >= 75 ? 'pass' : 'fail'

  useEffect(() => {
    // Simulate scoring analysis
    const scoreRoute = async () => {
      setIsLoading(true)

      // Rule-based scoring (in production, this would be from an API)
      let clarityScore = 0
      let logicScore = 0
      let realismScore = 0
      let actionabilityScore = 0

      // Clarity (0-25 pts)
      if (routeData.change30Days?.length > 150) clarityScore += 8
      if (routeData.change30Days?.includes('específico')) clarityScore += 5
      if (routeData.targetRole?.length > 100) clarityScore += 7
      if (routeData.targetRole?.toLowerCase().includes('remoto') ||
          routeData.targetRole?.toLowerCase().includes('híbrido')) {
        clarityScore += 5
      }
      clarityScore = Math.min(25, clarityScore + 8) // Base score + extra

      // Logic (0-25 pts)
      if (routeData.gates?.identity?.length > 50) logicScore += 8
      if (routeData.gates?.evidence?.length > 70) logicScore += 8
      if (routeData.gates?.material?.length > 60) logicScore += 8
      if (routeData.gates?.identity && routeData.gates?.evidence && routeData.gates?.material) {
        logicScore += 3
      }
      logicScore = Math.min(25, logicScore)

      // Realism (0-25 pts)
      const hasTimeframe = routeData.change30Days?.toLowerCase().includes('30') ||
                           routeData.change30Days?.toLowerCase().includes('próximos')
      if (hasTimeframe) realismScore += 8
      if (routeData.targetRole?.toLowerCase().includes('startup') ||
          routeData.targetRole?.toLowerCase().includes('empresa')) {
        realismScore += 7
      }
      if (!routeData.mainBlocker?.toLowerCase().includes('imposible')) {
        realismScore += 10
      }
      realismScore = Math.min(25, realismScore)

      // Actionability (0-25 pts)
      if (routeData.gates?.identity?.toLowerCase().includes('debo') ||
          routeData.gates?.identity?.toLowerCase().includes('necesito')) {
        actionabilityScore += 8
      }
      if (routeData.gates?.evidence?.toLowerCase().includes('historias') ||
          routeData.gates?.evidence?.toLowerCase().includes('cv')) {
        actionabilityScore += 8
      }
      if (routeData.gates?.material?.toLowerCase().includes('linkedin') ||
          routeData.gates?.material?.toLowerCase().includes('portfolio')) {
        actionabilityScore += 8
      }
      actionabilityScore = Math.min(25, actionabilityScore)

      // Simulate delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setScores({
        clarity: Math.max(10, clarityScore),
        logic: Math.max(10, logicScore),
        realism: Math.max(10, realismScore),
        actionability: Math.max(10, actionabilityScore),
      })

      setIsLoading(false)
    }

    scoreRoute()
  }, [routeData])

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      await onComplete(scores, totalScore, passStatus)
    } catch (error) {
      console.error('[v0] Error submitting scores:', error)
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-3xl mx-auto px-4 space-y-6">
        <div
          className="rounded-lg p-8 space-y-4"
          style={{ backgroundColor: 'rgba(90, 90, 150, 0.1)' }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-5 h-5 animate-spin rounded-full border-2 border-[rgba(80,160,170,0.2)] border-t-[rgba(80,160,170,0.8)]"></div>
            <p className="text-white font-semibold">Analizando tu ruta...</p>
          </div>

          <div className="space-y-2">
            <div className="h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r"
                style={{
                  background: 'linear-gradient(90deg, rgba(90,90,150,0.4), rgba(90,90,150,0.8))',
                  animation: 'pulse 2s infinite',
                  width: '60%',
                }}
              ></div>
            </div>
            <p className="text-xs text-white/50">Evaluando 4 dimensiones...</p>
          </div>
        </div>
      </div>
    )
  }

  const dimensions = [
    {
      name: 'Claridad de Visión',
      description: '¿Tu objetivo está claramente articulado?',
      score: scores.clarity,
      color: 'rgb(90, 90, 150)',
    },
    {
      name: 'Lógica de Hitos',
      description: '¿Las 3 puertas progresivas y coherentes?',
      score: scores.logic,
      color: 'rgb(100, 120, 160)',
    },
    {
      name: 'Realismo',
      description: '¿Alcanzable en 30 días?',
      score: scores.realism,
      color: 'rgb(110, 130, 170)',
    },
    {
      name: 'Accionabilidad',
      description: '¿Puedo convertir en acciones?',
      score: scores.actionability,
      color: 'rgb(80, 160, 170)',
    },
  ]

  return (
    <div className="max-w-3xl mx-auto px-4 space-y-6">
      {/* Total Score */}
      <div
        className="rounded-lg p-8 text-center space-y-4"
        style={{
          backgroundColor: passStatus === 'pass'
            ? 'rgba(80, 160, 170, 0.1)'
            : 'rgba(239, 68, 68, 0.1)',
          borderColor: passStatus === 'pass'
            ? 'rgba(80, 160, 170, 0.2)'
            : 'rgba(239, 68, 68, 0.2)',
          border: '1px solid',
        }}
      >
        <div className="flex items-center justify-center gap-2 mb-2">
          {passStatus === 'pass' ? (
            <>
              <CheckCircle className="w-6 h-6" style={{ color: 'rgb(80, 160, 170)' }} />
              <h2 className="text-2xl font-bold text-white">¡DÍA 1 APROBADO!</h2>
            </>
          ) : (
            <>
              <AlertCircle className="w-6 h-6" style={{ color: 'rgb(239, 68, 68)' }} />
              <h2 className="text-2xl font-bold text-white">Tu Ruta Todavía Necesita Trabajo</h2>
            </>
          )}
        </div>

        <div className="space-y-1">
          <p className="text-4xl font-bold text-white">{totalScore}</p>
          <p className="text-sm text-white/70">/ 100 puntos</p>
          {passStatus === 'pass' && (
            <p className="text-sm text-white/70 mt-3">
              Tu ruta es clara, lógica y alcanzable. ¡Desbloqueas Día 2!
            </p>
          )}
          {passStatus === 'fail' && (
            <p className="text-sm text-white/70 mt-3">
              Necesitas {75 - totalScore} puntos más. Revisa los comentarios abajo.
            </p>
          )}
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="space-y-4">
        <p className="font-semibold text-white">Desglose por Dimensión:</p>

        {dimensions.map((dim) => (
          <div key={dim.name} className="space-y-2">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-semibold text-white text-sm">{dim.name}</p>
                <p className="text-xs text-white/50">{dim.description}</p>
              </div>
              <p className="text-lg font-bold" style={{ color: dim.color }}>
                {dim.score}/25
              </p>
            </div>

            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full transition-all"
                style={{ width: `${(dim.score / 25) * 100}%`, backgroundColor: dim.color }}
              ></div>
            </div>
          </div>
        ))}
      </div>

      {/* Coach Feedback */}
      {passStatus === 'pass' && (
        <div
          className="rounded-lg p-4 space-y-3"
          style={{
            backgroundColor: 'rgba(80, 160, 170, 0.1)',
            borderColor: 'rgba(80, 160, 170, 0.2)',
            border: '1px solid',
          }}
        >
          <p className="font-semibold text-white">Retroalimentación del Coach:</p>
          <ul className="text-sm text-white/70 space-y-2 ml-4">
            <li>✓ Tu visión está clara y es específica.</li>
            <li>✓ Las 3 puertas crean una progresión lógica.</li>
            <li>✓ Tu objetivo es realista para 30 días.</li>
            <li>✓ Cada puerta es accionable y verificable.</li>
          </ul>
        </div>
      )}

      {passStatus === 'fail' && (
        <div
          className="rounded-lg p-4 space-y-3"
          style={{
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            borderColor: 'rgba(239, 68, 68, 0.2)',
            border: '1px solid',
          }}
        >
          <p className="font-semibold text-white">Áreas a Mejorar:</p>
          {totalScore < 20 && (
            <p className="text-sm text-white/70">Tu ruta es demasiado abstracta. Sé más específico.</p>
          )}
          {scores.clarity < 15 && (
            <p className="text-sm text-white/70">Agrega más detalles a tu visión de cambio.</p>
          )}
          {scores.logic < 15 && (
            <p className="text-sm text-white/70">Las 3 puertas no son lo suficientemente progresivas.</p>
          )}
          {scores.realism < 15 && (
            <p className="text-sm text-white/70">Tu objetivo podría ser más realista para 30 días.</p>
          )}
        </div>
      )}

      {/* CTA */}
      <div className="pt-4 border-t space-y-3" style={{ borderColor: 'rgba(80, 160, 170, 0.2)' }}>
        {passStatus === 'pass' && (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full"
            size="lg"
            style={{ backgroundColor: 'rgb(90, 90, 150)', color: 'white' }}
          >
            {isSubmitting ? 'Guardando...' : 'Desbloquear Día 2 →'}
          </Button>
        )}

        {passStatus === 'fail' && (
          <div className="space-y-2">
            <Button
              onClick={onRevise}
              className="w-full"
              size="lg"
              style={{ backgroundColor: 'rgb(90, 90, 150)', color: 'white' }}
            >
              Revisar con Coach
            </Button>
            <Button
              onClick={() => window.location.reload()}
              variant="outline"
              style={{ borderColor: 'rgba(80, 160, 170, 0.2)', color: 'white' }}
            >
              Cargar Documento Editado
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
