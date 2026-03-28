import { useCallback } from 'react'

export function useCoachIA() {
  const askCoach = useCallback(async (message: string, stage: 'a1' | 'a2' | 'a3' | 'a4' = 'a1') => {
    try {
      const response = await fetch('/api/coach-ia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, stage })
      })

      if (!response.ok) throw new Error('Failed to get coach response')
      return response
    } catch (error) {
      console.error('[v0] Coach IA error:', error)
      throw error
    }
  }, [])

  return { askCoach }
}
