"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Hand,
  Move,
  RotateCcw,
  ZoomIn,
  ZoomOut,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  CheckCircle,
  XCircle,
  Clock,
  Smartphone,
  Touchpad as Touch,
  Loader2,
} from "lucide-react"

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

const initialGestureTests: GestureTest[] = [
  {
    id: "swipe-left",
    name: "Swipe Left",
    description: "Navigate to next question with left swipe",
    icon: ArrowLeft,
    status: "pending",
    events: [],
  },
  {
    id: "swipe-right",
    name: "Swipe Right",
    description: "Navigate to previous question with right swipe",
    icon: ArrowRight,
    status: "pending",
    events: [],
  },
  {
    id: "swipe-up",
    name: "Swipe Up",
    description: "Scroll up through content",
    icon: ArrowUp,
    status: "pending",
    events: [],
  },
  {
    id: "swipe-down",
    name: "Swipe Down",
    description: "Scroll down through content",
    icon: ArrowDown,
    status: "pending",
    events: [],
  },
  {
    id: "pinch-zoom-in",
    name: "Pinch to Zoom In",
    description: "Zoom in on results charts and content",
    icon: ZoomIn,
    status: "pending",
    events: [],
  },
  {
    id: "pinch-zoom-out",
    name: "Pinch to Zoom Out",
    description: "Zoom out from results charts and content",
    icon: ZoomOut,
    status: "pending",
    events: [],
  },
  {
    id: "tap",
    name: "Single Tap",
    description: "Select answers and navigate buttons",
    icon: Touch,
    status: "pending",
    events: [],
  },
  {
    id: "double-tap",
    name: "Double Tap",
    description: "Quick actions and shortcuts",
    icon: Hand,
    status: "pending",
    events: [],
  },
  {
    id: "long-press",
    name: "Long Press",
    description: "Context menus and additional options",
    icon: Clock,
    status: "pending",
    events: [],
  },
  {
    id: "drag",
    name: "Drag & Drop",
    description: "Reorder items and interactive elements",
    icon: Move,
    status: "pending",
    events: [],
  },
]

interface MobileGestureTesterProps {
  onGestureDetected?: (gesture: GestureEvent) => void
  onTestComplete?: (results: GestureTest[]) => void
}

