'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

interface Question {
  id: string
  type: 'conversational' | 'multiple_choice' | 'scale'
  question: string
  options?: string[]
  scaleMax?: number
}

const CEREBRAL_QUESTIONS: Question[] = [
  {
    id: 'intro',
    type: 'conversational',
    question: '¿Cuál es tu estilo natural de trabajo? ¿Prefieres análisis profundo o decisiones rápidas?'
  },
  {
    id: 'decision_style',
    type: 'multiple_choice',
    question: 'Cuando enfrentas un problema complejo, tiendes a:',
    options: [
      'Analizar todos los datos antes de decidir (Analítico)',
      'Confiar en tu intuición y experiencia (Intuitivo)',
      'Consultar con el equipo (Colaborativo)',
      'Actuar rápido y ajustar después (Directo)'
    ]
  },
  {
    id: 'thinking_preference',
    type: 'conversational',
    question: '¿Qué te motiva más en tu trabajo: resultados, reconocimiento, estabilidad o impacto?'
  },
  {
    id: 'interaction_style',
    type: 'multiple_choice',
    question: 'En equipos, prefieres ser:',
    options: [
      'Experto técnico (especialista)',
      'Líder que coordina (director)',
      'Facilitador que conecta (mediador)',
      'Ejecutor que entrega (implementador)'
    ]
  },
  {
    id: 'pace_preference',
    type: 'scale',
    question: '¿A qué ritmo trabajas mejor?',
    scaleMax: 5
  },
  {
    id: 'environment',
    type: 'conversational',
    question: '¿Cómo prefieres tu entorno de trabajo? ¿Estructura vs flexibilidad?'
  },
  {
    id: 'risk_tolerance',
    type: 'scale',
    question: '¿Cuánta incertidumbre puedes tolerar en proyectos nuevos?',
    scaleMax: 5
  },
  {
    id: 'learning_style',
    type: 'multiple_choice',
    question: 'Aprendes mejor cuando:',
    options: [
      'Lees y estudias en profundidad',
      'Practicas haciendo (learning by doing)',
      'Escuchas y discutes',
      'Ves ejemplos y casos reales'
    ]
  }
]

export default function DespecaCerebralTest() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [responses, setResponses] = useState<Record<string, any>>({})
  const [conversationalInput, setConversationalInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [testComplete, setTestComplete] = useState(false)
  const router = useRouter()
  const scrollRef = useRef<HTMLDivElement>(null)

  const question = CEREBRAL_QUESTIONS[currentQuestion]
  const progress = ((currentQuestion + 1) / CEREBRAL_QUESTIONS.length) * 100

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [currentQuestion])

  const handleConversationalAnswer = (e: React.FormEvent) => {
    e.preventDefault()
    if (!conversationalInput.trim()) return

    setResponses(prev => ({
      ...prev,
      [question.id]: conversationalInput
    }))
    setConversationalInput('')
    moveToNext()
  }

  const handleMultipleChoice = (answer: string) => {
    setResponses(prev => ({
      ...prev,
      [question.id]: answer
    }))
    moveToNext()
  }

  const handleScale = (value: number) => {
    setResponses(prev => ({
      ...prev,
      [question.id]: value
    }))
    moveToNext()
  }

  const moveToNext = () => {
    if (currentQuestion < CEREBRAL_QUESTIONS.length - 1) {
      setCurrentQuestion(prev => prev + 1)
    } else {
      submitTest()
    }
  }

  const submitTest = async () => {
    setIsLoading(true)
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        router.push('/auth')
        return
      }

      // Guardar respuestas del test
      const { error: saveError } = await supabase
        .from('despega_cerebral_test')
        .insert({
          user_id: user.id,
          responses: responses,
          completed_at: new Date().toISOString()
        })

      if (saveError) throw saveError

      // Generar informe
      const response = await fetch('/api/despega/generar-informe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      })

      if (!response.ok) throw new Error('Error generando informe')

      setTestComplete(true)
      setTimeout(() => {
        router.push('/perfil')
      }, 2000)
    } catch (error) {
      console.error('[v0] Error submitting test:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (testComplete) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
        <Card className="p-8 text-center max-w-md">
          <h2 className="text-2xl font-bold mb-4 text-green-500">¡Test Completado!</h2>
          <p className="text-gray-600 mb-4">Tu informe se está generando...</p>
          <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto"></div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
      <div className="container max-w-2xl mx-auto py-8" ref={scrollRef}>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Test Despega Cerebral</h1>
          <p className="text-purple-300">Descubre tu perfil profesional único</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Pregunta {currentQuestion + 1} de {CEREBRAL_QUESTIONS.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <Card className="p-8 mb-8 bg-slate-800 border-slate-700">
          <h2 className="text-xl font-semibold text-white mb-6">{question.question}</h2>

          {question.type === 'conversational' && (
            <form onSubmit={handleConversationalAnswer} className="space-y-4">
              <input
                type="text"
                value={conversationalInput}
                onChange={(e) => setConversationalInput(e.target.value)}
                placeholder="Tu respuesta aquí..."
                className="w-full px-4 py-3 rounded-lg bg-slate-700 text-white placeholder-gray-400 border border-slate-600 focus:border-purple-500 focus:outline-none"
                autoFocus
              />
              <Button
                type="submit"
                disabled={!conversationalInput.trim() || isLoading}
                className="w-full"
              >
                Continuar
              </Button>
            </form>
          )}

          {question.type === 'multiple_choice' && (
            <div className="space-y-3">
              {question.options?.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleMultipleChoice(option)}
                  disabled={isLoading}
                  className="w-full p-4 text-left rounded-lg bg-slate-700 hover:bg-purple-600 border border-slate-600 hover:border-purple-500 text-white transition-all duration-200"
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          {question.type === 'scale' && (
            <div className="flex justify-between gap-2">
              {Array.from({ length: question.scaleMax }, (_, i) => i + 1).map(num => (
                <button
                  key={num}
                  onClick={() => handleScale(num)}
                  disabled={isLoading}
                  className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
                    responses[question.id] === num
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>
          )}
        </Card>

        {/* Navigation */}
        {currentQuestion > 0 && (
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(prev => prev - 1)}
            disabled={isLoading}
            className="w-full"
          >
            Atrás
          </Button>
        )}
      </div>
    </div>
  )
}
