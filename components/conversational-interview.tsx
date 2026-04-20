'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useContextValidation } from '@/lib/hooks/use-context-validation'
import { useAvatarPreferences } from '@/lib/hooks/use-avatar-preferences'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { InterviewerSelector } from '@/components/interviewer-selector'
import { InterviewTips } from '@/components/interview-tips'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Mic, MicOff, Video, VideoOff, RotateCcw, Send, Pause, Play, AlertCircle, AlertTriangle, Zap, Lightbulb } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface ConversationalInterviewProps {
  role: string
  industry: string
  level: 'basico' | 'intermedio' | 'avanzado'
  onComplete?: (feedback: any) => void
}

const INTERVIEW_QUESTIONS = {
  basico: [
    'Cuéntame sobre ti y por qué te interesa este rol de {role}',
    '¿Cuál es tu mayor fortaleza para este puesto?',
    '¿En qué área quieres seguir creciendo?'
  ],
  intermedio: [
    'Describe una situación donde enfrentaste un desacuerdo en equipo y cómo lo resolviste',
    'Cuéntame cómo manejas la presión con múltiples prioridades simultáneamente',
    'Dame un ejemplo de liderazgo que demostraste sin ser el jefe'
  ],
  avanzado: [
    'Imagina 3 prioridades en conflicto y solo puedes hacer una. ¿Cómo decides y por qué?',
    'Cuéntame sobre un gran fracaso. ¿Qué aprendiste y cómo cambió tu perspectiva?',
    '¿Cómo manejarías decirle a tu manager que está equivocado en una decisión crítica?'
  ]
}

