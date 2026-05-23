/**
 * A4 Document Intelligence - AI Analysis Pipeline
 * 
 * Handles document analysis, profile signal extraction, and intelligence processing.
 * Every document update triggers this pipeline to extract insights and update profiles.
 */

import { createClient } from '@/lib/supabase/client'
import type {
  DTCDocument,
  DTCDocumentAIExtraction,
  DTCProfileSignal,
  DTCAnalysisJob,
  DTCExtractionType,
  DTCSignalType,
  DTCSourceModule,
  DTCJobType,
  DTCJobStatus,
} from './types'
import { getDocument, updateDocument } from './document-engine'

// ============================================
// DOCUMENT INTELLIGENCE PIPELINE
// ============================================

/**
 * Main intelligence pipeline - called after every document create/update
 * 
 * Flow:
 * 1. Save document (already done before this is called)
 * 2. Create document version (already done)
 * 3. Extract plain text (already done)
 * 4. Run AI document analysis
 * 5. Store extraction in dtc_document_ai_extractions
 * 6. Convert extraction into profile signals
 * 7. Save signals in dtc_profile_signals
 * 8. Rebuild user profile snapshot
 * 9. Update route context
 */
export async function processDocumentIntelligence(documentId: string): Promise<{
  success: boolean
  extractionId?: string
  signalsCreated?: number
  error?: string
}> {
  try {
    // Get document
    const document = await getDocument(documentId)
    if (!document) {
      return { success: false, error: 'Document not found' }
    }

    // Create analysis job
    const job = await createAnalysisJob(document.user_id, documentId, 'analyze_document')
    if (!job) {
      return { success: false, error: 'Failed to create analysis job' }
    }

    // Run AI analysis
    const extraction = await analyzeDocument(document)
    if (!extraction) {
      await updateAnalysisJobStatus(job.id, 'failed', null, 'AI analysis failed')
      return { success: false, error: 'AI analysis failed' }
    }

    // Extract profile signals from analysis
    const signals = await extractProfileSignals(document, extraction)

    // Save signals to database
    const savedSignals = await saveProfileSignals(signals)

    // Update document with AI summary if available
    if (extraction.extracted_json.summary) {
      await updateDocument(documentId, {
        ai_summary: extraction.extracted_json.summary,
      })
    }

    // Mark job as completed
    await updateAnalysisJobStatus(job.id, 'completed', {
      extractionId: extraction.id,
      signalsCreated: savedSignals.length,
    })

    return {
      success: true,
      extractionId: extraction.id,
      signalsCreated: savedSignals.length,
    }
  } catch (error) {
    console.error('[A4 Intelligence] Pipeline error:', error)
    return { success: false, error: String(error) }
  }
}

// ============================================
// AI DOCUMENT ANALYSIS
// ============================================

/**
 * Analyze a document using AI to extract structured insights
 */
export async function analyzeDocument(
  document: DTCDocument
): Promise<DTCDocumentAIExtraction | null> {
  const supabase = createClient()
  if (!supabase) return null

  // Determine extraction type based on document type
  const extractionType = getExtractionTypeForDocument(document.type)

  // Build AI analysis (placeholder - would connect to actual AI service)
  const analysisResult = await performAIAnalysis(document, extractionType)

  // Store extraction
  const { data, error } = await supabase
    .from('dtc_document_ai_extractions')
    .insert({
      document_id: document.id,
      user_id: document.user_id,
      extraction_type: extractionType,
      extracted_json: analysisResult,
      confidence: analysisResult.confidence || 75,
      model_used: 'claude-3.5-sonnet',
    })
    .select()
    .single()

  if (error) {
    console.error('[A4 Intelligence] Error storing extraction:', error)
    return null
  }

  return data as DTCDocumentAIExtraction
}

/**
 * Perform AI analysis on document content
 * This is a placeholder that would connect to actual AI services
 */
