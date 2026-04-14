import { useState } from 'react'

/**
 * Hook para validar que la respuesta del usuario está relacionada contextualmente
 * con la pregunta de la entrevista/test. Previene respuestas no relacionadas.
 */
export function useContextValidation() {
  const [isValidating, setIsValidating] = useState(false)
  const [validationError, setValidationError] = useState<string | null>(null)

  const validateContextRelevance = async (
    question: string,
    response: string,
    testType?: string
  ): Promise<{
    isRelevant: boolean
    confidence: number
    reason?: string
  }> => {
    try {
      setIsValidating(true)
      setValidationError(null)

      const apiResponse = await fetch('/api/validate-interview-response', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          response,
          testType: testType || 'general',
          language: 'es'
        })
      })

      if (!apiResponse.ok) {
        console.error('[v0] Validation API error:', apiResponse.statusText)
        // If API fails, allow response to proceed
        return {
          isRelevant: true,
          confidence: 0,
          reason: 'API validation failed - allowing response'
        }
      }

      const data = await apiResponse.json()

      if (!data.isRelevant) {
        const errorMsg =
          data.reason ||
          'Tu respuesta no está relacionada con la pregunta. Por favor, responde sobre el tema preguntado.'
        setValidationError(errorMsg)
      }

      return {
        isRelevant: data.isRelevant === true,
        confidence: data.confidence || 0,
        reason: data.reason
      }
    } catch (err) {
      console.error('[v0] Context validation error:', err)
      // If validation fails, allow response to proceed to avoid blocking user
      return {
        isRelevant: true,
        confidence: 0,
        reason: 'Validation error - allowing response'
      }
    } finally {
      setIsValidating(false)
    }
  }

  return {
    validateContextRelevance,
    isValidating,
    validationError,
    clearError: () => setValidationError(null)
  }
}
