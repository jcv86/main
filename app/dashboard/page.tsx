"use client"

import { UDDCareerRecommendations } from "@/components/udd-career-recommendations"
import { Shell } from "@/components/shell"
import { DashboardHeader } from "@/components/header"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState, useEffect } from "react"

const personalityResults = {
  openness: 0.78,
  conscientiousness: 0.85,
  extraversion: 0.72,
  agreeableness: 0.65,
  neuroticism: 0.32,
}

const userSkills = ["JavaScript", "React", "Problem Solving", "Communication"]
const jobInterests = ["Technology", "Innovation", "Software Development"]

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <Shell>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      </Shell>
    )
  }

  return (
    <Shell>
      <DashboardHeader heading="Dashboard" text="Monitor your profile and career progress here." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Profile Strength</CardTitle>
            <CardDescription>How complete is your profile?</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75%</div>
            <div className="text-sm text-muted-foreground">Complete your profile to unlock more features.</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Career Matches</CardTitle>
            <CardDescription>Jobs that match your skills and interests.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <div className="text-sm text-muted-foreground">Explore your career matches.</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Skills Gap</CardTitle>
            <CardDescription>Skills you need to improve your career prospects.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <div className="text-sm text-muted-foreground">Identify and address your skills gap.</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Learning Paths</CardTitle>
            <CardDescription>Personalized learning paths to achieve your career goals.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <div className="text-sm text-muted-foreground">Start your learning journey today.</div>
          </CardContent>
        </Card>
      </div>

      <Separator className="my-6" />

      <div className="mb-6">
        <h3 className="text-lg font-medium">Career Suggestions</h3>
        <p className="text-sm text-muted-foreground">
          Based on your profile and interests, here are some career suggestions.
        </p>
      </div>

      {/* UDD Career Recommendations */}
      <UDDCareerRecommendations
        personalityResults={personalityResults}
        userSkills={userSkills}
        jobInterests={jobInterests}
        className="mt-8"
      />
    </Shell>
  )
}
