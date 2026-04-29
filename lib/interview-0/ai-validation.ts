'use client'

import { generateObject } from 'ai'
import { openai } from '@ai-sdk/openai'
import { z } from 'zod'

const validationSchema = z.object({
  isValid: z.boolean().describe('Whether the response is valid and genuine'),
  confidence: z.number().min(0).max(100).describe('Confidence score (0-100)'),
  issues: z.array(z.string()).describe('List of issues found (empty if valid)'),
  feedback: z.string().describe('Helpful feedback for the user')
})

type ValidationResult = z.infer<typeof validationSchema>

export async function validatePresenceAnalysis(
  detectionData: {
    posture: number
    eyeContact: number
    lighting: number
    backgroundQuality: number
    overallScore: number
  }
): Promise<{
  isValid: boolean
  score: number
  issues: string[]
  tips: string[]
}> {
  try {
    const result = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: z.object({
        isValid: z.boolean(),
        score: z.number().min(0).max(100),
        issues: z.array(z.string()),
        tips: z.array(z.string())
      }),
      system: `You are a professional interview coach analyzing presence data.
Evaluate posture, eye contact, lighting, and background quality.
Provide constructive, specific feedback for improvement.`,
      prompt: `Analyze this presence test data:
- Postura: ${detectionData.posture}/100
- Contacto visual: ${detectionData.eyeContact}/100
- Iluminación: ${detectionData.lighting}/100
- Calidad de fondo: ${detectionData.backgroundQuality}/100
- Puntaje general: ${detectionData.overallScore}/100

Determina si la presencia es profesional para una entrevista. Devuelve: isValid (bool), score (0-100), issues (array), tips (3 max).`
    })

    const obj = result.object as any
    return {
      isValid: obj.isValid,
      score: obj.score,
      issues: obj.issues || [],
      tips: obj.tips || []
    }
  } catch (error) {
    console.error('[v0] Presence validation error:', error)
    return {
      isValid: true,
      score: 60,
      issues: [],
      tips: ['Intenta mejorar tu postura', 'Asegúrate que la luz sea clara', 'Mantén un fondo limpio y profesional']
    }
  }
}

export async function validateAudioQuality(
  audioLevel: number,
  testDuration: number = 3
): Promise<{
  isValid: boolean
  score: number
  issues: string[]
  tips: string[]
}> {
  try {
    const result = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: z.object({
        isValid: z.boolean(),
        score: z.number().min(0).max(100),
        issues: z.array(z.string()),
        tips: z.array(z.string())
      }),
      system: `You are an audio engineer evaluating interview audio quality.
Consider noise levels, clarity, and professional standards.
Provide specific, actionable feedback.`,
      prompt: `Analyze this audio test result:
- Nivel máximo detectado: ${audioLevel}%
- Duración del test: ${testDuration}s
- Rango recomendado: 20-80%

¿Es aceptable para una entrevista profesional? Devuelve: isValid, score (0-100), issues, tips (3 max).`
    })

    const obj = result.object as any
    return {
      isValid: obj.isValid,
      score: obj.score,
      issues: obj.issues || [],
      tips: obj.tips || []
    }
  } catch (error) {
    console.error('[v0] Audio validation error:', error)
    return {
      isValid: audioLevel >= 12,
      score: Math.min(100, audioLevel * 3),
      issues: audioLevel < 15 ? ['Audio muy bajo - acércate al micrófono'] : [],
      tips: ['Prueba en ambiente tranquilo', 'Habla con claridad', 'Verifica que no haya ruido de fondo']
    }
  }
}
  role: string,
  company: string,
  achievements: string
): Promise<{
  isValid: boolean
  confidence: number
  issues: string[]
  feedback: string
}> {
  try {
    const result = await generateObject({
      model: openai('gpt-4o-mini'),
      schema: validationSchema,
      system: `You are an expert interviewer and career coach. Your job is to validate if user responses are genuine, thoughtful, and professional. 

Detect:
- Spam/random text (repeated characters or gibberish like "asdasdasd")
- Vague or placeholder responses
- Lack of professionalism
- Unrealistic or suspicious claims
- Insufficient effort or detail

Be strict but fair. A response is VALID only if it shows genuine effort and is relevant.`,
      prompt: `Please validate these interview preparation responses:

ROLE/POSITION SOUGHT: "${role}"

TARGET COMPANY/OBJECTIVE: "${company}"

KEY ACHIEVEMENTS/HIGHLIGHTS:
"${achievements}"

Is this a genuine, professional preparation? Provide validation score and feedback.`
    })

    return {
      isValid: (result.object as ValidationResult).isValid,
      confidence: (result.object as ValidationResult).confidence,
      issues: (result.object as ValidationResult).issues,
      feedback: (result.object as ValidationResult).feedback
    }
  } catch (error) {
    console.error('[v0] AI validation error:', error)
    
    // Check if it's an API key issue
    const errorMsg = error instanceof Error ? error.message : String(error)
    const isAuthError = errorMsg.includes('401') || errorMsg.includes('API key') || errorMsg.includes('Unauthorized')
    
    if (isAuthError) {
      // If auth fails, be STRICT - reject the response to force user to check setup
      return {
        isValid: false,
        confidence: 0,
        issues: ['Sistema de validación no disponible'],
        feedback: 'Error de configuración. Intenta más tarde.'
      }
    }
    
    // For other errors, be lenient but warn
    return {
      isValid: true,
      confidence: 0,
      issues: [],
      feedback: 'Validación manual omitida (error temporal). Por favor revisa tu respuesta sea profesional.'
    }
  }
}
