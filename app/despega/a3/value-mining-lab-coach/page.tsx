'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { CameraMicrophoneTest } from '@/components/camera-microphone-test'
import { ChevronRight, Mic, MicOff, CheckCircle2, Volume2 } from 'lucide-react'
import { useSpeechRecognition } from '@/lib/hooks/use-speech-recognition'

const COACH_QUESTIONS = [
  {
    id: 'intro',
    question: '¿Cuál es el valor que entregó en su experiencia laboral anterior? Cuénteme sobre un proyecto específico.',
    guidance: 'Describe un proyecto concreto y cómo aportaste valor medible a tu empresa anterior.'
  },
  {
    id: 'value-1',
    question: 'De los valores que mencionó, ¿cuál diría que es el más crítico para su carrera?',
    guidance: 'Enfócate en uno o dos valores clave. Explica por qué son importantes.'
  },
  {
    id: 'value-2',
    question: '¿Cómo podría aplicar ese valor en roles futuros o proyectos nuevos?',
    guidance: 'Conecta lo que aprendiste con oportunidades futuras. Sé específico.'
  },
  {
    id: 'action',
    question: '¿Cuál será tu próximo paso para comunicar este valor en futuras entrevistas?',
    guidance: 'Define una acción concreta. Ejemplo: "Prepararé una historia STAR que demuestre este valor".'
  }
]

const VALUE_CATEGORIES = [
  { title: 'Ahorro de Tiempo', description: '¿Hiciste algo más rápido o ahorrase tiempo?' },
  { title: 'Reducción de Costos', description: '¿Ayudaste a ahorrar dinero o reducir gastos?' },
  { title: 'Mejora de Calidad', description: '¿Mejoraste la calidad o redujiste errores?' },
  { title: 'Crecimiento e Ingresos', description: '¿Ayudaste a crecer el negocio o aumentar ingresos?' },
  { title: 'Impacto en Equipo', description: '¿A que las personas tengan éxito?' },
  { title: 'Innovación de Procesos', description: '¿Creaste o mejoraste un proceso?' }
]

