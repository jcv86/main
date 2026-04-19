"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Rocket, CheckCircle, XCircle } from "lucide-react"

interface Deployment {
  id: string
  name: string
  version: string
  status: string
  progress: number
}

export default function CanaryDeploymentsPage() {
  const [deployments, setDeployments] = useState<Deployment[]>([
    { id: "1", name: "Feature A", version: "v2.1.0", status: "in_progress", progress: 45 },
    { id: "2", name: "Feature B", version: "v2.0.5", status: "completed", progress: 100 },
    { id: "3", name: "Feature C", version: "v1.9.0", status: "failed", progress: 75 },
  ])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green" />
      case "failed":
        return <XCircle className="w-5 h-5 text-red" />
      default:
        return <Rocket className="w-5 h-5 text-blue animate-spin" />
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Canary Deployments</h1>
          <p className="text-muted/60">Monitor and manage canary deployment rollouts</p>
        </div>
      </div>

      <div className="grid gap-4">
        {deployments.map(deployment => (
          <Card key={deployment.id} className="border-muted/20">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(deployment.status)}
                  <div>
                    <CardTitle className="text-lg">{deployment.name}</CardTitle>
                    <CardDescription>{deployment.version}</CardDescription>
                  </div>
                </div>
                <Badge
                  className={
                    deployment.status === "completed"
                      ? "bg-green/10 text-green"
                      : deployment.status === "failed"
                        ? "bg-red/10 text-red"
                        : "bg-blue/10 text-blue"
                  }
                >
                  {deployment.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted/60">Progress</span>
                  <span className="font-medium">{deployment.progress}%</span>
                </div>
                <div className="w-full h-2 bg-muted/20 rounded-full overflow-hidden">
                  <div className="h-full bg-blue transition-all" style={{ width: `${deployment.progress}%` }} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

