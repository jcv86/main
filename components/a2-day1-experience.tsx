'use client'

import { useEffect, useState } from 'react'
import { A2Day1Intro } from './a2-day1-intro'
import { A2Day1VisionScan } from './a2-day1-vision-scan'
import { A2Day1Hypothesis } from './a2-day1-hypothesis'
import { A2Day1RoutGates } from './a2-day1-route-gates'
import { A2Day1Roadmap } from './a2-day1-roadmap'
import { A2Day1Step5ExternalSave } from './a2-day1-step5-external-save'
import { A2Day1Upload } from './a2-day1-upload'
import { A2Day1Scoring } from './a2-day1-scoring'
import {
  formatDocumentContent,
  saveDayDocument,
} from '@/lib/supabase/dtc-documents-phase2'
import { TRAVIS_DAY1_DATA, isTravisMode } from '@/lib/travis-form-data'
import {
  autosaveDayProgress,
  clearAllDrafts,
  loadDayProgressWithFallback,
} from '@/lib/a2-progress-persistence'

interface RouteData {
  change30Days: string
  targetRole: string
  mainBlocker: string
  hypothesis?: string
  gates?: {
    identity: string
    evidence: string
    material: string
  }
  roadmap?: string
  scores?: {
    clarity: number
    logic: number
    realism: number
    actionability: number
  }
  totalScore?: number
  passStatus?: 'pending' | 'pass' | 'fail'
}

interface Day1ExperienceProps {
  onComplete: (submission: Record<string, unknown>) => Promise<void>
  userId?: string
}

