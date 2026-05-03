'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'
import { ArrowLeft, Mic, Volume2, SkipForward, Check, AlertCircle, Trophy, Zap } from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { AIAssistant } from '@/components/conozcamonos/ai-assistant'
import { VoiceInput } from '@/components/conozcamonos/voice-input'
import { ChallengeInvitation } from '@/components/a3-challenge-invitation'
import { SofiaInterviewer } from '@/components/sofia-interviewer'

const GUIDED_INTERVIEW_QUESTIONS = [
  {
    id: 1,
    type: 'intro',
    question: 'Cuéntame sobre ti. ¿Quién eres profesionalmente?',
    guidance: 'Estructura tu respuesta: nombre, experiencia clave, especialidad actual',
    time_limit: 120,
    expected_length: 'short',
    tags: ['Presentación Personal', 'Claridad de Propuesta']
  },
  {
    id: 2,
    type: 'motivation',
    question: 'Describe tu motivación profesional. ¿Qué te impulsa en tu carrera?',
    guidance: 'Conecta tu historia personal con tus objetivos profesionales. Sé auténtico.',
    time_limit: 90,
    expected_length: 'medium',
    tags: ['Motivación', 'Propósito']
  },
  {
    id: 3,
    type: 'achievement',
    question: 'Cuéntame sobre tu mayor logro profesional. ¿Por qué fue significativo?',
    guidance: 'Usa la metodología STAR: Situación, Tarea, Acción, Resultado',
    time_limit: 120,
    expected_length: 'long',
    tags: ['Logros', 'Impacto', 'STAR']
  },
  {
    id: 4,
    type: 'challenge',
    question: 'Describe un desafío que superaste. ¿Cómo lo resolviste?',
    guidance: 'Demuestra: Análisis del problema, creatividad en la solución, resultado cuantificable',
    time_limit: 120,
    expected_length: 'long',
    tags: ['Resolución de Problemas', 'Resilencia']
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
  const [validatingIds, setValidatingIds] = useState<Set<number>>(new Set())
  const [started, setStarted] = useState(false)
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

  const validateResponse = async (questionId: number, question: string, response: string) => {
    if (!response.trim() || response.split(/\s+/).filter(w => w).length < 5) return

    setValidatingIds(prev => new Set(prev).add(questionId))
    
    try {
      const validationResponse = await fetch('/api/conozcamonos/validate-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questionId,
          question,
          response,
          questionType: 'interview'
        })
      })

      const validation = await validationResponse.json()
      console.log('[v0] Response validated:', validation)
    } catch (err) {
      console.error('[v0] Validation error:', err)
    } finally {
      setValidatingIds(prev => {
        const updated = new Set(prev)
        updated.delete(questionId)
        return updated
      })
    }
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

  if (!started) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-5xl mx-auto space-y-6 px-4 py-8">
          <Link href="/despega/a3">
            <Button variant="outline" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>

          {/* Welcome Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Sofia Greeting */}
            <div>
              <SofiaInterviewer 
                state="greeting" 
                autoPlay={true}
                loop={true}
              />
              <p className="text-center mt-4 text-white/70">Sofia, tu entrevistadora IA</p>
            </div>

            {/* Welcome Info */}
            <div className="space-y-6">
              <div>
                <h1 className="text-4xl font-bold text-training mb-2">Entrevista Guiada</h1>
                <p className="text-lg text-white/85">
                  Práctica básica con preguntas fundamentales y guía del coach
                </p>
              </div>

              <Card className="border-training/40">
                <CardContent className="pt-6 space-y-4">
                  <div className="space-y-3">
                    <h3 className="font-bold text-white flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-training" />
                      Lo que aprenderás
                    </h3>
                    <ul className="space-y-2 text-white/85">
                      <li className="flex gap-2">
                        <span className="text-training">•</span>
                        <span>Presentarte de forma clara y profesional</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-training">•</span>
                        <span>Estructurar tus respuestas con la metodología STAR</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-training">•</span>
                        <span>Demostrar logros con ejemplos cuantificables</span>
                      </li>
                      <li className="flex gap-2">
                        <span className="text-training">•</span>
                        <span>Conectar tu experiencia con la posición</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-training/10 dark:bg-training/20 rounded-[20px] p-4 border border-training/30">
                    <p className="text-sm text-white/80">
                      <strong className="text-training">Nota:</strong> Sofia te guiará en cada pregunta con consejos del coach para mejorar tu respuesta.
                    </p>
                  </div>

                  <Button 
                    onClick={() => setStarted(true)}
                    className="w-full bg-training hover:bg-training/90 text-white h-12"
                  >
                    Comenzar Entrevista
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-4">
            <div className="w-24 h-24 mx-auto bg-background">
              <Check className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-muted/90 dark:text-white">Entrevista Completada</h1>
            <div className="text-6xl font-bold text-transparent bg-clip-text bg-background">
              {score}%
            </div>
            <p className="text-lg text-muted-foreground dark:text-muted-foreground">
              Excelente progreso. Tu coach IA está analizando tus respuestas...
            </p>
          </div>

          <Card className="p-6">
            <h2 className="text-xl font-bold mb-4">Próximos Pasos</h2>
            <ul className="space-y-3 text-muted-foreground dark:text-white/85">
              <li className="flex gap-3">
                <span className="text-green font-bold">1.</span>
                <span>Revisa el feedback detallado de tu entrevista</span>
              </li>
              <li className="flex gap-3">
                <span className="text-training font-bold">2.</span>
                <span>Intenta la próxima dificultad (Entrevista Estructurada)</span>
              </li>
              <li className="flex gap-3">
                <span className="text-purple font-bold">3.</span>
                <span>Trabaja los temas donde necesitas mejorar</span>
              </li>
            </ul>
          </Card>

          <div className="flex gap-4">
            <Link href="/despega/a3/simulations" className="flex-1">
              <Button variant="outline" className="w-full">Volver a Entrenamientos</Button>
            </Link>
            <Button onClick={() => handleNext()} className="flex-1 bg-training/80 hover:bg-training/70">
              Ver Análisis Detallado
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Default return when no condition matches
  return null
}
