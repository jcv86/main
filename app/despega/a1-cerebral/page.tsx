'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { DISC_TEST_QUESTIONS } from '@/lib/disc-test-questions'
import { QuestionProgress } from '@/components/question-progress'
import { useAssessmentDraft } from '@/lib/use-assessment-draft'

type QuestionTiming = {
  questionId: number
  startTime: number
  endTime?: number
  responseTime?: number
}

export default function A1CerebralPage() {
  const [idx, setIdx] = useState(0)
  const [more, setMore] = useState<Record<number, string>>({})
  const [less, setLess] = useState<Record<number, string>>({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [authOk, setAuthOk] = useState(false)
  const [questionTimings, setQuestionTimings] = useState<QuestionTiming[]>([])
  const router = useRouter()
  const sb = createClient()
  const { loadDraft, saveDraft, completeDraft, draftError, savingDraft } = useAssessmentDraft('a1')

  useEffect(() => {
    const check = async () => {
      if (!sb) {
        router.replace('/auth/signin')
        return
      }

      const {
        data: { user },
        error: authError,
      } = await sb.auth.getUser()

      if (authError || !user) {
        router.replace('/auth/signin')
        return
      }

      try {
        const draft = await loadDraft()
        if (draft) {
          const answers = draft.answers as { more?: Record<number, string>; less?: Record<number, string> }
          setMore(answers.more ?? {})
          setLess(answers.less ?? {})
          setQuestionTimings(draft.timings as QuestionTiming[])
          setIdx(draft.currentQuestion)
        }
        setAuthOk(true)
      } catch {
        setError('No pudimos recuperar tu avance. Intenta nuevamente.')
      }
    }

    void check()
  }, [sb, router, loadDraft])

  useEffect(() => {
    setQuestionTimings((previous) => {
      const questionId = DISC_TEST_QUESTIONS[idx].id
      if (previous.some((timing) => timing.questionId === questionId)) {
        return previous
      }
      return [...previous, { questionId, startTime: Date.now() }]
    })
  }, [idx])

  if (!authOk) {
    if (error) {
      return <div className="min-h-screen flex flex-col gap-4 items-center justify-center px-6 text-center"><p>{error}</p><Button onClick={() => window.location.reload()}>Reintentar</Button></div>
    }
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Verificando...</p>
      </div>
    )
  }

  const q = DISC_TEST_QUESTIONS[idx]
  const bothAnswered = Boolean(more[q.id] && less[q.id])
  const isLast = idx === DISC_TEST_QUESTIONS.length - 1
  const questionCode = `A1-CERT-${String(q.id).padStart(3, '0')}`

  const handleNext = async () => {
    if (!bothAnswered) {
      setError('Selecciona ambas opciones')
      return
    }

    if (more[q.id] === less[q.id]) {
      setError('No puedes seleccionar la misma opción para MÁS y MENOS')
      return
    }

    const completedAt = Date.now()
    const currentTiming = questionTimings.find((timing) => timing.questionId === q.id)
    const completedTiming: QuestionTiming = {
      questionId: q.id,
      startTime: currentTiming?.startTime || completedAt,
      endTime: completedAt,
      responseTime: Math.max(
        0,
        Math.round((completedAt - (currentTiming?.startTime || completedAt)) / 1000),
      ),
    }
    const updatedTimings = [
      ...questionTimings.filter((timing) => timing.questionId !== q.id),
      completedTiming,
    ]
    setQuestionTimings(updatedTimings)

    try {
      await saveDraft({
        schemaVersion: 1,
        currentQuestion: isLast ? idx : idx + 1,
        answers: { more, less },
        timings: updatedTimings,
      })
    } catch {
      return
    }

    if (!isLast) {
      setIdx((current) => current + 1)
      return
    }

    setLoading(true)
    setError('')
    try {
      const response = await fetch('/api/a1-cerebral-save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          responses: { more, less },
          response_timings: updatedTimings,
        }),
      })

      const result = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(result.error || 'No pudimos guardar la evaluación.')
      }

      await completeDraft()

      router.push('/despega/a1-report')
      router.refresh()
    } catch (submissionError) {
      console.error('[v0] Test submission error:', submissionError)
      setError(
        `Error al guardar: ${
          submissionError instanceof Error
            ? submissionError.message
            : 'Error desconocido'
        }`,
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div
          style={{
            borderRadius: '2px',
            backgroundColor: 'rgba(80, 160, 170, 0.2)',
            borderStyle: 'none',
            padding: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          <QuestionProgress
            currentQuestion={idx + 1}
            totalQuestions={DISC_TEST_QUESTIONS.length}
            questionCode={questionCode}
            estimatedTimePerQuestion={20}
            showTimeRemaining={true}
          />
        </div>

        <div
          className="bg-card border-2 rounded-2xl p-10 mb-8 shadow-lg"
          style={{
            borderStyle: 'none',
            backgroundColor: 'rgba(80, 160, 170, 0.2)',
            borderRadius: '2px',
          }}
        >
          <div className="mb-10 pb-6 border-b border-purple/20">
            <h2
              className="text-3xl text-white leading-tight"
              style={{ fontWeight: '500' }}
            >
              {q.pregunta}
            </h2>
            <p
              className="mt-3 font-semibold"
              style={{ color: 'rgba(80, 160, 170)', fontWeight: '700' }}
            >
              Instrucción: Selecciona una opción en cada columna
            </p>
          </div>

          {questionTimings.find(
            (timing) => timing.questionId === q.id && timing.responseTime,
          ) && (
            <div className="mb-6 p-4 bg-blue/10 border border-blue/40 rounded-lg text-center">
              <p className="text-sm text-blue font-semibold">
                ⏱️ Tiempo en pregunta anterior:{' '}
                {questionTimings.find(
                  (timing) =>
                    timing.questionId ===
                    DISC_TEST_QUESTIONS[Math.max(0, idx - 1)].id,
                )?.responseTime || 0}
                s
              </p>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-green rounded-full w-10 h-10 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">+</span>
                </div>
                <p className="text-xl font-bold text-green">MÁS como yo</p>
              </div>
              <div className="space-y-3">
                {q.opciones.map((option) => (
                  <button
                    key={`more-${option.texto}`}
                    onClick={() => {
                      setMore((previous) => ({
                        ...previous,
                        [q.id]: option.texto,
                      }))
                      setError('')
                    }}
                    disabled={less[q.id] === option.texto}
                    className={`w-full text-left p-5 rounded-xl border-2 transition-all font-semibold text-base ${
                      more[q.id] === option.texto
                        ? 'border-green bg-green/25 text-white shadow-lg shadow-green/20'
                        : less[q.id] === option.texto
                          ? 'border-muted/20 bg-muted/5 text-white/70 opacity-50 cursor-not-allowed'
                          : 'border-green/40 text-white/90 hover:border-green hover:bg-green/15 hover:text-white'
                    }`}
                  >
                    {option.texto}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-red rounded-full w-10 h-10 flex items-center justify-center">
                  <span className="text-white font-bold text-xl">−</span>
                </div>
                <p className="text-xl font-bold text-red">MENOS como yo</p>
              </div>
              <div className="space-y-3">
                {q.opciones.map((option) => (
                  <button
                    key={`less-${option.texto}`}
                    onClick={() => {
                      setLess((previous) => ({
                        ...previous,
                        [q.id]: option.texto,
                      }))
                      setError('')
                    }}
                    disabled={more[q.id] === option.texto}
                    className={`w-full text-left p-5 rounded-xl border-2 transition-all font-semibold text-base ${
                      less[q.id] === option.texto
                        ? 'border-red bg-red/25 text-white shadow-lg shadow-red/20'
                        : more[q.id] === option.texto
                          ? 'border-muted/20 bg-muted/5 text-white/70 opacity-50 cursor-not-allowed'
                          : 'border-red/40 text-white/90 hover:border-[rgb(80,160,170)] hover:bg-[rgba(80,160,170,0.6)]/15 hover:text-white'
                    }`}
                  >
                    {option.texto}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {(error || draftError) && (
            <div className="mb-6 p-4 bg-red/15 border-2 border-red/40 rounded-lg">
              <p className="text-red font-semibold text-center">{error || draftError}</p>
            </div>
          )}
        </div>

        <div className="flex gap-4" style={{ borderRadius: '30px' }}>
          <Button
            onClick={async () => {
              if (idx <= 0) return
              try {
                await saveDraft({ schemaVersion: 1, currentQuestion: idx - 1, answers: { more, less }, timings: questionTimings })
                setIdx((current) => current - 1)
              } catch {
                return
              }
            }}
            variant="outline"
            disabled={idx === 0 || savingDraft}
            className="flex-1 py-6 text-base font-semibold"
            style={{
              borderRadius: '20px',
              borderColor: 'rgba(80, 160, 170, 0.6)',
              color: 'rgba(80, 160, 170, 0.6)',
              backgroundColor: 'transparent',
              border: '2px solid rgba(80, 160, 170, 0.6)',
            }}
          >
            ← Anterior
          </Button>
          <Button
            onClick={handleNext}
            disabled={!bothAnswered || loading || savingDraft}
            className="flex-1 py-6 text-base font-semibold text-white"
            style={{
              backgroundColor: 'rgba(80, 160, 170, 0.6)',
              borderRadius: '20px',
            }}
          >
            {loading || savingDraft ? 'Guardando...' : isLast ? 'Ver Resultados →' : 'Siguiente →'}
          </Button>
        </div>
      </div>
    </div>
  )
}
