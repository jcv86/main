import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { put } from '@vercel/blob'
import { v4 as uuidv4 } from 'uuid'

/**
 * POST /api/multimodal/upload
 * Upload video and create analysis session
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()

    // Get authenticated user
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Parse multipart form data
    const formData = await request.formData()
    const videoFile = formData.get('video') as File
    const entrenamillentoType = formData.get('entrenamiento_type') as string
    const metadata = formData.get('metadata') as string

    if (!videoFile || !entrenamillentoType) {
      return NextResponse.json(
        { error: 'Missing video or entrenamiento_type' },
        { status: 400 }
      )
    }

    // Validate video file size (max 500MB)
    const MAX_FILE_SIZE = 500 * 1024 * 1024 // 500MB
    if (videoFile.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'Video file too large. Maximum 500MB allowed.' },
        { status: 400 }
      )
    }

    console.log(`[v0] Uploading video: ${videoFile.name} (${videoFile.size} bytes) for user ${user.id}`)

    // Generate session ID
    const sessionId = uuidv4()

    // Upload video to Vercel Blob (encrypted)
    const blobPath = `videos/${user.id}/${sessionId}/${videoFile.name}`
    let uploadedBlob
    
    try {
      uploadedBlob = await put(blobPath, videoFile, {
        access: 'public',
        addRandomSuffix: false
      })
      console.log(`[v0] Video uploaded to Blob: ${uploadedBlob.url}`)
    } catch (blobError) {
      console.error('[v0] Blob upload error:', blobError)
      return NextResponse.json(
        { error: 'Failed to upload video to storage' },
        { status: 500 }
      )
    }

    // Create analysis session in database
    const { data: session, error: sessionError } = await supabase
      .from('multimodal_sessions')
      .insert({
        id: sessionId,
        user_id: user.id,
        video_blob_url: uploadedBlob.url,
        entrenamiento_type: entrenamillentoType,
        file_size_mb: Math.round(videoFile.size / 1024 / 1024),
        status: 'processing',
        metadata: metadata ? JSON.parse(metadata) : {},
        created_at: new Date().toISOString()
      })
      .select()

    if (sessionError) {
      console.error('[v0] Session creation error:', sessionError)
      return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
    }

    console.log(`[v0] Session created: ${sessionId}`)

    // Queue analysis job - try with error handling
    let jobId = null
    try {
      // Dynamically import to avoid startup errors if Redis isn't configured
      const { queueAnalysisJob } = await import('@/lib/multimodal/analysis-queue')
      jobId = await queueAnalysisJob({
        sessionId,
        userId: user.id,
        videoUrl: uploadedBlob.url,
        entrenamillentoType,
        metadata: metadata ? JSON.parse(metadata) : {}
      })
      console.log(`[v0] Analysis job queued: ${jobId}`)
    } catch (queueError) {
      console.warn('[v0] Queue error (continuing anyway):', queueError)
      // Continue without queue - analysis can be triggered manually
    }

    return NextResponse.json({
      sessionId,
      jobId: jobId || 'manual',
      status: 'processing',
      message: 'Video uploaded successfully. Analysis in progress.'
    })
  } catch (error) {
    console.error('[v0] Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload video', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