async function performAIAnalysis(
  document: DTCDocument,
  extractionType: DTCExtractionType
): Promise<Record<string, any>> {
  const content = document.plain_text || document.content || ''

  // Base analysis structure
  const analysis: Record<string, any> = {
    documentType: document.type,
    extractionType,
    confidence: 75,
    analyzedAt: new Date().toISOString(),
  }

  // Type-specific analysis
  switch (document.type) {
    case 'route_contract':
    case 'identity_statement':
      analysis.identitySignals = extractIdentitySignals(content)
      analysis.careerGoals = extractCareerGoals(content)
      analysis.summary = `Documento de identidad profesional con ${analysis.identitySignals.length} señales clave identificadas.`
      break

    case 'psychological_profile':
    case 'work_style_profile':
      analysis.workStyle = extractWorkStyleSignals(content)
      analysis.communicationPattern = extractCommunicationPattern(content)
      analysis.summary = `Perfil con estilo de trabajo identificado y patrones de comunicación analizados.`
      break

    case 'evidence_item':
    case 'evidence_vault_summary':
      analysis.evidenceMetrics = extractEvidenceMetrics(content)
      analysis.strengths = extractStrengthsFromEvidence(content)
      analysis.summary = `Evidencia con ${analysis.evidenceMetrics.length} métricas cuantificables.`
      break

    case 'cv_draft':
    case 'cv_bullet':
      analysis.cvBullets = extractCVBullets(content)
      analysis.cvGaps = identifyCVGaps(content)
      analysis.summary = `CV con ${analysis.cvBullets.length} bullets y ${analysis.cvGaps.length} áreas a mejorar.`
      break

    case 'star_answer':
    case 'interview_answer':
      analysis.starStructure = analyzeSTARStructure(content)
      analysis.interviewRisks = identifyInterviewRisks(content)
      analysis.summary = `Respuesta STAR con estructura ${analysis.starStructure.completeness}% completa.`
      break

    case 'job_analysis':
    case 'role_fit_matrix':
      analysis.roleFit = analyzeRoleFit(content)
      analysis.requirements = extractJobRequirements(content)
      analysis.summary = `Análisis de puesto con ${analysis.requirements.length} requisitos identificados.`
      break

    default:
      analysis.generalInsights = extractGeneralInsights(content)
      analysis.summary = `Documento analizado con insights generales extraídos.`
  }

  return analysis
}

// ============================================
// SIGNAL EXTRACTION HELPERS
// ============================================

function extractIdentitySignals(content: string): { signal: string; confidence: number }[] {
  const signals: { signal: string; confidence: number }[] = []
  
  // Look for key identity phrases
  const identityPatterns = [
    /soy\s+(\w+\s+\w+)/gi,
    /mi\s+objetivo\s+es\s+([^.]+)/gi,
    /quiero\s+ser\s+([^.]+)/gi,
    /mi\s+pasión\s+es\s+([^.]+)/gi,
  ]

  for (const pattern of identityPatterns) {
    const matches = content.matchAll(pattern)
    for (const match of matches) {
      if (match[1]) {
        signals.push({ signal: match[1].trim(), confidence: 70 })
      }
    }
  }

  return signals
}

function extractCareerGoals(content: string): string[] {
  const goals: string[] = []
  
  const goalPatterns = [
    /mi meta es ([^.]+)/gi,
    /objetivo profesional[:\s]+([^.]+)/gi,
    /busco\s+([^.]+)/gi,
  ]

  for (const pattern of goalPatterns) {
    const matches = content.matchAll(pattern)
    for (const match of matches) {
      if (match[1]) {
        goals.push(match[1].trim())
      }
    }
  }

  return [...new Set(goals)]
}

function extractWorkStyleSignals(content: string): Record<string, any> {
  return {
    collaborative: content.toLowerCase().includes('equipo') || content.toLowerCase().includes('colabor'),
    independent: content.toLowerCase().includes('autónom') || content.toLowerCase().includes('independiente'),
    structured: content.toLowerCase().includes('organiz') || content.toLowerCase().includes('planific'),
    flexible: content.toLowerCase().includes('adapt') || content.toLowerCase().includes('flexib'),
  }
}

