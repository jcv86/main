'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'

interface Day9ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}

export function Day9Experience({ onComplete }: Day9ExperienceProps) {
  const [step, setStep] = useState(1)
  const [tasks, setTasks] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCreateTasks = () => {
    setTasks([
      'Coordiné el lanzamiento del producto X con 8 personas, resultando en $500K MRR',
      'Implementé feature urgente para cliente importante en 48 horas',
      'Rediseñé onboarding de usuarios, mejorando retención de 40% a 68%',
      'Presenté estrategia de roadmap ante Junta Directiva',
      'Resolví conflicto interdepartamental mediante solución colaborativa',
    ])
    setStep(2)
  }

  const handleCompleteDay = async () => {
    setIsSubmitting(true)
    try {
      await onComplete({
        dayNumber: 9,
        tasks,
        completedAt: new Date().toISOString(),
      })
    } catch (err) {
      console.error('[v0] Error completing Day 9:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4">
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-3">Del Caos a las Tareas</h2>
            <p className="text-white/70">Traduce memorias crudas a statements de tarea claros</p>
          </div>

          <div className="rounded-lg p-6 border border-purple-500/40" style={{ backgroundColor: 'rgba(90, 90, 150, 0.1)' }}>
            <p className="text-white/80">Vamos a convertir: "Lancé producto en 2021" → "Coordiné lanzamiento de producto X con 8 personas, resultando en $500K MRR"</p>
          </div>

          <Button
            onClick={handleCreateTasks}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}
          >
            Crear Task Statements
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Tus 5 Task Statements</h2>
          </div>

          <div className="space-y-3">
            {tasks.map((task, idx) => (
              <div key={idx} className="rounded-lg p-4 border border-cyan-400/40" style={{ backgroundColor: 'rgba(80, 160, 170, 0.05)' }}>
                <p className="text-white text-sm">{task}</p>
              </div>
            ))}
          </div>

          <Button
            onClick={handleCompleteDay}
            disabled={isSubmitting}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}
          >
            {isSubmitting ? 'Guardando...' : 'Completar Día 9'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}
