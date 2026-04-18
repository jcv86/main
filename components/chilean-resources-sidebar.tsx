"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface Resource {
  id: string
  title: string
  category: string
  description: string
  url: string
  matchScore?: number
  reason?: string
}

interface ChileanResourcesSidebarProps {
  profileContext?: {
    testResults?: any[]
    currentRole?: string
    goals?: string[]
    interests?: string[]
    careerStage?: "early" | "mid" | "advanced"
  }
  limit?: number
  showLinks?: boolean
}

export default function ChileanResourcesSidebar({
  profileContext,
  limit = 3,
  showLinks = true,
}: ChileanResourcesSidebarProps) {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true)
        const response = await fetch("/api/chilean-resources-recommendations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId: "dtc-user",
            profileContext: profileContext || {
              interests: ["mercado laboral", "empleo", "competencias"],
            },
            limit,
          }),
        })

        const data = await response.json()

        if (data.success && data.recommendations) {
          setResources(data.recommendations.slice(0, limit))
        } else {
          setError("No se pudieron cargar los recursos")
        }
      } catch (err) {
        console.error("[v0] Error fetching resources:", err)
        setError("Error al cargar recursos")
      } finally {
        setLoading(false)
      }
    }

    fetchResources()
  }, [profileContext, limit])

  if (loading) {
    return (
      <Card className="p-4">
        <h3 className="font-semibold mb-4">Recursos Públicos Chilenos</h3>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full" />
          ))}
        </div>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="p-4 border-amber-200 bg-amber-50">
        <p className="text-sm text-amber-700">{error}</p>
      </Card>
    )
  }

  return (
    <Card className="p-4">
      <h3 className="font-semibold mb-3 text-lg">Recursos Públicos Chilenos</h3>
      <p className="text-sm text-muted/60 mb-4">Datos oficiales para tu carrera</p>

      <div className="space-y-3">
        {resources.map((resource) => (
          <div
            key={resource.id}
            className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-[28px] border border-blue/20 dark:border-blue"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-semibold text-blue dark:text-blue/40 hover:underline"
                >
                  {resource.title}
                </a>
                <p className="text-xs text-muted/60 dark:text-muted/40 mt-1">{resource.category}</p>
                {resource.reason && (
                  <p className="text-xs text-muted dark:text-muted/30 mt-2 italic">"{resource.reason}"</p>
                )}
              </div>
              {resource.matchScore && (
                <div className="text-xs font-semibold text-green dark:text-green/40 whitespace-nowrap">
                  {Math.round(resource.matchScore * 100)}% match
                </div>
              )}
            </div>
            {showLinks && (
              <Button
                size="sm"
                variant="ghost"
                className="mt-2 w-full text-xs"
                onClick={() => window.open(resource.url, "_blank")}
              >
                Acceder →
              </Button>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
}
