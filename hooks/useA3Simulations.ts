'use client'

import { useCallback, useState, useRef } from 'react'
import useSWR from 'swr'

interface InterviewFeedback {
  scores: {
    content: number
    delivery: number
    confidence: number
  }
  strengths: string[]
  improvements: string[]
  specificFeedback: string
  nextSteps: string
  recommendedQuestions?: string[]
}

const fetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) throw new Error('Failed to fetch data')
  return response.json()
}

export function useA3Simulations(userId: string | null) {
  const [isRecording, setIsRecording] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const { data: history, mutate } = useSWR(
    userId ? `/api/a3/interview-feedback/${userId}` : null,
    fetcher,
    { revalidateOnFocus: false }
  )

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true
      })

      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)

      console.log('[v0] Recording started')
    } catch (error) {
      console.error('[v0] Error accessing camera/microphone:', error)
      throw error
    }
  }, [])

  const stopRecording = useCallback(
    (): Promise<Blob> => {
      return new Promise((resolve, reject) => {
        if (!mediaRecorderRef.current || !isRecording) {
          reject(new Error('No recording in progress'))
          return
        }

        const mediaRecorder = mediaRecorderRef.current

        mediaRecorder.onstop = () => {
          const blob = new Blob(chunksRef.current, { type: 'video/webm' })
          mediaRecorderRef.current?.stream
            .getTracks()
            .forEach((track) => track.stop())

          if (timerRef.current) {
            clearInterval(timerRef.current)
          }

          setIsRecording(false)
          console.log('[v0] Recording stopped')
          resolve(blob)
        }

        mediaRecorder.stop()
      })
    },
    [isRecording]
  )

  const submitResponse = useCallback(
    async (
      sessionId: string,
      questionId: string,
      responseText: string
    ): Promise<InterviewFeedback> => {
      if (!userId) throw new Error('User not authenticated')

      console.log('[v0] Submitting A3 interview response')

      const response = await fetch(
        `/api/a3/interview-feedback/${userId}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId,
            questionId,
            responseText,
            videoDurationSeconds: recordingTime,
            interviewType: 'behavioral'
          })
        }
      )

      if (!response.ok) {
        throw new Error('Failed to submit response')
      }

      const result = await response.json()
      console.log('[v0] Response submitted with score:', result.score)

      await mutate()

      return result.feedback
    },
    [userId, recordingTime, mutate]
  )

  const getFeedbackHistory = useCallback(
    async (sessionId?: string) => {
      if (!userId) throw new Error('User not authenticated')

      const url = sessionId
        ? `/api/a3/interview-feedback/${userId}?sessionId=${sessionId}`
        : `/api/a3/interview-feedback/${userId}`

      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch history')

      return response.json()
    },
    [userId]
  )

  return {
    isRecording,
    recordingTime,
    startRecording,
    stopRecording,
    submitResponse,
    getFeedbackHistory,
    feedbackHistory: history?.feedbackHistory || [],
    progress: history?.progress,
    isLoading: !history
  }
}
