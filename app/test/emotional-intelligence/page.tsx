"use client"

import { useState } from "react"
import { useRouter } from "next/router"
import { Button, Card, Progress, Badge } from "antd"
import { hoverMuted } from "@/styles/colors"

const EmotionalIntelligenceTest = () => {
  const [progress, setProgress] = useState(0)
  const router = useRouter()

  const handleNextQuestion = () => {
    setProgress(progress + 10)
    if (progress >= 100) {
      router.push("/test/emotional-intelligence/results")
    }
  }

  return (
    <div className="bg-secondary min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md p-8" hoverable={true} style={{ backgroundColor: hoverMuted }}>
        <h1 className="text-center text-2xl font-bold mb-4">Emotional Intelligence Test</h1>
        <Progress percent={progress} className="mb-6" />
        <div className="flex justify-center mb-6">
          <Badge status="default" text="Question 1" className="mr-4" />
          <Badge status="default" text="Question 2" className="mr-4" />
          <Badge status="default" text="Question 3" />
        </div>
        <Button type="primary" className={`bg-foreground hover:bg-foreground/90`} onClick={handleNextQuestion}>
          Next Question
        </Button>
      </Card>
    </div>
  )
}

export default EmotionalIntelligenceTest
