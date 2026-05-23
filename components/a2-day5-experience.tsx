'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, Loader, AlertCircle } from 'lucide-react'
import { Day5VersionBuilder } from './a2-day5-version-builder'
import { Day5CoachFeedback } from './a2-day5-coach-feedback'
import { Day5TestSelector } from './a2-day5-test-selector'
import {
  createTestIntroduction,
  getTestIntroduction,
  updateTestIntroduction,
  type TestIntroduction,
} from '@/lib/supabase/a2-intro-identity'
import { ensureTravisDataForDay } from '@/lib/travis-seed-supabase'
import { isTravisMode } from '@/lib/travis-form-data'
import { saveDayDocument, formatDocumentContent } from '@/lib/supabase/dtc-documents-phase2'

interface Day5ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}

export function Day5Experience({ onComplete, userId }: Day5ExperienceProps) {
  const [step, setStep] = useState(1)
  const [testIntro, setTestIntro] = useState<Partial<TestIntroduction>>({
    version_a: '',
    version_b: '',
    version_c: '',
    test_type: '',
    test_feedback: '',
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
      initializeDay5(travisMode)
    }
  }, [userId])

  const initializeDay5 = async (travisMode: boolean) => {
    if (!userId) return
    setIsLoading(true)
    
    try {
      // Auto-seed Travis data if in dev mode
      if (travisMode) {
        await ensureTravisDataForDay(userId, 5)
      }
      
      await loadDay5Data()
    } catch (err) {
      console.error('[v0] Error initializing Day 5:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const loadDay5Data = async () => {
    if (!userId) return
    try {
      const { data: intro, error: introError } = await getTestIntroduction(userId, 5)
      if (introError && introError.code !== 'PGRST116') throw introError
      if (intro) {
        setTestIntro(intro)
        setStep(2) // Skip to building if data exists
      }
    } catch (err) {
      console.error('[v0] Error loading Day 5 data:', err)
    }
  }

  const handleVersionsBuilt = async (versions: { versionA: string; versionB: string }) => {
    if (!userId) return

    setIsLoading(true)
    try {
      // Create or update test introduction
      let intro
      if (testIntro.id) {
        const { data: updated, error } = await updateTestIntroduction(testIntro.id, userId, {
          version_a: versions.versionA,
          version_b: versions.versionB,
        })
        if (error) throw error
        intro = updated
      } else {
        const { data: created, error } = await createTestIntroduction(userId, {
          day_number: 5,
          version_a: versions.versionA,
          version_b: versions.versionB,
          status: 'in_progress',
        })
        if (error) throw error
        intro = created
      }

      if (intro) {
        setTestIntro(intro)
        setStep(2)
      }
    } catch (err) {
      console.error('[v0] Error saving versions:', err)
      setError('Error al guardar las versiones.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCoachFeedback = async (improvedVersion: string) => {
    if (!userId || !testIntro.id) return

    setIsLoading(true)
    try {
      const { data: updated, error } = await updateTestIntroduction(testIntro.id, userId, {
        version_c: improvedVersion,
        test_feedback: 'Coach feedback applied',
      })
      if (error) throw error
      if (updated) {
        setTestIntro(updated)
        setStep(3)
      }
    } catch (err) {
      console.error('[v0] Error saving coach feedback:', err)
      setError('Error al guardar el feedback del Coach.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleTestCompleted = async (testType: string, feedback: string) => {
    if (!userId || !testIntro.id) return

    setIsLoading(true)
    try {
      const { data: updated, error } = await updateTestIntroduction(testIntro.id, userId, {
        test_type: testType,
        test_feedback: feedback,
        status: 'completed',
      })
      if (error) throw error
      if (updated) {
        setTestIntro(updated)
        setStep(4)
      }
    } catch (err) {
      console.error('[v0] Error saving test result:', err)
      setError('Error al guardar el resultado del test.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCompleteDay = async () => {
    setIsSubmitting(true)
    try {
      await onComplete({
        dayNumber: 5,
        testIntroduction: testIntro,
        completedAt: new Date().toISOString(),
      })
    } catch (err) {
      console.error('[v0] Error completing Day 5:', err)
      setError('Error al completar el día.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 px-4">
      {/* Dev Mode Badge */}
      {isDevMode && (
        <div className="fixed top-20 right-4 z-50 bg-green-600/90 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg">
          Travis Dev Mode - Intro Pre-cargada
        </div>
      )}

      {error && (
        <div className="rounded-lg p-4 border border-[rgb(80,160,170)]-500/40" style={{ backgroundColor: 'rgba(239, 68, 68, 0.05)' }}>
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-[rgb(80,160,170)]-400 flex-shrink-0 mt-0.5" />
            <p className="text-[rgb(80,160,170)]-300 text-sm">{error}</p>
          </div>
        </div>
      )}

      {isLoading && step === 1 && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader className="w-8 h-8 text-cyan-400 animate-spin" />
          <p className="text-white/70">Cargando tu introducción...</p>
        </div>
      )}

      {step === 1 && !isLoading && (
        <div className="space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-3">Primer Experimento Profesional</h2>
            <p className="text-white/70">Crea y prueba tu introducción en 3 formatos</p>
          </div>

          <div className="rounded-lg p-6 border border-purple-500/40" style={{ backgroundColor: 'rgba(90, 90, 150, 0.1)' }}>
            <h3 className="text-white font-semibold mb-4">Hoy vamos a:</h3>
            <ul className="space-y-3 text-white/80">
              <li className="flex gap-3">
                <span style={{ color: 'rgb(80, 160, 170)' }}>✓</span>
                <span>Crear 3 versiones de tu intro (casual, recruiter, entrevista)</span>
              </li>
              <li className="flex gap-3">
                <span style={{ color: 'rgb(80, 160, 170)' }}>✓</span>
                <span>Coach mejora la mejor versión</span>
              </li>
              <li className="flex gap-3">
                <span style={{ color: 'rgb(80, 160, 170)' }}>✓</span>
                <span>Prueba real: envía o presenta en voz alta</span>
              </li>
              <li className="flex gap-3">
                <span style={{ color: 'rgb(80, 160, 170)' }}>✓</span>
                <span>Captura feedback y refina</span>
              </li>
            </ul>
          </div>

          <Button
            onClick={() => setStep(2)}
            className="w-full py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}
          >
            Crear versiones
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {step === 2 && (
        <Day5VersionBuilder
          onVersionsBuilt={handleVersionsBuilt}
          isLoading={isLoading}
          onNext={() => setStep(3)}
        />
      )}

      {step === 3 && (
        <Day5CoachFeedback
          versionA={testIntro.version_a || ''}
          versionB={testIntro.version_b || ''}
          onFeedbackApplied={handleCoachFeedback}
          isLoading={isLoading}
          onNext={() => setStep(4)}
        />
      )}

      {step === 4 && (
        <Day5TestSelector
          testIntroduction={testIntro}
          onTestCompleted={handleTestCompleted}
          isLoading={isLoading}
          onComplete={handleCompleteDay}
          isSubmitting={isSubmitting}
        />
      )}
    </div>
  )
}
