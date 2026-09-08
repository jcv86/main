import { NextResponse } from 'next/server'

import { createClient } from '@/lib/supabase/server'

const SELECT_FIELDS =
  'language,theme,notifications_enabled,email_notifications,timezone,weekly_insights_email,goal_reminders,achievement_notifications'

const defaults = {
  language: 'es',
  theme: 'dark',
  notifications_enabled: true,
  email_notifications: true,
  timezone: 'America/Santiago',
  weekly_insights_email: true,
  goal_reminders: true,
  achievement_notifications: true,
}

type Preferences = typeof defaults

const allowedLanguages = new Set(['es', 'en'])
const allowedThemes = new Set(['dark', 'light'])
const allowedTimezones = new Set([
  'America/Santiago',
  'America/New_York',
  'Europe/London',
  'Europe/Madrid',
  'Asia/Tokyo',
  'Australia/Sydney',
])
const booleanFields: Array<keyof Preferences> = [
  'notifications_enabled',
  'email_notifications',
  'weekly_insights_email',
  'goal_reminders',
  'achievement_notifications',
]

function parsePreferences(value: unknown): Partial<Preferences> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return null
  const input = value as Record<string, unknown>
  const parsed: Partial<Preferences> = {}

  if (input.language !== undefined) {
    if (typeof input.language !== 'string' || !allowedLanguages.has(input.language)) return null
    parsed.language = input.language
  }
  if (input.theme !== undefined) {
    if (typeof input.theme !== 'string' || !allowedThemes.has(input.theme)) return null
    parsed.theme = input.theme
  }
  if (input.timezone !== undefined) {
    if (typeof input.timezone !== 'string' || !allowedTimezones.has(input.timezone)) return null
    parsed.timezone = input.timezone
  }
  for (const field of booleanFields) {
    if (input[field] !== undefined) {
      if (typeof input[field] !== 'boolean') return null
      parsed[field] = input[field] as never
    }
  }

  return parsed
}

async function authenticatedClient() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  return { supabase, user: error ? null : user }
}

export async function GET() {
  const { supabase, user } = await authenticatedClient()
  if (!user) return NextResponse.json({ error: 'Tu sesión expiró.' }, { status: 401 })

  const { data, error } = await supabase
    .from('user_preferences')
    .select(SELECT_FIELDS)
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('No se pudieron cargar las preferencias:', error.code)
    return NextResponse.json({ error: 'No pudimos cargar tus preferencias.' }, { status: 500 })
  }

  return NextResponse.json({ ...defaults, ...(data ?? {}) }, { headers: { 'Cache-Control': 'private, no-store' } })
}

export async function POST(request: Request) {
  const { supabase, user } = await authenticatedClient()
  if (!user) return NextResponse.json({ error: 'Tu sesión expiró.' }, { status: 401 })

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Las preferencias enviadas no son válidas.' }, { status: 400 })
  }

  const preferences = parsePreferences(body)
  if (!preferences || Object.keys(preferences).length === 0) {
    return NextResponse.json({ error: 'Las preferencias enviadas no son válidas.' }, { status: 400 })
  }

  const { data: existing, error: readError } = await supabase
    .from('user_preferences')
    .select('id')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (readError) {
    console.error('No se pudieron verificar las preferencias:', readError.code)
    return NextResponse.json({ error: 'No pudimos guardar tus preferencias.' }, { status: 500 })
  }

  const payload = { ...preferences, updated_at: new Date().toISOString() }
  const result = existing
    ? await supabase.from('user_preferences').update(payload).eq('id', existing.id).eq('user_id', user.id).select(SELECT_FIELDS).single()
    : await supabase.from('user_preferences').insert({ ...defaults, ...preferences, user_id: user.id, updated_at: new Date().toISOString() }).select(SELECT_FIELDS).single()

  if (result.error) {
    console.error('No se pudieron guardar las preferencias:', result.error.code)
    return NextResponse.json({ error: 'No pudimos guardar tus preferencias.' }, { status: 500 })
  }

  return NextResponse.json(result.data, { headers: { 'Cache-Control': 'private, no-store' } })
}
