'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AlertCircle, CheckCircle2, ChevronRight, Mic, MicOff, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CameraMicrophoneTest } from '@/components/camera-microphone-test'
import { useSpeechRecognition } from '@/lib/hooks/use-speech-recognition'
import { completeA3Module } from '@/lib/a3/client-completion'
import { getA3ModuleByNumber, type A3ModuleId } from '@/lib/a3/module-catalog'

export interface VerifiedCoachQuestion {
  id: string
  question: string
  guidance: string
  prompts?: string[]
}

interface VerifiedCoachSessionProps {
  moduleId: A3ModuleId
  moduleNumber: number
  title: string
  questions: VerifiedCoachQuestion[]
  buildDeliverable: (responses: string[]) => Record<string, string>
}

export function VerifiedCoachSession({
  moduleId,
  moduleNumber,
  title,
  questions,
  buildDeliverable,
}: VerifiedCoachSessionProps) {
  const router = useRouter()
  const checkpointDay = getA3ModuleByNumber(moduleNumber)?.checkpointDay
  const [showDeviceTest, setShowDeviceTest] = useState(true)
  const [textMode, setTextMode] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answer, setAnswer] = useState('')
  const [responses, setResponses] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [completed, setCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const [bestScore, setBestScore] = useState(0)
  const [xpAwarded, setXpAwarded] = useState(0)
  const [firstCompletion, setFirstCompletion] = useState(false)

  const {
    isListening,
    isSupported,
    transcript,
    isFinal,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition({
    language: 'es-ES',
    continuous: false,
    interimResults: false,
    silenceTimeout: 2000,
  })
  const lastTranscript = useRef('')

  useEffect(() => {
    if (transcript && isFinal && transcript !== lastTranscript.current) {
      lastTranscript.current = transcript
      setAnswer(transcript)
      resetTranscript()
    }
  }, [isFinal, resetTranscript, transcript])

  const beginSession = (devicesPassed: boolean) => {
    setShowDeviceTest(false)
    setTextMode(!devicesPassed)
    setError(null)
  }

  const resetSession = () => {
    setCurrentQuestion(0)
    setAnswer('')
    setResponses([])
    setCompleted(false)
    setError(null)
    setScore(0)
    setBestScore(0)
    setXpAwarded(0)
    setFirstCompletion(false)
    lastTranscript.current = ''
    resetTranscript()
  }

  const submitAnswer = async () => {
    const normalized = answer.trim()
    if (normalized.length < 20 || submitting) {
      setError('Desarrolla tu respuesta con al menos 20 caracteres.')
      return
    }

    const nextResponses = [...responses, normalized]
    setError(null)

    if (currentQuestion < questions.length - 1) {
      setResponses(nextResponses)
      setCurrentQuestion((question) => question + 1)
      setAnswer('')
      lastTranscript.current = ''
      resetTranscript()
      return
    }

    setSubmitting(true)
    try {
      const result = await completeA3Module({
        moduleId,
        moduleNumber,
        responses: nextResponses,
        deliverable: buildDeliverable(nextResponses),
      })
      setResponses(nextResponses)
      setScore(Number(result.score) || 0)
      setBestScore(Number(result.bestScore) || Number(result.score) || 0)
      setXpAwarded(Number(result.xpAwarded) || 0)
      setFirstCompletion(Boolean(result.isFirstCompletion))
      setCompleted(true)
    } catch (completionError) {
      setError(
        completionError instanceof Error
          ? completionError.message
          : 'No pudimos completar el entrenamiento.',
      )
    } finally {
      setSubmitting(false)
    }
  }

  if (showDeviceTest) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black/95">
        <CameraMicrophoneTest
          isOpen
          onClose={() => beginSession(false)}
          onTestComplete={beginSession}
          interviewType="Coach"
        />
      </div>
    )
  }

  if (completed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black/95 p-6 text-white">
        <div className="w-full max-w-xl space-y-6 text-center">
          <CheckCircle2 className="mx-auto h-16 w-16 text-fuchsia-400" />
          <div>
            <p className="text-sm uppercase tracking-[0.18em] text-fuchsia-300">
              Entrenamiento verificado
            </p>
            <h1 className="mt-2 text-3xl font-semibold">{title}</h1>
            <p className="mt-3 text-slate-400">
              Puntaje de esta sesión: {score}/100 · Mejor puntaje: {bestScore}/100
            </p>
            <p className="mt-2 text-sm text-slate-500">
              {firstCompletion && xpAwarded > 0
                ? `+${xpAwarded} XP registrados en tu primera finalización.`
                : 'La repetición quedó registrada sin duplicar XP.'}
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Button variant="outline" onClick={resetSession}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Repetir módulo
            </Button>
            <Button
              onClick={() => router.push(
                checkpointDay ? `/despega/a2/dia-${checkpointDay}` : '/despega/a3',
              )}
            >
              {checkpointDay
                ? `Volver al checkpoint del Día ${checkpointDay}`
                : 'Volver a Entrenamiento'}
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const question = questions[currentQuestion]
  const progress = Math.round((currentQuestion / questions.length) * 100)

  return (
    <div className="min-h-screen bg-black/95 p-5 text-white md:p-8">
      <div className="mx-auto max-w-5xl space-y-6">
        <header className="space-y-2">
          <p className="text-sm uppercase tracking-[0.18em] text-fuchsia-300">
            Entrenamiento · Módulo {moduleNumber}
          </p>
          <h1 className="text-3xl font-semibold">{title}</h1>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-500 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-sm text-slate-500">
            Pregunta {currentQuestion + 1} de {questions.length}
            {textMode ? ' · Modo texto' : ' · Voz o texto'}
          </p>
        </header>

        {error && (
          <div className="flex gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">
            <AlertCircle className="mt-0.5 h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
          <Card className="border-fuchsia-500/25 bg-fuchsia-500/10 p-6 text-white">
            <p className="text-xs uppercase tracking-[0.18em] text-fuchsia-300">
              Pregunta
            </p>
            <p className="mt-3 text-lg leading-relaxed">{question.question}</p>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              {question.guidance}
            </p>
            {question.prompts && question.prompts.length > 0 && (
              <ul className="mt-5 space-y-2 text-sm text-slate-300">
                {question.prompts.map((prompt) => (
                  <li key={prompt}>• {prompt}</li>
                ))}
              </ul>
            )}
          </Card>

          <section className="space-y-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-5">
            <textarea
              value={answer}
              onChange={(event) => setAnswer(event.target.value)}
              rows={10}
              placeholder="Desarrolla tu respuesta con contexto, una decisión y evidencia concreta…"
              className="w-full resize-none rounded-xl border border-white/10 bg-black/35 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-cyan-500/50"
            />
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className={`text-xs ${answer.trim().length >= 20 ? 'text-emerald-300' : 'text-slate-500'}`}>
                {answer.trim().length} caracteres · mínimo 20
              </span>
              {isSupported && !textMode && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={isListening ? stopListening : startListening}
                >
                  {isListening ? (
                    <MicOff className="mr-2 h-4 w-4" />
                  ) : (
                    <Mic className="mr-2 h-4 w-4" />
                  )}
                  {isListening ? 'Detener grabación' : 'Responder con voz'}
                </Button>
              )}
            </div>
          </section>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={() => void submitAnswer()}
            disabled={submitting || answer.trim().length < 20}
            className="min-w-52"
          >
            {submitting
              ? 'Validando…'
              : currentQuestion === questions.length - 1
                ? 'Validar y completar'
                : 'Siguiente pregunta'}
            {!submitting && <ChevronRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  )
}
