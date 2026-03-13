'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { CONOZCAMONOS_2_QUESTIONS } from '@/lib/conozcamonos-2-questions'
import { createClient } from '@/lib/supabase/client'

export default function Conozcamonos2Page() {
  const [currentStep, setCurrentStep] = useState<'paso1' | 'paso2'>('paso1')
  const [responses, setResponses] = useState<Record<number, string | string[]>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const stepQuestions = CONOZCAMONOS_2_QUESTIONS.filter(q => q.section === currentStep)
  const totalQuestions = CONOZCAMONOS_2_QUESTIONS.length
  const completedCount = Object.keys(responses).length
  const progress = (completedCount / totalQuestions) * 100

  const handleAnswer = (questionId: number, value: string | string[]) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }))
    setError('')
  }

  const allStepAnswered = stepQuestions.every(q => responses[q.id])

  const handleNext = () => {
    if (!allStepAnswered) {
      setError('Por favor responde todas las preguntas de este paso')
      return
    }

    if (currentStep === 'paso1') {
      setCurrentStep('paso2')
    } else {
      submitResponses()
    }
  }

  const handleBack = () => {
    if (currentStep === 'paso2') {
      setCurrentStep('paso1')
    }
  }

  const submitResponses = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.id) {
        router.push('/auth/signin')
        return
      }

      // Save responses
      const { error: dbError } = await supabase
        .from('canon_conozcamonos_2_responses')
        .insert({
          user_id: user.id,
          responses: responses,
          completed_at: new Date().toISOString()
        })

      if (dbError) throw dbError

      console.log('[v0] Conozcamonos 2 saved successfully')

      // Redirect to A2 routes dashboard
      router.push('/despega/a2-routes')
    } catch (err) {
      console.error('[v0] Error saving Conozcamonos 2:', err)
      setError('Error al guardar tus respuestas. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Conozcamonos 2: Diseña Tu Ruta
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            {currentStep === 'paso1'
              ? 'Paso 1: Define tu objetivo específico y estrategia'
              : 'Paso 2: Personaliza tu plan de acción'}
          </p>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            {completedCount} de {totalQuestions} preguntas completadas
          </p>
        </div>

        {/* Questions */}
        <div className="space-y-6 mb-8">
          {stepQuestions.map((question) => (
            <Card key={question.id} className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">
                {question.question}
              </h3>

              {question.type === 'select' && (
                <select
                  value={responses[question.id] as string || ''}
                  onChange={(e) => handleAnswer(question.id, e.target.value)}
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                >
                  <option value="">-- Selecciona una opción --</option>
                  {question.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}

              {question.type === 'text' && (
                <textarea
                  value={responses[question.id] as string || ''}
                  onChange={(e) => handleAnswer(question.id, e.target.value)}
                  placeholder={question.placeholder}
                  maxLength={question.maxLength}
                  className="w-full p-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 resize-none focus:outline-none focus:border-purple-600"
                  rows={3}
                />
              )}

              {question.type === 'checkbox' && (
                <div className="space-y-3">
                  {question.options?.map((opt) => (
                    <label key={opt} className="flex items-center gap-3 cursor-pointer">
                      <Checkbox
                        checked={(responses[question.id] as string[] || []).includes(opt)}
                        onCheckedChange={(checked) => {
                          const current = (responses[question.id] as string[] || [])
                          const updated = checked
                            ? [...current, opt]
                            : current.filter(item => item !== opt)
                          handleAnswer(question.id, updated)
                        }}
                      />
                      <span className="text-slate-700 dark:text-slate-300">{opt}</span>
                    </label>
                  ))}
                </div>
              )}
            </Card>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-700 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-4 justify-between">
          <Button
            onClick={handleBack}
            variant="outline"
            disabled={currentStep === 'paso1' || loading}
          >
            Atrás
          </Button>

          <Button
            onClick={handleNext}
            disabled={!allStepAnswered || loading}
            className="bg-purple-600 hover:bg-purple-700"
          >
            {loading
              ? 'Procesando...'
              : currentStep === 'paso1'
              ? 'Siguiente'
              : 'Generar Mi Ruta'}
          </Button>
        </div>
      </div>
    </div>
  )
}
