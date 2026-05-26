/**
 * A4 Document Intelligence System
 * 
 * Links interview answers and evidence to strategic documents
 * Extracts insights from documents
 * Provides portfolio recommendations
 */

import { buildDtcContext } from './context/context-builder'
import type { DTCContext } from './types'

export interface DocumentInsight {
  documentId: string
  insightType: 'strength_indicator' | 'experience_evidence' | 'skill_demonstration' | 'impact_metric'
  content: string
  confidence: number // 0-1
  linkedModules: string[]
}

export interface EvidenceLink {
  documentId: string
  linkedToType: 'career_goal' | 'module' | 'interview' | 'weakness'
  linkedToId?: string
  strength: number // 0-1 how strongly this document supports the link
}

/**
 * Extract insights from a document
 */
export async function extractDocumentInsights(
  userId: string,
  documentId: string,
  documentContent: string
): Promise<{ success: boolean; insights: DocumentInsight[]; error?: string }> {
  try {
    // Build user context to understand what to look for
    const context = await buildDtcContext({
      userId,
      command: '/dtc:a4-review-document' as any,
      agent: 'coach' as any,
      mode: 'coaching',
    })

    if (!context.success) {
      console.log('[v0] Context building failed for document analysis')
      return { success: false, insights: [] }
    }

    const careerGoal = context.context?.memory?.find((m: any) => m.memoryType === 'career_goal')?.content
    const weaknesses = context.context?.memory?.filter((m: any) => m.memoryType === 'weakness') || []

    const insights: DocumentInsight[] = []

    // Analyze for strength indicators
    const strengthIndicators = extractStrengthIndicators(documentContent, careerGoal)
    insights.push(...strengthIndicators)

    // Analyze for experience evidence
    const experienceEvidence = extractExperienceEvidence(documentContent, careerGoal)
    insights.push(...experienceEvidence)

    // Analyze for skill demonstrations
    const skillDemonstrations = extractSkillDemonstrations(documentContent, weaknesses)
    insights.push(...skillDemonstrations)

    // Analyze for impact metrics
    const impactMetrics = extractImpactMetrics(documentContent)
    insights.push(...impactMetrics)

    return {
      success: true,
      insights: insights.map((insight) => ({
        ...insight,
        documentId,
      })),
    }
  } catch (error) {
    console.error('[v0] Error extracting document insights:', error)
    return {
      success: false,
      insights: [],
      error: String(error),
    }
  }
}

function extractStrengthIndicators(content: string, careerGoal?: string): DocumentInsight[] {
  const indicators: DocumentInsight[] = []

  // Look for achievement indicators
  const achievements = [
    'led', 'managed', 'improved', 'increased', 'grew', 'developed', 'created', 'launched',
    'scaled', 'transformed', 'optimized', 'streamlined', 'pioneered', 'established'
  ]

  achievements.forEach((achievement) => {
    if (content.toLowerCase().includes(achievement)) {
      indicators.push({
        documentId: '',
        insightType: 'strength_indicator',
        content: `Document demonstrates achievement capability: "${achievement}"`,
        confidence: 0.7,
        linkedModules: ['liderazgo', 'impacto', 'resultados'],
      })
    }
  })

  // Look for quantifiable results
  const numberMatch = content.match(/(\d+)%|\$[\d,]+|(\d+)x|grew (\d+)/gi)
  if (numberMatch) {
    indicators.push({
      documentId: '',
      insightType: 'impact_metric',
      content: `Document contains quantifiable metrics: ${numberMatch.join(', ')}`,
      confidence: 0.9,
      linkedModules: ['analisis-vacante', 'metodo-star'],
    })
  }

  return indicators
}

