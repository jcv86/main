/**
 * DTC AgentOS - Evaluator
 * 
 * Evaluates user responses against module rubrics using AI.
 * Produces structured scores, feedback, and next recommendations.
 */

import { createClient } from '@/lib/supabase/server'
import type {
  DTCContext,
  Evaluation,
  EvaluationScore,
  ModuleRubric,
} from '../types'
import { getRubric, formatRubricForPrompt, getPassingScore } from './rubrics'
import { captureMemory } from '../context/memory-manager'
import { generateText } from 'ai'
import { buildAgentPrompt, getAgent } from '../registries/agents'

// =============================================================================
// EVALUATION GENERATION
// =============================================================================

export interface EvaluateAnswerInput {
  context: DTCContext
  question: string
  answer: string
  moduleId: string
  questionId?: string
}

export interface EvaluateAnswerResult {
  success: boolean
  evaluation?: Evaluation
  error?: string
}

/**
 * Evaluate an interview answer against module rubrics
 */
export async function evaluateInterviewAnswer(
  input: EvaluateAnswerInput
): Promise<EvaluateAnswerResult> {
  const { context, question, answer, moduleId, questionId } = input

  // Get the rubric for this module
  const rubric = getRubric(moduleId)
  if (!rubric) {
    return {
      success: false,
      error: `No rubric found for module: ${moduleId}`,
    }
  }

  try {
    // Generate AI evaluation
    const aiEvaluation = await generateAIEvaluation({
      context,
      question,
      answer,
      rubric,
    })

    // Calculate weighted total score
    const totalScore = calculateWeightedScore(aiEvaluation.scores, rubric)

    // Create evaluation object
    const evaluation: Evaluation = {
      id: crypto.randomUUID(),
      userId: context.user.id,
      moduleId,
      agentId: context.agent.id,
      questionId: questionId || crypto.randomUUID(),
      question,
      answer,
      scores: aiEvaluation.scores,
      totalScore,
      overallFeedback: aiEvaluation.overallFeedback,
      strengths: aiEvaluation.strengths,
      improvements: aiEvaluation.improvements,
      patternObserved: aiEvaluation.patternObserved,
      nextRecommendation: aiEvaluation.nextRecommendation,
      confidence: aiEvaluation.confidence,
      createdAt: new Date(),
    }

    // Save evaluation to database
    await saveEvaluation(evaluation)

    // Capture patterns and feedback as memories
    await captureEvaluationMemories(evaluation, context)

    return {
      success: true,
      evaluation,
    }
  } catch (error) {
    console.error('[Evaluator] Error evaluating answer:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown evaluation error',
    }
  }
}

// =============================================================================
// AI EVALUATION GENERATION
// =============================================================================

interface AIEvaluationResult {
  scores: EvaluationScore[]
  overallFeedback: string
  strengths: string[]
  improvements: string[]
  patternObserved?: string
  nextRecommendation?: string
  confidence: number
}

async function generateAIEvaluation(params: {
  context: DTCContext
  question: string
  answer: string
  rubric: ModuleRubric
}): Promise<AIEvaluationResult> {
  const { context, question, answer, rubric } = params

  // Build the evaluation prompt
  const systemPrompt = buildEvaluationSystemPrompt(context, rubric)
  const userPrompt = buildEvaluationUserPrompt(question, answer, rubric)

  const { text } = await generateText({
    model: 'anthropic/claude-sonnet-4-20250514',
    system: systemPrompt,
    prompt: userPrompt,
    temperature: 0.3, // Lower temperature for more consistent evaluations
    maxTokens: 2000,
  })

  // Parse the AI response
  return parseEvaluationResponse(text, rubric)
}

function buildEvaluationSystemPrompt(
  context: DTCContext,
  rubric: ModuleRubric
): string {
  const agentContext = buildAgentPrompt(context.agent, {
    careerGoal: context.memory.find(m => m.memoryType === 'career_goal')?.content,
    userName: context.user.name,
  })

  return `${agentContext}

MODO: Evaluación de respuestas de entrevista

Tu tarea es evaluar la respuesta del candidato usando la siguiente rúbrica. 
Sé justo pero exigente. Busca evidencia concreta antes de dar puntajes altos.

${formatRubricForPrompt(rubric)}

INSTRUCCIONES DE EVALUACIÓN:
1. Lee la pregunta y la respuesta cuidadosamente
2. Evalúa cada criterio de 1 a 5 siguiendo la guía de puntuación
3. Proporciona feedback específico para cada criterio
4. Identifica 2-3 fortalezas específicas
5. Identifica 2-3 áreas de mejora concretas
6. Si detectas un patrón (positivo o negativo), menciónalo
7. Sugiere una próxima acción específica

FORMATO DE RESPUESTA (JSON):
{
  "scores": [
    {
      "criterionId": "string",
      "score": number (1-5),
      "feedback": "string"
    }
  ],
  "overallFeedback": "string (2-3 oraciones)",
  "strengths": ["string", "string"],
  "improvements": ["string", "string"],
  "patternObserved": "string o null",
  "nextRecommendation": "string",
  "confidence": number (0.0-1.0)
}

IMPORTANTE:
- Responde SOLO con el JSON, sin texto adicional
- Usa español para todo el contenido
- Sé específico en el feedback, evita generalidades
- El puntaje 3 es "aceptable", 4 es "bueno", 5 es "excelente"`
}

