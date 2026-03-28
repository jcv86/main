import OpenAI from 'openai'
import * as fs from 'fs'
import * as path from 'path'
import fetch from 'node-fetch'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export interface VisualAnalysisResult {
  posture_quality: number // 0-100
  posture_feedback: string
  eye_contact: number // 0-100
  eye_contact_feedback: string
  facial_expressions: string
  gestures: string
  overall_visual_score: number
}

export interface AudioAnalysisResult {
  tone_quality: number // 0-100
  tone_feedback: string
  speech_pace: number // words per minute
  clarity: number // 0-100
  filler_words: number
  confidence_level: number // 0-100
  overall_audio_score: number
}

export interface CoherenceAnalysisResult {
  visual_audio_alignment: number // 0-100
  message_consistency: string
  emotional_congruence: number // 0-100
  micro_expressions: string[]
  contradictions: string[]
  overall_coherence_score: number
}

export interface MultimodalAnalysisResult {
  visual: VisualAnalysisResult
  audio: AudioAnalysisResult
  coherence: CoherenceAnalysisResult
  overall_score: number
  key_strengths: string[]
  areas_for_improvement: string[]
  personalized_recommendations: string[]
  detailed_feedback: string
}

/**
 * Analyze visual elements from frames using GPT-4o
 */
