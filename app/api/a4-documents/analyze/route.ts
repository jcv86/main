import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { extractDocumentInsights, linkDocumentToEvidence } from '@/lib/dtc-agentos/a4-document-intelligence'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { documentId, content } = await request.json() as {
      documentId: string
      content: string
    }

    if (!documentId || !content) {
      return NextResponse.json({ error: 'Document ID and content required' }, { status: 400 })
    }

    // Extract insights from document
    const result = await extractDocumentInsights(user.id, documentId, content)

    if (!result.success) {
      console.error('[v0] Failed to extract insights:', result.error)
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    // Store insights in database
    const insightsToStore = result.insights.map((insight) => ({
      user_id: user.id,
      document_id: documentId,
      insight_type: insight.insightType,
      content: insight.content,
      confidence: insight.confidence,
      linked_modules: insight.linkedModules,
      created_at: new Date().toISOString(),
    }))

    if (insightsToStore.length > 0) {
      const { error: insertError } = await supabase
        .from('document_insights')
        .insert(insightsToStore)

      if (insertError) {
        console.warn('[v0] Warning: Could not store insights:', insertError)
        // Don't fail - insights are still valid
      }
    }

    return NextResponse.json({
      success: true,
      documentId,
      insightCount: result.insights.length,
      insights: result.insights.map((i) => ({
        type: i.insightType,
        content: i.content,
        confidence: i.confidence,
        modules: i.linkedModules,
      })),
    })
  } catch (error) {
    console.error('[v0] Error analyzing document:', error)
    return NextResponse.json({ error: 'Failed to analyze document' }, { status: 500 })
  }
}
