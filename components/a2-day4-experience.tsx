'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, Check } from 'lucide-react'

interface Day4ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}

export function Day4Experience({ onComplete }: Day4ExperienceProps) {
  const [step, setStep] = useState(1)
  const [candidatBoard, setCandidateBoard] = useState({
    whoAmI: '',
    whatMarketWants: '',
    whatProofIHave: '',
    whatIsMissing: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleBuildBoard = () => {
    setCandidateBoard({
      whoAmI: 'Soy un PM con 5+ años coordinando equipos y lanzando productos',
      whatMarketWants: 'Buscan líderes con experiencia en B2B SaaS y analytics',
      whatProofIHave: '3 productos lanzados con +100K users (en mi Bóveda)',
      whatIsMissing: 'Profundidad en métricas de retention y cohort analysis',
    })
    setStep(2)
  }

  const handleCompleteDay = async () => {
    setIsSubmitting(true)
    try {
      await onComplete({
        dayNumber: 4,
        candidatBoard,
        completedAt: new Date().toISOString(),
      })
    } catch (err) {
      console.error('[v0] Error completing Day 4:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4">
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-3">El Tablero del Candidato</h2>
            <p className="text-white/70">Integra todo lo que aprendiste en 4 columnas</p>
          </div>

          <div className="rounded-lg p-6 border border-purple-500/40" style={{ backgroundColor: 'rgba(90, 90, 150, 0.1)' }}>
            <h3 className="text-white font-semibold mb-4">El Tablero de 4 Columnas</h3>
            <div className="grid grid-cols-2 gap-4">
              {['Quién Soy', 'Qué Quiere Mercado', 'Qué Tengo Probado', 'Qué Falta'].map((col) => (
                <div key={col} className="p-3 rounded bg-purple-900/50 text-white/80 text-sm">
                  {col}
                </div>
              ))}
            </div>
            <p className="text-white/70 text-sm mt-4">
              Vamos a llenar este tablero con información de Days 1-3 + coaching
            </p>
          </div>

          <Button
            onClick={handleBuildBoard}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}
          >
            Construir el Tablero
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Tu Tablero del Candidato</h2>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { title: 'QUIÉN SOY', content: candidatBoard.whoAmI, color: 'purple' },
              { title: 'QUÉ QUIERE MERCADO', content: candidatBoard.whatMarketWants, color: 'cyan' },
              { title: 'QUÉ TENGO PROBADO', content: candidatBoard.whatProofIHave, color: 'emerald' },
              { title: 'QUÉ FALTA', content: candidatBoard.whatIsMissing, color: 'orange' },
            ].map((col) => (
              <div
                key={col.title}
                className="rounded-lg p-4 border border-purple-500/40"
                style={{ backgroundColor: 'rgba(90, 90, 150, 0.05)' }}
              >
                <p className="text-xs font-semibold text-white/60 mb-2">{col.title}</p>
                <p className="text-white text-sm">{col.content}</p>
              </div>
            ))}
          </div>

          <div className="rounded-lg p-6 border-2 border-cyan-400/40" style={{ backgroundColor: 'rgba(80, 160, 170, 0.05)' }}>
            <p className="text-sm font-semibold text-cyan-300 mb-3">🎯 CANDIDATE HYPOTHESIS v1</p>
            <p className="text-white/90">
              Eres un Product Manager con profundo conocimiento del ciclo de vida de productos SaaS B2B. Tu fortaleza está en coordinación y lanzamiento. Tu brecha es profundidad en análisis y métricas avanzadas. Candidato ideal para: Director/Senior PM en startups de Series B+.
            </p>
          </div>

          <Button
            onClick={handleCompleteDay}
            disabled={isSubmitting}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}
          >
            {isSubmitting ? 'Guardando...' : 'Completar Día 4'}
            <Check className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}