function extractCommunicationPattern(content: string): Record<string, any> {
  const wordCount = content.split(/\s+/).length
  const sentenceCount = content.split(/[.!?]+/).length

  return {
    verbosity: wordCount > 500 ? 'detailed' : wordCount > 200 ? 'moderate' : 'concise',
    avgSentenceLength: Math.round(wordCount / sentenceCount),
    formalityLevel: content.includes('usted') || content.includes('estimad') ? 'formal' : 'casual',
  }
}

function extractEvidenceMetrics(content: string): { metric: string; value: string }[] {
  const metrics: { metric: string; value: string }[] = []
  
  // Look for numbers with context
  const metricPatterns = [
    /(\d+[%])\s+(\w+)/g,
    /(\$[\d,]+)\s+(\w+)/g,
    /(\d+)\s+(años|meses|proyectos|clientes|equipos)/gi,
  ]

  for (const pattern of metricPatterns) {
    const matches = content.matchAll(pattern)
    for (const match of matches) {
      metrics.push({ metric: match[2], value: match[1] })
    }
  }

  return metrics
}

function extractStrengthsFromEvidence(content: string): string[] {
  const strengths: string[] = []
  
  const strengthKeywords = [
    'logré', 'conseguí', 'lideré', 'implementé', 'mejoré',
    'aumenté', 'reduje', 'optimicé', 'desarrollé', 'creé'
  ]

  for (const keyword of strengthKeywords) {
    if (content.toLowerCase().includes(keyword)) {
      // Find the sentence containing this keyword
      const sentences = content.split(/[.!?]+/)
      for (const sentence of sentences) {
        if (sentence.toLowerCase().includes(keyword)) {
          strengths.push(sentence.trim())
          break
        }
      }
    }
  }

  return strengths.slice(0, 5) // Top 5 strengths
}

function extractCVBullets(content: string): string[] {
  const bullets: string[] = []
  
  // Look for bullet-like content
  const lines = content.split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith('-') || trimmed.startsWith('•') || trimmed.startsWith('*')) {
      bullets.push(trimmed.substring(1).trim())
    }
  }

  return bullets
}

function identifyCVGaps(content: string): string[] {
  const gaps: string[] = []
  
  // Check for missing common CV sections
  const requiredSections = ['experiencia', 'educación', 'habilidades', 'logros']
  for (const section of requiredSections) {
    if (!content.toLowerCase().includes(section)) {
      gaps.push(`Falta sección de ${section}`)
    }
  }

  // Check for quantification
  if (!/\d+/.test(content)) {
    gaps.push('Agregar métricas cuantificables')
  }

  return gaps
}

function analyzeSTARStructure(content: string): Record<string, any> {
  const lower = content.toLowerCase()
  
  return {
    hasSituation: lower.includes('situación') || lower.includes('contexto') || lower.includes('cuando'),
    hasTask: lower.includes('tarea') || lower.includes('responsabilidad') || lower.includes('objetivo'),
    hasAction: lower.includes('acción') || lower.includes('hice') || lower.includes('implementé'),
    hasResult: lower.includes('resultado') || lower.includes('logré') || lower.includes('conseguí'),
    completeness: calculateSTARCompleteness(lower),
  }
}

function calculateSTARCompleteness(content: string): number {
  let score = 0
  if (content.includes('situación') || content.includes('contexto')) score += 25
  if (content.includes('tarea') || content.includes('responsabilidad')) score += 25
  if (content.includes('acción') || content.includes('hice')) score += 25
  if (content.includes('resultado') || content.includes('logré')) score += 25
  return score
}

function identifyInterviewRisks(content: string): string[] {
  const risks: string[] = []
  
  // Check for common interview answer issues
  if (content.length < 100) {
    risks.push('Respuesta demasiado corta')
  }
  if (content.length > 1000) {
    risks.push('Respuesta demasiado larga')
  }
  if (!content.includes('yo') && !content.includes('mi')) {
    risks.push('Falta perspectiva personal')
  }
  if (!/\d/.test(content)) {
    risks.push('Sin métricas o números')
  }

  return risks
}

