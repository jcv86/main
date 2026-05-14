'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { AlertCircle, Check, ChevronRight } from 'lucide-react'
import type { A1ProfileResult } from '@/lib/disc-calculator'
import {
  WORK_STYLE_TRAITS,
  INTERVIEW_RISKS,
  validateDay2Submission,
  type Day2Submission,
} from '@/lib/a2-day2-types'

interface Day2ExperienceProps {
  a1Profile: A1ProfileResult
  onComplete: (submission: Day2Submission) => Promise<void> | void
}

type Step = 'intro' | 'traits' | 'risk' | 'reflection' | 'summary'

export function Day2Experience({ a1Profile, onComplete }: Day2ExperienceProps) {
  const [currentStep, setCurrentStep] = useState<Step>('intro')
  const [selectedTraits, setSelectedTraits] = useState<string[]>([])
  const [selectedRisk, setSelectedRisk] = useState<string>('')
  const [reflection, setReflection] = useState('')
  const [personalRule, setPersonalRule] = useState('')
  const [errors, setErrors] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const steps: Step[] = ['intro', 'traits', 'risk', 'reflection', 'summary']
  const currentStepIndex = steps.indexOf(currentStep)
  const progressPercent = ((currentStepIndex + 1) / steps.length) * 100

  const handleNextStep = () => {
    setErrors([])

    // Validate current step
    if (currentStep === 'traits' && selectedTraits.length !== 3) {
      setErrors(['Debes seleccionar exactamente 3 características'])
      return
    }

    if (currentStep === 'risk' && !selectedRisk) {
      setErrors(['Debes seleccionar 1 riesgo de entrevista'])
      return
    }

    if (currentStep === 'reflection') {
      if (reflection.trim().length < 50) {
        setErrors(['Tu reflexión debe tener al menos 50 caracteres'])
        return
      }
      if (personalRule.trim().length < 20) {
        setErrors(['Tu regla personal debe tener al menos 20 caracteres'])
        return
      }
    }

    // Move to next step
    const nextIndex = currentStepIndex + 1
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex])
    }
  }

  const handleSubmit = async () => {
    setIsSubmitting(true)

    const submission: Day2Submission = {
      dayNumber: 2,
      a1Profile,
      selectedTraits,
      selectedRisk,
      reflection,
      personalRule,
      completedAt: new Date().toISOString(),
      xpEarned: 500,
    }

    const validation = validateDay2Submission(submission)

    if (!validation.valid) {
      setErrors(validation.errors)
      setIsSubmitting(false)
      return
    }

    try {
      await onComplete(submission)
    } catch (error) {
      console.error('[v0] Error submitting Day 2:', error)
      setErrors(['Error al guardar tu progreso. Intenta nuevamente.'])
    } finally {
      setIsSubmitting(false)
    }
  }

  const traitLabel = (id: string) => WORK_STYLE_TRAITS.find((t) => t.id === id)?.label || id
  const riskLabel = (id: string) => INTERVIEW_RISKS.find((r) => r.id === id)?.label || id

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h3 className="text-sm font-semibold text-purple-300">
            Paso {currentStepIndex + 1} de {steps.length}
          </h3>
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold" style={{ color: 'rgb(80, 160, 170)' }}>+500 XP</span>
          </div>
        </div>
        <div className="relative w-full overflow-hidden rounded-[20px]" style={{ height: '8px', backgroundColor: 'rgba(90, 90, 150, 0.4)' }}>
          <div
            className="h-full transition-all duration-300"
            style={{ 
              width: `${progressPercent}%`,
              backgroundColor: 'rgb(90, 90, 150, 0.4)'
            }}
          />
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="rounded-[16px] border border-red-500/40 bg-red-500/5 p-4 space-y-2">
          {errors.map((error, idx) => (
            <div key={idx} className="flex gap-3">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-300">{error}</p>
            </div>
          ))}
        </div>
      )}

      {/* Step: Intro - A1 Profile Review */}
      {currentStep === 'intro' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-normal text-white mb-2">Tu Sistema Operativo Profesional</h2>
            <p className="text-white/70">
              Basado en tu perfil A1, vamos a identificar cómo tu estilo de trabajo afecta tus entrevistas.
            </p>
          </div>

          <Card className="border p-6 rounded-[20px] space-y-6" style={{ borderColor: 'rgba(90, 90, 150, 0.6)', backgroundColor: 'rgba(90, 90, 150, 0.2)' }}>
            <h3 className="text-lg font-semibold text-purple-300">Tu Perfil A1</h3>

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Dominancia', value: a1Profile.dominancia },
                { label: 'Influencia', value: a1Profile.influencia },
                { label: 'Estabilidad', value: a1Profile.estabilidad },
                { label: 'Conciencia', value: a1Profile.conciencia },
              ].map((dim) => (
                <div key={dim.label} className="space-y-2">
                  <p className="text-sm text-white/60">{dim.label}</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-purple-500/20 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-purple-400 to-cyan-400"
                        style={{ width: `${(dim.value / 100) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-semibold text-cyan-300">{dim.value}</span>
                  </div>
                </div>
              ))}
            </div>

            <p className="text-sm text-white/70 leading-relaxed italic">
              "{a1Profile.descripción}"
            </p>
          </Card>

          <div className="border rounded-[16px] p-4 space-y-3" style={{ backgroundColor: 'rgba(90, 90, 150, 0.4)', borderColor: 'rgba(90, 90, 150, 0.2)' }}>
            <p className="text-sm font-semibold" style={{ color: 'rgb(80, 160, 170)' }}>💡 Mini Lección</p>
            <p className="text-sm text-white/80 leading-relaxed">
              Tu estilo de trabajo es una <strong>herramienta</strong>, no una etiqueta. En entrevistas, entender tu estilo te permite:
            </p>
            <ul className="text-sm text-white/70 space-y-2 ml-4">
              <li>✓ Reconocer cómo reaccionas bajo presión</li>
              <li>✓ Adaptar tu comunicación estratégicamente</li>
              <li>✓ Anticipar desafíos y preparar respuestas</li>
            </ul>
          </div>

          <Button
            onClick={handleNextStep}
            className="w-full py-6 bg-purple-600/80 hover:bg-purple-600/100 text-white font-semibold rounded-full"
          >
            Continuar
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Step: Select Traits */}
      {currentStep === 'traits' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl text-white mb-2" style={{ fontWeight: 500 }}>Selecciona 3 características que te describan</h2>
            <p className="text-white/70">Elige las que más resonan contigo en contexto de trabajo.</p>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {WORK_STYLE_TRAITS.map((trait) => (
              <button
                key={trait.id}
                onClick={() => {
                  if (selectedTraits.includes(trait.id)) {
                    setSelectedTraits(selectedTraits.filter((t) => t !== trait.id))
                  } else if (selectedTraits.length < 3) {
                    setSelectedTraits([...selectedTraits, trait.id])
                  }
                }}
                className="text-left p-4 rounded-[16px] border-2 transition-all"
                style={{
                  borderColor: selectedTraits.includes(trait.id) ? 'rgb(80, 160, 170)' : 'rgba(90, 90, 150, 0.6)',
                  backgroundColor: selectedTraits.includes(trait.id) ? 'rgba(80, 160, 170, 0.1)' : 'rgba(90, 90, 150, 0.05)'
                }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-white">{trait.label}</p>
                    <p className="text-sm text-white/60 mt-1">{trait.description}</p>
                  </div>
                  {selectedTraits.includes(trait.id) && (
                    <Check className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <p className="text-sm text-white/60">
            Seleccionadas: {selectedTraits.length}/3
          </p>

          <Button
            onClick={handleNextStep}
            disabled={selectedTraits.length !== 3}
            className="w-full py-6 bg-purple-600/80 hover:bg-purple-600/100 text-white font-semibold rounded-full disabled:opacity-50"
          >
            Continuar
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Step: Select Risk */}
      {currentStep === 'risk' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl text-white mb-2" style={{ fontWeight: 500 }}>Selecciona 1 riesgo de entrevista</h2>
            <p className="text-white/70">El desafío que enfrentas típicamente en contextos de evaluación.</p>
          </div>

          <div className="grid grid-cols-1 gap-3" style={{ borderColor: 'rgba(80, 160, 170, 0.6)' }}>
            {INTERVIEW_RISKS.map((risk) => (
              <button
                key={risk.id}
                onClick={() => setSelectedRisk(selectedRisk === risk.id ? '' : risk.id)}
                className="text-left p-4 rounded-[16px] border-2 transition-all"
                style={{
                  borderColor: selectedRisk === risk.id ? 'rgb(34, 211, 238)' : 'rgba(90, 90, 150, 0.8)',
                  backgroundColor: selectedRisk === risk.id ? 'rgba(34, 211, 238, 0.1)' : 'rgba(90, 90, 150, 0.05)'
                }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-white">{risk.label}</p>
                    <p className="text-sm text-white/60 mt-1">{risk.description}</p>
                  </div>
                  {selectedRisk === risk.id && (
                    <Check className="w-5 h-5 text-cyan-400 flex-shrink-0" />
                  )}
                </div>
              </button>
            ))}
          </div>

          <Button
            onClick={handleNextStep}
            disabled={!selectedRisk}
            className="w-full py-6 bg-purple-600/80 hover:bg-purple-600/100 text-white font-semibold rounded-full disabled:opacity-50"
          >
            Continuar
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Step: Reflection & Rule */}
      {currentStep === 'reflection' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">Crea tu regla personal</h2>
            <p className="text-white/70">Escribe una estrategia específica para manejar tu riesgo en entrevistas.</p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-purple-300 mb-2">Tu reflexión</label>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                placeholder="¿Cómo afecta este riesgo tu rendimiento? Sé específico con ejemplos..."
                className="w-full p-4 rounded-[12px] text-white placeholder:text-white/40 focus:outline-none resize-none"
                style={{
                  backgroundColor: 'rgba(90, 90, 150, 0.1)',
                  border: '2px solid rgba(90, 90, 150, 0.8)'
                }}
                rows={4}
              />
              <p className="text-xs text-white/50 mt-2">
                {reflection.length}/50 caracteres mínimo
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-purple-300 mb-2">Mi regla (ej: "Haré pausa antes de responder")</label>
              <input
                type="text"
                value={personalRule}
                onChange={(e) => setPersonalRule(e.target.value)}
                placeholder="Mi regla: ..."
                className="w-full p-4 rounded-[12px] text-white placeholder:text-white/40 focus:outline-none"
                style={{
                  backgroundColor: 'rgba(90, 90, 150, 0.1)',
                  border: '2px solid rgba(90, 90, 150, 0.8)'
                }}
              />
              <p className="text-xs text-white/50 mt-2">
                {personalRule.length}/20 caracteres mínimo
              </p>
            </div>
          </div>

          <Button
            onClick={handleNextStep}
            disabled={reflection.length < 50 || personalRule.length < 20}
            className="w-full py-6 bg-purple-600/80 hover:bg-purple-600/100 text-white font-semibold rounded-full disabled:opacity-50"
          >
            Ver Resumen
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      )}

      {/* Step: Summary */}
      {currentStep === 'summary' && (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl text-white mb-2" style={{ fontWeight: 500 }}>Tu Tarjeta de Insights</h2>
            <p className="text-white/70">Resumen de tu sistema operativo profesional para entrevistas.</p>
          </div>

          <Card className="border p-6 rounded-[20px] space-y-6" style={{ borderColor: 'rgba(90, 90, 150, 0.6)', backgroundColor: 'rgba(90, 90, 150, 0.2)' }}>
            <div>
              <p className="text-xs font-semibold mb-2" style={{ color: 'rgb(80, 160, 170)' }}>CARACTERÍSTICAS CLAVE</p>
              <div className="flex flex-wrap gap-2">
                {selectedTraits.map((traitId) => (
                  <span
                    key={traitId}
                    className="px-3 py-1 rounded-full text-sm font-semibold border"
                    style={{ backgroundColor: 'rgba(80, 160, 170, 0.3)', color: 'rgb(80, 160, 170)', borderColor: 'rgba(80, 160, 170, 0.4)' }}
                  >
                    {traitLabel(traitId)}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ borderTopColor: 'rgba(90, 90, 150, 0.4)' }} className="border-t pt-4">
              <p className="text-xs font-semibold mb-2" style={{ color: 'rgb(80, 160, 170)' }}>RIESGO DE ENTREVISTA</p>
              <p className="text-white font-semibold">{riskLabel(selectedRisk)}</p>
            </div>

            <div style={{ borderTopColor: 'rgba(90, 90, 150, 0.4)' }} className="border-t pt-4">
              <p className="text-xs font-semibold mb-2" style={{ color: 'rgb(80, 160, 170)' }}>MI REGLA PERSONAL</p>
              <p className="text-white italic">"{personalRule}"</p>
            </div>

            <div style={{ borderTopColor: 'rgba(90, 90, 150, 0.4)' }} className="border-t pt-4">
              <p className="text-xs font-semibold" style={{ color: 'rgb(80, 160, 170)' }}>+500 XP GANADO</p>
            </div>
          </Card>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-6 text-white font-semibold rounded-full disabled:opacity-50"
            style={{ backgroundColor: 'rgba(80, 160, 170, 0.7)' }}
          >
            {isSubmitting ? 'Guardando...' : 'Completar Día 2'}
            {!isSubmitting && <Check className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      )}
    </div>
  )
}
