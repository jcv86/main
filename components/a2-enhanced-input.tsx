'use client'

import { useState, useRef } from 'react'
import { Mic, MicOff, Sparkles, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface A2EnhancedInputProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  label: string
  icon?: React.ReactNode
  minRows?: number
}

export function A2EnhancedInput({
  value,
  onChange,
  placeholder = 'Especifica tu respuesta...',
  label,
  icon,
  minRows = 3,
}: A2EnhancedInputProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [coachSuggestion, setCoachSuggestion] = useState<{ suggestion: string; tips: string[] } | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const handleVoiceInput = async () => {
    if (isRecording) {
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
        stream.getTracks().forEach((track) => track.stop())
        
        // Send audio to transcription API
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })
        const formData = new FormData()
        formData.append('audio', audioBlob)
        
        try {
          const response = await fetch('/api/a2/transcribe', {
            method: 'POST',
            body: formData,
          })
          
          if (response.ok) {
            const data = await response.json()
            const transcription = data.transcription || '[Transcripción no disponible]'
            const currentValue = value ? value + ' ' : ''
            onChange(currentValue + transcription)
          } else {
            console.error('[v0] Transcription failed')
            const currentValue = value ? value + ' ' : ''
            onChange(currentValue + '[Error en transcripción]')
          }
        } catch (error) {
          console.error('[v0] Transcription error:', error)
          const currentValue = value ? value + ' ' : ''
          onChange(currentValue + '[Error al procesar audio]')
        }
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('No se pudo acceder al micrófono. Por favor, verifica los permisos.')
    }
  }

  const handleCoachAssist = async () => {
    setIsLoading(true)
    try {
      // Get coach assistance from AI
      const response = await fetch('/api/a2/coach-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          question: label,
          currentAnswer: value 
        }),
      })
      
      if (response.ok) {
        const data = await response.json()
        setCoachSuggestion(data)
      } else {
        alert('No se pudo obtener asistencia del coach. Intenta de nuevo.')
      }
    } catch (error) {
      console.error('[v0] Coach assist error:', error)
      alert('Error al conectar con el coach.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 mb-2">
        {icon && <span className="text-teal-400">{icon}</span>}
        <label className="text-sm font-semibold text-white uppercase tracking-wide">
          {label}
        </label>
      </div>

      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="bg-slate-900/50 border border-slate-700 text-white placeholder-slate-500 rounded-lg focus:border-teal-500 focus:ring-0 min-h-24"
        rows={minRows}
      />

      <div className="flex gap-2">
        <Button
          onClick={handleVoiceInput}
          variant="outline"
          size="sm"
          disabled={isLoading}
          className={`border-teal-600/50 hover:bg-teal-600/20 transition disabled:opacity-50 ${isRecording ? 'text-red-400 border-red-600/50' : 'text-teal-400'}`}
          type="button"
        >
          {isRecording ? (
            <>
              <MicOff className="w-4 h-4 mr-2" />
              Detener Grabación
            </>
          ) : (
            <>
              <Mic className="w-4 h-4 mr-2" />
              Usar micrófono
            </>
          )}
        </Button>

        <Button
          onClick={handleCoachAssist}
          variant="outline"
          size="sm"
          disabled={isLoading}
          className="border-teal-600/50 text-teal-400 hover:bg-teal-600/20 disabled:opacity-50"
          type="button"
        >
          <Sparkles className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Cargando...' : 'Asistencia Tu Coach'}
        </Button>
      </div>

      {coachSuggestion && (
        <div className="bg-purple-900/30 border border-purple-600/50 rounded-lg p-4 space-y-3">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1 space-y-2">
              <p className="text-sm font-semibold text-purple-300">Sugerencia del Coach:</p>
              <p className="text-sm text-white/80">{coachSuggestion.suggestion}</p>
              
              {coachSuggestion.tips && coachSuggestion.tips.length > 0 && (
                <div className="mt-2 space-y-1">
                  <p className="text-xs font-semibold text-purple-400 uppercase">Tips:</p>
                  <ul className="text-xs text-white/70 space-y-1">
                    {coachSuggestion.tips.map((tip, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-purple-400">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              
              <Button
                onClick={() => setCoachSuggestion(null)}
                variant="ghost"
                size="sm"
                className="text-xs text-purple-400 hover:text-purple-300 mt-2"
              >
                Cerrar sugerencia
              </Button>
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-slate-400">Puedes seleccionar múltiples opciones</p>
    </div>
  )
}
