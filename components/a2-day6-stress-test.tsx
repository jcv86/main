'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ChevronRight, Check } from 'lucide-react'
import { type ProfessionalIdentity } from '@/lib/supabase/a2-intro-identity'

interface Day6StressTestProps {
  identity: ProfessionalIdentity
  onStressTestComplete: (result: string, isValidated: boolean) => Promise<void>
  isLoading: boolean
}

const STRESS_QUESTIONS = [
  '¿Qué fue tu mayor fracaso en el trabajo?',
  '¿Cómo manejas la presión y los deadlines imposibles?',
  '¿Trabajas mejor solo o en equipo?',
  '¿Cuál es tu mayor debilidad?',
  '¿Por qué dejaste tu último trabajo?',
]

export function Day6StressTest({
  identity,
  onStressTestComplete,
  isLoading,
}: Day6StressTestProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<string[]>([])
  const [isValidated, setIsValidated] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const allResponsesComplete = STRESS_QUESTIONS.every(
    (_, index) => (responses[index] || '').trim().length >= 5,
  )

  const handleResponseRecord = () => {
    if (currentQuestion < STRESS_QUESTIONS.length - 1) {
      setCurrentQuestion((question) => question + 1)
    }
  }

  const handleCompleteStressTest = async () => {
    setIsSaving(true)
    try {
      const stressResult = JSON.stringify({
        questions_answered: STRESS_QUESTIONS.length,
        responses,
        completed_at: new Date().toISOString(),
      })
      await onStressTestComplete(stressResult, isValidated)
    } catch (err) {
      console.error('[v0] Error completing stress test:', err)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Stress Test: Preguntas Difíciles</h2>
        <p className="text-white/70">Di en voz alta cómo responderías estas preguntas difíciles</p>
      </div>

      <div className="space-y-4">
        {/* Question Progress */}
        <div className="rounded-lg p-4 border border-purple-500/40" style={{ backgroundColor: 'rgba(90, 90, 150, 0.05)' }}>
          <div className="text-sm text-white/70 mb-2">
            Pregunta {currentQuestion + 1} de {STRESS_QUESTIONS.length}
          </div>
          <div className="w-full bg-purple-900/30 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width: `${((currentQuestion + 1) / STRESS_QUESTIONS.length) * 100}%`,
                backgroundColor: 'rgb(80, 160, 170)',
              }}
            />
          </div>
        </div>

        {/* Current Question */}
        <div className="rounded-lg p-6 border-2 border-cyan-400/40" style={{ backgroundColor: 'rgba(80, 160, 170, 0.05)' }}>
          <p className="text-lg font-semibold text-cyan-300 mb-4">{STRESS_QUESTIONS[currentQuestion]}</p>
          <p className="text-white/70 text-sm">Di en voz alta tu respuesta y tómala nota aquí</p>
        </div>

        {/* Response Input */}
        <textarea
          value={responses[currentQuestion] || ''}
          onChange={(e) => {
            const newResponses = [...responses]
            newResponses[currentQuestion] = e.target.value
            setResponses(newResponses)
          }}
          placeholder="Escribe tu respuesta..."
          className="w-full p-4 rounded-lg text-white placeholder:text-white/40 focus:outline-none resize-none"
          style={{ backgroundColor: 'rgba(90, 90, 150, 0.1)', border: '1px solid rgba(90, 90, 150, 0.6)' }}
          rows={4}
        />
      </div>

      {/* Validation Checkbox */}
      <label className="flex gap-3 items-center cursor-pointer text-white/80 text-sm">
        <input
          type="checkbox"
          checked={isValidated}
          onChange={(event) => setIsValidated(event.target.checked)}
          className="h-5 w-5 accent-cyan-500"
        />
        <span>Revisé mis respuestas y representan honestamente cómo presentaría mi experiencia.</span>
      </label>

      <div className="grid grid-cols-2 gap-3">
        {currentQuestion < STRESS_QUESTIONS.length - 1 ? (
          <Button
            type="button"
            onClick={handleResponseRecord}
            disabled={(responses[currentQuestion] || '').trim().length < 5 || isSaving || isLoading}
            className="py-6 text-white font-semibold rounded-full"
            style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}
          >
            Siguiente Pregunta
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        ) : <div />}

        <Button
          type="button"
          onClick={handleCompleteStressTest}
          disabled={!allResponsesComplete || !isValidated || isSaving || isLoading}
          className="py-6 text-white font-semibold rounded-full"
          style={{ backgroundColor: 'rgba(80, 160, 170, 0.8)' }}
        >
          {isSaving ? 'Guardando...' : 'Exportar Identidad'}
          <Check className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
