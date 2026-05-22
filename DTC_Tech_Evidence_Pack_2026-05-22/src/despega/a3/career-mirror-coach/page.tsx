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
    id: 'career-direction',
    question: '¿Cuál es tu principal dirección de carrera? Describe brevemente dónde quieres ir profesionalmente.',
    guidance: 'Sé claro sobre el tipo de rol, industria o especialidad que te atrae. Ejemplo: "Quiero ser líder de producto en tech" o "Busco ser consultant en transformación digital".',
    categories: [
      { title: 'Rol Objetivo', description: '¿Qué posición específica buscas?' },
      { title: 'Industria', description: '¿En qué sector o industria?' },
      { title: 'Escala', description: '¿Startup, empresa mediana o grande?' }
    ]
  },
  {
    id: 'professional-identity',
    question: '¿Cómo describirías tu identidad profesional actual en una frase?',
    guidance: 'Define cómo quieres ser visto profesionalmente. Por ejemplo: "Soy un desarrollador full-stack con pasión por la escalabilidad" o "Soy gerente de proyectos ágil especializado en transformación".',
    categories: [
      { title: 'Tu Especialidad', description: '¿Cuál es tu experticia principal?' },
      { title: 'Tu Diferenciador', description: '¿Qué te hace único?' },
      { title: 'Tu Mentalidad', description: '¿Cuál es tu enfoque o filosofía?' }
    ]
  },
  {
    id: 'core-values',
    question: '¿Cuáles son los 3 principales valores que definen tu carrera?',
    guidance: 'Identifica qué es importante para ti en tu trabajo: crecimiento, impacto, autonomía, estabilidad, innovación, balance, etc. Sé sincero.',
    categories: [
      { title: 'Crecimiento', description: '¿Buscas aprender y evolucionar?' },
      { title: 'Impacto', description: '¿Quieres ver el resultado de tu trabajo?' },
      { title: 'Autonomía', description: '¿Necesitas libertad de decisión?' },
      { title: 'Estabilidad', description: '¿Buscas seguridad y predicibilidad?' },
      { title: 'Innovación', description: '¿Te atrae lo nuevo y disruptivo?' },
      { title: 'Balance', description: '¿Es importante la flexibilidad?' }
    ]
  },
  {
    id: 'personal-brand',
    question: '¿Cómo te gustaría que los reclutadores vieran tu espejo de carrera? ¿Cuál es tu marca personal?',
    guidance: 'Resume en pocas palabras cómo quieres ser percibido. Esto será la base de tu marca personal que comuniques en interviews. Ejemplo: "Profesional de impacto que lidera con datos e innovación".',
    categories: [
      { title: 'Posicionamiento', description: '¿Cómo quieres ser categorizado?' },
      { title: 'Diferencia Clave', description: '¿Qué resultados entregas?' },
      { title: 'Percepción', description: '¿Qué palabra te describe mejor?' }
    ]
  }
]

