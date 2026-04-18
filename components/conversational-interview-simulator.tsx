'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { useContextValidation } from '@/lib/hooks/use-context-validation'
import { useSpeechRecognition } from '@/lib/hooks/use-speech-recognition'
import { useAvatarPreferences } from '@/lib/hooks/use-avatar-preferences'
import { useGamification } from '@/lib/hooks/use-gamification'
import { InterviewerSelector } from '@/components/interviewer-selector'
import { InterviewTips } from '@/components/interview-tips'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mic, MicOff, Video, RotateCcw, Send, Copy, Check, Zap, Target, MessageSquare, TrendingUp, Lightbulb, HelpCircle, Loader2, AlertTriangle, Volume2 } from 'lucide-react'

interface ConversationalInterviewSimulatorProps {
  level: 'basico' | 'intermedio' | 'avanzado'
  onComplete?: (result: any) => void
}

interface InterviewQuestion {
  id: string
  text: string
  category: 'behavioral' | 'technical' | 'situational'
  context?: string
}

interface AttemptResult {
  attemptNumber: number
  userResponse: string
  score: number
  followUp?: string
  feedback?: {
    strengths: string[]
    improvements: string[]
    staAnalysis?: {
      situation?: string
      task?: string
      action?: string
      result?: string
    }
  }
}

const INTERVIEW_QUESTIONS: Record<string, InterviewQuestion[]> = {
  basico: [
    {
      id: 'q1',
      text: 'Cuéntame sobre ti y por qué te interesa este rol',
      category: 'situational',
      context: 'Evaluamos claridad, pasión y alineamiento'
    },
    {
      id: 'q2',
      text: '¿Cuál es tu mayor fortaleza para este puesto?',
      category: 'behavioral',
      context: 'Buscamos evidencia, no solo adjetivos'
    },
    {
      id: 'q3',
      text: '¿Cuál es un área donde quieres crecer?',
      category: 'behavioral',
      context: 'Queremos ver autoconciencia y compromiso'
    }
  ],
  intermedio: [
    {
      id: 'q1',
      text: 'Cuéntame sobre una vez que enfrentaste un desacuerdo con un compañero y cómo lo resolviste',
      category: 'behavioral',
      context: 'Evaluamos manejo de conflictos y comunicación'
    },
    {
      id: 'q2',
      text: '¿Cómo manejas la presión cuando tienes múltiples proyectos simultáneos?',
      category: 'situational',
      context: 'Buscamos estructura, priorización y mantener la calidad'
    },
    {
      id: 'q3',
      text: 'Describe un proyecto donde asumiste liderazgo no formal',
      category: 'behavioral',
      context: 'Evaluamos iniciativa, influencia y resultados'
    }
  ],
  avanzado: [
    {
      id: 'q1',
      text: 'Tienes 3 prioridades en conflicto y solo puedes hacer una. ¿Cómo decides?',
      category: 'situational',
      context: 'Evaluamos pensamiento estratégico y toma de decisiones'
    },
    {
      id: 'q2',
      text: 'Cuéntame sobre una situación donde fallaste. ¿Qué aprendiste?',
      category: 'behavioral',
      context: 'Evaluamos humildad, aprendizaje y resiliencia'
    },
    {
      id: 'q3',
      text: '¿Cómo manejarías una situación donde tu manager está equivocado en una decisión crítica?',
      category: 'behavioral',
      context: 'Evaluamos coraje, comunicación y juicio'
    }
  ]
}

// Sistema de follow-ups dinámicos
function generateFollowUp(userResponse: string, question: InterviewQuestion): string {
  const responseLength = userResponse.trim().split(' ').length
  const hasExamples = /ejemplo|caso|proyecto|situación/i.test(userResponse)
  const hasNumbers = /\d+/.test(userResponse)
  const hasImpact = /mejor|aument|reduj|logr|impact|result/i.test(userResponse)

  if (responseLength < 20) {
    return '¿Podrías elaborar un poco más? Dame un ejemplo específico o un contexto.'
  }
  if (!hasExamples && question.category === 'behavioral') {
    return 'Me encantaría que profundices con un ejemplo concreto. ¿Cuándo sucedió exactamente?'
  }
  if (!hasNumbers && question.category === 'situational') {
    return '¿Qué métricas o números puedes compartir para validar ese impacto?'
  }
  if (!hasImpact) {
    return '¿Cuál fue el impacto o resultado específico de eso?'
  }
  return '¿Qué aprendiste de esa experiencia que aplicarías acá?'
}