export default function ValueMiningLabCoach() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  
  const [userResponse, setUserResponse] = useState('')
  const [isReadyToContinue, setIsReadyToContinue] = useState(false)
  const [showCameraTest, setShowCameraTest] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [sessionActive, setSessionActive] = useState(false)
  const [progress, setProgress] = useState(0)
  
  // Speech recognition hook
  const { isListening, isSupported, transcript, isFinal, startListening, stopListening, resetTranscript } = useSpeechRecognition({
    language: 'es-ES',
    continuous: false,
    interimResults: false,
    silenceTimeout: 2000
  })

  const lastTranscriptRef = useRef<string>('')

  // Handle transcribed text from speech recognition
  useEffect(() => {
    if (transcript && isFinal && transcript !== lastTranscriptRef.current) {
      console.log('[v0] Final transcript received:', transcript)
      lastTranscriptRef.current = transcript
      setUserResponse(transcript)
      // Reset for next recording
      setTimeout(() => {
        resetTranscript()
      }, 500)
    }
  }, [transcript, isFinal, resetTranscript])

  const handleCameraTestComplete = (passed: boolean) => {
    if (passed) {
      setShowCameraTest(false)
      setIsReadyToContinue(true)
      setSessionActive(true)
      setProgress(0)
    }
  }

  const handleSubmitResponse = () => {
    if (!userResponse.trim()) {
      console.log('[v0] No response to submit')
      return
    }

    // Simulate coach feedback
    console.log('[v0] Response submitted:', userResponse)
    
    // Move to next question
    if (currentQuestion < COACH_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setProgress(((currentQuestion + 1) / COACH_QUESTIONS.length) * 100)
      setUserResponse('')
      lastTranscriptRef.current = ''
      resetTranscript()
    } else {
      // Session complete
      setSessionActive(false)
      setProgress(100)
    }
  }

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

  if (showCameraTest) {
    return (
      <CameraMicrophoneTest 
        isOpen={showCameraTest}
        onClose={() => setShowCameraTest(false)}
        onTestComplete={handleCameraTestComplete}
        interviewType="Coach"
      />
    )
  }

  if (!sessionActive) {
    return (
      <div className="min-h-screen bg-black/95 flex flex-col items-center justify-center p-8">
        <div className="text-center space-y-6 max-w-2xl">
          <h2 className="text-3xl font-normal text-white">Sesión Completada</h2>
          <p className="text-white/60 text-lg">Excelente trabajo en la Minería de Valor</p>
          <p className="text-white/40">Ganaste 100 XP</p>
          <Button 
            onClick={() => router.push('/despega/a3')}
            className="bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.9)] text-white"
          >
            <ChevronRight className="w-4 h-4 mr-2" />
            Volver a A3
          </Button>
        </div>
      </div>
    )
  }

  const currentQ = COACH_QUESTIONS[currentQuestion]

  return (
    <div className="min-h-screen bg-black/95 p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Stats */}
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-white/40 text-xs uppercase">Coach</p>
            <p className="text-white font-medium">IA</p>
          </div>
          <div>
            <p className="text-white/40 text-xs uppercase">Pregunta</p>
            <p className="text-white font-medium">{currentQuestion + 1} de {COACH_QUESTIONS.length}</p>
          </div>
          <div>
            <p className="text-white/40 text-xs uppercase">Tema</p>
            <p className="text-white/80 text-sm">Minería de Valor</p>
          </div>
          <div>
            <p className="text-white/40 text-xs uppercase">Progreso</p>
            <p className="text-[rgb(170,70,170)] font-medium">{Math.round(progress)}%</p>
          </div>
        </div>

        {/* Three Column Layout - Matches Recruiter Simulation */}
        <div className="grid grid-cols-3 gap-4">
          {/* Left Column: Coach Video Profile */}
          <div className="space-y-3">
            <div className="border-2 border-[rgb(170,70,170)]/40 rounded-lg overflow-hidden bg-black/40 aspect-[3/4]">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="/videos/coach-placeholder.mov" type="video/quicktime" />
                <source src="/videos/coach-placeholder.mov" type="video/mp4" />
              </video>
            </div>
            <div className="text-center text-xs text-white/60">
              <p className="font-medium text-white">Coach de IA</p>
              <p>Minería de Valor</p>
            </div>
          </div>

          {/* Center Column: User Camera & Response Input */}
          <div className="space-y-3">
            {/* Camera Feed */}
            <div className="border-2 border-[rgb(170,70,170)]/40 rounded-lg overflow-hidden bg-black/40 aspect-[3/4] relative">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {isListening && (
                <div className="absolute top-3 right-3 flex items-center gap-2 bg-red-500/20 px-3 py-1 rounded-full border border-red-500/30">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-red-400">Grabando</span>
                </div>
              )}
            </div>

            {/* Response Input Section */}
            <div className="bg-white/5 border border-white/10 rounded-lg overflow-hidden">
              <p className="text-xs text-white/60 uppercase px-3 pt-3 pb-2">Tu Respuesta</p>
              
              {/* Text Input Area */}
              <textarea
                value={userResponse}
                onChange={(e) => setUserResponse(e.target.value)}
                placeholder="Tu respuesta aparecerá aquí o escribe manualmente..."
                className="w-full bg-transparent text-white/90 text-sm placeholder:text-white/30 resize-none h-24 outline-none px-3 py-3 border-0"
              />

              {/* Audio Recording Section - Shown below textarea */}
              {isListening && (
                <div className="px-3 pb-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-red-400 font-medium">Grabando...</span>
                </div>
              )}

              {!isSupported && (
                <div className="px-3 pb-2 flex items-center gap-2 text-yellow-600 dark:text-yellow-400">
                  <Volume2 className="w-4 h-4" />
                  <span className="text-xs">Micrófono no disponible</span>
                </div>
              )}

              {/* Usar micrófono Button */}
              {isSupported && (
                <Button
                  onClick={isListening ? stopListening : startListening}
                  variant="ghost"
                  size="sm"
                  className={`m-3 text-xs font-medium border-0 ${
                    isListening 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'bg-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.9)] text-white'
                  }`}
                >
                  {isListening ? (
                    <>
                      <MicOff className="w-3 h-3 mr-2 animate-pulse" />
                      Grabando...
                    </>
                  ) : (
                    <>
                      <Mic className="w-3 h-3 mr-2" />
                      Usar micrófono
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>

          {/* Right Column: Question & Value Categories */}
          <div className="space-y-3">
            {/* Question Display */}
            <Card className="bg-[rgba(170,70,170,0.1)] border-[rgba(170,70,170,0.3)] p-4 min-h-40">
              <p className="text-xs text-[rgb(170,70,170)] uppercase font-medium mb-2">Pregunta</p>
              <p className="text-white/90 text-sm leading-relaxed font-medium">{currentQ.question}</p>
            </Card>

            {/* Value Categories */}
            <div className="space-y-2">
              <p className="text-xs text-white/60 uppercase">Categorías de Valor</p>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {VALUE_CATEGORIES.map((cat, idx) => (
                  <button
                    key={idx}
                    className="w-full text-left bg-white/5 border border-white/10 rounded-lg p-2 hover:bg-white/8 hover:border-white/20 transition-all"
                  >
                    <p className="text-xs font-medium text-white">{cat.title}</p>
                    <p className="text-xs text-white/50 mt-1">{cat.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Guidance Card */}
            <Card className="bg-yellow-500/10 border-yellow-500/20 p-3">
              <p className="text-xs text-yellow-600 dark:text-yellow-400">💡 {currentQ.guidance}</p>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <Button
            onClick={currentQuestion < COACH_QUESTIONS.length - 1 ? handleSubmitResponse : () => router.push('/despega/a3')}
            disabled={!userResponse.trim()}
            className="bg-gradient-to-r from-[rgba(170,70,170,0.7)] to-[rgba(170,70,170,0.3)] hover:from-[rgba(170,70,170,0.8)] hover:to-[rgba(170,70,170,0.4)] text-white gap-2 px-8 py-2 rounded-full font-semibold disabled:opacity-50"
          >
            {currentQuestion < COACH_QUESTIONS.length - 1 ? 'Siguiente Pregunta' : 'Finalizar'}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
