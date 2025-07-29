"use client"

import { Mic, MicOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSpeechRecognition } from "@/hooks/use-speech-recognition"
import { useEffect } from "react"

interface VoiceSearchButtonProps {
  onTranscript: (transcript: string) => void
  disabled?: boolean
}

export function VoiceSearchButton({ onTranscript, disabled }: VoiceSearchButtonProps) {
  const { isListening, transcript, error, isSupported, startListening, stopListening, resetTranscript } =
    useSpeechRecognition()

  useEffect(() => {
    if (transcript) {
      onTranscript(transcript)
      resetTranscript()
    }
  }, [transcript, onTranscript, resetTranscript])

  if (!isSupported) {
    return null
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={disabled}
      onClick={isListening ? stopListening : startListening}
      className={isListening ? "text-red-500" : ""}
    >
      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      <span className="sr-only">{isListening ? "Detener búsqueda por voz" : "Iniciar búsqueda por voz"}</span>
    </Button>
  )
}
