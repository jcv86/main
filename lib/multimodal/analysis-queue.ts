import { createClient } from '@/lib/supabase/server'
import { processVideoFile, cleanupProcessedFiles } from './video-processor'
import * as path from 'path'
import * as os from 'os'

export interface JobData {
  sessionId: string
  userId: string
  entrenamillentoType: string
  videoPath: string
}

export async function queueMultimodalAnalysis(jobData: JobData): Promise<string> {
  const startTime = Date.now()

  try {
    const supabase = await createClient()

    // Process video file with temp directory
    const tempDir = path.join(os.tmpdir(), `video-${Date.now()}`)
    const processingResult = await processVideoFile(jobData.videoPath, tempDir, 1)

    // Check if processing succeeded
    if (!processingResult?.framesPath || !processingResult?.audioPath) {
      throw new Error('Failed to process video: missing frames or audio path')
    }

    // Perform multimodal analysis (using mock data - real implementation would call OpenAI Vision/Whisper)
    const analysisResult = {
      overall_score: 75,
      visual: { eye_contact_score: 75, posture_score: 80, gesture_score: 70 },
      audio: { clarity_score: 80, pace_score: 75, tone_score: 78 },
      coherence: { visual_audio_alignment: 76, message_consistency: 78, overall_coherence_score: 77 },
      key_strengths: ['Good communication', 'Clear structure'],
      areas_for_improvement: ['Reduce filler words', 'Increase eye contact'],
      personalized_recommendations: ['Practice pacing', 'Record and review'],
      detailed_feedback: 'Good performance with room for improvement in non-verbal communication.'
    }

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
        processing_time_ms: Date.now() - startTime
      })
      .select()
      .single()

    if (dbError) {
      console.error('[v0] Database error:', dbError)
      throw dbError
    }

    // Cleanup processed files
    await cleanupProcessedFiles(tempDir)

    return savedAnalysis?.id || 'unknown'
  } catch (error) {
    console.error('[v0] Analysis queue error:', error)
    throw error
  }
}

export async function getAnalysisResult(analysisId: string): Promise<any> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('multimodal_analyses')
    .select('*')
    .eq('id', analysisId)
    .single()

  if (error) throw error
  return data
}
