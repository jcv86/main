'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { DISC_QUESTIONS } from '@/lib/disc-questions'
import { createClient } from '@/lib/supabase/client'

export default function DiscAssessmentPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<Record<number, number>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const question = DISC_QUESTIONS[currentQuestion]
  const progress = ((Object.keys(responses).length) / DISC_QUESTIONS.length) * 100
  const isLastQuestion = currentQuestion === DISC_QUESTIONS.length - 1

  const handleRate = (score: number) => {
    setResponses(prev => ({
      ...prev,
      [question.id]: score
    }))
    setError('')
  }

  const handleNext = () => {
    if (!responses[question.id]) {
      setError('Por favor valora tu acuerdo con esta afirmación')
      return
    }
    if (isLastQuestion) {
      submitResponses()
    } else {
      setCurrentQuestion(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
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

      // Save DISC responses
      const { error: dbError } = await supabase
        .from('canon_disc_responses')
        .insert({
          user_id: user.id,
          responses: responses,
          completed_at: new Date().toISOString()
        })

      if (dbError) throw dbError

      console.log('[v0] DISC Assessment saved successfully')

      // Redirect to A1 report
      router.push('/despega/a1-report')
    } catch (err) {
      console.error('[v0] Error saving DISC Assessment:', err)
      setError('Error al guardar tu evaluación. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <div className="max-w-2xl mx-auto py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Evaluación DISC
          </h1>
          <p className="text-slate-600 dark:text-slate-400 mb-4">
            Conoce tu perfil de personalidad y estilos de trabajo
          </p>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Pregunta {currentQuestion + 1} de {DISC_QUESTIONS.length}
          </p>
        </div>

        {/* Question Card */}
        <Card className="p-8 mb-8 shadow-lg">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white mb-6">
              {question.text}
            </h2>

            {/* Rating Scale */}
            <div className="flex gap-2 justify-between mb-6">
              {[
                { value: 1, label: 'Totalmente en desacuerdo' },
                { value: 2, label: 'En desacuerdo' },
                { value: 3, label: 'Neutral' },
                { value: 4, label: 'De acuerdo' },
                { value: 5, label: 'Totalmente de acuerdo' }
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => handleRate(value)}
                  className={`flex-1 py-3 px-2 rounded-lg font-medium transition-all ${
                    responses[question.id] === value
                      ? 'bg-purple-600 text-white shadow-lg scale-105'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600'
                  }`}
                  disabled={loading}
                >
                  <div className="text-lg font-bold">{value}</div>
                  <div className="text-xs hidden sm:block">{label.split(' ')[0]}</div>
                </button>
              ))}
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-3 mb-6">
                <p className="text-red-700 dark:text-red-200 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex gap-4 justify-between">
            <Button
              onClick={handleBack}
              variant="outline"
              disabled={currentQuestion === 0 || loading}
            >
              Anterior
            </Button>

            <div className="flex gap-2">
              <Button
                onClick={handleNext}
                disabled={!responses[question.id] || loading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {isLastQuestion ? (
                  loading ? 'Procesando...' : 'Completar Evaluación'
                ) : (
                  'Siguiente'
                )}
              </Button>
            </div>
          </div>
        </Card>

        {/* Tips */}
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-blue-900 dark:text-blue-200 text-sm">
            💡 <strong>Consejo:</strong> Responde con tu primera impresión. No hay respuestas correctas o incorrectas. 
            Esta evaluación refleja tu estilo natural de trabajo y comportamiento.
          </p>
        </div>
      </div>
    </div>
  )
}
