'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Progress } from '@/components/ui/progress'
import { AIAssistant } from '@/components/conozcamonos/ai-assistant'
import { VoiceInput } from '@/components/conozcamonos/voice-input'
import { CONOZCAMONOS_2_QUESTIONS } from '@/lib/conozcamonos-2-questions'

type Step = 'paso1' | 'paso2'
type Answer = string | string[]

interface CompletionPayload {
  success?: boolean
  nextPath?: string
  error?: string
  validation?: { errors?: string[] }
}

export default function Conozcamonos2Page() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('paso1')
  const [responses, setResponses] = useState<Record<number, Answer>>({})
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validatingIds, setValidatingIds] = useState<Set<number>>(new Set())

  const questions = useMemo(
    () => CONOZCAMONOS_2_QUESTIONS.filter((question) => question.section === step),
    [step],
  )
  const completedCount = Object.values(responses).filter((answer) =>
    Array.isArray(answer) ? answer.length > 0 : answer.trim().length > 0,
  ).length
  const progress = Math.round(
    (completedCount / CONOZCAMONOS_2_QUESTIONS.length) * 100,
  )

  const answerPresent = (questionId: number) => {
    const answer = responses[questionId]
    return Array.isArray(answer) ? answer.length > 0 : Boolean(answer?.trim())
  }
  const stepComplete = questions.every((question) => answerPresent(question.id))

  const setAnswer = (questionId: number, answer: Answer) => {
    setResponses((current) => ({ ...current, [questionId]: answer }))
    setError(null)
  }

  const validateText = async (
    questionId: number,
    question: string,
    answer: string,
  ) => {
    const text = answer.trim()
    if (text.length < 10 || text.split(/\s+/).length < 2) {
      setError('Desarrolla un poco más la respuesta antes de continuar.')
      return
    }

    setValidatingIds((current) => new Set(current).add(questionId))
    try {
      const response = await fetch('/api/conozcamonos/validate-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          questionId,
          question,
          response: text,
          questionType: 'text',
        }),
      })
      const payload = (await response.json().catch(() => ({}))) as {
        valid?: boolean
        suggestions?: string
      }
      if (!response.ok || payload.valid === false) {
        setError(payload.suggestions || 'La respuesta necesita más precisión.')
      }
    } catch (validationError) {
      console.error('[v0] C2 text validation error:', validationError)
      setError('No pudimos validar esta respuesta. Intenta nuevamente.')
    } finally {
      setValidatingIds((current) => {
        const next = new Set(current)
        next.delete(questionId)
        return next
      })
    }
  }

  const continueFlow = async () => {
    if (!stepComplete || validatingIds.size > 0) {
      setError('Completa y valida todas las respuestas de este paso.')
      return
    }

    if (step === 'paso1') {
      setStep('paso2')
      setError(null)
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    setSubmitting(true)
    setError(null)
    try {
      const response = await fetch('/api/journey/complete-c2', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ responses }),
      })
      const payload = (await response.json().catch(() => ({}))) as CompletionPayload
      if (!response.ok || !payload.nextPath) {
        const criterion = payload.validation?.errors?.[0]
        throw new Error(
          criterion
            ? `${payload.error || 'Faltan respuestas.'} ${criterion}`
            : payload.error || 'No pudimos completar Conozcámonos 2.',
        )
      }

      router.push(payload.nextPath)
      router.refresh()
    } catch (completionError) {
      console.error('[v0] C2 completion error:', completionError)
      setError(
        completionError instanceof Error
          ? completionError.message
          : 'No pudimos completar Conozcámonos 2.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-white">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-4 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-indigo-300">
            A1 · Conozcámonos 2
          </p>
          <h1 className="text-4xl font-semibold md:text-6xl">
            Completa el contexto de tu diagnóstico
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-white/65">
            Tu perfil cerebral explica cómo funcionas. Estas respuestas agregan tu
            situación, objetivo y evidencia para construir el informe completo de A1.
          </p>
          <Progress value={progress} className="h-3" indicatorColor="rgb(90, 90, 150)" />
          <p className="text-xs text-white/50">
            {completedCount} de {CONOZCAMONOS_2_QUESTIONS.length} respuestas completas
          </p>
        </header>

        <section className="space-y-5">
          {questions.map((question) => {
            const value = responses[question.id]
            const validating = validatingIds.has(question.id)

            return (
              <Card key={question.id} className="space-y-4 border-white/10 bg-white/5 p-6">
                <div>
                  <p className="text-xs uppercase tracking-[0.14em] text-white/40">
                    Pregunta {question.id}
                  </p>
                  <h2 className="mt-2 text-lg font-medium text-white">
                    {question.question}
                  </h2>
                </div>

                {question.type === 'select' && (
                  <select
                    value={typeof value === 'string' ? value : ''}
                    onChange={(event) => setAnswer(question.id, event.target.value)}
                    className="w-full rounded-xl border border-white/15 bg-slate-950 p-3 text-white"
                  >
                    <option value="">Selecciona una opción</option>
                    {question.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                )}

                {question.type === 'checkbox' && (
                  <div className="space-y-3">
                    {question.options?.map((option) => {
                      const selected = Array.isArray(value) ? value : []
                      return (
                        <label key={option} className="flex cursor-pointer items-center gap-3">
                          <Checkbox
                            checked={selected.includes(option)}
                            onCheckedChange={(checked) =>
                              setAnswer(
                                question.id,
                                checked
                                  ? [...selected, option]
                                  : selected.filter((item) => item !== option),
                              )
                            }
                          />
                          <span className="text-white/80">{option}</span>
                        </label>
                      )
                    })}
                  </div>
                )}

                {question.type === 'text' && (
                  <div className="space-y-3">
                    <textarea
                      value={typeof value === 'string' ? value : ''}
                      onChange={(event) => setAnswer(question.id, event.target.value)}
                      onBlur={(event) =>
                        void validateText(
                          question.id,
                          question.question,
                          event.target.value,
                        )
                      }
                      placeholder={question.placeholder}
                      maxLength={question.maxLength}
                      rows={4}
                      disabled={validating || submitting}
                      className="w-full resize-none rounded-xl border border-white/15 bg-slate-950 p-3 text-white placeholder:text-white/30"
                    />
                    <div className="flex flex-wrap items-center gap-3">
                      <VoiceInput
                        onTranscript={(transcript) => {
                          const current = typeof value === 'string' ? value : ''
                          setAnswer(
                            question.id,
                            `${current}${current ? ' ' : ''}${transcript}`,
                          )
                        }}
                        isDisabled={validating || submitting}
                        pillarColor="rgba(90, 90, 150, 0.8)"
                      />
                      <AIAssistant
                        question={question.question}
                        currentResponse={typeof value === 'string' ? value : ''}
                        onUseSuggestion={(suggestion) => setAnswer(question.id, suggestion)}
                        pillarColor="rgba(90, 90, 150, 0.8)"
                      />
                      {validating && (
                        <span className="flex items-center gap-2 text-sm text-indigo-200">
                          <Loader2 className="h-4 w-4 animate-spin" /> Validando
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            )
          })}
        </section>

        {error && (
          <p className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-100">
            {error}
          </p>
        )}

        <footer className="flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-between">
          <Button
            variant="outline"
            disabled={step === 'paso1' || submitting}
            onClick={() => {
              setStep('paso1')
              setError(null)
              window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Atrás
          </Button>
          <Button
            disabled={!stepComplete || submitting || validatingIds.size > 0}
            onClick={() => void continueFlow()}
            className="min-w-48 bg-indigo-600 text-white hover:bg-indigo-500"
          >
            {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {step === 'paso1' ? 'Continuar' : 'Generar informe A1'}
            {!submitting && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </footer>
      </div>
    </main>
  )
}
