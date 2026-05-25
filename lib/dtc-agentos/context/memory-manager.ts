/**
 * DTC AgentOS - Memory Manager
 * 
 * Handles reading and writing user memory items across all stages
 * (C1, A1, C2, A2, A3, A4). Memory provides context for AI interactions.
 */

import { createClient } from '@/lib/supabase/server'
import type { 
  MemoryItem, 
  MemoryItemType, 
  MemorySourceType,
  CaptureMemoryPayload,
  CommandId,
} from '../types'

// Define stage memory types - what memory items should be captured from each stage
export const STAGE_MEMORY_TYPES: Record<string, MemoryItemType[]> = {
  c1: ['career_goal', 'motivation', 'constraint', 'learning_preference'],
  a1: ['strength', 'weakness', 'communication_style', 'interview_pattern'],
  c2: ['role_target', 'skill', 'achievement', 'market_region', 'company_preference'],
  a2: ['feedback_received', 'evidence'],
  a3: ['star_story', 'interview_pattern', 'skill', 'weakness', 'feedback_received'],
  a4: ['evidence', 'star_story', 'achievement']
}

// Re-export types for consumers
export type { CaptureMemoryPayload, MemoryItem, MemoryItemType, MemorySourceType }

// =============================================================================
// DATABASE OPERATIONS
// =============================================================================

/**
 * Get all memory items for a user, optionally filtered by type
 */
export async function getUserMemory(
  userId: string,
  types?: MemoryItemType[]
): Promise<MemoryItem[]> {
  const supabase = await createClient()

  let query = supabase
    .from('memory_items')
    .select('*')
    .eq('user_id', userId)
    .is('valid_until', null) // Only get currently valid memories
    .order('importance', { ascending: false })
    .order('created_at', { ascending: false })

  if (types && types.length > 0) {
    query = query.in('memory_type', types)
  }

  const { data, error } = await query

  if (error) {
    console.error('[MemoryManager] Error fetching user memory:', error)
    return []
  }

  return (data || []).map(mapDbToMemoryItem)
}

/**
 * Get memories for a specific source (e.g., all memories from A1)
 */
export async function getMemoryBySource(
  userId: string,
  sourceType: MemorySourceType
): Promise<MemoryItem[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('memory_items')
    .select('*')
    .eq('user_id', userId)
    .eq('source_type', sourceType)
    .is('valid_until', null)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('[MemoryManager] Error fetching source memory:', error)
    return []
  }

  return (data || []).map(mapDbToMemoryItem)
}

/**
 * Get contextual memories relevant to a specific command
 */
export async function getContextualMemories(
  userId: string,
  command: CommandId
): Promise<MemoryItem[]> {
  // Determine which memory types are relevant for this command
  const relevantTypes = getRelevantMemoryTypes(command)
  
  if (relevantTypes.length === 0) {
    // Get all memories if no specific types defined
    return getUserMemory(userId)
  }

  return getUserMemory(userId, relevantTypes)
}

/**
 * Capture a new memory item
 */
export async function captureMemory(
  payload: CaptureMemoryPayload
): Promise<MemoryItem | null> {
  const supabase = await createClient()

  const memoryData = {
    user_id: payload.userId,
    source_type: payload.sourceType,
    source_id: payload.sourceId || null,
    memory_type: payload.memoryType,
    title: payload.title || null,
    content: payload.content,
    confidence: payload.confidence ?? 0.8,
    importance: payload.importance ?? 0.5,
    metadata: payload.metadata || {},
    valid_from: new Date().toISOString(),
    valid_until: null,
  }

  const { data, error } = await supabase
    .from('memory_items')
    .insert(memoryData)
    .select()
    .single()

  if (error) {
    console.error('[MemoryManager] Error capturing memory:', error)
    return null
  }

  return mapDbToMemoryItem(data)
}

/**
 * Capture multiple memories at once
 */
export async function captureMemories(
  payloads: CaptureMemoryPayload[]
): Promise<MemoryItem[]> {
  const results = await Promise.all(payloads.map(captureMemory))
  return results.filter((m): m is MemoryItem => m !== null)
}

/**
 * Update an existing memory item
 */
export async function updateMemory(
  memoryId: string,
  updates: Partial<Pick<MemoryItem, 'content' | 'confidence' | 'importance' | 'title'>>
): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('memory_items')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', memoryId)

  if (error) {
    console.error('[MemoryManager] Error updating memory:', error)
    return false
  }

  return true
}

/**
 * Invalidate a memory (soft delete by setting valid_until)
 */
