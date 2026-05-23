/**
 * A4 Document Generation API
 * 
 * AI-powered document generation with context from A1-A3
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateText } from 'ai'

// Simple document type for API usage
type SimpleDocumentType = 
  | 'cv' 
  | 'cover_letter' 
  | 'linkedin_summary' 
  | 'elevator_pitch'
  | 'interview_prep'
  | 'career_roadmap'
  | 'skills_inventory'
  | 'achievements_portfolio'
  | 'network_map'
  | 'market_analysis'
  | 'custom'

const DOCUMENT_PROMPTS: Record<SimpleDocumentType, string> = {
  cv: `Generate a professional CV/Resume in Spanish for a Chilean job market. 
    Use the user's profile data, skills, experience, and career goals to create a compelling narrative.
    Format with clear sections: Perfil Profesional, Experiencia, Educación, Habilidades, Logros.
    Keep it concise (max 2 pages equivalent).`,
  
  cover_letter: `Generate a professional cover letter in Spanish. 
    Use the user's career goals, target industry, and key strengths.
    Make it compelling and personalized based on their profile data.
    Include: Saludo, Introducción, Cuerpo (why them + why you), Cierre.`,
  
  linkedin_summary: `Generate a LinkedIn summary/About section in Spanish.
    Make it engaging, professional, and keyword-optimized for their target industry.
    Include their unique value proposition, key achievements, and career aspirations.
    Keep it under 2000 characters.`,
  
  elevator_pitch: `Generate a 30-60 second elevator pitch in Spanish.
    Make it memorable, concise, and impactful.
    Include: Who they are, what they do, their unique value, what they're looking for.`,
  
  interview_prep: `Generate interview preparation notes in Spanish.
    Include: Common questions with suggested answers based on their profile,
    STAR method examples from their experience, questions to ask employers,
    and key talking points about their strengths.`,
  
  career_roadmap: `Generate a 90-day career roadmap in Spanish.
    Based on their current skills, goals, and market insights.
    Include: Milestones, skills to develop, networking targets, application strategy.`,
  
  skills_inventory: `Generate a comprehensive skills inventory in Spanish.
    Categorize by: Technical skills, Soft skills, Industry knowledge, Certifications.
    Include proficiency levels and evidence from their experience.`,
  
  achievements_portfolio: `Generate an achievements portfolio in Spanish.
    Document key accomplishments with metrics and context.
    Use STAR format: Situación, Tarea, Acción, Resultado.`,
  
  network_map: `Generate a networking strategy map in Spanish.
    Based on their career goals and target industry.
    Include: Key contacts to build, events to attend, communities to join.`,
  
  market_analysis: `Generate a job market analysis in Spanish for Chile.
    Based on their target industry and role preferences.
    Include: Demand trends, salary ranges, top employers, required skills.`,
  
  custom: `Generate professional career content based on the user's specific request.
    Use their profile data to personalize the output.
    Maintain a professional tone appropriate for the Chilean job market.`
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      documentType, 
      customPrompt,
      targetCompany,
      targetRole,
    } = body

    if (!documentType || !DOCUMENT_PROMPTS[documentType as SimpleDocumentType]) {
      return NextResponse.json({ 
        error: 'Invalid document type',
        validTypes: Object.keys(DOCUMENT_PROMPTS)
      }, { status: 400 })
    }

    // Gather context from database directly
    const [profileResult, ritualsResult, knowledgeResult, skillsResult] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('a1_ritual_responses').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
      supabase.from('a2_knowledge_entries').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(30),
      supabase.from('a3_skills_progress').select('*').eq('user_id', user.id).limit(20)
    ])

    const context = {
      profile: profileResult.data,
      rituals: ritualsResult.data || [],
      knowledge: knowledgeResult.data || [],
      skills: skillsResult.data || []
    }

    // Build context summary
    const contextSummary = buildContextSummary(context)

    // Build the full prompt
    const basePrompt = DOCUMENT_PROMPTS[documentType as SimpleDocumentType]
    
    let fullPrompt = `${basePrompt}

## Datos del Usuario (A1 - El Ritual):
${contextSummary.a1Summary}

## Exploración Profesional (A2 - Exploración):
${contextSummary.a2Summary}

## Habilidades y Entrenamiento (A3 - Entrenamiento):
${contextSummary.a3Summary}

## Perfil del Usuario:
${contextSummary.profileSummary}
`

    if (targetCompany) {
      fullPrompt += `\n## Empresa Objetivo: ${targetCompany}`
    }
    if (targetRole) {
      fullPrompt += `\n## Rol Objetivo: ${targetRole}`
    }
    if (customPrompt) {
      fullPrompt += `\n## Instrucciones Adicionales: ${customPrompt}`
    }

    // Generate content using AI
    const { text: generatedContent } = await generateText({
      model: 'anthropic/claude-sonnet-4-20250514',
      system: `Eres un experto coach de carrera especializado en el mercado laboral chileno.
        Generas documentos profesionales de alta calidad en español.
        Tu tono es profesional pero cercano, usando el "tú" informal.
        Siempre personalizas el contenido basándote en los datos del usuario.
        Usas formato Markdown para estructurar el contenido.`,
      prompt: fullPrompt,
      maxOutputTokens: 4000,
    })

    // Generate a suggested title
    const suggestedTitle = generateTitle(documentType as SimpleDocumentType, targetRole, targetCompany)

    // Log the generation for analytics (non-blocking)
    void supabase.from('a4_generation_logs').insert({
      user_id: user.id,
      document_type: documentType,
      prompt_tokens: fullPrompt.length,
      completion_tokens: generatedContent.length,
      model_used: 'claude-sonnet-4',
      generation_params: { targetCompany, targetRole },
      created_at: new Date().toISOString()
    })

    return NextResponse.json({
      content: generatedContent,
      suggestedTitle,
      documentType,
      contextUsed: {
        a1Signals: context.rituals.length,
        a2Entries: context.knowledge.length,
        a3Skills: context.skills.length
      },
      generatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('[A4 Generate API] Error:', error)
    return NextResponse.json({ error: 'Failed to generate document' }, { status: 500 })
  }
}

function buildContextSummary(context: { profile: any; rituals: any[]; knowledge: any[]; skills: any[] }) {
  const { profile, rituals, knowledge, skills } = context

  return {
    a1Summary: rituals.length > 0 ? `
- Respuestas del ritual: ${rituals.length}
- Últimas reflexiones: ${rituals.slice(0, 5).map(r => r.response?.substring(0, 100)).filter(Boolean).join('; ')}
` : 'No hay datos de A1 disponibles.',

    a2Summary: knowledge.length > 0 ? `
- Entradas de conocimiento: ${knowledge.length}
- Temas explorados: ${[...new Set(knowledge.map(k => k.topic).filter(Boolean))].join(', ') || 'Varios'}
- Últimos aprendizajes: ${knowledge.slice(0, 3).map(k => k.content?.substring(0, 100)).filter(Boolean).join('; ')}
` : 'No hay datos de A2 disponibles.',

    a3Summary: skills.length > 0 ? `
- Habilidades en progreso: ${skills.length}
- Skills: ${skills.map(s => s.skill_name).filter(Boolean).join(', ') || 'No definidas'}
` : 'No hay datos de A3 disponibles.',

    profileSummary: profile ? `
- Nombre: ${profile.full_name || profile.name || 'No especificado'}
- Email: ${profile.email || 'No especificado'}
- Rol actual: ${profile.current_role || profile.job_title || 'No especificado'}
- Industria: ${profile.industry || 'No especificada'}
- Experiencia: ${profile.years_experience || 'No especificada'} años
- Ubicación: ${profile.location || 'Chile'}
` : 'No hay perfil disponible.'
  }
}

function generateTitle(type: SimpleDocumentType, targetRole?: string, targetCompany?: string): string {
  const now = new Date()
  const dateStr = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`
  
  const titles: Record<SimpleDocumentType, string> = {
    cv: targetRole ? `CV - ${targetRole}` : `CV Profesional - ${dateStr}`,
    cover_letter: targetCompany ? `Carta - ${targetCompany}` : `Carta de Presentación - ${dateStr}`,
    linkedin_summary: `LinkedIn Summary - ${dateStr}`,
    elevator_pitch: `Elevator Pitch - ${dateStr}`,
    interview_prep: targetCompany ? `Prep Entrevista - ${targetCompany}` : `Preparación Entrevista - ${dateStr}`,
    career_roadmap: `Ruta de Carrera 90 Días - ${dateStr}`,
    skills_inventory: `Inventario de Habilidades - ${dateStr}`,
    achievements_portfolio: `Portafolio de Logros - ${dateStr}`,
    network_map: `Mapa de Networking - ${dateStr}`,
    market_analysis: `Análisis de Mercado - ${dateStr}`,
    custom: `Documento Personalizado - ${dateStr}`
  }
  
  return titles[type] || `Documento - ${dateStr}`
}
