'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Loader2, TrendingUp, Target, AlertCircle } from 'lucide-react'
import { analyzeMarketTrends, calculateSkillGap } from '@/lib/linkedin/market-trends'

interface SkillGapData {
  skills_to_learn: string[]
  current_strengths: string[]
  gap_percentage: number
  market_trending_skills: Array<{ skill: string; demand_count: number }>
}

interface MarketData {
  trending_skills: Array<{ skill: string; demand_count: number; trend: string }>
  top_hiring_companies: any[]
  market_snapshot: { total_jobs_tracked: number }
}

export function MarketInsightsCard() {
  const [marketData, setMarketData] = useState<MarketData | null>(null)
  const [skillGap, setSkillGap] = useState<SkillGapData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadMarketInsights()
  }, [])

  const loadMarketInsights = async () => {
    try {
      setLoading(true)
      setError(null)
      const [market, gap] = await Promise.all([analyzeMarketTrends(15), calculateSkillGap()])
      setMarketData(market)
      setSkillGap(gap)
    } catch (err) {
      console.error('[v0] Error loading market insights:', err)
      setError('Failed to load market insights')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="py-8 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />
          <span className="ml-2 text-slate-600">Analyzing market trends...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {/* Trending Skills Card */}
      <Card className="border-cyan-200 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="w-5 h-5 text-cyan-600" />
            Trending Skills
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {marketData?.trending_skills.slice(0, 10).map((skill) => (
            <div key={skill.skill} className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium">{skill.skill}</p>
                <div className="w-full bg-slate-200 rounded-full h-2 mt-1">
                  <div
                    className="bg-cyan-500 h-2 rounded-full"
                    style={{
                      width: `${Math.min((skill.demand_count / (marketData?.trending_skills[0].demand_count || 1)) * 100, 100)}%`,
                    }}
                  />
                </div>
              </div>
              <span className="text-xs text-slate-600 ml-2">{skill.demand_count}</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Skill Gap Analysis Card */}
      <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="w-5 h-5 text-purple-600" />
            Your Skill Gap
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {skillGap ? (
            <>
              {/* Gap Percentage */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Gap vs Market Demand</span>
                  <span className="text-lg font-bold text-purple-600">{skillGap.gap_percentage}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full"
                    style={{ width: `${skillGap.gap_percentage}%` }}
                  />
                </div>
              </div>

              {/* Current Strengths */}
              {skillGap.current_strengths.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-700 mb-2">Your Strengths</p>
                  <div className="flex flex-wrap gap-2">
                    {skillGap.current_strengths.slice(0, 5).map((skill) => (
                      <Badge key={skill} className="bg-green/10 text-green">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills to Learn */}
              {skillGap.skills_to_learn.length > 0 && (
                <div>
                  <p className="text-xs font-semibold text-slate-700 mb-2">Priority Skills to Learn</p>
                  <div className="flex flex-wrap gap-2">
                    {skillGap.skills_to_learn.slice(0, 5).map((skill) => (
                      <Badge key={skill} className="bg-amber-100 text-amber-800">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-slate-600">Sync your LinkedIn profile to see your skill gap</p>
          )}
        </CardContent>
      </Card>

      {/* Market Snapshot Card */}
      <Card className="border-teal-200 bg-gradient-to-br from-teal-50 to-green-50 dark:from-teal-950/20 dark:to-green-950/20 lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <AlertCircle className="w-5 h-5 text-teal-600" />
            Market Snapshot
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-teal-600">
                {marketData?.market_snapshot.total_jobs_tracked || 0}
              </p>
              <p className="text-xs text-slate-600 mt-1">Jobs Tracked</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-cyan-600">
                {marketData?.trending_skills.length || 0}
              </p>
              <p className="text-xs text-slate-600 mt-1">Trending Skills</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">
                {skillGap?.current_strengths.length || 0}
              </p>
              <p className="text-xs text-slate-600 mt-1">Your Strengths</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-amber-600">
                {skillGap?.skills_to_learn.length || 0}
              </p>
              <p className="text-xs text-slate-600 mt-1">To Learn</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
