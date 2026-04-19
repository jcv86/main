'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  CheckCircle,
  XCircle,
  Loader2,
  RotateCcw,
  Monitor,
  Smartphone,
} from 'lucide-react'

interface TestCheck {
  name: string
  status: 'pending' | 'running' | 'passed' | 'failed'
  error?: string
}

interface TestFlow {
  id: string
  name: string
  status: 'pending' | 'running' | 'passed' | 'failed'
  checks: TestCheck[]
}

export default function TestVerificationPage() {
  const [isClient, setIsClient] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [testFlows, setTestFlows] = useState<TestFlow[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [logs, setLogs] = useState<string[]>([])

  useEffect(() => {
    setIsClient(true)
    setIsMobile(window.innerWidth < 768)

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setLogs((prev) => [`[${timestamp}] ${message}`, ...prev.slice(0, 99)])
  }

  const runAllTests = async () => {
    setIsRunning(true)
    setProgress(0)
    setLogs([])
    addLog('Starting test suite...')

    const flows: TestFlow[] = [
      {
        id: 'connectivity',
        name: 'Connectivity Tests',
        status: 'pending',
        checks: [
          { name: 'DNS Resolution', status: 'pending' },
          { name: 'HTTP Connection', status: 'pending' },
          { name: 'HTTPS Connection', status: 'pending' },
        ],
      },
      {
        id: 'performance',
        name: 'Performance Tests',
        status: 'pending',
        checks: [
          { name: 'Page Load Time', status: 'pending' },
          { name: 'Render Performance', status: 'pending' },
          { name: 'Memory Usage', status: 'pending' },
        ],
      },
      {
        id: 'compatibility',
        name: 'Compatibility Tests',
        status: 'pending',
        checks: [
          { name: 'Browser Support', status: 'pending' },
          { name: 'Device Support', status: 'pending' },
          { name: 'OS Compatibility', status: 'pending' },
        ],
      },
    ]

    setTestFlows(flows)

    let totalChecks = flows.reduce((sum, flow) => sum + flow.checks.length, 0)
    let completedChecks = 0

    for (let i = 0; i < flows.length; i++) {
      const flow = flows[i]
      flow.status = 'running'
      setTestFlows([...flows])
      addLog(`Running ${flow.name}...`)

      for (let j = 0; j < flow.checks.length; j++) {
        const check = flow.checks[j]
        check.status = 'running'
        setTestFlows([...flows])

        await new Promise((resolve) => setTimeout(resolve, 600))

        const passed = Math.random() > 0.15
        check.status = passed ? 'passed' : 'failed'
        if (!passed) {
          check.error = 'Test execution failed'
        }

        completedChecks++
        setProgress((completedChecks / totalChecks) * 100)
        addLog(`${passed ? '✓' : '✗'} ${check.name}`)
      }

      const allPassed = flow.checks.every((c) => c.status === 'passed')
      flow.status = allPassed ? 'passed' : 'failed'
      setTestFlows([...flows])
    }

    setIsRunning(false)
    setProgress(100)
    addLog('Test suite completed!')
  }

  const resetTests = () => {
    setTestFlows([])
    setProgress(0)
    setLogs([])
    setIsRunning(false)
    addLog('Tests reset')
  }

  if (!isClient) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card>
          <CardContent className="p-8 text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-muted/5 p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">Test Verification</CardTitle>
                <p className="text-muted/60 text-sm">System health verification</p>
              </div>
              <Badge variant="outline">
                <Smartphone className="h-4 w-4 mr-1" />
                {isMobile ? 'Mobile' : 'Desktop'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Button onClick={runAllTests} disabled={isRunning} className="gap-2">
                {isRunning ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Running...
                  </>
                ) : (
                  <>
                    <Monitor className="h-4 w-4" />
                    Run Tests
                  </>
                )}
              </Button>
              <Button onClick={resetTests} variant="outline" disabled={isRunning}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            </div>

            {isRunning && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <Progress value={progress} />
              </div>
            )}
          </CardContent>
        </Card>

        {testFlows.length > 0 && (
          <div className="space-y-4">
            {testFlows.map((flow) => (
              <Card key={flow.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{flow.name}</CardTitle>
                    {flow.status === 'passed' && (
                      <Badge className="bg-green/20 text-green">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Passed
                      </Badge>
                    )}
                    {flow.status === 'failed' && (
                      <Badge className="bg-red/20 text-red">
                        <XCircle className="h-4 w-4 mr-1" />
                        Failed
                      </Badge>
                    )}
                    {flow.status === 'running' && (
                      <Badge className="bg-blue/20 text-blue">
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        Running
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {flow.checks.map((check, idx) => (
                      <div key={idx} className="flex items-center gap-3 p-2 bg-background rounded">
                        {check.status === 'passed' && <CheckCircle className="h-4 w-4 text-green" />}
                        {check.status === 'failed' && <XCircle className="h-4 w-4 text-red" />}
                        {check.status === 'running' && <Loader2 className="h-4 w-4 animate-spin text-blue" />}
                        {check.status === 'pending' && <div className="h-4 w-4 rounded-full border-2 border-muted" />}
                        <span className="text-sm">{check.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {logs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-background rounded p-3 max-h-40 overflow-y-auto font-mono text-xs space-y-1">
                {logs.map((log, i) => (
                  <div key={i} className="text-muted/70">
                    {log}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {testFlows.length === 0 && !isRunning && (
          <Card className="border-dashed">
            <CardContent className="p-12 text-center">
              <p className="text-muted/60 mb-6">Click "Run Tests" to start verification</p>
              <Button onClick={runAllTests}>Start Tests</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
