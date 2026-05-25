/**
 * DTC AgentOS - A4 Adapter
 * 
 * Connects the document generation system (A4) to AgentOS.
 * Uses accumulated memories from C1/A1/C2/A2/A3 to generate
 * personalized career documents (CV, Cover Letter, LinkedIn, etc.)
 */

import { createClient } from '@/lib/supabase/server'
import { MemoryManager, MemoryType, MemorySource, type UserMemory } from '../context/memory-manager'
import { ContextBuilder } from '../context/context-builder'
import { DTCAgentOS } from '../index'

// ============================================================================
// TYPES
// ============================================================================

export type DocumentType = 
  | 'cv_executive'
  | 'cv_functional'
  | 'cv_chronological'
  | 'cover_letter'
  | 'linkedin_summary'
  | 'linkedin_headline'
  | 'elevator_pitch'
  | 'thank_you_note'
  | 'negotiation_script'

export interface DocumentGenerationRequest {
  documentType: DocumentType
  targetRole?: string
  targetCompany?: string
  customInstructions?: string
  tone?: 'formal' | 'professional' | 'conversational'
  length?: 'short' | 'medium' | 'long'
}

export interface GeneratedDocument {
  id: string
  type: DocumentType
  content: string
  targetRole?: string
  targetCompany?: string
  generatedAt: Date
  memoriesUsed: string[]
  version: number
}

export interface DocumentInsight {
  section: string
  insight: string
  sourceMemory: string
  confidence: number
}

// ============================================================================
// A4 ADAPTER
// ============================================================================

export class A4Adapter {
  private memoryManager: MemoryManager
  private contextBuilder: ContextBuilder
  
  constructor(private userId: string) {
    this.memoryManager = new MemoryManager(userId)
    this.contextBuilder = new ContextBuilder(userId)
  }
  
