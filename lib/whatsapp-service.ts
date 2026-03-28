// Servicio de WhatsApp usando WhatsApp Web (sin necesidad de API)

interface WhatsAppMessage {
  to: string
  message: string
  type: "reminder" | "insight" | "motivation"
}

export class WhatsAppService {
  private static instance: WhatsAppService

  private readonly adminPhones = [
    "+56940946660", // Admin principal
    "+56963160187", // Joaquin
  ]

  private constructor() {}

  static getInstance(): WhatsAppService {
    if (!WhatsAppService.instance) {
      WhatsAppService.instance = new WhatsAppService()
    }
    return WhatsAppService.instance
  }

  generateWhatsAppLink(to: string, message: string): string {
    const phoneNumber = to.replace(/[^0-9]/g, "") // Remover caracteres no numéricos
    const encodedMessage = encodeURIComponent(message)
    return `https://wa.me/${phoneNumber}?text=${encodedMessage}`
  }

  openWhatsApp(to: string, message: string): void {
    const link = this.generateWhatsAppLink(to, message)
    window.open(link, "_blank")
  }

  sendToAdmins(message: string): void {
    this.adminPhones.forEach((phone) => {
      this.openWhatsApp(phone, message)
    })
  }

  sendReminder(activity: any, userPhone: string): boolean {
    try {
      const message =
        `🔔 *Recordatorio de Actividad*\n\n` +
        `📋 *${activity.title}*\n` +
        `📅 ${new Date(activity.start_time).toLocaleString("es-CL", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}\n` +
        `⏱️ Duración: ${this.calculateDuration(activity.start_time, activity.end_time)}\n` +
        `${activity.description ? `\n📝 ${activity.description}\n` : ""}` +
        `\n✨ ¡Prepárate para dar lo mejor de ti!`

      this.openWhatsApp(userPhone, message)
      return true
    } catch (error) {
      console.error("[v0] Error sending WhatsApp reminder:", error)
      return false
    }
  }

  private calculateDuration(start: string, end: string): string {
    const diff = new Date(end).getTime() - new Date(start).getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 0) {
      return `${hours}h ${minutes}min`
    }
    return `${minutes}min`
  }

  sendMotivationalInsight(userPhone: string, context?: any): void {
    const message = this.generateMotivationalMessage()
    this.openWhatsApp(userPhone, message)
  }

  private generateMotivationalMessage(): string {
    const timeOfDay = new Date().getHours()
    let greeting = "¡Buenos días!"

    if (timeOfDay >= 12 && timeOfDay < 18) {
      greeting = "¡Buenas tardes!"
    } else if (timeOfDay >= 18) {
      greeting = "¡Buenas noches!"
    }

    const messages = [
      `${greeting} 💪 Hoy es un gran día para avanzar en tus metas profesionales.`,
      `${greeting} 🎯 Recuerda: cada pequeño paso te acerca a tu objetivo. ¡Sigue adelante!`,
      `${greeting} 🌟 Tu progreso es inspirador. Mantén el enfoque y los resultados llegarán.`,
      `${greeting} 📚 El aprendizaje continuo es la clave del éxito. ¿Qué aprenderás hoy?`,
      `${greeting} 🚀 Tu potencial es ilimitado. ¡Haz que este día cuente!`,
      `${greeting} 💡 Las grandes cosas nunca vienen de zonas de confort. ¡Desafíate hoy!`,
    ]

    return messages[Math.floor(Math.random() * messages.length)]
  }

  sendDailySummary(userPhone: string, activities: any[]): void {
    const today = activities.filter((a) => {
      const activityDate = new Date(a.start_time)
      const todayDate = new Date()
      return activityDate.toDateString() === todayDate.toDateString()
    })

    const message =
      `📅 *Resumen del Día*\n\n` +
      `Tienes ${today.length} actividad${today.length !== 1 ? "es" : ""} programada${today.length !== 1 ? "s" : ""} para hoy:\n\n` +
      today
        .map(
          (a, i) =>
            `${i + 1}. ${a.title}\n   ⏰ ${new Date(a.start_time).toLocaleTimeString("es-CL", { hour: "2-digit", minute: "2-digit" })}`,
        )
        .join("\n\n") +
      `\n\n✨ ¡Que tengas un día productivo!`

    this.openWhatsApp(userPhone, message)
  }
}
