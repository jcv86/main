'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'

interface Day6ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}

export function Day6Experience({ onComplete }: Day6ExperienceProps) {
  const [step, setStep] = useState(1)
  const [archetype, setArchetype] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const archetypes = ['Organizador', 'Solucionador', 'Operador', 'Conector', 'Constructor', 'Analista', 'Apoyo', 'Buscador', 'Cambiante']

  const handleSelectArchetype = (selected: string) => {
    setArchetype(selected)
    setStep(2)
  }

  const handleCompleteDay = async () => {
    setIsSubmitting(true)
    try {
      await onComplete({
        dayNumber: 6,
        archetype,
        completedAt: new Date().toISOString(),
      })
    } catch (err) {
      console.error('[v0] Error completing Day 6:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4">
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-3">La Forja de Identidad</h2>
            <p className="text-white/70">Define tu rol profesional en el mercado</p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {archetypes.map((type) => (
              <button
                key={type}
                onClick={() => handleSelectArchetype(type)}
                className="p-4 rounded-lg border-2 transition-all text-white font-medium"
                style={{
                  borderColor: 'rgba(90, 90, 150, 0.6)',
                  backgroundColor: 'rgba(90, 90, 150, 0.05)',
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Tu Identidad Profesional: {archetype}</h2>
          </div>

          <div className="space-y-4">
            <div className="rounded-lg p-6 border border-purple-500/40" style={{ backgroundColor: 'rgba(90, 90, 150, 0.05)' }}>
              <p className="text-sm font-semibold text-white/60 mb-3">IDENTIDAD SIMPLE</p>
              <p className="text-white">"Soy un {archetype} especializado en lanzar productos de impacto"</p>
            </div>

            <div className="rounded-lg p-6 border border-purple-500/40" style={{ backgroundColor: 'rgba(90, 90, 150, 0.05)' }}>
              <p className="text-sm font-semibold text-white/60 mb-3">VERSIÓN RECRUITER</p>
              <p className="text-white">"Mi rol es {archetype.toLowerCase()}: identifico problemas, coordino soluciones, y aseguro ejecución limpia"</p>
            </div>

            <div className="rounded-lg p-6 border border-purple-500/40" style={{ backgroundColor: 'rgba(90, 90, 150, 0.05)' }}>
              <p className="text-sm font-semibold text-white/60 mb-3">VERSIÓN ENTREVISTA</p>
              <p className="text-white">"Aporto [3 skills clave]. Cuando me enfrenté a [reto], aplicué [método] y obtuve [resultado medible]"</p>
            </div>
          </div>

          <Button
            onClick={handleCompleteDay}
            disabled={isSubmitting}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}
          >
            {isSubmitting ? 'Guardando...' : 'Completar Día 6'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}
