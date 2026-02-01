'use server'

import { createClient } from "@/lib/supabase/server"

// Notification types and triggers
export async function triggerNotification(
  userId: string,
  type: 'achievement' | 'milestone' | 'recommendation' | 'coaching' | 'alert',
  title: string,
  message: string,
  options?: {
    actionUrl?: string
    milestone?: string
  }
) {
  try {
    const response = await fetch(process.env.NEXT_PUBLIC_APP_URL + '/api/despega/notifications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type,
        userId,
        title,
        message,
        actionUrl: options?.actionUrl,
        milestone: options?.milestone
      })
    })

    if (!response.ok) throw new Error('Failed to create notification')
    return await response.json()
  } catch (error) {
    console.error('Error triggering notification:', error)
    throw error
  }
}

// Specific milestone notifications
export async function notifyA1Completion(userId: string, score: number) {
  return triggerNotification(
    userId,
    'achievement',
    '¡A1 Completado!',
    `Excelente trabajo. Tu diagnóstico de Despega Cerebral: ${score}/100. Listo para A2 Rutas.`,
    {
      actionUrl: '/despega/rutas',
      milestone: 'a1_completed'
    }
  )
}

export async function notifyA3SimulationReady(userId: string) {
  return triggerNotification(
    userId,
    'recommendation',
    'Listo para Simulaciones',
    'Has completado suficiente contenido A2. ¡Ahora es el momento de practicar con A3 Simulaciones!',
    {
      actionUrl: '/despega/rutas?tab=a3',
      milestone: 'a3_available'
    }
  )
}

export async function notifyAchievementUnlock(userId: string, achievementName: string) {
  return triggerNotification(
    userId,
    'achievement',
    'Logro Desbloqueado!',
    `Has ganado el logro: ${achievementName}`,
    {
      actionUrl: '/despega/achievements',
      milestone: 'achievement_unlock'
    }
  )
}

export async function notifySkillGapCritical(
  userId: string,
  skill: string,
  level: number
) {
  return triggerNotification(
    userId,
    'alert',
    `${skill} Necesita Atención`,
    `Tu nivel en ${skill} está en ${level}/5. Recomendamos enfocarte en esta área.`,
    {
      actionUrl: '/despega/a2-recommendations',
      milestone: 'skill_gap_alert'
    }
  )
}

export async function notifyWeeklyCheckIn(userId: string) {
  return triggerNotification(
    userId,
    'coaching',
    'Check-in Semanal',
    '¿Cómo va tu semana en Despega? Continúa con tus misiones y simulaciones.',
    {
      actionUrl: '/despega',
      milestone: 'weekly_checkin'
    }
  )
}

export async function notifyNewContentAvailable(userId: string, contentType: string) {
  return triggerNotification(
    userId,
    'recommendation',
    `Nuevo Contenido: ${contentType}`,
    `Hemos añadido nuevo contenido relevante a tu nivel. Descúbrelo ahora.`,
    {
      actionUrl: '/despega/a4-base',
      milestone: 'new_content'
    }
  )
}

// Batch notification triggers
export async function sendMilestoneNotifications() {
  const supabase = await createClient()

  // Find users who completed A1 but haven't been notified
  const { data: recentCompletions } = await supabase
    .from('despega_a1_results')
    .select('user_id, total_score')
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())
    .not('notification_sent', 'is', true)

  for (const completion of recentCompletions || []) {
    try {
      await notifyA1Completion(completion.user_id, completion.total_score)

      // Mark as notified
      await supabase
        .from('despega_a1_results')
        .update({ notification_sent: true })
        .eq('user_id', completion.user_id)
    } catch (error) {
      console.error(`Failed to send notification to ${completion.user_id}:`, error)
    }
  }
}

// Get notification settings for user
export async function getNotificationSettings(userId: string) {
  const supabase = await createClient()

  try {
    const { data } = await supabase
      .from('despega_notification_settings')
      .select('*')
      .eq('user_id', userId)
      .single()

    return data || {
      email_milestones: true,
      email_recommendations: false,
      in_app_all: true,
      push_notifications: false,
      weekly_summary: true
    }
  } catch (error) {
    console.error('Error fetching notification settings:', error)
    return {}
  }
}

// Update notification settings
export async function updateNotificationSettings(
  userId: string,
  settings: Record<string, boolean>
) {
  const supabase = await createClient()

  try {
    const { error } = await supabase
      .from('despega_notification_settings')
      .upsert({
        user_id: userId,
        ...settings,
        updated_at: new Date().toISOString()
      })

    if (error) throw error
    return { success: true }
  } catch (error) {
    console.error('Error updating notification settings:', error)
    throw error
  }
}
