/**
 * Job API Fallback System
 * Attempts: LinkedIn API → Indeed API → Local Database
 * Gracefully degrades if external APIs fail
 */

import { EXPANDED_JOB_DATABASE, searchJobs, JobListing } from './job-database'

export interface JobAPIConfig {
  linkedinToken?: string
  indeedApiKey?: string
  useLocalFallback: boolean
}

export class JobAPIManager {
  private config: JobAPIConfig
  private cache: Map<string, { data: JobListing[], timestamp: number }> = new Map()
  private CACHE_TTL = 3600000 // 1 hour

  constructor(config: JobAPIConfig = { useLocalFallback: true }) {
    this.config = config
  }

  async searchJobs(query: string, filters?: any): Promise<JobListing[]> {
    const cacheKey = `search:${query}:${JSON.stringify(filters || {})}`
    
    // Check cache
    const cached = this.cache.get(cacheKey)
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data
    }

    let results: JobListing[] = []

    // Try LinkedIn API first
    if (this.config.linkedinToken) {
      try {
        results = await this.searchLinkedIn(query, filters)
        this.cache.set(cacheKey, { data: results, timestamp: Date.now() })
        return results
      } catch (e) {
        console.warn('[v0] LinkedIn API failed, trying Indeed...')
      }
    }

    // Try Indeed API second
    if (this.config.indeedApiKey) {
      try {
        results = await this.searchIndeed(query, filters)
        this.cache.set(cacheKey, { data: results, timestamp: Date.now() })
        return results
      } catch (e) {
        console.warn('[v0] Indeed API failed, using local database...')
      }
    }

    // Fallback to local database
    if (this.config.useLocalFallback) {
      results = searchJobs(query, filters)
      this.cache.set(cacheKey, { data: results, timestamp: Date.now() })
      return results
    }

    return []
  }

  private async searchLinkedIn(query: string, filters?: any): Promise<JobListing[]> {
    // LinkedIn API integration (placeholder)
    // In production, would call LinkedIn API
    const response = await fetch('https://api.linkedin.com/v2/jobs/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.config.linkedinToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ keywords: query, filters })
    })

    if (!response.ok) {
      throw new Error(`LinkedIn API error: ${response.statusText}`)
    }

    // Transform LinkedIn data to JobListing format
    const data = await response.json()
    return data.jobs || []
  }

  private async searchIndeed(query: string, filters?: any): Promise<JobListing[]> {
    // Indeed API integration (placeholder)
    // In production, would call Indeed API
    const params = new URLSearchParams({
      q: query,
      l: filters?.location || 'Chile',
      ...filters
    })

    const response = await fetch(`https://api.indeed.com/jobs?${params}`, {
      headers: {
        'Authorization': `Bearer ${this.config.indeedApiKey}`
      }
    })

    if (!response.ok) {
      throw new Error(`Indeed API error: ${response.statusText}`)
    }

    // Transform Indeed data to JobListing format
    const data = await response.json()
    return data.results || []
  }

  clearCache() {
    this.cache.clear()
  }

  getCacheStats() {
    return {
      size: this.cache.size,
      entries: Array.from(this.cache.keys())
    }
  }
}

// Export singleton instance
export const jobAPIManager = new JobAPIManager({
  linkedinToken: process.env.LINKEDIN_API_TOKEN,
  indeedApiKey: process.env.INDEED_API_KEY,
  useLocalFallback: true
})
