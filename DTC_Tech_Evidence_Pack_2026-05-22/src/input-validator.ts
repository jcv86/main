// Input Validator - Validación centralizada de entrada de usuarios
// Protege contra texto basura, spam y entrada inválida

import { callOpenAI } from './openai-helper'

export interface ValidationResult {
  isValid: boolean
  errors: string[]
  confidence?: number
}

/**
 * Validación básica de texto
 */
export function validateBasicInput(value: string, options: {
  minLength?: number
  maxLength?: number
  required?: boolean
  allowOnlySpaces?: boolean
} = {}): ValidationResult {
  const {
    minLength = 3,
    maxLength = 1000,
    required = true,
    allowOnlySpaces = false
  } = options

  const errors: string[] = []

  if (!value && required) {
    errors.push('Este campo es requerido')
    return { isValid: false, errors }
  }

  if (value.trim().length === 0 && !allowOnlySpaces) {
    errors.push('No se permiten campos vacíos o solo espacios')
    return { isValid: false, errors }
  }

  if (value.length < minLength) {
    errors.push(`Mínimo ${minLength} caracteres requeridos`)
  }

  if (value.length > maxLength) {
    errors.push(`Máximo ${maxLength} caracteres permitidos`)
  }

  // Validar que no sea solo números o símbolos
  if (!/[a-zA-ZáéíóúñÁÉÍÓÚÑ]/.test(value)) {
    errors.push('Debe contener al menos una letra válida')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Detectar texto basura/aleatorio con IA
 */
export async function detectJunkInput(value: string, context?: string): Promise<ValidationResult> {
  const errors: string[] = []

  try {
    const prompt = `Analiza este texto y determina si es basura/aleatorio/spam o si es un texto legítimo en español.

Texto: "${value}"
${context ? `Contexto esperado: ${context}` : ''}

Responde SOLO en JSON con este formato:
{
  "isJunk": true/false,
  "reason": "breve explicación",
  "confidence": 0.0-1.0
}

isJunk = true si es claramente spam/basura/aleatorio
isJunk = false si es texto legítimo`

    const response = await callOpenAI(
      [{ role: 'user', content: prompt }],
      'gpt-4o-mini',
      { temperature: 0, max_tokens: 100 }
    )

    const parsed = JSON.parse(response)

    if (parsed.isJunk && parsed.confidence > 0.7) {
      errors.push(`Texto inválido o incomprensible (${parsed.reason})`)
    }

    return {
      isValid: errors.length === 0,
      errors,
      confidence: parsed.confidence
    }
  } catch (err) {
    console.error('[v0] Error detecting junk input:', err)
    // Si falla IA, pasar con validación básica
    return { isValid: true, errors: [] }
  }
}

/**
 * Validación para texto de respuesta abierta
 */
export async function validateOpenEndedResponse(
  value: string,
  context: string,
  options: {
    minLength?: number
    maxLength?: number
    useAI?: boolean
  } = {}
): Promise<ValidationResult> {
  const {
    minLength = 10,
    maxLength = 500,
    useAI = true
  } = options

  // Primero validación básica
  const basicResult = validateBasicInput(value, {
    minLength,
    maxLength,
    required: true
  })

  if (!basicResult.isValid) {
    return basicResult
  }

  // Si pasa básica, usar IA para detectar spam
  if (useAI) {
    return await detectJunkInput(value, context)
  }

  return basicResult
}

/**
 * Validación para selecciones (que no sean "otro")
 */
export function validateSelection(value: string | string[], options: {
  required?: boolean
  minSelections?: number
  maxSelections?: number
} = {}): ValidationResult {
  const {
    required = true,
    minSelections = 1,
    maxSelections = 10
  } = options

  const errors: string[] = []
  const selections = Array.isArray(value) ? value : [value]

  if (!value && required) {
    errors.push('Debes seleccionar al menos una opción')
    return { isValid: false, errors }
  }

  if (selections.length < minSelections) {
    errors.push(`Selecciona al menos ${minSelections} opción(es)`)
  }

  if (selections.length > maxSelections) {
    errors.push(`Máximo ${maxSelections} selecciones permitidas`)
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validación para búsquedas
 */
export async function validateSearchQuery(query: string): Promise<ValidationResult> {
  const errors: string[] = []

  if (!query || query.trim().length === 0) {
    errors.push('Ingresa una búsqueda')
    return { isValid: false, errors }
  }

  if (query.length < 2) {
    errors.push('Búsqueda muy corta (mínimo 2 caracteres)')
    return { isValid: false, errors }
  }

  if (query.length > 100) {
    errors.push('Búsqueda muy larga (máximo 100 caracteres)')
    return { isValid: false, errors }
  }

  // Detectar queries aleatorias
  if (/^[a-z]{20,}$/.test(query.toLowerCase())) {
    errors.push('Búsqueda no válida')
    return { isValid: false, errors }
  }

  try {
    await detectJunkInput(query, 'búsqueda educativa')
  } catch (err) {
    console.error('[v0] Error validating search:', err)
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validación para nombres/títulos
 */
export function validateName(value: string, options: {
  minLength?: number
  maxLength?: number
} = {}): ValidationResult {
  const {
    minLength = 3,
    maxLength = 100
  } = options

  const errors: string[] = []

  if (!value || value.trim().length === 0) {
    errors.push('Este campo es requerido')
    return { isValid: false, errors }
  }

  if (value.length < minLength) {
    errors.push(`Mínimo ${minLength} caracteres`)
  }

  if (value.length > maxLength) {
    errors.push(`Máximo ${maxLength} caracteres`)
  }

  // No permitir solo números o caracteres especiales
  if (!/[a-zA-ZáéíóúñÁÉÍÓÚÑ]/.test(value)) {
    errors.push('Debe contener al menos una letra válida')
  }

  // No permitir demasiados caracteres especiales
  if ((value.match(/[^a-zA-Z0-9áéíóúñÁÉÍÓÚÑ\s\-']/g) || []).length > 3) {
    errors.push('Demasiados caracteres especiales')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}
