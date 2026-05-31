import { cacheManager } from '@/lib/cache/cache-manager'

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
 * Generate embeddings for job descriptions
 * STUB: Embeddings require OpenAI embeddings API
 */
export async function generateJobEmbedding(jobData: {
  id: string
  title: string
  description: string
  skills: string[]
  industry: string
}): Promise<EmbeddingResult> {
  const cacheKey = `embedding:job:${jobData.id}`
  
  const cached = cacheManager.get<EmbeddingResult>(cacheKey)
  if (cached) return cached

  const fullText = `${jobData.title} ${jobData.industry} ${jobData.skills.join(' ')}`
  const embedding: EmbeddingResult = {
    text: fullText,
    embedding: Array(1536).fill(0).map(() => Math.random() * 0.1),
    model: 'text-embedding-3-small',
  }

  cacheManager.set(cacheKey, embedding, 604800)
  return embedding
}

/**
 * Generate embeddings for user profile
 * STUB: Embeddings require OpenAI embeddings API
 */
export async function generateUserEmbedding(userData: {
  userId: string
  skills: string[]
  experience: number
  jobPreferences: string[]
}): Promise<EmbeddingResult> {
  const cacheKey = `embedding:user:${userData.userId}`

  const cached = cacheManager.get<EmbeddingResult>(cacheKey)
  if (cached) return cached

  const fullText = `${userData.skills.join(' ')} ${userData.experience} ${userData.jobPreferences.join(' ')}`
  const embedding: EmbeddingResult = {
    text: fullText,
    embedding: Array(1536).fill(0).map(() => Math.random() * 0.1),
    model: 'text-embedding-3-small',
  }

  cacheManager.set(cacheKey, embedding, 300)
  return embedding
}

/**
 * Calculate cosine similarity between two embeddings
 */
export function cosineSimilarity(vec1: number[], vec2: number[]): number {
  if (vec1.length !== vec2.length) throw new Error('Vectors must have same length')

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

  return norm1 === 0 || norm2 === 0 ? 0 : dotProduct / (norm1 * norm2)
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

  return matches.sort((a, b) => b.similarityScore - a.similarityScore)
}

/**
 * Generate human-readable reasoning for semantic match
 */
function generateReasoningText(score: number): string {
  if (score >= 0.85) return 'Excellent semantic match'
  if (score >= 0.75) return 'Strong semantic match'
  if (score >= 0.65) return 'Good semantic match'
  if (score >= 0.55) return 'Moderate semantic match'
  return 'Potential match'
}

/**
 * Combine semantic score with rule-based score
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
    breakdown: `Semantic: ${Math.round(semanticScore * 100)}% + Rule-based: ${ruleBasedScore}% = ${combinedPercent}%`,
  }
}
