"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Mic, Loader2 } from "lucide-react"
import { useSpeechRecognition } from "@/hooks/use-speech-recognition"
import { cn } from "@/lib/utils"

interface VoiceSearchButtonProps {
  onTranscript?: (transcript: string, isFinal: boolean) => void
  onError?: (error: string) => void
  disabled?: boolean
  size?: "sm" | "default" | "lg"
  variant?: "default" | "outline" | "ghost"
  className?: string
}

export function VoiceSearchButton({
  onTranscript,
  onError,
  disabled = false,
  size = "default",
  variant = "outline",
  className,
}: VoiceSearchButtonProps) {
  const [isProcessing, setIsProcessing] = useState(false)

  const {
    transcript,
    interimTranscript,
    isListening,
    isSupported,
    hasPermission,
    error,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition({
    continuous: false,
    interimResults: true,
    lang: "es-ES",
    onResult: (text, isFinal) => {
      onTranscript?.(text, isFinal)
      if (isFinal) {
        setIsProcessing(false)
      }
    },
    onError: (err) => {
      onError?.(err)
      setIsProcessing(false)
    },
    onStart: () => {
      resetTranscript()
      setIsProcessing(true)
    },
    onEnd: () => {
      setIsProcessing(false)
    },
  })

  const handleClick = async () => {
    if (isListening) {
      stopListening()
    } else {
      await startListening()
    }
  }

  const getButtonContent = () => {
    if (isProcessing && !isListening) {
      return (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="ml-2 hidden sm:inline">Procesando...</span>
        </>
      )
    }

    if (isListening) {
      return (
        <>
          <div className="relative">
            <Mic className="h-4 w-4 text-red-500" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          </div>
          <span className="ml-2 hidden sm:inline text-red-500">Escuchando...</span>
        </>
      )
    }

    return (
      <>
        <Mic className="h-4 w-4" />
        <span className="ml-2 hidden sm:inline">Buscar por voz</span>
      </>
    )
  }

  const getTooltipContent = () => {
    if (!isSupported) {
      return "Tu navegador no soporta reconocimiento de voz"
    }

    if (hasPermission === false) {
      return "Acceso al micrófono denegado. Permite el acceso en la configuración del navegador."
    }

    if (error) {
      return error
    }

    if (isListening) {
      return interimTranscript || "Habla ahora..."
    }

    if (isProcessing) {
      return "Procesando tu voz..."
    }

    return "Haz clic para buscar por voz"
  }

  const isButtonDisabled = disabled || !isSupported || hasPermission === false

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={handleClick}
            disabled={isButtonDisabled}
            size={size}
            variant={variant}
            className={cn(
              "transition-all duration-200",
              isListening && "ring-2 ring-red-500 ring-opacity-50",
              error && "border-red-300 text-red-600",
              className,
            )}
          >
            {getButtonContent()}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="bottom" className="max-w-xs">
          <p className="text-sm">{getTooltipContent()}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
