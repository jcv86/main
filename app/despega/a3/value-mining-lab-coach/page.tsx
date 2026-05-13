'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  ArrowLeft, 
  CheckCircle2, 
  Video,
  AlertCircle,
  Lightbulb,
  MessageSquare,
  Mic,
  ChevronRight,
  Star,
  Award,
  BookOpen,
  Send
} from 'lucide-react'
import { CameraMicrophoneTest } from '@/components/camera-microphone-test'

const MODULE_XP = 100

// Value mining data structures
const VALUE_CATEGORIES = [
  {
    id: 'time',
    name: 'Ahorro de Tiempo',
    description: '¿Hiciste algo más rápido o ahorraste tiempo?',
    examples: ['Tiempo de procesamiento reducido', 'Flujos de trabajo optimizados', 'Tareas automatizadas'],
    icon: 'Zap'
  },
  {
    id: 'money',
    name: 'Reducción de Costos',
    description: '¿Ayudaste a ahorrar dinero o reducir gastos?',
    examples: ['Negociaste mejores tarifas', 'Redujiste desperdicio', 'Encontraste soluciones eficientes'],
    icon: 'DollarSign'
  },
  {
    id: 'quality',
    name: 'Mejora de Calidad',
    description: '¿Mejoraste la calidad o redujiste errores?',
    examples: ['Menos quejas', 'Mejor precisión', 'Estándares superiores'],
    icon: 'Star'
  },
  {
    id: 'growth',
    name: 'Crecimiento e Ingresos',
    description: '¿Ayudaste a crecer el negocio o aumentar ingresos?',
    examples: ['Nuevos clientes', 'Aumento de ventas', 'Expansión de mercado'],
    icon: 'TrendingUp'
  },
  {
    id: 'people',
    name: 'Impacto en Equipo',
    description: '¿Ayudaste a que las personas tengan éxito?',
    examples: ['Capacitaste colegas', 'Mejoraste la moral', 'Mejor colaboración'],
    icon: 'Users'
  },
  {
    id: 'process',
    name: 'Innovación de Procesos',
    description: '¿Creaste o mejoraste un proceso?',
    examples: ['Nuevos procedimientos', 'Sistemas mejores', 'Prácticas estandarizadas'],
    icon: 'Cog'
  }
]

// Coach questions for interaction
const COACH_QUESTIONS = [
  {
    id: 1,
    question: 'Hola, me gustaría conocer sobre un logro reciente que te hace sentir orgulloso. ¿Podrías compartir un ejemplo?',
    category: 'Introducción'
  },
  {
    id: 2,
    question: 'Bueno, ahora que tengo un ejemplo, ¿qué tipo de valor generaste? ¿Fue ahorro de tiempo, dinero, o mejora de calidad?',
    category: 'Categoría de valor'
  },
  {
    id: 3,
    question: 'Excelente. Ahora quiero que lo conviertas en una declaración poderosa usando el método CAR o PAR. ¿Podrías repetirlo?',
    category: 'Transformación'
  },
  {
    id: 4,
    question: 'Perfecto. Ahora practiquemos cómo dirías esto en una entrevista. ¿Listo?',
    category: 'Práctica'
  }
]

