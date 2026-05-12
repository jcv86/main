'use client'

import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { SofiaInterviewer } from '@/components/sofia-interviewer'
import { VoiceInput } from '@/components/conozcamonos/voice-input'
import { Mic, MicOff, Volume2, ChevronRight } from 'lucide-react'

interface InterviewThreeColumnProps {
  question: string
  stageName: string
  targetTime: number
  onAnswer: (text: string) => void
  onQualityRating: (rating: number) => void
  onNext: () => void
  currentIndex: number
  totalQuestions: number
  showGuidance?: boolean
  guidanceText?: string
}

const QUALITY_LEVELS = [
  { level: 1, label: 'Rough', color: 'bg-red-500/20 border-red-500/30 text-red-400' },
  { level: 2, label: 'Okay', color: 'bg-orange-500/20 border-orange-500/30 text-orange-400' },
  { level: 3, label: 'Good', color: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-400' },
  { level: 4, label: 'Strong', color: 'bg-blue-500/20 border-blue-500/30 text-blue-400' },
  { level: 5, label: 'Great', color: 'bg-green-500/20 border-green-500/30 text-green-400' }
]

export function InterviewThreeColumnLayout({
  question,
  stageName,
  targetTime,
  onAnswer,
  onQualityRating,
  onNext,
  currentIndex,
  totalQuestions,
  showGuidance = false,
  guidanceText = ''
}: InterviewThreeColumnProps) {
  const [userAnswer, setUserAnswer] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [sofiaState, setSofiaState] = useState<'greeting' | 'listening' | 'thinking' | 'idle'>('listening')
  const [selectedQuality, setSelectedQuality] = useState<number | null>(null)
  const [timeElapsed, setTimeElapsed] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize camera on component mount
  useEffect(() => {
    const initCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'user' },
          audio: false 
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          streamRef.current = stream
        }
      } catch (error) {
        console.error('Camera access error:', error)
      }
    }

    initCamera()

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])

  // Timer for tracking response duration
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setTimeElapsed(prev => prev + 1)
      }, 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isRecording])

  const handleVoiceTranscript = (text: string) => {
    setUserAnswer(text)
    onAnswer(text)
    setSofiaState('thinking')
    setTimeout(() => setSofiaState('idle'), 2000)
  }

  const handleQualitySelect = (level: number) => {
    setSelectedQuality(level)
    onQualityRating(level)
  }

  const handleNextQuestion = () => {
    setUserAnswer('')
    setSelectedQuality(null)
    setTimeElapsed(0)
    setSofiaState('listening')
    onNext()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-4 gap-4 text-center">
        <div>
          <p className="text-white/40 text-xs uppercase">Entrevistador</p>
          <p className="text-white font-medium">Sofia</p>
        </div>
        <div>
          <p className="text-white/40 text-xs uppercase">Pregunta</p>
          <p className="text-white font-medium">{currentIndex + 1} de {totalQuestions}</p>
        </div>
        <div>
          <p className="text-white/40 text-xs uppercase">Objetivo</p>
          <p className="text-white/80 text-sm">{targetTime}s</p>
        </div>
        <div>
          <p className="text-white/40 text-xs uppercase">Tiempo</p>
          <p className="text-[rgb(170,70,170)] font-medium">{formatTime(timeElapsed)}</p>
        </div>
      </div>

      {/* Three Column Layout */}
      <div className="grid grid-cols-3 gap-4">
        {/* Left Column: Sofia Video */}
        <div className="space-y-3">
          <div className="border-2 border-[rgb(170,70,170)]/40 rounded-lg overflow-hidden bg-black/40 aspect-[3/4]">
            <SofiaInterviewer state={sofiaState} loop={true} variant="pip" />
          </div>
          <div className="text-center text-xs text-white/60">
            <p className="font-medium text-white">{stageName}</p>
            <p>Entrevistador</p>
          </div>
        </div>

        {/* Center Column: User Camera & Response */}
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
            {/* Recording Indicator */}
            {isRecording && (
              <div className="absolute top-3 right-3 flex items-center gap-2 bg-red-500/20 px-3 py-1 rounded-full border border-red-500/30">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-red-400">Grabando</span>
              </div>
            )}
          </div>

          {/* Response Input */}
          <div className="bg-white/5 border border-white/10 rounded-lg p-3 space-y-2 min-h-24">
            <p className="text-xs text-white/60 uppercase">Tu Respuesta</p>
            <textarea
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Tu respuesta aparecerá aquí o escribe manualmente..."
              className="w-full bg-transparent text-white/90 text-sm placeholder:text-white/30 resize-none h-16 outline-none"
            />
          </div>

          {/* Voice Input */}
          <div className="flex gap-2">
            <VoiceInput
              onTranscript={handleVoiceTranscript}
              pillarColor="rgba(170, 70, 170, 0.6)"
            />
          </div>
        </div>

        {/* Right Column: Question & Rating */}
        <div className="space-y-3">
          {/* Question Display */}
          <Card className="bg-[rgba(170,70,170,0.1)] border-[rgba(170,70,170,0.3)] p-4 min-h-32">
            <p className="text-xs text-[rgb(170,70,170)] uppercase font-medium mb-2">Pregunta</p>
            <p className="text-white/90 text-sm leading-relaxed font-medium">{question}</p>
          </Card>

          {/* Quality Self-Rating */}
          <div className="space-y-2">
            <p className="text-xs text-white/60 uppercase">¿Qué tan bien respondiste?</p>
            <div className="space-y-2">
              {QUALITY_LEVELS.map((item) => (
                <button
                  key={item.level}
                  onClick={() => handleQualitySelect(item.level)}
                  className={`w-full px-3 py-2 rounded-lg transition-all text-sm font-medium border ${
                    selectedQuality === item.level
                      ? `${item.color} border-current`
                      : 'bg-white/5 border-white/10 text-white/70 hover:border-white/30'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Guidance (optional) */}
          {showGuidance && guidanceText && (
            <Card className="bg-yellow-500/10 border-yellow-500/20 p-3">
              <p className="text-xs text-yellow-600 dark:text-yellow-400">💡 {guidanceText}</p>
            </Card>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleNextQuestion}
          className="bg-[rgb(170,70,170)] hover:bg-[rgb(170,70,170)]/80 text-white gap-2 px-8"
        >
          Siguiente Pregunta
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
