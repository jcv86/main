import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { question, currentAnswer } = await request.json()

    if (!question) {
      return NextResponse.json(
        { error: 'Question is required' },
        { status: 400 }
      )
    }

    // Coach suggestions mapped by question type
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

    // Find the best matching suggestion
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
