'use client'

import { ChevronRight, Loader } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ExtractedSignal, MarketSignal } from '@/lib/supabase/a2-market-and-board'

interface Day3CoachAnalysisProps {
  marketSignals: MarketSignal[]
  extractedSignals: ExtractedSignal[]
  onComplete: () => Promise<void>
  isSubmitting: boolean
}

export function Day3CoachAnalysis({
  marketSignals,
  extractedSignals,
  onComplete,
  isSubmitting,
}: Day3CoachAnalysisProps) {
  const rankedSignals = [...extractedSignals]
    .sort((first, second) => second.frequency - first.frequency)
    .slice(0, 8)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Resumen de señales del mercado</h2>
        <p className="text-white/70">
          Una lectura descriptiva de las {marketSignals.length} vacantes que registraste. No determina qué camino debes seguir.
        </p>
      </div>

      <div
        className="rounded-lg p-6 border border-cyan-400/40 space-y-5"
        style={{ backgroundColor: 'rgba(80, 160, 170, 0.05)' }}
      >
        <div>
          <p className="text-sm font-semibold text-cyan-300 mb-3">Señales más repetidas en tu muestra</p>
          <div className="flex flex-wrap gap-2">
            {rankedSignals.map((signal) => (
              <span
                key={signal.id}
                className="px-3 py-2 rounded text-xs text-white"
                style={{ backgroundColor: 'rgba(80, 160, 170, 0.2)' }}
              >
                {signal.signal_text} · {signal.frequency} aparición{signal.frequency === 1 ? '' : 'es'}
              </span>
            ))}
          </div>
        </div>

        <div className="border-t border-cyan-300/20 pt-4 text-sm text-white/75 space-y-2">
          <p>
            Estas señales describen solamente las vacantes ingresadas. No prueban que una habilidad sea una fortaleza o brecha personal.
          </p>
          <p>
            En el Día 4 podrás compararlas con tu propia evidencia y formular una hipótesis revisable de candidatura.
          </p>
        </div>
      </div>

      <Button
        onClick={onComplete}
        disabled={isSubmitting || rankedSignals.length < 3}
        className="w-full py-6 text-white font-semibold rounded-full"
        style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}
      >
        {isSubmitting ? (
          <><Loader className="w-4 h-4 mr-2 animate-spin" />Validando Día 3...</>
        ) : (
          <>Validar y completar Día 3<ChevronRight className="w-4 h-4 ml-2" /></>
        )}
      </Button>
    </div>
  )
}
