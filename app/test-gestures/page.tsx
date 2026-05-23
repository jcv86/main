"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { ArrowLeft, Hand, Smartphone, TestTube } from "lucide-react"
import { MobileGestureTester } from "@/components/mobile-gesture-tester"
import { MobileTestDetector } from "@/components/mobile-test-detector"

interface GestureEvent {
  type: string
  startX: number
  startY: number
  endX: number
  endY: number
  distance: number
  direction: string
  duration: number
  fingers: number
}

interface GestureTest {
  id: string
  name: string
  description: string
  icon: any
  status: "pending" | "testing" | "passed" | "failed"
  result?: string
  error?: string
  events: GestureEvent[]
}

export default function TestGesturesPage() {
  const [gestureResults, setGestureResults] = useState<GestureTest[]>([])
  const [deviceInfo, setDeviceInfo] = useState<any>(null)
  const router = useRouter()

  const handleGestureDetected = (gesture: GestureEvent) => {
    console.log("Gesture detected:", gesture)
  }

  const handleTestComplete = (results: GestureTest[]) => {
    setGestureResults(results)
    console.log("Gesture tests completed:", results)
  }

  const handleDeviceChange = (device: any) => {
    setDeviceInfo(device)
    console.log("Device info updated:", device)
  }

  return (
    <div className="min-h-screen bg-muted/5 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="border-purple/20 bg-background">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple/10 rounded-lg">
                  <TestTube className="h-6 w-6 text-purple" />
                </div>
                <div>
                  <CardTitle className="text-xl text-purple">Mobile Gesture Testing Suite</CardTitle>
                  <p className="text-purple text-sm">
                    Comprehensive testing for touch gestures, swipes, pinch, and mobile interactions
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-purple border-purple/30">
                  <Hand className="h-4 w-4 mr-1" />
                  Touch Testing
                </Badge>
                <Button variant="outline" onClick={() => router.push("/test-verification")}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Verification
                </Button>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Device Detection */}
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <MobileTestDetector onDeviceChange={handleDeviceChange} />
          </div>
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="h-5 w-5" />
                  Testing Overview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center p-3 bg-blue/5 rounded-lg border">
                      <div className="font-semibold text-blue">Swipe Gestures</div>
                      <div className="text-blue">Left, Right, Up, Down</div>
                    </div>
                    <div className="text-center p-3 bg-green/5 rounded-lg border">
                      <div className="font-semibold text-green">Pinch Zoom</div>
                      <div className="text-green">In & Out Scaling</div>
                    </div>
                    <div className="text-center p-3 bg-yellow/5 rounded-lg border">
                      <div className="font-semibold text-yellow">Tap Gestures</div>
                      <div className="text-yellow">Single, Double, Long</div>
                    </div>
                    <div className="text-center p-3 bg-purple/5 rounded-lg border">
                      <div className="font-semibold text-purple">Drag & Drop</div>
                      <div className="text-purple">Touch & Move</div>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/5 rounded-lg">
                    <h4 className="font-medium mb-2">What We Test:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Touch event detection and handling</li>
                      <li>• Multi-finger gesture recognition</li>
                      <li>• Gesture accuracy and response times</li>
                      <li>• Cross-browser compatibility</li>
                      <li>• Mobile-specific interaction patterns</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Main Gesture Tester */}
        <MobileGestureTester onGestureDetected={handleGestureDetected} onTestComplete={handleTestComplete} />

        {/* Results Summary */}
        {gestureResults.length > 0 && (
          <Card className="border-green/20 bg-green/5">
            <CardHeader>
              <CardTitle className="text-green">Test Results Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-3 bg-white rounded-lg border">
                  <div className="text-2xl font-bold text-green">
                    {gestureResults.filter((r) => r.status === "passed").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Passed</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border">
                  <div className="text-2xl font-bold text-[rgb(80,160,170)]">
                    {gestureResults.filter((r) => r.status === "failed").length}
                  </div>
                  <div className="text-sm text-muted-foreground">Failed</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border">
                  <div className="text-2xl font-bold text-blue">
                    {gestureResults.reduce((acc, r) => acc + r.events.length, 0)}
                  </div>
                  <div className="text-sm text-muted-foreground">Events Detected</div>
                </div>
                <div className="text-center p-3 bg-white rounded-lg border">
                  <div className="text-2xl font-bold text-purple">
                    {Math.round(
                      (gestureResults.filter((r) => r.status === "passed").length / gestureResults.length) * 100,
                    )}
                    %
                  </div>
                  <div className="text-sm text-muted-foreground">Success Rate</div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
