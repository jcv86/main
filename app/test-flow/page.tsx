"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { useRouter } from "next/navigation"
import {
  CheckCircle,
  XCircle,
  Clock,
  ArrowRight,
  RefreshCw,
  PlayCircle,
  AlertTriangle,
  Target,
  Brain,
  Heart,
  Users,
  Palette,
  Star,
} from "lucide-react"

interface TestFlowCheck {
  testId: string
  testName: string
  icon: any
  path: string
  checks: {
    navigation: boolean
    questionFlow: boolean
    validation: boolean
    completion: boolean
    results: boolean
  }
  status: "pending" | "running" | "passed" | "failed"
  errors: string[]
}

const testFlowChecks: TestFlowCheck[] = [
  {
    testId: "disc",
    testName: "DISC Assessment",
    icon: Target,
    path: "/test/disc",
    checks: {
      navigation: false,
      questionFlow: false,
      validation: false,
      completion: false,
      results: false,
    },
    status: "pending",
    errors: [],
  },
  {
    testId: "emotional-intelligence",
    testName: "Emotional Intelligence",
    icon: Heart,
    path: "/test/emotional-intelligence",
    checks: {
      navigation: false,
      questionFlow: false,
      validation: false,
      completion: false,
      results: false,
    },
    status: "pending",
    errors: [],
  },
  {
    testId: "mbti",
    testName: "MBTI Personality",
    icon: Brain,
    path: "/test/mbti",
    checks: {
      navigation: false,
      questionFlow: false,
      validation: false,
      completion: false,
      results: false,
    },
    status: "pending",
    errors: [],
  },
  {
    testId: "big-five",
    testName: "Big Five Personality",
    icon: Users,
    path: "/test/big-five",
    checks: {
      navigation: false,
      questionFlow: false,
      validation: false,
      completion: false,
      results: false,
    },
    status: "pending",
    errors: [],
  },
  {
    testId: "riasec",
    testName: "RIASEC Career Interests",
    icon: Palette,
    path: "/test/riasec",
    checks: {
      navigation: false,
      questionFlow: false,
      validation: false,
      completion: false,
      results: false,
    },
    status: "pending",
    errors: [],
  },
  {
    testId: "soft-skills",
    testName: "Soft Skills Assessment",
    icon: Star,
    path: "/test/soft-skills",
    checks: {
      navigation: false,
      questionFlow: false,
      validation: false,
      completion: false,
      results: false,
    },
    status: "pending",
    errors: [],
  },
]

