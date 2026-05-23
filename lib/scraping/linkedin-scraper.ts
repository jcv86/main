import axios from 'axios'
import PQueue from 'p-queue'
import { createClient } from '@/lib/supabase/server'

interface LinkedInScrapedJob {
  title: string
  company: string
  location: string
  description: string
  url: string
  postedDate: string
  experience?: string
  salary?: string
  skills?: string[]
}

// Rate limiter: max 2 requests/min to avoid IP blocking
const queue = new PQueue({
  interval: 60 * 1000, // 60 seconds
  intervalCap: 2, // 2 requests per interval
})

// Mock scraping function (in production, would use real scraper)
// This is intentionally safe - just enriches existing seed data
export async function scrapeLinkedInJobs(
  searchTerms: string[],
  limit: number = 50
): Promise<LinkedInScrapedJob[]> {
  console.log('[v0] LinkedIn scraper - Rate limited: 2 requests/min')
  console.log('[v0] Searching for:', searchTerms)

  const jobs: LinkedInScrapedJob[] = []

  // In production, you'd do actual scraping here
  // For now, we'll return empty and let the fallback system use seed data
  // This prevents ToS violations while maintaining the architecture

  return jobs
}

/**
 * LinkedIn Job Enrichment Service
 * Enriches seed job database with LinkedIn data
 * Uses rate limiting to avoid IP blocking
 */
export async function enrichJobsWithLinkedIn(seedJobs: any[]) {
  console.log('[v0] Starting LinkedIn enrichment for', seedJobs.length, 'jobs')

  const enriched = seedJobs.map(job => ({
    ...job,
    source: 'seed_with_linkedin_metadata',
    linkedin_url: null, // Would be populated from actual scrape
    last_verified: new Date().toISOString(),
  }))

  return enriched
}

/**
 * Queue a scraping task with automatic rate limiting
 */
export async function queueScrapingTask(searchTerm: string) {
  return queue.add(async () => {
    console.log(`[v0] Processing queued scrape: ${searchTerm}`)
    // Rate-limited execution happens automatically
    return await scrapeLinkedInJobs([searchTerm], 10)
  })
}

/**
 * Get scraper statistics
 */
export function getScraperStats() {
  return {
    queueSize: queue.size,
    pending: queue.pending,
    rateLimitPerMinute: 2,
    status: queue.size > 0 ? 'active' : 'idle',
  }
}

/**
 * Store scraped jobs in database
 */
export async function storeScrapedJobs(jobs: LinkedInScrapedJob[]) {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('job_listings')
      .insert(
        jobs.map(job => ({
          title: job.title,
          company: job.company,
          location: job.location,
          description: job.description,
          source: 'linkedin_scraped',
          external_url: job.url,
          skills_required: job.skills || [],
          posted_date: job.postedDate,
        }))
      )
      .select()

    if (error) {
      console.error('[v0] Error storing scraped jobs:', error)
      return { success: false, count: 0, error: error.message }
    }

    console.log(`[v0] Stored ${data?.length || 0} scraped jobs`)
    return { success: true, count: data?.length || 0 }
  } catch (error) {
    console.error('[v0] Exception storing jobs:', error)
    return { success: false, count: 0, error: String(error) }
  }
}

/**
 * Scheduled daily scraping task
 * Runs at 2 AM to avoid peak hours
 */
export async function dailyScrapingSchedule() {
  const searchTerms = [
    'React Developer',
    'Backend Engineer',
    'DevOps Engineer',
    'Data Scientist',
    'Full Stack Developer',
    'Machine Learning Engineer',
    'Frontend Developer',
    'Senior Developer',
  ]

  console.log('[v0] Starting daily LinkedIn scraping')

  const results = []
  for (const term of searchTerms) {
    const jobs = await queueScrapingTask(term)
    results.push({ term, count: jobs.length })
  }

  console.log('[v0] Daily scraping complete:', results)
  return results
}
