'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'

interface Day10ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}

export function Day10Experience({ onComplete }: Day10ExperienceProps) {
  const [step, setStep] = useState(1)
  const [valueSeeds, setValueSeeds] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAutopsyImpact = () => {
    setValueSeeds([
      'Impacto: Generé $500K de revenue recurrente. Valor: Demuestra capacidad de ejecución de alto impacto',
      'Impacto: Salvé relación crítica con cliente. Valor: Responsabilidad y urgencia bajo presión',
      'Impacto: 68% retención = miles de horas economizadas. Valor: Data-driven product sense',
      'Impacto: Facilité $10M en inversión. Valor: Strategic communication y credibilidad ante ejecutivos',
      'Impacto: Alineé dos equipos en conflicto. Valor: Leadership colaborativo sin autoridad formal',
    ])
    setStep(2)
  }

  const handleCompleteDay = async () => {
    setIsSubmitting(true)
    try {
      await onComplete({
        dayNumber: 10,
        valueSeeds,
        completedAt: new Date().toISOString(),
      })
    } catch (err) {
      console.error('[v0] Error completing Day 10:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4">
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-3">Por Qué Importaba</h2>
            <p className="text-white/70">Transforma tareas en valor para el empleador</p>
          </div>

          <div className="rounded-lg p-6 border border-purple-500/40" style={{ backgroundColor: 'rgba(90, 90, 150, 0.1)' }}>
            <h3 className="text-white font-semibold mb-3">La Lección Final</h3>
            <p className="text-white/80 text-sm">
              Una tarea = lo que hiciste. Impacto = por qué importó. Valor = el puente entre tu trabajo y la necesidad del empleador.
            </p>
          </div>

          <Button
            onClick={handleAutopsyImpact}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}
          >
            Hacer Autopsia de Impacto
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Tus 5 Value Seeds</h2>
            <p className="text-white/70">Cada uno es un puente tareas → valor que comunicas</p>
          </div>

          <div className="space-y-3">
            {valueSeeds.map((seed, idx) => (
              <div key={idx} className="rounded-lg p-4 border border-emerald-400/40" style={{ backgroundColor: 'rgba(80, 160, 170, 0.05)' }}>
                <p className="text-white/90 text-sm">{seed}</p>
              </div>
            ))}
          </div>

          <div className="rounded-lg p-6 border-2 border-cyan-400/40" style={{ backgroundColor: 'rgba(80, 160, 170, 0.05)' }}>
            <p className="text-sm font-semibold text-cyan-300 mb-3">🎯 FIN DE ARC 1: INVESTIGACIÓN DE FUNDAMENTOS</p>
            <p className="text-white/90">
              Completaste 10 días de transformación. De visión vaga a candidato claro, validado, con evidencia concreta. Los próximos 80 días (Arcs 2-6) construyen sobre esta base sólida.
            </p>
          </div>

          <Button
            onClick={handleCompleteDay}
            disabled={isSubmitting}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}
          >
            {isSubmitting ? 'Guardando...' : 'Completar Día 10 - Desbloqueará Día 11'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}
