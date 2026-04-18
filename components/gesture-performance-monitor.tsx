"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Activity, Zap, Clock, TrendingUp, TrendingDown, BarChart3, RefreshCw } from "lucide-react"

interface GestureMetrics {
  gestureType: string
  responseTime: number
  accuracy: number
  timestamp: number
  success: boolean
  deviceType: string
}

interface PerformanceStats {
  averageResponseTime: number
  successRate: number
  totalGestures: number
  gestureBreakdown: Record<string, { count: number; avgTime: number; successRate: number }>
  performanceTrend: "improving" | "stable" | "declining"
}

export function GesturePerformanceMonitor() {
  const [metrics, setMetrics] = useState<GestureMetrics[]>([])
  const [stats, setStats] = useState<PerformanceStats | null>(null)
  const [isMonitoring, setIsMonitoring] = useState(false)
  const [realtimeData, setRealtimeData] = useState<GestureMetrics[]>([])
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Simulate real-time gesture data
  const generateMockGestureData = (): GestureMetrics => {
    const gestureTypes = ["swipe", "pinch", "tap", "doubleTap", "longPress", "drag"]
    const deviceTypes = ["mobile", "tablet", "desktop"]

    const gestureType = gestureTypes[Math.floor(Math.random() * gestureTypes.length)]
    const deviceType = deviceTypes[Math.floor(Math.random() * deviceTypes.length)]

    // Simulate realistic response times based on gesture type and device
    let baseTime = 50
    switch (gestureType) {
      case "tap":
        baseTime = 30
        break
      case "swipe":
        baseTime = 80
        break
      case "pinch":
        baseTime = 120
        break
      case "doubleTap":
        baseTime = 150
        break
      case "longPress":
        baseTime = 500
        break
      case "drag":
        baseTime = 200
        break
    }

    // Add device-specific latency
    const deviceMultiplier = deviceType === "mobile" ? 1 : deviceType === "tablet" ? 1.2 : 1.5
    const responseTime = Math.round(baseTime * deviceMultiplier + Math.random() * 50)

    // Simulate accuracy (higher for simpler gestures)
    const baseAccuracy = gestureType === "tap" ? 95 : gestureType === "swipe" ? 85 : 75
    const accuracy = Math.round(baseAccuracy + Math.random() * 20 - 10)

    // Success rate based on accuracy
    const success = accuracy > 70 && Math.random() > 0.1

    return {
      gestureType,
      responseTime,
      accuracy: Math.max(0, Math.min(100, accuracy)),
      timestamp: Date.now(),
      success,
      deviceType,
    }
  }

  // Calculate performance statistics
  const calculateStats = (data: GestureMetrics[]): PerformanceStats => {
    if (data.length === 0) {
      return {
        averageResponseTime: 0,
        successRate: 0,
        totalGestures: 0,
        gestureBreakdown: {},
        performanceTrend: "stable",
      }
    }

    const totalGestures = data.length
    const successfulGestures = data.filter((m) => m.success).length
    const successRate = Math.round((successfulGestures / totalGestures) * 100)
    const averageResponseTime = Math.round(data.reduce((sum, m) => sum + m.responseTime, 0) / totalGestures)

    // Calculate gesture breakdown
    const gestureBreakdown: Record<string, { count: number; avgTime: number; successRate: number }> = {}

    data.forEach((metric) => {
      if (!gestureBreakdown[metric.gestureType]) {
        gestureBreakdown[metric.gestureType] = { count: 0, avgTime: 0, successRate: 0 }
      }
      gestureBreakdown[metric.gestureType].count++
    })

    Object.keys(gestureBreakdown).forEach((gestureType) => {
      const gestureData = data.filter((m) => m.gestureType === gestureType)
      const avgTime = Math.round(gestureData.reduce((sum, m) => sum + m.responseTime, 0) / gestureData.length)
      const successCount = gestureData.filter((m) => m.success).length
      const successRate = Math.round((successCount / gestureData.length) * 100)

      gestureBreakdown[gestureType].avgTime = avgTime
      gestureBreakdown[gestureType].successRate = successRate
    })

    // Determine performance trend (simplified)
    let performanceTrend: "improving" | "stable" | "declining" = "stable"
    if (data.length >= 10) {
      const recent = data.slice(-5)
      const older = data.slice(-10, -5)

      const recentAvg = recent.reduce((sum, m) => sum + m.responseTime, 0) / recent.length
      const olderAvg = older.reduce((sum, m) => sum + m.responseTime, 0) / older.length

      if (recentAvg < olderAvg * 0.9) {
        performanceTrend = "improving"
      } else if (recentAvg > olderAvg * 1.1) {
        performanceTrend = "declining"
      }
    }

    return {
      averageResponseTime,
      successRate,
      totalGestures,
      gestureBreakdown,
      performanceTrend,
    }
  }

  // Start monitoring
  const startMonitoring = () => {
    setIsMonitoring(true)
    intervalRef.current = setInterval(
      () => {
        const newMetric = generateMockGestureData()
        setMetrics((prev) => [...prev, newMetric].slice(-100)) // Keep last 100 metrics
        setRealtimeData((prev) => [newMetric, ...prev.slice(0, 9)]) // Keep last 10 for realtime display
      },
      1000 + Math.random() * 2000,
    ) // Random interval between 1-3 seconds
  }

  // Stop monitoring
  const stopMonitoring = () => {
    setIsMonitoring(false)
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  // Reset data
  const resetData = () => {
    setMetrics([])
    setRealtimeData([])
    setStats(null)
  }

  // Update stats when metrics change
  useEffect(() => {
    if (metrics.length > 0) {
      setStats(calculateStats(metrics))
    }
  }, [metrics])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "improving":
        return <TrendingUp className="h-4 w-4 text-green-500" />
      case "declining":
        return <TrendingDown className="h-4 w-4 text-red" />
      default:
        return <BarChart3 className="h-4 w-4 text-blue-500" />
    }
  }

  const getPerformanceColor = (value: number, type: "time" | "rate") => {
    if (type === "time") {
      return value < 100 ? "text-green-600" : value < 200 ? "text-yellow-600" : "text-red-600"
    } else {
      return value >= 90 ? "text-green-600" : value >= 70 ? "text-yellow-600" : "text-red-600"
    }
  }

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Activity className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl text-blue-900">Gesture Performance Monitor</CardTitle>
                <p className="text-blue-700 text-sm">Real-time gesture performance tracking and analytics</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={isMonitoring ? stopMonitoring : startMonitoring}
                variant={isMonitoring ? "destructive" : "default"}
              >
                {isMonitoring ? (
                  <>
                    <Activity className="h-4 w-4 mr-2 animate-pulse" />
                    Stop Monitoring
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Start Monitoring
                  </>
                )}
              </Button>
              <Button onClick={resetData} variant="outline" disabled={isMonitoring}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset Data
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Status Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-white rounded-[28px] border">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Activity className={`h-5 w-5 ${isMonitoring ? "text-green-500 animate-pulse" : "text-muted/40"}`} />
                <span className="font-semibold">Status</span>
              </div>
              <Badge variant={isMonitoring ? "default" : "outline"}>
                {isMonitoring ? "🟢 Monitoring" : "⚪ Stopped"}
              </Badge>
            </div>
            <div className="text-center p-3 bg-white rounded-[28px] border">
              <div className="flex items-center justify-center gap-2 mb-2">
                <BarChart3 className="h-5 w-5 text-blue-500" />
                <span className="font-semibold">Total Gestures</span>
              </div>
              <span className="text-2xl font-bold">{stats?.totalGestures || 0}</span>
            </div>
            <div className="text-center p-3 bg-white rounded-[28px] border">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-orange" />
                <span className="font-semibold">Avg Response</span>
              </div>
              <span className={`text-2xl font-bold ${getPerformanceColor(stats?.averageResponseTime || 0, "time")}`}>
                {stats?.averageResponseTime || 0}ms
              </span>
            </div>
            <div className="text-center p-3 bg-white rounded-[28px] border">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <span className="font-semibold">Success Rate</span>
              </div>
              <span className={`text-2xl font-bold ${getPerformanceColor(stats?.successRate || 0, "rate")}`}>
                {stats?.successRate || 0}%
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Overview */}
      {stats && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Performance Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Performance Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Overall Performance */}
              <div className="p-4 bg-muted/5 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Overall Performance</span>
                  <div className="flex items-center gap-2">
                    {getTrendIcon(stats.performanceTrend)}
                    <span className="text-sm capitalize">{stats.performanceTrend}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Response Time</span>
                    <span className={getPerformanceColor(stats.averageResponseTime, "time")}>
                      {stats.averageResponseTime}ms
                    </span>
                  </div>
                  <Progress value={Math.max(0, 100 - stats.averageResponseTime / 5)} className="h-2" />
                  <div className="flex justify-between text-sm">
                    <span>Success Rate</span>
                    <span className={getPerformanceColor(stats.successRate, "rate")}>{stats.successRate}%</span>
                  </div>
                  <Progress value={stats.successRate} className="h-2" />
                </div>
              </div>

              {/* Gesture Breakdown */}
              <div>
                <h4 className="font-medium mb-3">Gesture Performance Breakdown</h4>
                <div className="space-y-3">
                  {Object.entries(stats.gestureBreakdown).map(([gestureType, data]) => (
                    <div key={gestureType} className="p-3 bg-white border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium capitalize">{gestureType}</span>
                        <Badge variant="outline">{data.count} samples</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted/60">Avg Time:</span>
                          <span className={`ml-2 font-mono ${getPerformanceColor(data.avgTime, "time")}`}>
                            {data.avgTime}ms
                          </span>
                        </div>
                        <div>
                          <span className="text-muted/60">Success:</span>
                          <span className={`ml-2 font-mono ${getPerformanceColor(data.successRate, "rate")}`}>
                            {data.successRate}%
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Real-time Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Real-time Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {realtimeData.length === 0 ? (
                  <div className="text-center py-8 text-muted/50">
                    {isMonitoring ? "Waiting for gesture data..." : "Start monitoring to see real-time data"}
                  </div>
                ) : (
                  realtimeData.map((metric, index) => (
                    <div
                      key={`${metric.timestamp}-${index}`}
                      className={`p-3 rounded-[28px] border transition-all ${
                        metric.success ? "bg-green-50 border-green-200" : "bg-red/5 border-red/20"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Badge variant={metric.success ? "default" : "destructive"}>
                            {metric.success ? "✅" : "❌"}
                          </Badge>
                          <div>
                            <span className="font-medium capitalize">{metric.gestureType}</span>
                            <span className="text-sm text-muted/50 ml-2">on {metric.deviceType}</span>
                          </div>
                        </div>
                        <div className="text-right text-sm">
                          <div className={`font-mono ${getPerformanceColor(metric.responseTime, "time")}`}>
                            {metric.responseTime}ms
                          </div>
                          <div className="text-muted/50">{new Date(metric.timestamp).toLocaleTimeString()}</div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-muted/60">
                          <span>Accuracy: {metric.accuracy}%</span>
                          <Progress value={metric.accuracy} className="w-20 h-1" />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Performance Insights */}
      {stats && stats.totalGestures > 10 && (
        <Card className="border-green-200 bg-green-50">
          <CardHeader>
            <CardTitle className="text-green-900">Performance Insights</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h4 className="font-medium text-green-900">Strengths</h4>
                <div className="space-y-2 text-sm">
                  {stats.successRate >= 90 && (
                    <div className="flex items-center gap-2 text-green-700">
                      <span>✅</span>
                      <span>Excellent gesture recognition rate ({stats.successRate}%)</span>
                    </div>
                  )}
                  {stats.averageResponseTime < 100 && (
                    <div className="flex items-center gap-2 text-green-700">
                      <span>⚡</span>
                      <span>Fast response times (avg {stats.averageResponseTime}ms)</span>
                    </div>
                  )}
                  {stats.performanceTrend === "improving" && (
                    <div className="flex items-center gap-2 text-green-700">
                      <span>📈</span>
                      <span>Performance is improving over time</span>
                    </div>
                  )}
                  {Object.values(stats.gestureBreakdown).some((g) => g.successRate >= 95) && (
                    <div className="flex items-center gap-2 text-green-700">
                      <span>🎯</span>
                      <span>Some gestures have near-perfect accuracy</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="font-medium text-green-900">Recommendations</h4>
                <div className="space-y-2 text-sm">
                  {stats.averageResponseTime > 200 && (
                    <div className="flex items-center gap-2 text-yellow-700">
                      <span>⚠️</span>
                      <span>Consider optimizing gesture detection algorithms</span>
                    </div>
                  )}
                  {stats.successRate < 80 && (
                    <div className="flex items-center gap-2 text-yellow-700">
                      <span>🔧</span>
                      <span>Review gesture sensitivity settings</span>
                    </div>
                  )}
                  {Object.values(stats.gestureBreakdown).some((g) => g.successRate < 70) && (
                    <div className="flex items-center gap-2 text-yellow-700">
                      <span>🎯</span>
                      <span>Focus on improving low-performing gestures</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-blue-700">
                    <span>📊</span>
                    <span>Continue monitoring for trend analysis</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