export async function analyzeVisualFrames(frames: string[]): Promise<VisualAnalysisResult> {
  try {
    // Convert frames to base64
    const frameData = frames.slice(0, 10).map(framePath => {
      const imageBuffer = fs.readFileSync(framePath)
      return imageBuffer.toString('base64')
    })

    const response = await openai.messages.create({
      model: 'gpt-4o',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analiza los siguientes frames de una entrevista de trabajo y proporciona análisis detallado en formato JSON.

Evalúa:
1. Calidad de postura (0-100): ¿Qué tan profesional y segura es la postura?
2. Contacto visual (0-100): ¿Mira a cámara de manera natural?
3. Expresiones faciales: Describe las expresiones emocionales observadas
4. Gestos: ¿Cuáles son los gestos principales? ¿Son naturales o forzados?

Responde SOLO con JSON válido, sin markdown:
{
  "posture_quality": número,
  "posture_feedback": "texto",
  "eye_contact": número,
  "eye_contact_feedback": "texto",
  "facial_expressions": "descripción",
  "gestures": "descripción"
}`
            },
            ...frameData.map(frame => ({
              type: 'image' as const,
              source: {
                type: 'base64' as const,
                media_type: 'image/jpeg' as const,
                data: frame
              }
            }))
          ]
        }
      ]
    })

    const analysisText = response.content[0].type === 'text' ? response.content[0].text : ''
    const analysis = JSON.parse(analysisText)

    return {
      posture_quality: analysis.posture_quality,
      posture_feedback: analysis.posture_feedback,
      eye_contact: analysis.eye_contact,
      eye_contact_feedback: analysis.eye_contact_feedback,
      facial_expressions: analysis.facial_expressions,
      gestures: analysis.gestures,
      overall_visual_score: Math.round((analysis.posture_quality + analysis.eye_contact) / 2)
    }
  } catch (error) {
    console.error('[v0] Visual analysis error:', error)
    throw new Error(`Failed to analyze visual elements: ${error}`)
  }
}

/**
 * Analyze audio characteristics using Whisper + GPT-4o
 */
export async function analyzeAudio(audioPath: string): Promise<AudioAnalysisResult> {
  try {
    // Transcribe audio
    const audioFile = fs.readFileSync(audioPath)
    const transcriptionResponse = await openai.audio.transcriptions.create({
      model: 'whisper-1',
      file: new File([audioFile], 'audio.mp3', { type: 'audio/mp3' })
    })

    const transcript = transcriptionResponse.text

    // Analyze with GPT-4o
    const response = await openai.messages.create({
      model: 'gpt-4o',
      max_tokens: 800,
      messages: [
        {
          role: 'user',
          content: `Analiza la siguiente transcripción de una entrevista de trabajo:

"${transcript}"

Evalúa:
1. Tono (0-100): ¿Qué tan profesional, seguro y amable es el tono?
2. Velocidad del habla: Estima palabras por minuto (normal es 120-150)
3. Claridad (0-100): ¿Qué tan clara y comprensible es la dicción?
4. Palabras de relleno: Cuenta "uh", "um", "este", "pues", etc.
5. Nivel de confianza (0-100): ¿Qué tan seguro suena?

Responde SOLO con JSON:
{
  "tone_quality": número,
  "tone_feedback": "texto",
  "speech_pace": número,
  "clarity": número,
  "filler_words": número,
  "confidence_level": número,
  "transcript": "resumen ejecutivo"
}`
        }
      ]
    })

    const analysisText = response.content[0].type === 'text' ? response.content[0].text : ''
    const analysis = JSON.parse(analysisText)

    return {
      tone_quality: analysis.tone_quality,
      tone_feedback: analysis.tone_feedback,
      speech_pace: analysis.speech_pace,
      clarity: analysis.clarity,
      filler_words: analysis.filler_words,
      confidence_level: analysis.confidence_level,
      overall_audio_score: Math.round((analysis.tone_quality + analysis.clarity + analysis.confidence_level) / 3)
    }
  } catch (error) {
    console.error('[v0] Audio analysis error:', error)
    throw new Error(`Failed to analyze audio: ${error}`)
  }
}

/**
 * Analyze coherence between visual and audio elements
 */
export async function analyzeCoherence(
  visualAnalysis: VisualAnalysisResult,
  audioAnalysis: AudioAnalysisResult,
  transcript: string
): Promise<CoherenceAnalysisResult> {
  try {
    const response = await openai.messages.create({
      model: 'gpt-4o',
      max_tokens: 1200,
      messages: [
        {
          role: 'user',
          content: `Analiza la coherencia entre lenguaje corporal y verbal en una entrevista.

Análisis Visual:
- Postura: ${visualAnalysis.posture_quality}/100 - ${visualAnalysis.posture_feedback}
- Contacto visual: ${visualAnalysis.eye_contact}/100
- Expresiones: ${visualAnalysis.facial_expressions}

Análisis de Audio:
- Tono: ${audioAnalysis.tone_quality}/100
- Claridad: ${audioAnalysis.clarity}/100
- Confianza: ${audioAnalysis.confidence_level}/100

Transcripción:
"${transcript.substring(0, 500)}..."

Evalúa:
1. Alineación visual-audio (0-100): ¿El cuerpo y la voz transmiten el mismo mensaje?
2. Coherencia del mensaje: ¿Las palabras y el lenguaje corporal son congruentes?
3. Congruencia emocional (0-100): ¿Las emociones expresadas verbalmente coinciden con las no verbales?
4. Microexpresiones: ¿Identifica microexpresiones de incomodidad o inseguridad?
5. Contradicciones: ¿Hay contradicciones entre lo que dice y lo que comunica su cuerpo?

Responde SOLO con JSON:
{
  "visual_audio_alignment": número,
  "message_consistency": "texto",
  "emotional_congruence": número,
  "micro_expressions": ["lista de microexpresiones"],
  "contradictions": ["lista de contradicciones"]
}`
        }
      ]
    })

    const analysisText = response.content[0].type === 'text' ? response.content[0].text : ''
    const analysis = JSON.parse(analysisText)

    return {
      visual_audio_alignment: analysis.visual_audio_alignment,
      message_consistency: analysis.message_consistency,
      emotional_congruence: analysis.emotional_congruence,
      micro_expressions: analysis.micro_expressions,
      contradictions: analysis.contradictions,
      overall_coherence_score: Math.round((analysis.visual_audio_alignment + analysis.emotional_congruence) / 2)
    }
  } catch (error) {
    console.error('[v0] Coherence analysis error:', error)
    throw new Error(`Failed to analyze coherence: ${error}`)
  }
}

/**
 * Generate personalized recommendations
 */
export async function generateRecommendations(
  analysis: Omit<MultimodalAnalysisResult, 'key_strengths' | 'areas_for_improvement' | 'personalized_recommendations' | 'detailed_feedback'>
): Promise<{
  key_strengths: string[]
  areas_for_improvement: string[]
  personalized_recommendations: string[]
  detailed_feedback: string
}> {
  try {
    const response = await openai.messages.create({
      model: 'gpt-4o',
      max_tokens: 1500,
      messages: [
        {
          role: 'user',
          content: `Basado en el siguiente análisis de entrevista, genera recomendaciones personalizadas:

Puntuaciones Visuales: ${analysis.visual.overall_visual_score}/100
- Postura: ${analysis.visual.posture_quality}/100
- Contacto visual: ${analysis.visual.eye_contact}/100

Puntuaciones de Audio: ${analysis.audio.overall_audio_score}/100
- Tono: ${analysis.audio.tone_quality}/100
- Claridad: ${analysis.audio.clarity}/100
- Confianza: ${analysis.audio.confidence_level}/100

Coherencia: ${analysis.coherence.overall_coherence_score}/100

Genera un JSON con:
1. key_strengths: Array de 3-4 fortalezas principales
2. areas_for_improvement: Array de 3-4 áreas a mejorar
3. personalized_recommendations: Array de 5-7 recomendaciones accionables
4. detailed_feedback: Párrafo de feedback detallado (máx 200 palabras)

Responde SOLO con JSON válido:
{
  "key_strengths": ["fortaleza 1", "fortaleza 2"],
  "areas_for_improvement": ["área 1", "área 2"],
  "personalized_recommendations": ["recomendación 1", "recomendación 2"],
  "detailed_feedback": "texto"
}`
        }
      ]
    })

    const analysisText = response.content[0].type === 'text' ? response.content[0].text : ''
    return JSON.parse(analysisText)
  } catch (error) {
    console.error('[v0] Recommendations generation error:', error)
    throw new Error(`Failed to generate recommendations: ${error}`)
  }
}

/**
 * Perform complete multimodal analysis
 */
export async function performMultimodalAnalysis(
  frames: string[],
  audioPath: string,
  transcript: string
): Promise<MultimodalAnalysisResult> {
  try {
    console.log('[v0] Starting multimodal analysis...')

    // Run analyses in parallel
    const [visualAnalysis, audioAnalysis] = await Promise.all([
      analyzeVisualFrames(frames),
      analyzeAudio(audioPath)
    ])

    console.log('[v0] Visual and audio analysis complete')

    // Coherence analysis
    const coherenceAnalysis = await analyzeCoherence(visualAnalysis, audioAnalysis, transcript)
    console.log('[v0] Coherence analysis complete')

    // Generate recommendations
    const recommendations = await generateRecommendations({
      visual: visualAnalysis,
      audio: audioAnalysis,
      coherence: coherenceAnalysis,
      overall_score: 0 // Will be calculated
    })

    const overallScore = Math.round(
      (visualAnalysis.overall_visual_score + audioAnalysis.overall_audio_score + coherenceAnalysis.overall_coherence_score) / 3
    )

    return {
      visual: visualAnalysis,
      audio: audioAnalysis,
      coherence: coherenceAnalysis,
      overall_score: overallScore,
      key_strengths: recommendations.key_strengths,
      areas_for_improvement: recommendations.areas_for_improvement,
      personalized_recommendations: recommendations.personalized_recommendations,
      detailed_feedback: recommendations.detailed_feedback
    }
  } catch (error) {
    console.error('[v0] Multimodal analysis error:', error)
    throw error
  }
}
