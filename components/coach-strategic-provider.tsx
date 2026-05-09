"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"
import { createClient } from "@/lib/supabase/client"

interface StrategicSignal {
  type: "structural" | "tactical" | "contextual"
  title: string
  intensity: "low" | "medium" | "high"
  description: string
}

interface CoachStrategicContext {
  a4_current_score: number
  a4_score_trend: "increasing" | "stable" | "decreasing"
  a4_score_level: "beginner" | "intermediate" | "advanced" | "master"
  a4_current_signals: StrategicSignal[]
  a4_macro_context: {
    imacec_trend: string
    ipc_current: number
    unemployment_rate: number
    primary_signal: string
  }
  a4_enabled: boolean
}

const CoachStrategicContextLocal = createContext<CoachStrategicContext | undefined>(undefined)

interface CoachStrategicProviderProps {
  children: ReactNode
}

export function CoachStrategicProvider({ children }: CoachStrategicProviderProps) {
  const [context, setContext] = useState<CoachStrategicContext>({
    a4_current_score: 0,
    a4_score_trend: "stable",
    a4_score_level: "beginner",
    a4_current_signals: [],
    a4_macro_context: {
      imacec_trend: "neutral",
      ipc_current: 0,
      unemployment_rate: 0,
      primary_signal: "Monitoreando indicadores...",
    },
    a4_enabled: false,
  })

  useEffect(() => {
    const loadStrategicContext = async () => {
      try {
        const supabase = createClient()
        
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        if (!user?.id) return

        // Fetch A4 strategic score
        const scoreRes = await fetch("/rest/a4-strategic-score")
        const scoreData = scoreRes.ok ? await scoreRes.json() : null

        // Fetch economic data
        const econRes = await fetch("/rest/banco-central-data")
        const econData = econRes.ok ? await econRes.json() : null

        setContext({
          a4_current_score: scoreData?.score || 0,
          a4_score_trend: scoreData?.trend || "stable",
          a4_score_level: scoreData?.level || "beginner",
          a4_current_signals: scoreData?.signals || [],
          a4_macro_context: {
            imacec_trend: econData?.imacec_trend || "neutral",
            ipc_current: econData?.ipc || 0,
            unemployment_rate: econData?.unemployment || 0,
            primary_signal: econData?.primary_signal || "Monitoreando...",
          },
          a4_enabled: true,
        })
      } catch (error) {
        console.error("[v0] Error loading strategic context:", error)
      }
    }

    loadStrategicContext()
  }, [])

  return (
    <CoachStrategicContextLocal.Provider value={context}>
      {children}
    </CoachStrategicContextLocal.Provider>
  )
}

export function useCoachStrategicContext() {
  const context = useContext(CoachStrategicContextLocal)
  if (!context) {
    return {
      a4_current_score: 0,
      a4_score_trend: "stable" as const,
      a4_score_level: "beginner" as const,
      a4_current_signals: [],
      a4_macro_context: {
        imacec_trend: "neutral",
        ipc_current: 0,
        unemployment_rate: 0,
        primary_signal: "No disponible",
      },
      a4_enabled: false,
    }
  }
  return context
}