export default function ValueMiningLabCoach() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  
  const [userResponse, setUserResponse] = useState('')
  const [isReadyToContinue, setIsReadyToContinue] = useState(false)
  const [showCameraTest, setShowCameraTest] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [sessionActive, setSessionActive] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isRecording, setIsRecording] = useState(false)
  const [hasAudioRecording, setHasAudioRecording] = useState(false)
  const [responseMode, setResponseMode] = useState<'text' | 'audio'>('text')

  const handleCameraTestComplete = (passed: boolean) => {
    if (passed) {
      setShowCameraTest(false)
      setIsReadyToContinue(true)
    }
  }

  const handleStartSession = () => {
    setSessionActive(true)
  }

  // Capture user's camera when ready
  useEffect(() => {
    if (!isReadyToContinue || !videoRef.current) return

    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true
        })
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      } catch (err) {
        console.error('[v0] Error capturing camera:', err)
      }
    }

    startCamera()

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [isReadyToContinue])

  // Start audio recording
  const startAudioRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' })
        console.log('[v0] Audio recording complete:', audioBlob.size, 'bytes')
        setHasAudioRecording(true)
        
        // Stop all audio tracks
        stream.getTracks().forEach(track => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (err) {
      console.error('[v0] Error starting audio recording:', err)
    }
  }

  const stopAudioRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleSubmitResponse = () => {
    if (responseMode === 'audio' && !hasAudioRecording) {
      console.log('[v0] No audio recording to submit')
      return
    }
    if (responseMode === 'text' && !userResponse.trim()) {
      console.log('[v0] No text response to submit')
      return
    }

    // Simulate coach feedback
    console.log('[v0] Response submitted:', responseMode === 'audio' ? 'Audio' : userResponse)
    
    // Move to next question
    if (currentQuestion < COACH_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setProgress(((currentQuestion + 1) / COACH_QUESTIONS.length) * 100)
      setUserResponse('')
      setHasAudioRecording(false)
      setIsRecording(false)
    } else {
      // Session complete
      setSessionActive(false)
      setProgress(100)
    }
  }

  if (showCameraTest) {
    return (
      <>
        <CameraMicrophoneTest 
          isOpen={showCameraTest}
          onClose={() => setShowCameraTest(false)}
          onTestComplete={handleCameraTestComplete}
          interviewType="Coach"
        />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-black/95">
      {/* Header */}
      <div className="sticky top-0 bg-black/90 backdrop-blur border-b border-white/10 p-4 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link
            href="/despega/a3/value-mining-lab-choice"
            className="flex items-center gap-2 text-white/70 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Atrás
          </Link>
          <div className="flex items-center gap-4">
            <Badge className="bg-[rgba(170,70,170,0.2)] text-[rgb(170,70,170)] border-[rgba(170,70,170,0.3)]">
              Modo Coach
            </Badge>
            <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
              {MODULE_XP} XP
            </Badge>
          </div>
        </div>
      </div>

      {/* Main content - 3 column layout */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid grid-cols-3 gap-4 h-[calc(100vh-120px)]">
          {/* Left Column - Coach Video */}
          <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden flex flex-col">
            <div className="flex-1 bg-black flex items-center justify-center relative">
              <video
                key="coach-video"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
                style={{
                  display: 'block',
                  backgroundColor: '#000'
                }}
              >
                <source src="/videos/coach-placeholder.mov" type="video/quicktime" />
                <source src="/videos/coach-placeholder.mov" type="video/mp4" />
                Tu navegador no soporta video
              </video>
            </div>
            <div className="p-4 bg-black/80 border-t border-white/10">
              <p className="text-sm text-white font-semibold">Coach de IA</p>
              <p className="text-xs text-white/60 mt-1">Minería de Valor</p>
            </div>
          </div>

          {/* Center Column - User Camera + Input */}
          <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden flex flex-col">
            {/* Camera section - takes full remaining space */}
            <div className="flex-1 bg-black/50 flex items-center justify-center rounded-t-lg min-h-0">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>

            {/* Response input area */}
            <div className="p-4 bg-black/80 border-t border-white/10 space-y-3">
              {/* Response mode toggle */}
              <div className="flex gap-2">
                <Button
                  onClick={() => setResponseMode('text')}
                  variant={responseMode === 'text' ? 'default' : 'outline'}
                  size="sm"
                  className={`flex-1 ${responseMode === 'text' ? 'bg-[rgb(170,70,170)]' : 'border-white/20'}`}
                >
                  <MessageSquare className="w-4 h-4 mr-1" />
                  Texto
                </Button>
                <Button
                  onClick={() => setResponseMode('audio')}
                  variant={responseMode === 'audio' ? 'default' : 'outline'}
                  size="sm"
                  className={`flex-1 ${responseMode === 'audio' ? 'bg-[rgb(170,70,170)]' : 'border-white/20'}`}
                >
                  <Mic className="w-4 h-4 mr-1" />
                  Voz
                </Button>
              </div>

              {/* Text input mode */}
              {responseMode === 'text' && (
                <>
                  <textarea
                    value={userResponse}
                    onChange={(e) => setUserResponse(e.target.value)}
                    placeholder="Tu respuesta aquí..."
                    className="w-full bg-white/10 border border-white/20 rounded-lg p-3 text-white text-sm placeholder:text-white/40 focus:outline-none focus:border-[rgb(170,70,170)]/50 resize-none h-20"
                  />
                  <Button
                    onClick={handleSubmitResponse}
                    disabled={!userResponse.trim()}
                    className="w-full bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.9)] text-white disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Respuesta
                  </Button>
                </>
              )}

              {/* Audio recording mode */}
              {responseMode === 'audio' && (
                <>
                  <div className="bg-white/5 border border-white/20 rounded-lg p-4 flex flex-col items-center gap-3">
                    {isRecording && (
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                        <p className="text-sm text-red-400 font-semibold">Grabando...</p>
                      </div>
                    )}
                    {!isRecording && !hasAudioRecording && (
                      <p className="text-sm text-white/60">Presiona para grabar tu respuesta</p>
                    )}
                    {hasAudioRecording && !isRecording && (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-green-400" />
                        <p className="text-sm text-green-400 font-semibold">Grabación completada</p>
                      </div>
                    )}
                  </div>
                  
                  <Button
                    onClick={isRecording ? stopAudioRecording : startAudioRecording}
                    className={`w-full h-12 font-semibold text-base ${
                      isRecording 
                        ? 'bg-red-600 hover:bg-red-700' 
                        : 'bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.9)]'
                    }`}
                  >
                    <Mic className="w-5 h-5 mr-2" />
                    {isRecording ? 'Detener Grabación' : 'Grabar Respuesta'}
                  </Button>

                  <Button
                    onClick={handleSubmitResponse}
                    disabled={!hasAudioRecording}
                    className="w-full bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.9)] text-white disabled:opacity-50"
                  >
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Respuesta
                  </Button>
                </>
              )}
            </div>

            <div className="px-4 pb-2">
              <p className="text-xs text-white/60">Cámara: Activa</p>
            </div>
          </div>

          {/* Right Column - Module Info */}
          <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Progress */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <p className="text-sm font-semibold text-white">Progreso de la Sesión</p>
                  <span className="text-xs text-white/60">{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} className="h-2 bg-white/10" />
              </div>

              {/* Current Question */}
              <div className="bg-[rgba(170,70,170,0.1)] border border-[rgba(170,70,170,0.3)] rounded-lg p-4">
                <p className="text-xs font-semibold text-[rgb(170,70,170)] mb-2 uppercase">
                  {sessionActive ? COACH_QUESTIONS[currentQuestion].category : 'Sesión de Coaching'}
                </p>
                {sessionActive && (
                  <p className="text-white text-sm leading-relaxed">
                    {COACH_QUESTIONS[currentQuestion].question}
                  </p>
                )}
                {!sessionActive && (
                  <div className="space-y-3">
                    <p className="text-white text-sm">
                      Bienvenido al Modo Coach para Minería de Valor
                    </p>
                    <Button
                      onClick={handleStartSession}
                      className="w-full bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.9)] text-white h-10"
                    >
                      Comenzar Sesión
                    </Button>
                  </div>
                )}
              </div>

              {/* Value Categories */}
              <div>
                <p className="text-sm font-semibold text-white mb-3">Categorías de Valor</p>
                <div className="space-y-2">
                  {VALUE_CATEGORIES.map((cat) => (
                    <div
                      key={cat.id}
                      className="bg-white/5 border border-white/10 rounded p-3 hover:bg-white/8 transition-colors cursor-pointer group"
                    >
                      <p className="text-xs font-semibold text-white group-hover:text-[rgb(170,70,170)]">
                        {cat.name}
                      </p>
                      <p className="text-xs text-white/60 mt-1">{cat.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tips */}
              <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                <div className="flex gap-3">
                  <Lightbulb className="w-4 h-4 text-blue-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-blue-400 mb-1">Consejo</p>
                    <p className="text-xs text-white/80">
                      Usa el método CAR o PAR para estructurar tu respuesta: Contexto, Acción, Resultado
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* XP Reward Info */}
            <div className="p-4 bg-black/80 border-t border-white/10">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Recompensa:</span>
                <span className="text-[rgb(170,70,170)] font-semibold">{MODULE_XP} XP</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