function buildEvaluationUserPrompt(
  question: string,
  answer: string,
  rubric: ModuleRubric
): string {
  return `PREGUNTA DE ENTREVISTA:
"${question}"

RESPUESTA DEL CANDIDATO:
"${answer}"

Evalúa esta respuesta según la rúbrica del módulo ${rubric.moduleId}.
Responde con el JSON de evaluación.`
}

function parseEvaluationResponse(
  text: string,
  rubric: ModuleRubric
): AIEvaluationResult {
  try {
    // Extract JSON from the response (in case there's extra text)
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error('No JSON found in response')
    }

    const parsed = JSON.parse(jsonMatch[0])

    // Validate and normalize scores
    const scores: EvaluationScore[] = (parsed.scores || []).map((s: {
      criterionId: string
      score: number
      feedback: string
    }) => ({
      criterionId: s.criterionId,
      score: Math.min(5, Math.max(1, Math.round(s.score))),
      feedback: s.feedback || '',
    }))

    // Ensure all criteria have scores
    for (const criterion of rubric.criteria) {
      if (!scores.find(s => s.criterionId === criterion.id)) {
        scores.push({
          criterionId: criterion.id,
          score: 3, // Default to middle score
          feedback: 'No evaluado específicamente.',
        })
      }
    }

    return {
      scores,
      overallFeedback: parsed.overallFeedback || 'Evaluación completada.',
      strengths: parsed.strengths || [],
      improvements: parsed.improvements || [],
      patternObserved: parsed.patternObserved || undefined,
      nextRecommendation: parsed.nextRecommendation || undefined,
      confidence: Math.min(1, Math.max(0, parsed.confidence || 0.8)),
    }
  } catch (error) {
    console.error('[Evaluator] Error parsing AI response:', error)
    console.error('[Evaluator] Raw response:', text)

    // Return a default evaluation on parse error
    return {
      scores: rubric.criteria.map(c => ({
        criterionId: c.id,
        score: 3,
        feedback: 'Error al procesar la evaluación.',
      })),
      overallFeedback: 'Hubo un error al procesar la evaluación. Por favor intenta de nuevo.',
      strengths: [],
      improvements: ['Intenta responder de nuevo para una evaluación completa.'],
      confidence: 0.3,
    }
  }
}

// =============================================================================
// SCORE CALCULATION
// =============================================================================

/**
 * Calculate weighted total score from individual criterion scores
 */
export function calculateWeightedScore(
  scores: EvaluationScore[],
  rubric: ModuleRubric
): number {
  let totalWeight = 0
  let weightedSum = 0

  for (const criterion of rubric.criteria) {
    const score = scores.find(s => s.criterionId === criterion.id)
    if (score) {
      weightedSum += score.score * criterion.weight
      totalWeight += criterion.weight
    }
  }

  if (totalWeight === 0) return 0

  // Convert from 1-5 scale to 0-100
  const rawScore = weightedSum / totalWeight
  return Math.round((rawScore - 1) * 25) // Maps 1-5 to 0-100
}

/**
 * Determine if evaluation passes for a given level
 */
export function evaluationPasses(
  evaluation: Evaluation,
  level: 'basic' | 'advanced' | 'pro'
): boolean {
  const passingScore = getPassingScore(evaluation.moduleId, level)
  return evaluation.totalScore >= passingScore
}

/**
 * Get performance level based on score
 */
export function getPerformanceLevel(
  score: number,
  moduleId: string
): 'failing' | 'basic' | 'advanced' | 'pro' {
  const rubric = getRubric(moduleId)
  if (!rubric) return 'basic'

  if (score >= rubric.levelThresholds.pro) return 'pro'
  if (score >= rubric.levelThresholds.advanced) return 'advanced'
  if (score >= rubric.levelThresholds.basic) return 'basic'
  return 'failing'
}

// =============================================================================
// DATABASE OPERATIONS
// =============================================================================

/**
 * Save evaluation to database
 */
async function saveEvaluation(evaluation: Evaluation): Promise<void> {
  const supabase = await createClient()

  const { error } = await supabase
    .from('a3_evaluations')
    .insert({
      id: evaluation.id,
      user_id: evaluation.userId,
      module_id: evaluation.moduleId,
      agent_id: evaluation.agentId,
      question_id: evaluation.questionId,
      question: evaluation.question,
      answer: evaluation.answer,
      scores: evaluation.scores,
      total_score: evaluation.totalScore,
      overall_feedback: evaluation.overallFeedback,
      strengths: evaluation.strengths,
      improvements: evaluation.improvements,
      pattern_observed: evaluation.patternObserved,
      next_recommendation: evaluation.nextRecommendation,
      confidence: evaluation.confidence,
      created_at: evaluation.createdAt.toISOString(),
    })

  if (error) {
    console.error('[Evaluator] Error saving evaluation:', error)
    // Don't throw - evaluation was generated successfully
  }
}

