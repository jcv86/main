import { createClient } from "@/lib/supabase/server"

export interface RetentionPolicy {
  id: string
  data_type: string
  table_name: string
  retention_days: number
  retention_category: string
  date_column: string
  auto_cleanup_enabled: boolean
  archive_before_delete: boolean
  last_cleanup_at: string | null
  next_cleanup_at: string | null
}

export interface CleanupResult {
  policy_id: string
  data_type: string
  records_identified: number
  records_archived: number
  records_deleted: number
  records_failed: number
  status: "completed" | "failed" | "partial"
  error_message?: string
}

export class DataRetentionManager {
  /**
   * Obtiene todas las políticas de retención
   */
  static async getPolicies(): Promise<RetentionPolicy[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("data_retention_policies")
      .select("*")
      .order("retention_category", { ascending: true })
      .order("data_type", { ascending: true })

    if (error) throw error
    return data || []
  }

  /**
   * Obtiene políticas que necesitan limpieza
   */
  static async getPoliciesNeedingCleanup(): Promise<any[]> {
    const supabase = await createClient()

    const { data, error } = await supabase.from("policies_needing_cleanup").select("*")

    if (error) throw error
    return data || []
  }

  /**
   * Obtiene resumen de retención
   */
  static async getRetentionSummary(): Promise<any[]> {
    const supabase = await createClient()

    const { data, error } = await supabase.from("retention_summary").select("*")

    if (error) throw error
    return data || []
  }

  /**
   * Obtiene historial de limpieza
   */
  static async getCleanupHistory(limit = 50): Promise<any[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from("data_cleanup_history")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit)

    if (error) throw error
    return data || []
  }

  /**
   * Ejecuta limpieza para una política específica
   */
  static async executeCleanup(policyId: string, dryRun = false): Promise<CleanupResult> {
    const supabase = await createClient()

    // Obtener la política
    const { data: policy, error: policyError } = await supabase
      .from("data_retention_policies")
      .select("*")
      .eq("id", policyId)
      .single()

    if (policyError || !policy) {
      throw new Error("Policy not found")
    }

    const startTime = Date.now()
    const cleanupId = crypto.randomUUID()

    try {
      // Crear registro de limpieza
      const { error: historyError } = await supabase.from("data_cleanup_history").insert({
        id: cleanupId,
        policy_id: policyId,
        data_type: policy.data_type,
        table_name: policy.table_name,
        cleanup_type: "manual",
        started_at: new Date().toISOString(),
        status: "running",
        executed_by: "system",
      })

      if (historyError) throw historyError

      // Calcular fecha de corte
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - policy.retention_days)

      // Identificar registros a eliminar
      const { count: recordsToDelete, error: countError } = await supabase
        .from(policy.table_name)
        .select("*", { count: "exact", head: true })
        .lt(policy.date_column, cutoffDate.toISOString())

      if (countError) throw countError

      let recordsArchived = 0
      let recordsDeleted = 0
      let recordsFailed = 0

      if (!dryRun && recordsToDelete && recordsToDelete > 0) {
        // Si se debe archivar primero
        if (policy.archive_before_delete) {
          // Obtener registros a archivar
          const { data: recordsToArchive, error: fetchError } = await supabase
            .from(policy.table_name)
            .select("*")
            .lt(policy.date_column, cutoffDate.toISOString())
            .limit(1000) // Procesar en lotes

          if (fetchError) throw fetchError

          if (recordsToArchive && recordsToArchive.length > 0) {
            // Archivar registros
            const archivePromises = recordsToArchive.map((record) =>
              supabase.from("archived_data_metadata").insert({
                original_table: policy.table_name,
                original_id: record.id?.toString() || "unknown",
                data_type: policy.data_type,
                data_snapshot: record,
                retention_until: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 año más
                user_id: record.user_id || record.user_email || null,
              }),
            )

            const archiveResults = await Promise.allSettled(archivePromises)
            recordsArchived = archiveResults.filter((r) => r.status === "fulfilled").length
            recordsFailed = archiveResults.filter((r) => r.status === "rejected").length
          }
        }

        // Eliminar registros
        const { error: deleteError } = await supabase
          .from(policy.table_name)
          .delete()
          .lt(policy.date_column, cutoffDate.toISOString())

        if (deleteError) {
          recordsFailed += recordsToDelete || 0
        } else {
          recordsDeleted = (recordsToDelete || 0) - recordsFailed
        }
      }

      const duration = Date.now() - startTime

      // Actualizar registro de limpieza
      await supabase
        .from("data_cleanup_history")
        .update({
          records_identified: recordsToDelete || 0,
          records_archived: recordsArchived,
          records_deleted: recordsDeleted,
          records_failed: recordsFailed,
          completed_at: new Date().toISOString(),
          duration_ms: duration,
          status: recordsFailed > 0 ? "partial" : "completed",
          execution_summary: {
            dry_run: dryRun,
            cutoff_date: cutoffDate.toISOString(),
            retention_days: policy.retention_days,
          },
        })
        .eq("id", cleanupId)

      // Actualizar política
      if (!dryRun) {
        await supabase
          .from("data_retention_policies")
          .update({
            last_cleanup_at: new Date().toISOString(),
          })
          .eq("id", policyId)
      }

      return {
        policy_id: policyId,
        data_type: policy.data_type,
        records_identified: recordsToDelete || 0,
        records_archived: recordsArchived,
        records_deleted: recordsDeleted,
        records_failed: recordsFailed,
        status: recordsFailed > 0 ? "partial" : "completed",
      }
    } catch (error: any) {
      // Registrar error
      await supabase
        .from("data_cleanup_history")
        .update({
          completed_at: new Date().toISOString(),
          duration_ms: Date.now() - startTime,
          status: "failed",
          error_message: error.message,
        })
        .eq("id", cleanupId)

      throw error
    }
  }

  /**
   * Actualiza una política de retención
   */
  static async updatePolicy(policyId: string, updates: Partial<RetentionPolicy>): Promise<void> {
    const supabase = await createClient()

    const { error } = await supabase
      .from("data_retention_policies")
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq("id", policyId)

    if (error) throw error
  }

  /**
   * Obtiene estadísticas de datos archivados
   */
  static async getArchivedDataStats(): Promise<any> {
    const supabase = await createClient()

    const { data, error } = await supabase.from("archived_data_metadata").select("original_table, data_type")

    if (error) throw error

    // Agrupar por tipo
    const stats = (data || []).reduce((acc: any, item: any) => {
      const key = item.data_type
      if (!acc[key]) {
        acc[key] = { count: 0, table: item.original_table }
      }
      acc[key].count++
      return acc
    }, {})

    return stats
  }
}
