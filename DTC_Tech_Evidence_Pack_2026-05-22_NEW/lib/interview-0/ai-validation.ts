'use client'

/**
 * Interview Validation System
 * MVP: Rule-based validation without AI SDK dependencies
 */

export async function validatePresenceAnalysis(
  detectionData: {
    posture: number
    eyeContact: number
    lighting: number
    backgroundQuality: number
    overallScore: number
  }
): Promise<{
  isValid: boolean
  score: number
  issues: string[]
  tips: string[]
}> {
  const issues: string[] = []
  const tips: string[] = []

  if (detectionData.posture < 60) {
    issues.push('Posture could be more professional')
    tips.push('Sit with your back against the chair')
  }

  if (detectionData.eyeContact < 60) {
    issues.push('Eye contact needs improvement')
    tips.push('Look at the camera to create connection')
  }

  if (detectionData.lighting < 50) {
    issues.push('Lighting is too dark')
    tips.push('Position a light source in front of you')
  }

  if (detectionData.backgroundQuality < 60) {
    issues.push('Background appears unprofessional')
    tips.push('Use a neutral background')
  }

  return {
    isValid: issues.length === 0,
    score: Math.round(detectionData.overallScore),
    issues,
    tips: tips.slice(0, 3),
  }
}

export async function validateAudioQuality(
  audioLevel: number,
  testDuration: number = 3
): Promise<{
  isValid: boolean
  score: number
  issues: string[]
  tips: string[]
}> {
  const issues: string[] = []
  const tips: string[] = []

  if (audioLevel < 8) {
    issues.push('Audio level is too low')
    tips.push('Move closer to your microphone')
  }

  if (audioLevel > 95) {
    issues.push('Audio level is too high - risk of distortion')
    tips.push('Move further from the microphone or reduce volume')
  }

  return {
    isValid: audioLevel >= 8 && audioLevel <= 95,
    score: Math.min(100, audioLevel * 2),
    issues,
    tips: tips.slice(0, 3),
  }
}

export async function validatePreparationResponses(
  role: string,
  company: string,
  achievements: string
): Promise<{
  isValid: boolean
  confidence: number
  issues: string[]
  feedback: string
}> {
  const issues: string[] = []

  // Check minimum length
  if (role.length < 3) {
    issues.push('Role/position is too short')
  }

  if (company.length < 2) {
    issues.push('Company/objective is too short')
  }

  if (achievements.length < 20) {
    issues.push('Achievements section needs more detail')
  }

  // Check for spam (repeated characters)
  if (/^(.)\1{5,}/.test(role) || /^(.)\1{5,}/.test(company) || /^(.)\1{5,}/.test(achievements)) {
    issues.push('Responses appear to contain invalid content')
  }

  const isValid = issues.length === 0

  return {
    isValid,
    confidence: isValid ? 85 : 0,
    issues,
    feedback: isValid
      ? 'Responses look professional and well-structured'
      : 'Please provide genuine, detailed responses for better validation',
  }
}
