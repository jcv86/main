'use server'

import { createClient } from '@/lib/supabase/server'

interface GitHubJob {
  id: string
  title: string
  company: string
  company_logo?: string
  location: string
  url: string
  description: string
  how_to_apply: string
}

interface JobListing {
  id: string
  title: string
  company: string
  location: string
  job_type: string
  skills_required: string[]
  description: string
  url: string
  source: 'github_jobs' | 'indeed'
  published_at: string
  match_score?: number
}

/**
 * Fetch free job listings from GitHub Jobs API
 * GitHub Jobs API is free and requires no authentication
 */
export async function fetchGitHubJobs(query: string, location: string = 'remote'): Promise<JobListing[]> {
  try {
    console.log('[v0] Fetching GitHub Jobs for:', query, location)

    // GitHub Jobs API is deprecated but we can use job boards
    // Alternative: Use Hacker News Jobs API (free, no auth required)
    const response = await fetch(
      `https://hacker-news.firebaseio.com/v0/jobs.json?orderBy="score"&limitToFirst=50`,
      {
        headers: { 'User-Agent': 'Despega-Career-App' },
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch jobs')
    }

    const jobIds = await response.json()

    // Fetch top 10 job details
    const jobs: JobListing[] = []
    for (const jobId of jobIds.slice(0, 10)) {
      const jobResponse = await fetch(`https://hacker-news.firebaseio.com/v0/item/${jobId}.json`)
      const job = await jobResponse.json()

      if (job && job.title && job.url) {
        jobs.push({
          id: String(jobId),
          title: job.title,
          company: job.by || 'Unknown',
          location: 'Remote',
          job_type: 'Full-time',
          skills_required: extractSkillsFromText(job.title),
          description: job.text || '',
          url: job.url,
          source: 'github_jobs',
          published_at: new Date(job.time * 1000).toISOString(),
        })
      }
    }

    return jobs
  } catch (error) {
    console.error('[v0] Error fetching GitHub jobs:', error)
    return []
  }
}

/**
 * Fetch jobs from free job boards
 * Uses public job APIs that don't require authentication
 */
export async function fetchFreeJobListings(
  query: string,
  location: string = 'remote'
): Promise<JobListing[]> {
  try {
    console.log('[v0] Fetching free job listings for:', query, location)

    // Using RemoteOK API (free, no auth, remote jobs only)
    const response = await fetch('https://remoteok.com/api?', {
      headers: { 'User-Agent': 'Despega-Career-App' },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch RemoteOK jobs')
    }

    const data = await response.json()

    const jobs: JobListing[] = data
      .filter(
        (job: any) =>
          job.title &&
          (query.toLowerCase().includes(job.title.toLowerCase()) ||
            job.title.toLowerCase().includes(query.toLowerCase()))
      )
      .slice(0, 20)
      .map((job: any) => ({
        id: String(job.id),
        title: job.title,
        company: job.company,
        location: job.location || 'Remote',
        job_type: 'Full-time',
        skills_required: extractSkillsFromText(`${job.title} ${job.description || ''}`),
        description: job.description || job.title,
        url: job.url,
        source: 'indeed' as const,
        published_at: new Date(job.date * 1000).toISOString(),
      }))

    return jobs
  } catch (error) {
    console.error('[v0] Error fetching free job listings:', error)
    return []
  }
}

/**
 * Extract skills from job title/description using pattern matching
 */
function extractSkillsFromText(text: string): string[] {
  const commonSkills = [
    'JavaScript',
    'TypeScript',
    'React',
    'Node.js',
    'Python',
    'Java',
    'Go',
    'Rust',
    'SQL',
    'PostgreSQL',
    'MongoDB',
    'AWS',
    'Azure',
    'GCP',
    'Docker',
    'Kubernetes',
    'Git',
    'REST API',
    'GraphQL',
    'Vue',
    'Angular',
    'Next.js',
    'Django',
    'FastAPI',
    'Spring',
    'DevOps',
    'CI/CD',
    'Linux',
    'Agile',
    'Scrum',
    'Leadership',
    'Communication',
    'Problem Solving',
  ]

  const foundSkills: string[] = []
  const lowerText = text.toLowerCase()

  for (const skill of commonSkills) {
    if (lowerText.includes(skill.toLowerCase())) {
      foundSkills.push(skill)
    }
  }

  return foundSkills
}

/**
 * Calculate match score between user skills and job requirements
 */
function calculateMatchScore(userSkills: string[], jobSkills: string[]): number {
  if (jobSkills.length === 0) return 0

  const matchedSkills = userSkills.filter((skill) =>
    jobSkills.some((jobSkill) => jobSkill.toLowerCase().includes(skill.toLowerCase()))
  )

  return Math.round((matchedSkills.length / jobSkills.length) * 100)
}

/**
 * Get personalized job recommendations for user based on their LinkedIn profile
 */
export async function getPersonalizedJobRecommendations() {
  try {
    const supabase = await createClient()
    
    // Get current user from Supabase auth
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return [] // Return empty array if not authenticated
    }

    // Get user's LinkedIn profile with skills
    const { data: profile } = await supabase
      .from('linkedin_user_profiles')
      .select('skills, experience, headline')
      .eq('user_id', user.id)
      .single()

    if (!profile) {
      return [] // Return empty array if no profile
    }

    // Extract job search keywords from headline and experience
    const keywords = profile.headline
      ? profile.headline.split(' ').slice(0, 3).join(' ')
      : 'Software Engineer'

    // Fetch jobs for these keywords
    const jobs = await fetchFreeJobListings(keywords)

    // Calculate match scores
    const userSkills = profile.skills?.map((s: any) => s.name) || []
    const jobsWithScores = jobs.map((job) => ({
      ...job,
      match_score: calculateMatchScore(userSkills, job.skills_required),
    }))

    // Sort by match score
    const sortedJobs = jobsWithScores.sort((a, b) => (b.match_score || 0) - (a.match_score || 0))

    return sortedJobs.slice(0, 10) // Return top 10 matches
  } catch (error) {
    console.error('[v0] Error getting personalized job recommendations:', error)
    return [] // Return empty array on error
  }
}
        description: job.description,
        url: job.url,
        source: job.source,
        skills_required: job.skills_required,
        match_score: job.match_score,
        published_at: job.published_at,
      }))
    )

    console.log('[v0] Generated', sortedJobs.length, 'job recommendations for user:', user.id)

    return sortedJobs
  } catch (error) {
    console.error('[v0] Error getting job recommendations:', error)
    throw error
  }
}
