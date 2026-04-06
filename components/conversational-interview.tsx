'use client'

import { useState, useRef, useEffect } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from '@ai-sdk/react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Mic, MicOff, Video, VideoOff, RotateCcw, Send, Pause, Play } from 'lucide-react'

interface ConversationalInterviewProps {
  role: string
  industry: string
  level: 'basico' | 'intermedio' | 'avanzado'
  onComplete?: (feedback: any) => void
}

const INTERVIEW_PROMPTS = {
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
  const [stage, setStage] = useState<'setup' | 'interview' | 'feedback'>('setup')
  const [videoEnabled, setVideoEnabled] = useState(true)
  const [audioEnabled, setAudioEnabled] = useState(true)
  const [isRecording, setIsRecording] = useState(false)
  const [recordedSegments, setRecordedSegments] = useState<Blob[]>([])
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
  const [interviewProgress, setInterviewProgress] = useState(0)
  const [feedbackData, setFeedbackData] = useState<any>(null)
  
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: '/api/a3/conversational-interview',
      prepareSendMessagesRequest: ({ messages }) => ({
        body: {
          messages,
          role,
          industry,
          level,
          questionIndex: currentQuestionIdx,
          videoFrame: recordedSegments.length > 0 ? 'available' : undefined
        }
      })
    }),
    system: `Eres un entrevistador profesional experimentado. Vas a conducir una entrevista para el puesto de ${role} en la industria ${industry}. 
    
Tu rol:
- Realiza preguntas uno a uno de forma conversacional y natural
- Espera respuestas completas (2-3 minutos idealmente)
- Da follow-ups inteligentes basados en respuestas
- Mantén un tono profesional pero amable
- Al final, proporciona feedback constructivo y puntuación

Sé siempre respetuoso, escucha activamente, y adapta tus preguntas si es necesario.`
  })

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

          // Iniciar recording
          const mediaRecorder = new MediaRecorder(stream, {
            mimeType: 'video/webm;codecs=vp9,opus'
          })
          mediaRecorderRef.current = mediaRecorder

          mediaRecorder.ondataavailable = (event) => {
            if (event.data.size > 0) {
              setRecordedSegments(prev => [...prev, event.data])
            }
          }

          mediaRecorder.start()
          setIsRecording(true)
        } catch (error) {
          console.error('[v0] Error accessing camera:', error)
        }
      }

      initializeCamera()

      return () => {
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop())
        }
        if (mediaRecorderRef.current && isRecording) {
          mediaRecorderRef.current.stop()
          setIsRecording(false)
        }
      }
    }
  }, [stage, videoEnabled, audioEnabled])

  const startInterview = () => {
    setStage('interview')
    const firstQuestion = INTERVIEW_PROMPTS[level][0].replace('{role}', role)
    sendMessage({ text: `Inicia la entrevista con: "${firstQuestion}"` })
  }

  const submitResponse = (userResponse: string) => {
    sendMessage({ text: userResponse })
    
    if (currentQuestionIdx < INTERVIEW_PROMPTS[level].length - 1) {
      setCurrentQuestionIdx(prev => prev + 1)
      setInterviewProgress(((currentQuestionIdx + 1) / INTERVIEW_PROMPTS[level].length) * 100)
    } else {
      // Last question answered, request feedback
      setTimeout(() => {
        sendMessage({ text: 'Por favor proporciona feedback constructivo y una puntuación de 1-10 de mi desempeño general en esta entrevista.' })
        setStage('feedback')
      }, 1000)
    }
  }

  const toggleVideo = async () => {
    if (streamRef.current) {
      streamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled
      })
      setVideoEnabled(!videoEnabled)
    }
  }

  const toggleAudio = async () => {
    if (streamRef.current) {
      streamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled
      })
      setAudioEnabled(!audioEnabled)
    }
  }

  const resetInterview = () => {
    setStage('setup')
    setCurrentQuestionIdx(0)
    setInterviewProgress(0)
    setRecordedSegments([])
    setFeedbackData(null)
  }

  if (stage === 'setup') {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="bg-gradient-to-r from-cyan-600 to-teal-600 text-white">
          <CardTitle className="text-2xl">Simulación de Entrevista Conversacional</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-100">Posición: {role}</h3>
              <p className="text-sm text-blue-800 dark:text-blue-200">Industria: {industry} • Nivel: {level}</p>
            </div>

            <div>
              <h4 className="font-semibold mb-3">¿Cómo funciona?</h4>
              <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                <li className="flex items-start gap-2">
                  <span className="text-cyan-600 mt-1">•</span>
                  <span>Tu cámara estará activa durante toda la entrevista</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-600 mt-1">•</span>
                  <span>Responde en voz alta y con naturalidad</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-600 mt-1">•</span>
                  <span>IA analizará tu lenguaje corporal, tono y contenido</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-cyan-600 mt-1">•</span>
                  <span>Recibirás feedback personalizado al final</span>
                </li>
              </ul>
            </div>
          </div>

          <Button 
            onClick={startInterview}
            className="w-full bg-cyan-600 hover:bg-cyan-700 text-white py-6 text-lg"
          >
            <Video className="w-5 h-5 mr-2" />
            Comenzar Entrevista
          </Button>
        </CardContent>
      </Card>
    )
  }

  if (stage === 'interview') {
    return (
      <div className="w-full max-w-4xl mx-auto space-y-4">
        {/* Video Feed */}
        <Card className="overflow-hidden">
          <div className="relative bg-black aspect-video flex items-center justify-center">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
              style={{ transform: 'scaleX(-1)' }}
            />
            
            {/* Controls Overlay */}
            <div className="absolute bottom-4 left-4 right-4 flex gap-2 justify-center">
              <Button
                size="sm"
                variant={audioEnabled ? 'default' : 'destructive'}
                onClick={toggleAudio}
              >
                {audioEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              </Button>
              <Button
                size="sm"
                variant={videoEnabled ? 'default' : 'destructive'}
                onClick={toggleVideo}
              >
                {videoEnabled ? <Video className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              </Button>
            </div>

            {/* Recording Indicator */}
            {isRecording && (
              <div className="absolute top-4 right-4 flex items-center gap-2 bg-red-600 text-white px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span className="text-xs font-semibold">Grabando</span>
              </div>
            )}
          </div>
        </Card>

        {/* Progress */}
        <Card>
          <CardContent className="pt-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Pregunta {currentQuestionIdx + 1} de {INTERVIEW_PROMPTS[level].length}</span>
                <Badge variant="outline">{Math.round(interviewProgress)}%</Badge>
              </div>
              <Progress value={interviewProgress} className="h-2" />
            </div>
          </CardContent>
        </Card>

        {/* Chat/Interview Conversation */}
        <Card className="h-96 overflow-y-auto">
          <CardContent className="pt-4 space-y-4">
            {messages.length === 0 ? (
              <p className="text-slate-500 text-center py-8">Cargando entrevistador...</p>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-xs p-3 rounded-lg ${
                    msg.role === 'assistant'
                      ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100'
                      : 'bg-cyan-600 text-white'
                  }`}>
                    <p className="text-sm">
                      {msg.content}
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Input */}
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Escribe tu respuesta aquí..."
            className="flex-1 px-4 py-2 border rounded-lg dark:bg-slate-800 dark:border-slate-700"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                submitResponse(e.currentTarget.value)
                e.currentTarget.value = ''
              }
            }}
          />
          <Button size="sm" onClick={() => {
            const input = document.querySelector('input')
            if (input?.value) {
              submitResponse(input.value)
              input.value = ''
            }
          }}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    )
  }

  if (stage === 'feedback') {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
          <CardTitle>Feedback de tu Entrevista</CardTitle>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-4">
            {messages.length > 0 && (
              <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <p className="text-sm text-slate-700 dark:text-slate-300">
                  {messages[messages.length - 1]?.content}
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <Button onClick={resetInterview} variant="outline" className="flex-1">
              <RotateCcw className="w-4 h-4 mr-2" />
              Intentar de Nuevo
            </Button>
            <Button onClick={() => onComplete?.(feedbackData)} className="flex-1">
              Ir a Dashboard
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }
}
