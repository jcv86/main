'use client'

import { AssessmentQuiz } from './assessment'

export default function PersonalizedLearningPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-8">
      <div className="container mx-auto">
        <AssessmentQuiz />
      </div>
    </div>
  )
}
