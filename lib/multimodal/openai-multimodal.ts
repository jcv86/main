// Multimodal OpenAI support - STUBS
// Note: Video/audio analysis requires OpenAI Vision/Whisper APIs

export interface VisualAnalysisResult {
  posture_quality: number
  posture_feedback: string
  eye_contact: number
  eye_contact_feedback: string
  facial_expressions: string
  gestures: string
  overall_visual_score: number
}

export interface AudioAnalysisResult {
  tone_quality: number
  tone_feedback: string
  speech_pace: number
  clarity: number
  filler_words: number
  confidence_level: number
  overall_audio_score: number
}

export interface CoherenceAnalysisResult {
  visual_audio_alignment: number
  message_consistency: number
  overall_coherence_score: number
}

// Stub functions for development
export async function analyzeVideoFrame(imagePath: string): Promise<VisualAnalysisResult> {
  return {
    posture_quality: 75,
    posture_feedback: 'Good posture',
    eye_contact: 70,
    eye_contact_feedback: 'Adequate eye contact',
    facial_expressions: 'Neutral',
    gestures: 'Limited hand movement',
    overall_visual_score: 72,
  }
}

export async function analyzeAudioClip(audioPath: string): Promise<AudioAnalysisResult> {
  return {
    tone_quality: 78,
    tone_feedback: 'Professional tone',
    speech_pace: 140,
    clarity: 82,
    filler_words: 2,
    confidence_level: 75,
    overall_audio_score: 76,
  }
}

export async function analyzeCoherence(
  visual: VisualAnalysisResult,
  audio: AudioAnalysisResult
): Promise<CoherenceAnalysisResult> {
  return {
    visual_audio_alignment: 74,
    message_consistency: 80,
    overall_coherence_score: 77,
  }
}
