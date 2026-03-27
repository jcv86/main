'use server'

import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
)

export async function GET(request: Request) {
  try {
    // Get today's radar tesis
    const { data: tesisDia, error: tesisDiaError } = await supabase
      .from('despega_radar_tesis_dia')
      .select('*')
      .eq('fecha', new Date().toISOString().split('T')[0])
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (tesisDiaError && tesisDiaError.code !== 'PGRST116') {
      console.error('[v0] Error fetching tesis:', tesisDiaError)
    }

    // Get all radar noticias for today
    const { data: noticias, error: noticiasError } = await supabase
      .from('despega_radar_noticias')
      .select('*')
      .eq('tesis_dia_id', tesisDia?.id || '')
      .order('fecha_publicacion', { ascending: false })

    if (noticiasError) {
      console.error('[v0] Error fetching noticias:', noticiasError)
    }

    return NextResponse.json({
      tesisDia: tesisDia || null,
      noticias: noticias || [],
    })
  } catch (error) {
    console.error('[v0] API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch radar data' },
      { status: 500 }
    )
  }
}
