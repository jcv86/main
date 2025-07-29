"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import type { SpeechGrammarList } from "web-speech-api"

// Interfaces para TypeScript
interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList
  resultIndex: number
}

interface SpeechRecognitionErrorEvent {
  error: string
  message?: string
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean
  interimResults: boolean
  lang: string
  maxAlternatives: number
  serviceURI: string
  grammars: SpeechGrammarList
  start(): void
  stop(): void
  abort(): void
  addEventListener(type: "result", listener: (event: SpeechRecognitionEvent) => void): void
  addEventListener(type: "error", listener: (event: SpeechRecognitionErrorEvent) => void): void
  addEventListener(
    type:
      | "start"
      | "end"
      | "speechstart"
      | "speechend"
      | "soundstart"
      | "soundend"
      | "audiostart"
      | "audioend"
      | "nomatch",
    listener: () => void,
  ): void
  removeEventListener(type: string, listener: EventListener): void
}

interface SpeechRecognitionStatic {
  new (): SpeechRecognition
}

declare global {
  interface Window {
    SpeechRecognition: SpeechRecognitionStatic
    webkitSpeechRecognition: SpeechRecognitionStatic
  }
}

interface UseSpeechRecognitionOptions {
  continuous?: boolean
  interimResults?: boolean
  lang?: string
  onResult?: (transcript: string, isFinal: boolean) => void
  onError?: (error: string) => void
  onStart?: () => void
  onEnd?: () => void
}

interface UseSpeechRecognitionReturn {
  transcript: string
  interimTranscript: string
  finalTranscript: string
  isListening: boolean
  isSupported: boolean
  hasPermission: boolean | null
  error: string | null
  startListening: () => Promise<void>
  stopListening: () => void
  resetTranscript: () => void
}

export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}): UseSpeechRecognitionReturn {
  const {
    continuous = false,
    interimResults = true,
    lang = "es-ES", // Español de España (mejor para Chile)
    onResult,
    onError,
    onStart,
    onEnd,
  } = options

  const [transcript, setTranscript] = useState("")
  const [interimTranscript, setInterimTranscript] = useState("")
  const [finalTranscript, setFinalTranscript] = useState("")
  const [isListening, setIsListening] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [error, setError] = useState<string | null>(null)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Verificar soporte del navegador
  const isSupported = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition)

  // Inicializar reconocimiento de voz
  useEffect(() => {
    if (!isSupported) return

    const SpeechRecognitionClass = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognitionClass()

    recognition.continuous = continuous
    recognition.interimResults = interimResults
    recognition.lang = lang
    recognition.maxAlternatives = 1

    // Manejar resultados
    recognition.addEventListener("result", (event: SpeechRecognitionEvent) => {
      let interimText = ""
      let finalText = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const transcript = result[0].transcript

        if (result.isFinal) {
          finalText += transcript
        } else {
          interimText += transcript
        }
      }

      setInterimTranscript(interimText)

      if (finalText) {
        setFinalTranscript((prev) => prev + finalText)
        setTranscript((prev) => prev + finalText)
        onResult?.(finalText, true)
      } else if (interimText) {
        onResult?.(interimText, false)
      }

      // Auto-stop después de 3 segundos de silencio
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        if (isListening) {
          recognition.stop()
        }
      }, 3000)
    })

    // Manejar errores
    recognition.addEventListener("error", (event: SpeechRecognitionErrorEvent) => {
      let errorMessage = "Error desconocido"

      switch (event.error) {
        case "no-speech":
          errorMessage = "No se detectó voz. Intenta hablar más claro."
          break
        case "audio-capture":
          errorMessage = "No se pudo acceder al micrófono."
          break
        case "not-allowed":
          errorMessage = "Acceso al micrófono denegado. Permite el acceso en la configuración del navegador."
          setHasPermission(false)
          break
        case "network":
          errorMessage = "Error de conexión. Verifica tu conexión a internet."
          break
        case "language-not-supported":
          errorMessage = "Idioma no soportado."
          break
        case "service-not-allowed":
          errorMessage = "Servicio de reconocimiento de voz no permitido."
          break
        default:
          errorMessage = `Error de reconocimiento: ${event.error}`
      }

      setError(errorMessage)
      setIsListening(false)
      onError?.(errorMessage)
    })

    // Manejar inicio
    recognition.addEventListener("start", () => {
      setIsListening(true)
      setError(null)
      setHasPermission(true)
      onStart?.()
    })

    // Manejar fin
    recognition.addEventListener("end", () => {
      setIsListening(false)
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      onEnd?.()
    })

    recognitionRef.current = recognition

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      recognition.removeEventListener("result", () => {})
      recognition.removeEventListener("error", () => {})
      recognition.removeEventListener("start", () => {})
      recognition.removeEventListener("end", () => {})
    }
  }, [continuous, interimResults, lang, onResult, onError, onStart, onEnd, isSupported, isListening])

  // Función para iniciar escucha
  const startListening = useCallback(async (): Promise<void> => {
    if (!isSupported) {
      setError("Tu navegador no soporta reconocimiento de voz")
      return
    }

    if (!recognitionRef.current) {
      setError("Reconocimiento de voz no inicializado")
      return
    }

    if (isListening) {
      return
    }

    // Verificar permisos de micrófono
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true })
      setHasPermission(true)
    } catch (err) {
      setHasPermission(false)
      setError("Acceso al micrófono denegado. Permite el acceso para usar la búsqueda por voz.")
      return
    }

    try {
      setError(null)
      setInterimTranscript("")
      recognitionRef.current.start()
    } catch (err) {
      setError("Error al iniciar reconocimiento de voz")
      setIsListening(false)
    }
  }, [isSupported, isListening])

  // Función para detener escucha
  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }, [isListening])

  // Función para resetear transcript
  const resetTranscript = useCallback(() => {
    setTranscript("")
    setInterimTranscript("")
    setFinalTranscript("")
    setError(null)
  }, [])

  return {
    transcript,
    interimTranscript,
    finalTranscript,
    isListening,
    isSupported,
    hasPermission,
    error,
    startListening,
    stopListening,
    resetTranscript,
  }
}
