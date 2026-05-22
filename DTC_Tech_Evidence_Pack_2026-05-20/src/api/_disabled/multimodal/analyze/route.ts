import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { performMultimodalAnalysis } from '@/lib/multimodal/openai-multimodal'
import { processVideoFile, cleanupProcessedFiles } from '@/lib/multimodal/video-processor'
import * as path from 'path'
import * as os from 'os'
import * as fs from 'fs'
import https from 'https'

/**
 * POST /api/multimodal/analyze
 * Trigger analysis for a video session
 * This endpoint processes the video and performs AI analysis
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

    const { sessionId } = await request.json()

    if (!sessionId) {
      return NextResponse.json({ error: 'Missing sessionId' }, { status: 400 })
    }

    console.log(`[v0] Starting analysis for session: ${sessionId}`)

    // Get session from database
    const { data: session, error: sessionError } = await supabase
      .from('multimodal_sessions')
      .select('*')
      .eq('id', sessionId)
      .eq('user_id', user.id)
      .single()

    if (sessionError || !session) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 })
    }

    // Update session status to processing
    await supabase
      .from('multimodal_sessions')
      .update({ status: 'analyzing', started_at: new Date().toISOString() })
      .eq('id', sessionId)

    const startTime = Date.now()
    const tmpDir = path.join(os.tmpdir(), `analysis-${sessionId}`)

    // Create temp directory
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir, { recursive: true })
    }

    try {
      // Download video from Blob URL
      const videoPath = path.join(tmpDir, 'video.webm')
      console.log(`[v0] Downloading video from: ${session.video_blob_url}`)
      
      await new Promise<void>((resolve, reject) => {
        const file = fs.createWriteStream(videoPath)
        https
          .get(session.video_blob_url, (response) => {
            response.pipe(file)
            file.on('finish', () => {
              file.close()
              resolve()
            })
            file.on('error', reject)
          })
          .on('error', (err) => {
            fs.unlink(videoPath, () => {}) // Delete on error
            reject(err)
          })
      })

      console.log(`[v0] Video downloaded successfully`)

      // Process video (extract frames and audio)
      console.log(`[v0] Processing video for frames and audio extraction`)
      const processingResult = await processVideoFile(videoPath, tmpDir, 1) // 1 frame per second
      console.log(
        `[v0] Video processed: ${processingResult.frames.length} frames, ${processingResult.duration}s duration`
      )

      // Perform multimodal analysis
      console.log(`[v0] Performing multimodal AI analysis`)
      const analysisResult = await performMultimodalAnalysis(
        processingResult.frames,
        processingResult.audioPath,
        '' // Transcript will be extracted during audio analysis
      )

      console.log(`[v0] Analysis complete: score ${analysisResult.overall_score}`)

      // Save analysis results to database
      const { data: analysis, error: analysisError } = await supabase
        .from('multimodal_analyses')
        .insert({
          session_id: sessionId,
          user_id: user.id,
          entrenamiento_type: session.entrenamiento_type,
          overall_score: analysisResult.overall_score,
          visual_analysis: analysisResult.visual,
          audio_analysis: analysisResult.audio,
          coherence_analysis: analysisResult.coherence,
          strengths: analysisResult.key_strengths,
          improvements: analysisResult.areas_for_improvement,
          recommendations: analysisResult.personalized_recommendations,
          feedback: analysisResult.detailed_feedback,
          status: 'completed',
          processing_time_ms: Date.now() - startTime,
          created_at: new Date().toISOString()
        })
        .select()

      if (analysisError) {
        throw analysisError
      }

      const analysisId = analysis?.[0]?.id

      // Update session status to completed
      await supabase
        .from('multimodal_sessions')
        .update({
          status: 'completed',
          analysis_id: analysisId,
          completed_at: new Date().toISOString(),
          processing_time_ms: Date.now() - startTime
        })
        .eq('id', sessionId)

      // Track API usage
      await supabase.from('multimodal_api_usage').insert({
        user_id: user.id,
        analysis_type: 'full_multimodal',
        session_id: sessionId,
        frames_processed: processingResult.frames.length,
        duration_seconds: Math.round(processingResult.duration),
        openai_calls: 4, // visual, audio, coherence, recommendations
        cost_estimate: 0.15 // Estimated cost
      })

      console.log(`[v0] Analysis saved successfully: ${analysisId}`)

      return NextResponse.json({
        sessionId,
        analysisId,
        status: 'completed',
        overall_score: analysisResult.overall_score,
        processing_time_ms: Date.now() - startTime,
        message: 'Analysis completed successfully'
      })
    } finally {
      // Cleanup temporary files
      console.log(`[v0] Cleaning up temporary files`)
      await cleanupProcessedFiles(tmpDir)
    }
  } catch (error) {
    console.error('[v0] Analysis error:', error)

    // Mark session as failed
    try {
      const { sessionId } = await request.json()
      const supabase = await createClient()
      const {
        data: { user }
      } = await supabase.auth.getUser()

      if (user && sessionId) {
        await supabase
          .from('multimodal_sessions')
          .update({
            status: 'failed',
            error_message: error instanceof Error ? error.message : 'Unknown error',
            completed_at: new Date().toISOString()
          })
          .eq('id', sessionId)
          .eq('user_id', user.id)
      }
    } catch (updateError) {
      console.error('[v0] Failed to update session status:', updateError)
    }

    return NextResponse.json(
      {
        error: 'Analysis failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}
