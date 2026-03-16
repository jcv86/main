'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { ArrowLeft, Mic, Volume2, SkipForward, Check, AlertCircle } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'

const GUIDED_INTERVIEW_QUESTIONS = [
  {
    id: 1,
    type: 'intro',
    question: '¿Cuáles son tus fortalezas principales en el rol que buscas?',
    guidance: 'Sé conciso y enfocado. 60 segundos máximo.',
    time_limit: 60,
    expected_length: 'short',
    tags: ['Fortalezas', 'Auto-conocimiento']
  },
  {
    id: 2,
    type: 'motivation',
    question: '¿Por qué quieres este rol específicamente?',
    guidance: 'Demuestra investigación sobre la empresa.',
    time_limit: 90,
    expected_length: 'medium',
    tags: ['Motivación', 'Conocimiento de Empresa']
  },
  {
    id: 3,
    type: 'achievement',
    question: 'Cuéntame sobre un proyecto que liderizaste. ¿Cuál fue el impacto?',
    guidance: 'Usa STAR pero de forma más rápida.',
    time_limit: 120,
    expected_length: 'medium',
    tags: ['Liderazgo', 'Impacto']
  },
  {
    id: 4,
    type: 'challenge',
    question: 'Describe un conflicto laboral que enfrentaste. ¿Cómo lo resolviste?',
    guidance: 'Demuestra habilidades de comunicación y resolución.',
    time_limit: 120,
    expected_length: 'medium',
    tags: ['Resolución de Conflictos', 'Comunicación']
  },
  {
    id: 5,
    type: 'learning',
    question: 'Cuéntame sobre algo que aprendiste recientemente en tu profesión.',
    guidance: 'Muestra curiosidad, disposición al aprendizaje continuo, aplicación práctica',
    time_limit: 90,
    expected_length: 'medium',
    tags: ['Aprendizaje', 'Adaptabilidad']
  },
  {
    id: 6,
    type: 'closing',
    question: 'Resumiendo: ¿qué es lo más importante que quieres que recordemos de ti?',
    guidance: 'Cierre poderoso: sintetiza tu propuesta de valor única en 30-45 segundos',
    time_limit: 60,
    expected_length: 'short',
    tags: ['Cierre', 'Propuesta de Valor']
  }
]

