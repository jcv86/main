/**
 * DTC Documents - Unified document storage for A2, A3, A4
 * Single source of truth for all artifacts across the program
 */

import { createClient } from './client'

// Document types across all modules
export type DocumentType =
  | 'route_contract'           // A2 Day 1
  | 'evidence_vault'           // A2 Day 2
  | 'market_signal'            // A2 Day 3
  | 'candidate_board'          // A2 Day 4
  | 'test_introduction'        // A2 Day 5
  | 'professional_identity'    // A2 Day 6
  | 'career_mirror'            // A2 Day 7
  | 'work_memory'              // A2 Day 8
  | 'value_inventory'          // A2 Day 9-12
  | 'value_statement'          // A2 Day 11
  | 'achievement_story'        // A2 Day 14-15
  | 'cv_bullet'                // A2 Day 19-21
  | 'daily_mission'            // A2 Days 1-30
  | 'a3_learning_output'       // A3 modules
  | 'a4_portfolio_entry'       // A4 workspace

export type DocumentStatus = 'draft' | 'review' | 'revision' | 'approved' | 'final'
export type DocumentSource = 'user' | 'ai_generated' | 'travis_seed' | 'coach_feedback'

export interface DTCDocument {
  id: string
  user_id: string
  title: string
  type: DocumentType
  source_module: string | null
  related_day: number | null
  related_a3_module: string | null
  status: DocumentStatus
  source: DocumentSource
  content: string | null
  ai_summary: string | null
  coach_feedback: string | null
  tags: string[]
  version: number
  parent_document_id: string | null
  created_at: string
  updated_at: string
}

export interface CreateDocumentInput {
  title: string
  type: DocumentType
  source_module?: string
  related_day?: number
  related_a3_module?: string
  content?: string
  status?: DocumentStatus
  source?: DocumentSource
  tags?: string[]
}

export interface UpdateDocumentInput {
  title?: string
  content?: string
  status?: DocumentStatus
  ai_summary?: string
  coach_feedback?: string
  tags?: string[]
}

/**
 * Create a new document
 */
export async function createDocument(
  userId: string,
  input: CreateDocumentInput
) {
  try {
    const sb = createClient()
    
    const { data, error } = await sb
      .from('dtc_documents')
      .insert({
        user_id: userId,
        title: input.title,
        type: input.type,
        source_module: input.source_module || null,
        related_day: input.related_day || null,
        related_a3_module: input.related_a3_module || null,
        content: input.content || null,
        status: input.status || 'draft',
        source: input.source || 'user',
        tags: input.tags || [],
      })
      .select()
      .single()

    if (error) {
      console.error('[v0] createDocument error:', error)
      return { data: null, error }
    }

    console.log('[v0] Document created successfully:', data?.id)
    return { data: data as DTCDocument | null, error }
  } catch (err) {
    console.error('[v0] createDocument exception:', err)
    return { data: null, error: err }
  }
}

/**
 * Get a single document by ID
 */
export async function getDocument(userId: string, documentId: string) {
  const sb = createClient()
  
  const { data, error } = await sb
    .from('dtc_documents')
    .select('*')
    .eq('user_id', userId)
    .eq('id', documentId)
    .single()

  return { data: data as DTCDocument | null, error }
}

/**
 * Get documents by day (all types related to a specific A2 day)
 */
export async function getDocumentsByDay(userId: string, dayNumber: number) {
  const sb = createClient()
  
  const { data, error } = await sb
    .from('dtc_documents')
    .select('*')
    .eq('user_id', userId)
    .eq('related_day', dayNumber)
    .order('created_at', { ascending: false })

  return { data: data as DTCDocument[] | null, error }
}

/**
 * Get documents by type (e.g., all 'cv_bullet' documents)
 */
