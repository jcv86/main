import { createClient } from "@/lib/supabase/server"

export interface AutopublishConfig {
  isEnabled: boolean
  minSessionsRequired: number
  minSatisfactionScore: number
  minEngagementScore: number
  minActionCompletionRate: number
  improvementThresholdPercentage: number
  requireManualReview: boolean
  autoRollbackOnDegradation: boolean
  rollbackThresholdPercentage: number
  notifyOnAutopublish: boolean
  notifyEmails: string[]
}

export interface AutopublishCandidate {
  promptVersionId: string
  versionName: string
  coachType: string
  conversationCategory: string
  totalSessions: number
  avgSatisfaction: number
  avgEngagement: number
  actionCompletionRate: number
  currentPublishedId: string
  currentVersionName: string
  satisfactionImprovementPct: number
  engagementImprovementPct: number
  completionImprovementPct: number
  meetsAutopublishCriteria: boolean
}

export interface AutopublishDecision {
  promptVersionId: string
  versionName: string
  coachType: string
  shouldAutopublish: boolean
  reason: string
  metrics: {
    totalSessions: number
    avgSatisfaction: number
    avgEngagement: number
    actionCompletionRate: number
    satisfactionImprovementPct: number
    engagementImprovementPct: number
    completionImprovementPct: number
  }
}

export class AutopublishManager {
  /**
   * Obtiene la configuración actual de autopublicación
   */
  static async getConfig(): Promise<AutopublishConfig | null> {
    const supabase = await createClient()

    const { data, error } = await supabase.from("autopublish_config").select("*").eq("config_name", "default").single()

    if (error || !data) return null

    return {
      isEnabled: data.is_enabled,
      minSessionsRequired: data.min_sessions_required,
      minSatisfactionScore: data.min_satisfaction_score,
      minEngagementScore: data.min_engagement_score,
      minActionCompletionRate: data.min_action_completion_rate,
      improvementThresholdPercentage: data.improvement_threshold_percentage,
      requireManualReview: data.require_manual_review,
      autoRollbackOnDegradation: data.auto_rollback_on_degradation,
      rollbackThresholdPercentage: data.rollback_threshold_percentage,
      notifyOnAutopublish: data.notify_on_autopublish,
      notifyEmails: data.notify_emails || [],
    }
  }

  /**
   * Actualiza la configuración de autopublicación
   */
  static async updateConfig(config: Partial<AutopublishConfig>): Promise<boolean> {
    const supabase = await createClient()

    const updateData: any = {}
    if (config.isEnabled !== undefined) updateData.is_enabled = config.isEnabled
    if (config.minSessionsRequired !== undefined) updateData.min_sessions_required = config.minSessionsRequired
    if (config.minSatisfactionScore !== undefined) updateData.min_satisfaction_score = config.minSatisfactionScore
    if (config.minEngagementScore !== undefined) updateData.min_engagement_score = config.minEngagementScore
    if (config.minActionCompletionRate !== undefined)
      updateData.min_action_completion_rate = config.minActionCompletionRate
    if (config.improvementThresholdPercentage !== undefined)
      updateData.improvement_threshold_percentage = config.improvementThresholdPercentage
    if (config.requireManualReview !== undefined) updateData.require_manual_review = config.requireManualReview
    if (config.autoRollbackOnDegradation !== undefined)
      updateData.auto_rollback_on_degradation = config.autoRollbackOnDegradation
    if (config.rollbackThresholdPercentage !== undefined)
      updateData.rollback_threshold_percentage = config.rollbackThresholdPercentage
    if (config.notifyOnAutopublish !== undefined) updateData.notify_on_autopublish = config.notifyOnAutopublish
    if (config.notifyEmails !== undefined) updateData.notify_emails = config.notifyEmails

    updateData.updated_at = new Date().toISOString()

    const { error } = await supabase.from("autopublish_config").update(updateData).eq("config_name", "default")

    return !error
  }

  /**
   * Obtiene los candidatos a autopublicación
   */
  static async getCandidates(): Promise<AutopublishCandidate[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("autopublish_candidates")
      .select("*")
      .order("meets_autopublish_criteria", { ascending: false })
      .order("satisfaction_improvement_pct", { ascending: false })

    if (error || !data) return []

    return data.map((row: any) => ({
      promptVersionId: row.prompt_version_id,
      versionName: row.version_name,
      coachType: row.coach_type,
      conversationCategory: row.conversation_category,
      totalSessions: row.total_sessions,
      avgSatisfaction: row.avg_satisfaction,
      avgEngagement: row.avg_engagement,
      actionCompletionRate: row.action_completion_rate,
      currentPublishedId: row.current_published_id,
      currentVersionName: row.current_version_name,
      satisfactionImprovementPct: row.satisfaction_improvement_pct,
      engagementImprovementPct: row.engagement_improvement_pct,
      completionImprovementPct: row.completion_improvement_pct,
      meetsAutopublishCriteria: row.meets_autopublish_criteria,
    }))
  }

  /**
   * Evalúa candidatos y retorna decisiones de autopublicación
   */
  static async evaluateCandidates(): Promise<AutopublishDecision[]> {
    const supabase = await createClient()

    const { data, error } = await supabase.rpc("evaluate_autopublish_candidates")

    if (error || !data) return []

    return data.map((row: any) => ({
      promptVersionId: row.prompt_version_id,
      versionName: row.version_name,
      coachType: row.coach_type,
      shouldAutopublish: row.should_autopublish,
      reason: row.reason,
      metrics: row.metrics,
    }))
  }

