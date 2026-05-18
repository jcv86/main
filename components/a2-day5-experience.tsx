'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'

interface Day5ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}

export function Day5Experience({ onComplete }: Day5ExperienceProps) {
  const [step, setStep] = useState(1)
  const [introduction, setIntroduction] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleTestIntroduction = () => {
    setIntroduction('Soy PM especializado en lanzar productos B2B SaaS que generan impacto. Coordine equipos de 10+ personas y lancé 3 productos que alcanzaron 100K usuarios.')
    setStep(2)
  }

  const handleCompleteDay = async () => {
    setIsSubmitting(true)
    try {
      await onComplete({
        dayNumber: 5,
        introduction,
        completedAt: new Date().toISOString(),
      })
    } catch (err) {
      console.error('[v0] Error completing Day 5:', err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4">
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-3">El Primer Experimento Profesional</h2>
            <p className="text-white/70">Crea tu introducción profesional y pruébala</p>
          </div>

          <div className="rounded-lg p-6 border border-purple-500/40" style={{ backgroundColor: 'rgba(90, 90, 150, 0.1)' }}>
            <h3 className="text-white font-semibold mb-4">Hoy vamos a:</h3>
            <ul className="space-y-3 text-white/80">
              <li className="flex gap-3">
                <span style={{ color: 'rgb(80, 160, 170)' }}>✓</span>
                <span>Crear 3 versiones de tu intro (human, recruiter, interview)</span>
              </li>
              <li className="flex gap-3">
                <span style={{ color: 'rgb(80, 160, 170)' }}>✓</span>
                <span>Coach mejora la mejor versión</span>
              </li>
              <li className="flex gap-3">
                <span style={{ color: 'rgb(80, 160, 170)' }}>✓</span>
                <span>Prueba real: envía a alguien o haz test en voz alta</span>
              </li>
              <li className="flex gap-3">
                <span style={{ color: 'rgb(80, 160, 170)' }}>✓</span>
                <span>Recibe feedback y genera Version C (final)</span>
              </li>
            </ul>
          </div>

          <Button
            onClick={handleTestIntroduction}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}
          >
            Crear introducción probada
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Tu Introducción Profesional v1</h2>
          </div>

          <div className="rounded-lg p-6 border-2 border-cyan-400/40" style={{ backgroundColor: 'rgba(80, 160, 170, 0.05)' }}>
            <p className="text-sm font-semibold text-cyan-300 mb-3">VERSIÓN PROBADA</p>
            <p className="text-white text-lg italic">"{introduction}"</p>
          </div>

          <div className="space-y-3">
            <p className="text-white/80 text-sm">¿Cómo te fue? Comparte feedback</p>
            <textarea
              placeholder="¿Qué preguntas hizo? ¿Qué resonó? ¿Qué cambiarías?"
              className="w-full p-4 rounded-lg text-white placeholder:text-white/40 focus:outline-none resize-none"
              style={{ backgroundColor: 'rgba(90, 90, 150, 0.1)', border: '1px solid rgba(90, 90, 150, 0.6)' }}
              rows={3}
            />
          </div>

          <Button
            onClick={handleCompleteDay}
            disabled={isSubmitting}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}
          >
            {isSubmitting ? 'Guardando...' : 'Completar Día 5'}
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  )
}