export function Day1Experience({ onComplete, userId }: Day1ExperienceProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [isDevMode, setIsDevMode] = useState(false)
  const [routeData, setRouteData] = useState<RouteData>({
    change30Days: '',
    targetRole: '',
    mainBlocker: '',
  })

  useEffect(() => {
    const loadData = async () => {
      const travisMode = isTravisMode()
      setIsDevMode(travisMode)

      if (travisMode) {
        setRouteData({
          change30Days: TRAVIS_DAY1_DATA.change30Days,
          targetRole: TRAVIS_DAY1_DATA.targetRole,
          mainBlocker: TRAVIS_DAY1_DATA.mainBlocker,
          hypothesis: TRAVIS_DAY1_DATA.hypothesis,
          gates: TRAVIS_DAY1_DATA.gates,
          roadmap: TRAVIS_DAY1_DATA.roadmap,
        })
        return
      }

      if (!userId) return
      const draft = await loadDayProgressWithFallback(userId, 1)
      if (!draft) return

      setRouteData((previous) => ({ ...previous, ...draft.formData }))
      setCurrentStep(draft.stepNumber)
    }

    loadData()
  }, [userId])

  const stepTitles = [
    'El Contrato de Tu Ruta',
    'Escaneo de Visión',
    'Hipótesis de Ruta',
    'Las 3 Puertas',
    'Tu Roadmap',
    'Guardar Externamente',
    'Sube Tu Documento',
    'Análisis y Puntuación',
  ]

  const saveDraft = (step: number, data: RouteData) => {
    if (userId) autosaveDayProgress(userId, 1, step, data)
  }

  const handleVisionNext = (data: Partial<RouteData>) => {
    const next = { ...routeData, ...data }
    setRouteData(next)
    saveDraft(3, next)
    setCurrentStep(3)
  }

  const handleHypothesisNext = (hypothesis: string) => {
    const next = { ...routeData, hypothesis }
    setRouteData(next)
    saveDraft(4, next)
    setCurrentStep(4)
  }

  const handleGatesNext = (gates: RouteData['gates']) => {
    const next = { ...routeData, gates }
    setRouteData(next)
    saveDraft(5, next)
    setCurrentStep(5)
  }

  const handleRoadmapNext = (roadmap: string) => {
    const next = { ...routeData, roadmap }
    setRouteData(next)
    saveDraft(6, next)
    setCurrentStep(6)
  }

  const handleExternalSaveNext = async () => {
    if (userId) {
      try {
        await saveDayDocument(
          userId,
          1,
          'route_contract',
          formatDocumentContent({
            'Mi Cambio en 30 Días': routeData.change30Days,
            'Mi Rol Objetivo': routeData.targetRole,
            'Mi Bloqueador Principal': routeData.mainBlocker,
            'Mi Hipótesis de Ruta': routeData.hypothesis || '',
            'PUERTA 1 - IDENTIDAD': routeData.gates?.identity || '',
            'PUERTA 2 - EVIDENCIA': routeData.gates?.evidence || '',
            'PUERTA 3 - MATERIAL': routeData.gates?.material || '',
            'Mi Roadmap Profesional': routeData.roadmap || '',
          }),
          'Mi Contrato de Ruta',
        )
      } catch (saveError) {
        console.error('[v0] Error saving Day 1 document:', saveError)
      }
    }

    saveDraft(7, routeData)
    setCurrentStep(7)
  }

  const handleUploadNext = () => {
    saveDraft(8, routeData)
    setCurrentStep(8)
  }

  const handleScoringComplete = async (
    scores: RouteData['scores'],
    totalScore: number,
    passStatus: 'pass' | 'fail',
  ) => {
    const finalSubmission = {
      ...routeData,
      scores,
      totalScore,
      passStatus,
      dayNumber: 1,
      completedAt: new Date().toISOString(),
    }

    try {
      if (userId) {
        await saveDayDocument(
          userId,
          1,
          'route_contract',
          formatDocumentContent(finalSubmission),
          'Mi Contrato de Ruta',
        )
      }

      await onComplete(finalSubmission)
      if (userId) clearAllDrafts(1)
    } catch (completionError) {
      console.error('[v0] Error completing Day 1:', completionError)
      throw completionError
    }
  }

  return (
    <div className="w-full space-y-6">
      {isDevMode && (
        <div className="fixed right-4 top-20 z-50 rounded-full bg-green-600/90 px-3 py-1.5 text-xs font-medium text-white shadow-lg">
          Travis Dev Mode · Datos precargados
        </div>
      )}

      <div
        className="border-b"
        style={{
          backgroundColor: 'rgba(90, 90, 150, 0)',
          borderColor: 'rgba(80, 160, 170, 0.2)',
        }}
      >
        <div className="mx-auto max-w-4xl space-y-3 px-4 py-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">
              {stepTitles[currentStep - 1]}
            </h2>
            <p className="text-sm text-white/60">
              Paso {currentStep} de {stepTitles.length}
            </p>
          </div>
          <div className="flex h-2 gap-1 overflow-hidden rounded-full bg-purple-500/15">
            {stepTitles.map((title, index) => (
              <div
                key={title}
                className="h-full flex-1 transition-all"
                style={{
                  backgroundColor:
                    index + 1 <= currentStep
                      ? 'rgba(90, 90, 150, 0.8)'
                      : 'rgba(90, 90, 150, 0.2)',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {currentStep === 1 && (
          <A2Day1Intro onNext={() => setCurrentStep(2)} />
        )}
        {currentStep === 2 && (
          <A2Day1VisionScan
            onNext={handleVisionNext}
            initialData={routeData}
            userId={userId}
          />
        )}
        {currentStep === 3 && (
          <A2Day1Hypothesis
            onNext={handleHypothesisNext}
            onBack={() => setCurrentStep(2)}
            visionData={routeData}
          />
        )}
        {currentStep === 4 && (
          <A2Day1RoutGates
            onNext={handleGatesNext}
            onBack={() => setCurrentStep(3)}
            initialGates={routeData.gates}
          />
        )}
        {currentStep === 5 && (
          <A2Day1Roadmap
            onNext={handleRoadmapNext}
            onBack={() => setCurrentStep(4)}
            routeData={routeData}
          />
        )}
        {currentStep === 6 && (
          <A2Day1Step5ExternalSave
            onNext={handleExternalSaveNext}
            onBack={() => setCurrentStep(5)}
          />
        )}
        {currentStep === 7 && (
          <A2Day1Upload
            onNext={handleUploadNext}
            onBack={() => setCurrentStep(6)}
            routeData={routeData}
          />
        )}
        {currentStep === 8 && (
          <A2Day1Scoring
            routeData={routeData}
            onComplete={handleScoringComplete}
            onRevise={() => setCurrentStep(2)}
          />
        )}
      </div>
    </div>
  )
}
