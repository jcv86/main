"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff } from "lucide-react"
import { useSpeechRecognition } from "@/hooks/use-speech-recognition"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface VoiceSearchButtonProps {
  onTranscript?: (transcript: string) => void
  className?: string
}

export function VoiceSearchButton({ onTranscript, className }: VoiceSearchButtonProps) {
  const { isListening, transcript, isSupported, error, startListening, stopListening, resetTranscript } =
    useSpeechRecognition()

  const handleClick = () => {
    if (isListening) {
      stopListening()
    } else {
      resetTranscript()
      startListening()
    }
  }

  // Handle transcript changes
  useState(() => {
    if (transcript && onTranscript) {
      onTranscript(transcript)
      resetTranscript()
    }
  })

  // Handle errors
  useState(() => {
    if (error) {
      toast.error(error)
    }
  })

  if (!isSupported) {
    return null
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      className={cn("relative", isListening && "text-red-500 animate-pulse", className)}
      disabled={!isSupported}
    >
      {isListening ? (
        <>
          <MicOff className="h-4 w-4" />
          <span className="absolute -top-1 -right-1 h-2 w-2 bg-red-500 rounded-full animate-ping" />
        </>
      ) : (
        <Mic className="h-4 w-4" />
      )}
      <span className="sr-only">{isListening ? "Detener búsqueda por voz" : "Iniciar búsqueda por voz"}</span>
    </Button>
  )
}
