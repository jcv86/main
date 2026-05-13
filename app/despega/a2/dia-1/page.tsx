'use client'

import { useState } from 'react'
import { CheckCircle2, AlertCircle, ChevronRight, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Dia1VisionStep from '@/components/a2/dia-1/vision-step'
import Dia1CoachStep from '@/components/a2/dia-1/coach-step'
import Dia1MilestonesStep from '@/components/a2/dia-1/milestones-step'
import Dia1ActionsStep from '@/components/a2/dia-1/actions-step'
import Dia1ResourcesStep from '@/components/a2/dia-1/resources-step'
import Dia1UploadStep from '@/components/a2/dia-1/upload-step'
import Dia1ResultsStep from '@/components/a2/dia-1/results-step'

type Step = 'vision' | 'coach' | 'milestones' | 'actions' | 'resources' | 'upload' | 'results'

interface Dia1State {
  visionAnswers: {
    role: string
    environment: string
    result: string
  }
  coachVersion: string
  milestones: {
    day10: string
    day20: string
    day30: string
  }
  actions: {
    clarity: string[]
    material: string[]
    interview: string[]
    realAction: string[]
  }
  uploadedFile: File | null
  analysisScore: number | null
  analysisStatus: 'pending' | 'passed' | 'needs-revision' | null
}

export default function Dia1Page() {
  const [currentStep, setCurrentStep] = useState<Step>('vision')
  const [state, setState] = useState<Dia1State>({
    visionAnswers: { role: '', environment: '', result: '' },
    coachVersion: '',
    milestones: { day10: '', day20: '', day30: '' },
    actions: { clarity: [], material: [], interview: [], realAction: [] },
    uploadedFile: null,
    analysisScore: null,
    analysisStatus: null,
  })

  const steps: Step[] = ['vision', 'coach', 'milestones', 'actions', 'resources', 'upload', 'results']
  const currentStepIndex = steps.indexOf(currentStep)

  const updateState = (updates: Partial<Dia1State>) => {
    setState(prev => ({ ...prev, ...updates }))
  }

  const handleNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStep(steps[currentStepIndex + 1])
    }
  }

  const handlePrevious = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(steps[currentStepIndex - 1])
    }
  }

  const isVisionComplete = state.visionAnswers.role && state.visionAnswers.environment && state.visionAnswers.result
  const isCoachComplete = state.coachVersion.length > 0
  const areMilestonesComplete = state.milestones.day10 && state.milestones.day20 && state.milestones.day30
  const areActionsComplete = 
    state.actions.clarity.length > 0 && 
    state.actions.material.length > 0 && 
    state.actions.interview.length > 0 && 
    state.actions.realAction.length > 0
  const isUploadComplete = state.uploadedFile !== null
  const isAnalysisComplete = state.analysisStatus !== null

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-muted/30 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="inline-flex items-center justify-center h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-bold">
              1
            </span>
            <h1 className="text-3xl font-bold text-foreground">Define tu visión y roadmap</h1>
          </div>
          <p className="text-muted-foreground">
            Crea una primera versión clara de lo que quieres lograr y cómo vas a avanzar durante los próximos 30 días.
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="border-b border-border bg-background">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-2 mb-4">
            {steps.map((step, idx) => (
              <div key={step} className="flex items-center gap-2">
                <div
                  className={`h-2 w-12 rounded-full transition-colors ${
                    idx <= currentStepIndex ? 'bg-primary' : 'bg-muted'
                  }`}
                />
                {idx < steps.length - 1 && (
                  <ChevronRight className={`w-4 h-4 ${idx < currentStepIndex ? 'text-primary' : 'text-muted'}`} />
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            Paso {currentStepIndex + 1} de {steps.length}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Success Criteria */}
        <div className="mb-8 p-4 bg-muted/50 rounded-lg border border-border">
          <h3 className="font-semibold mb-3 text-foreground">Criterios de éxito</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <CheckCircle2 className={`w-4 h-4 ${isVisionComplete ? 'text-green-600' : 'text-muted-foreground'}`} />
              <span className={isVisionComplete ? 'text-foreground' : 'text-muted-foreground'}>Visión escrita</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className={`w-4 h-4 ${isCoachComplete ? 'text-green-600' : 'text-muted-foreground'}`} />
              <span className={isCoachComplete ? 'text-foreground' : 'text-muted-foreground'}>Visión mejorada con coach</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className={`w-4 h-4 ${areMilestonesComplete ? 'text-green-600' : 'text-muted-foreground'}`} />
              <span className={areMilestonesComplete ? 'text-foreground' : 'text-muted-foreground'}>3 hitos definidos</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className={`w-4 h-4 ${areActionsComplete ? 'text-green-600' : 'text-muted-foreground'}`} />
              <span className={areActionsComplete ? 'text-foreground' : 'text-muted-foreground'}>Plan de acciones creado</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className={`w-4 h-4 ${isUploadComplete ? 'text-green-600' : 'text-muted-foreground'}`} />
              <span className={isUploadComplete ? 'text-foreground' : 'text-muted-foreground'}>Roadmap subido</span>
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle2 className={`w-4 h-4 ${isAnalysisComplete && state.analysisStatus === 'passed' ? 'text-green-600' : 'text-muted-foreground'}`} />
              <span className={isAnalysisComplete && state.analysisStatus === 'passed' ? 'text-foreground' : 'text-muted-foreground'}>Análisis aprobado</span>
            </li>
          </ul>
        </div>

        {/* Step Content */}
        <div className="mb-8">
          {currentStep === 'vision' && (
            <Dia1VisionStep
              answers={state.visionAnswers}
              onUpdate={(visionAnswers) => updateState({ visionAnswers })}
              onNext={handleNext}
            />
          )}
          {currentStep === 'coach' && (
            <Dia1CoachStep
              visionAnswers={state.visionAnswers}
              coachVersion={state.coachVersion}
              onUpdate={(coachVersion) => updateState({ coachVersion })}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          )}
          {currentStep === 'milestones' && (
            <Dia1MilestonesStep
              milestones={state.milestones}
              onUpdate={(milestones) => updateState({ milestones })}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          )}
          {currentStep === 'actions' && (
            <Dia1ActionsStep
              actions={state.actions}
              milestones={state.milestones}
              onUpdate={(actions) => updateState({ actions })}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          )}
          {currentStep === 'resources' && (
            <Dia1ResourcesStep
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          )}
          {currentStep === 'upload' && (
            <Dia1UploadStep
              file={state.uploadedFile}
              onFileUpdate={(uploadedFile) => updateState({ uploadedFile })}
              onNext={handleNext}
              onPrevious={handlePrevious}
            />
          )}
          {currentStep === 'results' && (
            <Dia1ResultsStep
              score={state.analysisScore}
              status={state.analysisStatus}
              feedback={state}
              onRetry={() => {
                setState(prev => ({
                  ...prev,
                  analysisStatus: null,
                  analysisScore: null,
                }))
                setCurrentStep('coach')
              }}
            />
          )}
        </div>

        {/* Navigation */}
        {currentStep !== 'results' && (
          <div className="flex gap-3 justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStepIndex === 0}
            >
              Anterior
            </Button>
            <Button
              onClick={handleNext}
              disabled={
                (currentStep === 'vision' && !isVisionComplete) ||
                (currentStep === 'coach' && !isCoachComplete) ||
                (currentStep === 'milestones' && !areMilestonesComplete) ||
                (currentStep === 'actions' && !areActionsComplete) ||
                (currentStep === 'upload' && !isUploadComplete)
              }
            >
              Siguiente
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
