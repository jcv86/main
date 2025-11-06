import { createClient } from "@/lib/supabase/server"

export interface DSARRequest {
  id: string
  user_id?: string
  user_email: string
  request_type: "access" | "deletion" | "portability" | "rectification"
  status: "pending" | "verified" | "processing" | "completed" | "rejected" | "cancelled"
  verification_token?: string
  verified_at?: string
  export_file_url?: string
  export_format?: "json" | "csv" | "pdf"
  deletion_summary?: any
  request_reason?: string
  admin_notes?: string
  created_at: string
  completed_at?: string
}

export class DSARManager {
  // Tables that contain user personal data
  private static readonly USER_DATA_TABLES = [
    // Core user data
    "users",
    "profiles",
    "user_preferences",
    "user_profiles",

    // Assessments and tests
    "test_results",
    "personality_assessments",
    "disc_results",
    "personality_results",
    "personality_tests",
    "skill_assessments",
    "skills_assessments",
    "interview_sessions",
    "interview_simulations",

    // Career data
    "cv_data",
    "cv_records",
    "user_cvs",
    "generated_cvs",
    "user_experience",
    "user_education",
    "user_skills",
    "user_certifications",
    "user_awards",
    "user_projects",
    "user_languages",
    "user_research",
    "career_goals",
    "job_recommendations",
    "job_applications",

    // Learning and reading
    "user_book_progress",
    "user_reading_progress",
    "user_reading_sessions",
    "user_book_notes",
    "user_book_highlights",
    "user_book_quotes",
    "user_book_bookmarks",
    "user_reading_stats",
    "reading_sessions",
    "reading_goals",
    "reading_achievements",
    "library_insights",
    "user_learning_path_progress",
    "spaced_repetition_items",

    // AI and coaching
    "ai_interactions",
    "ai_conversations",
    "ai_insights",
    "ai_coaching_sessions",
    "ai_interpretations",
    "coaching_sessions",
    "coaching_conversations",
    "coaching_metrics",
    "coaching_insights",
    "coach_conversations",
    "brain_conversations",
    "brain_queries",
    "brain_feedback",

    // Activities and progress
    "user_activities",
    "user_achievements",
    "user_progress",
    "user_goals",
    "achievements",
    "assessment_results",

    // Notifications and communications
    "notifications",
    "email_insights_history",
    "whatsapp_config",
    "activity_reminders",

    // Documents and content
    "document_conversations",
    "document_messages",
    "saved_insights",
    "user_bookmarks",
    "user_recommendations",

    // Memory and context
    "mirix_memories",
    "mirix_sessions",
    "mirix_access_logs",
    "cerebro_conversation_memory",
    "cerebro_insights",
    "cerebro_predictive_insights",
    "cerebro_user_patterns",

    // Calendar and events
    "calendar_events",

    // Roles and permissions
    "user_roles",
  ]

  static async createRequest(
    userEmail: string,
    requestType: DSARRequest["request_type"],
    requestReason?: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<{ success: boolean; requestId?: string; verificationToken?: string; error?: string }> {
    try {
      const supabase = await createClient()

      // Generate verification token
      const verificationToken = crypto.randomUUID()
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString()

      // Create request
      const { data: request, error: requestError } = await supabase
        .from("dsar_requests")
        .insert({
          user_email: userEmail,
          request_type: requestType,
          status: "pending",
          verification_token: verificationToken,
          verification_code: verificationCode,
          request_reason: requestReason,
          ip_address: ipAddress,
          user_agent: userAgent,
        })
        .select()
        .single()

      if (requestError) throw requestError

      // Log audit
      await supabase.from("dsar_audit_log").insert({
        request_id: request.id,
        action_type: "created",
        performed_by: "user",
        action_details: { request_type: requestType, reason: requestReason },
        ip_address: ipAddress,
        user_agent: userAgent,
      })

      // TODO: Send verification email with code

      return {
        success: true,
        requestId: request.id,
        verificationToken: verificationToken,
      }
    } catch (error: any) {
      console.error("[DSAR] Error creating request:", error)
      return { success: false, error: error.message }
    }
  }

  static async verifyRequest(
    requestId: string,
    verificationCode: string,
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const supabase = await createClient()

      // Check verification code
      const { data: request, error: fetchError } = await supabase
        .from("dsar_requests")
        .select("*")
        .eq("id", requestId)
        .eq("verification_code", verificationCode)
        .single()

      if (fetchError || !request) {
        return { success: false, error: "Invalid verification code" }
      }

      // Update status
      const { error: updateError } = await supabase
        .from("dsar_requests")
        .update({
          status: "verified",
          verified_at: new Date().toISOString(),
        })
        .eq("id", requestId)

      if (updateError) throw updateError

      // Log audit
      await supabase.from("dsar_audit_log").insert({
        request_id: requestId,
        action_type: "verified",
        performed_by: "user",
        action_details: { method: "email_code" },
      })

      return { success: true }
    } catch (error: any) {
      console.error("[DSAR] Error verifying request:", error)
      return { success: false, error: error.message }
    }
  }

