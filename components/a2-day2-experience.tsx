'use client'

import { useState, useEffect } from 'react'
import { A2Day2Intro } from './a2-day2-intro'
import { A2Day2VaultSetup } from './a2-day2-vault-setup'
import { A2Day2EvidenceHunt } from './a2-day2-evidence-hunt'
import { A2Day2Upload } from './a2-day2-upload'
import { A2Day2Classification } from './a2-day2-classification'
import { A2Day2GoldPieces } from './a2-day2-gold-pieces'
import { A2Day2Completion } from './a2-day2-completion'
import { saveDayDocument, formatDocumentContent } from '@/lib/supabase/dtc-documents-phase2'
import { isTravisMode } from '@/lib/travis-form-data'
import { TRAVIS_DAY2_UPLOAD_FRAGMENTS } from '@/lib/travis-form-data'
import { 
  autosaveDayProgress, 
  loadDayProgressWithFallback, 
  clearAllDrafts 
} from '@/lib/a2-progress-persistence'

// Travis pre-filled data for Day 2
const TRAVIS_DAY2_DATA = {
  vaultType: 'notion' as const,
  vaultLink: 'https://notion.so/travis-evidence-vault-dtc-2026',
  fragments: [
    { id: '1', text: 'Reduje churn 23% mediante redesign de onboarding', category: 'achievement', goldPiece: true },
    { id: '2', text: 'Presenté roadmap Q3 al CEO con 8 features priorizadas', category: 'achievement', goldPiece: true },
    { id: '3', text: 'Conduje 15 entrevistas que cambiaron priorización Q4', category: 'research', goldPiece: false },
    { id: '4', text: 'Diseñé estrategia API que generó $40K MRR partners', category: 'achievement', goldPiece: true },
    { id: '5', text: 'Análisis de pricing que añadió $30K MRR', category: 'achievement', goldPiece: false },
    { id: '6', text: 'GTM de Analytics Dashboard con 35% adoption', category: 'launch', goldPiece: false },
    { id: '7', text: 'Sistema de roadmap transparente, NPS +12', category: 'process', goldPiece: false },
    { id: '8', text: 'Programa retention que bajó churn M4-6 de 8% a 2%', category: 'achievement', goldPiece: false },
  ],
  goldPieces: [
    { id: '1', text: 'Reduje churn 23% mediante redesign de onboarding - +$50K revenue' },
    { id: '2', text: 'Roadmap Q3 priorizado por user research - +$80K revenue' },
    { id: '4', text: 'Estrategia API partners - $40K MRR incremental' },
  ],
}

interface EvidenceVaultData {
  vaultType?: 'notion' | 'drive' | 'local' | 'dtc' | 'cloud'
  vaultLink?: string
  fragments?: any[]
  goldPieces?: any[]
}

interface Day2ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}

