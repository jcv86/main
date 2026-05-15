import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
const openaiApiKey = process.env.OPENAI_API_KEY || ''

export async function POST(request: NextRequest) {
  try {
    const { question, currentAnswer, userId } = await request.json()

    if (!question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      )
    }

    // Try to get Conozcamonos 1 context if userId is provided
    let c1Context = ''
    if (userId && supabaseUrl && supabaseKey) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey)
        const { data: c1Data } = await supabase
          .from('conozcamonos_1_responses')
          .select('*')
          .eq('user_id', userId)
          .single()
        
        if (c1Data) {
          c1Context = `Contexto del usuario desde Conozcamonos 1:
- Rol buscado: ${c1Data.role || 'No especificado'}
- Ambiente ideal: ${c1Data.environment || 'No especificado'}
- Objetivo 30 días: ${c1Data.desired_outcome || 'No especificado'}`
        }
      } catch (e) {
        console.log('[v0] Could not fetch Conozcamonos 1 context, continuing without it')
      }
    }

    // If OpenAI API key is available, use it for intelligent suggestions
    if (openaiApiKey) {
      try {
        const prompt = `Eres un coach profesional experto en desarrollo de carrera. 
        
${c1Context}

El usuario está respondiendo a esta pregunta: "${question}"
Su respuesta actual: "${currentAnswer}"

Proporciona:
1. Una sugerencia concisa pero profunda (2-3 oraciones) que mejore su respuesta
2. 3-4 tips específicos para mejorar su respuesta

Responde en formato JSON con esta estructura:
{
  "suggestion": "tu sugerencia aquí",
  "tips": ["tip 1", "tip 2", "tip 3"]
}

Sé específico, práctico y motivador.`

        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiApiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: 'You are a career coaching AI assistant that provides helpful, specific advice.'
              },
              {
                role: 'user',
                content: prompt
              }
            ],
            temperature: 0.7,
            max_tokens: 500,
          }),
        })

        if (response.ok) {
          const data = await response.json()
          const content = data.choices?.[0]?.message?.content || ''
          
          try {
            const parsed = JSON.parse(content)
            return NextResponse.json({
              suggestion: parsed.suggestion || 'Continúa reflexionando sobre tu respuesta.',
              tips: Array.isArray(parsed.tips) ? parsed.tips : ['Sé específico', 'Alinea con tus objetivos']
            })
          } catch {
            // If JSON parsing fails, return the content as-is
            return NextResponse.json({
              suggestion: content,
              tips: ['Considera esta sugerencia del coach', 'Refina tu respuesta con estos puntos']
            })
          }
        }
      } catch (error) {
        console.error('[v0] OpenAI API error:', error)
        // Fall through to default suggestions
      }
    }

    // Fallback to default suggestions if OpenAI is not available
    const coachSuggestions: Record<string, { suggestion: string; tips: string[] }> = {
      'rol profesional': {
        suggestion: 'Especifica el nivel de seniority y el tipo de industria que te atrae. Sé claro sobre qué tipo de responsabilidades buscas.',
        tips: ['Incluye 2-3 títulos específicos', 'Menciona el rango salarial esperado', 'Conecta con tus fortalezas actuales']
      },
      'ambiente de trabajo': {
        suggestion: 'Describe la cultura que valoras (remoto, híbrido, flexible) y el tamaño de empresa que prefieres.',
        tips: ['Sé honesto sobre tus preferencias', 'Considera el balance vida-trabajo', 'Piensa en el equipo y liderazgo']
      },
      '30 días': {
        suggestion: 'Define un objetivo medible y específico que puedas lograr en este mes. Conecta con las acciones que tomas hoy.',
        tips: ['Haz que sea SMART (Específico, Medible, Alcanzable)', 'Desglosa en pequeños hitos', 'Incluye métricas de éxito']
      },
      'visión': {
        suggestion: 'Clarifica tu visión a largo plazo y cómo se conecta con tus habilidades únicas. Sé ambicioso pero realista.',
        tips: ['Visualiza dónde te ves en 2-3 años', 'Alinea con tus valores core', 'Identifica las brechas de skills a cerrar']
      },
      'default': {
        suggestion: 'Reflexiona profundamente sobre esta pregunta. Tómate tiempo para ser específico y honesto en tu respuesta.',
        tips: ['Sé conciso pero completo', 'Proporciona ejemplos concretos', 'Revisa tu respuesta antes de continuar']
      }
    }

    let suggestion = coachSuggestions['default']
    const questionLower = question.toLowerCase()
    
    for (const [key, value] of Object.entries(coachSuggestions)) {
      if (key !== 'default' && questionLower.includes(key)) {
        suggestion = value
        break
      }
    }

    return NextResponse.json(suggestion)
  } catch (error) {
    console.error('[v0] Coach assist error:', error)
    return NextResponse.json(
      { 
        suggestion: 'Continúa reflexionando sobre tu pregunta con detalle y honestidad.',
        tips: ['Sé específico en tu respuesta', 'Alinea con tus objetivos profesionales', 'Revisa y mejora iterativamente']
      },
      { status: 200 }
    )
  }
}
