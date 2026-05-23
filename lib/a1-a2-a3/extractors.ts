/**
 * A1/A2/A3 Data Extractors
 * 
 * Extract competencies, skills, and training data from each phase
 * to build a unified user skill profile for job matching
 */

import { createClient } from '@/lib/supabase/server'

export interface ExtractedA1Data {
  disc_profile: string // D, I, S, C
  foundational_skills: string[]
  learning_style: string
  strengths: string[]
  growth_areas: string[]
  cognitive_score: number
}

export interface ExtractedA2Data {
  route_selected: string
  learning_path_skills: string[]
  completed_milestones: string[]
  progress_percentage: number
  specializations: string[]
}

export interface ExtractedA3Data {
  training_completed: string[]
  interview_practice_skills: string[]
  feedback_received: string
  competency_improvements: string[]
  video_analysis_tags: string[]
}

export interface UnifiedUserProfile {
  userId: string
  all_skills: string[]
  skill_proficiency: Record<string, number> // skill -> 0-100
  experience_level: 'junior' | 'mid' | 'senior'
  specializations: string[]
  learning_trajectory: string // what they're learning now
  strengths_summary: string[]
  next_targets: string[] // what they should learn next
  last_updated: Date
}

/**
 * Extract skills and competencies from A1 DISC results
 */
export async function extractA1Data(userId: string): Promise<ExtractedA1Data | null> {
  try {
    const supabase = await createClient()
    
    const { data: results } = await supabase
      .from('a1_cerebral_results')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (!results) return null

    // Parse DISC profile and map to foundational skills
    const discProfile = results.disc_type || 'I'
    const foundationalSkills = mapDiscToSkills(discProfile)
    
    return {
      disc_profile: discProfile,
      foundational_skills: foundationalSkills,
      learning_style: results.learning_style_preference || 'balanced',
      strengths: results.strengths || [],
      growth_areas: results.areas_to_improve || [],
      cognitive_score: results.total_score || 0
    }
  } catch (error) {
    console.error('[v0] Error extracting A1 data:', error)
    return null
  }
}

/**
 * Extract skills and learning path from A2 routes
 */
export async function extractA2Data(userId: string): Promise<ExtractedA2Data | null> {
  try {
    const supabase = await createClient()
    
    const { data: progress } = await supabase
      .from('a2_progress')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (!progress) return null

    // Extract skills from selected route
    const routeSkills = mapRouteToSkills(progress.selected_route)
    
    // Get completed milestones
    const { data: milestones } = await supabase
      .from('a2_progress')
      .select('completed_milestones')
      .eq('user_id', userId)
      .single()

    const completedMilestones = milestones?.completed_milestones || []
    const completionPercentage = Math.round((completedMilestones.length / 10) * 100) // Assuming 10 total

    return {
      route_selected: progress.selected_route,
      learning_path_skills: routeSkills,
      completed_milestones: completedMilestones,
      progress_percentage: completionPercentage,
      specializations: progress.specializations || []
    }
  } catch (error) {
    console.error('[v0] Error extracting A2 data:', error)
    return null
  }
}

/**
 * Extract training completions and skills from A3 coaching
 */
export async function extractA3Data(userId: string): Promise<ExtractedA3Data | null> {
  try {
    const supabase = await createClient()
    
    // Get completed training sessions
    const { data: trainingSessions } = await supabase
      .from('a3_respuestas_entrevista')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (!trainingSessions || trainingSessions.length === 0) {
      return {
        training_completed: [],
        interview_practice_skills: [],
        feedback_received: '',
        competency_improvements: [],
        video_analysis_tags: []
      }
    }

    // Extract competencies from training
    const skills = extractSkillsFromTraining(trainingSessions)
    
    // Get coaching feedback
    const { data: coachingFeedback } = await supabase
      .from('a3_coaching_feedback')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    const feedbackSummary = coachingFeedback?.feedback || ''

    return {
      training_completed: trainingSessions.map(t => t.session_type || 'interview'),
      interview_practice_skills: skills,
      feedback_received: feedbackSummary,
      competency_improvements: extractImprovementsFromFeedback(feedbackSummary),
      video_analysis_tags: [] // Future: extract from video analysis
    }
  } catch (error) {
    console.error('[v0] Error extracting A3 data:', error)
    return null
  }
}

/**
 * Build unified user profile combining A1, A2, A3 data
 */