  static async collectUserData(
    requestId: string,
    userEmail: string,
  ): Promise<{ success: boolean; data?: any; error?: string }> {
    try {
      const supabase = await createClient()
      const collectedData: any = {}

      // Update status to processing
      await supabase
        .from("dsar_requests")
        .update({
          status: "processing",
          started_processing_at: new Date().toISOString(),
        })
        .eq("id", requestId)

      // Collect data from each table
      for (const tableName of this.USER_DATA_TABLES) {
        try {
          const { data, error } = await supabase.from(tableName).select("*").eq("user_email", userEmail)

          if (!error && data && data.length > 0) {
            collectedData[tableName] = data

            // Record what was collected
            await supabase.from("dsar_data_collected").insert({
              request_id: requestId,
              table_name: tableName,
              record_count: data.length,
              data_snapshot: data,
            })
          }
        } catch (tableError) {
          console.error(`[DSAR] Error collecting from ${tableName}:`, tableError)
          // Continue with other tables
        }
      }

      // Also try with user_id if user exists
      const { data: user } = await supabase.from("users").select("id").eq("email", userEmail).single()

      if (user) {
        for (const tableName of this.USER_DATA_TABLES) {
          try {
            const { data, error } = await supabase.from(tableName).select("*").eq("user_id", user.id)

            if (!error && data && data.length > 0) {
              // Merge with existing data
              if (collectedData[tableName]) {
                collectedData[tableName] = [...collectedData[tableName], ...data]
              } else {
                collectedData[tableName] = data
              }

              await supabase.from("dsar_data_collected").insert({
                request_id: requestId,
                table_name: tableName,
                record_count: data.length,
                data_snapshot: data,
              })
            }
          } catch (tableError) {
            console.error(`[DSAR] Error collecting from ${tableName} by user_id:`, tableError)
          }
        }
      }

      return { success: true, data: collectedData }
    } catch (error: any) {
      console.error("[DSAR] Error collecting user data:", error)
      return { success: false, error: error.message }
    }
  }

  static async deleteUserData(
    requestId: string,
    userEmail: string,
    performedBy: string,
  ): Promise<{ success: boolean; summary?: any; error?: string }> {
    try {
      const supabase = await createClient()
      const deletionSummary: any = {}

      // First collect data for audit
      const { data: collectedData } = await this.collectUserData(requestId, userEmail)

      // Get user_id
      const { data: user } = await supabase.from("users").select("id").eq("email", userEmail).single()

      // Delete from each table
      for (const tableName of this.USER_DATA_TABLES) {
        try {
          // Delete by email
          const { error: emailError, count: emailCount } = await supabase
            .from(tableName)
            .delete()
            .eq("user_email", userEmail)

          if (!emailError && emailCount) {
            deletionSummary[tableName] = (deletionSummary[tableName] || 0) + emailCount
          }

          // Delete by user_id if exists
          if (user) {
            const { error: idError, count: idCount } = await supabase.from(tableName).delete().eq("user_id", user.id)

            if (!idError && idCount) {
              deletionSummary[tableName] = (deletionSummary[tableName] || 0) + idCount
            }
          }
        } catch (tableError) {
          console.error(`[DSAR] Error deleting from ${tableName}:`, tableError)
          deletionSummary[`${tableName}_error`] = tableError
        }
      }

      // Update request
      await supabase
        .from("dsar_requests")
        .update({
          status: "completed",
          deletion_summary: deletionSummary,
          deletion_completed_at: new Date().toISOString(),
          completed_at: new Date().toISOString(),
        })
        .eq("id", requestId)

      // Log audit
      await supabase.from("dsar_audit_log").insert({
        request_id: requestId,
        action_type: "deleted",
        performed_by: performedBy,
        action_details: { summary: deletionSummary },
      })

      return { success: true, summary: deletionSummary }
    } catch (error: any) {
      console.error("[DSAR] Error deleting user data:", error)
      return { success: false, error: error.message }
    }
  }
}
