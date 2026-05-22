/**
 * A2 Progress Persistence
 * 
 * Autosaves form data to Supabase and localStorage
 * Allows recovery if browser closes or page reloads
 */

import { createClient } from '@/lib/supabase/client'

const AUTOSAVE_KEY_PREFIX = 'a2_day_draft_'

export interface DayDraftData {
  dayNumber: number
  stepNumber: number
  formData: Record<string, any>
  lastSaved: string
  resumable: boolean
}

/**
 * Save day progress to localStorage for immediate recovery
 */
export function saveToLocalStorage(dayNumber: number, stepNumber: number, formData: any): void {
  try {
    const key = `${AUTOSAVE_KEY_PREFIX}${dayNumber}`
    const draftData: DayDraftData = {
      dayNumber,
      stepNumber,
      formData,
      lastSaved: new Date().toISOString(),
      resumable: true,
    }
    localStorage.setItem(key, JSON.stringify(draftData))
    console.log(`[v0] Autosaved Day ${dayNumber} Step ${stepNumber} to localStorage`)
  } catch (error) {
    console.warn('[v0] Failed to save to localStorage:', error)
  }
}

/**
 * Load day progress from localStorage
 */
export function loadFromLocalStorage(dayNumber: number): DayDraftData | null {
  try {
    const key = `${AUTOSAVE_KEY_PREFIX}${dayNumber}`
    const data = localStorage.getItem(key)
    if (data) {
      return JSON.parse(data)
    }
    return null
  } catch (error) {
    console.warn('[v0] Failed to load from localStorage:', error)
    return null
  }
}

/**
 * Clear localStorage draft for a day
 */
export function clearLocalStorageDraft(dayNumber: number): void {
  try {
    const key = `${AUTOSAVE_KEY_PREFIX}${dayNumber}`
    localStorage.removeItem(key)
    console.log(`[v0] Cleared draft for Day ${dayNumber}`)
  } catch (error) {
    console.warn('[v0] Failed to clear localStorage:', error)
  }
}

/**
 * Save day progress to Supabase for server-side recovery
 */
export async function saveDayProgressToSupabase(
  userId: string,
  dayNumber: number,
  stepNumber: number,
  formData: any,
): Promise<boolean> {
  try {
    const supabase = createClient()

    // Use dtc_documents table to store drafts
    const { error } = await supabase.from('dtc_documents').upsert(
      {
        user_id: userId,
        day_number: dayNumber,
        doc_type: `day_${dayNumber}_draft`,
        document_title: `Día ${dayNumber} - Draft (Step ${stepNumber})`,
        document_content: JSON.stringify({
          step: stepNumber,
          data: formData,
          savedAt: new Date().toISOString(),
        }),
        status: 'draft',
        last_updated: new Date().toISOString(),
      },
      {
        onConflict: 'user_id,day_number,doc_type',
      }
    )

    if (error) {
      console.warn('[v0] Failed to save to Supabase:', error)
      return false
    }

    console.log(`[v0] Autosaved Day ${dayNumber} Step ${stepNumber} to Supabase`)
    return true
  } catch (error) {
    console.warn('[v0] Exception in saveDayProgressToSupabase:', error)
    return false
  }
}

/**
 * Load day progress from Supabase
 */
export async function loadDayProgressFromSupabase(
  userId: string,
  dayNumber: number,
): Promise<DayDraftData | null> {
  try {
    const supabase = createClient()

    const { data, error } = await supabase
      .from('dtc_documents')
      .select('document_content, last_updated')
      .eq('user_id', userId)
      .eq('day_number', dayNumber)
      .eq('doc_type', `day_${dayNumber}_draft`)
      .order('last_updated', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      if (error.code !== 'PGRST116') {
        // PGRST116 = no rows, expected
        console.warn('[v0] Error loading from Supabase:', error)
      }
      return null
    }

    if (data?.document_content) {
      const parsed = JSON.parse(data.document_content)
      return {
        dayNumber,
        stepNumber: parsed.step,
        formData: parsed.data,
        lastSaved: data.last_updated,
        resumable: true,
      }
    }

    return null
  } catch (error) {
    console.warn('[v0] Exception in loadDayProgressFromSupabase:', error)
    return null
  }
}

/**
 * Autosave with fallback: localStorage first, then Supabase
 */
export async function autosaveDayProgress(
  userId: string,
  dayNumber: number,
  stepNumber: number,
  formData: any,
): Promise<void> {
  // Always save to localStorage for immediate recovery
  saveToLocalStorage(dayNumber, stepNumber, formData)

  // Also save to Supabase async (don't wait)
  saveDayProgressToSupabase(userId, dayNumber, stepNumber, formData).catch(err => {
    console.warn('[v0] Background Supabase save failed:', err)
  })
}

/**
 * Load draft with fallback: localStorage first, then Supabase
 */
export async function loadDayProgressWithFallback(
  userId: string,
  dayNumber: number,
): Promise<DayDraftData | null> {
  // Try localStorage first (fastest)
  const localDraft = loadFromLocalStorage(dayNumber)
  if (localDraft) {
    console.log(`[v0] Loaded Day ${dayNumber} from localStorage, step ${localDraft.stepNumber}`)
    return localDraft
  }

  // Fallback to Supabase if localStorage is empty
  const supaDraft = await loadDayProgressFromSupabase(userId, dayNumber)
  if (supaDraft) {
    console.log(`[v0] Loaded Day ${dayNumber} from Supabase, step ${supaDraft.stepNumber}`)
    // Restore to localStorage for next load
    saveToLocalStorage(dayNumber, supaDraft.stepNumber, supaDraft.formData)
    return supaDraft
  }

  console.log(`[v0] No draft found for Day ${dayNumber}`)
  return null
}

/**
 * Clear all drafts for a day after successful completion
 */
export function clearAllDrafts(dayNumber: number): void {
  clearLocalStorageDraft(dayNumber)
  // Supabase cleanup happens automatically when day is marked complete
}
