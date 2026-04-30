'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { CONOZCAMONOS_1_QUESTIONS } from '@/lib/canon-conozcamonos-1-questions'
import { AIAssistant } from '@/components/conozcamonos/ai-assistant'
import { VoiceInput } from '@/components/conozcamonos/voice-input'
import { useV1Analytics } from '@/lib/v1-analytics/use-v1-analytics'

type ResponseValue = string | string[]

export default function Conozcamonos1Page() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<Record<number, ResponseValue>>({})
  const [customResponses, setCustomResponses] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [authChecked, setAuthChecked] = useState(false)
  const [validating, setValidating] = useState(false)
  const [validationError, setValidationError] = useState('')
  const [validationSuggestions, setValidationSuggestions] = useState('')
  const router = useRouter()
  const supabase = createClient()
  const { trackEvent } = useV1Analytics()

  // Track C1 page entry
  useEffect(() => {
    trackEvent('c1_started', { questionIndex: 0 })
  }, [trackEvent])

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser()
        console.log('[v0] conozcamonos-1 auth check - user:', user?.email, 'error:', error?.message)
        
        if (error) {
          console.log('[v0] Auth error in conozcamonos-1:', error.message)
          router.push('/auth/signin')
          return
        }
        
        if (!user) {
          console.log('[v0] No user found in conozcamonos-1, redirecting to signin')
          router.push('/auth/signin')
          return
        }
        
        console.log('[v0] User authenticated in conozcamonos-1:', user.email)
        setAuthChecked(true)
      } catch (err) {
        console.error('[v0] Auth check exception:', err)
        router.push('/auth/signin')
      }
    }
    checkAuth()
  }, [supabase, router])

  if (!authChecked) {
    return <div className="min-h-screen flex items-center justify-center"><p>Verificando...</p></div>
  }

  const question = CONOZCAMONOS_1_QUESTIONS[currentQuestion]
  const isLastQuestion = currentQuestion === CONOZCAMONOS_1_QUESTIONS.length - 1

  const handleAnswer = (value: string) => {
    if (question.type === 'select') {
      // For select: allow multiple selections
      const current = Array.isArray(responses[question.id]) 
        ? responses[question.id] as string[]
        : []
      
      if (current.includes(value)) {
        // Remove if already selected
        setResponses(prev => ({ 
          ...prev, 
          [question.id]: current.filter(v => v !== value)
        }))
      } else {
        // Add to selection
        setResponses(prev => ({ 
          ...prev, 
          [question.id]: [...current, value]
        }))
      }
    } else {
      // For text: single value
      setResponses(prev => ({ ...prev, [question.id]: value }))
    }
    setError('')
  }

  const handleCustomText = (value: string) => {
    setCustomResponses(prev => ({ ...prev, [question.id]: value }))
  }

  const isAnswered = () => {
    const response = responses[question.id]
    if (question.type === 'select') {
      return Array.isArray(response) && response.length > 0
    }
    return Boolean(response && String(response).trim())
  }

  const shouldShowError = () => {
    // Only show validation errors for text fields, not for select
    return question.type === 'text' && error
  }

  const handleNext = async () => {
    if (!isAnswered()) { 
      setError('Necesito entender mejor tu contexto. Amplía un poco más tu respuesta.')
      trackEvent('c1_error_empty', { questionIndex: currentQuestion })
      return 
    }
    trackEvent('c1_response_submitted', { questionIndex: currentQuestion })

    // Only validate text fields
    if (question.type === 'text') {
      setValidating(true)
      setError('')
      
      try {
        const validationResponse = await fetch('/api/conozcamonos/validate-response', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            questionId: question.id,
            question: question.question,
            response: responses[question.id],
            questionType: question.type
          })
        })

        const validation = await validationResponse.json()

        if (!validation.valid) {
          setError(validation.suggestions || 'Respuesta muy corta. Desarrolla más.')
          setValidating(false)
          return
        }
      } catch (err) {
        console.error('[v0] Validation error:', err)
      } finally {
        setValidating(false)
      }
    }

    // Move to next or submit
    if (isLastQuestion) { 
      submitResponses() 
    } else { 
      setCurrentQuestion(prev => prev + 1)
      setError('')
    }
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
      
      // Mark Conozcámonos-1 as completed in despega_user_profiles (CANONICAL FLAG)
      const { error: profileError } = await supabase
        .from('despega_user_profiles')
        .upsert({
          user_id: user.id,
          onboarding_conozcamonos_1_completed: true,
          onboarding_conozcamonos_1_completed_at: new Date().toISOString()
        }, { onConflict: 'user_id' })
      
      if (profileError) {
        console.error('[v0] Error updating profile completion:', profileError)
        // Continue anyway - the assessment was saved
      }
      console.log('[v0] [CANONICAL] C1 completed, redirecting to A1 intro')
      console.log('[v0] User context capture complete → Next: Descubrir cómo funcionas (A1 Cerebral)')
      trackEvent('c1_completed', { totalQuestions: CONOZCAMONOS_1_QUESTIONS.length })
      router.push('/despega/a1-cerebral-intro')
    } catch (err) {
      console.error('[v0] Error:', err)
      trackEvent('c1_error_save', { errorType: err instanceof Error ? err.message : 'unknown' })
      setError('No pudimos guardar tus respuestas. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-3 bg-purple/10 border border-purple/30 rounded-lg mb-4">
            <span className="text-purple font-bold">●</span>
            <p className="text-base font-bold text-purple">El Ritual: Paso 1 - Conocámonos</p>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 leading-tight">
            Antes de Empezar, Cuéntame Tu Historia
          </h1>
          <p className="text-xl text-white/90 font-medium leading-relaxed">Entiendo tu contexto para que lo que viene después tenga sentido para ti</p>
        </div>

        <div className="bg-white dark:bg-background border-2 border-purple/30 dark:border-purple/50 rounded-2xl p-8 mb-8 shadow-lg">
          <h2 className="text-2xl font-bold text-muted/90 dark:text-white mb-6">{question.question}</h2>

          {question.type === 'select' && (
            <div className="space-y-3">
              {question.options?.map((option) => {
                const isSelected = Array.isArray(responses[question.id]) 
                  ? (responses[question.id] as string[]).includes(option)
                  : false
                  
                return (
                  <div key={option} className="space-y-2">
                    <button
                      onClick={() => handleAnswer(option)}
                      className={`w-full text-left p-4 rounded-[28px] border-2 transition-all ${
                        isSelected
                          ? 'border-purple bg-purple/10'
                          : 'border-border hover:border-border/80'
                      }`}
                    >
                      {option}
                    </button>
                    
                    {/* Show text input for "Otro" option */}
                    {option === 'Otro' && isSelected && (
                      <div className="space-y-3 p-3 bg-muted/5 dark:bg-background rounded-[28px] border border-muted/20 dark:border-card">
                        <textarea
                          value={customResponses[question.id] || ''}
                          onChange={(e) => handleCustomText(e.target.value)}
                          placeholder="Especifica tu respuesta..."
                          className="w-full p-3 bg-background border border-border rounded-lg text-foreground text-sm"
                          rows={3}
                        />
                        
                        <div className="flex gap-2 items-center flex-wrap">
                          <VoiceInput
                            onTranscript={(text) => {
                              const current = customResponses[question.id] || ''
                              handleCustomText(current + (current ? ' ' : '') + text)
                            }}
                            isDisabled={loading || validating}
                          />
                          <span className="text-xs text-muted-foreground dark:text-muted-foreground">
                            O habla para dictar
                          </span>
                        </div>
                        
                        <AIAssistant
                          question={question.question}
                          currentResponse={customResponses[question.id] || ''}
                          onUseSuggestion={(suggestion) => {
                            handleCustomText(suggestion)
                          }}
                          buttonLabel="Asistencia Tu Coach"
                          title="Tu Coach IA"
                        />
                      </div>
                    )}
                  </div>
                )
              })}
              <p className="text-xs text-muted-foreground mt-2">Puedes seleccionar múltiples opciones</p>
            </div>
          )}

          {question.type === 'text' && (
            <div className="space-y-3">
              <div className="flex gap-2">
                <textarea
                  value={responses[question.id] || ''}
                  onChange={(e) => handleAnswer(e.target.value)}
                  className="flex-1 p-4 bg-background border border-border rounded-lg text-foreground"
                  rows={4}
                  placeholder="Escribe tu respuesta aquí o usa el micrófono..."
                />
              </div>
              <div className="flex gap-2 items-center">
                <VoiceInput
                  onTranscript={(text) => {
                    handleAnswer((responses[question.id] || '') + (responses[question.id] ? ' ' : '') + text)
                  }}
                  isDisabled={loading || validating}
                />
                <span className="text-xs text-muted-foreground dark:text-muted-foreground">
                  O habla para dictar tu respuesta
                </span>
              </div>
              <AIAssistant
                question={question.question}
                currentResponse={(typeof responses[question.id] === 'string' ? (responses[question.id] as string) : '') || ''}
                onUseSuggestion={(suggestion) => {
                  handleAnswer(suggestion)
                }}
                buttonLabel="Asistencia Tu Coach"
                title="Tu Coach IA"
              />
            </div>
          )}

          {error && (
            <div className="mt-4 p-4 bg-red/15 dark:bg-red/20 border border-red/40 dark:border-red/50 rounded-lg">
              <p className="text-sm font-semibold text-red dark:text-red">{error}</p>
            </div>
          )}
        </div>

        <div className="flex gap-4">
          <Button onClick={handleBack} variant="outline" disabled={currentQuestion === 0} className="flex-1">Atrás</Button>
          <Button onClick={handleNext} disabled={!isAnswered() || loading || validating} className="flex-1">
            {validating ? 'Validando...' : loading ? 'Guardando...' : isLastQuestion ? 'Continuar' : 'Siguiente'}
          </Button>
        </div>
      </div>
    </div>
  )
}
