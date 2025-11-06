import { createClient } from "@/lib/supabase/server"

export interface CanaryDeploymentConfig {
  deploymentName: string
  description?: string
  deploymentType: "feature" | "prompt" | "config" | "code"
  targetResource: string
  targetResourceId?: string
  stageConfig?: {
    stages: number[] // [5, 25, 50, 100]
    stageDurationMinutes: number[] // [30, 60, 120, 0]
  }
  metricsToMonitor?: string[]
  maxErrorRateIncreasePct?: number
  maxResponseTimeIncreasePct?: number
  minSatisfactionScore?: number
  autoRollbackEnabled?: boolean
  requireManualApproval?: boolean
  createdBy: string
  ticketId?: string
  gitCommitHash?: string
  gitBranch?: string
}

export interface DeploymentMetrics {
  errorRate: number
  responseTime: number
  userSatisfaction: number
  sampleSize: number
}

export class CanaryDeploymentManager {
  /**
   * Create a new canary deployment
   */
  static async createDeployment(config: CanaryDeploymentConfig) {
    const supabase = await createClient()

    // Create deployment
    const { data: deployment, error: deploymentError } = await supabase
      .from("canary_deployments")
      .insert({
        deployment_name: config.deploymentName,
        description: config.description,
        deployment_type: config.deploymentType,
        target_resource: config.targetResource,
        target_resource_id: config.targetResourceId,
        stage_config: config.stageConfig || {
          stages: [5, 25, 50, 100],
          stageDurationMinutes: [30, 60, 120, 0],
        },
        metrics_to_monitor: config.metricsToMonitor || ["error_rate", "response_time", "user_satisfaction"],
        max_error_rate_increase_pct: config.maxErrorRateIncreasePct || 10,
        max_response_time_increase_pct: config.maxResponseTimeIncreasePct || 20,
        min_satisfaction_score: config.minSatisfactionScore || 3.5,
        auto_rollback_enabled: config.autoRollbackEnabled !== false,
        require_manual_approval: config.requireManualApproval || false,
        created_by: config.createdBy,
        ticket_id: config.ticketId,
        git_commit_hash: config.gitCommitHash,
        git_branch: config.gitBranch,
        status: config.requireManualApproval ? "pending" : "pending",
      })
      .select()
      .single()

    if (deploymentError) throw deploymentError

    // Create stages
    const stageConfig = config.stageConfig || {
      stages: [5, 25, 50, 100],
      stageDurationMinutes: [30, 60, 120, 0],
    }

    const stages = stageConfig.stages.map((percentage, index) => ({
      deployment_id: deployment.id,
      stage_number: index + 1,
      stage_name: `Stage ${index + 1}: ${percentage}%`,
      traffic_percentage: percentage,
      duration_minutes: stageConfig.stageDurationMinutes[index],
      status: "pending",
    }))

    const { error: stagesError } = await supabase.from("canary_deployment_stages").insert(stages)

    if (stagesError) throw stagesError

    // Log event
    await this.logEvent(
      deployment.id,
      null,
      "deployment_created",
      "info",
      `Canary deployment "${config.deploymentName}" created`,
      {
        config,
      },
      config.createdBy,
    )

    return deployment
  }

  /**
   * Start a deployment (move to first stage)
   */
  static async startDeployment(deploymentId: string, startedBy: string) {
    const supabase = await createClient()

    // Get first stage
    const { data: firstStage } = await supabase
      .from("canary_deployment_stages")
      .select("*")
      .eq("deployment_id", deploymentId)
      .eq("stage_number", 1)
      .single()

    if (!firstStage) throw new Error("No stages found for deployment")

    // Update deployment
    const { error: deploymentError } = await supabase
      .from("canary_deployments")
      .update({
        status: "in_progress",
        current_stage: "stage_1",
        current_traffic_percentage: firstStage.traffic_percentage,
        started_at: new Date().toISOString(),
        last_stage_change_at: new Date().toISOString(),
      })
      .eq("id", deploymentId)

    if (deploymentError) throw deploymentError

    // Update stage
    const { error: stageError } = await supabase
      .from("canary_deployment_stages")
      .update({
        status: "in_progress",
        started_at: new Date().toISOString(),
      })
      .eq("id", firstStage.id)

    if (stageError) throw stageError

    // Log event
    await this.logEvent(
      deploymentId,
      firstStage.id,
      "deployment_started",
      "info",
      `Deployment started at ${firstStage.traffic_percentage}% traffic`,
      {
        stage: firstStage.stage_name,
      },
      startedBy,
    )

    return { success: true }
  }