  /**
   * Build comprehensive context for document generation
   */
  async buildDocumentContext(request: DocumentGenerationRequest): Promise<{
    systemPrompt: string
    userContext: string
    memoriesUsed: string[]
  }> {
    const memoriesUsed: string[] = []
    const contextSections: string[] = []
    
    // Get all memories organized by type
    const memories = await this.memoryManager.getAllMemories()
    
    // ===== IDENTITY SECTION =====
    const identityMemories = memories.filter(m => m.type === MemoryType.IDENTITY)
    if (identityMemories.length > 0) {
      contextSections.push('## IDENTIDAD PROFESIONAL')
      
      const currentRole = identityMemories.find(m => m.key === 'current_role')
      if (currentRole) {
        contextSections.push(`**Rol Actual:** ${currentRole.value}`)
        memoriesUsed.push(currentRole.id)
      }
      
      const experience = identityMemories.find(m => m.key === 'years_experience')
      if (experience) {
        contextSections.push(`**Años de Experiencia:** ${experience.value}`)
        memoriesUsed.push(experience.id)
      }
      
      const industry = identityMemories.find(m => m.key === 'industry')
      if (industry) {
        contextSections.push(`**Industria:** ${industry.value}`)
        memoriesUsed.push(industry.id)
      }
      
      const education = identityMemories.find(m => m.key === 'education_history')
      if (education) {
        contextSections.push(`**Educación:** ${JSON.stringify(education.value)}`)
        memoriesUsed.push(education.id)
      }
      
      const discProfile = identityMemories.find(m => m.key === 'disc_profile_scores')
      if (discProfile) {
        contextSections.push(`**Perfil DISC:** ${discProfile.value.primary} (primario), ${discProfile.value.secondary || 'N/A'} (secundario)`)
        memoriesUsed.push(discProfile.id)
      }
      
      const commStyle = identityMemories.find(m => m.key === 'communication_style')
      if (commStyle) {
        contextSections.push(`**Estilo de Comunicación:** ${commStyle.value}`)
        memoriesUsed.push(commStyle.id)
      }
      
      const summary = identityMemories.find(m => m.key === 'professional_summary')
      if (summary) {
        contextSections.push(`**Resumen Profesional:** ${summary.value}`)
        memoriesUsed.push(summary.id)
      }
    }
    
    // ===== SKILLS SECTION =====
    const skillMemories = memories.filter(m => m.type === MemoryType.SKILL)
    if (skillMemories.length > 0) {
      contextSections.push('\n## HABILIDADES Y COMPETENCIAS')
      
      const declaredSkills = skillMemories.find(m => m.key === 'declared_skills')
      if (declaredSkills) {
        contextSections.push(`**Habilidades Declaradas:** ${(declaredSkills.value as string[]).join(', ')}`)
        memoriesUsed.push(declaredSkills.id)
      }
      
      const certifications = skillMemories.find(m => m.key === 'certifications')
      if (certifications) {
        contextSections.push(`**Certificaciones:** ${(certifications.value as string[]).join(', ')}`)
        memoriesUsed.push(certifications.id)
      }
      
      const languages = skillMemories.find(m => m.key === 'languages')
      if (languages) {
        const langStr = (languages.value as any[]).map(l => `${l.language} (${l.level})`).join(', ')
        contextSections.push(`**Idiomas:** ${langStr}`)
        memoriesUsed.push(languages.id)
      }
      
      // Demonstrated skills from A3
      const demonstratedSkills = skillMemories.filter(m => m.key.startsWith('demonstrated_skill'))
      if (demonstratedSkills.length > 0) {
        contextSections.push('\n**Habilidades Demostradas en Entrenamiento:**')
        for (const skill of demonstratedSkills.slice(0, 5)) {
          contextSections.push(`- ${skill.value.category}: Score ${skill.value.score}`)
          memoriesUsed.push(skill.id)
        }
      }
    }
    
    // ===== ACHIEVEMENTS SECTION =====
    const achievementMemories = memories.filter(m => m.type === MemoryType.ACHIEVEMENT)
    if (achievementMemories.length > 0) {
      contextSections.push('\n## LOGROS')
      for (const achievement of achievementMemories) {
        contextSections.push(`- ${achievement.value}`)
        memoriesUsed.push(achievement.id)
      }
    }
    
    // ===== STRENGTHS SECTION =====
    const strengthMemories = memories.filter(m => m.type === MemoryType.STRENGTH)
    if (strengthMemories.length > 0) {
      contextSections.push('\n## FORTALEZAS IDENTIFICADAS')
      for (const strength of strengthMemories.slice(0, 8)) {
        const area = strength.value.area || strength.key
        const evidence = strength.value.evidence || ''
        contextSections.push(`- **${area}**: ${evidence}`)
        memoriesUsed.push(strength.id)
      }
    }
    
    // ===== STORIES SECTION (for STAR method) =====
    const storyMemories = memories.filter(m => m.type === MemoryType.STORY)
    if (storyMemories.length > 0) {
      contextSections.push('\n## HISTORIAS STAR DISPONIBLES')
      for (const story of storyMemories.slice(0, 5)) {
        const content = story.value.content || story.value
        contextSections.push(`- ${typeof content === 'string' ? content.slice(0, 200) : JSON.stringify(content).slice(0, 200)}...`)
        memoriesUsed.push(story.id)
      }
    }
    
    // ===== GOALS SECTION =====
    const goalMemories = memories.filter(m => m.type === MemoryType.GOAL)
    if (goalMemories.length > 0) {
      contextSections.push('\n## OBJETIVOS PROFESIONALES')
      
      const targetRoles = goalMemories.find(m => m.key === 'target_roles')
      if (targetRoles) {
        contextSections.push(`**Roles Objetivo:** ${(targetRoles.value as string[]).join(', ')}`)
        memoriesUsed.push(targetRoles.id)
      }
      
      const shortTermGoals = goalMemories.find(m => m.key === 'goals_short_term')
      if (shortTermGoals) {
        contextSections.push(`**Corto Plazo:** ${(shortTermGoals.value as string[]).join(', ')}`)
        memoriesUsed.push(shortTermGoals.id)
      }
    }
    
    // ===== PREFERENCES SECTION =====
    const preferenceMemories = memories.filter(m => m.type === MemoryType.PREFERENCE)
    if (preferenceMemories.length > 0 && ['cover_letter', 'linkedin_summary'].includes(request.documentType)) {
      contextSections.push('\n## PREFERENCIAS')
      
      const workStyle = preferenceMemories.find(m => m.key === 'work_style_preference')
      if (workStyle) {
        contextSections.push(`**Estilo de Trabajo:** ${workStyle.value}`)
        memoriesUsed.push(workStyle.id)
      }
      
      const workEnv = preferenceMemories.find(m => m.key === 'work_environment_preferences')
      if (workEnv) {
        contextSections.push(`**Ambiente de Trabajo Preferido:** ${(workEnv.value as string[]).join(', ')}`)
        memoriesUsed.push(workEnv.id)
      }
    }
    
    // ===== METRICS SECTION =====
    const metricMemories = memories.filter(m => m.type === MemoryType.METRIC)
    if (metricMemories.length > 0) {
      const readiness = metricMemories.find(m => m.key === 'readiness_score')
      if (readiness) {
        contextSections.push(`\n## PREPARACIÓN\n**Puntuación de Preparación:** ${readiness.value.score}/100 (${readiness.value.level})`)
        memoriesUsed.push(readiness.id)
      }
    }
    
    // Build system prompt based on document type
    const systemPrompt = this.getSystemPromptForDocumentType(request)
    
    // Add target role/company context if provided
    if (request.targetRole) {
      contextSections.push(`\n## CONTEXTO DE SOLICITUD\n**Rol Objetivo para Este Documento:** ${request.targetRole}`)
    }
    if (request.targetCompany) {
      contextSections.push(`**Empresa Objetivo:** ${request.targetCompany}`)
    }
    if (request.customInstructions) {
      contextSections.push(`**Instrucciones Adicionales:** ${request.customInstructions}`)
    }
    
    return {
      systemPrompt,
      userContext: contextSections.join('\n'),
      memoriesUsed
    }
  }
  
