"use client"

import { useState, useEffect, useRef, useCallback } from "react"

export interface TTSState {
  isPlaying: boolean
  isPaused: boolean
  currentSegment: number
  totalSegments: number
  progress: number
  estimatedTimeRemaining: number
  availableVoices: SpeechSynthesisVoice[]
  selectedVoice: SpeechSynthesisVoice | null
  rate: number
  pitch: number
  volume: number
  debugInfo: {
    originalTextLength: number
    cleanedTextLength: number
    segments: string[]
    currentVoice: string
    speechSynthesisSupported: boolean
  }
}

export function useTextToSpeech(text?: string) {
  const [state, setState] = useState<TTSState>({
    isPlaying: false,
    isPaused: false,
    currentSegment: 0,
    totalSegments: 0,
    progress: 0,
    estimatedTimeRemaining: 0,
    availableVoices: [],
    selectedVoice: null,
    rate: 1,
    pitch: 1,
    volume: 1,
    debugInfo: {
      originalTextLength: 0,
      cleanedTextLength: 0,
      segments: [],
      currentVoice: "",
      speechSynthesisSupported: false,
    },
  })

  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)
  const segmentsRef = useRef<string[]>([])
  const startTimeRef = useRef<number>(0)

  // Clean and prepare text for TTS
  const cleanText = useCallback((rawText: string): string => {
    if (!rawText || typeof rawText !== "string") {
      console.log("No valid text provided for cleaning")
      return ""
    }

    console.log("🧹 Cleaning text for TTS...")
    console.log("Original text length:", rawText.length)

    const cleaned = rawText
      // Remove HTML tags
      .replace(/<[^>]*>/g, " ")
      // Remove markdown formatting
      .replace(/\*\*([^*]+)\*\*/g, "$1") // Bold
      .replace(/\*([^*]+)\*/g, "$1") // Italic
      .replace(/`([^`]+)`/g, "$1") // Code
      .replace(/#{1,6}\s/g, "") // Headers
      // Remove special characters that might cause issues
      .replace(/[""'']/g, '"')
      .replace(/[–—]/g, "-")
      .replace(/…/g, "...")
      // Clean up whitespace
      .replace(/\s+/g, " ")
      .replace(/\n\s*\n/g, ". ")
      .replace(/\n/g, " ")
      .trim()

    console.log("Cleaned text length:", cleaned.length)
    console.log("First 200 chars:", cleaned.substring(0, 200))

    return cleaned
  }, [])

  // Split text into manageable segments
  const createSegments = useCallback((cleanedText: string): string[] => {
    console.log("✂️ Creating segments...")

    if (!cleanedText || typeof cleanedText !== "string" || !cleanedText.trim()) {
      console.log("No text to segment")
      return []
    }

    const maxSegmentLength = 200
    const sentences = cleanedText.split(/[.!?]+/).filter((s) => s && s.trim().length > 0)
    const segments: string[] = []
    let currentSegment = ""

    for (const sentence of sentences) {
      const trimmedSentence = sentence.trim()
      if (!trimmedSentence) continue

      const potentialSegment = currentSegment ? `${currentSegment}. ${trimmedSentence}` : trimmedSentence

      if (potentialSegment.length <= maxSegmentLength) {
        currentSegment = potentialSegment
      } else {
        if (currentSegment) {
          segments.push(currentSegment + ".")
          currentSegment = trimmedSentence
        } else {
          // Handle very long sentences by splitting on commas
          const parts = trimmedSentence.split(",")
          let tempSegment = ""

          for (const part of parts) {
            const trimmedPart = part.trim()
            if (!trimmedPart) continue

            const potentialTemp = tempSegment ? `${tempSegment}, ${trimmedPart}` : trimmedPart

            if (potentialTemp.length <= maxSegmentLength) {
              tempSegment = potentialTemp
            } else {
              if (tempSegment) {
                segments.push(tempSegment + ".")
              }
              tempSegment = trimmedPart
            }
          }

          if (tempSegment) {
            currentSegment = tempSegment
          }
        }
      }
    }

    if (currentSegment) {
      segments.push(currentSegment + ".")
    }

    console.log(`Created ${segments.length} segments`)
    console.log(
      "Segment lengths:",
      segments.map((s) => s.length),
    )

    return segments
  }, [])

  // Load available voices
  const loadVoices = useCallback(() => {
    console.log("🎤 Loading voices...")

    if (!("speechSynthesis" in window)) {
      console.log("Speech synthesis not supported")
      return []
    }

    const voices = speechSynthesis.getVoices()
    console.log(`Found ${voices.length} voices`)

    // Prioritize Spanish voices
    const spanishVoices = voices.filter(
      (voice) =>
        voice.lang.startsWith("es") ||
        voice.name.toLowerCase().includes("spanish") ||
        voice.name.toLowerCase().includes("español"),
    )

    const otherVoices = voices.filter(
      (voice) =>
        !voice.lang.startsWith("es") &&
        !voice.name.toLowerCase().includes("spanish") &&
        !voice.name.toLowerCase().includes("español"),
    )

    const sortedVoices = [...spanishVoices, ...otherVoices]

    console.log("Spanish voices found:", spanishVoices.length)
    console.log(
      "Voice details:",
      sortedVoices.map((v) => ({
        name: v.name,
        lang: v.lang,
        default: v.default,
        localService: v.localService,
      })),
    )

    return sortedVoices
  }, [])

  // Initialize TTS system
  useEffect(() => {
    console.log("🚀 Initializing TTS system...")

    const speechSupported = "speechSynthesis" in window
    console.log("Speech synthesis supported:", speechSupported)

    if (!speechSupported) {
      setState((prev) => ({
        ...prev,
        debugInfo: {
          ...prev.debugInfo,
          speechSynthesisSupported: false,
        },
      }))
      return
    }

    // Only process text if it exists
    let cleanedText = ""
    let segments: string[] = []

    if (text && typeof text === "string") {
      cleanedText = cleanText(text)
      segments = createSegments(cleanedText)
      segmentsRef.current = segments
    }

    const voices = loadVoices()
    const defaultVoice = voices.find((v) => v.lang.startsWith("es")) || voices[0] || null

    setState((prev) => ({
      ...prev,
      totalSegments: segments.length,
      availableVoices: voices,
      selectedVoice: defaultVoice,
      debugInfo: {
        originalTextLength: text?.length || 0,
        cleanedTextLength: cleanedText.length,
        segments: segments,
        currentVoice: defaultVoice?.name || "None",
        speechSynthesisSupported: true,
      },
    }))

    // Handle voices loading asynchronously
    const handleVoicesChanged = () => {
      console.log("🔄 Voices changed, reloading...")
      const newVoices = loadVoices()
      const newDefaultVoice = newVoices.find((v) => v.lang.startsWith("es")) || newVoices[0] || null

      setState((prev) => ({
        ...prev,
        availableVoices: newVoices,
        selectedVoice: prev.selectedVoice || newDefaultVoice,
        debugInfo: {
          ...prev.debugInfo,
          currentVoice: (prev.selectedVoice || newDefaultVoice)?.name || "None",
        },
      }))
    }

    speechSynthesis.addEventListener("voiceschanged", handleVoicesChanged)

    return () => {
      speechSynthesis.removeEventListener("voiceschanged", handleVoicesChanged)
    }
  }, [text, cleanText, createSegments, loadVoices])

  // Calculate estimated time remaining
  const calculateTimeRemaining = useCallback((currentSeg: number, totalSegs: number, rate: number): number => {
    if (totalSegs === 0 || currentSeg >= totalSegs) return 0

    const remainingSegments = totalSegs - currentSeg
    const avgWordsPerSegment = 30 // Estimate
    const wordsPerMinute = 150 * rate // Base WPM adjusted by rate
    const estimatedMinutes = (remainingSegments * avgWordsPerSegment) / wordsPerMinute

    return Math.ceil(estimatedMinutes * 60) // Convert to seconds
  }, [])

  // Play specific segment
  const playSegment = useCallback(
    (segmentIndex: number) => {
      console.log(`🎵 Playing segment ${segmentIndex + 1}/${segmentsRef.current.length}`)

      if (!("speechSynthesis" in window)) {
        console.error("Speech synthesis not supported")
        return
      }

      if (!segmentsRef.current || segmentIndex >= segmentsRef.current.length) {
        console.log("✅ Reached end of segments or no segments available")
        setState((prev) => ({
          ...prev,
          isPlaying: false,
          isPaused: false,
          currentSegment: 0,
          progress: 100,
          estimatedTimeRemaining: 0,
        }))
        return
      }

      const segment = segmentsRef.current[segmentIndex]
      if (!segment) {
        console.log("No segment found at index", segmentIndex)
        return
      }

      console.log(`Segment text: "${segment.substring(0, 100)}..."`)

      // Cancel any existing speech
      speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(segment)
      utteranceRef.current = utterance

      // Apply current settings
      setState((prev) => {
        if (prev.selectedVoice) {
          utterance.voice = prev.selectedVoice
          console.log(`Using voice: ${prev.selectedVoice.name}`)
        }
        utterance.rate = prev.rate
        utterance.pitch = prev.pitch
        utterance.volume = prev.volume

        console.log(`Settings - Rate: ${prev.rate}, Pitch: ${prev.pitch}, Volume: ${prev.volume}`)

        return prev
      })

      utterance.onstart = () => {
        console.log("🎤 Utterance started")
        startTimeRef.current = Date.now()
      }

      utterance.onend = () => {
        console.log("🏁 Utterance ended")
        const nextSegment = segmentIndex + 1

        setState((prev) => {
          const newProgress = segmentsRef.current.length > 0 ? (nextSegment / segmentsRef.current.length) * 100 : 100
          const timeRemaining = calculateTimeRemaining(nextSegment, segmentsRef.current.length, prev.rate)

          return {
            ...prev,
            currentSegment: nextSegment,
            progress: newProgress,
            estimatedTimeRemaining: timeRemaining,
          }
        })

        // Auto-play next segment
        if (nextSegment < segmentsRef.current.length) {
          setTimeout(() => playSegment(nextSegment), 100)
        } else {
          setState((prev) => ({
            ...prev,
            isPlaying: false,
            isPaused: false,
            currentSegment: 0,
            progress: 100,
            estimatedTimeRemaining: 0,
          }))
        }
      }

      utterance.onerror = (event) => {
        console.error("❌ Speech synthesis error:", event.error)
        setState((prev) => ({
          ...prev,
          isPlaying: false,
          isPaused: false,
        }))
      }

      speechSynthesis.speak(utterance)
    },
    [calculateTimeRemaining],
  )

  // Control functions
  const play = useCallback(() => {
    console.log("▶️ Play requested")

    if (!segmentsRef.current || segmentsRef.current.length === 0) {
      console.log("No segments available to play")
      return
    }

    setState((prev) => {
      if (prev.isPaused) {
        console.log("Resuming from pause")
        speechSynthesis.resume()
        return {
          ...prev,
          isPlaying: true,
          isPaused: false,
        }
      } else {
        console.log("Starting from beginning or current segment")
        const startSegment = prev.currentSegment >= segmentsRef.current.length ? 0 : prev.currentSegment
        playSegment(startSegment)

        const timeRemaining = calculateTimeRemaining(startSegment, segmentsRef.current.length, prev.rate)

        return {
          ...prev,
          isPlaying: true,
          isPaused: false,
          currentSegment: startSegment,
          estimatedTimeRemaining: timeRemaining,
        }
      }
    })
  }, [playSegment, calculateTimeRemaining])

  const pause = useCallback(() => {
    console.log("⏸️ Pause requested")
    speechSynthesis.pause()
    setState((prev) => ({
      ...prev,
      isPlaying: false,
      isPaused: true,
    }))
  }, [])

  const stop = useCallback(() => {
    console.log("⏹️ Stop requested")
    speechSynthesis.cancel()
    setState((prev) => ({
      ...prev,
      isPlaying: false,
      isPaused: false,
      currentSegment: 0,
      progress: 0,
      estimatedTimeRemaining: calculateTimeRemaining(0, segmentsRef.current?.length || 0, prev.rate),
    }))
  }, [calculateTimeRemaining])

  const resume = useCallback(() => {
    console.log("▶️ Resume requested")
    speechSynthesis.resume()
    setState((prev) => ({
      ...prev,
      isPlaying: true,
      isPaused: false,
    }))
  }, [])

  const toggleMute = useCallback(() => {
    console.log("🔇 Toggle mute requested")
    setState((prev) => {
      const newVolume = prev.volume === 0 ? 1 : 0
      return {
        ...prev,
        volume: newVolume,
      }
    })
  }, [])

  const skipForward = useCallback(() => {
    console.log("⏭️ Skip forward requested")
    setState((prev) => {
      const maxSegments = segmentsRef.current?.length || 0
      const newSegment = Math.min(prev.currentSegment + 5, maxSegments - 1)
      console.log(`Skipping to segment ${newSegment + 1}`)

      if (prev.isPlaying && maxSegments > 0) {
        speechSynthesis.cancel()
        setTimeout(() => playSegment(newSegment), 100)
      }

      const timeRemaining = calculateTimeRemaining(newSegment, maxSegments, prev.rate)

      return {
        ...prev,
        currentSegment: newSegment,
        progress: maxSegments > 0 ? (newSegment / maxSegments) * 100 : 0,
        estimatedTimeRemaining: timeRemaining,
      }
    })
  }, [playSegment, calculateTimeRemaining])

  const skipBackward = useCallback(() => {
    console.log("⏮️ Skip backward requested")
    setState((prev) => {
      const newSegment = Math.max(prev.currentSegment - 5, 0)
      console.log(`Skipping back to segment ${newSegment + 1}`)

      if (prev.isPlaying && segmentsRef.current && segmentsRef.current.length > 0) {
        speechSynthesis.cancel()
        setTimeout(() => playSegment(newSegment), 100)
      }

      const timeRemaining = calculateTimeRemaining(newSegment, segmentsRef.current?.length || 0, prev.rate)

      return {
        ...prev,
        currentSegment: newSegment,
        progress:
          segmentsRef.current && segmentsRef.current.length > 0 ? (newSegment / segmentsRef.current.length) * 100 : 0,
        estimatedTimeRemaining: timeRemaining,
      }
    })
  }, [playSegment, calculateTimeRemaining])

  const setVoice = useCallback((voice: SpeechSynthesisVoice) => {
    console.log("🎤 Setting voice:", voice.name)
    setState((prev) => ({
      ...prev,
      selectedVoice: voice,
      debugInfo: {
        ...prev.debugInfo,
        currentVoice: voice.name,
      },
    }))
  }, [])

  const setRate = useCallback(
    (rate: number) => {
      console.log("🏃 Setting rate:", rate)
      setState((prev) => {
        const timeRemaining = calculateTimeRemaining(prev.currentSegment, segmentsRef.current?.length || 0, rate)
        return {
          ...prev,
          rate,
          estimatedTimeRemaining: timeRemaining,
        }
      })
    },
    [calculateTimeRemaining],
  )

  const setPitch = useCallback((pitch: number) => {
    console.log("🎵 Setting pitch:", pitch)
    setState((prev) => ({
      ...prev,
      pitch,
    }))
  }, [])

  const setVolume = useCallback((volume: number) => {
    console.log("🔊 Setting volume:", volume)
    setState((prev) => ({
      ...prev,
      volume,
    }))
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      console.log("🧹 Cleaning up TTS")
      speechSynthesis.cancel()
    }
  }, [])

  return {
    ...state,
    play,
    pause,
    stop,
    resume,
    toggleMute,
    skipForward,
    skipBackward,
    setVoice,
    setRate,
    setPitch,
    setVolume,
    // Computed properties
    isMuted: state.volume === 0,
  }
}
