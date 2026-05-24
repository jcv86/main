import { generateWithSystem } from '@/lib/openai-direct'
import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getDemoUserFromRequest } from '@/lib/auth/demo-user'

interface CoachingRequest {
  question: string
  userResponse: string
  interviewType: 'behavioral' | 'technical' | 'situational'
  roleContext?: string
}

const coachingSystemPrompt = `Eres un coach de entrevistas profesional experto en preparación de candidatos para roles en tech. 
Tu rol es proporcionar feedback constructivo, específico y accionable sobre respuestas de entrevista.

Para cada respuesta que analices:
1. Identifica fortalezas específicas (máximo 2)
2. Señala áreas de mejora (máximo 2)
3. Proporciona 1-2 ejemplos concretos de cómo mejorar
4. Sugiere una frase de cierre o mejora específica

Mantén el tono profesional, empático pero directo. Responde en español. Sé breve y conciso (máximo 150 palabras).`

export async function POST(request: NextRequest) {
  try {
    const { question, userResponse, interviewType, roleContext } =
      (await request.json()) as CoachingRequest

    // Check for demo user
    const demoUser = getDemoUserFromRequest(request)
    if (demoUser) {
      // Return mock coaching for demo users
      return NextResponse.json({
        feedback: {
          strengths: [
            'Excelente estructuración de la respuesta con ejemplo concreto',
            'Demostraste claramente el resultado y el aprendizaje'
          ],
          improvements: [
            'Podrías cuantificar más el impacto (números, %)',
            'Añade más contexto sobre por qué ese desafío era importante'
          ],
          suggestion:
            'Intenta usar la estructura STAR: Situation, Task, Action, Result para máxima claridad.',
          score: 8.2
        },
        success: true
      })
    }

    // Get authenticated user from Supabase
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Build the coaching prompt
    const userPrompt = `
    Tipo de entrevista: ${interviewType}
    ${roleContext ? `Contexto del rol: ${roleContext}` : ''}
    
    Pregunta: "${question}"
    
    Respuesta del candidato: "${userResponse}"
    
    Proporciona feedback constructivo sobre esta respuesta de entrevista.`

    // Generate coaching feedback using OpenAI (direct API call)
    const feedbackText = await generateWithSystem(
      coachingSystemPrompt,
      userPrompt,
      { model: 'gpt-4-turbo', max_tokens: 500 }
    )

    // Try to save coaching feedback to database
    try {
      await supabase
        .from('a3_coaching_feedback')
        .insert({
          user_id: user.id,
          question,
          user_response: userResponse,
          interview_type: interviewType,
          feedback: feedbackText,
          ai_model: 'gpt-4-turbo',
          created_at: new Date().toISOString()
        })
    } catch (dbError) {
      console.log('[v0] Warning: Could not save coaching feedback to DB:', dbError)
      // Continue anyway - return the feedback even if DB save fails
    }

    return NextResponse.json({
      feedback: feedbackText,
      success: true,
      usedModel: 'gpt-4-turbo'
    })
  } catch (error) {
    console.error('[v0] Coaching feedback error:', error)
    return NextResponse.json(
      {
        error: 'Error generating coaching feedback',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
