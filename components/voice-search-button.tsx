"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff } from "lucide-react"
import { useSpeechRecognition } from "@/hooks/use-speech-recognition"
import { toast } from "sonner"

interface VoiceSearchButtonProps {
  onTranscript: (transcript: string) => void
  disabled?: boolean
}

export function VoiceSearchButton({ onTranscript, disabled }: VoiceSearchButtonProps) {
  const { isListening, transcript, isSupported, error, startListening, stopListening, resetTranscript } =
    useSpeechRecognition()

  useEffect(() => {
    if (transcript) {
      onTranscript(transcript)
      resetTranscript()
    }
  }, [transcript, onTranscript, resetTranscript])

  useEffect(() => {
    if (error) {
      toast.error(`Error de reconocimiento de voz: ${error}`)
    }
  }, [error])

  const handleClick = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  if (!isSupported) {
    return null
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleClick}
      disabled={disabled}
      className={`${isListening ? "text-red-500 animate-pulse" : ""}`}
    >
      {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
      <span className="sr-only">{isListening ? "Detener búsqueda por voz" : "Iniciar búsqueda por voz"}</span>
    </Button>
  )
}
