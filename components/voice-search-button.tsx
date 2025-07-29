"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useSpeechRecognition } from "@/hooks/use-speech-recognition"
import { Mic, MicOff, Volume2, AlertCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface VoiceSearchButtonProps {
  onTranscript: (transcript: string) => void
  onStart?: () => void
  onEnd?: () => void
  disabled?: boolean
  className?: string
  size?: "sm" | "default" | "lg"
  variant?: "default" | "outline" | "ghost"
}

export function VoiceSearchButton({
  onTranscript,
  onStart,
  onEnd,
  disabled = false,
  className,
  size = "default",
  variant = "outline",
}: VoiceSearchButtonProps) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [isCheckingPermission, setIsCheckingPermission] = useState(false)

  const {
    transcript,
    interimTranscript,
    finalTranscript,
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
  } = useSpeechRecognition({
    continuous: false,
    interimResults: true,
    language: "es-ES",
  })

  // Check microphone permission on mount
  useEffect(() => {
    const checkPermission = async () => {
      if (!navigator.mediaDevices || !navigator.permissions) {
        setHasPermission(false)
        return
      }

      try {
        setIsCheckingPermission(true)
        const permission = await navigator.permissions.query({ name: "microphone" as PermissionName })
        setHasPermission(permission.state === "granted")

        permission.onchange = () => {
          setHasPermission(permission.state === "granted")
        }
      } catch (error) {
        console.error("Error checking microphone permission:", error)
        setHasPermission(false)
      } finally {
        setIsCheckingPermission(false)
      }
    }

    checkPermission()
  }, [])

  // Handle transcript changes
  useEffect(() => {
    if (finalTranscript) {
      onTranscript(finalTranscript.trim())
      resetTranscript()
    }
  }, [finalTranscript, onTranscript, resetTranscript])

  // Handle listening state changes
  useEffect(() => {
    if (isListening && onStart) {
      onStart()
    } else if (!isListening && onEnd) {
      onEnd()
    }
  }, [isListening, onStart, onEnd])

  const handleClick = async () => {
    if (!isSupported) {
      return
    }

    if (isListening) {
      stopListening()
      return
    }

    // Request microphone permission if not granted
    if (hasPermission === false) {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true })
        setHasPermission(true)
      } catch (error) {
        console.error("Microphone permission denied:", error)
        return
      }
    }

    resetTranscript()
    startListening()
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
        <div className="relative">
          <Mic className="h-4 w-4" />
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
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

    if (error) {
      return error
    }

    if (hasPermission === false) {
      return "Haz clic para habilitar el micrófono"
    }

    if (isListening) {
      return "Grabando... Haz clic para detener"
    }

    return "Haz clic y habla para buscar por voz"
  }

  const getButtonVariant = () => {
    if (error) return "destructive"
    if (isListening) return "default"
    return variant
  }

  return (
    <TooltipProvider>
      <div className="relative">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              type="button"
              variant={getButtonVariant()}
              size={size}
              onClick={handleClick}
              disabled={disabled || isCheckingPermission || (!isSupported && !error)}
              className={cn(
                "transition-all duration-200",
                isListening && "bg-red-500 hover:bg-red-600 text-white",
                error && "bg-red-500 hover:bg-red-600",
                className,
              )}
            >
              {getButtonIcon()}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <p className="text-sm">{getTooltipContent()}</p>
          </TooltipContent>
        </Tooltip>

        {/* Live transcript display */}
        {isListening && interimTranscript && (
          <div className="absolute top-full left-0 mt-2 p-2 bg-popover border rounded-md shadow-md min-w-48 max-w-xs z-50">
            <div className="flex items-center gap-2 mb-1">
              <Volume2 className="h-3 w-3 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Transcribiendo...</span>
            </div>
            <p className="text-sm text-foreground">{interimTranscript}</p>
          </div>
        )}
      </div>
    </TooltipProvider>
  )
}
