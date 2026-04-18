"use client"

import { Card } from "@/components/ui/card"
import { CheckCircle2, Circle } from "lucide-react"

interface ProgressStep {
  id: string
  label: string
  description: string
  status: "completed" | "current" | "pending"
}

interface OnboardingProgressProps {
  steps: ProgressStep[]
  currentStep: string
}

export function CanonOnboardingProgress({ steps, currentStep }: OnboardingProgressProps) {
  const currentIndex = steps.findIndex(s => s.id === currentStep)
  const progressPercentage = ((currentIndex + 1) / steps.length) * 100

  return (
    <div className="w-full">
      {/* Visual Progress Line */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-sm font-semibold text-foreground">
            Tu transformación CANON
          </span>
          <span className="text-sm font-semibold text-muted-foreground">
            {currentIndex + 1} de {steps.length}
          </span>
        </div>
        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      <div className="relative">
        {/* Connection lines */}
        <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-border" />

        <div className="space-y-6">
          {steps.map((step, index) => {
            const isCompleted = step.status === "completed"
            const isCurrent = step.status === "current"
            const isPending = step.status === "pending"

            return (
              <div key={step.id} className="relative pl-16">
                {/* Icon */}
                <div className="absolute left-0 top-0">
                  {isCompleted ? (
                    <div className="flex items-center justify-center w-12 h-12 bg-accent/20 dark:bg-accent/10 rounded-full">
                      <CheckCircle2 className="w-6 h-6 text-accent" />
                    </div>
                  ) : isCurrent ? (
                    <div className="flex items-center justify-center w-12 h-12 bg-primary/20 dark:bg-primary/10 rounded-full">
                      <div className="w-6 h-6 rounded-[20px] bg-primary animate-pulse" />
                    </div>
                  ) : (
                    <div className="flex items-center justify-center w-12 h-12 bg-muted rounded-full">
                      <Circle className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className={`p-4 rounded-[28px] border ${
                  isCurrent
                    ? "border-primary/50 bg-primary/5"
                    : isCompleted
                    ? "border-accent/50 bg-accent/5"
                    : "border-border bg-card"
                }`}>
                  <h4 className={`font-semibold ${
                    isCurrent
                      ? "text-blue-900 dark:text-blue-100"
                      : isCompleted
                      ? "text-green-900 dark:text-green-100"
                      : "text-slate-700 dark:text-slate-400"
                  }`}>
                    {step.label}
                  </h4>
                  <p className={`text-sm mt-1 ${
                    isCurrent
                      ? "text-blue-700 dark:text-blue-200"
                      : isCompleted
                      ? "text-green-700 dark:text-green-200"
                      : "text-slate-600 dark:text-slate-500"
                  }`}>
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
