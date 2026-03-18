'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { CONOZCAMONOS_1_QUESTIONS } from '@/lib/canon-conozcamonos-1-questions'

export default function Conozcamonos1Page() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [authChecked, setAuthChecked] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/signin'); return }
      setAuthChecked(true)
    }
    checkAuth()
  }, [supabase, router])

  if (!authChecked) {
    return <div className="min-h-screen flex items-center justify-center"><p>Verificando...</p></div>
  }

  const question = CONOZCAMONOS_1_QUESTIONS[currentQuestion]
  const isLastQuestion = currentQuestion === CONOZCAMONOS_1_QUESTIONS.length - 1

  const handleAnswer = (value: string) => {
    setResponses(prev => ({ ...prev, [question.id]: value }))
    setError('')
  }

  const handleNext = () => {
    if (!responses[question.id]) { setError('Responde primero'); return }
    if (isLastQuestion) { submitResponses() } 
    else { setCurrentQuestion(prev => prev + 1) }
  }

  const handleBack = () => {
    if (currentQuestion > 0) setCurrentQuestion(prev => prev - 1)
  }

  const submitResponses = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/signin'); return }

      const { error: dbError } = await supabase
        .from('canon_conozcamonos_1_responses')
        .insert({ user_id: user.id, responses, completed_at: new Date().toISOString() })

      if (dbError) throw dbError
      router.push('/despega/a1-cerebral')
    } catch (err) {
      console.error('[v0] Error:', err)
      setError('Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Conozcámonos 1</h1>
          <p className="text-sm text-muted-foreground">Pregunta {currentQuestion + 1} de {CONOZCAMONOS_1_QUESTIONS.length}</p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">{question.question}</h2>

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
                  {option}
                </button>
              ))}
            </div>
          )}

          {question.type === 'text' && (
            <textarea
              value={responses[question.id] || ''}
              onChange={(e) => handleAnswer(e.target.value)}
              className="w-full p-4 bg-background border border-border rounded-lg text-foreground"
              rows={4}
            />
          )}

          {error && <p className="text-destructive text-sm mt-4">{error}</p>}
        </div>

        <div className="flex gap-4">
          <Button onClick={handleBack} variant="outline" disabled={currentQuestion === 0} className="flex-1">Atrás</Button>
          <Button onClick={handleNext} disabled={!responses[question.id] || loading} className="flex-1">
            {loading ? 'Guardando...' : isLastQuestion ? 'Continuar' : 'Siguiente'}
          </Button>
        </div>
      </div>
    </div>
  )
}
