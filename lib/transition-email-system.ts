/**
 * Sistema de Automatización de Emails - Transición de Identidad
 * Dispara emails según eventos en la plataforma
 */

import { sendTransitionEmail } from "./email-templates"

export interface TransitionEmailEvent {
  type:
    | "user_signup"
    | "test_completed"
    | "weekly_checkup"
    | "milestone_achieved"
    | "reflection_invitation"
    | "90_days_milestone"
  userId: string
  userEmail: string
  userName: string
  metadata?: Record<string, any>
}

/**
 * Procesa eventos de transición y dispara emails correspondientes
 */
export async function handleTransitionEmailEvent(event: TransitionEmailEvent) {
  switch (event.type) {
    case "user_signup":
      await sendTransitionEmail(event.userEmail, "welcomeRitual", [event.userName])
      break

    case "test_completed":
      const testName = event.metadata?.testName || "Test"
      const mainScore = event.metadata?.mainScore || "Pendiente"
      await sendTransitionEmail(event.userEmail, "testResultsTransition", [event.userName, testName, mainScore])
      break

    case "weekly_checkup":
      const weekNumber = event.metadata?.weekNumber || 1
      await sendTransitionEmail(event.userEmail, "weeklyCheckup", [event.userName, weekNumber])
      break

    case "milestone_achieved":
      const milestone = event.metadata?.milestone || "un hito importante"
      const nextStep = event.metadata?.nextStep || "continúa en tu transición"
      await sendTransitionEmail(event.userEmail, "milestoneAchieved", [event.userName, milestone, nextStep])
      break

    case "reflection_invitation":
      await sendTransitionEmail(event.userEmail, "reflectionInvitation", [event.userName])
      break

    case "90_days_milestone":
      await sendTransitionEmail(event.userEmail, "celebration90Days", [event.userName])
      break

    default:
      console.warn(`Unknown email event type: ${event.type}`)
  }
}

/**
 * Configuración de triggers automáticos para emails
 * Integra con tu sistema de eventos
 */
export const emailTriggers = {
  // Cuando el usuario se registra
  onUserSignup: (userId: string, email: string, name: string) =>
    handleTransitionEmailEvent({
      type: "user_signup",
      userId,
      userEmail: email,
      userName: name,
    }),

  // Cuando el usuario completa un test
  onTestCompleted: (userId: string, email: string, name: string, testName: string, mainScore: string) =>
    handleTransitionEmailEvent({
      type: "test_completed",
      userId,
      userEmail: email,
      userName: name,
      metadata: { testName, mainScore },
    }),

  // Checkup semanal (debería ejecutarse vía cron job)
  onWeeklyCheckup: (userId: string, email: string, name: string, weekNumber: number) =>
    handleTransitionEmailEvent({
      type: "weekly_checkup",
      userId,
      userEmail: email,
      userName: name,
      metadata: { weekNumber },
    }),

  // Cuando alcanza un hito
  onMilestoneAchieved: (userId: string, email: string, name: string, milestone: string, nextStep: string) =>
    handleTransitionEmailEvent({
      type: "milestone_achieved",
      userId,
      userEmail: email,
      userName: name,
      metadata: { milestone, nextStep },
    }),

  // Invitación de reflexión (puede ser mensual)
  onReflectionInvitation: (userId: string, email: string, name: string) =>
    handleTransitionEmailEvent({
      type: "reflection_invitation",
      userId,
      userEmail: email,
      userName: name,
    }),

  // Hito de 90 días
  on90DaysMilestone: (userId: string, email: string, name: string) =>
    handleTransitionEmailEvent({
      type: "90_days_milestone",
      userId,
      userEmail: email,
      userName: name,
    }),
}

/**
 * Ejemplo de uso en un componente o API route:
 *
 * import { emailTriggers } from '@/lib/transition-email-system'
 *
 * // En tu onboarding completion:
 * await emailTriggers.onUserSignup(userId, userEmail, userName)
 *
 * // En tu test results handler:
 * await emailTriggers.onTestCompleted(userId, userEmail, userName, 'DISC', '75%')
 *
 * // En tu cron job (weekly emails):
 * // Llama a emailTriggers.onWeeklyCheckup para todos los usuarios activos
 *
 */
