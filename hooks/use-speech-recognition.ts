"use client"

import { useState, useEffect, useRef, useCallback } from "react"

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
  start(): void
  stop(): void
  abort(): void
  onstart: ((this: SpeechRecognition, ev: Event) => any) | null
  onend: ((this: SpeechRecognition, ev: Event) => any) | null
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null
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

export interface UseSpeechRecognitionOptions {
  continuous?: boolean
  interimResults?: boolean
  lang?: string
  onStart?: () => void
  onEnd?: () => void
  onError?: (error: string) => void
  onResult?: (transcript: string, isFinal: boolean) => void
}

export interface UseSpeechRecognitionReturn {
  isListening: boolean
  transcript: string
  interimTranscript: string
  finalTranscript: string
  error: string | null
  isSupported: boolean
  start: () => void
  stop: () => void
  reset: () => void
}

export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}): UseSpeechRecognitionReturn {
  const { continuous = false, interimResults = true, lang = "es-ES", onStart, onEnd, onError, onResult } = options

  const [isListening, setIsListening] = useState(false)
  const [transcript, setTranscript] = useState("")
  const [interimTranscript, setInterimTranscript] = useState("")
  const [finalTranscript, setFinalTranscript] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isSupported, setIsSupported] = useState(false)

  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Check browser support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    setIsSupported(!!SpeechRecognition)

    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition()
    }
  }, [])

  // Configure recognition
  useEffect(() => {
    if (!recognitionRef.current) return

    const recognition = recognitionRef.current
    recognition.continuous = continuous
    recognition.interimResults = interimResults
    recognition.lang = lang

    recognition.onstart = () => {
      setIsListening(true)
      setError(null)
      onStart?.()
    }

    recognition.onend = () => {
      setIsListening(false)
      onEnd?.()
    }

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = ""
      let finalTranscript = ""

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i]
        const transcript = result[0].transcript

        if (result.isFinal) {
          finalTranscript += transcript
        } else {
          interimTranscript += transcript
        }
      }

      setInterimTranscript(interimTranscript)

      if (finalTranscript) {
        setFinalTranscript((prev) => prev + finalTranscript)
        setTranscript((prev) => prev + finalTranscript)
        onResult?.(finalTranscript, true)
      } else if (interimTranscript) {
        onResult?.(interimTranscript, false)
      }

      // Auto-stop after 3 seconds of silence for non-continuous mode
      if (!continuous && timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      if (!continuous) {
        timeoutRef.current = setTimeout(() => {
          if (recognitionRef.current && isListening) {
            recognitionRef.current.stop()
          }
        }, 3000)
      }
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
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
          errorMessage = "Idioma no soportado."
          break
        default:
          errorMessage = `Error: ${event.error}`
      }

      setError(errorMessage)
      setIsListening(false)
      onError?.(errorMessage)
    }
  }, [continuous, interimResults, lang, onStart, onEnd, onError, onResult, isListening])

  const start = useCallback(() => {
    if (!recognitionRef.current || !isSupported) {
      const errorMsg = "Reconocimiento de voz no soportado en este navegador"
      setError(errorMsg)
      onError?.(errorMsg)
      return
    }

    if (isListening) return

    setError(null)
    setInterimTranscript("")

    try {
      recognitionRef.current.start()
    } catch (error) {
      const errorMsg = "Error al iniciar el reconocimiento de voz"
      setError(errorMsg)
      onError?.(errorMsg)
    }
  }, [isSupported, isListening, onError])

  const stop = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop()
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }, [isListening])

  const reset = useCallback(() => {
    stop()
    setTranscript("")
    setInterimTranscript("")
    setFinalTranscript("")
    setError(null)
  }, [stop])

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop()
      }
    }
  }, [isListening])

  return {
    isListening,
    transcript,
    interimTranscript,
    finalTranscript,
    error,
    isSupported,
    start,
    stop,
    reset,
  }
}