  /**
   * Get system prompt based on document type
   */
  private getSystemPromptForDocumentType(request: DocumentGenerationRequest): string {
    const basePrompt = `Eres un experto en desarrollo de carrera y redacción profesional. 
Tu tarea es crear documentos profesionales personalizados basados en el perfil completo del usuario.

PRINCIPIOS:
1. Usa SOLO información proporcionada en el contexto - nunca inventes datos
2. Adapta el tono según el tipo de documento y las preferencias indicadas
3. Destaca las fortalezas identificadas y los logros concretos
4. Alinea el contenido con los objetivos profesionales del usuario
5. Usa el estilo de comunicación natural del usuario basado en su perfil DISC
6. Incluye métricas y resultados cuantificables cuando estén disponibles

`
    
    const typePrompts: Record<DocumentType, string> = {
      cv_executive: `${basePrompt}
FORMATO: CV Ejecutivo
- Resumen ejecutivo impactante en primera página
- Enfoque en liderazgo, estrategia y resultados de negocio
- Logros cuantificados con impacto organizacional
- Máximo 2 páginas
- Tono: Ejecutivo, directo, orientado a resultados`,

      cv_functional: `${basePrompt}
FORMATO: CV Funcional
- Organizado por áreas de competencia, no cronológicamente
- Ideal para cambio de carrera o gaps en experiencia
- Agrupa habilidades transferibles
- Minimiza fechas específicas
- Tono: Profesional, enfocado en habilidades`,

      cv_chronological: `${basePrompt}
FORMATO: CV Cronológico
- Experiencia en orden cronológico inverso
- Detalles de cada rol con logros específicos
- Progresión de carrera clara
- Formato tradicional y fácil de escanear
- Tono: Profesional, estructurado`,

      cover_letter: `${basePrompt}
FORMATO: Carta de Presentación
- Personalizada para el rol y empresa objetivo
- Conexión entre experiencia del usuario y requisitos del rol
- Historia convincente de por qué este rol
- Llamada a la acción clara
- Máximo 1 página
- Tono: Profesional pero personalizado`,

      linkedin_summary: `${basePrompt}
FORMATO: Resumen de LinkedIn
- Escrito en primera persona
- Narrativa atractiva y auténtica
- Palabras clave relevantes para SEO
- Llamada a la acción para conectar
- Máximo 2600 caracteres
- Tono: Profesional pero accesible`,

      linkedin_headline: `${basePrompt}
FORMATO: Headline de LinkedIn
- Máximo 220 caracteres
- Propuesta de valor clara
- Palabras clave del sector
- Diferenciador único
- Tono: Conciso, impactante`,

      elevator_pitch: `${basePrompt}
FORMATO: Elevator Pitch
- 30-60 segundos al hablar
- Estructura: Quién soy, qué hago, qué busco, por qué yo
- Memorable y diferenciador
- Termina con pregunta o gancho
- Tono: Conversacional, confiado`,

      thank_you_note: `${basePrompt}
FORMATO: Nota de Agradecimiento Post-Entrevista
- Referencia específica a la conversación
- Reafirma interés y fit
- Agrega valor adicional
- Breve y profesional
- Enviar dentro de 24 horas
- Tono: Agradecido, profesional`,

      negotiation_script: `${basePrompt}
FORMATO: Guión de Negociación
- Puntos de conversación estructurados
- Rangos salariales y justificación
- Respuestas a objeciones comunes
- Técnicas de negociación basadas en el perfil DISC
- Plan B y línea de salida
- Tono: Preparado, confiado, colaborativo`
    }
    
    return typePrompts[request.documentType] || basePrompt
  }
  
