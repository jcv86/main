'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, Loader, AlertCircle } from 'lucide-react'
import { Day6ArchetypeSelector } from './a2-day6-archetype-selector'
import { Day6IdentityForge } from './a2-day6-identity-forge'
import { Day6StressTest } from './a2-day6-stress-test'
import { Day6Export } from './a2-day6-export'
import {
  createProfessionalIdentity,
  getProfessionalIdentity,
  updateProfessionalIdentity,
  type ProfessionalIdentity,
} from '@/lib/supabase/a2-intro-identity'
import { ensureTravisDataForDay } from '@/lib/travis-seed-supabase'
import { isTravisMode } from '@/lib/travis-form-data'
import { saveDayDocument, formatDocumentContent } from '@/lib/supabase/dtc-documents-phase2'

interface Day6ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}

export function Day6Experience({ onComplete, userId }: Day6ExperienceProps) {
  const [step, setStep] = useState(1)
  const [identity, setIdentity] = useState<Partial<ProfessionalIdentity>>({
    candidate_archetype: '',
    archetype_description: '',
    version_simple: '',
    version_recruiter: '',
    version_interview: '',
    is_validated: false,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDevMode, setIsDevMode] = useState(false)

  // Load existing data on mount (with Travis auto-seed)
  useEffect(() => {
    const travisMode = isTravisMode()
    setIsDevMode(travisMode)
    
    if (userId) {
      initializeDay6(travisMode)
    }
  }, [userId])

  const initializeDay6 = async (travisMode: boolean) => {
    if (!userId) return
    setIsLoading(true)
    
    try {
      if (travisMode) {
        await ensureTravisDataForDay(userId, 6)
      }
      await loadDay6Data()
    } catch (err) {
      console.error('[v0] Error initializing Day 6:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const loadDay6Data = async () => {
    if (!userId) return
    try {
      const { data: prof, error: profError } = await getProfessionalIdentity(userId, 6)
      if (profError && profError.code !== 'PGRST116') throw profError
      if (prof) {
        setIdentity(prof)
        setStep(4)
      }
    } catch (err) {
      console.error('[v0] Error loading Day 6 data:', err)
    }
  }

  const handleArchetypeSelected = async (archetype: string, description: string) => {
    if (!userId) return

    setIsLoading(true)
    try {
      const { data: created, error } = await createProfessionalIdentity(userId, {
        day_number: 6,
        candidate_archetype: archetype,
        archetype_description: description,
        version_simple: '',
        version_recruiter: '',
        version_interview: '',
        is_validated: false,
        status: 'in_progress',
      })
      if (error) throw error
      if (created) {
        setIdentity(created)
        setStep(2)
      }
    } catch (err) {
      console.error('[v0] Error saving archetype:', err)
      setError('Error al guardar el arquetipo.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleIdentitiesForged = async (versions: {
    simple: string
    recruiter: string
    interview: string
  }) => {
    if (!userId || !identity.id) return

    setIsLoading(true)
    try {
      const { data: updated, error } = await updateProfessionalIdentity(identity.id, userId, {
        version_simple: versions.simple,
        version_recruiter: versions.recruiter,
        version_interview: versions.interview,
      })
      if (error) throw error
      if (updated) {
        setIdentity(updated)
        setStep(3)
      }
    } catch (err) {
      console.error('[v0] Error saving forged identities:', err)
      setError('Error al guardar las identidades.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleStressTestComplete = async (stressResult: string, isValidated: boolean) => {
    if (!userId || !identity.id) return

    setIsLoading(true)
    try {
      const { data: updated, error } = await updateProfessionalIdentity(identity.id, userId, {
        stress_test_result: stressResult,
        is_validated: isValidated,
        status: 'completed',
      })
      if (error) throw error
      if (updated) {
        setIdentity(updated)
        setStep(4)
      }
    } catch (err) {
      console.error('[v0] Error saving stress test:', err)
      setError('Error al guardar stress test.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompleteDay = async () => {
    setIsSubmitting(true)
    try {
      await onComplete({
        dayNumber: 6,
        professionalIdentity: identity,
        completedAt: new Date().toISOString(),
      })
    } catch (err) {
      console.error('[v0] Error completing Day 6:', err)
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
          <p className="text-white/70">Cargando tu identidad...</p>
        </div>
      )}

      {step === 1 && !isLoading && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-3">La Forja de Identidad Profesional</h2>
            <p className="text-white/70">Define tu rol arquetípico en el mercado y crea 3 versiones de ti</p>
          </div>

          <div className="rounded-lg p-6 border border-purple-500/40" style={{ backgroundColor: 'rgba(90, 90, 150, 0.1)' }}>
            <h3 className="text-white font-semibold mb-4">Qué vamos a hacer:</h3>
            <ul className="space-y-3 text-white/80">
              <li className="flex gap-3">
                <span style={{ color: 'rgb(80, 160, 170)' }}>✓</span>
                <span>Elegir tu arquetipo profesional (9 opciones)</span>
              </li>
              <li className="flex gap-3">
                <span style={{ color: 'rgb(80, 160, 170)' }}>✓</span>
                <span>Forjar 3 versiones de tu identidad (simple, recruiter, entrevista)</span>
              </li>
              <li className="flex gap-3">
                <span style={{ color: 'rgb(80, 160, 170)' }}>✓</span>
                <span>Test de stress: preguntas difíciles en voz alta</span>
              </li>
              <li className="flex gap-3">
                <span style={{ color: 'rgb(80, 160, 170)' }}>✓</span>
                <span>Exportar tu identidad forjada</span>
              </li>
            </ul>
          </div>

          <Button
            onClick={() => setStep(2)}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}
          >
            Comenzar Forja
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <Day6ArchetypeSelector
          onArchetypeSelected={handleArchetypeSelected}
          isLoading={isLoading}
        />
      )}

      {step === 3 && identity.candidate_archetype && (
        <Day6IdentityForge
          archetype={identity.candidate_archetype}
          archetypeDescription={identity.archetype_description || ''}
          onIdentitiesForged={handleIdentitiesForged}
          isLoading={isLoading}
          onNext={() => setStep(4)}
        />
      )}

      {step === 4 && identity.candidate_archetype && (
        <Day6StressTest
          identity={identity as ProfessionalIdentity}
          onStressTestComplete={handleStressTestComplete}
          isLoading={isLoading}
          onNext={() => setStep(5)}
        />
      )}

      {step === 5 && identity.candidate_archetype && (
        <Day6Export
          identity={identity as ProfessionalIdentity}
          onComplete={handleCompleteDay}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  )
}
