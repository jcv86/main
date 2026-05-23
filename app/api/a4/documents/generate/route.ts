/**
 * A4 Document Generation API
 * 
 * AI-powered document generation with context from A1-A3
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateText } from 'ai'
import { A4ContextIntegration } from '@/lib/a4/context-integration'
import { A4ProfileSnapshot } from '@/lib/a4/profile-snapshot'
import type { DocumentType } from '@/lib/a4/types'

const DOCUMENT_PROMPTS: Record<DocumentType, string> = {
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
      additionalContext = {}
    } = body

    if (!documentType || !DOCUMENT_PROMPTS[documentType as DocumentType]) {
      return NextResponse.json({ 
        error: 'Invalid document type',
        validTypes: Object.keys(DOCUMENT_PROMPTS)
      }, { status: 400 })
    }

    // Gather context from A1-A3
    const contextIntegration = new A4ContextIntegration(supabase)
    const profileSnapshot = new A4ProfileSnapshot(supabase)
    
    const [context, snapshot] = await Promise.all([
      contextIntegration.gatherAllContext(user.id),
      profileSnapshot.generateSnapshot(user.id)
    ])

    // Build the full prompt
    const basePrompt = DOCUMENT_PROMPTS[documentType as DocumentType]
    const contextSummary = buildContextSummary(context, snapshot)
    
    let fullPrompt = `${basePrompt}

## Datos del Usuario (A1 - El Ritual):
${contextSummary.a1Summary}

## Exploración Profesional (A2 - Exploración):
${contextSummary.a2Summary}

## Habilidades y Entrenamiento (A3 - Entrenamiento):
${contextSummary.a3Summary}

## Perfil Consolidado:
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
      model: 'anthropic/claude-3.5-sonnet',
      system: `Eres un experto coach de carrera especializado en el mercado laboral chileno.
        Generas documentos profesionales de alta calidad en español.
        Tu tono es profesional pero cercano, usando el "tú" informal.
        Siempre personalizas el contenido basándote en los datos del usuario.
        Usas formato Markdown para estructurar el contenido.`,
      prompt: fullPrompt,
      maxTokens: 4000,
      temperature: 0.7
    })

    // Generate a suggested title
    const suggestedTitle = generateTitle(documentType as DocumentType, targetRole, targetCompany)

    // Log the generation for analytics
    await supabase.from('a4_generation_logs').insert({
      user_id: user.id,
      document_type: documentType,
      prompt_tokens: fullPrompt.length,
      completion_tokens: generatedContent.length,
      model: 'claude-3.5-sonnet',
      target_company: targetCompany,
      target_role: targetRole,
      created_at: new Date().toISOString()
    }).catch(err => console.error('[A4 Generate] Log error:', err))

    return NextResponse.json({
      content: generatedContent,
      suggestedTitle,
      documentType,
      contextUsed: {
        a1Signals: context.a1?.signals?.length || 0,
        a2Steps: context.a2?.stepsCompleted || 0,
        a3Sessions: context.a3?.trainingSessions?.length || 0
      },
      generatedAt: new Date().toISOString()
    })
  } catch (error) {
    console.error('[A4 Generate API] Error:', error)
    return NextResponse.json({ error: 'Failed to generate document' }, { status: 500 })
  }
}

function buildContextSummary(context: any, snapshot: any) {
  return {
    a1Summary: context.a1 ? `
- Valores identificados: ${context.a1.values?.join(', ') || 'No definidos'}
- Fortalezas: ${context.a1.strengths?.join(', ') || 'No definidas'}
- Motivaciones: ${context.a1.motivations?.join(', ') || 'No definidas'}
- Estilo de trabajo: ${context.a1.workStyle || 'No definido'}
- Señales registradas: ${context.a1.signals?.length || 0}
` : 'No hay datos de A1 disponibles.',

    a2Summary: context.a2 ? `
- Industria objetivo: ${context.a2.targetIndustry || 'No definida'}
- Rol objetivo: ${context.a2.targetRole || 'No definido'}
- Experiencia previa: ${context.a2.experience?.map((e: any) => e.title).join(', ') || 'No registrada'}
- Educación: ${context.a2.education?.map((e: any) => e.degree).join(', ') || 'No registrada'}
- Pasos completados: ${context.a2.stepsCompleted || 0}
` : 'No hay datos de A2 disponibles.',

    a3Summary: context.a3 ? `
- Habilidades técnicas: ${context.a3.technicalSkills?.join(', ') || 'No definidas'}
- Habilidades blandas: ${context.a3.softSkills?.join(', ') || 'No definidas'}
- Certificaciones: ${context.a3.certifications?.join(', ') || 'Ninguna'}
- Sesiones de entrenamiento: ${context.a3.trainingSessions?.length || 0}
- Nivel de confianza: ${context.a3.confidenceLevel || 'No medido'}
` : 'No hay datos de A3 disponibles.',

    profileSummary: snapshot ? `
- Puntuación general: ${snapshot.overallScore || 'No calculada'}
- Completitud del perfil: ${snapshot.completeness || 0}%
- Fortalezas principales: ${snapshot.topStrengths?.join(', ') || 'No identificadas'}
- Áreas de mejora: ${snapshot.areasToImprove?.join(', ') || 'No identificadas'}
- Preparación para empleo: ${snapshot.jobReadiness || 'No evaluada'}
` : 'No hay snapshot de perfil disponible.'
  }
}

function generateTitle(type: DocumentType, targetRole?: string, targetCompany?: string): string {
  const now = new Date()
  const dateStr = `${now.getDate()}/${now.getMonth() + 1}/${now.getFullYear()}`
  
  const titles: Record<DocumentType, string> = {
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
