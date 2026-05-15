'use client'

import { useState } from 'react'
import { A2Day1Step1Vision } from './a2-day1-step1-vision'
import { A2Day1Step3Milestones } from './a2-day1-step3-milestones'
import { A2Day1Step4ActionPlan } from './a2-day1-step4-action-plan'
import { A2Day1Step5ExternalSave } from './a2-day1-step5-external-save'
import { A2Day1Step6Upload } from './a2-day1-step6-upload'
import { A2Day1Step7Analysis } from './a2-day1-step7-analysis'

interface Day1ExperienceProps {
  onComplete: (submission: any) => Promise<void>
  userId?: string
}

export function Day1Experience({ onComplete, userId }: Day1ExperienceProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [visionData, setVisionData] = useState({
    role: '',
    environment: '',
    desiredOutcome: '',
  })
  const [milestonesData, setMilestonesData] = useState({
    day10: '',
    day20: '',
    day30: '',
  })
  const [actionPlanData, setActionPlanData] = useState({
    applications: '',
    networking: '',
    learning: '',
    personal: '',
  })

  // Step 1: Vision -> Step 2: Milestones
  const handleStep1Next = (data: typeof visionData) => {
    setVisionData(data)
    setCurrentStep(2)
  }

  // Step 2: Milestones -> Step 3: Action Plan
  const handleStep2Next = (data: typeof milestonesData) => {
    setMilestonesData(data)
    setCurrentStep(3)
  }

  // Step 3: Action Plan -> Step 4: External Save
  const handleStep3Next = (data: any) => {
    setActionPlanData(data)
    setCurrentStep(4)
  }

  // Step 4: External Save -> Step 5: Upload
  const handleStep4Next = () => {
    setCurrentStep(5)
  }

  // Step 5: Upload -> Step 6: Analysis
  const handleStep5Next = () => {
    setCurrentStep(6)
  }

  const handleStep6Complete = async () => {
    // Prepare submission data
    const submission = {
      dayNumber: 1,
      visionData,
      milestonesData,
      actionPlanData,
      completedAt: new Date().toISOString(),
    }

    try {
      await onComplete(submission)
    } catch (err) {
      console.error('[v0] Error completing Day 1:', err)
    }
  }

  const handleStep6Revise = () => {
    setCurrentStep(1)
  }

  const handleBack = (stepToGoTo: number) => {
    setCurrentStep(stepToGoTo)
  }

  const stepTitles = [
    'Día 1: Define Tu Visión',
    'Define Tus Hitos',
    'Plan de Acción',
    'Guardar Externamente',
    'Sube Tu Trabajo',
    'Análisis y Resultados',
  ]

  return (
    <div className="w-full space-y-6">
      {/* Step Header with Border */}
      <div className="border-b" style={{ backgroundColor: 'rgba(90, 90, 150, 0)', borderColor: 'rgba(90, 90, 150, 0)' }}>
        <div className="max-w-4xl mx-auto px-4 py-6 space-y-3">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">{stepTitles[currentStep - 1]}</h2>
            <p className="text-sm text-white/60">Paso {currentStep} de 6</p>
          </div>

          {/* Progress Bar */}
          <div className="flex gap-1 rounded-full h-2 bg-purple-500/15 overflow-hidden">
            {[1, 2, 3, 4, 5, 6].map((step) => (
              <div
                key={step}
                className="flex-1 h-full transition-all"
                style={{
                  backgroundColor: step <= currentStep ? 'rgba(139, 92, 246, 0.8)' : 'rgba(139, 92, 246, 0.2)',
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {currentStep === 1 && (
          <A2Day1Step1Vision
            onNext={handleStep1Next}
            initialData={visionData}
            userId={userId}
          />
        )}
        {currentStep === 2 && (
          <A2Day1Step3Milestones
            onNext={handleStep2Next}
            onBack={() => handleBack(1)}
            initialData={milestonesData}
          />
        )}
        {currentStep === 3 && (
          <A2Day1Step4ActionPlan
            onNext={handleStep3Next}
            onBack={() => handleBack(2)}
            initialData={actionPlanData}
          />
        )}
        {currentStep === 4 && (
          <A2Day1Step5ExternalSave
            onNext={handleStep4Next}
            onBack={() => handleBack(3)}
          />
        )}
        {currentStep === 5 && (
          <A2Day1Step6Upload
            onNext={handleStep5Next}
            onBack={() => handleBack(4)}
          />
        )}
        {currentStep === 6 && (
          <A2Day1Step7Analysis
            visionData={visionData}
            milestonesData={milestonesData}
            actionPlanData={actionPlanData}
            onComplete={handleStep6Complete}
            onRevise={handleStep6Revise}
          />
        )}
      </div>
    </div>
  )
}