function analyzeRoleFit(content: string): Record<string, any> {
  return {
    hasRequirements: content.toLowerCase().includes('requisito') || content.toLowerCase().includes('requerid'),
    hasBenefits: content.toLowerCase().includes('beneficio') || content.toLowerCase().includes('ofrec'),
    hasResponsibilities: content.toLowerCase().includes('responsabilidad') || content.toLowerCase().includes('función'),
    fitScore: calculateRoleFitScore(content),
  }
}

function calculateRoleFitScore(content: string): number {
  // Simple scoring based on content completeness
  let score = 50
  if (content.length > 200) score += 10
  if (content.toLowerCase().includes('experiencia')) score += 10
  if (content.toLowerCase().includes('habilidad')) score += 10
  if (content.toLowerCase().includes('cultura')) score += 10
  if (/\d/.test(content)) score += 10
  return Math.min(100, score)
}

function extractJobRequirements(content: string): string[] {
  const requirements: string[] = []
  
  const lines = content.split('\n')
  let inRequirements = false
  
  for (const line of lines) {
    const lower = line.toLowerCase()
    if (lower.includes('requisito') || lower.includes('requerid')) {
      inRequirements = true
      continue
    }
    if (inRequirements && line.trim()) {
      if (line.startsWith('-') || line.startsWith('•') || line.startsWith('*')) {
        requirements.push(line.substring(1).trim())
      }
    }
  }

  return requirements
}

function extractGeneralInsights(content: string): string[] {
  const insights: string[] = []
  
  // Word count insight
  const wordCount = content.split(/\s+/).length
  insights.push(`Documento con ${wordCount} palabras`)
  
  // Topic detection
  const topics = ['liderazgo', 'técnico', 'gestión', 'ventas', 'marketing', 'finanzas']
  for (const topic of topics) {
    if (content.toLowerCase().includes(topic)) {
      insights.push(`Tema detectado: ${topic}`)
    }
  }

  return insights
}

// ============================================
// PROFILE SIGNAL EXTRACTION
// ============================================

/**
 * Extract profile signals from AI extraction results
 */
export async function extractProfileSignals(
  document: DTCDocument,
  extraction: DTCDocumentAIExtraction
): Promise<Omit<DTCProfileSignal, 'id' | 'created_at'>[]> {
  const signals: Omit<DTCProfileSignal, 'id' | 'created_at'>[] = []
  const json = extraction.extracted_json

  // Extract signals based on document type and extraction results
  if (json.identitySignals) {
    for (const signal of json.identitySignals) {
      signals.push({
        user_id: document.user_id,
        source_document_id: document.id,
        source_module: document.source_module,
        signal_type: 'career_goal',
        signal_value: signal.signal,
        confidence: signal.confidence,
        weight: 7,
        polarity: 'positive',
      })
    }
  }

  if (json.careerGoals) {
    for (const goal of json.careerGoals) {
      signals.push({
        user_id: document.user_id,
        source_document_id: document.id,
        source_module: document.source_module,
        signal_type: 'target_role',
        signal_value: goal,
        confidence: 70,
        weight: 8,
        polarity: 'positive',
      })
    }
  }

  if (json.workStyle) {
    const styles = json.workStyle
    for (const [style, isPresent] of Object.entries(styles)) {
      if (isPresent) {
        signals.push({
          user_id: document.user_id,
          source_document_id: document.id,
          source_module: document.source_module,
          signal_type: 'work_style',
          signal_value: style,
          confidence: 65,
          weight: 6,
          polarity: 'neutral',
        })
      }
    }
  }

  if (json.strengths) {
    for (const strength of json.strengths) {
      signals.push({
        user_id: document.user_id,
        source_document_id: document.id,
        source_module: document.source_module,
        signal_type: 'strength',
        signal_value: strength.substring(0, 200),
        confidence: 75,
        weight: 8,
        polarity: 'positive',
      })
    }
  }

  if (json.cvGaps) {
    for (const gap of json.cvGaps) {
      signals.push({
        user_id: document.user_id,
        source_document_id: document.id,
        source_module: document.source_module,
        signal_type: 'cv_gap',
        signal_value: gap,
        confidence: 80,
        weight: 7,
        polarity: 'negative',
      })
    }
  }

  if (json.interviewRisks) {
    for (const risk of json.interviewRisks) {
      signals.push({
        user_id: document.user_id,
        source_document_id: document.id,
        source_module: document.source_module,
        signal_type: 'interview_risk',
        signal_value: risk,
        confidence: 75,
        weight: 6,
        polarity: 'negative',
      })
    }
  }

  if (json.evidenceMetrics) {
    for (const metric of json.evidenceMetrics) {
      signals.push({
        user_id: document.user_id,
        source_document_id: document.id,
        source_module: document.source_module,
        signal_type: 'proof_of_value',
        signal_value: `${metric.metric}: ${metric.value}`,
        confidence: 85,
        weight: 9,
        polarity: 'positive',
      })
    }
  }

  return signals
}

