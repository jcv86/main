/**
 * A4 Document Engine - Core CRUD and Management Functions
 * 
 * Handles all document operations including creation, updates, versioning,
 * and relationship management. Integrates with existing Supabase infrastructure.
 */

import { createClient } from '@/lib/supabase/client'
import type {
  DTCDocument,
  DTCDocumentVersion,
  DTCDocumentBlock,
  DTCDocumentRelation,
  DTCRouteDocumentRequirement,
  DTCDocumentType,
  DTCDocumentStatus,
  DTCSourceModule,
  DTCDocumentSource,
  DTCRelationType,
  CreateDocumentPayload,
  UpdateDocumentPayload,
  DayDocumentSet,
} from './types'

// ============================================
// DOCUMENT CRUD OPERATIONS
// ============================================

/**
 * Create a new document
 */
export async function createDocument(
  payload: CreateDocumentPayload
): Promise<DTCDocument | null> {
  const supabase = createClient()
  if (!supabase) return null

  const documentData = {
    user_id: payload.user_id,
    title: payload.title,
    type: payload.type,
    content: payload.content,
    plain_text: stripHtml(payload.content),
    source_module: payload.source_module,
    related_day: payload.related_day || null,
    related_a3_module: payload.related_a3_module || null,
    source: payload.source || 'user_created',
    status: 'draft' as DTCDocumentStatus,
    tags: payload.tags || [],
    version: 1,
    visibility: 'private',
  }

  const { data, error } = await supabase
    .from('dtc_documents')
    .insert(documentData)
    .select()
    .single()

  if (error) {
    console.error('[A4] Error creating document:', error)
    return null
  }

  // Create initial version
  await createDocumentVersion(data.id, data.content, 'Initial creation', payload.user_id)

  return data as DTCDocument
}

/**
 * Update an existing document
 */
export async function updateDocument(
  documentId: string,
  payload: UpdateDocumentPayload,
  changeReason?: string,
  userId?: string
): Promise<DTCDocument | null> {
  const supabase = createClient()
  if (!supabase) return null

  // Get current document for versioning
  const { data: currentDoc } = await supabase
    .from('dtc_documents')
    .select('*')
    .eq('id', documentId)
    .single()

  if (!currentDoc) return null

  const updateData: any = {
    ...payload,
    updated_at: new Date().toISOString(),
  }

  // If content changed, update plain_text and increment version
  if (payload.content && payload.content !== currentDoc.content) {
    updateData.plain_text = stripHtml(payload.content)
    updateData.version = (currentDoc.version || 1) + 1

    // Create version snapshot
    await createDocumentVersion(
      documentId,
      payload.content,
      changeReason || 'Content updated',
      userId || currentDoc.user_id
    )
  }

  const { data, error } = await supabase
    .from('dtc_documents')
    .update(updateData)
    .eq('id', documentId)
    .select()
    .single()

  if (error) {
    console.error('[A4] Error updating document:', error)
    return null
  }

  return data as DTCDocument
}

/**
 * Get a single document by ID
 */
export async function getDocument(documentId: string): Promise<DTCDocument | null> {
  const supabase = createClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('dtc_documents')
    .select('*')
    .eq('id', documentId)
    .single()

  if (error) {
    console.error('[A4] Error fetching document:', error)
    return null
  }

  return data as DTCDocument
}

/**
 * Get all documents for a user
 */
export async function getDocumentsByUser(
  userId: string,
  options?: {
    type?: DTCDocumentType
    status?: DTCDocumentStatus
    sourceModule?: DTCSourceModule
    limit?: number
    offset?: number
  }
): Promise<DTCDocument[]> {
  const supabase = createClient()
  if (!supabase) return []

  let query = supabase
    .from('dtc_documents')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (options?.type) {
    query = query.eq('type', options.type)
  }
  if (options?.status) {
    query = query.eq('status', options.status)
  }
  if (options?.sourceModule) {
    query = query.eq('source_module', options.sourceModule)
  }
  if (options?.limit) {
    query = query.limit(options.limit)
  }
  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 10) - 1)
  }

  const { data, error } = await query

  if (error) {
    console.error('[A4] Error fetching user documents:', error)
    return []
  }

  return (data || []) as DTCDocument[]
}

/**
 * Get documents by day number
 */
export async function getDocumentsByDay(
  userId: string,
  dayNumber: number
): Promise<DTCDocument[]> {
  const supabase = createClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('dtc_documents')
    .select('*')
    .eq('user_id', userId)
    .eq('related_day', dayNumber)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('[A4] Error fetching day documents:', error)
    return []
  }

  return (data || []) as DTCDocument[]
}

/**
 * Get documents by A3 module
 */
export async function getDocumentsByA3Module(
  userId: string,
  moduleId: string
): Promise<DTCDocument[]> {
  const supabase = createClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('dtc_documents')
    .select('*')
    .eq('user_id', userId)
    .eq('related_a3_module', moduleId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('[A4] Error fetching module documents:', error)
    return []
  }

  return (data || []) as DTCDocument[]
}

