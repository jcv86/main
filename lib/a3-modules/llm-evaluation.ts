// LLM-based evaluation service for modules using Claude API via Vercel AI Gateway
import { generateObject } from 'ai';
import { z } from 'zod';
import type {
  EvaluationResponse,
  RubricScoring,
} from './types';

// Zod schema for LLM response validation
const EvaluationSchema = z.object({
  totalScore: z.number().min(0).max(100),
  criteriaScores: z.record(z.string(), z.number()),
  feedback: z.string(),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
});

export interface EvaluationRequest {
  rubric: RubricScoring;
  response: {
    type: 'text' | 'transcription' | 'interview';
    content: string;
  };
  context?: {
    moduleId: string;
    sectionId: string;
    questionAsked?: string;
  };
}

/**
 * Evaluates user response using Claude API with structured output
 * Supports text, transcriptions, and interview feedback
 */
export async function evaluateResponseWithLLM(
  request: EvaluationRequest
): Promise<EvaluationResponse> {
  const {
    rubric,
    response,
    context,
  } = request;

  // Build evaluation prompt
  const prompt = buildEvaluationPrompt(rubric, response, context);

  try {
    const result = await generateObject({
      model: 'anthropic/claude-3-5-sonnet-20241022',
      schema: EvaluationSchema,
      prompt,
      system: `You are an expert evaluator for professional development modules. 
Your task is to evaluate user responses based on provided rubrics with specific criteria and weights.
Provide detailed feedback, identify strengths, and suggest improvements.
Be fair but rigorous in your assessment.`,
    });

    // Validate and normalize scores
    return normalizeEvaluationResponse(result.object, rubric);
  } catch (error) {
    console.error('[LLM Evaluation Error]', error);
    throw new Error(`Failed to evaluate response: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Builds the evaluation prompt based on rubric and response
 */
function buildEvaluationPrompt(
  rubric: RubricScoring,
  response: { type: string; content: string },
  context?: { moduleId?: string; sectionId?: string; questionAsked?: string }
): string {
  const criteriaList = rubric.criteria
    .map(
      (c) =>
        `- ${c.name} (${c.weight}% weight, max ${c.maxPoints} points): ${c.description}`
    )
    .join('\n');

  let prompt = `Evaluate the following ${response.type} response:\n\n`;

  if (context?.questionAsked) {
    prompt += `Question: ${context.questionAsked}\n\n`;
  }

  prompt += `Response:\n"${response.content}"\n\n`;
  prompt += `Evaluation Criteria (Total: ${rubric.totalPoints} points):\n${criteriaList}\n\n`;
  prompt += `${rubric.instructions}\n\n`;
  prompt += `Provide your evaluation in the exact JSON format requested.`;

  return prompt;
}

/**
 * Normalizes LLM response to ensure scores are within bounds
 */
function normalizeEvaluationResponse(
  response: z.infer<typeof EvaluationSchema>,
  rubric: RubricScoring
): EvaluationResponse {
  // Ensure total score doesn't exceed 100
  const totalScore = Math.min(100, Math.max(0, response.totalScore));

  // Normalize criteria scores to respect rubric max points
  const normalizedCriteriaScores: Record<string, number> = {};
  for (const [criteriaName, score] of Object.entries(response.criteriaScores)) {
    const rubricCriteria = rubric.criteria.find((c) => c.name === criteriaName);
    if (rubricCriteria) {
      normalizedCriteriaScores[criteriaName] = Math.min(
        rubricCriteria.maxPoints,
        Math.max(0, score)
      );
    }
  }

  return {
    totalScore,
    criteriaScores: normalizedCriteriaScores,
    feedback: response.feedback,
    strengths: response.strengths.slice(0, 5), // Limit to 5 strengths
    improvements: response.improvements.slice(0, 5), // Limit to 5 improvements
  };
}

/**
 * Batch evaluate multiple responses efficiently
 */
export async function batchEvaluateResponses(
  requests: EvaluationRequest[]
): Promise<EvaluationResponse[]> {
  // Process in parallel with rate limiting (max 5 concurrent)
  const results: EvaluationResponse[] = [];
  for (let i = 0; i < requests.length; i += 5) {
    const batch = requests.slice(i, i + 5);
    const batchResults = await Promise.all(
      batch.map((req) => evaluateResponseWithLLM(req))
    );
    results.push(...batchResults);
  }
  return results;
}

/**
 * Auto-score multiple choice tests
 */
export function autoScoreMultipleChoice(
  userAnswers: string[],
  correctAnswers: string[],
  pointsPerQuestion: number
): number {
  let score = 0;
  for (let i = 0; i < userAnswers.length; i++) {
    if (userAnswers[i] === correctAnswers[i]) {
      score += pointsPerQuestion;
    }
  }
  return score;
}

/**
 * Calculate weighted score across multiple sections
 */
export function calculateWeightedModuleScore(
  sectionScores: Record<string, { score: number; weight: number }>
): number {
  let totalWeightedScore = 0;
  let totalWeight = 0;

  for (const [, { score, weight }] of Object.entries(sectionScores)) {
    totalWeightedScore += score * weight;
    totalWeight += weight;
  }

  return totalWeight > 0 ? totalWeightedScore / totalWeight : 0;
}
