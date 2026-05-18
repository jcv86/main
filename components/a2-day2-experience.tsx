'use client'

import { useState } from 'react'
import { A2Day2Intro } from './a2-day2-intro'
import { A2Day2VaultSetup } from './a2-day2-vault-setup'
import { A2Day2EvidenceHunt } from './a2-day2-evidence-hunt'
import { A2Day2Upload } from './a2-day2-upload'
import { A2Day2Classification } from './a2-day2-classification'
import { A2Day2GoldPieces } from './a2-day2-gold-pieces'
import { A2Day2Completion } from './a2-day2-completion'

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
    setCurrentStep(2)
  }

  const handleVaultSetupNext = (vaultType: string, vaultLink: string) => {
    setVaultData((prev) => ({ ...prev, vaultType: vaultType as any, vaultLink }))
    setCurrentStep(3)
  }

  const handleEvidenceHuntNext = () => {
    setCurrentStep(4)
  }

  const handleUploadNext = (fragments: any[]) => {
    setVaultData((prev) => ({ ...prev, fragments }))
    setCurrentStep(5)
  }

  const handleClassificationNext = (classifiedFragments: any[]) => {
    setVaultData((prev) => ({ ...prev, fragments: classifiedFragments }))
    setCurrentStep(6)
  }

  const handleGoldPiecesNext = (goldPieces: any[]) => {
    setVaultData((prev) => ({ ...prev, goldPieces }))
    setCurrentStep(7)
  }

  const handleCompletionSubmit = async () => {
    const submission = {
      dayNumber: 2,
      vaultData,
      completedAt: new Date().toISOString(),
    }

    try {
      await onComplete(submission)
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