/**
 * Get documents by type
 */
export async function getDocumentsByType(
  userId: string,
  type: DTCDocumentType
): Promise<DTCDocument[]> {
  const supabase = createClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('dtc_documents')
    .select('*')
    .eq('user_id', userId)
    .eq('type', type)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('[A4] Error fetching documents by type:', error)
    return []
  }

  return (data || []) as DTCDocument[]
}

/**
 * Delete a document (soft delete - archive)
 */
export async function archiveDocument(documentId: string): Promise<boolean> {
  const supabase = createClient()
  if (!supabase) return false

  const { error } = await supabase
    .from('dtc_documents')
    .update({ status: 'archived', updated_at: new Date().toISOString() })
    .eq('id', documentId)

  if (error) {
    console.error('[A4] Error archiving document:', error)
    return false
  }

  return true
}

// ============================================
// DOCUMENT VERSIONING
// ============================================

/**
 * Create a document version snapshot
 */
export async function createDocumentVersion(
  documentId: string,
  content: string,
  changeReason: string,
  createdBy: string
): Promise<DTCDocumentVersion | null> {
  const supabase = createClient()
  if (!supabase) return null

  // Get current version number
  const { data: versions } = await supabase
    .from('dtc_document_versions')
    .select('version_number')
    .eq('document_id', documentId)
    .order('version_number', { ascending: false })
    .limit(1)

  const nextVersion = versions && versions.length > 0 
    ? versions[0].version_number + 1 
    : 1

  const { data, error } = await supabase
    .from('dtc_document_versions')
    .insert({
      document_id: documentId,
      version_number: nextVersion,
      content,
      plain_text: stripHtml(content),
      change_reason: changeReason,
      created_by: createdBy,
    })
    .select()
    .single()

  if (error) {
    console.error('[A4] Error creating document version:', error)
    return null
  }

  return data as DTCDocumentVersion
}

/**
 * Get version history for a document
 */
export async function getDocumentVersions(
  documentId: string
): Promise<DTCDocumentVersion[]> {
  const supabase = createClient()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('dtc_document_versions')
    .select('*')
    .eq('document_id', documentId)
    .order('version_number', { ascending: false })

  if (error) {
    console.error('[A4] Error fetching document versions:', error)
    return []
  }

  return (data || []) as DTCDocumentVersion[]
}

// ============================================
// DOCUMENT RELATIONS
// ============================================

/**
 * Create a relation between two documents
 */
export async function relateDocuments(
  sourceId: string,
  targetId: string,
  relationType: DTCRelationType,
  strength: number = 50
): Promise<DTCDocumentRelation | null> {
  const supabase = createClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('dtc_document_relations')
    .upsert({
      source_document_id: sourceId,
      target_document_id: targetId,
      relation_type: relationType,
      strength: Math.min(100, Math.max(0, strength)),
    }, {
      onConflict: 'source_document_id,target_document_id,relation_type'
    })
    .select()
    .single()

  if (error) {
    console.error('[A4] Error creating document relation:', error)
    return null
  }

  return data as DTCDocumentRelation
}

/**
 * Get related documents
 */
export async function getRelatedDocuments(
  documentId: string,
  relationType?: DTCRelationType
): Promise<{ relation: DTCDocumentRelation; document: DTCDocument }[]> {
  const supabase = createClient()
  if (!supabase) return []

  let query = supabase
    .from('dtc_document_relations')
    .select(`
      *,
      target_document:dtc_documents!target_document_id(*)
    `)
    .eq('source_document_id', documentId)

  if (relationType) {
    query = query.eq('relation_type', relationType)
  }

  const { data, error } = await query

  if (error) {
    console.error('[A4] Error fetching related documents:', error)
    return []
  }

  return (data || []).map((item: any) => ({
    relation: {
      id: item.id,
      source_document_id: item.source_document_id,
      target_document_id: item.target_document_id,
      relation_type: item.relation_type,
      strength: item.strength,
      created_at: item.created_at,
    } as DTCDocumentRelation,
    document: item.target_document as DTCDocument,
  }))
}

// ============================================
// DAY DOCUMENT REQUIREMENTS
// ============================================

/**
 * Get required documents for a specific day
 */
export async function getRequiredDocumentsForDay(
  dayNumber: number
): Promise<DayDocumentSet | null> {
  const supabase = createClient()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('dtc_day_document_sets')
    .select('*')
    .eq('day_number', dayNumber)
    .single()

  if (error) {
    // No requirements defined for this day
    return null
  }

  return {
    dayNumber: data.day_number,
    title: data.title,
    requiredDocuments: data.required_documents || [],
    optionalDocuments: data.optional_documents || [],
    generatedDocuments: data.generated_documents || [],
  }
}

/**
 * Check if all required documents exist for a day
 */
