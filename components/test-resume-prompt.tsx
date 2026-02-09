'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

interface ProgressSnapshot {
  id: string
  testType: string
  currentQuestion: number
  totalQuestions: number
  durationMinutes: number
  lastUpdatedAt: string
}

interface TestResumePromptProps {
  userEmail: string
  testType: string
  onResumeConfirm?: (snapshot: ProgressSnapshot) => void
  onStartNew?: () => void
}

export function TestResumePrompt({
  userEmail,
  testType,
  onResumeConfirm,
  onStartNew,
}: TestResumePromptProps) {
  const [snapshot, setSnapshot] = useState<ProgressSnapshot | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const loadSnapshot = async () => {
      try {
        console.log(`[v0] Checking for saved progress...`)

        const response = await fetch(`/api/test-progress/${testType}?userEmail=${userEmail}`)

        if (response.ok) {
          const data = await response.json()
          if (data.snapshot) {
            setSnapshot(data.snapshot)
            console.log(`[v0] Found saved progress at question ${data.snapshot.currentQuestion}`)
          }
        }
      } catch (e) {
        console.warn(`[v0] Error loading snapshot:`, e)
      } finally {
        setIsLoading(false)
      }
    }

    loadSnapshot()
  }, [userEmail, testType])

  if (isLoading || dismissed || !snapshot) {
    return null
  }

  const progressPercentage = (snapshot.currentQuestion / snapshot.totalQuestions) * 100
  const lastUpdated = new Date(snapshot.lastUpdatedAt)
  const timeAgo = getTimeAgo(lastUpdated)

  return (
    <Card className="w-full border-blue-200 bg-blue-50">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-1 h-5 w-5 text-blue-600" />
            <div>
              <CardTitle className="text-lg text-blue-900">Resume Your Test?</CardTitle>
              <CardDescription className="text-blue-700">
                You have an incomplete {testType} test saved
              </CardDescription>
            </div>
          </div>
          <button
            onClick={() => setDismissed(true)}
            className="text-blue-600 hover:text-blue-800"
          >
            ×
          </button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Details */}
        <div className="space-y-2 rounded-lg bg-white p-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progress:</span>
            <span className="font-semibold text-gray-900">
              {snapshot.currentQuestion} / {snapshot.totalQuestions} questions
            </span>
          </div>

          <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <div className="text-xs text-gray-500">
            {Math.round(progressPercentage)}% complete
          </div>
        </div>

        {/* Time Info */}
        <div className="text-sm text-gray-600">
          <p>Last updated: <span className="font-medium">{timeAgo}</span></p>
          <p>Time spent: <span className="font-medium">{snapshot.durationMinutes.toFixed(1)} minutes</span></p>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <Button
            onClick={() => {
              onResumeConfirm?.(snapshot)
              setDismissed(true)
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Resume Test
          </Button>

          <Button
            variant="outline"
            onClick={() => {
              onStartNew?.()
              setDismissed(true)
            }}
          >
            Start Over
          </Button>
        </div>

        <p className="text-xs text-gray-500">
          Your progress will be saved automatically. Snapshots expire after 7 days of inactivity.
        </p>
      </CardContent>
    </Card>
  )
}

function getTimeAgo(date: Date): string {
  const now = new Date()
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`
  return `${Math.floor(seconds / 86400)} days ago`
}
