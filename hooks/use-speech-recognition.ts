"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionErrorEvent {
  error: string
  message?: string
}

interface UseSpeechRecognitionOptions {
  continuous?: boolean
  interimResults?: boolean
  language?: string
  maxAlternatives?: number
}

interface UseSpeechRecognitionReturn {
  transcript: string
  interimTranscript: string
  finalTranscript: string
  isListening: boolean
  isSupported: boolean
  error: string | null
  startListening: () => void
  stopListening: () => void
  resetTranscript: () => void
}

export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}): UseSpeechRecognitionReturn {
  const { continuous = false, interimResults = true, language = "es-ES", maxAlternatives = 1 } = options

  const [transcript, setTranscript] = useState("")
  const [interimTranscript, setInterimTranscript] = useState("")
  const [finalTranscript, setFinalTranscript] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const recognitionRef = useRef<any | null>(null)
  const isSupported =
    typeof window !== "undefined" && ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)

  // Initialize speech recognition
  useEffect(() => {
    if (!isSupported) return

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = continuous
    recognition.interimResults = interimResults
    recognition.lang = language
    recognition.maxAlternatives = maxAlternatives

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscriptValue = ""
      let finalTranscriptValue = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const transcriptPart = result[0].transcript

        if (result.isFinal) {
          finalTranscriptValue += transcriptPart
        } else {
          interimTranscriptValue += transcriptPart
        }
      }

      setInterimTranscript(interimTranscriptValue)

      if (finalTranscriptValue) {
        setFinalTranscript((prev) => prev + finalTranscriptValue)
        setTranscript((prev) => prev + finalTranscriptValue)
      }
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setIsListening(false)

      let errorMessage = "Error de reconocimiento de voz"

      switch (event.error) {
        case "no-speech":
          errorMessage = "No se detectó voz. Intenta hablar más cerca del micrófono."
          break
        case "audio-capture":
          errorMessage = "No se pudo acceder al micrófono. Verifica los permisos."
          break
        case "not-allowed":
          errorMessage = "Acceso al micrófono denegado. Habilita los permisos en tu navegador."
          break
        case "network":
          errorMessage = "Error de conexión. Verifica tu conexión a internet."
          break
        case "service-not-allowed":
          errorMessage = "Servicio de reconocimiento de voz no disponible."
          break
        case "bad-grammar":
          errorMessage = "Error en la configuración del reconocimiento."
          break
        case "language-not-supported":
          errorMessage = "Idioma no soportado para reconocimiento de voz."
          break
        default:
          errorMessage = `Error de reconocimiento: ${event.error}`
      }

      setError(errorMessage)
    }

    recognitionRef.current = recognition

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
    }
  }, [continuous, interimResults, language, maxAlternatives, isSupported])

  const startListening = useCallback(() => {
    if (!isSupported) {
      setError("Tu navegador no soporta reconocimiento de voz. Usa Chrome o Edge para esta función.")
      return
    }

    if (!recognitionRef.current || isListening) return

    setError(null)
    setInterimTranscript("")

    try {
      recognitionRef.current.start()
    } catch (error) {
      setError("Error al iniciar el reconocimiento de voz")
      setIsListening(false)
    }
  }, [isSupported, isListening])

  const stopListening = useCallback(() => {
    if (!recognitionRef.current || !isListening) return

    try {
      recognitionRef.current.stop()
    } catch (error) {
      console.error("Error stopping speech recognition:", error)
    }
  }, [isListening])

  const resetTranscript = useCallback(() => {
    setTranscript("")
    setInterimTranscript("")
    setFinalTranscript("")
    setError(null)
  }, [])

  return {
    transcript: transcript + interimTranscript,
    interimTranscript,
    finalTranscript,
    isListening,
    isSupported,
    error,
    startListening,
    stopListening,
    resetTranscript,
  }
}

// Extend the Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}
