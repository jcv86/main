'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, Loader, AlertCircle } from 'lucide-react'
import { Day7A2DataReview } from './a2-day7-a2-data-review'
import { Day7MirrorCardBuilder } from './a2-day7-mirror-card-builder'
import { Day7CoachFeedback } from './a2-day7-coach-feedback'
import { Day7CardReview } from './a2-day7-card-review'
import { Day7CardExport } from './a2-day7-card-export'
import {
  createCareerMirror,
  getCareerMirror,
  updateCareerMirror,
  type CareerMirror,
} from '@/lib/supabase/a2-days7-8'

interface Day7ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}

export function Day7Experience({ onComplete, userId }: Day7ExperienceProps) {
  const [step, setStep] = useState(1)
  const [mirror, setMirror] = useState<Partial<CareerMirror>>({
    a2_data_snapshot: {},
    mirror_card_title: '',
    mirror_card_content: {},
    coach_feedback: '',
    coach_tags: [],
    is_validated: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Load existing data on mount
  useEffect(() => {
    if (userId) {
      loadDay7Data()
    }
  }, [userId])

  const loadDay7Data = async () => {
    if (!userId) return
    setIsLoading(true)
    try {
      const { data: mirror, error: mirrorError } = await getCareerMirror(userId, 7)
      if (mirrorError && mirrorError.code !== 'PGRST116') throw mirrorError
      if (mirror) {
        setMirror(mirror)
        setStep(2)
      }
    } catch (err) {
      console.error('[v0] Error loading Day 7 data:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleA2DataReviewed = async (a2Data: any) => {
    if (!userId) return

    setIsLoading(true)
    try {
      const { data: created, error } = await createCareerMirror(userId, {
        day_number: 7,
        a2_data_snapshot: a2Data,
        is_validated: false,
        status: 'in_progress',
      })
      if (error) throw error
      if (created) {
        setMirror(created)
        setStep(2)
      }
    } catch (err) {
      console.error('[v0] Error saving A2 data:', err)
      setError('Error al guardar los datos de A2.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMirrorCardBuilt = async (cardData: {
    title: string
    content: Record<string, any>
  }) => {
    if (!userId || !mirror.id) return

    setIsLoading(true)
    try {
      const { data: updated, error } = await updateCareerMirror(mirror.id, userId, {
        mirror_card_title: cardData.title,
        mirror_card_content: cardData.content,
      })
      if (error) throw error
      if (updated) {
        setMirror(updated)
        setStep(3)
      }
    } catch (err) {
      console.error('[v0] Error saving mirror card:', err)
      setError('Error al guardar la tarjeta espejo.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCoachFeedback = async (feedback: string, tags: string[]) => {
    if (!userId || !mirror.id) return

    setIsLoading(true)
    try {
      const { data: updated, error } = await updateCareerMirror(mirror.id, userId, {
        coach_feedback: feedback,
        coach_tags: tags,
      })
      if (error) throw error
      if (updated) {
        setMirror(updated)
        setStep(4)
      }
    } catch (err) {
      console.error('[v0] Error saving coach feedback:', err)
      setError('Error al guardar el feedback del coach.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCardValidated = async (validationScore: number) => {
    if (!userId || !mirror.id) return

    setIsLoading(true)
    try {
      const { data: updated, error } = await updateCareerMirror(mirror.id, userId, {
        is_validated: true,
        validation_score: validationScore,
      })
      if (error) throw error
      if (updated) {
        setMirror(updated)
        setStep(5)
      }
    } catch (err) {
      console.error('[v0] Error validating card:', err)
      setError('Error al validar la tarjeta.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompleteDay = async () => {
    setIsSubmitting(true)
    try {
      await onComplete({
        dayNumber: 7,
        careerMirror: mirror,
        completedAt: new Date().toISOString(),
      })
    } catch (err) {
      console.error('[v0] Error completing Day 7:', err)
      setError('Error al completar el día.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4">
      {error && (
        <div className="rounded-lg p-4 border border-red-500/40" style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-red-300 text-sm">{error}</p>
          </div>
        </div>
      )}

      {isLoading && step === 1 && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-white/70">Cargando tu espejo...</p>
        </div>
      )}

      {step === 1 && !isLoading && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-3">Checkpoint A3: El Espejo de Carrera</h2>
            <p className="text-white/70">Integra todo tu A2 en una tarjeta espejo profesional</p>
          </div>

          <div className="rounded-lg p-6 border border-purple-500/40" style={{ backgroundColor: 'rgba(90, 90, 150, 0.1)' }}>
            <h3 className="text-white font-semibold mb-4">Hoy vamos a:</h3>
            <ul className="space-y-3 text-white/80">
              <li className="flex gap-3">
                <span style={{ color: 'rgb(80, 160, 170)' }}>✓</span>
                <span>Revisar tu perfil de A2 completo (Días 1-6)</span>
              </li>
              <li className="flex gap-3">
                <span style={{ color: 'rgb(80, 160, 170)' }}>✓</span>
                <span>Crear una tarjeta espejo (tu marca profesional)</span>
              </li>
              <li className="flex gap-3">
                <span style={{ color: 'rgb(80, 160, 170)' }}>✓</span>
                <span>Coach valida y mejora tu tarjeta</span>
              </li>
              <li className="flex gap-3">
                <span style={{ color: 'rgb(80, 160, 170)' }}>✓</span>
                <span>Exportar tarjeta espejo final</span>
              </li>
            </ul>
          </div>

          <Button
            onClick={() => setStep(2)}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}
          >
            Comenzar Checkpoint A3
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <Day7A2DataReview
          onDataReviewed={handleA2DataReviewed}
          isLoading={isLoading}
          onNext={() => setStep(3)}
        />
      )}

      {step === 3 && mirror.id && (
        <Day7MirrorCardBuilder
          a2Data={mirror.a2_data_snapshot || {}}
          onCardBuilt={handleMirrorCardBuilt}
          isLoading={isLoading}
          onNext={() => setStep(4)}
        />
      )}

      {step === 4 && mirror.id && (
        <Day7CoachFeedback
          mirrorCard={mirror as CareerMirror}
          onFeedbackApplied={handleCoachFeedback}
          isLoading={isLoading}
          onNext={() => setStep(5)}
        />
      )}

      {step === 5 && mirror.id && (
        <Day7CardReview
          mirror={mirror as CareerMirror}
          onCardValidated={handleCardValidated}
          isLoading={isLoading}
          onNext={() => setStep(6)}
        />
      )}

      {step === 6 && mirror.id && (
        <Day7CardExport
          mirror={mirror as CareerMirror}
          onComplete={handleCompleteDay}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  )
}
