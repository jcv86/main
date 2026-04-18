"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"

interface Resource {
  id: string
  name: string
  category: string
  url: string
  relevance_score: number
}

export function WeeklyResourceDigest() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    fetchWeeklyDigest()
  }, [])

  async function fetchWeeklyDigest() {
    try {
      setLoading(true)
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user?.id) {
        setLoading(false)
        return
      }

      // Get latest digest for user
      const { data: digest } = await supabase
        .from("resource_digests")
        .select("resources")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (digest?.resources) {
        setResources(digest.resources)
      }
    } catch (error) {
      console.error("[v0] Error fetching weekly digest:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="text-center py-4">Cargando recursos semanales...</div>
  }

  if (resources.length === 0) {
    return null
  }

  const categoryCounts = resources.reduce(
    (acc, r) => {
      acc[r.category] = (acc[r.category] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  return (
    <Card className="bg-background">
      <CardHeader>
        <CardTitle>Tu Resumen de Recursos de la Semana</CardTitle>
        <CardDescription>7 recursos públicos chilenos seleccionados para ti</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Object.entries(categoryCounts).map(([category, count]) => (
            <div key={category} className="text-center p-3 bg-transparent rounded-lg">
              <div className="text-2xl font-bold text-blue">{count}</div>
              <div className="text-xs text-muted/60 dark:text-muted/40">{category}</div>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          {resources.slice(0, 5).map((resource) => (
            <div
              key={resource.id}
              className="flex items-center justify-between p-3 bg-transparent rounded-lg"
            >
              <div className="flex-1">
                <p className="font-medium text-sm">{resource.name}</p>
                <p className="text-xs text-muted/50 dark:text-muted/40">{resource.category}</p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => window.open(resource.url, "_blank")} className="ml-2">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        <Button className="w-full">Ver todos los recursos</Button>
      </CardContent>
    </Card>
  )
}
