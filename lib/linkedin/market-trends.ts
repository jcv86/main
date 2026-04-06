'use server'

import { createClient } from '@/lib/supabase/server'
import { getCurrentUser } from '@/lib/auth/session'

interface MarketTrend {
  skill: string
  demand_count: number
  trend: 'up' | 'stable' | 'down'
  avg_salary_usd?: number
}

interface CompanyHiring {
  company: string
  job_count: number
  locations: string[]
  top_skills: string[]
}

/**
 * Analyze market trends based on free job data
 * Identifies most demanded skills and companies hiring
 */
export async function analyzeMarketTrends(limit: number = 20) {
  try {
    console.log('[v0] Analyzing market trends from free job data')

    const supabase = await createClient()

    // Get all recent job listings from database
    const { data: jobs, error } = await supabase
      .from('linkedin_market_job_listings')
      .select('skills_required, company, location')
      .order('published_at', { ascending: false })
      .limit(200)

    if (error) {
      throw error
    }

    // Analyze skill demand
    const skillDemand: Record<string, number> = {}
    const companyHiring: Record<string, Set<string>> = {}

    for (const job of jobs || []) {
      // Count skill occurrences
      for (const skill of job.skills_required || []) {
        skillDemand[skill] = (skillDemand[skill] || 0) + 1
      }

      // Track company hiring
      if (job.company) {
        if (!companyHiring[job.company]) {
          companyHiring[job.company] = new Set()
        }
        companyHiring[job.company].add(job.location || 'Remote')
      }
    }

    // Sort skills by demand
    const trendingSkills = Object.entries(skillDemand)
      .sort(([, a], [, b]) => b - a)
      .slice(0, limit)
      .map(([skill, count]) => ({
        skill,
        demand_count: count,
        trend: 'up' as const, // In production, compare with historical data
      }))

    // Get top hiring companies
    const topCompanies = Object.entries(companyHiring)
      .map(([company, locations]) => ({
        company,
        job_count: 0, // Count from jobs
        locations: Array.from(locations),
        top_skills: [],
      }))
      .sort((a, b) => b.job_count - a.job_count)
      .slice(0, 10)

    return {
      trending_skills: trendingSkills,
      top_hiring_companies: topCompanies,
      market_snapshot: {
        total_jobs_tracked: jobs?.length || 0,
        data_freshness: new Date().toISOString(),
      },
    }
  } catch (error) {
    console.error('[v0] Error analyzing market trends:', error)
    throw error
  }
}

/**
 * Calculate skill gap between user and market demand
 */
export async function calculateSkillGap() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('User not authenticated')
    }

    const supabase = await createClient()

    // Get user's LinkedIn profile
    const { data: profile } = await supabase
      .from('linkedin_user_profiles')
      .select('skills')
      .eq('user_id', user.id)
      .single()

    if (!profile) {
      throw new Error('LinkedIn profile not synced')
    }

    // Get market trends
    const marketData = await analyzeMarketTrends(50)

    const userSkills = new Set(profile.skills?.map((s: any) => s.name.toLowerCase()) || [])
    const marketSkills = new Set(marketData.trending_skills.map((s) => s.skill.toLowerCase()))

    // Calculate gaps
    const skillsToLearn = Array.from(marketSkills).filter((skill) => !userSkills.has(skill))
    const userAdvantage = Array.from(userSkills).filter((skill) => marketSkills.has(skill))

    return {
      skills_to_learn: skillsToLearn.slice(0, 10),
      current_strengths: userAdvantage,
      gap_percentage: Math.round((skillsToLearn.length / marketSkills.size) * 100),
      market_trending_skills: marketData.trending_skills.slice(0, 10),
    }
  } catch (error) {
    console.error('[v0] Error calculating skill gap:', error)
    throw error
  }
}

/**
 * Get personalized training recommendations based on market demand
 */
export async function getTrainingRecommendationsByMarket() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('User not authenticated')
    }

    const skillGap = await calculateSkillGap()

    // Map skills to training modules
    const skillToTrainingModule: Record<string, string> = {
      'javascript': 'JavaScript Fundamentals',
      'typescript': 'Advanced TypeScript',
      'react': 'React Advanced Patterns',
      'node.js': 'Node.js Backend Development',
      'python': 'Python for Data',
      'aws': 'AWS Cloud Architecture',
      'docker': 'Docker & Containerization',
      'kubernetes': 'Kubernetes Orchestration',
      'sql': 'Advanced SQL Queries',
      'graphql': 'GraphQL APIs',
      'leadership': 'Executive Leadership',
      'communication': 'Strategic Communication',
      'agile': 'Agile & Scrum Master',
    }

    const recommendations = skillGap.skills_to_learn
      .slice(0, 5)
      .map((skill) => ({
        skill,
        training_module: skillToTrainingModule[skill.toLowerCase()] || `Master ${skill}`,
        market_demand: '🔴 High Demand',
        estimated_hours: 20,
      }))

    return recommendations
  } catch (error) {
    console.error('[v0] Error getting training recommendations:', error)
    throw error
  }
}

/**
 * Store market insights in database for dashboard display
 */
export async function storeMarketInsights() {
  try {
    const user = await getCurrentUser()
    if (!user) {
      throw new Error('User not authenticated')
    }

    const supabase = await createClient()

    const skillGap = await calculateSkillGap()
    const trends = await analyzeMarketTrends()

    const { error } = await supabase
      .from('user_job_market_insights')
      .upsert(
        {
          user_id: user.id,
          trending_skills: trends.trending_skills,
          skill_gap_analysis: skillGap,
          last_updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )

    if (error) {
      throw error
    }

    console.log('[v0] Market insights stored for user:', user.id)
    return true
  } catch (error) {
    console.error('[v0] Error storing market insights:', error)
    throw error
  }
}
