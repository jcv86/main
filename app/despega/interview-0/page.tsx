'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Video, FileText, Briefcase, TrendingUp } from 'lucide-react'

const INTERVIEW_QUESTIONS = [
  {
    id: 1,
    question: 'Cuéntame sobre ti en 2 minutos. ¿Quién eres profesionalmente?',
    videoHint: 'Introduce tu background, experiencia clave y qué te hace diferente'
  },
  {
    id: 2,
    question: '¿Cuál es tu mayor logro profesional y qué aprendiste de él?',
    videoHint: 'Describe un proyecto o situación específica, el reto, tu rol y el resultado'
  },
  {
    id: 3,
    question: '¿Cuál ha sido tu mayor desafío en el trabajo y cómo lo superaste?',
    videoHint: 'Sé honesto, muestra vulnerabilidad pero también resilencia'
  },
  {
    id: 4,
    question: '¿Por qué quieres este cambio o nuevo rol?',
    videoHint: 'Conecta tus objetivos, tus valores y cómo esta oportunidad se alinea'
  },
  {
    id: 5,
    question: '¿Cuáles son tus tres fortalezas principales y cómo las usarías en el nuevo rol?',
    videoHint: 'Sé específico con ejemplos concretos de cómo has demostrado estas habilidades'
  }
]

export default function Interview0Page() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<Record<number, string>>({})
  const [isRecording, setIsRecording] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const question = INTERVIEW_QUESTIONS[currentQuestion]
  const progress = ((currentQuestion + (responses[question.id] ? 1 : 0)) / INTERVIEW_QUESTIONS.length) * 100

  const handleNext = () => {
    if (!responses[question.id]) {
      setError('Por favor responde esta pregunta antes de continuar')
      return
    }

    if (currentQuestion < INTERVIEW_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      submitInterview()
    }
  }

  const handleBack = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1)
    }
  }

  const submitInterview = async () => {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user?.id) {
        router.push('/auth/signin')
        return
      }

      // Save Interview 0 responses
      await supabase.from('user_a3_interview_0').insert({
        user_id: user.id,
        responses: responses,
        completed_at: new Date().toISOString()
      })

      console.log('[v0] Interview 0 completed')
      router.push('/despega/a3-dashboard')
    } catch (err) {
      console.error('[v0] Error saving interview:', err)
      setError('Error al guardar. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Video className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Interview 0: Tu Pitch Personal
            </h1>
          </div>
          <p className="text-slate-600 dark:text-slate-400 mb-6">
            5 preguntas clave para practicar y preparar tus mejores respuestas
          </p>
          <Progress value={progress} className="h-2" />
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
            Pregunta {currentQuestion + 1} de {INTERVIEW_QUESTIONS.length}
          </p>
        </div>

        {/* Question Card */}
        <Card className="p-8 mb-8 shadow-lg">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-900 dark:text-white mb-4">
              {question.question}
            </h2>

            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6">
              <p className="text-blue-900 dark:text-blue-200 text-sm">
                <strong>Consejo:</strong> {question.videoHint}
              </p>
            </div>

            {/* Text Response Area */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Tu respuesta (escrita)
              </label>
              <textarea
                value={responses[question.id] || ''}
                onChange={(e) => setResponses(prev => ({
                  ...prev,
                  [question.id]: e.target.value
                }))}
                placeholder="Escribe tu respuesta aquí o practica hablando de esto en voz alta..."
                className="w-full p-4 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-purple-600"
                rows={5}
              />
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 rounded-lg p-3 mt-4">
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

            <Button
              onClick={handleNext}
              disabled={!responses[question.id] || loading}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {loading ? 'Guardando...' : currentQuestion === INTERVIEW_QUESTIONS.length - 1 ? 'Completar Interview' : 'Siguiente'}
            </Button>
          </div>
        </Card>

        {/* Tips */}
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
          <h3 className="font-bold text-slate-900 dark:text-white mb-3">Consejos para el Interview 0:</h3>
          <ul className="space-y-2 text-slate-700 dark:text-slate-300 text-sm">
            <li>✓ Sé auténtico - cuenta historias reales, no discursos memorizado</li>
            <li>✓ Sé conciso - practica tu timing para no ir demasiado rápido o lento</li>
            <li>✓ Usa ejemplos específicos - números, resultados tangibles, detalles</li>
            <li>✓ Conecta con el oyente - mantén contacto visual con la cámara</li>
            <li>✓ Respira - tómate tiempo entre preguntas para pensar</li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
