"use client"

import { useState, useEffect, useCallback, useRef } from "react"

interface TTSOptions {
  rate?: number
  pitch?: number
  volume?: number
  voice?: SpeechSynthesisVoice | null
  lang?: string
}

interface TTSState {
  isSupported: boolean
  isPlaying: boolean
  isPaused: boolean
  isLoading: boolean
  currentPosition: number
  totalLength: number
  error: string | null
}

export function useTextToSpeech(text: string, options: TTSOptions = {}) {
  const [state, setState] = useState<TTSState>({
    isSupported: false,
    isPlaying: false,
    isPaused: false,
    isLoading: false,
    currentPosition: 0,
    totalLength: 0,
    error: null,
  })

  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const textChunksRef = useRef<string[]>([])
  const currentChunkRef = useRef(0)
  const positionRef = useRef(0)

  // Default options
  const { rate = 1, pitch = 1, volume = 1, voice = null, lang = "es-ES" } = options

  // Check for browser support and load voices
  useEffect(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      setState((prev) => ({ ...prev, isSupported: true }))

      const loadVoices = () => {
        const availableVoices = speechSynthesis.getVoices()
        console.log("Available voices:", availableVoices)
        setVoices(availableVoices)
      }

      // Load voices immediately
      loadVoices()

      // Also load when voices change (some browsers load them asynchronously)
      speechSynthesis.onvoiceschanged = loadVoices

      return () => {
        speechSynthesis.onvoiceschanged = null
      }
    }
  }, [])

  // Split text into manageable chunks
  const splitTextIntoChunks = useCallback((text: string): string[] => {
    if (!text || text.trim().length === 0) {
      console.log("No text provided for TTS")
      return []
    }

    // Remove HTML tags and clean text
    const cleanText = text
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .trim()

    console.log("Clean text length:", cleanText.length)
    console.log("Clean text preview:", cleanText.substring(0, 200))

    if (cleanText.length === 0) {
      console.log("Text is empty after cleaning")
      return []
    }

    // Split by sentences, keeping punctuation
    const sentences = cleanText.match(/[^.!?]+[.!?]+/g) || [cleanText]
    console.log("Found sentences:", sentences.length)

    const chunks: string[] = []
    let currentChunk = ""
    const maxChunkLength = 200 // Characters per chunk

    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim()
      if (!trimmedSentence) continue

      if (currentChunk.length + trimmedSentence.length > maxChunkLength && currentChunk.length > 0) {
        chunks.push(currentChunk.trim())
        currentChunk = trimmedSentence
      } else {
        currentChunk += (currentChunk ? " " : "") + trimmedSentence
      }
    }

    if (currentChunk.trim()) {
      chunks.push(currentChunk.trim())
    }

    console.log("Created chunks:", chunks.length)
    return chunks.filter((chunk) => chunk.length > 0)
  }, [])

  // Update text chunks when text changes
  useEffect(() => {
    if (text) {
      const chunks = splitTextIntoChunks(text)
      textChunksRef.current = chunks
      setState((prev) => ({
        ...prev,
        totalLength: chunks.length,
        currentPosition: 0,
      }))
      currentChunkRef.current = 0
      positionRef.current = 0
      console.log("Text chunks updated:", chunks.length)
    }
  }, [text, splitTextIntoChunks])

  // Get the best Spanish voice
  const getSpanishVoice = useCallback((): SpeechSynthesisVoice | null => {
    if (voice) return voice

    console.log("Looking for Spanish voice among:", voices.length, "voices")

    // First try to find Spanish voices
    const spanishVoices = voices.filter(
      (v) =>
        v.lang.toLowerCase().includes("es") ||
        v.name.toLowerCase().includes("spanish") ||
        v.name.toLowerCase().includes("español"),
    )

    console.log("Spanish voices found:", spanishVoices.length)

    if (spanishVoices.length > 0) {
      // Prefer female voices for better listening experience
      const femaleVoice = spanishVoices.find(
        (v) =>
          v.name.toLowerCase().includes("female") ||
          v.name.toLowerCase().includes("mujer") ||
          v.name.toLowerCase().includes("maria") ||
          v.name.toLowerCase().includes("carmen") ||
          v.name.toLowerCase().includes("monica") ||
          v.name.toLowerCase().includes("paloma"),
      )

      if (femaleVoice) {
        console.log("Selected female Spanish voice:", femaleVoice.name)
        return femaleVoice
      }

      console.log("Selected Spanish voice:", spanishVoices[0].name)
      return spanishVoices[0]
    }

    // Fallback to any available voice
    if (voices.length > 0) {
      console.log("Fallback to default voice:", voices[0].name)
      return voices[0]
    }

    console.log("No voices available")
    return null
  }, [voices, voice])

  // Create and configure utterance
  const createUtterance = useCallback(
    (text: string): SpeechSynthesisUtterance => {
      const utterance = new SpeechSynthesisUtterance(text)

      utterance.rate = rate
      utterance.pitch = pitch
      utterance.volume = volume
      utterance.lang = lang

      const selectedVoice = getSpanishVoice()
      if (selectedVoice) {
        utterance.voice = selectedVoice
        console.log("Using voice:", selectedVoice.name, "for text:", text.substring(0, 50))
      } else {
        console.log("No voice selected, using default")
      }

      return utterance
    },
    [rate, pitch, volume, lang, getSpanishVoice],
  )

  // Play next chunk
  const playNextChunk = useCallback(() => {
    console.log("Playing chunk", currentChunkRef.current, "of", textChunksRef.current.length)

    if (currentChunkRef.current >= textChunksRef.current.length) {
      // Finished reading
      console.log("Finished reading all chunks")
      setState((prev) => ({
        ...prev,
        isPlaying: false,
        isPaused: false,
        currentPosition: textChunksRef.current.length,
      }))
      return
    }

    const chunk = textChunksRef.current[currentChunkRef.current]
    console.log("Current chunk text:", chunk)

    if (!chunk || chunk.trim().length === 0) {
      console.log("Empty chunk, skipping to next")
      currentChunkRef.current += 1
      setTimeout(() => playNextChunk(), 100)
      return
    }

    const utterance = createUtterance(chunk)

    utterance.onstart = () => {
      console.log("Utterance started")
      setState((prev) => ({
        ...prev,
        isPlaying: true,
        isPaused: false,
        isLoading: false,
        error: null,
      }))
    }

    utterance.onend = () => {
      console.log("Utterance ended")
      currentChunkRef.current += 1
      positionRef.current = currentChunkRef.current
      setState((prev) => ({
        ...prev,
        currentPosition: currentChunkRef.current,
      }))

      // Continue with next chunk after a short delay
      setTimeout(() => playNextChunk(), 100)
    }

    utterance.onerror = (event) => {
      console.error("Utterance error:", event.error)
      setState((prev) => ({
        ...prev,
        isPlaying: false,
        isPaused: false,
        isLoading: false,
        error: `Error de síntesis de voz: ${event.error}`,
      }))
    }

    utteranceRef.current = utterance

    try {
      console.log("Speaking utterance...")
      speechSynthesis.speak(utterance)
    } catch (error) {
      console.error("Error speaking:", error)
      setState((prev) => ({
        ...prev,
        isPlaying: false,
        isPaused: false,
        isLoading: false,
        error: "Error al reproducir audio",
      }))
    }
  }, [createUtterance])

  // Start playing
  const play = useCallback(() => {
    console.log("Play requested")

    if (!state.isSupported) {
      const error = "Text-to-Speech no está soportado en este navegador"
      console.log(error)
      setState((prev) => ({ ...prev, error }))
      return
    }

    if (textChunksRef.current.length === 0) {
      const error = "No hay texto para reproducir"
      console.log(error)
      setState((prev) => ({ ...prev, error }))
      return
    }

    console.log("Starting playback...")
    setState((prev) => ({ ...prev, isLoading: true, error: null }))

    // Stop any current speech
    speechSynthesis.cancel()

    // Wait a bit for cancel to complete, then start
    setTimeout(() => {
      playNextChunk()
    }, 100)
  }, [state.isSupported, playNextChunk])

  // Pause playback
  const pause = useCallback(() => {
    console.log("Pause requested")
    if (speechSynthesis.speaking && !speechSynthesis.paused) {
      speechSynthesis.pause()
      setState((prev) => ({ ...prev, isPaused: true, isPlaying: false }))
    }
  }, [])

  // Resume playback
  const resume = useCallback(() => {
    console.log("Resume requested")
    if (speechSynthesis.paused) {
      speechSynthesis.resume()
      setState((prev) => ({ ...prev, isPaused: false, isPlaying: true }))
    }
  }, [])

  // Stop playback
  const stop = useCallback(() => {
    console.log("Stop requested")
    speechSynthesis.cancel()
    currentChunkRef.current = 0
    positionRef.current = 0
    setState((prev) => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      isLoading: false,
      currentPosition: 0,
      error: null,
    }))
  }, [])

  // Skip to position
  const skipTo = useCallback(
    (position: number) => {
      const clampedPosition = Math.max(0, Math.min(position, textChunksRef.current.length - 1))
      console.log("Skip to position:", clampedPosition)

      currentChunkRef.current = clampedPosition
      positionRef.current = clampedPosition

      setState((prev) => ({ ...prev, currentPosition: clampedPosition }))

      if (state.isPlaying) {
        speechSynthesis.cancel()
        setTimeout(() => playNextChunk(), 100)
      }
    },
    [state.isPlaying, playNextChunk],
  )

  // Skip forward/backward
  const skipForward = useCallback(() => {
    skipTo(currentChunkRef.current + 5) // Skip 5 chunks forward
  }, [skipTo])

  const skipBackward = useCallback(() => {
    skipTo(currentChunkRef.current - 5) // Skip 5 chunks backward
  }, [skipTo])

  // Get progress percentage
  const getProgress = useCallback(() => {
    if (state.totalLength === 0) return 0
    return (state.currentPosition / state.totalLength) * 100
  }, [state.currentPosition, state.totalLength])

  // Get time estimates
  const getTimeEstimate = useCallback(() => {
    const wordsPerMinute = 150 * rate // Adjust for speech rate
    const totalWords = textChunksRef.current.join(" ").split(" ").length
    const currentWords = textChunksRef.current.slice(0, state.currentPosition).join(" ").split(" ").length

    const totalMinutes = Math.ceil(totalWords / wordsPerMinute)
    const currentMinutes = Math.ceil(currentWords / wordsPerMinute)
    const remainingMinutes = Math.max(0, totalMinutes - currentMinutes)

    const formatTime = (minutes: number) => {
      const hrs = Math.floor(minutes / 60)
      const mins = minutes % 60
      return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`
    }

    return {
      current: formatTime(currentMinutes),
      total: formatTime(totalMinutes),
      remaining: formatTime(remainingMinutes),
    }
  }, [rate, state.currentPosition])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      speechSynthesis.cancel()
    }
  }, [])

  return {
    ...state,
    voices,
    play,
    pause,
    resume,
    stop,
    skipTo,
    skipForward,
    skipBackward,
    getProgress,
    getTimeEstimate,
    isActive: state.isPlaying || state.isPaused,
  }
}