export function Day2Experience({ onComplete, userId }: Day2ExperienceProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [vaultData, setVaultData] = useState<EvidenceVaultData>({})
  const [isDevMode, setIsDevMode] = useState(false)

  // Load Travis data or saved draft on mount
  useEffect(() => {
    const loadData = async () => {
      const travisMode = isTravisMode()
      setIsDevMode(travisMode)
      
      if (travisMode) {
        setVaultData({
          vaultType: TRAVIS_DAY2_DATA.vaultType,
          vaultLink: TRAVIS_DAY2_DATA.vaultLink,
          fragments: TRAVIS_DAY2_DATA.fragments,
          goldPieces: TRAVIS_DAY2_DATA.goldPieces,
        })
      } else if (userId) {
        // Try to load saved draft
        const draft = await loadDayProgressWithFallback(userId, 2)
        if (draft) {
          console.log(`[v0] Resuming Day 2 from step ${draft.stepNumber}`)
          setVaultData(draft.formData)
          setCurrentStep(draft.stepNumber)
        }
      }
    }

    loadData()
  }, [userId])

  const stepTitles = [
    'La Bóveda de Evidencia',
    'Crear Tu Bóveda',
    'Cazar Evidencia',
    'Subir Fragmentos',
    'Clasificar Evidencia',
    'Las 3 Piezas de Oro',
    'Resumen y Aprobación',
  ]

  const handleStep1Next = () => {
    if (userId) autosaveDayProgress(userId, 2, 2, vaultData)
    setCurrentStep(2)
  }

  const handleVaultSetupNext = (vaultType: string, vaultLink: string) => {
    const newData = { ...vaultData, vaultType: vaultType as any, vaultLink }
    setVaultData(newData)
    if (userId) autosaveDayProgress(userId, 2, 3, newData)
    setCurrentStep(3)
  }

  const handleEvidenceHuntNext = () => {
    if (userId) autosaveDayProgress(userId, 2, 4, vaultData)
    setCurrentStep(4)
  }

  const handleUploadNext = (fragments: any[]) => {
    const newData = { ...vaultData, fragments }
    setVaultData(newData)
    if (userId) autosaveDayProgress(userId, 2, 5, newData)
    setCurrentStep(5)
  }

  const handleClassificationNext = (classifiedFragments: any[]) => {
    const newData = { ...vaultData, fragments: classifiedFragments }
    setVaultData(newData)
    if (userId) autosaveDayProgress(userId, 2, 6, newData)
    setCurrentStep(6)
  }

  const handleGoldPiecesNext = (goldPieces: any[]) => {
    const newData = { ...vaultData, goldPieces }
    setVaultData(newData)
    if (userId) autosaveDayProgress(userId, 2, 7, newData)
    setCurrentStep(7)
  }

  const handleCompletionSubmit = async () => {
    const submission = {
      dayNumber: 2,
      vaultData,
      completedAt: new Date().toISOString(),
    }

    try {
      // Save to DTC documents
      if (userId) {
        await saveDayDocument(
          userId,
          2,
          'evidence_vault',
          formatDocumentContent(submission),
          'Mi Bóveda de Evidencia'
        )
      }

      await onComplete(submission)
      
      // Clear draft after successful completion
      if (userId) {
        clearAllDrafts(2)
      }
    } catch (err) {
      console.error('[v0] Error completing Day 2:', err)
    }
  }

  const handleBack = (stepToGoTo: number) => {
    setCurrentStep(stepToGoTo)
  }

  const handleRevise = () => {
    setCurrentStep(3) // Back to evidence hunt
  }

  return (
    <div className="w-full space-y-6">
      {/* Dev Mode Badge */}
      {isDevMode && (
        <div className="fixed top-20 right-4 z-50 bg-green-600/90 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg">
          Travis Dev Mode - Day 2 Pre-cargado
        </div>
      )}

      {/* Step Header */}
      <div
        className="border-b"
        style={{
          backgroundColor: 'rgba(90, 90, 150, 0)',
          borderColor: 'rgba(80, 160, 170, 0.2)',
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
        {currentStep === 1 && <A2Day2Intro onNext={handleStep1Next} />}

        {currentStep === 2 && (
          <A2Day2VaultSetup
            onNext={handleVaultSetupNext}
            onBack={() => handleBack(1)}
          />
        )}

        {currentStep === 3 && (
          <A2Day2EvidenceHunt
            onNext={handleEvidenceHuntNext}
            onBack={() => handleBack(2)}
          />
        )}

        {currentStep === 4 && (
          <A2Day2Upload
            onNext={handleUploadNext}
            onBack={() => handleBack(3)}
          />
        )}

        {currentStep === 5 && (
          <A2Day2Classification
            fragments={vaultData.fragments || []}
            onNext={handleClassificationNext}
            onBack={() => handleBack(4)}
          />
        )}

        {currentStep === 6 && (
          <A2Day2GoldPieces
            fragments={vaultData.fragments || []}
            onNext={handleGoldPiecesNext}
            onBack={() => handleBack(5)}
          />
        )}

        {currentStep === 7 && (
          <A2Day2Completion
            vaultData={vaultData}
            onComplete={handleCompletionSubmit}
            onRevise={handleRevise}
          />
        )}
      </div>
    </div>
  )
}
