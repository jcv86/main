'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

interface CompletionMetrics {
  average: number
  median: number
  min: number
  max: number
  p95: number
  sampleSize: number
}

interface TestCompletionMonitorProps {
  testType: string
  onMetricsUpdate?: (metrics: CompletionMetrics) => void
}

export function TestCompletionMonitor({ testType, onMetricsUpdate }: TestCompletionMonitorProps) {
  const [metrics, setMetrics] = useState<CompletionMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        console.log(`[v0] Fetching completion metrics for ${testType}...`)
        
        const response = await fetch(`/api/test-metrics/${testType}`)
        
        if (!response.ok) {
          throw new Error(`Failed to fetch metrics: ${response.statusText}`)
        }

        const data = await response.json()
        setMetrics(data)
        onMetricsUpdate?.(data)

        console.log(`[v0] Loaded completion metrics:`, data)
      } catch (e: any) {
        console.error(`[v0] Error fetching metrics:`, e)
        setError(e.message || 'Failed to load metrics')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMetrics()
  }, [testType, onMetricsUpdate])

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Test Completion Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500">Loading metrics...</div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Test Completion Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-red-600">{error}</div>
        </CardContent>
      </Card>
    )
  }

  if (!metrics) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Test Completion Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500">No data available yet</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Test Completion Time - {testType}</CardTitle>
        <CardDescription>Completion time statistics based on {metrics.sampleSize} completed tests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Metric Cards */}
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            <MetricCard
              label="Average"
              value={metrics.average}
              unit="min"
              color="bg-blue-50"
            />
            <MetricCard
              label="Median"
              value={metrics.median}
              unit="min"
              color="bg-green-50"
            />
            <MetricCard
              label="Min"
              value={metrics.min}
              unit="min"
              color="bg-orange-50"
            />
            <MetricCard
              label="Max"
              value={metrics.max}
              unit="min"
              color="bg-red-50"
            />
            <MetricCard
              label="P95"
              value={metrics.p95}
              unit="min"
              color="bg-purple-50"
            />
            <MetricCard
              label="Sample Size"
              value={metrics.sampleSize}
              unit="tests"
              color="bg-gray-50"
              isCount={true}
            />
          </div>

          {/* Info Box */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm">
            <p className="font-semibold text-blue-900">Interpretation:</p>
            <ul className="mt-2 space-y-1 text-xs text-blue-800">
              <li>• <strong>Average:</strong> Mean completion time across all tests</li>
              <li>• <strong>Median:</strong> Middle value (50th percentile)</li>
              <li>• <strong>P95:</strong> 95% of users complete within this time</li>
              <li>• <strong>Min/Max:</strong> Fastest and slowest completion times</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function MetricCard({
  label,
  value,
  unit,
  color,
  isCount = false,
}: {
  label: string
  value: number
  unit: string
  color: string
  isCount?: boolean
}) {
  return (
    <div className={`rounded-lg p-3 ${color}`}>
      <div className="text-xs font-medium text-gray-600">{label}</div>
      <div className="mt-1 text-xl font-bold text-gray-900">
        {isCount ? value : value.toFixed(1)}
      </div>
      <div className="text-xs text-gray-500">{unit}</div>
    </div>
  )
}
