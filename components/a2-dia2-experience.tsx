'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle, CheckCircle2, ChevronRight } from 'lucide-react'
import {
  AVAILABLE_TRAITS,
  AVAILABLE_RISKS,
  validateDay2Submission,
  mapA1ToWorkStyleProfile,
  type Day2Submission,
} from '@/lib/a2-dia2-types'
import { WorkStyleInsightCard } from './a2-dia2-insight-card'
import { A1ProfileResult } from '@/lib/disc-calculator'

interface Day2ExperienceProps {
  a1Profile: A1ProfileResult
  onComplete: (submission: Day2Submission) => void
  initialSubmission?: Day2Submission
}

type Step = 'review' | 'traits' | 'risk' | 'reflection' | 'summary'

const traitLabels: Record<string, string> = {
  directo: 'Directo',
  analitico: 'Analítico',
  cuidadoso: 'Cuidadoso',
  sociable: 'Sociable',
  constante: 'Constante',
  rapido: 'Rápido',
  detallista: 'Detallista',
  reservado: 'Reservado',
  competitivo: 'Competitivo',
  colaborativo: 'Colaborativo',
  reflexivo: 'Reflexivo',
  impulsivo: 'Impulsivo',
}

const riskLabels: Record<string, string> = {
  'hablo-rapido': 'Hablo demasiado rápido',
  'respuestas-cortas': 'Doy respuestas muy cortas',
  'cuesta-vender': 'Me cuesta vender mis logros',
  defensivo: 'Me pongo defensivo',
  'cuesta-improvisar': 'Me cuesta improvisar',
  'necesito-seguridad': 'Necesito demasiada seguridad antes de responder',
  'poco-natural': 'Me cuesta sonar natural',
  'hablo-poco': 'Hablo demasiado poco',
}

