import { useEffect, useRef, useState } from 'react'

export interface UseSpeechRecognitionOptions {
  language?: string
  continuous?: boolean
  interimResults?: boolean
  silenceTimeout?: number
}

export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}) {
  const {
    language = 'es-ES',
    continuous = false,
    interimResults = true,
    silenceTimeout = 2000
  } = options

  const [isListening, setIsListening] = useState(false)
  const [isSupported, setIsSupported] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isFinal, setIsFinal] = useState(false)
  const recognitionRef = useRef<any>(null)
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastResultRef = useRef<string>('')

  useEffect(() => {
    if (typeof window === 'undefined') return

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    
    if (!SpeechRecognition) {
      setIsSupported(false)
      console.warn('[v0] Speech Recognition API not supported')
      return
    }

    setIsSupported(true)
    const recognition = new SpeechRecognition()
    recognition.continuous = continuous
    recognition.interimResults = interimResults
    recognition.lang = language
    recognition.maxAlternatives = 1

    recognition.onstart = () => {
      console.log('[v0] Speech recognition started')
      setIsListening(true)
      setIsFinal(false)
      setError(null)
      lastResultRef.current = ''
      setTranscript('')
    }

    recognition.onresult = (event: any) => {
      console.log('[v0] Recognition result event', { resultIndex: event.resultIndex, resultsLength: event.results.length })
      
      let interimTranscript = ''
      let finalTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        const confidence = event.results[i][0].confidence

        console.log('[v0] Result:', { transcript, confidence, isFinal: event.results[i].isFinal })

        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' '
        } else {
          interimTranscript += transcript
        }
      }

      // Update with interim results if enabled
      if (interimTranscript.trim()) {
        setTranscript(interimTranscript.trim())
        setIsFinal(false)
      }

      // Update with final results when available
      if (finalTranscript.trim()) {
        lastResultRef.current = finalTranscript.trim()
        setTranscript(finalTranscript.trim())
        setIsFinal(true)
        console.log('[v0] Final transcript set:', finalTranscript.trim())

        // Reset silence timer
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current)
        }

        // Set new silence timer - stop after silenceTimeout ms of silence
        silenceTimerRef.current = setTimeout(() => {
          console.log('[v0] Silence timeout - stopping recognition')
          if (recognitionRef.current) {
            recognitionRef.current.stop()
          }
        }, silenceTimeout)
      }
    }

    recognition.onerror = (event: any) => {
      console.error('[v0] Speech recognition error:', event.error)
      setError(event.error)
      setIsListening(false)
      
      // Handle specific errors
      if (event.error === 'no-speech') {
        setError('No se detectó voz. Intenta hablar más fuerte.')
      } else if (event.error === 'audio-capture') {
        setError('No hay micrófono disponible.')
      } else if (event.error === 'not-allowed') {
        setError('Permiso de micrófono denegado.')
      } else if (event.error === 'network') {
        setError('Error de conexión.')
      }
    }

    recognition.onend = () => {
      console.log('[v0] Speech recognition ended')
      setIsListening(false)
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
      }
    }

    recognitionRef.current = recognition

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current)
      }
    }
  }, [language, continuous, interimResults, silenceTimeout])

  const startListening = () => {
    if (!recognitionRef.current) {
      console.warn('[v0] Recognition not initialized')
      return
    }
    console.log('[v0] Starting listening...')
    setTranscript('')
    setIsFinal(false)
    setError(null)
    lastResultRef.current = ''
    try {
      recognitionRef.current.start()
    } catch (err) {
      console.error('[v0] Error starting recognition:', err)
    }
  }

  const stopListening = () => {
    if (!recognitionRef.current) return
    console.log('[v0] Stopping listening...')
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
    }
    try {
      recognitionRef.current.stop()
    } catch (err) {
      console.error('[v0] Error stopping recognition:', err)
    }
  }

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const resetTranscript = () => {
    setTranscript('')
    setIsFinal(false)
    lastResultRef.current = ''
  }

  return {
    isListening,
    isSupported,
    transcript,
    isFinal,
    error,
    startListening,
    stopListening,
    toggleListening,
    resetTranscript
  }
}