export async function getDocumentsByType(
  userId: string,
  type: DocumentType,
  relatedDay?: number
) {
  const sb = createClient()
  
  let query = sb
    .from('dtc_documents')
    .select('*')
    .eq('user_id', userId)
    .eq('type', type)

  if (relatedDay !== undefined) {
    query = query.eq('related_day', relatedDay)
  }

  const { data, error } = await query.order('created_at', { ascending: false })

  return { data: data as DTCDocument[] | null, error }
}

/**
 * Get documents by source module (e.g., 'a2_day_3')
 */
export async function getDocumentsByModule(userId: string, sourceModule: string) {
  const sb = createClient()
  
  const { data, error } = await sb
    .from('dtc_documents')
    .select('*')
    .eq('user_id', userId)
    .eq('source_module', sourceModule)
    .order('created_at', { ascending: false })

  return { data: data as DTCDocument[] | null, error }
}

/**
 * Get all documents for a user
 */
export async function getAllDocuments(userId: string) {
  const sb = createClient()
  
  const { data, error } = await sb
    .from('dtc_documents')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  return { data: data as DTCDocument[] | null, error }
}

/**
 * Get all documents for a user (alias for getAllDocuments)
 */
export async function getAllUserDocuments(userId: string) {
  return getAllDocuments(userId)
}

/**
 * Update a document
 */
export async function updateDocument(
  userId: string,
  documentId: string,
  input: UpdateDocumentInput
) {
  try {
    const sb = createClient()
    
    const { data, error } = await sb
      .from('dtc_documents')
      .update({
        ...input,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', userId)
      .eq('id', documentId)
      .select()
      .single()

    if (error) {
      console.error('[v0] updateDocument error:', error)
      return { data: null, error }
    }

    console.log('[v0] Document updated successfully:', documentId)
    return { data: data as DTCDocument | null, error }
  } catch (err) {
    console.error('[v0] updateDocument exception:', err)
    return { data: null, error: err }
  }
}

/**
 * Delete a document
 */
export async function deleteDocument(userId: string, documentId: string) {
  const sb = createClient()
  
  const { error } = await sb
    .from('dtc_documents')
    .delete()
    .eq('user_id', userId)
    .eq('id', documentId)

  return { error }
}

/**
 * Check if a document exists for a specific day and type
 */
export async function documentExists(
  userId: string,
  type: DocumentType,
  sourceModule: string,
  relatedDay?: number
) {
  const sb = createClient()
  
  let query = sb
    .from('dtc_documents')
    .select('id')
    .eq('user_id', userId)
    .eq('type', type)
    .eq('source_module', sourceModule)

  if (relatedDay !== undefined) {
    query = query.eq('related_day', relatedDay)
  }

  const { data, error } = await query.maybeSingle()

  return { exists: !!data, error }
}

/**
 * Upsert a document - create if doesn't exist, update if it does
 */
export async function upsertDocument(
  userId: string,
  type: DocumentType,
  sourceModule: string,
  input: CreateDocumentInput
) {
  try {
    const sb = createClient()
    
    // Try to find existing document
    const { data: existing, error: findError } = await sb
      .from('dtc_documents')
      .select('id')
      .eq('user_id', userId)
      .eq('type', type)
      .eq('source_module', sourceModule)
      .eq('related_day', input.related_day || null)
      .maybeSingle()

    if (findError) {
      console.error('[v0] Error finding existing document:', findError)
      throw findError
    }

    if (existing) {
      // Update existing
      console.log('[v0] Updating existing document:', existing.id)
      const result = await updateDocument(userId, existing.id, {
        title: input.title,
        content: input.content,
        status: input.status,
        tags: input.tags,
      })
      console.log('[v0] Document updated:', result)
      return result
    } else {
      // Create new
      console.log('[v0] Creating new document:', { type, sourceModule, userId })
      const result = await createDocument(userId, input)
      console.log('[v0] Document created:', result)
      return result
    }
  } catch (err) {
    console.error('[v0] upsertDocument error:', err)
    throw err
  }
}