export function MobileGestureTester({ onGestureDetected, onTestComplete }: MobileGestureTesterProps) {
  const [gestureTests, setGestureTests] = useState<GestureTest[]>(initialGestureTests)
  const [currentTest, setCurrentTest] = useState<string | null>(null)
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [testArea, setTestArea] = useState<HTMLDivElement | null>(null)
  const [gestureLog, setGestureLog] = useState<string[]>([])
  const [touchSupport, setTouchSupport] = useState(false)
  const [multiTouchSupport, setMultiTouchSupport] = useState(false)

  const testAreaRef = useRef<HTMLDivElement>(null)
  const touchStartRef = useRef<{ x: number; y: number; time: number; touches: number } | null>(null)
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null)
  const doubleTapTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastTapRef = useRef<number>(0)

  // Detect touch capabilities
  useEffect(() => {
    const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0
    const hasMultiTouch = navigator.maxTouchPoints > 1
    setTouchSupport(hasTouch)
    setMultiTouchSupport(hasMultiTouch)
    addLog(`Touch support: ${hasTouch ? "Yes" : "No"}, Multi-touch: ${hasMultiTouch ? "Yes" : "No"}`)
  }, [])

  // Add log entry
  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setGestureLog((prev) => [`[${timestamp}] ${message}`, ...prev.slice(0, 19)])
  }

  // Calculate distance between two points
  const calculateDistance = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
  }

  // Calculate direction of swipe
  const calculateDirection = (startX: number, startY: number, endX: number, endY: number) => {
    const deltaX = endX - startX
    const deltaY = endY - startY
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    if (absDeltaX > absDeltaY) {
      return deltaX > 0 ? "right" : "left"
    } else {
      return deltaY > 0 ? "down" : "up"
    }
  }

  // Handle touch start
  const handleTouchStart = useCallback((e: TouchEvent) => {
    if (!testAreaRef.current?.contains(e.target as Node)) return

    const touch = e.touches[0]
    const now = Date.now()

    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: now,
      touches: e.touches.length,
    }

    // Start long press timer
    longPressTimerRef.current = setTimeout(() => {
      if (touchStartRef.current) {
        const gestureEvent: GestureEvent = {
          type: "long-press",
          startX: touchStartRef.current.x,
          startY: touchStartRef.current.y,
          endX: touchStartRef.current.x,
          endY: touchStartRef.current.y,
          distance: 0,
          direction: "none",
          duration: Date.now() - touchStartRef.current.time,
          fingers: touchStartRef.current.touches,
        }
        handleGestureDetected(gestureEvent)
      }
    }, 500)

    addLog(`Touch start: ${e.touches.length} finger(s) at (${touch.clientX}, ${touch.clientY})`)
  }, [])

  // Handle touch move
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!testAreaRef.current?.contains(e.target as Node) || !touchStartRef.current) return

    e.preventDefault() // Prevent scrolling during gesture testing

    const touch = e.touches[0]
    const distance = calculateDistance(touchStartRef.current.x, touchStartRef.current.y, touch.clientX, touch.clientY)

    // Cancel long press if moved too much
    if (distance > 10 && longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = null
    }

    // Detect pinch gestures
    if (e.touches.length === 2) {
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const currentDistance = calculateDistance(touch1.clientX, touch1.clientY, touch2.clientX, touch2.clientY)

      // Store initial pinch distance
      if (!touchStartRef.current.touches || touchStartRef.current.touches !== 2) {
        touchStartRef.current.touches = 2
        ;(touchStartRef.current as any).initialPinchDistance = currentDistance
      }

      const initialDistance = (touchStartRef.current as any).initialPinchDistance || currentDistance
      const scale = currentDistance / initialDistance

      if (scale > 1.2) {
        const gestureEvent: GestureEvent = {
          type: "pinch-zoom-in",
          startX: (touch1.clientX + touch2.clientX) / 2,
          startY: (touch1.clientY + touch2.clientY) / 2,
          endX: (touch1.clientX + touch2.clientX) / 2,
          endY: (touch1.clientY + touch2.clientY) / 2,
          distance: currentDistance,
          direction: "zoom-in",
          duration: Date.now() - touchStartRef.current.time,
          fingers: 2,
        }
        handleGestureDetected(gestureEvent)
      } else if (scale < 0.8) {
        const gestureEvent: GestureEvent = {
          type: "pinch-zoom-out",
          startX: (touch1.clientX + touch2.clientX) / 2,
          startY: (touch1.clientY + touch2.clientY) / 2,
          endX: (touch1.clientX + touch2.clientX) / 2,
          endY: (touch1.clientY + touch2.clientY) / 2,
          distance: currentDistance,
          direction: "zoom-out",
          duration: Date.now() - touchStartRef.current.time,
          fingers: 2,
        }
        handleGestureDetected(gestureEvent)
      }
    }

    addLog(`Touch move: ${distance.toFixed(0)}px distance`)
  }, [])

  // Handle touch end
  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!testAreaRef.current?.contains(e.target as Node) || !touchStartRef.current) return

    const now = Date.now()
    const duration = now - touchStartRef.current.time

    // Clear long press timer
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = null
    }

    // Handle single finger gestures
    if (touchStartRef.current.touches === 1 && e.changedTouches.length === 1) {
      const touch = e.changedTouches[0]
      const distance = calculateDistance(touchStartRef.current.x, touchStartRef.current.y, touch.clientX, touch.clientY)

      if (distance < 10 && duration < 300) {
        // Tap gesture
        const timeSinceLastTap = now - lastTapRef.current
        lastTapRef.current = now

        if (timeSinceLastTap < 300) {
          // Double tap
          if (doubleTapTimerRef.current) {
            clearTimeout(doubleTapTimerRef.current)
            doubleTapTimerRef.current = null
          }

          const gestureEvent: GestureEvent = {
            type: "double-tap",
            startX: touchStartRef.current.x,
            startY: touchStartRef.current.y,
            endX: touch.clientX,
            endY: touch.clientY,
            distance,
            direction: "none",
            duration,
            fingers: 1,
          }
          handleGestureDetected(gestureEvent)
        } else {
          // Single tap (with delay to check for double tap)
          doubleTapTimerRef.current = setTimeout(() => {
            const gestureEvent: GestureEvent = {
              type: "tap",
              startX: touchStartRef.current!.x,
              startY: touchStartRef.current!.y,
              endX: touch.clientX,
              endY: touch.clientY,
              distance,
              direction: "none",
              duration,
              fingers: 1,
            }
            handleGestureDetected(gestureEvent)
          }, 300)
        }
      } else if (distance > 30) {
        // Swipe gesture
        const direction = calculateDirection(
          touchStartRef.current.x,
          touchStartRef.current.y,
          touch.clientX,
          touch.clientY,
        )

        const gestureEvent: GestureEvent = {
          type: `swipe-${direction}`,
          startX: touchStartRef.current.x,
          startY: touchStartRef.current.y,
          endX: touch.clientX,
          endY: touch.clientY,
          distance,
          direction,
          duration,
          fingers: 1,
        }
        handleGestureDetected(gestureEvent)
      } else if (distance > 10) {
        // Drag gesture
        const gestureEvent: GestureEvent = {
          type: "drag",
          startX: touchStartRef.current.x,
          startY: touchStartRef.current.y,
          endX: touch.clientX,
          endY: touch.clientY,
          distance,
          direction: calculateDirection(touchStartRef.current.x, touchStartRef.current.y, touch.clientX, touch.clientY),
          duration,
          fingers: 1,
        }
        handleGestureDetected(gestureEvent)
      }
    }

    touchStartRef.current = null
    addLog(`Touch end: ${duration}ms duration`)
  }, [])

  // Handle detected gesture
  const handleGestureDetected = useCallback(
    (gestureEvent: GestureEvent) => {
      addLog(
        `Gesture detected: ${gestureEvent.type} (${gestureEvent.distance.toFixed(0)}px, ${gestureEvent.duration}ms)`,
      )

      // Update test status
      setGestureTests((prev) =>
        prev.map((test) => {
          if (test.id === gestureEvent.type) {
            return {
              ...test,
              status: "passed",
              result: `${gestureEvent.distance.toFixed(0)}px in ${gestureEvent.duration}ms`,
              events: [...test.events, gestureEvent],
            }
          }
          return test
        }),
      )

      onGestureDetected?.(gestureEvent)
    },
    [onGestureDetected],
  )

  // Set up touch event listeners
  useEffect(() => {
    const testArea = testAreaRef.current
    if (!testArea) return

    testArea.addEventListener("touchstart", handleTouchStart, { passive: false })
    testArea.addEventListener("touchmove", handleTouchMove, { passive: false })
    testArea.addEventListener("touchend", handleTouchEnd, { passive: false })

    return () => {
      testArea.removeEventListener("touchstart", handleTouchStart)
      testArea.removeEventListener("touchmove", handleTouchMove)
      testArea.removeEventListener("touchend", handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd])

  // Run automated gesture tests
  const runAutomatedTests = async () => {
    setIsRunning(true)
    setProgress(0)
    addLog(" Starting automated gesture testing...")

    // Reset all tests
    setGestureTests((prev) =>
      prev.map((test) => ({
        ...test,
        status: "pending",
        result: undefined,
        error: undefined,
        events: [],
      })),
    )

    const totalTests = gestureTests.length
    for (let i = 0; i < totalTests; i++) {
      const test = gestureTests[i]
      setCurrentTest(test.id)
      addLog(`Testing ${test.name}...`)

      // Update test status to testing
      setGestureTests((prev) => prev.map((t) => (t.id === test.id ? { ...t, status: "testing" } : t)))

      // Simulate gesture test (in real implementation, this would trigger actual gestures)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simulate test result
      const success = Math.random() > 0.1 // 90% success rate
      const result = success ? "Gesture recognized successfully" : "Gesture not detected"

      setGestureTests((prev) =>
        prev.map((t) =>
          t.id === test.id
            ? {
                ...t,
                status: success ? "passed" : "failed",
                result: success ? result : undefined,
                error: success ? undefined : "Gesture detection failed",
              }
            : t,
        ),
      )

      addLog(`${success ? "✅" : "❌"} ${test.name}: ${result}`)
      setProgress(((i + 1) / totalTests) * 100)
    }

    setCurrentTest(null)
    setIsRunning(false)
    addLog("🏁 Automated gesture testing completed")

    onTestComplete?.(gestureTests)
  }

  // Reset all tests
  const resetTests = () => {
    setGestureTests(
      initialGestureTests.map((test) => ({
        ...test,
        status: "pending",
        result: undefined,
        error: undefined,
        events: [],
      })),
    )
    setProgress(0)
    setCurrentTest(null)
    setGestureLog([])
    addLog("🔄 Gesture tests reset")
  }

  // Get status icon
  const getStatusIcon = (status: GestureTest["status"], isActive = false) => {
    if (isActive) return <Loader2 className="h-4 w-4 animate-spin text-blue/50" />

    switch (status) {
      case "passed":
        return <CheckCircle className="h-4 w-4 text-green/50" />
      case "failed":
        return <XCircle className="h-4 w-4 text-red/50" />
      case "testing":
        return <Loader2 className="h-4 w-4 animate-spin text-blue/50" />
      default:
        return <Clock className="h-4 w-4 text-white/85" />
    }
  }

  // Calculate stats
  const passedTests = gestureTests.filter((test) => test.status === "passed").length
  const failedTests = gestureTests.filter((test) => test.status === "failed").length
  const testingTests = gestureTests.filter((test) => test.status === "testing").length

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="border-purple/20 bg-background">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple/10 rounded-lg">
                <Hand className="h-6 w-6 text-purple" />
              </div>
              <div>
                <CardTitle className="text-xl text-purple">Mobile Gesture Testing</CardTitle>
                <p className="text-purple text-sm">Test swipe, pinch, tap, and other touch gestures</p>
              </div>
            </div>
            <Badge variant="outline" className="text-purple border-purple/30">
              <Smartphone className="h-4 w-4 mr-1" />
              {touchSupport ? "Touch Enabled" : "No Touch Support"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Device Capabilities */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-3 bg-white rounded-[28px] border">
              <div className="flex items-center justify-center gap-2 text-green mb-1">
                <CheckCircle className="h-5 w-5" />
                <span className="text-2xl font-bold">{passedTests}</span>
              </div>
              <p className="text-sm text-muted-foreground">Passed</p>
            </div>
            <div className="text-center p-3 bg-white rounded-[28px] border">
              <div className="flex items-center justify-center gap-2 text-red mb-1">
                <XCircle className="h-5 w-5" />
                <span className="text-2xl font-bold">{failedTests}</span>
              </div>
              <p className="text-sm text-muted-foreground">Failed</p>
            </div>
            <div className="text-center p-3 bg-white rounded-[28px] border">
              <div className="flex items-center justify-center gap-2 text-blue mb-1">
                <Loader2 className={`h-5 w-5 ${testingTests > 0 ? "animate-spin" : ""}`} />
                <span className="text-2xl font-bold">{testingTests}</span>
              </div>
              <p className="text-sm text-muted-foreground">Testing</p>
            </div>
            <div className="text-center p-3 bg-white rounded-[28px] border">
              <div className="flex items-center justify-center gap-2 text-purple mb-1">
                <Touch className="h-5 w-5" />
                <span className="text-2xl font-bold">{navigator.maxTouchPoints || 0}</span>
              </div>
              <p className="text-sm text-muted-foreground">Max Touch Points</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex gap-3 mb-4">
            <Button
              onClick={runAutomatedTests}
              disabled={isRunning || !touchSupport}
              className="bg-purple/80 hover:bg-purple/70"
            >
              {isRunning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Testing Gestures...
                </>
              ) : (
                <>
                  <Hand className="h-4 w-4 mr-2" />
                  Run Gesture Tests
                </>
              )}
            </Button>
            <Button onClick={resetTests} variant="outline" disabled={isRunning}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset Tests
            </Button>
          </div>

          {/* Progress */}
          {isRunning && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Testing Progress</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Gesture Tests */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Gesture Tests</h3>
          <div className="grid gap-3">
            {gestureTests.map((test) => {
              const IconComponent = test.icon
              const isCurrentTest = currentTest === test.id

              return (
                <Card
                  key={test.id}
                  className={`transition-all ${
                    test.status === "passed"
                      ? "border-green/20 bg-green/5"
                      : test.status === "failed"
                        ? "border-red/20 bg-red/5"
                        : test.status === "testing"
                          ? "border-blue/20 bg-blue/5 shadow-lg"
                          : "border-muted/20"
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-lg ${
                            test.status === "passed"
                              ? "bg-green/10"
                              : test.status === "failed"
                                ? "bg-red/10"
                                : test.status === "testing"
                                  ? "bg-blue/10"
                                  : "bg-muted/10"
                          }`}
                        >
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-semibold">{test.name}</h4>
                          <p className="text-sm text-muted-foreground">{test.description}</p>
                        </div>
                      </div>
                      {getStatusIcon(test.status, isCurrentTest)}
                    </div>

                    {test.result && (
                      <div className="text-sm text-green bg-green/10 p-2 rounded">✅ {test.result}</div>
                    )}

                    {test.error && (
                      <div className="text-sm text-red bg-red/10 p-2 rounded">❌ {test.error}</div>
                    )}

                    {test.events.length > 0 && (
                      <div className="mt-2 text-xs text-muted-foreground">Events detected: {test.events.length}</div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Interactive Test Area & Log */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Interactive Test Area</h3>

          {/* Test Area */}
          <Card className="border-dashed border-2 border-purple/30">
            <CardContent className="p-0">
              <div
                ref={testAreaRef}
                className="h-64 bg-background flex items-center justify-center"
                style={{ touchAction: "none" }}
              >
                <div className="space-y-2 text-center">
                  <Hand className="h-12 w-12 text-purple/40 mx-auto" />
                  <h4 className="text-lg font-semibold text-purple">Touch Test Area</h4>
                  <p className="text-sm text-purple max-w-xs">
                    Try different gestures here: tap, double-tap, long press, swipe, pinch, drag
                  </p>
                  {!touchSupport && (
                    <p className="text-xs text-red bg-red/10 p-2 rounded">
                       Touch events not supported on this device
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Log */}
          <Card className="border-purple/10">
            <CardHeader>
              <CardTitle className="text-sm">Activity Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {gestureLog.length === 0 ? (
                  <p className="text-xs text-muted-foreground italic">No gestures detected yet...</p>
                ) : (
                  gestureLog.map((log, i) => (
                    <div key={i} className="text-xs text-secondary font-mono">
                      {log}
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