export async function canCompleteDayDocuments(
  userId: string,
  dayNumber: number
): Promise<{ canComplete: boolean; missing: string[] }> {
  const requirements = await getRequiredDocumentsForDay(dayNumber)
  
  if (!requirements) {
    return { canComplete: true, missing: [] }
  }

  const dayDocs = await getDocumentsByDay(userId, dayNumber)
  const existingTypes = new Set(dayDocs.map(d => d.type))
  const missing: string[] = []

  for (const requiredType of requirements.requiredDocuments) {
    if (!existingTypes.has(requiredType as DTCDocumentType)) {
      missing.push(requiredType)
    }
  }

  return {
    canComplete: missing.length === 0,
    missing,
  }
}

/**
 * Ensure required documents exist for a day (create empty drafts if missing)
 */
export async function ensureDocumentsForDay(
  userId: string,
  dayNumber: number
): Promise<DTCDocument[]> {
  const requirements = await getRequiredDocumentsForDay(dayNumber)
  
  if (!requirements) {
    return []
  }

  const existingDocs = await getDocumentsByDay(userId, dayNumber)
  const existingTypes = new Set(existingDocs.map(d => d.type))
  const createdDocs: DTCDocument[] = []

  for (const requiredType of requirements.requiredDocuments) {
    if (!existingTypes.has(requiredType as DTCDocumentType)) {
      const doc = await createDocument({
        user_id: userId,
        title: getDefaultTitleForType(requiredType as DTCDocumentType, dayNumber),
        type: requiredType as DTCDocumentType,
        content: '',
        source_module: 'a2',
        related_day: dayNumber,
        source: 'system_generated',
      })
      if (doc) {
        createdDocs.push(doc)
      }
    }
  }

  return createdDocs
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Strip HTML tags from content to get plain text
 */
function stripHtml(html: string): string {
  if (!html) return ''
  return html
    .replace(/<[^>]*>/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Get default title for a document type
 */
function getDefaultTitleForType(type: DTCDocumentType, dayNumber?: number): string {
  const titles: Record<DTCDocumentType, string> = {
    route_contract: 'Mi Contrato de Ruta',
    identity_statement: 'Declaración de Identidad Profesional',
    psychological_profile: 'Perfil Psicológico',
    work_style_profile: 'Perfil de Estilo de Trabajo',
    evidence_item: 'Evidencia Profesional',
    evidence_vault_summary: 'Resumen de Bóveda de Evidencia',
    cv_draft: 'Borrador de CV',
    cv_bullet: 'Bullet de CV',
    executive_summary: 'Resumen Ejecutivo',
    linkedin_profile: 'Perfil de LinkedIn',
    star_answer: 'Respuesta STAR',
    job_analysis: 'Análisis de Puesto',
    company_research: 'Investigación de Empresa',
    role_fit_matrix: 'Matriz de Ajuste al Rol',
    application_tracker: 'Seguimiento de Postulación',
    interview_answer: 'Respuesta de Entrevista',
    interview_transcript: 'Transcripción de Entrevista',
    coach_feedback: 'Feedback del Coach',
    module_feedback: 'Feedback de Módulo',
    reflection: 'Reflexión Personal',
    daily_mission: 'Misión del Día',
    portfolio_asset: 'Activo de Portafolio',
    final_deliverable: 'Entregable Final',
    uploaded_file: 'Archivo Subido',
    ai_profile_analysis: 'Análisis de Perfil IA',
    profile_snapshot: 'Snapshot de Perfil',
  }

  const baseTitle = titles[type] || 'Documento'
  return dayNumber ? `${baseTitle} - Día ${dayNumber}` : baseTitle
}

/**
 * Get document statistics for a user
 */
export async function getDocumentStats(userId: string): Promise<{
  total: number
  byStatus: Record<DTCDocumentStatus, number>
  byType: Record<string, number>
  byModule: Record<DTCSourceModule, number>
}> {
  const supabase = createClient()
  if (!supabase) {
    return {
      total: 0,
      byStatus: {} as Record<DTCDocumentStatus, number>,
      byType: {},
      byModule: {} as Record<DTCSourceModule, number>,
    }
  }

  const { data } = await supabase
    .from('dtc_documents')
    .select('status, type, source_module')
    .eq('user_id', userId)

  if (!data) {
    return {
      total: 0,
      byStatus: {} as Record<DTCDocumentStatus, number>,
      byType: {},
      byModule: {} as Record<DTCSourceModule, number>,
    }
  }

  const byStatus: Record<string, number> = {}
  const byType: Record<string, number> = {}
  const byModule: Record<string, number> = {}

  for (const doc of data) {
    byStatus[doc.status] = (byStatus[doc.status] || 0) + 1
    byType[doc.type] = (byType[doc.type] || 0) + 1
    byModule[doc.source_module] = (byModule[doc.source_module] || 0) + 1
  }

  return {
    total: data.length,
    byStatus: byStatus as Record<DTCDocumentStatus, number>,
    byType,
    byModule: byModule as Record<DTCSourceModule, number>,
  }
}
