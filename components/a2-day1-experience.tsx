'use client'

import { useState, useEffect } from 'react'
import { A2Day1Intro } from './a2-day1-intro'
import { A2Day1VisionScan } from './a2-day1-vision-scan'
import { A2Day1Hypothesis } from './a2-day1-hypothesis'
import { A2Day1RoutGates } from './a2-day1-route-gates'
import { A2Day1Roadmap } from './a2-day1-roadmap'
import { A2Day1Step5ExternalSave } from './a2-day1-step5-external-save'
import { A2Day1Upload } from './a2-day1-upload'
import { A2Day1Scoring } from './a2-day1-scoring'
import { saveDayDocument, formatDocumentContent } from '@/lib/supabase/dtc-documents-phase2'
import { TRAVIS_DAY1_DATA, isTravisMode } from '@/lib/travis-form-data'

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
  onComplete: (submission: any) => Promise<void>
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

  // Load Travis data in dev mode
  useEffect(() => {
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
    }
  }, [])

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

  const handleStep1Next = () => {
    setCurrentStep(2)
  }

  const handleVisionNext = (data: Partial<RouteData>) => {
    setRouteData((prev) => ({ ...prev, ...data }))
    setCurrentStep(3)
  }

  const handleHypothesisNext = (hypothesis: string) => {
    setRouteData((prev) => ({ ...prev, hypothesis }))
    setCurrentStep(4)
  }

  const handleGatesNext = (gates: RouteData['gates']) => {
    setRouteData((prev) => ({ ...prev, gates }))
    setCurrentStep(5)
  }

  const handleRoadmapNext = (roadmap: string) => {
    setRouteData((prev) => ({ ...prev, roadmap }))
    setCurrentStep(6)
  }

  const handleExternalSaveNext = () => {
    setCurrentStep(7)
  }

  const handleUploadNext = () => {
    setCurrentStep(8)
  }

  const handleScoringComplete = async (scores: RouteData['scores'], totalScore: number, passStatus: 'pass' | 'fail') => {
    const finalSubmission = {
      ...routeData,
      scores,
      totalScore,
      passStatus,
      dayNumber: 1,
      completedAt: new Date().toISOString(),
    }

    try {
      // Save to DTC documents
      if (userId) {
        await saveDayDocument(
          userId,
          1,
          'route_contract',
          formatDocumentContent(finalSubmission),
          'Mi Contrato de Ruta'
        )
      }

      await onComplete(finalSubmission)
    } catch (err) {
      console.error('[v0] Error completing Day 1:', err)
    }
  }

  const handleBack = (stepToGoTo: number) => {
    setCurrentStep(stepToGoTo)
  }

  const handleRevise = () => {
    setCurrentStep(2) // Back to vision scan
  }

  return (
    <div className="w-full space-y-6">
      {/* Dev Mode Badge */}
      {isDevMode && (
        <div className="fixed top-20 right-4 z-50 bg-green-600/90 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg">
          Travis Dev Mode - Datos Pre-cargados
        </div>
      )}

      {/* Step Header */}
      <div
        className="border-b"
        style={{
          backgroundColor: 'rgba(90, 90, 150, 0)',
          borderColor: 'rgba(90, 90, 150, 0)',
        }}
      >
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-3">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">{stepTitles[currentStep - 1]}</h2>
            <p className="text-sm text-white/60">Paso {currentStep} de {stepTitles.length}</p>
          </div>

          {/* Progress Bar */}
          <div className="flex gap-1 rounded-full h-2 bg-purple-500/15 overflow-hidden">
            {stepTitles.map((_, index) => (
              <div
                key={index}
                className="flex-1 h-full transition-all"
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

      {/* Content */}
      <div className="space-y-6">
        {currentStep === 1 && <A2Day1Intro onNext={handleStep1Next} />}

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
            onBack={() => handleBack(2)}
            visionData={routeData}
          />
        )}

        {currentStep === 4 && (
          <A2Day1RoutGates
            onNext={handleGatesNext}
            onBack={() => handleBack(3)}
            initialGates={routeData.gates}
          />
        )}

        {currentStep === 5 && (
          <A2Day1Roadmap
            onNext={handleRoadmapNext}
            onBack={() => handleBack(4)}
            routeData={routeData}
          />
        )}

        {currentStep === 6 && (
          <A2Day1Step5ExternalSave
            onNext={handleExternalSaveNext}
            onBack={() => handleBack(5)}
          />
        )}

        {currentStep === 7 && (
          <A2Day1Upload
            onNext={handleUploadNext}
            onBack={() => handleBack(6)}
            routeData={routeData}
          />
        )}

        {currentStep === 8 && (
          <A2Day1Scoring
            routeData={routeData}
            onComplete={handleScoringComplete}
            onRevise={handleRevise}
          />
        )}
      </div>
    </div>
  )
}