export function Day2Experience({ a1Profile, onComplete, initialSubmission }: Day2ExperienceProps) {
  const [currentStep, setCurrentStep] = useState<Step>('review')
  const [submission, setSubmission] = useState<Day2Submission>(
    initialSubmission || {
      selectedTraits: [],
      selectedRisk: '',
      reflection: '',
      personalRule: '',
    }
  )
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const profileMap = mapA1ToWorkStyleProfile(a1Profile)

  const handleNextStep = () => {
    const steps: Step[] = ['review', 'traits', 'risk', 'reflection', 'summary']
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1])
    }
  }

  const handlePrevStep = () => {
    const steps: Step[] = ['review', 'traits', 'risk', 'reflection', 'summary']
    const currentIndex = steps.indexOf(currentStep)
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1])
    }
  }

  const handleSelectTrait = (traitId: string) => {
    setSubmission((prev) => {
      const newTraits = prev.selectedTraits.includes(traitId)
        ? prev.selectedTraits.filter((t) => t !== traitId)
        : [...prev.selectedTraits, traitId]

      // Limit to 3 traits
      return {
        ...prev,
        selectedTraits: newTraits.slice(0, 3),
      }
    })
  }

  const handleSelectRisk = (riskId: string) => {
    setSubmission((prev) => ({
      ...prev,
      selectedRisk: prev.selectedRisk === riskId ? '' : riskId,
    }))
  }

  const handleReflectionChange = (text: string) => {
    setSubmission((prev) => ({
      ...prev,
      reflection: text,
    }))
  }

  const handleRuleChange = (text: string) => {
    setSubmission((prev) => ({
      ...prev,
      personalRule: text,
    }))
  }

  const handleFinalSubmit = async () => {
    const validation = validateDay2Submission(submission)

    if (!validation.isValid) {
      setValidationErrors(validation.errors)
      return
    }

    setIsSubmitting(true)
    try {
      onComplete(submission)
    } catch (error) {
      console.error('[v0] Error submitting Day 2:', error)
      setValidationErrors(['Error al guardar. Intenta nuevamente.'])
    } finally {
      setIsSubmitting(false)
    }
  }

  const traitsComplete = submission.selectedTraits.length === 3
  const riskComplete = submission.selectedRisk !== ''
  const reflectionComplete = submission.reflection.trim().length >= 50
  const ruleComplete = submission.personalRule.trim().length >= 20

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center gap-2 justify-center">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${
          currentStep !== 'review' ? 'bg-green-500/20 text-green-300 border border-green-500/40' : 'bg-purple-600/60 text-white border border-purple-500/60'
        }`}>
          {currentStep === 'review' ? '1' : '✓'}
        </div>
        <div className="h-0.5 w-8 bg-purple-500/40"></div>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${
          currentStep !== 'traits' && traitsComplete ? 'bg-green-500/20 text-green-300 border border-green-500/40' : 
          currentStep === 'traits' ? 'bg-purple-600/60 text-white border border-purple-500/60' : 'bg-slate-900/50 text-white/40 border border-slate-700/40'
        }`}>
          {currentStep !== 'traits' && traitsComplete ? '✓' : '2'}
        </div>
        <div className="h-0.5 w-8 bg-purple-500/40"></div>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${
          currentStep !== 'risk' && riskComplete ? 'bg-green-500/20 text-green-300 border border-green-500/40' :
          currentStep === 'risk' ? 'bg-purple-600/60 text-white border border-purple-500/60' : 'bg-slate-900/50 text-white/40 border border-slate-700/40'
        }`}>
          {currentStep !== 'risk' && riskComplete ? '✓' : '3'}
        </div>
        <div className="h-0.5 w-8 bg-purple-500/40"></div>
        <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold ${
          currentStep === 'summary' && reflectionComplete && ruleComplete ? 'bg-green-500/20 text-green-300 border border-green-500/40' :
          currentStep === 'reflection' || currentStep === 'summary' ? 'bg-purple-600/60 text-white border border-purple-500/60' : 'bg-slate-900/50 text-white/40 border border-slate-700/40'
        }`}>
          {currentStep === 'summary' && reflectionComplete && ruleComplete ? '✓' : '4'}
        </div>
      </div>

      {/* Step Content */}
      <div className="space-y-4">
        {/* Step 1: Review A1 */}
        {currentStep === 'review' && (
          <Card className="border border-purple-500/40 bg-purple-500/5 p-6 rounded-[28px] space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Tu Sistema Operativo Profesional</h3>
              <p className="text-white/80 text-sm leading-relaxed">
                Tu forma de trabajar, decidir, comunicar y reaccionar bajo presión influye directamente en entrevistas y postulaciones.
              </p>
            </div>

            <Card className="border border-slate-700/40 bg-slate-900/50 p-4 rounded-[20px]">
              <p className="text-xs font-semibold text-white/60 uppercase tracking-wide mb-3">Tu Perfil A1</p>
              <div className="space-y-3">
                <div>
                  <p className="text-2xl font-bold text-white mb-2">{a1Profile.perfil_dominante.charAt(0).toUpperCase() + a1Profile.perfil_dominante.slice(1)}</p>
                  <p className="text-white/80 text-sm">{a1Profile.descripción}</p>
                </div>
              </div>
            </Card>

            <div className="bg-amber-500/10 border border-amber-500/40 rounded-lg p-3 flex gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-200">
                Tu estilo no es bueno ni malo. Es una herramienta que necesitas entender para usarla en entrevistas.
              </p>
            </div>
          </Card>
        )}

        {/* Step 2: Select Traits */}
        {currentStep === 'traits' && (
          <Card className="border border-purple-500/40 bg-purple-500/5 p-6 rounded-[28px] space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Selecciona 3 rasgos que reconoces en ti</h3>
              <p className="text-white/60 text-sm">
                Elige exactamente 3 características que se alinean con tu personalidad profesional.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {AVAILABLE_TRAITS.map((trait) => (
                <button
                  key={trait.id}
                  onClick={() => handleSelectTrait(trait.id)}
                  className={`p-3 rounded-lg border transition-all text-sm font-medium ${
                    submission.selectedTraits.includes(trait.id)
                      ? 'bg-emerald-500/20 border-emerald-500/60 text-emerald-200'
                      : 'bg-slate-900/30 border-slate-700/40 text-white/60 hover:border-purple-500/40 hover:bg-purple-500/5'
                  }`}
                >
                  {traitLabels[trait.id]}
                  {submission.selectedTraits.includes(trait.id) && (
                    <CheckCircle2 className="w-3 h-3 ml-1 inline" />
                  )}
                </button>
              ))}
            </div>

            {submission.selectedTraits.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {submission.selectedTraits.map((traitId) => (
                  <Badge key={traitId} className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    {traitLabels[traitId]}
                  </Badge>
                ))}
              </div>
            )}

            <div className="text-xs text-white/50">
              {submission.selectedTraits.length} / 3 seleccionados
            </div>
          </Card>
        )}

        {/* Step 3: Select Risk */}
        {currentStep === 'risk' && (
          <Card className="border border-purple-500/40 bg-purple-500/5 p-6 rounded-[28px] space-y-4">
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Selecciona 1 riesgo en entrevistas</h3>
              <p className="text-white/60 text-sm">
                Elige un rasgo que podría jugar en tu contra en una entrevista.
              </p>
            </div>

            <div className="space-y-2">
              {AVAILABLE_RISKS.map((risk) => (
                <button
                  key={risk.id}
                  onClick={() => handleSelectRisk(risk.id)}
                  className={`w-full p-3 rounded-lg border transition-all text-left ${
                    submission.selectedRisk === risk.id
                      ? 'bg-amber-500/20 border-amber-500/60'
                      : 'bg-slate-900/30 border-slate-700/40 hover:border-amber-500/40 hover:bg-amber-500/5'
                  }`}
                >
                  <div className={`text-sm font-medium ${submission.selectedRisk === risk.id ? 'text-amber-200' : 'text-white/80'}`}>
                    {risk.label}
                  </div>
                  <div className={`text-xs mt-1 ${submission.selectedRisk === risk.id ? 'text-amber-200/60' : 'text-white/40'}`}>
                    {risk.description}
                  </div>
                  {submission.selectedRisk === risk.id && (
                    <CheckCircle2 className="w-4 h-4 inline float-right mt-1 text-amber-400" />
                  )}
                </button>
              ))}
            </div>
          </Card>
        )}

        {/* Step 4: Reflection & Rule */}
        {(currentStep === 'reflection' || currentStep === 'summary') && (
          <div className="space-y-4">
            {/* Reflection */}
            <Card className="border border-purple-500/40 bg-purple-500/5 p-6 rounded-[28px] space-y-3">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Mi reflexión</h3>
                <p className="text-white/60 text-xs">
                  Completa: "Mi estilo profesional me puede ayudar porque ________. Pero en entrevistas debo cuidar ________."
                </p>
              </div>
              <Textarea
                value={submission.reflection}
                onChange={(e) => handleReflectionChange(e.target.value)}
                placeholder="Mi estilo profesional me puede ayudar porque soy analítico y veo detalles. Pero en entrevistas debo cuidar no sonar demasiado técnico..."
                className="min-h-[100px] bg-slate-900/50 border-slate-700/40 text-white placeholder:text-white/30 rounded-lg"
              />
              <div className={`text-xs ${submission.reflection.length >= 50 ? 'text-green-400' : 'text-white/50'}`}>
                {submission.reflection.length} / 50 caracteres mínimo
              </div>
            </Card>

            {/* Personal Rule */}
            <Card className="border border-purple-500/40 bg-purple-500/5 p-6 rounded-[28px] space-y-3">
              <div>
                <h3 className="text-sm font-bold text-white mb-1">Mi regla personal</h3>
                <p className="text-white/60 text-xs">
                  Crea una regla concreta que uses en entrevistas basada en tu reflexión.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/60 text-sm">Mi regla:</span>
                <input
                  value={submission.personalRule}
                  onChange={(e) => handleRuleChange(e.target.value)}
                  placeholder="Haré una pausa breve antes de responder para no sonar acelerado"
                  className="flex-1 bg-slate-900/50 border border-slate-700/40 text-white placeholder:text-white/30 rounded-lg px-3 py-2 text-sm"
                />
              </div>
              <div className={`text-xs ${submission.personalRule.length >= 20 ? 'text-green-400' : 'text-white/50'}`}>
                {submission.personalRule.length} / 20 caracteres mínimo
              </div>
            </Card>

            {/* Validation Errors */}
            {validationErrors.length > 0 && (
              <div className="bg-red-500/10 border border-red-500/40 rounded-lg p-3 flex gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-red-200">
                  {validationErrors.map((error, idx) => (
                    <p key={idx}>{error}</p>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 5: Summary */}
        {currentStep === 'summary' && (
          <WorkStyleInsightCard
            a1Profile={a1Profile}
            traits={submission.selectedTraits}
            risk={submission.selectedRisk}
            reflection={submission.reflection}
            personalRule={submission.personalRule}
          />
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 pt-4">
        {currentStep !== 'review' && (
          <Button
            onClick={handlePrevStep}
            className="flex-1 py-6 rounded-full font-semibold transition-all duration-200 border-2"
            style={{
              color: 'rgb(80, 160, 170)',
              borderColor: 'rgb(80, 160, 170)',
              backgroundColor: 'rgba(15, 23, 42, 0.4)',
            }}
          >
            ← Anterior
          </Button>
        )}
        {currentStep !== 'summary' ? (
          <Button
            onClick={handleNextStep}
            disabled={
              (currentStep === 'traits' && !traitsComplete) ||
              (currentStep === 'risk' && !riskComplete)
            }
            className="flex-1 py-6 rounded-full font-semibold bg-purple-600/80 hover:bg-purple-600/100 text-white transition-all duration-200 border border-purple-500/60 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Siguiente →
          </Button>
        ) : (
          <Button
            onClick={handleFinalSubmit}
            disabled={isSubmitting || !traitsComplete || !riskComplete || !reflectionComplete || !ruleComplete}
            className="flex-1 py-6 rounded-full font-semibold bg-emerald-600/80 hover:bg-emerald-600/100 text-white transition-all duration-200 border border-emerald-500/60 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Guardando...' : 'Completar Día 2'}
            {!isSubmitting && <ChevronRight className="w-4 h-4 ml-2 inline" />}
          </Button>
        )}
      </div>
    </div>
  )
}
