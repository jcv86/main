"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  ChevronLeft,
  ChevronRight,
  Hand,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  Touchpad as Touch,
} from "lucide-react"

interface GestureEnhancedTestInterfaceProps {
  questions: Array<{
    id: string
    text: string
    options: Array<{ id: string; text: string; value: number }>
  }>
  onAnswerSelect: (questionId: string, answerId: string) => void
  onComplete: () => void
  testTitle: string
}

export function GestureEnhancedTestInterface({
  questions,
  onAnswerSelect,
  onComplete,
  testTitle,
}: GestureEnhancedTestInterfaceProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [textSize, setTextSize] = useState(1)
  const [gestureLog, setGestureLog] = useState<string[]>([])
  const [touchSupport, setTouchSupport] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)
  const touchStartRef = useRef<{ x: number; y: number; time: number; touches: number } | null>(null)
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null)
  const lastTapRef = useRef<number>(0)

  // Detect touch support
  useEffect(() => {
    const hasTouch = "ontouchstart" in window || navigator.maxTouchPoints > 0
    setTouchSupport(hasTouch)
    addGestureLog(`Touch support detected: ${hasTouch ? "Yes" : "No"}`)
  }, [])

  // Add gesture log entry
  const addGestureLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString()
    setGestureLog((prev) => [`[${timestamp}] ${message}`, ...prev.slice(0, 9)])
  }

  // Calculate distance between two points
  const calculateDistance = (x1: number, y1: number, x2: number, y2: number) => {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
  }

  // Calculate swipe direction
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
    if (!containerRef.current?.contains(e.target as Node)) return

    const touch = e.touches[0]
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now(),
      touches: e.touches.length,
    }

    // Start long press timer
    longPressTimerRef.current = setTimeout(() => {
      addGestureLog("Long press detected - showing help")
    }, 500)

    addGestureLog(`Touch start: ${e.touches.length} finger(s)`)
  }, [])

  // Handle touch move
  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!containerRef.current?.contains(e.target as Node) || !touchStartRef.current) return

    const touch = e.touches[0]
    const distance = calculateDistance(touchStartRef.current.x, touchStartRef.current.y, touch.clientX, touch.clientY)

    // Cancel long press if moved too much
    if (distance > 10 && longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current)
      longPressTimerRef.current = null
    }

    // Handle pinch gestures
    if (e.touches.length === 2) {
      e.preventDefault()
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
        handleZoomIn()
        addGestureLog("Pinch zoom in detected")
      } else if (scale < 0.8) {
        handleZoomOut()
        addGestureLog("Pinch zoom out detected")
      }
    }
  }, [])

  // Handle touch end
  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!containerRef.current?.contains(e.target as Node) || !touchStartRef.current) return

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
        const distance = calculateDistance(
          touchStartRef.current.x,
          touchStartRef.current.y,
          touch.clientX,
          touch.clientY,
        )

        if (distance < 10 && duration < 300) {
          // Tap gesture
          const timeSinceLastTap = now - lastTapRef.current
          lastTapRef.current = now

          if (timeSinceLastTap < 300) {
            // Double tap - zoom in
            handleZoomIn()
            addGestureLog("Double tap detected - zooming in")
          } else {
            addGestureLog("Single tap detected")
          }
        } else if (distance > 50) {
          // Swipe gesture
          const direction = calculateDirection(
            touchStartRef.current.x,
            touchStartRef.current.y,
            touch.clientX,
            touch.clientY,
          )

          if (direction === "left" && currentQuestionIndex < questions.length - 1) {
            handleNextQuestion()
            addGestureLog("Swipe left - next question")
          } else if (direction === "right" && currentQuestionIndex > 0) {
            handlePreviousQuestion()
            addGestureLog("Swipe right - previous question")
          } else {
            addGestureLog(`Swipe ${direction} detected`)
          }
        }
      }

      touchStartRef.current = null
    },
    [currentQuestionIndex, questions.length],
  )

  // Set up touch event listeners
  useEffect(() => {
    const container = containerRef.current
    if (!container || !touchSupport) return

    container.addEventListener("touchstart", handleTouchStart, { passive: false })
    container.addEventListener("touchmove", handleTouchMove, { passive: false })
    container.addEventListener("touchend", handleTouchEnd, { passive: false })

    return () => {
      container.removeEventListener("touchstart", handleTouchStart)
      container.removeEventListener("touchmove", handleTouchMove)
      container.removeEventListener("touchend", handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd, touchSupport])

  // Navigation functions
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  // Zoom functions
  const handleZoomIn = () => {
    setTextSize((prev) => Math.min(prev + 0.1, 1.5))
  }

  const handleZoomOut = () => {
    setTextSize((prev) => Math.max(prev - 0.1, 0.8))
  }

  const resetZoom = () => {
    setTextSize(1)
    addGestureLog("Text size reset to normal")
  }

  // Handle answer selection
  const handleAnswerSelection = (answerId: string) => {
    const questionId = questions[currentQuestionIndex].id
    setAnswers((prev) => ({ ...prev, [questionId]: answerId }))
    onAnswerSelect(questionId, answerId)
    addGestureLog(`Answer selected: ${answerId}`)
  }

  // Calculate progress
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  const currentQuestion = questions[currentQuestionIndex]
  const isLastQuestion = currentQuestionIndex === questions.length - 1
  const canProceed = answers[currentQuestion.id] !== undefined

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-muted/5 p-4"
      style={{ fontSize: `${textSize}rem`, touchAction: "none" }}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header with Gesture Controls */}
        <Card className="border-purple/20 bg-gradient-to-r from-purple-50 to-pink-50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple/10 rounded-lg">
                  <Hand className="h-6 w-6 text-purple" />
                </div>
                <div>
                  <CardTitle className="text-xl text-purple">{testTitle}</CardTitle>
                  <p className="text-purple text-sm">
                    {touchSupport ? "Touch gestures enabled" : "Mouse/keyboard navigation"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-purple border-purple/30">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Progress Bar */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">Progress</span>
                <span>{Math.round(progress)}% Complete</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>

            {/* Gesture Controls */}
            <div className="flex flex-wrap gap-2 mb-4">
              <Button size="sm" onClick={handleZoomIn} variant="outline">
                <ZoomIn className="h-4 w-4 mr-1" />
                Zoom In
              </Button>
              <Button size="sm" onClick={handleZoomOut} variant="outline">
                <ZoomOut className="h-4 w-4 mr-1" />
                Zoom Out
              </Button>
              <Button size="sm" onClick={resetZoom} variant="outline">
                <RotateCcw className="h-4 w-4 mr-1" />
                Reset
              </Button>
              <Badge variant="secondary" className="ml-auto">
                Text Size: {Math.round(textSize * 100)}%
              </Badge>
            </div>

            {/* Gesture Instructions */}
            {touchSupport && (
              <div className="p-3 bg-white rounded-[28px] border text-sm">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <Touch className="h-4 w-4" />
                  Touch Gestures Available:
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <ArrowLeft className="h-3 w-3" />
                    Swipe left: Next
                  </div>
                  <div className="flex items-center gap-1">
                    <ArrowRight className="h-3 w-3" />
                    Swipe right: Previous
                  </div>
                  <div className="flex items-center gap-1">
                    <ZoomIn className="h-3 w-3" />
                    Pinch out: Zoom in
                  </div>
                  <div className="flex items-center gap-1">
                    <ZoomOut className="h-3 w-3" />
                    Pinch in: Zoom out
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Question Card */}
        <Card className="border-blue/20">
          <CardHeader>
            <CardTitle className="text-lg text-blue">{currentQuestion.text}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Answer Options */}
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => handleAnswerSelection(option.id)}
                  className={`w-full p-4 text-left rounded-[28px] border-2 transition-all touch-manipulation ${
                    answers[currentQuestion.id] === option.id
                      ? "border-blue/50 bg-blue/5 text-blue"
                      : "border-muted/20 bg-white hover:border-muted/30 hover:bg-muted/5"
                  }`}
                  style={{ minHeight: "60px" }} // Touch-friendly size
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        answers[currentQuestion.id] === option.id ? "border-blue/50 bg-blue/50" : "border-muted/30"
                      }`}
                    >
                      {answers[currentQuestion.id] === option.id && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5" />
                      )}
                    </div>
                    <span className="flex-1">{option.text}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between pt-4">
              <Button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                variant="outline"
                size="lg"
                className="touch-manipulation bg-transparent"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {isLastQuestion ? (
                <Button
                  onClick={onComplete}
                  disabled={!canProceed}
                  size="lg"
                  className="bg-green hover:bg-green touch-manipulation"
                >
                  Complete Test
                </Button>
              ) : (
                <Button onClick={handleNextQuestion} disabled={!canProceed} size="lg" className="touch-manipulation">
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Gesture Activity Log */}
        {touchSupport && gestureLog.length > 0 && (
          <Card className="border-muted/20">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Hand className="h-4 w-4" />
                Gesture Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-32 overflow-y-auto bg-muted/90 rounded-[28px] p-3 font-mono text-sm">
                <div className="space-y-1">
                  {gestureLog.map((log, index) => (
                    <div
                      key={index}
                      className={`${
                        log.includes("detected")
                          ? "text-green/40"
                          : log.includes("zoom")
                            ? "text-blue/40"
                            : log.includes("swipe")
                              ? "text-yellow/40"
                              : "text-muted/30"
                      }`}
                    >
                      {log}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