export function ConversationalInterviewSimulator({
  level,
  onComplete
}: ConversationalInterviewSimulatorProps) {
  const { user } = useAuthRedirect()
  const supabase = createClient()
  const { validateContextRelevance, isValidating, validationError, clearError } = useContextValidation()
  const { preferences, updatePreferences } = useAvatarPreferences(user?.id)
  const { gamification, awardXP, updateStreak } = useGamification(user?.id)
  
  // STT Hook - usar como en C1
  const { isListening, isSupported, transcript, isFinal, startListening, stopListening, resetTranscript } = useSpeechRecognition({
    language: 'es-ES',
    continuous: false,
    interimResults: false, // Changed from true - only get final results
    silenceTimeout: 2000
  })
  
  const [stage, setStage] = useState<'setup' | 'question' | 'response' | 'feedback' | 'complete'>('setup')
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [userResponse, setUserResponse] = useState('')
  const [attempts, setAttempts] = useState<Record<string, AttemptResult[]>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showCoachTip, setShowCoachTip] = useState(true)
  const [selectedInterviewerId, setSelectedInterviewerId] = useState(preferences?.interviewer_avatar_id || 'interviewer-classic-1')

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const lastTranscriptRef = useRef<string>('')
  
  const questions = INTERVIEW_QUESTIONS[level]
  const currentQuestion = questions[currentQuestionIdx]
  const currentAttempts = attempts[currentQuestion.id] || []

  // Handle speech recognition results like C1
  useEffect(() => {
    if (transcript && isFinal && transcript !== lastTranscriptRef.current && stage === 'response') {
      lastTranscriptRef.current = transcript
      setUserResponse(transcript)
      // Reset for next recording
      resetTranscript()
      lastTranscriptRef.current = ''
    }
  }, [transcript, isFinal, stage, resetTranscript])

  // Initialize camera only
  useEffect(() => {
    if (stage === 'response' && videoEnabled) {
      initializeCamera()
      return () => stopCamera()
    }
  }, [stage, videoEnabled])

  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false // Audio handled by Web Speech API, not MediaRecorder
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      console.log('[v0] Camera initialized, ready for user to start STT')
    } catch (err) {
      setError('No se pudo acceder a la cámara. Verifica permisos.')
      console.error('[v0] Camera error:', err)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
  }

  const handleStartInterview = () => {
    setStage('question')
    setCurrentQuestionIdx(0)
    // Save selected interviewer to preferences
    if (selectedInterviewerId !== preferences?.interviewer_avatar_id) {
      updatePreferences?.({ interviewer_avatar_id: selectedInterviewerId })
    }
  }

  const handleSubmitResponse = async () => {
    if (!userResponse.trim()) return

    try {
      setIsLoading(true)
      clearError()

      // Validate that response is contextually relevant to the question
      const validation = await validateContextRelevance(
        currentQuestion.text,
        userResponse,
        'conversational-interview'
      )

      if (!validation.isRelevant) {
        setError(validation.reason || 'Tu respuesta no está relacionada con la pregunta. Por favor, responde sobre el tema preguntado.')
        setIsLoading(false)
        return
      }

      // Call smart interviewer agent API for intelligent feedback
      console.log('[v0] Calling interviewer agent for:', selectedInterviewerId)
      const evaluatorResponse = await fetch('/api/interview/evaluator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          interviewerId: selectedInterviewerId,
          question: currentQuestion.text,
          userResponse,
          questionCategory: currentQuestion.category,
          difficulty: level
        })
      })

      if (!evaluatorResponse.ok) {
        throw new Error('Failed to generate interviewer feedback')
      }

      const evaluatorData = await evaluatorResponse.json()
      const { score, feedback, followUp } = evaluatorData

      const newAttempt: AttemptResult = {
        attemptNumber: currentAttempts.length + 1,
        userResponse,
        score,
        followUp,
        feedback
      }

      setAttempts({
        ...attempts,
        [currentQuestion.id]: [...currentAttempts, newAttempt]
      })

      setStage('feedback')
      setUserResponse('')
    } catch (err) {
      setError('Error procesando la respuesta')
      console.error('[v0] Submission error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleRetryQuestion = () => {
    setStage('response')
  }

  const handleMoveNext = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx(currentQuestionIdx + 1)
      setStage('question')
    } else {
      completeInterview()
    }
  }

  const completeInterview = async () => {
    const allScores = Object.values(attempts).flat().map(a => a.score)
    const averageScore = allScores.length > 0 ? Math.round(allScores.reduce((a, b) => a + b) / allScores.length) : 0

    // Save to database if user is authenticated
    if (user?.id) {
      try {
        const { error } = await supabase
          .from('user_a3_simulations')
          .insert({
            user_id: user.id,
            level,
            questions_completed: questions.length,
            total_attempts: Object.values(attempts).flat().length,
            average_score: averageScore,
            results: attempts,
            completed_at: new Date().toISOString()
          })
        
        if (error) {
          console.error('[v0] Error saving simulation results:', error)
        } else {
          console.log('[v0] Simulation results saved successfully')
        }
      } catch (err) {
        console.error('[v0] Error during save:', err)
      }
    }

    onComplete?.({
      level,
      questionsCompleted: questions.length,
      totalAttempts: Object.values(attempts).flat().length,
      averageScore,
      attempts
    })

    setStage('complete')
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const lastAttempt = currentAttempts[currentAttempts.length - 1]

  return (
    <div className="space-y-6">
      {/* Setup Stage */}
      {stage === 'setup' && (
        <div className="space-y-6">
          <Card className="border-2 border-emerald-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-emerald-600" />
                Simulador Conversacional de Entrevista
              </CardTitle>
              <CardDescription>
                Entrena con un entrevistador adaptativo que hace follow-ups reales basado en tus respuestas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800 space-y-3">
                <p className="font-bold text-emerald-900 dark:text-emerald-200">Aquí está el diferencial:</p>
                <ul className="space-y-2 text-sm text-emerald-800 dark:text-emerald-300">
                  <li className="flex gap-2">
                    <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span><strong>Respuestas vagas?</strong> Te pediré ejemplo. <strong>Demasiado largo?</strong> Te interrumpiré.</span>
                  </li>
                  <li className="flex gap-2">
                    <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span><strong>Segundo intento inmediato.</strong> Las mejores respuestas salen en el segundo round.</span>
                  </li>
                  <li className="flex gap-2">
                    <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span><strong>Debrief STAR detallado:</strong> Dónde ganaste puntos, dónde perdiste, y cómo sonarías mejor.</span>
                  </li>
                  <li className="flex gap-2">
                    <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span><strong>Lenguaje para copiar-pegar.</strong> Frases exactas que sonarían mejor en esa situación.</span>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Interviewer Selector */}
          <InterviewerSelector
            value={selectedInterviewerId}
            onChange={setSelectedInterviewerId}
          />

          <Button
            onClick={handleStartInterview}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-lg"
          >
            Comenzar Simulación
          </Button>
        </div>
      )}

      {/* Question Display Stage */}
      {stage === 'question' && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-start mb-4">
              <div>
                <CardTitle className="text-2xl">
                  Pregunta {currentQuestionIdx + 1} de {questions.length}
                </CardTitle>
                <CardDescription>{currentQuestion.category}</CardDescription>
              </div>
              <Badge variant="outline">{level}</Badge>
            </div>
            <Progress value={((currentQuestionIdx + 1) / questions.length) * 100} className="h-2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-lg font-semibold text-slate-900 dark:text-white mb-3">
                {currentQuestion.text}
              </p>
              <p className="text-sm text-slate-600 dark:text-slate-400 italic">
                {currentQuestion.context}
              </p>
            </div>

            <Button
              onClick={() => setStage('response')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12"
            >
              <Video className="w-4 h-4 mr-2" />
              Grabar Respuesta
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Response Recording Stage */}
      {stage === 'response' && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Graba tu respuesta</CardTitle>
            <CardDescription>Mira la pregunta, mantén contacto visual con la cámara y responde como en entrevista real</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Professional Two-Column Layout */}
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Main Camera Section - Left (3 columns) */}
              <div className="lg:col-span-3 space-y-4">
                {/* Hero Video with Floating Interviewer Card */}
                <div className="relative bg-black rounded-xl overflow-hidden shadow-2xl" style={{ aspectRatio: '16/9' }}>
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Recording Indicator - Top Left */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <div className={`w-2.5 h-2.5 rounded-full ${isListening ? 'bg-red-500 animate-pulse' : 'bg-emerald-500'}`} />
                    <span className="text-xs font-semibold text-white bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full">
                      {isListening ? '🔴 GRABANDO' : '🎥 LISTO'}
                    </span>
                  </div>

                  {/* Floating Interviewer Profile Card - Top Right */}
                  <div className="absolute top-4 right-4 bg-black/70 backdrop-blur-md border border-slate-700/50 rounded-lg p-3 max-w-xs shadow-xl">
                    <div className="flex gap-3">
                      <div className={`w-14 h-14 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 ${getAvatarGradient(selectedInterviewerId)}`}>
                        {getAvatarEmoji(selectedInterviewerId, 'interviewer')}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-sm font-bold text-white truncate">
                          {getAvatarName(selectedInterviewerId, 'interviewer')}
                        </h4>
                        <p className="text-xs text-blue-300 truncate">
                          {getInterviewerRole(selectedInterviewerId)}
                        </p>
                        <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                          {getInterviewerFocus(selectedInterviewerId)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Response Input Area */}
                <div className="space-y-3 bg-gradient-to-r from-slate-900 to-slate-800 rounded-xl p-5 border border-slate-700">
                  <label className="text-sm font-semibold text-white flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-blue-400" />
                    Tu respuesta:
                  </label>
                  <textarea
                    value={userResponse}
                    onChange={(e) => setUserResponse(e.target.value)}
                    placeholder="Escribe tu respuesta aquí o usa el micrófono para grabar..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-3 text-sm text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    {isSupported && (
                      <Button
                        onClick={isListening ? stopListening : startListening}
                        variant={isListening ? 'destructive' : 'outline'}
                        size="sm"
                        className="gap-2 flex-1"
                      >
                        {isListening ? (
                          <>
                            <MicOff className="w-4 h-4" />
                            Detener grabación
                          </>
                        ) : (
                          <>
                            <Mic className="w-4 h-4" />
                            Grabar con micrófono
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar - Right (1 column) */}
              <div className="space-y-4">
                {/* Question Card - Compact */}
                <Card className="border border-slate-700 bg-slate-900">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 text-blue-400" />
                      Pregunta
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs font-semibold text-white leading-snug mb-2">
                      {currentQuestion.text}
                    </p>
                    <p className="text-xs text-slate-400 italic leading-snug">
                      {currentQuestion.context}
                    </p>
                  </CardContent>
                </Card>

                {/* AI Tips Card - Dynamic */}
                {user && (
                  <div className="rounded-lg border border-slate-700 bg-slate-900 overflow-hidden">
                    <InterviewTips
                      questionText={currentQuestion.text}
                      userResponse={userResponse}
                      questionContext={currentQuestion.context}
                      difficulty={level}
                      sessionId={`interview-${level}-${Date.now()}`}
                      userId={user.id}
                      onTipGenerated={(tip) => console.log('[v0] Tip generated:', tip)}
                    />
                  </div>
                )}

                {/* Progress Card */}
                <Card className="border border-slate-700 bg-slate-900">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-emerald-400" />
                      Progreso
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex justify-between text-xs mb-2">
                      <span className="text-slate-400">Pregunta</span>
                      <span className="font-semibold text-white">
                        {currentQuestionIdx + 1}/{questions.length}
                      </span>
                    </div>
                    <Progress value={((currentQuestionIdx + 1) / questions.length) * 100} className="h-2" />
                  </CardContent>
                </Card>

                {/* Action Buttons */}
                <div className="space-y-2 pt-2">
                  <Button
                    onClick={handleSubmitResponse}
                    disabled={!userResponse.trim()}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Enviar respuesta
                  </Button>
                  <Button
                    onClick={handleMoveNext}
                    variant="outline"
                    className="w-full border-slate-700"
                  >
                    Siguiente pregunta
                  </Button>
                </div>
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="border-red-300 bg-red-50 dark:bg-red-900/20">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-700 dark:text-red-200 ml-2">
                  {error}
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Feedback Stage */}
      {stage === 'feedback' && lastAttempt && (
        <Card className="border-2 border-amber-500/20">
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-amber-600" />
                  Feedback - Intento {lastAttempt.attemptNumber}
                </CardTitle>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-amber-600">{lastAttempt.score}</div>
                <p className="text-xs text-slate-600">Puntuación</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Your Response */}
            <div>
              <p className="font-semibold mb-2">Tu respuesta:</p>
              <div className="bg-slate-50 dark:bg-slate-900 p-4 rounded-lg italic text-slate-700 dark:text-slate-300">
                {lastAttempt.userResponse}
              </div>
            </div>

            {/* Feedback Tabs */}
            <Tabs defaultValue="feedback" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="feedback">Feedback</TabsTrigger>
                <TabsTrigger value="star">Análisis STAR</TabsTrigger>
                <TabsTrigger value="language">Lenguaje</TabsTrigger>
              </TabsList>

              <TabsContent value="feedback" className="space-y-4">
                <div>
                  <p className="font-semibold text-green-700 dark:text-green-300 mb-2">Fortalezas:</p>
                  <ul className="space-y-2">
                    {lastAttempt.feedback?.strengths.map((s, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <p className="font-semibold text-amber-700 dark:text-amber-300 mb-2">Áreas de mejora:</p>
                  <ul className="space-y-2">
                    {lastAttempt.feedback?.improvements.map((imp, i) => (
                      <li key={i} className="flex gap-2 text-sm">
                        <Zap className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>

              <TabsContent value="star" className="space-y-3">
                {lastAttempt.feedback?.staAnalysis && (
                  <>
                    {Object.entries(lastAttempt.feedback.staAnalysis).map(([key, value]) => (
                      <div key={key}>
                        <p className="font-semibold text-blue-700 dark:text-blue-300 capitalize">{key}:</p>
                        <p className="text-sm text-slate-700 dark:text-slate-300">{value}</p>
                      </div>
                    ))}
                  </>
                )}
              </TabsContent>

              <TabsContent value="language" className="space-y-4">
                <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-lg border border-emerald-200 dark:border-emerald-800 space-y-3">
                  <p className="font-semibold text-emerald-900 dark:text-emerald-200">Cómo sonarías mejor:</p>
                  <div className="space-y-2">
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                      "La situación fue [contexto específico]. Mi responsabilidad fue [tu rol claro]. Lo que hice fue [acciones concretas con verbos fuertes: implementé, rediseñé, lideré]. El impacto fue [números, métricas, resultados medibles]."
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard('La situación fue... Mi responsabilidad fue... Lo que hice fue... El impacto fue...')}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      {copied ? 'Copiado!' : 'Copiar estructura'}
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Follow-up Question */}
            {lastAttempt.followUp && (
              <Alert className="bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800">
                <MessageSquare className="h-4 w-4" />
                <AlertDescription className="text-purple-900 dark:text-purple-200">
                  <p className="font-semibold mb-1">Mi pregunta de seguimiento:</p>
                  <p>"{lastAttempt.followUp}"</p>
                </AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              {currentAttempts.length < 2 && (
                <Button
                  onClick={handleRetryQuestion}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reintentar esta pregunta
                </Button>
              )}
              <Button
                onClick={handleMoveNext}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {currentQuestionIdx < questions.length - 1 ? 'Siguiente pregunta' : 'Completar simulación'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Complete Stage */}
      {stage === 'complete' && (
        <Card className="border-2 border-emerald-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Check className="w-6 h-6 text-emerald-600" />
              ¡Simulación Completada!
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Score Display */}
            <div className="text-center py-6 space-y-3">
              <div className="text-5xl font-bold text-emerald-600 mb-2">
                {Object.values(attempts).flat().reduce((acc, a) => acc + a.score, 0) / Math.max(1, Object.values(attempts).flat().length)}
              </div>
              <p className="text-slate-600">Puntuación Promedio</p>

              {/* XP Rewards */}
              {gamification && (
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <Zap className="w-5 h-5 text-blue-600" />
                    <span className="font-bold text-blue-600">+150 XP Ganados</span>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Nivel: {gamification.current_level} • Racha: {gamification.current_streak} días
                  </p>
                </div>
              )}
            </div>

            <p className="text-center text-slate-700 dark:text-slate-300">
              Completaste {questions.length} preguntas con un total de {Object.values(attempts).flat().length} intentos.
            </p>

            <div className="flex gap-3">
              <Button 
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white h-12"
                onClick={() => {
                  // Award XP for completing interview
                  awardXP(150, 'conversational-interview-simulator')
                  updateStreak()
                  if (onComplete) onComplete({ score: 85, completed: true })
                }}
              >
                Volver al Dashboard
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 h-12"
                onClick={() => setStage('setup')}
              >
                Otra Simulación
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )

  // Helper functions for avatar data
  function getAvatarEmoji(avatarId: string, type: 'user' | 'interviewer'): string {
    const emojiMap: Record<string, string> = {
      'professional-1': '👔',
      'creative-1': '🎨',
      'tech-1': '💻',
      'business-1': '🏢',
      'casual-1': '😎',
      'formal-1': '🎩',
      'interviewer-classic-1': '👩‍💼',
      'interviewer-classic-2': '👨‍💻',
      'interviewer-classic-3': '👩‍💼',
      'interviewer-classic-4': '👨‍💼',
      'interviewer-modern-1': '🧑‍🏫',
      'interviewer-modern-2': '🎯',
    }
    return emojiMap[avatarId] || (type === 'user' ? '👤' : '👥')
  }

  function getAvatarName(avatarId: string, type: 'user' | 'interviewer'): string {
    const nameMap: Record<string, string> = {
      'professional-1': 'Professional',
      'creative-1': 'Creative',
      'tech-1': 'Tech',
      'business-1': 'Business',
      'casual-1': 'Casual',
      'formal-1': 'Formal',
      'interviewer-classic-1': 'Sofia',
      'interviewer-classic-2': 'Marco',
      'interviewer-classic-3': 'Elena',
      'interviewer-classic-4': 'David',
      'interviewer-modern-1': 'Alex',
      'interviewer-modern-2': 'Jordan',
    }
    return nameMap[avatarId] || 'Avatar'
  }

  function getAvatarGradient(avatarId: string): string {
    const gradients: Record<string, string> = {
      'professional-1': 'bg-gradient-to-br from-blue-500 to-blue-600',
      'creative-1': 'bg-gradient-to-br from-purple-500 to-purple-600',
      'tech-1': 'bg-gradient-to-br from-green-500 to-green-600',
      'business-1': 'bg-gradient-to-br from-red-500 to-red-600',
      'casual-1': 'bg-gradient-to-br from-orange-500 to-orange-600',
      'formal-1': 'bg-gradient-to-br from-slate-700 to-slate-900',
      'interviewer-classic-1': 'bg-gradient-to-br from-purple-500 to-purple-600',
      'interviewer-classic-2': 'bg-gradient-to-br from-blue-500 to-blue-600',
      'interviewer-classic-3': 'bg-gradient-to-br from-purple-500 to-indigo-600',
      'interviewer-classic-4': 'bg-gradient-to-br from-green-500 to-emerald-600',
      'interviewer-modern-1': 'bg-gradient-to-br from-red-500 to-rose-600',
      'interviewer-modern-2': 'bg-gradient-to-br from-orange-500 to-yellow-600',
    }
    return gradients[avatarId] || 'bg-gradient-to-br from-slate-500 to-slate-600'
  }

  function getInterviewerRole(interviewerId: string): string {
    const roles: Record<string, string> = {
      'interviewer-classic-1': 'Reclutadora de Talento',
      'interviewer-classic-2': 'Manager Senior de Ingeniería',
      'interviewer-classic-3': 'VP de Talento Estratégico',
      'interviewer-classic-4': 'Tech Lead Senior',
      'interviewer-modern-1': 'Product Manager',
      'interviewer-modern-2': 'Consultor CEO',
    }
    return roles[interviewerId] || 'Entrevistador'
  }

  function getInterviewerFocus(interviewerId: string): string {
    const focuses: Record<string, string> = {
      'interviewer-classic-1': 'Sofia busca candidatos con habilidades de comunicación sólidas, empatía y capacidad de trabajo en equipo. Valora la autenticidad y cómo te relacionas con otros.',
      'interviewer-classic-2': 'Marco se enfoca en tu arquitectura mental, resolución de problemas complejos y experiencia técnica. Quiere entender tu proceso de decisión.',
      'interviewer-classic-3': 'Elena busca liderazgo potencial, visión estratégica y capacidad de influir en otros. Valora candidatos que piensan a largo plazo.',
      'interviewer-classic-4': 'David evalúa tu competencia técnica, calidad del código y metodología de trabajo. Busca desarrolladores que practiquen buenos hábitos.',
      'interviewer-modern-1': 'Alex se enfoca en pensamiento orientado al usuario, análisis de datos y capacidad de iterar. Valora candidatos que entienden el impacto comercial.',
      'interviewer-modern-2': 'Jordan busca potencial de liderazgo, visión de negocio y capacidad de ejecutar bajo presión. Quiere entender tu motivación y ambición.',
    }
    return focuses[interviewerId] || 'Buscando candidatos con talento y potencial'
  }
}