  /**
   * Publica un prompt (marca como published y desactiva el anterior)
   */
  static async publishPrompt(
    promptVersionId: string,
    approvedBy: string,
    triggeredBy: "system" | "manual" | "scheduled" = "manual",
  ): Promise<{ success: boolean; error?: string }> {
    const supabase = await createClient()

    try {
      // Obtener información del prompt a publicar
      const { data: newPrompt, error: fetchError } = await supabase
        .from("prompt_versions")
        .select("*, prompt_performance(*)")
        .eq("id", promptVersionId)
        .single()

      if (fetchError || !newPrompt) {
        return { success: false, error: "Prompt no encontrado" }
      }

      // Obtener el prompt actualmente publicado
      const { data: currentPrompt } = await supabase
        .from("prompt_versions")
        .select("*, prompt_performance(*)")
        .eq("coach_type", newPrompt.coach_type)
        .eq("conversation_category", newPrompt.conversation_category)
        .eq("is_published", true)
        .eq("is_active", true)
        .single()

      // Desactivar el prompt actual
      if (currentPrompt) {
        await supabase
          .from("prompt_versions")
          .update({ is_published: false, is_active: false })
          .eq("id", currentPrompt.id)
      }

      // Activar y publicar el nuevo prompt
      const { error: publishError } = await supabase
        .from("prompt_versions")
        .update({ is_published: true, is_active: true })
        .eq("id", promptVersionId)

      if (publishError) {
        return { success: false, error: publishError.message }
      }

      // Registrar en el historial
      const historyData = {
        old_prompt_version_id: currentPrompt?.id || null,
        new_prompt_version_id: promptVersionId,
        coach_type: newPrompt.coach_type,
        conversation_category: newPrompt.conversation_category,
        decision_reason: "Publicación manual aprobada",
        old_metrics: currentPrompt?.prompt_performance?.[0] || null,
        new_metrics: newPrompt.prompt_performance?.[0] || null,
        improvement_percentage: currentPrompt
          ? ((newPrompt.prompt_performance?.[0]?.avg_satisfaction -
              currentPrompt.prompt_performance?.[0]?.avg_satisfaction) /
              currentPrompt.prompt_performance?.[0]?.avg_satisfaction) *
            100
          : null,
        status: "published",
        published_at: new Date().toISOString(),
        triggered_by: triggeredBy,
        approved_by: approvedBy,
        approved_at: new Date().toISOString(),
      }

      await supabase.from("autopublish_history").insert(historyData)

      return { success: true }
    } catch (error: any) {
      return { success: false, error: error.message }
    }
  }

  /**
   * Obtiene el historial de autopublicaciones
   */
  static async getHistory(limit = 50): Promise<any[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("autopublish_history")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error || !data) return []

    return data
  }

  /**
   * Monitorea la salud de un prompt publicado
   */
  static async monitorPublishedPrompt(autopublishId: string): Promise<any> {
    const supabase = await createClient()

    // Obtener información de la publicación
    const { data: autopublish } = await supabase
      .from("autopublish_history")
      .select("*")
      .eq("id", autopublishId)
      .single()

    if (!autopublish) return null

    // Obtener métricas actuales del prompt publicado
    const { data: currentMetrics } = await supabase
      .from("prompt_performance")
      .select("*")
      .eq("prompt_version_id", autopublish.new_prompt_version_id)
      .single()

    if (!currentMetrics) return null

    const oldMetrics = autopublish.old_metrics

    // Calcular cambios porcentuales
    const satisfactionChange = oldMetrics
      ? ((currentMetrics.avg_satisfaction - oldMetrics.avg_satisfaction) / oldMetrics.avg_satisfaction) * 100
      : 0
    const engagementChange = oldMetrics
      ? ((currentMetrics.avg_engagement - oldMetrics.avg_engagement) / oldMetrics.avg_engagement) * 100
      : 0
    const completionChange = oldMetrics
      ? ((currentMetrics.action_completion_rate - oldMetrics.action_completion_rate) /
          oldMetrics.action_completion_rate) *
        100
      : 0

    // Determinar estado de salud
    let healthStatus = "healthy"
    const alerts: string[] = []

    if (satisfactionChange < -5) {
      healthStatus = "warning"
      alerts.push(`Satisfacción bajó ${Math.abs(satisfactionChange).toFixed(1)}%`)
    }
    if (satisfactionChange < -10) {
      healthStatus = "critical"
    }
    if (engagementChange < -5) {
      healthStatus = healthStatus === "critical" ? "critical" : "warning"
      alerts.push(`Engagement bajó ${Math.abs(engagementChange).toFixed(1)}%`)
    }

    // Registrar monitoreo
    const monitoringData = {
      autopublish_id: autopublishId,
      monitoring_period: "24h",
      sessions_count: currentMetrics.total_sessions,
      avg_satisfaction: currentMetrics.avg_satisfaction,
      avg_engagement: currentMetrics.avg_engagement,
      action_completion_rate: currentMetrics.action_completion_rate,
      satisfaction_change_percentage: satisfactionChange,
      engagement_change_percentage: engagementChange,
      completion_rate_change_percentage: completionChange,
      health_status: healthStatus,
      alerts_triggered: alerts,
    }

    await supabase.from("autopublish_monitoring").insert(monitoringData)

    return monitoringData
  }
}