function extractExperienceEvidence(content: string, careerGoal?: string): DocumentInsight[] {
  const evidence: DocumentInsight[] = []

  // Look for relevant experience
  const experiences = [
    'project', 'initiative', 'campaign', 'team', 'responsibility', 'role', 'position',
    'worked', 'collaborated', 'partnered', 'stakeholder'
  ]

  const experienceCount = experiences.filter((exp) => content.toLowerCase().includes(exp)).length

  if (experienceCount > 0) {
    evidence.push({
      documentId: '',
      insightType: 'experience_evidence',
      content: `Document demonstrates ${experienceCount} relevant experience areas`,
      confidence: 0.8,
      linkedModules: ['auditoria-inicial', 'cv-inteligente'],
    })
  }

  // Check for goal alignment
  if (careerGoal && content.toLowerCase().includes(careerGoal.toLowerCase())) {
    evidence.push({
      documentId: '',
      insightType: 'experience_evidence',
      content: `Document directly references career goal: "${careerGoal}"`,
      confidence: 0.95,
      linkedModules: ['analisis-vacante'],
    })
  }

  return evidence
}

function extractSkillDemonstrations(content: string, weaknesses: any[]): DocumentInsight[] {
  const demonstrations: DocumentInsight[] = []

  // Look for skill keywords
  const skills = [
    'communication', 'leadership', 'problem-solving', 'analysis', 'strategy',
    'technical', 'execution', 'negotiation', 'presentation', 'innovation'
  ]

  skills.forEach((skill) => {
    if (content.toLowerCase().includes(skill)) {
      demonstrations.push({
        documentId: '',
        insightType: 'skill_demonstration',
        content: `Document demonstrates skill in: ${skill}`,
        confidence: 0.75,
        linkedModules: ['metodo-star', 'entrenamiento-estructurado'],
      })
    }
  })

  // If user has identified weakness, look for evidence of improvement
  weaknesses.forEach((weakness: any) => {
    if (weakness.content && content.toLowerCase().includes(weakness.content.toLowerCase())) {
      demonstrations.push({
        documentId: '',
        insightType: 'skill_demonstration',
        content: `Document shows development in identified weakness: "${weakness.content}"`,
        confidence: 0.85,
        linkedModules: ['entrenamiento-guiado'],
      })
    }
  })

  return demonstrations
}

function extractImpactMetrics(content: string): DocumentInsight[] {
  const metrics: DocumentInsight[] = []

  // Extract numbers and business terms
  const businessTerms = ['revenue', 'cost', 'efficiency', 'growth', 'market', 'sales', 'users', 'engagement']

  businessTerms.forEach((term) => {
    if (content.toLowerCase().includes(term)) {
      metrics.push({
        documentId: '',
        insightType: 'impact_metric',
        content: `Document references business metric: ${term}`,
        confidence: 0.7,
        linkedModules: ['analisis-multimodal'],
      })
    }
  })

  return metrics
}

/**
 * Link a document to career goals and modules
 */
export async function linkDocumentToEvidence(
  userId: string,
  documentId: string,
  linkedToType: 'career_goal' | 'module' | 'interview' | 'weakness',
  linkedToId?: string,
  strength: number = 0.5
): Promise<EvidenceLink> {
  return {
    documentId,
    linkedToType,
    linkedToId,
    strength: Math.max(0, Math.min(1, strength)), // Clamp 0-1
  }
}

/**
 * Recommend documents for A4 based on interview performance
 */
