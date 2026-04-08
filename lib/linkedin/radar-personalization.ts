'use server'

import { createClient } from '@/lib/supabase/server'

/**
 * Personalizar el Radar Estratégico basado en el perfil de LinkedIn del usuario
 * Filtra noticias por industria, skills y seniority level
 */
export async function getPersonalizedRadarData() {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      console.log('[v0] No user authenticated, returning default radar')
      return null
    }

    // Get user's LinkedIn profile
    const { data: profile } = await supabase
      .from('linkedin_user_profiles')
      .select('skills, experience, headline, industry, seniority_level')
      .eq('user_id', user.id)
      .single()

    if (!profile) {
      console.log('[v0] No LinkedIn profile found for user:', user.id)
      return null
    }

    console.log('[v0] Loading personalized radar for:', profile.headline, 'Industry:', profile.industry)

    // Get market data filtered by user's industry
    const { data: marketJobs } = await supabase
      .from('linkedin_market_job_listings')
      .select('*')
      .eq('industry', profile.industry || 'Technology')
      .limit(30)

    // Extract trending skills from market data for this industry
    const trendingSkills = new Set<string>()
    marketJobs?.forEach((job: any) => {
      if (job.required_skills && Array.isArray(job.required_skills)) {
        job.required_skills.forEach((skill: string) => {
          trendingSkills.add(skill)
        })
      }
    })

    // Get user's current skills
    const userSkills = new Set(
      profile.skills?.map((s: any) => 
        typeof s === 'string' ? s : (s.name || s)
      ) || []
    )

    // Identify skill gaps
    const skillsToLearn = Array.from(trendingSkills).filter(
      skill => !userSkills.has(skill)
    ).slice(0, 5)

    // Build personalization context
    const personalization = {
      user_id: user.id,
      industry: profile.industry || 'Technology',
      seniority_level: profile.seniority_level || 'mid-level',
      headline: profile.headline,
      user_skills: Array.from(userSkills) as string[],
      market_trending_skills: Array.from(trendingSkills).slice(0, 10) as string[],
      skills_gap: skillsToLearn as string[],
      total_market_jobs: marketJobs?.length || 0,
      relevant_companies: (marketJobs?.map((j: any) => j.company_name).filter((v, i, a) => a.indexOf(v) === i).slice(0, 5) || []) as string[],
    }

    console.log('[v0] Personalization context:', {
      industry: personalization.industry,
      seniority: personalization.seniority_level,
      market_jobs: personalization.total_market_jobs,
      skills_gap: personalization.skills_gap.length,
    })

    return personalization
  } catch (error) {
    console.error('[v0] Error personalizing radar:', error)
    return null
  }
}

/**
 * Generate personalized news topics based on user's LinkedIn profile
 */
export async function generatePersonalizedNewsTopic(personalization: any): Promise<string> {
  const { industry, seniority_level, headline, market_trending_skills } = personalization

  // Build context-aware topic based on industry and skills
  const topicFragments = [
    `Tendencias en ${industry}`,
    `${market_trending_skills[0] || 'AI'} en la industria`,
    `Impacto para profesionales ${seniority_level}`,
  ]

  return topicFragments.join(' • ')
}