/**
 * Save profile signals to database
 */
export async function saveProfileSignals(
  signals: Omit<DTCProfileSignal, 'id' | 'created_at'>[]
): Promise<DTCProfileSignal[]> {
  const supabase = createClient()
  if (!supabase || signals.length === 0) return []

  const { data, error } = await supabase
    .from('dtc_profile_signals')
    .insert(signals)
    .select()

  if (error) {
    console.error('[A4 Intelligence] Error saving signals:', error)
    return []
  }

  return (data || []) as DTCProfileSignal[]
}

// ============================================
// ANALYSIS JOBS
// ============================================

/**
 * Create an analysis job
 */
export async function createAnalysisJob(
  userId: string,
  documentId: string | null,
  jobType: DTCJobType
): Promise<DTCAnalysisJob | null> {
  const supabase = createClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('dtc_analysis_jobs')
    .insert({
      user_id: userId,
      document_id: documentId,
      job_type: jobType,
      status: 'processing',
      input_payload: { documentId, jobType },
      started_at: new Date().toISOString(),
    })
    .select()
    .single()

  if (error) {
    console.error('[A4 Intelligence] Error creating job:', error)
    return null
  }

  return data as DTCAnalysisJob
}

/**
 * Update analysis job status
 */
export async function updateAnalysisJobStatus(
  jobId: string,
  status: DTCJobStatus,
  outputPayload?: Record<string, any> | null,
  error?: string
): Promise<boolean> {
  const supabase = createClient()
  if (!supabase) return false

  const updateData: any = {
    status,
    output_payload: outputPayload,
    error,
  }

  if (status === 'completed' || status === 'failed') {
    updateData.completed_at = new Date().toISOString()
  }

  const { error: updateError } = await supabase
    .from('dtc_analysis_jobs')
    .update(updateData)
    .eq('id', jobId)

  if (updateError) {
    console.error('[A4 Intelligence] Error updating job:', updateError)
    return false
  }

  return true
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function getExtractionTypeForDocument(documentType: string): DTCExtractionType {
  const mapping: Record<string, DTCExtractionType> = {
    route_contract: 'profile_signals',
    identity_statement: 'profile_signals',
    psychological_profile: 'profile_signals',
    work_style_profile: 'profile_signals',
    evidence_item: 'evidence_metrics',
    evidence_vault_summary: 'evidence_metrics',
    cv_draft: 'cv_bullets',
    cv_bullet: 'cv_bullets',
    star_answer: 'star_structure',
    interview_answer: 'star_structure',
    job_analysis: 'role_fit',
    role_fit_matrix: 'role_fit',
  }

  return mapping[documentType] || 'profile_signals'
}