export async function recommendDocuments(
  userId: string,
  interviewModuleId: string,
  interviewScore: number
): Promise<{
  success: boolean
  recommendations: {
    title: string
    reason: string
    targetModule: string
    priority: 'high' | 'medium' | 'low'
  }[]
}> {
  try {
    const context = await buildDtcContext({
      userId,
      command: '/dtc:a4-create-document' as any,
      agent: 'coach' as any,
      mode: 'coaching',
    })

    if (!context.success) {
      return { success: false, recommendations: [] }
    }

    const recommendations: {
      title: string
      reason: string
      targetModule: string
      priority: 'high' | 'medium' | 'low'
    }[] = []

    const careerGoal = context.context?.memory?.find((m: any) => m.memoryType === 'career_goal')?.content
    const weaknesses = context.context?.memory?.filter((m: any) => m.memoryType === 'weakness') || []
    const documentCount = context.context?.documents?.length || 0

    // If low score, recommend focused document
    if (interviewScore < 60) {
      recommendations.push({
        title: 'Focused STAR Response Document',
        reason: `Your interview score of ${interviewScore}% suggests focusing on structured storytelling`,
        targetModule: 'metodo-star',
        priority: 'high',
      })

      if (weaknesses.length > 0) {
        recommendations.push({
          title: `Master Your Weakness: ${weaknesses[0]?.content}`,
          reason: `Focus document on overcoming: ${weaknesses[0]?.content}`,
          targetModule: 'entrenamiento-guiado',
          priority: 'high',
        })
      }
    }

    // If medium score, recommend strategic document
    if (interviewScore >= 60 && interviewScore < 80) {
      recommendations.push({
        title: 'Strategic Impact Portfolio',
        reason: `Your score of ${interviewScore}% is solid. Now demonstrate strategic impact.`,
        targetModule: 'analisis-multimodal',
        priority: 'medium',
      })

      if (documentCount < 3) {
        recommendations.push({
          title: 'Career Goal Evidence Document',
          reason: `Create evidence supporting your goal: ${careerGoal}`,
          targetModule: 'analisis-vacante',
          priority: 'medium',
        })
      }
    }

    // If high score, recommend executive document
    if (interviewScore >= 80) {
      recommendations.push({
        title: 'Executive Leadership Case Study',
        reason: `Excellent score of ${interviewScore}%. Create an executive-level case study.`,
        targetModule: 'evaluacion-final',
        priority: 'medium',
      })

      recommendations.push({
        title: 'Strategic Vision Document',
        reason: `Document your long-term strategy for: ${careerGoal}`,
        targetModule: 'analisis-multimodal',
        priority: 'low',
      })
    }

    return {
      success: true,
      recommendations,
    }
  } catch (error) {
    console.error('[v0] Error recommending documents:', error)
    return {
      success: false,
      recommendations: [],
    }
  }
}

/**
 * Build portfolio dashboard data
 */
export interface PortfolioMetrics {
  totalDocuments: number
  linkedDocuments: number
  averageStrength: number
  modulesCovered: string[]
  goalEvidence: number // documents supporting career goal
  weeknessEvidence: number // documents addressing weaknesses
  recommendedDocuments: number
}

export async function buildPortfolioMetrics(
  userId: string,
  documents: any[],
  links: EvidenceLink[]
): Promise<PortfolioMetrics> {
  const context = await buildDtcContext({
    userId,
    command: '/dtc:a4-review-document' as any,
    agent: 'coach' as any,
    mode: 'coaching',
  })

  const careerGoal = context.context?.memory?.find((m: any) => m.memoryType === 'career_goal')?.content
  const weaknesses = context.context?.memory?.filter((m: any) => m.memoryType === 'weakness') || []

  const linkedDocuments = new Set(links.map((l) => l.documentId)).size
  const modulesCovered = Array.from(
    new Set(
      links
        .flatMap((l) => l.linkedToType === 'module' ? [l.linkedToId] : [])
        .filter(Boolean)
    )
  ) as string[]

  const goalEvidence = links.filter((l) => l.linkedToType === 'career_goal').length
  const weaknessEvidence = links.filter((l) => l.linkedToType === 'weakness').length

  const averageStrength = links.length > 0 ? links.reduce((sum, l) => sum + l.strength, 0) / links.length : 0

  return {
    totalDocuments: documents.length,
    linkedDocuments,
    averageStrength: Math.round(averageStrength * 100) / 100,
    modulesCovered,
    goalEvidence,
    weeknessEvidence: weaknessEvidence,
    recommendedDocuments: Math.max(3 - linkedDocuments, 0),
  }
}

export default {
  extractDocumentInsights,
  linkDocumentToEvidence,
  recommendDocuments,
  buildPortfolioMetrics,
}
