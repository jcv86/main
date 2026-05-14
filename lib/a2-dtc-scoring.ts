/**
 * A2 DTC (Day 1: The Contract) Scoring Logic
 * 
 * This module implements the Day 1 submission scoring system.
 * Day 1 is The Contract With Yourself - the gate before A3 unlocks.
 * 
 * Scoring Model:
 * - 4 criteria, 25 points each, total 100 points
 * - Pass threshold: 75+ points
 * - Criteria: vision clarity, milestone quality, completeness, realism
 */

export interface DTCCriteria {
  visionClarity: number // 0-25 points
  milestoneQuality: number // 0-25 points
  completeness: number // 0-25 points
  realism: number // 0-25 points
}

export interface DTCScoringResult {
  totalScore: number // 0-100
  passed: boolean // true if >= 75
  criteria: DTCCriteria
  breakdown: string[] // Human-readable feedback per criterion
  recommendations: string[] // What to improve
  timestamp: Date
}

export interface Day1Submission {
  userId: string
  submissionId: string
  visionRole: string
  visionDesiredOutcome: string
  visionEnvironment: string
  milestoneDay10: string
  milestoneDay20: string
  milestoneDay30: string
  actionPlan: Record<string, unknown>
  documentUrl?: string
  createdAt: Date
}

/**
 * Score vision clarity (0-25 points)
 * Evaluates how clear and specific the user's vision is
 */
function scoreVisionClarity(submission: Day1Submission): { score: number; feedback: string } {
  let score = 0
  const feedbacks: string[] = []

  // Role clarity: 0-8 points
  if (submission.visionRole && submission.visionRole.length > 50) {
    score += 8
    feedbacks.push('✓ Role clearly defined')
  } else if (submission.visionRole && submission.visionRole.length > 20) {
    score += 5
    feedbacks.push('⚠ Role could be more specific')
  } else {
    feedbacks.push('✗ Role needs definition')
  }

  // Desired outcome clarity: 0-9 points
  if (submission.visionDesiredOutcome && submission.visionDesiredOutcome.length > 80) {
    score += 9
    feedbacks.push('✓ Desired outcome well described')
  } else if (submission.visionDesiredOutcome && submission.visionDesiredOutcome.length > 30) {
    score += 6
    feedbacks.push('⚠ Desired outcome needs expansion')
  } else {
    feedbacks.push('✗ Desired outcome incomplete')
  }

  // Environment clarity: 0-8 points
  if (submission.visionEnvironment && submission.visionEnvironment.length > 50) {
    score += 8
    feedbacks.push('✓ Work environment well described')
  } else if (submission.visionEnvironment && submission.visionEnvironment.length > 20) {
    score += 4
    feedbacks.push('⚠ Work environment could be clearer')
  } else {
    feedbacks.push('✗ Work environment not described')
  }

  return {
    score: Math.min(score, 25),
    feedback: feedbacks.join(' | '),
  }
}

/**
 * Score milestone quality (0-25 points)
 * Evaluates if milestones are realistic and well-defined
 */
function scoreMilestoneQuality(submission: Day1Submission): { score: number; feedback: string } {
  let score = 0
  const feedbacks: string[] = []

  const milestones = [submission.milestoneDay10, submission.milestoneDay20, submission.milestoneDay30]
  const completeMilestones = milestones.filter((m) => m && m.length > 20).length

  // Milestone presence: 0-15 points
  if (completeMilestones === 3) {
    score += 15
    feedbacks.push('✓ All three milestones defined')
  } else if (completeMilestones === 2) {
    score += 10
    feedbacks.push('⚠ Missing one milestone')
  } else if (completeMilestones === 1) {
    score += 5
    feedbacks.push('✗ Only one milestone found')
  } else {
    feedbacks.push('✗ No milestones defined')
  }

  // Milestone specificity: 0-10 points
  const avgMilestoneLength = milestones.reduce((sum, m) => sum + (m?.length || 0), 0) / 3
  if (avgMilestoneLength > 60) {
    score += 10
    feedbacks.push('✓ Milestones are specific')
  } else if (avgMilestoneLength > 30) {
    score += 6
    feedbacks.push('⚠ Milestones need more detail')
  } else {
    feedbacks.push('⚠ Milestones too vague')
  }

  return {
    score: Math.min(score, 25),
    feedback: feedbacks.join(' | '),
  }
}

/**
 * Score completeness (0-25 points)
 * Evaluates if all required sections are filled with substantial content
 */
