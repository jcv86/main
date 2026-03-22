import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { queueAnalysisJob } from '@/lib/multimodal/analysis-queue'
import { put } from '@vercel/blob'
import { v4 as uuidv4 } from 'uuid'

/**
 * POST /api/multimodal/upload
 * Upload video and queue for analysis
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()

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

    console.log(`[v0] Uploading video: ${videoFile.name} (${videoFile.size} bytes)`)

    // Generate session ID
    const sessionId = uuidv4()

    // Upload video to Vercel Blob (encrypted)
    const blobPath = `videos/${user.id}/${sessionId}/${videoFile.name}`
    const uploadedBlob = await put(blobPath, videoFile, {
      access: 'private',
      addRandomSuffix: false
    })

    console.log(`[v0] Video uploaded to Blob: ${uploadedBlob.url}`)

    // Create analysis session in database
    const { data: session, error: sessionError } = await supabase
      .from('multimodal_sessions')
      .insert({
        id: sessionId,
        user_id: user.id,
        video_blob_url: uploadedBlob.url,
        entrenamiento_type: entrenamillentoType,
        file_size_mb: Math.round(videoFile.size / 1024 / 1024),
        status: 'queued',
        metadata: metadata ? JSON.parse(metadata) : {}
      })
      .select()

    if (sessionError) {
      console.error('[v0] Session creation error:', sessionError)
      return NextResponse.json({ error: 'Failed to create session' }, { status: 500 })
    }

    // Queue analysis job
    const jobId = await queueAnalysisJob({
      sessionId,
      userId: user.id,
      videoUrl: uploadedBlob.url,
      entrenamillentoType,
      metadata: metadata ? JSON.parse(metadata) : {}
    })

    console.log(`[v0] Analysis job queued: ${jobId}`)

    return NextResponse.json({
      sessionId,
      jobId,
      status: 'queued',
      message: 'Video uploaded successfully. Analysis in progress.'
    })
  } catch (error) {
    console.error('[v0] Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload video' },
      { status: 500 }
    )
  }
}
