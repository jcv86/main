import { Mic, MicOff, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSpeechRecognition } from '@/lib/hooks/use-speech-recognition'
import { useEffect, useRef } from 'react'

interface VoiceInputProps {
  onTranscript: (text: string) => void
  isDisabled?: boolean
}

export function VoiceInput({ onTranscript, isDisabled = false }: VoiceInputProps) {
  const { isListening, isSupported, transcript, isFinal, startListening, stopListening, resetTranscript } = useSpeechRecognition({
    language: 'es-ES',
    continuous: false,
    interimResults: false,
    silenceTimeout: 2000
  })

  const lastTranscriptRef = useRef<string>('')

  useEffect(() => {
    // Only trigger callback when we have a FINAL result (not intermediate)
    if (transcript && isFinal && transcript !== lastTranscriptRef.current) {
      lastTranscriptRef.current = transcript
      onTranscript(transcript)
      // Reset for next recording
      resetTranscript()
      lastTranscriptRef.current = ''
    }
  }, [transcript, isFinal, onTranscript, resetTranscript])

  if (!isSupported) {
    return (
      <div className="text-xs text-muted-foreground dark:text-muted-foreground flex items-center gap-2">
        <Volume2 className="w-3 h-3" />
        Micrófono no disponible
      </div>
    )
  }

  return (
    <Button
      onClick={isListening ? stopListening : startListening}
      disabled={isDisabled}
      variant={isListening ? 'destructive' : 'outline'}
      size="sm"
      className="gap-2"
      style={!isListening ? {
        backgroundColor: 'rgb(80, 160, 170, 0.6)',
        color: 'rgba(255, 255, 255, 0.92)',
        border: 'none'
      } : undefined}
      title={isListening ? 'Detener grabación' : 'Usar micrófono para responder'}
    >
      {isListening ? (
        <>
          <MicOff className="w-4 h-4 animate-pulse" />
          Grabando...
        </>
      ) : (
        <>
          <Mic className="w-4 h-4" />
          Usar micrófono
        </>
      )}
    </Button>
  )
}

