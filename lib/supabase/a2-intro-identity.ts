'use client'

import { createClient } from '@/lib/supabase/client'

export type TestIntroduction = {
  id: string
  user_id: string
  day_number: number
  version_a: string
  version_b: string
  test_type?: string
  test_feedback?: string
  version_c?: string
  status: string
  created_at: string
  updated_at: string
}

export type ProfessionalIdentity = {
  id: string
  user_id: string
  day_number: number
  candidate_archetype: string
  archetype_description: string
  version_simple: string
  version_recruiter: string
  version_interview: string
  stress_test_result?: string
  is_validated: boolean
  status: string
  created_at: string
  updated_at: string
}

// DAY 5: Test Introductions
export async function createTestIntroduction(
  userId: string,
  data: Omit<TestIntroduction, 'id' | 'user_id' | 'created_at' | 'updated_at'>
) {
  const supabase = createClient()
  return supabase
    .from('a2_test_introductions')
    .insert([{ ...data, user_id: userId }])
    .select()
    .single()
}

export async function getTestIntroduction(userId: string, dayNumber: number) {
  const supabase = createClient()
  return supabase
    .from('a2_test_introductions')
    .select('*')
    .eq('user_id', userId)
    .eq('day_number', dayNumber)
    .single()
}

export async function updateTestIntroduction(
  id: string,
  userId: string,
  data: Partial<Omit<TestIntroduction, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
) {
  const supabase = createClient()
  return supabase
    .from('a2_test_introductions')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()
}

// DAY 6: Professional Identities
export async function createProfessionalIdentity(
  userId: string,
  data: Omit<ProfessionalIdentity, 'id' | 'user_id' | 'created_at' | 'updated_at'>
) {
  const supabase = createClient()

  const { data: existing, error: existingError } = await supabase
    .from('a2_professional_identities')
    .select('id')
    .eq('user_id', userId)
    .eq('day_number', data.day_number)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (existingError) return { data: null, error: existingError }
  if (existing?.id) {
    return updateProfessionalIdentity(existing.id, userId, data)
  }

  return supabase
    .from('a2_professional_identities')
    .insert([{ ...data, user_id: userId }])
    .select()
    .single()
}

export async function getProfessionalIdentity(userId: string, dayNumber: number) {
  const supabase = createClient()
  return supabase
    .from('a2_professional_identities')
    .select('*')
    .eq('user_id', userId)
    .eq('day_number', dayNumber)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()
}

export async function updateProfessionalIdentity(
  id: string,
  userId: string,
  data: Partial<Omit<ProfessionalIdentity, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
) {
  const supabase = createClient()
  return supabase
    .from('a2_professional_identities')
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()
}