export async function buildUnifiedUserProfile(userId: string): Promise<UnifiedUserProfile> {
  const [a1, a2, a3] = await Promise.all([
    extractA1Data(userId),
    extractA2Data(userId),
    extractA3Data(userId)
  ])

  // Combine all skills from all phases
  const allSkills = new Set<string>()
  const skillProficiency: Record<string, number> = {}

  // Add A1 foundational skills (50% proficiency)
  if (a1) {
    a1.foundational_skills.forEach(skill => {
      allSkills.add(skill)
      skillProficiency[skill] = 50
    })
  }

  // Add A2 learning path skills (70% proficiency if completed milestone)
  if (a2) {
    a2.learning_path_skills.forEach(skill => {
      allSkills.add(skill)
      // Increase proficiency if milestone is completed
      const isCompleted = a2.completed_milestones.includes(skill)
      skillProficiency[skill] = isCompleted ? 80 : 60
    })
  }

  // Add A3 trained skills (90% proficiency if has feedback)
  if (a3) {
    a3.interview_practice_skills.forEach(skill => {
      allSkills.add(skill)
      skillProficiency[skill] = 90 // High proficiency for trained skills
    })
  }

  // Determine experience level
  let experienceLevel: 'junior' | 'mid' | 'senior' = 'junior'
  if (a2?.progress_percentage && a2.progress_percentage >= 70) {
    experienceLevel = 'mid'
  }
  if (a3 && a3.training_completed.length >= 10) {
    experienceLevel = 'senior'
  }

  // Determine learning trajectory
  const learningTrajectory = a2?.route_selected || 'General'

  // Get strengths summary
  const strengthsSummary = [...new Set([
    ...(a1?.strengths || []),
    ...(a2?.specializations || []),
    ...extractStrengthsFromFeedback(a3?.feedback_received || '')
  ])]

  // Determine next targets
  const nextTargets = determineNextSkillTargets(a2?.route_selected, a3?.competency_improvements)

  return {
    userId,
    all_skills: Array.from(allSkills),
    skill_proficiency: skillProficiency,
    experience_level: experienceLevel,
    specializations: a2?.specializations || [],
    learning_trajectory: learningTrajectory,
    strengths_summary: strengthsSummary,
    next_targets: nextTargets,
    last_updated: new Date()
  }
}

/**
 * Helper: Map DISC profile to foundational skills
 */
function mapDiscToSkills(disc: string): string[] {
  const discSkillMap: Record<string, string[]> = {
    D: ['Leadership', 'Decision Making', 'Strategic Thinking', 'Problem Solving'],
    I: ['Communication', 'Collaboration', 'Presentation', 'Networking'],
    S: ['Attention to Detail', 'Process Management', 'Reliability', 'Team Support'],
    C: ['Analysis', 'Research', 'Quality Assurance', 'Technical Writing']
  }
  return discSkillMap[disc] || []
}

/**
 * Helper: Map A2 route to skills
 */
function mapRouteToSkills(route: string): string[] {
  const routeSkillMap: Record<string, string[]> = {
    'Tech': ['JavaScript', 'React', 'Node.js', 'Database Design', 'APIs'],
    'Data': ['Python', 'SQL', 'Data Analysis', 'Visualization', 'Statistics'],
    'Business': ['Strategy', 'Marketing', 'Sales', 'Project Management', 'Analytics'],
    'Design': ['UX Design', 'UI Design', 'Figma', 'Prototyping', 'User Research'],
    'General': ['Communication', 'Problem Solving', 'Leadership', 'Teamwork', 'Learning']
  }
  return routeSkillMap[route] || routeSkillMap['General']
}

/**
 * Helper: Extract skills from training sessions
 */
function extractSkillsFromTraining(sessions: any[]): string[] {
  const skillKeywords = [
    'STAR method', 'storytelling', 'technical depth', 'leadership',
    'collaboration', 'communication', 'problem solving', 'negotiation'
  ]
  
  const extractedSkills: Set<string> = new Set()
  
  sessions.forEach(session => {
    const content = (session.session_type || '').toLowerCase()
    skillKeywords.forEach(keyword => {
      if (content.includes(keyword.toLowerCase())) {
        extractedSkills.add(keyword)
      }
    })
  })
  
  return Array.from(extractedSkills)
}

/**
 * Helper: Extract improvements from coaching feedback
 */
function extractImprovementsFromFeedback(feedback: string): string[] {
  const improvements: string[] = []
  
  if (feedback.includes('STAR')) improvements.push('STAR Method')
  if (feedback.includes('quantify') || feedback.includes('numbers')) improvements.push('Quantification')
  if (feedback.includes('impact')) improvements.push('Impact Communication')
  if (feedback.includes('structure')) improvements.push('Response Structure')
  
  return improvements
}

/**
 * Helper: Extract strengths from feedback
 */
function extractStrengthsFromFeedback(feedback: string): string[] {
  const strengths: string[] = []
  
  if (feedback.includes('Excelente')) strengths.push('Strong Fundamentals')
  if (feedback.includes('ejemplo')) strengths.push('Use of Examples')
  if (feedback.includes('clarity') || feedback.includes('claridad')) strengths.push('Clarity')
  
  return strengths
}

/**
 * Helper: Determine next skills to learn based on route and current gaps
 */
function determineNextSkillTargets(route: string | undefined, improvements: string[] = []): string[] {
  const targets: string[] = []
  
  if (route === 'Tech') {
    targets.push('Docker', 'Kubernetes', 'System Design')
  } else if (route === 'Data') {
    targets.push('Machine Learning', 'Big Data', 'Advanced SQL')
  } else if (route === 'Design') {
    targets.push('Interaction Design', 'Accessibility', 'Motion Design')
  }
  
  // Add based on improvements needed
  if (improvements.includes('STAR Method')) targets.push('Interview Preparation')
  
  return targets
}