  /**
   * Process a generated document and extract insights
   */
  async processGeneratedDocument(
    document: GeneratedDocument,
    request: DocumentGenerationRequest
  ): Promise<void> {
    // Store the generated document
    await this.memoryManager.saveMemory({
      type: MemoryType.ARTIFACT,
      source: MemorySource.A4_DOCUMENTS,
      key: `document_${document.type}_${document.id}`,
      value: {
        id: document.id,
        type: document.type,
        targetRole: document.targetRole,
        targetCompany: document.targetCompany,
        generatedAt: document.generatedAt.toISOString(),
        version: document.version,
        contentLength: document.content.length,
        memoriesUsed: document.memoriesUsed.length
      },
      confidence: 1.0,
      extractedFrom: 'A4 Document Generation'
    })
    
    // Track document generation for patterns
    await this.memoryManager.saveMemory({
      type: MemoryType.METRIC,
      source: MemorySource.A4_DOCUMENTS,
      key: `document_generated_${Date.now()}`,
      value: {
        type: document.type,
        targetRole: document.targetRole,
        timestamp: new Date().toISOString()
      },
      confidence: 1.0,
      extractedFrom: 'A4 Document Generation'
    })
    
    // Log agent run
    await DTCAgentOS.logAgentRun({
      userId: this.userId,
      agentId: 'a4_generator',
      context: { 
        documentType: request.documentType,
        targetRole: request.targetRole 
      },
      response: { 
        documentId: document.id,
        contentLength: document.content.length 
      },
      memoriesExtracted: 2,
      tokensUsed: 0
    })
  }
  
