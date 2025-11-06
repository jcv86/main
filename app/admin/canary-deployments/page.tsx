"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock,
  GitBranch,
  Pause,
  Play,
  RotateCcw,
  TrendingUp,
  XCircle,
} from "lucide-react"

export default function CanaryDeploymentsPage() {
  const [activeDeployments, setActiveDeployments] = useState<any[]>([])
  const [deploymentHistory, setDeploymentHistory] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [creating, setCreating] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    deployment_name: "",
    deployment_type: "feature",
    description: "",
    target_version: "",
    auto_rollback_enabled: true,
  })

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [])

  const fetchData = async () => {
    try {
      const [activeRes, historyRes] = await Promise.all([fetch("/api/canary/active"), fetch("/api/canary/history")])

      const [active, history] = await Promise.all([activeRes.json(), historyRes.json()])

      setActiveDeployments(active.deployments || [])
      setDeploymentHistory(history.deployments || [])
    } catch (error) {
      console.error("Error fetching deployments:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateDeployment = async () => {
    setCreating(true)
    try {
      const response = await fetch("/api/canary/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (data.success) {
        // Start the deployment immediately
        await fetch("/api/canary/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ deployment_id: data.deployment.id }),
        })

        setDialogOpen(false)
        setFormData({
          deployment_name: "",
          deployment_type: "feature",
          description: "",
          target_version: "",
          auto_rollback_enabled: true,
        })
        fetchData()
      } else {
        alert("Error creating deployment: " + data.error)
      }
    } catch (error) {
      console.error("Error creating deployment:", error)
      alert("Error creating deployment")
    } finally {
      setCreating(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      in_progress: { variant: "default", icon: Activity, label: "In Progress" },
      completed: { variant: "default", icon: CheckCircle2, label: "Completed" },
      rolled_back: { variant: "destructive", icon: RotateCcw, label: "Rolled Back" },
      paused: { variant: "secondary", icon: Pause, label: "Paused" },
      pending: { variant: "outline", icon: Clock, label: "Pending" },
      failed: { variant: "destructive", icon: XCircle, label: "Failed" },
    }

    const config = variants[status] || variants.pending
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  const getHealthBadge = (health: string) => {
    const variants: Record<string, any> = {
      healthy: { variant: "default", className: "bg-green-500", label: "Healthy" },
      warning: { variant: "secondary", className: "bg-yellow-500", label: "Warning" },
      critical: { variant: "destructive", label: "Critical" },
      unknown: { variant: "outline", label: "Unknown" },
    }

    const config = variants[health] || variants.unknown

    return (
      <Badge variant={config.variant} className={config.className}>
        {config.label}
      </Badge>
    )
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading deployments...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Canary Deployments</h1>
          <p className="text-muted-foreground">Gradual rollout with automatic monitoring and rollback</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <GitBranch className="mr-2 h-4 w-4" />
              New Deployment
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Canary Deployment</DialogTitle>
              <DialogDescription>
                Configure a gradual rollout with automatic monitoring and rollback capabilities
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Deployment Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., New Homepage Design"
                  value={formData.deployment_name}
                  onChange={(e) => setFormData({ ...formData, deployment_name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Deployment Type</Label>
                <Select
                  value={formData.deployment_type}
                  onValueChange={(value) => setFormData({ ...formData, deployment_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="feature">Feature</SelectItem>
                    <SelectItem value="bugfix">Bug Fix</SelectItem>
                    <SelectItem value="hotfix">Hotfix</SelectItem>
                    <SelectItem value="experiment">Experiment</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="version">Target Version</Label>
                <Input
                  id="version"
                  placeholder="e.g., v2.1.0"
                  value={formData.target_version}
                  onChange={(e) => setFormData({ ...formData, target_version: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what's being deployed..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Auto Rollback</Label>
                  <p className="text-sm text-muted-foreground">Automatically rollback if metrics degrade</p>
                </div>
                <Switch
                  checked={formData.auto_rollback_enabled}
                  onCheckedChange={(checked) => setFormData({ ...formData, auto_rollback_enabled: checked })}
                />
              </div>

              <div className="bg-muted p-4 rounded-lg space-y-2">
                <p className="text-sm font-medium">Default Rollout Stages:</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Stage 1: Canary (5% traffic, 30 min)</li>
                  <li>• Stage 2: Early Adopters (25% traffic, 60 min)</li>
                  <li>• Stage 3: Half Traffic (50% traffic, 120 min)</li>
                  <li>• Stage 4: Full Rollout (100% traffic, 60 min)</li>
                </ul>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={creating}>
                Cancel
              </Button>
              <Button onClick={handleCreateDeployment} disabled={creating || !formData.deployment_name}>
                {creating ? "Creating..." : "Create & Start Deployment"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="active" className="space-y-4">
        <TabsList>
          <TabsTrigger value="active">Active Deployments ({activeDeployments.length})</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="active" className="space-y-4">
          {activeDeployments.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <GitBranch className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No active deployments</p>
                <p className="text-sm text-muted-foreground">Create a new canary deployment to get started</p>
              </CardContent>
            </Card>
          ) : (
            activeDeployments.map((deployment) => (
              <Card key={deployment.id}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <CardTitle className="flex items-center gap-2">
                        {deployment.deployment_name}
                        {getStatusBadge(deployment.status)}
                      </CardTitle>
                      <CardDescription>
                        {deployment.deployment_type} • {deployment.current_stage_name}
                      </CardDescription>
                    </div>
                    {getHealthBadge(deployment.current_health_status)}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Traffic Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Traffic</span>
                      <span className="font-medium">{deployment.current_traffic_percentage}%</span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full transition-all"
                        style={{ width: `${deployment.current_traffic_percentage}%` }}
                      />
                    </div>
                  </div>

                  {/* Stage Progress */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Stage Progress</span>
                      <span className="font-medium">
                        {Math.round(deployment.minutes_in_current_stage || 0)} / {deployment.stage_duration_minutes} min
                      </span>
                    </div>
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full transition-all"
                        style={{
                          width: `${Math.min(100, (deployment.minutes_in_current_stage / deployment.stage_duration_minutes) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Alerts */}
                  {deployment.recent_critical_events > 0 && (
                    <div className="flex items-center gap-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <span className="text-sm text-destructive font-medium">
                        {deployment.recent_critical_events} critical event(s) in the last hour
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline">
                      <TrendingUp className="mr-2 h-4 w-4" />
                      View Metrics
                    </Button>
                    <Button size="sm" variant="outline">
                      <Activity className="mr-2 h-4 w-4" />
                      View Events
                    </Button>
                    {deployment.status === "in_progress" && (
                      <>
                        <Button size="sm" variant="outline">
                          <Pause className="mr-2 h-4 w-4" />
                          Pause
                        </Button>
                        <Button size="sm" variant="destructive">
                          <RotateCcw className="mr-2 h-4 w-4" />
                          Rollback
                        </Button>
                      </>
                    )}
                    {deployment.status === "paused" && (
                      <Button size="sm">
                        <Play className="mr-2 h-4 w-4" />
                        Resume
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          {deploymentHistory.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center h-64">
                <Clock className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-lg font-medium">No deployment history</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2">
              {deploymentHistory.map((deployment) => (
                <Card key={deployment.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{deployment.deployment_name}</span>
                        {getStatusBadge(deployment.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(deployment.created_at).toLocaleString()}
                      </p>
                    </div>
                    <Button size="sm" variant="ghost">
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
