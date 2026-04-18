"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Clock, AlertTriangle, RefreshCw, PlayCircle, Loader2 } from "lucide-react"

interface TestMetrics {
  testId: string
  testName: string
  status: "idle" | "running" | "passed" | "failed"
  startTime?: number
  endTime?: number
  duration?: number
  checksCompleted: number
  totalChecks: number
  errors: string[]
}

interface TestFlowMonitorProps {
  onRunTest?: (testId: string) => void
  onRunAllTests?: () => void
  onResetTests?: () => void
}

export function TestFlowMonitor({ onRunTest, onRunAllTests, onResetTests }: TestFlowMonitorProps) {
  const [metrics, setMetrics] = useState<TestMetrics[]>([
    {
      testId: "disc",
      testName: "DISC Assessment",
      status: "idle",
      checksCompleted: 0,
      totalChecks: 5,
      errors: [],
    },
    {
      testId: "emotional-intelligence",
      testName: "Emotional Intelligence",
      status: "idle",
      checksCompleted: 0,
      totalChecks: 5,
      errors: [],
    },
    {
      testId: "mbti",
      testName: "MBTI Personality",
      status: "idle",
      checksCompleted: 0,
      totalChecks: 5,
      errors: [],
    },
    {
      testId: "big-five",
      testName: "Big Five Personality",
      status: "idle",
      checksCompleted: 0,
      totalChecks: 5,
      errors: [],
    },
    {
      testId: "riasec",
      testName: "RIASEC Career Interests",
      status: "idle",
      checksCompleted: 0,
      totalChecks: 5,
      errors: [],
    },
    {
      testId: "soft-skills",
      testName: "Soft Skills Assessment",
      status: "idle",
      checksCompleted: 0,
      totalChecks: 5,
      errors: [],
    },
  ])

  const [isRunningAll, setIsRunningAll] = useState(false)
  const [overallProgress, setOverallProgress] = useState(0)

  // Simulate test execution
  const simulateTestExecution = async (testId: string) => {
    // Update status to running
    setMetrics((prev) =>
      prev.map((m) =>
        m.testId === testId ? { ...m, status: "running", startTime: Date.now(), checksCompleted: 0, errors: [] } : m,
      ),
    )

    // Simulate 5 checks with random delays and potential failures
    for (let i = 1; i <= 5; i++) {
      await new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 700))

      // Simulate occasional failures (10% chance)
      const shouldFail = Math.random() < 0.1

      if (shouldFail) {
        setMetrics((prev) =>
          prev.map((m) =>
            m.testId === testId
              ? {
                  ...m,
                  status: "failed",
                  endTime: Date.now(),
                  duration: Date.now() - (m.startTime || Date.now()),
                  checksCompleted: i,
                  errors: [...m.errors, `Check ${i} failed: Validation error`],
                }
              : m,
          ),
        )
        return
      }

      setMetrics((prev) => prev.map((m) => (m.testId === testId ? { ...m, checksCompleted: i } : m)))
    }

    // Mark as passed
    setMetrics((prev) =>
      prev.map((m) =>
        m.testId === testId
          ? {
              ...m,
              status: "passed",
              endTime: Date.now(),
              duration: Date.now() - (m.startTime || Date.now()),
            }
          : m,
      ),
    )
  }

  // Run all tests sequentially
  const runAllTests = async () => {
    setIsRunningAll(true)
    setOverallProgress(0)

    for (let i = 0; i < metrics.length; i++) {
      await simulateTestExecution(metrics[i].testId)
      setOverallProgress(((i + 1) / metrics.length) * 100)
    }

    setIsRunningAll(false)
  }

  // Reset all tests
  const resetAllTests = () => {
    setMetrics((prev) =>
      prev.map((m) => ({
        ...m,
        status: "idle" as const,
        startTime: undefined,
        endTime: undefined,
        duration: undefined,
        checksCompleted: 0,
        errors: [],
      })),
    )
    setOverallProgress(0)
    setIsRunningAll(false)
  }

  // Get status badge
  const getStatusBadge = (status: TestMetrics["status"]) => {
    switch (status) {
      case "idle":
        return <Badge variant="outline">Idle</Badge>
      case "running":
        return <Badge className="bg-blue-500">Running</Badge>
      case "passed":
        return <Badge className="bg-green-500">Passed</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
    }
  }

  // Get status icon
  const getStatusIcon = (status: TestMetrics["status"]) => {
    switch (status) {
      case "running":
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
      case "passed":
        return <CheckCircle className="h-4 w-4 text-green/50" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red" />
      default:
        return <Clock className="h-4 w-4 text-muted/40" />
    }
  }

  const passedTests = metrics.filter((m) => m.status === "passed").length
  const failedTests = metrics.filter((m) => m.status === "failed").length
  const runningTests = metrics.filter((m) => m.status === "running").length

  return (
    <div className="space-y-6">
      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PlayCircle className="h-5 w-5" />
            Test Flow Monitor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-6 text-sm">
              <span className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green/50" />
                <span className="font-medium">{passedTests}</span> Passed
              </span>
              <span className="flex items-center gap-2">
                <XCircle className="h-4 w-4 text-red" />
                <span className="font-medium">{failedTests}</span> Failed
              </span>
              <span className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 text-blue-500" />
                <span className="font-medium">{runningTests}</span> Running
              </span>
            </div>
            <div className="flex gap-2">
              <Button onClick={resetAllTests} variant="outline" disabled={isRunningAll} size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset
              </Button>
              <Button onClick={runAllTests} disabled={isRunningAll} size="sm">
                {isRunningAll ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <PlayCircle className="h-4 w-4 mr-2" />
                    Run All
                  </>
                )}
              </Button>
            </div>
          </div>

          {isRunningAll && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Overall Progress</span>
                <span>{Math.round(overallProgress)}%</span>
              </div>
              <Progress value={overallProgress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Test Results */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <Card
            key={metric.testId}
            className={`
            ${metric.status === "passed" ? "border-green-200 bg-green-50" : ""}
            ${metric.status === "failed" ? "border-red/20 bg-red/5" : ""}
            ${metric.status === "running" ? "border-blue-200 bg-blue-50" : ""}
          `}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getStatusIcon(metric.status)}
                  <div>
                    <CardTitle className="text-sm">{metric.testName}</CardTitle>
                    <p className="text-xs text-muted/60">{metric.testId}</p>
                  </div>
                </div>
                {getStatusBadge(metric.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Progress */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span>Checks</span>
                  <span>
                    {metric.checksCompleted}/{metric.totalChecks}
                  </span>
                </div>
                <Progress value={(metric.checksCompleted / metric.totalChecks) * 100} className="h-1" />
              </div>

              {/* Duration */}
              {metric.duration && <div className="text-xs text-muted/60">Duration: {metric.duration}ms</div>}

              {/* Errors */}
              {metric.errors.length > 0 && (
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-xs text-red">
                    <AlertTriangle className="h-3 w-3" />
                    Errors ({metric.errors.length})
                  </div>
                  {metric.errors.slice(0, 2).map((error, index) => (
                    <p key={index} className="text-xs text-red truncate">
                      {error}
                    </p>
                  ))}
                </div>
              )}

              {/* Actions */}
              <Button
                size="sm"
                variant="outline"
                onClick={() => simulateTestExecution(metric.testId)}
                disabled={metric.status === "running" || isRunningAll}
                className="w-full"
              >
                {metric.status === "running" ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Testing...
                  </>
                ) : (
                  <>
                    <PlayCircle className="h-3 w-3 mr-1" />
                    Run Test
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
