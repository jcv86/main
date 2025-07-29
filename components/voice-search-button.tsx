"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useSpeechRecognition } from "@/hooks/use-speech-recognition"
import { Mic, MicOff, Loader2, AlertCircle, Volume2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface VoiceSearchButtonProps {
  onTranscript?: (transcript: string) => void
  onStart?: () => void
  onEnd?: () => void
  onError?: (error: string) => void
  disabled?: boolean
  className?: string
  size?: "sm" | "default" | "lg"
  variant?: "default" | "outline" | "ghost"
}

export function VoiceSearchButton({
  onTranscript,
  onStart,
  onEnd,
  onError,
  disabled = false,
  className,
  size = "default",
  variant = "outline",
}: VoiceSearchButtonProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [isCheckingPermission, setIsCheckingPermission] = useState(false)

  const { isListening, transcript, interimTranscript, finalTranscript, error, isSupported, start, stop, reset } =
    useSpeechRecognition({
      continuous: false,
      interimResults: true,
      lang: "es-ES",
      onStart: () => {
        onStart?.()
      },
      onEnd: () => {
        onEnd?.()
        // Send final transcript when recording ends
        if (finalTranscript.trim()) {
          onTranscript?.(finalTranscript.trim())
          reset()
        }
      },
      onError: (errorMessage) => {
        onError?.(errorMessage)
      },
      onResult: (transcript, isFinal) => {
        if (isFinal && transcript.trim()) {
          onTranscript?.(transcript.trim())
          reset()
        }
      },
    })

  // Check microphone permission on mount
  useEffect(() => {
    checkMicrophonePermission()
  }, [])

  const checkMicrophonePermission = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setHasPermission(false)
      return
    }

    setIsCheckingPermission(true)
    try {
      // Check permission state if available
      if (navigator.permissions) {
        const permission = await navigator.permissions.query({ name: "microphone" as PermissionName })
        if (permission.state === "granted") {
          setHasPermission(true)
        } else if (permission.state === "denied") {
          setHasPermission(false)
        } else {
          setHasPermission(null) // Prompt required
        }
      } else {
        setHasPermission(null) // Unknown, will prompt when needed
      }
    } catch (error) {
      console.error("Error checking microphone permission:", error)
      setHasPermission(null)
    } finally {
      setIsCheckingPermission(false)
    }
  }

  const requestMicrophonePermission = async () => {
    try {
      setIsCheckingPermission(true)
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      stream.getTracks().forEach((track) => track.stop()) // Stop the stream immediately
      setHasPermission(true)
      return true
    } catch (error) {
      console.error("Microphone permission denied:", error)
      setHasPermission(false)
      onError?.("Acceso al micrófono denegado. Habilita los permisos en tu navegador.")
      return false
    } finally {
      setIsCheckingPermission(false)
    }
  }

  const handleClick = async () => {
    if (!isSupported) {
      onError?.("Reconocimiento de voz no soportado en este navegador")
      return
    }

    if (isListening) {
      stop()
      return
    }

    // Check/request permission if needed
    if (hasPermission === false) {
      onError?.("Acceso al micrófono denegado. Habilita los permisos en tu navegador.")
      return
    }

    if (hasPermission === null) {
      const granted = await requestMicrophonePermission()
      if (!granted) return
    }

    start()
  }

  const getButtonIcon = () => {
    if (isCheckingPermission) {
      return <Loader2 className="h-4 w-4 animate-spin" />
    }

    if (!isSupported) {
      return <MicOff className="h-4 w-4" />
    }

    if (error) {
      return <AlertCircle className="h-4 w-4" />
    }

    if (isListening) {
      return (
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <Volume2 className="h-4 w-4" />
        </div>
      )
    }

    if (hasPermission === false) {
      return <MicOff className="h-4 w-4" />
    }

    return <Mic className="h-4 w-4" />
  }

  const getTooltipContent = () => {
    if (!isSupported) {
      return "Reconocimiento de voz no soportado en este navegador"
    }

    if (isCheckingPermission) {
      return "Verificando permisos del micrófono..."
    }

    if (hasPermission === false) {
      return "Acceso al micrófono denegado. Habilita los permisos en tu navegador."
    }

    if (error) {
      return error
    }

    if (isListening) {
      const displayText = interimTranscript || "Escuchando... Habla claramente"
      return (
        <div className="max-w-xs">
          <div className="font-medium mb-1">🎤 Grabando</div>
          <div className="text-sm opacity-90">{displayText}</div>
          <div className="text-xs opacity-70 mt-1">Haz clic para detener</div>
        </div>
      )
    }

    return "Haz clic para buscar por voz"
  }

  const getButtonVariant = () => {
    if (error || hasPermission === false) {
      return "destructive"
    }
    if (isListening) {
      return "default"
    }
    return variant
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            type="button"
            variant={getButtonVariant()}
            size={size}
            onClick={handleClick}
            disabled={disabled || isCheckingPermission}
            className={cn(
              "transition-all duration-200",
              isListening && "bg-red-500 hover:bg-red-600 text-white animate-pulse",
              error && "bg-red-500 hover:bg-red-600",
              hasPermission === false && "bg-gray-400 hover:bg-gray-500",
              className,
            )}
            aria-label={isListening ? "Detener grabación de voz" : "Iniciar grabación de voz"}
            aria-pressed={isListening}
          >
            {getButtonIcon()}
          </Button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs">
          <div className="text-center">{getTooltipContent()}</div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
