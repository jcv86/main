import { createClient } from '@/lib/supabase/client'

// Types for Days 7-8
export interface CareerMirror {
  id: string
  user_id: string
  day_number: number
  a2_data_snapshot?: Record<string, any>
  mirror_card_title?: string
  mirror_card_content?: Record<string, any>
  coach_feedback?: string
  coach_tags?: string[]
  is_validated: boolean
  validation_score?: number
  status: string
  created_at: string
  updated_at: string
}

export interface WorkMemory {
  id: string
  user_id: string
  day_number: number
  memory_id: number
  memory_text: string
  memory_where: string
  memory_why_remember: string
  coach_tags?: string[]
  is_selected: boolean
  creation_timestamp: string
  source_from_day_2: boolean
  status: string
  created_at: string
  updated_at: string
}

// DAY 7: Career Mirrors
export async function createCareerMirror(
  userId: string,
  data: Omit<CareerMirror, 'id' | 'user_id' | 'created_at' | 'updated_at'>
) {
  const supabase = createClient()
  return supabase
    .from('a2_career_mirrors')
    .insert([{ ...data, user_id: userId }])
    .select()
    .single()
}

export async function getCareerMirror(userId: string, dayNumber: number = 7) {
  const supabase = createClient()
  return supabase
    .from('a2_career_mirrors')
    .select('*')
    .eq('user_id', userId)
    .eq('day_number', dayNumber)
    .maybeSingle()
}

export async function updateCareerMirror(
  mirrorId: string,
  userId: string,
  data: Partial<Omit<CareerMirror, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
) {
  const supabase = createClient()
  return supabase
    .from('a2_career_mirrors')
    .update(data)
    .eq('id', mirrorId)
    .eq('user_id', userId)
    .select()
    .single()
}

export async function deleteCareerMirror(mirrorId: string, userId: string) {
  const supabase = createClient()
  return supabase
    .from('a2_career_mirrors')
    .delete()
    .eq('id', mirrorId)
    .eq('user_id', userId)
}

// DAY 8: Work Memories
export async function createWorkMemory(
  userId: string,
  data: Omit<WorkMemory, 'id' | 'user_id' | 'created_at' | 'updated_at'>
) {
  const supabase = createClient()
  return supabase
    .from('a2_work_memories')
    .insert([{ ...data, user_id: userId }])
    .select()
    .single()
}

export async function getWorkMemories(userId: string, dayNumber: number = 8) {
  const supabase = createClient()
  return supabase
    .from('a2_work_memories')
    .select('*')
    .eq('user_id', userId)
    .eq('day_number', dayNumber)
    .order('creation_timestamp', { ascending: false })
}

export async function updateWorkMemory(
  memoryId: string,
  userId: string,
  data: Partial<Omit<WorkMemory, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
) {
  const supabase = createClient()
  return supabase
    .from('a2_work_memories')
    .update(data)
    .eq('id', memoryId)
    .eq('user_id', userId)
    .select()
    .single()
}

export async function deleteWorkMemory(memoryId: string, userId: string) {
  const supabase = createClient()
  return supabase
    .from('a2_work_memories')
    .delete()
    .eq('id', memoryId)
    .eq('user_id', userId)
}

export async function bulkUpdateWorkMemories(
  userId: string,
  memories: Array<{ id: string; data: Partial<WorkMemory> }>
) {
  const supabase = createClient()
  const updates = memories.map(({ id, data }) => ({
    id,
    user_id: userId,
    ...data,
  }))

  return supabase
    .from('a2_work_memories')
    .upsert(updates)
    .select()
}