export async function invalidateMemory(memoryId: string): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('memory_items')
    .update({
      valid_until: new Date().toISOString(),
    })
    .eq('id', memoryId)

  if (error) {
    console.error('[MemoryManager] Error invalidating memory:', error)
    return false
  }

  return true
}

/**
 * Invalidate all memories of a specific type for a user
 * (useful when updating career goals, etc.)
 */
export async function invalidateMemoriesByType(
  userId: string,
  memoryType: MemoryItemType
): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('memory_items')
    .update({
      valid_until: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('memory_type', memoryType)
    .is('valid_until', null)

  if (error) {
    console.error('[MemoryManager] Error invalidating memories by type:', error)
    return false
  }

  return true
}

// =============================================================================
// MEMORY EXTRACTION
// =============================================================================

/**
 * Extract and save memories from C1 profile responses
 */
export async function extractC1Memories(
  userId: string,
  responses: Record<string, string>
): Promise<MemoryItem[]> {
  const memories: CaptureMemoryPayload[] = []

  // Career goal
  if (responses.objetivo || responses.career_goal) {
    memories.push({
      userId,
      sourceType: 'c1',
      memoryType: 'career_goal',
      title: 'Objetivo profesional',
      content: responses.objetivo || responses.career_goal,
      importance: 1.0,
      confidence: 0.9,
    })
  }

  // Motivation
  if (responses.motivacion || responses.why_here) {
    memories.push({
      userId,
      sourceType: 'c1',
      memoryType: 'motivation',
      title: 'Motivación principal',
      content: responses.motivacion || responses.why_here,
      importance: 0.8,
      confidence: 0.9,
    })
  }

  // Constraints (time, availability)
  if (responses.disponibilidad || responses.time_available) {
    memories.push({
      userId,
      sourceType: 'c1',
      memoryType: 'constraint',
      title: 'Disponibilidad de tiempo',
      content: responses.disponibilidad || responses.time_available,
      importance: 0.6,
      confidence: 0.9,
    })
  }

  // Learning preference
  if (responses.estilo_aprendizaje || responses.learning_style) {
    memories.push({
      userId,
      sourceType: 'c1',
      memoryType: 'learning_preference',
      title: 'Estilo de aprendizaje',
      content: responses.estilo_aprendizaje || responses.learning_style,
      importance: 0.5,
      confidence: 0.9,
    })
  }

  return captureMemories(memories)
}

/**
 * Extract and save memories from A1 identity audit
 */
export async function extractA1Memories(
  userId: string,
  auditResults: {
    strengths?: string[]
    weaknesses?: string[]
    communicationStyle?: string
    interviewPatterns?: string[]
    discProfile?: Record<string, number>
  }
): Promise<MemoryItem[]> {
  const memories: CaptureMemoryPayload[] = []

  // Strengths
  if (auditResults.strengths) {
    for (const strength of auditResults.strengths) {
      memories.push({
        userId,
        sourceType: 'a1',
        memoryType: 'strength',
        title: 'Fortaleza identificada',
        content: strength,
        importance: 0.8,
        confidence: 0.85,
      })
    }
  }

  // Weaknesses
  if (auditResults.weaknesses) {
    for (const weakness of auditResults.weaknesses) {
      memories.push({
        userId,
        sourceType: 'a1',
        memoryType: 'weakness',
        title: 'Área de mejora',
        content: weakness,
        importance: 0.9, // Higher importance for development focus
        confidence: 0.85,
      })
    }
  }

  // Communication style
  if (auditResults.communicationStyle) {
    memories.push({
      userId,
      sourceType: 'a1',
      memoryType: 'communication_style',
      title: 'Estilo de comunicación',
      content: auditResults.communicationStyle,
      importance: 0.7,
      confidence: 0.9,
    })
  }

  // Interview patterns
  if (auditResults.interviewPatterns) {
    for (const pattern of auditResults.interviewPatterns) {
      memories.push({
        userId,
        sourceType: 'a1',
        memoryType: 'interview_pattern',
        title: 'Patrón de entrevista',
        content: pattern,
        importance: 0.8,
        confidence: 0.8,
      })
    }
  }

  return captureMemories(memories)
}

/**
 * Extract and save memories from C2 career direction
 */
export async function extractC2Memories(
  userId: string,
  direction: {
    roleTarget?: string
    marketRegion?: string
    companyPreferences?: string[]
    gaps?: string[]
    priorities?: string[]
  }
): Promise<MemoryItem[]> {
  const memories: CaptureMemoryPayload[] = []

  // Role target
  if (direction.roleTarget) {
    // First invalidate any existing role_target
    await invalidateMemoriesByType(userId, 'role_target')
    
    memories.push({
      userId,
      sourceType: 'c2',
      memoryType: 'role_target',
      title: 'Rol objetivo',
      content: direction.roleTarget,
      importance: 1.0,
      confidence: 0.95,
    })
  }

  // Market region
  if (direction.marketRegion) {
    memories.push({
      userId,
      sourceType: 'c2',
      memoryType: 'market_region',
      title: 'Mercado objetivo',
      content: direction.marketRegion,
      importance: 0.7,
      confidence: 0.9,
    })
  }

  // Company preferences
  if (direction.companyPreferences) {
    for (const pref of direction.companyPreferences) {
      memories.push({
        userId,
        sourceType: 'c2',
        memoryType: 'company_preference',
        title: 'Preferencia de empresa',
        content: pref,
        importance: 0.6,
        confidence: 0.9,
      })
    }
  }

  // Identified gaps (stored as weaknesses from C2 perspective)
  if (direction.gaps) {
    for (const gap of direction.gaps) {
      memories.push({
        userId,
        sourceType: 'c2',
        memoryType: 'weakness',
        title: 'Brecha identificada',
        content: gap,
        importance: 0.85,
        confidence: 0.8,
      })
    }
  }

  return captureMemories(memories)
}

/**
 * Extract and save memories from A3 interview feedback
 */
export async function extractA3Memories(
  userId: string,
  moduleId: string,
  feedback: {
    patterns?: string[]
    strengths?: string[]
    improvements?: string[]
  }
): Promise<MemoryItem[]> {
  const memories: CaptureMemoryPayload[] = []

  // Interview patterns observed
  if (feedback.patterns) {
    for (const pattern of feedback.patterns) {
      memories.push({
        userId,
        sourceType: 'a3',
        sourceId: moduleId,
        memoryType: 'interview_pattern',
        title: `Patrón en ${moduleId}`,
        content: pattern,
        importance: 0.75,
        confidence: 0.85,
      })
    }
  }

  // Strengths demonstrated
  if (feedback.strengths) {
    for (const strength of feedback.strengths) {
      memories.push({
        userId,
        sourceType: 'a3',
        sourceId: moduleId,
        memoryType: 'strength',
        title: `Fortaleza demostrada`,
        content: strength,
        importance: 0.7,
        confidence: 0.85,
      })
    }
  }

  // Feedback received (areas for improvement)
  if (feedback.improvements) {
    for (const improvement of feedback.improvements) {
      memories.push({
        userId,
        sourceType: 'a3',
        sourceId: moduleId,
        memoryType: 'feedback_received',
        title: `Feedback módulo ${moduleId}`,
        content: improvement,
        importance: 0.8,
        confidence: 0.9,
      })
    }
  }

  return captureMemories(memories)
}

/**
 * Extract and save memories from A4 documents
 */
export async function extractA4Memories(
  userId: string,
  documentId: string,
  documentType: string,
  insights: {
    achievements?: string[]
    starStories?: string[]
    evidence?: string[]
  }
): Promise<MemoryItem[]> {
  const memories: CaptureMemoryPayload[] = []

  // Achievements
  if (insights.achievements) {
    for (const achievement of insights.achievements) {
      memories.push({
        userId,
        sourceType: 'a4',
        sourceId: documentId,
        memoryType: 'achievement',
        title: 'Logro documentado',
        content: achievement,
        importance: 0.85,
        confidence: 0.9,
        metadata: { documentType },
      })
    }
  }

  // STAR stories
  if (insights.starStories) {
    for (const story of insights.starStories) {
      memories.push({
        userId,
        sourceType: 'a4',
        sourceId: documentId,
        memoryType: 'star_story',
        title: 'Historia STAR',
        content: story,
        importance: 0.9,
        confidence: 0.9,
        metadata: { documentType },
      })
    }
  }

  // Evidence items
  if (insights.evidence) {
    for (const item of insights.evidence) {
      memories.push({
        userId,
        sourceType: 'a4',
        sourceId: documentId,
        memoryType: 'evidence',
        title: 'Evidencia',
        content: item,
        importance: 0.8,
        confidence: 0.85,
        metadata: { documentType },
      })
    }
  }

  return captureMemories(memories)
}

// =============================================================================
// MEMORY FORMATTING
// =============================================================================

/**
 * Format memories for AI context injection
 */
export function formatMemoriesForContext(memories: MemoryItem[]): string {
  if (memories.length === 0) {
    return 'No hay memorias previas del usuario.'
  }

  const grouped = groupMemoriesByType(memories)
  const sections: string[] = []

  // Career goal first (most important)
  if (grouped.career_goal?.length) {
    sections.push(`OBJETIVO PROFESIONAL:\n${grouped.career_goal.map(m => `- ${m.content}`).join('\n')}`)
  }

  // Role target
  if (grouped.role_target?.length) {
    sections.push(`ROL OBJETIVO:\n${grouped.role_target.map(m => `- ${m.content}`).join('\n')}`)
  }

  // Strengths
  if (grouped.strength?.length) {
    sections.push(`FORTALEZAS:\n${grouped.strength.map(m => `- ${m.content}`).join('\n')}`)
  }

  // Weaknesses
  if (grouped.weakness?.length) {
    sections.push(`ÁREAS DE MEJORA:\n${grouped.weakness.map(m => `- ${m.content}`).join('\n')}`)
  }

  // Interview patterns
  if (grouped.interview_pattern?.length) {
    sections.push(`PATRONES EN ENTREVISTAS:\n${grouped.interview_pattern.map(m => `- ${m.content}`).join('\n')}`)
  }

  // Achievements
  if (grouped.achievement?.length) {
    sections.push(`LOGROS DOCUMENTADOS:\n${grouped.achievement.map(m => `- ${m.content}`).join('\n')}`)
  }

  // STAR stories
  if (grouped.star_story?.length) {
    sections.push(`HISTORIAS STAR:\n${grouped.star_story.map(m => `- ${m.content}`).join('\n')}`)
  }

  return sections.join('\n\n')
}

/**
 * Group memories by type
 */
export function groupMemoriesByType(
  memories: MemoryItem[]
): Record<string, MemoryItem[]> {
  return memories.reduce((acc, memory) => {
    const type = memory.memoryType
    if (!acc[type]) acc[type] = []
    acc[type].push(memory)
    return acc
  }, {} as Record<string, MemoryItem[]>)
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Map database row to MemoryItem type
 */
function mapDbToMemoryItem(row: Record<string, unknown>): MemoryItem {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    sourceType: row.source_type as MemorySourceType,
    sourceId: row.source_id as string | undefined,
    memoryType: row.memory_type as MemoryItemType,
    title: row.title as string | undefined,
    content: row.content as string,
    confidence: row.confidence as number,
    importance: row.importance as number,
    validFrom: new Date(row.valid_from as string),
    validUntil: row.valid_until ? new Date(row.valid_until as string) : null,
    metadata: row.metadata as Record<string, unknown> | undefined,
    createdAt: new Date(row.created_at as string),
  }
}

/**
 * Get relevant memory types for a command
 */
function getRelevantMemoryTypes(command: CommandId): MemoryItemType[] {
  const commandMemoryMap: Record<string, MemoryItemType[]> = {
    '/dtc:c2-context-bridge': ['career_goal', 'motivation', 'strength', 'weakness', 'constraint'],
    '/dtc:a2-generate-day': ['career_goal', 'role_target', 'weakness', 'feedback_received', 'evidence'],
    '/dtc:a3-run-interview': ['career_goal', 'role_target', 'strength', 'weakness', 'interview_pattern', 'star_story', 'achievement'],
    '/dtc:a3-evaluate-answer': ['career_goal', 'strength', 'weakness', 'interview_pattern'],
    '/dtc:a4-create-document': ['career_goal', 'role_target', 'achievement', 'star_story', 'evidence'],
    '/dtc:a4-review-document': ['career_goal', 'role_target', 'achievement', 'star_story'],
  }

  return commandMemoryMap[command] || []
}

/**
 * Get memory statistics for a user
 */
export async function getMemoryStats(userId: string): Promise<{
  total: number
  byType: Record<string, number>
  bySource: Record<string, number>
  avgConfidence: number
}> {
  const memories = await getUserMemory(userId)
  
  const byType: Record<string, number> = {}
  const bySource: Record<string, number> = {}
  let totalConfidence = 0

  for (const memory of memories) {
    byType[memory.memoryType] = (byType[memory.memoryType] || 0) + 1
    bySource[memory.sourceType] = (bySource[memory.sourceType] || 0) + 1
    totalConfidence += memory.confidence
  }

  return {
    total: memories.length,
    byType,
    bySource,
    avgConfidence: memories.length > 0 ? totalConfidence / memories.length : 0,
  }
}
