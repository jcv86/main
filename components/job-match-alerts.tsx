'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  AlertCircle, Briefcase, CheckCircle2, Zap, X, Eye, ArrowRight
} from 'lucide-react'

interface JobAlert {
  id: string
  title: string
  company: string
  matchScore: number
  message: string
  jobId: string
  createdAt: string
  read: boolean
}

export function JobMatchAlerts() {
  const [alerts, setAlerts] = useState<JobAlert[]>([])
  const [loading, setLoading] = useState(true)
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    try {
      const response = await fetch('/api/notifications/unread')
      const data = await response.json()
      setAlerts(data.notifications || [])
    } catch (error) {
      console.error('[v0] Error fetching alerts:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDismiss = (id: string) => {
    setDismissedIds(prev => new Set([...prev, id]))
  }

  const handleViewJob = (jobId: string) => {
    // Navigate to job details or match page
    window.location.href = `/despega/a4/job-matching?job=${jobId}`
  }

  const visibleAlerts = alerts.filter(alert => !dismissedIds.has(alert.id))

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="h-20 bg-muted rounded-lg animate-pulse" />
      </div>
    )
  }

  if (visibleAlerts.length === 0) {
    return null
  }

  return (
    <div className="space-y-3">
      {visibleAlerts.map(alert => (
        <Card
          key={alert.id}
          className="bg-gradient-to-r from-[rgba(170,70,170,0.1)] to-[rgba(80,160,170,0.1)] border border-[rgba(170,70,170,0.3)] p-4"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 flex-1">
              <div className="mt-1">
                <Zap className="w-5 h-5 text-[rgb(170,70,170)]" />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-white truncate">
                    {alert.company}
                  </h3>
                  <Badge className="bg-[rgb(170,70,170)]/20 text-[rgb(170,70,170)] border-0 text-xs whitespace-nowrap">
                    {alert.matchScore}% match
                  </Badge>
                </div>
                
                <p className="text-sm text-white/75 mb-2">
                  {alert.title}
                </p>
                
                <p className="text-xs text-white/60">
                  {alert.message}
                </p>
              </div>
            </div>

            <div className="flex gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleViewJob(alert.jobId)}
                className="border-[rgba(170,70,170,0.3)] text-[rgb(170,70,170)] hover:bg-[rgba(170,70,170,0.1)] text-xs"
              >
                <Eye className="w-3 h-3" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDismiss(alert.id)}
                className="text-white/50 hover:text-white hover:bg-white/10"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
