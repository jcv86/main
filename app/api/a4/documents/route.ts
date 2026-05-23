/**
 * A4 Documents API Routes
 * 
 * Endpoints for document management, generation, and retrieval
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { DocumentType, DocumentStatus } from '@/lib/a4/types'

// GET /api/a4/documents - List user documents
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') as DocumentType | null
    const status = searchParams.get('status') as DocumentStatus | null
    const phase = searchParams.get('phase')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    let query = supabase
      .from('a4_documents')
      .select(`
        *,
        a4_document_versions(id, version_number, created_at),
        a4_document_feedback(id, rating, created_at)
      `)
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (type) query = query.eq('document_type', type)
    if (status) query = query.eq('status', status)
    if (phase) query = query.eq('source_phase', phase)

    const { data: documents, error } = await query

    if (error) {
      console.error('[A4 Documents API] Error fetching documents:', error)
      return NextResponse.json({ error: 'Failed to fetch documents' }, { status: 500 })
    }

    // Get document stats
    const { data: stats } = await supabase
      .from('a4_documents')
      .select('document_type, status')
      .eq('user_id', user.id)

    const documentStats = {
      total: stats?.length || 0,
      byType: {} as Record<string, number>,
      byStatus: {} as Record<string, number>
    }

    stats?.forEach(doc => {
      documentStats.byType[doc.document_type] = (documentStats.byType[doc.document_type] || 0) + 1
      documentStats.byStatus[doc.status] = (documentStats.byStatus[doc.status] || 0) + 1
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
      documentType, 
      title, 
      content = '',
      sourcePhase = 'a4',
      sourceStepId,
      metadata = {}
    } = body

    if (!documentType) {
      return NextResponse.json({ error: 'documentType is required' }, { status: 400 })
    }

    // Create the document
    const { data: document, error } = await supabase
      .from('a4_documents')
      .insert({
        user_id: user.id,
        document_type: documentType,
        title: title || `New ${documentType}`,
        content,
        source_phase: sourcePhase,
        source_step_id: sourceStepId,
        status: 'draft',
        metadata: {
          ...metadata,
          createdAt: new Date().toISOString()
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
      source_phase: sourcePhase,
      signal_data: { documentType, documentId: document.id },
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
      .from('a4_documents')
      .select('id, user_id, content, current_version')
      .eq('id', documentId)
      .single()

    if (!existingDoc || existingDoc.user_id !== user.id) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Create version before updating if content changed
    if (createVersion && content && content !== existingDoc.content) {
      const newVersion = (existingDoc.current_version || 0) + 1
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
      .from('a4_documents')
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
      .from('a4_documents')
      .select('id, user_id')
      .eq('id', documentId)
      .single()

    if (!existingDoc || existingDoc.user_id !== user.id) {
      return NextResponse.json({ error: 'Document not found' }, { status: 404 })
    }

    // Soft delete by setting status to archived
    const { error } = await supabase
      .from('a4_documents')
      .update({ status: 'archived', updated_at: new Date().toISOString() })
      .eq('id', documentId)

    if (error) {
      return NextResponse.json({ error: 'Failed to delete document' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Document archived successfully' })
  } catch (error) {
    console.error('[A4 Documents API] Error deleting document:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