  /**
   * Collect and record metrics for current stage
   */
  static async recordMetrics(deploymentId: string, metrics: DeploymentMetrics, baselineMetrics?: DeploymentMetrics) {
    const supabase = await createClient()

    // Get current stage
    const { data: deployment } = await supabase
      .from("canary_deployments")
      .select("*, canary_deployment_stages!inner(*)")
      .eq("id", deploymentId)
      .eq("canary_deployment_stages.status", "in_progress")
      .single()

    if (!deployment) return { success: false, error: "No active stage found" }

    const currentStage = deployment.canary_deployment_stages[0]

    // Record each metric
    const metricRecords = [
      {
        deployment_id: deploymentId,
        stage_id: currentStage.id,
        metric_name: "error_rate",
        metric_value: metrics.errorRate,
        baseline_value: baselineMetrics?.errorRate,
        change_percentage: baselineMetrics
          ? ((metrics.errorRate - baselineMetrics.errorRate) / baselineMetrics.errorRate) * 100
          : null,
        traffic_percentage: deployment.current_traffic_percentage,
        sample_size: metrics.sampleSize,
        is_within_threshold: baselineMetrics
          ? ((metrics.errorRate - baselineMetrics.errorRate) / baselineMetrics.errorRate) * 100 <=
            deployment.max_error_rate_increase_pct
          : true,
      },
      {
        deployment_id: deploymentId,
        stage_id: currentStage.id,
        metric_name: "response_time",
        metric_value: metrics.responseTime,
        baseline_value: baselineMetrics?.responseTime,
        change_percentage: baselineMetrics
          ? ((metrics.responseTime - baselineMetrics.responseTime) / baselineMetrics.responseTime) * 100
          : null,
        traffic_percentage: deployment.current_traffic_percentage,
        sample_size: metrics.sampleSize,
        is_within_threshold: baselineMetrics
          ? ((metrics.responseTime - baselineMetrics.responseTime) / baselineMetrics.responseTime) * 100 <=
            deployment.max_response_time_increase_pct
          : true,
      },
      {
        deployment_id: deploymentId,
        stage_id: currentStage.id,
        metric_name: "user_satisfaction",
        metric_value: metrics.userSatisfaction,
        baseline_value: baselineMetrics?.userSatisfaction,
        change_percentage: baselineMetrics
          ? ((metrics.userSatisfaction - baselineMetrics.userSatisfaction) / baselineMetrics.userSatisfaction) * 100
          : null,
        traffic_percentage: deployment.current_traffic_percentage,
        sample_size: metrics.sampleSize,
        is_within_threshold: metrics.userSatisfaction >= deployment.min_satisfaction_score,
      },
    ]

    const { error } = await supabase.from("canary_deployment_metrics").insert(metricRecords)

    if (error) throw error

    // Check if any metrics are out of threshold
    const failedMetrics = metricRecords.filter((m) => !m.is_within_threshold)

    if (failedMetrics.length > 0 && deployment.auto_rollback_enabled) {
      await this.triggerRollback(
        deploymentId,
        currentStage.id,
        `Metrics exceeded thresholds: ${failedMetrics.map((m) => m.metric_name).join(", ")}`,
        "auto",
      )
    }

    return { success: true, failedMetrics }
  }

  /**
   * Advance to next stage
   */
  static async advanceStage(deploymentId: string, advancedBy: string) {
    const supabase = await createClient()

    // Get current stage
    const { data: currentStageData } = await supabase
      .from("canary_deployment_stages")
      .select("*")
      .eq("deployment_id", deploymentId)
      .eq("status", "in_progress")
      .single()

    if (!currentStageData) throw new Error("No active stage found")

    // Complete current stage
    await supabase
      .from("canary_deployment_stages")
      .update({
        status: "completed",
        completed_at: new Date().toISOString(),
        decision: "proceed",
        decided_by: advancedBy,
        decided_at: new Date().toISOString(),
      })
      .eq("id", currentStageData.id)

    // Get next stage
    const { data: nextStage } = await supabase
      .from("canary_deployment_stages")
      .select("*")
      .eq("deployment_id", deploymentId)
      .eq("stage_number", currentStageData.stage_number + 1)
      .single()

    if (!nextStage) {
      // No more stages, complete deployment
      await supabase
        .from("canary_deployments")
        .update({
          status: "completed",
          current_stage: "completed",
          current_traffic_percentage: 100,
          completed_at: new Date().toISOString(),
        })
        .eq("id", deploymentId)

      await this.logEvent(
        deploymentId,
        null,
        "deployment_completed",
        "info",
        "Deployment completed successfully",
        {},
        advancedBy,
      )

      return { success: true, completed: true }
    }

    // Start next stage
    await supabase
      .from("canary_deployment_stages")
      .update({
        status: "in_progress",
        started_at: new Date().toISOString(),
      })
      .eq("id", nextStage.id)

    await supabase
      .from("canary_deployments")
      .update({
        current_stage: `stage_${nextStage.stage_number}`,
        current_traffic_percentage: nextStage.traffic_percentage,
        last_stage_change_at: new Date().toISOString(),
      })
      .eq("id", deploymentId)

    await this.logEvent(
      deploymentId,
      nextStage.id,
      "stage_advanced",
      "info",
      `Advanced to ${nextStage.stage_name}`,
      {
        previousStage: currentStageData.stage_name,
        newStage: nextStage.stage_name,
      },
      advancedBy,
    )

    return { success: true, nextStage }
  }

