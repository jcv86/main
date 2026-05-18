'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, Loader } from 'lucide-react'
import { CareerMirror } from '@/lib/supabase/a2-days7-8'

interface Day7CardReviewProps {
  mirror: CareerMirror
  onCardValidated: (score: number) => Promise<void>
  isLoading: boolean
  onNext: () => void
}

export function Day7CardReview({ mirror, onCardValidated, isLoading, onNext }: Day7CardReviewProps) {
  const [validating, setValidating] = useState(false)
  const [score, setScore] = useState(85)

  const handleValidate = async () => {
    setValidating(true)
    try {
      await onCardValidated(score)
      onNext()
    } finally {
      setValidating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Paso 4: Validación de Tarjeta</h2>
        <p className="text-white/70">Revisión final y scoring</p>
      </div>

      <div className="space-y-4">
        <div className="rounded-lg p-6 border-2 border-cyan-400/40" style={{ backgroundColor: 'rgba(80, 160, 170, 0.08)' }}>
          <p className="text-sm font-semibold text-cyan-300 mb-4">TARJETA FINAL</p>
          <div className="space-y-3 text-white/80">
            <p><span className="font-semibold">Título:</span> {mirror.mirror_card_title}</p>
            {mirror.mirror_card_content && (
              <>
                <p><span className="font-semibold">Fortalezas:</span> {mirror.mirror_card_content.strengths?.join(', ') || 'N/A'}</p>
                <p><span className="font-semibold">Brecha:</span> {mirror.mirror_card_content.gap || 'N/A'}</p>
                <p><span className="font-semibold">Market Fit:</span> {mirror.mirror_card_content.marketFit || 'Alto'}</p>
              </>
            )}
            {mirror.coach_tags && mirror.coach_tags.length > 0 && (
              <p><span className="font-semibold">Tags:</span> {mirror.coach_tags.join(' ')}</p>
            )}
          </div>
        </div>

        <div className="rounded-lg p-6 border border-purple-500/40" style={{ backgroundColor: 'rgba(90, 90, 150, 0.05)' }}>
          <p className="text-white font-semibold mb-3">Validación de Confianza</p>
          <div className="space-y-3">
            <p className="text-white/70 text-sm">¿Qué tan confiado estás de que esta tarjeta representa tu mejor profesional?</p>
            <input
              type="range"
              min="0"
              max="100"
              value={score}
              onChange={(e) => setScore(parseInt(e.target.value))}
              className="w-full"
              style={{
                accentColor: 'rgb(80, 160, 170)',
              }}
            />
            <p className="text-cyan-400 font-bold text-lg">{score}% de confianza</p>
          </div>
        </div>
      </div>

      <Button
        onClick={handleValidate}
        disabled={validating || isLoading}
        className="w-full py-6 text-white font-semibold rounded-full"
        style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}
      >
        {validating || isLoading ? (
          <>
            <Loader className="w-4 h-4 mr-2 animate-spin" />
            Validando...
          </>
        ) : (
          <>
            Tarjeta Validada - Exportar
            <ChevronRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  )
}
