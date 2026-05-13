'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { X } from 'lucide-react'
import { A2Day1Step1Vision } from './a2-day1-step1-vision'
import { A2Day1Step2Coach } from './a2-day1-step2-coach'
import { A2Day1Step3Milestones } from './a2-day1-step3-milestones'
import { A2Day1Step4ActionPlan } from './a2-day1-step4-action-plan'
import { A2Day1Step5ExternalSave } from './a2-day1-step5-external-save'
import { A2Day1Step6Upload } from './a2-day1-step6-upload'
import { A2Day1Step7Analysis } from './a2-day1-step7-analysis'

interface A2Day1ModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete?: () => void
}

export function A2Day1Modal({ isOpen, onClose, onComplete }: A2Day1ModalProps) {
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
    applications: [],
    networking: [],
    learning: [],
    personal: [],
  })

  const handleStep1Next = (data: typeof visionData) => {
    setVisionData(data)
    setCurrentStep(2)
  }

  const handleStep2Next = (data: typeof visionData) => {
    setVisionData(data)
    setCurrentStep(3)
  }

  const handleStep3Next = (data: typeof milestonesData) => {
    setMilestonesData(data)
    setCurrentStep(4)
  }

  const handleStep4Next = (data: any) => {
    setActionPlanData(data)
    setCurrentStep(5)
  }

  const handleStep5Next = () => {
    setCurrentStep(6)
  }

  const handleStep6Next = () => {
    setCurrentStep(7)
  }

  const handleStep7Complete = () => {
    onComplete?.()
    onClose()
  }

  const handleStep7Revise = () => {
    setCurrentStep(1)
  }

  const handleBack = (stepToGoTo: number) => {
    setCurrentStep(stepToGoTo)
  }

  const stepTitles = [
    'Day 1: Define Your Vision',
    'AI Coach Enhancement',
    'Define Milestones',
    'Action Plan',
    'Save Externally',
    'Upload Your Work',
    'Analysis & Results',
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-950 border-slate-800">
        <DialogHeader className="flex items-center justify-between pr-8">
          <div className="flex-1">
            <DialogTitle className="text-xl font-bold text-white">
              {stepTitles[currentStep - 1]}
            </DialogTitle>
            <p className="text-xs text-white/50 mt-1">Step {currentStep} of 7</p>
          </div>
        </DialogHeader>

        {/* Progress indicator */}
        <div className="px-6 py-2 flex gap-1 bg-slate-900/50 rounded-full">
          {[1, 2, 3, 4, 5, 6, 7].map((step) => (
            <div
              key={step}
              className={`flex-1 h-1 rounded-full transition ${
                step <= currentStep ? 'bg-cyan-500' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {currentStep === 1 && (
            <A2Day1Step1Vision
              onNext={handleStep1Next}
              initialData={visionData}
            />
          )}
          {currentStep === 2 && (
            <A2Day1Step2Coach
              visionData={visionData}
              onNext={handleStep2Next}
              onBack={() => handleBack(1)}
            />
          )}
          {currentStep === 3 && (
            <A2Day1Step3Milestones
              onNext={handleStep3Next}
              onBack={() => handleBack(2)}
              initialData={milestonesData}
            />
          )}
          {currentStep === 4 && (
            <A2Day1Step4ActionPlan
              onNext={handleStep4Next}
              onBack={() => handleBack(3)}
              initialData={actionPlanData}
            />
          )}
          {currentStep === 5 && (
            <A2Day1Step5ExternalSave
              onNext={handleStep5Next}
              onBack={() => handleBack(4)}
            />
          )}
          {currentStep === 6 && (
            <A2Day1Step6Upload
              onNext={handleStep6Next}
              onBack={() => handleBack(5)}
            />
          )}
          {currentStep === 7 && (
            <A2Day1Step7Analysis
              visionData={visionData}
              milestonesData={milestonesData}
              actionPlanData={actionPlanData}
              onComplete={handleStep7Complete}
              onRevise={handleStep7Revise}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
