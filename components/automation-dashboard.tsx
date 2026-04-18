"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Play, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AutomationDashboard() {
  const [loading, setLoading] = useState<string | null>(null)
  const { toast } = useToast()

  const runCronJob = async (jobName: string, endpoint: string) => {
    setLoading(jobName)
    try {
      // Call through our secure API route instead of directly
      const response = await fetch("/api/admin/trigger-cron", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ endpoint }),
      })

      const data = await response.json()

      if (response.ok) {
        toast({
          title: "Tarea ejecutada exitosamente",
          description: `${jobName} completado. ${JSON.stringify(data.summary || data)}`,
        })
      } else {
        throw new Error(data.error || "Error desconocido")
      }
    } catch (error: any) {
      toast({
        title: "Error al ejecutar tarea",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setLoading(null)
    }
  }

  const cronJobs = [
    {
      name: "Análisis Bimestral",
      description: "Identifica prompts críticos, crea tareas de revisión y analiza tests A/B",
      schedule: "0 0 1 */2 * (Cada 2 meses, día 1 a medianoche)",
      endpoint: "/api/cron/bimonthly-analysis",
      icon: Calendar,
      color: "blue",
    },
    {
      name: "Resumen Diario de Métricas",
      description: "Genera resumen de métricas del día anterior y crea alertas si es necesario",
      schedule: "0 9 * * * (Diario a las 9 AM UTC)",
      endpoint: "/api/cron/daily-metrics-summary",
      icon: Clock,
      color: "green",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Automatización</h1>
        <p className="text-muted-foreground mt-2">Gestiona tareas automáticas y cron jobs del sistema</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {cronJobs.map((job) => {
          const Icon = job.icon
          return (
            <Card key={job.name}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-[28px] bg-${job.color}-100 dark:bg-${job.color}-900/20`}>
                      <Icon className={`h-5 w-5 text-${job.color}-600 dark:text-${job.color}-400`} />
                    </div>
                    <div>
                      <CardTitle>{job.name}</CardTitle>
                      <Badge variant="outline" className="mt-1">
                        Automático
                      </Badge>
                    </div>
                  </div>
                </div>
                <CardDescription className="mt-2">{job.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{job.schedule}</span>
                </div>

                <Button
                  onClick={() => runCronJob(job.name, job.endpoint)}
                  disabled={loading === job.name}
                  className="w-full"
                  variant="outline"
                >
                  <Play className="h-4 w-4 mr-2" />
                  {loading === job.name ? "Ejecutando..." : "Ejecutar Manualmente"}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Configuración de Cron Jobs</CardTitle>
          <CardDescription>
            Los cron jobs están configurados en vercel.json y se ejecutan automáticamente en Vercel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue/20 rounded-lg">
            <AlertCircle className="h-5 w-5 text-blue dark:text-blue/40 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Variable de entorno requerida</p>
              <p className="text-sm text-muted-foreground">
                Asegúrate de configurar{" "}
                <code className="px-1 py-0.5 bg-black/10 dark:bg-white/10 rounded">CRON_SECRET</code> en las variables
                de entorno de Vercel para proteger los endpoints de cron.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green/20 rounded-lg">
            <CheckCircle className="h-5 w-5 text-green dark:text-green/40 mt-0.5" />
            <div className="space-y-1">
              <p className="text-sm font-medium">Ejecución manual</p>
              <p className="text-sm text-muted-foreground">
                Puedes ejecutar cualquier cron job manualmente usando los botones de arriba para probar su
                funcionamiento.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
