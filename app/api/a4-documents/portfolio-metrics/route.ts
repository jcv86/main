import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { buildPortfolioMetrics } from '@/lib/dtc-agentos/a4-document-intelligence'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user's documents
    const { data: documents, error: docError } = await supabase
      .from('dtc_documents')
      .select('*')
      .eq('user_id', user.id)

    if (docError) {
      console.error('[v0] Error fetching documents:', docError)
      return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
    }

    // Fetch evidence links
    const { data: links, error: linkError } = await supabase
      .from('evidence_links')
      .select('*')
      .eq('user_id', user.id)

    if (linkError) {
      console.error('[v0] Error fetching links:', linkError)
      return NextResponse.json({ error: 'Failed to fetch links' }, { status: 500 })
    }

    // Build portfolio metrics
    const metrics = await buildPortfolioMetrics(user.id, documents || [], links || [])

    return NextResponse.json({
      success: true,
      metrics: {
        totalDocuments: metrics.totalDocuments,
        linkedDocuments: metrics.linkedDocuments,
        averageStrength: metrics.averageStrength,
        modulesCovered: metrics.modulesCovered,
        goalEvidence: metrics.goalEvidence,
        weeknessEvidence: metrics.weeknessEvidence,
        recommendedDocuments: metrics.recommendedDocuments,
        completeness: Math.round((metrics.linkedDocuments / Math.max(metrics.totalDocuments, 1)) * 100),
      },
    })
  } catch (error) {
    console.error('[v0] Error building portfolio metrics:', error)
    return NextResponse.json({ error: 'Failed to build metrics' }, { status: 500 })
  }
}