export default function GuidedInterviewPage() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [responses, setResponses] = useState<Record<number, string>>({})
  const [isRecording, setIsRecording] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState<number | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const currentQuestion = GUIDED_INTERVIEW_QUESTIONS[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / GUIDED_INTERVIEW_QUESTIONS.length) * 100

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  useEffect(() => {
    setTimeLeft(currentQuestion.time_limit)
  }, [currentQuestionIndex, currentQuestion])

  const handleResponseChange = (text: string) => {
    setResponses({
      ...responses,
      [currentQuestion.id]: text
    })
  }

  const handleNext = () => {
    if (currentQuestionIndex < GUIDED_INTERVIEW_QUESTIONS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/auth/signin')
        return
      }

      // Save responses to database
      const { error } = await supabase
        .from('user_a3_guided_interview')
        .insert({
          user_id: user.id,
          simulation_type: 'guided',
          responses: responses,
          total_questions: GUIDED_INTERVIEW_QUESTIONS.length,
          completed_at: new Date().toISOString()
        })

      if (error) throw error

      // Calculate score (simple heuristic based on response length and completeness)
      const totalLength = Object.values(responses).reduce((acc, r) => acc + r.length, 0)
      const avgLength = totalLength / Object.keys(responses).length
      const completeness = (Object.keys(responses).length / GUIDED_INTERVIEW_QUESTIONS.length) * 100
      const calculatedScore = Math.round((avgLength / 200) * 50 + (completeness / 100) * 50)

      setScore(Math.min(calculatedScore, 100))
      setSubmitted(true)
      console.log('[v0] Guided interview submitted successfully')
    } catch (error) {
      console.error('[v0] Error submitting interview:', error)
    } finally {
      setLoading(false)
    }
  }

  if (submitted && score !== null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900 p-6">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
              <Check className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Entrevista Completada</h1>
            <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600">
              {score}%
            </div>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Excelente progreso. Tu coach IA está analizando tus respuestas...
            </p>
          </div>

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Próximos Pasos</h2>
            <ul className="space-y-3 text-slate-700 dark:text-slate-300">
              <li className="flex gap-3">
                <span className="text-green-600 font-bold">1.</span>
                <span>Revisa el feedback detallado de tu entrevista</span>
              </li>
              <li className="flex gap-3">
                <span className="text-blue-600 font-bold">2.</span>
                <span>Intenta la próxima dificultad (Entrevista Estructurada)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple-600 font-bold">3.</span>
                <span>Trabaja los temas donde necesitas mejorar</span>
              </li>
            </ul>
          </Card>

          <div className="flex gap-4">
            <Link href="/despega/a3/simulations" className="flex-1">
              <Button variant="outline" className="w-full">Volver a Simulaciones</Button>
            </Link>
            <Button onClick={() => handleNext()} className="flex-1 bg-blue-600 hover:bg-blue-700">
              Ver Análisis Detallado
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900 p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <Link href="/despega/a3/simulations">
          <Button variant="outline" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver
          </Button>
        </Link>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Entrevista Guiada - Práctica Básica
            </h1>
            <Badge variant="secondary">
              Pregunta {currentQuestionIndex + 1}/{GUIDED_INTERVIEW_QUESTIONS.length}
            </Badge>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="p-8 border-2 border-blue-200 dark:border-blue-800">
          <div className="space-y-6">
            {/* Question */}
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                {currentQuestion.question}
              </p>
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                <p className="text-sm text-blue-900 dark:text-blue-200">
                  <strong>Guidance del Coach:</strong> {currentQuestion.guidance}
                </p>
              </div>
            </div>

            {/* Timer */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold">Tiempo disponible:</span>
              <div className={`text-2xl font-bold ${timeLeft < 30 ? 'text-red-600' : 'text-slate-600 dark:text-slate-400'}`}>
                {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
              </div>
            </div>

            {/* Response Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Tu respuesta:
              </label>
              <Textarea
                value={responses[currentQuestion.id] || ''}
                onChange={(e) => handleResponseChange(e.target.value)}
                placeholder="Escribe tu respuesta aquí. El coach te orientará con los puntos clave..."
                className="min-h-40 resize-none"
              />
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Palabras escritas: {(responses[currentQuestion.id] || '').split(/\s+/).filter(w => w).length}
              </p>
            </div>

            {/* Recording Option */}
            <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Mic className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-semibold text-purple-900 dark:text-purple-200">
                  O practica hablando en voz alta (sin grabación aún)
                </span>
              </div>
              <Button variant="outline" size="sm">
                <Volume2 className="w-4 h-4 mr-2" />
                Práctica de Audio
              </Button>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {currentQuestion.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="bg-slate-200 dark:bg-slate-700">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex gap-4 justify-between">
          <Button
            onClick={handlePrevious}
            disabled={currentQuestionIndex === 0}
            variant="outline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

          <div className="flex gap-2">
            {currentQuestionIndex < GUIDED_INTERVIEW_QUESTIONS.length - 1 ? (
              <>
                <Button
                  onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 2)}
                  disabled={currentQuestionIndex + 2 >= GUIDED_INTERVIEW_QUESTIONS.length}
                  variant="outline"
                >
                  <SkipForward className="w-4 h-4 mr-2" />
                  Saltar
                </Button>
                <Button
                  onClick={handleNext}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Siguiente
                  <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                </Button>
              </>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? 'Guardando...' : 'Completar y Enviar'}
              </Button>
            )}
          </div>
        </div>

        {/* Tips */}
        <Card className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
          <CardContent className="pt-6 text-sm text-amber-900 dark:text-amber-200 space-y-2">
            <p className="font-semibold">Consejos de la Entrevista Guiada:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Sé conciso pero completo - máximo 2-3 minutos por pregunta</li>
              <li>Usa ejemplos específicos y cuantificables</li>
              <li>Conecta tu respuesta con el rol que deseas</li>
              <li>No tengas prisa - usa el tiempo completo si lo necesitas</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
