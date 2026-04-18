"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ArrowLeft, Activity, BarChart3 } from "lucide-react"
import { GesturePerformanceMonitor } from "@/components/gesture-performance-monitor"
import { MobileTestDetector } from "@/components/mobile-test-detector"

export default function TestPerformancePage() {
  const [deviceInfo, setDeviceInfo] = useState<any>(null)
  const router = useRouter()

  const handleDeviceChange = (device: any) => {
    setDeviceInfo(device)
  }

  return (
    <div className="min-h-screen bg-muted/5 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="border-blue/20 bg-gradient-to-r from-blue/5 to-blue/5">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue/10 rounded-lg">
                  <BarChart3 className="h-6 w-6 text-blue" />
                </div>
                <div>
                  <CardTitle className="text-xl text-blue">Gesture Performance Analytics</CardTitle>
                  <p className="text-blue text-sm">
                    Monitor and analyze gesture performance across all personality tests
                  </p>
                </div>
              </div>
              <Button variant="outline" onClick={() => router.push("/test-comprehensive-gestures")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Testing
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Device Info */}
        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <MobileTestDetector onDeviceChange={handleDeviceChange} />
          </div>
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Performance Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="text-center p-3 bg-blue/5 rounded-lg">
                    <div className="font-semibold text-blue">Response Time</div>
                    <div className="text-blue">Target: &lt;100ms</div>
                  </div>
                  <div className="text-center p-3 bg-green/5 rounded-lg">
                    <div className="font-semibold text-green-900">Success Rate</div>
                    <div className="text-green">Target: &gt;90%</div>
                  </div>
                  <div className="text-center p-3 bg-yellow/5 rounded-lg">
                    <div className="font-semibold text-yellow">Accuracy</div>
                    <div className="text-yellow-700">Target: &gt;85%</div>
                  </div>
                  <div className="text-center p-3 bg-purple/5 rounded-lg">
                    <div className="font-semibold text-purple">Reliability</div>
                    <div className="text-purple">Target: 99.9%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Performance Monitor */}
        <GesturePerformanceMonitor />

        {/* Performance Guidelines */}
        <Card className="border-muted/20">
          <CardHeader>
            <CardTitle>Performance Guidelines & Benchmarks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-3 text-green-900">Excellent Performance</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Response Time:</span>
                    <span className="font-mono text-green">&lt; 50ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Success Rate:</span>
                    <span className="font-mono text-green">&gt; 95%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accuracy:</span>
                    <span className="font-mono text-green">&gt; 90%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>User Experience:</span>
                    <span className="text-green">Seamless</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-yellow">Good Performance</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Response Time:</span>
                    <span className="font-mono text-yellow">50-100ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Success Rate:</span>
                    <span className="font-mono text-yellow">85-95%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accuracy:</span>
                    <span className="font-mono text-yellow">75-90%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>User Experience:</span>
                    <span className="text-yellow">Acceptable</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-3 text-red-900">Needs Improvement</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Response Time:</span>
                    <span className="font-mono text-red">&gt; 100ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Success Rate:</span>
                    <span className="font-mono text-red">&lt; 85%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Accuracy:</span>
                    <span className="font-mono text-red">&lt; 75%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>User Experience:</span>
                    <span className="text-red">Frustrating</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
