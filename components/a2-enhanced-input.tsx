'use client'

import { useState, useRef } from 'react'
import { Mic, MicOff, Sparkles } from 'lucide-react'
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
        // Placeholder for voice transcription
        const currentValue = value ? value + ' ' : ''
        onChange(currentValue + '[Transcripción de voz - próximamente]')
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('Error accessing microphone:', error)
      alert('No se pudo acceder al micrófono. Por favor, verifica los permisos.')
    }
  }

  const handleCoachAssist = () => {
    alert('La asistencia del Coach estará disponible próximamente.')
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
          className="border-teal-600/50 text-teal-400 hover:bg-teal-600/20"
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
          className="border-teal-600/50 text-teal-400 hover:bg-teal-600/20"
          type="button"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Asistencia Tu Coach
        </Button>
      </div>

      <p className="text-xs text-slate-400">Puedes seleccionar múltiples opciones</p>
    </div>
  )
}
