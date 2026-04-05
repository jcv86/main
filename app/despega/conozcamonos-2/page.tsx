'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Checkbox } from '@/components/ui/checkbox'
import { CONOZCAMONOS_2_QUESTIONS } from '@/lib/conozcamonos-2-questions'
import { createClient } from '@/lib/supabase/client'
import { AIAssistant } from '@/components/conozcamonos/ai-assistant'
import { VoiceInput } from '@/components/conozcamonos/voice-input'

export default function Conozcamonos2Page() {
  const [currentStep, setCurrentStep] = useState<'paso1' | 'paso2'>('paso1')
  const [responses, setResponses] = useState<Record<number, string | string[]>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [validatingIds, setValidatingIds] = useState<Set<number>>(new Set())
  const router = useRouter()
  const supabase = createClient()

  const stepQuestions = CONOZCAMONOS_2_QUESTIONS.filter(q => q.section === currentStep)
  const totalQuestions = CONOZCAMONOS_2_QUESTIONS.length
  const completedCount = Object.keys(responses).length
  const progress = (completedCount / totalQuestions) * 100
  
  // Debug: Check which questions in current step are missing
  const missingQuestions = stepQuestions.filter(q => !responses[q.id])
  const allStepAnswered = stepQuestions.every(q => responses[q.id])
  
  // Log for debugging
  if (missingQuestions.length > 0 && currentStep === 'paso1') {
    console.log('[v0] Missing answers in paso1:', missingQuestions.map(q => q.id))
  }

  const handleAnswer = (questionId: number, value: string | string[]) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }))
    setError('')
  }

  const validateTextResponse = async (questionId: number, question: string, response: string) => {
    const trimmed = response.trim()
    console.log('[v0] Validation triggered:', { questionId, response: trimmed.substring(0, 50), length: trimmed.length })
    
    // Client-side validation first
    if (!trimmed) {
      console.log('[v0] Empty response')
      setError('Por favor, responde esta pregunta')
      return
    }

    // Check for spam patterns BEFORE calling server
    const spamPatterns = [
      /^([a-z])\1{4,}$/i,                    // aaaaa
      /^([a-z]{2,})\1{2,}$/i,                // asasas
      /^([a-z]{3,})\1{1,}$/i,                // abcabc
      /^(\d)\1{4,}$/,                        // 11111
      /^(\d{2,})\1{1,}$/,                    // 1212
    ]
    
    const isSpam = spamPatterns.some(pattern => pattern.test(trimmed))
    console.log('[v0] Spam check:', { isSpam, patterns: spamPatterns.length })
    if (isSpam) {
      console.log('[v0] SPAM DETECTED')
      setError('⚠️ Texto aleatorio detectado. Por favor, proporciona una respuesta genuina.')
      return
    }

    // Check minimum length
    const wordCount = trimmed.split(/\s+/).length
    const charCount = trimmed.length
    console.log('[v0] Length check:', { charCount, wordCount })
    
    if (charCount < 10 || wordCount < 2) {
      console.log('[v0] Too short')
      setError(`Muy corto. ${charCount} caracteres (mín. 10), ${wordCount} palabras (mín. 2)`)
      return
    }

    setValidatingIds(prev => new Set(prev).add(questionId))
    
    try {
      console.log('[v0] Calling validation API for question:', questionId)
      const validationResponse = await fetch('/api/conozcamonos/validate-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId,
          question,
          response: trimmed,
          questionType: 'text'
        })
      })

      const validation = await validationResponse.json()
      console.log('[v0] Validation response:', validation)
      
      if (!validation.valid) {
        setError('❌ ' + (validation.suggestions || 'Respuesta rechazada. Por favor, intenta nuevamente.'))
      } else {
        setError('')
        console.log('[v0] Validation passed!')
      }
    } catch (err) {
      console.error('[v0] Validation error:', err)
      setError('Error validando respuesta')
    } finally {
      setValidatingIds(prev => {
        const updated = new Set(prev)
        updated.delete(questionId)
        return updated
      })
    }
  }

  const handleNext = () => {
    if (!allStepAnswered) {
      setError('Por favor responde todas las preguntas de este paso')
      return
    }

    // Prevent next if there's an active error
    if (error) {
      setError('⚠️ Corrige los errores de validación antes de continuar')
      return
    }

    if (currentStep === 'paso1') {
      setCurrentStep('paso2')
      setError('') // Clear error when moving to next step
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

      // VALIDATE: A1 must be completed before C2
      const { data: a1Data, error: a1Error } = await supabase
        .from('a1_cerebral_assessment')
        .select('disc_profile')
        .eq('user_id', user.id)
        .limit(1)
        .single()

      if (!a1Data?.disc_profile) {
        setError('Debes completar A1: Despega Cerebral antes de continuar.')
        setLoading(false)
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

      console.log('[v0] [CANONICAL] Conozcámonos 2 saved successfully')

      // Mark Conozcámonos-2 as completed in despega_user_profiles with CANONICAL FLAGS
      const { error: profileError } = await supabase
        .from('despega_user_profiles')
        .upsert({
          user_id: user.id,
          onboarding_conozcamonos_2_completed: true,
          onboarding_conozcamonos_2_completed_at: new Date().toISOString(),
          a2_route_generated: true,
          a2_route_generated_at: new Date().toISOString()
        }, { onConflict: 'user_id' })
      
      if (profileError) {
        console.error('[v0] Error updating profile completion:', profileError)
        // Continue anyway - the assessment was saved
      }

      console.log('[v0] [CANONICAL] User profile updated with C2 and A2 route flags')

      // Redirect to A2 routes page to generate 90-day personalized route
      router.push('/despega/a2-routes')
    } catch (err) {
      console.error('[v0] Error saving Conozcamonos 2:', err)
      setError('Error al guardar tus respuestas. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800 p-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Header with brandbook styling */}
        <div className="text-center mb-8">
          <div className="inline-block px-4 py-2 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-full mb-4">
            <p className="text-sm font-semibold text-blue-700 dark:text-blue-300">Conozcámonos 2: Tu Ruta</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-cyan-600 to-teal-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-cyan-400 dark:to-teal-400 mb-2">
            Diseña Tu Ruta de 90 Días
          </h1>
          <p className="text-slate-700 dark:text-slate-300 mb-4">
            {currentStep === 'paso1'
              ? 'Paso 1: Define tu objetivo específico y estrategia'
              : 'Paso 2: Personaliza tu plan de acci��n'}
          </p>
          <Progress value={progress} className="h-2 bg-slate-200 dark:bg-slate-700" />
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 font-medium">
            Progreso: {completedCount} de {totalQuestions} preguntas
          </p>
        </div>

        {/* Questions */}
        <div className="space-y-6 mb-8">
          {stepQuestions.map((question) => {
            const isAnswered = !!responses[question.id]
            return (
            <Card 
              key={question.id} 
              className={`p-6 transition-all ${
                isAnswered 
                  ? 'border-green-200 dark:border-green-800/50' 
                  : 'border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="flex items-start gap-3 mb-4">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white flex-1">
                  {question.question}
                </h3>
                {isAnswered && <span className="text-green-600 dark:text-green-400">✓</span>}
              </div>

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
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <textarea
                      value={responses[question.id] as string || ''}
                      onChange={(e) => handleAnswer(question.id, e.target.value)}
                      onBlur={(e) => validateTextResponse(question.id, question.question, e.target.value)}
                      placeholder={question.placeholder}
                      maxLength={question.maxLength}
                      className={`flex-1 p-3 border rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 resize-none focus:outline-none focus:border-purple-600 disabled:opacity-50 transition-colors ${
                        error && !validatingIds.has(question.id) 
                          ? 'border-red-500 dark:border-red-500 bg-red-50 dark:bg-red-950/20' 
                          : 'border-slate-300 dark:border-slate-600'
                      }`}
                      rows={3}
                      disabled={validatingIds.has(question.id)}
                    />
                  </div>
                  
                  {/* Validation status */}
                  {validatingIds.has(question.id) && (
                    <p className="text-xs text-blue-500 flex items-center gap-1">
                      <span className="animate-spin">⏳</span> Validando...
                    </p>
                  )}
                  
                  {error && !validatingIds.has(question.id) && (
                    <div className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 p-2 rounded border border-red-200 dark:border-red-800">
                      {error}
                    </div>
                  )}
                  
                  {/* Character count */}
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {(responses[question.id] as string || '').length} / {question.maxLength} caracteres
                  </div>
                  
                  <div className="flex gap-2 items-center">
                    <VoiceInput
                      onTranscript={(text) => {
                        handleAnswer(question.id, (responses[question.id] as string || '') + (responses[question.id] ? ' ' : '') + text)
                      }}
                      isDisabled={loading || validatingIds.has(question.id)}
                    />
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      O habla para dictar tu respuesta
                    </span>
                  </div>
                  <AIAssistant
                    question={question.question}
                    currentResponse={responses[question.id] as string || ''}
                    onUseSuggestion={(suggestion) => {
                      handleAnswer(question.id, suggestion)
                    }}
                  />
                </div>
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
            )
          })}
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-700 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-4 justify-between items-center mt-8 pt-6 border-t border-slate-200 dark:border-slate-700">
          {!allStepAnswered && (
            <div className="flex-1 text-sm text-slate-600 dark:text-slate-400">
              <p>Responde todas las preguntas para continuar</p>
            </div>
          )}
          
          {allStepAnswered && (
            <div className="flex-1" />
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleBack}
              disabled={currentStep === 'paso1' || loading}
              className="bg-slate-700 hover:bg-slate-600 text-white font-semibold px-6 py-3 transition-colors"
            >
              ← Atrás
            </Button>

            <Button
              onClick={handleNext}
              disabled={!allStepAnswered || loading || !!error}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold px-8 py-3 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              title={error ? 'Corrige los errores de validación antes de continuar' : ''}
            >
              {loading
                ? 'Procesando...'
                : currentStep === 'paso1'
                ? 'Siguiente →'
                : 'Generar Mi Ruta →'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
