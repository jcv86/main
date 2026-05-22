"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Lightbulb, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CareerTip {
  id?: number
  title: string
  content: string
  category: string
  icon?: string
}

export function DailyCareerTip({ careerStage = "all" }: { careerStage?: string }) {
  const [tip, setTip] = useState<CareerTip | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchTip = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/daily-tip?stage=${careerStage}`)
      const data = await response.json()
      setTip(data.tip)
    } catch (error) {
      console.error("Error fetching daily tip:", error)
      setTip({
        title: "Aprendizaje Continuo",
        content: "Dedica tiempo cada día a aprender algo nuevo. El crecimiento profesional es un viaje constante.",
        category: "learning",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTip()
  }, [careerStage])

  if (loading) {
    return (
      <Card className="border-border bg-background">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Lightbulb className="h-5 w-5 animate-pulse text-purple dark:text-purple/40" />
            <p className="text-sm text-muted-foreground dark:text-muted-foreground">Cargando consejo del día...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!tip) return null

  return (
    <Card className="border-purple/20 dark:border-muted/70 bg-background">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-purple dark:text-purple/30 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-purple dark:text-purple/40" />
            Consejo del Día
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={fetchTip} className="h-8 w-8 p-0">
            <RefreshCw className="h-4 w-4 text-purple dark:text-purple/40" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <h4 className="font-semibold text-foreground dark:text-white mb-2">{tip.title}</h4>
        <p className="text-sm text-muted-foreground dark:text-white/85 leading-relaxed">{tip.content}</p>
      </CardContent>
    </Card>
  )
}