export default function CareerMirrorCoach() {
  const router = useRouter()
  const videoRef = useRef<HTMLVideoElement>(null)
  
  const [userResponse, setUserResponse] = useState('')
  const [isReadyToContinue, setIsReadyToContinue] = useState(false)
  const [showCameraTest, setShowCameraTest] = useState(true)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [sessionActive, setSessionActive] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isFirstCompletion, setIsFirstCompletion] = useState(false)
  const [xpEarned, setXpEarned] = useState(0)
  const [responses, setResponses] = useState<string[]>([])
  const [showCompletion, setShowCompletion] = useState(false)
  
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
      setResponses([])
    }
  }

  const handleSubmitResponse = async () => {
    if (!userResponse.trim()) {
      return
    }

    // Save response
    const newResponses = [...responses, userResponse]
    setResponses(newResponses)
    
    // Move to next question
    if (currentQuestion < COACH_QUESTIONS.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setProgress(((currentQuestion + 1) / COACH_QUESTIONS.length) * 100)
      setUserResponse('')
      lastTranscriptRef.current = ''
      resetTranscript()
    } else {
      // Session complete - record completion
      await recordModuleCompletion(newResponses)
      setSessionActive(false)
      setShowCompletion(true)
      setProgress(100)
    }
  }

  const recordModuleCompletion = async (allResponses: string[]) => {
    try {
      const response = await fetch('/api/a3/module-completion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          moduleId: 'career-mirror',
          moduleName: 'Espejo de Carrera',
          moduleNumber: 1,
          trainingType: 'coach',
          responses: allResponses,
          careerMirrorCard: {
            careerDirection: allResponses[0] || '',
            professionalIdentity: allResponses[1] || '',
            coreValues: allResponses[2] || '',
            personalBrand: allResponses[3] || ''
          }
        })
      })

      if (!response.ok) {
        console.error('[v0] Failed to record completion:', response.statusText)
        return
      }

      const data = await response.json()
      setIsFirstCompletion(data.isFirstCompletion || false)
      setXpEarned(data.xpAwarded || 0)
    } catch (error) {
      console.error('[v0] Error recording completion:', error)
    }
  }

  const handleRestartModule = () => {
    setCurrentQuestion(0)
    setProgress(0)
    setUserResponse('')
    setResponses([])
    setShowCompletion(false)
    setSessionActive(true)
    lastTranscriptRef.current = ''
    resetTranscript()
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

  if (showCompletion) {
    return (
      <div className="min-h-screen bg-black/95 flex flex-col items-center justify-center p-8">
        <div className="text-center space-y-6 max-w-2xl">
          <CheckCircle2 className="w-16 h-16 text-[rgb(170,70,170)] mx-auto" />
          <h2 className="text-3xl font-normal text-white">Sesión Completada</h2>
          <p className="text-white/60 text-lg">Excelente trabajo en el Espejo de Carrera</p>
          {isFirstCompletion && xpEarned > 0 ? (
            <p className="text-[rgb(170,70,170)] font-semibold text-lg">+{xpEarned} XP ganados</p>
          ) : (
            <p className="text-white/40">Sesión completada nuevamente. XP no se suma en repeticiones.</p>
          )}
          
          <div className="space-y-3 pt-4">
            <Button 
              onClick={() => router.push('/despega/a3')}
              className="w-full bg-gradient-to-r from-[rgba(170,70,170,0.7)] to-[rgba(170,70,170,0.3)] hover:from-[rgba(170,70,170,0.8)] hover:to-[rgba(170,70,170,0.4)] text-white"
            >
              <ChevronRight className="w-4 h-4 mr-2" />
              Ver tu Progreso en A3
            </Button>
            
            <Button 
              onClick={handleRestartModule}
              variant="outline"
              className="w-full border-white/20 text-white hover:bg-white/10"
            >
              Reintentar Módulo 1
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!sessionActive) {
    return (
      <div className="min-h-screen bg-black/95 flex flex-col items-center justify-center p-8">
        <div className="text-center space-y-6 max-w-2xl">
          <h2 className="text-3xl font-normal text-white">Sesión Lista</h2>
          <p className="text-white/60">Haz clic para continuar con el Espejo de Carrera</p>
          <Button 
            onClick={() => setSessionActive(true)}
            className="bg-gradient-to-r from-[rgba(170,70,170,0.7)] to-[rgba(170,70,170,0.3)] hover:from-[rgba(170,70,170,0.8)] hover:to-[rgba(170,70,170,0.4)] text-white"
          >
            Continuar
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
            <p className="text-white/80 text-sm">Espejo de Carrera</p>
          </div>
          <div>
            <p className="text-white/40 text-xs uppercase">Progreso</p>
            <p className="text-[rgb(170,70,170)] font-medium">{Math.round(progress)}%</p>
          </div>
        </div>

        {/* Three Column Layout */}
        <div className="grid grid-cols-3 gap-4">
          {/* Left Column: Coach Profile */}
          <div className="space-y-3">
            <div className="rounded-lg overflow-hidden bg-gradient-to-b from-[rgba(170,70,170,0.2)] to-black/40 aspect-[3/4] flex items-center justify-center border border-[rgba(170,70,170,0.2)]">
              <div className="text-center space-y-4">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[rgb(170,70,170)] to-[rgb(80,160,170)] mx-auto flex items-center justify-center">
                  <span className="text-4xl font-bold text-white/40">IA</span>
                </div>
                <div>
                  <p className="text-white/80 font-medium text-sm">Coach de IA</p>
                  <p className="text-white/50 text-xs">Espejo de Carrera</p>
                </div>
              </div>
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
                <div className="absolute top-3 right-3 flex items-center gap-2 bg-[rgba(170,70,170,0.2)] px-3 py-1 rounded-full border border-[rgba(170,70,170,0.3)]">
                  <div className="w-2 h-2 bg-[rgb(170,70,170)] rounded-full animate-pulse"></div>
                  <span className="text-xs text-[rgb(170,70,170)]/70">Grabando</span>
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

              {/* Audio Recording Section */}
              {isListening && (
                <div className="px-3 pb-2 flex items-center gap-2">
                  <div className="w-2 h-2 bg-[rgb(170,70,170)] rounded-full animate-pulse"></div>
                  <span className="text-xs text-[rgb(170,70,170)]/70 font-medium">Grabando...</span>
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
                  className={`m-3 text-xs font-medium border-0 rounded-full transition-all ${
                    isListening 
                      ? 'bg-[rgba(170,70,170,0.2)] hover:bg-[rgba(170,70,170,0.3)] text-[rgb(170,70,170)]' 
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

          {/* Right Column: Question & Guidance */}
          <div className="space-y-3">
            {/* Question Display with Salmon Background */}
            <Card className="bg-[rgba(225,120,130,0.4)] border-[rgba(225,120,130,0.3)] p-4 min-h-40">
              <p className="text-xs text-[rgba(225,120,130,1)] uppercase font-medium mb-2">Pregunta</p>
              <p className="text-white/90 text-sm leading-relaxed font-medium">{currentQ.question}</p>
            </Card>

            {/* Categories */}
            <div className="space-y-2">
              <p className="text-xs text-white/60 uppercase">Considera estos puntos</p>
              <div className="space-y-2 max-h-32 overflow-y-auto">
                {currentQ.categories.map((cat, idx) => (
                  <button
                    key={idx}
                    className="w-full text-left bg-white/5 border border-white/10 rounded-lg p-2 hover:bg-white/8 hover:border-[rgb(80,160,170)]/40 transition-all"
                  >
                    <p className="text-xs font-medium text-white">{cat.title}</p>
                    <p className="text-xs text-white/50 mt-1">{cat.description}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Guidance Card with Salmon Tip */}
            <Card className="bg-[rgba(225,120,130,0.15)] border-[rgba(225,120,130,0.2)] p-3">
              <p className="text-xs text-[rgba(225,120,130,0.9)] leading-relaxed">💡 {currentQ.guidance}</p>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2">
          <Button
            onClick={handleSubmitResponse}
            disabled={!userResponse.trim()}
            className="bg-gradient-to-r from-[rgba(170,70,170,0.7)] to-[rgba(170,70,170,0.3)] hover:from-[rgba(170,70,170,0.8)] hover:to-[rgba(170,70,170,0.4)] text-white gap-2 px-8 py-2 rounded-full font-semibold disabled:opacity-50"
          >
            {currentQuestion < COACH_QUESTIONS.length - 1 ? 'Siguiente Pregunta' : 'Finalizar Sesión'}
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