  /**
   * Get previously generated documents
   */
  async getGeneratedDocuments(type?: DocumentType): Promise<GeneratedDocument[]> {
    const memories = await this.memoryManager.getMemoriesByType(MemoryType.ARTIFACT)
    
    return memories
      .filter(m => 
        m.source === MemorySource.A4_DOCUMENTS && 
        m.key.startsWith('document_') &&
        (!type || m.value.type === type)
      )
      .map(m => ({
        id: m.value.id,
        type: m.value.type,
        content: '', // Content stored separately in documents table
        targetRole: m.value.targetRole,
        targetCompany: m.value.targetCompany,
        generatedAt: new Date(m.value.generatedAt),
        memoriesUsed: [],
        version: m.value.version
      }))
      .sort((a, b) => b.generatedAt.getTime() - a.generatedAt.getTime())
  }
  
  /**
   * Check if user has enough context for document generation
   */
  async hasMinimumContext(): Promise<{
    ready: boolean
    missing: string[]
    available: string[]
  }> {
    const memories = await this.memoryManager.getAllMemories()
    const missing: string[] = []
    const available: string[] = []
    
    // Required memories
    const requirements = [
      { key: 'current_role', label: 'Rol actual' },
      { key: 'years_experience', label: 'Años de experiencia' },
      { key: 'declared_skills', label: 'Habilidades' },
      { key: 'target_roles', label: 'Roles objetivo' },
      { key: 'disc_profile_scores', label: 'Perfil DISC' }
    ]
    
    for (const req of requirements) {
      const found = memories.find(m => m.key === req.key)
      if (found) {
        available.push(req.label)
      } else {
        missing.push(req.label)
      }
    }
    
    // At least 3 achievements recommended
    const achievements = memories.filter(m => m.type === MemoryType.ACHIEVEMENT)
    if (achievements.length >= 3) {
      available.push(`${achievements.length} logros`)
    } else {
      missing.push(`Logros (tienes ${achievements.length}, recomendado 3+)`)
    }
    
    return {
      ready: missing.length <= 2, // Allow generation with some missing
      missing,
      available
    }
  }
}

// ============================================================================
// INTEGRATION HELPERS
// ============================================================================

/**
 * Hook to build context for document generation
 */
export async function buildA4Context(
  userId: string,
  request: DocumentGenerationRequest
): Promise<{ systemPrompt: string; userContext: string; memoriesUsed: string[] }> {
  const adapter = new A4Adapter(userId)
  return adapter.buildDocumentContext(request)
}

/**
 * Hook to process generated document
 */
export async function onA4DocumentGenerated(
  userId: string,
  document: GeneratedDocument,
  request: DocumentGenerationRequest
): Promise<void> {
  const adapter = new A4Adapter(userId)
  await adapter.processGeneratedDocument(document, request)
}

/**
 * Check if user is ready for document generation
 */
export async function checkA4Readiness(userId: string): Promise<{
  ready: boolean
  missing: string[]
  available: string[]
}> {
  const adapter = new A4Adapter(userId)
  return adapter.hasMinimumContext()
}

/**
 * Get all context for a comprehensive document
 */
export async function getFullDocumentContext(userId: string): Promise<{
  identity: Record<string, any>
  skills: string[]
  achievements: string[]
  strengths: string[]
  goals: string[]
  readinessScore: number | null
}> {
  const memoryManager = new MemoryManager(userId)
  const memories = await memoryManager.getAllMemories()
  
  return {
    identity: Object.fromEntries(
      memories
        .filter(m => m.type === MemoryType.IDENTITY)
        .map(m => [m.key, m.value])
    ),
    skills: memories
      .filter(m => m.type === MemoryType.SKILL)
      .flatMap(m => Array.isArray(m.value) ? m.value : [m.value]),
    achievements: memories
      .filter(m => m.type === MemoryType.ACHIEVEMENT)
      .map(m => m.value as string),
    strengths: memories
      .filter(m => m.type === MemoryType.STRENGTH)
      .map(m => m.value.area || m.key),
    goals: memories
      .filter(m => m.type === MemoryType.GOAL)
      .flatMap(m => Array.isArray(m.value) ? m.value : [m.value]),
    readinessScore: memories
      .find(m => m.key === 'readiness_score')?.value?.score ?? null
  }
}
