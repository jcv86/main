'use client'

import { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'

interface InputValidatorProps {
  value: string
  questionId: number
  question: string
  onValidationChange?: (isValid: boolean) => void
  minLength?: number
  maxLength?: number
  showCharCount?: boolean
}

export function InputValidator({
  value,
  questionId,
  question,
  onValidationChange,
  minLength = 10,
  maxLength = 500,
  showCharCount = true
}: InputValidatorProps) {
  const [errors, setErrors] = useState<string[]>([])
  const [isValidating, setIsValidating] = useState(false)
  const [isValid, setIsValid] = useState(false)

  useEffect(() => {
    const validateInput = async () => {
      const newErrors: string[] = []

      if (!value.trim()) {
        setIsValid(false)
        onValidationChange?.(false)
        return
      }

      // Validación básica
      if (value.length < minLength) {
        newErrors.push(`Mínimo ${minLength} caracteres (tienes ${value.length})`)
      }

      if (value.length > maxLength) {
        newErrors.push(`Máximo ${maxLength} caracteres`)
      }

      // No permitir solo números o símbolos
      if (!/[a-zA-ZáéíóúñÁÉÍÓÚÑ]/.test(value)) {
        newErrors.push('Debe contener al menos una letra válida')
      }

      if (newErrors.length > 0) {
        setErrors(newErrors)
        setIsValid(false)
        onValidationChange?.(false)
        return
      }

      // Si pasa validación básica, validar con servidor
      setIsValidating(true)
      try {
        const response = await fetch('/api/conozcamonos/validate-response', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            questionId,
            question,
            response: value,
            questionType: 'text'
          })
        })

        const result = await response.json()

        if (!result.valid) {
          setErrors([result.suggestions || 'Respuesta inválida'])
          setIsValid(false)
          onValidationChange?.(false)
        } else {
          setErrors([])
          setIsValid(true)
          onValidationChange?.(true)
        }
      } catch (err) {
        console.error('[v0] Validation error:', err)
        setErrors([])
        setIsValid(true)
        onValidationChange?.(true)
      } finally {
        setIsValidating(false)
      }
    }

    const timer = setTimeout(validateInput, 500)
    return () => clearTimeout(timer)
  }, [value, questionId, question, minLength, maxLength, onValidationChange])

  return (
    <div className="space-y-2">
      {/* Character count */}
      {showCharCount && (
        <div className="text-xs text-slate-400 flex justify-between">
          <span>{value.length}/{maxLength}</span>
          {isValidating && <span className="flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin" /> Validando...</span>}
        </div>
      )}

      {/* Errors */}
      {errors.length > 0 && (
        <div className="space-y-1">
          {errors.map((error, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-red-400 bg-red-500/10 p-2 rounded border border-red-500/20">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>{error}</span>
            </div>
          ))}
        </div>
      )}

      {/* Success */}
      {isValid && !isValidating && (
        <div className="flex items-center gap-2 text-xs text-green-400 bg-green-500/10 p-2 rounded border border-green-500/20">
          <CheckCircle2 className="w-4 h-4" />
          <span>Respuesta válida</span>
        </div>
      )}
    </div>
  )
}
