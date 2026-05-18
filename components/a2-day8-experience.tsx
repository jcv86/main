'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'

interface Day8ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}

export function Day8Experience({ onComplete }: Day8ExperienceProps) {
  const [step, setStep] = useState(1)
  const [memories, setMemories] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleMineMemories = () => {
    setMemories([
      'Lancé producto X en 2021, coordiné 8 personas, resultó en $500K MRR',
      'Salvé cliente importante implementando feature que pidieron en 48h',
      'Rediseñé onboarding, aumentó retención de 40% a 68% en 3 meses',
      'Presenté roadmap ante Junta Directiva, conseguimos inversión',
      'Resolví conflicto de equipos diferentes coordinando solución win-win',
    ])
    setStep(2)
  }

  const handleCompleteDay = async () => {
    setIsSubmitting(true)
    try {
      await onComplete({
        dayNumber: 8,
        memories,
        completedAt: new Date().toISOString(),
      })
    } catch (err) {
      console.error('[v0] Error completing Day 8:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4">
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-3">Excavación de Memoria Profesional</h2>
            <p className="text-white/70">Extrae tus mejores historias de trabajo reales</p>
          </div>

          <div className="rounded-lg p-6 border border-purple-500/40" style={{ backgroundColor: 'rgba(90, 90, 150, 0.1)' }}>
            <h3 className="text-white font-semibold mb-4">Hoy buscamos:</h3>
            <ul className="space-y-3 text-white/80">
              <li className="flex gap-3">
                <span style={{ color: 'rgb(80, 160, 170)' }}>✓</span>
                <span>10 memorias laborales crudas (formato: What / Where / Why I remember)</span>
              </li>
              <li className="flex gap-3">
                <span style={{ color: 'rgb(80, 160, 170)' }}>✓</span>
                <span>Coach tags cada una (impacto, skills, tipo)</span>
              </li>
              <li className="flex gap-3">
                <span style={{ color: 'rgb(80, 160, 170)' }}>✓</span>
                <span>Seleccionar best 5 para día 9</span>
              </li>
            </ul>
          </div>

          <Button
            onClick={handleMineMemories}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}
          >
            Excavar Memorias
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Tus 5 Memorias Seleccionadas</h2>
          </div>

          <div className="space-y-3">
            {memories.map((mem, idx) => (
              <div key={idx} className="rounded-lg p-4 border border-purple-500/40" style={{ backgroundColor: 'rgba(90, 90, 150, 0.05)' }}>
                <p className="text-white/80 text-sm">{mem}</p>
              </div>
            ))}
          </div>

          <Button
            onClick={handleCompleteDay}
            disabled={isSubmitting}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}
          >
            {isSubmitting ? 'Guardando...' : 'Completar Día 8'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}
