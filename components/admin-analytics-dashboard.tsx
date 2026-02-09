'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'

interface TestAnalytics {
  testType: string
  totalCompletions: number
  totalAttempts: number
  avgDurationMinutes: number
  completionRate: number
  avgScore: number
  medianDuration: number
  p95Duration: number
}

interface RetryMetrics {
  testType: string
  totalRetries: number
  successfulRetries: number
  failedRetries: number
  avgAttemptsPerTest: number
}

interface ExportMetrics {
  totalExports: number
  csvExports: number
  pdfExports: number
  jsonExports: number
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899']

export function AdminAnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<TestAnalytics[]>([])
  const [retryMetrics, setRetryMetrics] = useState<RetryMetrics[]>([])
  const [exportMetrics, setExportMetrics] = useState<ExportMetrics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        console.log('[v0] Loading admin analytics...')
        setIsLoading(true)

        // Fetch test analytics
        const analyticsRes = await fetch('/api/admin/test-analytics')
        if (analyticsRes.ok) {
          const data = await analyticsRes.json()
          setAnalytics(data.analytics || [])
        }

        // Fetch retry metrics
        const retryRes = await fetch('/api/admin/retry-metrics')
        if (retryRes.ok) {
          const data = await retryRes.json()
          setRetryMetrics(data.metrics || [])
        }

        // Fetch export metrics
        const exportRes = await fetch('/api/admin/export-metrics')
        if (exportRes.ok) {
          const data = await exportRes.json()
          setExportMetrics(data.metrics)
        }

