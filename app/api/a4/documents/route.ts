import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createClient as createServiceClient } from '@supabase/supabase-js'
import { getDemoUserFromRequest, isDemoUser } from '@/lib/auth/demo-user'
import type { DocumentType, DocumentStatus } from '@/lib/a4/types'

// GET /api/a4/documents - List user documents
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Check for demo user first
    const demoUser = getDemoUserFromRequest(request)
    if (demoUser) {
      console.log('[v0] API documents - Demo user:', demoUser.email)
      // Return empty array for demo users (they don't have real documents)
      return NextResponse.json({
        documents: [],
        stats: {
          total: 0,
          completed: 0,
          pending: 0,
          archived: 0
        }
      })
    }
    
    // Get authenticated user
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    let userId = user.id

    const type = searchParams.get('type') as DocumentType | null
    const status = searchParams.get('status') as DocumentStatus | null
    const source = searchParams.get('source')
    const phase = searchParams.get('phase')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = serviceSupabase
      .from('a4_documents_extended')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (type) query = query.eq('type', type)
    if (status) query = query.eq('status', status)
    if (source) query = query.eq('source', source)
    if (phase) query = query.eq('source_module', phase)

    const { data: documents, error } = await query

    if (error) {
      console.error('[A4 Documents API] Error fetching documents:', error)
      return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
    }

    // Get document stats
    const { data: stats } = await serviceSupabase
      .from('a4_documents_extended')
      .select('type, status, source')
      .eq('user_id', userId)

    const documentStats = {
      total: stats?.length || 0,
      byType: {} as Record<string, number>,
      byStatus: {} as Record<string, number>,
      bySource: {} as Record<string, number>
    }

    stats?.forEach(doc => {
      documentStats.byType[doc.type] = (documentStats.byType[doc.type] || 0) + 1
      documentStats.byStatus[doc.status] = (documentStats.byStatus[doc.status] || 0) + 1
      documentStats.bySource[doc.source] = (documentStats.bySource[doc.source] || 0) + 1
    })

    return NextResponse.json({
      documents,
      stats: documentStats,
      pagination: {
        limit,
        offset,
        hasMore: documents?.length === limit
      }
    })
  } catch (error) {
    console.error('[A4 Documents API] Unexpected error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/a4/documents - Create new document
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { 
      type,  // Changed from documentType
      title, 
      content = '',
      source = 'user',  // 'user', 'agent', 'jtest', 'system'
      sourceAgentId,
      sourceJTestId,
      sourceModule = 'a4',  // Changed from sourcePhase
      metadata = {}
    } = body

    if (!type) {
      return NextResponse.json({ error: 'type is required' }, { status: 400 })
    }

    // Create the document using extended table
    const { data: document, error } = await supabase
      .from('a4_documents_extended')
      .insert({
        user_id: user.id,
        type,
        title: title || `New ${type}`,
        content,
        source,
        source_agent_id: sourceAgentId,
        source_jtest_id: sourceJTestId,
        source_module: sourceModule,
        status: 'draft',
        version: 1,
        metadata: {
          ...metadata,
          createdAt: new Date().toISOString(),
          createdVia: source
        }
      })
      .select()
      .single()

    if (error) {
      console.error('[A4 Documents API] Error creating document:', error)
      return NextResponse.json({ error: 'Failed to create document' }, { status: 500 })
    }

    // Track signal (non-blocking)
    void supabase.from('a4_profile_signals').insert({
      user_id: user.id,
      signal_type: 'document_created',
      source_phase: sourceModule,
      signal_data: { documentType: type, documentId: document.id, source },
      weight: 1.0
    })

    return NextResponse.json({
      document,
      message: 'Document created successfully'
    }, { status: 201 })
  } catch (error) {
    console.error('[A4 Documents API] Error creating document:', error)
    return NextResponse.json({ error: 'Failed to create document' }, { status: 500 })
  }
}

// PATCH /api/a4/documents - Update document
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { documentId, content, title, status, createVersion = true } = body

    if (!documentId) {
      return NextResponse.json({ error: 'documentId is required' }, { status: 400 })
    }

    // Verify ownership
    const { data: existingDoc } = await supabase
      .from('a4_documents_extended')
      .select('id, user_id, content, version')
      .eq('id', documentId)
      .single()

    if (!existingDoc || existingDoc.user_id !== user.id) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Create version before updating if content changed
    if (createVersion && content && content !== existingDoc.content) {
      const newVersion = (existingDoc.version || 0) + 1
      void supabase.from('a4_document_versions').insert({
        document_id: documentId,
        version_number: newVersion,
        content: existingDoc.content,
        change_summary: 'Auto-saved before edit'
      })
    }

    // Update document
    const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
    if (content !== undefined) updates.content = content
    if (title !== undefined) updates.title = title
    if (status !== undefined) updates.status = status

    const { data: updatedDoc, error } = await supabase
      .from('a4_documents_extended')
      .update(updates)
      .eq('id', documentId)
      .select()
      .single()

    if (error) {
      return NextResponse.json({ error: 'Failed to update document' }, { status: 500 })
    }

    return NextResponse.json({
      document: updatedDoc,
      message: 'Document updated successfully'
    })
  } catch (error) {
    console.error('[A4 Documents API] Error updating document:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE /api/a4/documents - Delete document
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const documentId = searchParams.get('id')

    if (!documentId) {
      return NextResponse.json({ error: 'Document ID is required' }, { status: 400 })
    }

    // Verify ownership
    const { data: existingDoc } = await supabase
      .from('a4_documents_extended')
      .select('id, user_id')
      .eq('id', documentId)
      .single()

    if (!existingDoc || existingDoc.user_id !== user.id) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Delete document (cascade will handle versions, labels, etc.)
    const { error } = await supabase
      .from('a4_documents_extended')
      .delete()
      .eq('id', documentId)

    if (error) {
      return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Document deleted successfully' })
  } catch (error) {
    console.error('[A4 Documents API] Error deleting document:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
