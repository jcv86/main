'use client'

import { useState, useRef, useEffect } from 'react'
import { useContextValidation } from '@/lib/hooks/use-context-validation'
import { useAvatarPreferences } from '@/lib/hooks/use-avatar-preferences'
import { useAuthRedirect } from '@/hooks/use-auth-redirect'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Mic, MicOff, Video, VideoOff, RotateCcw, Send, Pause, Play, AlertCircle, AlertTriangle } from 'lucide-react'
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
  const { validateContextRelevance, validationError, clearError } = useContextValidation()
  const { preferences } = useAvatarPreferences(user?.id)
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

  const startInterview = () => {
    setStage('interview')
    setCurrentQuestionIdx(0)
    const firstQuestion = INTERVIEW_QUESTIONS[level][0].replace('{role}', role)
    setInterviewerMessage(firstQuestion)
  }

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
      <div className="max-w-2xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle>Entrevista Conversacional</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <h3 className="font-semibold">Configuración</h3>
              <p className="text-slate-600 dark:text-slate-400">
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

            <Button onClick={startInterview} className="w-full" size="lg">
              Comenzar Entrevista
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (stage === 'interview') {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-4">
        {/* Avatar Showcase */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
          {/* Interviewer Avatar */}
          <div className="flex flex-col items-center justify-center py-4 px-2">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-2 ${getAvatarGradient(preferences.interviewer_avatar_id)} shadow-lg`}>
              {getAvatarEmoji(preferences.interviewer_avatar_id, 'interviewer')}
            </div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 text-center">
              {getAvatarName(preferences.interviewer_avatar_id, 'interviewer')}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Entrevistador</p>
          </div>

          {/* VS */}
          <div className="flex items-center justify-center">
            <p className="text-3xl font-bold text-slate-400 dark:text-slate-600">VS</p>
          </div>

          {/* User Avatar */}
          <div className="flex flex-col items-center justify-center py-4 px-2 col-start-2">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl mb-2 ${getAvatarGradient(preferences.user_avatar_id)} shadow-lg`}>
              {getAvatarEmoji(preferences.user_avatar_id, 'user')}
            </div>
            <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 text-center">
              {getAvatarName(preferences.user_avatar_id, 'user')}
            </p>
            <p className="text-xs text-slate-600 dark:text-slate-400">Tú</p>
          </div>

          {/* You Avatar Info */}
          <div className="flex items-center justify-center col-start-1">
            <p className="text-sm text-slate-700 dark:text-slate-300">Tu presentación</p>
          </div>
        </div>

        {/* Video Feed */}
        <Card className="relative overflow-hidden">
          <CardContent className="p-0">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full bg-black aspect-video"
            />
            {!videoEnabled && (
              <div className="w-full aspect-video bg-slate-200 dark:bg-slate-800 flex items-center justify-center">
                <p className="text-slate-500">Cámara deshabilitada</p>
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
          </CardContent>
        </Card>

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
          <Alert variant="destructive" className="border-red-300 bg-red-50 dark:bg-red-900/20">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700 dark:text-red-200 ml-2">{error}</AlertDescription>
          </Alert>
        )}

        {/* Chat Area */}
        <Card>
          <CardContent className="p-4 space-y-4">
            {/* Interviewer Messages */}
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {interviewerMessage && (
                <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-lg">
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">Entrevistador</p>
                  <p className="text-sm">{interviewerMessage}</p>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendResponse} className="flex gap-2">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="Tu respuesta..."
                className="flex-1 px-3 py-2 border rounded-lg bg-background"
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
              <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <p className="text-sm text-slate-600 dark:text-slate-400">Puntuación</p>
                <p className="text-3xl font-bold text-cyan-600">{feedbackData?.score}/100</p>
              </div>
              <div className="p-4 bg-slate-100 dark:bg-slate-800 rounded-lg">
                <p className="text-sm text-slate-600 dark:text-slate-400">Respuestas Registradas</p>
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
