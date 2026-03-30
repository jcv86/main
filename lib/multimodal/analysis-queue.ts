import Queue from 'bull'
import redis from 'redis'
import { createClient } from '@/lib/supabase/server'
import { processVideoFile, cleanupProcessedFiles } from './video-processor'
import { performMultimodalAnalysis } from './openai-multimodal'
import * as path from 'path'
import * as os from 'os'

// Create Bull queue for analysis jobs
export const analysisQueue = new Queue('multimodal-analysis', {
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD
  },
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000
    },
    removeOnComplete: true
  }
})

export interface AnalysisJobData {
  sessionId: string
  userId: string
  videoUrl: string
  audioUrl?: string
  entrenamillentoType: string
  metadata?: Record<string, any>
}

export interface AnalysisJobResult {
  sessionId: string
  analysisId: string
  overallScore: number
  status: 'completed' | 'failed'
  error?: string
}

/**
 * Queue a video for multimodal analysis
 */
export async function queueAnalysisJob(jobData: AnalysisJobData): Promise<string> {
  try {
    const job = await analysisQueue.add(jobData, {
      jobId: `analysis-${jobData.sessionId}`,
      delay: 0,
      priority: 10
    })

    console.log(`[v0] Analysis job queued: ${job.id}`)
    return String(job.id)
  } catch (error) {
    console.error('[v0] Error queueing analysis job:', error)
    throw error
  }
}

/**
 * Process analysis job
 */
analysisQueue.process(async (job) => {
  const jobData = job.data as AnalysisJobData
  const supabase = createClient()

  try {
    console.log(`[v0] Processing analysis job: ${job.id}`)

    // Create temporary directory for processing
    const tmpDir = path.join(os.tmpdir(), `analysis-${jobData.sessionId}`)

    // Download video from Blob storage
    const videoPath = path.join(tmpDir, 'video.mp4')
    // Note: In production, download from Vercel Blob or S3

    // Process video
    const processingResult = await processVideoFile(videoPath, tmpDir, 1)
    console.log(`[v0] Video processed: ${processingResult.frames.length} frames, ${processingResult.duration}s duration`)

    // Extract transcript from audio (Whisper is called in analysis)
    // For now, we'll extract it during audio analysis

    // Perform multimodal analysis
    const analysisResult = await performMultimodalAnalysis(
      processingResult.frames,
      processingResult.audioPath,
      '' // Transcript extracted during audio analysis
    )

    console.log(`[v0] Analysis complete: score ${analysisResult.overall_score}`)

    // Save analysis to database
    const { data: savedAnalysis, error: dbError } = await supabase
      .from('multimodal_analyses')
      .insert({
        session_id: jobData.sessionId,
        user_id: jobData.userId,
        entrenamiento_type: jobData.entrenamillentoType,
        overall_score: analysisResult.overall_score,
        visual_analysis: analysisResult.visual,
        audio_analysis: analysisResult.audio,
        coherence_analysis: analysisResult.coherence,
        strengths: analysisResult.key_strengths,
        improvements: analysisResult.areas_for_improvement,
        recommendations: analysisResult.personalized_recommendations,
        feedback: analysisResult.detailed_feedback,
        status: 'completed',
        processing_time_ms: Date.now() - job.progress
      })
      .select()

    if (dbError) {
      console.error('[v0] Database error saving analysis:', dbError)
      throw dbError
    }

    // Track API usage
    await supabase.from('multimodal_api_usage').insert({
      user_id: jobData.userId,
      analysis_type: 'full_multimodal',
      frames_processed: processingResult.frames.length,
      duration_seconds: Math.round(processingResult.duration),
      openai_calls: 4, // visual, audio, coherence, recommendations
      cost_estimate: 0.15 // Estimated cost
    })

    // Cleanup temporary files
    await cleanupProcessedFiles(tmpDir)

    return {
      sessionId: jobData.sessionId,
      analysisId: savedAnalysis?.[0]?.id,
      overallScore: analysisResult.overall_score,
      status: 'completed'
    }
  } catch (error) {
    console.error(`[v0] Analysis job failed: ${error}`)

    // Save error to database
    const supabase = createClient()
    await supabase.from('multimodal_analyses').insert({
      session_id: jobData.sessionId,
      user_id: jobData.userId,
      entrenamiento_type: jobData.entrenamillentoType,
      status: 'failed',
      error_message: String(error)
    })

    throw error
  }
})

/**
 * Get analysis results
 */
export async function getAnalysisResults(analysisId: string) {
  try {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('multimodal_analyses')
      .select('*')
      .eq('id', analysisId)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('[v0] Error fetching analysis:', error)
    throw error
  }
}

/**
 * Get job status
 */
export async function getJobStatus(jobId: string) {
  try {
    const job = await analysisQueue.getJob(jobId)
    if (!job) return null

    return {
      id: job.id,
      state: await job.getState(),
      progress: job.progress(),
      failedReason: job.failedReason,
      stacktrace: job.stacktrace
    }
  } catch (error) {
    console.error('[v0] Error getting job status:', error)
    throw error
  }
}

// Queue event listeners
analysisQueue.on('completed', (job) => {
  console.log(`[v0] Analysis job completed: ${job.id}`)
})

analysisQueue.on('failed', (job, err) => {
  console.error(`[v0] Analysis job failed: ${job.id} - ${err.message}`)
})

analysisQueue.on('error', (error) => {
  console.error('[v0] Queue error:', error)
})
