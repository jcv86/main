'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Mic, X, Lightbulb } from 'lucide-react'
import { useSpeechRecognition } from '@/hooks/use-speech-recognition'

interface AnswerInputWithCoachProps {
  placeholder?: string
  questionText?: string
  onSubmit: (answer: string) => void
  isLoading?: boolean
  showCoachTips?: boolean
  coachContext?: string
}

export function AnswerInputWithCoach({
  placeholder = 'Especifica tu respuesta...',
  questionText,
  onSubmit,
  isLoading = false,
  showCoachTips = true,
  coachContext = ''
}: AnswerInputWithCoachProps) {
  const [answer, setAnswer] = useState('')
  const [showCoach, setShowCoach] = useState(false)
  const [coachTip, setCoachTip] = useState('')
  const [tipLoading, setTipLoading] = useState(false)
  const { transcript, isListening, startListening, stopListening, resetTranscript } = useSpeechRecognition()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-update textarea with speech recognition
  const handleStartListening = () => {
    resetTranscript()
    startListening()
  }

  const handleStopListening = async () => {
    stopListening()
    if (transcript) {
      setAnswer(prev => prev + (prev ? ' ' : '') + transcript)
    }
  }

  const getCoachTip = async () => {
    if (!answer.trim()) return
    
    setTipLoading(true)
    try {
      const response = await fetch('/api/a3/coach-suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: questionText,
          answer: answer,
          context: coachContext
        })
      })

      if (response.ok) {
        const data = await response.json()
        setCoachTip(data.suggestion)
        setShowCoach(true)
      }
    } catch (error) {
      console.error('[v0] Error getting coach tip:', error)
    } finally {
      setTipLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Text Input Field */}
      <Input
        type="text"
        placeholder="Escribe un título o referencia..."
        className="border border-[rgb(80,160,170)]/30 bg-black/40 text-white placeholder:text-white/40 rounded-full px-4 py-2"
      />

      {/* Answer Textarea */}
      <Textarea
        ref={textareaRef}
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder={placeholder}
        className="border border-white/20 bg-black/20 text-white placeholder:text-white/40 rounded-2xl p-4 min-h-24 resize-none"
      />

      {/* Microphone Input */}
      <div className="flex items-center gap-3">
        <Button
          onClick={isListening ? handleStopListening : handleStartListening}
          disabled={isLoading}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
            isListening
              ? 'bg-[rgba(80,160,170,0.2)] hover:bg-[rgba(80,160,170,0.3)] text-[rgb(80,160,170)] border border-[rgb(80,160,170)]/30'
              : 'bg-[rgb(80,160,170)] hover:bg-[rgba(80,160,170,0.9)] text-white'
          }`}
        >
          <Mic className="w-4 h-4 mr-2" />
          {isListening ? 'Dejar de grabar' : 'Usar micrófono'}
        </Button>
        <span className="text-xs text-white/50">o habla para dictar</span>
      </div>

      {/* Coach Tips Panel */}
      {showCoachTips && (
        <div className="border border-[rgb(80,160,170)]/30 bg-[rgba(80,160,170,0.05)] rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4 text-[rgb(80,160,170)]" />
              <span className="text-sm font-semibold text-[rgb(80,160,170)]">Tu Coach IA</span>
            </div>
            <Button
              onClick={() => setShowCoach(false)}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {showCoach && coachTip ? (
            <div className="space-y-3">
              <p className="text-sm text-white/70">{coachTip}</p>
            </div>
          ) : (
            <p className="text-xs text-white/50">Obtén ayuda para responder esta pregunta</p>
          )}

          <Button
            onClick={getCoachTip}
            disabled={!answer.trim() || tipLoading}
            className="w-full bg-[rgb(80,160,170)] hover:bg-[rgba(80,160,170,0.9)] text-white rounded-full font-semibold py-2"
          >
            {tipLoading ? 'Obteniendo sugerencia...' : 'Obtener Sugerencia'}
          </Button>
        </div>
      )}

      {/* Submit Button */}
      <Button
        onClick={() => onSubmit(answer)}
        disabled={!answer.trim() || isLoading}
        className="w-full bg-[rgb(80,160,170)] hover:bg-[rgba(80,160,170,0.9)] text-white rounded-full font-semibold py-2"
      >
        {isLoading ? 'Enviando...' : 'Siguiente'}
      </Button>
    </div>
  )
}
