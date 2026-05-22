'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Check, ChevronRight } from 'lucide-react'
import { type TestIntroduction } from '@/lib/supabase/a2-intro-identity'

interface Day5TestSelectorProps {
  testIntroduction: Partial<TestIntroduction>
  onTestCompleted: (testType: string, feedback: string) => Promise<void>
  isLoading: boolean
  onComplete: () => Promise<void>
  isSubmitting: boolean
}

export function Day5TestSelector({
  testIntroduction,
  onTestCompleted,
  isLoading,
  onComplete,
  isSubmitting,
}: Day5TestSelectorProps) {
  const [selectedTest, setSelectedTest] = useState<string | null>(null)
  const [testFeedback, setTestFeedback] = useState('')
  const [isTestSubmitting, setIsTestSubmitting] = useState(false)

  const testOptions = [
    {
      id: 'voice_test',
      label: 'Test en Voz Alta',
      description: 'Grábate diciendo tu intro 3 veces y escúchalo',
      tips: '¿Suena natural? ¿Te creíste lo que dijiste?',
    },
    {
      id: 'send_to_contact',
      label: 'Enviar a Contacto',
      description: 'Envía tu intro escrita a alguien de confianza',
      tips: '¿Qué preguntas hizo? ¿Qué entendió de ti?',
    },
    {
      id: 'linkedin_test',
      label: 'Test en LinkedIn',
      description: 'Actualiza tu headline con la intro y mira reacciones',
      tips: '¿Visitas aumentaron? ¿Conexiones relevantes?',
    },
    {
      id: 'interview_practice',
      label: 'Práctica de Entrevista',
      description: 'Úsala en una entrevista o mock interview',
      tips: '¿El entrevistador hizo follow-up?',
    },
  ]

  const handleTestSubmit = async () => {
    if (!selectedTest || !testFeedback) return

    setIsTestSubmitting(true)
    try {
      await onTestCompleted(selectedTest, testFeedback)
    } catch (err) {
      console.error('[v0] Error submitting test:', err)
    } finally {
      setIsTestSubmitting(false)
    }
  }

  const handleCompleteDay = async () => {
    await onComplete()
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white mb-2">Prueba Real</h2>
        <p className="text-white/70">Elige cómo y dónde vas a probar tu introducción</p>
      </div>

      <div className="space-y-3">
        {testOptions.map((test) => (
          <button
            key={test.id}
            onClick={() => setSelectedTest(test.id)}
            className={`p-4 rounded-lg text-left transition-all border ${
              selectedTest === test.id
                ? 'border-2 border-cyan-400'
                : 'border border-purple-500/40'
            }`}
            style={{
              backgroundColor:
                selectedTest === test.id ? 'rgba(80, 160, 170, 0.15)' : 'rgba(90, 90, 150, 0.05)',
            }}
          >
            <div className="flex gap-3">
              <div className="flex-shrink-0 mt-1">
                <div
                  className="w-4 h-4 rounded-full border"
                  style={{
                    borderColor: selectedTest === test.id ? 'rgb(80, 160, 170)' : 'rgba(90, 90, 150, 0.6)',
                    backgroundColor: selectedTest === test.id ? 'rgb(80, 160, 170)' : 'transparent',
                  }}
                />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-white">{test.label}</p>
                <p className="text-xs text-white/70 mt-1">{test.description}</p>
                <p className="text-xs text-white/50 mt-2">Pregúntate: {test.tips}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      {selectedTest && (
        <div className="space-y-3">
          <label className="text-sm font-semibold text-white/80 block">¿Qué pasó? Comparte tu feedback</label>
          <textarea
            value={testFeedback}
            onChange={(e) => setTestFeedback(e.target.value)}
            placeholder="Describe qué hiciste, qué reacciones tuviste, qué aprendiste..."
            className="w-full p-4 rounded-lg text-white placeholder:text-white/40 focus:outline-none resize-none"
            style={{ backgroundColor: 'rgba(90, 90, 150, 0.1)', border: '1px solid rgba(90, 90, 150, 0.6)' }}
            rows={4}
          />
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Button
          onClick={handleTestSubmit}
          disabled={!selectedTest || !testFeedback || isTestSubmitting || isLoading}
          className="py-6 text-white font-semibold rounded-full"
          style={{ backgroundColor: 'rgba(90, 90, 150, 0.8)' }}
        >
          {isTestSubmitting ? 'Guardando...' : 'Guardar Test'}
          <Check className="w-4 h-4 ml-2" />
        </Button>

        <Button
          onClick={handleCompleteDay}
          disabled={isSubmitting || isLoading}
          className="py-6 text-white font-semibold rounded-full"
          style={{ backgroundColor: 'rgba(80, 160, 170, 0.8)' }}
        >
          {isSubmitting ? 'Completando...' : 'Terminar Día 5'}
          <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  )
}
