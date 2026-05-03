import { Mic, MicOff, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSpeechRecognition } from '@/lib/hooks/use-speech-recognition'
import { useEffect, useRef } from 'react'

interface VoiceInputProps {
  onTranscript: (text: string) => void
  isDisabled?: boolean
  pillarColor?: string
}

export function VoiceInput({ onTranscript, isDisabled = false, pillarColor = 'rgba(80, 160, 170, 0.6)' }: VoiceInputProps) {
  const { isListening, isSupported, transcript, isFinal, startListening, stopListening, resetTranscript } = useSpeechRecognition({
    language: 'es-ES',
    continuous: false,
    interimResults: true,
    silenceTimeout: 2000
  })

  const lastTranscriptRef = useRef<string>('')

  useEffect(() => {
    // Fire callback immediately when we have any transcript (interim or final)
    if (transcript && transcript.trim() && transcript !== lastTranscriptRef.current) {
      console.log('[v0] Voice input detected:', { transcript, isFinal })
      lastTranscriptRef.current = transcript
      onTranscript(transcript)
      
      // If final result, stop listening after short delay
      if (isFinal) {
        setTimeout(() => {
          stopListening()
          resetTranscript()
          lastTranscriptRef.current = ''
        }, 500)
      }
    }
  }, [transcript, isFinal, onTranscript, stopListening, resetTranscript])

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
        backgroundColor: pillarColor,
        color: 'rgba(255, 255, 255, 0.92)',
        border: 'none',
        borderRadius: '20px'
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

