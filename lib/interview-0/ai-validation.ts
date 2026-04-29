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

export async function validatePreparationResponses(
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
