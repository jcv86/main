'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, Loader } from 'lucide-react'
import { CareerMirror } from '@/lib/supabase/a2-days7-8'

interface Day7CoachFeedbackProps {
  mirrorCard: CareerMirror
  onFeedbackApplied: (feedback: string, tags: string[]) => Promise<void>
  isLoading: boolean
  onNext: () => void
}

export function Day7CoachFeedback({ mirrorCard, onFeedbackApplied, isLoading, onNext }: Day7CoachFeedbackProps) {
  const [providing, setProviding] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const coachSuggestion = `Tu tarjeta espejo es clara y con propósito. Las fortalezas en lanzamiento y coordinación son diferenciadores fuertes. 

Sugerencias de mejora:
- Añade un número específico (lanzaste 3+ productos)
- Enfatiza el impacto en ingresos ($500K MRR)
- Menciona la gestión de conflictos como soft skill

Tags: #Organizador #Ejecutor #Diferenciador`

  const handleApplyFeedback = async () => {
    setProviding(true)
    try {
      const tags = ['#Organizador', '#Ejecutor', '#Diferenciador']
      await onFeedbackApplied(coachSuggestion, tags)
      onNext()
    } finally {
      setProviding(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Paso 3: Coach Feedback</h2>
        <p className="text-white/70">Validación y mejora de tu tarjeta</p>
      </div>

      <div className="rounded-lg p-6 border border-purple-500/40" style={{ backgroundColor: 'rgba(90, 90, 150, 0.05)' }}>
        <p className="text-sm font-semibold text-purple-300 mb-4">ANÁLISIS DEL COACH</p>
        <div className="text-white/80 text-sm space-y-3 whitespace-pre-wrap">
          {coachSuggestion}
        </div>
      </div>

      <div className="rounded-lg p-6 border border-cyan-400/40" style={{ backgroundColor: 'rgba(80, 160, 170, 0.05)' }}>
        <p className="text-sm font-semibold text-cyan-300 mb-3">TAGS SUGERIDOS</p>
        <div className="flex flex-wrap gap-2">
          {['#Organizador', '#Ejecutor', '#Diferenciador', '#B2B SaaS'].map((tag) => (
            <div
              key={tag}
              className="px-3 py-1 rounded-full text-xs font-semibold"
              style={{ 
                backgroundColor: selectedTags.includes(tag) ? 'rgba(80, 160, 170, 0.6)' : 'rgba(90, 90, 150, 0.3)',
                color: 'rgb(150, 200, 200)',
                border: `1px solid ${selectedTags.includes(tag) ? 'rgba(80, 160, 170, 1)' : 'rgba(90, 90, 150, 0.6)'}`
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>

      <Button
        onClick={handleApplyFeedback}
        disabled={providing || isLoading}
        className="w-full py-6 text-white font-semibold rounded-full"
        style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}
      >
        {providing || isLoading ? (
          <>
            <Loader className="w-4 h-4 mr-2 animate-spin" />
            Aplicando feedback...
          </>
        ) : (
          <>
            Feedback Aplicado - Siguiente
            <ChevronRight className="w-4 h-4 ml-2" />
          </>
        )}
      </Button>
    </div>
  )
}
