import OpenAI from 'openai'
import { cacheManager } from '@/lib/cache/cache-manager'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface EmbeddingResult {
  text: string
  embedding: number[]
  model: string
}

export interface SemanticMatch {
  jobId: string
  jobTitle: string
  similarityScore: number
  reasoning: string
}

/**
 * Generate embeddings for job descriptions using OpenAI
 * Results are cached for 1 week to reduce API costs
 */
export async function generateJobEmbedding(jobData: {
  id: string
  title: string
  description: string
  skills: string[]
  industry: string
}): Promise<EmbeddingResult> {
  const cacheKey = `embedding:job:${jobData.id}`
  
  // Check cache first
  const cached = cacheManager.get<EmbeddingResult>(cacheKey)
  if (cached) {
    console.log('[v0] Using cached embedding for job:', jobData.id)
    return cached
  }

  try {
    // Build comprehensive text for embedding
    const fullText = `
Job Title: ${jobData.title}
Industry: ${jobData.industry}
Description: ${jobData.description}
Required Skills: ${jobData.skills.join(', ')}
    `.trim()

    console.log('[v0] Generating embedding for:', jobData.title)

    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small', // Faster, cheaper, still high quality
      input: fullText,
    })

    const embedding: EmbeddingResult = {
      text: fullText,
      embedding: response.data[0].embedding,
      model: response.model,
    }

    // Cache for 1 week (604800 seconds)
    cacheManager.set(cacheKey, embedding, 604800)

    return embedding
  } catch (error) {
    console.error('[v0] Embedding generation error:', error)
    throw error
  }
}

/**
 * Generate embeddings for user profile
 */
export async function generateUserEmbedding(userData: {
  userId: string
  skills: string[]
  experience: number
  jobPreferences: string[]
}): Promise<EmbeddingResult> {
  const cacheKey = `embedding:user:${userData.userId}`

  const cached = cacheManager.get<EmbeddingResult>(cacheKey)
  if (cached) {
    console.log('[v0] Using cached embedding for user:', userData.userId)
    return cached
  }

  try {
    const fullText = `
User Profile
Skills: ${userData.skills.join(', ')}
Experience: ${userData.experience} years
Job Preferences: ${userData.jobPreferences.join(', ')}
    `.trim()

    console.log('[v0] Generating embedding for user:', userData.userId)

    const response = await openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: fullText,
    })

    const embedding: EmbeddingResult = {
      text: fullText,
      embedding: response.data[0].embedding,
      model: response.model,
    }

    // Cache for 5 minutes (user profile changes more often)
    cacheManager.set(cacheKey, embedding, 300)

    return embedding
  } catch (error) {
    console.error('[v0] User embedding error:', error)
    throw error
  }
}

/**
 * Calculate cosine similarity between two embeddings
 * Returns value between 0 (completely different) and 1 (identical)
 */
export function cosineSimilarity(vec1: number[], vec2: number[]): number {
  if (vec1.length !== vec2.length) {
    throw new Error('Vectors must have same length')
  }

  let dotProduct = 0
  let norm1 = 0
  let norm2 = 0

  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i]
    norm1 += vec1[i] * vec1[i]
    norm2 += vec2[i] * vec2[i]
  }

  norm1 = Math.sqrt(norm1)
  norm2 = Math.sqrt(norm2)

  if (norm1 === 0 || norm2 === 0) {
    return 0
  }

  return dotProduct / (norm1 * norm2)
}

/**
 * Find semantically similar jobs for a user
 */
export async function findSemanticMatches(
  userEmbedding: number[],
  jobEmbeddings: Array<{ jobId: string; jobTitle: string; embedding: number[] }>,
  threshold: number = 0.5
): Promise<SemanticMatch[]> {
  const matches: SemanticMatch[] = []

  for (const job of jobEmbeddings) {
    const similarity = cosineSimilarity(userEmbedding, job.embedding)

    if (similarity >= threshold) {
      matches.push({
        jobId: job.jobId,
        jobTitle: job.jobTitle,
        similarityScore: similarity,
        reasoning: generateReasoningText(similarity),
      })
    }
  }

  // Sort by similarity score descending
  return matches.sort((a, b) => b.similarityScore - a.similarityScore)
}

/**
 * Generate human-readable reasoning for semantic match
 */
function generateReasoningText(score: number): string {
  if (score >= 0.85) {
    return 'Excellent semantic match - Your profile aligns perfectly with this role'
  } else if (score >= 0.75) {
    return 'Strong semantic match - Your skills and background fit well'
  } else if (score >= 0.65) {
    return 'Good semantic match - Significant overlap with job requirements'
  } else if (score >= 0.55) {
    return 'Moderate semantic match - Some alignment found'
  } else {
    return 'Potential match - May have growth opportunity'
  }
}

/**
 * Combine semantic score with rule-based score
 * 60% semantic + 40% rule-based for balanced results
 */
export function combineScores(
  semanticScore: number,
  ruleBasedScore: number
): {
  combined: number
  semantic: number
  ruleBased: number
  breakdown: string
} {
  const combined = semanticScore * 0.6 + (ruleBasedScore / 100) * 0.4
  const combinedPercent = Math.round(combined * 100)

  return {
    combined: combinedPercent,
    semantic: Math.round(semanticScore * 100),
    ruleBased: ruleBasedScore,
    breakdown: `Semantic: ${Math.round(semanticScore * 100)}% (60% weight) + Rule-based: ${ruleBasedScore}% (40% weight) = ${combinedPercent}%`,
  }
}
