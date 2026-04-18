'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Loader2, Briefcase, ExternalLink, TrendingUp, MapPin } from 'lucide-react'
import { getPersonalizedJobRecommendations } from '@/lib/linkedin/free-jobs'

interface JobListing {
  id: string
  title: string
  company: string
  location: string
  job_type: string
  skills_required: string[]
  description: string
  url: string
  source: string
  published_at: string
  match_score?: number
}

export function JobRecommendationsCard() {
  const [jobs, setJobs] = useState<JobListing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hasAttemptedLoad, setHasAttemptedLoad] = useState(false)

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async () => {
    try {
      setLoading(true)
      setError(null)
      setHasAttemptedLoad(true)
      const recommendations = await getPersonalizedJobRecommendations()
      setJobs(recommendations)
    } catch (err) {
      console.error('[v0] Error loading job recommendations:', err)
      // Only set error if user explicitly clicked "Try Again"
      if (hasAttemptedLoad) {
        setError('Failed to load recommendations. Please connect your LinkedIn profile.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
          <span className="ml-2 text-slate-600">Finding relevant opportunities...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-amber-600" />
          Recommended Opportunities
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && hasAttemptedLoad && (
          <div className="p-3 bg-red/10 text-red-800 rounded-lg text-sm">
            {error}
          </div>
        )}

        {jobs.length === 0 ? (
          <div className="text-center py-6 text-slate-600">
            <p>No recommendations yet. Connect your LinkedIn profile to discover personalized opportunities.</p>
            <Button onClick={loadJobs} className="mt-4" variant="outline">
              Try Again
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {jobs.slice(0, 5).map((job) => (
              <div
                key={job.id}
                className="p-3 bg-white dark:bg-slate-900 rounded-[28px] border border-slate-200 dark:border-slate-700 hover:border-amber-300 transition-colors"
              >
                {/* Match Score Badge */}
                {job.match_score !== undefined && (
                  <div className="flex items-center justify-between mb-2">
                    <div></div>
                    <Badge
                      className={
                        job.match_score >= 75
                          ? 'bg-green/10 text-green'
                          : job.match_score >= 50
                            ? 'bg-yellow/10 text-yellow'
                            : 'bg-slate-100 text-slate-800'
                      }
                    >
                      <TrendingUp className="w-3 h-3 mr-1" />
                      {job.match_score}% Match
                    </Badge>
                  </div>
                )}

                {/* Job Header */}
                <h4 className="font-semibold text-sm mb-1">{job.title}</h4>
                <p className="text-xs text-slate-600 mb-2">{job.company}</p>

                {/* Location */}
                <div className="flex items-center gap-1 text-xs text-slate-500 mb-2">
                  <MapPin className="w-3 h-3" />
                  {job.location}
                </div>

                {/* Skills */}
                {job.skills_required.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {job.skills_required.slice(0, 4).map((skill) => (
                      <Badge key={skill} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                    {job.skills_required.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{job.skills_required.length - 4}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Description Preview */}
                <p className="text-xs text-slate-600 line-clamp-2 mb-3">
                  {job.description.substring(0, 150)}...
                </p>

                {/* Apply Button */}
                <a
                  href={job.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-blue hover:underline flex items-center gap-1"
                >
                  View on {job.source}
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}

            {jobs.length > 5 && (
              <div className="text-center pt-2">
                <p className="text-xs text-slate-500 mb-2">
                  Showing 5 of {jobs.length} opportunities
                </p>
                <Button variant="outline" size="sm">
                  View All {jobs.length} Jobs
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