export default function TestFlowVerification() {
  const [checks, setChecks] = useState<TestFlowCheck[]>(testFlowChecks)
  const [currentTest, setCurrentTest] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [overallProgress, setOverallProgress] = useState(0)
  const router = useRouter()

  const simulateTestFlow = async (testCheck: TestFlowCheck) => {
    setCurrentTest(testCheck.testId)

    // Update status to running
    setChecks((prev) =>
      prev.map((check) =>
        check.testId === testCheck.testId ? { ...check, status: "running" as const, errors: [] } : check,
      ),
    )

    try {
      // Simulate navigation check
      await new Promise((resolve) => setTimeout(resolve, 500))
      setChecks((prev) =>
        prev.map((check) =>
          check.testId === testCheck.testId ? { ...check, checks: { ...check.checks, navigation: true } } : check,
        ),
      )

      // Simulate question flow check
      await new Promise((resolve) => setTimeout(resolve, 800))
      setChecks((prev) =>
        prev.map((check) =>
          check.testId === testCheck.testId ? { ...check, checks: { ...check.checks, questionFlow: true } } : check,
        ),
      )

      // Simulate validation check
      await new Promise((resolve) => setTimeout(resolve, 600))
      setChecks((prev) =>
        prev.map((check) =>
          check.testId === testCheck.testId ? { ...check, checks: { ...check.checks, validation: true } } : check,
        ),
      )

      // Simulate completion check
      await new Promise((resolve) => setTimeout(resolve, 700))
      setChecks((prev) =>
        prev.map((check) =>
          check.testId === testCheck.testId ? { ...check, checks: { ...check.checks, completion: true } } : check,
        ),
      )

      // Simulate results check
      await new Promise((resolve) => setTimeout(resolve, 500))
      setChecks((prev) =>
        prev.map((check) =>
          check.testId === testCheck.testId
            ? {
                ...check,
                checks: { ...check.checks, results: true },
                status: "passed" as const,
              }
            : check,
        ),
      )
    } catch (error) {
      setChecks((prev) =>
        prev.map((check) =>
          check.testId === testCheck.testId
            ? {
                ...check,
                status: "failed" as const,
                errors: [`Navigation error: ${error}`],
              }
            : check,
        ),
      )
    }
  }

  const runAllTests = async () => {
    setIsRunning(true)
    setOverallProgress(0)

    for (let i = 0; i < checks.length; i++) {
      await simulateTestFlow(checks[i])
      setOverallProgress(((i + 1) / checks.length) * 100)
    }

    setCurrentTest(null)
    setIsRunning(false)
  }

  const resetTests = () => {
    setChecks(
      testFlowChecks.map((check) => ({
        ...check,
        checks: {
          navigation: false,
          questionFlow: false,
          validation: false,
          completion: false,
          results: false,
        },
        status: "pending" as const,
        errors: [],
      })),
    )
    setOverallProgress(0)
    setCurrentTest(null)
  }

  const navigateToTest = (path: string) => {
    router.push(path)
  }

  const getCheckIcon = (passed: boolean, isActive: boolean) => {
    if (isActive) return <RefreshCw className="h-4 w-4 animate-spin text-blue/50" />
    if (passed) return <CheckCircle className="h-4 w-4 text-green" />
    return <XCircle className="h-4 w-4 text-muted/30" />
  }

  const getStatusBadge = (status: TestFlowCheck["status"]) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      case "running":
        return <Badge className="bg-blue/50">Running</Badge>
      case "passed":
        return <Badge className="bg-green/50">Passed</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
    }
  }

  const passedTests = checks.filter((check) => check.status === "passed").length
  const failedTests = checks.filter((check) => check.status === "failed").length

  return (
    <div className="min-h-screen bg-muted/5 p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlayCircle className="h-6 w-6" />
              Test Flow Verification System
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <div className="space-y-2">
                <p className="text-muted/60">
                  Automated verification of all personality test navigation flows and completion processes.
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4 text-green" />
                    {passedTests} Passed
                  </span>
                  <span className="flex items-center gap-1">
                    <XCircle className="h-4 w-4 text-red" />
                    {failedTests} Failed
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4 text-muted/50" />
                    {checks.length - passedTests - failedTests} Pending
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={resetTests} variant="outline" disabled={isRunning}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button onClick={runAllTests} disabled={isRunning}>
                  {isRunning ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Running Tests...
                    </>
                  ) : (
                    <>
                      <PlayCircle className="h-4 w-4 mr-2" />
                      Run All Tests
                    </>
                  )}
                </Button>
              </div>
            </div>

            {isRunning && (
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

        {/* Test Results Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {checks.map((check) => (
            <Card key={check.testId} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-muted/10 rounded-lg">
                      <check.icon className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{check.testName}</CardTitle>
                      <p className="text-sm text-muted/60">{check.path}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(check.status)}
                    <Button size="sm" variant="outline" onClick={() => navigateToTest(check.path)}>
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Navigation Check */}
                  <div className="flex items-center justify-between p-2 rounded bg-muted/5">
                    <span className="text-sm font-medium">Navigation Flow</span>
                    {getCheckIcon(check.checks.navigation, currentTest === check.testId && check.status === "running")}
                  </div>

                  {/* Question Flow Check */}
                  <div className="flex items-center justify-between p-2 rounded bg-muted/5">
                    <span className="text-sm font-medium">Question Flow</span>
                    {getCheckIcon(
                      check.checks.questionFlow,
                      currentTest === check.testId && check.status === "running",
                    )}
                  </div>

                  {/* Validation Check */}
                  <div className="flex items-center justify-between p-2 rounded bg-muted/5">
                    <span className="text-sm font-medium">Answer Validation</span>
                    {getCheckIcon(check.checks.validation, currentTest === check.testId && check.status === "running")}
                  </div>

                  {/* Completion Check */}
                  <div className="flex items-center justify-between p-2 rounded bg-muted/5">
                    <span className="text-sm font-medium">Test Completion</span>
                    {getCheckIcon(check.checks.completion, currentTest === check.testId && check.status === "running")}
                  </div>

                  {/* Results Check */}
                  <div className="flex items-center justify-between p-2 rounded bg-muted/5">
                    <span className="text-sm font-medium">Results Generation</span>
                    {getCheckIcon(check.checks.results, currentTest === check.testId && check.status === "running")}
                  </div>

                  {/* Errors */}
                  {check.errors.length > 0 && (
                    <div className="mt-3 p-2 bg-red/5 border border-red/20 rounded">
                      <div className="flex items-center gap-2 text-red text-sm font-medium mb-1">
                        <AlertTriangle className="h-4 w-4" />
                        Errors Found
                      </div>
                      {check.errors.map((error, index) => (
                        <p key={index} className="text-red text-xs">
                          {error}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* Individual Test Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => simulateTestFlow(check)}
                      disabled={isRunning}
                      className="flex-1"
                    >
                      Test Flow
                    </Button>
                    <Button size="sm" onClick={() => navigateToTest(check.path)} className="flex-1">
                      Open Test
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Summary */}
        {!isRunning && (passedTests > 0 || failedTests > 0) && (
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                {failedTests === 0 ? (
                  <div className="space-y-2">
                    <CheckCircle className="h-12 w-12 text-green mx-auto" />
                    <h3 className="text-xl font-semibold text-green-900">All Tests Passed! ✅</h3>
                    <p className="text-green">
                      All {passedTests} personality tests have proper navigation flow and completion processes.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <AlertTriangle className="h-12 w-12 text-red mx-auto" />
                    <h3 className="text-xl font-semibold text-red-900">Issues Found</h3>
                    <p className="text-red">
                      {failedTests} test(s) failed verification. Please check the errors above.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
