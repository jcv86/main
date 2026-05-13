'use client'

import { useState, useRef } from 'react'
import { Mic, MicOff, Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface A2EnhancedInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label: string
  icon?: React.ReactNode
  coachContext?: string // Context for AI coach to understand what kind of help to provide
  minRows?: number
}

export function A2EnhancedInput({
  value,
  onChange,
  placeholder = 'Especifica tu respuesta...',
  label,
  icon,
  coachContext,
  minRows = 3,
}: A2EnhancedInputProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isEnhancing, setIsEnhancing] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const handleVoiceInput = async () => {
    if (isRecording) {
      // Stop recording
      mediaRecorderRef.current?.stop()
      setIsRecording(false)
      return
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
        stream.getTracks().forEach((track) => track.stop())
        
        // For now, show a message that voice is being processed
        // In production, this would send to a speech-to-text API
        const currentValue = value ? value + ' ' : ''
        onChange(currentValue + '[Transcripción de voz pendiente...]')
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('No se pudo acceder al micrófono. Por favor, verifica los permisos.')
    }
  }

  const handleCoachAssist = async () => {
    if (!value.trim()) {
      alert('Por favor, escribe algo primero para que el coach pueda ayudarte.')
      return
    }

    setIsEnhancing(true)
    try {
      const response = await fetch('/api/a2/day1/coach-enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          role: value,
          environment: coachContext || '',
          desiredOutcome: label,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        if (data.enhanced?.role) {
          onChange(data.enhanced.role)
        }
      }
    } catch (error) {
      console.error('Error getting coach assistance:', error)
    } finally {
      setIsEnhancing(false)
    }
  }

  return (
    <div className="space-y-3">
      {/* Label */}
      <label className="flex items-center gap-2 text-xs font-semibold tracking-wider text-white/80 uppercase">
        {icon}
        {label}
      </label>

      {/* Textarea */}
      <div className="relative">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="min-h-[100px] bg-slate-900/50 border-slate-700/50 text-white placeholder:text-white/40 resize-none rounded-lg focus:border-cyan-500/50 focus:ring-cyan-500/20"
          rows={minRows}
        />
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleVoiceInput}
          className={`border-slate-600 text-white/80 hover:text-white hover:bg-slate-800 ${
            isRecording ? 'bg-red-900/30 border-red-500/50 text-red-400' : ''
          }`}
        >
          {isRecording ? (
            <>
              <MicOff className="w-4 h-4 mr-2" />
              Detener
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 mr-2" />
              Usar micrófono
            </>
          )}
        </Button>
        <span className="text-xs text-white/40">O habla para dictar</span>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleCoachAssist}
          disabled={isEnhancing || !value.trim()}
          className="border-slate-600 text-white/80 hover:text-white hover:bg-slate-800"
        >
          {isEnhancing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Mejorando...
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Asistencia Tu Coach
            </>
          )}
        </Button>
      </div>

      <p className="text-xs text-amber-400/70">
        Puedes seleccionar múltiples opciones
      </p>
    </div>
  )
}
