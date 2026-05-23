'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, Send, Loader } from 'lucide-react'

interface AnswerInputWithCoachProps {
  title: string
  placeholder?: string
  onSubmit: (answer: string) => Promise<void>
  coachSuggestions?: string
  isLoading?: boolean
  showCoachPanel?: boolean
  moduleId: string
  checkpointNumber?: number
}

export function AnswerInputWithCoach({
  title,
  placeholder = 'Escribe tu respuesta aquí...',
  onSubmit,
  coachSuggestions = '',
  isLoading = false,
  showCoachPanel = true,
  moduleId,
  checkpointNumber = 0,
}: AnswerInputWithCoachProps) {
  const [answer, setAnswer] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isSending, setIsSending] = useState(false)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  // Initialize speech-to-text
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data)
      }

      mediaRecorder.onstop = async () => {
        // Handle STT transcription
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        
        // Use Web Speech API as fallback
        const recognition = new (window as any).webkitSpeechRecognition()
        recognition.lang = 'es-ES'
        recognition.start()

        recognition.onresult = (event: any) => {
          let fullTranscript = ''
          for (let i = 0; i < event.results.length; i++) {
            fullTranscript += event.results[i][0].transcript
          }
          setTranscript(fullTranscript)
          setAnswer((prev) => (prev ? prev + ' ' + fullTranscript : fullTranscript))
        }

        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
    } catch (error) {
      console.error('[v0] Microphone access denied:', error)
      alert('Permiso de micrófono denegado')
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleSubmit = async () => {
    if (!answer.trim()) return

    setIsSending(true)
    try {
      await onSubmit(answer)
      setAnswer('')
      setTranscript('')
    } catch (error) {
      console.error('[v0] Submit error:', error)
    } finally {
      setIsSending(false)
    }
  }

  return (
    <div className="w-full space-y-4">
      {/* Title */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      </div>

      {/* Input Section */}
      <div className="space-y-3">
        {/* Textarea */}
        <textarea
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder={placeholder}
          className="w-full h-32 p-4 bg-transparent border border-cyan-500/30 rounded-lg text-white placeholder-gray-500 resize-none focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/50 transition-all"
        />

        {/* Controls */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            {/* Microphone Button */}
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isSending || isLoading}
              className={`p-2 rounded-lg transition-all ${
                isRecording
                  ? 'bg-[rgba(80,160,170,0.5)]-500/20 border border-[rgb(80,160,170)]-500 text-[rgb(80,160,170)]-400'
                  : 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20'
              } disabled:opacity-50 disabled:cursor-not-allowed`}
              title={isRecording ? 'Detener grabación' : 'Grabar respuesta'}
            >
              {isRecording ? <MicOff size={20} /> : <Mic size={20} />}
            </button>

            {/* Status Text */}
            {isRecording && <span className="text-sm text-[rgb(80,160,170)]-400">Grabando...</span>}
            {transcript && !isRecording && <span className="text-sm text-cyan-400 line-clamp-1">{transcript}</span>}
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!answer.trim() || isSending || isLoading}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 text-white rounded-lg font-medium hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            {isSending || isLoading ? (
              <>
                <Loader size={18} className="animate-spin" />
                <span>Enviando...</span>
              </>
            ) : (
              <>
                <Send size={18} />
                <span>Enviar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Coach Panel */}
      {showCoachPanel && coachSuggestions && (
        <div className="mt-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
          <h4 className="text-sm font-semibold text-purple-300 mb-2">💡 Sugerencias del Coach</h4>
          <p className="text-sm text-gray-300 leading-relaxed">{coachSuggestions}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center p-4 bg-gray-500/10 rounded-lg">
          <Loader size={20} className="animate-spin text-cyan-400 mr-2" />
          <span className="text-sm text-gray-400">Generando sugerencias...</span>
        </div>
      )}
    </div>
  )
}
