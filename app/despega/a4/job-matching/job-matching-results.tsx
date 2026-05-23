'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import type { MatchResult } from '@/lib/algorithms/job-matching'

interface JobWithMatch {
  job_id: string
  match_score: number
  match_percentage: string
  skills_match: {
    matched_skills: string[]
    missing_skills: string[]
    match_percentage: number
    matched_count: number
    total_required: number
  }
  experience_match: number
  fit_category: 'perfect' | 'strong' | 'moderate' | 'potential' | 'low'
  match_reasons: string[]
  missing_skills: string[]
  salary_fit?: string
  job?: {
    id: string
    title: string
    company: string
    description: string
    location: string
    salary_min?: number
    salary_max?: number
    remote_allowed: boolean
    employment_type: string
  }
}

const FIT_COLORS = {
  perfect: 'bg-green-100 text-green-800',
  strong: 'bg-blue-100 text-blue-800',
  moderate: 'bg-yellow-100 text-yellow-800',
  potential: 'bg-purple-100 text-purple-800',
  low: 'bg-gray-100 text-gray-800',
}

export function JobMatchingResults() {
  const [matches, setMatches] = useState<JobWithMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [minScore, setMinScore] = useState(50)

  useEffect(() => {
    fetchMatches()
  }, [minScore])

  async function fetchMatches() {
    try {
      setLoading(true)
      const response = await fetch(`/api/a4/job-matching?minScore=${minScore}&limit=20`)

      if (!response.ok) {
        throw new Error('Failed to fetch job matches')
      }

      const data = await response.json()
      setMatches(data.results || [])
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setMatches([])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Analyzing job matches...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="pt-6">
          <p className="text-red-800">Error: {error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Score Filter */}
      <div className="flex items-center gap-4">
        <label className="text-sm font-medium">Minimum Match Score:</label>
        <select
          value={minScore}
          onChange={(e) => setMinScore(parseInt(e.target.value))}
          className="px-3 py-2 border rounded-md text-sm"
        >
          <option value="30">30%+ (Low)</option>
          <option value="50">50%+ (Potential)</option>
          <option value="65">65%+ (Strong)</option>
          <option value="80">80%+ (Perfect)</option>
        </select>
      </div>

      {/* Results Summary */}
      <div className="text-sm text-muted-foreground">
        Found <span className="font-semibold text-foreground">{matches.length}</span> matching jobs
      </div>

      {/* Job Cards */}
      <div className="space-y-4">
        {matches.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                No jobs found matching your criteria. Try adjusting the score filter.
              </p>
            </CardContent>
          </Card>
        ) : (
          matches.map((match) => (
            <Card key={match.job_id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-xl">{match.job?.title}</CardTitle>
                    <CardDescription className="text-base">{match.job?.company}</CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-primary">{match.match_score}%</div>
                    <Badge className={FIT_COLORS[match.fit_category]}>
                      {match.fit_category.replace('-', ' ').charAt(0).toUpperCase() +
                        match.fit_category.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Match Score Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Overall Match</span>
                    <span className="font-medium">{match.match_percentage}</span>
                  </div>
                  <Progress value={match.match_score} className="h-2" />
                </div>

                {/* Match Breakdown */}
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Skills Match</p>
                    <p className="font-semibold">
                      {match.skills_match.matched_count}/{match.skills_match.total_required}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Experience</p>
                    <p className="font-semibold">{Math.round(match.experience_match)}%</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Location</p>
                    <p className="font-semibold">
                      {match.job?.remote_allowed ? '🌐 Remote' : match.job?.location}
                    </p>
                  </div>
                </div>

                {/* Match Reasons */}
                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Why this match:</p>
                  <ul className="space-y-1">
                    {match.match_reasons.map((reason, idx) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>{reason}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Skills Display */}
                <div className="space-y-2">
                  {match.skills_match.matched_skills.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Matched Skills:</p>
                      <div className="flex flex-wrap gap-1">
                        {match.skills_match.matched_skills.slice(0, 5).map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {match.skills_match.matched_skills.length > 5 && (
                          <Badge variant="outline" className="text-xs">
                            +{match.skills_match.matched_skills.length - 5} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {match.missing_skills.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-1">Skills to Learn:</p>
                      <div className="flex flex-wrap gap-1">
                        {match.missing_skills.slice(0, 4).map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs bg-orange-50">
                            {skill}
                          </Badge>
                        ))}
                        {match.missing_skills.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{match.missing_skills.length - 4} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Job Details */}
                <div className="pt-2 border-t space-y-2">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {match.job?.salary_min && (
                      <div>
                        <p className="text-muted-foreground">Salary Range</p>
                        <p className="font-medium">
                          ${match.job.salary_min}k - ${match.job.salary_max}k
                        </p>
                      </div>
                    )}
                    <div>
                      <p className="text-muted-foreground">Employment Type</p>
                      <p className="font-medium">{match.job?.employment_type}</p>
                    </div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex gap-2 pt-2">
                  <button className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors text-sm font-medium">
                    View Full Job
                  </button>
                  <button className="flex-1 px-4 py-2 border border-primary text-primary rounded-md hover:bg-primary/5 transition-colors text-sm font-medium">
                    Save Job
                  </button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