/**
 * Capture evaluation patterns and feedback as memories
 */
async function captureEvaluationMemories(
  evaluation: Evaluation,
  context: DTCContext
): Promise<void> {
  const memories = []

  // Capture pattern if observed
  if (evaluation.patternObserved) {
    memories.push(
      captureMemory({
        userId: evaluation.userId,
        sourceType: 'a3',
        sourceId: evaluation.id,
        memoryType: 'interview_pattern',
        title: `Patrón en ${evaluation.moduleId}`,
        content: evaluation.patternObserved,
        importance: 0.75,
        confidence: evaluation.confidence,
      })
    )
  }

  // Capture strengths demonstrated
  for (const strength of evaluation.strengths.slice(0, 2)) {
    memories.push(
      captureMemory({
        userId: evaluation.userId,
        sourceType: 'a3',
        sourceId: evaluation.id,
        memoryType: 'strength',
        title: 'Fortaleza demostrada',
        content: strength,
        importance: 0.6,
        confidence: evaluation.confidence,
      })
    )
  }

  // Capture key improvement areas as feedback
  for (const improvement of evaluation.improvements.slice(0, 2)) {
    memories.push(
      captureMemory({
        userId: evaluation.userId,
        sourceType: 'a3',
        sourceId: evaluation.id,
        memoryType: 'feedback_received',
        title: 'Área de mejora identificada',
        content: improvement,
        importance: 0.8,
        confidence: evaluation.confidence,
      })
    )
  }

  await Promise.all(memories)
}

// =============================================================================
// EVALUATION UTILITIES
// =============================================================================

/**
 * Get evaluation history for a user in a module
 */
export async function getEvaluationHistory(
  userId: string,
  moduleId: string,
  limit = 10
): Promise<Evaluation[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('a3_evaluations')
    .select('*')
    .eq('user_id', userId)
    .eq('module_id', moduleId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error || !data) {
    console.error('[Evaluator] Error fetching history:', error)
    return []
  }

  return data.map(mapDbToEvaluation)
}

/**
 * Get average score for a user in a module
 */
export async function getAverageScore(
  userId: string,
  moduleId: string
): Promise<number | null> {
  const history = await getEvaluationHistory(userId, moduleId, 5)
  if (history.length === 0) return null

  const sum = history.reduce((acc, e) => acc + e.totalScore, 0)
  return Math.round(sum / history.length)
}

/**
 * Get improvement trend for a user in a module
 */
export async function getImprovementTrend(
  userId: string,
  moduleId: string
): Promise<'improving' | 'stable' | 'declining' | 'unknown'> {
  const history = await getEvaluationHistory(userId, moduleId, 5)
  if (history.length < 3) return 'unknown'

  // Compare recent 3 vs earlier evaluations
  const recent = history.slice(0, 3)
  const earlier = history.slice(3)

  if (earlier.length === 0) return 'unknown'

  const recentAvg = recent.reduce((a, e) => a + e.totalScore, 0) / recent.length
  const earlierAvg = earlier.reduce((a, e) => a + e.totalScore, 0) / earlier.length

  const diff = recentAvg - earlierAvg

  if (diff > 5) return 'improving'
  if (diff < -5) return 'declining'
  return 'stable'
}

/**
 * Map database row to Evaluation type
 */
function mapDbToEvaluation(row: Record<string, unknown>): Evaluation {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    moduleId: row.module_id as string,
    agentId: row.agent_id as string,
    questionId: row.question_id as string,
    question: row.question as string,
    answer: row.answer as string,
    scores: row.scores as EvaluationScore[],
    totalScore: row.total_score as number,
    overallFeedback: row.overall_feedback as string,
    strengths: row.strengths as string[],
    improvements: row.improvements as string[],
    patternObserved: row.pattern_observed as string | undefined,
    nextRecommendation: row.next_recommendation as string | undefined,
    confidence: row.confidence as number,
    createdAt: new Date(row.created_at as string),
  }
}

/**
 * Format evaluation for display
 */
export function formatEvaluationForDisplay(evaluation: Evaluation): string {
  const scoreEmoji = 
    evaluation.totalScore >= 80 ? '🌟' :
    evaluation.totalScore >= 65 ? '✅' :
    evaluation.totalScore >= 50 ? '📈' : '🔄'

  let text = `${scoreEmoji} **Puntaje: ${evaluation.totalScore}/100**

${evaluation.overallFeedback}

**Fortalezas:**
${evaluation.strengths.map(s => `- ${s}`).join('\n')}

**Áreas de mejora:**
${evaluation.improvements.map(i => `- ${i}`).join('\n')}`

  if (evaluation.nextRecommendation) {
    text += `\n\n**Próximo paso:** ${evaluation.nextRecommendation}`
  }

  return text
}
