'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { CONOZCAMONOS_1_QUESTIONS } from '@/lib/canon-conozcamonos-1-questions'

export default function Conozcamonos1Page() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const question = CONOZCAMONOS_1_QUESTIONS[currentQuestion]
  const allAnswered = Object.keys(responses).length === CONOZCAMONOS_1_QUESTIONS.length
  const isLastQuestion = currentQuestion === CONOZCAMONOS_1_QUESTIONS.length - 1

  const handleAnswer = (value: string) => {
    setResponses(prev => ({
      ...prev,
      [question.id]: value
    }))
    setError('')
  }

  const handleNext = () => {
    if (!responses[question.id]) {
      setError('Por favor responde esta pregunta')
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
      if (!user) {
        router.push('/login')
        return
      }

      // Save responses to database
      const { error: dbError } = await supabase
        .from('canon_conozcamonos_1_responses')
        .insert({
          user_id: user.id,
          responses: responses,
          completed_at: new Date().toISOString()
        })

      if (dbError) throw dbError

      console.log('[v0] Conozcámonos 1 saved successfully')

      // Redirect to A1 Cerebral Assessment (next step in A1 Origen)
      router.push('/despega/a1-cerebral')
    } catch (err) {
      console.error('[v0] Error saving Conozcámonos 1:', err)
      setError('Error al guardar tus respuestas. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold text-foreground">Conozcámonos 1</h1>
            <span className="text-muted-foreground text-sm">
              Pregunta {currentQuestion + 1} de {CONOZCAMONOS_1_QUESTIONS.length}
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / CONOZCAMONOS_1_QUESTIONS.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-card border border-border rounded-2xl p-8 mb-8">
          <p className="text-muted-foreground text-sm mb-2">Paso 1: Contexto de Transición</p>
          <h2 className="text-2xl font-bold text-foreground mb-6">{question.question}</h2>

          {/* Input based on type */}
          {question.type === 'select' && (
            <div className="space-y-3">
              {question.options?.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(option)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    responses[question.id] === option
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-border/80'
                  }`}
                >
                  <span className="text-foreground">{option}</span>
                </button>
              ))}
            </div>
          )}

          {question.type === 'text' && (
            <textarea
              value={responses[question.id] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              placeholder={question.placeholder}
              maxLength={question.maxLength}
              className="w-full p-4 bg-background border border-border rounded-lg text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none resize-none"
              rows={4}
            />
          )}

          {error && (
            <p className="text-destructive text-sm mt-4">{error}</p>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-4">
          <Button
            onClick={handleBack}
            variant="outline"
            disabled={currentQuestion === 0}
            className="flex-1"
          >
            Atrás
          </Button>
          <Button
            onClick={handleNext}
            disabled={!responses[question.id] || loading}
            className="flex-1"
          >
            {loading ? 'Guardando...' : isLastQuestion ? 'Continuar' : 'Siguiente'}
          </Button>
        </div>
      </div>
    </div>
  )
}
