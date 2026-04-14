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
    interimResults = false,
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
      return
    }

    setIsSupported(true)
    const recognition = new SpeechRecognition()
    recognition.continuous = continuous
    recognition.interimResults = interimResults
    recognition.lang = language

    recognition.onstart = () => {
      setIsListening(true)
      setIsFinal(false)
      setError(null)
      lastResultRef.current = ''
    }

    recognition.onresult = (event: any) => {
      let interimTranscript = ''
      let finalTranscript = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript

        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' '
        } else {
          interimTranscript += transcript
        }
      }

      // Only update if we have final results
      if (finalTranscript.trim()) {
        lastResultRef.current = finalTranscript.trim()
        setTranscript(finalTranscript.trim())
        setIsFinal(true)

        // Reset silence timer
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current)
        }

        // Set new silence timer - stop after 2 seconds of silence
        silenceTimerRef.current = setTimeout(() => {
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
    }

    recognition.onend = () => {
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
    if (!recognitionRef.current) return
    setTranscript('')
    setIsFinal(false)
    setError(null)
    lastResultRef.current = ''
    recognitionRef.current.start()
  }

  const stopListening = () => {
    if (!recognitionRef.current) return
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current)
    }
    recognitionRef.current.stop()
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