function scoreCompleteness(submission: Day1Submission): { score: number; feedback: string } {
  let score = 0
  const feedbacks: string[] = []

  // Check all required fields
  const requiredFields = {
    visionRole: submission.visionRole && submission.visionRole.length > 10,
    visionDesiredOutcome: submission.visionDesiredOutcome && submission.visionDesiredOutcome.length > 10,
    visionEnvironment: submission.visionEnvironment && submission.visionEnvironment.length > 10,
    milestoneDay10: submission.milestoneDay10 && submission.milestoneDay10.length > 10,
    milestoneDay20: submission.milestoneDay20 && submission.milestoneDay20.length > 10,
    milestoneDay30: submission.milestoneDay30 && submission.milestoneDay30.length > 10,
    actionPlan: submission.actionPlan && Object.keys(submission.actionPlan).length > 0,
  }

  const completedFields = Object.values(requiredFields).filter(Boolean).length
  const totalFields = Object.keys(requiredFields).length

  // Field completion: 0-25 points
  const completionPercentage = (completedFields / totalFields) * 100
  score = Math.round((completionPercentage / 100) * 25)

  if (completionPercentage === 100) {
    feedbacks.push('✓ All sections completed')
  } else if (completionPercentage >= 70) {
    feedbacks.push(`⚠ Missing ${totalFields - completedFields} section(s)`)
  } else {
    feedbacks.push(`✗ Only ${completedFields}/${totalFields} sections completed`)
  }

  return {
    score: Math.min(score, 25),
    feedback: feedbacks.join(' | '),
  }
}

/**
 * Score realism (0-25 points)
 * Evaluates if vision and milestones are achievable within the 90-day timeframe
 */
function scoreRealism(submission: Day1Submission): { score: number; feedback: string } {
  let score = 0
  const feedbacks: string[] = []

  // Check action plan structure
  if (submission.actionPlan && Object.keys(submission.actionPlan).length > 0) {
    score += 8
    feedbacks.push('✓ Action plan structured')
  } else {
    feedbacks.push('⚠ Action plan needs structure')
  }

  // Milestone progression check: milestones should escalate
  const day10Len = submission.milestoneDay10?.length || 0
  const day20Len = submission.milestoneDay20?.length || 0
  const day30Len = submission.milestoneDay30?.length || 0

  // Progression heuristic: later milestones should have depth
  if (day10Len > 0 && day20Len > 0 && day30Len > 0) {
    if (day30Len > day10Len) {
      score += 10
      feedbacks.push('✓ Milestone progression appears realistic')
    } else {
      score += 5
      feedbacks.push('⚠ Milestone progression unclear')
    }
  }

  // Role and environment reasonableness
  const roleLen = submission.visionRole?.length || 0
  const envLen = submission.visionEnvironment?.length || 0

  if (roleLen > 40 && envLen > 40) {
    score += 7
    feedbacks.push('✓ Vision grounded in context')
  } else {
    score += 3
    feedbacks.push('⚠ Vision needs more context')
  }

  return {
    score: Math.min(score, 25),
    feedback: feedbacks.join(' | '),
  }
}

/**
 * Main scoring function
 * Calculates the complete DTC score for a Day 1 submission
 */
export function scoreDay1Submission(submission: Day1Submission): DTCScoringResult {
  const visionClarity = scoreVisionClarity(submission)
  const milestoneQuality = scoreMilestoneQuality(submission)
  const completeness = scoreCompleteness(submission)
  const realism = scoreRealism(submission)

  const totalScore =
    visionClarity.score + milestoneQuality.score + completeness.score + realism.score

  const passed = totalScore >= 75

  const criteria: DTCCriteria = {
    visionClarity: visionClarity.score,
    milestoneQuality: milestoneQuality.score,
    completeness: completeness.score,
    realism: realism.score,
  }

  const breakdown = [
    `Vision Clarity: ${visionClarity.score}/25 — ${visionClarity.feedback}`,
    `Milestone Quality: ${milestoneQuality.score}/25 — ${milestoneQuality.feedback}`,
    `Completeness: ${completeness.score}/25 — ${completeness.feedback}`,
    `Realism: ${realism.score}/25 — ${realism.feedback}`,
  ]

  const recommendations: string[] = []
  if (visionClarity.score < 20) recommendations.push('Expand your vision description with specific details')
  if (milestoneQuality.score < 20) recommendations.push('Add more concrete milestones for each 10-day period')
  if (completeness.score < 20) recommendations.push('Complete all sections with meaningful content')
  if (realism.score < 20) recommendations.push('Ensure milestones are achievable within 90 days')

  return {
    totalScore,
    passed,
    criteria,
    breakdown,
    recommendations,
    timestamp: new Date(),
  }
}

/**
 * Format scoring result for display
 */
export function formatScoringResult(result: DTCScoringResult): string {
  const status = result.passed ? '✓ PASS' : '✗ NEEDS REVISION'
  const lines = [
    `═══════════════════════════════════════`,
    `Day 1: The Contract With Yourself - Scoring`,
    `${status} | Total Score: ${result.totalScore}/100`,
    `═══════════════════════════════════════`,
    ...result.breakdown,
    `═══════════════════════════════════════`,
  ]

  if (result.recommendations.length > 0) {
    lines.push('Recommendations to improve:')
    result.recommendations.forEach((rec) => lines.push(`• ${rec}`))
  }

  return lines.join('\n')
}
