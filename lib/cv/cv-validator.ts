/**
 * ATS Validator - Calculates ATS compatibility score for CV
 * Generates specific improvement suggestions
 */

import { ParsedCV } from './cv-parser'

export interface ATSScore {
  overallScore: number // 0-100
  categoryScores: {
    formatting: number
    content: number
    keywords: number
    structure: number
  }
  suggestions: {
    critical: string[] // Must fix
    important: string[] // Should fix
    optional: string[] // Nice to have
  }
  strengths: string[]
  estimatedATSPassRate: number // 0-100
  recommendations: {
    keyword: string
    context: string
  }[]
}

export function calculateATSScore(parsedCV: ParsedCV, jobRequirements?: string[]): ATSScore {
  const formattingScore = calculateFormattingScore(parsedCV)
  const contentScore = calculateContentScore(parsedCV)
  const keywordScore = calculateKeywordScore(parsedCV, jobRequirements)
  const structureScore = calculateStructureScore(parsedCV)

  // Weighted average
  const overallScore = Math.round(
    formattingScore * 0.2 +
    contentScore * 0.3 +
    keywordScore * 0.3 +
    structureScore * 0.2
  )

  const suggestions = generateSuggestions(parsedCV, overallScore)
  const strengths = identifyStrengths(parsedCV)
  const recommendations = generateRecommendations(parsedCV, jobRequirements)

  // Estimated pass rate (ATS systems usually need 70%+ to pass)
  const estimatedATSPassRate = Math.max(0, Math.min(100, overallScore + Math.random() * 10 - 5))

  return {
    overallScore,
    categoryScores: {
      formatting: formattingScore,
      content: contentScore,
      keywords: keywordScore,
      structure: structureScore
    },
    suggestions,
    strengths,
    estimatedATSPassRate,
    recommendations
  }
}

function calculateFormattingScore(cv: ParsedCV): number {
  let score = 100

  // Penalize for formatting issues
  if (!cv.atsReadability.usesBulletPoints) score -= 20 // Prefer bullets
  if (cv.rawText.length < 300) score -= 15 // Too short
  if (cv.rawText.length > 5000) score -= 10 // Too long (ATS may truncate)
  if (/[^\x00-\x7F]/.test(cv.rawText)) score -= 5 // Special characters
  if (cv.rawText.includes('http://') || cv.rawText.includes('https://')) score -= 5 // Prefer LinkedIn in contact

  return Math.max(0, Math.min(100, score))
}

function calculateContentScore(cv: ParsedCV): number {
  let score = 0

  // Sections present
  if (cv.atsReadability.hasContactInfo) score += 15
  if (cv.atsReadability.hasStrongSummary) score += 15
  if (cv.atsReadability.hasClearSections) score += 20
  if (cv.atsReadability.hasActionVerbs) score += 25
  if (cv.atsReadability.hasMetrics) score += 25

  return Math.min(100, score)
}

function calculateKeywordScore(cv: ParsedCV, jobRequirements?: string[]): number {
  let score = 50 // Base score

  // Tech skills diversity
  const uniqueSkills = cv.extractedSkills.length
  if (uniqueSkills >= 10) score += 25
  else if (uniqueSkills >= 5) score += 15
  else if (uniqueSkills >= 3) score += 5

  // Experience years
  const expYears = cv.extractedExperience.length
  if (expYears >= 5) score += 15
  else if (expYears >= 3) score += 10
  else if (expYears >= 1) score += 5

  // Education
  if (cv.extractedEducation.length > 0) score += 10

  // Match against job requirements if provided
  if (jobRequirements) {
    const requirementText = jobRequirements.join(' ').toLowerCase()
    const matchedSkills = cv.extractedSkills.filter(skill =>
      requirementText.includes(skill.toLowerCase())
    )
    const matchPercentage = (matchedSkills.length / cv.extractedSkills.length) * 100
    score += matchPercentage * 0.5
  }

  return Math.min(100, Math.max(0, score))
}

function calculateStructureScore(cv: ParsedCV): number {
  let score = 0

  // Section organization
  const sectionCount = cv.sections.length
  if (sectionCount >= 4) score += 30
  else if (sectionCount >= 3) score += 20
  else if (sectionCount >= 2) score += 10

  // Clear hierarchy (sections found)
  if (cv.sections.some(s => s.type === 'experience')) score += 20
  if (cv.sections.some(s => s.type === 'education')) score += 20
  if (cv.sections.some(s => s.type === 'skills')) score += 20

  // Readability
  const avgLineLength = cv.rawText.split('\n').reduce((sum, line) => sum + line.length, 0) / cv.rawText.split('\n').length
  if (avgLineLength < 100) score += 10 // Good line length for ATS parsing

  return Math.min(100, Math.max(0, score))
}

