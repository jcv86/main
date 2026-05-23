import { useState } from 'react'

interface CoachingRequest {
  question: string
  userResponse: string
  interviewType: 'behavioral' | 'technical' | 'situational'
  roleContext?: string
}

interface CoachingResponse {
  feedback: string
  success: boolean
  usedModel?: string
  error?: string
}

export function useCoaching() {
  const [loading, setLoading] = useState(false)
  const [feedback, setFeedback] = useState<string>('')
  const [error, setError] = useState<string>('')

  const generateFeedback = async (request: CoachingRequest) => {
    setLoading(true)
    setError('')
    setFeedback('')

    try {
      const response = await fetch('/api/a3-coaching', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Error generating feedback')
      }

      const data: CoachingResponse = await response.json()

      if (data.success) {
        setFeedback(data.feedback)
      } else {
        setError(data.error || 'Error generating feedback')
      }

      return data
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error'
      setError(errorMessage)
      console.error('[v0] Coaching error:', err)
      return { success: false, error: errorMessage, feedback: '' }
    } finally {
      setLoading(false)
    }
  }

  return {
    generateFeedback,
    feedback,
    loading,
    error
  }
}
