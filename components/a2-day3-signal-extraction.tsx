'use client'

import { ChevronRight, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ExtractedSignal, MarketSignal } from '@/lib/supabase/a2-market-and-board'

interface Day3SignalExtractionProps {
  extractedSignals: ExtractedSignal[]
  marketSignals: MarketSignal[]
  isLoading: boolean
  onNext: () => void
}

export function Day3SignalExtraction({
  extractedSignals,
  marketSignals,
  isLoading,
  onNext,
}: Day3SignalExtractionProps) {
  const groupedByType = extractedSignals.reduce(
    (acc, signal) => {
      if (!acc[signal.signal_type]) {
        acc[signal.signal_type] = []
      }
      acc[signal.signal_type].push(signal)
      return acc
    },
    {} as Record<string, ExtractedSignal[]>
  )

  const typeLabels: Record<string, { label: string; color: string }> = {
    skill: { label: 'Habilidades Técnicas', color: 'rgb(80, 160, 170)' },
    tool: { label: 'Herramientas & Frameworks', color: 'rgb(136, 115, 200)' },
    soft_skill: { label: 'Soft Skills', color: 'rgb(245, 158, 11)' },
    framework: { label: 'Arquitectura & Frameworks', color: 'rgb(34, 197, 94)' },
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Señales Extraídas del Mercado</h2>
        <p className="text-white/70">Lo que el mercado realmente busca, analizado desde {marketSignals.length} vacantes</p>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedByType).map(([type, signals]) => {
          const typeInfo = typeLabels[type] || { label: type, color: 'rgb(90, 90, 150)' }
          const topSignals = signals.slice(0, 8)

          return (
            <div
              key={type}
              className="rounded-lg p-6 border border-purple-500/40"
              style={{ backgroundColor: 'rgba(90, 90, 150, 0.05)' }}
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5" style={{ color: typeInfo.color }} />
                <h3 className="text-lg font-semibold text-white">{typeInfo.label}</h3>
                <span className="ml-auto text-xs px-2 py-1 rounded-full text-white/70 border border-purple-500/40">
                  {signals.length} encontradas
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {topSignals.map((signal) => (
                  <div
                    key={signal.id}
                    className="px-3 py-2 rounded-lg flex flex-col items-start text-sm font-medium transition hover:shadow-lg"
                    style={{
                      backgroundColor: `${typeInfo.color}20`,
                      color: typeInfo.color,
                      border: `1px solid ${typeInfo.color}40`,
                    }}
                  >
                    <span>{signal.signal_text}</span>
                    <span className="text-xs opacity-70 mt-1">
                      {signal.frequency}x en {signal.related_jobs_count} vacantes
                    </span>
                  </div>
                ))}
              </div>

              {signals.length > 8 && (
                <p className="text-white/60 text-xs mt-3">+{signals.length - 8} señales más</p>
              )}
            </div>
          )
        })}
      </div>

      <div
        className="rounded-lg p-4 border border-cyan-400/40"
        style={{ backgroundColor: 'rgba(80, 160, 170, 0.05)' }}
      >
        <p className="text-cyan-300 text-sm font-semibold mb-2">💡 Resumen de Análisis</p>
        <p className="text-white/80 text-sm">
          Hemos identificado {extractedSignals.length} señales únicas en las {marketSignals.length} vacantes analizadas. Los requisitos
          más frecuentes son {extractedSignals
            .sort((a, b) => b.frequency - a.frequency)
            .slice(0, 3)
            .map((s) => s.signal_text)
            .join(', ')}.
        </p>
      </div>

      <Button
        onClick={onNext}
        className="w-full py-6 text-white font-semibold rounded-full"
        style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}
      >
        Ver Análisis del Coach
        <ChevronRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  )
}