        setError(null)
      } catch (e: any) {
        console.error('[v0] Error loading analytics:', e)
        setError(e.message || 'Failed to load analytics')
      } finally {
        setIsLoading(false)
      }
    }

    loadAnalytics()

    // Refresh every 5 minutes
    const interval = setInterval(loadAnalytics, 5 * 60 * 1000)
    setRefreshInterval(interval)

    return () => clearInterval(interval)
  }, [])

  const handleManualRefresh = async () => {
    setIsLoading(true)
    const interval = setRefreshInterval
    if (interval) clearInterval(interval)

    try {
      const [analyticsRes, retryRes, exportRes] = await Promise.all([
        fetch('/api/admin/test-analytics'),
        fetch('/api/admin/retry-metrics'),
        fetch('/api/admin/export-metrics'),
      ])

      if (analyticsRes.ok) {
        const data = await analyticsRes.json()
        setAnalytics(data.analytics || [])
      }

      if (retryRes.ok) {
        const data = await retryRes.json()
        setRetryMetrics(data.metrics || [])
      }

      if (exportRes.ok) {
        const data = await exportRes.json()
        setExportMetrics(data.metrics)
      }
    } finally {
      setIsLoading(false)
    }
  }

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Admin Analytics Dashboard</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md bg-red-50 p-3 text-red-800">
            {error}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Analytics Dashboard</h1>
          <p className="text-sm text-gray-600">Real-time test metrics and performance tracking</p>
        </div>
        <Button
          onClick={handleManualRefresh}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? 'Refreshing...' : 'Refresh Now'}
        </Button>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <MetricCard
          title="Total Completions"
          value={analytics.reduce((sum, a) => sum + a.totalCompletions, 0)}
          description="Across all tests"
          color="bg-blue-50"
        />
        <MetricCard
          title="Avg Completion Rate"
          value={`${(analytics.reduce((sum, a) => sum + a.completionRate, 0) / (analytics.length || 1)).toFixed(1)}%`}
          description="Success rate"
          color="bg-green-50"
        />
        <MetricCard
          title="Total Retries"
          value={retryMetrics.reduce((sum, r) => sum + r.totalRetries, 0)}
          description="Failed save attempts"
          color="bg-yellow-50"
        />
        <MetricCard
          title="Total Exports"
          value={exportMetrics?.totalExports || 0}
          description="Downloaded results"
          color="bg-purple-50"
        />
      </div>

      {/* Test Performance Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Completion Rate by Test */}
        <Card>
          <CardHeader>
            <CardTitle>Completion Rate by Test Type</CardTitle>
            <CardDescription>Success rate for each personality assessment</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="testType" angle={-45} textAnchor="end" height={100} />
                  <YAxis label={{ value: 'Rate %', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Bar dataKey="completionRate" fill="#3b82f6" name="Completion Rate %" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                No data available
              </div>
            )}
          </CardContent>
        </Card>

        {/* Average Duration by Test */}
        <Card>
          <CardHeader>
            <CardTitle>Average Completion Time</CardTitle>
            <CardDescription>Minutes per test type</CardDescription>
          </CardHeader>
          <CardContent>
            {analytics.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={analytics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="testType" angle={-45} textAnchor="end" height={100} />
                  <YAxis label={{ value: 'Minutes', angle: -90, position: 'insideLeft' }} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="avgDurationMinutes" stroke="#10b981" name="Avg Duration" />
                  <Line type="monotone" dataKey="medianDuration" stroke="#f59e0b" name="Median Duration" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                No data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Retry & Export Metrics */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Retry Success Rate */}
        <Card>
          <CardHeader>
            <CardTitle>Retry Success Rate</CardTitle>
            <CardDescription>Database save retry performance</CardDescription>
          </CardHeader>
          <CardContent>
            {retryMetrics.length > 0 ? (
              <div className="space-y-4">
                {retryMetrics.map((metric) => {
                  const successRate = metric.totalRetries > 0
                    ? ((metric.successfulRetries / metric.totalRetries) * 100).toFixed(1)
                    : 0
                  return (
                    <div key={metric.testType}>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="font-medium text-gray-700">{metric.testType}</span>
                        <span className="text-blue-600 font-bold">{successRate}%</span>
                      </div>
                      <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-green-500"
                          style={{ width: `${successRate}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>{metric.successfulRetries} successful</span>
                        <span>{metric.failedRetries} failed</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-gray-500 text-center py-8">No retry data available</div>
            )}
          </CardContent>
        </Card>

        {/* Export Format Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Export Format Distribution</CardTitle>
            <CardDescription>User-selected export formats</CardDescription>
          </CardHeader>
          <CardContent>
            {exportMetrics && exportMetrics.totalExports > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={[
                      { name: 'CSV', value: exportMetrics.csvExports },
                      { name: 'PDF', value: exportMetrics.pdfExports },
                      { name: 'JSON', value: exportMetrics.jsonExports },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {[0, 1, 2].map((index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-80 flex items-center justify-center text-gray-500">
                No export data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Detailed Test Metrics Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Test Metrics</CardTitle>
          <CardDescription>Complete metrics for each test type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-2 px-4 font-semibold text-gray-700">Test Type</th>
                  <th className="text-right py-2 px-4 font-semibold text-gray-700">Completions</th>
                  <th className="text-right py-2 px-4 font-semibold text-gray-700">Attempts</th>
                  <th className="text-right py-2 px-4 font-semibold text-gray-700">Avg Duration</th>
                  <th className="text-right py-2 px-4 font-semibold text-gray-700">P95 Duration</th>
                  <th className="text-right py-2 px-4 font-semibold text-gray-700">Completion %</th>
                </tr>
              </thead>
              <tbody>
                {analytics.length > 0 ? (
                  analytics.map((metric) => (
                    <tr key={metric.testType} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium text-gray-900">{metric.testType}</td>
                      <td className="py-3 px-4 text-right text-gray-700">{metric.totalCompletions}</td>
                      <td className="py-3 px-4 text-right text-gray-700">{metric.totalAttempts}</td>
                      <td className="py-3 px-4 text-right text-gray-700">{metric.avgDurationMinutes.toFixed(1)}m</td>
                      <td className="py-3 px-4 text-right text-gray-700">{metric.p95Duration.toFixed(1)}m</td>
                      <td className="py-3 px-4 text-right">
                        <span className={`font-semibold ${metric.completionRate > 80 ? 'text-green-600' : metric.completionRate > 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {metric.completionRate.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-500">
                      No test data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Footer Info */}
      <div className="text-center text-xs text-gray-500 pt-4">
        <p>Dashboard auto-refreshes every 5 minutes. Last updated: {new Date().toLocaleTimeString()}</p>
      </div>
    </div>
  )
}

function MetricCard({
  title,
  value,
  description,
  color,
}: {
  title: string
  value: number | string
  description: string
  color: string
}) {
  return (
    <Card className={color}>
      <CardContent className="pt-6">
        <div className="text-sm font-medium text-gray-600">{title}</div>
        <div className="text-2xl font-bold text-gray-900 mt-2">{value}</div>
        <div className="text-xs text-gray-500 mt-1">{description}</div>
      </CardContent>
    </Card>
  )
}
