/**
 * Phase 2 Helper: Save day completions as DTC Documents
 * This bridges the gap between day experiences and document storage
 */

import { createDocument, updateDocument, upsertDocument, type CreateDocumentInput, type DocumentType } from './dtc-documents'

/**
 * Save day completion as a DTC document
 * Called when user completes a day step
 */
export async function saveDayDocument(
  userId: string,
  dayNumber: number,
  documentType: DocumentType,
  content: string,
  title?: string,
) {
  const sourceModule = `a2_day_${dayNumber}`
  
  return upsertDocument(userId, documentType, sourceModule, {
    title: title || `${documentType} - Day ${dayNumber}`,
    type: documentType,
    source_module: sourceModule,
    related_day: dayNumber,
    content,
    status: 'draft',
    source: 'user',
    tags: [`day${dayNumber}`, 'a2'],
  })
}

/**
 * Mark day document as approved/completed
 */
export async function completeDayDocument(
  userId: string,
  documentId: string,
) {
  return updateDocument(userId, documentId, {
    status: 'approved',
  })
}

/**
 * Get the current day document if it exists
 */
export async function getDayDocument(
  userId: string,
  dayNumber: number,
  documentType: DocumentType,
) {
  const { getDocumentsByDay } = await import('./dtc-documents')
  const { data: documents } = await getDocumentsByDay(userId, dayNumber)
  
  if (!documents) return null
  return documents.find(d => d.type === documentType) || null
}

/**
 * Format document content for display
 * Handles JSON stringification of complex objects
 */
export function formatDocumentContent(data: any): string {
  if (typeof data === 'string') return data
  if (typeof data === 'object' && data !== null) {
    return JSON.stringify(data, null, 2)
  }
  return String(data)
}

/**
 * Parse document content back to object
 */
export function parseDocumentContent(content: string): any {
  try {
    return JSON.parse(content)
  } catch {
    return content
  }
}
