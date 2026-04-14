'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Mic, MicOff, Video, VideoOff, RotateCcw, Send, Copy, Check, Zap, Target, MessageSquare, TrendingUp, Lightbulb, HelpCircle } from 'lucide-react'

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
  
  const [stage, setStage] = useState<'setup' | 'question' | 'response' | 'feedback' | 'complete'>('setup')
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [userResponse, setUserResponse] = useState('')
  const [attempts, setAttempts] = useState<Record<string, AttemptResult[]>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showCoachTip, setShowCoachTip] = useState(true)
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const questions = INTERVIEW_QUESTIONS[level]
  const currentQuestion = questions[currentQuestionIdx]
  const currentAttempts = attempts[currentQuestion.id] || []

  // Coach tips contextuales basadas en la pregunta
  const coachTips = {
    behavioral: 'Usa STAR: Situación, Tarea, Acción, Resultado. Incluye números y impacto.',
    situational: 'Sé específico con tu proceso de decisión. Muestra pensamiento estratégico.',
    technical: 'Explica tu rol exactamente. Valida con métricas cuando sea posible.'
  }

  // Initialize camera and audio recording
  useEffect(() => {
    if (stage === 'response' && videoEnabled) {
      initializeCameraAndAudio()
      return () => stopCameraAndAudio()
    }
  }, [stage, videoEnabled])

  const initializeCameraAndAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: true
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
      }
      
      // Setup media recorder for audio
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        const url = URL.createObjectURL(audioBlob)
        setRecordedAudioUrl(url)
        audioChunksRef.current = []
      }
    } catch (err) {
      setError('No se pudo acceder a cámara/micrófono. Verifica permisos.')
      console.error('[v0] Media error:', err)
    }
  }

  const stopCameraAndAudio = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop()
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
    }
  }

  const toggleRecording = () => {
    if (!mediaRecorderRef.current) return

    if (isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    } else {
      audioChunksRef.current = []
      mediaRecorderRef.current.start()
      setIsRecording(true)
    }
  }

  const handleStartInterview = () => {
    setStage('question')
    setCurrentQuestionIdx(0)
  }

  const handleSubmitResponse = async () => {
    if (!userResponse.trim()) return

    try {
      setIsLoading(true)
      setError(null)

      // Simulate scoring - in production would call AI API
      const score = Math.floor(Math.random() * 35 + 65) // 65-100
      const followUp = generateFollowUp(userResponse, currentQuestion)

      const newAttempt: AttemptResult = {
        attemptNumber: currentAttempts.length + 1,
        userResponse,
        score,
        followUp,
        feedback: {
          strengths: [
            'Respuesta clara y estructurada',
            'Uso de ejemplos concretos',
            'Impacto medible'
          ],
          improvements: [
            'Profundizar en el resultado',
            'Reducir el tiempo de respuesta',
            'Conectar con los valores de la empresa'
          ],
          staAnalysis: {
            situation: 'Bien planteado el contexto',
            task: 'Tu responsabilidad es clara',
            action: 'Acciones específicas mencionadas',
            result: 'Impacto demostrado'
          }
        }
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

            <Button
              onClick={handleStartInterview}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12 text-lg"
            >
              Comenzar Simulación
            </Button>
          </CardContent>
        </Card>
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
        <Card>
          <CardHeader>
            <CardTitle>Graba tu respuesta</CardTitle>
            <CardDescription>Mira la pregunta y responde como lo harías en una entrevista real</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Question Display */}
            <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
              <p className="font-semibold text-slate-900 dark:text-white">
                {currentQuestion.text}
              </p>
            </div>

            {/* Video Preview */}
            <div className="relative bg-black rounded-lg overflow-hidden" style={{ aspectRatio: '16/9' }}>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  size="sm"
                  variant={videoEnabled ? 'default' : 'destructive'}
                  onClick={() => setVideoEnabled(!videoEnabled)}
                >
                  {videoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
                </Button>
                <Button
                  size="sm"
                  variant={audioEnabled ? 'default' : 'destructive'}
                  onClick={() => setAudioEnabled(!audioEnabled)}
                >
                  {audioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Coach Helper Tip */}
            {showCoachTip && (
              <Alert className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/20">
                <Lightbulb className="h-4 w-4 text-amber-600" />
                <AlertDescription className="text-amber-900 dark:text-amber-200">
                  <strong>Coach Tip:</strong> {coachTips[currentQuestion.category]}
                </AlertDescription>
              </Alert>
            )}

            {/* Recording Controls */}
            <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-lg space-y-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-slate-400'}`} />
                  <span className="text-sm font-medium">
                    {isRecording ? 'Grabando...' : 'Listo para grabar'}
                  </span>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowCoachTip(!showCoachTip)}
                  className="text-xs"
                >
                  <HelpCircle className="w-4 h-4 mr-1" />
                  {showCoachTip ? 'Ocultar' : 'Mostrar'} tip
                </Button>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={toggleRecording}
                  variant={isRecording ? 'destructive' : 'default'}
                  className="flex-1"
                  disabled={!mediaRecorderRef.current}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="w-4 h-4 mr-2" />
                      Detener Grabación
                    </>
                  ) : (
                    <>
                      <Mic className="w-4 h-4 mr-2" />
                      Grabar Audio
                    </>
                  )}
                </Button>
              </div>

              {recordedAudioUrl && (
                <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded border border-green-300 dark:border-green-800">
                  <p className="text-sm text-green-900 dark:text-green-200 mb-2">Audio grabado:</p>
                  <audio src={recordedAudioUrl} controls className="w-full h-8" />
                </div>
              )}
            </div>

            {/* Response Input */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold">Tu respuesta (escrita o transcrita):</label>
              <textarea
                value={userResponse}
                onChange={(e) => setUserResponse(e.target.value)}
                placeholder="Escribe tu respuesta aquí (puedes grabar y transcribir)..."
                className="w-full p-4 border rounded-lg dark:bg-slate-900 dark:border-slate-700 min-h-24"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleSubmitResponse}
              disabled={!userResponse.trim() || isLoading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12"
            >
              <Send className="w-4 h-4 mr-2" />
              Enviar Respuesta
            </Button>
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
          <CardContent className="space-y-4">
            <div className="text-center py-6">
              <div className="text-5xl font-bold text-emerald-600 mb-2">
                {Object.values(attempts).flat().reduce((acc, a) => acc + a.score, 0) / Math.max(1, Object.values(attempts).flat().length)}
              </div>
              <p className="text-slate-600">Puntuación Promedio</p>
            </div>
            <p className="text-center text-slate-700 dark:text-slate-300">
              Completaste {questions.length} preguntas con un total de {Object.values(attempts).flat().length} intentos.
            </p>
            <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white h-12">
              Volver al Dashboard
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
