'use client'

import { createClient } from '@/lib/supabase/client'
import type { PostgrestError } from '@supabase/supabase-js'

export interface MarketSignal {
  id: string
  user_id: string
  day_number: number
  job_title: string
  company_name: string
  job_url?: string
  requirements: string[]
  fears_skills: string[]
  strengths_needed: string[]
  salary_range?: string
  location?: string
  industry?: string
  created_at: string
}

export interface ExtractedSignal {
  id: string
  user_id: string
  day_number: number
  signal_type: 'skill' | 'tool' | 'soft_skill' | 'framework'
  signal_text: string
  frequency: number
  importance: number
  related_jobs_count: number
  category?: string
  created_at: string
}

export interface CandidateBoard {
  id: string
  user_id: string
  day_number: number
  column_1_quien_soy: string
  column_2_que_quiere: string
  column_3_que_prueba: string
  column_4_que_falta: string
  candidate_hypothesis: string
  candidate_archetype?: string
  status: 'in_progress' | 'completed'
  created_at: string
  updated_at: string
}

// Market Signals CRUD
export async function createMarketSignal(
  userId: string,
  data: Omit<MarketSignal, 'id' | 'user_id' | 'created_at'>
): Promise<{ data: MarketSignal | null; error: PostgrestError | null }> {
  const supabase = createClient()

  const { data: result, error } = await supabase
    .from('a2_market_signals')
    .insert({
      user_id: userId,
      ...data,
    })
    .select()
    .single()

  return { data: result as MarketSignal | null, error }
}

export async function getMarketSignals(
  userId: string,
  dayNumber: number
): Promise<{ data: MarketSignal[] | null; error: PostgrestError | null }> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('a2_market_signals')
    .select('*')
    .eq('user_id', userId)
    .eq('day_number', dayNumber)
    .order('created_at', { ascending: false })

  return { data: data as MarketSignal[] | null, error }
}

export async function updateMarketSignal(
  signalId: string,
  userId: string,
  updates: Partial<MarketSignal>
): Promise<{ data: MarketSignal | null; error: PostgrestError | null }> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('a2_market_signals')
    .update(updates)
    .eq('id', signalId)
    .eq('user_id', userId)
    .select()
    .single()

  return { data: data as MarketSignal | null, error }
}

// Extracted Signals CRUD
export async function createExtractedSignal(
  userId: string,
  data: Omit<ExtractedSignal, 'id' | 'user_id' | 'created_at'>
): Promise<{ data: ExtractedSignal | null; error: PostgrestError | null }> {
  const supabase = createClient()

  const { data: result, error } = await supabase
    .from('a2_extracted_signals')
    .insert({
      user_id: userId,
      ...data,
    })
    .select()
    .single()

  return { data: result as ExtractedSignal | null, error }
}

export async function getExtractedSignals(
  userId: string,
  dayNumber: number
): Promise<{ data: ExtractedSignal[] | null; error: PostgrestError | null }> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('a2_extracted_signals')
    .select('*')
    .eq('user_id', userId)
    .eq('day_number', dayNumber)
    .order('frequency', { ascending: false })

  return { data: data as ExtractedSignal[] | null, error }
}

// Candidate Board CRUD
export async function createCandidateBoard(
  userId: string,
  data: Omit<CandidateBoard, 'id' | 'user_id' | 'created_at' | 'updated_at'>
): Promise<{ data: CandidateBoard | null; error: PostgrestError | null }> {
  const supabase = createClient()

  const { data: result, error } = await supabase
    .from('a2_candidate_boards')
    .insert({
      user_id: userId,
      ...data,
    })
    .select()
    .single()

  return { data: result as CandidateBoard | null, error }
}

export async function getCandidateBoard(
  userId: string,
  dayNumber: number
): Promise<{ data: CandidateBoard | null; error: PostgrestError | null }> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('a2_candidate_boards')
    .select('*')
    .eq('user_id', userId)
    .eq('day_number', dayNumber)
    .single()

  return { data: data as CandidateBoard | null, error }
}

export async function updateCandidateBoard(
  boardId: string,
  userId: string,
  updates: Partial<CandidateBoard>
): Promise<{ data: CandidateBoard | null; error: PostgrestError | null }> {
  const supabase = createClient()

  const { data, error } = await supabase
    .from('a2_candidate_boards')
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    })
    .eq('id', boardId)
    .eq('user_id', userId)
    .select()
    .single()

  return { data: data as CandidateBoard | null, error }
}
