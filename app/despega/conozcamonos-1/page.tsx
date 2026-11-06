'use client'
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSession } from '@/components/session-wrapper'
import { Button } from '@/components/ui/button'
import { CONOZCAMONOS_1_QUESTIONS } from '@/lib/canon-conozcamonos-1-questions'
import { AIAssistant } from '@/components/conozcamonos/ai-assistant'
import { VoiceInput } from '@/components/conozcamonos/voice-input'
import { useV1Analytics } from '@/lib/v1-analytics/use-v1-analytics'
import { useAssessmentDraft } from '@/lib/use-assessment-draft'
import { C1_TEXT_LIMIT, c1TextLimitError, restoreC1DraftAnswers, serializeC1DraftAnswers,
  type C1Responses, type C1CustomResponses } from '@/lib/c1-responses'
import { C1_COMPLETION_ERRORS, C1_SIGN_IN_PATH, asC1CompletionError, completeC1,
  loadC1CompletionStatus, type C1CompletionErrorCode } from '@/lib/c1-completion'

export default function Conozcamonos1Page() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<C1Responses>({})
  const [customResponses, setCustomResponses] = useState<C1CustomResponses>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [authChecked, setAuthChecked] = useState(false)
  const [validating, setValidating] = useState(false)
  const [loadAttempt, setLoadAttempt] = useState(0)
  const [draftUpdatedAt, setDraftUpdatedAt] = useState<string | null>(null)
  const [completionFailure, setCompletionFailure] = useState<C1CompletionErrorCode | null>(null)
  const [loadedOwnerId, setLoadedOwnerId] = useState<string | null>(null)
  const transitionInFlight = useRef(false)
  const operationEpoch = useRef(0)
  const ownerIdRef = useRef<string | null>(null)
  const loadedAttemptRef = useRef<number | null>(null)
  const { user: sessionUser, isLoading: sessionLoading } = useSession()
  const sessionUserId = sessionUser?.id ?? null
  const router = useRouter()
  const { trackEvent, trackPageView } = useV1Analytics()
  const { saveDraft, draftError, savingDraft, clearDraftError } = useAssessmentDraft('c1', loadedOwnerId)

  // Track C1 page entry
  useEffect(() => {
    trackPageView()
    trackEvent('c1_started', { questionIndex: 0 })
  }, [trackEvent, trackPageView])

  useEffect(() => {
    let active = true
    const epoch = ++operationEpoch.current
    const restoreProgress = async () => {
      transitionInFlight.current = false
      setLoading(false)
      setValidating(false)
      if (sessionLoading) { setAuthChecked(false); return }

      if (ownerIdRef.current && sessionUserId === null && loadedAttemptRef.current === loadAttempt) {
        // An expired session can be renewed in another tab without losing text.
        setError(C1_COMPLETION_ERRORS.authentication_required.message)
        setCompletionFailure('authentication_required')
        setAuthChecked(true)
        return
      }
      if (ownerIdRef.current && sessionUserId === ownerIdRef.current && loadedAttemptRef.current === loadAttempt) {
        setError('')
        setCompletionFailure(null)
        setAuthChecked(true)
        return
      }
      if (ownerIdRef.current && sessionUserId && sessionUserId !== ownerIdRef.current) {
        ownerIdRef.current = null
        loadedAttemptRef.current = null
        setLoadedOwnerId(null)
        setResponses({})
        setCustomResponses({})
        setCurrentQuestion(0)
        setDraftUpdatedAt(null)
        clearDraftError()
      }
      setAuthChecked(false)
      loadedAttemptRef.current = null
      setError('')
      setCompletionFailure(null)
      try {
        const status = await loadC1CompletionStatus()
        if (!active || operationEpoch.current !== epoch) return
        ownerIdRef.current = status.userId
        setLoadedOwnerId(status.userId)
        if (status.state === 'completed') {
          router.replace(status.nextPath)
          router.refresh()
          return
        }

        if (status.draft) {
          const restored = restoreC1DraftAnswers(status.draft.answers)
          setResponses(restored.responses)
          setCustomResponses(restored.customResponses)
          setCurrentQuestion(status.draft.currentQuestion)
          setDraftUpdatedAt(status.draft.updatedAt!)
        } else if (status.state === 'not_started') {
          setResponses({})
          setCustomResponses({})
          setCurrentQuestion(0)
          setDraftUpdatedAt(null)
        }
        if (status.state === 'recovery_required') {
          setError(C1_COMPLETION_ERRORS.recovery_required.message)
          setCompletionFailure('recovery_required')
          if (!status.draft) return
        }

        loadedAttemptRef.current = loadAttempt
        setAuthChecked(true)
      } catch (err) {
        if (!active || operationEpoch.current !== epoch) return
        const failure = asC1CompletionError(err)
        if (failure.code === 'authentication_required') {
          router.replace(C1_SIGN_IN_PATH)
          return
        }
        setError(failure.code === 'completion_unavailable'
          ? 'No pudimos recuperar tu avance. Reintenta para consultar la versión guardada.'
          : failure.message)
        setCompletionFailure(failure.code)
      }
    }
    void restoreProgress()
    return () => { active = false; operationEpoch.current++ }
  }, [router, loadAttempt, sessionUserId, sessionLoading])

  if (!authChecked || (loadedOwnerId && sessionUserId && loadedOwnerId !== sessionUserId)) {
    if (error) {
      return <div className="min-h-screen flex flex-col gap-4 items-center justify-center px-6 text-center">
        <p role="alert">{error}</p>
        <Button className="bg-indigo-700 text-white hover:bg-indigo-600" onClick={() => setLoadAttempt(value => value + 1)}>Reintentar</Button>
        {completionFailure === 'access_required' && (
          <Link href={C1_SIGN_IN_PATH} className="underline underline-offset-4">Ingresar con otra cuenta</Link>
        )}
      </div>
    }
    return <div className="min-h-screen flex items-center justify-center"><p>Verificando...</p></div>
  }

  const question = CONOZCAMONOS_1_QUESTIONS[currentQuestion]
  const isLastQuestion = currentQuestion === CONOZCAMONOS_1_QUESTIONS.length - 1
  const isCurrentOperation = (epoch: number, ownerId: string) =>
    operationEpoch.current === epoch && ownerIdRef.current === ownerId

  const handleAnswer = (value: string) => {
    if (transitionInFlight.current || !loadedOwnerId || ownerIdRef.current !== loadedOwnerId) return
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
    setCompletionFailure(null)
  }

  const handleCustomText = (value: string) => {
    if (transitionInFlight.current || !loadedOwnerId || ownerIdRef.current !== loadedOwnerId) return
    setCustomResponses(prev => ({ ...prev, [question.id]: value }))
    setError('')
    setCompletionFailure(null)
  }

  const isAnswered = () => {
    const response = responses[question.id]
    if (question.type === 'select') {
      return Array.isArray(response) && response.length > 0
    }
    return Boolean(response && String(response).trim())
  }

  const handleNext = async () => {
    if (transitionInFlight.current || !loadedOwnerId || ownerIdRef.current !== loadedOwnerId) return
    const epoch = operationEpoch.current, ownerId = loadedOwnerId
    if (!isAnswered()) { 
      setError('Necesito entender mejor tu contexto. Amplía un poco más tu respuesta.')
      trackEvent('c1_error_empty', { questionIndex: currentQuestion })
      return 
    }
    const lengthError = c1TextLimitError(responses, customResponses)
    if (lengthError) { setError(lengthError); return }
    transitionInFlight.current = true
    try {
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
          if (!isCurrentOperation(epoch, ownerId)) return

          if (!validation.valid) {
            setError(validation.suggestions || 'Respuesta muy corta. Desarrolla más.')
            setValidating(false)
            return
          }
        } catch (err) {
          if (isCurrentOperation(epoch, ownerId)) console.error('[v0] Validation error:', err)
        } finally {
          if (isCurrentOperation(epoch, ownerId)) setValidating(false)
        }
      }

      if (!isCurrentOperation(epoch, ownerId)) return
      if (isLastQuestion) {
        await submitResponses(epoch, ownerId)
        return
      }

      try {
        const updatedAt = await saveDraft({ schemaVersion: 1, currentQuestion: currentQuestion + 1,
          answers: serializeC1DraftAnswers(responses, customResponses), timings: [] })
        if (!isCurrentOperation(epoch, ownerId)) return
        setDraftUpdatedAt(updatedAt)
      } catch (err) {
        const failure = asC1CompletionError(err)
        if (isCurrentOperation(epoch, ownerId) && ['session_changed', 'authentication_required'].includes(failure.code)) {
          setError(failure.message)
          setCompletionFailure(failure.code)
        }
        return
      }
      setCurrentQuestion(prev => prev + 1)
      setError('')
      setCompletionFailure(null)
    } finally {
      if (isCurrentOperation(epoch, ownerId)) transitionInFlight.current = false
    }
  }

  const handleBack = async () => {
    if (currentQuestion <= 0 || transitionInFlight.current || !loadedOwnerId || ownerIdRef.current !== loadedOwnerId) return
    const epoch = operationEpoch.current, ownerId = loadedOwnerId
    const lengthError = c1TextLimitError(responses, customResponses)
    if (lengthError) { setError(lengthError); return }
    transitionInFlight.current = true
    try {
      const updatedAt = await saveDraft({ schemaVersion: 1, currentQuestion: currentQuestion - 1,
        answers: serializeC1DraftAnswers(responses, customResponses), timings: [] })
      if (!isCurrentOperation(epoch, ownerId)) return
      setDraftUpdatedAt(updatedAt)
      setCurrentQuestion(prev => prev - 1)
      setError('')
      setCompletionFailure(null)
    } catch (err) {
      const failure = asC1CompletionError(err)
      if (isCurrentOperation(epoch, ownerId) && ['session_changed', 'authentication_required'].includes(failure.code)) {
        setError(failure.message)
        setCompletionFailure(failure.code)
      }
      return
    } finally {
      if (isCurrentOperation(epoch, ownerId)) transitionInFlight.current = false
    }
  }

  const submitResponses = async (epoch: number, ownerId: string) => {
    setLoading(true)
    setError('')
    setCompletionFailure(null)
    clearDraftError()
    let navigating = false
    try {
      const completion = await completeC1({ schemaVersion: 1,
        answers: serializeC1DraftAnswers(responses, customResponses), expectedDraftUpdatedAt: draftUpdatedAt }, ownerId)
      if (!isCurrentOperation(epoch, ownerId)) return
      trackEvent('c1_completed')
      router.replace(completion.nextPath)
      router.refresh()
      navigating = true
    } catch (err) {
      if (!isCurrentOperation(epoch, ownerId)) return
      const failure = asC1CompletionError(err)
      trackEvent('c1_error_save', { errorType: failure.code })
      setError(failure.message)
      setCompletionFailure(failure.code)
    } finally {
      if (!navigating && isCurrentOperation(epoch, ownerId)) setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-2xl">
        <div className="mb-8">
          <div 
            className="inline-flex items-center gap-2 px-4 py-3 mb-4"
            style={{ 
              backgroundColor: 'rgba(80, 160, 170, 0.2)',
              borderRadius: '20px'
            }}
          >
            <span style={{ color: 'rgb(80, 160, 170)' }}>●</span>
            <p className="text-base" style={{ color: 'rgb(80, 160, 170)', fontWeight: 400 }}>El Ritual: Quién Eres Ahora</p>
          </div>
          <h1 
            className="text-5xl md:text-6xl text-white mb-4 leading-tight"
            style={{ fontWeight: 300 }}
          >
            Antes de Empezar, Cuéntame Tu Historia
          </h1>
          <p className="text-xl font-medium leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Entiendo tu contexto para que lo que viene después tenga sentido para ti</p>
        </div>

        <fieldset
          key={question.id}
          disabled={loading || validating || savingDraft}
          aria-busy={loading || validating || savingDraft}
          aria-labelledby="c1-question"
          className="min-w-0 bg-white dark:bg-background p-8 mb-8 shadow-lg"
          style={{ 
            border: '2px solid rgba(80, 160, 170, 0.4)',
            borderRadius: '2px'
          }}
        >
          <h2 id="c1-question" className="text-2xl text-muted/90 dark:text-white mb-6" style={{ fontWeight: 500 }}>{question.question}</h2>

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
                      aria-pressed={isSelected}
                      className="w-full text-left p-4 border-2 transition-all"
                      style={{
                        borderRadius: '28px',
                        borderColor: isSelected ? 'rgba(80, 160, 170, 0.6)' : 'var(--border)',
                        backgroundColor: isSelected ? 'rgba(80, 160, 170, 0.1)' : 'transparent'
                      }}
                    >
                      {option}
                    </button>
                    
                    {/* Show text input for "Otro" option */}
                    {option === 'Otro' && isSelected && (
                      <div className="space-y-3 p-3 bg-muted/5 dark:bg-background rounded-[28px] border border-muted/20 dark:border-card">
                        <label htmlFor={`c1-other-${question.id}`} className="text-sm font-medium">Especifica tu respuesta</label>
                        <textarea
                          id={`c1-other-${question.id}`}
                          value={customResponses[question.id] || ''}
                          onChange={(e) => handleCustomText(e.target.value)}
                          placeholder="Especifica tu respuesta..."
                          className="w-full p-3 bg-background border border-border rounded-lg text-foreground text-sm"
                          rows={3}
                          maxLength={C1_TEXT_LIMIT}
                          aria-describedby={`c1-other-limit-${question.id}`}
                        />
                        <p id={`c1-other-limit-${question.id}`} className="text-xs text-muted-foreground">
                          {(customResponses[question.id] || '').length}/{C1_TEXT_LIMIT} caracteres
                        </p>
                        
                        <div className="flex gap-2 items-center flex-wrap">
                          <VoiceInput
                            onTranscript={(text) => {
                              const current = customResponses[question.id] || ''
                              handleCustomText(current + (current ? ' ' : '') + text)
                            }}
                            isDisabled={loading || validating || savingDraft}
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
                  aria-labelledby="c1-question"
                  value={responses[question.id] || ''}
                  onChange={(e) => handleAnswer(e.target.value)}
                  className="flex-1 p-4 bg-background border border-border text-foreground"
                  style={{ borderRadius: '2px' }}
                  rows={4}
                  maxLength={C1_TEXT_LIMIT}
                  placeholder="Escribe tu respuesta aquí o usa el micrófono..."
                />
              </div>
              <div className="flex gap-2 items-center">
                <VoiceInput
                  onTranscript={(text) => {
                    handleAnswer((responses[question.id] || '') + (responses[question.id] ? ' ' : '') + text)
                  }}
                  isDisabled={loading || validating || savingDraft}
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

          {(error || draftError) && (
            <div role="alert" className="mt-4 p-4 bg-red/15 dark:bg-red/20 border border-red/40 dark:border-red/50 rounded-lg">
              <p className="text-sm font-semibold text-red dark:text-red">{error || draftError}</p>
              {completionFailure === 'authentication_required' && (
                <Link href={C1_SIGN_IN_PATH} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm underline underline-offset-4">
                  Volver a ingresar en otra pestaña
                </Link>
              )}
              {completionFailure && ['draft_changed', 'completion_conflict', 'recovery_required', 'session_changed'].includes(completionFailure) && (
                <Button type="button" variant="outline" className="mt-3 whitespace-normal" onClick={() => setLoadAttempt(value => value + 1)}>
                  Recargar la versión guardada
                </Button>
              )}
            </div>
          )}
        </fieldset>

        <div className="flex gap-4">
          <Button onClick={handleBack} variant="outline" disabled={currentQuestion === 0 || savingDraft || loading || validating} className="flex-1" style={{ borderRadius: '20px' }}>Atrás</Button>
          <Button 
            onClick={handleNext} 
            disabled={!isAnswered() || loading || validating || savingDraft}
            className="flex-1"
            style={{
              backgroundColor: 'rgba(80, 160, 170, 0.6)',
              borderRadius: '20px'
            }}
          >
            {validating ? 'Validando...' : loading || savingDraft ? 'Guardando...' : isLastQuestion ? 'Continuar' : 'Siguiente'}
          </Button>
        </div>
      </div>
    </div>
  )
}
