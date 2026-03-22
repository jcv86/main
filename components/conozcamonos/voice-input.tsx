import { Mic, MicOff, Volume2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useSpeechRecognition } from '@/lib/hooks/use-speech-recognition'
import { useEffect } from 'react'

interface VoiceInputProps {
  onTranscript: (text: string) => void
  isDisabled?: boolean
}

export function VoiceInput({ onTranscript, isDisabled = false }: VoiceInputProps) {
  const { isListening, isSupported, transcript, startListening, stopListening } = useSpeechRecognition({
    language: 'es-ES',
    continuous: false,
    interimResults: true
  })

  useEffect(() => {
    if (transcript) {
      onTranscript(transcript)
    }
  }, [transcript, onTranscript])

  if (!isSupported) {
    return (
      <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-2">
        <Volume2 className="w-3 h-3" />
        Micrófono no disponible en tu navegador
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
      title={isListening ? 'Detener grabación (hablando...)' : 'Usar micrófono para responder'}
    >
      {isListening ? (
        <>
          <MicOff className="w-4 h-4" />
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