export function ConversationalInterview({
  role,
  industry,
  level,
  onComplete
}: ConversationalInterviewProps) {
  const { user } = useAuthRedirect()
  const { validateContextRelevance } = useContextValidation()
  const { preferences, updatePreferences } = useAvatarPreferences(user?.id)
  const [stage, setStage] = useState<'setup' | 'interview' | 'feedback'>('setup')
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [interviewProgress, setInterviewProgress] = useState(0)
  const [interviewerMessage, setInterviewerMessage] = useState('')
  const [userResponses, setUserResponses] = useState<string[]>([])
  const [userInput, setUserInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [feedbackData, setFeedbackData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedInterviewerId, setSelectedInterviewerId] = useState(preferences?.interviewer_avatar_id || 'interviewer-classic-1')
  const [sessionStartTime, setSessionStartTime] = useState<number | null>(null)
  const [freeTipsUsed, setFreeTipsUsed] = useState(0)
  const [premiumTipsUsed, setPremiumTipsUsed] = useState(0)
  const [dtcBalance, setDtcBalance] = useState(0)
  const [sessionId] = useState(`session-${Date.now()}-${Math.random()}`)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Inicializar cámara
  useEffect(() => {
    if (stage === 'interview' && videoEnabled) {
      const initializeCamera = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
            audio: audioEnabled
          })
          
          streamRef.current = stream
          if (videoRef.current) {
            videoRef.current.srcObject = stream
          }
        } catch (err) {
          setError('No se pudo acceder a la cámara. Verifica permisos.')
          console.error('[v0] Camera error:', err)
        }
      }

      initializeCamera()
      return () => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop())
        }
      }
    }
  }, [stage, videoEnabled, audioEnabled])

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [interviewerMessage])

  const startInterview = async () => {
    // Save selected interviewer to preferences
    if (selectedInterviewerId !== preferences?.interviewer_avatar_id) {
      await updatePreferences({ interviewer_avatar_id: selectedInterviewerId })
    }
    setStage('interview')
    setCurrentQuestionIdx(0)
    const firstQuestion = INTERVIEW_QUESTIONS[level][0].replace('{role}', role)
    setInterviewerMessage(firstQuestion)
  }

  const clearError = () => setError(null)

  const handleSendResponse = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userInput.trim()) return

    try {
      setIsLoading(true)
      clearError()

      // Get the current question text for context validation
      const currentQuestion = INTERVIEW_QUESTIONS[level][currentQuestionIdx]?.replace('{role}', role) || ''

      // Validate that response is contextually relevant to the question
      const validation = await validateContextRelevance(
        currentQuestion,
        userInput,
        'a3-conversational-interview'
      )

      if (!validation.isRelevant) {
        setError(validation.reason || 'Tu respuesta no está relacionada con la pregunta. Por favor, responde sobre el tema preguntado.')
        setIsLoading(false)
        return
      }

      const newResponses = [...userResponses, userInput]
      setUserResponses(newResponses)
      setUserInput('')

      // Enviar a OpenAI
      const response = await fetch('/api/a3/conversational-interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            { role: 'system', content: `Eres entrevistador para ${role} en ${industry}` },
            { role: 'user', content: userInput }
          ],
          role,
          industry,
          level,
          questionIndex: currentQuestionIdx
        })
      })

      if (!response.ok) throw new Error('API error')

      // Parse streaming response
      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let fullResponse = ''

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value)
          const lines = chunk.split('\n')

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6))
                if (data.choices?.[0]?.delta?.content) {
                  fullResponse += data.choices[0].delta.content
                  setInterviewerMessage(fullResponse)
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }
      }

      // Update progress
      const newIdx = currentQuestionIdx + 1
      setCurrentQuestionIdx(newIdx)
      setInterviewProgress((newIdx / INTERVIEW_QUESTIONS[level].length) * 100)

      // Check if interview complete
      if (newIdx >= INTERVIEW_QUESTIONS[level].length) {
        setStage('feedback')
        setFeedbackData({
          totalResponses: newResponses.length,
          level,
          role,
          score: Math.round(Math.random() * 40 + 60) // 60-100
        })
      }
    } catch (err) {
      setError('Error al enviar respuesta. Intenta de nuevo.')
      console.error('[v0] Send response error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (stage === 'setup') {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Entrevista Conversacional</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-semibold">Configuración</h3>
              <p className="text-muted-foreground dark:text-muted-foreground">
                Puesto: <Badge>{role}</Badge> | Industria: <Badge>{industry}</Badge> | Nivel: <Badge>{level}</Badge>
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="video"
                  checked={videoEnabled}
                  onChange={(e) => setVideoEnabled(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="video" className="text-sm">Habilitar cámara</label>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="audio"
                  checked={audioEnabled}
                  onChange={(e) => setAudioEnabled(e.target.checked)}
                  className="rounded"
                />
                <label htmlFor="audio" className="text-sm">Habilitar micrófono</label>
              </div>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Se te harán preguntas una a una. Tómate tu tiempo para responder de forma clara y profesional.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        {/* Interviewer Selector */}
        <InterviewerSelector
          value={selectedInterviewerId}
          onChange={setSelectedInterviewerId}
        />

        <Button onClick={startInterview} className="w-full" size="lg">
          Comenzar Entrevista
        </Button>
      </div>
    )
  }

  if (stage === 'interview') {
    const interviewerImage = getAvatarImage(selectedInterviewerId)
    
    return (
      <div className="max-w-7xl mx-auto p-6 space-y-4">
        {/* 60/40 Split Layout: User Video (60%) + Interviewer Photo (40%) */}
        <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-4 min-h-96">
          {/* User Video Feed (60%) */}
          <Card className="relative overflow-hidden lg:col-span-1">
            <CardContent className="p-0 h-full">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full bg-black aspect-video lg:aspect-auto object-cover"
              />
              {!videoEnabled && (
                <div className="w-full h-full bg-muted/20 dark:bg-transparent flex items-center justify-center">
                  <p className="text-muted-foreground">Cámara deshabilitada</p>
                </div>
              )}

              {/* Controls Overlay */}
              <div className="absolute bottom-4 left-4 flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setVideoEnabled(!videoEnabled)}
                  className="bg-background/80"
                >
                  {videoEnabled ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setAudioEnabled(!audioEnabled)}
                  className="bg-background/80"
                >
                  {audioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
                </Button>
              </div>

              {/* User Label */}
              <div className="absolute top-4 left-4 bg-background/80 px-3 py-1 rounded-full text-sm font-semibold">
                Tú
              </div>
            </CardContent>
          </Card>

          {/* Interviewer Photo (40%) */}
          <Card className="relative overflow-hidden hidden lg:block">
            <CardContent className="p-0 h-full">
              {interviewerImage ? (
                <div className="relative w-full h-full">
                  <Image
                    src={interviewerImage}
                    alt={getAvatarName(selectedInterviewerId, 'interviewer')}
                    fill
                    className="object-cover"
                    priority
                  />
                  {/* Overlay info */}
                  <div className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-all flex flex-col justify-end p-4">
                    <div className="bg-background/90 backdrop-blur-sm rounded-lg p-3">
                      <p className="font-semibold text-sm">{getAvatarName(selectedInterviewerId, 'interviewer')}</p>
                      <p className="text-xs text-muted-foreground">Entrevistador</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full h-full bg-muted/20 flex flex-col items-center justify-center">
                  <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl mb-4 ${getAvatarGradient(selectedInterviewerId)} shadow-lg`}>
                    {getAvatarEmoji(selectedInterviewerId, 'interviewer')}
                  </div>
                  <p className="font-semibold">{getAvatarName(selectedInterviewerId, 'interviewer')}</p>
                  <p className="text-xs text-muted-foreground">Entrevistador</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Pregunta {currentQuestionIdx + 1} de {INTERVIEW_QUESTIONS[level].length}</span>
            <span>{Math.round(interviewProgress)}%</span>
          </div>
          <Progress value={interviewProgress} />
        </div>

        {/* Error */}
        {error && (
          <Alert variant="destructive" className="border-red/30 bg-red/5 dark:bg-red/20">
            <AlertTriangle className="h-4 w-4 text-red" />
            <AlertDescription className="text-red dark:text-red/20 ml-2">{error}</AlertDescription>
          </Alert>
        )}

        {/* Chat Area */}
        <Card>
          <CardContent className="p-4 space-y-4">
            {/* Interviewer Messages */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {interviewerMessage && (
                <div className="bg-muted/10 dark:bg-transparent p-3 rounded-lg">
                  <p className="text-sm font-semibold text-muted-foreground dark:text-muted/30 mb-1">Entrevistador</p>
                  <p className="text-sm">{interviewerMessage}</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* AI Tips Panel */}
            <InterviewTips
              questionText={interviewerMessage}
              userResponse={userResponses[currentQuestionIdx] || ''}
              questionContext={`Role: ${role}, Industry: ${industry}, Level: ${level}`}
              difficulty={level}
              sessionId={sessionId}
              userId={user?.id || ''}
              onTipGenerated={(tip) => console.log('[v0] Tip generated:', tip)}
            />

            {/* Input */}
            <form onSubmit={handleSendResponse} className="flex gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Tu respuesta..."
                className="flex-1 px-3 py-2 border rounded-[28px] bg-background"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading} size="sm">
                {isLoading ? <RotateCcw className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (stage === 'feedback') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Feedback de la Entrevista</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted/10 dark:bg-transparent rounded-lg">
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">Puntuación</p>
                <p className="text-3xl font-bold text-cyan">{feedbackData?.score}/100</p>
              </div>
              <div className="p-4 bg-muted/10 dark:bg-transparent rounded-lg">
                <p className="text-sm text-muted-foreground dark:text-muted-foreground">Respuestas Registradas</p>
                <p className="text-3xl font-bold">{feedbackData?.totalResponses}</p>
              </div>
            </div>

            <Button onClick={() => onComplete?.(feedbackData)} className="w-full">
              Completar
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}

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
    'interviewer-modern-1': 'Alexandra',
    'interviewer-modern-2': 'Bruno',
  }
  return nameMap[avatarId] || 'Avatar'
}

function getAvatarImage(avatarId: string): string | null {
  const imageMap: Record<string, string> = {
    'interviewer-classic-1': '/images/interviewers/sofia.jpg',
    'interviewer-classic-2': '/images/interviewers/marco.jpg',
    'interviewer-classic-3': '/images/interviewers/elena.jpg',
    'interviewer-classic-4': '/images/interviewers/david.jpg',
    'interviewer-modern-1': '/images/interviewers/alexandra.jpg',
    'interviewer-modern-2': '/images/interviewers/bruno.jpg',
  }
  return imageMap[avatarId] || null
}

function getAvatarGradient(avatarId: string): string {
  const gradients: Record<string, string> = {
    'professional-1': 'bg-background',
    'creative-1': 'bg-background',
    'tech-1': 'bg-background',
    'business-1': 'bg-red',
    'casual-1': 'bg-background',
    'formal-1': 'bg-background',
    'interviewer-classic-1': 'bg-background',
    'interviewer-classic-2': 'bg-background',
    'interviewer-classic-3': 'bg-background',
    'interviewer-classic-4': 'bg-background',
    'interviewer-modern-1': 'bg-background',
    'interviewer-modern-2': 'bg-background',
  }
  return gradients[avatarId] || 'bg-background'
}