function generateSuggestions(cv: ParsedCV, overallScore: number): ATSScore['suggestions'] {
  const critical: string[] = []
  const important: string[] = []
  const optional: string[] = []

  // Critical issues
  if (!cv.atsReadability.hasContactInfo) {
    critical.push('Add contact information (email, phone, LinkedIn)')
  }
  if (!cv.atsReadability.hasClearSections) {
    critical.push('Organize CV into clear sections (Experience, Education, Skills)')
  }
  if (cv.extractedExperience.length === 0) {
    critical.push('Add your work experience with job titles and companies')
  }

  // Important improvements
  if (!cv.atsReadability.usesBulletPoints) {
    important.push('Use bullet points (•) instead of paragraph format for better parsing')
  }
  if (!cv.atsReadability.hasActionVerbs) {
    important.push('Start bullet points with action verbs (Developed, Designed, Led, etc.)')
  }
  if (!cv.atsReadability.hasMetrics) {
    important.push('Add quantifiable results (%, increased X by Y, etc.)')
  }
  if (cv.extractedSkills.length < 5) {
    important.push(`Add more technical skills to your skills section (you have ${cv.extractedSkills.length}, aim for 8-10)`)
  }

  // Optional improvements
  if (cv.rawText.length < 400) {
    optional.push('Expand your CV with more detail about your achievements')
  }
  if (!cv.atsReadability.hasStrongSummary) {
    optional.push('Add a professional summary that highlights key achievements')
  }

  return { critical, important, optional }
}

function identifyStrengths(cv: ParsedCV): string[] {
  const strengths: string[] = []

  if (cv.atsReadability.hasContactInfo) {
    strengths.push('Complete contact information included')
  }
  if (cv.atsReadability.hasActionVerbs) {
    strengths.push('Uses strong action verbs for impact')
  }
  if (cv.atsReadability.hasMetrics) {
    strengths.push('Includes quantifiable achievements and metrics')
  }
  if (cv.atsReadability.usesBulletPoints) {
    strengths.push('Well-formatted with bullet points for readability')
  }
  if (cv.extractedSkills.length >= 8) {
    strengths.push(`Comprehensive skills section with ${cv.extractedSkills.length} technical skills`)
  }
  if (cv.extractedExperience.length >= 3) {
    strengths.push(`Solid work history with ${cv.extractedExperience.length} positions`)
  }

  return strengths
}

function generateRecommendations(cv: ParsedCV, jobRequirements?: string[]): ATSScore['recommendations'] {
  const recommendations: ATSScore['recommendations'][] = []

  if (!jobRequirements) return recommendations

  const requirementText = jobRequirements.join(' ')
  const requiredSkills = [
    'React', 'Node.js', 'Python', 'AWS', 'SQL', 'Docker', 'JavaScript',
    'TypeScript', 'MongoDB', 'PostgreSQL', 'Go', 'Rust'
  ]

  requiredSkills.forEach(skill => {
    if (requirementText.toLowerCase().includes(skill.toLowerCase()) &&
        !cv.extractedSkills.some(s => s.toLowerCase().includes(skill.toLowerCase()))) {
      recommendations.push({
        keyword: skill,
        context: `Job requires ${skill} - consider adding if you have experience`
      })
    }
  })

  return recommendations.slice(0, 5) // Top 5 recommendations
}

export function formatSuggestionsForDisplay(suggestions: ATSScore['suggestions']): string {
  let text = ''

  if (suggestions.critical.length > 0) {
    text += '⚠️ Critical Issues:\n'
    suggestions.critical.forEach(s => text += `• ${s}\n`)
    text += '\n'
  }

  if (suggestions.important.length > 0) {
    text += '📋 Important Improvements:\n'
    suggestions.important.forEach(s => text += `• ${s}\n`)
    text += '\n'
  }

  if (suggestions.optional.length > 0) {
    text += '✨ Optional Enhancements:\n'
    suggestions.optional.forEach(s => text += `• ${s}\n`)
  }

  return text
}