  /**
   * Trigger rollback
   */
  static async triggerRollback(deploymentId: string, stageId: string | null, reason: string, triggeredBy: string) {
    const supabase = await createClient()

    const rollbackStarted = new Date().toISOString()

    // Get deployment info
    const { data: deployment } = await supabase.from("canary_deployments").select("*").eq("id", deploymentId).single()

    if (!deployment) throw new Error("Deployment not found")

    // Record rollback
    const { data: rollback } = await supabase
      .from("canary_rollback_history")
      .insert({
        deployment_id: deploymentId,
        rollback_reason: reason,
        rollback_type: triggeredBy === "auto" ? "auto" : "manual",
        triggered_by: triggeredBy,
        stage_at_rollback: deployment.current_stage,
        traffic_percentage_at_rollback: deployment.current_traffic_percentage,
        rollback_started_at: rollbackStarted,
      })
      .select()
      .single()

    // Update deployment
    await supabase
      .from("canary_deployments")
      .update({
        status: "rolled_back",
        current_traffic_percentage: 0,
        rolled_back_at: rollbackStarted,
        rollback_reason: reason,
      })
      .eq("id", deploymentId)

    // Update current stage if exists
    if (stageId) {
      await supabase
        .from("canary_deployment_stages")
        .update({
          status: "failed",
          decision: "rollback",
          decision_reason: reason,
          decided_by: triggeredBy,
          decided_at: rollbackStarted,
        })
        .eq("id", stageId)
    }

    // Log event
    await this.logEvent(
      deploymentId,
      stageId,
      "rollback_triggered",
      "critical",
      `Rollback triggered: ${reason}`,
      {
        rollbackType: triggeredBy === "auto" ? "auto" : "manual",
        trafficPercentage: deployment.current_traffic_percentage,
      },
      triggeredBy,
    )

    // Complete rollback
    const rollbackCompleted = new Date().toISOString()
    const durationMs = new Date(rollbackCompleted).getTime() - new Date(rollbackStarted).getTime()

    await supabase
      .from("canary_rollback_history")
      .update({
        rollback_completed_at: rollbackCompleted,
        rollback_duration_ms: durationMs,
        rollback_status: "completed",
      })
      .eq("id", rollback.id)

    return { success: true, rollback }
  }

  /**
   * Log deployment event
   */
  static async logEvent(
    deploymentId: string,
    stageId: string | null,
    eventType: string,
    severity: "info" | "warning" | "error" | "critical",
    message: string,
    data: any = {},
    triggeredBy = "system",
  ) {
    const supabase = await createClient()

    await supabase.from("canary_deployment_events").insert({
      deployment_id: deploymentId,
      stage_id: stageId,
      event_type: eventType,
      event_severity: severity,
      event_message: message,
      event_data: data,
      triggered_by: triggeredBy,
    })
  }

  /**
   * Get deployment status
   */
  static async getDeploymentStatus(deploymentId: string) {
    const supabase = await createClient()

    const { data: deployment } = await supabase
      .from("canary_active_deployments")
      .select("*")
      .eq("id", deploymentId)
      .single()

    return deployment
  }

  /**
   * Get deployment health
   */
  static async getDeploymentHealth(deploymentId: string) {
    const supabase = await createClient()

    const { data: health } = await supabase
      .from("canary_deployment_health")
      .select("*")
      .eq("deployment_id", deploymentId)
      .single()

    return health
  }
}
